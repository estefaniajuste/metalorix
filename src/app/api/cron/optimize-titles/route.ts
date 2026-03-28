import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, articleTranslations } from "@/lib/db/schema";
import { eq, and, or, lt, like, isNull, desc } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";
import { pingIndexNow } from "@/lib/seo/ping";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;
const BASE = "https://metalorix.com";

// Titles that signal generic, low-quality SEO (case-insensitive match)
const GENERIC_TITLE_PATTERNS = [
  "resumen del mercado",
  "análisis semanal",
  "análisis de mercado",
  "noticias de metales",
  "mercado de metales",
  "actualización del mercado",
  "informe semanal",
  "weekly summary",
  "market summary",
  "market update",
  "precious metals news",
  "metals market",
  "daily summary",
  "resumen diario",
];

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
  hi: "Hindi",
};

function needsOptimization(title: string): boolean {
  if (!title) return true;
  const lower = title.toLowerCase();
  if (GENERIC_TITLE_PATTERNS.some((p) => lower.includes(p))) return true;
  // Too short (< 35 chars) or too long (> 70 chars)
  if (title.length < 35 || title.length > 70) return true;
  return false;
}

async function optimizeTitleWithGemini(
  title: string,
  excerpt: string,
  content: string,
  locale: string
): Promise<{ titulo_seo: string; meta_descripcion: string } | null> {
  const lang = locale === "es" ? "Spanish" : (LANGUAGE_NAMES[locale] || "English");
  const contentSnippet = (content || excerpt || "").slice(0, 800);

  const prompt = `You are an expert SEO content editor. Rewrite the title and meta description for this precious metals news article to maximize click-through rate on Google.

Current title: "${title}"
Article excerpt: "${contentSnippet}"

Rules:
- Title: 50-65 characters, in ${lang}. Must include the main cause/event + outcome (e.g. "Gold Surges Past $3200 as Middle East Tensions Escalate"). Include specific prices, percentages, or events when available. Never use generic titles like "Market Summary" or "Weekly Analysis".
- Meta description: 140-155 characters, in ${lang}. Include concrete data (price, % change), the key driver, and end with a hook that invites clicking.
- Output ONLY valid JSON with keys "titulo_seo" and "meta_descripcion". No extra text.

JSON:`;

  const raw = await generateText(prompt, { retryOnEmpty: false });
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.titulo_seo === "string" && typeof parsed.meta_descripcion === "string") {
      return {
        titulo_seo: parsed.titulo_seo.slice(0, 70),
        meta_descripcion: parsed.meta_descripcion.slice(0, 160),
      };
    }
  } catch {
    // parse failed — try to extract from text
    const titleMatch = raw.match(/"titulo_seo"\s*:\s*"([^"]+)"/);
    const descMatch = raw.match(/"meta_descripcion"\s*:\s*"([^"]+)"/);
    if (titleMatch && descMatch) {
      return {
        titulo_seo: titleMatch[1].slice(0, 70),
        meta_descripcion: descMatch[1].slice(0, 160),
      };
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(request.url);
  // How many articles to process per run (default 5 to stay within Cloud Run timeout)
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "5"), 20);
  // If true, only process Spanish originals (skip translations)
  const esOnly = url.searchParams.get("es_only") === "true";

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const optimized: { id: number; locale: string; old: string; new: string }[] = [];
  const failed: { id: number; locale: string; reason: string }[] = [];
  const pingUrls: string[] = [];

  // --- Spanish originals ---
  const candidates = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      content: articles.content,
    })
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt))
    .limit(100);

  const toOptimizeEs = candidates.filter((a) => needsOptimization(a.title)).slice(0, limit);

  for (const art of toOptimizeEs) {
    const improved = await optimizeTitleWithGemini(art.title, art.excerpt ?? "", art.content ?? "", "es");
    if (!improved) {
      failed.push({ id: art.id, locale: "es", reason: "Gemini returned null" });
      continue;
    }

    if (improved.titulo_seo === art.title) {
      // No change needed
      continue;
    }

    await db
      .update(articles)
      .set({ title: improved.titulo_seo, excerpt: improved.meta_descripcion })
      .where(eq(articles.id, art.id));

    optimized.push({ id: art.id, locale: "es", old: art.title, new: improved.titulo_seo });
    pingUrls.push(`${BASE}/es/noticias/${art.slug}`);
    await new Promise((r) => setTimeout(r, 1500));
  }

  // --- Translations (en, de, tr, zh, ar, hi) ---
  if (!esOnly) {
    const LOCALES_TO_OPTIMIZE: (typeof routing.locales[number])[] = ["en", "de", "tr"];

    const transRows = await db
      .select({
        id: articleTranslations.id,
        articleId: articleTranslations.articleId,
        locale: articleTranslations.locale,
        slug: articleTranslations.slug,
        title: articleTranslations.title,
        excerpt: articleTranslations.excerpt,
        content: articleTranslations.content,
      })
      .from(articleTranslations)
      .where(
        and(
          or(
            ...LOCALES_TO_OPTIMIZE.map((loc) => eq(articleTranslations.locale, loc))
          )
        )
      )
      .orderBy(desc(articleTranslations.id))
      .limit(200);

    const toOptimizeTrans = transRows
      .filter((r) => r.title && needsOptimization(r.title))
      .slice(0, limit);

    for (const tr of toOptimizeTrans) {
      if (!tr.title) continue;
      const improved = await optimizeTitleWithGemini(
        tr.title,
        tr.excerpt ?? "",
        tr.content ?? "",
        tr.locale
      );
      if (!improved) {
        failed.push({ id: tr.id, locale: tr.locale, reason: "Gemini returned null" });
        continue;
      }

      if (improved.titulo_seo === tr.title) continue;

      await db
        .update(articleTranslations)
        .set({ title: improved.titulo_seo, excerpt: improved.meta_descripcion })
        .where(eq(articleTranslations.id, tr.id));

      optimized.push({ id: tr.id, locale: tr.locale, old: tr.title, new: improved.titulo_seo });

      if (tr.slug) {
        const path = getPathname({
          locale: tr.locale as Locale,
          href: { pathname: "/noticias/[slug]", params: { slug: tr.slug } } as any,
        });
        pingUrls.push(`${BASE}${path}`);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  // Ping IndexNow for all updated URLs so Google recrawls them fast
  if (pingUrls.length) await pingIndexNow(pingUrls);

  return NextResponse.json({
    ok: true,
    optimized: optimized.length,
    failed: failed.length,
    pingUrls: pingUrls.length,
    changes: optimized,
    timestamp: new Date().toISOString(),
  });
}
