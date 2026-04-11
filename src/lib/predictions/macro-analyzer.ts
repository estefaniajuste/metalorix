import { clamp, type FactorScore, type Timeframe } from "./types";

interface NewsItem {
  title: string;
  summary: string | null;
  scrapedAt: Date;
}

const GEO_KEYWORDS: [string, number][] = [
  ["war", 3], ["conflict", 2], ["military", 2], ["missile", 3],
  ["invasion", 3], ["sanctions", 3], ["embargo", 3], ["nuclear", 3],
  ["geopolitical", 2], ["escalation", 3], ["ceasefire", -2],
  ["peace talks", -2], ["de-escalation", -2], ["diplomatic", -1],
  ["troops", 2], ["strike", 2], ["attack", 2], ["nato", 1],
  ["middle east", 2], ["taiwan", 2], ["ukraine", 2], ["gaza", 2],
  ["trade war", 2], ["tariff", 2],
];

const CB_KEYWORDS: [string, number][] = [
  ["fed", 1], ["federal reserve", 2], ["ecb", 1], ["bank of japan", 1],
  ["rate cut", 3], ["rate cuts", 3], ["dovish", 3], ["easing", 2],
  ["stimulus", 2], ["quantitative easing", 3], ["qe", 2],
  ["rate hike", -3], ["rate hikes", -3], ["hawkish", -3],
  ["tightening", -2], ["tapering", -2],
  ["pause", 1], ["hold rates", 0],
  ["central bank buying gold", 4], ["central bank purchases", 3],
  ["reserve diversification", 3],
];

const INFLATION_KEYWORDS: [string, number][] = [
  ["inflation", 2], ["cpi", 1], ["consumer prices", 1],
  ["inflation surge", 3], ["rising prices", 2], ["price pressures", 2],
  ["hyperinflation", 4], ["stagflation", 3], ["cost of living", 2],
  ["inflation eases", -2], ["disinflation", -2], ["deflation", -3],
  ["cpi lower", -2], ["prices fall", -2],
];

const CURRENCY_KEYWORDS: [string, number][] = [
  ["dollar weakness", 3], ["dollar falls", 3], ["weak dollar", 3],
  ["dollar decline", 2], ["usd drops", 2],
  ["dollar strength", -3], ["strong dollar", -3], ["dollar rally", -3],
  ["dxy rises", -2], ["dollar index up", -2],
  ["de-dollarization", 3], ["brics currency", 2],
];

function scoreKeywords(text: string, keywords: [string, number][]): number {
  const lower = text.toLowerCase();
  let total = 0;
  for (const [kw, weight] of keywords) {
    if (lower.includes(kw)) total += weight;
  }
  return total;
}

function recencyWeight(scrapedAt: Date, now: Date): number {
  const hoursAgo = (now.getTime() - scrapedAt.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 12) return 1.5;
  if (hoursAgo < 48) return 1.2;
  if (hoursAgo < 168) return 1.0;
  if (hoursAgo < 336) return 0.7;
  return 0.4;
}

export function calculateMacroScore(
  news: NewsItem[],
  timeframe: Timeframe
): FactorScore {
  if (news.length === 0) {
    return {
      score: 0,
      details: { geopolitical: "no_data", centralBank: "no_data", inflation: "no_data", currency: "no_data" },
    };
  }

  const now = new Date();
  const cutoffHours = timeframe === "short" ? 96 : 720;
  const cutoff = new Date(now.getTime() - cutoffHours * 60 * 60 * 1000);
  const recent = news.filter((n) => n.scrapedAt >= cutoff);

  if (recent.length === 0) {
    return {
      score: 0,
      details: { geopolitical: "no_data", centralBank: "no_data", inflation: "no_data", currency: "no_data" },
    };
  }

  let geoTotal = 0;
  let cbTotal = 0;
  let infTotal = 0;
  let curTotal = 0;
  let weightSum = 0;

  for (const item of recent) {
    const text = `${item.title} ${item.summary || ""}`;
    const rw = recencyWeight(item.scrapedAt, now);

    geoTotal += scoreKeywords(text, GEO_KEYWORDS) * rw;
    cbTotal += scoreKeywords(text, CB_KEYWORDS) * rw;
    infTotal += scoreKeywords(text, INFLATION_KEYWORDS) * rw;
    curTotal += scoreKeywords(text, CURRENCY_KEYWORDS) * rw;
    weightSum += rw;
  }

  const normalize = (v: number) => (weightSum > 0 ? v / weightSum : 0);
  const normGeo = normalize(geoTotal);
  const normCb = normalize(cbTotal);
  const normInf = normalize(infTotal);
  const normCur = normalize(curTotal);

  const geoScore = clamp(normGeo * 12, -80, 80);
  const cbScore = clamp(normCb * 10, -60, 60);
  const infScore = clamp(normInf * 10, -60, 60);
  const curScore = clamp(normCur * 10, -60, 60);

  function labelScore(s: number): string {
    if (s > 20) return "strongly_bullish";
    if (s > 5) return "bullish";
    if (s > -5) return "neutral";
    if (s > -20) return "bearish";
    return "strongly_bearish";
  }

  const geoWeight = timeframe === "short" ? 0.35 : 0.25;
  const cbWeight = timeframe === "short" ? 0.25 : 0.35;
  const infWeight = 0.25;
  const curWeight = timeframe === "short" ? 0.15 : 0.15;

  const composite = clamp(
    geoScore * geoWeight +
    cbScore * cbWeight +
    infScore * infWeight +
    curScore * curWeight
  );

  return {
    score: Math.round(composite),
    details: {
      geopolitical: labelScore(geoScore),
      geopoliticalScore: Math.round(geoScore),
      centralBank: labelScore(cbScore),
      centralBankScore: Math.round(cbScore),
      inflation: labelScore(infScore),
      inflationScore: Math.round(infScore),
      currency: labelScore(curScore),
      currencyScore: Math.round(curScore),
    },
  };
}
