"use client";

import { useEffect, useState } from "react";
import type { MetalSpot } from "@/lib/providers/metals";
import { useTranslations } from "next-intl";

const TROY_OZ_GRAMS = 31.1035;

const KARATS = [
  { key: "karat24", label: "24K (puro)", factor: 1.0 },
  { key: "22K", label: "22K", factor: 0.917 },
  { key: "18K", label: "18K", factor: 0.75 },
  { key: "14K", label: "14K", factor: 0.585 },
  { key: "9K", label: "9K", factor: 0.375 },
];

const METALS_LIST = [
  { symbol: "XAU", nameKey: "gold", color: "#D6B35A" },
  { symbol: "XAG", nameKey: "silver", color: "#A7B0BE" },
  { symbol: "XPT", nameKey: "platinum", color: "#8B9DC3" },
];

function fmt(val: number): string {
  if (val >= 100) return val.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (val >= 1) return val.toFixed(2);
  return val.toFixed(4);
}

export function GramPriceContent() {
  const t = useTranslations("gramPriceContent");
  const [prices, setPrices] = useState<MetalSpot[]>([]);
  const [eurRate, setEurRate] = useState(1.08);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/prices").then((r) => r.json()),
      fetch("/api/forex").then((r) => r.json()),
    ])
      .then(([priceData, forexData]) => {
        setPrices(priceData.prices || []);
        if (forexData.EURUSD) setEurRate(forexData.EURUSD);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-64 bg-surface-1 border border-border rounded-DEFAULT animate-shimmer" />;
  }

  const goldSpot = prices.find((p) => p.symbol === "XAU");
  const goldUsdOz = goldSpot?.price ?? 0;
  const goldUsdGram = goldUsdOz / TROY_OZ_GRAMS;
  const goldEurGram = goldUsdGram / eurRate;

  return (
    <div className="space-y-6">
      {/* Main display */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="text-center sm:text-left">
            <div className="text-xs text-content-3 font-medium uppercase tracking-wider mb-1">
              {t("goldGram24kUsd")}
            </div>
            <div className="text-4xl font-extrabold text-brand-gold tabular-nums">
              ${fmt(goldUsdGram)}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs text-content-3 font-medium uppercase tracking-wider mb-1">
              {t("goldGram24kEur")}
            </div>
            <div className="text-4xl font-extrabold text-brand-gold tabular-nums">
              €{fmt(goldEurGram)}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-content-3 mt-4">
          {t("basedOn", { price: fmt(goldUsdOz), rate: eurRate.toFixed(4) })}
        </p>
      </div>

      {/* Karat table */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
        <h3 className="text-base font-semibold text-content-0 mb-4">
          {t("gramPriceByKarat")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-content-3 font-medium py-2 pr-4">{t("karats")}</th>
                <th className="text-right text-content-3 font-medium py-2 px-4">{t("usdPerGram")}</th>
                <th className="text-right text-content-3 font-medium py-2 px-4">{t("eurPerGram")}</th>
                <th className="text-right text-content-3 font-medium py-2 pl-4">{t("usdPerKilo")}</th>
              </tr>
            </thead>
            <tbody>
              {KARATS.map((k) => (
                <tr key={k.key} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 text-content-1 font-medium">{k.key === "karat24" ? t("karat24") : k.label}</td>
                  <td className="py-3 px-4 text-right text-content-0 font-semibold tabular-nums">
                    ${fmt(goldUsdGram * k.factor)}
                  </td>
                  <td className="py-3 px-4 text-right text-content-0 font-semibold tabular-nums">
                    €{fmt(goldEurGram * k.factor)}
                  </td>
                  <td className="py-3 pl-4 text-right text-content-0 font-semibold tabular-nums">
                    ${fmt(goldUsdGram * k.factor * 1000)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All metals comparison */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
        <h3 className="text-base font-semibold text-content-0 mb-4">
          {t("comparison")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {METALS_LIST.map((m) => {
            const spot = prices.find((p) => p.symbol === m.symbol);
            if (!spot) return null;
            const usdGram = spot.price / TROY_OZ_GRAMS;
            const eurGram = usdGram / eurRate;
            return (
              <div
                key={m.symbol}
                className="bg-surface-0 border border-border rounded-sm p-4 text-center"
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: m.color }}
                >
                  {t(m.nameKey)}
                </div>
                <div className="text-xl font-bold text-content-0 tabular-nums">
                  ${fmt(usdGram)}/g
                </div>
                <div className="text-sm text-content-2 tabular-nums">
                  €{fmt(eurGram)}/g
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
