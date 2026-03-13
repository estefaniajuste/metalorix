"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { MetalSpot } from "@/lib/providers/metals";

interface RatioData {
  goldPrice: number;
  silverPrice: number;
  ratio: number;
  loading: boolean;
}

function getRatioZone(
  ratio: number,
  t: (key: string) => string
): {
  label: string;
  color: string;
  bg: string;
  description: string;
} {
  if (ratio < 50) {
    return {
      label: t("silverExpensive"),
      color: "text-signal-down",
      bg: "bg-signal-down-bg",
      description: t("silverExpensiveDesc"),
    };
  }
  if (ratio < 70) {
    return {
      label: t("neutralZone"),
      color: "text-brand-gold",
      bg: "bg-[rgba(214,179,90,0.12)]",
      description: t("neutralZoneDesc"),
    };
  }
  if (ratio < 90) {
    return {
      label: t("silverCheap"),
      color: "text-signal-up",
      bg: "bg-signal-up-bg",
      description: t("silverCheapDesc"),
    };
  }
  return {
    label: t("silverVeryCheap"),
    color: "text-signal-up",
    bg: "bg-signal-up-bg",
    description: t("silverVeryCheapDesc"),
  };
}

export function GoldSilverRatio() {
  const t = useTranslations("goldSilverRatio");
  const [data, setData] = useState<RatioData>({
    goldPrice: 0,
    silverPrice: 0,
    ratio: 0,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/prices");
        const { prices } = await res.json();
        const gold = prices.find((p: MetalSpot) => p.symbol === "XAU");
        const silver = prices.find((p: MetalSpot) => p.symbol === "XAG");
        if (gold && silver && silver.price > 0) {
          setData({
            goldPrice: gold.price,
            silverPrice: silver.price,
            ratio: gold.price / silver.price,
            loading: false,
          });
        }
      } catch {
        setData((prev) => ({ ...prev, loading: false }));
      }
    }
    load();
  }, []);

  if (data.loading) {
    return (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
        <div className="h-6 w-48 bg-surface-2 rounded-xs animate-shimmer mb-4" />
        <div className="h-20 w-full bg-surface-2 rounded-xs animate-shimmer" />
      </div>
    );
  }

  if (!data.ratio) {
    return (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 text-content-3 text-sm">
        {t("errorLoading")}
      </div>
    );
  }

  const zone = getRatioZone(data.ratio, t);

  const barMin = 30;
  const barMax = 120;
  const barPct = Math.min(
    100,
    Math.max(0, ((data.ratio - barMin) / (barMax - barMin)) * 100)
  );

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-content-0">
          {t("title")}
        </h3>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${zone.bg} ${zone.color}`}
        >
          {zone.label}
        </span>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-extrabold text-content-0 tabular-nums">
          {data.ratio.toFixed(1)}x
        </div>
        <div className="text-sm text-content-3 mt-1">
          {t("ozEquivalent", { ratio: data.ratio.toFixed(1) })}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative h-3 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #ef4444 0%, #eab308 35%, #22c55e 55%, #22c55e 100%)",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-content-0 rounded-full shadow-md transition-all"
            style={{ left: `calc(${barPct}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-content-3 mt-1.5 tabular-nums">
          <span>{t("scaleExpensive")}</span>
          <span>{t("scaleMid")}</span>
          <span>{t("scaleCheap")}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-2 rounded-sm p-4">
          <div className="text-xs text-content-3 font-medium mb-1">
            {t("goldXau")}
          </div>
          <div className="text-lg font-bold text-content-0 tabular-nums">
            ${data.goldPrice.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-surface-2 rounded-sm p-4">
          <div className="text-xs text-content-3 font-medium mb-1">
            {t("silverXag")}
          </div>
          <div className="text-lg font-bold text-content-0 tabular-nums">
            ${data.silverPrice.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-surface-0 border border-border rounded-sm p-4">
        <div className="text-xs font-semibold text-content-0 mb-1.5">
          {t("interpretation")}
        </div>
        <p className="text-sm text-content-2 leading-relaxed">
          {zone.description}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: t("avg20y"), value: "~65x" },
          { label: t("historicLow"), value: "~15x (1980)" },
          { label: t("historicHigh"), value: "~124x (2020)" },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-sm font-bold text-content-0 tabular-nums">
              {item.value}
            </div>
            <div className="text-[10px] text-content-3">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
