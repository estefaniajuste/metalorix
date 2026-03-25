import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and, isNotNull, ne } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET?.trim();

const LOCALE_NAMES: Record<string, string> = {
  es: "Spanish",
  de: "German",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  hi: "Hindi",
};

const TARGET_LOCALES = Object.keys(LOCALE_NAMES);

async function translateFaqItems(
  faqJson: string,
  targetLocale: string
): Promise<string | null> {
  try {
    const items = JSON.parse(faqJson);
    if (!Array.isArray(items) || items.length === 0) return null;
  } catch {
    return null;
  }

  const localeName = LOCALE_NAMES[targetLocale] || targetLocale;

  const prompt = `Translate these FAQ items to ${localeName}. Keep technical terms (ETF, PCGS, NGC, LBMA, etc.) untranslated.

Return ONLY a JSON array, no markdown blocks:
[{"question": "translated question", "answer": "translated answer"}, ...]

ENGLISH FAQ:
${faqJson}`;

  const raw = await generateText(prompt);
  if (!raw) return null;

  try {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    if (!parsed[0].question || !parsed[0].answer) return null;
    return JSON.stringify(parsed);
  } catch {
    return null;
  }
}

/**
 * One-time batch endpoint to retranslate English FAQ data in
 * learn_article_localizations to all non-English locales.
 *
 * POST /api/seo/retranslate-faq?limit=10
 */
export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "No database" }, { status: 500 });
  }

  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10) || 10),
    50
  );

  const englishWithFaq = await db
    .select({
      articleId: learnArticleLocalizations.articleId,
      faq: learnArticleLocalizations.faq,
      slug: learnArticles.slug,
    })
    .from(learnArticleLocalizations)
    .innerJoin(
      learnArticles,
      eq(learnArticles.id, learnArticleLocalizations.articleId)
    )
    .where(
      and(
        eq(learnArticleLocalizations.locale, "en"),
        isNotNull(learnArticleLocalizations.faq),
        ne(learnArticleLocalizations.faq, ""),
        ne(learnArticleLocalizations.faq, "[]")
      )
    )
    .limit(limit);

  const results: { slug: string; locale: string; status: string }[] = [];

  for (const row of englishWithFaq) {
    if (!row.faq) continue;

    for (const locale of TARGET_LOCALES) {
      const [existing] = await db
        .select({
          id: learnArticleLocalizations.id,
          faq: learnArticleLocalizations.faq,
        })
        .from(learnArticleLocalizations)
        .where(
          and(
            eq(learnArticleLocalizations.articleId, row.articleId),
            eq(learnArticleLocalizations.locale, locale)
          )
        )
        .limit(1);

      if (!existing) {
        results.push({ slug: row.slug, locale, status: "no_localization" });
        continue;
      }

      const currentFaq = existing.faq;
      const isEnglishFaq =
        !currentFaq || currentFaq === row.faq || currentFaq === "[]";

      if (!isEnglishFaq) {
        results.push({ slug: row.slug, locale, status: "already_translated" });
        continue;
      }

      const translated = await translateFaqItems(row.faq, locale);
      if (!translated) {
        results.push({ slug: row.slug, locale, status: "translation_failed" });
        continue;
      }

      await db
        .update(learnArticleLocalizations)
        .set({ faq: translated, updatedAt: new Date() })
        .where(eq(learnArticleLocalizations.id, existing.id));

      results.push({ slug: row.slug, locale, status: "updated" });

      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const updated = results.filter((r) => r.status === "updated").length;
  const skipped = results.filter((r) => r.status === "already_translated").length;
  const failed = results.filter(
    (r) => r.status === "translation_failed" || r.status === "no_localization"
  ).length;

  return NextResponse.json({
    summary: {
      articlesProcessed: englishWithFaq.length,
      localeUpdates: updated,
      skipped,
      failed,
    },
    results,
  });
}
