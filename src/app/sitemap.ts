import type { MetadataRoute } from "next";

// Sitemap disabled — URLs are not yet stable; returning empty to prevent
// search engines from indexing broken paths and triggering 404 penalties.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
