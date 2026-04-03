import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users, userPortfolios } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

function getUserId(req: NextRequest): number | null {
  const session = req.cookies.get("metalorix_session")?.value;
  if (!session) return null;
  const id = parseInt(session.split(":")[0], 10);
  return isNaN(id) ? null : id;
}

const VALID_SYMBOLS = new Set(["XAU", "XAG", "XPT", "XPD"]);

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const rows = await db
    .select()
    .from(userPortfolios)
    .where(eq(userPortfolios.userId, userId))
    .orderBy(userPortfolios.createdAt);

  return NextResponse.json({ holdings: rows });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const userExists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!userExists.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { symbol, quantity, unit, purchasePrice, purchaseDate, notes } = body;

  if (!VALID_SYMBOLS.has(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }
  if (!quantity || Number(quantity) <= 0) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }
  if (!purchasePrice || Number(purchasePrice) <= 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const maxHoldings = 50;
  const existing = await db
    .select({ id: userPortfolios.id })
    .from(userPortfolios)
    .where(eq(userPortfolios.userId, userId));
  if (existing.length >= maxHoldings) {
    return NextResponse.json(
      { error: `Maximum ${maxHoldings} holdings reached` },
      { status: 400 },
    );
  }

  const [inserted] = await db
    .insert(userPortfolios)
    .values({
      userId,
      symbol,
      quantity: String(quantity),
      unit: unit === "g" ? "g" : "oz",
      purchasePrice: String(purchasePrice),
      purchaseDate: purchaseDate || new Date().toISOString().slice(0, 10),
      notes: (notes || "").slice(0, 500),
    })
    .returning();

  return NextResponse.json({ holding: inserted }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const body = await req.json();
  const { id, symbol, quantity, unit, purchasePrice, purchaseDate, notes } =
    body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  if (symbol && !VALID_SYMBOLS.has(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }

  const [updated] = await db
    .update(userPortfolios)
    .set({
      ...(symbol ? { symbol } : {}),
      ...(quantity ? { quantity: String(quantity) } : {}),
      ...(unit ? { unit: unit === "g" ? "g" : "oz" } : {}),
      ...(purchasePrice ? { purchasePrice: String(purchasePrice) } : {}),
      ...(purchaseDate ? { purchaseDate } : {}),
      ...(notes !== undefined ? { notes: String(notes).slice(0, 500) } : {}),
      updatedAt: new Date(),
    })
    .where(
      and(eq(userPortfolios.id, Number(id)), eq(userPortfolios.userId, userId)),
    )
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ holding: updated });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const [deleted] = await db
    .delete(userPortfolios)
    .where(
      and(eq(userPortfolios.id, Number(id)), eq(userPortfolios.userId, userId)),
    )
    .returning({ id: userPortfolios.id });

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
