export type DealerType = "online" | "physical" | "both";
export type MetalSymbol = "XAU" | "XAG" | "XPT" | "XPD";

export interface Dealer {
  id: string;
  name: string;
  countryCode: string;
  type: DealerType;
  metals: MetalSymbol[];
  website?: string;
  affiliateUrl?: string;
  description: Partial<Record<string, string>>;
  city?: string;
  featured?: boolean;
  verified?: boolean;
}

/**
 * Returns the best outbound URL for a dealer: affiliate link (with UTM) if
 * available, otherwise the plain website. Returns undefined when neither exists.
 */
export function getDealerOutboundUrl(
  dealer: Dealer,
  utmContent = "dealer-card",
): string | undefined {
  if (dealer.affiliateUrl) {
    const sep = dealer.affiliateUrl.includes("?") ? "&" : "?";
    return `${dealer.affiliateUrl}${sep}utm_source=metalorix&utm_medium=affiliate&utm_content=${utmContent}`;
  }
  return dealer.website;
}

/** Dealers that have an active affiliate programme. */
// Only dealers with a REAL tracking URL (not placeholder).
// Add back when affiliate programs are approved:
//   "apmex"      — Impact.com rejected; try direct or ShareASale
//   "jmbullion"  — Awin ID 2853625 applied, awaiting JM Bullion program approval
//   "sdbullion"  — pending registration
//   "bullionbypost" — pending registration
//   "bitpanda"   — pending (same Impact.com platform, blocked)
//   "goldavenue-fr" — pending registration
//   "silvergoldbull-ca" — pending registration
export const FEATURED_AFFILIATE_DEALERS = [
  "bullionvault",
] as const;

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
  {
    code: "at",
    flagEmoji: "🇦🇹",
    slug: { es: "austria", en: "austria", de: "oesterreich", zh: "aodili", ar: "alnimsawy", tr: "avusturya", hi: "austria" },
    nameI18n: { es: "Austria", en: "Austria", de: "Österreich", zh: "奥地利", ar: "النمسا", tr: "Avusturya", hi: "Austria" },
  },
  {
    code: "ae",
    flagEmoji: "🇦🇪",
    slug: { es: "emiratos-arabes", en: "uae", de: "vae", zh: "alian", ar: "al-imarat", tr: "bae", hi: "uae" },
    nameI18n: { es: "Emiratos Árabes", en: "UAE", de: "VAE", zh: "阿联酋", ar: "الإمارات", tr: "BAE", hi: "UAE" },
  },
  {
    code: "ar",
    flagEmoji: "🇦🇷",
    slug: { es: "argentina", en: "argentina", de: "argentinien", zh: "agenting", ar: "alargentina", tr: "arjantin", hi: "argentina" },
    nameI18n: { es: "Argentina", en: "Argentina", de: "Argentinien", zh: "阿根廷", ar: "الأرجنتين", tr: "Arjantin", hi: "Argentina" },
  },
  {
    code: "co",
    flagEmoji: "🇨🇴",
    slug: { es: "colombia", en: "colombia", de: "kolumbien", zh: "gelunbiya", ar: "kolombya", tr: "kolombiya", hi: "colombia" },
    nameI18n: { es: "Colombia", en: "Colombia", de: "Kolumbien", zh: "哥伦比亚", ar: "كولومبيا", tr: "Kolombiya", hi: "Colombia" },
  },
  {
    code: "jp",
    flagEmoji: "🇯🇵",
    slug: { es: "japon", en: "japan", de: "japan", zh: "riben", ar: "alyaban", tr: "japonya", hi: "japan" },
    nameI18n: { es: "Japón", en: "Japan", de: "Japan", zh: "日本", ar: "اليابان", tr: "Japonya", hi: "Japan" },
  },
  {
    code: "nl",
    flagEmoji: "🇳🇱",
    slug: { es: "paises-bajos", en: "netherlands", de: "niederlande", zh: "helan", ar: "holanda", tr: "hollanda", hi: "netherlands" },
    nameI18n: { es: "Países Bajos", en: "Netherlands", de: "Niederlande", zh: "荷兰", ar: "هولندا", tr: "Hollanda", hi: "Netherlands" },
  },
  {
    code: "br",
    flagEmoji: "🇧🇷",
    slug: { es: "brasil", en: "brazil", de: "brasilien", zh: "baxiEr", ar: "albrazil", tr: "brezilya", hi: "brazil" },
    nameI18n: { es: "Brasil", en: "Brazil", de: "Brasilien", zh: "巴西", ar: "البرازيل", tr: "Brezilya", hi: "Brazil" },
  },
  {
    code: "be",
    flagEmoji: "🇧🇪",
    slug: { es: "belgica", en: "belgium", de: "belgien", zh: "bilishi", ar: "beljika", tr: "belcika", hi: "belgium" },
    nameI18n: { es: "Bélgica", en: "Belgium", de: "Belgien", zh: "比利时", ar: "بلجيكا", tr: "Belçika", hi: "Belgium" },
  },
  {
    code: "kr",
    flagEmoji: "🇰🇷",
    slug: { es: "corea-del-sur", en: "south-korea", de: "suedkorea", zh: "hanguo", ar: "korea-aljanubia", tr: "guney-kore", hi: "south-korea" },
    nameI18n: { es: "Corea del Sur", en: "South Korea", de: "Südkorea", zh: "韩国", ar: "كوريا الجنوبية", tr: "Güney Kore", hi: "South Korea" },
  },
  {
    code: "pl",
    flagEmoji: "🇵🇱",
    slug: { es: "polonia", en: "poland", de: "polen", zh: "bolan", ar: "boulonia", tr: "polonya", hi: "poland" },
    nameI18n: { es: "Polonia", en: "Poland", de: "Polen", zh: "波兰", ar: "بولندا", tr: "Polonya", hi: "Poland" },
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
    id: "onlygold-es",
    name: "OnlyGold.es",
    countryCode: "es",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.onlygold.es",
    description: {
      es: "Tienda online española especializada exclusivamente en oro y plata de inversión, con precios muy ajustados al spot.",
      en: "Spanish online shop specialising exclusively in investment gold and silver, with prices very close to spot.",
    },
  },
  {
    id: "fnmt-es",
    name: "Fábrica Nacional de Moneda y Timbre (FNMT)",
    countryCode: "es",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.fnmt.es/coleccionistas",
    city: "Madrid",
    featured: true,
    verified: true,
    description: {
      es: "La casa de la moneda oficial de España, dependiente del Banco de España, produce y vende monedas coleccionables y de inversión directamente al público.",
      en: "Spain's official mint, under the Bank of Spain, produces and sells collectible and investment coins directly to the public.",
      de: "Spaniens offizielle Münzanstalt, unter der Aufsicht der Banco de España, produziert und verkauft Sammel- und Anlagemünzen direkt an die Öffentlichkeit.",
    },
  },
  {
    id: "elcorteingles-joyeria",
    name: "El Corte Inglés — Joyería",
    countryCode: "es",
    type: "physical",
    metals: ["XAU", "XAG"],
    city: "Madrid",
    website: "https://www.elcorteingles.es/joyeria-y-relojes/monedas-y-medallas/",
    description: {
      es: "Los grandes almacenes de referencia en España venden monedas de oro (Krugerrand, Maple Leaf) y plata en sus secciones de joyería.",
      en: "Spain's leading department stores sell gold coins (Krugerrand, Maple Leaf) and silver in their jewellery sections.",
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
    verified: true,
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
    // affiliateUrl: pending — Impact.com rejected, apply direct at apmex.com/affiliate-program
    featured: true,
    verified: true,
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
    // affiliateUrl: pending — Awin ID 2853625 applied, awaiting JM Bullion program approval
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
    // affiliateUrl: pending registration
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
    affiliateUrl: "https://www.bullionbypost.co.uk",
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
    verified: true,
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
    verified: true,
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
    verified: true,
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

  // ── Austria ───────────────────────────────────────────────────────────────
  {
    id: "bitpanda",
    name: "Bitpanda Metals",
    countryCode: "at",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.bitpanda.com/en/metals",
    affiliateUrl: "https://www.bitpanda.com/en/metals",
    featured: true,
    description: {
      es: "La mayor plataforma europea de inversión digital, con sede en Viena, permite comprar fracciones de metales preciosos físicos almacenados en bóvedas certificadas.",
      en: "Europe's largest digital investment platform, headquartered in Vienna, allows buying fractions of physical precious metals stored in certified vaults.",
      de: "Europas größte digitale Investitionsplattform mit Sitz in Wien ermöglicht den Kauf von Bruchteilen physischer Edelmetalle in zertifizierten Tresoren.",
      zh: "总部位于维也纳的欧洲最大数字投资平台，允许购买存储在认证金库中的实物贵金属的部分份额。",
      ar: "أكبر منصة استثمار رقمية في أوروبا، مقرها فيينا، تتيح شراء أجزاء من المعادن الثمينة المادية المخزنة في خزائن معتمدة.",
      tr: "Viyana merkezli Avrupa'nın en büyük dijital yatırım platformu, sertifikalı kasalarda saklanan fiziksel kıymetli metallerin fraksiyonlarını satın almanıza olanak tanır.",
    },
  },
  {
    id: "munze-oesterreich",
    name: "Münze Österreich (Austrian Mint)",
    countryCode: "at",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.muenzeoesterreich.at",
    city: "Viena",
    featured: true,
    verified: true,
    description: {
      es: "La Casa de la Moneda de Austria, productora de la mundialmente famosa moneda Filarmónica de Viena en oro y plata, con venta directa al público.",
      en: "The Austrian Mint, producer of the world-famous Vienna Philharmonic coin in gold and silver, with direct sales to the public.",
      de: "Die Münze Österreich, Produzentin der weltbekannten Wiener Philharmoniker Münze in Gold und Silber, mit Direktverkauf an die Öffentlichkeit.",
      zh: "奥地利造币厂，世界著名维也纳爱乐乐团金银纪念币的生产商，提供直销服务。",
    },
  },

  // ── UAE (Emiratos Árabes) ──────────────────────────────────────────────────
  {
    id: "dubai-gold-souk",
    name: "Dubai Gold Souk",
    countryCode: "ae",
    type: "physical",
    metals: ["XAU", "XAG"],
    city: "Dubái",
    website: "https://www.visitdubai.com/en/places-to-visit/gold-souk",
    featured: true,
    description: {
      es: "El mayor mercado de oro del mundo, ubicado en el barrio de Deira de Dubái, con más de 300 joyeros y dealers de lingotes y monedas.",
      en: "The world's largest gold market, located in Dubai's Deira district, with over 300 jewellers and bullion and coin dealers.",
      de: "Der größte Goldmarkt der Welt im Deira-Viertel von Dubai mit über 300 Juwelieren und Barren- und Münzhändlern.",
      ar: "أكبر سوق للذهب في العالم، يقع في حي ديرة بدبي، مع أكثر من 300 صائغ وتاجر سبائك وعملات.",
    },
  },
  {
    id: "emirates-gold",
    name: "Emirates Gold",
    countryCode: "ae",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.emiratesgold.ae",
    city: "Dubái",
    featured: true,
    verified: true,
    description: {
      es: "Refinería de oro de la LBMA ubicada en Dubái, con venta directa de lingotes certificados Good Delivery al mercado minorista.",
      en: "LBMA-accredited gold refinery based in Dubai, with direct sale of Good Delivery certified bars to the retail market.",
      de: "LBMA-akkreditierte Goldraffinerie in Dubai mit Direktverkauf von Good Delivery-zertifizierten Barren an den Einzelhandel.",
      ar: "مصفاة ذهب معتمدة من LBMA في دبي، مع بيع مباشر للسبائك المعتمدة Good Delivery للسوق التجزئة.",
    },
  },
  {
    id: "dgcx",
    name: "DGCX — Dubai Gold & Commodities Exchange",
    countryCode: "ae",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.dgcx.ae",
    city: "Dubái",
    description: {
      es: "Bolsa de materias primas de Dubái que permite la negociación de futuros y físico de metales preciosos a inversores acreditados.",
      en: "Dubai commodities exchange enabling trading of precious metals futures and physical delivery to accredited investors.",
      ar: "بورصة دبي للسلع تتيح تداول العقود الآجلة وتسليم المعادن الثمينة المادية للمستثمرين المعتمدين.",
    },
  },

  // ── Argentina ─────────────────────────────────────────────────────────────
  {
    id: "cnm-argentina",
    name: "Casa Nacional de la Moneda Argentina",
    countryCode: "ar",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.casademoneda.gob.ar",
    city: "Buenos Aires",
    featured: true,
    description: {
      es: "La Casa de la Moneda oficial de Argentina, dependiente del Ministerio de Economía, produce y comercializa monedas de oro y plata de inversión.",
      en: "Argentina's official mint, under the Ministry of Economy, produces and sells investment gold and silver coins.",
    },
  },
  {
    id: "banco-nacion-ar",
    name: "Banco de la Nación Argentina — Metales",
    countryCode: "ar",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.bna.com.ar",
    city: "Buenos Aires",
    description: {
      es: "El mayor banco público de Argentina ofrece compra y venta de monedas de oro y plata en sus sucursales, con precios regulados.",
      en: "Argentina's largest public bank offers buying and selling of gold and silver coins at its branches, with regulated prices.",
    },
  },
  {
    id: "metalon-ar",
    name: "Metalon",
    countryCode: "ar",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.metalon.com.ar",
    description: {
      es: "Plataforma argentina para la compra y venta de metales preciosos online con custodia en bóveda certificada.",
      en: "Argentine platform for online buying and selling of precious metals with custody in a certified vault.",
    },
  },

  // ── Colombia ──────────────────────────────────────────────────────────────
  {
    id: "banco-republica-co",
    name: "Banco de la República — Museo del Oro",
    countryCode: "co",
    type: "physical",
    metals: ["XAU"],
    website: "https://www.banrepcultural.org/bogota/museo-del-oro",
    city: "Bogotá",
    featured: true,
    description: {
      es: "El Banco Central de Colombia gestiona el Museo del Oro y comercializa réplicas y monedas oficiales de oro para coleccionistas e inversores.",
      en: "Colombia's Central Bank manages the Gold Museum and sells official gold coins and replicas for collectors and investors.",
    },
  },
  {
    id: "oro-colombia",
    name: "OroCompra Colombia",
    countryCode: "co",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.orocompra.com.co",
    city: "Medellín",
    description: {
      es: "Empresa colombiana especializada en la compra y venta de oro físico, con tiendas en Medellín y Bogotá.",
      en: "Colombian company specialising in buying and selling physical gold, with stores in Medellín and Bogotá.",
    },
  },

  // ── Más dealers para Francia ──────────────────────────────────────────────
  {
    id: "godot-fils",
    name: "Godot & Fils",
    countryCode: "fr",
    type: "both",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.godot-et-fils.fr",
    city: "París",
    description: {
      es: "Casa numismática parisina con más de un siglo de historia, especializada en monedas de oro y plata de inversión y colección.",
      en: "Parisian numismatic house with over a century of history, specialising in investment and collectible gold and silver coins.",
      de: "Pariser Numismatikhaus mit über einem Jahrhundert Geschichte, spezialisiert auf Anlage- und Sammlermünzen aus Gold und Silber.",
    },
  },
  {
    id: "monnaie-paris",
    name: "La Monnaie de Paris",
    countryCode: "fr",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.monnaiedeparis.fr",
    city: "París",
    featured: true,
    verified: true,
    description: {
      es: "La casa de la moneda oficial de Francia y la más antigua del mundo (864 d.C.), produce y vende monedas de oro y plata directamente al público.",
      en: "France's official mint and the world's oldest (864 AD), produces and sells gold and silver coins directly to the public.",
      de: "Frankreichs offizielle Münzanstalt und die älteste der Welt (864 n. Chr.), produziert und verkauft Gold- und Silbermünzen direkt an die Öffentlichkeit.",
    },
  },
  {
    id: "goldavenue-fr",
    name: "Gold Avenue",
    countryCode: "fr",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.goldavenue.com",
    affiliateUrl: "https://www.goldavenue.com",
    description: {
      es: "Plataforma online de MKS PAMP Group para comprar y almacenar metales preciosos en bóvedas suizas, disponible para clientes franceses.",
      en: "MKS PAMP Group's online platform to buy and store precious metals in Swiss vaults, available for French customers.",
    },
  },

  // ── Más dealers para Italia ───────────────────────────────────────────────
  {
    id: "bolognino-it",
    name: "Bolognino",
    countryCode: "it",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.bolognino.it",
    city: "Turín",
    description: {
      es: "Histórica numismática italiana con tienda física en Turín y venta online de monedas y lingotes de inversión.",
      en: "Historic Italian numismatic shop with physical store in Turin and online sale of investment coins and bars.",
    },
  },
  {
    id: "monetarium-it",
    name: "Monetarium",
    countryCode: "it",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.monetarium.it",
    city: "Roma",
    description: {
      es: "Dealer romano especializado en monedas antiguas y metales preciosos de inversión, con décadas de experiencia.",
      en: "Roman dealer specialising in ancient coins and investment precious metals, with decades of experience.",
    },
  },

  // ── Más dealers para Portugal ─────────────────────────────────────────────
  {
    id: "numisma-pt",
    name: "Numisma",
    countryCode: "pt",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.numisma.pt",
    city: "Lisboa",
    description: {
      es: "Numismática portuguesa con tienda física en Lisboa y amplia selección de monedas de oro y plata para inversión.",
      en: "Portuguese numismatic shop with physical store in Lisbon and wide selection of investment gold and silver coins.",
    },
  },
  {
    id: "ouronovo-pt",
    name: "OuroNovo",
    countryCode: "pt",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.ouronovo.pt",
    description: {
      es: "Plataforma online portuguesa para la compra de oro y plata de inversión con precios competitivos y envío seguro.",
      en: "Portuguese online platform for buying investment gold and silver with competitive prices and secure delivery.",
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
    verified: true,
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
    verified: true,
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
    verified: true,
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
    verified: true,
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
    affiliateUrl: "https://www.silvergoldbull.ca",
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
    affiliateUrl: "https://www.bullionvaultaffiliate.com/METALORIX/en",
    featured: true,
    verified: true,
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

  // ── Japón ─────────────────────────────────────────────────────────────────
  {
    id: "tanaka-kikinzoku",
    name: "Tanaka Kikinzoku Kogyo",
    countryCode: "jp",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.tanaka.co.jp",
    city: "Tokio",
    featured: true,
    verified: true,
    description: {
      es: "Uno de los mayores refinadores y distribuidores de metales preciosos de Japón, con más de 130 años de historia y tiendas en Tokio y otras ciudades.",
      en: "One of Japan's largest precious metals refiners and distributors, with over 130 years of history and stores in Tokyo and other cities.",
      de: "Einer der größten Edelmetallraffinerien und -händler Japans mit über 130 Jahren Geschichte und Filialen in Tokio und anderen Städten.",
      zh: "日本最大的贵金属精炼商和经销商之一，拥有130多年历史，在东京和其他城市设有门店。",
    },
  },
  {
    id: "ishifuku-jp",
    name: "Ishifuku Metal Industry",
    countryCode: "jp",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.ishifuku.co.jp",
    city: "Tokio",
    description: {
      es: "Refinería de metales preciosos japonesa y miembro LBMA, con venta directa de lingotes y monedas al público.",
      en: "Japanese precious metals refinery and LBMA member, with direct sale of bars and coins to the public.",
    },
  },
  {
    id: "mitsubishi-gold-jp",
    name: "Mitsubishi Materials — Precious Metals",
    countryCode: "jp",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.mmc.co.jp/precious/index.html",
    city: "Tokio",
    featured: true,
    description: {
      es: "División de metales preciosos del gigante industrial Mitsubishi Materials, con venta de lingotes certificados y monedas de inversión.",
      en: "Precious metals division of industrial giant Mitsubishi Materials, with sale of certified bars and investment coins.",
      zh: "三菱材料工业巨头的贵金属部门，销售认证金条和投资硬币。",
    },
  },

  // ── Países Bajos ──────────────────────────────────────────────────────────
  {
    id: "auvesta-nl",
    name: "Auvesta",
    countryCode: "nl",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.auvesta.com",
    featured: true,
    description: {
      es: "Plataforma europea de metales preciosos con almacenamiento en bóvedas certificadas, muy popular en Holanda.",
      en: "European precious metals platform with certified vault storage, very popular in the Netherlands.",
      de: "Europäische Edelmetallplattform mit zertifizierter Tresorlagerung, sehr beliebt in den Niederlanden.",
    },
  },
  {
    id: "goudwisselkantoor",
    name: "Goudwisselkantoor",
    countryCode: "nl",
    type: "both",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.goudwisselkantoor.nl",
    city: "Ámsterdam",
    featured: true,
    description: {
      es: "El mayor dealer de metales preciosos de los Países Bajos, con tiendas físicas en Ámsterdam y otras ciudades y plataforma online.",
      en: "The largest precious metals dealer in the Netherlands, with physical stores in Amsterdam and other cities and an online platform.",
      de: "Größter Edelmetallhändler der Niederlande mit Filialen in Amsterdam und anderen Städten sowie einer Online-Plattform.",
    },
  },
  {
    id: "zilverwinkel-nl",
    name: "Zilverwinkel",
    countryCode: "nl",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.zilverwinkel.nl",
    description: {
      es: "Tienda online holandesa especializada en plata y oro de inversión con precios muy ajustados al spot.",
      en: "Dutch online shop specialising in investment silver and gold at very tight spot prices.",
    },
  },

  // ── Brasil ────────────────────────────────────────────────────────────────
  {
    id: "ourominas-br",
    name: "Ourominas",
    countryCode: "br",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.ourominas.com",
    city: "São Paulo",
    featured: true,
    description: {
      es: "La mayor corredora de metales preciosos de Brasil, autorizada por el Banco Central, con tiendas físicas y plataforma online.",
      en: "Brazil's largest precious metals broker, authorised by the Central Bank, with physical stores and an online platform.",
    },
  },
  {
    id: "bcb-gold-br",
    name: "Banco do Brasil — Ouro",
    countryCode: "br",
    type: "both",
    metals: ["XAU"],
    website: "https://www.bb.com.br",
    city: "Brasília",
    featured: true,
    description: {
      es: "El mayor banco de Brasil ofrece compra y venta de oro físico en sus agencias, con precios referenciados en la BM&FBOVESPA.",
      en: "Brazil's largest bank offers buying and selling of physical gold at its branches, with prices referenced on BM&FBOVESPA.",
    },
  },
  {
    id: "ouroetc-br",
    name: "OuroETC Brasil",
    countryCode: "br",
    type: "online",
    metals: ["XAU", "XAG"],
    website: "https://www.ouroetc.com.br",
    description: {
      es: "Plataforma online brasileña para invertir en oro y plata con precios al contado y almacenamiento seguro.",
      en: "Brazilian online platform for investing in gold and silver at spot prices with secure storage.",
    },
  },

  // ── Bélgica ───────────────────────────────────────────────────────────────
  {
    id: "goldbroker-be",
    name: "GoldBroker.com",
    countryCode: "be",
    type: "online",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.goldbroker.com",
    featured: true,
    description: {
      es: "Plataforma franco-belga para comprar y almacenar metales preciosos en bóvedas suizas y canadienses, con total propiedad del metal.",
      en: "Franco-Belgian platform to buy and store precious metals in Swiss and Canadian vaults, with full metal ownership.",
      de: "Französisch-belgische Plattform zum Kauf und zur Lagerung von Edelmetallen in Schweizer und kanadischen Tresoren mit vollständigem Metalleigentum.",
    },
  },
  {
    id: "europeanmint-be",
    name: "European Mint",
    countryCode: "be",
    type: "online",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.europeanmint.com",
    featured: true,
    description: {
      es: "Dealer belga online con amplia selección de monedas y lingotes de oro y plata europeos y mundiales.",
      en: "Belgian online dealer with wide selection of European and worldwide gold and silver coins and bars.",
      de: "Belgischer Online-Händler mit breiter Auswahl an europäischen und weltweiten Gold- und Silbermünzen und -barren.",
    },
  },
  {
    id: "argenta-be",
    name: "Argenta Bank — Precious Metals",
    countryCode: "be",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.argenta.be",
    city: "Amberes",
    description: {
      es: "Banco belga que ofrece la compra de monedas y lingotes de oro y plata a sus clientes en sucursales.",
      en: "Belgian bank offering purchase of gold and silver coins and bars to customers at branches.",
    },
  },

  // ── Corea del Sur ─────────────────────────────────────────────────────────
  {
    id: "korea-gold-exchange",
    name: "Korea Gold Exchange (한국금거래소)",
    countryCode: "kr",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.koreagoldex.co.kr",
    city: "Seúl",
    featured: true,
    description: {
      es: "La mayor plataforma de compraventa de oro físico de Corea del Sur, con tiendas en el barrio joyero de Jongno, Seúl.",
      en: "South Korea's largest physical gold trading platform, with stores in Seoul's Jongno jewellery district.",
      zh: "韩国最大的实物黄金交易平台，在首尔钟路珠宝区设有门店。",
    },
  },
  {
    id: "krx-gold-kr",
    name: "KRX Gold Market",
    countryCode: "kr",
    type: "online",
    metals: ["XAU"],
    website: "https://global.krx.co.kr/contents/GLB/05/0501/0501020400/GLB0501020400.jsp",
    city: "Seúl",
    featured: true,
    description: {
      es: "Mercado oficial de oro de la Bolsa de Valores de Corea (KRX), que permite la compra y venta de oro físico de 1 kg a través de intermediarios regulados.",
      en: "Official gold market of the Korea Exchange (KRX), enabling buying and selling of 1 kg physical gold through regulated brokers.",
    },
  },
  {
    id: "shinhan-gold-kr",
    name: "Shinhan Bank — Gold",
    countryCode: "kr",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.shinhan.com",
    city: "Seúl",
    description: {
      es: "Uno de los mayores bancos de Corea del Sur ofrece cuentas de oro y venta de monedas y lingotes certificados.",
      en: "One of South Korea's largest banks offers gold accounts and sale of certified coins and bars.",
    },
  },

  // ── Polonia ───────────────────────────────────────────────────────────────
  {
    id: "mennica-polska",
    name: "Mennica Polska (Polish Mint)",
    countryCode: "pl",
    type: "both",
    metals: ["XAU", "XAG", "XPT"],
    website: "https://www.mennica.com.pl",
    city: "Varsovia",
    featured: true,
    verified: true,
    description: {
      es: "La casa de la moneda oficial de Polonia, con siglos de historia, produce y vende monedas de oro y plata directamente al público.",
      en: "Poland's official mint, with centuries of history, produces and sells gold and silver coins directly to the public.",
      de: "Polens offizielle Münzanstalt mit jahrhundertelanger Geschichte produziert und verkauft Gold- und Silbermünzen direkt an die Öffentlichkeit.",
    },
  },
  {
    id: "goldenmark-pl",
    name: "Goldenmark",
    countryCode: "pl",
    type: "both",
    metals: ["XAU", "XAG", "XPT", "XPD"],
    website: "https://www.goldenmark.com",
    city: "Varsovia",
    featured: true,
    description: {
      es: "El mayor dealer de metales preciosos de Polonia, con tiendas en Varsovia, Cracovia y otras ciudades y plataforma online.",
      en: "Poland's largest precious metals dealer, with stores in Warsaw, Kraków and other cities and an online platform.",
      de: "Polens größter Edelmetallhändler mit Filialen in Warschau, Krakau und anderen Städten sowie einer Online-Plattform.",
    },
  },
  {
    id: "nbp-gold-pl",
    name: "Narodowy Bank Polski — Monety Kolekcjonerskie",
    countryCode: "pl",
    type: "both",
    metals: ["XAU", "XAG"],
    website: "https://www.nbp.pl/home.aspx?f=/monety/monety.html",
    city: "Varsovia",
    description: {
      es: "El Banco Nacional de Polonia emite y vende monedas de oro y plata coleccionables y de inversión directamente al público.",
      en: "The National Bank of Poland issues and sells collectible and investment gold and silver coins directly to the public.",
    },
  },
];

export function slugifyCity(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CityEntry {
  city: string;
  slug: string;
}

export function getCitiesByCountry(countryCode: string): CityEntry[] {
  const seen = new Set<string>();
  const cities: CityEntry[] = [];
  for (const d of DEALERS) {
    if (d.countryCode !== countryCode || !d.city) continue;
    const slug = slugifyCity(d.city);
    if (!seen.has(slug)) {
      seen.add(slug);
      cities.push({ city: d.city, slug });
    }
  }
  return cities;
}

export function getDealersByCity(countryCode: string, citySlug: string): Dealer[] {
  return DEALERS.filter(
    (d) => d.countryCode === countryCode && d.city && slugifyCity(d.city) === citySlug
  );
}

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

export function slugifyDealer(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDealerBySlug(
  countryCode: string,
  citySlug: string,
  dealerSlug: string
): Dealer | undefined {
  return DEALERS.find(
    (d) =>
      d.countryCode === countryCode &&
      d.city &&
      slugifyCity(d.city) === citySlug &&
      slugifyDealer(d.name) === dealerSlug
  );
}

export function businessListingToDealer(bl: {
  id: number;
  businessName: string;
  countryCode: string;
  city: string;
  type: string;
  metals: string[];
  website: string | null;
  description: string | null;
  locale: string;
  featured: boolean;
  verified: boolean;
}): Dealer {
  return {
    id: `bl-${bl.id}`,
    name: bl.businessName,
    countryCode: bl.countryCode,
    type: bl.type as DealerType,
    metals: bl.metals as MetalSymbol[],
    website: bl.website || undefined,
    description: { [bl.locale]: bl.description || "" },
    city: bl.city,
    featured: bl.featured,
    verified: bl.verified,
  };
}

export function getAllDealerSlugs(): {
  country: string;
  city: string;
  dealer: string;
  countryCode: string;
}[] {
  const result: { country: string; city: string; dealer: string; countryCode: string }[] = [];
  for (const d of DEALERS) {
    if (!d.city) continue;
    result.push({
      countryCode: d.countryCode,
      country: "", // filled per-locale at call site
      city: slugifyCity(d.city),
      dealer: slugifyDealer(d.name),
    });
  }
  return result;
}
