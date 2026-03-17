import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  articles, articleTranslations, glossaryTerms,
  learnClusters, learnArticles, learnArticleLocalizations,
} from "@/lib/db/schema";
import { eq, desc, isNotNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const urls: Array<{
    slug: string;
    type: string;
    cluster?: string;
    lastmod?: string;
    localizedSlugs?: Record<string, string>;
  }> = [];

  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({ urls });
    }

    // --- News articles with localized slugs ---
    const allArticles = await db
      .select({ id: articles.id, slug: articles.slug, publishedAt: articles.publishedAt })
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(1000)
      .catch(() => []);

    const translationSlugs = allArticles.length > 0
      ? await db
          .select({
            articleId: articleTranslations.articleId,
            locale: articleTranslations.locale,
            slug: articleTranslations.slug,
          })
          .from(articleTranslations)
          .catch(() => [])
      : [];

    const slugsByArticle = new Map<number, Record<string, string>>();
    for (const ts of translationSlugs) {
      if (!ts.slug) continue;
      if (!slugsByArticle.has(ts.articleId)) slugsByArticle.set(ts.articleId, {});
      slugsByArticle.get(ts.articleId)![ts.locale] = ts.slug;
    }

    for (const a of allArticles) {
      urls.push({
        slug: a.slug,
        type: "article",
        lastmod: a.publishedAt ? new Date(a.publishedAt).toISOString().split("T")[0] : undefined,
        localizedSlugs: slugsByArticle.get(a.id),
      });
    }

    // --- Glossary: English slugs as canonical (no cross-locale FK) ---
    const terms = await db
      .select({ slug: glossaryTerms.slug })
      .from(glossaryTerms)
      .where(eq(glossaryTerms.locale, "en"))
      .limit(1000)
      .catch(() => []);

    for (const t of terms) {
      urls.push({ slug: t.slug, type: "glossary" });
    }

    // --- Clusters ---
    const clusters = await db
      .select({ slug: learnClusters.slug })
      .from(learnClusters)
      .limit(100)
      .catch(() => []);

    for (const c of clusters) {
      urls.push({ slug: c.slug, type: "cluster" });
    }

    // --- Learn articles with localized slugs ---
    const learnRows = await db
      .select({
        id: learnArticles.id,
        slug: learnArticles.slug,
        clusterSlug: learnClusters.slug,
      })
      .from(learnArticles)
      .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
      .where(isNotNull(learnArticles.publishedAt))
      .limit(1000)
      .catch(() => []);

    const learnLocRows = learnRows.length > 0
      ? await db
          .select({
            articleId: learnArticleLocalizations.articleId,
            locale: learnArticleLocalizations.locale,
            slug: learnArticleLocalizations.slug,
          })
          .from(learnArticleLocalizations)
          .catch(() => [])
      : [];

    const learnSlugsByArticle = new Map<number, Record<string, string>>();
    for (const lr of learnLocRows) {
      if (!lr.slug) continue;
      if (!learnSlugsByArticle.has(lr.articleId)) learnSlugsByArticle.set(lr.articleId, {});
      learnSlugsByArticle.get(lr.articleId)![lr.locale] = lr.slug;
    }

    for (const la of learnRows) {
      urls.push({
        slug: la.slug,
        type: "learn-article",
        cluster: la.clusterSlug,
        localizedSlugs: learnSlugsByArticle.get(la.id),
      });
    }
  } catch (err) {
    console.error("[sitemap-urls] DB error:", err);
  }

  return NextResponse.json({ urls });
}
