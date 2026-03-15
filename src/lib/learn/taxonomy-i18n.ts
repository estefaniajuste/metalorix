import type { Locale } from "@/i18n/config";

interface TaxonomyTranslation {
  name: string;
  description: string;
}

type TaxonomyI18n = Record<string, Record<string, TaxonomyTranslation>>;

const CLUSTER_I18N: TaxonomyI18n = {
  en: {
    fundamentals: {
      name: "Precious Metals Fundamentals",
      description:
        "Core concepts, definitions and properties of gold, silver, platinum, palladium and other precious metals.",
    },
    history: {
      name: "History of Precious Metals",
      description:
        "The role of gold, silver and other precious metals throughout human civilization.",
    },
    "markets-trading": {
      name: "Markets & Trading",
      description:
        "How precious metals are traded, priced and exchanged around the world.",
    },
    investment: {
      name: "Investing in Precious Metals",
      description:
        "Complete guide to building and managing a precious metals investment position.",
    },
    "physical-metals": {
      name: "Physical Bars & Coins",
      description:
        "In-depth coverage of bullion products, numismatics, storage and authentication.",
    },
    "price-factors": {
      name: "Price Factors & Analysis",
      description:
        "The macroeconomic, geopolitical and market forces that drive precious metals prices.",
    },
    "production-industry": {
      name: "Production & Industrial Uses",
      description:
        "From mining and refining to the industrial applications of precious metals.",
    },
    "geology-science": {
      name: "Geology & Science",
      description:
        "The scientific foundations: how precious metals form, where they're found, and their physical properties.",
    },
    "regulation-tax": {
      name: "Regulation & Taxation",
      description:
        "General frameworks for taxation, reporting and legal aspects of precious metals. Informational only.",
    },
    "security-authenticity": {
      name: "Security & Authenticity",
      description:
        "How to verify, protect and insure precious metals holdings.",
    },
    "ratios-analytics": {
      name: "Ratios & Market Analytics",
      description:
        "Key ratios, analytical tools and data-driven approaches to precious metals markets.",
    },
    macroeconomics: {
      name: "Macroeconomics & Metals",
      description:
        "How broader economic forces interact with precious metals markets.",
    },
    guides: {
      name: "Practical Guides",
      description:
        "Step-by-step actionable guides for all levels of precious metals knowledge.",
    },
    "faq-mistakes": {
      name: "FAQ & Common Mistakes",
      description:
        "Frequently asked questions and the most common errors made by precious metals investors.",
    },
    comparisons: {
      name: "Comparisons & Evaluations",
      description:
        "Side-by-side analysis of metals, investment vehicles and asset classes.",
    },
    glossary: {
      name: "Glossary & Terminology",
      description:
        "Comprehensive glossary of precious metals terms with short, focused definitions.",
    },
  },
  es: {
    fundamentals: {
      name: "Fundamentos de los Metales Preciosos",
      description:
        "Conceptos básicos, definiciones y propiedades del oro, plata, platino, paladio y otros metales preciosos.",
    },
    history: {
      name: "Historia de los Metales Preciosos",
      description:
        "El papel del oro, la plata y otros metales preciosos a lo largo de la civilización humana.",
    },
    "markets-trading": {
      name: "Mercados y Trading",
      description:
        "Cómo se negocian, valoran e intercambian los metales preciosos en todo el mundo.",
    },
    investment: {
      name: "Invertir en Metales Preciosos",
      description:
        "Guía completa para construir y gestionar una posición de inversión en metales preciosos.",
    },
    "physical-metals": {
      name: "Lingotes y Monedas Físicas",
      description:
        "Cobertura detallada de productos de inversión, numismática, almacenamiento y autenticación.",
    },
    "price-factors": {
      name: "Factores de Precio y Análisis",
      description:
        "Las fuerzas macroeconómicas, geopolíticas y de mercado que mueven los precios de los metales preciosos.",
    },
    "production-industry": {
      name: "Producción y Usos Industriales",
      description:
        "Desde la minería y el refinado hasta las aplicaciones industriales de los metales preciosos.",
    },
    "geology-science": {
      name: "Geología y Ciencia",
      description:
        "Las bases científicas: cómo se forman los metales preciosos, dónde se encuentran y sus propiedades físicas.",
    },
    "regulation-tax": {
      name: "Regulación e Impuestos",
      description:
        "Marcos generales de fiscalidad, reportes y aspectos legales de los metales preciosos. Solo informativo.",
    },
    "security-authenticity": {
      name: "Seguridad y Autenticidad",
      description:
        "Cómo verificar, proteger y asegurar las tenencias de metales preciosos.",
    },
    "ratios-analytics": {
      name: "Ratios y Analítica de Mercado",
      description:
        "Ratios clave, herramientas analíticas y enfoques basados en datos para los mercados de metales preciosos.",
    },
    macroeconomics: {
      name: "Macroeconomía y Metales",
      description:
        "Cómo las fuerzas económicas globales interactúan con los mercados de metales preciosos.",
    },
    guides: {
      name: "Guías Prácticas",
      description:
        "Guías paso a paso para todos los niveles de conocimiento en metales preciosos.",
    },
    "faq-mistakes": {
      name: "Preguntas Frecuentes y Errores Comunes",
      description:
        "Las preguntas más habituales y los errores más comunes de los inversores en metales preciosos.",
    },
    comparisons: {
      name: "Comparativas y Evaluaciones",
      description:
        "Análisis lado a lado de metales, vehículos de inversión y clases de activos.",
    },
    glossary: {
      name: "Glosario y Terminología",
      description:
        "Glosario completo de términos de metales preciosos con definiciones breves y claras.",
    },
  },
  de: {
    fundamentals: {
      name: "Grundlagen der Edelmetalle",
      description:
        "Kernkonzepte, Definitionen und Eigenschaften von Gold, Silber, Platin, Palladium und anderen Edelmetallen.",
    },
    history: {
      name: "Geschichte der Edelmetalle",
      description:
        "Die Rolle von Gold, Silber und anderen Edelmetallen in der Menschheitsgeschichte.",
    },
    "markets-trading": {
      name: "Märkte & Handel",
      description:
        "Wie Edelmetalle weltweit gehandelt, bepreist und ausgetauscht werden.",
    },
    investment: {
      name: "In Edelmetalle investieren",
      description:
        "Vollständiger Leitfaden zum Aufbau und zur Verwaltung einer Edelmetall-Investition.",
    },
    "physical-metals": {
      name: "Physische Barren & Münzen",
      description:
        "Umfassende Informationen zu Anlageprodukten, Numismatik, Lagerung und Authentifizierung.",
    },
    "price-factors": {
      name: "Preisfaktoren & Analyse",
      description:
        "Makroökonomische, geopolitische und marktbezogene Kräfte, die Edelmetallpreise bewegen.",
    },
    "production-industry": {
      name: "Produktion & Industrielle Nutzung",
      description:
        "Vom Bergbau und der Raffination bis zu den industriellen Anwendungen von Edelmetallen.",
    },
    "geology-science": {
      name: "Geologie & Wissenschaft",
      description:
        "Wissenschaftliche Grundlagen: Wie Edelmetalle entstehen, wo sie vorkommen und ihre physikalischen Eigenschaften.",
    },
    "regulation-tax": {
      name: "Regulierung & Besteuerung",
      description:
        "Allgemeine Rahmenwerke für Besteuerung, Berichterstattung und rechtliche Aspekte von Edelmetallen.",
    },
    "security-authenticity": {
      name: "Sicherheit & Echtheit",
      description:
        "Wie man Edelmetallbestände verifiziert, schützt und versichert.",
    },
    "ratios-analytics": {
      name: "Kennzahlen & Marktanalyse",
      description:
        "Wichtige Kennzahlen, analytische Tools und datenbasierte Ansätze für Edelmetallmärkte.",
    },
    macroeconomics: {
      name: "Makroökonomie & Metalle",
      description:
        "Wie breitere wirtschaftliche Kräfte mit den Edelmetallmärkten interagieren.",
    },
    guides: {
      name: "Praktische Leitfäden",
      description:
        "Schritt-für-Schritt-Anleitungen für alle Wissensstufen über Edelmetalle.",
    },
    "faq-mistakes": {
      name: "FAQ & Häufige Fehler",
      description:
        "Häufig gestellte Fragen und die häufigsten Fehler von Edelmetall-Investoren.",
    },
    comparisons: {
      name: "Vergleiche & Bewertungen",
      description:
        "Direkte Vergleiche von Metallen, Anlageinstrumenten und Anlageklassen.",
    },
    glossary: {
      name: "Glossar & Terminologie",
      description:
        "Umfassendes Glossar der Edelmetall-Begriffe mit kurzen, präzisen Definitionen.",
    },
  },
  zh: {
    fundamentals: {
      name: "贵金属基础知识",
      description: "黄金、白银、铂金、钯金及其他贵金属的核心概念、定义和特性。",
    },
    history: {
      name: "贵金属的历史",
      description: "黄金、白银及其他贵金属在人类文明中的角色。",
    },
    "markets-trading": {
      name: "市场与交易",
      description: "贵金属在全球范围内的交易、定价和交换方式。",
    },
    investment: {
      name: "贵金属投资",
      description: "构建和管理贵金属投资组合的完整指南。",
    },
    "physical-metals": {
      name: "实物金条与金币",
      description: "投资产品、钱币收藏、存储和鉴定的深入介绍。",
    },
    "price-factors": {
      name: "价格因素与分析",
      description: "驱动贵金属价格的宏观经济、地缘政治和市场力量。",
    },
    "production-industry": {
      name: "生产与工业用途",
      description: "从采矿和冶炼到贵金属的工业应用。",
    },
    "geology-science": {
      name: "地质与科学",
      description: "科学基础：贵金属如何形成、在哪里被发现及其物理特性。",
    },
    "regulation-tax": {
      name: "法规与税务",
      description: "贵金属的税务、申报和法律方面的一般框架。仅供参考。",
    },
    "security-authenticity": {
      name: "安全与真伪鉴定",
      description: "如何验证、保护和投保贵金属资产。",
    },
    "ratios-analytics": {
      name: "比率与市场分析",
      description: "贵金属市场的关键比率、分析工具和数据驱动方法。",
    },
    macroeconomics: {
      name: "宏观经济与金属",
      description: "更广泛的经济力量如何与贵金属市场互动。",
    },
    guides: {
      name: "实用指南",
      description: "适合各级贵金属知识水平的分步指南。",
    },
    "faq-mistakes": {
      name: "常见问题与常见错误",
      description: "贵金属投资者最常见的问题和最常犯的错误。",
    },
    comparisons: {
      name: "对比与评估",
      description: "金属、投资工具和资产类别的并列分析。",
    },
    glossary: {
      name: "术语表",
      description: "贵金属术语的完整术语表，附有简短精确的定义。",
    },
  },
  ar: {
    fundamentals: {
      name: "أساسيات المعادن الثمينة",
      description:
        "المفاهيم الأساسية والتعريفات وخصائص الذهب والفضة والبلاتين والبالاديوم وغيرها.",
    },
    history: {
      name: "تاريخ المعادن الثمينة",
      description:
        "دور الذهب والفضة والمعادن الثمينة الأخرى عبر الحضارة الإنسانية.",
    },
    "markets-trading": {
      name: "الأسواق والتداول",
      description:
        "كيف يتم تداول المعادن الثمينة وتسعيرها وتبادلها حول العالم.",
    },
    investment: {
      name: "الاستثمار في المعادن الثمينة",
      description:
        "دليل شامل لبناء وإدارة محفظة استثمارية في المعادن الثمينة.",
    },
    "physical-metals": {
      name: "السبائك والعملات المادية",
      description:
        "تغطية متعمقة لمنتجات الاستثمار والنقود والتخزين والتحقق من الأصالة.",
    },
    "price-factors": {
      name: "عوامل السعر والتحليل",
      description:
        "القوى الاقتصادية الكلية والجيوسياسية وقوى السوق التي تحرك أسعار المعادن الثمينة.",
    },
    "production-industry": {
      name: "الإنتاج والاستخدامات الصناعية",
      description:
        "من التعدين والتكرير إلى التطبيقات الصناعية للمعادن الثمينة.",
    },
    "geology-science": {
      name: "الجيولوجيا والعلوم",
      description:
        "الأسس العلمية: كيف تتكون المعادن الثمينة وأين توجد وخصائصها الفيزيائية.",
    },
    "regulation-tax": {
      name: "التنظيم والضرائب",
      description:
        "الأطر العامة للضرائب والتقارير والجوانب القانونية للمعادن الثمينة. للإعلام فقط.",
    },
    "security-authenticity": {
      name: "الأمان والأصالة",
      description: "كيفية التحقق من حيازات المعادن الثمينة وحمايتها وتأمينها.",
    },
    "ratios-analytics": {
      name: "النسب وتحليلات السوق",
      description:
        "النسب الرئيسية والأدوات التحليلية والمناهج المبنية على البيانات لأسواق المعادن الثمينة.",
    },
    macroeconomics: {
      name: "الاقتصاد الكلي والمعادن",
      description:
        "كيف تتفاعل القوى الاقتصادية الأوسع مع أسواق المعادن الثمينة.",
    },
    guides: {
      name: "أدلة عملية",
      description:
        "أدلة خطوة بخطوة لجميع مستويات المعرفة بالمعادن الثمينة.",
    },
    "faq-mistakes": {
      name: "الأسئلة الشائعة والأخطاء",
      description:
        "الأسئلة الأكثر تكراراً والأخطاء الأكثر شيوعاً لدى مستثمري المعادن الثمينة.",
    },
    comparisons: {
      name: "المقارنات والتقييمات",
      description:
        "تحليل مقارن للمعادن وأدوات الاستثمار وفئات الأصول.",
    },
    glossary: {
      name: "المصطلحات",
      description:
        "قاموس شامل لمصطلحات المعادن الثمينة مع تعريفات موجزة ودقيقة.",
    },
  },
  tr: {
    fundamentals: {
      name: "Kıymetli Metal Temelleri",
      description:
        "Altın, gümüş, platin, paladyum ve diğer kıymetli metallerin temel kavramları, tanımları ve özellikleri.",
    },
    history: {
      name: "Kıymetli Metallerin Tarihi",
      description:
        "Altın, gümüş ve diğer kıymetli metallerin insanlık medeniyetindeki rolü.",
    },
    "markets-trading": {
      name: "Piyasalar ve Ticaret",
      description:
        "Kıymetli metallerin dünya genelinde nasıl alınıp satıldığı, fiyatlandığı ve takas edildiği.",
    },
    investment: {
      name: "Kıymetli Metallere Yatırım",
      description:
        "Kıymetli metal yatırım pozisyonu oluşturma ve yönetme rehberi.",
    },
    "physical-metals": {
      name: "Fiziksel Külçe ve Sikkeler",
      description:
        "Yatırım ürünleri, nümizmatik, saklama ve kimlik doğrulama hakkında detaylı bilgi.",
    },
    "price-factors": {
      name: "Fiyat Faktörleri ve Analiz",
      description:
        "Kıymetli metal fiyatlarını etkileyen makroekonomik, jeopolitik ve piyasa güçleri.",
    },
    "production-industry": {
      name: "Üretim ve Endüstriyel Kullanım",
      description:
        "Madencilik ve rafinajdan kıymetli metallerin endüstriyel uygulamalarına.",
    },
    "geology-science": {
      name: "Jeoloji ve Bilim",
      description:
        "Bilimsel temeller: kıymetli metallerin nasıl oluştuğu, nerede bulunduğu ve fiziksel özellikleri.",
    },
    "regulation-tax": {
      name: "Düzenleme ve Vergilendirme",
      description:
        "Kıymetli metallerin vergilendirme, raporlama ve yasal yönlerine ilişkin genel çerçeveler.",
    },
    "security-authenticity": {
      name: "Güvenlik ve Orijinallik",
      description:
        "Kıymetli metal varlıklarının nasıl doğrulanacağı, korunacağı ve sigortalanacağı.",
    },
    "ratios-analytics": {
      name: "Oranlar ve Piyasa Analitiği",
      description:
        "Kıymetli metal piyasaları için temel oranlar, analitik araçlar ve veri odaklı yaklaşımlar.",
    },
    macroeconomics: {
      name: "Makroekonomi ve Metaller",
      description:
        "Daha geniş ekonomik güçlerin kıymetli metal piyasalarıyla nasıl etkileşime girdiği.",
    },
    guides: {
      name: "Pratik Rehberler",
      description:
        "Her bilgi seviyesi için adım adım kıymetli metal rehberleri.",
    },
    "faq-mistakes": {
      name: "SSS ve Yaygın Hatalar",
      description:
        "En sık sorulan sorular ve kıymetli metal yatırımcılarının en yaygın hataları.",
    },
    comparisons: {
      name: "Karşılaştırmalar ve Değerlendirmeler",
      description:
        "Metaller, yatırım araçları ve varlık sınıflarının yan yana analizi.",
    },
    glossary: {
      name: "Sözlük ve Terminoloji",
      description:
        "Kısa ve odaklı tanımlarla kapsamlı kıymetli metal terimleri sözlüğü.",
    },
  },
};

const SUBCLUSTER_I18N: TaxonomyI18n = {
  en: {
    "what-are-precious-metals": {
      name: "What Are Precious Metals",
      description:
        "Introduction to the group of rare metallic elements valued for their properties and scarcity.",
    },
    "gold-basics": {
      name: "Gold Basics",
      description:
        "Fundamental properties, uses and significance of gold as a precious metal.",
    },
    "silver-basics": {
      name: "Silver Basics",
      description:
        "Fundamental properties, dual role as industrial and monetary metal.",
    },
    "platinum-group": {
      name: "Platinum Group Metals",
      description:
        "Platinum, palladium, rhodium, iridium, osmium and ruthenium fundamentals.",
    },
    "purity-fineness": {
      name: "Purity, Fineness & Karats",
      description:
        "How metal purity is measured, expressed and verified across different systems.",
    },
    "units-measurements": {
      name: "Units & Measurements",
      description:
        "Troy ounces, grams, kilograms, pennyweights and other measurement systems for precious metals.",
    },
    "alloys-compositions": {
      name: "Alloys & Compositions",
      description:
        "How and why precious metals are alloyed, and what the resulting compositions mean.",
    },
    "ancient-civilizations": {
      name: "Precious Metals in Antiquity",
      description:
        "Gold and silver in ancient Egypt, Rome, Greece, China and Mesoamerica.",
    },
    "monetary-history": {
      name: "Monetary History",
      description:
        "From the first coins to bimetallism and the evolution of money systems.",
    },
    "gold-standard": {
      name: "The Gold Standard Era",
      description:
        "The classical gold standard, Bretton Woods, and the end of gold-backed currencies.",
    },
    "modern-gold-history": {
      name: "Modern Gold History",
      description:
        "Key events since 1971: oil crises, 1980 peak, 2008 crisis, 2020 pandemic, 2024 records.",
    },
    "silver-history": {
      name: "Silver Through the Ages",
      description:
        "Silver's unique historical role from Spanish colonial era to the Hunt Brothers saga.",
    },
    "spot-markets": {
      name: "Spot Markets",
      description: "How spot pricing works, the London fix, and OTC markets.",
    },
    "futures-derivatives": {
      name: "Futures & Derivatives",
      description:
        "COMEX futures, options, CFDs and other derivatives on precious metals.",
    },
    "etfs-etcs": {
      name: "ETFs & ETCs",
      description:
        "Exchange-traded products backed by or linked to precious metals.",
    },
    "market-participants": {
      name: "Market Participants",
      description:
        "Central banks, mining companies, refiners, dealers, retail investors and speculators.",
    },
    "price-discovery": {
      name: "Price Discovery & Benchmarks",
      description:
        "How precious metal prices are set: LBMA, London Fix, Shanghai Gold Exchange.",
    },
    "trading-platforms": {
      name: "Trading Platforms & Access",
      description:
        "Where and how individuals can access precious metals markets.",
    },
    "getting-started": {
      name: "Getting Started",
      description:
        "First steps for someone new to precious metals investment.",
    },
    "physical-investment": {
      name: "Physical Metals Investment",
      description: "Buying, holding and selling physical bars and coins.",
    },
    "paper-investment": {
      name: "Paper & Digital Investment",
      description:
        "ETFs, mining stocks, futures, allocated accounts and digital gold.",
    },
    "portfolio-allocation": {
      name: "Portfolio Allocation",
      description:
        "How much to allocate, diversification, and metals within a broader portfolio.",
    },
    "investment-strategies": {
      name: "Investment Strategies",
      description:
        "DCA, lump sum, tactical allocation, contrarian, momentum and other approaches.",
    },
    "risk-management": {
      name: "Risk Management",
      description:
        "Understanding and mitigating the specific risks of precious metals investing.",
    },
    "bullion-bars": {
      name: "Bullion Bars",
      description:
        "Types, sizes, refiners, Good Delivery standards and buying considerations.",
    },
    "bullion-coins": {
      name: "Bullion Coins",
      description:
        "Modern investment coins: Eagles, Maples, Krugerrands, Philharmonics, Britannias and more.",
    },
    "historic-coins": {
      name: "Historic & Collectible Coins",
      description:
        "Numismatic value, grading, pre-1933 gold, sovereign coins and collectible silver.",
    },
    "storage-custody": {
      name: "Storage & Custody",
      description:
        "Home storage, bank vaults, private vaults, allocated vs unallocated, and custodians.",
    },
    "buying-selling": {
      name: "Buying & Selling",
      description:
        "How to buy and sell physical metals: dealers, premiums, spreads and best practices.",
    },
    "supply-demand": {
      name: "Supply & Demand",
      description:
        "Mining output, recycling supply, industrial demand, jewelry demand and investment demand.",
    },
    "central-banks": {
      name: "Central Banks & Gold",
      description:
        "Central bank gold reserves, buying/selling patterns and their impact on prices.",
    },
    "inflation-interest-rates": {
      name: "Inflation & Interest Rates",
      description:
        "How inflation, real rates and monetary policy affect precious metals.",
    },
    "currency-dollar": {
      name: "Currencies & the Dollar",
      description:
        "The inverse relationship between gold and the US dollar, and multi-currency dynamics.",
    },
    geopolitics: {
      name: "Geopolitical Factors",
      description:
        "Wars, sanctions, trade disputes and political instability as price catalysts.",
    },
    "technical-analysis-metals": {
      name: "Technical Analysis for Metals",
      description:
        "Chart patterns, support/resistance, moving averages and indicators specific to metals.",
    },
    mining: {
      name: "Mining",
      description:
        "Gold, silver and PGM mining: methods, major producers, costs and environmental impact.",
    },
    refining: {
      name: "Refining & Processing",
      description:
        "How ore becomes pure metal: smelting, electrolysis, Good Delivery certification.",
    },
    "industrial-applications": {
      name: "Industrial Applications",
      description:
        "Electronics, medicine, catalytic converters, solar panels and emerging technologies.",
    },
    "jewelry-decorative": {
      name: "Jewelry & Decorative Uses",
      description:
        "The jewelry industry, hallmarking, gold and silver in art and decoration.",
    },
    "recycling-recovery": {
      name: "Recycling & Recovery",
      description:
        "Urban mining, e-waste recycling, scrap metal recovery and the circular economy.",
    },
    "geological-formation": {
      name: "How Precious Metals Form",
      description:
        "Geological processes that create gold, silver and PGM deposits.",
    },
    "major-deposits": {
      name: "Major Deposits & Regions",
      description:
        "The world's most important mining regions and deposit types.",
    },
    "physical-chemical-properties": {
      name: "Physical & Chemical Properties",
      description:
        "Conductivity, malleability, density, corrosion resistance and other key properties.",
    },
    "assaying-testing": {
      name: "Assaying & Testing",
      description:
        "Fire assay, XRF, acid tests, specific gravity and modern verification methods.",
    },
    "tax-frameworks": {
      name: "Tax Frameworks",
      description:
        "General concepts: capital gains, VAT/sales tax, wealth tax and reporting thresholds.",
    },
    "regulatory-landscape": {
      name: "Regulatory Landscape",
      description:
        "AML/KYC, hallmarking regulations, import/export controls and dealer licensing.",
    },
    "compliance-reporting": {
      name: "Compliance & Reporting",
      description:
        "Record-keeping, reporting thresholds and international transparency initiatives.",
    },
    "detecting-fakes": {
      name: "Detecting Counterfeits",
      description:
        "Common fakes, testing methods and red flags when buying precious metals.",
    },
    "certification-grading": {
      name: "Certification & Grading",
      description:
        "LBMA Good Delivery, NGC/PCGS coin grading, assay certificates and hallmarks.",
    },
    "insurance-protection": {
      name: "Insurance & Protection",
      description:
        "Insuring physical metals, safe handling and security best practices.",
    },
    "gold-silver-ratio": {
      name: "Gold/Silver Ratio",
      description:
        "History, interpretation and trading strategies based on the gold/silver ratio.",
    },
    "other-ratios": {
      name: "Other Key Ratios",
      description:
        "Gold/oil, gold/S&P500, Dow/gold, gold/platinum and other cross-asset ratios.",
    },
    "market-indicators": {
      name: "Market Indicators",
      description:
        "COT reports, ETF flows, mining cost curves, GOFO rates and positioning data.",
    },
    "money-currency-systems": {
      name: "Money & Currency Systems",
      description:
        "Fiat money, monetary theory, currency crises and the role of gold as money.",
    },
    "central-banking-policy": {
      name: "Central Banking & Policy",
      description:
        "How Federal Reserve, ECB and other central banks influence precious metals.",
    },
    "inflation-deflation": {
      name: "Inflation & Deflation",
      description:
        "The relationship between monetary expansion, price levels and precious metals.",
    },
    "economic-cycles": {
      name: "Economic Cycles & Metals",
      description:
        "How gold and silver behave in recessions, expansions, stagflation and crises.",
    },
    "global-trade-metals": {
      name: "Global Trade & Metals",
      description:
        "Trade balances, de-dollarization, BRICS and the evolving global monetary order.",
    },
    "beginner-guides": {
      name: "Beginner Guides",
      description:
        "Clear, accessible entry points for newcomers to precious metals.",
    },
    "intermediate-guides": {
      name: "Intermediate Guides",
      description:
        "Deeper practical knowledge for those with basic understanding.",
    },
    "advanced-guides": {
      name: "Advanced Guides",
      description:
        "Sophisticated strategies and analysis for experienced investors and analysts.",
    },
    "frequent-questions": {
      name: "Frequently Asked Questions",
      description:
        "Clear, authoritative answers to the most common questions about precious metals.",
    },
    "common-mistakes": {
      name: "Common Mistakes",
      description:
        "Errors beginners and even experienced investors make, and how to avoid them.",
    },
    "metal-vs-metal": {
      name: "Metal vs Metal",
      description:
        "Direct comparisons between gold, silver, platinum and palladium.",
    },
    "vehicle-comparisons": {
      name: "Investment Vehicle Comparisons",
      description:
        "Physical vs ETF, allocated vs unallocated, bars vs coins and more.",
    },
    "asset-class-comparisons": {
      name: "Asset Class Comparisons",
      description:
        "Precious metals vs stocks, bonds, real estate, crypto and other alternatives.",
    },
    "market-terms": {
      name: "Market & Trading Terms",
      description:
        "Terms related to markets, exchanges, pricing and trading mechanisms.",
    },
    "product-terms": {
      name: "Product & Physical Terms",
      description:
        "Terms related to physical metals: bars, coins, purity, hallmarks.",
    },
    "economic-terms": {
      name: "Economic & Financial Terms",
      description:
        "Macroeconomic and financial terms relevant to precious metals.",
    },
  },
  es: {
    "what-are-precious-metals": {
      name: "¿Qué Son los Metales Preciosos?",
      description:
        "Introducción al grupo de elementos metálicos raros valorados por sus propiedades y escasez.",
    },
    "gold-basics": {
      name: "Fundamentos del Oro",
      description:
        "Propiedades fundamentales, usos y significado del oro como metal precioso.",
    },
    "silver-basics": {
      name: "Fundamentos de la Plata",
      description:
        "Propiedades fundamentales y doble papel como metal industrial y monetario.",
    },
    "platinum-group": {
      name: "Metales del Grupo del Platino",
      description:
        "Fundamentos del platino, paladio, rodio, iridio, osmio y rutenio.",
    },
    "purity-fineness": {
      name: "Pureza, Ley y Quilates",
      description:
        "Cómo se mide, expresa y verifica la pureza del metal en diferentes sistemas.",
    },
    "units-measurements": {
      name: "Unidades y Medidas",
      description:
        "Onzas troy, gramos, kilogramos, pennyweights y otros sistemas de medición para metales preciosos.",
    },
    "alloys-compositions": {
      name: "Aleaciones y Composiciones",
      description:
        "Cómo y por qué se alean los metales preciosos, y qué significan las composiciones resultantes.",
    },
    "ancient-civilizations": {
      name: "Metales Preciosos en la Antigüedad",
      description:
        "Oro y plata en el antiguo Egipto, Roma, Grecia, China y Mesoamérica.",
    },
    "monetary-history": {
      name: "Historia Monetaria",
      description:
        "Desde las primeras monedas hasta el bimetalismo y la evolución de los sistemas monetarios.",
    },
    "gold-standard": {
      name: "La Era del Patrón Oro",
      description:
        "El patrón oro clásico, Bretton Woods y el fin de las monedas respaldadas por oro.",
    },
    "modern-gold-history": {
      name: "Historia Moderna del Oro",
      description:
        "Eventos clave desde 1971: crisis del petróleo, pico de 1980, crisis de 2008, pandemia de 2020, récords de 2024.",
    },
    "silver-history": {
      name: "La Plata a Través de los Siglos",
      description:
        "El papel histórico único de la plata desde la era colonial española hasta la saga de los hermanos Hunt.",
    },
    "spot-markets": {
      name: "Mercados Spot",
      description:
        "Cómo funciona el precio spot, el London fix y los mercados OTC.",
    },
    "futures-derivatives": {
      name: "Futuros y Derivados",
      description:
        "Futuros COMEX, opciones, CFDs y otros derivados sobre metales preciosos.",
    },
    "etfs-etcs": {
      name: "ETFs y ETCs",
      description:
        "Productos cotizados en bolsa respaldados o vinculados a metales preciosos.",
    },
    "market-participants": {
      name: "Participantes del Mercado",
      description:
        "Bancos centrales, empresas mineras, refinerías, distribuidores, inversores minoristas y especuladores.",
    },
    "price-discovery": {
      name: "Descubrimiento de Precios y Benchmarks",
      description:
        "Cómo se fijan los precios: LBMA, London Fix, Shanghai Gold Exchange.",
    },
    "trading-platforms": {
      name: "Plataformas de Trading y Acceso",
      description:
        "Dónde y cómo los particulares pueden acceder a los mercados de metales preciosos.",
    },
    "getting-started": {
      name: "Primeros Pasos",
      description:
        "Primeros pasos para alguien nuevo en la inversión en metales preciosos.",
    },
    "physical-investment": {
      name: "Inversión en Metales Físicos",
      description: "Compra, tenencia y venta de lingotes y monedas físicas.",
    },
    "paper-investment": {
      name: "Inversión en Papel y Digital",
      description:
        "ETFs, acciones mineras, futuros, cuentas asignadas y oro digital.",
    },
    "portfolio-allocation": {
      name: "Asignación de Cartera",
      description:
        "Cuánto asignar, diversificación y metales dentro de una cartera más amplia.",
    },
    "investment-strategies": {
      name: "Estrategias de Inversión",
      description:
        "DCA, inversión en una suma, asignación táctica, contrarian, momentum y otros enfoques.",
    },
    "risk-management": {
      name: "Gestión de Riesgos",
      description:
        "Comprender y mitigar los riesgos específicos de la inversión en metales preciosos.",
    },
    "bullion-bars": {
      name: "Lingotes de Inversión",
      description:
        "Tipos, tamaños, refinerías, estándares Good Delivery y consideraciones de compra.",
    },
    "bullion-coins": {
      name: "Monedas de Inversión",
      description:
        "Monedas modernas de inversión: Eagles, Maples, Krugerrands, Filarmónicas, Britannias y más.",
    },
    "historic-coins": {
      name: "Monedas Históricas y Coleccionables",
      description:
        "Valor numismático, clasificación, oro pre-1933, soberanos y plata coleccionable.",
    },
    "storage-custody": {
      name: "Almacenamiento y Custodia",
      description:
        "Almacenamiento doméstico, cajas de seguridad bancarias, bóvedas privadas, asignado vs no asignado.",
    },
    "buying-selling": {
      name: "Compra y Venta",
      description:
        "Cómo comprar y vender metales físicos: distribuidores, primas, diferenciales y mejores prácticas.",
    },
    "supply-demand": {
      name: "Oferta y Demanda",
      description:
        "Producción minera, oferta de reciclaje, demanda industrial, joyera y de inversión.",
    },
    "central-banks": {
      name: "Bancos Centrales y Oro",
      description:
        "Reservas de oro de los bancos centrales, patrones de compra/venta y su impacto en los precios.",
    },
    "inflation-interest-rates": {
      name: "Inflación y Tipos de Interés",
      description:
        "Cómo la inflación, los tipos reales y la política monetaria afectan a los metales preciosos.",
    },
    "currency-dollar": {
      name: "Divisas y el Dólar",
      description:
        "La relación inversa entre el oro y el dólar estadounidense, y la dinámica multidivisa.",
    },
    geopolitics: {
      name: "Factores Geopolíticos",
      description:
        "Guerras, sanciones, disputas comerciales e inestabilidad política como catalizadores de precio.",
    },
    "technical-analysis-metals": {
      name: "Análisis Técnico para Metales",
      description:
        "Patrones de gráficos, soportes/resistencias, medias móviles e indicadores específicos para metales.",
    },
    mining: {
      name: "Minería",
      description:
        "Minería de oro, plata y PGM: métodos, principales productores, costes e impacto ambiental.",
    },
    refining: {
      name: "Refinado y Procesamiento",
      description:
        "Cómo el mineral se convierte en metal puro: fundición, electrólisis, certificación Good Delivery.",
    },
    "industrial-applications": {
      name: "Aplicaciones Industriales",
      description:
        "Electrónica, medicina, catalizadores, paneles solares y tecnologías emergentes.",
    },
    "jewelry-decorative": {
      name: "Joyería y Usos Decorativos",
      description:
        "La industria joyera, contrastes, oro y plata en arte y decoración.",
    },
    "recycling-recovery": {
      name: "Reciclaje y Recuperación",
      description:
        "Minería urbana, reciclaje de residuos electrónicos, recuperación de chatarra y economía circular.",
    },
    "geological-formation": {
      name: "Cómo se Forman los Metales Preciosos",
      description:
        "Procesos geológicos que crean depósitos de oro, plata y PGM.",
    },
    "major-deposits": {
      name: "Principales Depósitos y Regiones",
      description:
        "Las regiones mineras más importantes del mundo y tipos de depósito.",
    },
    "physical-chemical-properties": {
      name: "Propiedades Físicas y Químicas",
      description:
        "Conductividad, maleabilidad, densidad, resistencia a la corrosión y otras propiedades clave.",
    },
    "assaying-testing": {
      name: "Ensayo y Pruebas",
      description:
        "Ensayo al fuego, XRF, pruebas de ácido, gravedad específica y métodos modernos de verificación.",
    },
    "tax-frameworks": {
      name: "Marcos Fiscales",
      description:
        "Conceptos generales: ganancias de capital, IVA, impuesto sobre el patrimonio y umbrales de declaración.",
    },
    "regulatory-landscape": {
      name: "Panorama Regulatorio",
      description:
        "AML/KYC, regulaciones de contraste, controles de importación/exportación y licencias de distribuidores.",
    },
    "compliance-reporting": {
      name: "Cumplimiento y Reportes",
      description:
        "Mantenimiento de registros, umbrales de reporte e iniciativas internacionales de transparencia.",
    },
    "detecting-fakes": {
      name: "Detección de Falsificaciones",
      description:
        "Falsificaciones comunes, métodos de prueba y señales de alerta al comprar metales preciosos.",
    },
    "certification-grading": {
      name: "Certificación y Clasificación",
      description:
        "LBMA Good Delivery, clasificación de monedas NGC/PCGS, certificados de ensayo y contrastes.",
    },
    "insurance-protection": {
      name: "Seguro y Protección",
      description:
        "Asegurar metales físicos, manejo seguro y mejores prácticas de seguridad.",
    },
    "gold-silver-ratio": {
      name: "Ratio Oro/Plata",
      description:
        "Historia, interpretación y estrategias de trading basadas en el ratio oro/plata.",
    },
    "other-ratios": {
      name: "Otros Ratios Clave",
      description:
        "Oro/petróleo, oro/S&P500, Dow/oro, oro/platino y otros ratios cruzados.",
    },
    "market-indicators": {
      name: "Indicadores de Mercado",
      description:
        "Informes COT, flujos de ETF, curvas de coste minero, tasas GOFO y datos de posicionamiento.",
    },
    "money-currency-systems": {
      name: "Dinero y Sistemas Monetarios",
      description:
        "Dinero fiduciario, teoría monetaria, crisis de divisas y el papel del oro como dinero.",
    },
    "central-banking-policy": {
      name: "Banca Central y Política",
      description:
        "Cómo la Reserva Federal, el BCE y otros bancos centrales influyen en los metales preciosos.",
    },
    "inflation-deflation": {
      name: "Inflación y Deflación",
      description:
        "La relación entre expansión monetaria, niveles de precios y metales preciosos.",
    },
    "economic-cycles": {
      name: "Ciclos Económicos y Metales",
      description:
        "Cómo se comportan el oro y la plata en recesiones, expansiones, estanflación y crisis.",
    },
    "global-trade-metals": {
      name: "Comercio Global y Metales",
      description:
        "Balanzas comerciales, desdolarización, BRICS y el orden monetario global en evolución.",
    },
    "beginner-guides": {
      name: "Guías para Principiantes",
      description:
        "Puntos de entrada claros y accesibles para los recién llegados a los metales preciosos.",
    },
    "intermediate-guides": {
      name: "Guías Intermedias",
      description:
        "Conocimiento práctico más profundo para quienes tienen una base.",
    },
    "advanced-guides": {
      name: "Guías Avanzadas",
      description:
        "Estrategias sofisticadas y análisis para inversores y analistas experimentados.",
    },
    "frequent-questions": {
      name: "Preguntas Frecuentes",
      description:
        "Respuestas claras y autorizadas a las preguntas más comunes sobre metales preciosos.",
    },
    "common-mistakes": {
      name: "Errores Comunes",
      description:
        "Errores que cometen principiantes e incluso inversores experimentados, y cómo evitarlos.",
    },
    "metal-vs-metal": {
      name: "Metal contra Metal",
      description:
        "Comparaciones directas entre oro, plata, platino y paladio.",
    },
    "vehicle-comparisons": {
      name: "Comparativa de Vehículos de Inversión",
      description:
        "Físico vs ETF, asignado vs no asignado, lingotes vs monedas y más.",
    },
    "asset-class-comparisons": {
      name: "Comparativa de Clases de Activos",
      description:
        "Metales preciosos vs acciones, bonos, inmobiliario, cripto y otras alternativas.",
    },
    "market-terms": {
      name: "Términos de Mercado y Trading",
      description:
        "Términos relacionados con mercados, bolsas, precios y mecanismos de trading.",
    },
    "product-terms": {
      name: "Términos de Producto y Físicos",
      description:
        "Términos relacionados con metales físicos: lingotes, monedas, pureza, contrastes.",
    },
    "economic-terms": {
      name: "Términos Económicos y Financieros",
      description:
        "Términos macroeconómicos y financieros relevantes para metales preciosos.",
    },
  },
  de: {
    "what-are-precious-metals": { name: "Was sind Edelmetalle", description: "Einführung in die Gruppe seltener Metallelemente, die für ihre Eigenschaften und Seltenheit geschätzt werden." },
    "gold-basics": { name: "Gold-Grundlagen", description: "Grundlegende Eigenschaften, Verwendung und Bedeutung von Gold als Edelmetall." },
    "silver-basics": { name: "Silber-Grundlagen", description: "Grundlegende Eigenschaften, Doppelrolle als Industrie- und Währungsmetall." },
    "platinum-group": { name: "Platinmetalle", description: "Grundlagen zu Platin, Palladium, Rhodium, Iridium, Osmium und Ruthenium." },
    "purity-fineness": { name: "Reinheit, Feingehalt & Karat", description: "Wie Metallreinheit gemessen, ausgedrückt und in verschiedenen Systemen verifiziert wird." },
    "units-measurements": { name: "Einheiten & Maße", description: "Feinunzen, Gramm, Kilogramm und andere Messsysteme für Edelmetalle." },
    "alloys-compositions": { name: "Legierungen & Zusammensetzungen", description: "Wie und warum Edelmetalle legiert werden und was die Zusammensetzungen bedeuten." },
    "ancient-civilizations": { name: "Edelmetalle in der Antike", description: "Gold und Silber im alten Ägypten, Rom, Griechenland, China und Mesoamerika." },
    "monetary-history": { name: "Geldgeschichte", description: "Von den ersten Münzen bis zum Bimetallismus und der Entwicklung der Geldsysteme." },
    "gold-standard": { name: "Die Ära des Goldstandards", description: "Der klassische Goldstandard, Bretton Woods und das Ende goldgedeckter Währungen." },
    "modern-gold-history": { name: "Moderne Goldgeschichte", description: "Schlüsselereignisse seit 1971: Ölkrisen, 1980er-Höchststand, 2008er-Krise, Pandemie 2020, Rekorde 2024." },
    "silver-history": { name: "Silber durch die Jahrhunderte", description: "Silbers einzigartige historische Rolle von der spanischen Kolonialzeit bis zur Hunt-Brothers-Saga." },
    "spot-markets": { name: "Spotmärkte", description: "Wie die Spotpreisbildung funktioniert, der London Fix und OTC-Märkte." },
    "futures-derivatives": { name: "Futures & Derivate", description: "COMEX-Futures, Optionen, CFDs und andere Derivate auf Edelmetalle." },
    "etfs-etcs": { name: "ETFs & ETCs", description: "Börsengehandelte Produkte, die durch Edelmetalle gedeckt oder mit ihnen verbunden sind." },
    "market-participants": { name: "Marktteilnehmer", description: "Zentralbanken, Bergbauunternehmen, Raffinerien, Händler, Privatanleger und Spekulanten." },
    "price-discovery": { name: "Preisfindung & Benchmarks", description: "Wie Edelmetallpreise festgelegt werden: LBMA, London Fix, Shanghai Gold Exchange." },
    "trading-platforms": { name: "Handelsplattformen & Zugang", description: "Wo und wie Privatanleger auf Edelmetallmärkte zugreifen können." },
    "getting-started": { name: "Erste Schritte", description: "Erste Schritte für Einsteiger in die Edelmetall-Investition." },
    "physical-investment": { name: "Physische Metall-Investition", description: "Kauf, Halten und Verkauf von physischen Barren und Münzen." },
    "paper-investment": { name: "Papier- & Digitalinvestition", description: "ETFs, Minenaktien, Futures, zugewiesene Konten und digitales Gold." },
    "portfolio-allocation": { name: "Portfolio-Allokation", description: "Wie viel allokieren, Diversifikation und Metalle im breiteren Portfolio." },
    "investment-strategies": { name: "Anlagestrategien", description: "DCA, Einmalanlage, taktische Allokation, Contrarian, Momentum und andere Ansätze." },
    "risk-management": { name: "Risikomanagement", description: "Verstehen und Mindern der spezifischen Risiken der Edelmetallanlage." },
    "bullion-bars": { name: "Anlagebarren", description: "Typen, Größen, Raffinerien, Good-Delivery-Standards und Kaufüberlegungen." },
    "bullion-coins": { name: "Anlagemünzen", description: "Moderne Anlagemünzen: Eagles, Maples, Krugerrands, Philharmoniker, Britannias und mehr." },
    "historic-coins": { name: "Historische & Sammlermünzen", description: "Numismatischer Wert, Einstufung, Pre-1933-Gold, Sovereign-Münzen und Sammlersilber." },
    "storage-custody": { name: "Lagerung & Verwahrung", description: "Heimlagerung, Bankschließfächer, private Tresore, zugewiesen vs. nicht zugewiesen." },
    "buying-selling": { name: "Kauf & Verkauf", description: "Physische Metalle kaufen und verkaufen: Händler, Aufschläge, Spreads und Best Practices." },
    "supply-demand": { name: "Angebot & Nachfrage", description: "Bergbauproduktion, Recyclingangebot, Industrienachfrage, Schmucknachfrage und Investitionsnachfrage." },
    "central-banks": { name: "Zentralbanken & Gold", description: "Goldreserven der Zentralbanken, Kauf-/Verkaufsmuster und deren Preisauswirkungen." },
    "inflation-interest-rates": { name: "Inflation & Zinssätze", description: "Wie Inflation, Realzinsen und Geldpolitik Edelmetalle beeinflussen." },
    "currency-dollar": { name: "Währungen & der Dollar", description: "Die inverse Beziehung zwischen Gold und dem US-Dollar und Multi-Währungs-Dynamiken." },
    geopolitics: { name: "Geopolitische Faktoren", description: "Kriege, Sanktionen, Handelsstreitigkeiten und politische Instabilität als Preiskatalysatoren." },
    "technical-analysis-metals": { name: "Technische Analyse für Metalle", description: "Chartmuster, Unterstützung/Widerstand, gleitende Durchschnitte und metallspezifische Indikatoren." },
    mining: { name: "Bergbau", description: "Gold-, Silber- und PGM-Bergbau: Methoden, große Produzenten, Kosten und Umweltauswirkungen." },
    refining: { name: "Raffination & Verarbeitung", description: "Vom Erz zum reinen Metall: Schmelzen, Elektrolyse, Good-Delivery-Zertifizierung." },
    "industrial-applications": { name: "Industrielle Anwendungen", description: "Elektronik, Medizin, Katalysatoren, Solarzellen und neue Technologien." },
    "jewelry-decorative": { name: "Schmuck & Dekorative Verwendung", description: "Die Schmuckindustrie, Punzierung, Gold und Silber in Kunst und Dekoration." },
    "recycling-recovery": { name: "Recycling & Rückgewinnung", description: "Urban Mining, E-Schrott-Recycling, Altmetallrückgewinnung und Kreislaufwirtschaft." },
    "geological-formation": { name: "Wie Edelmetalle entstehen", description: "Geologische Prozesse, die Gold-, Silber- und PGM-Lagerstätten bilden." },
    "major-deposits": { name: "Große Lagerstätten & Regionen", description: "Die wichtigsten Bergbauregionen und Lagerstättentypen der Welt." },
    "physical-chemical-properties": { name: "Physikalische & Chemische Eigenschaften", description: "Leitfähigkeit, Verformbarkeit, Dichte, Korrosionsbeständigkeit und andere Schlüsseleigenschaften." },
    "assaying-testing": { name: "Prüfung & Analyse", description: "Feuerprobe, XRF, Säuretests, spezifisches Gewicht und moderne Prüfmethoden." },
    "tax-frameworks": { name: "Steuerrahmen", description: "Allgemeine Konzepte: Kapitalerträge, MwSt., Vermögenssteuer und Meldegrenzen." },
    "regulatory-landscape": { name: "Regulierungslandschaft", description: "AML/KYC, Punzierungsvorschriften, Import-/Exportkontrollen und Händlerlizenzierung." },
    "compliance-reporting": { name: "Compliance & Berichterstattung", description: "Aufzeichnungspflichten, Meldegrenzen und internationale Transparenzinitiativen." },
    "detecting-fakes": { name: "Fälschungen erkennen", description: "Häufige Fälschungen, Testmethoden und Warnsignale beim Kauf von Edelmetallen." },
    "certification-grading": { name: "Zertifizierung & Einstufung", description: "LBMA Good Delivery, NGC/PCGS-Münzgraduierung, Prüfzertifikate und Punzen." },
    "insurance-protection": { name: "Versicherung & Schutz", description: "Versicherung physischer Metalle, sichere Handhabung und Sicherheits-Best-Practices." },
    "gold-silver-ratio": { name: "Gold/Silber-Ratio", description: "Geschichte, Interpretation und Handelsstrategien basierend auf dem Gold/Silber-Ratio." },
    "other-ratios": { name: "Andere wichtige Kennzahlen", description: "Gold/Öl, Gold/S&P500, Dow/Gold, Gold/Platin und andere Cross-Asset-Ratios." },
    "market-indicators": { name: "Marktindikatoren", description: "COT-Berichte, ETF-Flows, Bergbaukostenkurven, GOFO-Sätze und Positionierungsdaten." },
    "money-currency-systems": { name: "Geld & Währungssysteme", description: "Fiatgeld, Geldtheorie, Währungskrisen und die Rolle von Gold als Geld." },
    "central-banking-policy": { name: "Zentralbanken & Politik", description: "Wie Fed, EZB und andere Zentralbanken Edelmetalle beeinflussen." },
    "inflation-deflation": { name: "Inflation & Deflation", description: "Die Beziehung zwischen Geldmengenexpansion, Preisniveaus und Edelmetallen." },
    "economic-cycles": { name: "Konjunkturzyklen & Metalle", description: "Wie Gold und Silber in Rezessionen, Expansionen, Stagflation und Krisen reagieren." },
    "global-trade-metals": { name: "Welthandel & Metalle", description: "Handelsbilanzen, De-Dollarisierung, BRICS und die sich entwickelnde globale Währungsordnung." },
    "beginner-guides": { name: "Einsteiger-Leitfäden", description: "Klare, zugängliche Einstiegspunkte für Neulinge bei Edelmetallen." },
    "intermediate-guides": { name: "Fortgeschrittene Leitfäden", description: "Tieferes praktisches Wissen für Anleger mit Grundkenntnissen." },
    "advanced-guides": { name: "Experten-Leitfäden", description: "Anspruchsvolle Strategien und Analysen für erfahrene Investoren und Analysten." },
    "frequent-questions": { name: "Häufig gestellte Fragen", description: "Klare, fundierte Antworten auf die häufigsten Fragen zu Edelmetallen." },
    "common-mistakes": { name: "Häufige Fehler", description: "Fehler, die Anfänger und selbst erfahrene Investoren machen, und wie man sie vermeidet." },
    "metal-vs-metal": { name: "Metall gegen Metall", description: "Direktvergleiche zwischen Gold, Silber, Platin und Palladium." },
    "vehicle-comparisons": { name: "Anlageinstrumente im Vergleich", description: "Physisch vs. ETF, zugewiesen vs. nicht zugewiesen, Barren vs. Münzen und mehr." },
    "asset-class-comparisons": { name: "Anlageklassen im Vergleich", description: "Edelmetalle vs. Aktien, Anleihen, Immobilien, Krypto und andere Alternativen." },
    "market-terms": { name: "Markt- & Handelsbegriffe", description: "Begriffe zu Märkten, Börsen, Preisbildung und Handelsmechanismen." },
    "product-terms": { name: "Produkt- & Physikbegriffe", description: "Begriffe zu physischen Metallen: Barren, Münzen, Reinheit, Punzen." },
    "economic-terms": { name: "Wirtschafts- & Finanzbegriffe", description: "Makroökonomische und finanzielle Begriffe rund um Edelmetalle." },
  },
  zh: {
    "what-are-precious-metals": { name: "什么是贵金属", description: "介绍因其特性和稀缺性而备受重视的稀有金属元素。" },
    "gold-basics": { name: "黄金基础", description: "黄金作为贵金属的基本属性、用途和意义。" },
    "silver-basics": { name: "白银基础", description: "白银的基本属性及其作为工业和货币金属的双重角色。" },
    "platinum-group": { name: "铂族金属", description: "铂、钯、铑、铱、锇和钌的基础知识。" },
    "purity-fineness": { name: "纯度与成色", description: "金属纯度的测量、表达和验证方法。" },
    "units-measurements": { name: "单位与度量", description: "金衡盎司、克、千克及其他贵金属计量系统。" },
    "alloys-compositions": { name: "合金与成分", description: "贵金属合金化的原因、方法及含义。" },
    "ancient-civilizations": { name: "古代贵金属", description: "古埃及、罗马、希腊、中国和美洲的黄金与白银。" },
    "monetary-history": { name: "货币历史", description: "从最早的硬币到双金属本位制和货币体系的演变。" },
    "gold-standard": { name: "金本位时代", description: "古典金本位、布雷顿森林体系及金本位的终结。" },
    "modern-gold-history": { name: "现代黄金历史", description: "1971年以来的关键事件：石油危机、1980年峰值、2008年危机、2020年疫情、2024年纪录。" },
    "silver-history": { name: "白银的历史", description: "白银从西班牙殖民时代到亨特兄弟的独特历史角色。" },
    "spot-markets": { name: "现货市场", description: "现货定价的运作方式、伦敦定盘价和场外交易市场。" },
    "futures-derivatives": { name: "期货与衍生品", description: "COMEX期货、期权、差价合约及其他贵金属衍生品。" },
    "etfs-etcs": { name: "ETF与ETC", description: "以贵金属为支撑或与之挂钩的交易所交易产品。" },
    "market-participants": { name: "市场参与者", description: "央行、矿业公司、精炼厂、经销商、散户投资者和投机者。" },
    "price-discovery": { name: "价格发现与基准", description: "贵金属价格的确定方式：LBMA、伦敦定盘价、上海黄金交易所。" },
    "trading-platforms": { name: "交易平台与入口", description: "个人投资者如何进入贵金属市场。" },
    "getting-started": { name: "入门指南", description: "贵金属投资新手的第一步。" },
    "physical-investment": { name: "实物金属投资", description: "实物金条和金币的买入、持有和卖出。" },
    "paper-investment": { name: "纸质与数字投资", description: "ETF、矿业股票、期货、托管账户和数字黄金。" },
    "portfolio-allocation": { name: "投资组合配置", description: "配置比例、分散投资以及更广泛组合中的金属配置。" },
    "investment-strategies": { name: "投资策略", description: "定投、一次性投入、战术配置、逆向、动量等方法。" },
    "risk-management": { name: "风险管理", description: "理解和降低贵金属投资的特定风险。" },
    "bullion-bars": { name: "投资金条", description: "类型、尺寸、精炼厂、合格交割标准和购买注意事项。" },
    "bullion-coins": { name: "投资金币", description: "现代投资币：鹰洋、枫叶、克鲁格金币、维也纳爱乐、不列颠尼亚等。" },
    "historic-coins": { name: "历史与收藏币", description: "钱币学价值、评级、1933年前金币、主权币和收藏银币。" },
    "storage-custody": { name: "存储与托管", description: "家庭存储、银行保管箱、私人金库、分配与非分配存储。" },
    "buying-selling": { name: "买卖指南", description: "如何买卖实物金属：经销商、溢价、价差和最佳实践。" },
    "supply-demand": { name: "供给与需求", description: "矿业产出、回收供应、工业需求、珠宝需求和投资需求。" },
    "central-banks": { name: "央行与黄金", description: "央行黄金储备、买卖模式及其对价格的影响。" },
    "inflation-interest-rates": { name: "通胀与利率", description: "通胀、实际利率和货币政策如何影响贵金属。" },
    "currency-dollar": { name: "货币与美元", description: "黄金与美元的反向关系以及多货币动态。" },
    geopolitics: { name: "地缘政治因素", description: "战争、制裁、贸易争端和政治不稳定作为价格催化剂。" },
    "technical-analysis-metals": { name: "金属技术分析", description: "图表形态、支撑/阻力、移动平均线和金属专用指标。" },
    mining: { name: "采矿", description: "金、银和铂族金属采矿：方法、主要生产商、成本和环境影响。" },
    refining: { name: "冶炼与加工", description: "矿石如何变成纯金属：熔炼、电解、合格交割认证。" },
    "industrial-applications": { name: "工业应用", description: "电子、医疗、催化转化器、太阳能板和新兴技术。" },
    "jewelry-decorative": { name: "珠宝与装饰用途", description: "珠宝行业、印记、黄金和白银在艺术和装饰中的应用。" },
    "recycling-recovery": { name: "回收与再利用", description: "城市采矿、电子废弃物回收、废金属回收和循环经济。" },
    "geological-formation": { name: "贵金属的形成", description: "形成金、银和铂族金属矿床的地质过程。" },
    "major-deposits": { name: "主要矿床与地区", description: "世界上最重要的矿区和矿床类型。" },
    "physical-chemical-properties": { name: "物理与化学性质", description: "导电性、延展性、密度、耐腐蚀性等关键特性。" },
    "assaying-testing": { name: "化验与检测", description: "火法化验、XRF、酸检测、比重测试和现代验证方法。" },
    "tax-frameworks": { name: "税务框架", description: "一般概念：资本利得、增值税、财富税和申报门槛。" },
    "regulatory-landscape": { name: "监管环境", description: "反洗钱/KYC、印记法规、进出口管制和经销商许可。" },
    "compliance-reporting": { name: "合规与申报", description: "记录保存、申报门槛和国际透明度倡议。" },
    "detecting-fakes": { name: "鉴别假货", description: "常见假货、检测方法和购买贵金属时的警示信号。" },
    "certification-grading": { name: "认证与评级", description: "LBMA合格交割、NGC/PCGS钱币评级、化验证书和印记。" },
    "insurance-protection": { name: "保险与保护", description: "实物金属保险、安全处理和安保最佳实践。" },
    "gold-silver-ratio": { name: "金银比", description: "金银比的历史、解读和基于此的交易策略。" },
    "other-ratios": { name: "其他关键比率", description: "金/油、金/标普500、道琼斯/金、金/铂及其他跨资产比率。" },
    "market-indicators": { name: "市场指标", description: "COT报告、ETF资金流向、采矿成本曲线、GOFO利率和持仓数据。" },
    "money-currency-systems": { name: "货币与货币体系", description: "法定货币、货币理论、货币危机和黄金作为货币的角色。" },
    "central-banking-policy": { name: "央行与政策", description: "美联储、欧洲央行和其他央行如何影响贵金属。" },
    "inflation-deflation": { name: "通胀与通缩", description: "货币扩张、价格水平和贵金属之间的关系。" },
    "economic-cycles": { name: "经济周期与金属", description: "黄金和白银在衰退、扩张、滞胀和危机中的表现。" },
    "global-trade-metals": { name: "全球贸易与金属", description: "贸易平衡、去美元化、金砖国家和不断演变的全球货币秩序。" },
    "beginner-guides": { name: "入门指南", description: "为贵金属新手提供的清晰、易懂的入门内容。" },
    "intermediate-guides": { name: "进阶指南", description: "为有基础知识的人提供更深入的实践知识。" },
    "advanced-guides": { name: "高级指南", description: "为经验丰富的投资者和分析师提供的高级策略和分析。" },
    "frequent-questions": { name: "常见问题", description: "关于贵金属最常见问题的清晰权威解答。" },
    "common-mistakes": { name: "常见错误", description: "新手甚至老手投资者常犯的错误及其避免方法。" },
    "metal-vs-metal": { name: "金属对比", description: "黄金、白银、铂金和钯金的直接对比。" },
    "vehicle-comparisons": { name: "投资工具对比", description: "实物vs ETF、分配vs非分配、金条vs金币等。" },
    "asset-class-comparisons": { name: "资产类别对比", description: "贵金属vs股票、债券、房地产、加密货币及其他替代品。" },
    "market-terms": { name: "市场与交易术语", description: "与市场、交易所、定价和交易机制相关的术语。" },
    "product-terms": { name: "产品与实物术语", description: "与实物金属相关的术语：金条、金币、纯度、印记。" },
    "economic-terms": { name: "经济与金融术语", description: "与贵金属相关的宏观经济和金融术语。" },
  },
  ar: {
    "what-are-precious-metals": { name: "ما هي المعادن الثمينة", description: "مقدمة عن مجموعة العناصر المعدنية النادرة المقدّرة لخصائصها وندرتها." },
    "gold-basics": { name: "أساسيات الذهب", description: "الخصائص الأساسية واستخدامات وأهمية الذهب كمعدن ثمين." },
    "silver-basics": { name: "أساسيات الفضة", description: "الخصائص الأساسية والدور المزدوج كمعدن صناعي ونقدي." },
    "platinum-group": { name: "مجموعة البلاتين", description: "أساسيات البلاتين والبالاديوم والروديوم والإيريديوم والأوزميوم والروثينيوم." },
    "purity-fineness": { name: "النقاء والعيار", description: "كيف يتم قياس نقاء المعادن والتعبير عنه والتحقق منه." },
    "units-measurements": { name: "الوحدات والقياسات", description: "أونصة تروي، غرامات، كيلوغرامات وأنظمة قياس أخرى للمعادن الثمينة." },
    "alloys-compositions": { name: "السبائك والتركيبات", description: "كيف ولماذا يتم خلط المعادن الثمينة وما تعنيه التركيبات الناتجة." },
    "ancient-civilizations": { name: "المعادن الثمينة في العصور القديمة", description: "الذهب والفضة في مصر القديمة وروما واليونان والصين وأمريكا الوسطى." },
    "monetary-history": { name: "التاريخ النقدي", description: "من أول العملات المعدنية إلى نظام المعدنين وتطور الأنظمة النقدية." },
    "gold-standard": { name: "عصر معيار الذهب", description: "معيار الذهب الكلاسيكي، بريتون وودز، ونهاية العملات المدعومة بالذهب." },
    "modern-gold-history": { name: "تاريخ الذهب الحديث", description: "أحداث رئيسية منذ 1971: أزمات النفط، ذروة 1980، أزمة 2008، جائحة 2020، أرقام قياسية 2024." },
    "silver-history": { name: "الفضة عبر العصور", description: "الدور التاريخي الفريد للفضة من العصر الاستعماري الإسباني إلى قصة الأخوين هانت." },
    "spot-markets": { name: "الأسواق الفورية", description: "كيف يعمل التسعير الفوري، تثبيت لندن، والأسواق خارج البورصة." },
    "futures-derivatives": { name: "العقود الآجلة والمشتقات", description: "عقود COMEX الآجلة والخيارات وعقود الفروقات ومشتقات أخرى." },
    "etfs-etcs": { name: "صناديق المؤشرات المتداولة", description: "منتجات متداولة في البورصة مدعومة أو مرتبطة بالمعادن الثمينة." },
    "market-participants": { name: "المشاركون في السوق", description: "البنوك المركزية وشركات التعدين والمصافي والتجار والمستثمرون الأفراد والمضاربون." },
    "price-discovery": { name: "اكتشاف السعر والمعايير", description: "كيف يتم تحديد أسعار المعادن الثمينة: LBMA، تثبيت لندن، بورصة شنغهاي للذهب." },
    "trading-platforms": { name: "منصات التداول والوصول", description: "أين وكيف يمكن للأفراد الوصول إلى أسواق المعادن الثمينة." },
    "getting-started": { name: "البداية", description: "الخطوات الأولى للمبتدئين في استثمار المعادن الثمينة." },
    "physical-investment": { name: "الاستثمار في المعادن المادية", description: "شراء وحيازة وبيع السبائك والعملات المادية." },
    "paper-investment": { name: "الاستثمار الورقي والرقمي", description: "صناديق المؤشرات، أسهم التعدين، العقود الآجلة، الحسابات المخصصة والذهب الرقمي." },
    "portfolio-allocation": { name: "تخصيص المحفظة", description: "كم يجب تخصيصه، التنويع، والمعادن ضمن محفظة أوسع." },
    "investment-strategies": { name: "استراتيجيات الاستثمار", description: "متوسط تكلفة الدولار، الاستثمار دفعة واحدة، التخصيص التكتيكي وأساليب أخرى." },
    "risk-management": { name: "إدارة المخاطر", description: "فهم وتخفيف المخاطر الخاصة بالاستثمار في المعادن الثمينة." },
    "bullion-bars": { name: "سبائك الاستثمار", description: "الأنواع والأحجام والمصافي ومعايير التسليم الجيد واعتبارات الشراء." },
    "bullion-coins": { name: "عملات الاستثمار", description: "العملات الاستثمارية الحديثة: النسور، القيقب، كروغراند، فيلهارمونيك وغيرها." },
    "historic-coins": { name: "العملات التاريخية والنادرة", description: "القيمة النقدية، التصنيف، ذهب ما قبل 1933، العملات السيادية والفضة النادرة." },
    "storage-custody": { name: "التخزين والحفظ", description: "التخزين المنزلي، خزائن البنوك، الخزائن الخاصة، المخصص مقابل غير المخصص." },
    "buying-selling": { name: "الشراء والبيع", description: "كيفية شراء وبيع المعادن المادية: التجار، العلاوات، الفروق وأفضل الممارسات." },
    "supply-demand": { name: "العرض والطلب", description: "إنتاج التعدين، عرض إعادة التدوير، الطلب الصناعي، طلب المجوهرات وطلب الاستثمار." },
    "central-banks": { name: "البنوك المركزية والذهب", description: "احتياطيات الذهب لدى البنوك المركزية وأنماط الشراء/البيع وتأثيرها على الأسعار." },
    "inflation-interest-rates": { name: "التضخم وأسعار الفائدة", description: "كيف يؤثر التضخم وأسعار الفائدة الحقيقية والسياسة النقدية على المعادن الثمينة." },
    "currency-dollar": { name: "العملات والدولار", description: "العلاقة العكسية بين الذهب والدولار الأمريكي وديناميكيات العملات المتعددة." },
    geopolitics: { name: "العوامل الجيوسياسية", description: "الحروب والعقوبات والنزاعات التجارية وعدم الاستقرار السياسي كمحفزات للأسعار." },
    "technical-analysis-metals": { name: "التحليل الفني للمعادن", description: "أنماط الرسوم البيانية، الدعم/المقاومة، المتوسطات المتحركة ومؤشرات خاصة بالمعادن." },
    mining: { name: "التعدين", description: "تعدين الذهب والفضة ومجموعة البلاتين: الطرق، كبار المنتجين، التكاليف والأثر البيئي." },
    refining: { name: "التكرير والمعالجة", description: "كيف يتحول الخام إلى معدن نقي: الصهر، التحليل الكهربائي، شهادة التسليم الجيد." },
    "industrial-applications": { name: "التطبيقات الصناعية", description: "الإلكترونيات، الطب، المحولات الحفازة، الألواح الشمسية والتقنيات الناشئة." },
    "jewelry-decorative": { name: "المجوهرات والاستخدامات الزخرفية", description: "صناعة المجوهرات، الدمغ، الذهب والفضة في الفن والزخرفة." },
    "recycling-recovery": { name: "إعادة التدوير والاسترداد", description: "التعدين الحضري، إعادة تدوير النفايات الإلكترونية، استرداد الخردة والاقتصاد الدائري." },
    "geological-formation": { name: "كيف تتكون المعادن الثمينة", description: "العمليات الجيولوجية التي تُنشئ رواسب الذهب والفضة ومجموعة البلاتين." },
    "major-deposits": { name: "الرواسب الرئيسية والمناطق", description: "أهم مناطق التعدين وأنواع الرواسب في العالم." },
    "physical-chemical-properties": { name: "الخصائص الفيزيائية والكيميائية", description: "التوصيل، القابلية للسحب، الكثافة، مقاومة التآكل وخصائص رئيسية أخرى." },
    "assaying-testing": { name: "الفحص والاختبار", description: "فحص النار، XRF، اختبارات الحمض، الكثافة النوعية وطرق التحقق الحديثة." },
    "tax-frameworks": { name: "الأطر الضريبية", description: "مفاهيم عامة: أرباح رأس المال، ضريبة القيمة المضافة، ضريبة الثروة وعتبات الإبلاغ." },
    "regulatory-landscape": { name: "المشهد التنظيمي", description: "مكافحة غسل الأموال، لوائح الدمغ، ضوابط الاستيراد/التصدير وترخيص التجار." },
    "compliance-reporting": { name: "الامتثال والتقارير", description: "حفظ السجلات، عتبات الإبلاغ ومبادرات الشفافية الدولية." },
    "detecting-fakes": { name: "كشف التزييف", description: "التزييف الشائع وطرق الاختبار وعلامات التحذير عند شراء المعادن الثمينة." },
    "certification-grading": { name: "الشهادات والتصنيف", description: "LBMA التسليم الجيد، تصنيف عملات NGC/PCGS، شهادات الفحص والدمغات." },
    "insurance-protection": { name: "التأمين والحماية", description: "تأمين المعادن المادية والتعامل الآمن وأفضل ممارسات الأمان." },
    "gold-silver-ratio": { name: "نسبة الذهب/الفضة", description: "التاريخ والتفسير واستراتيجيات التداول القائمة على نسبة الذهب/الفضة." },
    "other-ratios": { name: "نسب رئيسية أخرى", description: "الذهب/النفط، الذهب/S&P500، داو/الذهب، الذهب/البلاتين ونسب أخرى." },
    "market-indicators": { name: "مؤشرات السوق", description: "تقارير COT، تدفقات صناديق المؤشرات، منحنيات تكلفة التعدين وبيانات المراكز." },
    "money-currency-systems": { name: "النقود وأنظمة العملات", description: "النقود الورقية، النظرية النقدية، أزمات العملات ودور الذهب كنقود." },
    "central-banking-policy": { name: "البنوك المركزية والسياسة", description: "كيف يؤثر الاحتياطي الفيدرالي والبنك المركزي الأوروبي وغيرهم على المعادن الثمينة." },
    "inflation-deflation": { name: "التضخم والانكماش", description: "العلاقة بين التوسع النقدي ومستويات الأسعار والمعادن الثمينة." },
    "economic-cycles": { name: "الدورات الاقتصادية والمعادن", description: "كيف يتصرف الذهب والفضة في فترات الركود والتوسع والركود التضخمي والأزمات." },
    "global-trade-metals": { name: "التجارة العالمية والمعادن", description: "الموازين التجارية، نزع الدولرة، بريكس والنظام النقدي العالمي المتطور." },
    "beginner-guides": { name: "أدلة المبتدئين", description: "نقاط دخول واضحة وسهلة للوافدين الجدد إلى المعادن الثمينة." },
    "intermediate-guides": { name: "أدلة متوسطة", description: "معرفة عملية أعمق لمن لديهم فهم أساسي." },
    "advanced-guides": { name: "أدلة متقدمة", description: "استراتيجيات متطورة وتحليلات للمستثمرين والمحللين ذوي الخبرة." },
    "frequent-questions": { name: "الأسئلة الشائعة", description: "إجابات واضحة وموثوقة على الأسئلة الأكثر شيوعاً حول المعادن الثمينة." },
    "common-mistakes": { name: "الأخطاء الشائعة", description: "أخطاء يرتكبها المبتدئون وحتى المستثمرون المخضرمون وكيفية تجنبها." },
    "metal-vs-metal": { name: "معدن مقابل معدن", description: "مقارنات مباشرة بين الذهب والفضة والبلاتين والبالاديوم." },
    "vehicle-comparisons": { name: "مقارنة أدوات الاستثمار", description: "المادي مقابل ETF، المخصص مقابل غير المخصص، السبائك مقابل العملات." },
    "asset-class-comparisons": { name: "مقارنة فئات الأصول", description: "المعادن الثمينة مقابل الأسهم والسندات والعقارات والعملات المشفرة والبدائل الأخرى." },
    "market-terms": { name: "مصطلحات السوق والتداول", description: "مصطلحات تتعلق بالأسواق والبورصات والتسعير وآليات التداول." },
    "product-terms": { name: "مصطلحات المنتجات المادية", description: "مصطلحات تتعلق بالمعادن المادية: السبائك والعملات والنقاء والدمغات." },
    "economic-terms": { name: "المصطلحات الاقتصادية والمالية", description: "مصطلحات اقتصادية كلية ومالية ذات صلة بالمعادن الثمينة." },
  },
  tr: {
    "what-are-precious-metals": { name: "Kıymetli Metaller Nedir", description: "Özellikleri ve nadirliği nedeniyle değer verilen nadir metalik elementlere giriş." },
    "gold-basics": { name: "Altın Temelleri", description: "Altının temel özellikleri, kullanım alanları ve kıymetli metal olarak önemi." },
    "silver-basics": { name: "Gümüş Temelleri", description: "Gümüşün temel özellikleri, endüstriyel ve parasal metal olarak çifte rolü." },
    "platinum-group": { name: "Platin Grubu Metaller", description: "Platin, paladyum, rodyum, iridyum, osmiyum ve rutenyum temelleri." },
    "purity-fineness": { name: "Saflık ve Ayar", description: "Metal saflığının farklı sistemlerde nasıl ölçüldüğü, ifade edildiği ve doğrulandığı." },
    "units-measurements": { name: "Birimler ve Ölçüler", description: "Troy ons, gram, kilogram ve kıymetli metaller için diğer ölçüm sistemleri." },
    "alloys-compositions": { name: "Alaşımlar ve Bileşimler", description: "Kıymetli metallerin nasıl ve neden alaşımlandığı ve sonuçların anlamı." },
    "ancient-civilizations": { name: "Antik Çağda Kıymetli Metaller", description: "Antik Mısır, Roma, Yunanistan, Çin ve Mesoamerika'da altın ve gümüş." },
    "monetary-history": { name: "Para Tarihi", description: "İlk sikkelerden bimetalizme ve para sistemlerinin evrimine." },
    "gold-standard": { name: "Altın Standardı Dönemi", description: "Klasik altın standardı, Bretton Woods ve altın destekli paraların sonu." },
    "modern-gold-history": { name: "Modern Altın Tarihi", description: "1971'den bu yana önemli olaylar: petrol krizleri, 1980 zirvesi, 2008 krizi, 2020 pandemisi, 2024 rekorları." },
    "silver-history": { name: "Çağlar Boyunca Gümüş", description: "İspanyol sömürge döneminden Hunt Kardeşler destanına gümüşün benzersiz tarihsel rolü." },
    "spot-markets": { name: "Spot Piyasalar", description: "Spot fiyatlamanın işleyişi, Londra fix ve tezgah üstü piyasalar." },
    "futures-derivatives": { name: "Vadeli İşlemler ve Türevler", description: "COMEX vadeli işlemleri, opsiyonlar, CFD'ler ve diğer kıymetli metal türevleri." },
    "etfs-etcs": { name: "ETF'ler ve ETC'ler", description: "Kıymetli metallerle desteklenen veya bağlantılı borsa yatırım ürünleri." },
    "market-participants": { name: "Piyasa Katılımcıları", description: "Merkez bankaları, madencilik şirketleri, rafineriler, bayiler, bireysel yatırımcılar ve spekülatörler." },
    "price-discovery": { name: "Fiyat Keşfi ve Referanslar", description: "Kıymetli metal fiyatlarının nasıl belirlendiği: LBMA, Londra Fix, Şanghay Altın Borsası." },
    "trading-platforms": { name: "İşlem Platformları ve Erişim", description: "Bireysel yatırımcıların kıymetli metal piyasalarına nereden ve nasıl erişebileceği." },
    "getting-started": { name: "Başlarken", description: "Kıymetli metal yatırımında yeni olanlar için ilk adımlar." },
    "physical-investment": { name: "Fiziksel Metal Yatırımı", description: "Fiziksel külçe ve sikkelerin alımı, saklanması ve satışı." },
    "paper-investment": { name: "Kağıt ve Dijital Yatırım", description: "ETF'ler, madencilik hisseleri, vadeli işlemler, tahsisli hesaplar ve dijital altın." },
    "portfolio-allocation": { name: "Portföy Dağılımı", description: "Ne kadar ayırmalı, çeşitlendirme ve daha geniş bir portföyde metaller." },
    "investment-strategies": { name: "Yatırım Stratejileri", description: "DCA, toplu yatırım, taktik dağılım, karşıt ve momentum yaklaşımları." },
    "risk-management": { name: "Risk Yönetimi", description: "Kıymetli metal yatırımının spesifik risklerini anlama ve azaltma." },
    "bullion-bars": { name: "Yatırım Külçeleri", description: "Türler, boyutlar, rafineriler, İyi Teslimat standartları ve alım konuları." },
    "bullion-coins": { name: "Yatırım Sikkeleri", description: "Modern yatırım sikkeleri: Eagle, Maple, Krugerrand, Filarmoni, Britannia ve daha fazlası." },
    "historic-coins": { name: "Tarihi ve Koleksiyon Sikkeler", description: "Nümizmatik değer, derecelendirme, 1933 öncesi altın, egemenlik sikkeleri." },
    "storage-custody": { name: "Saklama ve Muhafaza", description: "Ev depolama, banka kasaları, özel kasalar, tahsisli ve tahsissiz karşılaştırması." },
    "buying-selling": { name: "Alım ve Satım", description: "Fiziksel metal alıp satma: bayiler, primler, farklar ve en iyi uygulamalar." },
    "supply-demand": { name: "Arz ve Talep", description: "Madencilik üretimi, geri dönüşüm arzı, endüstriyel talep, mücevher talebi ve yatırım talebi." },
    "central-banks": { name: "Merkez Bankaları ve Altın", description: "Merkez bankası altın rezervleri, alım/satım kalıpları ve fiyatlara etkileri." },
    "inflation-interest-rates": { name: "Enflasyon ve Faiz Oranları", description: "Enflasyon, reel faizler ve para politikasının kıymetli metalleri nasıl etkilediği." },
    "currency-dollar": { name: "Para Birimleri ve Dolar", description: "Altın ve ABD doları arasındaki ters ilişki ve çoklu para birimi dinamikleri." },
    geopolitics: { name: "Jeopolitik Faktörler", description: "Savaşlar, yaptırımlar, ticaret anlaşmazlıkları ve siyasi istikrarsızlık." },
    "technical-analysis-metals": { name: "Metaller için Teknik Analiz", description: "Grafik desenleri, destek/direnç, hareketli ortalamalar ve metal spesifik göstergeler." },
    mining: { name: "Madencilik", description: "Altın, gümüş ve PGM madenciliği: yöntemler, büyük üreticiler, maliyetler ve çevresel etki." },
    refining: { name: "Rafinaj ve İşleme", description: "Cevherin saf metale dönüşümü: ergitme, elektroliz, İyi Teslimat sertifikası." },
    "industrial-applications": { name: "Endüstriyel Uygulamalar", description: "Elektronik, tıp, katalitik konvertörler, güneş panelleri ve yeni teknolojiler." },
    "jewelry-decorative": { name: "Mücevher ve Dekoratif Kullanım", description: "Mücevher endüstrisi, damgalama, sanatta altın ve gümüş." },
    "recycling-recovery": { name: "Geri Dönüşüm ve Geri Kazanım", description: "Kentsel madencilik, e-atık geri dönüşümü, hurda metal geri kazanımı ve döngüsel ekonomi." },
    "geological-formation": { name: "Kıymetli Metaller Nasıl Oluşur", description: "Altın, gümüş ve PGM yataklarını oluşturan jeolojik süreçler." },
    "major-deposits": { name: "Büyük Yataklar ve Bölgeler", description: "Dünyanın en önemli madencilik bölgeleri ve yatak türleri." },
    "physical-chemical-properties": { name: "Fiziksel ve Kimyasal Özellikler", description: "İletkenlik, işlenebilirlik, yoğunluk, korozyon direnci ve diğer temel özellikler." },
    "assaying-testing": { name: "Analiz ve Test", description: "Ateş analizi, XRF, asit testleri, özgül ağırlık ve modern doğrulama yöntemleri." },
    "tax-frameworks": { name: "Vergi Çerçeveleri", description: "Genel kavramlar: sermaye kazançları, KDV, servet vergisi ve bildirim eşikleri." },
    "regulatory-landscape": { name: "Düzenleyici Ortam", description: "AML/KYC, damga düzenlemeleri, ithalat/ihracat kontrolleri ve bayi lisansları." },
    "compliance-reporting": { name: "Uyum ve Raporlama", description: "Kayıt tutma, raporlama eşikleri ve uluslararası şeffaflık girişimleri." },
    "detecting-fakes": { name: "Sahteleri Tespit Etme", description: "Yaygın sahteler, test yöntemleri ve kıymetli metal alırken uyarı işaretleri." },
    "certification-grading": { name: "Sertifikasyon ve Derecelendirme", description: "LBMA İyi Teslimat, NGC/PCGS sikke derecelendirme, analiz sertifikaları ve damgalar." },
    "insurance-protection": { name: "Sigorta ve Koruma", description: "Fiziksel metallerin sigortası, güvenli kullanım ve güvenlik en iyi uygulamaları." },
    "gold-silver-ratio": { name: "Altın/Gümüş Oranı", description: "Altın/gümüş oranının tarihi, yorumlanması ve buna dayalı işlem stratejileri." },
    "other-ratios": { name: "Diğer Önemli Oranlar", description: "Altın/petrol, altın/S&P500, Dow/altın, altın/platin ve diğer çapraz varlık oranları." },
    "market-indicators": { name: "Piyasa Göstergeleri", description: "COT raporları, ETF akışları, madencilik maliyet eğrileri, GOFO oranları ve pozisyon verileri." },
    "money-currency-systems": { name: "Para ve Para Birimleri Sistemleri", description: "İtibari para, para teorisi, döviz krizleri ve altının para olarak rolü." },
    "central-banking-policy": { name: "Merkez Bankacılığı ve Politika", description: "Fed, ECB ve diğer merkez bankalarının kıymetli metalleri nasıl etkilediği." },
    "inflation-deflation": { name: "Enflasyon ve Deflasyon", description: "Parasal genişleme, fiyat seviyeleri ve kıymetli metaller arasındaki ilişki." },
    "economic-cycles": { name: "Ekonomik Döngüler ve Metaller", description: "Altın ve gümüşün durgunluk, genişleme, stagflasyon ve krizlerde davranışı." },
    "global-trade-metals": { name: "Küresel Ticaret ve Metaller", description: "Ticaret dengeleri, dolardan uzaklaşma, BRICS ve gelişen küresel para düzeni." },
    "beginner-guides": { name: "Başlangıç Rehberleri", description: "Kıymetli metallere yeni başlayanlar için açık ve erişilebilir giriş noktaları." },
    "intermediate-guides": { name: "Orta Düzey Rehberler", description: "Temel bilgisi olanlar için daha derin pratik bilgi." },
    "advanced-guides": { name: "İleri Düzey Rehberler", description: "Deneyimli yatırımcılar ve analistler için gelişmiş stratejiler ve analizler." },
    "frequent-questions": { name: "Sıkça Sorulan Sorular", description: "Kıymetli metaller hakkında en yaygın sorulara açık ve yetkili cevaplar." },
    "common-mistakes": { name: "Yaygın Hatalar", description: "Yeni başlayanların ve hatta deneyimli yatırımcıların yaptığı hatalar ve nasıl önleneceği." },
    "metal-vs-metal": { name: "Metal Karşılaştırması", description: "Altın, gümüş, platin ve paladyum arasında doğrudan karşılaştırmalar." },
    "vehicle-comparisons": { name: "Yatırım Aracı Karşılaştırması", description: "Fiziksel vs ETF, tahsisli vs tahsissiz, külçe vs sikke ve daha fazlası." },
    "asset-class-comparisons": { name: "Varlık Sınıfı Karşılaştırması", description: "Kıymetli metaller vs hisse senetleri, tahviller, gayrimenkul, kripto ve diğer alternatifler." },
    "market-terms": { name: "Piyasa ve İşlem Terimleri", description: "Piyasalar, borsalar, fiyatlandırma ve işlem mekanizmalarıyla ilgili terimler." },
    "product-terms": { name: "Ürün ve Fiziksel Terimler", description: "Fiziksel metallerle ilgili terimler: külçeler, sikkeler, saflık, damgalar." },
    "economic-terms": { name: "Ekonomik ve Finansal Terimler", description: "Kıymetli metallerle ilgili makroekonomik ve finansal terimler." },
  },
};

export function getLocalizedCluster(
  slug: string,
  locale: Locale
): TaxonomyTranslation | null {
  return CLUSTER_I18N[locale]?.[slug] ?? CLUSTER_I18N.en?.[slug] ?? null;
}

export function getLocalizedSubcluster(
  slug: string,
  locale: Locale
): TaxonomyTranslation | null {
  return SUBCLUSTER_I18N[locale]?.[slug] ?? SUBCLUSTER_I18N.en?.[slug] ?? null;
}
