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
import { TechnicalIndicators } from "./TechnicalIndicators";
import {
  convertPrice,
  formatConvertedPrice,
  currencySymbol,
  getUnitsForMetal,
  getLocaleCurrency,
  CURRENCY_SYMBOLS,
  type Currency,
  type PriceUnit,
  type BaseUnit,
  type ForexRates,
} from "@/lib/utils/units";
import { useTranslations, useLocale } from "next-intl";

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

function timeAgo(iso: string, t: (key: string, values?: Record<string, number>) => string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return t("justNow");
  if (diff < 3600000) return t("minutesAgo", { n: Math.floor(diff / 60000) });
  return t("hoursAgo", { n: Math.floor(diff / 3600000) });
}

interface MetalPageContentProps {
  symbol: MetalSymbol;
}

export function MetalPageContent({ symbol }: MetalPageContentProps) {
  const t = useTranslations("metalPage");
  const tMetals = useTranslations("metalNames");
  const locale = useLocale();
  const localeCfg = getLocaleCurrency(locale);
  const [activeRange, setActiveRange] = useState<TimeRange>("1M");
  const [spot, setSpot] = useState<MetalSpot | null>(null);
  const [history, setHistory] = useState<Record<string, HistoryResult>>({});
  const [forexRates, setForexRates] = useState<ForexRates>({ EUR: 1.08 });
  const historyRef = useRef(history);
  historyRef.current = history;

  const metal = METALS[symbol];
  const metalBaseUnit = (metal.unit ?? "oz") as BaseUnit;

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
      } catch {
        setHistory((prev) => ({
          ...prev,
          [key]: { data: [], change: 0, changePct: 0 },
        }));
      }
    },
    [symbol]
  );

  useEffect(() => {
    loadSpot();
    const interval = setInterval(loadSpot, 60000);
    return () => clearInterval(interval);
  }, [loadSpot]);

  useEffect(() => {
    setHistory({});
  }, [symbol]);

  useEffect(() => {
    fetch("/api/forex")
      .then((r) => r.json())
      .then((d) => {
        if (d.rates) setForexRates(d.rates);
        else if (d.EURUSD) setForexRates({ EUR: d.EURUSD });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadHistory(activeRange);
  }, [activeRange, loadHistory]);

  // Precarga el resto de rangos sin competir con el activo (evita peticiones duplicadas y prioriza el rango visible)
  useEffect(() => {
    const short: TimeRange[] = ["1H", "4H", "1D", "1W", "1M", "1Y"];
    const long: TimeRange[] = ["3M", "6M", "2Y", "5Y"];
    const t1 = window.setTimeout(() => {
      short.filter((r) => r !== activeRange).forEach(loadHistory);
    }, 50);
    const t2 = window.setTimeout(() => {
      long.filter((r) => r !== activeRange).forEach(loadHistory);
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loadHistory, activeRange]);

  const historyKey = `${symbol}_${activeRange}`;
  const currentHistory = history[historyKey] ?? null;
  /** Mientras no haya respuesta del API para el rango activo, mostramos placeholder de indicadores */
  const historyPending = !(historyKey in history);
  const isUp = spot ? spot.change >= 0 : currentHistory ? currentHistory.change >= 0 : true;

  const iconColors: Record<string, string> = {
    XAU: "bg-[rgba(214,179,90,0.12)] text-brand-gold",
    XAG: "bg-[rgba(167,176,190,0.12)] text-[#A7B0BE]",
    XPT: "bg-[rgba(139,157,195,0.12)] text-[#8B9DC3]",
    XPD: "bg-[rgba(206,208,206,0.12)] text-[#CED0CE]",
    HG: "bg-[rgba(184,115,51,0.12)] text-[#B87333]",
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
                      {timeAgo(spot.updatedAt, t)}
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

      {/* Indicadores justo bajo el gráfico: visibles sin scroll para quien entra por enlace */}
      <section id="indicadores-tecnicos" aria-label={t("technicalIndicatorsSection")}>
        <TechnicalIndicators history={currentHistory} isLoading={historyPending} />
      </section>

      {/* Stats grid */}
      {currentHistory && currentHistory.data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: t("periodHigh"),
              value: `$${formatPrice(Math.max(...currentHistory.data.map((d) => d.price)))}`,
            },
            {
              label: t("periodLow"),
              value: `$${formatPrice(Math.min(...currentHistory.data.map((d) => d.price)))}`,
            },
            {
              label: t("variation"),
              value: `${currentHistory.change >= 0 ? "+" : ""}$${formatPrice(Math.abs(currentHistory.change))}`,
              color: currentHistory.change >= 0,
            },
            {
              label: t("percentVariation"),
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
            {t("priceByUnit", { metal: tMetals(symbol) })}
          </h3>
          <div className="overflow-x-auto">
            {(() => {
              const localCurr = localeCfg.defaultCurrency;
              const showLocalCol = localCurr !== "USD" && localCurr !== "EUR";
              const localSym = CURRENCY_SYMBOLS[localCurr] ?? localCurr;
              return (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-content-3 font-medium py-2 pr-4">{t("unit")}</th>
                      <th className="text-right text-content-3 font-medium py-2 px-4">USD ($)</th>
                      <th className="text-right text-content-3 font-medium py-2 px-4">EUR (€)</th>
                      {showLocalCol && (
                        <th className="text-right text-content-3 font-medium py-2 pl-4">{localCurr} ({localSym})</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getUnitsForMetal(metalBaseUnit).map((u) => (
                      <tr key={u} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4 text-content-1 font-medium">
                          {u === "oz" ? t("troyOunce31") : u === "lb" ? t("pound") : u === "g" ? t("gram") : t("kilogram")}
                        </td>
                        <td className="py-3 px-4 text-right text-content-0 font-semibold tabular-nums">
                          ${formatConvertedPrice(convertPrice(spot.price, u, "USD", forexRates, metalBaseUnit))}
                        </td>
                        <td className="py-3 px-4 text-right text-content-0 font-semibold tabular-nums">
                          €{formatConvertedPrice(convertPrice(spot.price, u, "EUR", forexRates, metalBaseUnit))}
                        </td>
                        {showLocalCol && (
                          <td className="py-3 pl-4 text-right text-content-0 font-semibold tabular-nums">
                            {localSym}{formatConvertedPrice(convertPrice(spot.price, u, localCurr, forexRates, metalBaseUnit))}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
          <p className="text-[11px] text-content-3 mt-3">
            {t("exchangeRate")}: {(forexRates.EUR ?? 1.08).toFixed(4)}
          </p>
        </div>
      )}

      {/* Data table */}
      <DataTable history={currentHistory} range={activeRange} />
    </div>
  );
}
