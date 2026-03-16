import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/panel/", "/lawha/", "/dashboard/", "/mianban/"],
      },
    ],
    sitemap: "https://metalorix.com/sitemap.xml",
  };
}
