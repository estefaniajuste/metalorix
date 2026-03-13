"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { MetalSpot } from "@/lib/providers/metals";

export function GoldSilverRatioContent() {
  const t = useTranslations("ratioContent");
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [silverPrice, setSilverPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/prices");
        const { prices } = await res.json();
        const gold = prices.find((p: MetalSpot) => p.symbol === "XAU");
        const silver = prices.find((p: MetalSpot) => p.symbol === "XAG");
        if (gold) setGoldPrice(gold.price);
        if (silver) setSilverPrice(silver.price);
      } catch {}
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !goldPrice || !silverPrice) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-surface-1 border border-border rounded-DEFAULT animate-shimmer" />
        <div className="h-20 bg-surface-1 border border-border rounded-DEFAULT animate-shimmer" />
      </div>
    );
  }

  const ratio = goldPrice / silverPrice;

  function getZone(r: number) {
    if (r >= 80) return { label: t("silverUndervalued"), color: "text-signal-up", bgColor: "bg-signal-up-bg", interpretation: t("silverUndervaluedDesc") };
    if (r >= 60) return { label: t("neutralZone"), color: "text-brand-gold", bgColor: "bg-[rgba(214,179,90,0.12)]", interpretation: t("neutralZoneDesc") };
    return { label: t("goldUndervalued"), color: "text-signal-down", bgColor: "bg-signal-down-bg", interpretation: t("goldUndervaluedDesc") };
  }

  const zone = getZone(ratio);

  const barMin = 20;
  const barMax = 120;
  const barPct = Math.min(
    100,
    Math.max(0, ((ratio - barMin) / (barMax - barMin)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Main ratio display */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-sm text-content-3 font-medium mb-1">
              {t("currentRatio")}
            </div>
            <div className="text-5xl font-extrabold text-content-0 tabular-nums">
              {ratio.toFixed(1)}
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${zone.bgColor} ${zone.color}`}
              >
                {zone.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-surface-0 border border-border rounded-sm p-4 text-center">
              <div className="text-xs text-content-3 font-medium mb-1">
                {t("goldXau")}
              </div>
              <div className="text-xl font-bold text-brand-gold tabular-nums">
                ${goldPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-surface-0 border border-border rounded-sm p-4 text-center">
              <div className="text-xs text-content-3 font-medium mb-1">
                {t("silverXag")}
              </div>
              <div className="text-xl font-bold text-[#A7B0BE] tabular-nums">
                ${silverPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Visual bar */}
        <div className="mt-6">
          <div className="flex justify-between text-[10px] text-content-3 mb-1.5">
            <span>20</span>
            <span>40</span>
            <span className="font-semibold text-brand-gold">60</span>
            <span className="font-semibold text-brand-gold">80</span>
            <span>100</span>
            <span>120</span>
          </div>
          <div className="relative h-3 bg-surface-0 rounded-full border border-border overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-signal-down/20"
              style={{ width: `${((60 - barMin) / (barMax - barMin)) * 100}%` }}
            />
            <div
              className="absolute inset-y-0 bg-brand-gold/20"
              style={{
                left: `${((60 - barMin) / (barMax - barMin)) * 100}%`,
                width: `${((80 - 60) / (barMax - barMin)) * 100}%`,
              }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-signal-up/20"
              style={{
                left: `${((80 - barMin) / (barMax - barMin)) * 100}%`,
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-gold border-2 border-surface-1 shadow-lg transition-all"
              style={{ left: `calc(${barPct}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] mt-1.5">
            <span className="text-signal-down font-medium">{t("goldCheap")}</span>
            <span className="text-content-3">{t("neutral")}</span>
            <span className="text-signal-up font-medium">{t("silverCheap")}</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-content-2 leading-relaxed">
          {zone.interpretation}
        </p>
      </div>

      {/* Quick conversions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: t("oneOzGoldEquals"),
            value: t("ozOfSilver", { n: ratio.toFixed(1) }),
            sub: `$${goldPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })} = ${ratio.toFixed(1)} × $${silverPrice.toFixed(2)}`,
          },
          {
            label: t("toMatchOneOzGold"),
            value: `${(goldPrice / silverPrice).toFixed(0)} oz`,
            sub: t("gramsOfSilver", { n: ((goldPrice / silverPrice) * 31.1035).toFixed(0) }),
          },
          {
            label: t("historicalParity"),
            value: `$${(goldPrice / 16).toFixed(2)}/oz`,
            sub: t("silverWouldBeWorthMore", { pct: (goldPrice / 16 / silverPrice * 100 - 100).toFixed(0) }),
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-surface-1 border border-border rounded-DEFAULT p-5"
          >
            <div className="text-xs text-content-3 font-medium mb-1">
              {card.label}
            </div>
            <div className="text-lg font-bold text-content-0">{card.value}</div>
            <div className="text-xs text-content-3 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
