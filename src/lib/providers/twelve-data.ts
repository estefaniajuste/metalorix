import type { MetalSpot, HistoryPoint, HistoryResult, TimeRange } from "./metals";

const BASE_URL = "https://api.twelvedata.com";

const SYMBOL_MAP: Record<string, { apiSymbol: string; name: string }> = {
  XAU: { apiSymbol: "XAU/USD", name: "Oro" },
  XAG: { apiSymbol: "XAG/USD", name: "Plata" },
  XPT: { apiSymbol: "XPT/USD", name: "Platino" },
};

const RANGE_CONFIG: Record<TimeRange, { interval: string; outputsize: number }> = {
  "1D": { interval: "30min", outputsize: 48 },
  "1W": { interval: "4h", outputsize: 42 },
  "1M": { interval: "1day", outputsize: 30 },
  "3M": { interval: "1day", outputsize: 90 },
  "6M": { interval: "1day", outputsize: 130 },
  "1Y": { interval: "1week", outputsize: 52 },
  "2Y": { interval: "1week", outputsize: 104 },
  "5Y": { interval: "1month", outputsize: 60 },
};

function getApiKey(): string | null {
  return process.env.TWELVE_DATA_API_KEY || null;
}

interface TwelveDataPriceResponse {
  price: string;
}

interface TwelveDataTimeSeriesResponse {
  meta: { symbol: string };
  values: Array<{
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
  }>;
  status: string;
  message?: string;
}

export async function fetchSpotPrice(symbol: string): Promise<number | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const mapping = SYMBOL_MAP[symbol];
  if (!mapping) return null;

  try {
    const res = await fetch(
      `${BASE_URL}/price?symbol=${mapping.apiSymbol}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data: TwelveDataPriceResponse = await res.json();
    const price = parseFloat(data.price);
    return isNaN(price) ? null : price;
  } catch (err) {
    console.error(`Twelve Data price fetch failed for ${symbol}:`, err);
    return null;
  }
}

export async function fetchAllSpotPrices(): Promise<MetalSpot[] | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const symbols = Object.keys(SYMBOL_MAP);
  const apiSymbols = symbols.map((s) => SYMBOL_MAP[s].apiSymbol).join(",");

  try {
    const res = await fetch(
      `${BASE_URL}/price?symbol=${apiSymbols}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();

    const now = new Date().toISOString();
    const results: MetalSpot[] = [];

    for (const symbol of symbols) {
      const mapping = SYMBOL_MAP[symbol];
      const priceData = data[mapping.apiSymbol] ?? data;
      const price = parseFloat(priceData.price);
      if (isNaN(price)) continue;

      results.push({
        symbol,
        name: mapping.name,
        price,
        change: 0,
        changePct: 0,
        updatedAt: now,
      });
    }

    return results.length > 0 ? results : null;
  } catch (err) {
    console.error("Twelve Data batch price fetch failed:", err);
    return null;
  }
}

export async function fetchTimeSeries(
  symbol: string,
  range: TimeRange
): Promise<HistoryResult | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const mapping = SYMBOL_MAP[symbol];
  if (!mapping) return null;

  const cfg = RANGE_CONFIG[range];

  try {
    const res = await fetch(
      `${BASE_URL}/time_series?symbol=${mapping.apiSymbol}&interval=${cfg.interval}&outputsize=${cfg.outputsize}&apikey=${apiKey}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const raw: TwelveDataTimeSeriesResponse = await res.json();

    if (raw.status === "error" || !raw.values?.length) return null;

    const data: HistoryPoint[] = raw.values
      .map((v) => ({
        timestamp: new Date(v.datetime).toISOString(),
        price: parseFloat(v.close),
      }))
      .reverse();

    const first = data[0].price;
    const last = data[data.length - 1].price;
    const change = +(last - first).toFixed(2);
    const changePct = +((change / first) * 100).toFixed(2);

    return { data, change, changePct };
  } catch (err) {
    console.error(`Twelve Data time series failed for ${symbol}/${range}:`, err);
    return null;
  }
}

export function isConfigured(): boolean {
  return !!getApiKey();
}
