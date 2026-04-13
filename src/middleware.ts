import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const CANONICAL_HOST = "metalorix.com";

const LOCALES = new Set(["es", "en", "zh", "ar", "tr", "de", "hi"]);

const LEARN_PATHS: Record<string, string> = {
  es: "/aprende-inversion",
  en: "/learn",
  de: "/lernen-investition",
  zh: "/xuexi",
  ar: "/taallam",
  tr: "/ogren-yatirim",
  hi: "/gyaan-nivesh",
};

const LEARN_LEGACY_SEGMENTS = new Set([
  "aprende", "glosario", "glossary", "education", "educacion",
  "aprender", "lernen", "learn", "xuexi", "taallam", "ogren",
  "aprende-inversion", "lernen-investition", "ogren-yatirim", "gyaan-nivesh",
]);

const PRICE_PATHS: Record<string, string> = {
  es: "precio", en: "price", de: "preis", zh: "jiage", ar: "sier", tr: "fiyat", hi: "mulya",
};

const CLUSTER_SLUG_BY_LOCALE: Record<string, Record<string, string>> = {
  es: { fundamentals:"fundamentos", history:"historia", "markets-trading":"mercados-trading", investment:"inversion", "physical-metals":"metales-fisicos", "price-factors":"factores-precio", "production-industry":"produccion-industria", "geology-science":"geologia-ciencia", "regulation-tax":"regulacion-impuestos", "security-authenticity":"seguridad-autenticidad", "ratios-analytics":"ratios-analitica", macroeconomics:"macroeconomia", guides:"guias", "faq-mistakes":"preguntas-errores", comparisons:"comparativas", glossary:"glosario" },
  de: { fundamentals:"grundlagen", history:"geschichte", "markets-trading":"maerkte-handel", investment:"investition", "physical-metals":"physische-metalle", "price-factors":"preisfaktoren", "production-industry":"produktion-industrie", "geology-science":"geologie-wissenschaft", "regulation-tax":"regulierung-steuern", "security-authenticity":"sicherheit-echtheit", "ratios-analytics":"kennzahlen-analyse", macroeconomics:"makrooekonomie", guides:"leitfaeden", "faq-mistakes":"faq-fehler", comparisons:"vergleiche", glossary:"glossar" },
  zh: { fundamentals:"jichu", history:"lishi", "markets-trading":"shichang-jiaoyi", investment:"touzi", "physical-metals":"shiwu-jinshu", "price-factors":"jiage-yinsu", "production-industry":"shengchan-gongye", "geology-science":"dizhi-kexue", "regulation-tax":"fagui-shuiwu", "security-authenticity":"anquan-zhenwei", "ratios-analytics":"bilv-fenxi", macroeconomics:"hongguan-jingji", guides:"zhinan", "faq-mistakes":"changjian-wenti", comparisons:"bijiao", glossary:"shuyu" },
  ar: { fundamentals:"asasiyat", history:"tarikh", "markets-trading":"aswaq-tadawul", investment:"istithmar", "physical-metals":"maadin-madiyah", "price-factors":"awamil-asiar", "production-industry":"intaj-sinai", "geology-science":"jiyulujiya-ulum", "regulation-tax":"tanzim-daraib", "security-authenticity":"aman-asalah", "ratios-analytics":"nisab-tahlilat", macroeconomics:"iqtisad-kulli", guides:"adillah", "faq-mistakes":"asilah-akhta", comparisons:"muqaranat", glossary:"mustalahat" },
  tr: { fundamentals:"temeller", history:"tarih", "markets-trading":"piyasalar-ticaret", investment:"yatirim", "physical-metals":"fiziksel-metaller", "price-factors":"fiyat-faktorleri", "production-industry":"uretim-endustri", "geology-science":"jeoloji-bilim", "regulation-tax":"duzenleme-vergi", "security-authenticity":"guvenlik-orijinallik", "ratios-analytics":"oranlar-analitik", macroeconomics:"makroekonomi", guides:"rehberler", "faq-mistakes":"sss-hatalar", comparisons:"karsilastirmalar", glossary:"sozluk" },
  hi: { fundamentals:"mool-tattva", history:"itihas", "markets-trading":"bazaar-vyapar", investment:"nivesh", "physical-metals":"bhaute-dhatu", "price-factors":"mulya-karak", "production-industry":"uttpadan-udyog", "geology-science":"bhugol-vigyan", "regulation-tax":"niyaman-kar", "security-authenticity":"suraksha-pramaan", "ratios-analytics":"anupat-vishleshan", macroeconomics:"makro-arthvyavastha", guides:"margdarshika", "faq-mistakes":"puchhe-jane-wale-sawal", comparisons:"tulna", glossary:"shabdavali" },
};

const CLUSTER_REVERSE: Record<string, string> = {};
for (const mapping of Object.values(CLUSTER_SLUG_BY_LOCALE)) {
  for (const [base, loc] of Object.entries(mapping)) CLUSTER_REVERSE[loc] = base;
}
Object.keys(CLUSTER_SLUG_BY_LOCALE.es).forEach((base) => { CLUSTER_REVERSE[base] = base; });

// Old cluster names that were renamed — map to closest current cluster
CLUSTER_REVERSE["collecting-numismatics"] = "physical-metals";
CLUSTER_REVERSE["coleccion-numismatica"] = "physical-metals";

// Old learn slugs that were completely regenerated — map to current cluster/slug
const LEARN_SLUG_REDIRECTS: Record<string, { cluster: string; slug: string }> = {
  "coin-grading-scale-explained-ms70-to-good": { cluster: "security-authenticity", slug: "coin-grading-scale-ms-pf" },
  "pcgs-vs-ngc-coin-grading-services-comparison": { cluster: "physical-metals", slug: "coin-grading-ngc-and-pcgs" },
  "pcgs-vs-ngc-coin-grading-services-comparison-chart": { cluster: "physical-metals", slug: "coin-grading-ngc-and-pcgs" },
  "what-is-a-carat-and-how-does-it-apply-to-gold": { cluster: "fundamentals", slug: "gold-purity-karat-system" },
  "what-is-sterling-silver": { cluster: "fundamentals", slug: "sterling-silver-explained" },
  "silver-chemical-symbol-and-abbreviation": { cluster: "fundamentals", slug: "silver-chemical-symbol-ag" },
  "what-is-a-troy-ounce": { cluster: "fundamentals", slug: "the-troy-ounce-explained" },
  "what-is-fiat-money": { cluster: "macroeconomics", slug: "fiat-money-explained" },
  "what-are-base-metals": { cluster: "fundamentals", slug: "precious-metals-vs-base-metals" },
  "gold-silver-platinum-volatility-comparison": { cluster: "comparisons", slug: "volatility-comparison-across-metals" },
  "gold-silver-platinum-liquidity-comparison": { cluster: "comparisons", slug: "liquidity-comparison-across-metals" },
  "how-does-ppi-affect-gold-prices": { cluster: "price-factors", slug: "ppi-and-gold" },
  "gold-performance-during-hyperinflation": { cluster: "history", slug: "hyperinflation-and-precious-metals" },
  "hyperinflation-episodes-and-gold": { cluster: "history", slug: "hyperinflation-and-precious-metals" },
  // GSC April 2026: duplicate long-slug variants that split impressions with the canonical short slug
  "coin-grading-ngc-and-pcgs-standards-explained": { cluster: "physical-metals", slug: "coin-grading-ngc-and-pcgs" },
  "the-us-silver-purchase-act-government-as-silver-buyer": { cluster: "history", slug: "us-silver-purchase-act" },
  "gold-recyclers-and-their-market-impact": { cluster: "markets-trading", slug: "gold-recyclers-in-the-market" },
  "historical-goldsilver-ratio-chart-100-years-of-data-analyzed": { cluster: "ratios-analytics", slug: "historical-gold-silver-ratio-chart" },
  "do-i-need-to-report-gold-purchases-general-reporting-rules": { cluster: "faq-mistakes", slug: "do-i-need-to-report-gold-purchases" },
  "paying-too-high-a-premium-how-to-spot-overpriced-gold-and-silver": { cluster: "faq-mistakes", slug: "paying-too-high-a-premium" },
  "buying-gold-from-unverified-sources-risks-and-red-flags": { cluster: "faq-mistakes", slug: "buying-gold-from-unverified-sources" },
  "sovereign-wealth-funds-and-gold-allocation-a-strategic-shift": { cluster: "markets-trading", slug: "sovereign-wealth-funds-and-gold" },
  "precious-metals-recycling-rates-compared-unlocking-value-from-the-vault": { cluster: "production-industry", slug: "precious-metals-recycling-overview" },
  "gold-etf-vs-physical-gold-weighing-your-investment-options": { cluster: "comparisons", slug: "physical-gold-vs-gold-etf-the-complete-comparison" },
  "silver-demonetization-how-silver-lost-its-monetary-role": { cluster: "history", slug: "demonetization-of-silver-1870s" },
};

const METAL_SLUGS: Record<string, Record<string, string>> = {
  oro:     { es:"oro", en:"gold", de:"gold", zh:"huangjin", ar:"dhahab", tr:"altin", hi:"sona" },
  plata:   { es:"plata", en:"silver", de:"silber", zh:"baiyin", ar:"fiddah", tr:"gumus", hi:"chandi" },
  platino: { es:"platino", en:"platinum", de:"platin", zh:"bojin", ar:"blatiin", tr:"platin", hi:"platinam" },
  paladio: { es:"paladio", en:"palladium", de:"palladium", zh:"bajin", ar:"baladiyum", tr:"paladyum", hi:"palladium" },
  cobre:   { es:"cobre", en:"copper", de:"kupfer", zh:"tong", ar:"nuhas", tr:"bakir", hi:"tamba" },
};

const METAL_REVERSE: Record<string, string> = {};
for (const [internal, locales] of Object.entries(METAL_SLUGS)) {
  for (const slug of Object.values(locales)) METAL_REVERSE[slug] = internal;
}

const METAL_ALIASES: Record<string, { locale: string; internal: string }> = {
  "/oro": { locale: "es", internal: "oro" },
  "/plata": { locale: "es", internal: "plata" },
  "/platino": { locale: "es", internal: "platino" },
  "/paladio": { locale: "es", internal: "paladio" },
  "/cobre": { locale: "es", internal: "cobre" },
  "/gold": { locale: "en", internal: "oro" },
  "/silver": { locale: "en", internal: "plata" },
  "/platinum": { locale: "en", internal: "platino" },
  "/palladium": { locale: "en", internal: "paladio" },
  "/copper": { locale: "en", internal: "cobre" },
};

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "");

  if (
    host &&
    host !== CANONICAL_HOST &&
    host !== "localhost" &&
    !host.startsWith("127.0.0.1")
  ) {
    const canonical = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(canonical, 301);
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/feed.xml") {
    return NextResponse.redirect(new URL("/api/feed", request.url), 301);
  }

  if (pathname === "/sitemap.xml" || pathname === "/sitemap_index.xml") {
    return NextResponse.redirect(new URL("/api/sitemap", request.url), 301);
  }

  if ((pathname.startsWith("/api/") && !pathname.startsWith("/api/product-image")) || pathname.includes("/opengraph-image")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
  }

  const lower = pathname.toLowerCase();
  const segments = lower.split("/").filter(Boolean);

  // Redirect old English metal slugs in zh/ar to localized slugs
  const OLD_METAL_REDIRECTS: Record<string, Record<string, string>> = {
    zh: { gold: "huangjin", silver: "baiyin", platinum: "bojin", palladium: "bajin", copper: "tong" },
    ar: { gold: "dhahab", silver: "fiddah", platinum: "blatiin", palladium: "baladiyum", copper: "nuhas" },
  };
  if (segments.length >= 3 && (segments[0] === "zh" || segments[0] === "ar")) {
    const remap = OLD_METAL_REDIRECTS[segments[0]];
    const lastSeg = segments[segments.length - 1];
    if (remap && remap[lastSeg]) {
      const newPath = `/${segments.slice(0, -1).join("/")}/${remap[lastSeg]}`;
      return NextResponse.redirect(new URL(newPath, request.url), 301);
    }
  }

  // Handle /{locale}/{legacy-learn-segment}[/...] → /{locale}/{correct-learn-path}[/...]
  if (segments.length >= 2 && LOCALES.has(segments[0])) {
    const locale = segments[0];
    const correctLearnPath = LEARN_PATHS[locale];

    if (LEARN_LEGACY_SEGMENTS.has(segments[1]) && `/${segments[1]}` !== correctLearnPath) {
      const rest = segments.slice(2).join("/");
      const target = `/${locale}${correctLearnPath}${rest ? `/${rest}` : ""}`;
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
  }

  // Fix non-localized cluster slugs in learn article URLs.
  // E.g. /zh/xuexi/price-factors/slug → /zh/xuexi/jiage-yinsu/slug (301)
  if (segments.length >= 4 && LOCALES.has(segments[0])) {
    const locale = segments[0];
    const learnSeg = LEARN_PATHS[locale]?.replace("/", "");
    if (learnSeg && segments[1] === learnSeg) {
      const clusterInUrl = segments[2];
      const baseCluster = CLUSTER_REVERSE[clusterInUrl];
      if (baseCluster) {
        const correctCluster = locale === "en"
          ? baseCluster
          : (CLUSTER_SLUG_BY_LOCALE[locale]?.[baseCluster] ?? baseCluster);
        if (clusterInUrl !== correctCluster) {
          const rest = segments.slice(3).join("/");
          const target = `/${locale}/${learnSeg}/${correctCluster}${rest ? `/${rest}` : ""}`;
          return NextResponse.redirect(new URL(target, request.url), 301);
        }
      }
    }
  }

  // Handle bare paths without locale prefix (next-intl would 307, we want 301)
  if (!LOCALES.has(segments[0])) {
    const learnPrefixes = ["learn", "aprende-inversion", "aprende", "glosario", "glossary",
      "lernen-investition", "lernen", "xuexi", "taallam", "ogren-yatirim", "ogren",
      "gyaan-nivesh", "educacion", "education"];
    if (learnPrefixes.some((p) => lower === `/${p}` || lower.startsWith(`/${p}/`))) {
      const rest = segments.slice(1);
      // Resolve foreign cluster slug to English base in the same redirect
      if (rest.length >= 1 && CLUSTER_REVERSE[rest[0]]) {
        rest[0] = CLUSTER_REVERSE[rest[0]];
      }
      // Handle old slugs that were completely renamed
      if (rest.length >= 2) {
        const redir = LEARN_SLUG_REDIRECTS[rest[1]];
        if (redir) {
          return NextResponse.redirect(
            new URL(`/en/learn/${redir.cluster}/${redir.slug}`, request.url),
            301
          );
        }
      }
      const restStr = rest.join("/");
      return NextResponse.redirect(
        new URL(`/en/learn${restStr ? `/${restStr}` : ""}`, request.url),
        301
      );
    }

    // Bare paths without locale prefix → 301 to correct locale (avoids next-intl 307)
    const CONTENT_PATH_TO_LOCALE: Record<string, { locale: string; path: string }> = {
      noticias: { locale: "es", path: "noticias" },
      news: { locale: "en", path: "news" },
      nachrichten: { locale: "de", path: "nachrichten" },
      xinwen: { locale: "zh", path: "xinwen" },
      akhbar: { locale: "ar", path: "akhbar" },
      haberler: { locale: "tr", path: "haberler" },
      samachar: { locale: "hi", path: "samachar" },
      productos: { locale: "es", path: "productos" },
      products: { locale: "en", path: "products" },
      produkte: { locale: "de", path: "produkte" },
      chanpin: { locale: "zh", path: "chanpin" },
      muntajat: { locale: "ar", path: "muntajat" },
      urunler: { locale: "tr", path: "urunler" },
      utpad: { locale: "hi", path: "utpad" },
      precio: { locale: "es", path: "precio" },
      price: { locale: "en", path: "price" },
      preis: { locale: "de", path: "preis" },
      jiage: { locale: "zh", path: "jiage" },
      sier: { locale: "ar", path: "sier" },
      fiyat: { locale: "tr", path: "fiyat" },
      mulya: { locale: "hi", path: "mulya" },
      herramientas: { locale: "es", path: "herramientas" },
      tools: { locale: "en", path: "tools" },
      werkzeuge: { locale: "de", path: "werkzeuge" },
      gongju: { locale: "zh", path: "gongju" },
      adawat: { locale: "ar", path: "adawat" },
      araclar: { locale: "tr", path: "araclar" },
      upakar: { locale: "hi", path: "upakar" },
      alertas: { locale: "es", path: "alertas" },
      alerts: { locale: "en", path: "alerts" },
      benachrichtigungen: { locale: "de", path: "benachrichtigungen" },
      portfolio: { locale: "en", path: "portfolio" },
    };
    const contentMatch = CONTENT_PATH_TO_LOCALE[segments[0]];
    if (contentMatch) {
      const rest = segments.slice(1);
      const isPricePath = Object.values(PRICE_PATHS).includes(contentMatch.path);
      if (isPricePath && rest.length >= 1) {
        const internal = METAL_REVERSE[rest[0]];
        if (internal) {
          rest[0] = METAL_SLUGS[internal]?.[contentMatch.locale] ?? rest[0];
        }
      }
      const restStr = rest.join("/");
      return NextResponse.redirect(
        new URL(`/${contentMatch.locale}/${contentMatch.path}${restStr ? `/${restStr}` : ""}`, request.url),
        301
      );
    }
  }

  // Redirect old learn slugs that were completely renamed
  if (segments.length >= 4 && LOCALES.has(segments[0])) {
    const locale = segments[0];
    const learnSegment = LEARN_PATHS[locale]?.replace("/", "") || "learn";
    if (segments[1] === learnSegment) {
      const slugInUrl = segments[3];
      const redir = LEARN_SLUG_REDIRECTS[slugInUrl];
      if (redir) {
        const locCluster = locale === "en" ? redir.cluster : (CLUSTER_SLUG_BY_LOCALE[locale]?.[redir.cluster] ?? redir.cluster);
        return NextResponse.redirect(
          new URL(`/${locale}/${learnSegment}/${locCluster}/${redir.slug}`, request.url),
          301
        );
      }
    }
  }

  // Redirect product pages with wrong locale metal slug.
  if (segments.length >= 3 && LOCALES.has(segments[0])) {
    const locale = segments[0];
    const priceSeg = PRICE_PATHS[locale];
    if (priceSeg && segments[1] === priceSeg) {
      const metalInUrl = segments[2];
      const internal = METAL_REVERSE[metalInUrl];
      if (internal) {
        const expected = METAL_SLUGS[internal]?.[locale] ?? metalInUrl;
        if (metalInUrl !== expected) {
          const rest = segments.slice(3).join("/");
          return NextResponse.redirect(
            new URL(`/${locale}/${priceSeg}/${expected}${rest ? `/${rest}` : ""}`, request.url),
            301
          );
        }
      }
    }
  }

  // Redirect product pages with wrong-locale slug to canonical localized slug
  const PRODUCT_PATHS: Record<string, string> = {
    es: "productos", en: "products", de: "produkte", zh: "chanpin", ar: "muntajat", tr: "urunler", hi: "utpad",
  };
  if (segments.length === 3 && LOCALES.has(segments[0])) {
    const locale = segments[0];
    const prodSeg = PRODUCT_PATHS[locale];
    if (prodSeg && segments[1] === prodSeg) {
      const slugInUrl = segments[2];
      const canonSlug = _resolveProductSlug(slugInUrl, locale);
      if (canonSlug && canonSlug !== slugInUrl) {
        return NextResponse.redirect(
          new URL(`/${locale}/${prodSeg}/${canonSlug}`, request.url),
          301
        );
      }
    }
  }

  const metalAlias = METAL_ALIASES[lower];
  if (metalAlias) {
    const { locale: mLoc, internal } = metalAlias;
    const metalSlug = METAL_SLUGS[internal]?.[mLoc] ?? internal;
    const dest = new URL(`/${mLoc}/${PRICE_PATHS[mLoc]}/${metalSlug}`, request.url);
    dest.search = request.nextUrl.search;
    return NextResponse.redirect(dest, 301);
  }

  const response = handleI18nRouting(request);

  // next-intl uses 307 (temporary) for locale prefix redirects.
  // Convert to 301 (permanent) so Google consolidates link equity and
  // stops re-crawling the non-prefixed URL.
  if (response.status === 307) {
    const location = response.headers.get("location");
    if (location) {
      return NextResponse.redirect(location, 301);
    }
  }

  // Propagate the original URL so not-found/error pages can log it
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.png|icon-.*\\.png|manifest\\.json|robots\\.txt|google.*\\.html|screenshots/.*|[a-zA-Z0-9_-]+\\.txt$).*)",
  ],
};

/* ── Product slug resolution (inline to avoid Edge-incompatible imports) ── */
const _PROD_SLUGS: Record<string, Record<string, string>> = {
  en: {
    "krugerrand-oro":"krugerrand-gold","maple-leaf-oro":"maple-leaf-gold","filarmonica-oro":"philharmonic-gold","britannia-oro":"britannia-gold","eagle-oro":"eagle-gold",
    "maple-leaf-plata":"maple-leaf-silver","filarmonica-plata":"philharmonic-silver","britannia-plata":"britannia-silver","eagle-plata":"eagle-silver","krugerrand-plata":"krugerrand-silver",
    "lingote-oro-1oz":"gold-bar-1oz","lingote-oro-100g":"gold-bar-100g","lingote-oro-1kg":"gold-bar-1kg","lingote-plata-1kg":"silver-bar-1kg",
  },
  de: {
    "krugerrand-oro":"krugerrand-gold","maple-leaf-oro":"maple-leaf-gold","filarmonica-oro":"philharmoniker-gold","britannia-oro":"britannia-gold","eagle-oro":"eagle-gold",
    "maple-leaf-plata":"maple-leaf-silber","filarmonica-plata":"philharmoniker-silber","britannia-plata":"britannia-silber","eagle-plata":"eagle-silber","krugerrand-plata":"krugerrand-silber",
    "lingote-oro-1oz":"goldbarren-1oz","lingote-oro-100g":"goldbarren-100g","lingote-oro-1kg":"goldbarren-1kg","lingote-plata-1kg":"silberbarren-1kg",
  },
  tr: {
    "krugerrand-oro":"krugerrand-altin","maple-leaf-oro":"maple-leaf-altin","filarmonica-oro":"filarmoni-altin","britannia-oro":"britannia-altin","eagle-oro":"eagle-altin",
    "maple-leaf-plata":"maple-leaf-gumus","filarmonica-plata":"filarmoni-gumus","britannia-plata":"britannia-gumus","eagle-plata":"eagle-gumus","krugerrand-plata":"krugerrand-gumus",
    "lingote-oro-1oz":"altin-kulce-1oz","lingote-oro-100g":"altin-kulce-100g","lingote-oro-1kg":"altin-kulce-1kg","lingote-plata-1kg":"gumus-kulce-1kg",
  },
};
_PROD_SLUGS.zh = _PROD_SLUGS.en;
_PROD_SLUGS.ar = _PROD_SLUGS.en;
_PROD_SLUGS.hi = _PROD_SLUGS.en;

const _PROD_REV: Record<string, string> = {};
for (const mapping of Object.values(_PROD_SLUGS)) {
  for (const [base, loc] of Object.entries(mapping)) {
    _PROD_REV[loc] = base;
    _PROD_REV[base] = base;
  }
}

function _resolveProductSlug(slugInUrl: string, locale: string): string | null {
  const baseSlug = _PROD_REV[slugInUrl] ?? slugInUrl;
  if (locale === "es") return baseSlug === slugInUrl ? null : baseSlug;
  const locSlug = _PROD_SLUGS[locale]?.[baseSlug] ?? _PROD_SLUGS.en?.[baseSlug];
  if (!locSlug) return null;
  return locSlug;
}
