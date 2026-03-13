import type { MetalSpot, HistoryPoint, HistoryResult, TimeRange } from "./metals";

const BASE_URL = "https://api.gold-api.com";

const SYMBOLS = ["XAU", "XAG", "XPT"] as const;

const NAMES: Record<string, string> = {
  XAU: "Oro",
  XAG: "Plata",
  XPT: "Platino",
};

interface GoldApiPriceResponse {
  name: string;
  price: number;
  symbol: string;
  updatedAt: string;
}

interface GoldApiHistoryResponse {
  symbol: string;
  history: Array<{
    date: string;
    price: number;
  }>;
}

export async function fetchAllSpotPrices(): Promise<MetalSpot[] | null> {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const res = await fetch(`${BASE_URL}/price/${symbol}`, {
          next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const data: GoldApiPriceResponse = await res.json();
        return {
          symbol: data.symbol,
          name: NAMES[data.symbol] ?? data.name,
          price: data.price,
          change: 0,
          changePct: 0,
          updatedAt: data.updatedAt,
        };
      })
    );

    const valid = results.filter((r): r is MetalSpot => r !== null);
    return valid.length > 0 ? valid : null;
  } catch (err) {
    console.error("Gold API fetch failed:", err);
    return null;
  }
}

export async function fetchSpotPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/price/${symbol}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: GoldApiPriceResponse = await res.json();
    return data.price;
  } catch {
    return null;
  }
}

// History endpoint requires paid plan — returns null to let other providers handle it
export async function fetchHistory(
  _symbol: string,
  _range: TimeRange
): Promise<HistoryResult | null> {
  return null;
}
