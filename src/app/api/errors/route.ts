import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = rateLimit(`errors:${ip}`, { maxRequests: 10, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ ok: true });
  }

  try {
    const { message, digest, path } = await request.json();

    console.error(
      JSON.stringify({
        type: "client-error",
        message: String(message).slice(0, 500),
        digest,
        path,
        ip,
        timestamp: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
