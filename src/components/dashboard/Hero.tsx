"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import type { MetalSpot, MetalSymbol } from "@/lib/providers/metals";
import { METALS } from "@/lib/providers/metals";
import { usePrices } from "@/lib/hooks/use-prices";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";

const SLUG_MAP: Record<string, string> = {
  XAU: "oro",
  XAG: "plata",
  XPT: "platino",
  XPD: "paladio",
  HG: "cobre",
};

function formatPrice(val: number) {
  return val >= 100
    ? val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : val.toFixed(2);
}

function MiniTicker({ spot }: { spot: MetalSpot }) {
  const tm = useTranslations("metalNames");
  const locale = useLocale();
  const metal = METALS[spot.symbol as MetalSymbol];
  const isUp = spot.change >= 0;

  return (
    <Link
      href={{ pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug(SLUG_MAP[spot.symbol], locale) } }}
      className="flex items-center gap-3 px-4 py-3 bg-surface-1/60 backdrop-blur-sm border border-border/50 rounded-DEFAULT hover:border-border-hover hover:bg-surface-1/80 transition-all group"
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: metal?.color }}
      />
      <span className="text-xs font-semibold text-content-3 group-hover:text-content-2 transition-colors">
        {tm(spot.symbol as MetalSymbol)}
      </span>
      <span className="text-sm font-bold text-content-0 tabular-nums">
        ${formatPrice(spot.price)}
      </span>
      <span
        className={`text-xs font-medium tabular-nums ${
          isUp ? "text-signal-up" : "text-signal-down"
        }`}
      >
        {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{spot.changePct}%
      </span>
    </Link>
  );
}

function TickerSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-1/60 border border-border/50 rounded-DEFAULT">
      <div className="w-2 h-2 rounded-full bg-surface-2 animate-shimmer" />
      <div className="w-10 h-3 bg-surface-2 rounded-xs animate-shimmer" />
      <div className="w-16 h-4 bg-surface-2 rounded-xs animate-shimmer" />
      <div className="w-12 h-3 bg-surface-2 rounded-xs animate-shimmer" />
    </div>
  );
}

export function Hero() {
  const { prices } = usePrices();
  const t = useTranslations("home");

  return (
    <section
      className="relative overflow-hidden text-center py-[100px] max-sm:py-[72px]"
      style={{ background: "var(--hero-grad)" }}
    >
      <div className="absolute -top-[40%] -left-[10%] w-[120%] h-[180%] pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,var(--gold-glow)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-[720px] mx-auto px-6">
        <h1 className="text-[clamp(36px,6vw,64px)] font-extrabold text-content-0 tracking-tight leading-[1.1] mb-5">
          {t("title")} <span className="text-brand-gold">{t("titleAccent")}</span>
        </h1>
        <p className="text-[clamp(16px,2.2vw,20px)] text-content-2 max-w-[560px] mx-auto mb-9 leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="flex justify-center gap-3 flex-wrap mb-10">
          {prices
            ? prices.map((spot) => (
                <MiniTicker key={spot.symbol} spot={spot} />
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <TickerSkeleton key={i} />
              ))}
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="#dashboard"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(214,179,90,0.3)] transition-all"
          >
            {t("viewDashboard")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <Link
            href="/herramientas"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-1/60 backdrop-blur-sm border border-border/50 text-content-1 hover:bg-surface-1/80 hover:border-border-hover hover:-translate-y-px transition-all"
          >
            {t("tools")}
          </Link>
        </div>
      </div>
    </section>
  );
}
