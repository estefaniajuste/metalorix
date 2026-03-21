"use client";

import { useMemo, useRef, useLayoutEffect, useCallback } from "react";
import type { HistoryResult } from "@/lib/providers/metals";
import {
  calculateRSI,
  calculateMACD,
  calculateBollinger,
} from "@/lib/utils/indicators";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/layout/ThemeProvider";

interface TechnicalIndicatorsProps {
  history: HistoryResult | null;
  /** Hide the section title when embedded in another layout (e.g. tools page) */
  hideTitle?: boolean;
  /** While the active range is fetching — show placeholder so the block is visible without scroll surprise */
  isLoading?: boolean;
}

type IndicatorTheme = {
  grid: string;
  label: string;
  rsiOverbought: string;
  rsiOversold: string;
  macdZero: string;
};

function indicatorTheme(isDark: boolean): IndicatorTheme {
  return isDark
    ? {
        grid: "rgba(255,255,255,0.08)",
        label: "rgba(255,255,255,0.35)",
        rsiOverbought: "rgba(220,38,38,0.06)",
        rsiOversold: "rgba(34,197,94,0.06)",
        macdZero: "rgba(255,255,255,0.1)",
      }
    : {
        grid: "rgba(0,0,0,0.1)",
        label: "rgba(0,0,0,0.45)",
        rsiOverbought: "rgba(220,38,38,0.08)",
        rsiOversold: "rgba(34,197,94,0.08)",
        macdZero: "rgba(0,0,0,0.12)",
      };
}

function drawRSI(
  canvas: HTMLCanvasElement,
  rsi: { values: number[]; timestamps: string[] },
  theme: IndicatorTheme
) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const PAD = { l: 40, r: 10, t: 10, b: 20 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  ctx.clearRect(0, 0, W, H);

  // Zones
  ctx.fillStyle = theme.rsiOverbought;
  ctx.fillRect(PAD.l, PAD.t, cW, cH * (30 / 100));
  ctx.fillStyle = theme.rsiOversold;
  ctx.fillRect(PAD.l, PAD.t + cH * (70 / 100), cW, cH * (30 / 100));

  // Grid
  for (const level of [30, 50, 70]) {
    const y = PAD.t + (1 - level / 100) * cH;
    ctx.strokeStyle = theme.grid;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(PAD.l, y);
    ctx.lineTo(W - PAD.r, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = theme.label;
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(String(level), PAD.l - 6, y + 4);
  }

  if (rsi.values.length < 2) return;

  // RSI line
  ctx.strokeStyle = "#A78BFA";
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  ctx.beginPath();
  rsi.values.forEach((v, i) => {
    const x = PAD.l + (i / (rsi.values.length - 1)) * cW;
    const y = PAD.t + (1 - v / 100) * cH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawMACD(
  canvas: HTMLCanvasElement,
  macd: { macd: number[]; signal: number[]; histogram: number[]; timestamps: string[] },
  theme: IndicatorTheme
) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const PAD = { l: 40, r: 10, t: 10, b: 20 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  ctx.clearRect(0, 0, W, H);

  if (macd.macd.length < 2) return;

  const allVals = [...macd.macd, ...macd.signal, ...macd.histogram];
  const maxAbs = Math.max(...allVals.map(Math.abs)) * 1.1;

  const toY = (v: number) => PAD.t + (1 - (v + maxAbs) / (2 * maxAbs)) * cH;
  const zeroY = toY(0);

  // Zero line
  ctx.strokeStyle = theme.macdZero;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(PAD.l, zeroY);
  ctx.lineTo(W - PAD.r, zeroY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Histogram bars
  const barW = Math.max(1, cW / macd.histogram.length - 1);
  macd.histogram.forEach((v, i) => {
    const x = PAD.l + (i / (macd.histogram.length - 1)) * cW;
    ctx.fillStyle = v >= 0 ? "rgba(34,197,94,0.4)" : "rgba(220,38,38,0.4)";
    const barH = Math.abs(toY(v) - zeroY);
    ctx.fillRect(x - barW / 2, v >= 0 ? zeroY - barH : zeroY, barW, barH);
  });

  // MACD line
  ctx.strokeStyle = "#3B82F6";
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  ctx.beginPath();
  macd.macd.forEach((v, i) => {
    const x = PAD.l + (i / (macd.macd.length - 1)) * cW;
    if (i === 0) ctx.moveTo(x, toY(v));
    else ctx.lineTo(x, toY(v));
  });
  ctx.stroke();

  // Signal line
  ctx.strokeStyle = "#F97316";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  macd.signal.forEach((v, i) => {
    const x = PAD.l + (i / (macd.signal.length - 1)) * cW;
    if (i === 0) ctx.moveTo(x, toY(v));
    else ctx.lineTo(x, toY(v));
  });
  ctx.stroke();
}

function drawBollinger(
  canvas: HTMLCanvasElement,
  boll: { upper: number[]; middle: number[]; lower: number[]; timestamps: string[] },
  prices: number[],
  theme: IndicatorTheme
) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const PAD = { l: 50, r: 10, t: 10, b: 20 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  ctx.clearRect(0, 0, W, H);

  if (boll.upper.length < 2) return;

  const allVals = [...boll.upper, ...boll.lower];
  const min = Math.min(...allVals) * 0.998;
  const max = Math.max(...allVals) * 1.002;
  const range = max - min;

  const toY = (v: number) => PAD.t + (1 - (v - min) / range) * cH;
  const toX = (i: number) => PAD.l + (i / (boll.upper.length - 1)) * cW;

  // Band fill
  ctx.fillStyle = "rgba(59,130,246,0.08)";
  ctx.beginPath();
  boll.upper.forEach((v, i) => {
    const x = toX(i);
    if (i === 0) ctx.moveTo(x, toY(v));
    else ctx.lineTo(x, toY(v));
  });
  for (let i = boll.lower.length - 1; i >= 0; i--) {
    ctx.lineTo(toX(i), toY(boll.lower[i]));
  }
  ctx.closePath();
  ctx.fill();

  // Upper band
  ctx.strokeStyle = "rgba(59,130,246,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  boll.upper.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v));
    else ctx.lineTo(toX(i), toY(v));
  });
  ctx.stroke();

  // Lower band
  ctx.beginPath();
  boll.lower.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v));
    else ctx.lineTo(toX(i), toY(v));
  });
  ctx.stroke();

  // Middle (SMA)
  ctx.strokeStyle = "#3B82F6";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  boll.middle.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v));
    else ctx.lineTo(toX(i), toY(v));
  });
  ctx.stroke();

  // Price
  const offset = prices.length - boll.upper.length;
  ctx.strokeStyle = "#D6B35A";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  boll.upper.forEach((_, i) => {
    const x = toX(i);
    const y = toY(prices[i + offset]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = theme.label;
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) {
    const val = min + (i / 4) * range;
    const y = PAD.t + (1 - i / 4) * cH;
    ctx.fillText(`$${val.toFixed(0)}`, PAD.l - 6, y + 4);
  }
}

/** Mínimo de velas para mostrar al menos RSI; usado también en la página de herramientas. */
export const MIN_HISTORY_FOR_TECH_INDICATORS = 16;
const MIN_POINTS_MACD = 35;
const MIN_POINTS_BOLL = 21;

export function TechnicalIndicators({
  history,
  hideTitle,
  isLoading = false,
}: TechnicalIndicatorsProps) {
  const t = useTranslations("technicalIndicators");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tm = useMemo(() => indicatorTheme(isDark), [isDark]);

  const rsiRef = useRef<HTMLCanvasElement>(null);
  const macdRef = useRef<HTMLCanvasElement>(null);
  const bollRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    if (!history?.data || history.data.length < MIN_HISTORY_FOR_TECH_INDICATORS) return null;

    const prices = history.data.map((d) => d.price);
    const timestamps = history.data.map((d) => d.timestamp);

    return {
      rsi: calculateRSI(prices, timestamps),
      macd:
        prices.length >= MIN_POINTS_MACD
          ? calculateMACD(prices, timestamps)
          : { macd: [], signal: [], histogram: [], timestamps: [] },
      bollinger:
        prices.length >= MIN_POINTS_BOLL
          ? calculateBollinger(prices, timestamps)
          : { upper: [], middle: [], lower: [], timestamps: [] },
      prices,
    };
  }, [history]);

  const showRsi = Boolean(data && data.rsi.values.length >= 2);
  const showMacd = Boolean(data && data.macd.macd.length >= 2);
  const showBoll = Boolean(data && data.bollinger.upper.length >= 2);

  const render = useCallback(() => {
    if (!data) return;
    if (showRsi && rsiRef.current) drawRSI(rsiRef.current, data.rsi, tm);
    if (showMacd && macdRef.current) drawMACD(macdRef.current, data.macd, tm);
    if (showBoll && bollRef.current) drawBollinger(bollRef.current, data.bollinger, data.prices, tm);
  }, [data, showRsi, showMacd, showBoll, tm]);

  useLayoutEffect(() => {
    render();
    const el = wrapRef.current;
    const ro = el ? new ResizeObserver(() => render()) : null;
    if (el) ro?.observe(el);
    window.addEventListener("resize", render);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", render);
    };
  }, [render]);

  if (isLoading && (!history?.data || history.data.length === 0)) {
    return (
      <div className="space-y-4 mb-6" aria-busy="true" aria-live="polite">
        {!hideTitle && (
          <h3 className="text-base font-semibold text-content-0">{t("title")}</h3>
        )}
        <p className="text-xs text-content-3 mb-2">{t("loadingHint")}</p>
        {[120, 140, 180].map((h) => (
          <div
            key={h}
            className="bg-surface-1 border border-border rounded-DEFAULT p-4 animate-pulse"
          >
            <div className="h-4 w-32 bg-surface-2 rounded-xs mb-3" />
            <div className="w-full bg-surface-2 rounded-xs" style={{ height: h }} />
          </div>
        ))}
      </div>
    );
  }

  if (!data || (!showRsi && !showMacd && !showBoll)) return null;

  const lastRsi = data.rsi.values[data.rsi.values.length - 1];
  const lastMacd = showMacd ? data.macd.macd[data.macd.macd.length - 1] : undefined;
  const lastSignal = showMacd ? data.macd.signal[data.macd.signal.length - 1] : undefined;
  const lastHist = showMacd ? data.macd.histogram[data.macd.histogram.length - 1] : undefined;

  const rsiZone =
    lastRsi >= 70
      ? { label: t("overbought"), color: "text-signal-down" }
      : lastRsi <= 30
        ? { label: t("oversold"), color: "text-signal-up" }
        : { label: t("neutral"), color: "text-content-2" };

  return (
    <div ref={wrapRef} className="space-y-4 mb-6">
      {!hideTitle && (
        <h3 className="text-base font-semibold text-content-0">
          {t("title")}
        </h3>
      )}

      {/* RSI */}
      {showRsi && (
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-content-0">RSI (14)</span>
              <span className={`text-xs font-medium ${rsiZone.color}`}>
                {lastRsi?.toFixed(1)} — {rsiZone.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-content-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-red-500/30 rounded" /> {t("overboughtLabel")}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-green-500/30 rounded" /> {t("oversoldLabel")}
              </span>
            </div>
          </div>
          <canvas ref={rsiRef} className="w-full block min-w-0" style={{ height: 120 }} />
        </div>
      )}

      {/* MACD */}
      {showMacd && lastHist !== undefined && lastMacd !== undefined && lastSignal !== undefined && (
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-content-0">
                MACD (12, 26, 9)
              </span>
              <span
                className={`text-xs font-medium ${
                  lastHist >= 0 ? "text-signal-up" : "text-signal-down"
                }`}
              >
                {lastMacd.toFixed(2)} / {lastSignal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-content-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-blue-500 rounded" /> MACD
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-orange-500 rounded" /> Signal
              </span>
            </div>
          </div>
          <canvas ref={macdRef} className="w-full block min-w-0" style={{ height: 140 }} />
        </div>
      )}

      {/* Bollinger */}
      {showBoll && (
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-content-0">
              {t("bollingerTitle")}
            </span>
            <div className="flex items-center gap-3 text-[10px] text-content-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-brand-gold rounded" /> {t("price")}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-blue-500 rounded" /> SMA(20)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-2 bg-blue-500/10 rounded border border-blue-500/30" /> {t("bands")}
              </span>
            </div>
          </div>
          <canvas ref={bollRef} className="w-full block min-w-0" style={{ height: 180 }} />
        </div>
      )}
    </div>
  );
}
