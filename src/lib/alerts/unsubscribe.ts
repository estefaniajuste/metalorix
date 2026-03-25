import { createHmac } from "crypto";

export function buildUnsubscribeUrl(userId: number, email: string): string {
  const secret = process.env.CRON_SECRET || "metalorix-dev-secret";
  const token = createHmac("sha256", secret).update(`${userId}:${email}`).digest("hex");
  const base = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
  return `${base}/api/unsubscribe?uid=${userId}&token=${token}`;
}

export function validateUnsubscribeToken(userId: number, email: string, token: string): boolean {
  const secret = process.env.CRON_SECRET || "metalorix-dev-secret";
  const expected = createHmac("sha256", secret).update(`${userId}:${email}`).digest("hex");
  return token === expected;
}
