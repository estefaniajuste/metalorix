import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { businessListings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@metalorix.com";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const [listing] = await db
    .select()
    .from(businessListings)
    .where(eq(businessListings.verificationToken, token))
    .limit(1);

  if (!listing) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
  }

  if (!listing.emailVerified) {
    await db
      .update(businessListings)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(businessListings.id, listing.id));

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
    const cronSecret = process.env.CRON_SECRET || "";
    const approveUrl = `${baseUrl}/api/admin/approve?type=business&id=${listing.id}&action=approve&token=${cronSecret}`;
    const rejectUrl = `${baseUrl}/api/admin/approve?type=business&id=${listing.id}&action=reject&token=${cronSecret}`;

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New business listing: ${listing.businessName} (${listing.city})`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:540px;margin:0 auto;padding:24px;">
          <h2 style="color:#D6B35A;">New Business Listing</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;color:#666;width:120px;">Business</td><td><strong>${listing.businessName}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666;">City</td><td>${listing.city}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Country</td><td>${listing.countryCode.toUpperCase()}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Email</td><td>${listing.email}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Type</td><td>${listing.type}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Metals</td><td>${listing.metals.join(", ")}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Services</td><td>${listing.services.join(", ")}</td></tr>
            ${listing.website ? `<tr><td style="padding:6px 0;color:#666;">Website</td><td><a href="${listing.website}">${listing.website}</a></td></tr>` : ""}
            ${listing.whatsapp ? `<tr><td style="padding:6px 0;color:#666;">WhatsApp</td><td>${listing.whatsapp}</td></tr>` : ""}
            ${listing.instagram ? `<tr><td style="padding:6px 0;color:#666;">Instagram</td><td>@${listing.instagram}</td></tr>` : ""}
            ${listing.description ? `<tr><td style="padding:6px 0;color:#666;">Description</td><td>${listing.description}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;display:flex;gap:12px;">
            <a href="${approveUrl}" style="display:inline-block;padding:10px 20px;background:#34D399;color:#000;text-decoration:none;border-radius:6px;font-weight:600;">
              Approve
            </a>
            <a href="${rejectUrl}" style="display:inline-block;padding:10px 20px;background:#F87171;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin-left:12px;">
              Reject
            </a>
          </div>
        </div>
      `,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
  return NextResponse.redirect(`${baseUrl}/en/where-to-buy/register?verified=true`);
}
