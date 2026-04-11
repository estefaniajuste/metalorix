import {
  calculateRSI,
  calculateMACD,
  calculateBollinger,
  pickMacdPeriods,
  pickBollingerPeriod,
} from "@/lib/utils/indicators";
import { clamp, type FactorScore, type Timeframe } from "./types";

function sma(prices: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / period);
  }
  return result;
}

function rsiScore(rsi: number): number {
  if (rsi < 25) return 80;
  if (rsi < 30) return 60;
  if (rsi < 40) return 30;
  if (rsi < 45) return 15;
  if (rsi <= 55) return 0;
  if (rsi <= 60) return -15;
  if (rsi <= 70) return -30;
  if (rsi <= 75) return -60;
  return -80;
}

function macdScore(histogram: number[], macd: number[], signal: number[]): { score: number; state: string } {
  if (histogram.length === 0) return { score: 0, state: "no_data" };

  const last = histogram[histogram.length - 1];
  const prev = histogram.length > 1 ? histogram[histogram.length - 2] : 0;

  const crossover = prev <= 0 && last > 0;
  const crossunder = prev >= 0 && last < 0;

  if (crossover) return { score: 60, state: "bullish_crossover" };
  if (crossunder) return { score: -60, state: "bearish_crossover" };

  const expanding = Math.abs(last) > Math.abs(prev);
  if (last > 0 && expanding) return { score: 40, state: "bullish_expanding" };
  if (last > 0) return { score: 20, state: "bullish_contracting" };
  if (last < 0 && expanding) return { score: -40, state: "bearish_expanding" };
  return { score: -20, state: "bearish_contracting" };
}

function bollingerScore(
  prices: number[],
  upper: number[],
  lower: number[],
  middle: number[]
): { score: number; state: string } {
  if (upper.length === 0) return { score: 0, state: "no_data" };

  const lastPrice = prices[prices.length - 1];
  const lastUpper = upper[upper.length - 1];
  const lastLower = lower[lower.length - 1];
  const lastMiddle = middle[middle.length - 1];

  const bandwidth = (lastUpper - lastLower) / lastMiddle;
  const position = (lastPrice - lastLower) / (lastUpper - lastLower);

  const isSqueeze = bandwidth < 0.03;
  const nearUpper = position > 0.9;
  const nearLower = position < 0.1;

  if (isSqueeze) return { score: 10, state: "squeeze" };
  if (nearLower) return { score: 50, state: "near_lower" };
  if (nearUpper) return { score: -50, state: "near_upper" };
  if (position < 0.4) return { score: 25, state: "lower_half" };
  if (position > 0.6) return { score: -25, state: "upper_half" };
  return { score: 0, state: "middle" };
}

function maScore(
  prices: number[],
  timeframe: Timeframe
): { score: number; state: string } {
  if (timeframe === "short") {
    if (prices.length < 21) return { score: 0, state: "insufficient_data" };
    const sma20 = sma(prices, 20);
    const lastPrice = prices[prices.length - 1];
    const lastSma = sma20[sma20.length - 1];
    const pctAbove = ((lastPrice - lastSma) / lastSma) * 100;

    if (pctAbove > 3) return { score: 40, state: "well_above_sma20" };
    if (pctAbove > 0) return { score: 20, state: "above_sma20" };
    if (pctAbove > -3) return { score: -20, state: "below_sma20" };
    return { score: -40, state: "well_below_sma20" };
  }

  if (prices.length < 200) {
    if (prices.length < 50) return { score: 0, state: "insufficient_data" };
    const sma50 = sma(prices, 50);
    const lastPrice = prices[prices.length - 1];
    const above = lastPrice > sma50[sma50.length - 1];
    return { score: above ? 30 : -30, state: above ? "above_sma50" : "below_sma50" };
  }

  const sma50 = sma(prices, 50);
  const sma200 = sma(prices, 200);
  const last50 = sma50[sma50.length - 1];
  const last200 = sma200[sma200.length - 1];
  const prev50 = sma50.length > 5 ? sma50[sma50.length - 6] : last50;
  const prev200 = sma200.length > 5 ? sma200[sma200.length - 6] : last200;

  const goldenCross = prev50 <= prev200 && last50 > last200;
  const deathCross = prev50 >= prev200 && last50 < last200;

  if (goldenCross) return { score: 70, state: "golden_cross" };
  if (deathCross) return { score: -70, state: "death_cross" };
  if (last50 > last200) return { score: 40, state: "bullish_alignment" };
  return { score: -40, state: "bearish_alignment" };
}

export function calculateTechnicalScore(
  prices: number[],
  timestamps: string[],
  timeframe: Timeframe
): FactorScore {
  if (prices.length < 16) {
    return { score: 0, details: { rsi: 0, macd: "no_data", bollinger: "no_data", ma: "no_data" } };
  }

  const rsiResult = calculateRSI(prices, timestamps);
  const latestRsi = rsiResult.values.length > 0 ? rsiResult.values[rsiResult.values.length - 1] : 50;
  const rsiSc = rsiScore(latestRsi);

  const macdPeriods = pickMacdPeriods(prices.length);
  let macdSc = { score: 0, state: "no_data" };
  if (macdPeriods) {
    const macdResult = calculateMACD(prices, timestamps, macdPeriods.fast, macdPeriods.slow, macdPeriods.signal);
    macdSc = macdScore(macdResult.histogram, macdResult.macd, macdResult.signal);
  }

  const bollPeriod = pickBollingerPeriod(prices.length);
  const bollResult = calculateBollinger(prices, timestamps, bollPeriod);
  const bollSc = bollingerScore(prices, bollResult.upper, bollResult.lower, bollResult.middle);

  const maSc = maScore(prices, timeframe);

  const composite = clamp(
    rsiSc * 0.3 + macdSc.score * 0.3 + bollSc.score * 0.2 + maSc.score * 0.2
  );

  return {
    score: Math.round(composite),
    details: {
      rsi: Math.round(latestRsi * 10) / 10,
      rsiSignal: rsiSc > 0 ? "bullish" : rsiSc < 0 ? "bearish" : "neutral",
      macd: macdSc.state,
      bollinger: bollSc.state,
      ma: maSc.state,
    },
  };
}
