interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: { regularMarketPrice: number };
    }> | null;
  };
}

let cachedRate: { rate: number; fetchedAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 min

export async function getEurUsdRate(): Promise<number> {
  if (cachedRate && Date.now() - cachedRate.fetchedAt < CACHE_TTL) {
    return cachedRate.rate;
  }

  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/EURUSD=X?interval=1d&range=1d";
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`Yahoo forex: ${res.status}`);

    const data: YahooChartResponse = await res.json();
    const rate = data.chart.result?.[0]?.meta?.regularMarketPrice;

    if (!rate || rate <= 0) throw new Error("Invalid rate");

    cachedRate = { rate, fetchedAt: Date.now() };
    return rate;
  } catch (err) {
    console.error("Failed to fetch EUR/USD rate:", err);
    return cachedRate?.rate ?? 1.08;
  }
}
