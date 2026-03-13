import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { priceHistory } from "@/lib/db/schema";
import { desc, eq, and, gte } from "drizzle-orm";
import { fetchHistory as fetchFromGoldApi } from "@/lib/providers/gold-api";
import { fetchTimeSeries, isConfigured as hasTwelveData } from "@/lib/providers/twelve-data";
import { MockProvider, type MetalSymbol, type TimeRange } from "@/lib/providers/metals";

export const dynamic = "force-dynamic";

const VALID_SYMBOLS = ["XAU", "XAG", "XPT"];
const VALID_RANGES = ["1D", "1W", "1M", "1Y"];

const RANGE_LOOKBACK: Record<string, number> = {
  "1D": 24 * 60 * 60 * 1000,
  "1W": 7 * 24 * 60 * 60 * 1000,
  "1M": 31 * 24 * 60 * 60 * 1000,
  "1Y": 366 * 24 * 60 * 60 * 1000,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get("symbol") ?? "XAU";
  const range = searchParams.get("range") ?? "1D";

  if (!VALID_SYMBOLS.includes(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }
  if (!VALID_RANGES.includes(range)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  // 1. Try database
  const db = getDb();
  if (db) {
    try {
      const since = new Date(Date.now() - RANGE_LOOKBACK[range]);
      const rows = await db
        .select()
        .from(priceHistory)
        .where(
          and(eq(priceHistory.symbol, symbol), gte(priceHistory.timestamp, since))
        )
        .orderBy(desc(priceHistory.timestamp))
        .limit(200);

      if (rows.length >= 5) {
        const data = rows
          .reverse()
          .map((r) => ({
            timestamp: r.timestamp.toISOString(),
            price: parseFloat(r.priceUsd),
          }));

        const first = data[0].price;
        const last = data[data.length - 1].price;
        const change = +(last - first).toFixed(2);
        const changePct = +((change / first) * 100).toFixed(2);

        return NextResponse.json({
          source: "database",
          data,
          change,
          changePct,
        });
      }
    } catch (err) {
      console.error("DB history read failed:", err);
    }
  }

  // 2. Try Gold API (free, covers all metals)
  const goldApiResult = await fetchFromGoldApi(symbol, range as TimeRange);
  if (goldApiResult && goldApiResult.data.length > 0) {
    return NextResponse.json({ source: "goldapi", ...goldApiResult });
  }

  // 3. Try Twelve Data as fallback
  if (hasTwelveData()) {
    const result = await fetchTimeSeries(symbol, range as TimeRange);
    if (result) {
      return NextResponse.json({ source: "twelvedata", ...result });
    }
  }

  // 4. Fallback to mock
  const result = await MockProvider.getHistory(symbol as MetalSymbol, range as TimeRange);
  return NextResponse.json({ source: "mock", ...result });
}
