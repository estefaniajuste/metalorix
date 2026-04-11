import { calculateTechnicalScore } from "./technical-scorer";
import { calculateMomentumScore } from "./momentum-scorer";
import { calculateSentimentScore } from "./sentiment-analyzer";
import { calculateMacroScore } from "./macro-analyzer";
import {
  type OutlookResult,
  type OutlookFactors,
  type Timeframe,
  type OutlookMetal,
  getWeights,
  scoreToSignal,
  scoreToConfidence,
  clamp,
} from "./types";

interface PriceData {
  prices: number[];
  timestamps: string[];
  change24h: number;
}

interface NewsData {
  title: string;
  summary: string | null;
  metals: string[] | null;
  sentiment: string | null;
  scrapedAt: Date;
}

export interface OutlookInput {
  symbol: OutlookMetal;
  timeframe: Timeframe;
  priceData: PriceData;
  news: NewsData[];
  fearGreedScore: number;
}

export function generateOutlook(input: OutlookInput): OutlookResult {
  const { symbol, timeframe, priceData, news, fearGreedScore } = input;

  const technical = calculateTechnicalScore(
    priceData.prices,
    priceData.timestamps,
    timeframe
  );

  const momentum = calculateMomentumScore(
    priceData.prices,
    priceData.timestamps,
    priceData.change24h,
    timeframe
  );

  const sentiment = calculateSentimentScore(
    news,
    symbol,
    fearGreedScore,
    timeframe
  );

  const macro = calculateMacroScore(news, timeframe);

  const factors: OutlookFactors = { technical, momentum, sentiment, macro };
  const weights = getWeights(timeframe);

  const score = clamp(Math.round(
    technical.score * weights.technical +
    momentum.score * weights.momentum +
    sentiment.score * weights.sentiment +
    macro.score * weights.macro
  ));

  return {
    symbol,
    timeframe,
    score,
    signal: scoreToSignal(score),
    confidence: scoreToConfidence(factors),
    factors,
    generatedAt: new Date().toISOString(),
  };
}
