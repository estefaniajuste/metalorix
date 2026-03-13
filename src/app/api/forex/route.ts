import { NextResponse } from "next/server";
import { getAllForexRates } from "@/lib/providers/forex";

export const dynamic = "force-dynamic";

export async function GET() {
  const rates = await getAllForexRates();
  return NextResponse.json({
    rates,
    EURUSD: rates.EUR ?? 1.08,
    updatedAt: new Date().toISOString(),
  });
}
