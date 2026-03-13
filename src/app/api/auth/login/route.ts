import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendMagicLink } from "@/lib/auth/magic-link";

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: { email: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json(
      { error: "No existe una cuenta con ese email. Suscríbete primero en /alertas." },
      { status: 404 }
    );
  }

  const baseUrl = request.nextUrl.origin;
  const sent = await sendMagicLink(email, baseUrl);

  if (!sent) {
    return NextResponse.json(
      { error: "Error al enviar el email" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Enlace enviado a tu email. Revisa tu bandeja de entrada.",
  });
}
