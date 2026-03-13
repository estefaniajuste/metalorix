import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { metalPrices, priceHistory } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fetchAllSpotPrices as fetchFromGoldApi } from "@/lib/providers/gold-api";
import { fetchAllSpotPrices as fetchFromTwelveData } from "@/lib/providers/twelve-data";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  const prices = await fetchFromGoldApi() ?? await fetchFromTwelveData();
  if (!prices || prices.length === 0) {
    return NextResponse.json(
      { error: "Failed to fetch prices from any provider" },
      { status: 502 }
    );
  }

  const now = new Date();
  let upserted = 0;
  let historySaved = 0;

  for (const p of prices) {
    // Upsert latest price
    const existing = await db
      .select()
      .from(metalPrices)
      .where(eq(metalPrices.symbol, p.symbol))
      .limit(1);

    if (existing.length > 0) {
      const prev = parseFloat(existing[0].priceUsd);
      const change = +(p.price - prev).toFixed(4);
      const changePct = prev !== 0 ? +((change / prev) * 100).toFixed(4) : 0;

      await db
        .update(metalPrices)
        .set({
          priceUsd: p.price.toFixed(4),
          change24h: change.toFixed(4),
          changePct24h: changePct.toFixed(4),
          updatedAt: now,
        })
        .where(eq(metalPrices.symbol, p.symbol));
    } else {
      await db.insert(metalPrices).values({
        symbol: p.symbol,
        name: p.name,
        priceUsd: p.price.toFixed(4),
        change24h: "0",
        changePct24h: "0",
        updatedAt: now,
      });
    }
    upserted++;

    // Save to history
    await db.insert(priceHistory).values({
      symbol: p.symbol,
      priceUsd: p.price.toFixed(4),
      timestamp: now,
    });
    historySaved++;
  }

  return NextResponse.json({
    ok: true,
    upserted,
    historySaved,
    timestamp: now.toISOString(),
  });
}
