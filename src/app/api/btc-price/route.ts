import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface BtcPrice {
  price: number;
  change24h: number;
  changePct24h: number;
  marketCap: number;
  volume24h: number;
  updatedAt: string;
}

let cache: { data: BtcPrice; ts: number } | null = null;
const TTL = 60_000;

async function fromCoinGecko(): Promise<BtcPrice | null> {
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true",
      { signal: AbortSignal.timeout(5_000) },
    );
    if (!r.ok) return null;
    const d = (await r.json()).bitcoin;
    if (!d?.usd) return null;
    return {
      price: d.usd,
      change24h: 0,
      changePct24h: d.usd_24h_change ?? 0,
      marketCap: d.usd_market_cap ?? 0,
      volume24h: d.usd_24h_vol ?? 0,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function fromBinance(): Promise<BtcPrice | null> {
  try {
    const r = await fetch(
      "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT",
      { signal: AbortSignal.timeout(5_000) },
    );
    if (!r.ok) return null;
    const d = await r.json();
    return {
      price: parseFloat(d.lastPrice),
      change24h: parseFloat(d.priceChange),
      changePct24h: parseFloat(d.priceChangePercent),
      marketCap: 0,
      volume24h: parseFloat(d.quoteVolume),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
    });
  }

  const data = (await fromCoinGecko()) ?? (await fromBinance());
  if (!data) {
    return NextResponse.json({ error: "Unable to fetch BTC price" }, { status: 502 });
  }

  cache = { data, ts: Date.now() };
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}
