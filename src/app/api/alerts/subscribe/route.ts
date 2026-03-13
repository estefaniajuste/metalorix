import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users, alerts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";
import { welcomeEmail } from "@/lib/email/templates";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = rateLimit(`subscribe:${ip}`, { maxRequests: 5, windowMs: 300_000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos." },
      { status: 429 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  let body: { email: string; alerts?: Array<{ symbol: string; type: string; threshold: number }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  try {
    // Find or create user
    let existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: number;
    let isNew = false;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      const inserted = await db
        .insert(users)
        .values({ email, provider: "email" })
        .returning({ id: users.id });
      userId = inserted[0].id;
      isNew = true;
    }

    // Create custom alerts if provided
    let alertsCreated = 0;
    if (body.alerts && Array.isArray(body.alerts)) {
      for (const a of body.alerts) {
        if (!a.symbol || !a.type || !a.threshold) continue;
        await db.insert(alerts).values({
          userId,
          symbol: a.symbol,
          alertType: a.type,
          threshold: a.threshold.toFixed(4),
        });
        alertsCreated++;
      }
    }

    // Send welcome email to new subscribers
    if (isNew) {
      const { subject, html } = welcomeEmail();
      await sendEmail({ to: email, subject, html }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      isNew,
      alertsCreated,
      message: isNew
        ? "¡Suscripción completada! Revisa tu correo."
        : alertsCreated > 0
          ? `${alertsCreated} alerta(s) creada(s)`
          : "Ya estás suscrito a las alertas inteligentes.",
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Error al procesar la suscripción" },
      { status: 500 }
    );
  }
}
