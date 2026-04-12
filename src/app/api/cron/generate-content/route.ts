import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { articles, articleTranslations, metalPrices, newsSources, learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, desc, gte, lt, and, like, not, inArray, notInArray, sql } from "drizzle-orm";
import {
  generateDailySummary,
  generateEveningSummary,
  generateEventArticle,
  generateNewsEventArticle,
  detectHighImpactNews,
  generateWeeklySummary,
  saveArticle,
  translateArticle,
  validateArticleQuality,
  backfillTranslationSlugs,
  fixArticleTranslationSlugs,
  type DailyGenerationLog,
  type ArticleQualityResult,
} from "@/lib/ai/content-generator";
import {
  generateNewGlossaryTerms,
  saveGlossaryTerm,
  expandTermsWithoutContent,
  getGlossaryTermCount,
} from "@/lib/ai/glossary-generator";
import { generateBatch, translateArticle as translateLearnArticle } from "@/lib/learn/generate";
import { getTopicBySlug } from "@/lib/learn/topics";
import { getLocalizedClusterSlug } from "@/lib/learn/slug-i18n";
import { sendWeeklyNewsletter } from "@/lib/email/newsletter";
import { sendEmail } from "@/lib/email/resend";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo/ping";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

const ADMIN_EMAIL = "estefaniajuste@gmail.com";
const EXPECTED_TRANSLATIONS = 6; // en, zh, ar, tr, de, hi

const CRON_SECRET = process.env.CRON_SECRET?.trim();
/** Event articles only for exceptional moves (≥5%). Normal 2-3% moves are covered in daily/evening. */
const EVENT_THRESHOLD_PCT = 5.0;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
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

  if (type === "evening") {
    try {
      const dateSlug = new Date().toISOString().slice(0, 10);
      const existingEvening = await db
        .select({ id: articles.id })
        .from(articles)
        .where(
          and(
            eq(articles.category, "daily"),
            like(articles.slug, `cierre-%-${dateSlug}`)
          )
        )
        .limit(1);
      if (existingEvening.length > 0) {
        generated.push(`evening: skipped (already exists for ${dateSlug})`);
      } else {
        const article = await generateEveningSummary(dailyLog);
        const quality = validateArticleQuality(article, "daily");
        if (!quality.passed) {
          dailyLog.saveError = `evening quality_rejected: ${quality.reasons.join("; ")}`;
          console.error("[Cron] Evening article REJECTED by quality gate:", quality.reasons);
        } else {
          let articleId = await saveArticle(article, "daily");
          if (!articleId) {
            console.warn("[Cron] saveArticle failed (evening), retrying once...");
            articleId = await saveArticle(article, "daily");
          }
          if (articleId) {
            generated.push(`evening: ${article.slug}`);
            articleIdsToTranslate.push(articleId);
            console.log(`[Cron] Evening article saved: ${article.slug} (id=${articleId})`);
          } else {
            dailyLog.saveError = "saveArticle failed (evening) after retry";
          }
        }
      }
    } catch (err) {
      dailyLog.saveError = err instanceof Error ? err.message : String(err);
      console.error("[Cron] Evening generation failed:", err);
    }
  }

  if (type === "daily" || type === "auto") {
    try {
      const dateSlugDaily = new Date().toISOString().slice(0, 10);
      const existingDailies = await db
        .select({ id: articles.id, slug: articles.slug })
        .from(articles)
        .where(
          and(
            eq(articles.category, "daily"),
            like(articles.slug, `%-${dateSlugDaily}`)
          )
        );
      const hasMorningDaily = existingDailies.some((a) => !a.slug.startsWith("cierre-"));
      if (hasMorningDaily && !replaceToday) {
        generated.push(`daily: skipped (already exists for ${dateSlugDaily})`);
      } else {
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
            .where(and(eq(articles.category, "daily"), like(articles.slug, pattern), not(like(articles.slug, "cierre-%"))))
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
      }
    } catch (err) {
      dailyLog.saveError = err instanceof Error ? err.message : String(err);
      console.error("[Cron] Daily generation failed:", err);
    }
  }

  if (type === "weekly" || (type === "auto" && new Date().getDay() === 0)) {
    const article = await generateWeeklySummary();
    if (article) {
      let articleId = await saveArticle(article, "weekly");
      if (!articleId) {
        console.warn("[Cron] saveArticle failed (weekly), retrying once...");
        articleId = await saveArticle(article, "weekly");
      }
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
      const now = new Date();
      const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

      const eventsToday = await db
        .select({ id: articles.id })
        .from(articles)
        .where(
          and(
            eq(articles.category, "event"),
            gte(articles.publishedAt, startOfToday),
            lt(articles.publishedAt, startOfTomorrow)
          )
        );
      const maxEventsPerDay = 2;
      if (eventsToday.length >= maxEventsPerDay) {
        generated.push(`event: skipped (max ${maxEventsPerDay}/day, already ${eventsToday.length})`);
      } else {
        let eventArticle: Awaited<ReturnType<typeof generateEventArticle>> = null;
        let eventSource = "";

        // Strategy 1: Check for high-impact news (central bank moves, repatriation, sanctions, etc.)
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        const recentNews = await db
          .select({
            title: newsSources.title,
            summary: newsSources.summary,
            url: newsSources.url,
            source: newsSources.source,
          })
          .from(newsSources)
          .where(gte(newsSources.scrapedAt, sixHoursAgo))
          .orderBy(desc(newsSources.scrapedAt))
          .limit(50);

        const highImpact = detectHighImpactNews(
          recentNews.map((n) => ({ ...n, summary: n.summary ?? "" }))
        );

        if (highImpact.length > 0) {
          const prices = await db.select().from(metalPrices);
          const priceData = prices.map((p) => ({
            symbol: p.symbol,
            name: p.name,
            price: parseFloat(p.priceUsd),
            change: parseFloat(p.change24h ?? "0"),
            changePct: parseFloat(p.changePct24h ?? "0"),
          }));

          const allNews = recentNews.map((n) => ({
            title: n.title,
            url: n.url,
            source: n.source,
            summary: n.summary ?? "",
            metals: null as string[] | null,
            sentiment: null as string | null,
          }));

          eventArticle = await generateNewsEventArticle(
            highImpact.slice(0, 3).map((n) => ({ title: n.title, summary: n.summary, url: n.url, source: n.source })),
            allNews,
            priceData
          );
          eventSource = `news-event (${highImpact[0].matchedPatterns.length} patterns: ${highImpact[0].title.slice(0, 60)})`;
          console.log(`[Cron] High-impact news detected: ${highImpact.length} items, top: "${highImpact[0].title.slice(0, 80)}"`);
        }

        // Strategy 2: Fallback to price-based events (≥5% move)
        if (!eventArticle) {
          const prices = await db.select().from(metalPrices);
          const candidates = prices
            .map((p) => ({
              symbol: p.symbol,
              changePct: parseFloat(p.changePct24h ?? "0"),
              priceUsd: parseFloat(p.priceUsd),
            }))
            .filter((p) => Math.abs(p.changePct) >= EVENT_THRESHOLD_PCT)
            .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));

          if (candidates.length > 0) {
            const top = candidates[0];
            eventArticle = await generateEventArticle(
              top.symbol,
              metalNames[top.symbol] ?? top.symbol,
              top.priceUsd,
              top.changePct
            );
            eventSource = `price-move (${top.symbol} ${top.changePct >= 0 ? "+" : ""}${top.changePct.toFixed(1)}%)`;
          }
        }

        if (eventArticle) {
          let articleId = await saveArticle(eventArticle, "event");
          if (!articleId) {
            console.warn("[Cron] saveArticle failed (event), retrying once...");
            articleId = await saveArticle(eventArticle, "event");
          }
          if (articleId) {
            generated.push(`event: ${eventArticle.slug} [${eventSource}]`);
            articleIdsToTranslate.push(articleId);
          }
        } else {
          generated.push("event: no triggers (no high-impact news, no price moves ≥5%)");
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

  // Regenerate translations for today's article (fixes wrong-language slugs)
  if (type === "regenerate_translations") {
    try {
      const dateSlug = new Date().toISOString().slice(0, 10);
      const pattern = `%-${dateSlug}`;
      const todayArticle = await db
        .select({ id: articles.id, slug: articles.slug })
        .from(articles)
        .where(and(eq(articles.category, "daily"), like(articles.slug, pattern)))
        .orderBy(desc(articles.publishedAt))
        .limit(1);
      if (todayArticle.length > 0) {
        await db.delete(articleTranslations).where(eq(articleTranslations.articleId, todayArticle[0].id));
        const count = await translateArticle(todayArticle[0].id);
        generated.push(`regenerated translations for article ${todayArticle[0].id}: ${count} languages`);
        articleIdsToTranslate.push(todayArticle[0].id);
      } else {
        generated.push("regenerate_translations: no daily article found for today");
      }
    } catch (err) {
      console.error("Regenerate translations failed:", err);
    }
  }

  if (type === "translate" || type === "backfill-slugs" || type === "fix_slugs") {
    try {
      const backfilled = await backfillTranslationSlugs();
      if (backfilled > 0) generated.push(`backfilled slugs: ${backfilled}`);
    } catch (err) {
      console.error("Slug backfill failed:", err);
    }

    if (type === "fix_slugs") {
      try {
        const fixed = await fixArticleTranslationSlugs();
        if (fixed > 0) generated.push(`fixed article slugs: ${fixed}`);
      } catch (err) {
        console.error("Fix article slugs failed:", err);
      }
    }

    if (type === "translate") {
      try {
        const translateLimit = Math.min(
          Math.max(1, parseInt(url.searchParams.get("limit") || "5", 10) || 5),
          100
        );
        const untranslated = await db
          .select({ id: articles.id })
          .from(articles)
          .where(eq(articles.published, true))
          .orderBy(desc(articles.publishedAt))
          .limit(translateLimit);

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

  // Learn articles: generate 3 new articles per run (08:00 and 16:00 UTC), only topics without content.
  // Pass ?slugs=slug1,slug2 to force-regenerate specific articles (ignores onlyMissing).
  if (type === "learn" || type === "auto") {
    try {
      const slugsParam = url.searchParams.get("slugs");
      const specificSlugs = slugsParam ? slugsParam.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
      const result = await generateBatch({
        batchId: `cron-${Date.now()}`,
        locale: "en",
        dryRun: false,
        limit: specificSlugs ? specificSlugs.length : 3,
        onlyMissing: !specificSlugs,
        slugs: specificSlugs,
      });
      if (result.succeeded > 0) {
        generated.push(`learn: ${result.succeeded}/${result.processed} articles generated`);
        const learnNewUrls: string[] = [];
        for (const r of result.results) {
          if (!r.success) continue;
          const topic = getTopicBySlug(r.slug);
          if (!topic) continue;
          for (const loc of routing.locales) {
            const clusterSlug = getLocalizedClusterSlug(topic.clusterSlug, loc);
            // Revalidate ISR cache so new content is visible immediately
            try { revalidatePath(`/${loc}/learn/${clusterSlug}/${r.slug}`); } catch { /* best-effort */ }
            learnNewUrls.push(`https://metalorix.com/${loc}/learn/${clusterSlug}/${r.slug}`);
          }
        }
        // Ping IndexNow so Google/Bing discover the new content fast
        if (learnNewUrls.length) await pingIndexNow(learnNewUrls);
      }
    } catch (err) {
      console.error("Learn article generation failed:", err);
    }
  }

  // Spanish learn translations: ensure published learn articles have es localization
  const PRIORITY_LOCALES = ["es", "de"];
  if (type === "translate-learn-es" || type === "auto") {
    for (const priorityLocale of PRIORITY_LOCALES) {
      try {
        const alreadyTranslated = db
          .select({ articleId: learnArticleLocalizations.articleId })
          .from(learnArticleLocalizations)
          .where(eq(learnArticleLocalizations.locale, priorityLocale));

        const pendingLearn = await db
          .select({ slug: learnArticles.slug })
          .from(learnArticles)
          .where(
            and(
              eq(learnArticles.status, "published"),
              notInArray(learnArticles.id, alreadyTranslated)
            )
          )
          .limit(5);

        if (pendingLearn.length > 0) {
          let translated = 0;
          for (const { slug } of pendingLearn) {
            const r = await translateLearnArticle(slug, priorityLocale);
            if (r.success) translated++;
            await new Promise((r) => setTimeout(r, 1500));
          }
          if (translated > 0) {
            generated.push(`learn-${priorityLocale}: ${translated}/${pendingLearn.length} articles translated`);
          }
        }
      } catch (err) {
        console.error(`Learn ${priorityLocale} translation failed:`, err);
      }
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

    const transRows = await db
      .select({ articleId: articleTranslations.articleId, locale: articleTranslations.locale, slug: articleTranslations.slug })
      .from(articleTranslations)
      .where(inArray(articleTranslations.articleId, articleIdsToTranslate));
    const slugsByArticle = new Map<number, Record<string, string>>();
    for (const r of transRows) {
      if (!r.slug) continue;
      if (!slugsByArticle.has(r.articleId)) slugsByArticle.set(r.articleId, {});
      slugsByArticle.get(r.articleId)![r.locale] = r.slug;
    }

    const newUrls: string[] = [];
    for (const id of articleIdsToTranslate) {
      const [art] = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.id, id)).limit(1);
      if (!art) continue;
      const locSlugs = slugsByArticle.get(id);
      for (const loc of routing.locales) {
        const slug = loc === "es" ? art.slug : (locSlugs?.[loc] ?? art.slug);
        const path = getPathname({ locale: loc, href: { pathname: "/noticias/[slug]", params: { slug } } as any });
        newUrls.push(`https://metalorix.com${path}`);
      }
    }
    if (newUrls.length) await pingIndexNow(newUrls);
  }

  // Alert admin by email if daily/evening generation or translations failed
  const dailyFailed = (type === "daily" || type === "evening" || type === "auto") && !!dailyLog.saveError;
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
  if (type === "daily" || type === "evening" || type === "auto") body.dailyLog = dailyLog;

  return NextResponse.json(body);
}
