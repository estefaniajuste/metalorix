/**
 * Syncs internal links from topics to DB for given article slugs.
 * Use when relatedSlugs in topics have been updated and articles already exist.
 * Run: npx tsx scripts/sync-internal-links.ts [slug1] [slug2] ...
 * Example: npx tsx scripts/sync-internal-links.ts ppi-and-gold-correlation hyperinflation-episodes-and-gold volatility-comparison-across-metals comparing-all-precious-metals-at-once
 * Requires: .env.local with DATABASE_URL
 */
import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const DEFAULT_SLUGS = [
  "ppi-and-gold-correlation",
  "hyperinflation-episodes-and-gold",
  "volatility-comparison-across-metals",
  "comparing-all-precious-metals-at-once",
];

async function main() {
  const slugs = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_SLUGS;

  const { getDb } = await import("../src/lib/db");
  const { learnArticles, learnInternalLinks } = await import("../src/lib/db/schema");
  const { suggestInternalLinks } = await import("../src/lib/learn/internal-links");
  const { eq } = await import("drizzle-orm");

  const db = getDb();
  if (!db) {
    console.error("No database connection");
    process.exit(1);
  }

  let inserted = 0;
  for (const slug of slugs) {
    const [article] = await db
      .select({ id: learnArticles.id })
      .from(learnArticles)
      .where(eq(learnArticles.slug, slug))
      .limit(1);

    if (!article) {
      console.warn(`Article not found: ${slug}`);
      continue;
    }

    const suggestions = suggestInternalLinks(slug, 6);
    for (const link of suggestions) {
      const [target] = await db
        .select({ id: learnArticles.id })
        .from(learnArticles)
        .where(eq(learnArticles.slug, link.targetSlug))
        .limit(1);

      if (!target) continue;

      try {
        await db.insert(learnInternalLinks).values({
          sourceArticleId: article.id,
          targetArticleId: target.id,
          linkType: link.linkType,
          relevanceScore: link.relevanceScore,
          anchor: link.suggestedAnchor,
        });
        console.log(`  + ${slug} → ${link.targetSlug}`);
        inserted++;
      } catch {
        // ignore duplicate (unique constraint)
      }
    }
  }

  console.log(`\nDone. Inserted ${inserted} new links.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
