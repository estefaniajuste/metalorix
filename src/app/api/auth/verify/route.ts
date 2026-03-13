import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/magic-link";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/panel?error=missing_token", request.url));
  }

  const email = verifyToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/panel?error=invalid_token", request.url));
  }

  const db = getDb();
  if (!db) {
    return NextResponse.redirect(new URL("/panel?error=service", request.url));
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.redirect(new URL("/panel?error=not_found", request.url));
  }

  // Create session token
  const sessionToken = randomBytes(32).toString("hex");

  const response = NextResponse.redirect(new URL("/panel", request.url));
  response.cookies.set("metalorix_session", `${existing[0].id}:${sessionToken}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
