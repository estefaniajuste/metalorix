"use client";

import { useEffect, useState } from "react";
import type { MetalSpot } from "@/lib/providers/metals";

interface RatioData {
  goldPrice: number;
  silverPrice: number;
  ratio: number;
  loading: boolean;
}

function getRatioZone(ratio: number): {
  label: string;
  color: string;
  bg: string;
  description: string;
} {
  if (ratio < 50) {
    return {
      label: "Plata cara",
      color: "text-signal-down",
      bg: "bg-signal-down-bg",
      description:
        "La plata está relativamente cara respecto al oro. Históricamente, ratios por debajo de 50 sugieren que la plata puede estar sobrevalorada.",
    };
  }
  if (ratio < 70) {
    return {
      label: "Zona neutral",
      color: "text-brand-gold",
      bg: "bg-[rgba(214,179,90,0.12)]",
      description:
        "El ratio se encuentra en un rango neutral. No hay una señal clara de infravaloración o sobrevaloración de la plata respecto al oro.",
    };
  }
  if (ratio < 90) {
    return {
      label: "Plata barata",
      color: "text-signal-up",
      bg: "bg-signal-up-bg",
      description:
        "La plata está relativamente barata respecto al oro. Históricamente, ratios por encima de 70 sugieren una oportunidad potencial en plata.",
    };
  }
  return {
    label: "Plata muy barata",
    color: "text-signal-up",
    bg: "bg-signal-up-bg",
    description:
      "La plata está muy infravalorada respecto al oro. Ratios por encima de 90 son extremos históricos y suelen revertirse a medio plazo.",
  };
}

export function GoldSilverRatio() {
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
        No se pudieron cargar los precios para calcular el ratio.
      </div>
    );
  }

  const zone = getRatioZone(data.ratio);

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
          Ratio Oro / Plata
        </h3>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${zone.bg} ${zone.color}`}
        >
          {zone.label}
        </span>
      </div>

      {/* Big number */}
      <div className="text-center mb-6">
        <div className="text-5xl font-extrabold text-content-0 tabular-nums">
          {data.ratio.toFixed(1)}x
        </div>
        <div className="text-sm text-content-3 mt-1">
          1 oz de oro = {data.ratio.toFixed(1)} oz de plata
        </div>
      </div>

      {/* Gauge bar */}
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
          <span>30x (plata cara)</span>
          <span>70x</span>
          <span>120x (plata barata)</span>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-2 rounded-sm p-4">
          <div className="text-xs text-content-3 font-medium mb-1">
            Oro (XAU)
          </div>
          <div className="text-lg font-bold text-content-0 tabular-nums">
            ${data.goldPrice.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-surface-2 rounded-sm p-4">
          <div className="text-xs text-content-3 font-medium mb-1">
            Plata (XAG)
          </div>
          <div className="text-lg font-bold text-content-0 tabular-nums">
            ${data.silverPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-surface-0 border border-border rounded-sm p-4">
        <div className="text-xs font-semibold text-content-0 mb-1.5">
          Interpretación
        </div>
        <p className="text-sm text-content-2 leading-relaxed">
          {zone.description}
        </p>
      </div>

      {/* Historical reference */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Media 20 años", value: "~65x" },
          { label: "Mínimo histórico", value: "~15x (1980)" },
          { label: "Máximo histórico", value: "~124x (2020)" },
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
