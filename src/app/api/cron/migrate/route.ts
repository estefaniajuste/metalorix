import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sql } from "drizzle-orm";

const CRON_SECRET = process.env.CRON_SECRET?.trim();

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const results: string[] = [];

  try {
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN NOT NULL DEFAULT FALSE`);
    results.push("users.unsubscribed: OK");
  } catch (e) {
    results.push(`users.unsubscribed: ${e instanceof Error ? e.message : String(e)}`);
  }

  return NextResponse.json({ ok: true, results });
}
