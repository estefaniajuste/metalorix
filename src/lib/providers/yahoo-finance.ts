import type { MetalSpot } from "./metals";

const SYMBOLS: Record<string, { ticker: string; name: string }> = {
  XAU: { ticker: "GC=F", name: "Oro" },
  XAG: { ticker: "SI=F", name: "Plata" },
  XPT: { ticker: "PL=F", name: "Platino" },
};

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        chartPreviousClose: number;
      };
    }> | null;
    error: unknown;
  };
}

async function fetchTicker(ticker: string): Promise<{ price: number; prevClose: number } | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Metalorix/1.0)" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data: YahooChartResponse = await res.json();
    const meta = data.chart.result?.[0]?.meta;
    if (!meta) return null;
    return { price: meta.regularMarketPrice, prevClose: meta.chartPreviousClose };
  } catch {
    return null;
  }
}

export async function fetchAllSpotPrices(): Promise<MetalSpot[] | null> {
  const keys = Object.keys(SYMBOLS);
  const results = await Promise.all(
    keys.map(async (symbol) => {
      const cfg = SYMBOLS[symbol];
      const data = await fetchTicker(cfg.ticker);
      if (!data) return null;

      const change = +(data.price - data.prevClose).toFixed(4);
      const changePct = data.prevClose !== 0
        ? +((change / data.prevClose) * 100).toFixed(4)
        : 0;

      return {
        symbol,
        name: cfg.name,
        price: data.price,
        change,
        changePct,
        updatedAt: new Date().toISOString(),
      } satisfies MetalSpot;
    })
  );

  const valid = results.filter((r): r is MetalSpot => r !== null);
  return valid.length > 0 ? valid : null;
}
