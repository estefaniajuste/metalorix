import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { priceHistory } from "@/lib/db/schema";
import { desc, eq, and, gte } from "drizzle-orm";
import { fetchHistory as fetchFromGoldApi } from "@/lib/providers/gold-api";
import { fetchTimeSeries, isConfigured as hasTwelveData } from "@/lib/providers/twelve-data";
import { MockProvider, type MetalSymbol, type TimeRange } from "@/lib/providers/metals";

export const dynamic = "force-dynamic";

const VALID_SYMBOLS = ["XAU", "XAG", "XPT", "XPD", "HG"];
const VALID_RANGES = ["1D", "1W", "1M", "3M", "6M", "1Y", "2Y", "5Y"];

const RANGE_LOOKBACK: Record<string, number> = {
  "1D": 24 * 60 * 60 * 1000,
  "1W": 7 * 24 * 60 * 60 * 1000,
  "1M": 31 * 24 * 60 * 60 * 1000,
  "3M": 93 * 24 * 60 * 60 * 1000,
  "6M": 183 * 24 * 60 * 60 * 1000,
  "1Y": 366 * 24 * 60 * 60 * 1000,
  "2Y": 731 * 24 * 60 * 60 * 1000,
  "5Y": 1827 * 24 * 60 * 60 * 1000,
};

interface YahooChartResponse {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: {
        quote: Array<{ close: (number | null)[] }>;
      };
    }> | null;
  };
}

const YAHOO_TICKERS: Record<string, string> = {
  XAU: "GC=F",
  XAG: "SI=F",
  XPT: "PL=F",
  XPD: "PA=F",
  HG:  "HG=F",
};

const YAHOO_RANGE_MAP: Record<string, { range: string; interval: string }> = {
  "1D": { range: "1d", interval: "5m" },
  "1W": { range: "5d", interval: "15m" },
  "1M": { range: "1mo", interval: "1d" },
  "3M": { range: "3mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1wk" },
  "2Y": { range: "2y", interval: "1wk" },
  "5Y": { range: "5y", interval: "1mo" },
};

async function fetchYahooHistory(
  symbol: string,
  range: string
): Promise<{ data: Array<{ timestamp: string; price: number }>; change: number; changePct: number } | null> {
  const ticker = YAHOO_TICKERS[symbol];
  const config = YAHOO_RANGE_MAP[range];
  if (!ticker || !config) return null;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${config.range}&interval=${config.interval}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;

    const json: YahooChartResponse = await res.json();
    const result = json.chart.result?.[0];
    if (!result) return null;

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    const data: Array<{ timestamp: string; price: number }> = [];

    for (let i = 0; i < timestamps.length; i++) {
      if (closes[i] != null) {
        data.push({
          timestamp: new Date(timestamps[i] * 1000).toISOString(),
          price: closes[i]!,
        });
      }
    }

    if (data.length < 2) return null;

    const first = data[0].price;
    const last = data[data.length - 1].price;
    const change = +(last - first).toFixed(2);
    const changePct = +((change / first) * 100).toFixed(2);

    return { data, change, changePct };
  } catch (err) {
    console.error(`Yahoo history fetch failed for ${symbol}:`, err);
    return null;
  }
}

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

  // 1. Try database for short ranges
  const db = getDb();
  if (db && ["1D", "1W", "1M"].includes(range)) {
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

  // 2. Try Yahoo Finance (free, supports long history)
  const yahooResult = await fetchYahooHistory(symbol, range);
  if (yahooResult && yahooResult.data.length > 0) {
    return NextResponse.json({ source: "yahoo", ...yahooResult });
  }

  // 3. Try Gold API
  if (["1D", "1W", "1M", "1Y"].includes(range)) {
    const goldApiResult = await fetchFromGoldApi(symbol, range as TimeRange);
    if (goldApiResult && goldApiResult.data.length > 0) {
      return NextResponse.json({ source: "goldapi", ...goldApiResult });
    }
  }

  // 4. Try Twelve Data as fallback
  if (hasTwelveData() && ["1D", "1W", "1M", "1Y"].includes(range)) {
    const result = await fetchTimeSeries(symbol, range as TimeRange);
    if (result) {
      return NextResponse.json({ source: "twelvedata", ...result });
    }
  }

  // 5. Fallback to mock (only for original ranges)
  if (["1D", "1W", "1M", "1Y"].includes(range)) {
    const result = await MockProvider.getHistory(symbol as MetalSymbol, range as TimeRange);
    return NextResponse.json({ source: "mock", ...result });
  }

  return NextResponse.json({ source: "empty", data: [], change: 0, changePct: 0 });
}
