"use client";

import { useMemo, useRef, useEffect, useCallback } from "react";
import type { HistoryResult } from "@/lib/providers/metals";
import {
  calculateRSI,
  calculateMACD,
  calculateBollinger,
} from "@/lib/utils/indicators";

interface TechnicalIndicatorsProps {
  history: HistoryResult | null;
}

function drawRSI(
  canvas: HTMLCanvasElement,
  rsi: { values: number[]; timestamps: string[] }
) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const PAD = { l: 40, r: 10, t: 10, b: 20 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  ctx.clearRect(0, 0, W, H);

  // Zones
  ctx.fillStyle = "rgba(220,38,38,0.06)";
  ctx.fillRect(PAD.l, PAD.t, cW, cH * (30 / 100));
  ctx.fillStyle = "rgba(34,197,94,0.06)";
  ctx.fillRect(PAD.l, PAD.t + cH * (70 / 100), cW, cH * (30 / 100));

  // Grid
  for (const level of [30, 50, 70]) {
    const y = PAD.t + (1 - level / 100) * cH;
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(PAD.l, y);
    ctx.lineTo(W - PAD.r, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255,255,255,0.35)";
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
  macd: { macd: number[]; signal: number[]; histogram: number[]; timestamps: string[] }
) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
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
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
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
  prices: number[]
) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
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
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) {
    const val = min + (i / 4) * range;
    const y = PAD.t + (1 - i / 4) * cH;
    ctx.fillText(`$${val.toFixed(0)}`, PAD.l - 6, y + 4);
  }
}

export function TechnicalIndicators({ history }: TechnicalIndicatorsProps) {
  const rsiRef = useRef<HTMLCanvasElement>(null);
  const macdRef = useRef<HTMLCanvasElement>(null);
  const bollRef = useRef<HTMLCanvasElement>(null);

  const data = useMemo(() => {
    if (!history?.data || history.data.length < 30) return null;

    const prices = history.data.map((d) => d.price);
    const timestamps = history.data.map((d) => d.timestamp);

    return {
      rsi: calculateRSI(prices, timestamps),
      macd: calculateMACD(prices, timestamps),
      bollinger: calculateBollinger(prices, timestamps),
      prices,
    };
  }, [history]);

  const render = useCallback(() => {
    if (!data) return;
    if (rsiRef.current) drawRSI(rsiRef.current, data.rsi);
    if (macdRef.current) drawMACD(macdRef.current, data.macd);
    if (bollRef.current) drawBollinger(bollRef.current, data.bollinger, data.prices);
  }, [data]);

  useEffect(() => {
    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [render]);

  if (!data) return null;

  const lastRsi = data.rsi.values[data.rsi.values.length - 1];
  const lastMacd = data.macd.macd[data.macd.macd.length - 1];
  const lastSignal = data.macd.signal[data.macd.signal.length - 1];
  const lastHist = data.macd.histogram[data.macd.histogram.length - 1];

  const rsiZone =
    lastRsi >= 70
      ? { label: "Sobrecomprado", color: "text-signal-down" }
      : lastRsi <= 30
        ? { label: "Sobrevendido", color: "text-signal-up" }
        : { label: "Neutral", color: "text-content-2" };

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-base font-semibold text-content-0">
        Indicadores técnicos
      </h3>

      {/* RSI */}
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
              <span className="w-2 h-0.5 bg-red-500/30 rounded" /> &gt;70 Sobrecomprado
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-green-500/30 rounded" /> &lt;30 Sobrevendido
            </span>
          </div>
        </div>
        <canvas ref={rsiRef} className="w-full" style={{ height: 120 }} />
      </div>

      {/* MACD */}
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
              {lastMacd?.toFixed(2)} / {lastSignal?.toFixed(2)}
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
        <canvas ref={macdRef} className="w-full" style={{ height: 140 }} />
      </div>

      {/* Bollinger */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-content-0">
            Bandas de Bollinger (20, 2)
          </span>
          <div className="flex items-center gap-3 text-[10px] text-content-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-brand-gold rounded" /> Precio
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-blue-500 rounded" /> SMA(20)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-2 bg-blue-500/10 rounded border border-blue-500/30" /> Bandas
            </span>
          </div>
        </div>
        <canvas ref={bollRef} className="w-full" style={{ height: 180 }} />
      </div>
    </div>
  );
}
