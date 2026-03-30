import { NextRequest, NextResponse } from "next/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { INTERNAL_METAL_SLUGS, getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { getDb } from "@/lib/db";
import {
  articles, articleTranslations,
  glossaryTerms,
  learnClusters, learnArticles, learnArticleLocalizations,
} from "@/lib/db/schema";
import { eq, desc, inArray, isNotNull } from "drizzle-orm";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo/ping";
import { DEALER_COUNTRIES, DEALER_BASE_PATHS, getCitiesByCountry } from "@/lib/data/dealers";

const BASE = "https://metalorix.com";
const CRON_SECRET = process.env.CRON_SECRET;

const LEARN_BASE: Record<string, string> = {
  es: "aprende-inversion", en: "learn", de: "lernen-investition",
  zh: "xuexi", ar: "taallam", tr: "ogren-yatirim", hi: "gyaan-nivesh",
};

const GLOSSARY_CLUSTER: Record<string, string> = {
  es: "glosario", en: "glossary", de: "glossar", zh: "shuyu",
  ar: "mustalahat", tr: "sozluk", hi: "shabdavali",
};

const CLUSTER_SLUG_I18N: Record<string, Record<string, string>> = {
  es: { fundamentals: "fundamentos", history: "historia", "markets-trading": "mercados-trading", investment: "inversion", "physical-metals": "metales-fisicos", "price-factors": "factores-precio", "production-industry": "produccion-industria", "geology-science": "geologia-ciencia", "regulation-tax": "regulacion-impuestos", "security-authenticity": "seguridad-autenticidad", "ratios-analytics": "ratios-analitica", macroeconomics: "macroeconomia", guides: "guias", "faq-mistakes": "preguntas-errores", comparisons: "comparativas", glossary: "glosario" },
  de: { fundamentals: "grundlagen", history: "geschichte", "markets-trading": "maerkte-handel", investment: "investition", "physical-metals": "physische-metalle", "price-factors": "preisfaktoren", "production-industry": "produktion-industrie", "geology-science": "geologie-wissenschaft", "regulation-tax": "regulierung-steuern", "security-authenticity": "sicherheit-echtheit", "ratios-analytics": "kennzahlen-analyse", macroeconomics: "makrooekonomie", guides: "leitfaeden", "faq-mistakes": "faq-fehler", comparisons: "vergleiche", glossary: "glossar" },
  zh: { fundamentals: "jichu", history: "lishi", "markets-trading": "shichang-jiaoyi", investment: "touzi", "physical-metals": "shiwu-jinshu", "price-factors": "jiage-yinsu", "production-industry": "shengchan-gongye", "geology-science": "dizhi-kexue", "regulation-tax": "fagui-shuiwu", "security-authenticity": "anquan-zhenwei", "ratios-analytics": "bilv-fenxi", macroeconomics: "hongguan-jingji", guides: "zhinan", "faq-mistakes": "changjian-wenti", comparisons: "bijiao", glossary: "shuyu" },
  ar: { fundamentals: "asasiyat", history: "tarikh", "markets-trading": "aswaq-tadawul", investment: "istithmar", "physical-metals": "maadin-madiyah", "price-factors": "awamil-asiar", "production-industry": "intaj-sinai", "geology-science": "jiyulujiya-ulum", "regulation-tax": "tanzim-daraib", "security-authenticity": "aman-asalah", "ratios-analytics": "nisab-tahlilat", macroeconomics: "iqtisad-kulli", guides: "adillah", "faq-mistakes": "asilah-akhta", comparisons: "muqaranat", glossary: "mustalahat" },
  tr: { fundamentals: "temeller", history: "tarih", "markets-trading": "piyasalar-ticaret", investment: "yatirim", "physical-metals": "fiziksel-metaller", "price-factors": "fiyat-faktorleri", "production-industry": "uretim-endustri", "geology-science": "jeoloji-bilim", "regulation-tax": "duzenleme-vergi", "security-authenticity": "guvenlik-orijinallik", "ratios-analytics": "oranlar-analitik", macroeconomics: "makroekonomi", guides: "rehberler", "faq-mistakes": "sss-hatalar", comparisons: "karsilastirmalar", glossary: "sozluk" },
  hi: { fundamentals: "mool-tattva", history: "itihas", "markets-trading": "bazaar-vyapar", investment: "nivesh", "physical-metals": "bhaute-dhatu", "price-factors": "mulya-karak", "production-industry": "uttpadan-udyog", "geology-science": "bhugol-vigyan", "regulation-tax": "niyaman-kar", "security-authenticity": "suraksha-pramaan", "ratios-analytics": "anupat-vishleshan", macroeconomics: "makro-arthvyavastha", guides: "margdarshika", "faq-mistakes": "puchhe-jane-wale-sawal", comparisons: "tulna", glossary: "shabdavali" },
};

function allLocaleUrls(href: Parameters<typeof getPathname>[0]["href"]): string[] {
  return routing.locales.map(
    (loc) => `${BASE}${getPathname({ locale: loc as Locale, href: href as any })}`
  );
}

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const urls: string[] = [];

  urls.push(...allLocaleUrls("/"));

  const staticPaths = [
    "/herramientas",
    "/calculadora-rentabilidad",
    "/conversor-divisas",
    "/comparador",
    "/ratio-oro-plata",
    "/calendario-economico",
    "/guia-inversion",
    "/productos",
    "/noticias",
    "/learn",
    "/precio-oro-hoy",
    "/precio-gramo-oro",
    "/alertas",
    "/donde-comprar",
  ] as const;

  for (const path of staticPaths) {
    urls.push(...allLocaleUrls(path));
  }

  for (const country of DEALER_COUNTRIES) {
    for (const loc of routing.locales) {
      const base = DEALER_BASE_PATHS[loc] ?? "/where-to-buy";
      const slug = country.slug[loc] ?? country.slug.en;
      urls.push(`${BASE}/${loc}${base}/${slug}`);
    }
    const cities = getCitiesByCountry(country.code);
    for (const cityEntry of cities) {
      for (const loc of routing.locales) {
        const base = DEALER_BASE_PATHS[loc] ?? "/where-to-buy";
        const slug = country.slug[loc] ?? country.slug.en;
        urls.push(`${BASE}/${loc}${base}/${slug}/${cityEntry.slug}`);
      }
    }
  }

  urls.push(...allLocaleUrls("/donde-comprar/mejores"));

  for (const slug of INTERNAL_METAL_SLUGS) {
    const localizedSlug = getLocalizedMetalSlug(slug, "es");
    urls.push(
      ...allLocaleUrls({ pathname: "/precio/[metal]", params: { metal: localizedSlug } } as any)
    );
  }

  try {
    const db = getDb();
    if (db) {
      const allArticles = await db
        .select({ id: articles.id, slug: articles.slug })
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.publishedAt))
        .limit(500);

      const articleIds = allArticles.map((a) => a.id);
      const translationRows = articleIds.length > 0
        ? await db
            .select({
              articleId: articleTranslations.articleId,
              locale: articleTranslations.locale,
              slug: articleTranslations.slug,
            })
            .from(articleTranslations)
            .where(inArray(articleTranslations.articleId, articleIds))
        : [];

      const slugsByArticle = new Map<number, Record<string, string>>();
      for (const row of translationRows) {
        if (!row.slug) continue;
        if (!slugsByArticle.has(row.articleId)) slugsByArticle.set(row.articleId, {});
        slugsByArticle.get(row.articleId)![row.locale] = row.slug;
      }

      for (const article of allArticles) {
        const locSlugs = slugsByArticle.get(article.id);
        for (const loc of routing.locales) {
          const slug = loc === "es" ? article.slug : (locSlugs?.[loc] ?? article.slug);
          urls.push(
            `${BASE}${getPathname({ locale: loc as Locale, href: { pathname: "/noticias/[slug]", params: { slug } } as any })}`
          );
        }
      }

      // --- Learn clusters ---
      const clusters = await db
        .select({ slug: learnClusters.slug })
        .from(learnClusters)
        .limit(100)
        .catch(() => [] as { slug: string }[]);

      for (const c of clusters) {
        for (const loc of routing.locales) {
          urls.push(
            `${BASE}${getPathname({ locale: loc as Locale, href: { pathname: "/learn/[cluster]" as any, params: { cluster: c.slug } } as any })}`
          );
        }
      }

      // --- Learn articles with localized slugs ---
      const learnRows = await db
        .select({
          id: learnArticles.id,
          slug: learnArticles.slug,
          clusterSlug: learnClusters.slug,
        })
        .from(learnArticles)
        .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
        .where(isNotNull(learnArticles.publishedAt))
        .limit(2000)
        .catch(() => [] as { id: number; slug: string; clusterSlug: string }[]);

      const learnLocRows = learnRows.length > 0
        ? await db
            .select({
              articleId: learnArticleLocalizations.articleId,
              locale: learnArticleLocalizations.locale,
              slug: learnArticleLocalizations.slug,
            })
            .from(learnArticleLocalizations)
            .catch(() => [] as { articleId: number; locale: string; slug: string | null }[])
        : [];

      const learnSlugsByArticle = new Map<number, Record<string, string>>();
      for (const lr of learnLocRows) {
        if (!lr.slug) continue;
        if (!learnSlugsByArticle.has(lr.articleId)) learnSlugsByArticle.set(lr.articleId, {});
        learnSlugsByArticle.get(lr.articleId)![lr.locale] = lr.slug;
      }

      for (const la of learnRows) {
        const locSlugs = learnSlugsByArticle.get(la.id);
        for (const loc of routing.locales) {
          const aSlug = locSlugs?.[loc] ?? la.slug;
          urls.push(`${BASE}/${loc}/${LEARN_BASE[loc] ?? "learn"}/${CLUSTER_SLUG_I18N[loc]?.[la.clusterSlug] ?? la.clusterSlug}/${aSlug}`);
        }
      }

      // --- Glossary terms ---
      const glossaryRows = await db
        .select({ slug: glossaryTerms.slug })
        .from(glossaryTerms)
        .where(eq(glossaryTerms.locale, "en"))
        .limit(1000)
        .catch(() => [] as { slug: string }[]);

      for (const g of glossaryRows) {
        for (const loc of routing.locales) {
          urls.push(`${BASE}/${loc}/${LEARN_BASE[loc] ?? "learn"}/${GLOSSARY_CLUSTER[loc] ?? "glossary"}/${g.slug}`);
        }
      }
    }
  } catch {
    // DB unavailable
  }

  const pingResult = await pingSearchEngines();

  const batchSize = 10_000;
  let indexNowSuccess = 0;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const ok = await pingIndexNow(batch);
    if (ok) indexNowSuccess += batch.length;
  }

  return NextResponse.json({
    ok: true,
    totalUrls: urls.length,
    pingResult,
    indexNow: { submitted: indexNowSuccess, total: urls.length },
    timestamp: new Date().toISOString(),
  });
}
