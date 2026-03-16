import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { INTERNAL_METAL_SLUGS, getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { PRODUCTS } from "@/lib/data/products";

const BASE = "https://metalorix.com";

type StaticPath = Parameters<typeof getPathname>[0]["href"];

function safeBuildEntry(
  href: StaticPath,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] | null {
  try {
    const languages: Record<string, string> = {};
    for (const loc of routing.locales) {
      languages[loc] = `${BASE}${getPathname({ locale: loc, href: href as any })}`;
    }
    languages["x-default"] = languages[routing.defaultLocale];

    return {
      url: languages[routing.defaultLocale],
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages },
    };
  } catch (err) {
    console.error(`[sitemap] Failed to build entry for ${JSON.stringify(href)}:`, err);
    return null;
  }
}

function pushSafe(entries: MetadataRoute.Sitemap, entry: MetadataRoute.Sitemap[number] | null) {
  if (entry) entries.push(entry);
}

async function fetchDbEntries(): Promise<MetadataRoute.Sitemap> {
  const { getDb } = await import("@/lib/db");
  const { articles, glossaryTerms, learnClusters, learnArticles } = await import("@/lib/db/schema");
  const { eq, desc, isNotNull } = await import("drizzle-orm");

  const entries: MetadataRoute.Sitemap = [];
  const db = getDb();
  if (!db) return entries;

  const allArticles = await db
    .select({ slug: articles.slug, publishedAt: articles.publishedAt })
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt))
    .limit(1000);

  for (const article of allArticles) {
    pushSafe(entries, safeBuildEntry(
      { pathname: "/noticias/[slug]", params: { slug: article.slug } } as any,
      "weekly", 0.6,
    ));
  }

  const terms = await db
    .select({ slug: glossaryTerms.slug })
    .from(glossaryTerms)
    .where(eq(glossaryTerms.locale, routing.defaultLocale))
    .limit(1000);

  for (const term of terms) {
    pushSafe(entries, safeBuildEntry(
      { pathname: "/learn/[cluster]/[slug]", params: { cluster: "glossary", slug: term.slug } } as any,
      "monthly", 0.5,
    ));
  }

  const clusters = await db
    .select({ slug: learnClusters.slug })
    .from(learnClusters)
    .limit(100);

  for (const cluster of clusters) {
    pushSafe(entries, safeBuildEntry(
      { pathname: "/learn/[cluster]", params: { cluster: cluster.slug } } as any,
      "weekly", 0.6,
    ));
  }

  const learnArticleRows = await db
    .select({
      slug: learnArticles.slug,
      clusterSlug: learnClusters.slug,
    })
    .from(learnArticles)
    .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
    .where(isNotNull(learnArticles.publishedAt))
    .limit(1000);

  for (const la of learnArticleRows) {
    pushSafe(entries, safeBuildEntry(
      { pathname: "/learn/[cluster]/[slug]", params: { cluster: la.clusterSlug, slug: la.slug } } as any,
      "monthly", 0.5,
    ));
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // --- Static pages (always returned, even if DB fails) ---
  try {
    pushSafe(entries, safeBuildEntry("/", "daily", 1.0));

    const staticPages: Array<{ href: StaticPath; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
      { href: "/herramientas", freq: "weekly", priority: 0.8 },
      { href: "/calculadora-rentabilidad", freq: "monthly", priority: 0.7 },
      { href: "/conversor-divisas", freq: "monthly", priority: 0.7 },
      { href: "/comparador", freq: "monthly", priority: 0.7 },
      { href: "/ratio-oro-plata", freq: "daily", priority: 0.8 },
      { href: "/calendario-economico", freq: "weekly", priority: 0.7 },
      { href: "/guia-inversion", freq: "monthly", priority: 0.7 },
      { href: "/productos", freq: "monthly", priority: 0.7 },
      { href: "/noticias", freq: "daily", priority: 0.9 },
      { href: "/learn", freq: "weekly", priority: 0.7 },
      { href: "/alertas", freq: "monthly", priority: 0.5 },
      { href: "/precio-oro-hoy", freq: "daily", priority: 0.9 },
      { href: "/precio-gramo-oro", freq: "daily", priority: 0.8 },
      { href: "/aviso-legal", freq: "yearly", priority: 0.3 },
      { href: "/terminos", freq: "yearly", priority: 0.3 },
      { href: "/privacidad", freq: "yearly", priority: 0.3 },
    ];

    for (const page of staticPages) {
      pushSafe(entries, safeBuildEntry(page.href, page.freq, page.priority));
    }

    for (const slug of INTERNAL_METAL_SLUGS) {
      try {
        const languages: Record<string, string> = {};
        for (const loc of routing.locales) {
          const locSlug = getLocalizedMetalSlug(slug, loc);
          languages[loc] = `${BASE}${getPathname({ locale: loc, href: { pathname: "/precio/[metal]", params: { metal: locSlug } } as any })}`;
        }
        languages["x-default"] = languages[routing.defaultLocale];
        entries.push({
          url: languages[routing.defaultLocale],
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.9,
          alternates: { languages },
        });
      } catch (err) {
        console.error(`[sitemap] Failed to build metal entry for ${slug}:`, err);
      }
    }

    for (const product of PRODUCTS) {
      pushSafe(entries, safeBuildEntry(
        { pathname: "/productos/[slug]", params: { slug: product.slug } } as any,
        "monthly", 0.6,
      ));
    }
  } catch (err) {
    console.error("[sitemap] Failed to build static entries:", err);
  }

  // --- Dynamic content from DB (additive, never breaks the sitemap) ---
  try {
    const dbEntries = await Promise.race([
      fetchDbEntries(),
      new Promise<MetadataRoute.Sitemap>((resolve) =>
        setTimeout(() => {
          console.warn("[sitemap] DB query timed out after 8s, returning static entries only");
          resolve([]);
        }, 8_000)
      ),
    ]);
    entries.push(...dbEntries);
  } catch (err) {
    console.error("[sitemap] DB fetch failed, returning static entries only:", err);
  }

  // Ultimate fallback: always return at least the homepage
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
