import { getDb } from "@/lib/db";
import { articles, articleTranslations } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

const BASE_URL = "https://metalorix.com";

const LOCALE_LABELS: Record<string, string> = {
  es: "Español",
  en: "English",
  zh: "中文",
  ar: "العربية",
  tr: "Türkçe",
  de: "Deutsch",
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const db = getDb();
  const rows = db
    ? await db
        .select()
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.publishedAt))
        .limit(50)
        .catch(() => [])
    : [];

  const translationRows = db
    ? await db
        .select()
        .from(articleTranslations)
        .where(eq(articleTranslations.locale, "en"))
        .catch(() => [])
    : [];

  const enMap = new Map(
    translationRows.map((t) => [t.articleId, { title: t.title, excerpt: t.excerpt }])
  );

  const items = rows
    .map((a) => {
      const en = enMap.get(a.id);
      const pubDate = a.publishedAt
        ? new Date(a.publishedAt).toUTCString()
        : new Date(a.createdAt).toUTCString();

      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${BASE_URL}/es/noticias/${a.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/es/noticias/${a.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(a.excerpt ?? a.title)}</description>
      <category>${escapeXml(a.category)}</category>${
        a.metals
          ? a.metals.map((m) => `\n      <category>${escapeXml(m)}</category>`).join("")
          : ""
      }${
        en
          ? `\n      <dc:language>en</dc:language>`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Metalorix — Noticias de Metales Preciosos</title>
    <link>${BASE_URL}/es/noticias</link>
    <description>Análisis diario del mercado de oro, plata, platino, paladio y cobre. Precios spot, tendencias y noticias.</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/icon-512.png</url>
      <title>Metalorix</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
