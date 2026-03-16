import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, metalPrices } from "@/lib/db/schema";
import { eq, desc, gte } from "drizzle-orm";
import {
  generateDailySummary,
  generateEventArticle,
  generateWeeklySummary,
  saveArticle,
  translateArticle,
} from "@/lib/ai/content-generator";
import {
  generateNewGlossaryTerms,
  saveGlossaryTerm,
  expandTermsWithoutContent,
  getGlossaryTermCount,
} from "@/lib/ai/glossary-generator";
import { generateBatch } from "@/lib/learn/generate";
import { isConfigured } from "@/lib/ai/gemini";
import { sendWeeklyNewsletter } from "@/lib/email/newsletter";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo/ping";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

const CRON_SECRET = process.env.CRON_SECRET;
const EVENT_THRESHOLD_PCT = 2.0;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Gemini API not configured" },
      { status: 503 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "daily";
  const generated: string[] = [];

  const articleIdsToTranslate: number[] = [];
  const dailyDebug: { prices?: number; news?: number; error?: string } = {};

  if (type === "daily" || type === "auto") {
    try {
      const article = await generateDailySummary();
      if (article) {
        const articleId = await saveArticle(article, "daily");
        if (articleId) {
          generated.push(`daily: ${article.slug}`);
          articleIdsToTranslate.push(articleId);
        }
      } else {
        const { newsSources: ns } = await import("@/lib/db/schema");
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const [priceCount, newsCount] = await Promise.all([
          db.select().from(metalPrices).then((r) => r.length),
          db.select().from(ns).where(gte(ns.scrapedAt, since)).then((r) => r.length),
        ]);
        dailyDebug.prices = priceCount;
        dailyDebug.news = newsCount;
        dailyDebug.error = "generateDailySummary returned null (Gemini may have failed)";
      }
    } catch (err) {
      dailyDebug.error = err instanceof Error ? err.message : String(err);
    }
  }

  if (type === "weekly" || (type === "auto" && new Date().getDay() === 0)) {
    const article = await generateWeeklySummary();
    if (article) {
      const articleId = await saveArticle(article, "weekly");
      if (articleId) {
        generated.push(`weekly: ${article.slug}`);
        articleIdsToTranslate.push(articleId);
      }
    }
  }

  if (type === "event" || type === "auto") {
    const metalNames: Record<string, string> = {
      XAU: "Oro",
      XAG: "Plata",
      XPT: "Platino",
      XPD: "Paladio",
      HG: "Cobre",
    };

    try {
      const prices = await db.select().from(metalPrices);
      for (const p of prices) {
        const changePct = parseFloat(p.changePct24h ?? "0");
        if (Math.abs(changePct) >= EVENT_THRESHOLD_PCT) {
          const article = await generateEventArticle(
            p.symbol,
            metalNames[p.symbol] ?? p.symbol,
            parseFloat(p.priceUsd),
            changePct
          );
          if (article) {
            const articleId = await saveArticle(article, "event");
            if (articleId) {
              generated.push(`event: ${article.slug}`);
              articleIdsToTranslate.push(articleId);
            }
          }
        }
      }
    } catch (err) {
      console.error("Event article check failed:", err);
    }
  }

  for (const articleId of articleIdsToTranslate) {
    const count = await translateArticle(articleId);
    if (count > 0) generated.push(`translations: ${count} for article ${articleId}`);
  }

  if (type === "translate") {
    try {
      const untranslated = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.publishedAt))
        .limit(5);

      for (const { id } of untranslated) {
        const count = await translateArticle(id);
        if (count > 0) generated.push(`translated article ${id}: ${count} languages`);
      }
    } catch (err) {
      console.error("Bulk translation failed:", err);
    }
  }

  // Glossary: generate new terms and expand existing ones
  if (type === "glossary" || type === "auto") {
    const MAX_TERMS = 1000;
    const termCount = await getGlossaryTermCount();

    if (termCount < MAX_TERMS) {
      const newTerms = await generateNewGlossaryTerms(5);
      for (const term of newTerms) {
        const ok = await saveGlossaryTerm(term);
        if (ok) generated.push(`glossary-new: ${term.slug}`);
      }
    }

    const expanded = await expandTermsWithoutContent(3);
    if (expanded > 0) {
      generated.push(`glossary-expanded: ${expanded} terms`);
    }
  }

  // Learn articles: generate a small batch daily to fill the learn section
  if (type === "learn" || type === "auto") {
    try {
      const result = await generateBatch({
        batchId: `cron-${Date.now()}`,
        locale: "en",
        dryRun: false,
      });
      if (result.succeeded > 0) {
        generated.push(`learn: ${result.succeeded}/${result.processed} articles generated`);
      }
    } catch (err) {
      console.error("Learn article generation failed:", err);
    }
  }

  // Newsletter: send on Sundays or when explicitly requested
  let newsletterResult = null;
  if (type === "newsletter" || (type === "auto" && new Date().getDay() === 0)) {
    newsletterResult = await sendWeeklyNewsletter();
    if (newsletterResult.sent > 0) {
      generated.push(`newsletter: ${newsletterResult.sent} emails sent`);
    }
  }

  // Ping search engines when new content was generated
  let pingResult = null;
  if (articleIdsToTranslate.length > 0) {
    pingResult = await pingSearchEngines();

    const slugs: string[] = [];
    for (const id of articleIdsToTranslate) {
      try {
        const rows = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.id, id)).limit(1);
        if (rows[0]) slugs.push(rows[0].slug);
      } catch { /* skip */ }
    }

    const newUrls: string[] = [];
    for (const slug of slugs) {
      for (const loc of routing.locales) {
        const path = getPathname({ locale: loc, href: { pathname: "/noticias/[slug]", params: { slug } } as any });
        newUrls.push(`https://metalorix.com${path}`);
      }
    }
    if (newUrls.length) await pingIndexNow(newUrls);
  }

  const body: Record<string, unknown> = {
    ok: true,
    type,
    generated,
    newsletter: newsletterResult,
    ping: pingResult,
    timestamp: new Date().toISOString(),
  };
  if (Object.keys(dailyDebug).length > 0) body.dailyDebug = dailyDebug;
  return NextResponse.json(body);
}
