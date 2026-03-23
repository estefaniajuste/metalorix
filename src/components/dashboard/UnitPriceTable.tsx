"use client";

import { useEffect, useState } from "react";
import type { MetalSpot, MetalSymbol } from "@/lib/providers/metals";
import { useTranslations } from "next-intl";

const TROY_OZ_GRAMS = 31.1035;

function fmt(val: number): string {
  if (val >= 100)
    return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (val >= 1) return val.toFixed(2);
  return val.toFixed(4);
}

interface Props {
  symbol: MetalSymbol;
}

export function UnitPriceTable({ symbol }: Props) {
  const t = useTranslations("unitPrice");
  const [price, setPrice] = useState<number | null>(null);
  const [eurRate, setEurRate] = useState(1.08);

  useEffect(() => {
    Promise.all([
      fetch("/api/prices").then((r) => r.json()),
      fetch("/api/forex").then((r) => r.json()),
    ])
      .then(([priceData, forexData]) => {
        const spot = (priceData.prices as MetalSpot[])?.find((p) => p.symbol === symbol);
        if (spot) setPrice(spot.price);
        if (forexData.EURUSD) setEurRate(forexData.EURUSD);
      })
      .catch(() => {});
  }, [symbol]);

  if (price === null) return null;

  const isLb = symbol === "HG";
  const baseGrams = isLb ? 453.592 : TROY_OZ_GRAMS;
  const baseLabel = isLb ? t("perLb") : t("perOz");

  const rows = [
    { label: baseLabel, usd: price, eur: price / eurRate },
    { label: t("perGram"), usd: price / baseGrams, eur: price / baseGrams / eurRate },
    { label: t("perKilo"), usd: (price / baseGrams) * 1000, eur: ((price / baseGrams) * 1000) / eurRate },
  ];

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <h3 className="text-base font-semibold text-content-0 mb-4">{t("heading")}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-content-3 font-medium py-2 pr-4">{t("unit")}</th>
              <th className="text-right text-content-3 font-medium py-2 px-4">USD</th>
              <th className="text-right text-content-3 font-medium py-2 pl-4">EUR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border/50 last:border-0">
                <td className="py-3 pr-4 text-content-1 font-medium">{r.label}</td>
                <td className="py-3 px-4 text-right text-content-0 font-semibold tabular-nums">
                  ${fmt(r.usd)}
                </td>
                <td className="py-3 pl-4 text-right text-content-0 font-semibold tabular-nums">
                  &euro;{fmt(r.eur)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
