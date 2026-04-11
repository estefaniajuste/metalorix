import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  articles, articleTranslations, glossaryTerms,
  learnClusters, learnArticles, learnArticleLocalizations,
} from "@/lib/db/schema";
import { eq, desc, isNotNull, inArray } from "drizzle-orm";

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

    // Run independent query groups in parallel
    const [allArticles, terms, clusters, learnRows] = await Promise.all([
      db.select({ id: articles.id, slug: articles.slug, publishedAt: articles.publishedAt })
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.publishedAt))
        .limit(1000)
        .catch(() => [] as { id: number; slug: string; publishedAt: Date | null }[]),

      db.select({ slug: glossaryTerms.slug })
        .from(glossaryTerms)
        .where(eq(glossaryTerms.locale, "en"))
        .limit(1000)
        .catch(() => [] as { slug: string }[]),

      db.select({ slug: learnClusters.slug })
        .from(learnClusters)
        .limit(100)
        .catch(() => [] as { slug: string }[]),

      db.select({ id: learnArticles.id, slug: learnArticles.slug, clusterSlug: learnClusters.slug })
        .from(learnArticles)
        .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
        .where(isNotNull(learnArticles.publishedAt))
        .limit(2000)
        .catch(() => [] as { id: number; slug: string; clusterSlug: string }[]),
    ]);

    // Fetch translations filtered by article IDs (parallel)
    const articleIds = allArticles.map((a) => a.id);
    const learnIds = learnRows.map((l) => l.id);

    const [translationSlugs, learnLocRows] = await Promise.all([
      articleIds.length > 0
        ? db.select({ articleId: articleTranslations.articleId, locale: articleTranslations.locale, slug: articleTranslations.slug })
            .from(articleTranslations)
            .where(inArray(articleTranslations.articleId, articleIds))
            .catch(() => [] as { articleId: number; locale: string; slug: string | null }[])
        : ([] as { articleId: number; locale: string; slug: string | null }[]),

      learnIds.length > 0
        ? db.select({ articleId: learnArticleLocalizations.articleId, locale: learnArticleLocalizations.locale, slug: learnArticleLocalizations.slug })
            .from(learnArticleLocalizations)
            .where(inArray(learnArticleLocalizations.articleId, learnIds))
            .catch(() => [] as { articleId: number; locale: string; slug: string | null }[])
        : ([] as { articleId: number; locale: string; slug: string | null }[]),
    ]);

    // --- News articles ---
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

    // --- Glossary ---
    for (const t of terms) urls.push({ slug: t.slug, type: "glossary" });

    // --- Clusters ---
    for (const c of clusters) urls.push({ slug: c.slug, type: "cluster" });

    // --- Learn articles ---
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

  return NextResponse.json({ urls }, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
  });
}
