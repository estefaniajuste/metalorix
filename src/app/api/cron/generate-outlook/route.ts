import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { metalPrices, priceHistory, newsSources, metalOutlooks } from "@/lib/db/schema";
import { eq, desc, gte } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";
import { generateOutlook, type OutlookInput } from "@/lib/predictions/outlook-engine";
import { OUTLOOK_METALS, TIMEFRAMES, type OutlookMetal, type Timeframe } from "@/lib/predictions/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const CRON_SECRET = process.env.CRON_SECRET;

const METAL_NAMES: Record<string, string> = {
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
};

async function fetchFearGreed(baseUrl: string): Promise<number> {
  try {
    const res = await fetch(`${baseUrl}/api/fear-greed`, { next: { revalidate: 0 } });
    if (!res.ok) return 50;
    const data = await res.json();
    return data.score ?? 50;
  } catch {
    return 50;
  }
}

function buildNarrativePrompt(
  symbol: string,
  timeframe: Timeframe,
  score: number,
  signal: string,
  factors: OutlookInput["priceData"] & { change24h: number },
  factorScores: ReturnType<typeof generateOutlook>["factors"],
  fearGreed: number,
  topNews: string[],
  locale: "en" | "es"
): string {
  const metalName = METAL_NAMES[symbol] || symbol;
  const tfLabel = timeframe === "short" ? "1-7 days" : "1-12 months";
  const lang = locale === "es" ? "Spanish" : "English";

  return `You are a precious metals market analyst for Metalorix.com. Write a concise market outlook for ${metalName} (${tfLabel} timeframe) in ${lang}.

DATA:
- Current price: $${factors.prices[factors.prices.length - 1]?.toFixed(2)}
- 24h change: ${factors.change24h > 0 ? "+" : ""}${factors.change24h.toFixed(2)}%
- Composite score: ${score}/100 (signal: ${signal.replace("_", " ").toUpperCase()})
- Technical score: ${factorScores.technical.score} (RSI: ${factorScores.technical.details.rsi}, MACD: ${factorScores.technical.details.macd}, Bollinger: ${factorScores.technical.details.bollinger}, MA: ${factorScores.technical.details.ma})
- Momentum score: ${factorScores.momentum.score} (trend: ${factorScores.momentum.details.trend}, volatility: ${factorScores.momentum.details.volatility})
- Sentiment score: ${factorScores.sentiment.score} (news count: ${factorScores.sentiment.details.newsCount}, Fear & Greed: ${fearGreed})
- Macro score: ${factorScores.macro.score} (geo: ${factorScores.macro.details.geopolitical}, central banks: ${factorScores.macro.details.centralBank}, inflation: ${factorScores.macro.details.inflation})

TOP RECENT NEWS HEADLINES:
${topNews.length > 0 ? topNews.map((n, i) => `${i + 1}. ${n}`).join("\n") : "- No relevant news available"}

RULES:
- Write 3-4 sentences maximum (150-250 words)
- Explain WHY the score is what it is, referencing specific factors
- Mention at least one concrete data point (RSI value, news event, etc.)
- ${timeframe === "short" ? "Focus on short-term trading signals and immediate catalysts" : "Focus on structural trends, central bank policy, and macro forces"}
- Do NOT include disclaimers or caveats (those are shown separately in the UI)
- Do NOT use markdown formatting
- Be direct and actionable in tone`;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const results: string[] = [];

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [allNews, fearGreed] = await Promise.all([
      db
        .select({
          title: newsSources.title,
          summary: newsSources.summary,
          metals: newsSources.metals,
          sentiment: newsSources.sentiment,
          scrapedAt: newsSources.scrapedAt,
        })
        .from(newsSources)
        .where(gte(newsSources.scrapedAt, thirtyDaysAgo))
        .orderBy(desc(newsSources.scrapedAt))
        .limit(500),
      fetchFearGreed(baseUrl),
    ]);

    for (const symbol of OUTLOOK_METALS) {
      const [priceRows, currentPrice] = await Promise.all([
        db
          .select({ priceUsd: priceHistory.priceUsd, timestamp: priceHistory.timestamp })
          .from(priceHistory)
          .where(gte(priceHistory.timestamp, thirtyDaysAgo))
          .orderBy(priceHistory.timestamp)
          .limit(3000),
        db
          .select()
          .from(metalPrices)
          .where(eq(metalPrices.symbol, symbol))
          .limit(1),
      ]);

      const symbolHistory = priceRows.filter(
        (r) => r.priceUsd !== null
      );

      if (symbolHistory.length < 10) {
        results.push(`${symbol}: skipped (insufficient history: ${symbolHistory.length} rows)`);
        continue;
      }

      const prices = symbolHistory.map((r) => Number(r.priceUsd));
      const timestamps = symbolHistory.map((r) => r.timestamp.toISOString());
      const change24h = currentPrice[0] ? Number(currentPrice[0].changePct24h ?? 0) : 0;

      const topNews = allNews
        .filter((n) => {
          const metalName = METAL_NAMES[symbol]?.toLowerCase() || "";
          return (
            n.metals?.includes(symbol) ||
            n.title.toLowerCase().includes(metalName)
          );
        })
        .slice(0, 8)
        .map((n) => n.title);

      for (const timeframe of TIMEFRAMES) {
        const input: OutlookInput = {
          symbol: symbol as OutlookMetal,
          timeframe,
          priceData: { prices, timestamps, change24h },
          news: allNews,
          fearGreedScore: fearGreed,
        };

        const outlook = generateOutlook(input);

        let narrative: string | null = null;
        let narrativeEs: string | null = null;

        const promptEn = buildNarrativePrompt(
          symbol, timeframe, outlook.score, outlook.signal,
          { prices, timestamps, change24h },
          outlook.factors, fearGreed, topNews, "en"
        );
        narrative = await generateText(promptEn);

        const promptEs = buildNarrativePrompt(
          symbol, timeframe, outlook.score, outlook.signal,
          { prices, timestamps, change24h },
          outlook.factors, fearGreed, topNews, "es"
        );
        narrativeEs = await generateText(promptEs);

        await db.insert(metalOutlooks).values({
          symbol,
          timeframe,
          score: outlook.score,
          signal: outlook.signal,
          confidence: outlook.confidence,
          factorsJson: outlook.factors,
          narrative: narrative ?? undefined,
          narrativeEs: narrativeEs ?? undefined,
          generatedAt: new Date(),
        });

        results.push(
          `${symbol}/${timeframe}: score=${outlook.score} signal=${outlook.signal} confidence=${outlook.confidence}`
        );
      }
    }

    return NextResponse.json({
      ok: true,
      generated: results.length,
      results,
      fearGreed,
      newsCount: allNews.length,
    });
  } catch (err) {
    console.error("[generate-outlook] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate outlooks", detail: String(err) },
      { status: 500 }
    );
  }
}
