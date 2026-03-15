import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { PRODUCTS } from "@/lib/data/products";
import type { Locale } from "@/i18n/routing";

const BASE_URL = "https://metalorix.com";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface StaticRoute {
  href: string;
  changeFrequency: ChangeFreq;
  priority: number;
}

const STATIC_ROUTES: StaticRoute[] = [
  { href: "/", changeFrequency: "daily", priority: 1.0 },
  { href: "/precio/oro", changeFrequency: "hourly", priority: 0.95 },
  { href: "/precio/plata", changeFrequency: "hourly", priority: 0.9 },
  { href: "/precio/platino", changeFrequency: "hourly", priority: 0.8 },
  { href: "/precio-oro-hoy", changeFrequency: "daily", priority: 0.9 },
  { href: "/precio-gramo-oro", changeFrequency: "daily", priority: 0.85 },
  { href: "/herramientas", changeFrequency: "weekly", priority: 0.7 },
  { href: "/calculadora-rentabilidad", changeFrequency: "weekly", priority: 0.7 },
  { href: "/conversor-divisas", changeFrequency: "weekly", priority: 0.7 },
  { href: "/comparador", changeFrequency: "weekly", priority: 0.7 },
  { href: "/ratio-oro-plata", changeFrequency: "daily", priority: 0.8 },
  { href: "/calendario-economico", changeFrequency: "daily", priority: 0.8 },
  { href: "/productos", changeFrequency: "weekly", priority: 0.85 },
  { href: "/noticias", changeFrequency: "daily", priority: 0.85 },
  { href: "/aprende", changeFrequency: "weekly", priority: 0.8 },
  { href: "/learn", changeFrequency: "daily", priority: 0.85 },
  { href: "/guia-inversion", changeFrequency: "monthly", priority: 0.75 },
  { href: "/alertas", changeFrequency: "monthly", priority: 0.6 },
];

function resolvePathname(href: string, locale: Locale): string {
  try {
    return getPathname({ locale, href: href as any });
  } catch {
    return href;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      const path = resolvePathname(route.href, locale as Locale);
      entries.push({
        url: `${BASE_URL}/${locale}${path === "/" ? "" : path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  for (const product of PRODUCTS) {
    for (const locale of routing.locales) {
      const path = resolvePathname("/productos", locale as Locale);
      entries.push({
        url: `${BASE_URL}/${locale}${path}/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.75,
      });
    }
  }

  return entries;
}
