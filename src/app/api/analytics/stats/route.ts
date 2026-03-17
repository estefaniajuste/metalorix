import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users, alerts, alertHistory } from "@/lib/db/schema";
import { count, gte, eq } from "drizzle-orm";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total users (suscriptores = alertas + newsletter)
    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);

    // Users by provider
    const usersByProvider = await db
      .select({ provider: users.provider, count: count() })
      .from(users)
      .groupBy(users.provider);

    // New users last 30 days
    const [newUsers30d] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));

    // New users last 7 days
    const [newUsers7d] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, sevenDaysAgo));

    // Total alerts
    const [totalAlerts] = await db
      .select({ count: count() })
      .from(alerts);

    // Active alerts
    const [activeAlerts] = await db
      .select({ count: count() })
      .from(alerts)
      .where(eq(alerts.active, true));

    // Alert triggers last 30 days
    const [triggers30d] = await db
      .select({ count: count() })
      .from(alertHistory)
      .where(gte(alertHistory.triggeredAt, thirtyDaysAgo));

    return NextResponse.json({
      generatedAt: now.toISOString(),
      source: "Database (no cookies required)",
      users: {
        total: totalUsers?.count ?? 0,
        byProvider: usersByProvider.reduce(
          (acc, r) => ({ ...acc, [r.provider ?? "email"]: r.count }),
          {} as Record<string, number>
        ),
        newLast30Days: newUsers30d?.count ?? 0,
        newLast7Days: newUsers7d?.count ?? 0,
      },
      alerts: {
        total: totalAlerts?.count ?? 0,
        active: activeAlerts?.count ?? 0,
        triggersLast30Days: triggers30d?.count ?? 0,
      },
      note: "Estos datos provienen de suscripciones a alertas/newsletter. No dependen de cookies ni Google Analytics.",
    });
  } catch (err) {
    console.error("Analytics stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
