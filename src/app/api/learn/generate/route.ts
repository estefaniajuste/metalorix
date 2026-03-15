import { NextResponse } from "next/server";
import { generateBatch, seedTaxonomy, seedTags, translateArticle } from "@/lib/learn/generate";
import { getDb } from "@/lib/db";
import { learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and, notInArray, sql } from "drizzle-orm";

export const maxDuration = 300;

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.LEARN_API_KEY || process.env.CRON_SECRET;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "seed") {
      const taxResult = await seedTaxonomy();
      const tagCount = await seedTags();
      return NextResponse.json({
        success: true,
        taxonomy: taxResult,
        tags: tagCount,
      });
    }

    if (action === "generate") {
      const result = await generateBatch({
        batchId: body.batchId || `api-${Date.now()}`,
        slugs: body.slugs,
        clusterSlug: body.cluster,
        difficulty: body.difficulty,
        locale: "en",
        dryRun: body.dryRun || false,
      });
      return NextResponse.json({ success: true, ...result });
    }

    if (action === "translate") {
      const targetLocale = body.locale as string;
      const batchSize = Math.min(body.batchSize || 25, 50);

      if (!targetLocale || targetLocale === "en") {
        return NextResponse.json(
          { error: "Provide a target locale (not 'en')" },
          { status: 400 }
        );
      }

      const db = getDb();
      if (!db) {
        return NextResponse.json(
          { error: "Database not available" },
          { status: 503 }
        );
      }

      const alreadyTranslated = db
        .select({ articleId: learnArticleLocalizations.articleId })
        .from(learnArticleLocalizations)
        .where(eq(learnArticleLocalizations.locale, targetLocale));

      const pending = await db
        .select({ slug: learnArticles.slug })
        .from(learnArticles)
        .where(
          and(
            eq(learnArticles.status, "published"),
            notInArray(learnArticles.id, alreadyTranslated)
          )
        )
        .limit(batchSize);

      const results: { slug: string; ok: boolean; error?: string }[] = [];
      for (const { slug } of pending) {
        const r = await translateArticle(slug, targetLocale);
        results.push({ slug, ok: r.success, error: r.error });
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const totalRemaining = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(learnArticles)
        .where(
          and(
            eq(learnArticles.status, "published"),
            notInArray(learnArticles.id, db
              .select({ articleId: learnArticleLocalizations.articleId })
              .from(learnArticleLocalizations)
              .where(eq(learnArticleLocalizations.locale, targetLocale)))
          )
        );

      return NextResponse.json({
        success: true,
        locale: targetLocale,
        translated: results.filter((r) => r.ok).length,
        failed: results.filter((r) => !r.ok).length,
        remaining: totalRemaining[0]?.count ?? 0,
        results,
      });
    }

    if (action === "publish-all") {
      const db = getDb();
      if (!db) {
        return NextResponse.json(
          { error: "Database not available" },
          { status: 503 }
        );
      }

      const result = await db
        .update(learnArticles)
        .set({
          status: "published",
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(learnArticles.status, "review"),
          )
        );

      return NextResponse.json({
        success: true,
        message: "All review articles published",
      });
    }

    if (action === "stats") {
      const db = getDb();
      if (!db) {
        return NextResponse.json(
          { error: "Database not available" },
          { status: 503 }
        );
      }

      const statuses = await db
        .select({
          status: learnArticles.status,
          count: sql<number>`count(*)::int`,
        })
        .from(learnArticles)
        .groupBy(learnArticles.status);

      const locales = await db
        .select({
          locale: learnArticleLocalizations.locale,
          count: sql<number>`count(*)::int`,
        })
        .from(learnArticleLocalizations)
        .groupBy(learnArticleLocalizations.locale);

      return NextResponse.json({
        success: true,
        articles: statuses,
        localizations: locales,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'seed', 'generate', 'translate', 'publish-all', or 'stats'." },
      { status: 400 }
    );
  } catch (err) {
    console.error("Learn API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
