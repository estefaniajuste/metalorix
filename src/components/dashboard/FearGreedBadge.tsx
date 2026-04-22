"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

interface FearGreedData {
  score: number;
  label: string;
}

const LABEL_STYLE: Record<string, { text: string; bg: string; dot: string }> = {
  "Extreme Fear": { text: "text-red-400", bg: "bg-red-500/10 border-red-500/25", dot: "bg-red-400" },
  "Fear":         { text: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/25", dot: "bg-orange-400" },
  "Neutral":      { text: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/25", dot: "bg-yellow-400" },
  "Greed":        { text: "text-lime-400", bg: "bg-lime-500/10 border-lime-500/25", dot: "bg-lime-400" },
  "Extreme Greed":{ text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25", dot: "bg-emerald-400" },
};

const FALLBACK = { text: "text-content-3", bg: "bg-surface-2 border-border", dot: "bg-content-3" };

export function FearGreedBadge({ label }: { label: string }) {
  const [data, setData] = useState<FearGreedData | null>(null);

  useEffect(() => {
    fetch("/api/fear-greed")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.score != null) setData(d); })
      .catch(() => {});
  }, []);

  const style = data ? (LABEL_STYLE[data.label] ?? FALLBACK) : FALLBACK;

  return (
    <Link
      href="/fear-greed"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-opacity hover:opacity-80 ${style.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
      <span className="text-content-3">{label}:</span>
      {data ? (
        <span className={`font-semibold ${style.text}`}>
          {data.label} · {data.score}/100
        </span>
      ) : (
        <span className="text-content-3 animate-pulse">—</span>
      )}
    </Link>
  );
}
