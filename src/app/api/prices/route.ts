import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { metalPrices } from "@/lib/db/schema";
import { fetchAllSpotPrices as fetchFromGoldApi } from "@/lib/providers/gold-api";
import {
  fetchAllSpotPrices as fetchFromTwelveData,
  isConfigured as hasTwelveData,
} from "@/lib/providers/twelve-data";
import { MockProvider, METALS } from "@/lib/providers/metals";
import type { MetalSpot } from "@/lib/providers/metals";

export const dynamic = "force-dynamic";

const ALL_SYMBOLS = Object.keys(METALS);

function ensureAllMetals(
  prices: MetalSpot[],
  fallback: MetalSpot[]
): MetalSpot[] {
  const bySymbol = new Map(prices.map((p) => [p.symbol, p]));
  for (const fb of fallback) {
    if (!bySymbol.has(fb.symbol)) {
      bySymbol.set(fb.symbol, fb);
    }
  }
  return ALL_SYMBOLS
    .map((s) => bySymbol.get(s))
    .filter((p): p is MetalSpot => !!p);
}

export async function GET() {
  let dbPrices: MetalSpot[] = [];
  let dbSource = false;

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
          dbPrices = rows.map((r) => ({
            symbol: r.symbol,
            name: r.name,
            price: parseFloat(r.priceUsd),
            change: parseFloat(r.change24h ?? "0"),
            changePct: parseFloat(r.changePct24h ?? "0"),
            updatedAt: r.updatedAt.toISOString(),
          }));
          dbSource = true;
        }
      }
    } catch (err) {
      console.error("DB read failed:", err);
    }
  }

  if (dbSource && dbPrices.length >= 3) {
    return NextResponse.json({ source: "database", prices: dbPrices });
  }

  // 2. Try Gold API + merge with DB data
  const goldApiPrices = await fetchFromGoldApi();
  if (goldApiPrices && goldApiPrices.length > 0) {
    const merged = dbSource
      ? ensureAllMetals(dbPrices, goldApiPrices)
      : goldApiPrices;
    if (merged.length >= 3) {
      return NextResponse.json({
        source: dbSource ? "database+goldapi" : "goldapi",
        prices: merged,
      });
    }
  }

  // 3. Try Twelve Data + merge
  if (hasTwelveData()) {
    const tdPrices = await fetchFromTwelveData();
    if (tdPrices && tdPrices.length > 0) {
      const merged = ensureAllMetals(
        dbPrices.length > 0 ? dbPrices : tdPrices,
        tdPrices
      );
      if (merged.length >= 3) {
        return NextResponse.json({
          source: dbSource ? "database+twelvedata" : "twelvedata",
          prices: merged,
        });
      }
    }
  }

  // 4. Fallback: fill remaining with mock
  const mockPrices = await MockProvider.getSpotPrices();
  const merged = ensureAllMetals(
    dbPrices.length > 0 ? dbPrices : mockPrices,
    mockPrices
  );
  return NextResponse.json({
    source: dbSource ? "database+mock" : "mock",
    prices: merged,
  });
}
