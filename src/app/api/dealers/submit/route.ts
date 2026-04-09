import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { businessListings } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/resend";
import crypto from "crypto";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_DAY = 3;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetAt: now + 86_400_000 });
    return true;
  }
  if (entry.count >= MAX_PER_DAY) return false;
  entry.count++;
  return true;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot check
    if (body._website) {
      return NextResponse.json({ ok: true });
    }

    const {
      businessName,
      email,
      countryCode,
      city,
      address,
      website,
      phone,
      whatsapp,
      instagram,
      type,
      metals,
      services,
      description,
      locale,
    } = body;

    if (!businessName || !email || !countryCode || !city || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(email) || !checkRateLimit(`ip:${ip}`)) {
      return NextResponse.json(
        { error: "Too many submissions. Try again tomorrow." },
        { status: 429 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const slug = slugify(`${businessName}-${city}`);

    await db.insert(businessListings).values({
      email: email.trim().toLowerCase(),
      businessName: businessName.trim(),
      slug,
      countryCode,
      city: city.trim(),
      address: address?.trim() || null,
      website: website?.trim() || null,
      phone: phone?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      instagram: instagram?.trim()?.replace(/^@/, "") || null,
      type,
      metals: metals || [],
      services: services || [],
      description: description?.trim()?.slice(0, 500) || null,
      locale: locale || "en",
      status: "pending",
      verificationToken: token,
      emailVerified: false,
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
    const verifyUrl = `${baseUrl}/api/dealers/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your business listing — Metalorix",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#D6B35A;margin-bottom:16px;">Metalorix</h2>
          <p>Hi,</p>
          <p>Thank you for registering <strong>${businessName}</strong> on Metalorix.</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#D6B35A;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
            Verify email
          </a>
          <p style="color:#666;font-size:13px;margin-top:24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Metalorix — Precious Metals Price Tracking</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Dealer submit error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
