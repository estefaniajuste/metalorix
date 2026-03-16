import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  const panelPaths = routing.locales.map((loc) =>
    getPathname({ locale: loc as Locale, href: "/panel" as any }),
  );
  const uniquePanelPaths = panelPaths.filter((p, i) => panelPaths.indexOf(p) === i);

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/sitemap", "/api/feed"],
        disallow: ["/api/", ...uniquePanelPaths.map((p) => `${p}/`)],
      },
    ],
    sitemap: "https://metalorix.com/api/sitemap",
  };
}
