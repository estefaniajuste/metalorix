import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { businessListings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");
  const action = req.nextUrl.searchParams.get("action");

  if (!type || !id || !action || !["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "Missing or invalid params (type, id, action)" },
      { status: 400 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  if (type === "business") {
    const [listing] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, Number(id)))
      .limit(1);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    await db
      .update(businessListings)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(businessListings.id, listing.id));

    if (action === "approve") {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
      await sendEmail({
        to: listing.email,
        subject: "Your business is now live on Metalorix!",
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h2 style="color:#D6B35A;">Metalorix</h2>
            <p>Great news! <strong>${listing.businessName}</strong> has been approved and is now live on Metalorix.</p>
            <p>Your listing is visible to thousands of precious metals buyers worldwide.</p>
            <a href="${baseUrl}" style="display:inline-block;padding:12px 24px;background:#D6B35A;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
              View your listing
            </a>
            <p style="color:#666;font-size:13px;margin-top:16px;">Share your page with your customers to increase visibility!</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="color:#999;font-size:12px;">Metalorix — Precious Metals Price Tracking</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      ok: true,
      action: newStatus,
      business: listing.businessName,
    });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, id, action } = body;

  const url = new URL(req.url);
  url.searchParams.set("type", type);
  url.searchParams.set("id", String(id));
  url.searchParams.set("action", action);
  url.searchParams.set("token", cronSecret);

  const fakeReq = new NextRequest(url);
  return GET(fakeReq);
}
