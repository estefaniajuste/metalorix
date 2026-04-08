import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, articleTranslations, learnArticles, learnArticleLocalizations, learnClusters } from "@/lib/db/schema";
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

// Manually crafted CTR-optimized titles for the highest-impression zero-click pages.
// These override Gemini when the slug matches, ensuring reliable quality.
const MANUAL_TITLE_OVERRIDES: Record<string, { seo_title: string; meta_description: string }> = {
  "coin-grading-scale-ms-pf": {
    seo_title: "Coin Grading Scale Explained: MS-70 to Good — Complete Chart",
    meta_description: "Every coin grade from MS-70 (perfect) to Good (G-4) explained with price impact. Master the Sheldon 70-point scale for business strikes and proofs.",
  },
  "coin-grading-ngc-and-pcgs": {
    seo_title: "NGC vs PCGS: Fees, Standards & Which Grading Service Wins",
    meta_description: "NGC vs PCGS compared: submission fees, turnaround times, holder quality and resale premiums. See which coin grading service is better for your collection.",
  },
  "volatility-comparison-across-metals": {
    seo_title: "Gold vs Silver vs Platinum Volatility: Which Metal Swings Most?",
    meta_description: "Silver averages 30% annualized volatility vs gold's 16%. Compare 10-year data for gold, silver, platinum and palladium with daily max moves and ranking tables.",
  },
  "liquidity-comparison-across-metals": {
    seo_title: "Gold vs Silver vs Platinum Liquidity: Spreads, Volume & Ease of Selling",
    meta_description: "Gold trades $130B+/day; platinum just $4B. Rank precious metals by daily volume, bid-ask spread and market depth. Liquidity data matters when you need to sell.",
  },
  "hyperinflation-episodes-and-gold": {
    seo_title: "Does Gold Protect in Hyperinflation? Weimar, Zimbabwe & Venezuela Data",
    meta_description: "Gold preserved 90%+ of purchasing power in Weimar Germany, Zimbabwe and Venezuela. Real price data from history's worst hyperinflation episodes analyzed.",
  },
  "above-ground-gold-stock": {
    seo_title: "All Gold Ever Mined: 212,000 Tonnes — Where Is It Now? [2026]",
    meta_description: "Total above-ground gold stock: ~212,000 tonnes worth $16T+. Breakdown: 46% jewelry, 22% investment, 17% central banks. Updated 2026 World Gold Council data.",
  },
  "hyperinflation-and-precious-metals": {
    seo_title: "Gold in Hyperinflation: Weimar, Zimbabwe & Venezuela Case Studies",
    meta_description: "Gold surged 1 trillion% in Weimar marks and quadrillions in Zimbabwe dollars. See exactly how gold and silver performed in history's worst currency collapses.",
  },
  "silver-chemical-symbol-ag": {
    seo_title: "Why Is Silver's Chemical Symbol Ag? The Latin Origin Explained",
    meta_description: "Silver's symbol Ag comes from Latin 'argentum' meaning shiny or white. Learn the full history behind this periodic table anomaly and why it persists today.",
  },
  "comparing-gold-etfs-in-europe": {
    seo_title: "Best Gold ETFs in Europe 2026: Xetra-Gold vs iShares Fees Compared",
    meta_description: "Compare Europe's top gold ETFs and ETCs: Xetra-Gold, iShares Physical Gold, Invesco and more. Fees, AUM, physical backing and tax treatment compared.",
  },
  "the-miller-process": {
    seo_title: "The Miller Process: How Chlorine Refines Gold to 99.5%+ Purity",
    meta_description: "The Miller process bubbles chlorine through molten gold to remove base metals and silver. How it works, why tin causes problems, and Miller vs Wohlwill.",
  },
  "the-wohlwill-electrolytic-process": {
    seo_title: "Wohlwill Process Explained: Electrolytic Gold Refining to 999.9",
    meta_description: "The Wohlwill electrolytic process refines gold to 99.99% (four nines). See how it works, why anode slime matters, and when refiners choose Wohlwill over Miller.",
  },
  "gold-price-in-different-decades": {
    seo_title: "Gold Price by Decade: 1970s Through 2020s — Returns Charted",
    meta_description: "Gold returned +2,300% in the 1970s, -52% in the 1980s and +25% in the 2010s. See average gold prices, real returns and the dominant driver of each decade.",
  },
  "bretton-woods-system-explained": {
    seo_title: "Bretton Woods Explained: Why Gold Was Pegged at $35/oz Until 1971",
    meta_description: "The 1944 Bretton Woods agreement fixed gold at $35/oz and pegged all currencies to the dollar. How it worked, why it collapsed, and its legacy today.",
  },
  "e-waste-precious-metals-content": {
    seo_title: "Gold, Silver & Palladium in E-Waste: How Much Is in Your Phone?",
    meta_description: "A smartphone holds ~0.03g gold, 0.3g silver and 0.015g palladium. Precious metals content in laptops, TVs and circuit boards — richer than most ores.",
  },
};

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

function needsLearnOptimization(title: string, seoTitle: string | null): boolean {
  if (!seoTitle) return true;
  if (seoTitle.trim() === title.trim()) return true;
  if (seoTitle.length < 30) return true;
  if (seoTitle.length > 65) return true;
  const lower = seoTitle.toLowerCase();
  const weakStarters = [
    "introduction to", "overview of", "understanding", "guide to", "what is",
    "a guide to", "a complete guide", "a beginner", "an introduction",
    "learn about", "discover the", "explore the", "the basics of",
  ];
  if (weakStarters.some((p) => lower.startsWith(p))) return true;
  const weakEndings = [
    "a beginner's guide", "a complete guide", "an overview",
    "a comprehensive guide", "what you need to know", "everything you need",
    "a complete introduction", "a detailed overview",
  ];
  if (weakEndings.some((p) => lower.endsWith(p))) return true;
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

interface LearnOptResult {
  seo_title: string;
  meta_description: string;
  faq?: { question: string; answer: string }[];
}

async function optimizeLearnTitleWithGemini(
  title: string,
  seoTitle: string | null,
  metaDescription: string | null,
  content: string,
  slug: string,
  existingFaq: boolean
): Promise<LearnOptResult | null> {
  const contentSnippet = content.slice(0, 1200);

  const faqInstruction = existingFaq
    ? ""
    : `
RULES for FAQ (3-5 questions):
- Generate 3-5 frequently asked questions that people searching for this topic would ask Google
- Each question should be a natural search query (e.g., "Is gold a good hedge against inflation?")
- Each answer should be 1-3 sentences, factual, and based on the article content
- Questions should cover different angles of the topic
- Include the "faq" key in the JSON as an array of {"question": "...", "answer": "..."} objects`;

  const faqJsonHint = existingFaq ? "" : ', "faq": [{"question": "...", "answer": "..."}]';

  const prompt = `You are an expert SEO editor specializing in educational content about precious metals. Optimize this article's search appearance to maximize click-through rate on Google.

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
${faqInstruction}

Output ONLY valid JSON: {"seo_title": "...", "meta_description": "..."${faqJsonHint}}

JSON:`;

  const raw = await generateText(prompt, { retryOnEmpty: false });
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.seo_title === "string" && typeof parsed.meta_description === "string") {
      const result: LearnOptResult = {
        seo_title: parsed.seo_title.slice(0, 65),
        meta_description: smartTruncate(parsed.meta_description, 155),
      };
      if (Array.isArray(parsed.faq) && parsed.faq.length > 0) {
        result.faq = parsed.faq
          .filter((f: any) => f?.question && f?.answer)
          .slice(0, 5);
      }
      return result;
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

  try {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "5"), 20);
  const esOnly = url.searchParams.get("es_only") === "true";
  const target = url.searchParams.get("target") || "all";
  const rawSlugs = url.searchParams.get("slugs") || "";
  const forceSlugs = rawSlugs === "manual"
    ? Object.keys(MANUAL_TITLE_OVERRIDES)
    : rawSlugs.split(",").map((s) => s.trim()).filter(Boolean);

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

  // ─── Learn articles (English seoTitle + FAQ optimization) ────────────────────
  if (target === "all" || target === "learn") {
    const learnRows = await db
      .select({
        locId: learnArticleLocalizations.id,
        articleId: learnArticleLocalizations.articleId,
        slug: learnArticles.slug,
        clusterSlug: learnClusters.slug,
        locSlug: learnArticleLocalizations.slug,
        title: learnArticleLocalizations.title,
        seoTitle: learnArticleLocalizations.seoTitle,
        metaDescription: learnArticleLocalizations.metaDescription,
        content: learnArticleLocalizations.content,
        faq: learnArticleLocalizations.faq,
      })
      .from(learnArticleLocalizations)
      .innerJoin(learnArticles, eq(learnArticles.id, learnArticleLocalizations.articleId))
      .innerJoin(learnClusters, eq(learnClusters.id, learnArticles.clusterId))
      .where(
        and(
          eq(learnArticleLocalizations.locale, "en"),
          isNotNull(learnArticleLocalizations.content)
        )
      )
      .orderBy(desc(learnArticleLocalizations.updatedAt))
      .limit(100);

    const toOptimizeLearn = learnRows
      .filter((r) => {
        if (!r.title) return false;
        if (forceSlugs.length > 0) return forceSlugs.includes(r.slug);
        return needsLearnOptimization(r.title, r.seoTitle) || !r.faq;
      })
      .slice(0, forceSlugs.length > 0 ? forceSlugs.length : limit);

    for (const row of toOptimizeLearn) {
      if (!row.title || !row.content) continue;

      const existingFaq = !!row.faq;
      const manualOverride = MANUAL_TITLE_OVERRIDES[row.slug];
      const improved = manualOverride
        ? { seo_title: manualOverride.seo_title.slice(0, 120), meta_description: smartTruncate(manualOverride.meta_description, 155), faq: undefined as any }
        : await optimizeLearnTitleWithGemini(
            row.title,
            row.seoTitle,
            row.metaDescription,
            row.content,
            row.slug,
            existingFaq
          );

      if (!improved) {
        failed.push({ id: row.locId, locale: "en-learn", reason: "Gemini returned null" });
        continue;
      }

      const updateData: Record<string, unknown> = {
        seoTitle: improved.seo_title,
        metaDescription: improved.meta_description,
        updatedAt: new Date(),
      };
      if (improved.faq && improved.faq.length > 0 && !existingFaq) {
        updateData.faq = JSON.stringify(improved.faq);
      }

      await db
        .update(learnArticleLocalizations)
        .set(updateData)
        .where(eq(learnArticleLocalizations.id, row.locId));

      optimized.push({
        id: row.locId,
        locale: "en-learn",
        old: row.seoTitle || row.title,
        new: improved.seo_title,
      });

      for (const loc of routing.locales) {
        const clusterSlug = getLocalizedClusterSlug(row.clusterSlug, loc);
        const learnBase = loc === "es" ? "aprende-inversion" : loc === "de" ? "lernen-investition" : loc === "zh" ? "xuexi" : loc === "ar" ? "taallam" : loc === "tr" ? "ogren-yatirim" : loc === "hi" ? "gyaan-nivesh" : "learn";
        const articleLocSlug = row.locSlug || row.slug;
        pingUrls.push(`${BASE}/${loc}/${learnBase}/${clusterSlug}/${articleLocSlug}`);
      }

      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  if (pingUrls.length) await pingIndexNow(pingUrls);

  return NextResponse.json({
    ok: true,
    optimized: optimized.length,
    failed: failed.length,
    pingUrls: pingUrls.length,
    changes: optimized,
    timestamp: new Date().toISOString(),
  });
  } catch (err: any) {
    console.error("optimize-titles error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal error", stack: err?.stack?.split("\n").slice(0, 5) },
      { status: 500 }
    );
  }
}
