import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CacheEntry {
  data: { time: number; price: number }[];
  ts: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 10 * 60_000; // 10 min

const VALID_DAYS = new Set(["30", "90", "365", "1825"]);

export async function GET(req: NextRequest) {
  const days = req.nextUrl.searchParams.get("days") || "365";
  if (!VALID_DAYS.has(days)) {
    return NextResponse.json({ error: "Invalid days param" }, { status: 400 });
  }

  const cached = cache.get(days);
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json(
      { prices: cached.data },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" } },
    );
  }

  try {
    const r = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=${Number(days) <= 90 ? "daily" : "daily"}`,
      { signal: AbortSignal.timeout(8_000) },
    );
    if (!r.ok) {
      return NextResponse.json({ error: "CoinGecko error" }, { status: 502 });
    }

    const raw = await r.json();
    const prices: { time: number; price: number }[] = (raw.prices ?? []).map(
      ([ts, price]: [number, number]) => ({
        time: Math.floor(ts / 1000),
        price,
      }),
    );

    cache.set(days, { data: prices, ts: Date.now() });

    return NextResponse.json(
      { prices },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch BTC history" }, { status: 502 });
  }
}
