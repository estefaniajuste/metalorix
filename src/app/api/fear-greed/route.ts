import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { metalPrices, priceHistory } from "@/lib/db/schema";
import { eq, desc, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface FearGreedResult {
  score: number; // 0-100
  label: string;
  color: string;
  components: {
    name: string;
    score: number;
    weight: number;
    description: string;
  }[];
  goldPrice: number;
  silverPrice: number;
  goldChange24h: number;
  silverChange24h: number;
  goldSilverRatio: number;
  updatedAt: string;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}

function scoreLabel(score: number): { label: string; color: string } {
  if (score <= 20) return { label: "Extreme Fear", color: "#ef4444" };
  if (score <= 40) return { label: "Fear", color: "#f97316" };
  if (score <= 60) return { label: "Neutral", color: "#eab308" };
  if (score <= 80) return { label: "Greed", color: "#84cc16" };
  return { label: "Extreme Greed", color: "#22c55e" };
}

export async function GET() {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  try {
    // Fetch current prices
    const [goldRow, silverRow] = await Promise.all([
      db.select().from(metalPrices).where(eq(metalPrices.symbol, "XAU")).limit(1),
      db.select().from(metalPrices).where(eq(metalPrices.symbol, "XAG")).limit(1),
    ]);

    const gold = goldRow[0];
    const silver = silverRow[0];

    if (!gold || !silver) {
      return NextResponse.json({ error: "Prices unavailable" }, { status: 503 });
    }

    const goldPrice = Number(gold.priceUsd);
    const silverPrice = Number(silver.priceUsd);
    const goldChange24h = Number(gold.changePct24h ?? 0);
    const silverChange24h = Number(silver.changePct24h ?? 0);
    const goldSilverRatio = goldPrice / silverPrice;

    // Fetch 30-day history for gold to compute volatility + momentum
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const history = await db
      .select({ priceUsd: priceHistory.priceUsd, timestamp: priceHistory.timestamp })
      .from(priceHistory)
      .where(gte(priceHistory.timestamp, thirtyDaysAgo))
      .orderBy(desc(priceHistory.timestamp))
      .limit(720); // ~30 days of hourly data

    const prices = history.map((h) => Number(h.priceUsd)).filter((p) => p > 0);

    // ── Component 1: Price Momentum (30% weight) ──────────────────────────────
    // How far is today's price from 30-day average? Positive = greed, negative = fear
    let momentumScore = 50;
    if (prices.length >= 10) {
      const avg30 = prices.reduce((s, p) => s + p, 0) / prices.length;
      const pctFromAvg = ((goldPrice - avg30) / avg30) * 100;
      // +5% above avg → 75 (greed), -5% below avg → 25 (fear)
      momentumScore = clamp(50 + pctFromAvg * 5);
    }

    // ── Component 2: 24h Price Change (25% weight) ────────────────────────────
    // >+2% = strong greed, <-2% = strong fear
    const changeScore = clamp(50 + goldChange24h * 8);

    // ── Component 3: Volatility (20% weight) ─────────────────────────────────
    // High volatility = fear (uncertainty). Low vol = greed (complacency).
    let volatilityScore = 50;
    if (prices.length >= 10) {
      const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
      const variance = prices.reduce((s, p) => s + Math.pow(p - avg, 2), 0) / prices.length;
      const stdDev = Math.sqrt(variance);
      const cvPct = (stdDev / avg) * 100;
      // cv < 1% = very calm → greed (70+), cv > 4% = very volatile → fear (30-)
      volatilityScore = clamp(70 - (cvPct - 1) * 10);
    }

    // ── Component 4: Gold/Silver Ratio (15% weight) ──────────────────────────
    // Historical avg ~70. Ratio >85 = fear (silver selling off), <60 = greed (risk-on)
    const ratioAvg = 72;
    const ratioDeviation = goldSilverRatio - ratioAvg;
    const ratioScore = clamp(50 - ratioDeviation * 0.8);

    // ── Component 5: Silver Relative Strength (10% weight) ───────────────────
    // When silver outperforms gold (silver % > gold %) = greed (risk appetite)
    const relStrengthScore = clamp(50 + (silverChange24h - goldChange24h) * 6);

    // ── Weighted total ────────────────────────────────────────────────────────
    const score = clamp(
      momentumScore * 0.30 +
      changeScore   * 0.25 +
      volatilityScore * 0.20 +
      ratioScore    * 0.15 +
      relStrengthScore * 0.10
    );

    const { label, color } = scoreLabel(Math.round(score));

    const result: FearGreedResult = {
      score: Math.round(score),
      label,
      color,
      components: [
        {
          name: "Price Momentum (30d)",
          score: Math.round(momentumScore),
          weight: 30,
          description: "Gold price vs its 30-day average. Above average = greed.",
        },
        {
          name: "24h Price Change",
          score: Math.round(changeScore),
          weight: 25,
          description: "How much gold moved in the last 24 hours.",
        },
        {
          name: "Volatility",
          score: Math.round(volatilityScore),
          weight: 20,
          description: "Low volatility = calm market = greed. High volatility = fear.",
        },
        {
          name: "Gold/Silver Ratio",
          score: Math.round(ratioScore),
          weight: 15,
          description: "High ratio = investors flee to gold safety = fear.",
        },
        {
          name: "Silver vs Gold Strength",
          score: Math.round(relStrengthScore),
          weight: 10,
          description: "Silver outperforming gold signals risk appetite = greed.",
        },
      ],
      goldPrice,
      silverPrice,
      goldChange24h,
      silverChange24h,
      goldSilverRatio: Math.round(goldSilverRatio * 10) / 10,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=1800" },
    });
  } catch (err) {
    console.error("Fear-greed error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
