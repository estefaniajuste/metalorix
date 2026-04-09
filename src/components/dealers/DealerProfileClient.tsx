"use client";

import { useEffect, useState, useCallback } from "react";

interface PriceData {
  symbol: string;
  priceUsd: number;
  change24h: number;
  changePct24h: number;
}

interface LivePricesProps {
  metals: string[];
  perOzLabel: string;
  shareMode?: never;
}

interface ShareProps {
  shareMode: true;
  dealerName: string;
  cityName: string;
  copyLabel: string;
  copiedLabel: string;
  whatsappLabel: string;
  metals?: never;
  perOzLabel?: never;
}

type Props = LivePricesProps | ShareProps;

const METAL_DISPLAY: Record<string, { name: string; color: string }> = {
  XAU: { name: "Gold", color: "text-yellow-400" },
  XAG: { name: "Silver", color: "text-gray-300" },
  XPT: { name: "Platinum", color: "text-blue-300" },
  XPD: { name: "Palladium", color: "text-purple-300" },
};

function LivePrices({ metals, perOzLabel }: LivePricesProps) {
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setPrices(data.filter((p: PriceData) => metals.includes(p.symbol)));
        }
      } catch { /* ignore */ }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [metals]);

  if (prices.length === 0) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {metals.map((m) => (
          <div key={m} className="p-4 rounded-DEFAULT bg-surface-1 border border-border animate-pulse">
            <div className="h-4 bg-surface-2 rounded w-16 mb-2" />
            <div className="h-6 bg-surface-2 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {prices.map((p) => {
        const info = METAL_DISPLAY[p.symbol] ?? { name: p.symbol, color: "text-content-1" };
        const isUp = p.change24h >= 0;
        return (
          <div key={p.symbol} className="p-4 rounded-DEFAULT bg-surface-1 border border-border">
            <p className={`text-xs font-semibold uppercase tracking-wider ${info.color}`}>
              {info.name}
            </p>
            <p className="text-xl font-bold text-content-0 mt-1">
              ${Number(p.priceUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-normal text-content-3 ml-1">{perOzLabel}</span>
            </p>
            <p className={`text-xs font-semibold mt-1 ${isUp ? "text-signal-up" : "text-signal-down"}`}>
              {isUp ? "+" : ""}{Number(p.changePct24h).toFixed(2)}%
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ShareButtons({ dealerName, cityName, copyLabel, copiedLabel, whatsappLabel }: Omit<ShareProps, "shareMode">) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, []);

  const handleWhatsApp = useCallback(() => {
    const text = `${dealerName} — ${cityName} | Metalorix\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [dealerName, cityName]);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-sm text-content-1 hover:text-content-0 transition-colors px-3 py-2 rounded-DEFAULT bg-surface-2 hover:bg-surface-3"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        {copied ? copiedLabel : copyLabel}
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 text-sm text-content-1 hover:text-content-0 transition-colors px-3 py-2 rounded-DEFAULT bg-surface-2 hover:bg-surface-3"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.856L0 24l6.335-1.652A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.82-.558-5.39-1.524l-.387-.23-3.758.98.999-3.648-.253-.403A9.71 9.71 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
        </svg>
        {whatsappLabel}
      </button>
    </div>
  );
}

export function DealerProfileClient(props: Props) {
  if ("shareMode" in props && props.shareMode) {
    return <ShareButtons {...props} />;
  }
  return <LivePrices {...(props as LivePricesProps)} />;
}
