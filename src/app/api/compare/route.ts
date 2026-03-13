import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

const TICKERS: Record<string, string> = {
  XAU: "GC=F",
  XAG: "SI=F",
  XPT: "PL=F",
};

const RANGE_MAP: Record<string, string> = {
  "1m": "1mo",
  "3m": "3mo",
  "6m": "6mo",
  "1y": "1y",
  "2y": "2y",
  "5y": "5y",
  "10y": "10y",
  max: "max",
};

const INTERVAL_MAP: Record<string, string> = {
  "1m": "1d",
  "3m": "1d",
  "6m": "1d",
  "1y": "1wk",
  "2y": "1wk",
  "5y": "1mo",
  "10y": "1mo",
  max: "1mo",
};

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") || "1y";
  const yahooRange = RANGE_MAP[range] || "1y";
  const interval = INTERVAL_MAP[range] || "1wk";

  try {
    const symbols = Object.entries(TICKERS);
    const results = await Promise.all(
      symbols.map(async ([symbol, ticker]) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${yahooRange}&interval=${interval}`;
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!res.ok) return { symbol, data: [] };

        const json: YahooChartResponse = await res.json();
        const result = json.chart.result?.[0];
        if (!result) return { symbol, data: [] };

        const timestamps = result.timestamp;
        const closes = result.indicators.quote[0].close;

        const data: Array<{ t: number; p: number }> = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (closes[i] != null) {
            data.push({ t: timestamps[i] * 1000, p: closes[i]! });
          }
        }
        return { symbol, data };
      })
    );

    const series: Record<string, Array<{ t: number; p: number }>> = {};
    for (const r of results) {
      series[r.symbol] = r.data;
    }

    return NextResponse.json({ series, range });
  } catch (err) {
    console.error("Compare API error:", err);
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
