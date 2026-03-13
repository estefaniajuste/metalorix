import { NextResponse } from "next/server";
import { getEurUsdRate } from "@/lib/providers/forex";

export const dynamic = "force-dynamic";

export async function GET() {
  const eurUsd = await getEurUsdRate();
  return NextResponse.json({
    EURUSD: eurUsd,
    updatedAt: new Date().toISOString(),
  });
}
