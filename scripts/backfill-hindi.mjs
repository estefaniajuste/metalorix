#!/usr/bin/env node
/**
 * Backfill Hindi content for News and Learn.
 *
 * News: Translates all published articles to Hindi (via translate-articles.mjs).
 * Learn: Calls /api/learn/generate to translate Learn articles to Hindi in batches.
 *
 * Usage:
 *   node scripts/backfill-hindi.mjs
 *   # Loads .env.local automatically. Requires DATABASE_URL, GEMINI_API_KEY, CRON_SECRET
 */
import { config } from "dotenv";
import { spawnSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

config({ path: resolve(ROOT, ".env.local") });

const SERVICE_URL = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
const LEARN_AUTH =
  process.env.LEARN_API_KEY?.trim() || process.env.CRON_SECRET?.trim();
const BATCH_SIZE = 25;
const MAX_LEARN_ITERATIONS = 20;

async function runNewsBackfill() {
  console.log("\n📰 NEWS: Translating articles to Hindi (and any missing locales)...\n");
  const result = spawnSync(
    "node",
    ["scripts/translate-articles.mjs"],
    { cwd: ROOT, stdio: "inherit", env: process.env }
  );
  if (result.status !== 0) {
    throw new Error(`News backfill exited with code ${result.status}`);
  }
}

async function runLearnBackfill() {
  if (!LEARN_AUTH) {
    console.warn(
      "\n⚠️  LEARN: Skipped (LEARN_API_KEY o CRON_SECRET no definidos en .env.local)."
    );
    return;
  }

  console.log("\n📚 LEARN: Translating articles to Hindi...\n");

  let iteration = 0;
  let totalTranslated = 0;
  let remaining = 1;

  while (remaining > 0 && iteration < MAX_LEARN_ITERATIONS) {
    iteration++;
    const res = await fetch(`${SERVICE_URL}/api/learn/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LEARN_AUTH}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "translate",
        locale: "hi",
        batchSize: BATCH_SIZE,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 401) {
        throw new Error(
          `Learn API 401: La clave (LEARN_API_KEY o CRON_SECRET) en .env.local no coincide con la de producción. Verifica que sea la misma que en GitHub Secrets.`
        );
      }
      throw new Error(`Learn API ${res.status}: ${text}`);
    }

    const data = await res.json();
    const translated = data.translated ?? 0;
    remaining = data.remaining ?? 0;
    totalTranslated += translated;

    console.log(`  Iteration ${iteration}: translated ${translated}, remaining ${remaining}`);

    if (remaining === 0) break;

    // Rate limit: wait before next batch (API has 1.5s per article internally)
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n✅ Learn: ${totalTranslated} articles translated to Hindi in ${iteration} iterations.`);
}

async function main() {
  console.log("=== Metalorix Hindi Backfill ===\n");

  try {
    await runNewsBackfill();
    await runLearnBackfill();
    console.log("\n✅ Backfill complete.\n");
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();
