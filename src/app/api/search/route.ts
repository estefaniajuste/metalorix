import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  articles,
  articleTranslations,
  learnArticles,
  learnArticleLocalizations,
} from "@/lib/db/schema";
import { eq, and, or, ilike, desc } from "drizzle-orm";
import { getLocalizedProducts } from "@/lib/data/products";

const TOOLS = [
  { key: "ratio", title_en: "Gold/Silver Ratio", title_es: "Ratio Oro/Plata", path: "/ratio-oro-plata" },
  { key: "roi", title_en: "ROI Calculator", title_es: "Calculadora de rentabilidad", path: "/calculadora-rentabilidad" },
  { key: "converter", title_en: "Currency Converter", title_es: "Conversor de divisas", path: "/conversor-divisas" },
  { key: "comparator", title_en: "Metal Comparator", title_es: "Comparador de metales", path: "/comparador" },
  { key: "calendar", title_en: "Economic Calendar", title_es: "Calendario económico", path: "/calendario-economico" },
  { key: "feargreed", title_en: "Fear & Greed Index", title_es: "Índice Miedo y Codicia", path: "/fear-greed" },
  { key: "jewelry", title_en: "Jewelry Value Calculator", title_es: "Calculadora de valor de joyas", path: "/valor-joyas" },
  { key: "dca", title_en: "DCA Calculator", title_es: "Calculadora DCA", path: "/herramientas" },
];

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: { type: string; title: string; url: string; excerpt?: string }[] = [];
  const pattern = `%${q}%`;

  const titleKey = locale === "es" ? "title_es" : "title_en";
  for (const tool of TOOLS) {
    if (
      tool[titleKey].toLowerCase().includes(q.toLowerCase()) ||
      tool.key.toLowerCase().includes(q.toLowerCase())
    ) {
      results.push({ type: "tool", title: tool[titleKey], url: tool.path });
    }
  }

  try {
    const products = getLocalizedProducts(locale);
    const lower = q.toLowerCase();
    for (const p of products) {
      if (results.length >= 10) break;
      if (
        p.name.toLowerCase().includes(lower) ||
        p.shortName.toLowerCase().includes(lower)
      ) {
        results.push({
          type: "product",
          title: p.shortName,
          url: `/productos/${p.slug}`,
          excerpt: p.name,
        });
      }
    }
  } catch {
    /* products not available */
  }

  const db = getDb();
  if (db) {
    try {
      if (locale === "es") {
        const rows = await db
          .select({
            slug: articles.slug,
            title: articles.title,
            excerpt: articles.excerpt,
          })
          .from(articles)
          .where(
            and(
              eq(articles.published, true),
              or(
                ilike(articles.title, pattern),
                ilike(articles.excerpt, pattern),
              ),
            ),
          )
          .orderBy(desc(articles.publishedAt))
          .limit(5);
        for (const r of rows) {
          results.push({
            type: "article",
            title: r.title,
            url: `/noticias/${r.slug}`,
            excerpt: r.excerpt ?? undefined,
          });
        }
      } else {
        const rows = await db
          .select({
            slug: articleTranslations.slug,
            title: articleTranslations.title,
            excerpt: articleTranslations.excerpt,
            fallbackSlug: articles.slug,
          })
          .from(articleTranslations)
          .innerJoin(articles, eq(articleTranslations.articleId, articles.id))
          .where(
            and(
              eq(articleTranslations.locale, locale),
              eq(articles.published, true),
              or(
                ilike(articleTranslations.title, pattern),
                ilike(articleTranslations.excerpt, pattern),
              ),
            ),
          )
          .orderBy(desc(articles.publishedAt))
          .limit(5);
        for (const r of rows) {
          results.push({
            type: "article",
            title: r.title,
            url: `/noticias/${r.slug ?? r.fallbackSlug}`,
            excerpt: r.excerpt ?? undefined,
          });
        }
      }

      if (locale === "es") {
        const rows = await db
          .select({
            slug: learnArticles.slug,
            title: learnArticleLocalizations.title,
            summary: learnArticleLocalizations.summary,
          })
          .from(learnArticleLocalizations)
          .innerJoin(
            learnArticles,
            eq(learnArticleLocalizations.articleId, learnArticles.id),
          )
          .where(
            and(
              eq(learnArticleLocalizations.locale, "es"),
              eq(learnArticles.status, "published"),
              or(
                ilike(learnArticleLocalizations.title, pattern),
                ilike(learnArticleLocalizations.summary, pattern),
              ),
            ),
          )
          .limit(3);
        for (const r of rows) {
          results.push({
            type: "learn",
            title: r.title,
            url: `/learn`,
            excerpt: r.summary?.slice(0, 120),
          });
        }
      } else {
        const rows = await db
          .select({
            slug: learnArticleLocalizations.slug,
            title: learnArticleLocalizations.title,
            summary: learnArticleLocalizations.summary,
            baseSlug: learnArticles.slug,
          })
          .from(learnArticleLocalizations)
          .innerJoin(
            learnArticles,
            eq(learnArticleLocalizations.articleId, learnArticles.id),
          )
          .where(
            and(
              eq(learnArticleLocalizations.locale, locale),
              eq(learnArticles.status, "published"),
              or(
                ilike(learnArticleLocalizations.title, pattern),
                ilike(learnArticleLocalizations.summary, pattern),
              ),
            ),
          )
          .limit(3);
        for (const r of rows) {
          results.push({
            type: "learn",
            title: r.title,
            url: `/learn`,
            excerpt: r.summary?.slice(0, 120),
          });
        }
      }
    } catch {
      /* DB query failed */
    }
  }

  return NextResponse.json({ results: results.slice(0, 10) });
}
