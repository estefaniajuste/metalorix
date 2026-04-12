import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  articles,
  metalPrices,
  learnArticles,
  learnArticleLocalizations,
} from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { generateCaption, type CaptionData } from "@/lib/ai/instagram-captions";
import {
  publishPhoto,
  buildImageUrl,
  isConfigured,
} from "@/lib/social/instagram";

const CRON_SECRET = process.env.CRON_SECRET?.trim();
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";

type ContentType = "prices" | "fear_greed" | "gold_btc" | "market_summary" | "learn_tip" | "weekly_summary";

/**
 * Day-of-week content rotation.
 * 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
 */
function getContentTypeForToday(): ContentType | null {
  const day = new Date().getUTCDay();
  switch (day) {
    case 1: return "prices";
    case 2: return "fear_greed";
    case 3: return "gold_btc";
    case 4: return "market_summary";
    case 5: return "learn_tip";
    case 6: return null; // Saturday: skip
    case 0: return "weekly_summary";
    default: return "prices";
  }
}

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization")?.trim();
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Instagram not configured (missing INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN)" },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const forceType = url.searchParams.get("type") as ContentType | null;
  const contentType = forceType || getContentTypeForToday();

  if (!contentType) {
    return NextResponse.json({ skipped: true, reason: "Saturday — no post scheduled" });
  }

  const db = getDb();
  if (!db && ["market_summary", "learn_tip", "weekly_summary", "prices"].includes(contentType)) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    const { captionData, imageParams } = await gatherData(contentType, db);

    // Generate caption via Gemini
    const caption = await generateCaption(captionData);

    // Pre-generate the image and upload to external hosting
    // (Instagram can't fetch dynamic images from Cloud Run — too slow)
    const sourceImageUrl = buildImageUrl(NEXT_PUBLIC_URL, contentType, imageParams);
    const imgRes = await fetch(sourceImageUrl, { signal: AbortSignal.timeout(20_000) });
    if (!imgRes.ok) {
      return NextResponse.json(
        { error: `Image generation failed: HTTP ${imgRes.status}`, contentType },
        { status: 502 },
      );
    }
    const imgBlob = await imgRes.blob();

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("time", "1h");
    form.append("fileToUpload", imgBlob, "instagram-post.png");
    const uploadRes = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(30_000),
    });
    if (!uploadRes.ok) {
      return NextResponse.json(
        { error: `Image upload failed: HTTP ${uploadRes.status}`, contentType },
        { status: 502 },
      );
    }
    const imageUrl = (await uploadRes.text()).trim();

    // Publish to Instagram
    const result = await publishPhoto(imageUrl, caption);

    if (!result.ok) {
      console.error("[Instagram Cron] Publish failed:", result.error);
      return NextResponse.json(
        { error: result.error, contentType },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      contentType,
      postId: result.postId,
      permalink: result.permalink,
      captionLength: caption.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Instagram Cron] Error:", msg);
    return NextResponse.json({ error: msg, contentType }, { status: 500 });
  }
}

/* ────────────────────────────────────────────────────────────────── */
/*  Data gathering per content type                                   */
/* ────────────────────────────────────────────────────────────────── */

interface GatheredData {
  captionData: CaptionData;
  imageParams: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherData(type: ContentType, db: any): Promise<GatheredData> {
  switch (type) {
    case "prices":
      return gatherPrices(db);
    case "fear_greed":
      return gatherFearGreed();
    case "gold_btc":
      return gatherGoldBtc();
    case "market_summary":
      return gatherMarketSummary(db, "daily");
    case "learn_tip":
      return gatherLearnTip(db);
    case "weekly_summary":
      return gatherMarketSummary(db, "weekly");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherPrices(db: any): Promise<GatheredData> {
  const rows = await db
    .select({
      symbol: metalPrices.symbol,
      priceUsd: metalPrices.priceUsd,
      changePct24h: metalPrices.changePct24h,
    })
    .from(metalPrices);

  const bySymbol = (s: string) => {
    const r = rows.find((r: Record<string, unknown>) => r.symbol === s);
    return { price: Number(r?.priceUsd ?? 0), changePct: Number(r?.changePct24h ?? 0) };
  };

  const data = {
    gold: bySymbol("XAU"),
    silver: bySymbol("XAG"),
    platinum: bySymbol("XPT"),
    palladium: bySymbol("XPD"),
  };

  return {
    captionData: { type: "prices", data },
    imageParams: {},
  };
}

async function gatherFearGreed(): Promise<GatheredData> {
  const res = await fetch(`${NEXT_PUBLIC_URL}/api/fear-greed`, {
    signal: AbortSignal.timeout(10_000),
  });
  const fg = res.ok ? await res.json() : { score: 50, label: "Neutral", goldPrice: 0, goldChange24h: 0 };

  return {
    captionData: {
      type: "fear_greed",
      data: {
        score: fg.score,
        label: fg.label,
        goldPrice: fg.goldPrice,
        goldChange24h: fg.goldChange24h,
      },
    },
    imageParams: {},
  };
}

async function gatherGoldBtc(): Promise<GatheredData> {
  const [pricesRes, btcRes] = await Promise.all([
    fetch(`${NEXT_PUBLIC_URL}/api/prices`, { signal: AbortSignal.timeout(8_000) }).catch(() => null),
    fetch(`${NEXT_PUBLIC_URL}/api/btc-price`, { signal: AbortSignal.timeout(8_000) }).catch(() => null),
  ]);

  let goldPrice = 0, goldPct = 0;
  if (pricesRes?.ok) {
    const pricesData = await pricesRes.json();
    const metals = Array.isArray(pricesData) ? pricesData : pricesData.prices ?? [];
    const gold = metals.find((m: Record<string, unknown>) => m.symbol === "XAU");
    goldPrice = Number(gold?.priceUsd ?? gold?.price ?? 0);
    goldPct = Number(gold?.changePct24h ?? gold?.changePct ?? 0);
  }

  let btcPrice = 0, btcPct = 0;
  if (btcRes?.ok) {
    const btcData = await btcRes.json();
    btcPrice = btcData.price ?? 0;
    btcPct = btcData.changePct24h ?? 0;
  }

  const ratio = goldPrice > 0 ? btcPrice / goldPrice : 0;

  return {
    captionData: {
      type: "gold_btc",
      data: {
        goldPrice,
        goldChangePct: goldPct,
        btcPrice,
        btcChangePct: btcPct,
        ratio,
      },
    },
    imageParams: {},
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherMarketSummary(db: any, category: string): Promise<GatheredData> {
  const rows = await db
    .select({ title: articles.title, excerpt: articles.excerpt })
    .from(articles)
    .where(and(eq(articles.published, true), eq(articles.category, category)))
    .orderBy(desc(articles.publishedAt))
    .limit(1);

  const article = rows[0] ?? { title: "Market Update", excerpt: "" };
  const contentType = category === "weekly" ? "weekly_summary" : "market_summary";

  return {
    captionData: {
      type: contentType as "market_summary" | "weekly_summary",
      data: { title: article.title, excerpt: article.excerpt ?? "" },
    },
    imageParams: {
      title: article.title,
      excerpt: (article.excerpt ?? "").slice(0, 200),
      category,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function gatherLearnTip(db: any): Promise<GatheredData> {
  // Pick a random published learn article with an English localization
  const count = await db
    .select({ id: learnArticles.id })
    .from(learnArticles)
    .where(eq(learnArticles.status, "published"));

  if (count.length === 0) {
    return {
      captionData: {
        type: "learn_tip",
        data: { title: "Discover Precious Metals", excerpt: "", topic: "General" },
      },
      imageParams: { title: "Discover Precious Metals", topic: "General" },
    };
  }

  const randomIdx = Math.floor(Math.random() * count.length);
  const articleId = count[randomIdx].id;

  const locRows = await db
    .select({
      title: learnArticleLocalizations.title,
      summary: learnArticleLocalizations.summary,
      seoTitle: learnArticleLocalizations.seoTitle,
    })
    .from(learnArticleLocalizations)
    .where(
      and(
        eq(learnArticleLocalizations.articleId, articleId),
        eq(learnArticleLocalizations.locale, "en"),
      ),
    )
    .limit(1);

  const loc = locRows[0];
  const title = loc?.seoTitle || loc?.title || "Precious Metals Fact";
  const excerpt = loc?.summary || "";

  return {
    captionData: {
      type: "learn_tip",
      data: { title, excerpt, topic: "Precious Metals" },
    },
    imageParams: { title, topic: "Precious Metals" },
  };
}
