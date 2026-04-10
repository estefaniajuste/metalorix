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

// Anti-zero-click titles: create an information gap Google snippets can't satisfy.
// Each title promises data, comparisons or insights that REQUIRE clicking through.
const MANUAL_TITLE_OVERRIDES: Record<string, { seo_title: string; meta_description: string }> = {
  "coin-grading-scale-ms-pf": {
    seo_title: "Coin Grading Scale: Why One Grade Up Can Double Your Coin's Value",
    meta_description: "The jump from MS-65 to MS-67 can mean a 5× price increase. See the full Sheldon 70-point scale with real auction prices at every grade level.",
  },
  "coin-grading-ngc-and-pcgs": {
    seo_title: "NGC vs PCGS 2026: Fee Comparison Table & Which Adds More Resale Value",
    meta_description: "We compared NGC and PCGS submission fees, turnaround speed, holder quality and the resale premium each adds. One consistently outperforms — see the data.",
  },
  "volatility-comparison-across-metals": {
    seo_title: "Gold vs Silver vs Platinum: 10-Year Volatility Data Ranked",
    meta_description: "Silver's annualized volatility is nearly 2× gold's. Full 10-year ranking with daily max swings and worst drawdowns for all four precious metals.",
  },
  "liquidity-comparison-across-metals": {
    seo_title: "Which Precious Metal Is Hardest to Sell? Liquidity Ranked by Spread",
    meta_description: "Gold trades $130B/day with tight spreads; palladium can take days to move. See bid-ask spreads, daily volumes and real dealer markups for each metal.",
  },
  "hyperinflation-episodes-and-gold": {
    seo_title: "Gold in Hyperinflation: Real Returns From Weimar, Zimbabwe & Venezuela",
    meta_description: "Gold preserved 90%+ of purchasing power while currencies lost everything. Actual price data from three of history's worst currency collapses.",
  },
  "above-ground-gold-stock": {
    seo_title: "Who Owns the World's 212,000 Tonnes of Gold? The Full Breakdown [2026]",
    meta_description: "Five countries control nearly half of all above-ground gold. See the complete breakdown — jewelry, central banks, ETFs, private vaults — with 2026 data.",
  },
  "hyperinflation-and-precious-metals": {
    seo_title: "How Gold Performed in 3 Hyperinflations: Weimar, Zimbabwe, Venezuela",
    meta_description: "Gold surged 1 trillion% in Weimar marks. But silver actually outperformed in two of three cases. Real price data and the lessons for today's investors.",
  },
  "silver-chemical-symbol-ag": {
    seo_title: "Why Silver Is 'Ag' — And 6 Other Periodic Table Naming Surprises",
    meta_description: "Silver's symbol Ag comes from Latin 'argentum.' But it's not the only element with a surprising symbol. See the full story behind precious metal nomenclature.",
  },
  "comparing-gold-etfs-in-europe": {
    seo_title: "Gold ETFs in Europe 2026: Fees, Tax & Physical Delivery Compared",
    meta_description: "Xetra-Gold lets you take physical delivery; iShares doesn't. Compare 8 European gold ETFs/ETCs by expense ratio, AUM, tax treatment and physical backing.",
  },
  "the-miller-process": {
    seo_title: "Miller Process: Why 99.5% Gold Purity Isn't Good Enough",
    meta_description: "The Miller process refines gold to 99.5% — but investment bars need 99.99%. See how it works, where it fails, and when refiners must switch to Wohlwill.",
  },
  "the-wohlwill-electrolytic-process": {
    seo_title: "Wohlwill Process: The Only Way to Reach 99.99% Gold Purity",
    meta_description: "The Wohlwill electrolytic process is slower and costlier than Miller — but it's the only path to four-nines gold. Step-by-step breakdown with cost comparison.",
  },
  "gold-price-in-different-decades": {
    seo_title: "Gold Price by Decade: The Best and Worst 10-Year Returns Since 1970",
    meta_description: "+2,300% in the 1970s. -52% in the 1980s. See what drove gold in each decade and which pattern the 2020s are following so far.",
  },
  "bretton-woods-system-explained": {
    seo_title: "Bretton Woods: The $35 Gold Peg That Broke the World Economy",
    meta_description: "In 1971, the U.S. abandoned the gold standard and changed finance forever. The full timeline from 1944 Bretton Woods to Nixon's shock — and what it means today.",
  },
  "e-waste-precious-metals-content": {
    seo_title: "Precious Metals in Your Phone: Exact Gold, Silver & Palladium Content",
    meta_description: "A single smartphone contains more gold per tonne than most mine ore. Exact gram-by-gram content for phones, laptops, TVs and servers — with current scrap value.",
  },
  "lbma-gold-price-process": {
    seo_title: "How the Gold Price Is Actually Set: Inside the LBMA Auction",
    meta_description: "Twice daily, a handful of banks determine the benchmark gold price used worldwide. How the LBMA auction works, who participates, and why it replaced the London Fix.",
  },
  "silver-mining-stocks": {
    seo_title: "Silver Mining Stocks: Why They Move 2-3× More Than Silver Itself",
    meta_description: "Silver miners have a beta of 2-3× to the metal. See which stocks offer the most leverage, the risks of operational gearing, and how to size the position.",
  },
  "cpi-data-impact-on-gold": {
    seo_title: "CPI Release Day: How Gold Reacts Within Minutes (Data Since 2020)",
    meta_description: "Gold moves 0.5-2% within 30 minutes of a CPI print. See the pattern: higher-than-expected CPI = gold up; lower = gold down. Six years of data charted.",
  },
  "1980-gold-peak-explained": {
    seo_title: "Gold's 1980 Crash: What Happened After the $850 Peak",
    meta_description: "Gold hit $850 in January 1980 and didn't recover for 28 years. The three forces that created the bubble — and the warning signs investors missed.",
  },
  "gold-price-in-yen": {
    seo_title: "Gold Price in Yen: Why Japanese Investors See Different All-Time Highs",
    meta_description: "Gold in yen hit records while gold in USD was flat. The weak yen effect explained with charts showing gold performance in JPY vs USD since 2012.",
  },
  "vat-on-gold-in-the-eu": {
    seo_title: "Gold VAT in the EU: Which Countries Charge 0% and Which Don't",
    meta_description: "Investment gold is VAT-exempt across the EU — but the definition varies by country. See the exact criteria, exceptions, and what happens with coins vs bars.",
  },
  "tael-and-tola-explained": {
    seo_title: "Tael, Tola, Baht: Gold Weight Units That Affect What You Pay",
    meta_description: "A tola (11.66g) costs different than a troy ounce (31.1g). See all Asian and South Asian gold weight units with conversion tables and where each is used.",
  },
  "comparing-vault-storage-services": {
    seo_title: "Gold Vault Storage 2026: Fees, Insurance & Minimums Compared",
    meta_description: "BullionVault charges 0.12%/yr; Brinks starts at $100/mo. Compare 8 vault storage services by fees, insurance limits, audit frequency and delivery options.",
  },
  "traditional-5-10-percent-allocation": {
    seo_title: "The 5-10% Gold Rule: Where It Came From and If It Still Works",
    meta_description: "Financial advisors recommend 5-10% gold allocation — but the evidence behind this rule may surprise you. Historical Sharpe ratios at different gold weights.",
  },
  "storage-costs-comparison": {
    seo_title: "Gold Storage: Home vs Bank vs Vault — Real Costs Compared [2026]",
    meta_description: "A home safe costs $200 once; a bank box $150/yr; a vault 0.12-0.5%/yr of holdings. Full cost comparison including insurance, access and hidden fees.",
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

  const prompt = `You are an expert SEO editor. Your ONLY goal: make people CLICK the Google result instead of reading the snippet.

Article slug: "${slug}"
Current title: "${title}"
Current SEO title: "${seoTitle || title}"
Current meta description: "${metaDescription || ""}"

Content excerpt:
${contentSnippet}

ANTI-ZERO-CLICK RULES for SEO title (50-60 chars):
Google shows answers in snippets — users never click. Your title MUST create an INFORMATION GAP that the snippet cannot satisfy.

Winning patterns:
1. Tension/surprise: "Miller Process: Why 99.5% Gold Purity Isn't Good Enough"
2. Comparison with verdict: "NGC vs PCGS 2026: Fee Table & Which Adds More Resale Value"
3. Exclusive data: "CPI Release Day: How Gold Reacts Within Minutes (Data Since 2020)"
4. Challenge a belief: "The 5-10% Gold Rule: Where It Came From and If It Still Works"
5. Personal stakes: "Which Precious Metal Is Hardest to Sell? Liquidity Ranked"

FORBIDDEN: titles that ANSWER the query, "Introduction to", "Overview of", "Understanding", "Explained", "A Guide to", generic academic titles.

RULES for meta description (140-155 chars):
- Start with a SURPRISING fact or number
- Promise EXCLUSIVE content: a table, chart, ranking, or comparison
- End with a curiosity hook
- NEVER "In this article..." or "Learn about..."
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
