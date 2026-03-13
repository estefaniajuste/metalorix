import { NextRequest, NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/engine";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await runAlertEngine();
    return NextResponse.json({
      ok: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Alert engine error:", err);
    return NextResponse.json(
      { error: "Alert engine failed" },
      { status: 500 }
    );
  }
}
