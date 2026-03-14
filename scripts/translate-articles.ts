import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and, desc } from "drizzle-orm";
import {
  articles,
  articleTranslations,
} from "../src/lib/db/schema";

const DATABASE_URL = process.env.DATABASE_URL!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const MODEL = "gemini-2.5-flash";

const LOCALES = ["en", "zh", "ar", "tr", "de"] as const;
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
};

const sql = postgres(DATABASE_URL, { max: 3, idle_timeout: 20, connect_timeout: 10 });
const db = drizzle(sql);

async function generateText(prompt: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 4096 },
        }),
      }
    );
    if (!res.ok) {
      console.error("Gemini API error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    console.error("Gemini failed:", err);
    return null;
  }
}

function parseTranslated(raw: string) {
  try {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    const parsed = JSON.parse(jsonStr);
    if (parsed.title && parsed.content) {
      return { title: parsed.title as string, excerpt: (parsed.excerpt ?? "") as string, content: parsed.content as string };
    }
    return null;
  } catch { return null; }
}

async function translateToLocale(title: string, excerpt: string, content: string, locale: string) {
  const langName = LANGUAGE_NAMES[locale];
  const prompt = `You are a professional translator specializing in financial and precious metals content.

Translate the following Spanish article about precious metals into ${langName}.

ORIGINAL TITLE (Spanish):
${title}

ORIGINAL EXCERPT (Spanish):
${excerpt}

ORIGINAL CONTENT (Spanish):
${content}

TRANSLATION RULES:
- Translate naturally into ${langName}, not word-by-word
- Keep financial/technical terms accurate (gold, silver, platinum, support/resistance levels, etc.)
- Preserve markdown formatting (## headings, links like [text](/aprende/slug), etc.)
- Keep numbers, prices, and percentages as-is
- Do NOT add or remove content, translate faithfully
- Do NOT include the original Spanish text
- Keep the same tone: professional, analytical, informative

Return ONLY a valid JSON with this exact structure:

{
  "title": "Translated title in ${langName}",
  "excerpt": "Translated excerpt in ${langName}",
  "content": "Translated full content in ${langName} with ## for section headings"
}

Return ONLY the JSON, no additional text.`;

  const raw = await generateText(prompt);
  if (!raw) return null;
  return parseTranslated(raw);
}

async function main() {
  console.log("Fetching published articles...");

  const allArticles = await db
    .select({ id: articles.id, title: articles.title, excerpt: articles.excerpt, content: articles.content })
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt));

  console.log(`Found ${allArticles.length} published articles`);

  let totalTranslated = 0;

  for (const article of allArticles) {
    console.log(`\n--- Article ${article.id}: ${article.title.substring(0, 60)}...`);

    for (const locale of LOCALES) {
      const existing = await db
        .select({ id: articleTranslations.id })
        .from(articleTranslations)
        .where(and(eq(articleTranslations.articleId, article.id), eq(articleTranslations.locale, locale)))
        .limit(1);

      if (existing.length > 0) {
        console.log(`  [${locale}] already exists, skip`);
        continue;
      }

      console.log(`  [${locale}] translating...`);
      const result = await translateToLocale(article.title, article.excerpt ?? "", article.content, locale);

      if (result) {
        await db.insert(articleTranslations).values({
          articleId: article.id,
          locale,
          title: result.title,
          excerpt: result.excerpt,
          content: result.content,
        });
        totalTranslated++;
        console.log(`  [${locale}] done`);
      } else {
        console.log(`  [${locale}] FAILED`);
      }

      // Small delay between API calls
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\nFinished! Translated ${totalTranslated} article-locale pairs.`);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
