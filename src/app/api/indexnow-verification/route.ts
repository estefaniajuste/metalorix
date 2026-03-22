import { NextRequest, NextResponse } from "next/server";

/** Serves IndexNow key verification file at /{key}.txt (via rewrite). */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const expected = process.env.INDEXNOW_KEY;

  if (!key || !expected || key !== expected) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
