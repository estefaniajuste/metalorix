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
  XPD: "PA=F",
  HG:  "HG=F",
};

export async function getHistoricalPrice(
  symbol: string,
  dateStr: string
): Promise<number | null> {
  const ticker = TICKERS[symbol];
  if (!ticker) return null;

  const target = new Date(dateStr);
  const from = Math.floor(target.getTime() / 1000) - 86400 * 5;
  const to = Math.floor(target.getTime() / 1000) + 86400 * 5;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${from}&period2=${to}&interval=1d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) return null;

    const data: YahooChartResponse = await res.json();
    const result = data.chart.result?.[0];
    if (!result) return null;

    const closes = result.indicators.quote[0].close;
    const timestamps = result.timestamp;

    // Find the closest valid close price to target date
    const targetTs = target.getTime() / 1000;
    let bestIdx = 0;
    let bestDiff = Infinity;

    for (let i = 0; i < timestamps.length; i++) {
      const diff = Math.abs(timestamps[i] - targetTs);
      if (diff < bestDiff && closes[i] != null) {
        bestDiff = diff;
        bestIdx = i;
      }
    }

    return closes[bestIdx] ?? null;
  } catch (err) {
    console.error(`Historical price fetch failed for ${symbol}:`, err);
    return null;
  }
}

export interface RoiResult {
  symbol: string;
  metalName: string;
  investmentDate: string;
  investmentAmount: number;
  priceAtInvestment: number;
  currentPrice: number;
  ouncesOwned: number;
  currentValue: number;
  profit: number;
  profitPct: number;
  annualizedReturn: number;
  yearsHeld: number;
}

const METAL_NAMES: Record<string, string> = {
  XAU: "Oro",
  XAG: "Plata",
  XPT: "Platino",
  XPD: "Paladio",
  HG: "Cobre",
};

export function calculateRoi(
  priceAtInvestment: number,
  currentPrice: number,
  investmentAmount: number,
  investmentDate: string,
  symbol: string
): RoiResult {
  const ouncesOwned = investmentAmount / priceAtInvestment;
  const currentValue = ouncesOwned * currentPrice;
  const profit = currentValue - investmentAmount;
  const profitPct = (profit / investmentAmount) * 100;

  const daysDiff =
    (Date.now() - new Date(investmentDate).getTime()) / (1000 * 60 * 60 * 24);
  const yearsHeld = daysDiff / 365.25;
  const annualizedReturn =
    yearsHeld > 0
      ? (Math.pow(currentValue / investmentAmount, 1 / yearsHeld) - 1) * 100
      : 0;

  return {
    symbol,
    metalName: METAL_NAMES[symbol] ?? symbol,
    investmentDate,
    investmentAmount,
    priceAtInvestment,
    currentPrice,
    ouncesOwned,
    currentValue,
    profit,
    profitPct,
    annualizedReturn,
    yearsHeld,
  };
}
