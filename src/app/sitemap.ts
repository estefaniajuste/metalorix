import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/noticias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/herramientas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/alertas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const metalPages: MetadataRoute.Sitemap = ["oro", "plata", "platino"].map(
    (metal) => ({
      url: `${BASE_URL}/precio/${metal}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })
  );

  const publishedArticles = await getPublishedArticles();
  const articlePages: MetadataRoute.Sitemap = publishedArticles.map((a) => ({
    url: `${BASE_URL}/noticias/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...metalPages, ...articlePages];
}
