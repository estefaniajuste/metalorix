import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("metalorix_session")?.value;
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const userId = parseInt(session.split(":")[0], 10);
  if (isNaN(userId)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ user: null }, { status: 503 });
  }

  const result = await db
    .select({ id: users.id, email: users.email, tier: users.tier, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: result[0] });
}
