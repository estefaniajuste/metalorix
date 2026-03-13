"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Etf {
  name: string;
  ticker: string;
  metal: "gold" | "silver" | "platinum";
  ter: string;
  replication: "physicalAllocated" | "physicalDelivery";
  size: string;
  currency: string;
  url: string;
}

const ETF_DATA: Etf[] = [
  {
    name: "Invesco Physical Gold ETC",
    ticker: "SGLD",
    metal: "gold",
    ter: "0,12 %",
    replication: "physicalAllocated",
    size: "~20.000 M$",
    currency: "USD",
    url: "https://www.justetf.com/en/etf-profile.html?isin=IE00B579F325",
  },
  {
    name: "iShares Physical Gold ETC",
    ticker: "IGLN",
    metal: "gold",
    ter: "0,12 %",
    replication: "physicalAllocated",
    size: "~16.000 M$",
    currency: "USD",
    url: "https://www.justetf.com/en/etf-profile.html?isin=IE00B4ND3602",
  },
  {
    name: "WisdomTree Physical Gold",
    ticker: "PHAU",
    metal: "gold",
    ter: "0,39 %",
    replication: "physicalAllocated",
    size: "~5.000 M$",
    currency: "USD",
    url: "https://www.justetf.com/en/etf-profile.html?isin=JE00B1VS3770",
  },
  {
    name: "Xetra-Gold",
    ticker: "4GLD",
    metal: "gold",
    ter: "0,00 %",
    replication: "physicalDelivery",
    size: "~12.000 M€",
    currency: "EUR",
    url: "https://www.justetf.com/en/etf-profile.html?isin=DE000A0S9GB0",
  },
  {
    name: "Amundi Physical Gold ETC",
    ticker: "GOLD",
    metal: "gold",
    ter: "0,15 %",
    replication: "physicalAllocated",
    size: "~5.000 M$",
    currency: "USD",
    url: "https://www.justetf.com/en/etf-profile.html?isin=FR0013416716",
  },
  {
    name: "iShares Physical Silver ETC",
    ticker: "ISLN",
    metal: "silver",
    ter: "0,20 %",
    replication: "physicalAllocated",
    size: "~1.200 M$",
    currency: "USD",
    url: "https://www.justetf.com/en/etf-profile.html?isin=IE00B4NCWG09",
  },
  {
    name: "WisdomTree Physical Silver",
    ticker: "PHAG",
    metal: "silver",
    ter: "0,49 %",
    replication: "physicalAllocated",
    size: "~1.800 M$",
    currency: "USD",
    url: "https://www.justetf.com/en/etf-profile.html?isin=JE00B1VS3333",
  },
  {
    name: "WisdomTree Physical Platinum",
    ticker: "PHPT",
    metal: "platinum",
    ter: "0,49 %",
    replication: "physicalAllocated",
    size: "~300 M$",
    currency: "USD",
    url: "https://www.justetf.com/en/etf-profile.html?isin=JE00B1VS2W53",
  },
];

const METAL_KEYS = ["all", "gold", "silver", "platinum"] as const;
type MetalFilter = (typeof METAL_KEYS)[number];

type SortKey = "name" | "ticker" | "metal" | "ter" | "size" | "currency";

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 opacity-60">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function EtfTable() {
  const t = useTranslations("etfTable");
  const [filter, setFilter] = useState<MetalFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("metal");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = ETF_DATA.filter((e) => filter === "all" || e.metal === filter);

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    const cmp = va.localeCompare(vb, "es", { numeric: true });
    return sortAsc ? cmp : -cmp;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return <span className="ml-1">{sortAsc ? "\u2191" : "\u2193"}</span>;
  }

  const thBase = "text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider bg-surface-2 border-b border-border whitespace-nowrap cursor-pointer hover:text-content-1 transition-colors select-none";

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2">
        <span className="text-xs font-semibold text-content-3 uppercase tracking-wider mr-2">{t("filter")}</span>
        {METAL_KEYS.map((m) => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
              filter === m
                ? "bg-brand-gold text-[#0b0f17]"
                : "bg-surface-1 text-content-2 hover:text-content-0 hover:bg-surface-3"
            }`}
          >
            {t(m)}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" aria-label={t("ariaLabel")}>
          <thead>
            <tr>
              <th className={thBase} onClick={() => handleSort("name")} role="button" aria-label={t("sortByName")}>
                {t("name")} <SortIndicator col="name" />
              </th>
              <th className={thBase} onClick={() => handleSort("ticker")} role="button" aria-label={t("sortByTicker")}>
                {t("ticker")} <SortIndicator col="ticker" />
              </th>
              <th className={thBase} onClick={() => handleSort("metal")} role="button" aria-label={t("sortByMetal")}>
                {t("metal")} <SortIndicator col="metal" />
              </th>
              <th className={thBase} onClick={() => handleSort("ter")} role="button" aria-label={t("sortByTer")}>
                {t("terLabel")} <SortIndicator col="ter" />
              </th>
              <th className={`${thBase} hidden sm:table-cell`}>{t("replication")}</th>
              <th className={thBase} onClick={() => handleSort("size")} role="button" aria-label={t("sortBySize")}>
                {t("size")} <SortIndicator col="size" />
              </th>
              <th className={thBase} onClick={() => handleSort("currency")} role="button" aria-label={t("sortByCurrency")}>
                {t("currency")} <SortIndicator col="currency" />
              </th>
              <th className={`${thBase} cursor-default hover:text-content-3`}>{t("factsheet")}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((etf) => (
              <tr key={etf.ticker} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 border-b border-border font-medium text-content-0 whitespace-nowrap">
                  {etf.name}
                </td>
                <td className="px-4 py-3 border-b border-border text-brand-gold font-mono text-xs font-semibold">
                  {etf.ticker}
                </td>
                <td className="px-4 py-3 border-b border-border text-content-2">{t(etf.metal)}</td>
                <td className="px-4 py-3 border-b border-border text-content-1 tabular-nums">{etf.ter}</td>
                <td className="px-4 py-3 border-b border-border text-content-2 hidden sm:table-cell text-xs">
                  {t(etf.replication)}
                </td>
                <td className="px-4 py-3 border-b border-border text-content-2 tabular-nums">{etf.size}</td>
                <td className="px-4 py-3 border-b border-border text-content-2">{etf.currency}</td>
                <td className="px-4 py-3 border-b border-border">
                  <a
                    href={etf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gold hover:text-brand-gold-hover transition-colors text-xs font-medium"
                  >
                    {t("view")}<ExternalLinkIcon />
                  </a>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-content-3 py-8">
                  {t("noResults")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
