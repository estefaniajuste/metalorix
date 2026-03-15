"use client";

import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="pt-10 pb-2 max-sm:pt-7">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-[clamp(20px,3vw,28px)] font-bold text-content-0 tracking-tight">
          {t("title")}{" "}
          <span className="text-brand-gold">{t("titleAccent")}</span>
        </h1>
      </div>
    </section>
  );
}
