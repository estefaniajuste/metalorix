import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, articleTranslations, metalPrices } from "@/lib/db/schema";
import { eq, desc, gte, and, like } from "drizzle-orm";
import {
  generateDailySummary,
  generateEventArticle,
  generateWeeklySummary,
  saveArticle,
  translateArticle,
  validateArticleQuality,
  backfillTranslationSlugs,
  type DailyGenerationLog,
  type ArticleQualityResult,
} from "@/lib/ai/content-generator";
import {
  generateNewGlossaryTerms,
  saveGlossaryTerm,
  expandTermsWithoutContent,
  getGlossaryTermCount,
} from "@/lib/ai/glossary-generator";
import { generateBatch } from "@/lib/learn/generate";
import { sendWeeklyNewsletter } from "@/lib/email/newsletter";
import { sendEmail } from "@/lib/email/resend";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo/ping";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

const ADMIN_EMAIL = "estefaniajuste@gmail.com";
const EXPECTED_TRANSLATIONS = 5;

const CRON_SECRET = process.env.CRON_SECRET;
const EVENT_THRESHOLD_PCT = 2.0;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  let type = url.searchParams.get("type") || "daily";
  const replaceToday = url.searchParams.get("replace_today") === "1" || type === "replace_today";
  if (type === "replace_today") type = "daily";
  const generated: string[] = [];

  const articleIdsToTranslate: number[] = [];
  const dailyLog: DailyGenerationLog & { saveError?: string } = {
    pricesCount: 0,
    newsCount: 0,
    promptSizeBytes: 0,
    parseSuccess: false,
    usedFallback: "none",
  };

  if (type === "daily" || type === "auto") {
    try {
      if (replaceToday) {
        const base = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";
        const headers: Record<string, string> = {};
        if (CRON_SECRET) headers["Authorization"] = `Bearer ${CRON_SECRET}`;
        await fetch(`${base}/api/cron/scrape-news`, { method: "POST", headers }).catch(() => {});
        await fetch(`${base}/api/cron/scrape-prices`, { method: "POST", headers }).catch(() => {});

        const dateSlug = new Date().toISOString().slice(0, 10);
        const pattern = `%-${dateSlug}`;
        const toReplace = await db
          .select({ id: articles.id, slug: articles.slug })
          .from(articles)
          .where(and(eq(articles.category, "daily"), like(articles.slug, pattern)))
          .orderBy(desc(articles.publishedAt))
          .limit(1);
        if (toReplace.length > 0) {
          await db.delete(articleTranslations).where(eq(articleTranslations.articleId, toReplace[0].id));
          await db.delete(articles).where(eq(articles.id, toReplace[0].id));
          generated.push(`replaced: ${toReplace[0].slug}`);
          console.log(`[Cron] Replaced today's article: ${toReplace[0].slug}`);
        }
      }

      const article = await generateDailySummary(dailyLog);

      const quality = validateArticleQuality(article, "daily");
      if (!quality.passed) {
        dailyLog.saveError = `quality_rejected: ${quality.reasons.join("; ")}`;
        console.error("[Cron] Daily article REJECTED by quality gate:", quality.reasons);
      } else {
        let articleId = await saveArticle(article, "daily");
        if (!articleId) {
          console.warn("[Cron] saveArticle failed, retrying once...");
          articleId = await saveArticle(article, "daily");
        }
        if (articleId) {
          generated.push(`daily: ${article.slug}`);
          articleIdsToTranslate.push(articleId);
          console.log(`[Cron] Daily article saved: ${article.slug} (id=${articleId})`);
        } else {
          dailyLog.saveError = "saveArticle failed after retry";
          console.error("[Cron] Could not save daily article:", article.slug);
        }
      }
    } catch (err) {
      dailyLog.saveError = err instanceof Error ? err.message : String(err);
      console.error("[Cron] Daily generation failed:", err);
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

  const translationIssues: string[] = [];
  for (const articleId of articleIdsToTranslate) {
    let count = await translateArticle(articleId);
    if (count < EXPECTED_TRANSLATIONS) {
      console.warn(`[Cron] Only ${count}/${EXPECTED_TRANSLATIONS} translations, retrying...`);
      const extra = await translateArticle(articleId);
      count += extra;
    }
    if (count > 0) {
      generated.push(`translations: ${count} for article ${articleId}`);
    }
    if (count < EXPECTED_TRANSLATIONS) {
      const missing = EXPECTED_TRANSLATIONS - count;
      translationIssues.push(`article ${articleId}: ${missing} translations missing`);
      console.error(`[Cron] Article ${articleId}: only ${count}/${EXPECTED_TRANSLATIONS} translations.`);
    }
  }

  if (type === "translate" || type === "backfill-slugs") {
    try {
      const backfilled = await backfillTranslationSlugs();
      if (backfilled > 0) generated.push(`backfilled slugs: ${backfilled}`);
    } catch (err) {
      console.error("Slug backfill failed:", err);
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

  // Alert admin by email if daily generation or translations failed
  const dailyFailed = (type === "daily" || type === "auto") && !!dailyLog.saveError;
  const hasTranslationGaps = translationIssues.length > 0;

  if (dailyFailed || hasTranslationGaps) {
    const problems: string[] = [];
    if (dailyFailed) problems.push(`Daily article error: ${dailyLog.saveError}`);
    if (hasTranslationGaps) problems.push(...translationIssues);

    const subject = `[Metalorix] Content pipeline failed — ${new Date().toISOString().slice(0, 10)}`;
    const html = `
      <h2>Content Pipeline Alert</h2>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <h3>Problems:</h3>
      <ul>${problems.map((p) => `<li>${p}</li>`).join("")}</ul>
      <h3>Daily Log:</h3>
      <pre>${JSON.stringify(dailyLog, null, 2)}</pre>
      <p>Run the workflow with <code>content_type=replace_today</code> to regenerate.</p>
    `;
    await sendEmail({ to: ADMIN_EMAIL, subject, html }).catch((err) =>
      console.error("[Cron] Failed to send alert email:", err)
    );
    console.warn("[Cron] Alert email sent to admin about pipeline failure");
  }

  const body: Record<string, unknown> = {
    ok: true,
    type,
    generated,
    translationIssues: hasTranslationGaps ? translationIssues : undefined,
    newsletter: newsletterResult,
    ping: pingResult,
    timestamp: new Date().toISOString(),
  };
  if (type === "daily" || type === "auto") body.dailyLog = dailyLog;

  return NextResponse.json(body);
}
