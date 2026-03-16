export interface MetalSpot {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  updatedAt: string;
}

export interface HistoryPoint {
  timestamp: string;
  price: number;
}

export interface HistoryResult {
  data: HistoryPoint[];
  change: number;
  changePct: number;
}

export type TimeRange = "1H" | "4H" | "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "2Y" | "5Y";

export const METALS = {
  XAU: { name: "Oro", base: 2342.5, vol: 18, color: "#D6B35A", unit: "oz" },
  XAG: { name: "Plata", base: 28.15, vol: 0.45, color: "#A7B0BE", unit: "oz" },
  XPT: { name: "Platino", base: 982.3, vol: 12, color: "#8B9DC3", unit: "oz" },
  XPD: { name: "Paladio", base: 1015.0, vol: 14, color: "#CED0CE", unit: "oz" },
  HG:  { name: "Cobre", base: 4.25, vol: 0.08, color: "#B87333", unit: "lb" },
} as const;

export type MetalSymbol = keyof typeof METALS;

function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateHistory(symbol: MetalSymbol, range: TimeRange): HistoryResult {
  const meta = METALS[symbol];
  const now = Date.now();
  const configs: Record<TimeRange, { points: number; interval: number; volMult: number }> = {
    "1H": { points: 60, interval: 60000, volMult: 0.1 },
    "4H": { points: 240, interval: 60000, volMult: 0.2 },
    "1D": { points: 48, interval: 30 * 60000, volMult: 0.3 },
    "1W": { points: 42, interval: 4 * 3600000, volMult: 0.6 },
    "1M": { points: 30, interval: 24 * 3600000, volMult: 1.0 },
    "3M": { points: 90, interval: 24 * 3600000, volMult: 1.5 },
    "6M": { points: 26, interval: 7 * 24 * 3600000, volMult: 2.0 },
    "1Y": { points: 52, interval: 7 * 24 * 3600000, volMult: 2.5 },
    "2Y": { points: 52, interval: 14 * 24 * 3600000, volMult: 3.5 },
    "5Y": { points: 60, interval: 30 * 24 * 3600000, volMult: 5.0 },
  };
  const cfg = configs[range];
  const rng = seededRandom(symbol.charCodeAt(0) * 100 + range.charCodeAt(0));
  let price = meta.base * (1 - (cfg.volMult * meta.vol) / meta.base / 2);
  const data: HistoryPoint[] = [];
  for (let i = 0; i < cfg.points; i++) {
    const t = now - (cfg.points - 1 - i) * cfg.interval;
    const change = (rng() - 0.48) * meta.vol * cfg.volMult * 0.15;
    price = Math.max(price * 0.9, price + change);
    data.push({
      timestamp: new Date(t).toISOString(),
      price: +price.toFixed(2),
    });
  }
  const last = data[data.length - 1].price;
  const first = data[0].price;
  const diff = +(last - first).toFixed(2);
  return { data, change: diff, changePct: +((diff / first) * 100).toFixed(2) };
}

export const MockProvider = {
  async getSpotPrices(): Promise<MetalSpot[]> {
    const now = new Date().toISOString();
    return (Object.entries(METALS) as [MetalSymbol, (typeof METALS)[MetalSymbol]][]).map(
      ([symbol, m]) => {
        const dayHist = generateHistory(symbol, "1D");
        const last = dayHist.data[dayHist.data.length - 1].price;
        return {
          symbol,
          name: m.name,
          price: last,
          change: dayHist.change,
          changePct: dayHist.changePct,
          updatedAt: now,
        };
      }
    );
  },
  async getHistory(
    symbol: MetalSymbol,
    range: TimeRange
  ): Promise<HistoryResult> {
    return generateHistory(symbol, range);
  },
};
