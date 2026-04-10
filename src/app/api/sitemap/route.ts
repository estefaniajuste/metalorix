import { NextResponse } from "next/server";
import { getProductSlugsByLocale } from "@/lib/data/product-slugs";
import { CURRENCY_PAGES } from "@/lib/data/currency-pages";
import { DEALER_COUNTRIES, DEALER_BASE_PATHS, getCitiesByCountry, getDealersByCity, slugifyDealer } from "@/lib/data/dealers";

export const dynamic = "force-dynamic";

const BASE = "https://metalorix.com";
const LOCALES = ["es", "en", "zh", "ar", "tr", "de", "hi"] as const;
const DEFAULT_LOCALE = "en";

const PATHNAMES: Record<string, Record<string, string>> = {
  "/": { es: "/es", en: "/en", zh: "/zh", ar: "/ar", tr: "/tr", de: "/de", hi: "/hi" },
  "/herramientas": { es: "/es/herramientas", en: "/en/tools", de: "/de/werkzeuge", zh: "/zh/gongju", ar: "/ar/adawat", tr: "/tr/araclar", hi: "/hi/upakar" },
  "/calculadora-rentabilidad": { es: "/es/calculadora-rentabilidad", en: "/en/roi-calculator", de: "/de/renditerechner", zh: "/zh/shouyi-jisuan", ar: "/ar/hasibat-alarabah", tr: "/tr/getiri-hesaplayici", hi: "/hi/laabh-ganak" },
  "/valor-joyas": { es: "/es/valor-joyas", en: "/en/jewelry-value-calculator", de: "/de/schmuck-wert-rechner", zh: "/zh/zhusbao-jiazhi-jisuan", ar: "/ar/hasibat-qimat-almujawaharat", tr: "/tr/mucevher-deger-hesaplayici", hi: "/hi/jewellery-mulya-ganak" },
  "/fear-greed": { es: "/es/miedo-codicia-metales", en: "/en/fear-greed-metals", de: "/de/angst-gier-metalle", zh: "/zh/kongju-tanlan-zhishu", ar: "/ar/maqyas-alkhawf-altamaa", tr: "/tr/korku-acgozluluk-endeksi", hi: "/hi/bhay-lobh-soochank" },
  "/portfolio": { es: "/es/portfolio", en: "/en/portfolio", de: "/de/portfolio", zh: "/zh/zichan", ar: "/ar/mihfaza", tr: "/tr/portfoy", hi: "/hi/portfolio" },
  "/widget": { es: "/es/widget-precio-oro", en: "/en/gold-price-widget", de: "/de/goldpreis-widget", zh: "/zh/jiage-widget", ar: "/ar/widget-dhahab", tr: "/tr/altin-fiyat-widget", hi: "/hi/sona-mulya-widget" },
  "/conversor-divisas": { es: "/es/conversor-divisas", en: "/en/currency-converter", de: "/de/waehrungsrechner", zh: "/zh/huobi-zhuanhua", ar: "/ar/muhawwil-alumlat", tr: "/tr/doviz-cevirici", hi: "/hi/mudra-badlav" },
  "/comparador": { es: "/es/comparador", en: "/en/comparator", de: "/de/vergleich", zh: "/zh/bijiao", ar: "/ar/muqarin", tr: "/tr/karsilastirma", hi: "/hi/tulana" },
  "/ratio-oro-plata": { es: "/es/ratio-oro-plata", en: "/en/gold-silver-ratio", de: "/de/gold-silber-verhaeltnis", zh: "/zh/jin-yin-bi", ar: "/ar/nisbat-althahab-alfiddah", tr: "/tr/altin-gumus-orani", hi: "/hi/sona-chandi-anupat" },
  "/calendario-economico": { es: "/es/calendario-economico", en: "/en/economic-calendar", de: "/de/wirtschaftskalender", zh: "/zh/jingji-rili", ar: "/ar/altaqwim-aliqtisadi", tr: "/tr/ekonomik-takvim", hi: "/hi/arthik-patra" },
  "/guia-inversion": { es: "/es/guia-inversion", en: "/en/investment-guide", de: "/de/investitionsleitfaden", zh: "/zh/touzi-zhinan", ar: "/ar/dalil-alistithmar", tr: "/tr/yatirim-rehberi", hi: "/hi/nivesh-margdarshika" },
  "/productos": { es: "/es/productos", en: "/en/products", de: "/de/produkte", zh: "/zh/chanpin", ar: "/ar/muntajat", tr: "/tr/urunler", hi: "/hi/utpad" },
  "/noticias": { es: "/es/noticias", en: "/en/news", de: "/de/nachrichten", zh: "/zh/xinwen", ar: "/ar/akhbar", tr: "/tr/haberler", hi: "/hi/samachar" },
  "/learn": { es: "/es/aprende-inversion", en: "/en/learn", de: "/de/lernen-investition", zh: "/zh/xuexi", ar: "/ar/taallam", tr: "/tr/ogren-yatirim", hi: "/hi/gyaan-nivesh" },
  "/alertas": { es: "/es/alertas", en: "/en/alerts", de: "/de/benachrichtigungen", zh: "/zh/jingbao", ar: "/ar/tanbihat", tr: "/tr/uyarilar", hi: "/hi/suchnayen" },
  "/precio-oro-hoy": { es: "/es/precio-oro-hoy", en: "/en/gold-price-today", de: "/de/goldpreis-heute", zh: "/zh/jin-ri-jin-jia", ar: "/ar/sier-althahab-alyawm", tr: "/tr/altin-fiyati-bugun", hi: "/hi/sona-bhav-aaj" },
  "/precio-gramo-oro": { es: "/es/precio-gramo-oro", en: "/en/gold-price-per-gram", de: "/de/goldpreis-pro-gramm", zh: "/zh/mei-ke-jin-jia", ar: "/ar/sier-ghram-althahab", tr: "/tr/gram-altin-fiyati", hi: "/hi/sona-gram-mulya" },
  "/aviso-legal": { es: "/es/aviso-legal", en: "/en/legal-notice", de: "/de/impressum", zh: "/zh/falv-shengming", ar: "/ar/ishaar-qanuni", tr: "/tr/yasal-uyari", hi: "/hi/vidhey-suchna" },
  "/terminos": { es: "/es/terminos", en: "/en/terms", de: "/de/agb", zh: "/zh/tiaokuan", ar: "/ar/shurut", tr: "/tr/sartlar", hi: "/hi/sharten" },
  "/privacidad": { es: "/es/privacidad", en: "/en/privacy", de: "/de/datenschutz", zh: "/zh/yinsi", ar: "/ar/khususiyah", tr: "/tr/gizlilik", hi: "/hi/gagta" },
  "/donde-comprar": { es: "/es/donde-comprar", en: "/en/where-to-buy", de: "/de/wo-kaufen", zh: "/zh/goumai-didian", ar: "/ar/amakin-alshira", tr: "/tr/nereden-alinir", hi: "/hi/kahan-kharidem" },
  "/donde-comprar/mejores": { es: "/es/donde-comprar/mejores", en: "/en/where-to-buy/best", de: "/de/wo-kaufen/beste", zh: "/zh/goumai-didian/zuijia", ar: "/ar/amakin-alshira/afdal", tr: "/tr/nereden-alinir/en-iyi", hi: "/hi/kahan-kharidem/sabse-achhe" },
  "/donde-comprar/registrar": { es: "/es/donde-comprar/registrar", en: "/en/where-to-buy/register", de: "/de/wo-kaufen/registrieren", zh: "/zh/goumai-didian/zhuce", ar: "/ar/amakin-alshira/tasjil", tr: "/tr/nereden-alinir/kayit", hi: "/hi/kahan-kharidem/register" },
  "/prensa": { es: "/es/prensa", en: "/en/press", de: "/de/presse", zh: "/zh/xinwen-ziyuan", ar: "/ar/sahafa", tr: "/tr/basin", hi: "/hi/press" },
  "/precio-bitcoin": {
    es: "/es/precio-bitcoin",
    en: "/en/bitcoin-price",
    de: "/de/bitcoin-preis",
    zh: "/zh/bitcoin-jiage",
    ar: "/ar/sier-bitcoin",
    tr: "/tr/bitcoin-fiyati",
    hi: "/hi/bitcoin-mulya",
  },
  "/comparar/oro-vs-bitcoin": {
    es: "/es/comparar/oro-vs-bitcoin",
    en: "/en/compare/gold-vs-bitcoin",
    de: "/de/vergleich/gold-vs-bitcoin",
    zh: "/zh/bijiao/huangjin-vs-bitcoin",
    ar: "/ar/muqarana/dhahab-vs-bitcoin",
    tr: "/tr/karsilastir/altin-vs-bitcoin",
    hi: "/hi/tulana/sona-vs-bitcoin",
  },
  "/comparar/oro-vs-sp500": {
    es: "/es/comparar/oro-vs-sp500",
    en: "/en/compare/gold-vs-sp500",
    de: "/de/vergleich/gold-vs-sp500",
    zh: "/zh/bijiao/huangjin-vs-sp500",
    ar: "/ar/muqarana/dhahab-vs-sp500",
    tr: "/tr/karsilastir/altin-vs-sp500",
    hi: "/hi/tulana/sona-vs-sp500",
  },
};

const METAL_SLUGS: Record<string, Record<string, string>> = {
  oro: { es: "oro", en: "gold", de: "gold", zh: "huangjin", ar: "dhahab", tr: "altin", hi: "sona" },
  plata: { es: "plata", en: "silver", de: "silber", zh: "baiyin", ar: "fiddah", tr: "gumus", hi: "chandi" },
  platino: { es: "platino", en: "platinum", de: "platin", zh: "bojin", ar: "blatiin", tr: "platin", hi: "platinam" },
  paladio: { es: "paladio", en: "palladium", de: "palladium", zh: "bajin", ar: "baladiyum", tr: "paladyum", hi: "palladium" },
  cobre: { es: "cobre", en: "copper", de: "kupfer", zh: "tong", ar: "nuhas", tr: "bakir", hi: "tamba" },
};

const PRICE_PATHS: Record<string, string> = {
  es: "precio", en: "price", de: "preis", zh: "jiage", ar: "sier", tr: "fiyat", hi: "mulya",
};

const HISTORICAL_SEGMENT: Record<string, string> = {
  es: "historico",
  en: "history",
  de: "historie",
  zh: "lishi",
  ar: "tarikhi",
  tr: "gecmis",
  hi: "itihaas",
};

const PRODUCT_SLUGS = [
  "krugerrand-oro", "maple-leaf-oro", "filarmonica-oro", "britannia-oro", "eagle-oro",
  "maple-leaf-plata", "filarmonica-plata", "britannia-plata", "eagle-plata", "krugerrand-plata",
  "lingote-oro-1oz", "lingote-oro-100g", "lingote-oro-1kg",
  "lingote-plata-1kg",
];

const PRODUCT_BASE: Record<string, string> = {
  es: "productos", en: "products", de: "produkte",
  zh: "chanpin", ar: "muntajat", tr: "urunler", hi: "utpad",
};

const NEWS_BASE: Record<string, string> = {
  es: "noticias", en: "news", de: "nachrichten", zh: "xinwen", ar: "akhbar", tr: "haberler", hi: "samachar",
};

const LEARN_BASE: Record<string, string> = {
  es: "aprende-inversion", en: "learn", de: "lernen-investition",
  zh: "xuexi", ar: "taallam", tr: "ogren-yatirim", hi: "gyaan-nivesh",
};

const CLUSTER_SLUG_I18N: Record<string, Record<string, string>> = {
  es: { fundamentals: "fundamentos", history: "historia", "markets-trading": "mercados-trading", investment: "inversion", "physical-metals": "metales-fisicos", "price-factors": "factores-precio", "production-industry": "produccion-industria", "geology-science": "geologia-ciencia", "regulation-tax": "regulacion-impuestos", "security-authenticity": "seguridad-autenticidad", "ratios-analytics": "ratios-analitica", macroeconomics: "macroeconomia", guides: "guias", "faq-mistakes": "preguntas-errores", comparisons: "comparativas", glossary: "glosario" },
  de: { fundamentals: "grundlagen", history: "geschichte", "markets-trading": "maerkte-handel", investment: "investition", "physical-metals": "physische-metalle", "price-factors": "preisfaktoren", "production-industry": "produktion-industrie", "geology-science": "geologie-wissenschaft", "regulation-tax": "regulierung-steuern", "security-authenticity": "sicherheit-echtheit", "ratios-analytics": "kennzahlen-analyse", macroeconomics: "makrooekonomie", guides: "leitfaeden", "faq-mistakes": "faq-fehler", comparisons: "vergleiche", glossary: "glossar" },
  zh: { fundamentals: "jichu", history: "lishi", "markets-trading": "shichang-jiaoyi", investment: "touzi", "physical-metals": "shiwu-jinshu", "price-factors": "jiage-yinsu", "production-industry": "shengchan-gongye", "geology-science": "dizhi-kexue", "regulation-tax": "fagui-shuiwu", "security-authenticity": "anquan-zhenwei", "ratios-analytics": "bilv-fenxi", macroeconomics: "hongguan-jingji", guides: "zhinan", "faq-mistakes": "changjian-wenti", comparisons: "bijiao", glossary: "shuyu" },
  ar: { fundamentals: "asasiyat", history: "tarikh", "markets-trading": "aswaq-tadawul", investment: "istithmar", "physical-metals": "maadin-madiyah", "price-factors": "awamil-asiar", "production-industry": "intaj-sinai", "geology-science": "jiyulujiya-ulum", "regulation-tax": "tanzim-daraib", "security-authenticity": "aman-asalah", "ratios-analytics": "nisab-tahlilat", macroeconomics: "iqtisad-kulli", guides: "adillah", "faq-mistakes": "asilah-akhta", comparisons: "muqaranat", glossary: "mustalahat" },
  tr: { fundamentals: "temeller", history: "tarih", "markets-trading": "piyasalar-ticaret", investment: "yatirim", "physical-metals": "fiziksel-metaller", "price-factors": "fiyat-faktorleri", "production-industry": "uretim-endustri", "geology-science": "jeoloji-bilim", "regulation-tax": "duzenleme-vergi", "security-authenticity": "guvenlik-orijinallik", "ratios-analytics": "oranlar-analitik", macroeconomics: "makroekonomi", guides: "rehberler", "faq-mistakes": "sss-hatalar", comparisons: "karsilastirmalar", glossary: "sozluk" },
  hi: { fundamentals: "mool-tattva", history: "itihas", "markets-trading": "bazaar-vyapar", investment: "nivesh", "physical-metals": "bhaute-dhatu", "price-factors": "mulya-karak", "production-industry": "uttpadan-udyog", "geology-science": "bhugol-vigyan", "regulation-tax": "niyaman-kar", "security-authenticity": "suraksha-pramaan", "ratios-analytics": "anupat-vishleshan", macroeconomics: "makro-arthvyavastha", guides: "margdarshika", "faq-mistakes": "puchhe-jane-wale-sawal", comparisons: "tulna", glossary: "shabdavali" },
};

function localizedCluster(baseSlug: string, locale: string): string {
  if (locale === "en") return baseSlug;
  return CLUSTER_SLUG_I18N[locale]?.[baseSlug] ?? baseSlug;
}

const SLUG_REDIRECTS: Record<string, string> = {
  "coin-grading-scale-explained-ms70-to-good": "coin-grading-scale-ms-pf",
  "pcgs-vs-ngc-coin-grading-services-comparison": "coin-grading-ngc-and-pcgs",
  "pcgs-vs-ngc-coin-grading-services-comparison-chart": "coin-grading-ngc-and-pcgs",
  "what-is-a-carat-and-how-does-it-apply-to-gold": "gold-purity-karat-system",
  "what-is-sterling-silver": "sterling-silver-explained",
  "silver-chemical-symbol-and-abbreviation": "silver-chemical-symbol-ag",
  "what-is-a-troy-ounce": "the-troy-ounce-explained",
  "what-is-fiat-money": "fiat-money-explained",
  "what-are-base-metals": "precious-metals-vs-base-metals",
  "gold-silver-platinum-volatility-comparison": "volatility-comparison-across-metals",
  "gold-silver-platinum-liquidity-comparison": "liquidity-comparison-across-metals",
  "how-does-ppi-affect-gold-prices": "ppi-and-gold",
  "gold-performance-during-hyperinflation": "hyperinflation-and-precious-metals",
  "hyperinflation-episodes-and-gold": "hyperinflation-and-precious-metals",
  "coin-grading-ngc-and-pcgs-standards-explained": "coin-grading-ngc-and-pcgs",
  "the-us-silver-purchase-act-government-as-silver-buyer": "us-silver-purchase-act",
  "gold-recyclers-and-their-market-impact": "gold-recyclers-in-the-market",
  "historical-goldsilver-ratio-chart-100-years-of-data-analyzed": "historical-gold-silver-ratio-chart",
  "do-i-need-to-report-gold-purchases-general-reporting-rules": "do-i-need-to-report-gold-purchases",
  "paying-too-high-a-premium-how-to-spot-overpriced-gold-and-silver": "paying-too-high-a-premium",
  "buying-gold-from-unverified-sources-risks-and-red-flags": "buying-gold-from-unverified-sources",
  "sovereign-wealth-funds-and-gold-allocation-a-strategic-shift": "sovereign-wealth-funds-and-gold",
  "precious-metals-recycling-rates-compared-unlocking-value-from-the-vault": "precious-metals-recycling-overview",
  "gold-etf-vs-physical-gold-weighing-your-investment-options": "physical-gold-vs-gold-etf-the-complete-comparison",
  "silver-demonetization-how-silver-lost-its-monetary-role": "demonetization-of-silver-1870s",
};

function cleanSlug(slug: string): string {
  return SLUG_REDIRECTS[slug] ?? slug;
}

const GARBAGE_SLUG_RE = /^[\d]+-[\d]|^[\d]+-\d{4}-\d{2}-\d{2}$/;

const GLOSSARY_CLUSTER: Record<string, string> = {
  es: "glosario", en: "glossary", de: "glossar", zh: "shuyu", ar: "mustalahat", tr: "sozluk", hi: "shabdavali",
};

const FREQ_PRIO: Record<string, [string, number]> = {
  "/herramientas": ["weekly", 0.8],
  "/calculadora-rentabilidad": ["monthly", 0.7],
  "/valor-joyas": ["weekly", 0.8],
  "/fear-greed": ["daily", 0.9],
  "/portfolio": ["monthly", 0.8],
  "/widget": ["monthly", 0.7],
  "/conversor-divisas": ["monthly", 0.7],
  "/comparador": ["monthly", 0.7],
  "/ratio-oro-plata": ["daily", 0.8],
  "/calendario-economico": ["weekly", 0.7],
  "/guia-inversion": ["monthly", 0.7],
  "/productos": ["monthly", 0.7],
  "/noticias": ["daily", 0.9],
  "/learn": ["weekly", 0.7],
  "/alertas": ["monthly", 0.5],
  "/precio-oro-hoy": ["daily", 0.9],
  "/precio-gramo-oro": ["daily", 0.8],
  "/aviso-legal": ["yearly", 0.3],
  "/terminos": ["yearly", 0.3],
  "/privacidad": ["yearly", 0.3],
  "/precio-bitcoin": ["daily", 0.9],
  "/comparar/oro-vs-bitcoin": ["weekly", 0.75],
  "/comparar/oro-vs-sp500": ["weekly", 0.75],
  "/donde-comprar": ["monthly", 0.7],
  "/donde-comprar/registrar": ["monthly", 0.6],
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntries(
  paths: Record<string, string>,
  changefreq: string,
  priority: number,
  lastmod: string,
): string[] {
  const xhtmlLinks = LOCALES.map(
    (loc) =>
      `    <xhtml:link rel="alternate" hreflang="${loc}" href="${esc(`${BASE}${paths[loc]}`)}" />`
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${BASE}${paths[DEFAULT_LOCALE]}`)}" />`;

  return LOCALES.map((loc) => `  <url>
    <loc>${esc(`${BASE}${paths[loc]}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${xhtmlLinks}
${xDefault}
  </url>`);
}

interface DynamicUrl {
  slug: string;
  type: string;
  cluster?: string;
  lastmod?: string;
  localizedSlugs?: Record<string, string>;
  localizedClusters?: Record<string, string>;
}

async function fetchDynamicUrls(): Promise<DynamicUrl[]> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_URL || BASE;
    const res = await fetch(`${apiBase}/api/sitemap-urls`, {
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.urls) ? data.urls : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  urls.push(...urlEntries(PATHNAMES["/"], "daily", 1.0, today));

  for (const [key, [freq, prio]] of Object.entries(FREQ_PRIO)) {
    if (PATHNAMES[key]) urls.push(...urlEntries(PATHNAMES[key], freq, prio, today));
  }

  for (const [, slugsByLocale] of Object.entries(METAL_SLUGS)) {
    const paths: Record<string, string> = {};
    for (const loc of LOCALES) paths[loc] = `/${loc}/${PRICE_PATHS[loc]}/${slugsByLocale[loc]}`;
    urls.push(...urlEntries(paths, "daily", 0.9, today));
  }

  for (const [, slugsByLocale] of Object.entries(METAL_SLUGS)) {
    const paths: Record<string, string> = {};
    for (const loc of LOCALES) {
      paths[loc] = `/${loc}/${PRICE_PATHS[loc]}/${slugsByLocale[loc]}/${HISTORICAL_SEGMENT[loc]}`;
    }
    urls.push(...urlEntries(paths, "weekly", 0.85, today));
  }

  for (const [, slugsByLocale] of Object.entries(METAL_SLUGS)) {
    for (const curr of CURRENCY_PAGES) {
      const paths: Record<string, string> = {};
      for (const loc of LOCALES) paths[loc] = `/${loc}/${PRICE_PATHS[loc]}/${slugsByLocale[loc]}/${curr.slug}`;
      urls.push(...urlEntries(paths, "daily", 0.7, today));
    }
  }

  for (const slug of PRODUCT_SLUGS) {
    const paths: Record<string, string> = {};
    const locSlugs = getProductSlugsByLocale(slug);
    for (const loc of LOCALES) paths[loc] = `/${loc}/${PRODUCT_BASE[loc]}/${locSlugs[loc] ?? slug}`;
    urls.push(...urlEntries(paths, "monthly", 0.6, today));
  }

  for (const country of DEALER_COUNTRIES) {
    const paths: Record<string, string> = {};
    for (const loc of LOCALES) {
      const base = DEALER_BASE_PATHS[loc] ?? "/where-to-buy";
      const countrySlug = country.slug[loc] ?? country.slug.en;
      paths[loc] = `/${loc}${base}/${countrySlug}`;
    }
    urls.push(...urlEntries(paths, "monthly", 0.6, today));

    const cities = getCitiesByCountry(country.code);
    for (const cityEntry of cities) {
      const cityPaths: Record<string, string> = {};
      for (const loc of LOCALES) {
        const base = DEALER_BASE_PATHS[loc] ?? "/where-to-buy";
        const countrySlug = country.slug[loc] ?? country.slug.en;
        cityPaths[loc] = `/${loc}${base}/${countrySlug}/${cityEntry.slug}`;
      }
      urls.push(...urlEntries(cityPaths, "monthly", 0.5, today));

      const cityDealers = getDealersByCity(country.code, cityEntry.slug);
      for (const dealer of cityDealers) {
        const dealerSlug = slugifyDealer(dealer.name);
        const dealerPaths: Record<string, string> = {};
        for (const loc of LOCALES) {
          const base = DEALER_BASE_PATHS[loc] ?? "/where-to-buy";
          const cSlug = country.slug[loc] ?? country.slug.en;
          dealerPaths[loc] = `/${loc}${base}/${cSlug}/${cityEntry.slug}/${dealerSlug}`;
        }
        urls.push(...urlEntries(dealerPaths, "monthly", 0.4, today));
      }
    }
  }

  const dynamicUrls = await fetchDynamicUrls();

  const MIN_SLUG_LENGTH = 5;
  const emittedLocs = new Set<string>();

  for (const item of dynamicUrls) {
    const paths: Record<string, string> = {};

    if (item.type === "article") {
      let skipArticle = false;
      for (const loc of LOCALES) {
        const locSlug = item.localizedSlugs?.[loc] ?? item.slug;
        if (GARBAGE_SLUG_RE.test(locSlug)) { skipArticle = true; break; }
        paths[loc] = `/${loc}/${NEWS_BASE[loc]}/${locSlug}`;
      }
      if (skipArticle) continue;
      urls.push(...urlEntries(paths, "weekly", 0.7, item.lastmod || today));
    } else if (item.type === "cluster") {
      for (const loc of LOCALES) paths[loc] = `/${loc}/${LEARN_BASE[loc]}/${localizedCluster(item.slug, loc)}`;
      urls.push(...urlEntries(paths, "weekly", 0.6, today));
    } else if (item.type === "glossary") {
      for (const loc of LOCALES) {
        let gSlug = item.localizedSlugs?.[loc] ?? item.slug;
        if (gSlug.length < MIN_SLUG_LENGTH) gSlug = item.slug;
        gSlug = cleanSlug(gSlug);
        paths[loc] = `/${loc}/${LEARN_BASE[loc]}/${GLOSSARY_CLUSTER[loc] ?? "glossary"}/${gSlug}`;
      }
      urls.push(...urlEntries(paths, "monthly", 0.5, today));
    } else if (item.type === "learn-article" && item.cluster) {
      let hasDuplicate = false;
      for (const loc of LOCALES) {
        let aSlug = item.localizedSlugs?.[loc] ?? item.slug;
        if (aSlug.length < MIN_SLUG_LENGTH) aSlug = item.slug;
        aSlug = cleanSlug(aSlug);
        const cSlug = localizedCluster(item.cluster, loc);
        const fullPath = `/${loc}/${LEARN_BASE[loc]}/${cSlug}/${aSlug}`;
        if (emittedLocs.has(fullPath)) {
          hasDuplicate = true;
          break;
        }
        paths[loc] = fullPath;
      }
      if (hasDuplicate) continue;
      for (const loc of LOCALES) emittedLocs.add(paths[loc]);
      urls.push(...urlEntries(paths, "monthly", 0.5, item.lastmod || today));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
