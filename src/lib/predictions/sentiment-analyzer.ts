import { clamp, type FactorScore, type Timeframe } from "./types";

interface NewsItem {
  title: string;
  summary: string | null;
  metals: string[] | null;
  sentiment: string | null;
  scrapedAt: Date;
}

const BULLISH_KEYWORDS: [string, number][] = [
  ["safe haven", 3],
  ["safe-haven", 3],
  ["demand surge", 3],
  ["central bank buying", 4],
  ["central bank purchases", 4],
  ["inflation fears", 3],
  ["inflation concerns", 2],
  ["sanctions", 2],
  ["record high", 3],
  ["all-time high", 3],
  ["geopolitical tension", 3],
  ["geopolitical risk", 2],
  ["supply shortage", 2],
  ["supply deficit", 3],
  ["debt crisis", 2],
  ["haven demand", 3],
  ["currency debasement", 2],
  ["de-dollarization", 3],
  ["rate cut", 2],
  ["dovish", 2],
  ["buying spree", 2],
  ["bullion buying", 2],
  ["etf inflows", 2],
  ["risk-off", 2],
  ["uncertainty", 1],
  ["war", 2],
  ["conflict", 2],
  ["recession", 2],
  ["rally", 1],
  ["surges", 2],
  ["soars", 2],
  ["jumps", 1],
];

const BEARISH_KEYWORDS: [string, number][] = [
  ["rate hike", 3],
  ["rate increase", 2],
  ["hawkish", 3],
  ["strong dollar", 3],
  ["dollar strength", 3],
  ["sell-off", 2],
  ["selloff", 2],
  ["profit taking", 2],
  ["profit-taking", 2],
  ["mining expansion", 2],
  ["surplus", 2],
  ["oversupply", 3],
  ["etf outflows", 2],
  ["risk-on", 2],
  ["stock rally", 2],
  ["equity rally", 2],
  ["tightening", 2],
  ["deflation", 2],
  ["drops", 1],
  ["falls", 1],
  ["plunges", 2],
  ["tumbles", 2],
  ["slumps", 2],
];

function keywordSentiment(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const [kw, weight] of BULLISH_KEYWORDS) {
    if (lower.includes(kw)) score += weight;
  }
  for (const [kw, weight] of BEARISH_KEYWORDS) {
    if (lower.includes(kw)) score -= weight;
  }
  return score;
}

function dbSentimentScore(sentiment: string | null): number {
  if (!sentiment) return 0;
  if (sentiment === "positive") return 2;
  if (sentiment === "negative") return -2;
  return 0;
}

function recencyWeight(scrapedAt: Date, now: Date): number {
  const hoursAgo = (now.getTime() - scrapedAt.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 6) return 1.5;
  if (hoursAgo < 24) return 1.2;
  if (hoursAgo < 72) return 1.0;
  if (hoursAgo < 168) return 0.7;
  return 0.4;
}

export function calculateSentimentScore(
  news: NewsItem[],
  symbol: string,
  fearGreedScore: number,
  timeframe: Timeframe
): FactorScore {
  if (news.length === 0) {
    const fgContribution = clamp((fearGreedScore - 50) * 1.5);
    return {
      score: Math.round(fgContribution),
      details: { newsCount: 0, avgSentiment: 0, fearGreed: fearGreedScore, keywordScore: 0 },
    };
  }

  const now = new Date();
  const cutoffHours = timeframe === "short" ? 72 : 720;
  const cutoff = new Date(now.getTime() - cutoffHours * 60 * 60 * 1000);

  const metalMap: Record<string, string> = { XAU: "gold", XAG: "silver", XPT: "platinum", XPD: "palladium" };
  const metalName = metalMap[symbol] || symbol.toLowerCase();

  const relevantNews = news.filter((n) => {
    if (n.scrapedAt < cutoff) return false;
    const isMetalRelevant =
      n.metals?.includes(symbol) ||
      n.title.toLowerCase().includes(metalName) ||
      (n.summary || "").toLowerCase().includes(metalName);
    return isMetalRelevant || n.metals === null || n.metals.length === 0;
  });

  if (relevantNews.length === 0) {
    const fgContribution = clamp((fearGreedScore - 50) * 1.5);
    return {
      score: Math.round(fgContribution),
      details: { newsCount: 0, avgSentiment: 0, fearGreed: fearGreedScore, keywordScore: 0 },
    };
  }

  let totalKeywordScore = 0;
  let totalDbScore = 0;
  let weightSum = 0;

  for (const item of relevantNews) {
    const text = `${item.title} ${item.summary || ""}`;
    const kws = keywordSentiment(text);
    const dbs = dbSentimentScore(item.sentiment);
    const rw = recencyWeight(item.scrapedAt, now);

    totalKeywordScore += kws * rw;
    totalDbScore += dbs * rw;
    weightSum += rw;
  }

  const normKeyword = weightSum > 0 ? totalKeywordScore / weightSum : 0;
  const normDb = weightSum > 0 ? totalDbScore / weightSum : 0;

  const newsSentiment = clamp((normKeyword * 6) + (normDb * 8), -80, 80);

  const fgContribution = clamp((fearGreedScore - 50) * 1.2, -40, 40);

  const newsWeight = timeframe === "short" ? 0.65 : 0.5;
  const fgWeight = 1 - newsWeight;

  const composite = clamp(newsSentiment * newsWeight + fgContribution * fgWeight);

  return {
    score: Math.round(composite),
    details: {
      newsCount: relevantNews.length,
      avgSentiment: Math.round(normKeyword * 100) / 100,
      fearGreed: fearGreedScore,
      keywordScore: Math.round(normKeyword * 100) / 100,
    },
  };
}
