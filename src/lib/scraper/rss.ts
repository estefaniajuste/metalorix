export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

interface FeedConfig {
  name: string;
  url: string;
  metals?: string[];
}

const FEEDS: FeedConfig[] = [
  {
    name: "reuters",
    url: "https://www.reutersagency.com/feed/?best-topics=commodities&post_type=best",
  },
  {
    name: "kitco",
    url: "https://www.kitco.com/feed/rss/news/",
  },
  {
    name: "investing",
    url: "https://www.investing.com/rss/news_301.rss",
  },
  {
    name: "bullionvault",
    url: "https://www.bullionvault.com/gold-news/rss",
    metals: ["XAU"],
  },
  {
    name: "gold-council",
    url: "https://www.gold.org/goldhub/rss",
    metals: ["XAU"],
  },
];

const METAL_KEYWORDS: Record<string, string[]> = {
  XAU: ["gold", "oro", "xau", "bullion", "golden"],
  XAG: ["silver", "plata", "xag", "silverware"],
  XPT: ["platinum", "platino", "xpt", "pgm"],
  XPD: ["palladium", "paladio", "xpd", "pgm"],
  HG:  ["copper", "cobre", "hg", "cuprum", "comex copper"],
};

function detectMetals(text: string): string[] {
  const lower = text.toLowerCase();
  const metals: string[] = [];
  for (const [symbol, keywords] of Object.entries(METAL_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      metals.push(symbol);
    }
  }
  return metals.length > 0 ? metals : ["XAU"];
}

function detectSentiment(text: string): "positive" | "negative" | "neutral" {
  const lower = text.toLowerCase();
  const positiveWords = [
    "surge", "rally", "soar", "gain", "rise", "high", "bull", "climb",
    "sube", "alza", "máximo", "positivo", "alcista", "recupera",
  ];
  const negativeWords = [
    "drop", "fall", "crash", "plunge", "decline", "low", "bear", "sink",
    "cae", "baja", "mínimo", "negativo", "bajista", "desplome",
  ];

  const posScore = positiveWords.filter((w) => lower.includes(w)).length;
  const negScore = negativeWords.filter((w) => lower.includes(w)).length;

  if (posScore > negScore) return "positive";
  if (negScore > posScore) return "negative";
  return "neutral";
}

function extractTag(xml: string, tag: string): string {
  const open = `<${tag}`;
  const close = `</${tag}>`;
  const startIdx = xml.indexOf(open);
  if (startIdx === -1) return "";
  const contentStart = xml.indexOf(">", startIdx) + 1;
  const endIdx = xml.indexOf(close, contentStart);
  if (endIdx === -1) return "";
  let value = xml.slice(contentStart, endIdx).trim();
  if (value.startsWith("<![CDATA[")) {
    value = value.slice(9, value.indexOf("]]>"));
  }
  return value.replace(/<[^>]*>/g, "").trim();
}

function parseRssFeed(xml: string, source: string, defaultMetals?: string[]): RssItem[] {
  const items: RssItem[] = [];
  let pos = 0;

  while (true) {
    const itemStart = xml.indexOf("<item", pos);
    if (itemStart === -1) break;
    const itemEnd = xml.indexOf("</item>", itemStart);
    if (itemEnd === -1) break;

    const itemXml = xml.slice(itemStart, itemEnd + 7);
    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link") || extractTag(itemXml, "guid");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");

    if (title && link) {
      items.push({ title, link, description, pubDate, source });
    }

    pos = itemEnd + 7;
  }

  return items;
}

async function fetchFeed(feed: FeedConfig): Promise<RssItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(feed.url, {
      headers: {
        "User-Agent": "Metalorix/1.0 (https://metalorix.com; news aggregator)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssFeed(xml, feed.name, feed.metals);
  } catch (err) {
    console.warn(`RSS fetch failed for ${feed.name}:`, err);
    return [];
  }
}

export interface ScrapedNews {
  url: string;
  title: string;
  source: string;
  summary: string;
  metals: string[];
  sentiment: "positive" | "negative" | "neutral";
  publishedAt: Date;
}

export async function scrapeAllFeeds(): Promise<ScrapedNews[]> {
  const allItems = await Promise.all(FEEDS.map(fetchFeed));
  const flat = allItems.flat();

  const seen = new Set<string>();
  const results: ScrapedNews[] = [];

  for (const item of flat) {
    if (seen.has(item.link)) continue;
    seen.add(item.link);

    const fullText = `${item.title} ${item.description}`;
    const metals = detectMetals(fullText);
    const sentiment = detectSentiment(fullText);

    const isMetalRelated =
      metals.length > 0 ||
      /gold|silver|platinum|palladium|precious|metal|oro|plata|platino/i.test(fullText);

    if (!isMetalRelated) continue;

    results.push({
      url: item.link,
      title: item.title,
      source: item.source,
      summary: item.description.slice(0, 500),
      metals,
      sentiment,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    });
  }

  return results;
}
