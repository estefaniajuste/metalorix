"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface FearGreedData {
  score: number;
  label: string;
  color: string;
  components: {
    name: string;
    score: number;
    weight: number;
    description: string;
  }[];
  goldPrice: number;
  silverPrice: number;
  goldChange24h: number;
  silverChange24h: number;
  goldSilverRatio: number;
  updatedAt: string;
}

const LABEL_COLORS: Record<string, string> = {
  "Extreme Fear": "text-red-500",
  "Fear": "text-orange-500",
  "Neutral": "text-yellow-500",
  "Greed": "text-lime-500",
  "Extreme Greed": "text-green-500",
};

const LABEL_BG: Record<string, string> = {
  "Extreme Fear": "bg-red-500/10 border-red-500/30",
  "Fear": "bg-orange-500/10 border-orange-500/30",
  "Neutral": "bg-yellow-500/10 border-yellow-500/30",
  "Greed": "bg-lime-500/10 border-lime-500/30",
  "Extreme Greed": "bg-green-500/10 border-green-500/30",
};

function GaugeArc({ score }: { score: number }) {
  const r = 80;
  const cx = 110;
  const cy = 100;
  const startAngle = -180;
  const sweepAngle = 180;
  const angleRange = sweepAngle;
  const needleAngle = startAngle + (score / 100) * angleRange;
  const rad = (a: number) => (a * Math.PI) / 180;

  const arcPath = (start: number, end: number, radius: number, color: string) => {
    const s = rad(start);
    const e = rad(end);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = end - start > 180 ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="18"
        strokeLinecap="round"
      />
    );
  };

  const nx = cx + (r - 14) * Math.cos(rad(needleAngle));
  const ny = cy + (r - 14) * Math.sin(rad(needleAngle));

  return (
    <svg viewBox="0 20 220 110" className="w-full max-w-[280px] mx-auto">
      {arcPath(-180, -144, r, "#ef4444")}
      {arcPath(-144, -108, r, "#f97316")}
      {arcPath(-108,  -72, r, "#eab308")}
      {arcPath( -72,  -36, r, "#84cc16")}
      {arcPath( -36,    0, r, "#22c55e")}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx={cx} cy={cy} r="6" fill="white" opacity="0.9" />
    </svg>
  );
}

export function FearGreedGauge() {
  const t = useTranslations("fearGreed");
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/fear-greed");
      if (!res.ok) throw new Error("fetch");
      const json = await res.json();
      setData(json);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="w-[280px] h-[110px] bg-surface-2 rounded-lg animate-pulse" />
        <div className="w-24 h-8 bg-surface-2 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-10 text-sm text-content-3">
        {t("errorFetch")}
      </div>
    );
  }

  const colorClass = LABEL_COLORS[data.label] ?? "text-brand-gold";
  const bgClass = LABEL_BG[data.label] ?? "bg-surface-1 border-border";
  const localLabel = t(`label_${data.label.toLowerCase().replace(/ /g, "_")}`);

  return (
    <div className="space-y-6">
      {/* Gauge */}
      <div className="flex flex-col items-center">
        <GaugeArc score={data.score} />
        <div className="text-center -mt-2">
          <div className="text-6xl font-extrabold text-content-0 tracking-tight leading-none">
            {data.score}
          </div>
          <div className={`text-xl font-bold mt-1 ${colorClass}`}>
            {localLabel}
          </div>
          <div className="text-xs text-content-3 mt-1">
            {t("updatedAt")} {new Date(data.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Scale reference */}
      <div className={`flex items-center justify-center gap-3 p-3 rounded-lg border ${bgClass} text-sm font-medium`}>
        <span className="text-content-2">{t("scaleHint")}</span>
      </div>

      {/* Spot prices */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("gold"), price: data.goldPrice, change: data.goldChange24h },
          { label: t("silver"), price: data.silverPrice, change: data.silverChange24h },
          { label: t("ratio"), price: data.goldSilverRatio, change: null, unit: ":1" },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-surface-1 border border-border text-center">
            <div className="text-xs text-content-3 mb-1">{item.label}</div>
            <div className="text-sm font-bold text-content-0">
              {item.unit ? item.price : `$${Number(item.price).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
              {item.unit && item.unit}
            </div>
            {item.change !== null && (
              <div className={`text-[10px] font-medium ${item.change >= 0 ? "text-signal-up" : "text-signal-down"}`}>
                {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Components breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-content-1 mb-3">{t("components")}</h3>
        <div className="space-y-3">
          {data.components.map((c) => {
            const { color } = (() => {
              if (c.score <= 20) return { color: "#ef4444" };
              if (c.score <= 40) return { color: "#f97316" };
              if (c.score <= 60) return { color: "#eab308" };
              if (c.score <= 80) return { color: "#84cc16" };
              return { color: "#22c55e" };
            })();
            return (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-content-2 font-medium">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-content-3">{c.weight}%</span>
                    <span className="font-bold text-content-0 w-7 text-right">{c.score}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.score}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
