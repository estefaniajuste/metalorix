export type DealerType = "online" | "physical" | "both";
export type MetalSymbol = "XAU" | "XAG" | "XPT" | "XPD";

export interface Dealer {
  id: string;
  name: string;
  countryCode: string;
  type: DealerType;
  metals: MetalSymbol[];
  website?: string;
  description: Partial<Record<string, string>>;
  city?: string;
  featured?: boolean;
}

export interface DealerCountry {
  code: string;
  slug: Record<string, string>;
  flagEmoji: string;
  nameI18n: Record<string, string>;
}

export const DEALER_COUNTRIES: DealerCountry[] = [
  {
    code: "es",
    flagEmoji: "🇪🇸",
    slug: { es: "espana", en: "spain", de: "spanien", zh: "xibanya", ar: "isbanya", tr: "ispanya", hi: "spain" },
    nameI18n: { es: "España", en: "Spain", de: "Spanien", zh: "西班牙", ar: "إسبانيا", tr: "İspanya", hi: "Spain" },
  },
  {
    code: "de",
    flagEmoji: "🇩🇪",
    slug: { es: "alemania", en: "germany", de: "deutschland", zh: "deguo", ar: "almanya", tr: "almanya", hi: "germany" },
    nameI18n: { es: "Alemania", en: "Germany", de: "Deutschland", zh: "德国", ar: "ألمانيا", tr: "Almanya", hi: "Germany" },
  },
  {
    code: "us",
    flagEmoji: "🇺🇸",
    slug: { es: "estados-unidos", en: "united-states", de: "usa", zh: "meiguo", ar: "alwilayat-almutahida", tr: "abd", hi: "united-states" },
    nameI18n: { es: "Estados Unidos", en: "United States", de: "USA", zh: "美国", ar: "الولايات المتحدة", tr: "ABD", hi: "United States" },
  },
  {
    code: "gb",
    flagEmoji: "🇬🇧",
    slug: { es: "reino-unido", en: "united-kingdom", de: "vereinigtes-koenigreich", zh: "yingguo", ar: "almamlaka-almutahida", tr: "ingiltere", hi: "united-kingdom" },
    nameI18n: { es: "Reino Unido", en: "United Kingdom", de: "Vereinigtes Königreich", zh: "英国", ar: "المملكة المتحدة", tr: "İngiltere", hi: "United Kingdom" },
  },
  {
    code: "mx",
    flagEmoji: "🇲🇽",
    slug: { es: "mexico", en: "mexico", de: "mexiko", zh: "moxige", ar: "almiksik", tr: "meksika", hi: "mexico" },
    nameI18n: { es: "México", en: "Mexico", de: "Mexiko", zh: "墨西哥", ar: "المكسيك", tr: "Meksika", hi: "Mexico" },
  },
  {
    code: "tr",
    flagEmoji: "🇹🇷",
    slug: { es: "turquia", en: "turkey", de: "tuerkei", zh: "tuerqi", ar: "turkiya", tr: "turkiye", hi: "turkey" },
    nameI18n: { es: "Turquía", en: "Turkey", de: "Türkei", zh: "土耳其", ar: "تركيا", tr: "Türkiye", hi: "Turkey" },
  },
  {
    code: "in",
    flagEmoji: "🇮🇳",
    slug: { es: "india", en: "india", de: "indien", zh: "yindu", ar: "alhind", tr: "hindistan", hi: "india" },
    nameI18n: { es: "India", en: "India", de: "Indien", zh: "印度", ar: "الهند", tr: "Hindistan", hi: "India" },
  },
  {
    code: "sa",
    flagEmoji: "🇸🇦",
    slug: { es: "arabia-saudi", en: "saudi-arabia", de: "saudi-arabien", zh: "shate-alabo", ar: "almamlaka-alarabiya-alsaudiya", tr: "suudi-arabistan", hi: "saudi-arabia" },
    nameI18n: { es: "Arabia Saudí", en: "Saudi Arabia", de: "Saudi-Arabien", zh: "沙特阿拉伯", ar: "المملكة العربية السعودية", tr: "Suudi Arabistan", hi: "Saudi Arabia" },
  },
  {
    code: "cn",
    flagEmoji: "🇨🇳",
    slug: { es: "china", en: "china", de: "china", zh: "zhongguo", ar: "alssin", tr: "cin", hi: "china" },
    nameI18n: { es: "China", en: "China", de: "China", zh: "中国", ar: "الصين", tr: "Çin", hi: "China" },
  },
  {
    code: "ch",
    flagEmoji: "🇨🇭",
    slug: { es: "suiza", en: "switzerland", de: "schweiz", zh: "ruishi", ar: "suwisra", tr: "isvicre", hi: "switzerland" },
    nameI18n: { es: "Suiza", en: "Switzerland", de: "Schweiz", zh: "瑞士", ar: "سويسرا", tr: "İsviçre", hi: "Switzerland" },
  },
  {
    code: "fr",
    flagEmoji: "🇫🇷",
    slug: { es: "francia", en: "france", de: "frankreich", zh: "faguo", ar: "faransa", tr: "fransa", hi: "france" },
    nameI18n: { es: "Francia", en: "France", de: "Frankreich", zh: "法国", ar: "فرنسا", tr: "Fransa", hi: "France" },
  },
  {
    code: "it",
    flagEmoji: "🇮🇹",
    slug: { es: "italia", en: "italy", de: "italien", zh: "yidali", ar: "italya", tr: "italya", hi: "italy" },
    nameI18n: { es: "Italia", en: "Italy", de: "Italien", zh: "意大利", ar: "إيطاليا", tr: "İtalya", hi: "Italy" },
  },
  {
    code: "pt",
    flagEmoji: "🇵🇹",
    slug: { es: "portugal", en: "portugal", de: "portugal", zh: "putaoya", ar: "alburtughal", tr: "portekiz", hi: "portugal" },
    nameI18n: { es: "Portugal", en: "Portugal", de: "Portugal", zh: "葡萄牙", ar: "البرتغال", tr: "Portekiz", hi: "Portugal" },
  },
  {
    code: "au",
    flagEmoji: "🇦🇺",
    slug: { es: "australia", en: "australia", de: "australien", zh: "aodaliya", ar: "ustralya", tr: "avustralya", hi: "australia" },
    nameI18n: { es: "Australia", en: "Australia", de: "Australien", zh: "澳大利亚", ar: "أستراليا", tr: "Avustralya", hi: "Australia" },
  },
  {
    code: "ca",
    flagEmoji: "🇨🇦",
    slug: { es: "canada", en: "canada", de: "kanada", zh: "jianada", ar: "kanada", tr: "kanada", hi: "canada" },
    nameI18n: { es: "Canadá", en: "Canada", de: "Kanada", zh: "加拿大", ar: "كندا", tr: "Kanada", hi: "Canada" },
  },
];

export const DEALERS: Dealer[] = [
  // ── España ──────────────────────────────────────────────────────────────
  {
    id: "ateneodeoro",
    name: "Ateneo de Oro",
    countryCode: "es",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.ateneodeoro.com",
    featured: true,
    description: {
      es: "Plataforma española especializada en la compra y venta de oro y plata de inversión, con amplia selección de monedas y lingotes.",
      en: "Spanish platform specialising in buying and selling investment gold and silver, with a wide selection of coins and bars.",
      de: "Spanische Plattform für den Kauf und Verkauf von Anlage-Gold und -Silber mit breiter Auswahl an Münzen und Barren.",
    },
  },
  {
    id: "andorrano",
    name: "Andorrano.com",
    countryCode: "es",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.andorrano.com",
    description: {
      es: "Tienda online de metales preciosos con precios competitivos y entrega en toda Europa.",
      en: "Online precious metals shop with competitive prices and delivery across Europe.",
      de: "Online-Händler für Edelmetalle mit wettbewerbsfähigen Preisen und Lieferung in ganz Europa.",
    },
  },
  {
    id: "coinconvert-es",
    name: "CoinConvert",
    countryCode: "es",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.coinconvert.es",
    city: "Madrid",
    description: {
      es: "Compra y venta de monedas de oro y plata, tanto online como en tienda física en Madrid.",
      en: "Buying and selling of gold and silver coins, both online and at a physical store in Madrid.",
    },
  },
  {
    id: "numaplanchart",
    name: "Numismática Planchart",
    countryCode: "es",
    type: "physical",
    metals: ["XAU", "XAG"],
    city: "Valencia",
    website: "https://www.numismaticaplanchart.com",
    description: {
      es: "Histórica numismática valenciana con décadas de experiencia en monedas y metales preciosos.",
      en: "Historic Valencia numismatic shop with decades of experience in coins and precious metals.",
    },
  },

  // ── Alemania ─────────────────────────────────────────────────────────────
  {
    id: "degussa",
    name: "Degussa Goldhandel",
    countryCode: "de",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.degussa-goldhandel.de",
    city: "Frankfurt",
    featured: true,
    description: {
      es: "Uno de los mayores dealers de metales preciosos de Europa, con tiendas físicas en varias ciudades alemanas y venta online.",
      en: "One of Europe's largest precious metals dealers, with physical stores in several German cities and online sales.",
      de: "Einer der größten Edelmetallhändler Europas mit Filialen in mehreren deutschen Städten und Online-Verkauf.",
      zh: "欧洲最大的贵金属交易商之一，在德国多个城市设有实体门店并提供在线销售。",
      ar: "أحد أكبر تجار المعادن الثمينة في أوروبا، مع متاجر مادية في عدة مدن ألمانية وبيع عبر الإنترنت.",
      tr: "Birçok Alman şehrinde fiziksel mağazası ve çevrimiçi satışıyla Avrupa'nın en büyük kıymetli maden satıcılarından biri.",
    },
  },
  {
    id: "proaurum",
    name: "Pro Aurum",
    countryCode: "de",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.proaurum.de",
    city: "München",
    featured: true,
    description: {
      es: "Referente alemán en inversión en metales preciosos, con tiendas en Múnich y otras ciudades.",
      en: "German reference for precious metals investment, with stores in Munich and other cities.",
      de: "Deutsches Referenzunternehmen für Edelmetallinvestitionen mit Filialen in München und anderen Städten.",
    },
  },
  {
    id: "westgold",
    name: "Westgold",
    countryCode: "de",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.westgold.de",
    description: {
      es: "Plataforma online alemana con precios muy competitivos y amplia selección de monedas y lingotes.",
      en: "German online platform with very competitive prices and wide selection of coins and bars.",
      de: "Deutsche Online-Plattform mit sehr wettbewerbsfähigen Preisen und breiter Auswahl an Münzen und Barren.",
    },
  },

  // ── USA ──────────────────────────────────────────────────────────────────
  {
    id: "apmex",
    name: "APMEX",
    countryCode: "us",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.apmex.com",
    featured: true,
    description: {
      es: "El mayor minorista online de metales preciosos de Estados Unidos, con más de 30.000 productos y millones de clientes.",
      en: "The largest online precious metals retailer in the United States, with over 30,000 products and millions of customers.",
      de: "Der größte Online-Edelmetallhändler der USA mit über 30.000 Produkten und Millionen von Kunden.",
      zh: "美国最大的贵金属在线零售商，拥有超过30,000种产品和数百万客户。",
      ar: "أكبر تجار المعادن الثمينة عبر الإنترنت في الولايات المتحدة، مع أكثر من 30,000 منتج وملايين العملاء.",
      tr: "30.000'den fazla ürün ve milyonlarca müşteriyle ABD'nin en büyük çevrimiçi kıymetli maden perakendecisi.",
    },
  },
  {
    id: "jmbullion",
    name: "JM Bullion",
    countryCode: "us",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.jmbullion.com",
    featured: true,
    description: {
      es: "Una de las principales plataformas online de lingotes de EE.UU., conocida por sus bajos precios y envíos rápidos.",
      en: "One of the leading US online bullion platforms, known for low prices and fast shipping.",
      de: "Eine der führenden US-amerikanischen Online-Barren-Plattformen, bekannt für niedrige Preise und schnellen Versand.",
    },
  },
  {
    id: "sdbullion",
    name: "SD Bullion",
    countryCode: "us",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.sdbullion.com",
    description: {
      es: "Dealer online americano especializado en lingotes a precios spot muy ajustados.",
      en: "American online dealer specialising in bullion at very tight spot prices.",
    },
  },
  {
    id: "moneymetals",
    name: "Money Metals Exchange",
    countryCode: "us",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.moneymetals.com",
    description: {
      es: "Dealer estadounidense con amplia oferta de monedas y lingotes, valorado por su atención al cliente.",
      en: "US dealer with a wide range of coins and bars, valued for its customer service.",
    },
  },

  // ── Reino Unido ───────────────────────────────────────────────────────────
  {
    id: "bullionbypost",
    name: "BullionByPost",
    countryCode: "gb",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.bullionbypost.co.uk",
    featured: true,
    description: {
      es: "El mayor dealer online de metales preciosos del Reino Unido, con millones de pedidos enviados.",
      en: "The UK's largest online precious metals dealer, with millions of orders dispatched.",
      de: "Großbritanniens größter Online-Edelmetallhändler mit Millionen versendeter Bestellungen.",
    },
  },
  {
    id: "royalmint",
    name: "The Royal Mint",
    countryCode: "gb",
    type: "both",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.royalmint.com/invest",
    city: "Llantrisant",
    featured: true,
    description: {
      es: "La Casa de la Moneda oficial del Reino Unido, que ofrece monedas de inversión y lingotes directamente al público.",
      en: "The UK's official mint, offering investment coins and bars directly to the public.",
      de: "Die offizielle Münzanstalt des Vereinigten Königreichs bietet Anlagemünzen und -barren direkt an die Öffentlichkeit an.",
      zh: "英国官方造币厂，直接向公众提供投资硬币和金条。",
    },
  },
  {
    id: "chards",
    name: "Chards",
    countryCode: "gb",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.chards.co.uk",
    city: "Blackpool",
    description: {
      es: "Numismática y dealer de lingotes con más de 50 años de historia, con tienda física y venta online.",
      en: "Numismatic shop and bullion dealer with over 50 years of history, with physical store and online sales.",
    },
  },

  // ── México ────────────────────────────────────────────────────────────────
  {
    id: "banorte-metales",
    name: "Banorte Metales",
    countryCode: "mx",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.banorte.com/portal/personal/inversion/metales-preciosos.html",
    city: "Ciudad de México",
    featured: true,
    description: {
      es: "Banco mexicano con servicio de compra y venta de monedas de oro (Centenario, Libertad) y plata.",
      en: "Mexican bank offering buying and selling services for gold coins (Centenario, Libertad) and silver.",
    },
  },
  {
    id: "metalesinversion-mx",
    name: "Metales Inversión",
    countryCode: "mx",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.metalesinversion.com",
    description: {
      es: "Plataforma mexicana para invertir en metales preciosos con entrega a domicilio.",
      en: "Mexican platform for investing in precious metals with home delivery.",
    },
  },

  // ── Turquía ───────────────────────────────────────────────────────────────
  {
    id: "iar-turkey",
    name: "İstanbul Altın Rafinerisi (İAR)",
    countryCode: "tr",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.iar.com.tr",
    city: "İstanbul",
    featured: true,
    description: {
      es: "La refinería de oro más grande de Turquía, con venta directa de lingotes y monedas certificadas.",
      en: "Turkey's largest gold refinery, with direct sale of certified bars and coins.",
      tr: "Türkiye'nin en büyük altın rafinerisi. Sertifikalı külçe ve madeni para doğrudan satışı yapılmaktadır.",
    },
  },
  {
    id: "altin-borsa-tr",
    name: "Borsa Istanbul — Kıymetli Madenler",
    countryCode: "tr",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.borsaistanbul.com/tr/sayfa/1264/kiymetli-madenler-piyasasi",
    description: {
      es: "Mercado oficial de metales preciosos de la Bolsa de Estambul, con acceso a través de intermediarios regulados.",
      en: "Official precious metals market of the Istanbul Stock Exchange, accessible through regulated brokers.",
      tr: "Borsa İstanbul'un resmi kıymetli madenler piyasası; düzenlenmiş aracılar üzerinden erişilebilir.",
    },
  },

  // ── India ─────────────────────────────────────────────────────────────────
  {
    id: "mmtc-pamp",
    name: "MMTC-PAMP India",
    countryCode: "in",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.mmtcpamp.com",
    city: "Nueva Delhi",
    featured: true,
    description: {
      es: "Joint venture oficial entre el Gobierno de India y PAMP Suisse para la venta de oro y plata certificados.",
      en: "Official joint venture between the Government of India and PAMP Suisse for certified gold and silver sales.",
      hi: "भारत सरकार और PAMP Suisse के बीच आधिकारिक संयुक्त उद्यम, प्रमाणित सोने-चांदी की बिक्री के लिए।",
    },
  },
  {
    id: "malabar-gold",
    name: "Malabar Gold & Diamonds",
    countryCode: "in",
    type: "physical",
    metals: ["XAU", "XAG"],
    city: "Kozhikode",
    website: "https://www.malabargoldanddiamonds.com",
    description: {
      es: "Una de las mayores cadenas de joyería de India, con más de 300 tiendas y venta de oro de inversión.",
      en: "One of India's largest jewellery chains, with over 300 stores and investment gold sales.",
    },
  },

  // ── Arabia Saudí ──────────────────────────────────────────────────────────
  {
    id: "alrajhi-gold",
    name: "Al Rajhi Bank — Gold",
    countryCode: "sa",
    type: "both",
    metals: ["XAU"],
    website: "https://www.alrajhibank.com.sa",
    city: "Riad",
    featured: true,
    description: {
      es: "El mayor banco islámico del mundo ofrece compra de oro físico y cuentas de oro a sus clientes.",
      en: "The world's largest Islamic bank offers physical gold purchases and gold accounts to its customers.",
      ar: "يقدم أكبر بنك إسلامي في العالم خدمات شراء الذهب المادي وحسابات الذهب لعملائه.",
    },
  },
  {
    id: "saudi-gold",
    name: "Saudi Gold",
    countryCode: "sa",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.saudigold.com",
    description: {
      es: "Plataforma online saudí para la inversión en metales preciosos físicos con almacenamiento certificado.",
      en: "Saudi online platform for investment in physical precious metals with certified storage.",
      ar: "منصة سعودية عبر الإنترنت للاستثمار في المعادن الثمينة المادية مع تخزين معتمد.",
    },
  },

  // ── China ─────────────────────────────────────────────────────────────────
  {
    id: "ccb-gold",
    name: "China Construction Bank — Gold",
    countryCode: "cn",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.ccb.com",
    city: "Pekín",
    featured: true,
    description: {
      es: "Uno de los cuatro grandes bancos de China, ofrece cuentas de oro y plata físicos a clientes minoristas.",
      en: "One of China's four major banks, offering physical gold and silver accounts to retail customers.",
      zh: "中国四大银行之一，向零售客户提供实物黄金和白银账户。",
    },
  },
  {
    id: "china-gold",
    name: "China Gold (中国黄金)",
    countryCode: "cn",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.cngold.com.cn",
    city: "Pekín",
    description: {
      es: "Empresa estatal china líder en el sector del oro, con cientos de tiendas en todo el país.",
      en: "China's leading state-owned gold company, with hundreds of stores across the country.",
      zh: "中国领先的国有黄金企业，在全国设有数百家门店。",
    },
  },

  // ── Suiza ─────────────────────────────────────────────────────────────────
  {
    id: "pamp",
    name: "PAMP Suisse",
    countryCode: "ch",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.pamp.com",
    city: "Mendrisio",
    featured: true,
    description: {
      es: "Una de las refinerías de metales preciosos más reputadas del mundo, referencia global en lingotes certificados.",
      en: "One of the world's most reputable precious metals refineries, a global reference for certified bars.",
      de: "Eine der renommiertesten Edelmetallraffinerien der Welt und globale Referenz für zertifizierte Barren.",
      zh: "世界上最具声誉的贵金属精炼厂之一，是认证金条的全球标杆。",
      ar: "إحدى أكثر مصافي المعادن الثمينة سمعةً في العالم، مرجع عالمي للسبائك المعتمدة.",
      tr: "Dünyanın en prestijli kıymetli maden rafinerilerinden biri ve sertifikalı külçeler için küresel bir referans.",
    },
  },
  // ── Francia ───────────────────────────────────────────────────────────────
  {
    id: "aucoffre",
    name: "AuCOFFRE.com",
    countryCode: "fr",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.aucoffre.com",
    featured: true,
    description: {
      es: "Plataforma francesa líder para comprar, vender y almacenar metales preciosos físicos en bóvedas certificadas.",
      en: "Leading French platform to buy, sell and store physical precious metals in certified vaults.",
      de: "Führende französische Plattform zum Kauf, Verkauf und zur Lagerung physischer Edelmetalle in zertifizierten Tresoren.",
      fr: "Plateforme française leader pour acheter, vendre et stocker des métaux précieux physiques dans des coffres certifiés.",
    },
  },
  {
    id: "cga-france",
    name: "CGA — Compagnie Générale d'Affinage",
    countryCode: "fr",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.cga.fr",
    city: "Lyon",
    featured: true,
    description: {
      es: "Una de las refinerías de metales preciosos más antiguas de Francia, con venta directa de lingotes certificados.",
      en: "One of France's oldest precious metals refineries, with direct sale of certified bars.",
      de: "Eine der ältesten Edelmetallraffinerien Frankreichs mit Direktverkauf von zertifizierten Barren.",
    },
  },
  {
    id: "or-fr",
    name: "OR.fr",
    countryCode: "fr",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.or.fr",
    description: {
      es: "Tienda online francesa especializada en monedas y lingotes de oro y plata con precios competitivos.",
      en: "French online shop specialising in gold and silver coins and bars at competitive prices.",
    },
  },

  // ── Italia ────────────────────────────────────────────────────────────────
  {
    id: "italpreziosi",
    name: "Italpreziosi",
    countryCode: "it",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.italpreziosi.it",
    city: "Arezzo",
    featured: true,
    description: {
      es: "Refinería italiana de referencia con venta directa de lingotes y monedas de inversión, sede en Arezzo, capital del oro italiano.",
      en: "Italy's reference refinery with direct sale of investment bars and coins, headquartered in Arezzo, the Italian gold capital.",
      de: "Italiens Referenzraffinerie mit Direktverkauf von Anlagebarren und -münzen, mit Sitz in Arezzo, der italienischen Goldhauptstadt.",
    },
  },
  {
    id: "oro-in-euro",
    name: "Oro in Euro",
    countryCode: "it",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.oroinveuro.it",
    description: {
      es: "Plataforma italiana para la compra de oro y plata de inversión con envío seguro a toda Italia.",
      en: "Italian platform for buying investment gold and silver with secure delivery across Italy.",
    },
  },
  {
    id: "compro-oro-it",
    name: "ComproOro",
    countryCode: "it",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.comproorogioielli.it",
    city: "Milán",
    description: {
      es: "Red de tiendas físicas en Italia para comprar y vender oro y joyería, con presencia en las principales ciudades.",
      en: "Network of physical stores in Italy for buying and selling gold and jewellery, with presence in major cities.",
    },
  },

  // ── Portugal ──────────────────────────────────────────────────────────────
  {
    id: "ourico-ouro",
    name: "Ouriço d'Ouro",
    countryCode: "pt",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.ouricodouro.pt",
    city: "Lisboa",
    featured: true,
    description: {
      es: "Dealer portugués de referencia con tienda física en Lisboa y venta online de monedas y lingotes.",
      en: "Portugal's reference dealer with a physical store in Lisbon and online sale of coins and bars.",
      de: "Portugals Referenzhändler mit Ladengeschäft in Lissabon und Online-Verkauf von Münzen und Barren.",
    },
  },
  {
    id: "cgd-metais",
    name: "Caixa Geral de Depósitos — Metais",
    countryCode: "pt",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.cgd.pt/Particulares/Poupanca-Investimento/Metais-Preciosos/Pages/Metais-Preciosos.aspx",
    city: "Lisboa",
    description: {
      es: "El mayor banco público de Portugal ofrece compra de monedas y lingotes de oro y plata en sus sucursales.",
      en: "Portugal's largest public bank offers purchase of gold and silver coins and bars at its branches.",
    },
  },

  // ── Australia ─────────────────────────────────────────────────────────────
  {
    id: "perthmint",
    name: "The Perth Mint",
    countryCode: "au",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.perthmint.com",
    city: "Perth",
    featured: true,
    description: {
      es: "La ceca más antigua de Australia y uno de los mayores productores de monedas y lingotes de oro del mundo, con garantía del gobierno de Australia Occidental.",
      en: "Australia's oldest mint and one of the world's largest producers of gold coins and bars, backed by the Western Australian Government.",
      de: "Australiens älteste Münzprägestätte und einer der weltweit größten Produzenten von Goldmünzen und -barren, unterstützt von der Regierung Westaustraliens.",
      zh: "澳大利亚最古老的造币厂，也是世界上最大的金币和金条生产商之一，得到西澳大利亚政府的支持。",
    },
  },
  {
    id: "abc-bullion",
    name: "ABC Bullion",
    countryCode: "au",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.abcbullion.com.au",
    city: "Sídney",
    featured: true,
    description: {
      es: "Dealer australiano de referencia con tiendas físicas en Sídney y Melbourne y una de las mayores plataformas online de lingotes de Australia.",
      en: "Australia's reference dealer with physical stores in Sydney and Melbourne and one of Australia's largest online bullion platforms.",
      de: "Australiens Referenzhändler mit Ladengeschäften in Sydney und Melbourne und einer der größten australischen Online-Barren-Plattformen.",
    },
  },
  {
    id: "guardian-gold-au",
    name: "Guardian Gold",
    countryCode: "au",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.guardiangold.com.au",
    city: "Melbourne",
    description: {
      es: "Dealer australiano con presencia física en Melbourne especializado en monedas y lingotes para inversores minoristas.",
      en: "Australian dealer with physical presence in Melbourne specialising in coins and bars for retail investors.",
    },
  },

  // ── Canadá ─────────────────────────────────────────────────────────────────
  {
    id: "rcm-canada",
    name: "Royal Canadian Mint",
    countryCode: "ca",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.mint.ca",
    city: "Ottawa",
    featured: true,
    description: {
      es: "La casa de la moneda oficial de Canadá, productora de las mundialmente conocidas monedas Maple Leaf de oro y plata, con venta directa.",
      en: "Canada's official mint, producer of the world-renowned gold and silver Maple Leaf coins, with direct sales.",
      de: "Kanadas offizielle Münzanstalt, Produzentin der weltbekannten Gold- und Silber-Maple-Leaf-Münzen, mit Direktverkauf.",
      zh: "加拿大官方造币厂，世界知名枫叶金银币的生产商，提供直销服务。",
      ar: "دار سك العملة الرسمية في كندا، منتجة عملات ورقة القيقب الذهبية والفضية الشهيرة عالمياً، مع بيع مباشر.",
    },
  },
  {
    id: "kitco-canada",
    name: "Kitco Canada",
    countryCode: "ca",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://online.kitco.com",
    city: "Montreal",
    featured: true,
    description: {
      es: "La división de venta online del referente mundial en información de metales preciosos, con sede en Montreal.",
      en: "The online sales arm of the world's leading precious metals information source, headquartered in Montreal.",
      de: "Der Online-Vertriebsarm der weltweit führenden Informationsquelle für Edelmetalle mit Hauptsitz in Montreal.",
    },
  },
  {
    id: "silvergoldbull-ca",
    name: "Silver Gold Bull",
    countryCode: "ca",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.silvergoldbull.ca",
    description: {
      es: "Dealer online canadiense con precios muy competitivos y amplia selección de monedas y lingotes con envío a todo Canadá.",
      en: "Canadian online dealer with very competitive prices and wide selection of coins and bars with shipping across Canada.",
    },
  },

  {
    id: "goldmoney",
    name: "GoldMoney",
    countryCode: "ch",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.goldmoney.com",
    description: {
      es: "Plataforma internacional con sede en Jersey/Suiza que permite comprar y almacenar metales preciosos en bóvedas certificadas.",
      en: "International platform based in Jersey/Switzerland that allows buying and storing precious metals in certified vaults.",
      de: "Internationale Plattform mit Sitz in Jersey/Schweiz, die den Kauf und die Lagerung von Edelmetallen in zertifizierten Tresoren ermöglicht.",
    },
  },

  // ── Global / Online ────────────────────────────────────────────────────────
  {
    id: "bullionvault",
    name: "BullionVault",
    countryCode: "gb",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.bullionvault.com",
    featured: true,
    description: {
      es: "La mayor plataforma online del mundo para comprar y vender oro y plata físicos en bóvedas bancarias en Zurich, Londres, Nueva York, Toronto y Singapur.",
      en: "The world's largest online platform for buying and selling physical gold and silver in bank vaults in Zurich, London, New York, Toronto and Singapore.",
      de: "Die weltweit größte Online-Plattform für den Kauf und Verkauf von physischem Gold und Silber in Banktresoren in Zürich, London, New York, Toronto und Singapur.",
      zh: "全球最大的在线平台，用于在苏黎世、伦敦、纽约、多伦多和新加坡的银行金库中买卖实物黄金和白银。",
      ar: "أكبر منصة عبر الإنترنت في العالم لشراء وبيع الذهب والفضة المادية في خزائن بنكية في زيورخ ولندن ونيويورك وتورنتو وسنغافورة.",
      tr: "Zürih, Londra, New York, Toronto ve Singapur'daki banka kasalarında fiziksel altın ve gümüş alıp satmak için dünyanın en büyük çevrimiçi platformu.",
    },
  },
  {
    id: "kitco",
    name: "Kitco",
    countryCode: "us",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.kitco.com",
    description: {
      es: "Referente mundial en información de metales preciosos con tienda online para compra de lingotes y monedas.",
      en: "Global reference for precious metals information with an online store for buying bars and coins.",
      de: "Weltweite Referenz für Edelmetallinformationen mit einem Online-Shop für den Kauf von Barren und Münzen.",
    },
  },
];

export function getDealersByCountry(countryCode: string): Dealer[] {
  return DEALERS.filter((d) => d.countryCode === countryCode);
}

export function getCountryBySlug(slug: string, locale: string): DealerCountry | undefined {
  return DEALER_COUNTRIES.find((c) => {
    const localeSlug = c.slug[locale] ?? c.slug.en;
    return localeSlug === slug;
  });
}

export function getAllCountryCodes(): string[] {
  return DEALER_COUNTRIES.map((c) => c.code);
}

export function getCountryName(country: DealerCountry, locale: string): string {
  return country.nameI18n[locale] ?? country.nameI18n.en ?? country.code;
}

export const DEALER_BASE_PATHS: Record<string, string> = {
  es: "/donde-comprar",
  en: "/where-to-buy",
  de: "/wo-kaufen",
  zh: "/goumai-didian",
  ar: "/amakin-alshira",
  tr: "/nereden-alinir",
  hi: "/kahan-kharidem",
};
