"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { HistoryResult, MetalSymbol, TimeRange } from "@/lib/providers/metals";
import {
  TechnicalIndicators,
  MIN_HISTORY_FOR_TECH_INDICATORS,
} from "@/components/dashboard/TechnicalIndicators";

const SYMBOLS: MetalSymbol[] = ["XAU", "XAG", "XPT", "XPD", "HG"];
const RANGES: { value: TimeRange; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
];

export function ToolsTechnicalIndicators() {
  const t = useTranslations("technicalIndicators");
  const tm = useTranslations("metalNames");
  const te = useTranslations("errors");

  const [symbol, setSymbol] = useState<MetalSymbol>("XAU");
  const [range, setRange] = useState<TimeRange>("1M");
  const [history, setHistory] = useState<HistoryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadHistory = useCallback(async (s: MetalSymbol, r: TimeRange) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/prices/history?symbol=${s}&range=${r}`);
      const { data, change, changePct } = await res.json();
      setHistory({ data, change, changePct });
    } catch {
      setError(true);
      setHistory(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(symbol, range);
  }, [symbol, range, loadHistory]);

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-content-0">
            {t("title")}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {SYMBOLS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSymbol(s)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  symbol === s
                    ? "bg-brand-gold/20 text-brand-gold border-b-2 border-brand-gold"
                    : "text-content-2 hover:text-content-0 hover:bg-surface-2"
                }`}
              >
                {tm(s)}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  range === r.value
                    ? "bg-brand-gold/20 text-brand-gold border-b-2 border-brand-gold"
                    : "text-content-2 hover:text-content-0 hover:bg-surface-2"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-[140px] bg-surface-2 rounded-DEFAULT animate-shimmer" />
          <div className="h-[160px] bg-surface-2 rounded-DEFAULT animate-shimmer" />
          <div className="h-[200px] bg-surface-2 rounded-DEFAULT animate-shimmer" />
        </div>
      )}

      {error && (
        <p className="text-sm text-content-3 py-8 text-center">
          {te("unexpectedError")}
        </p>
      )}

      {!loading && !error && history && history.data.length < MIN_HISTORY_FOR_TECH_INDICATORS && (
        <p className="text-sm text-content-3 py-8 text-center">
          {te("somethingWrong")}
        </p>
      )}

      {!loading && !error && history && history.data.length >= MIN_HISTORY_FOR_TECH_INDICATORS && (
        <TechnicalIndicators history={history} hideTitle />
      )}
    </div>
  );
}
