/**
 * Translates Learn article seoTitle and metaDescription from English to es, zh, ar, tr, de.
 * Run: npx tsx scripts/translate-learn-seo.ts
 * Requires: .env.local with DATABASE_URL and GEMINI_API_KEY
 */
import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const TARGET_LOCALES = ["es", "zh", "ar", "tr", "de", "hi"] as const;
const SLUGS = [
  "ppi-and-gold-correlation",
  "coin-grading-scale-ms-pf",
  "hyperinflation-episodes-and-gold",
  "volatility-comparison-across-metals",
  "silver-chemical-symbol-ag",
  "gold-chemical-symbol-au",
  "troy-ounce-explained",
  "gold-volatility-index-gvz",
  "comparing-gold-etfs-in-europe",
  "vat-on-gold-in-the-eu",
  "gold-price-in-different-decades",
];

const LANGUAGE_NAMES: Record<string, string> = {
  es: "Spanish",
  zh: "Chinese (Simplified)",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
  hi: "Hindi",
};

function parseJson<T>(raw: string): T | null {
  try {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    return JSON.parse(m[0]) as T;
  } catch {
    return null;
  }
}

async function translateSeo(
  seoTitle: string,
  metaDescription: string,
  targetLocale: string
): Promise<{ seoTitle: string; metaDescription: string } | null> {
  const { generateText } = await import("../src/lib/ai/gemini");
  const langName = LANGUAGE_NAMES[targetLocale];
  if (!langName) return null;

  const prompt = `You are a professional translator for SEO content about precious metals and finance.

Translate the following SEO fields from English to ${langName}. Keep the same length constraints and CTR appeal.

ORIGINAL (English):
seoTitle: ${seoTitle}
metaDescription: ${metaDescription}

RULES:
- seoTitle: 50-65 chars, keyword-rich, concrete data when relevant
- metaDescription: 140-155 chars, include hook that invites clicks
- Preserve numbers, percentages, and proper nouns (PPI, MS-70, Sheldon, Weimar, Zimbabwe, Venezuela, etc.) as-is
- Translate naturally for ${langName} speakers
- Return ONLY valid JSON: { "seoTitle": "...", "metaDescription": "..." }`;

  const raw = await generateText(prompt);
  if (!raw) return null;

  const parsed = parseJson<{ seoTitle: string; metaDescription: string }>(raw);
  if (!parsed?.seoTitle || !parsed?.metaDescription) return null;

  // DB limits: seoTitle 120, metaDescription 160
  return {
    seoTitle: parsed.seoTitle.slice(0, 120),
    metaDescription: parsed.metaDescription.slice(0, 160),
  };
}

async function main() {
  const { getDb } = await import("../src/lib/db");
  const { learnArticles, learnArticleLocalizations } = await import("../src/lib/db/schema");
  const { eq, and } = await import("drizzle-orm");

  const db = getDb();
  if (!db) {
    console.error("No database connection");
    process.exit(1);
  }

  for (const slug of SLUGS) {
    const [enRow] = await db
      .select({
        articleId: learnArticles.id,
        seoTitle: learnArticleLocalizations.seoTitle,
        metaDescription: learnArticleLocalizations.metaDescription,
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

    if (!enRow?.seoTitle || !enRow?.metaDescription) {
      console.warn(`Skip ${slug}: no EN seoTitle/metaDescription`);
      continue;
    }

    console.log(`\n--- ${slug} ---`);

    for (const locale of TARGET_LOCALES) {
      const existing = await db
        .select({ id: learnArticleLocalizations.id, seoTitle: learnArticleLocalizations.seoTitle })
        .from(learnArticleLocalizations)
        .where(
          and(
            eq(learnArticleLocalizations.articleId, enRow.articleId),
            eq(learnArticleLocalizations.locale, locale)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        console.warn(`  ${locale}: no localization, skip`);
        continue;
      }

      const translated = await translateSeo(
        enRow.seoTitle,
        enRow.metaDescription,
        locale
      );

      if (!translated) {
        console.warn(`  ${locale}: translation failed`);
        continue;
      }

      await db
        .update(learnArticleLocalizations)
        .set({
          seoTitle: translated.seoTitle,
          metaDescription: translated.metaDescription,
          updatedAt: new Date(),
        })
        .where(eq(learnArticleLocalizations.id, existing[0].id));

      console.log(`  ${locale}: OK`);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
