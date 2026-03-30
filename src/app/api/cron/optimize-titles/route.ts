import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, articleTranslations, learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and, or, desc, isNotNull } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";
import { pingIndexNow } from "@/lib/seo/ping";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { getLocalizedClusterSlug } from "@/lib/learn/slug-i18n";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET?.trim();
const BASE = "https://metalorix.com";

// Titles that signal generic, low-quality SEO (case-insensitive match)
const GENERIC_TITLE_PATTERNS = [
  "resumen del mercado",
  "análisis semanal",
  "análisis de mercado",
  "noticias de metales",
  "mercado de metales",
  "actualización del mercado",
  "informe semanal",
  "weekly summary",
  "market summary",
  "market update",
  "precious metals news",
  "metals market",
  "daily summary",
  "resumen diario",
];

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
  hi: "Hindi",
};

function needsOptimization(title: string): boolean {
  if (!title) return true;
  const lower = title.toLowerCase();
  if (GENERIC_TITLE_PATTERNS.some((p) => lower.includes(p))) return true;
  if (title.length < 35 || title.length > 70) return true;
  return false;
}

// For learn articles: detect weak seoTitles that are just the plain title
function needsLearnOptimization(title: string, seoTitle: string | null): boolean {
  if (!seoTitle) return true;
  // Same as plain title (not specifically crafted for CTR)
  if (seoTitle.trim() === title.trim()) return true;
  // Too short to be CTR-optimized
  if (seoTitle.length < 30) return true;
  // Starts with weak patterns
  const lower = seoTitle.toLowerCase();
  const weakStarters = ["introduction to", "overview of", "understanding", "guide to", "what is"];
  if (weakStarters.some((p) => lower.startsWith(p))) return true;
  return false;
}

async function optimizeTitleWithGemini(
  title: string,
  excerpt: string,
  content: string,
  locale: string
): Promise<{ titulo_seo: string; meta_descripcion: string } | null> {
  const lang = locale === "es" ? "Spanish" : (LANGUAGE_NAMES[locale] || "English");
  const contentSnippet = (content || excerpt || "").slice(0, 800);

  const prompt = `You are an expert SEO content editor. Rewrite the title and meta description for this precious metals news article to maximize click-through rate on Google.

Current title: "${title}"
Article excerpt: "${contentSnippet}"

Rules:
- Title: 50-65 characters, in ${lang}. Must include the main cause/event + outcome (e.g. "Gold Surges Past $3200 as Middle East Tensions Escalate"). Include specific prices, percentages, or events when available. Never use generic titles like "Market Summary" or "Weekly Analysis".
- Meta description: 140-155 characters, in ${lang}. Include concrete data (price, % change), the key driver, and end with a hook that invites clicking.
- Output ONLY valid JSON with keys "titulo_seo" and "meta_descripcion". No extra text.

JSON:`;

  const raw = await generateText(prompt, { retryOnEmpty: false });
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.titulo_seo === "string" && typeof parsed.meta_descripcion === "string") {
      return {
        titulo_seo: parsed.titulo_seo.slice(0, 70),
        meta_descripcion: smartTruncate(parsed.meta_descripcion, 155),
      };
    }
  } catch {
    const titleMatch = raw.match(/"titulo_seo"\s*:\s*"([^"]+)"/);
    const descMatch = raw.match(/"meta_descripcion"\s*:\s*"([^"]+)"/);
    if (titleMatch && descMatch) {
      return {
        titulo_seo: titleMatch[1].slice(0, 70),
        meta_descripcion: smartTruncate(descMatch[1], 155),
      };
    }
  }
  return null;
}

function smartTruncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > maxLen * 0.6) return truncated.slice(0, lastPeriod + 1);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.6) return truncated.slice(0, lastSpace);
  return truncated;
}

async function optimizeLearnTitleWithGemini(
  title: string,
  seoTitle: string | null,
  metaDescription: string | null,
  content: string,
  slug: string
): Promise<{ seo_title: string; meta_description: string } | null> {
  const contentSnippet = content.slice(0, 1200);

  const prompt = `You are an expert SEO editor specializing in educational content about precious metals. Rewrite the SEO title and meta description for this EDUCATIONAL article to maximize click-through rate on Google search results.

Article slug: "${slug}"
Current title: "${title}"
Current SEO title: "${seoTitle || title}"
Current meta description: "${metaDescription || ""}"

Content excerpt:
${contentSnippet}

RULES for the SEO title (50-60 characters):
- Use one of these CTR-proven patterns (pick the best fit):
  1. Question: "Why Does Gold Rise When Inflation Spikes?"
  2. Comparison: "NGC vs PCGS: Which Grading Service Is Better?"
  3. Number/fact: "All Gold Ever Mined: 197,576 Tonnes Explained"
  4. How-to: "How to Read a COT Report to Predict Gold Prices"
  5. Benefit/outcome: "Gold ETFs in Europe: Lowest-Fee Options Compared"
- Include the main search keyword naturally
- NEVER start with "Introduction to", "Overview of", "Understanding", or "Guide to"
- Do NOT repeat the current generic title word-for-word

RULES for the meta description (140-155 characters):
- Start with what the reader will specifically learn or be able to do
- Include 1-2 concrete facts, numbers, or named examples from the article
- End with a hook that creates curiosity or signals clear value
- Do NOT write "In this article..." or "This page explains..."

Output ONLY valid JSON with keys "seo_title" and "meta_description". No extra text.

JSON:`;

  const raw = await generateText(prompt, { retryOnEmpty: false });
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.seo_title === "string" && typeof parsed.meta_description === "string") {
      return {
        seo_title: parsed.seo_title.slice(0, 65),
        meta_description: smartTruncate(parsed.meta_description, 155),
      };
    }
  } catch {
    const titleMatch = raw.match(/"seo_title"\s*:\s*"([^"]+)"/);
    const descMatch = raw.match(/"meta_description"\s*:\s*"([^"]+)"/);
    if (titleMatch && descMatch) {
      return {
        seo_title: titleMatch[1].slice(0, 65),
        meta_description: smartTruncate(descMatch[1], 155),
      };
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "5"), 20);
  const esOnly = url.searchParams.get("es_only") === "true";
  // target=learn → only learn articles; target=news → only news; default → both
  const target = url.searchParams.get("target") || "all";

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const optimized: { id: number; locale: string; old: string; new: string }[] = [];
  const failed: { id: number; locale: string; reason: string }[] = [];
  const pingUrls: string[] = [];

  // ─── News articles (Spanish originals) ────────────────────────────────────
  if (target === "all" || target === "news") {
    const candidates = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        excerpt: articles.excerpt,
        content: articles.content,
      })
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(100);

    const toOptimizeEs = candidates.filter((a) => needsOptimization(a.title)).slice(0, limit);

    for (const art of toOptimizeEs) {
      const improved = await optimizeTitleWithGemini(art.title, art.excerpt ?? "", art.content ?? "", "es");
      if (!improved) {
        failed.push({ id: art.id, locale: "es", reason: "Gemini returned null" });
        continue;
      }
      if (improved.titulo_seo === art.title) continue;

      await db
        .update(articles)
        .set({ title: improved.titulo_seo, excerpt: improved.meta_descripcion })
        .where(eq(articles.id, art.id));

      optimized.push({ id: art.id, locale: "es", old: art.title, new: improved.titulo_seo });
      pingUrls.push(`${BASE}/es/noticias/${art.slug}`);
      await new Promise((r) => setTimeout(r, 1500));
    }

    // News translations (en, de, tr)
    if (!esOnly) {
      const LOCALES_TO_OPTIMIZE: (typeof routing.locales[number])[] = ["en", "de", "tr"];

      const transRows = await db
        .select({
          id: articleTranslations.id,
          articleId: articleTranslations.articleId,
          locale: articleTranslations.locale,
          slug: articleTranslations.slug,
          title: articleTranslations.title,
          excerpt: articleTranslations.excerpt,
          content: articleTranslations.content,
        })
        .from(articleTranslations)
        .where(
          and(
            or(...LOCALES_TO_OPTIMIZE.map((loc) => eq(articleTranslations.locale, loc)))
          )
        )
        .orderBy(desc(articleTranslations.id))
        .limit(200);

      const toOptimizeTrans = transRows
        .filter((r) => r.title && needsOptimization(r.title))
        .slice(0, limit);

      for (const tr of toOptimizeTrans) {
        if (!tr.title) continue;
        const improved = await optimizeTitleWithGemini(
          tr.title,
          tr.excerpt ?? "",
          tr.content ?? "",
          tr.locale
        );
        if (!improved) {
          failed.push({ id: tr.id, locale: tr.locale, reason: "Gemini returned null" });
          continue;
        }
        if (improved.titulo_seo === tr.title) continue;

        await db
          .update(articleTranslations)
          .set({ title: improved.titulo_seo, excerpt: improved.meta_descripcion })
          .where(eq(articleTranslations.id, tr.id));

        optimized.push({ id: tr.id, locale: tr.locale, old: tr.title, new: improved.titulo_seo });

        if (tr.slug) {
          const path = getPathname({
            locale: tr.locale as Locale,
            href: { pathname: "/noticias/[slug]", params: { slug: tr.slug } } as any,
          });
          pingUrls.push(`${BASE}${path}`);
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  // ─── Learn articles (English seoTitle optimization) ────────────────────────
  if (target === "all" || target === "learn") {
    const learnRows = await db
      .select({
        locId: learnArticleLocalizations.id,
        articleId: learnArticleLocalizations.articleId,
        slug: learnArticles.slug,
        clusterSlug: learnArticles.clusterId, // we'll resolve via join below
        locSlug: learnArticleLocalizations.slug,
        title: learnArticleLocalizations.title,
        seoTitle: learnArticleLocalizations.seoTitle,
        metaDescription: learnArticleLocalizations.metaDescription,
        content: learnArticleLocalizations.content,
      })
      .from(learnArticleLocalizations)
      .innerJoin(learnArticles, eq(learnArticles.id, learnArticleLocalizations.articleId))
      .where(
        and(
          eq(learnArticleLocalizations.locale, "en"),
          isNotNull(learnArticleLocalizations.content)
        )
      )
      .orderBy(desc(learnArticleLocalizations.updatedAt))
      .limit(100);

    // Priority: articles that need optimization first, then by recency
    const toOptimizeLearn = learnRows
      .filter((r) => r.title && needsLearnOptimization(r.title, r.seoTitle))
      .slice(0, limit);

    for (const row of toOptimizeLearn) {
      if (!row.title || !row.content) continue;

      const improved = await optimizeLearnTitleWithGemini(
        row.title,
        row.seoTitle,
        row.metaDescription,
        row.content,
        row.slug
      );

      if (!improved) {
        failed.push({ id: row.locId, locale: "en-learn", reason: "Gemini returned null" });
        continue;
      }

      if (improved.seo_title === (row.seoTitle || row.title)) continue;

      await db
        .update(learnArticleLocalizations)
        .set({
          seoTitle: improved.seo_title,
          metaDescription: improved.meta_description,
          updatedAt: new Date(),
        })
        .where(eq(learnArticleLocalizations.id, row.locId));

      optimized.push({
        id: row.locId,
        locale: "en-learn",
        old: row.seoTitle || row.title,
        new: improved.seo_title,
      });

      // Ping IndexNow for all locales of this article
      for (const loc of routing.locales) {
        const clusterSlug = getLocalizedClusterSlug("price-factors", loc); // fallback; actual cluster resolved at runtime
        const articleLocSlug = row.locSlug || row.slug;
        pingUrls.push(`${BASE}/${loc}/learn/${clusterSlug}/${articleLocSlug}`);
      }

      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  // Ping IndexNow for all updated URLs so Google recrawls them fast
  if (pingUrls.length) await pingIndexNow(pingUrls);

  return NextResponse.json({
    ok: true,
    optimized: optimized.length,
    failed: failed.length,
    pingUrls: pingUrls.length,
    changes: optimized,
    timestamp: new Date().toISOString(),
  });
}
