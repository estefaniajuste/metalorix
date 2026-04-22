"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface LivePrice {
  symbol: string;
  priceUsd: number;
  changePct24h: number;
}

function GoldTicker() {
  const [gold, setGold] = useState<LivePrice | null>(null);

  useEffect(() => {
    try {
      const initial = (window as any).__MTX_INITIAL_PRICES__?.prices as LivePrice[] | undefined;
      const xau = initial?.find((p) => p.symbol === "XAU");
      if (xau) setGold(xau);
    } catch {}
  }, []);

  if (!gold) return null;

  const up = gold.changePct24h >= 0;
  const pct = Math.abs(gold.changePct24h).toFixed(2);
  const price = gold.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="text-content-3 font-medium">XAU</span>
      <span className="font-semibold text-content-0">${price}</span>
      <span className={`inline-flex items-center gap-0.5 font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          {up
            ? <polygon points="5,1 9,9 1,9" />
            : <polygon points="5,9 9,1 1,1" />}
        </svg>
        {pct}%
      </span>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="pt-8 pb-1 max-sm:pt-6 animate-fade-in-up">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-[clamp(20px,3vw,28px)] font-bold text-content-0 tracking-tight mb-1">
              {t("title")}{" "}
              <span className="text-brand-gold">{t("titleAccent")}</span>
            </h1>
            <p className="text-[13px] text-content-2 max-w-[520px]">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <GoldTicker />
            <Link
              href="/alertas"
              className="text-[12px] font-medium text-content-3 hover:text-brand-gold transition-colors hidden sm:block"
            >
              {t("heroLink")} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
