import type { MetadataRoute } from "next";

const BASE_URL = "https://metalorix.com";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...staticPages, ...metalPages];
}
