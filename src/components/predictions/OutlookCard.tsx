"use client";

import { OutlookGauge } from "./OutlookGauge";
import { FactorBreakdown } from "./FactorBreakdown";

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
  generatedAt: string;
}

interface OutlookCardProps {
  data: OutlookData | null;
  timeframeLabel: string;
  audienceLabel: string;
  t: (key: string) => string;
  weights: { technical: number; momentum: number; sentiment: number; macro: number };
}

function formatTimeAgo(dateStr: string, t: (key: string) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (hours > 0) return t("updatedAgo").replace("{time}", t("updatedHours").replace("{count}", String(hours)));
  return t("updatedAgo").replace("{time}", t("updatedMinutes").replace("{count}", String(Math.max(1, minutes))));
}

function buildKeySignals(
  factors: OutlookData["factorsJson"],
  t: (key: string) => string
): string[] {
  const signals: string[] = [];
  const tech = factors.technical.details;
  const mom = factors.momentum.details;
  const sent = factors.sentiment.details;
  const mac = factors.macro.details;

  if (tech.rsi) signals.push(`RSI: ${tech.rsi} (${tech.rsiSignal})`);
  if (tech.macd && tech.macd !== "no_data") signals.push(`MACD: ${String(tech.macd).replace(/_/g, " ")}`);
  if (tech.ma && tech.ma !== "no_data" && tech.ma !== "insufficient_data") signals.push(`MA: ${String(tech.ma).replace(/_/g, " ")}`);
  if (mom.trend && mom.trend !== "no_data") signals.push(`${t("momentum")}: ${String(mom.trend).replace(/_/g, " ")}`);
  if (sent.fearGreed) signals.push(`Fear & Greed: ${sent.fearGreed}`);
  if (mac.geopolitical && mac.geopolitical !== "no_data") signals.push(`Geo: ${String(mac.geopolitical).replace(/_/g, " ")}`);

  return signals.slice(0, 4);
}

export function OutlookCard({ data, timeframeLabel, audienceLabel, t, weights }: OutlookCardProps) {
  if (!data) {
    return (
      <div className="p-6 rounded-DEFAULT border border-border bg-surface-1">
        <h2 className="text-lg font-bold text-content-0 mb-1">{timeframeLabel}</h2>
        <span className="text-xs text-brand-gold bg-[rgba(214,179,90,0.12)] px-2 py-0.5 rounded font-medium">
          {audienceLabel}
        </span>
        <div className="mt-6 text-sm text-content-3 text-center py-8">{t("noData")}</div>
      </div>
    );
  }

  const factors = data.factorsJson;
  const signals = buildKeySignals(factors, t);

  const factorItems = [
    { key: "technical", label: t("technical"), description: t("technicalDesc"), score: factors.technical.score, weight: weights.technical },
    { key: "momentum", label: t("momentum"), description: t("momentumDesc"), score: factors.momentum.score, weight: weights.momentum },
    { key: "sentiment", label: t("sentiment"), description: t("sentimentDesc"), score: factors.sentiment.score, weight: weights.sentiment },
    { key: "macro", label: t("macro"), description: t("macroDesc"), score: factors.macro.score, weight: weights.macro },
  ];

  return (
    <div className="p-6 rounded-DEFAULT border border-border bg-surface-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-content-0">{timeframeLabel}</h2>
          <span className="text-xs text-brand-gold bg-[rgba(214,179,90,0.12)] px-2 py-0.5 rounded font-medium">
            {audienceLabel}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-content-3 uppercase tracking-wide">{t("confidence")}</div>
          <div className="text-xs font-semibold text-content-1">{t(data.confidence)}</div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <OutlookGauge
          score={data.score}
          signal={data.signal}
          signalLabel={t(data.signal)}
        />
      </div>

      <FactorBreakdown factors={factorItems} title={t("factorsTitle")} />

      {signals.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-content-0 mb-2 uppercase tracking-wide">{t("keySignals")}</h4>
          <ul className="space-y-1">
            {signals.map((s, i) => (
              <li key={i} className="text-xs text-content-2 flex items-start gap-1.5">
                <span className="text-brand-gold mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-[10px] text-content-3">
        {formatTimeAgo(data.generatedAt, t)}
      </div>
    </div>
  );
}
