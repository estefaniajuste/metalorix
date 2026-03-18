import { NextRequest, NextResponse } from "next/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { INTERNAL_METAL_SLUGS, getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { getDb } from "@/lib/db";
import { articles, articleTranslations } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo/ping";

const BASE = "https://metalorix.com";
const CRON_SECRET = process.env.CRON_SECRET;

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
  ] as const;

  for (const path of staticPaths) {
    urls.push(...allLocaleUrls(path));
  }

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
