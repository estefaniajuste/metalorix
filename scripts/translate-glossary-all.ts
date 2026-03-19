/**
 * One-off script to translate all Spanish glossary terms to en/zh/ar/tr/de.
 * Run: npx tsx scripts/translate-glossary-all.ts
 * Requires: .env.local with DATABASE_URL and GEMINI_API_KEY
 */
import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const { translateGlossaryBatch } = await import("../src/lib/ai/glossary-generator");
  const { getDb } = await import("../src/lib/db");
  const { glossaryTerms } = await import("../src/lib/db/schema");
  const { eq, and, count } = await import("drizzle-orm");

  const db = getDb();
  if (!db) {
    console.error("No database connection");
    process.exit(1);
  }

  const [total] = await db
    .select({ n: count() })
    .from(glossaryTerms)
    .where(and(eq(glossaryTerms.locale, "es"), eq(glossaryTerms.published, true)));
  const n = total?.n ?? 0;
  console.log(`Found ${n} Spanish terms to translate`);

  if (n === 0) {
    console.log("Nothing to do");
    process.exit(0);
  }

  const translated = await translateGlossaryBatch(n);
  console.log(`Done. Created ${translated} new locale entries.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
