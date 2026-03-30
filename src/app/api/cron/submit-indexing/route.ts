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

const CLUSTER_SLUG_I18N: Record<string, Record<string, string>> = {
  es: { fundamentals: "fundamentos", history: "historia", "markets-trading": "mercados-trading", investment: "inversion", "physical-metals": "metales-fisicos", "price-factors": "factores-precio", "production-industry": "produccion-industria", "geology-science": "geologia-ciencia", "regulation-tax": "regulacion-impuestos", "security-authenticity": "seguridad-autenticidad", "ratios-analytics": "ratios-analitica", macroeconomics: "macroeconomia", guides: "guias", "faq-mistakes": "preguntas-errores", comparisons: "comparativas", glossary: "glosario" },
};

const GLOSSARY_CLUSTER: Record<string, string> = {
  es: "glosario", en: "glossary",
};

interface DynamicUrl {
  slug: string;
  type: string;
  cluster?: string;
  lastmod?: string;
  localizedSlugs?: Record<string, string>;
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

  const articleItems = items
    .filter((i) => i.type === "article")
    .slice(0, maxPerType);
  for (const a of articleItems) {
    for (const loc of locales) {
      const slug = a.localizedSlugs?.[loc] ?? a.slug;
      urls.push(`${BASE}/${loc}/${NEWS_BASE[loc]}/${slug}`);
    }
  }

  const clusters = items
    .filter((i) => i.type === "cluster")
    .slice(0, maxPerType);
  for (const c of clusters) {
    for (const loc of locales) {
      const cSlug = CLUSTER_SLUG_I18N[loc]?.[c.slug] ?? c.slug;
      urls.push(`${BASE}/${loc}/${LEARN_BASE[loc]}/${cSlug}`);
    }
  }

  const learnArticleItems = items
    .filter((i) => i.type === "learn-article" && i.cluster)
    .slice(0, maxPerType);
  for (const la of learnArticleItems) {
    for (const loc of locales) {
      const aSlug = la.localizedSlugs?.[loc] ?? la.slug;
      const cSlug = CLUSTER_SLUG_I18N[loc]?.[la.cluster!] ?? la.cluster;
      urls.push(`${BASE}/${loc}/${LEARN_BASE[loc]}/${cSlug}/${aSlug}`);
    }
  }

  const glossaryItems = items
    .filter((i) => i.type === "glossary")
    .slice(0, maxPerType);
  for (const g of glossaryItems) {
    for (const loc of locales) {
      urls.push(`${BASE}/${loc}/${LEARN_BASE[loc]}/${GLOSSARY_CLUSTER[loc] ?? "glossary"}/${g.slug}`);
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
  const dynamicUrlList = buildDynamicUrls(dynamicItems, 2000);

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
