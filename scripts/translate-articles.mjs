import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!DATABASE_URL || !GEMINI_API_KEY) {
  console.error("Missing DATABASE_URL or GEMINI_API_KEY");
  process.exit(1);
}

const LOCALES = ["en", "zh", "ar", "tr", "de", "hi"];
const LANGUAGE_NAMES = {
  en: "English",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
  hi: "Hindi",
};

const sql = postgres(DATABASE_URL, { max: 3, idle_timeout: 20, connect_timeout: 10 });

async function generateText(prompt) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 16384 },
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

function parseTranslated(raw, locale) {
  try {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    let jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    
    // Remove BOM or other invisible characters
    jsonStr = jsonStr.replace(/^\uFEFF/, '');
    
    // Try to extract JSON object from response if it has extra text
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) jsonStr = objMatch[0];
    
    const parsed = JSON.parse(jsonStr);
    if (parsed.title && parsed.content) {
      return { title: parsed.title, excerpt: parsed.excerpt ?? "", content: parsed.content };
    }
    console.error(`  [${locale}] parse: missing title/content in parsed JSON`);
    return null;
  } catch (err) {
    console.error(`  [${locale}] parse error: ${err.message}`);
    console.error(`  [${locale}] raw response (first 300): ${raw?.substring(0, 300)}`);
    return null;
  }
}

async function translateToLocale(title, excerpt, content, locale) {
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
  return parseTranslated(raw, locale);
}

async function main() {
  console.log("Fetching published articles...");

  const allArticles = await sql`
    SELECT id, title, excerpt, content 
    FROM articles 
    WHERE published = true 
    ORDER BY published_at DESC
  `;

  console.log(`Found ${allArticles.length} published articles`);
  let totalTranslated = 0;

  for (const article of allArticles) {
    console.log(`\n--- Article ${article.id}: ${article.title.substring(0, 60)}...`);

    for (const locale of LOCALES) {
      const existing = await sql`
        SELECT id FROM article_translations 
        WHERE article_id = ${article.id} AND locale = ${locale} 
        LIMIT 1
      `;

      if (existing.length > 0) {
        console.log(`  [${locale}] already exists, skip`);
        continue;
      }

      console.log(`  [${locale}] translating...`);
      const result = await translateToLocale(article.title, article.excerpt ?? "", article.content, locale);

      if (result) {
        await sql`
          INSERT INTO article_translations (article_id, locale, title, excerpt, content) 
          VALUES (${article.id}, ${locale}, ${result.title}, ${result.excerpt}, ${result.content})
        `;
        totalTranslated++;
        console.log(`  [${locale}] done`);
      } else {
        console.log(`  [${locale}] FAILED`);
      }

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
