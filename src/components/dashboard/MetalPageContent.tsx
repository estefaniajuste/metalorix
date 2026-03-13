"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  HistoryResult,
  MetalSpot,
  MetalSymbol,
  TimeRange,
} from "@/lib/providers/metals";
import dynamic from "next/dynamic";
import { METALS } from "@/lib/providers/metals";
import { RangeSelector } from "./RangeSelector";
import { DataTable } from "./DataTable";
import {
  convertPrice,
  formatConvertedPrice,
  currencySymbol,
  type Currency,
  type PriceUnit,
} from "@/lib/utils/units";

const PriceChart = dynamic(() => import("./PriceChart").then((m) => m.PriceChart), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-surface-1 border border-border rounded-DEFAULT animate-shimmer" />
  ),
});

function formatPrice(val: number) {
  return val >= 100
    ? val.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : val.toFixed(2);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "Ahora mismo";
  if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
  return `Hace ${Math.floor(diff / 3600000)}h`;
}

interface MetalPageContentProps {
  symbol: MetalSymbol;
}

export function MetalPageContent({ symbol }: MetalPageContentProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>("1M");
  const [spot, setSpot] = useState<MetalSpot | null>(null);
  const [history, setHistory] = useState<Record<string, HistoryResult>>({});
  const [eurUsdRate, setEurUsdRate] = useState(1.08);
  const historyRef = useRef(history);
  historyRef.current = history;

  const metal = METALS[symbol];

  const loadSpot = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      const { prices } = await res.json();
      const found = prices.find((p: MetalSpot) => p.symbol === symbol);
      if (found) setSpot(found);
    } catch {}
  }, [symbol]);

  const loadHistory = useCallback(
    async (range: TimeRange) => {
      const key = `${symbol}_${range}`;
      if (historyRef.current[key]) return;
      try {
        const res = await fetch(
          `/api/prices/history?symbol=${symbol}&range=${range}`
        );
        const { data, change, changePct } = await res.json();
        setHistory((prev) => ({ ...prev, [key]: { data, change, changePct } }));
      } catch {}
    },
    [symbol]
  );

  useEffect(() => {
    loadSpot();
    const interval = setInterval(loadSpot, 60000);
    return () => clearInterval(interval);
  }, [loadSpot]);

  useEffect(() => {
    fetch("/api/forex")
      .then((r) => r.json())
      .then((d) => {
        if (d.EURUSD) setEurUsdRate(d.EURUSD);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadHistory(activeRange);
  }, [activeRange, loadHistory]);

  // Preload all ranges
  useEffect(() => {
    (["1D", "1W", "1M", "1Y"] as TimeRange[]).forEach(loadHistory);
  }, [loadHistory]);

  const historyKey = `${symbol}_${activeRange}`;
  const currentHistory = history[historyKey] ?? null;
  const isUp = spot ? spot.change >= 0 : currentHistory ? currentHistory.change >= 0 : true;

  const iconColors: Record<string, string> = {
    XAU: "bg-[rgba(214,179,90,0.12)] text-brand-gold",
    XAG: "bg-[rgba(167,176,190,0.12)] text-[#A7B0BE]",
    XPT: "bg-[rgba(139,157,195,0.12)] text-[#8B9DC3]",
  };

  return (
    <div>
      {/* Price header */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-sm flex items-center justify-center font-bold text-lg ${iconColors[symbol]}`}
            >
              {symbol.slice(1)}
            </div>
            <div>
              <div className="text-sm text-content-3 font-medium">
                {symbol}/USD · Troy Ounce
              </div>
              {spot ? (
                <>
                  <div className="text-3xl font-bold text-content-0 tabular-nums">
                    ${formatPrice(spot.price)}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-sm font-medium tabular-nums ${
                        isUp ? "text-signal-up" : "text-signal-down"
                      }`}
                    >
                      {isUp ? "▲" : "▼"}{" "}
                      {isUp ? "+" : ""}
                      {spot.changePct}%
                    </span>
                    <span className="text-xs text-content-3">
                      {timeAgo(spot.updatedAt)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-10 w-48 bg-surface-2 rounded-xs animate-shimmer mt-1" />
              )}
            </div>
          </div>

          <RangeSelector active={activeRange} onChange={setActiveRange} />
        </div>
      </div>

      {/* Chart */}
      <PriceChart
        symbol={symbol}
        range={activeRange}
        history={currentHistory}
      />

      {/* Stats grid */}
      {currentHistory && currentHistory.data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Máximo del periodo",
              value: `$${formatPrice(Math.max(...currentHistory.data.map((d) => d.price)))}`,
            },
            {
              label: "Mínimo del periodo",
              value: `$${formatPrice(Math.min(...currentHistory.data.map((d) => d.price)))}`,
            },
            {
              label: "Variación",
              value: `${currentHistory.change >= 0 ? "+" : ""}$${formatPrice(Math.abs(currentHistory.change))}`,
              color: currentHistory.change >= 0,
            },
            {
              label: "Var. porcentual",
              value: `${currentHistory.changePct >= 0 ? "+" : ""}${currentHistory.changePct}%`,
              color: currentHistory.changePct >= 0,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-1 border border-border rounded-DEFAULT p-4"
            >
              <div className="text-xs text-content-3 font-medium mb-1">
                {stat.label}
              </div>
              <div
                className={`text-lg font-bold tabular-nums ${
                  stat.color !== undefined
                    ? stat.color
                      ? "text-signal-up"
                      : "text-signal-down"
                    : "text-content-0"
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversion table */}
      {spot && (
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-6">
          <h3 className="text-base font-semibold text-content-0 mb-4">
            Precio del {metal.name} por unidad
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-content-3 font-medium py-2 pr-4">Unidad</th>
                  <th className="text-right text-content-3 font-medium py-2 px-4">USD ($)</th>
                  <th className="text-right text-content-3 font-medium py-2 pl-4">EUR (€)</th>
                </tr>
              </thead>
              <tbody>
                {(["oz", "g", "kg"] as PriceUnit[]).map((u) => (
                  <tr key={u} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 text-content-1 font-medium">
                      {u === "oz" ? "Onza troy (31,1 g)" : u === "g" ? "Gramo" : "Kilogramo"}
                    </td>
                    <td className="py-3 px-4 text-right text-content-0 font-semibold tabular-nums">
                      ${formatConvertedPrice(convertPrice(spot.price, u, "USD", eurUsdRate))}
                    </td>
                    <td className="py-3 pl-4 text-right text-content-0 font-semibold tabular-nums">
                      €{formatConvertedPrice(convertPrice(spot.price, u, "EUR", eurUsdRate))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-content-3 mt-3">
            Tipo de cambio EUR/USD: {eurUsdRate.toFixed(4)}
          </p>
        </div>
      )}

      {/* Data table */}
      <DataTable history={currentHistory} range={activeRange} />
    </div>
  );
}
