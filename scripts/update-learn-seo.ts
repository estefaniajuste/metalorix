/**
 * Update Learn article SEO (seoTitle, metaDescription) for CTR.
 * Run: npx tsx scripts/update-learn-seo.ts [seo-updates.json]
 * If no file: uses built-in defaults.
 * JSON format: [{ "slug": "...", "seoTitle": "...", "metaDescription": "..." }]
 * Requires: .env.local with DATABASE_URL
 */
import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });

const DEFAULT_UPDATES: { slug: string; seoTitle: string; metaDescription: string }[] = [
  {
    slug: "ppi-and-gold-correlation",
    seoTitle: "How Does PPI Affect Gold Prices? Producer Price Index Explained",
    metaDescription:
      "Learn how the Producer Price Index (PPI) impacts gold prices. PPI as a leading indicator for CPI, inflation expectations, and gold price direction.",
  },
  {
    slug: "coin-grading-scale-ms-pf",
    seoTitle: "Coin Grading Scale Explained: MS-70 to Good (Sheldon Scale)",
    metaDescription:
      "Decode the Sheldon 70-point coin grading scale — MS-70, PF-70, AG-3 to Good. How NGC and PCGS grades affect precious metals coin values.",
  },
  {
    slug: "hyperinflation-episodes-and-gold",
    seoTitle: "Gold in Hyperinflation: Weimar, Zimbabwe, Venezuela Performance",
    metaDescription:
      "How gold and silver performed during Weimar Germany, Zimbabwe, and Venezuela hyperinflation. Historical lessons for wealth preservation.",
  },
  {
    slug: "volatility-comparison-across-metals",
    seoTitle: "Gold vs Silver vs Platinum: Volatility Comparison (Data)",
    metaDescription:
      "Historical volatility comparison: gold, silver, platinum, palladium. Annualized vol, max daily moves, and how it affects position sizing.",
  },
];

function loadUpdates(): { slug: string; seoTitle: string; metaDescription: string }[] {
  const file = process.argv[2];
  if (!file) return DEFAULT_UPDATES;
  try {
    const raw = readFileSync(resolve(process.cwd(), file), "utf-8");
    const parsed = JSON.parse(raw) as { slug: string; seoTitle: string; metaDescription: string }[];
    if (!Array.isArray(parsed) || parsed.some((p) => !p.slug || !p.seoTitle || !p.metaDescription)) {
      throw new Error("Invalid JSON: expected [{ slug, seoTitle, metaDescription }]");
    }
    return parsed;
  } catch (e) {
    console.error("Failed to load:", file, e);
    process.exit(1);
  }
}

async function main() {
  const UPDATES = loadUpdates();
  const { getDb } = await import("../src/lib/db");
  const { learnArticles, learnArticleLocalizations } = await import("../src/lib/db/schema");
  const { eq, and } = await import("drizzle-orm");

  const db = getDb();
  if (!db) {
    console.error("No database connection");
    process.exit(1);
  }

  let updated = 0;
  for (const { slug, seoTitle, metaDescription } of UPDATES) {
    const rows = await db
      .select({
        locId: learnArticleLocalizations.id,
        currentTitle: learnArticleLocalizations.title,
      })
      .from(learnArticles)
      .innerJoin(
        learnArticleLocalizations,
        and(
          eq(learnArticleLocalizations.articleId, learnArticles.id),
          eq(learnArticleLocalizations.locale, "en")
        )
      )
      .where(eq(learnArticles.slug, slug))
      .limit(1);

    if (rows.length === 0) {
      console.warn(`Article not found: ${slug}`);
      continue;
    }

    await db
      .update(learnArticleLocalizations)
      .set({
        seoTitle: seoTitle.slice(0, 120),
        metaDescription: metaDescription.slice(0, 160),
        updatedAt: new Date(),
      })
      .where(eq(learnArticleLocalizations.id, rows[0].locId));

    console.log(`Updated: ${slug}`);
    console.log(`  seoTitle: ${seoTitle}`);
    console.log(`  metaDescription: ${metaDescription.slice(0, 60)}...`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated} articles.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
