import type { ClusterDefinition } from "./types";

export const TAXONOMY: ClusterDefinition[] = [
  {
    slug: "fundamentals",
    position: 1,
    nameEn: "Precious Metals Fundamentals",
    descriptionEn:
      "Core concepts, definitions and properties of gold, silver, platinum, palladium and other precious metals.",
    subclusters: [
      {
        slug: "what-are-precious-metals",
        position: 1,
        nameEn: "What Are Precious Metals",
        descriptionEn:
          "Introduction to the group of rare metallic elements valued for their properties and scarcity.",
      },
      {
        slug: "gold-basics",
        position: 2,
        nameEn: "Gold Basics",
        descriptionEn:
          "Fundamental properties, uses and significance of gold as a precious metal.",
      },
      {
        slug: "silver-basics",
        position: 3,
        nameEn: "Silver Basics",
        descriptionEn:
          "Fundamental properties, dual role as industrial and monetary metal.",
      },
      {
        slug: "platinum-group",
        position: 4,
        nameEn: "Platinum Group Metals",
        descriptionEn:
          "Platinum, palladium, rhodium, iridium, osmium and ruthenium fundamentals.",
      },
      {
        slug: "purity-fineness",
        position: 5,
        nameEn: "Purity, Fineness & Karats",
        descriptionEn:
          "How metal purity is measured, expressed and verified across different systems.",
      },
      {
        slug: "units-measurements",
        position: 6,
        nameEn: "Units & Measurements",
        descriptionEn:
          "Troy ounces, grams, kilograms, pennyweights and other measurement systems for precious metals.",
      },
      {
        slug: "alloys-compositions",
        position: 7,
        nameEn: "Alloys & Compositions",
        descriptionEn:
          "How and why precious metals are alloyed, and what the resulting compositions mean.",
      },
    ],
  },
  {
    slug: "history",
    position: 2,
    nameEn: "History of Precious Metals",
    descriptionEn:
      "The role of gold, silver and other precious metals throughout human civilization.",
    subclusters: [
      {
        slug: "ancient-civilizations",
        position: 1,
        nameEn: "Precious Metals in Antiquity",
        descriptionEn:
          "Gold and silver in ancient Egypt, Rome, Greece, China and Mesoamerica.",
      },
      {
        slug: "monetary-history",
        position: 2,
        nameEn: "Monetary History",
        descriptionEn:
          "From the first coins to bimetallism and the evolution of money systems.",
      },
      {
        slug: "gold-standard",
        position: 3,
        nameEn: "The Gold Standard Era",
        descriptionEn:
          "The classical gold standard, Bretton Woods, and the end of gold-backed currencies.",
      },
      {
        slug: "modern-gold-history",
        position: 4,
        nameEn: "Modern Gold History",
        descriptionEn:
          "Key events since 1971: oil crises, 1980 peak, 2008 crisis, 2020 pandemic, 2024 records.",
      },
      {
        slug: "silver-history",
        position: 5,
        nameEn: "Silver Through the Ages",
        descriptionEn:
          "Silver's unique historical role from Spanish colonial era to the Hunt Brothers saga.",
      },
    ],
  },
  {
    slug: "markets-trading",
    position: 3,
    nameEn: "Markets & Trading",
    descriptionEn:
      "How precious metals are traded, priced and exchanged around the world.",
    subclusters: [
      {
        slug: "spot-markets",
        position: 1,
        nameEn: "Spot Markets",
        descriptionEn:
          "How spot pricing works, the London fix, and OTC markets.",
      },
      {
        slug: "futures-derivatives",
        position: 2,
        nameEn: "Futures & Derivatives",
        descriptionEn:
          "COMEX futures, options, CFDs and other derivatives on precious metals.",
      },
      {
        slug: "etfs-etcs",
        position: 3,
        nameEn: "ETFs & ETCs",
        descriptionEn:
          "Exchange-traded products backed by or linked to precious metals.",
      },
      {
        slug: "market-participants",
        position: 4,
        nameEn: "Market Participants",
        descriptionEn:
          "Central banks, mining companies, refiners, dealers, retail investors and speculators.",
      },
      {
        slug: "price-discovery",
        position: 5,
        nameEn: "Price Discovery & Benchmarks",
        descriptionEn:
          "How precious metal prices are set: LBMA, London Fix, Shanghai Gold Exchange.",
      },
      {
        slug: "trading-platforms",
        position: 6,
        nameEn: "Trading Platforms & Access",
        descriptionEn:
          "Where and how individuals can access precious metals markets.",
      },
    ],
  },
  {
    slug: "investment",
    position: 4,
    nameEn: "Investing in Precious Metals",
    descriptionEn:
      "Complete guide to building and managing a precious metals investment position.",
    subclusters: [
      {
        slug: "getting-started",
        position: 1,
        nameEn: "Getting Started",
        descriptionEn:
          "First steps for someone new to precious metals investment.",
      },
      {
        slug: "physical-investment",
        position: 2,
        nameEn: "Physical Metals Investment",
        descriptionEn:
          "Buying, holding and selling physical bars and coins.",
      },
      {
        slug: "paper-investment",
        position: 3,
        nameEn: "Paper & Digital Investment",
        descriptionEn:
          "ETFs, mining stocks, futures, allocated accounts and digital gold.",
      },
      {
        slug: "portfolio-allocation",
        position: 4,
        nameEn: "Portfolio Allocation",
        descriptionEn:
          "How much to allocate, diversification, and metals within a broader portfolio.",
      },
      {
        slug: "investment-strategies",
        position: 5,
        nameEn: "Investment Strategies",
        descriptionEn:
          "DCA, lump sum, tactical allocation, contrarian, momentum and other approaches.",
      },
      {
        slug: "risk-management",
        position: 6,
        nameEn: "Risk Management",
        descriptionEn:
          "Understanding and mitigating the specific risks of precious metals investing.",
      },
    ],
  },
  {
    slug: "physical-metals",
    position: 5,
    nameEn: "Physical Bars & Coins",
    descriptionEn:
      "In-depth coverage of bullion products, numismatics, storage and authentication.",
    subclusters: [
      {
        slug: "bullion-bars",
        position: 1,
        nameEn: "Bullion Bars",
        descriptionEn:
          "Types, sizes, refiners, Good Delivery standards and buying considerations.",
      },
      {
        slug: "bullion-coins",
        position: 2,
        nameEn: "Bullion Coins",
        descriptionEn:
          "Modern investment coins: Eagles, Maples, Krugerrands, Philharmonics, Britannias and more.",
      },
      {
        slug: "historic-coins",
        position: 3,
        nameEn: "Historic & Collectible Coins",
        descriptionEn:
          "Numismatic value, grading, pre-1933 gold, sovereign coins and collectible silver.",
      },
      {
        slug: "storage-custody",
        position: 4,
        nameEn: "Storage & Custody",
        descriptionEn:
          "Home storage, bank vaults, private vaults, allocated vs unallocated, and custodians.",
      },
      {
        slug: "buying-selling",
        position: 5,
        nameEn: "Buying & Selling",
        descriptionEn:
          "How to buy and sell physical metals: dealers, premiums, spreads and best practices.",
      },
    ],
  },
  {
    slug: "price-factors",
    position: 6,
    nameEn: "Price Factors & Analysis",
    descriptionEn:
      "The macroeconomic, geopolitical and market forces that drive precious metals prices.",
    subclusters: [
      {
        slug: "supply-demand",
        position: 1,
        nameEn: "Supply & Demand",
        descriptionEn:
          "Mining output, recycling supply, industrial demand, jewelry demand and investment demand.",
      },
      {
        slug: "central-banks",
        position: 2,
        nameEn: "Central Banks & Gold",
        descriptionEn:
          "Central bank gold reserves, buying/selling patterns and their impact on prices.",
      },
      {
        slug: "inflation-interest-rates",
        position: 3,
        nameEn: "Inflation & Interest Rates",
        descriptionEn:
          "How inflation, real rates and monetary policy affect precious metals.",
      },
      {
        slug: "currency-dollar",
        position: 4,
        nameEn: "Currencies & the Dollar",
        descriptionEn:
          "The inverse relationship between gold and the US dollar, and multi-currency dynamics.",
      },
      {
        slug: "geopolitics",
        position: 5,
        nameEn: "Geopolitical Factors",
        descriptionEn:
          "Wars, sanctions, trade disputes and political instability as price catalysts.",
      },
      {
        slug: "technical-analysis-metals",
        position: 6,
        nameEn: "Technical Analysis for Metals",
        descriptionEn:
          "Chart patterns, support/resistance, moving averages and indicators specific to metals.",
      },
    ],
  },
  {
    slug: "production-industry",
    position: 7,
    nameEn: "Production & Industrial Uses",
    descriptionEn:
      "From mining and refining to the industrial applications of precious metals.",
    subclusters: [
      {
        slug: "mining",
        position: 1,
        nameEn: "Mining",
        descriptionEn:
          "Gold, silver and PGM mining: methods, major producers, costs and environmental impact.",
      },
      {
        slug: "refining",
        position: 2,
        nameEn: "Refining & Processing",
        descriptionEn:
          "How ore becomes pure metal: smelting, electrolysis, Good Delivery certification.",
      },
      {
        slug: "industrial-applications",
        position: 3,
        nameEn: "Industrial Applications",
        descriptionEn:
          "Electronics, medicine, catalytic converters, solar panels and emerging technologies.",
      },
      {
        slug: "jewelry-decorative",
        position: 4,
        nameEn: "Jewelry & Decorative Uses",
        descriptionEn:
          "The jewelry industry, hallmarking, gold and silver in art and decoration.",
      },
      {
        slug: "recycling-recovery",
        position: 5,
        nameEn: "Recycling & Recovery",
        descriptionEn:
          "Urban mining, e-waste recycling, scrap metal recovery and the circular economy.",
      },
    ],
  },
  {
    slug: "geology-science",
    position: 8,
    nameEn: "Geology & Science",
    descriptionEn:
      "The scientific foundations: how precious metals form, where they're found, and their physical properties.",
    subclusters: [
      {
        slug: "geological-formation",
        position: 1,
        nameEn: "How Precious Metals Form",
        descriptionEn:
          "Geological processes that create gold, silver and PGM deposits.",
      },
      {
        slug: "major-deposits",
        position: 2,
        nameEn: "Major Deposits & Regions",
        descriptionEn:
          "The world's most important mining regions and deposit types.",
      },
      {
        slug: "physical-chemical-properties",
        position: 3,
        nameEn: "Physical & Chemical Properties",
        descriptionEn:
          "Conductivity, malleability, density, corrosion resistance and other key properties.",
      },
      {
        slug: "assaying-testing",
        position: 4,
        nameEn: "Assaying & Testing",
        descriptionEn:
          "Fire assay, XRF, acid tests, specific gravity and modern verification methods.",
      },
    ],
  },
  {
    slug: "regulation-tax",
    position: 9,
    nameEn: "Regulation & Taxation",
    descriptionEn:
      "General frameworks for taxation, reporting and legal aspects of precious metals. Informational only.",
    subclusters: [
      {
        slug: "tax-frameworks",
        position: 1,
        nameEn: "Tax Frameworks",
        descriptionEn:
          "General concepts: capital gains, VAT/sales tax, wealth tax and reporting thresholds.",
      },
      {
        slug: "regulatory-landscape",
        position: 2,
        nameEn: "Regulatory Landscape",
        descriptionEn:
          "AML/KYC, hallmarking regulations, import/export controls and dealer licensing.",
      },
      {
        slug: "compliance-reporting",
        position: 3,
        nameEn: "Compliance & Reporting",
        descriptionEn:
          "Record-keeping, reporting thresholds and international transparency initiatives.",
      },
    ],
  },
  {
    slug: "security-authenticity",
    position: 10,
    nameEn: "Security & Authenticity",
    descriptionEn:
      "How to verify, protect and insure precious metals holdings.",
    subclusters: [
      {
        slug: "detecting-fakes",
        position: 1,
        nameEn: "Detecting Counterfeits",
        descriptionEn:
          "Common fakes, testing methods and red flags when buying precious metals.",
      },
      {
        slug: "certification-grading",
        position: 2,
        nameEn: "Certification & Grading",
        descriptionEn:
          "LBMA Good Delivery, NGC/PCGS coin grading, assay certificates and hallmarks.",
      },
      {
        slug: "insurance-protection",
        position: 3,
        nameEn: "Insurance & Protection",
        descriptionEn:
          "Insuring physical metals, safe handling and security best practices.",
      },
    ],
  },
  {
    slug: "ratios-analytics",
    position: 11,
    nameEn: "Ratios & Market Analytics",
    descriptionEn:
      "Key ratios, analytical tools and data-driven approaches to precious metals markets.",
    subclusters: [
      {
        slug: "gold-silver-ratio",
        position: 1,
        nameEn: "Gold/Silver Ratio",
        descriptionEn:
          "History, interpretation and trading strategies based on the gold/silver ratio.",
      },
      {
        slug: "other-ratios",
        position: 2,
        nameEn: "Other Key Ratios",
        descriptionEn:
          "Gold/oil, gold/S&P500, Dow/gold, gold/platinum and other cross-asset ratios.",
      },
      {
        slug: "market-indicators",
        position: 3,
        nameEn: "Market Indicators",
        descriptionEn:
          "COT reports, ETF flows, mining cost curves, GOFO rates and positioning data.",
      },
    ],
  },
  {
    slug: "macroeconomics",
    position: 12,
    nameEn: "Macroeconomics & Metals",
    descriptionEn:
      "How broader economic forces interact with precious metals markets.",
    subclusters: [
      {
        slug: "money-currency-systems",
        position: 1,
        nameEn: "Money & Currency Systems",
        descriptionEn:
          "Fiat money, monetary theory, currency crises and the role of gold as money.",
      },
      {
        slug: "central-banking-policy",
        position: 2,
        nameEn: "Central Banking & Policy",
        descriptionEn:
          "How Federal Reserve, ECB and other central banks influence precious metals.",
      },
      {
        slug: "inflation-deflation",
        position: 3,
        nameEn: "Inflation & Deflation",
        descriptionEn:
          "The relationship between monetary expansion, price levels and precious metals.",
      },
      {
        slug: "economic-cycles",
        position: 4,
        nameEn: "Economic Cycles & Metals",
        descriptionEn:
          "How gold and silver behave in recessions, expansions, stagflation and crises.",
      },
      {
        slug: "global-trade-metals",
        position: 5,
        nameEn: "Global Trade & Metals",
        descriptionEn:
          "Trade balances, de-dollarization, BRICS and the evolving global monetary order.",
      },
    ],
  },
  {
    slug: "guides",
    position: 13,
    nameEn: "Practical Guides",
    descriptionEn:
      "Step-by-step actionable guides for all levels of precious metals knowledge.",
    subclusters: [
      {
        slug: "beginner-guides",
        position: 1,
        nameEn: "Beginner Guides",
        descriptionEn:
          "Clear, accessible entry points for newcomers to precious metals.",
      },
      {
        slug: "intermediate-guides",
        position: 2,
        nameEn: "Intermediate Guides",
        descriptionEn:
          "Deeper practical knowledge for those with basic understanding.",
      },
      {
        slug: "advanced-guides",
        position: 3,
        nameEn: "Advanced Guides",
        descriptionEn:
          "Sophisticated strategies and analysis for experienced investors and analysts.",
      },
    ],
  },
  {
    slug: "faq-mistakes",
    position: 14,
    nameEn: "FAQ & Common Mistakes",
    descriptionEn:
      "Frequently asked questions and the most common errors made by precious metals investors.",
    subclusters: [
      {
        slug: "frequent-questions",
        position: 1,
        nameEn: "Frequently Asked Questions",
        descriptionEn:
          "Clear, authoritative answers to the most common questions about precious metals.",
      },
      {
        slug: "common-mistakes",
        position: 2,
        nameEn: "Common Mistakes",
        descriptionEn:
          "Errors beginners and even experienced investors make, and how to avoid them.",
      },
    ],
  },
  {
    slug: "comparisons",
    position: 15,
    nameEn: "Comparisons & Evaluations",
    descriptionEn:
      "Side-by-side analysis of metals, investment vehicles and asset classes.",
    subclusters: [
      {
        slug: "metal-vs-metal",
        position: 1,
        nameEn: "Metal vs Metal",
        descriptionEn:
          "Direct comparisons between gold, silver, platinum and palladium.",
      },
      {
        slug: "vehicle-comparisons",
        position: 2,
        nameEn: "Investment Vehicle Comparisons",
        descriptionEn:
          "Physical vs ETF, allocated vs unallocated, bars vs coins and more.",
      },
      {
        slug: "asset-class-comparisons",
        position: 3,
        nameEn: "Asset Class Comparisons",
        descriptionEn:
          "Precious metals vs stocks, bonds, real estate, crypto and other alternatives.",
      },
    ],
  },
  {
    slug: "glossary",
    position: 16,
    nameEn: "Glossary & Terminology",
    descriptionEn:
      "Comprehensive glossary of precious metals terms with short, focused definitions.",
    subclusters: [
      {
        slug: "market-terms",
        position: 1,
        nameEn: "Market & Trading Terms",
        descriptionEn:
          "Terms related to markets, exchanges, pricing and trading mechanisms.",
      },
      {
        slug: "product-terms",
        position: 2,
        nameEn: "Product & Physical Terms",
        descriptionEn:
          "Terms related to physical metals: bars, coins, purity, hallmarks.",
      },
      {
        slug: "economic-terms",
        position: 3,
        nameEn: "Economic & Financial Terms",
        descriptionEn:
          "Macroeconomic and financial terms relevant to precious metals.",
      },
    ],
  },
];

export function getAllClusterSlugs(): string[] {
  return TAXONOMY.map((c) => c.slug);
}

export function getAllSubclusterSlugs(): string[] {
  return TAXONOMY.flatMap((c) => c.subclusters.map((s) => s.slug));
}

export function getClusterBySlug(slug: string): ClusterDefinition | undefined {
  return TAXONOMY.find((c) => c.slug === slug);
}

export function getSubclusterBySlug(slug: string) {
  for (const cluster of TAXONOMY) {
    const sub = cluster.subclusters.find((s) => s.slug === slug);
    if (sub) return { cluster, subcluster: sub };
  }
  return undefined;
}
