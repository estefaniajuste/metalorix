import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { newsSources } from "@/lib/db/schema";
import { scrapeAllFeeds } from "@/lib/scraper/rss";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
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

  const scrapedNews = await scrapeAllFeeds();
  let saved = 0;
  let skipped = 0;

  for (const item of scrapedNews) {
    try {
      await db
        .insert(newsSources)
        .values({
          url: item.url,
          title: item.title,
          source: item.source,
          summary: item.summary,
          metals: item.metals,
          sentiment: item.sentiment,
          scrapedAt: item.publishedAt,
        })
        .onConflictDoNothing({ target: newsSources.url });
      saved++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({
    ok: true,
    scraped: scrapedNews.length,
    saved,
    skipped,
    timestamp: new Date().toISOString(),
  });
}
