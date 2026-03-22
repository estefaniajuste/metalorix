#!/usr/bin/env node
/**
 * Verifies that CRON_SECRET (or LEARN_API_KEY) in .env.local matches production.
 * Run: node scripts/verify-cron-secret.mjs
 */
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

config({ path: resolve(ROOT, ".env.local") });

const AUTH = process.env.LEARN_API_KEY?.trim() || process.env.CRON_SECRET?.trim();
const URL = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";

async function main() {
  if (!AUTH) {
    console.error("❌ CRON_SECRET o LEARN_API_KEY no están definidos en .env.local");
    process.exit(1);
  }

  console.log("Verificando credenciales contra producción...");
  const res = await fetch(`${URL}/api/learn/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AUTH}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "stats" }),
  });

  if (res.ok) {
    const data = await res.json();
    console.log("✅ Credenciales correctas. Producción accesible.");
    if (data.localizations) {
      const hiCount = data.localizations?.find((l) => l.locale === "hi")?.count ?? 0;
      console.log(`   Learn artículos en Hindi: ${hiCount}`);
    }
  } else {
    console.error("❌ Credenciales incorrectas (HTTP", res.status + ")");
    console.error("   La clave en .env.local no coincide con GitHub Secrets.");
    console.error("   Copia el valor exacto de CRON_SECRET desde:");
    console.error("   GitHub → Repo → Settings → Secrets and variables → Actions");
    process.exit(1);
  }
}

main();
