"use client";

import { useEffect, useState } from "react";
import type { MetalSpot, MetalSymbol } from "@/lib/providers/metals";
import { METALS } from "@/lib/providers/metals";

const TROY_OZ_TO_GRAMS = 31.1035;
const GRAMS_TO_KG = 1000;

type Unit = "oz" | "g" | "kg";

const UNIT_LABELS: Record<Unit, string> = {
  oz: "Onzas Troy",
  g: "Gramos",
  kg: "Kilogramos",
};

function convert(value: number, from: Unit, to: Unit): number {
  let grams = value;
  if (from === "oz") grams = value * TROY_OZ_TO_GRAMS;
  else if (from === "kg") grams = value * GRAMS_TO_KG;

  if (to === "g") return grams;
  if (to === "oz") return grams / TROY_OZ_TO_GRAMS;
  return grams / GRAMS_TO_KG;
}

export function UnitConverter() {
  const [metal, setMetal] = useState<MetalSymbol>("XAU");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState<Unit>("oz");
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/prices");
        const { prices: data } = await res.json();
        const map: Record<string, number> = {};
        data.forEach((p: MetalSpot) => {
          map[p.symbol] = p.price;
        });
        setPrices(map);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const pricePerOz = prices[metal] ?? 0;
  const numAmount = parseFloat(amount) || 0;
  const amountInOz = convert(numAmount, unit, "oz");
  const totalValue = amountInOz * pricePerOz;

  const conversions: { unit: Unit; amount: number }[] = (
    ["oz", "g", "kg"] as Unit[]
  )
    .filter((u) => u !== unit)
    .map((u) => ({ unit: u, amount: convert(numAmount, unit, u) }));

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <h3 className="text-lg font-bold text-content-0 mb-6">
        Conversor de peso y precio
      </h3>

      {/* Metal selector */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {(Object.keys(METALS) as MetalSymbol[]).map((sym) => (
          <button
            key={sym}
            onClick={() => setMetal(sym)}
            className={`text-sm font-medium py-2 rounded-sm transition-all ${
              metal === sym
                ? "bg-brand-gold text-surface-0"
                : "bg-surface-2 text-content-2 hover:bg-surface-2/80"
            }`}
          >
            {METALS[sym].name}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1">
          <label className="text-xs text-content-3 font-medium mb-1.5 block">
            Cantidad
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-surface-0 border border-border rounded-sm px-3 py-2.5 text-content-0 text-sm tabular-nums focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>
        <div className="w-36">
          <label className="text-xs text-content-3 font-medium mb-1.5 block">
            Unidad
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="w-full bg-surface-0 border border-border rounded-sm px-3 py-2.5 text-content-0 text-sm focus:outline-none focus:border-brand-gold transition-colors"
          >
            {(["oz", "g", "kg"] as Unit[]).map((u) => (
              <option key={u} value={u}>
                {UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Value */}
      <div className="bg-surface-2 rounded-sm p-4 mb-5 text-center">
        <div className="text-xs text-content-3 font-medium mb-1">
          Valor estimado
        </div>
        {loading ? (
          <div className="h-8 w-32 mx-auto bg-surface-1 rounded-xs animate-shimmer" />
        ) : (
          <div className="text-3xl font-extrabold text-content-0 tabular-nums">
            ${totalValue.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}
        <div className="text-xs text-content-3 mt-1">
          USD al precio spot actual
        </div>
      </div>

      {/* Conversions */}
      <div className="space-y-2">
        <div className="text-xs text-content-3 font-medium">Equivalencias</div>
        {conversions.map((c) => (
          <div
            key={c.unit}
            className="flex justify-between items-center bg-surface-0 border border-border rounded-sm px-4 py-3"
          >
            <span className="text-sm text-content-2">{UNIT_LABELS[c.unit]}</span>
            <span className="text-sm font-bold text-content-0 tabular-nums">
              {c.amount < 0.01
                ? c.amount.toExponential(3)
                : c.amount.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
            </span>
          </div>
        ))}
      </div>

      {/* Price per unit */}
      {pricePerOz > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {(["oz", "g", "kg"] as Unit[]).map((u) => {
            const priceInUnit =
              u === "oz"
                ? pricePerOz
                : u === "g"
                  ? pricePerOz / TROY_OZ_TO_GRAMS
                  : (pricePerOz / TROY_OZ_TO_GRAMS) * GRAMS_TO_KG;
            return (
              <div key={u} className="bg-surface-0 border border-border rounded-sm p-3">
                <div className="text-[10px] text-content-3 font-medium">
                  Precio / {UNIT_LABELS[u].toLowerCase().replace("onzas troy", "oz")}
                </div>
                <div className="text-sm font-bold text-content-0 tabular-nums mt-0.5">
                  ${priceInUnit.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
