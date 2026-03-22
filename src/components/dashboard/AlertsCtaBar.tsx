"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function AlertsCtaBar() {
  const t = useTranslations("home.alertsCta");

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6">
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-content-0">{t("title")}</p>
          <p className="text-sm text-content-2 mt-0.5">{t("desc")}</p>
        </div>
        <Link
          href="/alertas"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-[#0B0F17] rounded-sm text-sm font-bold hover:brightness-110 transition-all flex-shrink-0"
        >
          {t("cta")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
