import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { metalPrices } from "@/lib/db/schema";
import { fetchAllSpotPrices as fetchFromGoldApi } from "@/lib/providers/gold-api";
import { fetchAllSpotPrices as fetchFromTwelveData, isConfigured as hasTwelveData } from "@/lib/providers/twelve-data";
import { MockProvider } from "@/lib/providers/metals";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Try database (fresh data from cron)
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(metalPrices);
      if (rows.length > 0) {
        const fifteenMinAgo = Date.now() - 15 * 60 * 1000;
        const freshest = rows.reduce((a, b) =>
          new Date(b.updatedAt) > new Date(a.updatedAt) ? b : a
        );
        if (new Date(freshest.updatedAt).getTime() > fifteenMinAgo) {
          const prices = rows.map((r) => ({
            symbol: r.symbol,
            name: r.name,
            price: parseFloat(r.priceUsd),
            change: parseFloat(r.change24h ?? "0"),
            changePct: parseFloat(r.changePct24h ?? "0"),
            updatedAt: r.updatedAt.toISOString(),
          }));
          return NextResponse.json({ source: "database", prices });
        }
      }
    } catch (err) {
      console.error("DB read failed:", err);
    }
  }

  // 2. Try Gold API (free, no key needed, covers XAU/XAG/XPT)
  const goldApiPrices = await fetchFromGoldApi();
  if (goldApiPrices && goldApiPrices.length === 3) {
    return NextResponse.json({ source: "goldapi", prices: goldApiPrices });
  }

  // 3. Try Twelve Data as fallback
  if (hasTwelveData()) {
    const prices = await fetchFromTwelveData();
    if (prices) {
      return NextResponse.json({ source: "twelvedata", prices });
    }
  }

  // 4. Fallback to mock
  const prices = await MockProvider.getSpotPrices();
  return NextResponse.json({ source: "mock", prices });
}
