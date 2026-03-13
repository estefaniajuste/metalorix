import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = rateLimit(`vitals:${ip}`, { maxRequests: 30, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ ok: true }); // Silently accept but don't process
  }

  try {
    const metric = await request.json();

    const { name, value, rating, path } = metric;
    if (!name || typeof value !== "number") {
      return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
    }

    // Log for Cloud Run logs (visible in Google Cloud Console)
    console.log(
      JSON.stringify({
        type: "web-vital",
        name,
        value,
        rating,
        path,
        timestamp: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
