"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="pt-8 pb-2 max-sm:pt-6 animate-fade-in-up">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-[clamp(20px,3vw,28px)] font-bold text-content-0 tracking-tight mb-1">
          {t("title")}{" "}
          <span className="text-brand-gold">{t("titleAccent")}</span>
        </h1>
        <p className="text-[13px] text-content-2 mb-5 max-w-[520px]">
          {t("subtitle")}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Link href="/alertas" as="/alertas">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-gold text-[#0B0F17] rounded-full text-[11px] font-bold hover:brightness-110 transition-all cursor-pointer shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {t("heroCta")}
            </span>
          </Link>
          <span className="text-[10px] text-content-3 hidden sm:inline">{t("heroCtaDesc")}</span>
          <span className="w-px h-4 bg-border hidden sm:inline-block mx-1" />
          <a
            href="#dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-1 border border-border rounded-full text-[11px] font-medium text-content-2 hover:text-content-0 hover:border-border-hover hover:shadow-sm transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            {t("quickScrollPrices")}
          </a>
        </div>
      </div>
    </section>
  );
}
