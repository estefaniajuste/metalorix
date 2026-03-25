import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getDb } from "@/lib/db";
import { users, alerts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function generateToken(userId: number, email: string): string {
  const secret = process.env.CRON_SECRET || "metalorix-dev-secret";
  return createHmac("sha256", secret).update(`${userId}:${email}`).digest("hex");
}

export function buildUnsubscribeUrl(userId: number, email: string): string {
  const token = generateToken(userId, email);
  const base = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
  return `${base}/api/unsubscribe?uid=${userId}&token=${token}`;
}

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");
  const token = request.nextUrl.searchParams.get("token");

  if (!uid || !token) {
    return new NextResponse(errorPage("Invalid link."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const db = getDb();
  if (!db) {
    return new NextResponse(errorPage("Service temporarily unavailable."), {
      status: 503,
      headers: { "Content-Type": "text/html" },
    });
  }

  const [user] = await db
    .select({ id: users.id, email: users.email, unsubscribed: users.unsubscribed })
    .from(users)
    .where(eq(users.id, parseInt(uid, 10)))
    .limit(1);

  if (!user) {
    return new NextResponse(errorPage("User not found."), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  const expected = generateToken(user.id, user.email);
  if (token !== expected) {
    return new NextResponse(errorPage("Invalid or expired link."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!user.unsubscribed) {
    await db.update(users).set({ unsubscribed: true }).where(eq(users.id, user.id));
    await db.update(alerts).set({ active: false }).where(eq(alerts.userId, user.id));
  }

  return new NextResponse(successPage(), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function successPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed — Metalorix</title></head>
<body style="margin:0;padding:0;background:#0B0F17;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
<div style="max-width:480px;width:100%;padding:32px;background:#131720;border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center">
  <div style="font-size:40px;margin-bottom:16px">✅</div>
  <h1 style="color:#F1F3F7;font-size:20px;font-weight:700;margin:0 0 12px">You have been unsubscribed</h1>
  <p style="color:#8891A5;font-size:14px;line-height:1.6;margin:0 0 24px">
    You will no longer receive price alerts or market notifications from Metalorix.
  </p>
  <a href="https://metalorix.com" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none">
    Back to Metalorix
  </a>
  <p style="color:#5A6478;font-size:11px;margin:16px 0 0">
    Changed your mind? <a href="https://metalorix.com/alertas" style="color:#D6B35A;text-decoration:none">Re-subscribe here</a>
  </p>
</div>
</body></html>`;
}

function errorPage(msg: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Error — Metalorix</title></head>
<body style="margin:0;padding:0;background:#0B0F17;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
<div style="max-width:480px;width:100%;padding:32px;background:#131720;border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center">
  <div style="font-size:40px;margin-bottom:16px">❌</div>
  <h1 style="color:#F1F3F7;font-size:20px;font-weight:700;margin:0 0 12px">Something went wrong</h1>
  <p style="color:#8891A5;font-size:14px;line-height:1.6;margin:0 0 24px">${msg}</p>
  <a href="https://metalorix.com" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none">
    Back to Metalorix
  </a>
</div>
</body></html>`;
}
