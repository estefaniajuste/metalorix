import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, glossaryTerms, learnClusters, learnArticles } from "@/lib/db/schema";
import { eq, desc, isNotNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const urls: Array<{ slug: string; type: string; cluster?: string; lastmod?: string }> = [];

  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({ urls });
    }

    const allArticles = await db
      .select({ slug: articles.slug, publishedAt: articles.publishedAt })
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(1000)
      .catch(() => []);

    for (const a of allArticles) {
      urls.push({
        slug: a.slug,
        type: "article",
        lastmod: a.publishedAt ? new Date(a.publishedAt).toISOString().split("T")[0] : undefined,
      });
    }

    const terms = await db
      .select({ slug: glossaryTerms.slug })
      .from(glossaryTerms)
      .where(eq(glossaryTerms.locale, "en"))
      .limit(1000)
      .catch(() => []);

    for (const t of terms) {
      urls.push({ slug: t.slug, type: "glossary" });
    }

    const clusters = await db
      .select({ slug: learnClusters.slug })
      .from(learnClusters)
      .limit(100)
      .catch(() => []);

    for (const c of clusters) {
      urls.push({ slug: c.slug, type: "cluster" });
    }

    const learnRows = await db
      .select({ slug: learnArticles.slug, clusterSlug: learnClusters.slug })
      .from(learnArticles)
      .innerJoin(learnClusters, eq(learnArticles.clusterId, learnClusters.id))
      .where(isNotNull(learnArticles.publishedAt))
      .limit(1000)
      .catch(() => []);

    for (const la of learnRows) {
      urls.push({ slug: la.slug, type: "learn-article", cluster: la.clusterSlug });
    }
  } catch (err) {
    console.error("[sitemap-urls] DB error:", err);
  }

  return NextResponse.json({ urls });
}
