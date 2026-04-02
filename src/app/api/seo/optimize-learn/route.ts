import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const CRON_SECRET = process.env.CRON_SECRET?.trim();

/**
 * Optimized SEO metadata for top learn articles by Google impressions.
 * Titles kept under 55 chars (page adds " | Metalorix" = ~13 chars → ~68 total).
 * Descriptions kept under 160 chars. Written to match actual search queries from GSC.
 *
 * Sections: English originals → Spanish translations → German translations (top 10)
 */
const OPTIMIZED_METADATA: {
  slug: string;
  locale: string;
  seoTitle: string;
  metaDescription: string;
  faq?: { question: string; answer: string }[];
}[] = [
  // ───────── ENGLISH ─────────
  {
    slug: "coin-grading-scale-ms-pf",
    locale: "en",
    seoTitle: "Coin Grading Scale: MS70 to Good [2026 Guide]",
    metaDescription:
      "Complete coin grading scale from MS70 (perfect) to Good (G-4). Learn how PCGS and NGC grade coins, what each grade means, and how grades affect value.",
    faq: [
      { question: "What does MS70 mean in coin grading?", answer: "MS70 is the highest grade on the Sheldon scale, meaning the coin is in perfect mint state with no visible marks or imperfections under 5x magnification." },
      { question: "What is the Sheldon coin grading scale?", answer: "The Sheldon scale rates coins from 1 (barely identifiable) to 70 (perfect). Created by Dr. William Sheldon in 1949, it is used by both PCGS and NGC." },
      { question: "How much does it cost to get a coin graded?", answer: "PCGS and NGC charge $20-150+ per coin depending on service level and declared value. Economy tiers start around $20-30 with 30-45 day turnaround." },
      { question: "What is the difference between MS and PF grades?", answer: "MS (Mint State) grades apply to business-strike coins, while PF (Proof) grades are for specially struck proof coins with mirror-like fields." },
      { question: "Does coin grade affect value significantly?", answer: "Yes. A one-point difference at high grades can mean thousands of dollars. For example, a common gold coin graded MS69 vs MS70 can differ by 5-20x in price." },
    ],
  },
  {
    slug: "ngc-coin-grading-explained",
    locale: "en",
    seoTitle: "NGC Coin Grading: Process, Costs & Scale",
    metaDescription:
      "NGC (Numismatic Guaranty Company) grades coins on the 1-70 Sheldon scale. Submission tiers from $20, turnaround options, and what NGC grades mean.",
    faq: [
      { question: "What is NGC coin grading?", answer: "NGC is one of the two most trusted third-party coin grading services. They authenticate and grade coins on a 1-70 scale, encapsulating them in tamper-proof holders." },
      { question: "How long does NGC grading take?", answer: "Standard NGC grading takes 30-45 business days. Express services range from 2 to 10 days at higher fees." },
      { question: "Is NGC or PCGS better for coin grading?", answer: "Both are equally respected. PCGS tends to be preferred for US coins, while NGC is often favored for world coins. Market premiums are similar." },
    ],
  },
  {
    slug: "sheldon-grading-scale",
    locale: "en",
    seoTitle: "Sheldon Grading Scale: The 1-70 Coin Rating System",
    metaDescription:
      "The Sheldon scale grades coins from 1 (Poor) to 70 (Perfect). Created in 1949, it's the standard used by PCGS, NGC, and all major dealers worldwide.",
  },
  {
    slug: "coin-grading-ngc-and-pcgs",
    locale: "en",
    seoTitle: "NGC vs PCGS Coin Grading: A Complete Comparison",
    metaDescription:
      "NGC and PCGS are the world's top coin grading services. Compare their scales, fees, holder types, turnaround times, and which one adds more value.",
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
    seoTitle: "Best Gold ETFs in Europe [2026]: Xetra vs iShares",
    metaDescription:
      "Compare Europe's top gold ETFs and ETCs: Xetra Gold, iShares Physical Gold, Invesco Physical Gold. Fees, structure, holdings, and how to choose.",
    faq: [
      { question: "What is the cheapest gold ETF in Europe?", answer: "Invesco Physical Gold (SGLD) has one of the lowest expense ratios at 0.12% p.a. Xetra Gold (0.00% management fee, but storage/insurance ~0.3%) and iShares Physical Gold (0.12%) are also competitive." },
      { question: "Is Xetra Gold backed by physical gold?", answer: "Yes. Xetra Gold grants the holder the right to claim delivery of physical gold. Each share represents 1 gram of gold stored in Frankfurt vaults." },
      { question: "Do European gold ETFs pay VAT?", answer: "No. Investment gold is VAT-exempt across the EU under Directive 98/80/EC. Gold ETFs and ETCs that are backed by physical gold qualify for this exemption." },
    ],
  },
  {
    slug: "ppi-and-gold-correlation",
    locale: "en",
    seoTitle: "How PPI Affects Gold Prices: Data & Correlation",
    metaDescription:
      "Higher-than-expected PPI signals rising inflation and can push gold prices up. Learn the PPI-gold correlation, historical data, and trading strategies.",
  },
  {
    slug: "volatility-comparison-across-precious-metals",
    locale: "en",
    seoTitle: "Gold vs Silver vs Platinum: Volatility Compared",
    metaDescription:
      "Silver is ~1.5x more volatile than gold, while platinum leads all precious metals. 10-year annualized volatility data and what it means for your portfolio.",
    faq: [
      { question: "Which precious metal is the most volatile?", answer: "Platinum is typically the most volatile precious metal, followed closely by silver. Both show 50-80% higher annualized volatility than gold over 10-year periods." },
      { question: "Is silver more volatile than gold?", answer: "Yes. Silver's annualized volatility is roughly 1.5x that of gold. This means silver tends to rise more in bull markets but fall harder in downturns." },
      { question: "Why is gold less volatile than silver?", answer: "Gold's deep market liquidity ($150B+ daily volume), central bank holdings, and status as a global reserve asset all reduce its price volatility compared to silver's smaller, more industrial market." },
    ],
  },
  {
    slug: "volatility-comparison-across-metals",
    locale: "en",
    seoTitle: "Gold vs Silver vs Platinum Volatility: Which Swings Most?",
    metaDescription:
      "Silver is 50-80% more volatile than gold, platinum even more. Compare annualized volatility across all precious metals with 10-year data and sizing tips.",
    faq: [
      { question: "Which precious metal is the most volatile?", answer: "Platinum is typically the most volatile precious metal, followed closely by silver. Both show 50-80% higher annualized volatility than gold over 10-year periods." },
      { question: "Is silver more volatile than gold?", answer: "Yes. Silver's annualized volatility is roughly 1.5x that of gold. Silver tends to rise more in bull markets but fall harder in downturns." },
      { question: "Why is gold less volatile than silver?", answer: "Gold's deep liquidity ($150B+ daily volume), central bank holdings, and reserve-asset status all reduce its volatility compared to silver's smaller, more industrial market." },
    ],
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
    seoTitle: "VAT on Gold in the EU: Tax Exemption Guide [2026]",
    metaDescription:
      "Investment gold is VAT-exempt across the EU under Directive 98/80/EC. Silver and platinum are NOT exempt. Country-by-country VAT rates and rules.",
  },
  {
    slug: "troy-ounce-explained",
    locale: "en",
    seoTitle: "Troy Ounce Explained: Weight, History & Conversion",
    metaDescription:
      "A troy ounce equals 31.1035g, about 10% heavier than a regular ounce (28.35g). Why precious metals use the troy system and how to convert units.",
    faq: [
      { question: "How many grams is a troy ounce?", answer: "A troy ounce equals 31.1035 grams, which is about 10% heavier than a regular (avoirdupois) ounce of 28.3495 grams." },
      { question: "Why do precious metals use troy ounces?", answer: "The troy system originated in Troyes, France, a medieval trading hub. It became the standard for precious metals because it provides a more precise weight measurement than the avoirdupois system." },
      { question: "How many troy ounces in a kilogram?", answer: "There are approximately 32.1507 troy ounces in one kilogram. This is a key conversion when comparing gold prices quoted per ounce vs per kilogram." },
    ],
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
    seoTitle: "Tail Risk Hedging With Gold Options: Strategy Guide",
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
    faq: [
      { question: "What makes gold the most malleable metal?", answer: "Gold's face-centered cubic crystal structure allows atomic layers to slide over each other without breaking bonds. Relativistic effects on gold's electrons further weaken metallic bonds, enhancing malleability." },
      { question: "How thin can gold be hammered?", answer: "Gold can be beaten into gold leaf as thin as 0.1 micrometers (100 nanometers). A single gram of gold can cover approximately 1 square meter." },
      { question: "Is gold more malleable than silver?", answer: "Yes. Gold is the most malleable of all metals, followed by silver, then platinum. Gold's unique electron structure gives it superior malleability." },
    ],
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
    seoTitle: "Gold to Silver Ratio 2024-2026: Current Analysis",
    metaDescription:
      "The gold-to-silver ratio averaged ~85:1 in 2024. Is silver undervalued? Current levels vs historical averages, and trading opportunities.",
  },
  {
    slug: "slv-ishares-silver-trust",
    locale: "en",
    seoTitle: "SLV iShares Silver Trust: How It Works [2026]",
    metaDescription:
      "The SLV ETF holds physical silver in London vaults. How the trust works, expense ratio, NAV tracking, and whether SLV is a good way to own silver.",
    faq: [
      { question: "Does SLV hold physical silver?", answer: "Yes. The iShares Silver Trust (SLV) holds physical silver bars in JPMorgan vaults in London. Each share represents approximately 0.92 oz of silver." },
      { question: "What is SLV's expense ratio?", answer: "SLV charges an annual expense ratio of 0.50%, which is deducted by selling a small amount of the trust's silver over time." },
      { question: "Is SLV a good way to invest in silver?", answer: "SLV offers convenient silver exposure through a brokerage account. However, it carries counterparty risk and you don't own the silver directly, unlike buying physical bars or coins." },
    ],
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
    faq: [
      { question: "What does PCGS stand for?", answer: "PCGS stands for Professional Coin Grading Service, founded in 1986 in California. It's one of the two most trusted third-party coin grading services worldwide." },
      { question: "How much does PCGS grading cost?", answer: "PCGS grading starts at $22/coin for Economy tier (30+ business days). Express and Walk-Through services cost $65-300+ with 2-15 day turnaround." },
      { question: "What is a PCGS MS70 coin worth?", answer: "An MS70 grade means the coin is flawless. Value varies by coin type, but the MS70 designation typically adds a 5-50x premium over raw (ungraded) examples." },
    ],
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
    seoTitle: "How to Sell Scrap Gold: Step-by-Step [2026 Prices]",
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
    seoTitle: "Largest Gold Mining Companies [2026 Rankings]",
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
    seoTitle: "Gold Mining Cost (AISC): What It Costs to Mine Gold",
    metaDescription:
      "The all-in sustaining cost (AISC) of gold mining averages $1,200-1,400/oz. What AISC includes, how it varies by mine, and why it sets a gold price floor.",
    faq: [
      { question: "What is AISC in gold mining?", answer: "AISC (All-In Sustaining Cost) is the total cost to produce one ounce of gold, including mining, processing, administration, exploration, and sustaining capital. The industry average is $1,200-1,400/oz." },
      { question: "What happens if gold price falls below AISC?", answer: "If the gold price drops below AISC, mines become unprofitable and start closing. This reduces supply, which eventually pushes prices back up. AISC acts as a long-term price floor." },
      { question: "Which gold mining company has the lowest AISC?", answer: "As of 2026, companies like Newmont and Agnico Eagle report among the lowest AISCs in the industry, typically around $1,000-1,100/oz for their best mines." },
    ],
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
    seoTitle: "Gold Storage Costs: Vault vs Home vs Bank [2026]",
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
  {
    slug: "platinum-density",
    locale: "en",
    seoTitle: "Platinum Density: 21.45 g/cm³ — Heaviest Precious Metal",
    metaDescription:
      "Platinum has a density of 21.45 g/cm³, making it the densest precious metal — 11% denser than gold. Why platinum's weight matters for authenticity testing.",
  },
  {
    slug: "palladium-in-catalytic-converters",
    locale: "en",
    seoTitle: "Palladium in Catalytic Converters: Why It's Used",
    metaDescription:
      "Over 80% of palladium demand comes from catalytic converters. How palladium converts harmful emissions, why it replaced platinum, and EV impact on demand.",
  },
  {
    slug: "fiat-money-explained",
    locale: "en",
    seoTitle: "What Is Fiat Money? Definition & How It Works",
    metaDescription:
      "Fiat money is currency not backed by gold or commodities — its value comes from government decree. How fiat differs from the gold standard, with examples.",
    faq: [
      { question: "What is fiat money in simple terms?", answer: "Fiat money is government-issued currency that isn't backed by a physical commodity like gold. Its value comes from the public's trust in the government and the economy, not from intrinsic material worth." },
      { question: "What is an example of fiat money?", answer: "The US Dollar, Euro, British Pound, Japanese Yen, and Chinese Yuan are all fiat currencies. Every major world currency today is fiat money since Nixon ended the gold standard in 1971." },
      { question: "Why is it called fiat money?", answer: "'Fiat' comes from Latin meaning 'let it be done.' Fiat money has value because the government decrees it to be legal tender, not because it contains or represents precious metals." },
    ],
  },
  {
    slug: "gold-standard-vs-fiat-money",
    locale: "en",
    seoTitle: "Gold Standard vs Fiat Money: Key Differences",
    metaDescription:
      "The gold standard pegged currencies to gold; fiat money has no backing. Compare both systems: stability, inflation risk, history, and why we switched.",
  },
  {
    slug: "karat-system-for-gold",
    locale: "en",
    seoTitle: "Gold Karats Explained: 24K, 22K, 18K, 14K Compared",
    metaDescription:
      "24K is pure gold (99.9%), 22K is 91.7%, 18K is 75%, 14K is 58.3%. What karat means, how purity affects price and durability, and which to buy.",
    faq: [
      { question: "What karat is pure gold?", answer: "24 karat (24K) is pure gold at 99.9% purity. It's the softest and most valuable form but too soft for most jewelry, which is why 18K and 14K alloys are more common." },
      { question: "What does karat mean for gold?", answer: "Karat measures gold purity on a scale of 1 to 24. Each karat represents 1/24th purity — so 18K gold is 18/24 = 75% pure gold, with the rest being alloy metals like copper or silver." },
      { question: "Is 18K or 14K gold better?", answer: "18K gold (75% pure) has a richer color and higher value, but 14K gold (58.3% pure) is more durable and affordable. For daily-wear jewelry, 14K is often recommended." },
    ],
  },
  {
    slug: "sterling-silver-explained",
    locale: "en",
    seoTitle: "Sterling Silver (925): Composition & Properties",
    metaDescription:
      "Sterling silver is 92.5% pure silver and 7.5% copper alloy, marked as .925. Why it's stronger than fine silver, how to identify it, and caring for it.",
    faq: [
      { question: "What is sterling silver made of?", answer: "Sterling silver is an alloy of 92.5% pure silver and 7.5% other metals (usually copper). The .925 stamp indicates this composition." },
      { question: "What does 925 mean on silver?", answer: "The 925 hallmark means the piece is sterling silver — 92.5% pure silver. This is the international standard for silver quality in jewelry and silverware." },
      { question: "Is sterling silver real silver?", answer: "Yes. Sterling silver contains 92.5% real silver. It's slightly less pure than fine silver (.999) but much more durable for jewelry and everyday use." },
    ],
  },
  {
    slug: "precious-vs-base-metals",
    locale: "en",
    seoTitle: "Precious Metals vs Base Metals: Key Differences",
    metaDescription:
      "Precious metals (gold, silver, platinum) are rare and corrosion-resistant. Base metals (copper, zinc, nickel) are common and reactive. Full comparison.",
  },
  {
    slug: "silvers-thermal-conductivity",
    locale: "en",
    seoTitle: "Silver's Thermal Conductivity: Highest of Any Metal",
    metaDescription:
      "Silver has the highest thermal conductivity at 429 W/m·K. Why silver conducts heat better than copper or gold, and how to use the ice test at home.",
  },
  {
    slug: "gold-in-quartz-veins",
    locale: "en",
    seoTitle: "Gold in Quartz Veins: How It Forms & How to Find It",
    metaDescription:
      "Gold deposits in quartz veins form when hot mineral-rich fluids cool in rock fractures. How to identify gold-bearing quartz, where to look, and extraction.",
  },
  {
    slug: "gold-vs-cpi-over-time",
    locale: "en",
    seoTitle: "Gold vs CPI: 50-Year Inflation Chart & Data",
    metaDescription:
      "Has gold kept up with inflation? Compare gold prices vs the Consumer Price Index from 1970 to 2025. Data shows gold outpaced CPI in most long-term periods.",
    faq: [
      { question: "Does gold beat inflation over time?", answer: "Over 50-year periods, gold has generally outpaced CPI inflation. However, in shorter periods (10-20 years), gold can significantly underperform or overperform depending on the starting point." },
      { question: "What is the correlation between gold and CPI?", answer: "Gold has a moderate positive correlation with CPI over the long term, but the relationship is noisy short-term. Gold tends to spike during inflationary surprises rather than tracking CPI linearly." },
    ],
  },
  {
    slug: "the-cot-report-for-gold-reading-commitment-of-traders-data",
    locale: "en",
    seoTitle: "COT Report for Gold: How to Read Futures Positioning",
    metaDescription:
      "The CFTC Commitment of Traders report shows who holds gold futures — commercials, speculators, and small traders. How to read COT data and spot contrarian signals.",
    faq: [
      { question: "What is the COT report for gold?", answer: "The COT (Commitment of Traders) report, published weekly by the CFTC, shows the net long/short positions of commercial hedgers, large speculators, and small traders in gold futures markets." },
      { question: "How do you use the COT report to trade gold?", answer: "Extreme speculator long positions are contrarian bearish, while extreme short positions are contrarian bullish. Most traders look for COT extremes combined with price action confirmation." },
    ],
  },
  {
    slug: "swiss-gold-refining-hub",
    locale: "en",
    seoTitle: "Why Switzerland Refines 70% of the World's Gold",
    metaDescription:
      "Switzerland processes over 2,000 tonnes of gold annually. Why Valcambi, PAMP Suisse, and Argor-Heraeus chose Switzerland as the global gold refining hub.",
    faq: [
      { question: "Why is Switzerland the world's largest gold refiner?", answer: "Switzerland's combination of political neutrality, strong banking secrecy, skilled workforce, central European location, and centuries of trade in precious metals made it the natural hub for global gold refining." },
      { question: "What are the main gold refineries in Switzerland?", answer: "The four major Swiss refineries are Valcambi (in Balerna), PAMP Suisse (in Castel San Pietro), Argor-Heraeus (in Mendrisio), and MKS PAMP. Together they process roughly 70% of global gold supply." },
    ],
  },
  {
    slug: "assignats-and-inflation",
    locale: "en",
    seoTitle: "French Assignats: Paper Money Hyperinflation Case Study",
    metaDescription:
      "France's assignats (1789-1796) collapsed to near zero after massive money printing. What the world's first paper hyperinflation teaches gold investors.",
  },
  {
    slug: "sterling-silver-definition",
    locale: "en",
    seoTitle: "Sterling Silver (925): Composition & How to Identify It",
    metaDescription:
      "Sterling silver is 92.5% pure silver alloyed with 7.5% copper. How to spot the 925 hallmark, why pure silver is too soft, and care tips.",
    faq: [
      { question: "What does 925 mean on silver?", answer: "The 925 stamp means the item is sterling silver — 92.5% pure silver and 7.5% copper or other metals. This is the international standard for sterling silver." },
      { question: "Is sterling silver real silver?", answer: "Yes. Sterling silver is real silver (92.5% pure). Pure silver (99.9%) is too soft for jewelry, so copper is added for durability while maintaining silver's beauty." },
    ],
  },
  {
    slug: "karat-definition",
    locale: "en",
    seoTitle: "Karat in Gold: 24K, 18K, 14K Purity Explained",
    metaDescription:
      "Karat measures gold purity: 24K is 99.99% pure, 18K is 75%, 14K is 58.3%. How the karat system works and which karat is best for your needs.",
    faq: [
      { question: "What karat is pure gold?", answer: "24 karat (24K) gold is the purest form at 99.99% gold content. It is too soft for most jewelry but preferred for investment bars and coins." },
      { question: "What is the difference between karat and carat?", answer: "Karat (K) measures gold purity on a 24-point scale. Carat (ct) measures gemstone weight (1 carat = 0.2 grams). Different systems, different materials." },
    ],
  },
  {
    slug: "troy-ounce-definition",
    locale: "en",
    seoTitle: "Troy Ounce: Why Precious Metals Use a Different Ounce",
    metaDescription:
      "A troy ounce (31.1g) is 10% heavier than a regular ounce (28.35g). Why gold and silver use the troy system from medieval France.",
  },
  {
    slug: "fiat-money-definition",
    locale: "en",
    seoTitle: "Fiat Money: Why It Has Value Without Gold Backing",
    metaDescription:
      "Fiat money derives value from government decree, not gold or silver. How fiat currencies work, their history, and why gold investors watch them closely.",
  },
  {
    slug: "paper-gold-definition",
    locale: "en",
    seoTitle: "Paper Gold: ETFs, Futures & Certificates Explained",
    metaDescription:
      "Paper gold includes ETFs, futures, and certificates that track gold prices without physical ownership. Pros, cons, and counterparty risk explained.",
  },
  {
    slug: "mintage-definition",
    locale: "en",
    seoTitle: "Mintage: How Production Numbers Affect Coin Value",
    metaDescription:
      "Mintage is the total number of coins struck by a mint. Lower mintage often means higher premiums. How to check mintage figures before buying.",
  },
  {
    slug: "base-metal-definition",
    locale: "en",
    seoTitle: "Base Metals vs Precious Metals: Key Differences",
    metaDescription:
      "Base metals (copper, zinc, nickel, aluminum) oxidize and corrode, unlike precious metals. Properties, uses, and why the distinction matters for investors.",
  },
  {
    slug: "ignoring-storage-and-insurance-costs",
    locale: "en",
    seoTitle: "Hidden Costs of Owning Physical Gold & Silver",
    metaDescription:
      "Storage costs 0.12-0.50% per year and insurance adds 0.5-1%. These hidden expenses can eat 5-10% of returns over a decade. Full cost breakdown inside.",
    faq: [
      { question: "How much does it cost to store gold?", answer: "Professional vault storage costs 0.12% to 0.50% per year of metal value. Bank safe deposit boxes range from $50 to $400+ per year depending on size and location." },
      { question: "Do I need insurance for gold stored at home?", answer: "Yes. Standard homeowner's insurance typically covers only $200-1,000 of precious metals. A separate rider or floater policy costs roughly 0.5-1% of the metal's value annually." },
    ],
  },
  {
    slug: "bullionvault-storage-model",
    locale: "en",
    seoTitle: "BullionVault: How Allocated Storage Works [2026]",
    metaDescription:
      "BullionVault stores allocated gold in London, Zurich, New York, Toronto, and Singapore from 0.12%/year. How the platform, fees, and daily audits work.",
  },
  {
    slug: "hyperinflation-and-precious-metals",
    locale: "en",
    seoTitle: "Gold & Silver in Hyperinflation: Historical Evidence",
    metaDescription:
      "During Zimbabwe's hyperinflation, a gold coin could buy months of food. Historical evidence from Weimar, Zimbabwe, and Venezuela on precious metals as hedges.",
  },
  {
    slug: "rose-gold-composition",
    locale: "en",
    seoTitle: "Rose Gold Alloy: Copper Ratio & Why It Turns Pink",
    metaDescription:
      "Rose gold is 75% gold + 22.25% copper + 2.75% silver (18K). The copper creates the pink hue. How different gold-copper ratios change the color.",
  },
  {
    slug: "silver-conductivity-record",
    locale: "en",
    seoTitle: "Silver: The Best Electrical Conductor of All Metals",
    metaDescription:
      "Silver has the highest electrical and thermal conductivity of any element. Why it outperforms copper, its role in solar panels and electronics.",
    faq: [
      { question: "Is silver a better conductor than copper?", answer: "Yes. Silver's electrical conductivity is 6.3 × 10⁷ S/m vs copper's 5.96 × 10⁷ S/m. Silver is ~6% more conductive but much more expensive, so copper is used in most wiring." },
      { question: "Why is silver used in solar panels?", answer: "Silver paste forms the conductive pathways in photovoltaic cells due to its superior conductivity. Each solar panel uses about 20g of silver. Solar demand consumes ~15% of annual silver supply." },
    ],
  },

  // ───────── NEW BATCH: High-impression pages from GSC March 2026 ─────────
  {
    slug: "above-ground-gold-stock",
    locale: "en",
    seoTitle: "Total Above-Ground Gold Stock [2026]: Tonnes & Value",
    metaDescription:
      "The world holds ~212,000 tonnes of above-ground gold worth over $16 trillion in 2026. Breakdown by jewelry, central banks, ETFs, and industrial use.",
    faq: [
      { question: "How much gold has been mined in total?", answer: "As of 2026, approximately 212,000 tonnes of gold have been mined throughout history. This would form a cube roughly 22 meters on each side." },
      { question: "What is the total value of all above-ground gold?", answer: "At current 2026 prices, the total above-ground gold stock is worth over $16 trillion — roughly the GDP of the European Union." },
      { question: "How much new gold is mined each year?", answer: "Annual gold mine production is approximately 3,500-3,700 tonnes, adding about 1.5-2% to the existing above-ground stock each year." },
    ],
  },
  {
    slug: "platinum-supply-constraints",
    locale: "en",
    seoTitle: "Platinum Supply Risk: South Africa's 70% Dominance",
    metaDescription:
      "South Africa produces ~70% of global platinum, creating massive supply concentration risk. Geopolitical factors, mine disruptions, and what it means for prices.",
    faq: [
      { question: "Why is platinum supply so concentrated?", answer: "The Bushveld Complex in South Africa contains roughly 70% of known platinum reserves. Russia's Norilsk region holds another ~12%. This concentration creates significant geopolitical supply risk." },
      { question: "What disrupts platinum supply?", answer: "South African mine strikes, power outages (Eskom), regulatory changes, and declining ore grades all affect supply. The 2014 five-month strike cut production by over 1 million ounces." },
    ],
  },
  {
    slug: "silver-volatility",
    locale: "en",
    seoTitle: "Silver Volatility: Why Silver Swings More Than Gold",
    metaDescription:
      "Silver is 1.5x more volatile than gold, with 25-35% annualized moves vs gold's 15-20%. The market structure, industrial demand, and thin liquidity that drive it.",
  },
  {
    slug: "silver-photography-demand-decline",
    locale: "en",
    seoTitle: "Silver in Photography: Rise, Peak & Digital Decline",
    metaDescription:
      "Photography once consumed 25% of silver supply. Digital cameras killed that demand from ~6,000 tonnes/year in 1999 to under 1,000 today. The full timeline.",
  },
  {
    slug: "vat-on-silver-in-europe",
    locale: "en",
    seoTitle: "VAT on Silver in Europe: Country-by-Country [2026]",
    metaDescription:
      "Unlike gold, silver is NOT VAT-exempt in the EU. Rates range from 0% (Estonia, Poland margin scheme) to 27% (Hungary). Full country-by-country silver VAT guide.",
    faq: [
      { question: "Is silver VAT-free in Europe?", answer: "No. Unlike investment gold, silver bullion is subject to VAT in most EU countries. Standard VAT rates apply (19-27%), though some countries offer margin schemes or exemptions for investment-grade coins." },
      { question: "Which European country has the lowest VAT on silver?", answer: "Estonia (0% on investment silver coins) and Poland (margin scheme available) offer the lowest effective rates. Germany applies 19% but some dealers use the differential taxation scheme." },
    ],
  },
  {
    slug: "gold-during-2020-pandemic",
    locale: "en",
    seoTitle: "Gold During COVID-19: 2020 Performance & Lessons",
    metaDescription:
      "Gold hit $2,075/oz in August 2020 — a 25% gain during the pandemic. The March crash, recovery rally, and why gold outperformed most assets in COVID.",
    faq: [
      { question: "Did gold go up during COVID-19?", answer: "Yes. Gold rose ~25% in 2020, hitting an all-time high of $2,075/oz in August. After a brief dip in March 2020 (liquidity crisis), gold rallied sharply on massive monetary stimulus." },
      { question: "Why did gold drop in March 2020?", answer: "Gold fell ~12% in early March 2020 as investors sold everything for cash during the liquidity panic. Once the Fed announced unlimited QE, gold reversed and surged to new highs." },
    ],
  },
  {
    slug: "gold-price-in-japanese-yen-all-time-highs-and-the-weak-yen-story",
    locale: "en",
    seoTitle: "Gold Price in Japanese Yen: Record Highs & Weak Yen",
    metaDescription:
      "Gold in yen hit record highs above ¥14,000/gram in 2024-2026 as the yen weakened past 150/USD. Why Japanese investors flock to gold and what it signals.",
  },
  {
    slug: "china-pboc-gold-buying",
    locale: "en",
    seoTitle: "China PBOC Gold Buying: Why China Stockpiles Gold",
    metaDescription:
      "China's central bank added 300+ tonnes of gold in 2023-2024, the biggest buying spree in decades. Dedollarization, reserves strategy, and impact on prices.",
  },
  {
    slug: "segregated-vs-commingled-storage-whats-the-difference",
    locale: "en",
    seoTitle: "Segregated vs Commingled Gold Storage Explained",
    metaDescription:
      "Segregated storage keeps your exact bars separate; commingled pools them. Cost, risk, insurance, and which is safer for your precious metals investment.",
    faq: [
      { question: "What is segregated gold storage?", answer: "In segregated storage, your specific gold bars are stored separately and individually identified. You can request delivery of those exact bars. It costs more but eliminates pool risk." },
      { question: "Is commingled storage safe?", answer: "Commingled storage pools your gold with other investors' holdings. You own a share, not specific bars. It's cheaper (0.12-0.20%/year) but carries slightly more counterparty risk than segregated." },
    ],
  },
  {
    slug: "inflation-expectations-vs-actual-inflation",
    locale: "en",
    seoTitle: "Inflation Expectations vs Actual CPI: Gold Reacts to Both",
    metaDescription:
      "Gold responds more to inflation expectations (TIPS breakeven) than actual CPI releases. The spread between expected and real inflation drives gold moves.",
  },
  {
    slug: "lbma-gold-price-process",
    locale: "en",
    seoTitle: "LBMA Gold Price: How the Benchmark Is Set Daily",
    metaDescription:
      "The LBMA Gold Price is set twice daily via electronic auction by ICE Benchmark Administration. How the process works, who participates, and why it matters.",
  },
  {
    slug: "silver-as-leveraged-gold",
    locale: "en",
    seoTitle: "Silver as Leveraged Gold: Why Silver Moves 1.5-2x",
    metaDescription:
      "Silver amplifies gold's moves by 1.5-2x in both directions. The beta relationship, market mechanics, and how traders use silver as leveraged gold exposure.",
    faq: [
      { question: "Is silver a leveraged play on gold?", answer: "Yes. Silver historically moves 1.5-2x as much as gold in both directions. When gold rises 10%, silver often gains 15-20%. This leverage works in reverse during sell-offs." },
      { question: "Why does silver move more than gold?", answer: "Silver's smaller market ($1.4T vs gold's $13T+), dual industrial-monetary demand, and thinner liquidity create higher volatility. Speculative flows amplify moves in this smaller market." },
    ],
  },
  {
    slug: "silver-industrial-demand-growth",
    locale: "en",
    seoTitle: "Silver Industrial Demand: Solar, 5G & EV Growth",
    metaDescription:
      "Over 50% of silver demand is industrial. Solar panels, 5G technology, and EVs are driving record consumption. How growing industrial use affects silver prices.",
    faq: [
      { question: "How much silver is used in solar panels?", answer: "Each solar panel uses about 20g of silver paste for conductive pathways. The solar industry consumed ~170 million ounces in 2024, roughly 15% of total silver demand — and growing fast." },
      { question: "Will 5G increase silver demand?", answer: "Yes. 5G infrastructure requires silver in antennas, circuits, and connectors. The rollout of millions of 5G base stations globally is expected to add meaningful new silver demand through 2030." },
    ],
  },
  {
    slug: "comparing-vault-storage-services",
    locale: "en",
    seoTitle: "Best Gold Vault Storage Services Compared [2026]",
    metaDescription:
      "Compare BullionVault, GoldMoney, Brinks, and Loomis. Fees (0.12-0.50%/year), jurisdictions, insurance, allocated vs unallocated, and how to choose.",
  },
  {
    slug: "etf-creation-and-redemption",
    locale: "en",
    seoTitle: "How Gold ETF Creation & Redemption Works",
    metaDescription:
      "Authorized participants create ETF shares by depositing gold bars and redeem shares for physical metal. The mechanism that keeps gold ETFs tracking spot price.",
  },
  {
    slug: "understanding-gold-forward-curves",
    locale: "en",
    seoTitle: "Gold Forward Curves: Contango, Backwardation & GOFO",
    metaDescription:
      "Gold forwards trade in contango when rates are positive, flipping to backwardation during stress. How to read forward curves and what they signal.",
  },
  {
    slug: "gold-2024-record-highs",
    locale: "en",
    seoTitle: "Gold 2024 Record Highs: What Drove $2,400+ Prices",
    metaDescription:
      "Gold broke through $2,400/oz in 2024, setting multiple all-time records. Central bank buying, rate cut expectations, and geopolitics drove the historic rally.",
  },
  {
    slug: "tael-and-tola-explained",
    locale: "en",
    seoTitle: "Tael & Tola: Asian Gold Weight Units Explained",
    metaDescription:
      "A tael equals ~37.5g (Hong Kong) and a tola equals ~11.66g (India). How gold is weighed in Asia, regional variations, and conversion tables.",
  },

  // ───────── SPANISH (es) ─────────
  {
    slug: "coin-grading-scale-ms-pf",
    locale: "es",
    seoTitle: "Escala de Clasificación de Monedas: MS70 a Good",
    metaDescription:
      "Escala completa de MS70 (perfecto) a Good (G-4). Cómo PCGS y NGC clasifican monedas, qué significa cada grado y cómo afectan al valor.",
  },
  {
    slug: "hyperinflation-episodes-and-gold",
    locale: "es",
    seoTitle: "Oro en Hiperinflación: Weimar, Zimbabue y Venezuela",
    metaDescription:
      "¿Cómo rindió el oro durante la hiperinflación de Weimar, Zimbabue y Venezuela? Datos históricos muestran que preservó riqueza cuando las divisas colapsaron.",
  },
  {
    slug: "silver-chemical-symbol-ag",
    locale: "es",
    seoTitle: "¿Por Qué el Símbolo de la Plata es Ag? Origen",
    metaDescription:
      "El símbolo químico Ag de la plata proviene del latín 'argentum'. Número atómico 47, propiedades únicas y por qué la tabla periódica usa Ag.",
  },
  {
    slug: "gold-price-by-decade-1970s-through-2020s",
    locale: "es",
    seoTitle: "Precio del Oro por Década: de 1970 a 2020",
    metaDescription:
      "Historia del precio del oro desde $35/oz en 1970 hasta más de $2,000 en 2020. Gráficos por década y análisis de qué impulsó cada era.",
  },
  {
    slug: "comparing-gold-etfs-in-europe",
    locale: "es",
    seoTitle: "Mejores ETFs de Oro en Europa [2026]: Comparativa",
    metaDescription:
      "Compara los mejores ETFs de oro europeos: Xetra Gold, iShares Physical Gold e Invesco. Comisiones, estructura, respaldo físico y cómo elegir.",
  },
  {
    slug: "ppi-and-gold-correlation",
    locale: "es",
    seoTitle: "Cómo Afecta el PPI al Precio del Oro: Correlación",
    metaDescription:
      "Un PPI mayor al esperado señala inflación creciente y puede impulsar el oro. Correlación PPI-oro, datos históricos y estrategias de inversión.",
  },
  {
    slug: "volatility-comparison-across-precious-metals",
    locale: "es",
    seoTitle: "Oro vs Plata vs Platino: Volatilidad Comparada",
    metaDescription:
      "La plata es ~1,5x más volátil que el oro, mientras el platino lidera. Datos de volatilidad anualizada a 10 años y su impacto en tu cartera.",
  },
  {
    slug: "volatility-comparison-across-metals",
    locale: "es",
    seoTitle: "Oro vs Plata vs Platino: ¿Qué Metal Oscila Más?",
    metaDescription:
      "La plata es un 50-80% más volátil que el oro y el platino supera a ambos. Volatilidad anualizada histórica de los 4 metales preciosos y cómo afecta tu cartera.",
  },
  {
    slug: "gold-volatility-index-gvz",
    locale: "es",
    seoTitle: "Índice de Volatilidad del Oro (GVZ) del CBOE",
    metaDescription:
      "El GVZ mide la volatilidad esperada del oro a 30 días usando opciones del GLD. Cómo se calcula, qué señalan sus lecturas y cómo usarlo.",
  },
  {
    slug: "gold-chemical-symbol-au",
    locale: "es",
    seoTitle: "¿Por Qué el Símbolo del Oro es Au? Origen Latino",
    metaDescription:
      "El símbolo químico Au del oro proviene del latín 'aurum' (amanecer brillante). Número atómico 79, configuración electrónica y propiedades únicas.",
  },
  {
    slug: "vat-on-gold-in-the-eu",
    locale: "es",
    seoTitle: "IVA del Oro en la UE: Guía de Exención Fiscal",
    metaDescription:
      "El oro de inversión está exento de IVA en toda la UE (Directiva 98/80/CE). Plata y platino NO están exentos. Tipos por país y reglas.",
  },
  {
    slug: "troy-ounce-explained",
    locale: "es",
    seoTitle: "Onza Troy: Peso, Historia y Conversión",
    metaDescription:
      "Una onza troy equivale a 31,1035 g, un 10% más pesada que la onza común (28,35 g). Por qué los metales preciosos usan este sistema y cómo convertir.",
  },
  {
    slug: "the-bretton-woods-system-explained-gold-at-35-per-ounce",
    locale: "es",
    seoTitle: "Sistema Bretton Woods: El Oro a $35 por Onza",
    metaDescription:
      "Cómo el acuerdo de 1944 fijó el oro a $35/oz e hizo del dólar la moneda de reserva mundial. Por qué Nixon lo terminó en 1971.",
  },
  {
    slug: "tail-risk-hedging-with-gold-options",
    locale: "es",
    seoTitle: "Cobertura de Riesgo de Cola con Opciones de Oro",
    metaDescription:
      "Usa opciones put y call de oro para proteger carteras contra eventos cisne negro. Estrategias prácticas, análisis de costes y cuándo cubrir.",
  },
  {
    slug: "liquidity-comparison-across-metals",
    locale: "es",
    seoTitle: "Oro vs Plata vs Platino: Liquidez Comparada",
    metaDescription:
      "El oro se negocia más de $150.000M/día, siendo el metal más líquido. Compara profundidad de mercado, spreads y costes de trading.",
  },
  {
    slug: "liquidity-comparison-across-precious-metals",
    locale: "es",
    seoTitle: "Ranking de Liquidez de Metales Preciosos: Guía",
    metaDescription:
      "Ordenados por volumen diario: oro > plata > platino > paladio. Cómo la liquidez afecta a spreads, slippage y decisiones de inversión.",
  },
  {
    slug: "gold-isotopes",
    locale: "es",
    seoTitle: "Isótopos del Oro: Por Qué el Au-197 es el Único Estable",
    metaDescription:
      "El oro tiene un solo isótopo estable: Au-197. Los 37 isótopos conocidos, por qué Au-197 es único y los usos médicos de isótopos radiactivos.",
  },
  {
    slug: "historical-gold-silver-ratio-chart",
    locale: "es",
    seoTitle: "Ratio Oro/Plata: Gráfico Histórico y Análisis",
    metaDescription:
      "El ratio oro/plata varió de 1:2,5 en el Antiguo Egipto a más de 120:1 en 2020. Gráfico histórico, extremos clave y cuándo intercambiar.",
  },
  {
    slug: "malleability-of-gold",
    locale: "es",
    seoTitle: "¿Por Qué el Oro es Tan Maleable? La Ciencia",
    metaDescription:
      "El oro es el metal más maleable: 1 gramo se puede laminar hasta cubrir 1 m². La estructura atómica que lo hace únicamente dúctil y formable.",
  },
  {
    slug: "bear-markets-and-gold",
    locale: "es",
    seoTitle: "El Oro en Mercados Bajistas: Datos Históricos",
    metaDescription:
      "El oro subió un 25% en la crisis de 2008 y un 18% en el crash del COVID en 2020. Rendimiento del oro en cada caída bursátil importante desde 1970.",
  },
  {
    slug: "gold-silver-ratio-2024-analysis",
    locale: "es",
    seoTitle: "Ratio Oro/Plata 2024-2026: Análisis Actual",
    metaDescription:
      "El ratio oro/plata promedió ~85:1 en 2024. ¿Está la plata infravalorada? Niveles actuales vs medias históricas y oportunidades de trading.",
  },
  {
    slug: "slv-ishares-silver-trust",
    locale: "es",
    seoTitle: "SLV iShares Silver Trust: Cómo Funciona",
    metaDescription:
      "El ETF SLV posee plata física en bóvedas de Londres. Cómo funciona, ratio de gastos, seguimiento del NAV y si es buena forma de invertir en plata.",
  },
  {
    slug: "physical-properties-of-gold",
    locale: "es",
    seoTitle: "Propiedades Físicas del Oro: Densidad, Color y Más",
    metaDescription:
      "Densidad del oro: 19,32 g/cm³, punto de fusión: 1.064°C, y es el metal más maleable. Guía completa de propiedades físicas y químicas del oro.",
  },
  {
    slug: "counterparty-risk-in-precious-metals",
    locale: "es",
    seoTitle: "Riesgo de Contraparte en Metales Preciosos",
    metaDescription:
      "El oro físico no tiene riesgo de contraparte. ETFs, futuros y oro papel sí implican riesgos de custodios, brokers y bolsas. Diferencias explicadas.",
  },
  {
    slug: "american-gold-eagle",
    locale: "es",
    seoTitle: "American Gold Eagle: Peso, Pureza y Guía de Compra",
    metaDescription:
      "El American Gold Eagle contiene 1 oz de oro de 22K (91,67% puro). Tamaños, primas, diseños y por qué es la moneda de oro más popular del mundo.",
  },
  {
    slug: "money-supply-m2-and-gold",
    locale: "es",
    seoTitle: "Masa Monetaria M2 y Oro: La Relación Clave",
    metaDescription:
      "Cuando la M2 crece más rápido que el PIB, el oro sube como cobertura contra la devaluación. Datos históricos, gráficos y análisis de correlación.",
  },
  {
    slug: "physical-properties-of-silver",
    locale: "es",
    seoTitle: "Propiedades Físicas de la Plata: Guía Completa",
    metaDescription:
      "La plata tiene la mayor conductividad eléctrica y térmica de todos los elementos. Densidad 10,49 g/cm³, punto de fusión 961,8°C y más.",
  },
  {
    slug: "pcgs-coin-grading-explained",
    locale: "es",
    seoTitle: "Clasificación PCGS: Cómo Funciona y Qué Significan los Grados",
    metaDescription:
      "PCGS clasifica monedas de Poor (P-1) a Perfect Mint State (MS-70). Proceso de envío, tarifas, tipos de cápsulas y cómo los grados afectan al valor.",
  },
  {
    slug: "corrosion-resistance-across-precious-metals",
    locale: "es",
    seoTitle: "Resistencia a la Corrosión de Metales Preciosos",
    metaDescription:
      "Oro y platino resisten prácticamente toda corrosión. La plata se oxida y el paladio se degrada a altas temperaturas. Comparación completa.",
  },
  {
    slug: "negative-real-rates-bull-case-for-gold",
    locale: "es",
    seoTitle: "Tipos de Interés Reales Negativos: Por Qué Sube el Oro",
    metaDescription:
      "Cuando los tipos reales son negativos, el oro sube. La relación inversa, datos históricos y por qué es la señal alcista número 1 para el oro.",
  },
  {
    slug: "how-to-sell-scrap-gold",
    locale: "es",
    seoTitle: "Cómo Vender Oro Usado: Guía Paso a Paso",
    metaDescription:
      "Obtén el mejor precio vendiendo oro usado. Compara casas de empeño, compradores online y refinadoras. Cómo afectan los quilates y errores a evitar.",
  },
  {
    slug: "gold-conductivity",
    locale: "es",
    seoTitle: "Conductividad del Oro: Propiedades Eléctricas y Térmicas",
    metaDescription:
      "El oro es el tercer metal más conductor tras plata y cobre. 45,2 MS/m de conductividad y resistencia a la corrosión lo hacen ideal para electrónica.",
  },
  {
    slug: "gold-mining-companies-overview",
    locale: "es",
    seoTitle: "Mayores Empresas Mineras de Oro [2026]",
    metaDescription:
      "Newmont, Barrick Gold y Agnico Eagle lideran la producción mundial. Los mayores mineros por producción, capitalización y costes AISC.",
  },
  {
    slug: "federal-reserve-and-gold",
    locale: "es",
    seoTitle: "La Reserva Federal y el Oro: Cómo la Fed Mueve Precios",
    metaDescription:
      "Subidas de tipos, QE, balance de la Fed — cómo las decisiones de la Reserva Federal afectan al oro. Patrones históricos y qué vigilar en cada FOMC.",
  },
  {
    slug: "cost-of-gold-production-aisc",
    locale: "es",
    seoTitle: "Coste de Producción del Oro (AISC): ¿Cuánto Cuesta Minar?",
    metaDescription:
      "El coste total (AISC) de la minería de oro promedia $1.200-1.400/oz. Qué incluye el AISC, cómo varía por mina y por qué marca un suelo de precio.",
  },
  {
    slug: "golds-atomic-structure",
    locale: "es",
    seoTitle: "Estructura Atómica del Oro: Por Qué Au es Único",
    metaDescription:
      "El oro (Au, número atómico 79) tiene una configuración electrónica única que le da su color y estabilidad química. Efectos relativistas explicados.",
  },
  {
    slug: "moving-averages-for-metals",
    locale: "es",
    seoTitle: "Medias Móviles del Oro: 50 y 200 Días Explicadas",
    metaDescription:
      "Las medias móviles de 50 y 200 días son señales clave del oro. Aprende cruces dorados, cruces de la muerte y cómo leer gráficos de medias móviles.",
  },
  {
    slug: "us-dollar-index-dxy-and-gold",
    locale: "es",
    seoTitle: "Índice del Dólar (DXY) y Oro: La Relación Inversa",
    metaDescription:
      "El oro y el índice del dólar suelen moverse en direcciones opuestas. Datos de correlación histórica, por qué existe la relación e implicaciones.",
  },
  {
    slug: "storage-costs-comparison",
    locale: "es",
    seoTitle: "Costes de Almacenamiento de Oro: Bóveda vs Casa vs Banco",
    metaDescription:
      "Almacenamiento profesional cuesta 0,12-0,50% anual. Compara cajas de seguridad bancarias, cajas fuertes domésticas y opciones de bóveda asignada.",
  },
  {
    slug: "gold-in-terms-of-purchasing-power",
    locale: "es",
    seoTitle: "Poder Adquisitivo del Oro a lo Largo del Tiempo",
    metaDescription:
      "Una onza de oro compraba un traje fino en 1920 — y sigue haciéndolo hoy. Cómo el oro preserva poder adquisitivo mientras las divisas fiat se erosionan.",
  },
  {
    slug: "noble-metals-concept",
    locale: "es",
    seoTitle: "¿Qué Son los Metales Nobles? Definición y Propiedades",
    metaDescription:
      "Los metales nobles (oro, plata, platino, paladio) resisten la oxidación y corrosión. Qué los hace 'nobles', la lista completa y su importancia práctica.",
  },
  {
    slug: "platinum-density",
    locale: "es",
    seoTitle: "Densidad del Platino: 21,45 g/cm³ — El Más Pesado",
    metaDescription:
      "El platino tiene una densidad de 21,45 g/cm³, un 11% más denso que el oro. Por qué el peso del platino importa para autenticar y su uso industrial.",
  },
  {
    slug: "palladium-in-catalytic-converters",
    locale: "es",
    seoTitle: "Paladio en Catalizadores: Por Qué Se Usa",
    metaDescription:
      "Más del 80% de la demanda de paladio proviene de catalizadores. Cómo convierte emisiones nocivas, por qué reemplazó al platino y el impacto de los EV.",
  },
  {
    slug: "karat-system-for-gold",
    locale: "es",
    seoTitle: "Quilates del Oro: 24K, 22K, 18K y 14K Comparados",
    metaDescription:
      "24K es oro puro (99,9%), 22K es 91,7%, 18K es 75%, 14K es 58,3%. Qué significan los quilates, cómo afectan al precio y cuál comprar.",
  },
  {
    slug: "sterling-silver-explained",
    locale: "es",
    seoTitle: "Plata de Ley (925): Composición y Propiedades",
    metaDescription:
      "La plata de ley es 92,5% plata pura y 7,5% cobre, marcada como .925. Por qué es más resistente que la plata fina, cómo identificarla y cuidarla.",
  },
  {
    slug: "precious-vs-base-metals",
    locale: "es",
    seoTitle: "Metales Preciosos vs Metales Base: Diferencias Clave",
    metaDescription:
      "Los metales preciosos (oro, plata, platino) son raros y resistentes a la corrosión. Los metales base (cobre, zinc, níquel) son comunes. Comparación completa.",
  },
  {
    slug: "gold-vs-cpi-over-time",
    locale: "es",
    seoTitle: "Oro vs IPC: Gráfico de Inflación a 50 Años",
    metaDescription:
      "¿Ha protegido el oro contra la inflación? Comparamos el precio del oro con el Índice de Precios al Consumo desde 1970. Datos históricos y análisis.",
  },
  {
    slug: "the-cot-report-for-gold-reading-commitment-of-traders-data",
    locale: "es",
    seoTitle: "Informe COT del Oro: Cómo Leer el Posicionamiento en Futuros",
    metaDescription:
      "El informe COT de la CFTC muestra quién tiene futuros de oro — coberturistas, especuladores, pequeños traders. Cómo interpretarlo y detectar señales contrarias.",
  },
  {
    slug: "swiss-gold-refining-hub",
    locale: "es",
    seoTitle: "Por Qué Suiza Refina el 70% del Oro Mundial",
    metaDescription:
      "Suiza procesa más de 2.000 toneladas de oro al año. Por qué Valcambi, PAMP Suisse y Argor-Heraeus eligieron Suiza como centro mundial de refinado de oro.",
  },
  {
    slug: "assignats-and-inflation",
    locale: "es",
    seoTitle: "Asignados Franceses: Caso de Estudio en Hiperinflación",
    metaDescription:
      "Los asignados de Francia (1789-1796) colapsaron hasta casi cero tras una impresión masiva de dinero. Qué enseña el primer caso de hiperinflación moderno.",
  },

  // ───────── GERMAN (de) — top 10 by impressions ─────────
  {
    slug: "coin-grading-scale-ms-pf",
    locale: "de",
    seoTitle: "Münzbewertungsskala: MS70 bis Good erklärt",
    metaDescription:
      "Komplette Münzbewertungsskala von MS70 (perfekt) bis Good (G-4). Wie PCGS und NGC Münzen bewerten, was jeder Grad bedeutet und den Wert beeinflusst.",
  },
  {
    slug: "volatility-comparison-across-precious-metals",
    locale: "de",
    seoTitle: "Gold vs Silber vs Platin: Volatilität im Vergleich",
    metaDescription:
      "Silber ist ~1,5x volatiler als Gold, Platin führt bei allen Edelmetallen. 10-Jahres-Volatilitätsdaten und was sie für Ihr Portfolio bedeuten.",
  },
  {
    slug: "comparing-gold-etfs-in-europe",
    locale: "de",
    seoTitle: "Beste Gold-ETFs Europa [2026]: Xetra vs iShares",
    metaDescription:
      "Vergleich der besten europäischen Gold-ETFs: Xetra Gold, iShares Physical Gold, Invesco. Gebühren, Struktur, physische Hinterlegung und Auswahl.",
  },
  {
    slug: "vat-on-gold-in-the-eu",
    locale: "de",
    seoTitle: "Mehrwertsteuer auf Gold in der EU: Steuerbefreiung",
    metaDescription:
      "Anlagegold ist EU-weit von der MwSt befreit (Richtlinie 98/80/EG). Silber und Platin sind NICHT befreit. MwSt-Sätze und Regeln pro Land.",
  },
  {
    slug: "storage-costs-comparison",
    locale: "de",
    seoTitle: "Gold-Lagerkosten: Tresor vs Zuhause vs Schließfach",
    metaDescription:
      "Professionelle Tresorlagerung kostet 0,12-0,50% pro Jahr. Vergleich von Bankschließfächern, Heimtresoren und allokierter Lagerung für Edelmetalle.",
  },
  {
    slug: "gold-chemical-symbol-au",
    locale: "de",
    seoTitle: "Warum ist Golds Symbol Au? Der lateinische Ursprung",
    metaDescription:
      "Golds chemisches Symbol Au kommt vom lateinischen 'aurum' (leuchtende Morgenröte). Ordnungszahl 79, Elektronenkonfiguration und einzigartige Eigenschaften.",
  },
  {
    slug: "malleability-of-gold",
    locale: "de",
    seoTitle: "Warum Ist Gold So Formbar? Die Wissenschaft",
    metaDescription:
      "Gold ist das formbarste Metall: 1 Gramm lässt sich zu einer 1 m² Folie schlagen. Die Atomstruktur, die Gold einzigartig duktil und formbar macht.",
  },
  {
    slug: "corrosion-resistance-across-precious-metals",
    locale: "de",
    seoTitle: "Korrosionsbeständigkeit von Edelmetallen im Vergleich",
    metaDescription:
      "Gold und Platin widerstehen nahezu jeder Korrosion. Silber läuft an, Palladium oxidiert bei Hitze. Wie jedes Edelmetall auf die Umwelt reagiert.",
  },
  {
    slug: "physical-properties-of-gold",
    locale: "de",
    seoTitle: "Physikalische Eigenschaften von Gold: Dichte & Mehr",
    metaDescription:
      "Gold: Dichte 19,32 g/cm³, Schmelzpunkt 1.064°C, formbarstes bekanntes Metall. Kompletter Leitfaden zu physikalischen und chemischen Eigenschaften.",
  },
  {
    slug: "noble-metals-concept",
    locale: "de",
    seoTitle: "Was Sind Edelmetalle? Definition & Eigenschaften",
    metaDescription:
      "Edelmetalle (Gold, Silber, Platin, Palladium) widerstehen Oxidation und Korrosion. Was Metalle 'edel' macht, die vollständige Liste und ihre Bedeutung.",
  },
];

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
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

      const updateData: Record<string, unknown> = {
        seoTitle: meta.seoTitle,
        metaDescription: meta.metaDescription,
        updatedAt: new Date(),
      };
      if (meta.faq && meta.faq.length > 0) {
        updateData.faq = JSON.stringify(meta.faq);
      }
      await db
        .update(learnArticleLocalizations)
        .set(updateData)
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
