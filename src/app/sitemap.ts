import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { articles, glossaryTerms, learnArticles } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getLocalizedMetalSlug, INTERNAL_METAL_SLUGS } from "@/lib/utils/metal-slugs";

const BASE_URL = "https://metalorix.com";

async function getPublishedArticles() {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select({ slug: articles.slug, updatedAt: articles.updatedAt })
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(100);
  } catch {
    return [];
  }
}

async function getPublishedGlossaryTerms() {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select({
        slug: glossaryTerms.slug,
        updatedAt: glossaryTerms.updatedAt,
      })
      .from(glossaryTerms)
      .where(eq(glossaryTerms.published, true))
      .orderBy(asc(glossaryTerms.term))
      .limit(1100);
  } catch {
    return [];
  }
}

async function getPublishedLearnArticles() {
  const db = getDb();
  if (!db) return [];
  try {
    const { learnClusters } = await import("@/lib/db/schema");
    const rows = await db
      .select({
        slug: learnArticles.slug,
        clusterSlug: learnClusters.slug,
        publishedAt: learnArticles.publishedAt,
      })
      .from(learnArticles)
      .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
      .where(eq(learnArticles.status, "published"))
      .limit(2000);
    return rows;
  } catch {
    return [];
  }
}

function localizedUrl(locale: Locale, href: Parameters<typeof getPathname>[0]["href"]) {
  return `${BASE_URL}${getPathname({ locale, href: href as any })}`;
}

function alternatesForHref(href: Parameters<typeof getPathname>[0]["href"]) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, href);
  }
  return { languages };
}

type StaticRoute = {
  href: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { href: "/", changeFrequency: "hourly", priority: 1 },
  { href: "/noticias", changeFrequency: "daily", priority: 0.8 },
  { href: "/herramientas", changeFrequency: "weekly", priority: 0.7 },
  { href: "/alertas", changeFrequency: "weekly", priority: 0.6 },
  { href: "/aprende", changeFrequency: "daily", priority: 0.8 },
  { href: "/learn", changeFrequency: "daily", priority: 0.85 },
  { href: "/guia-inversion", changeFrequency: "monthly", priority: 0.8 },
  { href: "/productos", changeFrequency: "weekly", priority: 0.7 },
  { href: "/ratio-oro-plata", changeFrequency: "hourly", priority: 0.85 },
  { href: "/calculadora-rentabilidad", changeFrequency: "weekly", priority: 0.8 },
  { href: "/conversor-divisas", changeFrequency: "hourly", priority: 0.8 },
  { href: "/precio-oro-hoy", changeFrequency: "hourly", priority: 0.9 },
  { href: "/precio-gramo-oro", changeFrequency: "hourly", priority: 0.85 },
  { href: "/calendario-economico", changeFrequency: "weekly", priority: 0.8 },
  { href: "/comparador", changeFrequency: "daily", priority: 0.8 },
  { href: "/aviso-legal", changeFrequency: "yearly", priority: 0.3 },
  { href: "/terminos", changeFrequency: "yearly", priority: 0.3 },
  { href: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [];
  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      staticPages.push({
        url: localizedUrl(locale, route.href as any),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: alternatesForHref(route.href as any),
      });
    }
  }

  const metalPages: MetadataRoute.Sitemap = [];
  for (const internalSlug of INTERNAL_METAL_SLUGS) {
    for (const locale of routing.locales) {
      const localSlug = getLocalizedMetalSlug(internalSlug, locale);
      const href = { pathname: "/precio/[metal]" as const, params: { metal: localSlug } };
      metalPages.push({
        url: localizedUrl(locale, href),
        lastModified: now,
        changeFrequency: "hourly",
        priority: 0.9,
        alternates: alternatesForHref(href),
      });
    }
  }

  const publishedArticles = await getPublishedArticles();
  const articlePages: MetadataRoute.Sitemap = [];
  for (const a of publishedArticles) {
    const href = { pathname: "/noticias/[slug]" as const, params: { slug: a.slug } };
    for (const locale of routing.locales) {
      articlePages.push({
        url: localizedUrl(locale, href),
        lastModified: a.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: alternatesForHref(href),
      });
    }
  }

  const glossaryPages = await getPublishedGlossaryTerms();
  const learnPages: MetadataRoute.Sitemap = [];
  for (const t of glossaryPages) {
    const href = { pathname: "/aprende/[slug]" as const, params: { slug: t.slug } };
    for (const locale of routing.locales) {
      learnPages.push({
        url: localizedUrl(locale, href),
        lastModified: t.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: alternatesForHref(href),
      });
    }
  }

  const learnArticleRows = await getPublishedLearnArticles();
  const learnArticlePages: MetadataRoute.Sitemap = [];
  for (const a of learnArticleRows) {
    for (const locale of routing.locales) {
      learnArticlePages.push({
        url: `${BASE_URL}/${locale}/learn/${a.clusterSlug}/${a.slug}`,
        lastModified: a.publishedAt || now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...metalPages, ...articlePages, ...learnPages, ...learnArticlePages];
}
