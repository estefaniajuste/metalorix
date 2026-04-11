import { clamp, type FactorScore, type Timeframe } from "./types";

export function calculateMomentumScore(
  prices: number[],
  timestamps: string[],
  change24h: number,
  timeframe: Timeframe
): FactorScore {
  if (prices.length < 5) {
    return { score: 0, details: { velocity24h: 0, volatility: "no_data", trend: "no_data" } };
  }

  const n = prices.length;
  const lastPrice = prices[n - 1];

  // --- Velocity ---
  let velocityScore: number;
  if (timeframe === "short") {
    // Short-term: 24h and 48h price velocity
    const pct24h = change24h;
    const price48hAgo = n > 8 ? prices[n - 9] : prices[0];
    const pct48h = ((lastPrice - price48hAgo) / price48hAgo) * 100;
    const avgVelocity = (pct24h * 0.6 + pct48h * 0.4);
    velocityScore = clamp(avgVelocity * 15, -80, 80);
  } else {
    // Long-term: 30-day trend slope
    const lookback = Math.min(n, 200);
    const startPrice = prices[n - lookback];
    const pctChange = ((lastPrice - startPrice) / startPrice) * 100;
    velocityScore = clamp(pctChange * 3, -80, 80);
  }

  // --- Volatility ---
  const volWindow = timeframe === "short" ? Math.min(n, 48) : Math.min(n, 200);
  const volPrices = prices.slice(-volWindow);
  const avg = volPrices.reduce((a, b) => a + b, 0) / volPrices.length;
  const variance = volPrices.reduce((s, p) => s + (p - avg) ** 2, 0) / volPrices.length;
  const cvPct = (Math.sqrt(variance) / avg) * 100;

  let volLabel: string;
  let volScore: number;
  if (cvPct < 0.5) { volLabel = "very_low"; volScore = 10; }
  else if (cvPct < 1.5) { volLabel = "low"; volScore = 5; }
  else if (cvPct < 3) { volLabel = "moderate"; volScore = 0; }
  else if (cvPct < 5) { volLabel = "high"; volScore = -10; }
  else { volLabel = "extreme"; volScore = -25; }

  // --- Trend consistency ---
  const windowSize = timeframe === "short" ? Math.min(n, 20) : Math.min(n, 60);
  const recentPrices = prices.slice(-windowSize);
  let upMoves = 0;
  let downMoves = 0;
  for (let i = 1; i < recentPrices.length; i++) {
    if (recentPrices[i] > recentPrices[i - 1]) upMoves++;
    else if (recentPrices[i] < recentPrices[i - 1]) downMoves++;
  }
  const totalMoves = upMoves + downMoves || 1;
  const trendRatio = (upMoves - downMoves) / totalMoves;
  const trendScore = clamp(trendRatio * 50, -40, 40);

  let trendLabel: string;
  if (trendRatio > 0.3) trendLabel = "strong_uptrend";
  else if (trendRatio > 0.1) trendLabel = "uptrend";
  else if (trendRatio > -0.1) trendLabel = "sideways";
  else if (trendRatio > -0.3) trendLabel = "downtrend";
  else trendLabel = "strong_downtrend";

  const composite = clamp(
    velocityScore * 0.45 + volScore * 0.2 + trendScore * 0.35
  );

  return {
    score: Math.round(composite),
    details: {
      velocity24h: Math.round(change24h * 100) / 100,
      volatility: volLabel,
      volatilityPct: Math.round(cvPct * 100) / 100,
      trend: trendLabel,
    },
  };
}
