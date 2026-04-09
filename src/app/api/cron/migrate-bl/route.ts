import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    if (!db) return NextResponse.json({ error: "No DB connection" }, { status: 500 });

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS business_listings (
        id serial PRIMARY KEY NOT NULL,
        email varchar(255) NOT NULL,
        business_name varchar(255) NOT NULL,
        slug varchar(255) NOT NULL,
        country_code varchar(5) NOT NULL,
        city varchar(255) NOT NULL,
        address varchar(500),
        website varchar(500),
        phone varchar(50),
        whatsapp varchar(50),
        instagram varchar(100),
        type varchar(20) NOT NULL DEFAULT 'physical',
        metals varchar(10)[] NOT NULL,
        services varchar(30)[] NOT NULL,
        description text,
        locale varchar(5) NOT NULL DEFAULT 'en',
        status varchar(20) NOT NULL DEFAULT 'pending',
        featured boolean NOT NULL DEFAULT false,
        verified boolean NOT NULL DEFAULT false,
        verification_token varchar(100),
        email_verified boolean NOT NULL DEFAULT false,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      )
    `);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS business_listings_status_idx ON business_listings (status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS business_listings_country_idx ON business_listings (country_code)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS business_listings_slug_idx ON business_listings (slug)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS business_listings_email_idx ON business_listings (email)`);

    return NextResponse.json({ ok: true, message: "business_listings table created with indexes" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
