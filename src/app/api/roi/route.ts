import { NextRequest, NextResponse } from "next/server";
import {
  getHistoricalPrice,
  calculateRoi,
} from "@/lib/providers/historical-prices";
import { fetchAllSpotPrices } from "@/lib/providers/yahoo-finance";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol") || "XAU";
  const date = url.searchParams.get("date");
  const amountStr = url.searchParams.get("amount") || "1000";

  if (!date) {
    return NextResponse.json(
      { error: "Missing 'date' parameter (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  try {
    const [historicalPrice, currentPrices] = await Promise.all([
      getHistoricalPrice(symbol, date),
      fetchAllSpotPrices(),
    ]);

    if (!historicalPrice) {
      return NextResponse.json(
        { error: "Could not fetch historical price for that date" },
        { status: 404 }
      );
    }

    const currentSpot = currentPrices?.find((p) => p.symbol === symbol);
    if (!currentSpot) {
      return NextResponse.json(
        { error: "Could not fetch current price" },
        { status: 502 }
      );
    }

    const result = calculateRoi(
      historicalPrice,
      currentSpot.price,
      amount,
      date,
      symbol
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("[ROI] Error:", err);
    return NextResponse.json(
      { error: "Failed to calculate ROI" },
      { status: 500 }
    );
  }
}
