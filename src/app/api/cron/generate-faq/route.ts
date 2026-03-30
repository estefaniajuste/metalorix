import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { learnArticles, learnArticleLocalizations, learnClusters } from "@/lib/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { generateText } from "@/lib/ai/gemini";
import { pingIndexNow } from "@/lib/seo/ping";
import { getLocalizedClusterSlug } from "@/lib/learn/slug-i18n";
import { routing } from "@/i18n/routing";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET?.trim();
const BASE = "https://metalorix.com";

const LEARN_BASE: Record<string, string> = {
  es: "aprende-inversion", en: "learn", de: "lernen-investition",
  zh: "xuexi", ar: "taallam", tr: "ogren-yatirim", hi: "gyaan-nivesh",
};

async function generateFaqWithGemini(
  title: string,
  content: string,
  slug: string
): Promise<{ question: string; answer: string }[] | null> {
  const contentSnippet = content.slice(0, 2000);

  const prompt = `You are an SEO specialist creating FAQ schema for a precious metals educational article. Generate 3-5 FAQ questions and answers that would appear as Google rich snippets.

Article: "${title}"
Slug: "${slug}"

Content excerpt:
${contentSnippet}

RULES:
- Each question must be a natural search query someone would type into Google
- Questions should cover different aspects of the topic (what, why, how, when, comparison)
- Answers should be 1-3 sentences, factual, and self-contained (make sense without reading the article)
- Include specific numbers, facts, or named examples from the article content when possible
- Do NOT use questions like "What will I learn?" or "What does this article cover?"

Output ONLY a JSON array: [{"question": "...", "answer": "..."}, ...]

JSON:`;

  const raw = await generateText(prompt, { retryOnEmpty: false });
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((f: any) => typeof f?.question === "string" && typeof f?.answer === "string")
        .slice(0, 5);
    }
  } catch {
    // try to extract array from response
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const rows = await db
    .select({
      locId: learnArticleLocalizations.id,
      slug: learnArticles.slug,
      locSlug: learnArticleLocalizations.slug,
      clusterSlug: learnClusters.slug,
      title: learnArticleLocalizations.title,
      content: learnArticleLocalizations.content,
    })
    .from(learnArticleLocalizations)
    .innerJoin(learnArticles, eq(learnArticles.id, learnArticleLocalizations.articleId))
    .innerJoin(learnClusters, eq(learnClusters.id, learnArticles.clusterId))
    .where(
      and(
        eq(learnArticleLocalizations.locale, "en"),
        isNotNull(learnArticleLocalizations.content),
        isNull(learnArticleLocalizations.faq)
      )
    )
    .limit(limit);

  let generated = 0;
  let failed = 0;
  const pingUrls: string[] = [];

  for (const row of rows) {
    if (!row.content) continue;

    const faq = await generateFaqWithGemini(row.title, row.content, row.slug);

    if (!faq || faq.length === 0) {
      failed++;
      continue;
    }

    await db
      .update(learnArticleLocalizations)
      .set({
        faq: JSON.stringify(faq),
        updatedAt: new Date(),
      })
      .where(eq(learnArticleLocalizations.id, row.locId));

    generated++;

    for (const loc of routing.locales) {
      const clusterSlug = getLocalizedClusterSlug(row.clusterSlug, loc);
      const articleSlug = row.locSlug || row.slug;
      pingUrls.push(`${BASE}/${loc}/${LEARN_BASE[loc] ?? "learn"}/${clusterSlug}/${articleSlug}`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  if (pingUrls.length) await pingIndexNow(pingUrls);

  return NextResponse.json({
    ok: true,
    candidates: rows.length,
    generated,
    failed,
    pinged: pingUrls.length,
    timestamp: new Date().toISOString(),
  });
}
