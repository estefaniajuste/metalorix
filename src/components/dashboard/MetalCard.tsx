"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { METALS, type MetalSpot, type MetalSymbol } from "@/lib/providers/metals";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { Sparkline } from "./Sparkline";
import {
  convertPrice,
  formatConvertedPrice,
  currencySymbol,
  type Currency,
  type PriceUnit,
  type BaseUnit,
  type ForexRates,
} from "@/lib/utils/units";

const SLUG_MAP: Record<string, string> = {
  XAU: "oro",
  XAG: "plata",
  XPT: "platino",
  XPD: "paladio",
  HG: "cobre",
};

function formatChange(val: number) {
  const sign = val >= 0 ? "+" : "";
  return (
    sign +
    (Math.abs(val) >= 100
      ? val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : val.toFixed(2))
  );
}

interface MetalCardProps {
  spot: MetalSpot;
  active: boolean;
  onClick: () => void;
  sparklineData?: number[];
  rangeChange?: { change: number; changePct: number };
  currency?: Currency;
  unit?: PriceUnit;
  eurUsdRate?: number;
  forexRates?: ForexRates;
  marketClosed?: boolean;
}

export function MetalCard({
  spot,
  sparklineData,
  rangeChange,
  currency = "USD",
  unit = "oz",
  eurUsdRate = 1.08,
  forexRates,
  marketClosed = false,
}: MetalCardProps) {
  const td = useTranslations("dashboard");
  const tm = useTranslations("metalNames");
  const locale = useLocale();
  const metal = METALS[spot.symbol as MetalSymbol];
  const baseUnit = (metal?.unit ?? "oz") as BaseUnit;
  const effectiveUnit = (unit === "oz" && baseUnit === "lb") ? "lb" : unit;
  const rangeIsZero = rangeChange && Math.abs(rangeChange.changePct) < 0.01;
  const useSpotFallback = rangeIsZero && Math.abs(spot.changePct) >= 0.01;
  const change = useSpotFallback ? spot.change : (rangeChange?.change ?? spot.change);
  const changePct = useSpotFallback ? spot.changePct : (rangeChange?.changePct ?? spot.changePct);
  const isUp = change >= 0;
  const rates = forexRates ?? { EUR: eurUsdRate };
  const displayPrice = convertPrice(spot.price, effectiveUnit, currency, rates, baseUnit);
  const displayChange = convertPrice(change, effectiveUnit, currency, rates, baseUnit);
  const sym = currencySymbol(currency);
  const unitLabel = effectiveUnit !== "oz" && effectiveUnit !== "lb" ? `/${effectiveUnit}` : "";
  const prevPrice = useRef(spot.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const isClosed = marketClosed && Math.abs(changePct) < 0.01;

  useEffect(() => {
    if (prevPrice.current !== spot.price && prevPrice.current > 0) {
      setFlash(spot.price > prevPrice.current ? "up" : "down");
      const timer = setTimeout(() => setFlash(null), 1000);
      prevPrice.current = spot.price;
      return () => clearTimeout(timer);
    }
    prevPrice.current = spot.price;
  }, [spot.price]);

  const accentColors: Record<string, string> = {
    XAU: "border-t-brand-gold",
    XAG: "border-t-[#A7B0BE]",
    XPT: "border-t-[#8B9DC3]",
    XPD: "border-t-[#CED0CE]",
    HG: "border-t-[#B87333]",
  };

  const iconColors: Record<string, string> = {
    XAU: "bg-[rgba(214,179,90,0.12)] text-brand-gold",
    XAG: "bg-[rgba(167,176,190,0.12)] text-[#A7B0BE]",
    XPT: "bg-[rgba(139,157,195,0.12)] text-[#8B9DC3]",
    XPD: "bg-[rgba(206,208,206,0.12)] text-[#CED0CE]",
    HG: "bg-[rgba(184,115,51,0.12)] text-[#B87333]",
  };

  return (
    <Link
      href={{ pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug(SLUG_MAP[spot.symbol], locale) } }}
      className={`
        block text-left w-full bg-surface-1 border border-border rounded-DEFAULT p-5
        transition-all duration-250 ease-smooth relative overflow-hidden
        border-t-[3px] ${accentColors[spot.symbol]}
        hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5
        ${flash === "up" ? "animate-flash-up" : flash === "down" ? "animate-flash-down" : ""}
      `}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-xs flex items-center justify-center font-bold text-xs ${iconColors[spot.symbol]}`}
        >
          {spot.symbol === "HG" ? "Cu" : spot.symbol.slice(1)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-content-0 leading-tight">
            {tm(spot.symbol as MetalSymbol)}
          </div>
          <div className="text-[11px] text-content-3">
            {spot.symbol}/{currency}{unitLabel}
          </div>
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <div className="ml-auto flex-shrink-0">
            <Sparkline
              data={sparklineData}
              color={isClosed ? "#D6B35A" : isUp ? "#34D399" : "#F87171"}
              width={56}
              height={22}
            />
          </div>
        )}
      </div>

      <div className="text-[clamp(20px,2.5vw,26px)] font-bold text-content-0 tracking-tight tabular-nums leading-none mb-1.5">
        {sym}{formatConvertedPrice(displayPrice)}
      </div>

      {isClosed ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-content-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold inline-block flex-shrink-0" />
          {td("marketClosed")}
        </div>
      ) : (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium tabular-nums ${
            isUp ? "text-signal-up" : "text-signal-down"
          }`}
        >
          <span className="text-[10px]">{isUp ? "▲" : "▼"}</span>
          {sym}{formatChange(displayChange)} ({isUp ? "+" : ""}{changePct}%)
        </div>
      )}
    </Link>
  );
}
