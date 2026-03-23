import { NextRequest, NextResponse } from "next/server";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo/ping";

const LOCALES = ["es", "en", "zh", "ar", "tr", "de", "hi"] as const;
const BASE = "https://metalorix.com";

const METAL_SLUGS: Record<string, Record<string, string>> = {
  oro: { es: "oro", en: "gold", de: "gold", zh: "huangjin", ar: "dhahab", tr: "altin", hi: "sona" },
  plata: { es: "plata", en: "silver", de: "silber", zh: "baiyin", ar: "fiddah", tr: "gumus", hi: "chandi" },
  platino: { es: "platino", en: "platinum", de: "platin", zh: "bojin", ar: "blatiin", tr: "platin", hi: "platinam" },
  paladio: { es: "paladio", en: "palladium", de: "palladium", zh: "bajin", ar: "baladiyum", tr: "paladyum", hi: "palladium" },
  cobre: { es: "cobre", en: "copper", de: "kupfer", zh: "tong", ar: "nuhas", tr: "bakir", hi: "tamba" },
};

const PRICE_PATHS: Record<string, string> = {
  es: "precio", en: "price", de: "preis", zh: "jiage", ar: "sier", tr: "fiyat", hi: "mulya",
};

function buildCriticalUrls(): string[] {
  const urls: string[] = [];

  for (const loc of LOCALES) {
    urls.push(`${BASE}/${loc}`);
  }

  for (const [, slugs] of Object.entries(METAL_SLUGS)) {
    for (const loc of LOCALES) {
      const pricePath = PRICE_PATHS[loc];
      const metalSlug = slugs[loc];
      if (pricePath && metalSlug) {
        urls.push(`${BASE}/${loc}/${pricePath}/${metalSlug}`);
      }
    }
  }

  return urls;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")?.trim();
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sitemapPing = await pingSearchEngines();

  const criticalUrls = buildCriticalUrls();
  const indexNowOk = await pingIndexNow(criticalUrls);

  return NextResponse.json({
    sitemap: sitemapPing,
    indexNow: { sent: indexNowOk, urlCount: criticalUrls.length },
    timestamp: new Date().toISOString(),
  });
}
