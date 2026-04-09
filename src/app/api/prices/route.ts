import { NextRequest, NextResponse } from "next/server";
import { getSpotPrices } from "@/lib/providers/spot-prices";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = rateLimit(`prices:${ip}`, { maxRequests: 60, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" } }
    );
  }
  try {
    const { prices, source } = await getSpotPrices();
    return NextResponse.json({ source, prices });
  } catch (err) {
    console.error("[Prices] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
