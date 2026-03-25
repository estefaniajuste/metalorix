import { getDb } from "@/lib/db";
import {
  metalPrices,
  priceHistory,
  alerts,
  alertHistory,
  users,
} from "@/lib/db/schema";
import { eq, and, gte, lte, sql, max, min, ne } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";
import { priceAlertEmail, smartAlertEmail, week52AlertEmail, ratioAlertEmail } from "@/lib/email/templates";
import { buildUnsubscribeUrl } from "@/app/api/unsubscribe/route";

interface PriceSnapshot {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

const METAL_NAMES: Record<string, Record<string, string>> = {
  XAU: { es: "Oro", en: "Gold" },
  XAG: { es: "Plata", en: "Silver" },
  XPT: { es: "Platino", en: "Platinum" },
  XPD: { es: "Paladio", en: "Palladium" },
  HG:  { es: "Cobre", en: "Copper" },
};

function metalName(symbol: string, locale: string = "es"): string {
  return METAL_NAMES[symbol]?.[locale] || METAL_NAMES[symbol]?.es || symbol;
}

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
    .where(and(eq(alerts.active, true), eq(users.unsubscribed, false)));
}

async function getSubscribers() {
  const db = getDb();
  if (!db) return [];
  return db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.unsubscribed, false));
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

    const locale: string = "es";
    const conditionText =
      alert.alertType === "price_above"
        ? (locale === "en" ? `Price above $${threshold.toFixed(2)}` : `Precio por encima de $${threshold.toFixed(2)}`)
        : (locale === "en" ? `Price below $${threshold.toFixed(2)}` : `Precio por debajo de $${threshold.toFixed(2)}`);

    const unsubUrl = buildUnsubscribeUrl(alert.userId, alert.email);
    const { subject, html } = priceAlertEmail({
      metalName: metalName(alert.symbol, locale),
      symbol: alert.symbol,
      currentPrice: metal.price,
      condition: conditionText,
      threshold,
      locale,
      unsubscribeUrl: unsubUrl,
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
    const allSubscribers = await getSubscribers();

    if (allSubscribers.length > 0) {
      const moversText = bigMovers
        .map(
          (m) =>
            `${metalName(m.symbol)} ${m.changePct > 0 ? "+" : ""}${Math.abs(m.changePct).toFixed(1)}%`
        )
        .join(", ");

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
          const unsubUrl = buildUnsubscribeUrl(sub.id, sub.email);
          const { subject, html } = smartAlertEmail({
            title: moversText,
            description: `Significant moves detected in the precious metals market in the last 24 hours.`,
            metals: prices.map((p) => ({
              name: metalName(p.symbol),
              symbol: p.symbol,
              price: p.price,
              changePct: p.changePct,
            })),
            unsubscribeUrl: unsubUrl,
          });
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

export async function check52WeekAlerts(): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  const prices = await getPrices();
  if (prices.length === 0) return 0;

  const subscribers = await getSubscribers();
  if (subscribers.length === 0) return 0;

  const since52w = new Date(Date.now() - 52 * 7 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let triggered = 0;

  for (const metal of prices) {
    const [stats] = await db
      .select({
        high: max(priceHistory.priceUsd),
        low: min(priceHistory.priceUsd),
      })
      .from(priceHistory)
      .where(and(eq(priceHistory.symbol, metal.symbol), gte(priceHistory.timestamp, since52w)));

    if (!stats?.high || !stats?.low) continue;
    const high52 = parseFloat(stats.high);
    const low52 = parseFloat(stats.low);

    const isHigh = metal.price >= high52;
    const isLow = metal.price <= low52;
    if (!isHigh && !isLow) continue;

    const marker = `52W_${isHigh ? "HIGH" : "LOW"}_${metal.symbol}`;
    const recent = await db
      .select({ id: alertHistory.id })
      .from(alertHistory)
      .where(and(gte(alertHistory.triggeredAt, oneDayAgo), sql`${alertHistory.message} LIKE ${`${marker}:%`}`))
      .limit(1);
    if (recent.length > 0) continue;

    for (const sub of subscribers) {
      const unsubUrl = buildUnsubscribeUrl(sub.id, sub.email);
      const { subject, html } = week52AlertEmail({
        metalName: metalName(metal.symbol),
        symbol: metal.symbol,
        currentPrice: metal.price,
        weekRecord: isHigh ? high52 : low52,
        isHigh,
        unsubscribeUrl: unsubUrl,
      });
      const sent = await sendEmail({ to: sub.email, subject, html });
      if (sent) triggered++;
    }

    await db.insert(alertHistory).values({
      alertId: null,
      userId: null,
      message: `${marker}: ${metal.price.toFixed(2)}`,
      priceAtTrigger: metal.price.toFixed(4),
    });
  }

  return triggered;
}

export async function checkRatioAlert(): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  const prices = await getPrices();
  const xau = prices.find((p) => p.symbol === "XAU");
  const xag = prices.find((p) => p.symbol === "XAG");
  if (!xau || !xag || xag.price === 0) return 0;

  const ratio = xau.price / xag.price;
  const isHigh = ratio >= 88;
  const isLow = ratio <= 55;
  if (!isHigh && !isLow) return 0;

  const subscribers = await getSubscribers();
  if (subscribers.length === 0) return 0;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const marker = `RATIO_${isHigh ? "HIGH" : "LOW"}`;
  const recent = await db
    .select({ id: alertHistory.id })
    .from(alertHistory)
    .where(and(gte(alertHistory.triggeredAt, oneDayAgo), sql`${alertHistory.message} LIKE ${`${marker}:%`}`))
    .limit(1);
  if (recent.length > 0) return 0;

  let triggered = 0;
  for (const sub of subscribers) {
    const unsubUrl = buildUnsubscribeUrl(sub.id, sub.email);
    const { subject, html } = ratioAlertEmail({
      currentRatio: ratio,
      xauPrice: xau.price,
      xagPrice: xag.price,
      isHigh,
      unsubscribeUrl: unsubUrl,
    });
    const sent = await sendEmail({ to: sub.email, subject, html });
    if (sent) triggered++;
  }

  await db.insert(alertHistory).values({
    alertId: null,
    userId: null,
    message: `${marker}: ${ratio.toFixed(2)}`,
    priceAtTrigger: xau.price.toFixed(4),
  });

  return triggered;
}

export async function runAlertEngine(): Promise<{
  customTriggered: number;
  smartTriggered: number;
  week52Triggered: number;
  ratioTriggered: number;
}> {
  const [customTriggered, smartTriggered, week52Triggered, ratioTriggered] = await Promise.all([
    checkCustomAlerts(),
    checkSmartAlerts(),
    check52WeekAlerts(),
    checkRatioAlert(),
  ]);
  return { customTriggered, smartTriggered, week52Triggered, ratioTriggered };
}
