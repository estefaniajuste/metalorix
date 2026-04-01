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
  "silver-chemical-symbol-and-abbreviation": { cluster: "fundamentals", slug: "why-silvers-chemical-symbol-is-ag" },
  "what-is-a-troy-ounce": { cluster: "fundamentals", slug: "the-troy-ounce-explained" },
  "what-is-fiat-money": { cluster: "macroeconomics", slug: "fiat-money-explained" },
  "what-are-base-metals": { cluster: "fundamentals", slug: "precious-metals-vs-base-metals" },
  "gold-silver-platinum-volatility-comparison": { cluster: "comparisons", slug: "volatility-comparison-across-precious-metals" },
  "gold-silver-platinum-liquidity-comparison": { cluster: "comparisons", slug: "liquidity-comparison-across-precious-metals" },
  "how-to-sell-scrap-gold": { cluster: "production-industry", slug: "how-to-sell-scrap-gold" },
  "how-does-ppi-affect-gold-prices": { cluster: "price-factors", slug: "ppi-and-gold" },
  "gold-performance-during-hyperinflation": { cluster: "history", slug: "hyperinflation-and-precious-metals" },
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

const PATH_ALIASES: Record<string, string> = {
  "/oro": "/precio/oro",
  "/plata": "/precio/plata",
  "/platino": "/precio/platino",
  "/paladio": "/precio/paladio",
  "/cobre": "/precio/cobre",
  "/gold": "/precio/oro",
  "/silver": "/precio/plata",
  "/platinum": "/precio/platino",
  "/palladium": "/precio/paladio",
  "/copper": "/precio/cobre",
  "/tools": "/herramientas",
  "/news": "/noticias",
  "/glossary": "/learn",
  "/glosario": "/learn",
  "/education": "/learn",
  "/educacion": "/learn",
  "/aprender": "/learn",
  "/lernen": "/learn",
  "/xuexi": "/learn",
  "/taallam": "/learn",
  "/ogren": "/learn",
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
    return NextResponse.redirect(new URL("/api/feed", request.url), 302);
  }

  if (pathname === "/sitemap.xml" || pathname === "/sitemap_index.xml") {
    return NextResponse.redirect(new URL("/api/sitemap", request.url), 301);
  }

  if (pathname.startsWith("/api/")) {
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

  // Handle bare paths without locale prefix (next-intl would 307, we want 301)
  if (!LOCALES.has(segments[0])) {
    const learnPrefixes = ["learn", "aprende-inversion", "aprende", "glosario", "glossary",
      "lernen-investition", "xuexi", "taallam", "ogren-yatirim", "gyaan-nivesh",
      "educacion", "education"];
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

    // Bare news/content paths without locale prefix → 301 to correct locale
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
    };
    const contentMatch = CONTENT_PATH_TO_LOCALE[segments[0]];
    if (contentMatch) {
      const rest = segments.slice(1).join("/");
      return NextResponse.redirect(
        new URL(`/${contentMatch.locale}/${contentMatch.path}${rest ? `/${rest}` : ""}`, request.url),
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

  // Redirect learn pages under wrong cluster slug to the correct localized cluster.
  if (segments.length >= 3 && LOCALES.has(segments[0])) {
    const locale = segments[0];
    const learnSegment = LEARN_PATHS[locale]?.replace("/", "") || "learn";
    if (segments[1] === learnSegment && segments.length >= 3) {
      const clusterInUrl = segments[2];
      const baseCluster = CLUSTER_REVERSE[clusterInUrl];
      if (baseCluster) {
        const expected = locale === "en" ? baseCluster : (CLUSTER_SLUG_BY_LOCALE[locale]?.[baseCluster] ?? baseCluster);
        if (clusterInUrl !== expected) {
          const rest = segments.slice(3).join("/");
          return NextResponse.redirect(
            new URL(`/${locale}/${learnSegment}/${expected}${rest ? `/${rest}` : ""}`, request.url),
            301
          );
        }
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

  const alias = PATH_ALIASES[lower];
  if (alias) {
    const rewritten = new URL(alias, request.url);
    rewritten.search = request.nextUrl.search;
    return NextResponse.redirect(rewritten, 301);
  }

  const response = handleI18nRouting(request);
  // Propagate the original URL so not-found/error pages can log it
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.png|icon-.*\\.png|manifest\\.json|robots\\.txt|google.*\\.html).*)",
  ],
};
