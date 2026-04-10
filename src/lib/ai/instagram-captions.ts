import { generateText } from "./gemini";

export type InstagramContentType =
  | "prices"
  | "fear_greed"
  | "gold_btc"
  | "market_summary"
  | "learn_tip"
  | "weekly_summary";

interface PricesData {
  gold: { price: number; changePct: number };
  silver: { price: number; changePct: number };
  platinum: { price: number; changePct: number };
  palladium: { price: number; changePct: number };
}

interface FearGreedData {
  score: number;
  label: string;
  goldPrice: number;
  goldChange24h: number;
}

interface GoldBtcData {
  goldPrice: number;
  goldChangePct: number;
  btcPrice: number;
  btcChangePct: number;
  ratio: number;
}

interface ArticleData {
  title: string;
  excerpt: string;
}

interface LearnTipData {
  title: string;
  excerpt: string;
  topic: string;
}

export type CaptionData =
  | { type: "prices"; data: PricesData }
  | { type: "fear_greed"; data: FearGreedData }
  | { type: "gold_btc"; data: GoldBtcData }
  | { type: "market_summary"; data: ArticleData }
  | { type: "learn_tip"; data: LearnTipData }
  | { type: "weekly_summary"; data: ArticleData };

const BASE_HASHTAGS = "#gold #silver #platinum #palladium #preciousmetals #investing #metalorix";

const HASHTAGS_BY_TYPE: Record<InstagramContentType, string> = {
  prices: "#goldprice #silverprice #commodities #metalprices #spotprice #forex #trading",
  fear_greed: "#fearandgreed #marketsentiment #goldtrading #bullion #marketanalysis",
  gold_btc: "#bitcoin #btc #goldvsbitcoin #crypto #digitalassets #store_of_value",
  market_summary: "#marketnews #goldnews #commoditynews #financialnews #markets",
  learn_tip: "#investmenttips #financialeducation #goldbuying #wealthbuilding #knowyourmetals",
  weekly_summary: "#weeklyreview #marketreview #goldweek #investingweekly #metalsmarket",
};

function buildPrompt(input: CaptionData): string {
  const rules = [
    "Write an Instagram caption in English. Max 280 characters (excluding hashtags).",
    "Be concise, punchy, and informative. Use 1-2 relevant emojis max.",
    "Include a call-to-action: 'Link in bio for live prices' or 'Follow @metalorix for daily updates'.",
    "Do NOT include hashtags — they are added separately.",
    "Return ONLY the caption text, nothing else.",
  ].join("\n");

  switch (input.type) {
    case "prices": {
      const { gold, silver, platinum, palladium } = input.data;
      return `${rules}\n\nToday's precious metals spot prices:\n- Gold: $${gold.price.toFixed(2)} (${gold.changePct >= 0 ? "+" : ""}${gold.changePct.toFixed(2)}%)\n- Silver: $${silver.price.toFixed(2)} (${silver.changePct >= 0 ? "+" : ""}${silver.changePct.toFixed(2)}%)\n- Platinum: $${platinum.price.toFixed(2)} (${platinum.changePct >= 0 ? "+" : ""}${platinum.changePct.toFixed(2)}%)\n- Palladium: $${palladium.price.toFixed(2)} (${palladium.changePct >= 0 ? "+" : ""}${palladium.changePct.toFixed(2)}%)\n\nWrite a caption highlighting the most notable move.`;
    }
    case "fear_greed": {
      const { score, label, goldPrice, goldChange24h } = input.data;
      return `${rules}\n\nMetalorix Precious Metals Fear & Greed Index:\n- Score: ${score}/100 (${label})\n- Gold price: $${goldPrice.toFixed(2)} (${goldChange24h >= 0 ? "+" : ""}${goldChange24h.toFixed(2)}% 24h)\n\nWrite a caption about market sentiment and what the score means for investors.`;
    }
    case "gold_btc": {
      const { goldPrice, goldChangePct, btcPrice, btcChangePct, ratio } = input.data;
      return `${rules}\n\nGold vs Bitcoin today:\n- Gold: $${goldPrice.toFixed(2)} (${goldChangePct >= 0 ? "+" : ""}${goldChangePct.toFixed(2)}%)\n- Bitcoin: $${btcPrice.toFixed(0)} (${btcChangePct >= 0 ? "+" : ""}${btcChangePct.toFixed(2)}%)\n- BTC/Gold ratio: ${ratio.toFixed(2)}\n\nWrite a caption comparing both assets as stores of value.`;
    }
    case "market_summary": {
      const { title, excerpt } = input.data;
      return `${rules}\n\nToday's market article: "${title}"\nExcerpt: ${excerpt.slice(0, 300)}\n\nWrite a caption summarizing the key takeaway.`;
    }
    case "learn_tip": {
      const { title, excerpt, topic } = input.data;
      return `${rules}\n\nEducational topic: "${title}" (category: ${topic})\nExcerpt: ${excerpt.slice(0, 300)}\n\nWrite a "Did you know?" style caption with an interesting fact from this topic.`;
    }
    case "weekly_summary": {
      const { title, excerpt } = input.data;
      return `${rules}\n\nWeekly market review: "${title}"\nExcerpt: ${excerpt.slice(0, 300)}\n\nWrite a caption summarizing the week in precious metals.`;
    }
  }
}

function fallbackCaption(input: CaptionData): string {
  switch (input.type) {
    case "prices": {
      const { gold } = input.data;
      return `Gold at $${gold.price.toFixed(2)} today (${gold.changePct >= 0 ? "+" : ""}${gold.changePct.toFixed(2)}%). Follow @metalorix for daily precious metals updates.`;
    }
    case "fear_greed": {
      const { score, label } = input.data;
      return `Precious Metals Fear & Greed Index: ${score}/100 — ${label}. What does this mean for your portfolio? Link in bio for live data.`;
    }
    case "gold_btc": {
      const { goldPrice, btcPrice } = input.data;
      return `Gold $${goldPrice.toFixed(0)} vs Bitcoin $${btcPrice.toFixed(0)}. Two stores of value, one chart. Link in bio for the full comparison.`;
    }
    case "market_summary": {
      const { title } = input.data;
      return `${title}. Read the full analysis — link in bio.`;
    }
    case "learn_tip": {
      const { title } = input.data;
      return `Did you know? ${title}. Learn more about precious metals investing — link in bio.`;
    }
    case "weekly_summary": {
      const { title } = input.data;
      return `This week in metals: ${title}. Full weekly review — link in bio.`;
    }
  }
}

export async function generateCaption(input: CaptionData): Promise<string> {
  const prompt = buildPrompt(input);
  const result = await generateText(prompt, { retryOnEmpty: true });

  const caption = result?.trim() || fallbackCaption(input);
  const hashtags = `\n\n${BASE_HASHTAGS} ${HASHTAGS_BY_TYPE[input.type]}`;

  return caption + hashtags;
}
