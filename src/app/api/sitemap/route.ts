import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://metalorix.com";
const LOCALES = ["es", "en", "zh", "ar", "tr", "de"] as const;
const DEFAULT_LOCALE = "en";

const PATHNAMES: Record<string, Record<string, string>> = {
  "/": { es: "/es", en: "/en", zh: "/zh", ar: "/ar", tr: "/tr", de: "/de" },
  "/herramientas": { es: "/es/herramientas", en: "/en/tools", de: "/de/werkzeuge", zh: "/zh/gongju", ar: "/ar/adawat", tr: "/tr/araclar" },
  "/calculadora-rentabilidad": { es: "/es/calculadora-rentabilidad", en: "/en/roi-calculator", de: "/de/renditerechner", zh: "/zh/shouyi-jisuan", ar: "/ar/hasibat-alarabah", tr: "/tr/getiri-hesaplayici" },
  "/conversor-divisas": { es: "/es/conversor-divisas", en: "/en/currency-converter", de: "/de/waehrungsrechner", zh: "/zh/huobi-zhuanhua", ar: "/ar/muhawwil-alumlat", tr: "/tr/doviz-cevirici" },
  "/comparador": { es: "/es/comparador", en: "/en/comparator", de: "/de/vergleich", zh: "/zh/bijiao", ar: "/ar/muqarin", tr: "/tr/karsilastirma" },
  "/ratio-oro-plata": { es: "/es/ratio-oro-plata", en: "/en/gold-silver-ratio", de: "/de/gold-silber-verhaeltnis", zh: "/zh/jin-yin-bi", ar: "/ar/nisbat-althahab-alfiddah", tr: "/tr/altin-gumus-orani" },
  "/calendario-economico": { es: "/es/calendario-economico", en: "/en/economic-calendar", de: "/de/wirtschaftskalender", zh: "/zh/jingji-rili", ar: "/ar/altaqwim-aliqtisadi", tr: "/tr/ekonomik-takvim" },
  "/guia-inversion": { es: "/es/guia-inversion", en: "/en/investment-guide", de: "/de/investitionsleitfaden", zh: "/zh/touzi-zhinan", ar: "/ar/dalil-alistithmar", tr: "/tr/yatirim-rehberi" },
  "/productos": { es: "/es/productos", en: "/en/products", de: "/de/produkte", zh: "/zh/chanpin", ar: "/ar/muntajat", tr: "/tr/urunler" },
  "/noticias": { es: "/es/noticias", en: "/en/news", de: "/de/nachrichten", zh: "/zh/xinwen", ar: "/ar/akhbar", tr: "/tr/haberler" },
  "/learn": { es: "/es/aprende-inversion", en: "/en/learn", de: "/de/lernen-investition", zh: "/zh/xuexi", ar: "/ar/taallam", tr: "/tr/ogren-yatirim" },
  "/alertas": { es: "/es/alertas", en: "/en/alerts", de: "/de/benachrichtigungen", zh: "/zh/jingbao", ar: "/ar/tanbihat", tr: "/tr/uyarilar" },
  "/precio-oro-hoy": { es: "/es/precio-oro-hoy", en: "/en/gold-price-today", de: "/de/goldpreis-heute", zh: "/zh/jin-ri-jin-jia", ar: "/ar/sier-althahab-alyawm", tr: "/tr/altin-fiyati-bugun" },
  "/precio-gramo-oro": { es: "/es/precio-gramo-oro", en: "/en/gold-price-per-gram", de: "/de/goldpreis-pro-gramm", zh: "/zh/mei-ke-jin-jia", ar: "/ar/sier-ghram-althahab", tr: "/tr/gram-altin-fiyati" },
  "/aviso-legal": { es: "/es/aviso-legal", en: "/en/legal-notice", de: "/de/impressum", zh: "/zh/falv-shengming", ar: "/ar/ishaar-qanuni", tr: "/tr/yasal-uyari" },
  "/terminos": { es: "/es/terminos", en: "/en/terms", de: "/de/agb", zh: "/zh/tiaokuan", ar: "/ar/shurut", tr: "/tr/sartlar" },
  "/privacidad": { es: "/es/privacidad", en: "/en/privacy", de: "/de/datenschutz", zh: "/zh/yinsi", ar: "/ar/khususiyah", tr: "/tr/gizlilik" },
};

const METAL_SLUGS: Record<string, Record<string, string>> = {
  oro: { es: "oro", en: "gold", de: "gold", zh: "gold", ar: "gold", tr: "altin" },
  plata: { es: "plata", en: "silver", de: "silber", zh: "silver", ar: "silver", tr: "gumus" },
  platino: { es: "platino", en: "platinum", de: "platin", zh: "platinum", ar: "platinum", tr: "platin" },
  paladio: { es: "paladio", en: "palladium", de: "palladium", zh: "palladium", ar: "palladium", tr: "paladyum" },
  cobre: { es: "cobre", en: "copper", de: "kupfer", zh: "copper", ar: "copper", tr: "bakir" },
};

const PRICE_PATHS: Record<string, string> = {
  es: "precio", en: "price", de: "preis", zh: "jiage", ar: "sier", tr: "fiyat",
};

const FREQ_PRIO: Record<string, [string, number]> = {
  "/herramientas": ["weekly", 0.8],
  "/calculadora-rentabilidad": ["monthly", 0.7],
  "/conversor-divisas": ["monthly", 0.7],
  "/comparador": ["monthly", 0.7],
  "/ratio-oro-plata": ["daily", 0.8],
  "/calendario-economico": ["weekly", 0.7],
  "/guia-inversion": ["monthly", 0.7],
  "/productos": ["monthly", 0.7],
  "/noticias": ["daily", 0.9],
  "/learn": ["weekly", 0.7],
  "/alertas": ["monthly", 0.5],
  "/precio-oro-hoy": ["daily", 0.9],
  "/precio-gramo-oro": ["daily", 0.8],
  "/aviso-legal": ["yearly", 0.3],
  "/terminos": ["yearly", 0.3],
  "/privacidad": ["yearly", 0.3],
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(
  paths: Record<string, string>,
  changefreq: string,
  priority: number,
  lastmod?: string,
): string {
  const defaultUrl = `${BASE}${paths[DEFAULT_LOCALE]}`;
  const mod = lastmod || new Date().toISOString().split("T")[0];

  const xhtmlLinks = LOCALES.map(
    (loc) =>
      `    <xhtml:link rel="alternate" hreflang="${loc}" href="${esc(`${BASE}${paths[loc]}`)}" />`
  ).join("\n");

  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(defaultUrl)}" />`;

  return `  <url>
    <loc>${esc(defaultUrl)}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${xhtmlLinks}
${xDefault}
  </url>`;
}

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const urls: string[] = [];

    urls.push(urlEntry(PATHNAMES["/"], "daily", 1.0, today));

    for (const [key, [freq, prio]] of Object.entries(FREQ_PRIO)) {
      if (PATHNAMES[key]) {
        urls.push(urlEntry(PATHNAMES[key], freq, prio, today));
      }
    }

    for (const [, slugsByLocale] of Object.entries(METAL_SLUGS)) {
      const paths: Record<string, string> = {};
      for (const loc of LOCALES) {
        paths[loc] = `/${loc}/${PRICE_PATHS[loc]}/${slugsByLocale[loc]}`;
      }
      urls.push(urlEntry(paths, "daily", 0.9, today));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.stack || err.message : String(err);
    return NextResponse.json({ error: "sitemap failed", details: message }, { status: 500 });
  }
}
