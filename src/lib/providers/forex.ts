interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: { regularMarketPrice: number };
    }> | null;
  };
}

export interface ForexRates {
  [pair: string]: number;
}

const CURRENCY_PAIRS: Record<string, { ticker: string; fallback: number }> = {
  EUR: { ticker: "EURUSD=X", fallback: 1.08 },
  GBP: { ticker: "GBPUSD=X", fallback: 1.27 },
  CHF: { ticker: "CHFUSD=X", fallback: 1.12 },
  JPY: { ticker: "JPY=X", fallback: 0.0067 },
  AUD: { ticker: "AUDUSD=X", fallback: 0.65 },
  CAD: { ticker: "CADUSD=X", fallback: 0.74 },
  CNY: { ticker: "CNYUSD=X", fallback: 0.14 },
  INR: { ticker: "INRUSD=X", fallback: 0.012 },
  MXN: { ticker: "MXNUSD=X", fallback: 0.058 },
  BRL: { ticker: "BRLUSD=X", fallback: 0.20 },
  TRY: { ticker: "TRYUSD=X", fallback: 0.031 },
  AED: { ticker: "AEDUSD=X", fallback: 0.272 },
  SAR: { ticker: "SARUSD=X", fallback: 0.267 },
};

let cachedRates: { rates: ForexRates; fetchedAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

async function fetchRate(ticker: string): Promise<number | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;
    const data: YahooChartResponse = await res.json();
    const rate = data.chart.result?.[0]?.meta?.regularMarketPrice;
    return rate && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

export async function getAllForexRates(): Promise<ForexRates> {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < CACHE_TTL) {
    return cachedRates.rates;
  }

  const entries = Object.entries(CURRENCY_PAIRS);
  const results = await Promise.all(
    entries.map(async ([currency, config]) => {
      const rate = await fetchRate(config.ticker);
      return [currency, rate ?? config.fallback] as [string, number];
    })
  );

  const rates: ForexRates = { USD: 1 };
  for (const [currency, rate] of results) {
    // For JPY=X, Yahoo returns USD/JPY (e.g., 150), so we need 1/rate
    if (currency === "JPY") {
      rates[currency] = 1 / rate;
    } else {
      rates[currency] = rate;
    }
  }

  cachedRates = { rates, fetchedAt: Date.now() };
  return rates;
}

export async function getEurUsdRate(): Promise<number> {
  const rates = await getAllForexRates();
  return rates.EUR ?? 1.08;
}

export function convertUsdTo(usd: number, targetCurrency: string, rates: ForexRates): number {
  if (targetCurrency === "USD") return usd;
  const rate = rates[targetCurrency];
  if (!rate) return usd;
  return usd / rate;
}
