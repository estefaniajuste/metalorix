import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { alerts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

function getUserId(request: NextRequest): number | null {
  const session = request.cookies.get("metalorix_session")?.value;
  if (!session) return null;
  const id = parseInt(session.split(":")[0], 10);
  return isNaN(id) ? null : id;
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const userAlerts = await db
    .select()
    .from(alerts)
    .where(eq(alerts.userId, userId));

  return NextResponse.json({ alerts: userAlerts });
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: { symbol: string; alertType: string; threshold: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.symbol || !body.alertType || !body.threshold) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const inserted = await db
    .insert(alerts)
    .values({
      userId,
      symbol: body.symbol,
      alertType: body.alertType,
      threshold: body.threshold.toFixed(4),
    })
    .returning();

  return NextResponse.json({ ok: true, alert: inserted[0] });
}

export async function DELETE(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const alertId = request.nextUrl.searchParams.get("id");
  if (!alertId) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  await db
    .delete(alerts)
    .where(and(eq(alerts.id, parseInt(alertId, 10)), eq(alerts.userId, userId)));

  return NextResponse.json({ ok: true });
}
