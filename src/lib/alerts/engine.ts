import { getDb } from "@/lib/db";
import {
  metalPrices,
  alerts,
  alertHistory,
  users,
} from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";
import { priceAlertEmail, smartAlertEmail } from "@/lib/email/templates";

interface PriceSnapshot {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

const METAL_NAMES: Record<string, string> = {
  XAU: "Oro",
  XAG: "Plata",
  XPT: "Platino",
};

async function getPrices(): Promise<PriceSnapshot[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(metalPrices);
  return rows.map((r) => ({
    symbol: r.symbol,
    name: r.name,
    price: parseFloat(r.priceUsd),
    changePct: parseFloat(r.changePct24h ?? "0"),
  }));
}

async function getActiveAlerts() {
  const db = getDb();
  if (!db) return [];
  return db
    .select({
      alertId: alerts.id,
      userId: alerts.userId,
      symbol: alerts.symbol,
      alertType: alerts.alertType,
      threshold: alerts.threshold,
      lastTriggered: alerts.lastTriggered,
      email: users.email,
    })
    .from(alerts)
    .innerJoin(users, eq(alerts.userId, users.id))
    .where(eq(alerts.active, true));
}

async function recordTrigger(
  alertId: number,
  userId: number,
  message: string,
  price: number
) {
  const db = getDb();
  if (!db) return;
  const now = new Date();

  await db.insert(alertHistory).values({
    alertId,
    userId,
    message,
    priceAtTrigger: price.toFixed(4),
    triggeredAt: now,
  });

  await db
    .update(alerts)
    .set({ lastTriggered: now })
    .where(eq(alerts.id, alertId));
}

function shouldTrigger(
  alertType: string,
  threshold: number,
  price: number
): boolean {
  switch (alertType) {
    case "price_above":
      return price >= threshold;
    case "price_below":
      return price <= threshold;
    default:
      return false;
  }
}

function cooldownOk(lastTriggered: Date | null, hoursMin: number = 4): boolean {
  if (!lastTriggered) return true;
  const diff = Date.now() - new Date(lastTriggered).getTime();
  return diff > hoursMin * 60 * 60 * 1000;
}

export async function checkCustomAlerts(): Promise<number> {
  const prices = await getPrices();
  const priceMap = new Map(prices.map((p) => [p.symbol, p]));
  const activeAlerts = await getActiveAlerts();
  let triggered = 0;

  for (const alert of activeAlerts) {
    const metal = priceMap.get(alert.symbol);
    if (!metal) continue;
    if (!cooldownOk(alert.lastTriggered)) continue;

    const threshold = parseFloat(alert.threshold);
    if (!shouldTrigger(alert.alertType, threshold, metal.price)) continue;

    const conditionText =
      alert.alertType === "price_above"
        ? `Precio por encima de $${threshold.toFixed(2)}`
        : `Precio por debajo de $${threshold.toFixed(2)}`;

    const { subject, html } = priceAlertEmail({
      metalName: METAL_NAMES[alert.symbol] ?? alert.symbol,
      symbol: alert.symbol,
      currentPrice: metal.price,
      condition: conditionText,
      threshold,
    });

    const sent = await sendEmail({ to: alert.email, subject, html });
    if (sent) {
      await recordTrigger(alert.alertId, alert.userId, conditionText, metal.price);
      triggered++;
    }
  }

  return triggered;
}

export async function checkSmartAlerts(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const prices = await getPrices();
  if (prices.length === 0) return 0;

  let triggered = 0;

  // Check for big daily moves (>2%)
  const bigMovers = prices.filter((p) => Math.abs(p.changePct) >= 2);
  if (bigMovers.length > 0) {
    const allSubscribers = await db
      .select({ email: users.email, id: users.id })
      .from(users);

    if (allSubscribers.length > 0) {
      const moversText = bigMovers
        .map(
          (m) =>
            `${m.name} ${m.changePct > 0 ? "sube" : "cae"} un ${Math.abs(m.changePct).toFixed(1)}%`
        )
        .join(", ");

      const { subject, html } = smartAlertEmail({
        title: `Movimiento importante: ${moversText}`,
        description: `Se han detectado movimientos significativos en el mercado de metales preciosos. ${bigMovers.length > 1 ? "Varios metales se han movido" : "Un metal se ha movido"} más de un 2% en las últimas 24 horas.`,
        metals: prices.map((p) => ({
          name: p.name,
          symbol: p.symbol,
          price: p.price,
          changePct: p.changePct,
        })),
      });

      // Rate limit: check if we sent a smart alert in the last 4h
      const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
      const recentSmartAlerts = await db
        .select({ id: alertHistory.id })
        .from(alertHistory)
        .where(
          and(
            gte(alertHistory.triggeredAt, fourHoursAgo),
            sql`${alertHistory.message} LIKE 'SMART:%'`
          )
        )
        .limit(1);

      if (recentSmartAlerts.length === 0) {
        for (const sub of allSubscribers) {
          const sent = await sendEmail({ to: sub.email, subject, html });
          if (sent) triggered++;
        }

        // Record once for audit (alertId=null for smart alerts)
        await db.insert(alertHistory).values({
          alertId: null,
          userId: null,
          message: `SMART: ${moversText}`,
          priceAtTrigger: bigMovers[0].price.toFixed(4),
        });
      }
    }
  }

  return triggered;
}

export async function runAlertEngine(): Promise<{
  customTriggered: number;
  smartTriggered: number;
}> {
  const [customTriggered, smartTriggered] = await Promise.all([
    checkCustomAlerts(),
    checkSmartAlerts(),
  ]);
  return { customTriggered, smartTriggered };
}
