export type Timeframe = "short" | "long";
export type Signal = "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell";
export type Confidence = "low" | "medium" | "high";

export interface FactorScore {
  score: number; // -100 to +100
  details: Record<string, string | number>;
}

export interface OutlookFactors {
  technical: FactorScore;
  momentum: FactorScore;
  sentiment: FactorScore;
  macro: FactorScore;
}

export interface OutlookResult {
  symbol: string;
  timeframe: Timeframe;
  score: number;
  signal: Signal;
  confidence: Confidence;
  factors: OutlookFactors;
  generatedAt: string;
  narrative?: string;
  narrativeEs?: string;
}

export const OUTLOOK_METALS = ["XAU", "XAG", "XPT", "XPD"] as const;
export type OutlookMetal = (typeof OUTLOOK_METALS)[number];

export const TIMEFRAMES: Timeframe[] = ["short", "long"];

export const SHORT_WEIGHTS = { technical: 0.4, momentum: 0.25, sentiment: 0.2, macro: 0.15 };
export const LONG_WEIGHTS = { technical: 0.2, momentum: 0.15, sentiment: 0.3, macro: 0.35 };

export function getWeights(tf: Timeframe) {
  return tf === "short" ? SHORT_WEIGHTS : LONG_WEIGHTS;
}

export function scoreToSignal(score: number): Signal {
  if (score >= 60) return "strong_buy";
  if (score >= 20) return "buy";
  if (score > -20) return "neutral";
  if (score > -60) return "sell";
  return "strong_sell";
}

export function scoreToConfidence(factors: OutlookFactors): Confidence {
  const scores = [
    factors.technical.score,
    factors.momentum.score,
    factors.sentiment.score,
    factors.macro.score,
  ];
  const avg = scores.reduce((a, b) => a + Math.abs(b), 0) / scores.length;
  const allSameSign = scores.every((s) => s >= 0) || scores.every((s) => s <= 0);

  if (allSameSign && avg > 40) return "high";
  if (allSameSign || avg > 25) return "medium";
  return "low";
}

export function clamp(v: number, min = -100, max = 100) {
  return Math.min(max, Math.max(min, v));
}
