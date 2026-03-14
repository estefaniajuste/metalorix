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
  UNITS,
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
  currency?: Currency;
  unit?: PriceUnit;
  eurUsdRate?: number;
}

export function MetalCard({
  spot,
  active,
  onClick,
  sparklineData,
  currency = "USD",
  unit = "oz",
  eurUsdRate = 1.08,
}: MetalCardProps) {
  const t = useTranslations("common");
  const tm = useTranslations("metalNames");
  const locale = useLocale();
  const metal = METALS[spot.symbol as MetalSymbol];
  const baseUnit = (metal?.unit ?? "oz") as BaseUnit;
  const effectiveUnit = (unit === "oz" && baseUnit === "lb") ? "lb" : unit;
  const isUp = spot.change >= 0;
  const displayPrice = convertPrice(spot.price, effectiveUnit, currency, eurUsdRate, baseUnit);
  const displayChange = convertPrice(spot.change, effectiveUnit, currency, eurUsdRate, baseUnit);
  const sym = currencySymbol(currency);
  const unitLabel = effectiveUnit !== "oz" && effectiveUnit !== "lb" ? `/${effectiveUnit}` : "";
  const prevPrice = useRef(spot.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

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
    <button
      onClick={onClick}
      className={`
        text-left w-full bg-surface-1 border border-border rounded-DEFAULT p-6
        transition-all duration-250 ease-smooth cursor-pointer relative overflow-hidden
        border-t-[3px] ${active ? accentColors[spot.symbol] : "border-t-transparent"}
        ${active ? "border-brand-gold" : ""}
        hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5
        ${flash === "up" ? "animate-flash-up" : flash === "down" ? "animate-flash-down" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xs flex items-center justify-center font-bold text-sm ${iconColors[spot.symbol]}`}
          >
            {spot.symbol.slice(1)}
          </div>
          <div>
            <div className="text-base font-semibold text-content-0">
              {tm(spot.symbol as MetalSymbol)}
            </div>
            <div className="text-[13px] text-content-3">
              {spot.symbol}/{currency}{unitLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 mb-1">
        <div className="text-[32px] font-bold text-content-0 tracking-tight tabular-nums leading-none">
          {sym}{formatConvertedPrice(displayPrice)}
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline
            data={sparklineData}
            color={isUp ? "#34D399" : "#F87171"}
            width={72}
            height={28}
          />
        )}
      </div>

      <div
        className={`flex items-center gap-2 text-sm font-medium tabular-nums ${
          isUp ? "text-signal-up" : "text-signal-down"
        }`}
      >
        <span className="text-xs">{isUp ? "▲" : "▼"}</span>
        {sym}{formatChange(displayChange)} ({isUp ? "+" : ""}
        {spot.changePct}%)
      </div>

      <Link
        href={{ pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug(SLUG_MAP[spot.symbol], locale) } }}
        onClick={(e) => e.stopPropagation()}
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-content-3 hover:text-brand-gold transition-colors"
      >
        {t("viewDetail")}
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </button>
  );
}
