import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { INTERNAL_METAL_SLUGS, getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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
  languages["x-default"] = languages.es;

  return {
    url: languages.es,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push(buildEntry("/", "daily", 1.0));

  // Static pages
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
    { href: "/aprende", freq: "weekly", priority: 0.6 },
    { href: "/learn", freq: "weekly", priority: 0.6 },
    { href: "/alertas", freq: "monthly", priority: 0.5 },
    { href: "/precio-oro-hoy", freq: "daily", priority: 0.9 },
    { href: "/precio-gramo-oro", freq: "daily", priority: 0.8 },
  ];

  for (const page of staticPages) {
    entries.push(buildEntry(page.href, page.freq, page.priority));
  }

  // Metal price pages
  for (const slug of INTERNAL_METAL_SLUGS) {
    const localizedSlug = getLocalizedMetalSlug(slug, "es");
    entries.push(
      buildEntry(
        { pathname: "/precio/[metal]", params: { metal: localizedSlug } } as any,
        "daily",
        0.9,
      ),
    );
  }

  // News articles from DB
  try {
    const db = getDb();
    if (db) {
      const allArticles = await db
        .select({ slug: articles.slug, publishedAt: articles.publishedAt })
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.publishedAt))
        .limit(500);

      for (const article of allArticles) {
        entries.push(
          buildEntry(
            { pathname: "/noticias/[slug]", params: { slug: article.slug } } as any,
            "weekly",
            0.6,
          ),
        );
      }
    }
  } catch {
    // DB unavailable at build time — static entries only
  }

  return entries;
}
