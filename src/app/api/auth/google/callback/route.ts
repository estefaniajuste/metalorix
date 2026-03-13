import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/panel?error=google_denied", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/panel?error=missing_code", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/panel?error=service", request.url));
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/google/callback`;

  // Exchange code for tokens
  let tokens: GoogleTokenResponse;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/panel?error=google_token", request.url));
    }

    tokens = await tokenRes.json();
  } catch {
    return NextResponse.redirect(new URL("/panel?error=google_token", request.url));
  }

  // Get user profile
  let profile: GoogleUserInfo;
  try {
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(new URL("/panel?error=google_profile", request.url));
    }

    profile = await profileRes.json();
  } catch {
    return NextResponse.redirect(new URL("/panel?error=google_profile", request.url));
  }

  if (!profile.email) {
    return NextResponse.redirect(new URL("/panel?error=google_no_email", request.url));
  }

  const db = getDb();
  if (!db) {
    return NextResponse.redirect(new URL("/panel?error=service", request.url));
  }

  const email = profile.email.trim().toLowerCase();

  // Find or create user
  let existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length === 0) {
    const inserted = await db
      .insert(users)
      .values({
        email,
        name: profile.name || null,
        avatarUrl: profile.picture || null,
        provider: "google",
      })
      .returning();
    existing = inserted;
  }

  const user = existing[0];

  // Create session cookie (same format as magic link verify)
  const sessionToken = randomBytes(32).toString("hex");

  const response = NextResponse.redirect(new URL("/panel", request.url));
  response.cookies.set("metalorix_session", `${user.id}:${sessionToken}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
