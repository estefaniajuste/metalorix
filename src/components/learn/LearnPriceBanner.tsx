import { Link } from "@/i18n/navigation";
import { getDb } from "@/lib/db";
import { metalPrices } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

const METAL_TO_SYMBOL: Record<string, string> = {
  gold: "XAU",
  silver: "XAG",
  platinum: "XPT",
  palladium: "XPD",
  copper: "HG",
  oro: "XAU",
  plata: "XAG",
  platino: "XPT",
  paladio: "XPD",
  cobre: "HG",
};

// Map cluster slug → metal symbols to show
const CLUSTER_METALS: Record<string, string[]> = {
  fundamentals: ["XAU", "XAG"],
  "gold-investment": ["XAU"],
  "silver-investment": ["XAG"],
  "platinum-palladium": ["XPT", "XPD"],
  "market-dynamics": ["XAU", "XAG"],
  "investment-strategies": ["XAU", "XAG"],
  "coins-numismatics": ["XAU", "XAG"],
  history: ["XAU"],
  macroeconomics: ["XAU"],
  "industrial-uses": ["XAG", "XPT"],
  "etfs-financial-products": ["XAU", "XAG"],
  "mining-production": ["XAU", "XAG"],
};

const METAL_LABELS: Record<string, Record<string, string>> = {
  XAU: { en: "Gold", es: "Oro", de: "Gold", ar: "ذهب", zh: "黄金", tr: "Altın" },
  XAG: { en: "Silver", es: "Plata", de: "Silber", ar: "فضة", zh: "白银", tr: "Gümüş" },
  XPT: { en: "Platinum", es: "Platino", de: "Platin", ar: "بلاتين", zh: "铂金", tr: "Platin" },
  XPD: { en: "Palladium", es: "Paladio", de: "Palladium", ar: "بالاديوم", zh: "钯", tr: "Paladyum" },
  HG: { en: "Copper", es: "Cobre", de: "Kupfer", ar: "نحاس", zh: "铜", tr: "Bakır" },
};

const METAL_SLUGS: Record<string, Record<string, string>> = {
  XAU: { en: "gold", es: "oro", de: "gold", ar: "dhahab", zh: "gold", tr: "altin" },
  XAG: { en: "silver", es: "plata", de: "silber", ar: "fidhah", zh: "silver", tr: "gumus" },
  XPT: { en: "platinum", es: "platino", de: "platin", ar: "bulatin", zh: "platinum", tr: "platin" },
  XPD: { en: "palladium", es: "paladio", de: "palladium", ar: "palladium", zh: "palladium", tr: "paladyum" },
  HG: { en: "copper", es: "cobre", de: "kupfer", ar: "nuhas", zh: "copper", tr: "bakir" },
};

interface Props {
  clusterSlug: string;
  articleSlug: string;
  locale: string;
}

export async function LearnPriceBanner({ clusterSlug, articleSlug, locale }: Props) {
  // Determine which symbols to show based on cluster and article title keywords
  const clusterBase = clusterSlug.toLowerCase().replace(/-\w+$/, "") || clusterSlug;
  let symbols: string[] = [];

  // Direct cluster match
  for (const [key, syms] of Object.entries(CLUSTER_METALS)) {
    if (clusterSlug.includes(key) || key.includes(clusterBase)) {
      symbols = syms;
      break;
    }
  }

  // Keyword match from article slug
  if (symbols.length === 0) {
    for (const [kw, sym] of Object.entries(METAL_TO_SYMBOL)) {
      if (articleSlug.includes(kw)) {
        if (!symbols.includes(sym)) symbols.push(sym);
      }
    }
  }

  // Default to gold+silver for generic financial articles
  if (symbols.length === 0) {
    symbols = ["XAU", "XAG"];
  }

  const db = getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select({
        symbol: metalPrices.symbol,
        priceUsd: metalPrices.priceUsd,
        changePct24h: metalPrices.changePct24h,
      })
      .from(metalPrices)
      .where(inArray(metalPrices.symbol, symbols));

    if (rows.length === 0) return null;

    return (
      <div className="mb-6 flex flex-wrap gap-2">
        {rows.map((row) => {
          const isUp = Number(row.changePct24h ?? 0) >= 0;
          const label = METAL_LABELS[row.symbol]?.[locale] ?? METAL_LABELS[row.symbol]?.en ?? row.symbol;
          const slug = METAL_SLUGS[row.symbol]?.[locale] ?? METAL_SLUGS[row.symbol]?.en ?? row.symbol;
          return (
            <Link
              key={row.symbol}
              href={{ pathname: "/precio/[metal]" as const, params: { metal: slug } }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-1 hover:border-brand-gold/30 hover:bg-surface-2 transition-all text-xs"
            >
              <span className="font-medium text-content-1">{label}</span>
              <span className="font-semibold text-content-0">
                ${row.priceUsd != null ? Number(row.priceUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
              </span>
              {row.changePct24h != null && (
                <span className={`font-medium ${isUp ? "text-signal-up" : "text-signal-down"}`}>
                  {isUp ? "▲" : "▼"} {Math.abs(Number(row.changePct24h)).toFixed(2)}%
                </span>
              )}
            </Link>
          );
        })}
      </div>
    );
  } catch {
    return null;
  }
}
