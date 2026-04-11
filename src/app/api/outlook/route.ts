import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { metalOutlooks } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol")?.toUpperCase() || "XAU";
  const timeframe = url.searchParams.get("timeframe");

  try {
    await db.execute(sql`CREATE TABLE IF NOT EXISTS metal_outlooks (
      id serial PRIMARY KEY NOT NULL, symbol varchar(10) NOT NULL,
      timeframe varchar(10) NOT NULL, score integer NOT NULL,
      signal varchar(20) NOT NULL, confidence varchar(10) NOT NULL,
      factors_json jsonb NOT NULL, narrative text, narrative_es text,
      generated_at timestamp with time zone DEFAULT now() NOT NULL)`);
    if (timeframe && (timeframe === "short" || timeframe === "long")) {
      const rows = await db
        .select()
        .from(metalOutlooks)
        .where(and(eq(metalOutlooks.symbol, symbol), eq(metalOutlooks.timeframe, timeframe)))
        .orderBy(desc(metalOutlooks.generatedAt))
        .limit(1);

      if (rows.length === 0) {
        return NextResponse.json({ error: "No outlook available" }, { status: 404 });
      }

      return NextResponse.json(rows[0], {
        headers: { "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600" },
      });
    }

    const [shortRows, longRows] = await Promise.all([
      db
        .select()
        .from(metalOutlooks)
        .where(and(eq(metalOutlooks.symbol, symbol), eq(metalOutlooks.timeframe, "short")))
        .orderBy(desc(metalOutlooks.generatedAt))
        .limit(1),
      db
        .select()
        .from(metalOutlooks)
        .where(and(eq(metalOutlooks.symbol, symbol), eq(metalOutlooks.timeframe, "long")))
        .orderBy(desc(metalOutlooks.generatedAt))
        .limit(1),
    ]);

    return NextResponse.json(
      {
        symbol,
        short: shortRows[0] || null,
        long: longRows[0] || null,
      },
      {
        headers: { "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600" },
      }
    );
  } catch (err) {
    console.error("[Outlook API] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
