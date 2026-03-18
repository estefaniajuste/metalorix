import { NextRequest, NextResponse } from "next/server";
import {
  submitUrlsToGoogle,
  isIndexingApiConfigured,
} from "@/lib/seo/indexing-api";

const CRON_SECRET = process.env.CRON_SECRET?.trim();
const BASE = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";

const PRIORITY_STATIC_URLS = [
  "/en",
  "/es",
  "/en/price/gold",
  "/es/precio/oro",
  "/en/price/silver",
  "/es/precio/plata",
  "/en/price/platinum",
  "/es/precio/platino",
  "/en/price/palladium",
  "/es/precio/paladio",
  "/en/price/copper",
  "/es/precio/cobre",
  "/en/news",
  "/es/noticias",
  "/en/learn",
  "/es/aprende-inversion",
  "/en/tools",
  "/es/herramientas",
  "/en/products",
  "/es/productos",
  "/en/gold-price-today",
  "/es/precio-oro-hoy",
  "/en/roi-calculator",
  "/es/calculadora-rentabilidad",
  "/en/currency-converter",
  "/es/conversor-divisas",
  "/en/gold-silver-ratio",
  "/es/ratio-oro-plata",
  "/en/investment-guide",
  "/es/guia-inversion",
];

const NEWS_BASE: Record<string, string> = {
  es: "noticias", en: "news",
};

const LEARN_BASE: Record<string, string> = {
  es: "aprende-inversion", en: "learn",
};

interface DynamicUrl {
  slug: string;
  type: string;
  cluster?: string;
  lastmod?: string;
}

async function fetchDynamicUrls(): Promise<DynamicUrl[]> {
  try {
    const res = await fetch(`${BASE}/api/sitemap-urls`, {
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.urls) ? data.urls : [];
  } catch {
    return [];
  }
}

function buildDynamicUrls(items: DynamicUrl[], maxPerType: number): string[] {
  const urls: string[] = [];
  const locales = ["en", "es"];

  const articles = items
    .filter((i) => i.type === "article")
    .slice(0, maxPerType);
  for (const a of articles) {
    for (const loc of locales) {
      urls.push(`${BASE}/${loc}/${NEWS_BASE[loc]}/${a.slug}`);
    }
  }

  const clusters = items
    .filter((i) => i.type === "cluster")
    .slice(0, maxPerType);
  for (const c of clusters) {
    for (const loc of locales) {
      urls.push(`${BASE}/${loc}/${LEARN_BASE[loc]}/${c.slug}`);
    }
  }

  const learnArticles = items
    .filter((i) => i.type === "learn-article" && i.cluster)
    .slice(0, maxPerType);
  for (const la of learnArticles) {
    for (const loc of locales) {
      urls.push(`${BASE}/${loc}/${LEARN_BASE[loc]}/${la.cluster}/${la.slug}`);
    }
  }

  return urls;
}

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isIndexingApiConfigured()) {
    return NextResponse.json(
      { error: "GOOGLE_INDEXING_KEY not configured" },
      { status: 503 },
    );
  }

  const staticUrls = PRIORITY_STATIC_URLS.map((p) => `${BASE}${p}`);

  const dynamicItems = await fetchDynamicUrls();
  const dynamicUrlList = buildDynamicUrls(dynamicItems, 50);

  const allUrls = [...staticUrls, ...dynamicUrlList];

  // Google allows 200/day; stay under limit
  const toSubmit = allUrls.slice(0, 190);

  const result = await submitUrlsToGoogle(toSubmit);

  return NextResponse.json({
    total: toSubmit.length,
    submitted: result.submitted.length,
    failed: result.failed.length,
    failedUrls: result.failed.slice(0, 10),
    firstError: result.firstError,
  });
}
