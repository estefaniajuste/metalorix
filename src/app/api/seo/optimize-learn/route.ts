import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Optimized SEO metadata for top learn articles by Google impressions.
 * Titles kept under 55 chars (page adds " | Metalorix" = ~13 chars → ~68 total).
 * Descriptions kept under 160 chars. Written to match actual search queries from GSC.
 */
const OPTIMIZED_METADATA: {
  slug: string;
  locale: string;
  seoTitle: string;
  metaDescription: string;
}[] = [
  {
    slug: "coin-grading-scale-ms-pf",
    locale: "en",
    seoTitle: "Coin Grading Scale: MS70 to Good Explained",
    metaDescription:
      "Complete coin grading scale from MS70 (perfect) to Good (G-4). Learn how PCGS and NGC grade coins, what each grade means, and how grades affect value.",
  },
  {
    slug: "hyperinflation-episodes-and-gold",
    locale: "en",
    seoTitle: "Gold in Hyperinflation: Weimar, Zimbabwe & Venezuela",
    metaDescription:
      "How did gold perform during hyperinflation in Weimar Germany, Zimbabwe, and Venezuela? Historical data shows gold preserved wealth when currencies collapsed.",
  },
  {
    slug: "silver-chemical-symbol-ag",
    locale: "en",
    seoTitle: "Why Is Silver's Symbol Ag? Origin Explained",
    metaDescription:
      "Silver's chemical symbol Ag comes from the Latin 'argentum'. Learn why the periodic table uses Ag, silver's atomic number 47, and what makes it unique.",
  },
  {
    slug: "gold-price-by-decade-1970s-through-2020s",
    locale: "en",
    seoTitle: "Gold Price History by Decade: 1970s to 2020s",
    metaDescription:
      "Gold price history from $35/oz in the 1970s to over $2,000 in the 2020s. Decade-by-decade charts, data, and analysis of what drove each era's performance.",
  },
  {
    slug: "comparing-gold-etfs-in-europe",
    locale: "en",
    seoTitle: "Best Gold ETFs in Europe: Xetra vs iShares vs Invesco",
    metaDescription:
      "Compare Europe's top gold ETFs and ETCs: Xetra Gold, iShares Physical Gold, Invesco Physical Gold. Fees, structure, holdings, and how to choose.",
  },
  {
    slug: "ppi-and-gold-correlation",
    locale: "en",
    seoTitle: "How PPI Affects Gold Prices: Correlation Explained",
    metaDescription:
      "Higher-than-expected PPI signals rising inflation and can push gold prices up. Learn the PPI-gold correlation, historical data, and trading strategies.",
  },
  {
    slug: "volatility-comparison-across-precious-metals",
    locale: "en",
    seoTitle: "Gold vs Silver vs Platinum: Volatility Compared",
    metaDescription:
      "Silver is ~1.5x more volatile than gold, while platinum leads all precious metals. 10-year annualized volatility data and what it means for your portfolio.",
  },
  {
    slug: "volatility-comparison-across-metals",
    locale: "en",
    seoTitle: "Precious Metals Volatility: Historical Comparison",
    metaDescription:
      "Compare the annualized volatility of gold, silver, platinum, and palladium. Historical data reveals silver and platinum swing 50-80% more than gold.",
  },
  {
    slug: "gold-volatility-index-gvz",
    locale: "en",
    seoTitle: "CBOE Gold Volatility Index (GVZ) Explained",
    metaDescription:
      "The GVZ measures expected 30-day gold volatility using GLD options. Learn how CBOE calculates it, what readings signal, and how investors use it.",
  },
  {
    slug: "gold-chemical-symbol-au",
    locale: "en",
    seoTitle: "Why Is Gold's Symbol Au? The Latin Origin",
    metaDescription:
      "Gold's chemical symbol Au comes from Latin 'aurum' meaning shining dawn. Learn gold's atomic number 79, electron configuration, and unique properties.",
  },
  {
    slug: "vat-on-gold-in-the-eu",
    locale: "en",
    seoTitle: "VAT on Gold in the EU: Tax Exemption Guide",
    metaDescription:
      "Investment gold is VAT-exempt across the EU under Directive 98/80/EC. Silver and platinum are NOT exempt. Country-by-country VAT rates and rules.",
  },
  {
    slug: "troy-ounce-explained",
    locale: "en",
    seoTitle: "Troy Ounce Explained: Weight, History & Conversion",
    metaDescription:
      "A troy ounce equals 31.1035g, about 10% heavier than a regular ounce (28.35g). Why precious metals use the troy system and how to convert units.",
  },
  {
    slug: "the-bretton-woods-system-explained-gold-at-35-per-ounce",
    locale: "en",
    seoTitle: "Bretton Woods System: Gold at $35 per Ounce",
    metaDescription:
      "How the 1944 Bretton Woods agreement pegged gold at $35/oz and made the US dollar the world's reserve currency. Why Nixon ended it in 1971.",
  },
  {
    slug: "tail-risk-hedging-with-gold-options",
    locale: "en",
    seoTitle: "Tail Risk Hedging With Gold Options: A Strategy Guide",
    metaDescription:
      "Use gold put and call options to protect portfolios against black swan events. Practical strategies, cost analysis, and when to hedge with gold.",
  },
  {
    slug: "liquidity-comparison-across-metals",
    locale: "en",
    seoTitle: "Gold vs Silver vs Platinum: Liquidity Compared",
    metaDescription:
      "Gold trades $150B+ daily, making it the most liquid precious metal. Compare market depth, bid-ask spreads, and trading costs across precious metals.",
  },
  {
    slug: "liquidity-comparison-across-precious-metals",
    locale: "en",
    seoTitle: "Precious Metals Liquidity Ranking: Full Guide",
    metaDescription:
      "Ranked by daily volume: gold > silver > platinum > palladium. How market depth and liquidity affect spreads, slippage, and investment decisions.",
  },
  {
    slug: "gold-isotopes",
    locale: "en",
    seoTitle: "Gold Isotopes: Why Gold-197 Is the Only Stable One",
    metaDescription:
      "Gold has only one stable isotope: Au-197. Discover all 37 known isotopes, why Au-197 is unique, and how radioactive gold isotopes are used in medicine.",
  },
  {
    slug: "historical-gold-silver-ratio-chart",
    locale: "en",
    seoTitle: "Gold to Silver Ratio: Historical Chart & Analysis",
    metaDescription:
      "The gold-to-silver ratio ranged from 1:2.5 in ancient Egypt to over 120:1 in 2020. Historical chart, key extremes, and when to swap gold for silver.",
  },
  {
    slug: "malleability-of-gold",
    locale: "en",
    seoTitle: "Why Is Gold So Malleable? The Science Explained",
    metaDescription:
      "Gold is the most malleable metal: 1 gram can be beaten into a 1m² sheet. The atomic structure that makes gold uniquely ductile and formable.",
  },
  {
    slug: "bear-markets-and-gold",
    locale: "en",
    seoTitle: "Gold in Bear Markets: Historical Performance Data",
    metaDescription:
      "Gold rose 25% during the 2008 crisis and 18% in the 2020 COVID crash. How gold performed in every major stock market downturn since 1970.",
  },
  {
    slug: "gold-silver-ratio-2024-analysis",
    locale: "en",
    seoTitle: "Gold to Silver Ratio 2024-2025: Current Analysis",
    metaDescription:
      "The gold-to-silver ratio averaged ~85:1 in 2024. Is silver undervalued? Current levels vs historical averages, and trading opportunities.",
  },
  {
    slug: "slv-ishares-silver-trust",
    locale: "en",
    seoTitle: "SLV iShares Silver Trust: How It Works",
    metaDescription:
      "The SLV ETF holds physical silver in London vaults. How the trust works, expense ratio, NAV tracking, and whether SLV is a good way to own silver.",
  },
  {
    slug: "physical-properties-of-gold",
    locale: "en",
    seoTitle: "Physical Properties of Gold: Density, Color & More",
    metaDescription:
      "Gold density is 19.32 g/cm³, melting point 1,064°C, and it's the most malleable metal known. Complete guide to gold's physical and chemical properties.",
  },
  {
    slug: "counterparty-risk-in-precious-metals",
    locale: "en",
    seoTitle: "Counterparty Risk in Precious Metals Explained",
    metaDescription:
      "Physical gold has zero counterparty risk — no issuer can default. Paper gold (ETFs, futures) carries risks from custodians, brokers, and exchanges.",
  },
  {
    slug: "american-gold-eagle",
    locale: "en",
    seoTitle: "American Gold Eagle: Weight, Purity & Buying Guide",
    metaDescription:
      "The American Gold Eagle contains 1 oz of 22K gold (91.67% pure). Sizes, premiums, designs, and why it's the world's most popular gold bullion coin.",
  },
  {
    slug: "money-supply-m2-and-gold",
    locale: "en",
    seoTitle: "M2 Money Supply and Gold: The Key Relationship",
    metaDescription:
      "When M2 money supply expands faster than GDP, gold rises as a hedge against debasement. Historical data, charts, and correlation analysis.",
  },
  {
    slug: "physical-properties-of-silver",
    locale: "en",
    seoTitle: "Physical Properties of Silver: Complete Guide",
    metaDescription:
      "Silver has the highest electrical and thermal conductivity of any element. Density 10.49 g/cm³, melting point 961.8°C, and all key properties explained.",
  },
  {
    slug: "pcgs-coin-grading-explained",
    locale: "en",
    seoTitle: "PCGS Coin Grading: How It Works & What Grades Mean",
    metaDescription:
      "PCGS grades coins from Poor (P-1) to Perfect Mint State (MS-70). Submission process, grading fees, holder types, and how grades affect coin value.",
  },
  {
    slug: "corrosion-resistance-across-precious-metals",
    locale: "en",
    seoTitle: "Corrosion Resistance of Precious Metals Compared",
    metaDescription:
      "Gold and platinum resist virtually all corrosion, while silver tarnishes and palladium oxidizes at high heat. How each precious metal handles the elements.",
  },
  {
    slug: "negative-real-rates-bull-case-for-gold",
    locale: "en",
    seoTitle: "Negative Real Interest Rates: Why Gold Rises",
    metaDescription:
      "When real interest rates turn negative, gold rallies. The inverse relationship, historical data, and why negative real rates are the #1 gold signal.",
  },
  {
    slug: "how-to-sell-scrap-gold",
    locale: "en",
    seoTitle: "How to Sell Scrap Gold: Step-by-Step Guide",
    metaDescription:
      "Get the best price selling scrap gold. Compare pawn shops, online buyers, and refiners. How karat affects value and how to avoid common mistakes.",
  },
  {
    slug: "gold-conductivity",
    locale: "en",
    seoTitle: "Gold Conductivity: Electrical & Thermal Properties",
    metaDescription:
      "Gold is the third most conductive metal after silver and copper. Why 45.2 MS/m conductivity and corrosion resistance make gold ideal for electronics.",
  },
  {
    slug: "gold-mining-companies-overview",
    locale: "en",
    seoTitle: "Largest Gold Mining Companies: 2026 Overview",
    metaDescription:
      "Newmont, Barrick Gold, and Agnico Eagle lead global production. The world's biggest gold miners by output, market cap, and all-in sustaining costs.",
  },
  {
    slug: "federal-reserve-and-gold",
    locale: "en",
    seoTitle: "The Federal Reserve and Gold: How Fed Policy Moves Prices",
    metaDescription:
      "Rate hikes, QE, balance sheet changes — how Federal Reserve decisions affect gold prices. Historical patterns and what to watch at each FOMC meeting.",
  },
  {
    slug: "cost-of-gold-production-aisc",
    locale: "en",
    seoTitle: "Gold Production Cost (AISC): What It Costs to Mine Gold",
    metaDescription:
      "The all-in sustaining cost (AISC) of gold mining averages $1,200-1,400/oz. What AISC includes, how it varies by mine, and why it sets a gold price floor.",
  },
  {
    slug: "golds-atomic-structure",
    locale: "en",
    seoTitle: "Gold's Atomic Structure: Why Au Is Unique",
    metaDescription:
      "Gold (Au, atomic number 79) has a unique electron configuration that gives it its color and chemical stability. Relativistic effects explained simply.",
  },
  {
    slug: "moving-averages-for-metals",
    locale: "en",
    seoTitle: "Gold Moving Averages: 50-Day & 200-Day Explained",
    metaDescription:
      "The 50-day and 200-day moving averages are key gold trading signals. Learn golden crosses, death crosses, and how to read moving average charts.",
  },
  {
    slug: "us-dollar-index-dxy-and-gold",
    locale: "en",
    seoTitle: "US Dollar Index (DXY) and Gold: The Inverse Link",
    metaDescription:
      "Gold and the US Dollar Index typically move in opposite directions. Historical correlation data, why the relationship exists, and trading implications.",
  },
  {
    slug: "storage-costs-comparison",
    locale: "en",
    seoTitle: "Gold Storage Costs Compared: Vault vs Home vs Bank",
    metaDescription:
      "Professional vault storage costs 0.12-0.50% per year. Compare bank safe deposit boxes, home safes, and allocated vault options for precious metals.",
  },
  {
    slug: "gold-in-terms-of-purchasing-power",
    locale: "en",
    seoTitle: "Gold's Purchasing Power Over Time: Does It Hold?",
    metaDescription:
      "An ounce of gold bought a fine suit in 1920 — and still does today. How gold preserves purchasing power across centuries while fiat currencies erode.",
  },
  {
    slug: "open-interest-analysis",
    locale: "en",
    seoTitle: "Gold Open Interest: How to Read Futures Data",
    metaDescription:
      "Open interest measures total outstanding gold futures contracts. Learn how rising or falling OI signals bullish or bearish momentum in precious metals.",
  },
  {
    slug: "bid-ask-spread-in-metals",
    locale: "en",
    seoTitle: "Bid-Ask Spread in Precious Metals Explained",
    metaDescription:
      "Gold has the tightest bid-ask spread (~0.1%), while platinum and palladium can spread 1%+. What affects spreads and how to minimize your trading costs.",
  },
  {
    slug: "gold-to-oil-ratio-explained",
    locale: "en",
    seoTitle: "Gold to Oil Ratio: What It Means & Historical Data",
    metaDescription:
      "The gold-to-oil ratio shows how many barrels of oil one ounce of gold buys. Historical average is ~15:1. What extreme readings signal for investors.",
  },
  {
    slug: "inflation-risk-and-gold-paradox",
    locale: "en",
    seoTitle: "Gold as Inflation Hedge: The Paradox Explained",
    metaDescription:
      "Gold hedges against long-term inflation but can drop during short-term CPI spikes. The nuanced relationship between gold and inflation, with data.",
  },
  {
    slug: "noble-metals-concept",
    locale: "en",
    seoTitle: "What Are Noble Metals? Definition & Properties",
    metaDescription:
      "Noble metals (gold, silver, platinum, palladium) resist oxidation and corrosion. Learn what makes a metal 'noble', the full list, and practical significance.",
  },
];

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    let bodySecret: string | undefined;
    try {
      const body = await request.clone().json();
      bodySecret = body?.secret;
    } catch {
      /* no json body */
    }
    const isAuthed =
      auth === `Bearer ${CRON_SECRET}` || bodySecret === CRON_SECRET;
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "No database" }, { status: 500 });
  }

  const results: { slug: string; locale: string; status: string }[] = [];

  for (const meta of OPTIMIZED_METADATA) {
    try {
      const [article] = await db
        .select({ id: learnArticles.id })
        .from(learnArticles)
        .where(eq(learnArticles.slug, meta.slug))
        .limit(1);

      if (!article) {
        results.push({ slug: meta.slug, locale: meta.locale, status: "article_not_found" });
        continue;
      }

      const [loc] = await db
        .select({ id: learnArticleLocalizations.id })
        .from(learnArticleLocalizations)
        .where(
          and(
            eq(learnArticleLocalizations.articleId, article.id),
            eq(learnArticleLocalizations.locale, meta.locale)
          )
        )
        .limit(1);

      if (!loc) {
        results.push({ slug: meta.slug, locale: meta.locale, status: "localization_not_found" });
        continue;
      }

      await db
        .update(learnArticleLocalizations)
        .set({
          seoTitle: meta.seoTitle,
          metaDescription: meta.metaDescription,
          updatedAt: new Date(),
        })
        .where(eq(learnArticleLocalizations.id, loc.id));

      results.push({ slug: meta.slug, locale: meta.locale, status: "updated" });
    } catch (err) {
      results.push({
        slug: meta.slug,
        locale: meta.locale,
        status: `error: ${err instanceof Error ? err.message : "unknown"}`,
      });
    }
  }

  const updated = results.filter((r) => r.status === "updated").length;
  const failed = results.filter((r) => r.status !== "updated").length;

  return NextResponse.json({
    summary: { total: OPTIMIZED_METADATA.length, updated, failed },
    results,
  });
}
