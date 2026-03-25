import { generateText, isConfigured } from "@/lib/ai/gemini";
import { getDb } from "@/lib/db";
import {
  learnArticles,
  learnArticleLocalizations,
  learnClusters,
  learnClusterLocalizations,
  learnSubclusters,
  learnSubclusterLocalizations,
  learnTags,
  learnTagLocalizations,
  learnArticleTags,
  learnInternalLinks,
  learnContentJobs,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { slugifyTitle } from "@/lib/learn/slug-utils";
import type {
  TopicDefinition,
  ArticleContent,
  GenerationPromptContext,
  BatchJobConfig,
} from "./types";
import { ALL_TOPICS, getTopicBySlug, getRelatedTopics } from "./topics";
import { TAXONOMY } from "./taxonomy";
import { buildGenerationPrompt, parseArticleContent, articleContentToMarkdown } from "./templates";
import { evaluateArticleQuality } from "./quality";
import { suggestInternalLinks } from "./internal-links";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

/**
 * Seeds the taxonomy (clusters, subclusters) into the database.
 */
export async function seedTaxonomy(): Promise<{ clusters: number; subclusters: number }> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  let clusterCount = 0;
  let subclusterCount = 0;

  for (const cluster of TAXONOMY) {
    const existing = await db
      .select({ id: learnClusters.id })
      .from(learnClusters)
      .where(eq(learnClusters.slug, cluster.slug))
      .limit(1);

    let clusterId: number;
    if (existing.length > 0) {
      clusterId = existing[0].id;
    } else {
      const [row] = await db
        .insert(learnClusters)
        .values({
          slug: cluster.slug,
          position: cluster.position,
        })
        .returning({ id: learnClusters.id });
      clusterId = row.id;
      clusterCount++;
    }

    // Upsert English localization
    const existingLoc = await db
      .select({ id: learnClusterLocalizations.id })
      .from(learnClusterLocalizations)
      .where(
        and(
          eq(learnClusterLocalizations.clusterId, clusterId),
          eq(learnClusterLocalizations.locale, "en")
        )
      )
      .limit(1);

    if (existingLoc.length === 0) {
      await db.insert(learnClusterLocalizations).values({
        clusterId,
        locale: "en",
        name: cluster.nameEn,
        description: cluster.descriptionEn,
        seoTitle: `${cluster.nameEn} — Learn | Metalorix`,
        metaDescription: cluster.descriptionEn.slice(0, 155),
      });
    }

    for (const sub of cluster.subclusters) {
      const existingSub = await db
        .select({ id: learnSubclusters.id })
        .from(learnSubclusters)
        .where(eq(learnSubclusters.slug, sub.slug))
        .limit(1);

      let subId: number;
      if (existingSub.length > 0) {
        subId = existingSub[0].id;
      } else {
        const [row] = await db
          .insert(learnSubclusters)
          .values({
            clusterId,
            slug: sub.slug,
            position: sub.position,
          })
          .returning({ id: learnSubclusters.id });
        subId = row.id;
        subclusterCount++;
      }

      const existingSubLoc = await db
        .select({ id: learnSubclusterLocalizations.id })
        .from(learnSubclusterLocalizations)
        .where(
          and(
            eq(learnSubclusterLocalizations.subclusterId, subId),
            eq(learnSubclusterLocalizations.locale, "en")
          )
        )
        .limit(1);

      if (existingSubLoc.length === 0) {
        await db.insert(learnSubclusterLocalizations).values({
          subclusterId: subId,
          locale: "en",
          name: sub.nameEn,
          description: sub.descriptionEn,
          seoTitle: `${sub.nameEn} — Learn | Metalorix`,
          metaDescription: sub.descriptionEn.slice(0, 155),
        });
      }
    }
  }

  return { clusters: clusterCount, subclusters: subclusterCount };
}

/**
 * Seeds tags from all topic definitions.
 */
export async function seedTags(): Promise<number> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  const allTagsSet = new Set<string>();
  for (const topic of ALL_TOPICS) {
    for (const tag of topic.tags) allTagsSet.add(tag);
  }
  const allTags = Array.from(allTagsSet);

  let count = 0;
  for (const tagSlug of allTags) {
    const existing = await db
      .select({ id: learnTags.id })
      .from(learnTags)
      .where(eq(learnTags.slug, tagSlug))
      .limit(1);

    if (existing.length === 0) {
      const [row] = await db
        .insert(learnTags)
        .values({ slug: tagSlug })
        .returning({ id: learnTags.id });

      await db.insert(learnTagLocalizations).values({
        tagId: row.id,
        locale: "en",
        name: tagSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      });
      count++;
    }
  }

  return count;
}

/**
 * Generates a single article from a topic definition.
 */
export async function generateArticle(
  slug: string
): Promise<{
  success: boolean;
  qualityScore?: number;
  error?: string;
}> {
  if (!isConfigured()) return { success: false, error: "Gemini API not configured" };

  const topic = getTopicBySlug(slug);
  if (!topic) return { success: false, error: `Topic not found: ${slug}` };

  const db = getDb();
  if (!db) return { success: false, error: "Database not available" };

  // Build generation context
  const cluster = TAXONOMY.find((c) => c.slug === topic.clusterSlug);
  const subcluster = cluster?.subclusters.find(
    (s) => s.slug === topic.subclusterSlug
  );

  const related = getRelatedTopics(slug);
  const glossaryTerms = topic.glossaryTermSlugs || [];

  const ctx: GenerationPromptContext = {
    topic,
    clusterName: cluster?.nameEn || topic.clusterSlug,
    subclusterName: subcluster?.nameEn || topic.subclusterSlug,
    relatedTopicTitles: related.map((r) => r.titleEn),
    glossaryTerms,
    locale: "en",
  };

  const prompt = buildGenerationPrompt(ctx);
  const raw = await generateText(prompt);
  if (!raw) return { success: false, error: "AI generation returned empty" };

  const content = parseArticleContent(raw);
  if (!content) return { success: false, error: "Failed to parse AI response" };

  // Quality check
  const quality = evaluateArticleQuality(content, topic);

  // Get or create cluster/subcluster IDs
  const clusterRow = await db
    .select({ id: learnClusters.id })
    .from(learnClusters)
    .where(eq(learnClusters.slug, topic.clusterSlug))
    .limit(1);

  if (clusterRow.length === 0) {
    return { success: false, error: `Cluster not found in DB: ${topic.clusterSlug}. Run seedTaxonomy first.` };
  }

  const subclusterRow = await db
    .select({ id: learnSubclusters.id })
    .from(learnSubclusters)
    .where(eq(learnSubclusters.slug, topic.subclusterSlug))
    .limit(1);

  // Upsert article
  const existingArticle = await db
    .select({ id: learnArticles.id })
    .from(learnArticles)
    .where(eq(learnArticles.slug, slug))
    .limit(1);

  let articleId: number;
  const markdownContent = articleContentToMarkdown(content);

  if (existingArticle.length > 0) {
    articleId = existingArticle[0].id;
    await db
      .update(learnArticles)
      .set({
        qualityScore: quality.score,
        status: quality.score >= 60 ? "review" : "draft",
        updatedAt: new Date(),
      })
      .where(eq(learnArticles.id, articleId));
  } else {
    const [row] = await db
      .insert(learnArticles)
      .values({
        slug,
        clusterId: clusterRow[0].id,
        subclusterId: subclusterRow[0]?.id,
        difficulty: topic.difficulty,
        articleType: topic.articleType,
        isPillar: topic.isPillar || false,
        metals: topic.metals || [],
        position: topic.priority,
        status: quality.score >= 60 ? "review" : "draft",
        qualityScore: quality.score,
      })
      .returning({ id: learnArticles.id });
    articleId = row.id;
  }

  // Upsert English localization
  const existingLoc = await db
    .select({ id: learnArticleLocalizations.id })
    .from(learnArticleLocalizations)
    .where(
      and(
        eq(learnArticleLocalizations.articleId, articleId),
        eq(learnArticleLocalizations.locale, "en")
      )
    )
    .limit(1);

  const locData = {
    slug: slugifyTitle(content.title),
    title: content.title,
    seoTitle: content.seoTitle,
    metaDescription: content.metaDescription,
    summary: content.summary,
    keyIdea: content.keyIdea,
    content: markdownContent,
    keyTakeaways: JSON.stringify(content.keyTakeaways),
    faq: content.faq ? JSON.stringify(content.faq) : null,
    translationStatus: "done" as const,
    translatedAt: new Date(),
    updatedAt: new Date(),
  };

  if (existingLoc.length > 0) {
    await db
      .update(learnArticleLocalizations)
      .set(locData)
      .where(eq(learnArticleLocalizations.id, existingLoc[0].id));
  } else {
    await db.insert(learnArticleLocalizations).values({
      articleId,
      locale: "en",
      ...locData,
    });
  }

  // Save tags
  for (const tagSlug of topic.tags) {
    const tagRow = await db
      .select({ id: learnTags.id })
      .from(learnTags)
      .where(eq(learnTags.slug, tagSlug))
      .limit(1);

    if (tagRow.length > 0) {
      try {
        await db
          .insert(learnArticleTags)
          .values({ articleId, tagId: tagRow[0].id });
      } catch {
        // ignore duplicate
      }
    }
  }

  // Save internal links
  const linkSuggestions = suggestInternalLinks(slug, 6);
  for (const link of linkSuggestions) {
    const targetRow = await db
      .select({ id: learnArticles.id })
      .from(learnArticles)
      .where(eq(learnArticles.slug, link.targetSlug))
      .limit(1);

    if (targetRow.length > 0) {
      try {
        await db.insert(learnInternalLinks).values({
          sourceArticleId: articleId,
          targetArticleId: targetRow[0].id,
          linkType: link.linkType,
          relevanceScore: link.relevanceScore,
          anchor: link.suggestedAnchor,
        });
      } catch {
        // ignore duplicate
      }
    }
  }

  return { success: true, qualityScore: quality.score };
}

/**
 * Generates articles in batch with rate limiting.
 */
export async function generateBatch(
  config: BatchJobConfig
): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
  results: { slug: string; success: boolean; score?: number; error?: string }[];
}> {
  const db = getDb();

  let topics: TopicDefinition[];

  if (config.slugs?.length) {
    topics = config.slugs
      .map((s) => getTopicBySlug(s))
      .filter(Boolean) as TopicDefinition[];
  } else if (config.clusterSlug) {
    topics = ALL_TOPICS.filter(
      (t) =>
        t.clusterSlug === config.clusterSlug &&
        (!config.difficulty || t.difficulty === config.difficulty)
    );
  } else {
    topics = ALL_TOPICS;
  }

  // Filter to only topics without content (for cron efficiency)
  if (config.onlyMissing && db) {
    const existingRows = await db
      .select({ slug: learnArticles.slug })
      .from(learnArticles)
      .innerJoin(
        learnArticleLocalizations,
        eq(learnArticleLocalizations.articleId, learnArticles.id)
      )
      .where(eq(learnArticleLocalizations.locale, "en"));
    const existingSet = new Set(existingRows.map((r) => r.slug));
    topics = topics.filter((t) => !existingSet.has(t.slug));
  }

  // Sort by priority
  topics.sort((a, b) => a.priority - b.priority);

  // Apply limit (for cron: process N per run)
  if (config.limit && config.limit > 0) {
    topics = topics.slice(0, config.limit);
  }

  // Create job record
  let jobId: number | undefined;
  if (db) {
    const [job] = await db
      .insert(learnContentJobs)
      .values({
        jobType: "generate",
        status: "running",
        batchId: config.batchId,
        articlesTotal: topics.length,
        startedAt: new Date(),
      })
      .returning({ id: learnContentJobs.id });
    jobId = job.id;
  }

  const results: {
    slug: string;
    success: boolean;
    score?: number;
    error?: string;
  }[] = [];
  let succeeded = 0;
  let failed = 0;

  for (const topic of topics) {
    if (config.dryRun) {
      results.push({ slug: topic.slug, success: true, score: 0 });
      succeeded++;
      continue;
    }

    const result = await generateArticle(topic.slug);
    results.push({
      slug: topic.slug,
      success: result.success,
      score: result.qualityScore,
      error: result.error,
    });

    if (result.success) succeeded++;
    else failed++;

    // Update job progress
    if (db && jobId) {
      await db
        .update(learnContentJobs)
        .set({ articlesProcessed: succeeded + failed })
        .where(eq(learnContentJobs.id, jobId));
    }

    // Rate limiting: 2 seconds between API calls
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Complete job
  if (db && jobId) {
    await db
      .update(learnContentJobs)
      .set({
        status: failed === 0 ? "done" : "done",
        articlesProcessed: succeeded + failed,
        completedAt: new Date(),
        errorLog: failed > 0
          ? JSON.stringify(results.filter((r) => !r.success))
          : null,
      })
      .where(eq(learnContentJobs.id, jobId));
  }

  return { processed: succeeded + failed, succeeded, failed, results };
}

/**
 * Generates a translation for an existing article.
 */
export async function translateArticle(
  slug: string,
  targetLocale: string
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) return { success: false, error: "Gemini API not configured" };
  if (targetLocale === "en") return { success: false, error: "Cannot translate to English (base locale)" };

  const db = getDb();
  if (!db) return { success: false, error: "Database not available" };

  // Get the English version
  const articleRow = await db
    .select({ id: learnArticles.id })
    .from(learnArticles)
    .where(eq(learnArticles.slug, slug))
    .limit(1);

  if (articleRow.length === 0) {
    return { success: false, error: `Article not found: ${slug}` };
  }

  const articleId = articleRow[0].id;
  const englishLoc = await db
    .select()
    .from(learnArticleLocalizations)
    .where(
      and(
        eq(learnArticleLocalizations.articleId, articleId),
        eq(learnArticleLocalizations.locale, "en")
      )
    )
    .limit(1);

  if (englishLoc.length === 0) {
    return { success: false, error: "English version not found" };
  }

  const en = englishLoc[0];

  const localeNames: Record<string, string> = {
    es: "Spanish",
    zh: "Simplified Chinese",
    ar: "Arabic",
    tr: "Turkish",
    de: "German",
    hi: "Hindi",
  };

  const localeName = localeNames[targetLocale] || targetLocale;

  const culturalAdaptation: Record<string, string> = {
    es: "- Use natural Latin American/Spanish financial terminology\n- Reference both EUR and USD where relevant",
    zh: "- Prefer CNY examples alongside USD where relevant\n- Reference Shanghai Gold Exchange (SGE), PBoC, and Chinese gold demand where appropriate\n- Use Simplified Chinese conventions",
    ar: "- Consider AED/SAR for Gulf readers alongside USD\n- Reference Middle Eastern gold markets and demand where appropriate\n- Use Modern Standard Arabic",
    tr: "- Consider TRY examples alongside USD where relevant\n- Reference Turkish gold culture, CBRT, and Istanbul gold market where appropriate",
    de: "- Use standard German financial terminology\n- Reference both EUR and USD where relevant",
    hi: "- Prefer INR examples alongside USD where relevant\n- Reference Indian gold culture, RBI, and domestic demand (jewelry, weddings) where appropriate\n- Use Devanagari script for Hindi terms when culturally fitting; otherwise Roman script is acceptable",
  };

  const adaptationRules = culturalAdaptation[targetLocale] || "";

  let faqSection = "";
  let faqSchemaNote = "";
  if (en.faq) {
    try {
      const faqItems = JSON.parse(en.faq);
      if (Array.isArray(faqItems) && faqItems.length > 0) {
        faqSection = `\n\nFAQ (translate questions and answers):\n${JSON.stringify(faqItems)}`;
        faqSchemaNote = `,\n  "faq": [{"question": "translated Q", "answer": "translated A"}, ...]`;
      }
    } catch { /* ignore malformed faq */ }
  }

  const prompt = `Translate this educational article about precious metals to ${localeName}.

RULES:
- Maintain the same structure (## headings, paragraphs, lists)
- Keep technical terms that are universally recognized (ETF, LBMA, COMEX, DCA, etc.)
- Adapt units and examples for the target locale when culturally appropriate
- Maintain professional, educational tone
- Do NOT add or remove information
- Do NOT translate brand names (Metalorix, SPDR Gold Shares, etc.)
- Translate naturally, not literally

CULTURAL ADAPTATION FOR ${localeName.toUpperCase()}:
${adaptationRules}

Return a JSON object:
{
  "title": "translated title",
  "seoTitle": "translated SEO title",
  "metaDescription": "translated meta description",
  "summary": "translated summary",
  "keyIdea": "translated key idea",
  "content": "translated full content (markdown format)"${faqSchemaNote}
}

ENGLISH ORIGINAL:
Title: ${en.title}
SEO Title: ${en.seoTitle}
Meta Description: ${en.metaDescription}
Summary: ${en.summary}
Key Idea: ${en.keyIdea}

Content:
${en.content}${faqSection}

Return ONLY the JSON. No markdown blocks.`;

  const raw = await generateText(prompt);
  if (!raw) return { success: false, error: "AI translation returned empty" };

  try {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    const translated = JSON.parse(jsonStr);

    if (!translated.title || !translated.content) {
      return { success: false, error: "Incomplete translation" };
    }

    // Upsert localization
    const existingLoc = await db
      .select({ id: learnArticleLocalizations.id })
      .from(learnArticleLocalizations)
      .where(
        and(
          eq(learnArticleLocalizations.articleId, articleId),
          eq(learnArticleLocalizations.locale, targetLocale)
        )
      )
      .limit(1);

    let translatedFaq = en.faq;
    if (translated.faq && Array.isArray(translated.faq) && translated.faq.length > 0) {
      translatedFaq = JSON.stringify(translated.faq);
    }

    const locData = {
      slug: slugifyTitle(translated.title),
      title: translated.title,
      seoTitle: translated.seoTitle || translated.title,
      metaDescription:
        translated.metaDescription || translated.summary?.slice(0, 155) || "",
      summary: translated.summary || "",
      keyIdea: translated.keyIdea || "",
      content: translated.content,
      keyTakeaways: en.keyTakeaways,
      faq: translatedFaq,
      translationStatus: "done" as const,
      translatedAt: new Date(),
      updatedAt: new Date(),
    };

    if (existingLoc.length > 0) {
      await db
        .update(learnArticleLocalizations)
        .set(locData)
        .where(eq(learnArticleLocalizations.id, existingLoc[0].id));
    } else {
      await db.insert(learnArticleLocalizations).values({
        articleId,
        locale: targetLocale,
        ...locData,
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to parse translation" };
  }
}
