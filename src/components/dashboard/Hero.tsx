"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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
          <Link
            href="/alertas"
            className="text-[12px] font-medium text-content-3 hover:text-brand-gold transition-colors flex-shrink-0 hidden sm:block"
          >
            {t("heroLink")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
