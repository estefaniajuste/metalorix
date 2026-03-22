"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const VISITED_KEY = "mtx-has-visited";

export function FirstVisitWelcome() {
  const [show, setShow] = useState(false);
  const t = useTranslations("home.firstVisit");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visited = localStorage.getItem(VISITED_KEY);
    if (!visited) {
      const timer = setTimeout(() => setShow(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(VISITED_KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-[1200px] px-6 mb-6 animate-fade-in-up"
    >
      <div className="bg-surface-1 border border-brand-gold/30 rounded-DEFAULT p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-content-0 mb-1">{t("title")}</h2>
          <p className="text-sm text-content-2">{t("message")}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/alertas"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-[#0B0F17] rounded-sm text-sm font-semibold hover:brightness-110 transition-all"
          >
            {t("cta")}
          </Link>
          <button
            onClick={dismiss}
            type="button"
            className="px-3 py-2 text-sm font-medium text-content-2 hover:text-content-0 transition-colors"
          >
            {t("dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
