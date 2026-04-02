import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  learnArticles,
  learnArticleLocalizations,
  learnClusters,
  glossaryTerms,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET?.trim();
const MIN_SLUG_LENGTH = 5;

const LANG_NAMES: Record<string, string> = {
  zh: "Simplified Chinese (use pinyin, not characters)",
  ar: "Arabic (use romanized keywords, not Arabic script)",
  hi: "Hindi (use romanized keywords, not Devanagari)",
  tr: "Turkish",
  de: "German",
  es: "Spanish",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "No DB" }, { status: 500 });
  }

  const dryRun = req.nextUrl.searchParams.get("dry") === "1";
  let fixedLearn = 0;
  let fixedGlossary = 0;
  const details: string[] = [];

  try {
    const shortSlugs = await db
      .select({
        locId: learnArticleLocalizations.id,
        articleId: learnArticleLocalizations.articleId,
        locale: learnArticleLocalizations.locale,
        slug: learnArticleLocalizations.slug,
        title: learnArticleLocalizations.title,
        baseSlug: learnArticles.slug,
        clusterSlug: learnClusters.slug,
      })
      .from(learnArticleLocalizations)
      .innerJoin(learnArticles, eq(learnArticles.id, learnArticleLocalizations.articleId))
      .innerJoin(learnClusters, eq(learnClusters.id, learnArticles.clusterId))
      .where(sql`length(${learnArticleLocalizations.slug}) < ${MIN_SLUG_LENGTH}`);

    details.push(`Found ${shortSlugs.length} learn localizations with slug < ${MIN_SLUG_LENGTH} chars`);

    for (const row of shortSlugs) {
      const langName = LANG_NAMES[row.locale] ?? row.locale;
      const prompt = `Given this ${langName} article title about precious metals, generate 4-8 keywords for a URL slug.
Title: "${row.title}"
Base English slug: "${row.baseSlug}"

Requirements:
- Keywords MUST be romanized (Latin alphabet only, no Chinese/Arabic/Hindi characters)
- Use lowercase, separate with spaces
- 4-8 descriptive keywords that capture the article topic
- Include the main metal (gold/silver/platinum etc.) if relevant
- NO dates, NO accents, NO special characters

Return ONLY valid JSON: {"slug_keywords": "keyword1 keyword2 keyword3 keyword4"}`;

      try {
        const raw = await generateText(prompt);
        if (!raw) {
          details.push(`[SKIP] ${row.locale}/${row.slug}: Gemini returned empty`);
          continue;
        }

        const m = raw.match(/\{\s*"slug_keywords"\s*:\s*"([^"]+)"\s*\}/);
        const keywords = m?.[1]?.trim();
        if (!keywords) {
          details.push(`[SKIP] ${row.locale}/${row.slug}: Could not parse keywords from: ${raw.slice(0, 100)}`);
          continue;
        }

        const newSlug = slugify(keywords);
        if (!newSlug || newSlug.length < MIN_SLUG_LENGTH) {
          const fallback = row.baseSlug;
          details.push(`[FALLBACK] ${row.locale}/${row.slug} → ${fallback} (AI slug "${newSlug}" still too short)`);
          if (!dryRun) {
            await db
              .update(learnArticleLocalizations)
              .set({ slug: fallback })
              .where(eq(learnArticleLocalizations.id, row.locId));
          }
          fixedLearn++;
          continue;
        }

        details.push(`[FIX] ${row.locale}/${row.slug} → ${newSlug}`);
        if (!dryRun) {
          await db
            .update(learnArticleLocalizations)
            .set({ slug: newSlug })
            .where(eq(learnArticleLocalizations.id, row.locId));
        }
        fixedLearn++;
      } catch (err) {
        details.push(`[ERROR] ${row.locale}/${row.slug}: ${String(err).slice(0, 100)}`);
      }
    }

    const shortGlossary = await db
      .select({
        id: glossaryTerms.id,
        slug: glossaryTerms.slug,
        term: glossaryTerms.term,
        locale: glossaryTerms.locale,
      })
      .from(glossaryTerms)
      .where(sql`length(${glossaryTerms.slug}) < ${MIN_SLUG_LENGTH}`);

    details.push(`Found ${shortGlossary.length} glossary terms with slug < ${MIN_SLUG_LENGTH} chars`);

    for (const row of shortGlossary) {
      const langName = LANG_NAMES[row.locale] ?? row.locale;
      const prompt = `Given this ${langName} glossary term about precious metals, generate 2-4 keywords for a URL slug.
Term: "${row.term}"

Requirements:
- Keywords MUST be romanized (Latin alphabet only)
- Use lowercase, separate with spaces

Return ONLY valid JSON: {"slug_keywords": "keyword1 keyword2"}`;

      try {
        const raw = await generateText(prompt);
        if (!raw) continue;

        const m = raw.match(/\{\s*"slug_keywords"\s*:\s*"([^"]+)"\s*\}/);
        const keywords = m?.[1]?.trim();
        if (!keywords) continue;

        const newSlug = slugify(keywords);
        if (!newSlug || newSlug.length < MIN_SLUG_LENGTH) continue;

        details.push(`[FIX-GLOSSARY] ${row.locale}/${row.slug} → ${newSlug}`);
        if (!dryRun) {
          await db
            .update(glossaryTerms)
            .set({ slug: newSlug })
            .where(eq(glossaryTerms.id, row.id));
        }
        fixedGlossary++;
      } catch (err) {
        details.push(`[ERROR-GLOSSARY] ${row.locale}/${row.slug}: ${String(err).slice(0, 100)}`);
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: String(err), details },
      { status: 500 }
    );
  }

  return NextResponse.json({
    dryRun,
    fixedLearn,
    fixedGlossary,
    details,
  });
}
