#!/usr/bin/env node
/**
 * Obtener estadísticas de analytics desde la base de datos (sin cookies).
 * Uso: node scripts/analytics-stats.mjs
 * Requiere: DATABASE_URL o DB_* en .env.local
 */
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL en .env.local");
  process.exit(1);
}

const sql = postgres(url);

async function main() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [usersTotal] = await sql`SELECT count(*)::int as c FROM users`;
  const usersByProvider = await sql`
    SELECT provider, count(*)::int as c FROM users GROUP BY provider
  `;
  const [new30] = await sql`SELECT count(*)::int as c FROM users WHERE created_at >= ${thirtyDaysAgo}`;
  const [new7] = await sql`SELECT count(*)::int as c FROM users WHERE created_at >= ${sevenDaysAgo}`;
  const [alertsTotal] = await sql`SELECT count(*)::int as c FROM alerts`;
  const [alertsActive] = await sql`SELECT count(*)::int as c FROM alerts WHERE active = true`;
  const [triggers30] = await sql`SELECT count(*)::int as c FROM alert_history WHERE triggered_at >= ${thirtyDaysAgo}`;

  const byProvider = Object.fromEntries(
    usersByProvider.map((r) => [r.provider || "email", r.c])
  );

  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: "Database (no cookies)",
    users: {
      total: usersTotal?.c ?? 0,
      byProvider,
      newLast30Days: new30?.c ?? 0,
      newLast7Days: new7?.c ?? 0,
    },
    alerts: {
      total: alertsTotal?.c ?? 0,
      active: alertsActive?.c ?? 0,
      triggersLast30Days: triggers30?.c ?? 0,
    },
  }, null, 2));

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
