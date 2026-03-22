"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePrices } from "@/lib/hooks/use-prices";
import { useLocale } from "next-intl";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";

export function MarketPulseBanner() {
  const t = useTranslations("home.marketPulse");
  const locale = useLocale();
  const { prices } = usePrices();

  if (!prices || prices.length === 0) return null;

  const gold = prices.find((p) => p.symbol === "XAU");
  const silver = prices.find((p) => p.symbol === "XAG");
  if (!gold && !silver) return null;

  const primary = gold ?? silver!;
  const pct = primary.changePct;
  const isUp = pct >= 0;
  const metalKey = primary.symbol === "XAU" ? "gold" : "silver";
  const metalSlug = primary.symbol === "XAU" ? "oro" : "plata";

  return (
    <div className="mx-auto max-w-[1200px] px-6 mb-4">
      <Link
        href={{
          pathname: "/precio/[metal]" as const,
          params: { metal: getLocalizedMetalSlug(metalSlug, locale) },
        }}
        className="block"
      >
        <div className="flex flex-wrap items-center gap-2 py-2.5 px-4 bg-surface-1 border border-border rounded-DEFAULT text-sm hover:border-border-hover transition-colors group">
          <span className="text-content-2">{t("label")}</span>
          <span
            className={`font-semibold tabular-nums ${
              isUp ? "text-signal-up" : "text-signal-down"
            }`}
          >
            {t(metalKey)}{" "}
            {isUp ? "+" : ""}
            {pct.toFixed(2)}%
          </span>
          <span className="text-content-3">{t("period")}</span>
          <span className="ml-auto text-[11px] font-medium text-brand-gold group-hover:underline">
            {t("viewMetal")} →
          </span>
        </div>
      </Link>
    </div>
  );
}
