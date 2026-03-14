import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { metalPrices } from "@/lib/db/schema";
import {
  generateDailySummary,
  generateEventArticle,
  generateWeeklySummary,
  saveArticle,
} from "@/lib/ai/content-generator";
import {
  generateNewGlossaryTerms,
  saveGlossaryTerm,
  expandTermsWithoutContent,
  getGlossaryTermCount,
} from "@/lib/ai/glossary-generator";
import { isConfigured } from "@/lib/ai/gemini";
import { sendWeeklyNewsletter } from "@/lib/email/newsletter";

const CRON_SECRET = process.env.CRON_SECRET;
const EVENT_THRESHOLD_PCT = 2.0;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Gemini API not configured" },
      { status: 503 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "daily";
  const generated: string[] = [];

  if (type === "daily" || type === "auto") {
    const article = await generateDailySummary();
    if (article) {
      const ok = await saveArticle(article, "daily");
      if (ok) generated.push(`daily: ${article.slug}`);
    }
  }

  if (type === "weekly" || (type === "auto" && new Date().getDay() === 0)) {
    const article = await generateWeeklySummary();
    if (article) {
      const ok = await saveArticle(article, "weekly");
      if (ok) generated.push(`weekly: ${article.slug}`);
    }
  }

  if (type === "event" || type === "auto") {
    const metalNames: Record<string, string> = {
      XAU: "Oro",
      XAG: "Plata",
      XPT: "Platino",
    };
    // AI content is generated in Spanish for the news section

    try {
      const prices = await db.select().from(metalPrices);
      for (const p of prices) {
        const changePct = parseFloat(p.changePct24h ?? "0");
        if (Math.abs(changePct) >= EVENT_THRESHOLD_PCT) {
          const article = await generateEventArticle(
            p.symbol,
            metalNames[p.symbol] ?? p.symbol,
            parseFloat(p.priceUsd),
            changePct
          );
          if (article) {
            const ok = await saveArticle(article, "event");
            if (ok) generated.push(`event: ${article.slug}`);
          }
        }
      }
    } catch (err) {
      console.error("Event article check failed:", err);
    }
  }

  // Glossary: generate new terms and expand existing ones
  if (type === "glossary" || type === "auto") {
    const MAX_TERMS = 1000;
    const termCount = await getGlossaryTermCount();

    if (termCount < MAX_TERMS) {
      const newTerms = await generateNewGlossaryTerms(5);
      for (const term of newTerms) {
        const ok = await saveGlossaryTerm(term);
        if (ok) generated.push(`glossary-new: ${term.slug}`);
      }
    }

    const expanded = await expandTermsWithoutContent(3);
    if (expanded > 0) {
      generated.push(`glossary-expanded: ${expanded} terms`);
    }
  }

  // Newsletter: send on Sundays or when explicitly requested
  let newsletterResult = null;
  if (type === "newsletter" || (type === "auto" && new Date().getDay() === 0)) {
    newsletterResult = await sendWeeklyNewsletter();
    if (newsletterResult.sent > 0) {
      generated.push(`newsletter: ${newsletterResult.sent} emails sent`);
    }
  }

  return NextResponse.json({
    ok: true,
    type,
    generated,
    newsletter: newsletterResult,
    timestamp: new Date().toISOString(),
  });
}
