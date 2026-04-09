import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { businessListings } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    const token = req.nextUrl.searchParams.get("token");
    if (!token || token !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const type = req.nextUrl.searchParams.get("type") || "all";

  const pendingBusinesses = await db
    .select()
    .from(businessListings)
    .where(
      and(
        eq(businessListings.status, "pending"),
        eq(businessListings.emailVerified, true)
      )
    );

  const result: Record<string, unknown[]> = {};

  if (type === "all" || type === "business") {
    result.businesses = pendingBusinesses.map((b) => ({
      id: b.id,
      businessName: b.businessName,
      email: b.email,
      countryCode: b.countryCode,
      city: b.city,
      type: b.type,
      metals: b.metals,
      website: b.website,
      createdAt: b.createdAt,
    }));
  }

  return NextResponse.json(result);
}
