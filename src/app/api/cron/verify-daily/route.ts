import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, and, like, not } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";

const ADMIN_EMAIL = "estefaniajuste@gmail.com";
const CRON_SECRET = process.env.CRON_SECRET?.trim();
const SERVICE_URL = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";

/**
 * Verify that today's daily article exists. If not, generate it and alert admin.
 * Called by workflow at 09:00 UTC as final safety net.
 */
export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const dateSlug = new Date().toISOString().slice(0, 10);
  const existing = await db
    .select({ id: articles.id, slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.category, "daily"),
        like(articles.slug, `%-${dateSlug}`),
        not(like(articles.slug, "cierre-%"))
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({
      ok: true,
      dailyExists: true,
      slug: existing[0].slug,
      date: dateSlug,
    });
  }

  // Daily missing — ensure fresh data, then trigger generation
  const headers: Record<string, string> = {};
  if (CRON_SECRET) headers["Authorization"] = `Bearer ${CRON_SECRET}`;
  await fetch(`${SERVICE_URL}/api/cron/scrape-news`, { method: "POST", headers }).catch(() => {});
  await fetch(`${SERVICE_URL}/api/cron/scrape-prices`, { method: "POST", headers }).catch(() => {});

  const res = await fetch(`${SERVICE_URL}/api/cron/generate-content?type=daily`, {
    method: "POST",
    headers,
  });
  const body = await res.json().catch(() => ({}));

  if (res.status >= 400) {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Metalorix] Daily article MISSING — auto-generate failed (${dateSlug})`,
      html: `
        <h2>Daily article was missing and generation failed</h2>
        <p><strong>Date:</strong> ${dateSlug}</p>
        <p><strong>Status:</strong> ${res.status}</p>
        <pre>${JSON.stringify(body, null, 2)}</pre>
        <p>Check GitHub Actions and Cloud Run logs.</p>
      `,
    }).catch((err) => console.error("[verify-daily] Alert email failed:", err));

    return NextResponse.json(
      { ok: false, dailyExists: false, generated: false, error: body },
      { status: 503 }
    );
  }

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Metalorix] Daily article was missing — auto-generated via verify (${dateSlug})`,
    html: `
      <h2>Daily article was missing and has been auto-generated</h2>
      <p><strong>Date:</strong> ${dateSlug}</p>
      <p>The 07:00/08:00 run likely failed. Verify-daily at 09:00 recovered it.</p>
      <pre>${JSON.stringify(body, null, 2)}</pre>
    `,
  }).catch((err) => console.error("[verify-daily] Alert email failed:", err));

  return NextResponse.json({
    ok: true,
    dailyExists: false,
    generated: true,
    date: dateSlug,
    response: body,
  });
}
