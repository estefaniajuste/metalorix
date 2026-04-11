"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { OutlookCard } from "./OutlookCard";
import { OutlookNarrative } from "./OutlookNarrative";

const METALS = [
  { symbol: "XAU", nameKey: "XAU" },
  { symbol: "XAG", nameKey: "XAG" },
  { symbol: "XPT", nameKey: "XPT" },
  { symbol: "XPD", nameKey: "XPD" },
] as const;

const SHORT_WEIGHTS = { technical: 0.4, momentum: 0.25, sentiment: 0.2, macro: 0.15 };
const LONG_WEIGHTS = { technical: 0.2, momentum: 0.15, sentiment: 0.3, macro: 0.35 };

interface OutlookData {
  score: number;
  signal: string;
  confidence: string;
  factorsJson: {
    technical: { score: number; details: Record<string, string | number> };
    momentum: { score: number; details: Record<string, string | number> };
    sentiment: { score: number; details: Record<string, string | number> };
    macro: { score: number; details: Record<string, string | number> };
  };
  narrative: string | null;
  narrativeEs: string | null;
  generatedAt: string;
}

interface ApiResponse {
  symbol: string;
  short: OutlookData | null;
  long: OutlookData | null;
}

export function MetalOutlookPage({ locale }: { locale: string }) {
  const t = useTranslations("outlook");
  const tm = useTranslations("metalNames");

  const [selected, setSelected] = useState<string>("XAU");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOutlook = useCallback(async (symbol: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/outlook?symbol=${symbol}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData({ symbol, short: null, long: null });
      }
    } catch {
      setData({ symbol, short: null, long: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutlook(selected);
  }, [selected, fetchOutlook]);

  const getNarrative = (outlook: OutlookData | null): string | null => {
    if (!outlook) return null;
    if (locale === "es" && outlook.narrativeEs) return outlook.narrativeEs;
    return outlook.narrative;
  };

  const shortNarrative = getNarrative(data?.short ?? null);
  const longNarrative = getNarrative(data?.long ?? null);
  const combinedNarrative = [shortNarrative, longNarrative].filter(Boolean).join("\n\n");

  return (
    <div>
      {/* Metal tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {METALS.map((m) => (
          <button
            key={m.symbol}
            onClick={() => setSelected(m.symbol)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${
              selected === m.symbol
                ? "bg-brand-gold text-[#0b0f17]"
                : "bg-surface-1 border border-border text-content-1 hover:border-brand-gold/40"
            }`}
          >
            {tm(m.nameKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="h-[420px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" />
          <div className="h-[420px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" />
        </div>
      ) : (
        <>
          {/* Two-panel outlook */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <OutlookCard
              data={data?.short ?? null}
              timeframeLabel={t("shortTerm")}
              audienceLabel={t("shortTermLabel")}
              t={(key) => t(key)}
              weights={SHORT_WEIGHTS}
            />
            <OutlookCard
              data={data?.long ?? null}
              timeframeLabel={t("longTerm")}
              audienceLabel={t("longTermLabel")}
              t={(key) => t(key)}
              weights={LONG_WEIGHTS}
            />
          </div>

          {/* Narrative */}
          {combinedNarrative && (
            <div className="mb-8">
              <OutlookNarrative
                narrative={combinedNarrative}
                aiDisclaimerText={t("aiDisclaimer")}
                aiAnalysisTitle={t("aiAnalysis")}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
