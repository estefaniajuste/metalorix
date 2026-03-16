import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-lite";

if (!DATABASE_URL || !GEMINI_API_KEY) {
  console.error("Missing DATABASE_URL or GEMINI_API_KEY in .env.local");
  process.exit(1);
}
const TARGET_LOCALE = process.argv[2] || "es";
const BATCH_SIZE = parseInt(process.argv[3] || "50", 10);

const sql = postgres(DATABASE_URL, { max: 3, idle_timeout: 20 });

const LOCALE_NAMES = {
  es: "Spanish",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
};

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 16384,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function translateArticle(articleId, enContent) {
  const localeName = LOCALE_NAMES[TARGET_LOCALE] || TARGET_LOCALE;

  const prompt = `Translate this educational article about precious metals to ${localeName}.

RULES:
- Maintain the same structure (## headings, paragraphs, lists)
- Keep technical terms that are universally recognized (ETF, LBMA, COMEX, DCA, etc.)
- Adapt units and examples when culturally appropriate
- Maintain professional, educational tone
- Do NOT add or remove information
- Do NOT translate brand names (Metalorix, SPDR Gold Shares, etc.)
- Translate naturally, not literally

Return a JSON object:
{
  "title": "translated title",
  "seoTitle": "translated SEO title (max 60 chars)",
  "metaDescription": "translated meta description (max 155 chars)",
  "summary": "translated summary",
  "keyIdea": "translated key idea",
  "content": "translated full content (markdown format)"
}

ENGLISH ORIGINAL:
Title: ${enContent.title}
SEO Title: ${enContent.seo_title}
Meta Description: ${enContent.meta_description}
Summary: ${enContent.summary}
Key Idea: ${enContent.key_idea}

Content:
${enContent.content}

Return ONLY the JSON. No markdown code blocks.`;

  const raw = await callGemini(prompt);
  if (!raw) throw new Error("Empty response from Gemini");

  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
  // Sanitize: remove control chars and fix bad escapes inside JSON string values
  jsonStr = jsonStr.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, " ");
  jsonStr = jsonStr.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
  const translated = JSON.parse(jsonStr);

  if (!translated.title || !translated.content) {
    throw new Error("Incomplete translation");
  }

  const seoTitle = (translated.seoTitle || translated.title).slice(0, 120);
  const metaDesc = (translated.metaDescription || translated.summary?.slice(0, 150) || "").slice(0, 155);
  const title = translated.title.slice(0, 300);

  await sql`
    INSERT INTO learn_article_localizations 
      (article_id, locale, title, seo_title, meta_description, summary, key_idea, content, key_takeaways, faq, translation_status, translated_at)
    VALUES (
      ${articleId}, ${TARGET_LOCALE}, ${title}, 
      ${seoTitle}, ${metaDesc},
      ${translated.summary || ""}, ${translated.keyIdea || ""},
      ${translated.content}, ${enContent.key_takeaways}, ${enContent.faq},
      'done', now()
    )
    ON CONFLICT (article_id, locale) DO UPDATE SET
      title = EXCLUDED.title,
      seo_title = EXCLUDED.seo_title,
      meta_description = EXCLUDED.meta_description,
      summary = EXCLUDED.summary,
      key_idea = EXCLUDED.key_idea,
      content = EXCLUDED.content,
      translation_status = 'done',
      translated_at = now(),
      updated_at = now()
  `;

  return true;
}

async function main() {
  console.log(`Translating to ${TARGET_LOCALE} (${LOCALE_NAMES[TARGET_LOCALE]}), batch size: ${BATCH_SIZE}`);

  const pending = await sql`
    SELECT a.id, a.slug, loc.title, loc.seo_title, loc.meta_description, 
           loc.summary, loc.key_idea, loc.content, loc.key_takeaways, loc.faq
    FROM learn_articles a
    JOIN learn_article_localizations loc ON loc.article_id = a.id AND loc.locale = 'en'
    WHERE a.status = 'published'
    AND a.id NOT IN (
      SELECT article_id FROM learn_article_localizations WHERE locale = ${TARGET_LOCALE}
    )
    ORDER BY a.id
    LIMIT ${BATCH_SIZE}
  `;

  console.log(`Found ${pending.length} articles to translate\n`);

  let success = 0;
  let failed = 0;

  for (const row of pending) {
    try {
      await translateArticle(row.id, row);
      success++;
      process.stdout.write(`\r[${success + failed}/${pending.length}] ✓ ${success} translated, ✗ ${failed} failed — last: ${row.slug}`);
    } catch (err) {
      failed++;
      console.error(`\n[${success + failed}/${pending.length}] FAIL: ${row.slug} — ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 1200));
  }

  const remaining = await sql`
    SELECT count(*)::int as cnt FROM learn_articles a 
    WHERE a.status = 'published' 
    AND a.id NOT IN (SELECT article_id FROM learn_article_localizations WHERE locale = ${TARGET_LOCALE})
  `;

  console.log(`\n\nDone: ${success} translated, ${failed} failed, ${remaining[0].cnt} remaining for ${TARGET_LOCALE}`);
  await sql.end();
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
