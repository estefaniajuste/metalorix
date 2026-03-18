import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, articleTranslations, glossaryTerms, learnClusters, learnArticles } from "@/lib/db/schema";
import { eq, desc, isNotNull, inArray } from "drizzle-orm";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { INTERNAL_METAL_SLUGS, getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { PRODUCTS } from "@/lib/data/products";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo/ping";

const CRON_SECRET = process.env.CRON_SECRET;
const BASE = "https://metalorix.com";

function allLocaleUrls(href: any): string[] {
  return routing.locales.map((loc) =>
    `${BASE}${getPathname({ locale: loc, href } as any)}`
  );
}

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const allUrls: string[] = [];

  // Static pages
  const staticPaths = [
    "/", "/herramientas", "/calculadora-rentabilidad", "/conversor-divisas",
    "/comparador", "/ratio-oro-plata", "/calendario-economico", "/guia-inversion",
    "/productos", "/noticias", "/learn", "/alertas",
    "/precio-oro-hoy", "/precio-gramo-oro",
  ];
  for (const p of staticPaths) {
    allUrls.push(...allLocaleUrls(p));
  }

  // Metal pages
  for (const slug of INTERNAL_METAL_SLUGS) {
    for (const loc of routing.locales) {
      const localizedSlug = getLocalizedMetalSlug(slug, loc);
      allUrls.push(`${BASE}${getPathname({ locale: loc, href: { pathname: "/precio/[metal]", params: { metal: localizedSlug } } } as any)}`);
    }
  }

  // Product pages
  for (const product of PRODUCTS) {
    allUrls.push(...allLocaleUrls({ pathname: "/productos/[slug]", params: { slug: product.slug } }));
  }

  // DB content
  const db = getDb();
  if (db) {
    try {
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

      for (const a of allArticles) {
        const locSlugs = slugsByArticle.get(a.id);
        for (const loc of routing.locales) {
          const slug = loc === "es" ? a.slug : (locSlugs?.[loc] ?? a.slug);
          allUrls.push(
            `${BASE}${getPathname({ locale: loc, href: { pathname: "/noticias/[slug]", params: { slug } } } as any)}`
          );
        }
      }

      const terms = await db
        .select({ slug: glossaryTerms.slug })
        .from(glossaryTerms)
        .where(eq(glossaryTerms.locale, "es"))
        .limit(500);

      for (const t of terms) {
        allUrls.push(...allLocaleUrls({ pathname: "/learn/[cluster]/[slug]", params: { cluster: "glossary", slug: t.slug } }));
      }

      const clusters = await db.select({ slug: learnClusters.slug }).from(learnClusters).limit(100);
      for (const c of clusters) {
        allUrls.push(...allLocaleUrls({ pathname: "/learn/[cluster]", params: { cluster: c.slug } }));
      }

      const learnRows = await db
        .select({ slug: learnArticles.slug, clusterSlug: learnClusters.slug })
        .from(learnArticles)
        .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
        .where(isNotNull(learnArticles.publishedAt))
        .limit(500);

      for (const la of learnRows) {
        allUrls.push(...allLocaleUrls({ pathname: "/learn/[cluster]/[slug]", params: { cluster: la.clusterSlug, slug: la.slug } }));
      }
    } catch (err) {
      console.error("DB fetch for index-all failed:", err);
    }
  }

  // Ping sitemap
  const sitemapResult = await pingSearchEngines();

  // Submit to IndexNow in batches of 10,000
  let indexNowOk = 0;
  for (let i = 0; i < allUrls.length; i += 10_000) {
    const batch = allUrls.slice(i, i + 10_000);
    const ok = await pingIndexNow(batch);
    if (ok) indexNowOk += batch.length;
  }

  return NextResponse.json({
    ok: true,
    totalUrls: allUrls.length,
    sitemapPing: sitemapResult,
    indexNowSubmitted: indexNowOk,
    timestamp: new Date().toISOString(),
  });
}
