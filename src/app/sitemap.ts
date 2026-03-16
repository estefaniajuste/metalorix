import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const BASE = "https://metalorix.com";
const LOCALES = ["es", "en", "zh", "ar", "tr", "de"] as const;
const DEFAULT_LOCALE = "en";

const PATHNAMES: Record<string, Record<string, string>> = {
  "/": { es: "/es", en: "/en", zh: "/zh", ar: "/ar", tr: "/tr", de: "/de" },
  "/herramientas": { es: "/es/herramientas", en: "/en/tools", de: "/de/werkzeuge", zh: "/zh/gongju", ar: "/ar/adawat", tr: "/tr/araclar" },
  "/calculadora-rentabilidad": { es: "/es/calculadora-rentabilidad", en: "/en/roi-calculator", de: "/de/renditerechner", zh: "/zh/shouyi-jisuan", ar: "/ar/hasibat-alarabah", tr: "/tr/getiri-hesaplayici" },
  "/conversor-divisas": { es: "/es/conversor-divisas", en: "/en/currency-converter", de: "/de/waehrungsrechner", zh: "/zh/huobi-zhuanhua", ar: "/ar/muhawwil-alumlat", tr: "/tr/doviz-cevirici" },
  "/comparador": { es: "/es/comparador", en: "/en/comparator", de: "/de/vergleich", zh: "/zh/bijiao", ar: "/ar/muqarin", tr: "/tr/karsilastirma" },
  "/ratio-oro-plata": { es: "/es/ratio-oro-plata", en: "/en/gold-silver-ratio", de: "/de/gold-silber-verhaeltnis", zh: "/zh/jin-yin-bi", ar: "/ar/nisbat-althahab-alfiddah", tr: "/tr/altin-gumus-orani" },
  "/calendario-economico": { es: "/es/calendario-economico", en: "/en/economic-calendar", de: "/de/wirtschaftskalender", zh: "/zh/jingji-rili", ar: "/ar/altaqwim-aliqtisadi", tr: "/tr/ekonomik-takvim" },
  "/guia-inversion": { es: "/es/guia-inversion", en: "/en/investment-guide", de: "/de/investitionsleitfaden", zh: "/zh/touzi-zhinan", ar: "/ar/dalil-alistithmar", tr: "/tr/yatirim-rehberi" },
  "/productos": { es: "/es/productos", en: "/en/products", de: "/de/produkte", zh: "/zh/chanpin", ar: "/ar/muntajat", tr: "/tr/urunler" },
  "/noticias": { es: "/es/noticias", en: "/en/news", de: "/de/nachrichten", zh: "/zh/xinwen", ar: "/ar/akhbar", tr: "/tr/haberler" },
  "/learn": { es: "/es/aprende-inversion", en: "/en/learn", de: "/de/lernen-investition", zh: "/zh/xuexi", ar: "/ar/taallam", tr: "/tr/ogren-yatirim" },
  "/alertas": { es: "/es/alertas", en: "/en/alerts", de: "/de/benachrichtigungen", zh: "/zh/jingbao", ar: "/ar/tanbihat", tr: "/tr/uyarilar" },
  "/precio-oro-hoy": { es: "/es/precio-oro-hoy", en: "/en/gold-price-today", de: "/de/goldpreis-heute", zh: "/zh/jin-ri-jin-jia", ar: "/ar/sier-althahab-alyawm", tr: "/tr/altin-fiyati-bugun" },
  "/precio-gramo-oro": { es: "/es/precio-gramo-oro", en: "/en/gold-price-per-gram", de: "/de/goldpreis-pro-gramm", zh: "/zh/mei-ke-jin-jia", ar: "/ar/sier-ghram-althahab", tr: "/tr/gram-altin-fiyati" },
  "/aviso-legal": { es: "/es/aviso-legal", en: "/en/legal-notice", de: "/de/impressum", zh: "/zh/falv-shengming", ar: "/ar/ishaar-qanuni", tr: "/tr/yasal-uyari" },
  "/terminos": { es: "/es/terminos", en: "/en/terms", de: "/de/agb", zh: "/zh/tiaokuan", ar: "/ar/shurut", tr: "/tr/sartlar" },
  "/privacidad": { es: "/es/privacidad", en: "/en/privacy", de: "/de/datenschutz", zh: "/zh/yinsi", ar: "/ar/khususiyah", tr: "/tr/gizlilik" },
};

const METAL_SLUGS: Record<string, Record<string, string>> = {
  oro: { es: "oro", en: "gold", de: "gold", zh: "gold", ar: "gold", tr: "altin" },
  plata: { es: "plata", en: "silver", de: "silber", zh: "silver", ar: "silver", tr: "gumus" },
  platino: { es: "platino", en: "platinum", de: "platin", zh: "platinum", ar: "platinum", tr: "platin" },
  paladio: { es: "paladio", en: "palladium", de: "palladium", zh: "palladium", ar: "palladium", tr: "paladyum" },
  cobre: { es: "cobre", en: "copper", de: "kupfer", zh: "copper", ar: "copper", tr: "bakir" },
};

const PRICE_PATHS: Record<string, string> = {
  es: "precio", en: "price", de: "preis", zh: "jiage", ar: "sier", tr: "fiyat",
};

function buildEntry(
  paths: Record<string, string>,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${BASE}${paths[loc]}`;
  }
  languages["x-default"] = languages[DEFAULT_LOCALE];

  return {
    url: languages[DEFAULT_LOCALE],
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push(buildEntry(PATHNAMES["/"], "daily", 1.0));

  // Static pages
  const priorities: Record<string, [MetadataRoute.Sitemap[number]["changeFrequency"], number]> = {
    "/herramientas": ["weekly", 0.8],
    "/calculadora-rentabilidad": ["monthly", 0.7],
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
  };

  for (const [key, [freq, prio]] of Object.entries(priorities)) {
    if (PATHNAMES[key]) entries.push(buildEntry(PATHNAMES[key], freq, prio));
  }

  // Metal price pages
  for (const [internal, slugsByLocale] of Object.entries(METAL_SLUGS)) {
    const paths: Record<string, string> = {};
    for (const loc of LOCALES) {
      paths[loc] = `/${loc}/${PRICE_PATHS[loc]}/${slugsByLocale[loc]}`;
    }
    entries.push(buildEntry(paths, "daily", 0.9));
  }

  // Product pages (lazy import to avoid heavy module at top level)
  try {
    const { PRODUCTS } = await import("@/lib/data/products");
    const productPaths: Record<string, Record<string, string>> = {
      es: { base: "productos" }, en: { base: "products" }, de: { base: "produkte" },
      zh: { base: "chanpin" }, ar: { base: "muntajat" }, tr: { base: "urunler" },
    };
    for (const product of PRODUCTS) {
      const paths: Record<string, string> = {};
      for (const loc of LOCALES) {
        paths[loc] = `/${loc}/${productPaths[loc].base}/${product.slug}`;
      }
      entries.push(buildEntry(paths, "monthly", 0.6));
    }
  } catch (err) {
    console.error("[sitemap] Failed to load products:", err);
  }

  // Dynamic DB content
  try {
    const { getDb } = await import("@/lib/db");
    const { articles, glossaryTerms, learnClusters, learnArticles } = await import("@/lib/db/schema");
    const { eq, desc, isNotNull } = await import("drizzle-orm");

    const db = getDb();
    if (db) {
      const dbResult = await Promise.race([
        (async () => {
          const dbEntries: MetadataRoute.Sitemap = [];

          const newsPath: Record<string, string> = {
            es: "noticias", en: "news", de: "nachrichten", zh: "xinwen", ar: "akhbar", tr: "haberler",
          };
          const learnPath: Record<string, string> = {
            es: "aprende-inversion", en: "learn", de: "lernen-investition", zh: "xuexi", ar: "taallam", tr: "ogren-yatirim",
          };

          const allArticles = await db
            .select({ slug: articles.slug })
            .from(articles)
            .where(eq(articles.published, true))
            .orderBy(desc(articles.publishedAt))
            .limit(1000);

          for (const a of allArticles) {
            const paths: Record<string, string> = {};
            for (const loc of LOCALES) paths[loc] = `/${loc}/${newsPath[loc]}/${a.slug}`;
            dbEntries.push(buildEntry(paths, "weekly", 0.6));
          }

          const terms = await db
            .select({ slug: glossaryTerms.slug })
            .from(glossaryTerms)
            .where(eq(glossaryTerms.locale, DEFAULT_LOCALE))
            .limit(1000);

          for (const t of terms) {
            const paths: Record<string, string> = {};
            for (const loc of LOCALES) paths[loc] = `/${loc}/${learnPath[loc]}/glossary/${t.slug}`;
            dbEntries.push(buildEntry(paths, "monthly", 0.5));
          }

          const clusters = await db
            .select({ slug: learnClusters.slug })
            .from(learnClusters)
            .limit(100);

          for (const c of clusters) {
            const paths: Record<string, string> = {};
            for (const loc of LOCALES) paths[loc] = `/${loc}/${learnPath[loc]}/${c.slug}`;
            dbEntries.push(buildEntry(paths, "weekly", 0.6));
          }

          const learnRows = await db
            .select({ slug: learnArticles.slug, clusterSlug: learnClusters.slug })
            .from(learnArticles)
            .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
            .where(isNotNull(learnArticles.publishedAt))
            .limit(1000);

          for (const la of learnRows) {
            const paths: Record<string, string> = {};
            for (const loc of LOCALES) paths[loc] = `/${loc}/${learnPath[loc]}/${la.clusterSlug}/${la.slug}`;
            dbEntries.push(buildEntry(paths, "monthly", 0.5));
          }

          return dbEntries;
        })(),
        new Promise<MetadataRoute.Sitemap>((resolve) =>
          setTimeout(() => {
            console.warn("[sitemap] DB timed out after 8s");
            resolve([]);
          }, 8_000)
        ),
      ]);
      entries.push(...dbResult);
    }
  } catch (err) {
    console.error("[sitemap] DB fetch failed:", err);
  }

  // Absolute fallback
  if (entries.length === 0) {
    entries.push({
      url: `${BASE}/en`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    });
  }

  return entries;
}
