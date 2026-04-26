/* eslint-disable @typescript-eslint/no-explicit-any */
// next-intl's Link href is strictly typed; static string literals require `as any`.
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface MiniOutlook {
  score: number;
  signal: string;
  generatedAt: string;
}

interface MiniResponse {
  symbol: string;
  short: MiniOutlook | null;
  long: MiniOutlook | null;
}

function signalColor(signal: string): string {
  if (signal === "strong_buy") return "#22c55e";
  if (signal === "buy") return "#84cc16";
  if (signal === "neutral") return "#eab308";
  if (signal === "sell") return "#f97316";
  return "#ef4444";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h`;
  const min = Math.floor(diff / (1000 * 60));
  return `${Math.max(1, min)}m`;
}

export function OutlookMiniCard({ symbol }: { symbol: string }) {
  const t = useTranslations("outlook");
  const [data, setData] = useState<MiniResponse | null>(null);

  useEffect(() => {
    fetch(`/api/outlook?symbol=${symbol}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {});
  }, [symbol]);

  if (!data || (!data.short && !data.long)) return null;

  const Row = ({ label, outlook }: { label: string; outlook: MiniOutlook | null }) => {
    if (!outlook) return null;
    const color = signalColor(outlook.signal);
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs text-content-3">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color }}>
            {outlook.score > 0 ? "+" : ""}{outlook.score}
          </span>
          <span
            className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {t(outlook.signal)}
          </span>
        </div>
      </div>
    );
  };

  const latest = data.short || data.long;

  return (
    <div className="p-4 rounded-DEFAULT border border-border bg-surface-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-content-0">Outlook</h3>
        {latest && (
          <span className="text-[10px] text-content-3">
            {t("updatedAgo").replace("{time}", timeAgo(latest.generatedAt))}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Row label={t("shortTermLabel")} outlook={data.short} />
        <Row label={t("longTermLabel")} outlook={data.long} />
      </div>

      <Link
        href={"/outlook" as any}
        className="block mt-3 text-xs text-brand-gold hover:text-brand-gold/80 transition-colors font-medium"
      >
        {t("viewFull")} →
      </Link>
    </div>
  );
}
