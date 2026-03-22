/**
 * Fix article_translations where en/de/tr use Spanish slug instead of localized.
 * Run: npx tsx scripts/fix-article-slugs.ts
 * Requires: .env.local with DATABASE_URL and GEMINI_API_KEY
 */
import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const { fixArticleTranslationSlugs } = await import("../src/lib/ai/content-generator");

  const fixed = await fixArticleTranslationSlugs();
  console.log(`\nDone. Fixed ${fixed} article translation slugs.`);
  if (fixed > 0) {
    console.log("Deploy or wait for next index ping for Google to pick up new URLs.");
    console.log("Consider adding redirects from old Spanish slugs to new slugs in middleware.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
