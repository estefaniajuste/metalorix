import { getDb } from "@/lib/db";
import { learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

interface LocalizedTitle {
  title: string;
  summary: string;
}

/**
 * Batch-load localized article titles/summaries for a set of slugs.
 * Falls back to English if the requested locale isn't available.
 * Returns a Map<slug, {title, summary}>.
 */
export async function getLocalizedArticleTitles(
  slugs: string[],
  locale: string
): Promise<Map<string, LocalizedTitle>> {
  const result = new Map<string, LocalizedTitle>();
  if (slugs.length === 0) return result;

  const db = getDb();
  if (!db) return result;

  try {
    const articles = await db
      .select({
        slug: learnArticles.slug,
        title: learnArticleLocalizations.title,
        summary: learnArticleLocalizations.summary,
        locale: learnArticleLocalizations.locale,
      })
      .from(learnArticles)
      .innerJoin(
        learnArticleLocalizations,
        eq(learnArticleLocalizations.articleId, learnArticles.id)
      )
      .where(
        and(
          inArray(learnArticles.slug, slugs),
          inArray(learnArticleLocalizations.locale, [locale, "en"])
        )
      );

    const bySlug = new Map<string, { preferred?: LocalizedTitle; fallback?: LocalizedTitle }>();

    for (const row of articles) {
      const entry = bySlug.get(row.slug) ?? {};
      const data = { title: row.title, summary: row.summary };
      if (row.locale === locale) {
        entry.preferred = data;
      } else {
        entry.fallback = data;
      }
      bySlug.set(row.slug, entry);
    }

    bySlug.forEach((entry, slug) => {
      result.set(slug, entry.preferred ?? entry.fallback!);
    });
  } catch {
    // DB unavailable — callers use English fallback from topic definitions
  }

  return result;
}
