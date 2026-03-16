import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { learnArticleLocalizations } from "@/lib/db/schema";
import { sql, isNull } from "drizzle-orm";

export const maxDuration = 120;

function slugify(text: string): string {
  const charMap: Record<string, string> = {
    á: "a", à: "a", â: "a", ã: "a", ä: "a", å: "a",
    é: "e", è: "e", ê: "e", ë: "e",
    í: "i", ì: "i", î: "i", ï: "i",
    ó: "o", ò: "o", ô: "o", õ: "o", ö: "o",
    ú: "u", ù: "u", û: "u", ü: "u",
    ñ: "n", ç: "c", ş: "s", ğ: "g", ı: "i",
    ß: "ss", æ: "ae", ø: "o",
  };

  return text
    .toLowerCase()
    .split("")
    .map((ch) => charMap[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 280);
}

/**
 * Populate the `slug` column in learn_article_localizations
 * from the translated title for rows that don't have a slug yet.
 *
 * POST /api/learn/populate-slugs
 * Auth: Bearer <CRON_SECRET>
 * Body (optional): { overwrite: true } to regenerate all slugs
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.LEARN_API_KEY || process.env.CRON_SECRET;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const overwrite = body?.overwrite === true;

    const rows = overwrite
      ? await db.select({ id: learnArticleLocalizations.id, title: learnArticleLocalizations.title })
          .from(learnArticleLocalizations)
      : await db.select({ id: learnArticleLocalizations.id, title: learnArticleLocalizations.title })
          .from(learnArticleLocalizations)
          .where(isNull(learnArticleLocalizations.slug));

    let updated = 0;
    for (const row of rows) {
      const slug = slugify(row.title);
      if (!slug) continue;

      await db
        .update(learnArticleLocalizations)
        .set({ slug })
        .where(sql`${learnArticleLocalizations.id} = ${row.id}`);
      updated++;
    }

    return NextResponse.json({
      ok: true,
      total: rows.length,
      updated,
      mode: overwrite ? "overwrite" : "fill-missing",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to populate slugs", details: String(error) },
      { status: 500 }
    );
  }
}
