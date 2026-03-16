import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { INTERNAL_METAL_SLUGS, getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { PRODUCTS } from "@/lib/data/products";
import { getDb } from "@/lib/db";
import { articles, glossaryTerms, learnClusters, learnArticles } from "@/lib/db/schema";
import { eq, desc, isNotNull } from "drizzle-orm";

const BASE = "https://metalorix.com";

type StaticPath = Parameters<typeof getPathname>[0]["href"];

function buildEntry(
  href: StaticPath,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
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
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  entries.push(buildEntry("/", "daily", 1.0));

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
    entries.push(buildEntry(page.href, page.freq, page.priority));
  }

  // Metal price pages
  for (const slug of INTERNAL_METAL_SLUGS) {
    const localizedSlug = getLocalizedMetalSlug(slug, routing.defaultLocale);
    entries.push(
      buildEntry(
        { pathname: "/precio/[metal]", params: { metal: localizedSlug } } as any,
        "daily",
        0.9,
      ),
    );
  }

  // Product pages
  for (const product of PRODUCTS) {
    entries.push(
      buildEntry(
        { pathname: "/productos/[slug]", params: { slug: product.slug } } as any,
        "monthly",
        0.6,
      ),
    );
  }

  // Dynamic content from DB
  try {
    const db = getDb();
    if (db) {
      // News articles
      const allArticles = await db
        .select({ slug: articles.slug, publishedAt: articles.publishedAt })
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.publishedAt))
        .limit(1000);

      for (const article of allArticles) {
        entries.push(
          buildEntry(
            { pathname: "/noticias/[slug]", params: { slug: article.slug } } as any,
            "weekly",
            0.6,
          ),
        );
      }

      // Glossary terms (part of the learn/glossary cluster)
      const terms = await db
        .select({ slug: glossaryTerms.slug })
        .from(glossaryTerms)
        .where(eq(glossaryTerms.locale, routing.defaultLocale))
        .limit(1000);

      for (const term of terms) {
        entries.push(
          buildEntry(
            { pathname: "/learn/[cluster]/[slug]", params: { cluster: "glossary", slug: term.slug } } as any,
            "monthly",
            0.5,
          ),
        );
      }

      // Learn clusters
      const clusters = await db
        .select({ slug: learnClusters.slug })
        .from(learnClusters)
        .limit(100);

      for (const cluster of clusters) {
        entries.push(
          buildEntry(
            { pathname: "/learn/[cluster]", params: { cluster: cluster.slug } } as any,
            "weekly",
            0.6,
          ),
        );
      }

      // Learn articles
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
        entries.push(
          buildEntry(
            { pathname: "/learn/[cluster]/[slug]", params: { cluster: la.clusterSlug, slug: la.slug } } as any,
            "monthly",
            0.5,
          ),
        );
      }
    }
  } catch {
    // DB unavailable at build time
  }

  return entries;
}
