import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_portfolios (
        id serial PRIMARY KEY NOT NULL,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol varchar(10) NOT NULL,
        quantity numeric(14, 6) NOT NULL,
        unit varchar(5) NOT NULL DEFAULT 'oz',
        purchase_price numeric(12, 4) NOT NULL,
        purchase_date varchar(10) NOT NULL,
        notes varchar(500) DEFAULT '',
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      )
    `);

    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS user_portfolios_user_idx ON user_portfolios (user_id)`,
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS user_portfolios_user_symbol_idx ON user_portfolios (user_id, symbol)`,
    );

    return NextResponse.json({
      success: true,
      message: "user_portfolios table and indexes created",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
