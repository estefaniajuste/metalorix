"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 end-6 z-40 w-10 h-10 rounded-sm bg-surface-1 border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold shadow-card flex items-center justify-center transition-all hover:-translate-y-0.5 animate-fade-in"
      aria-label={t("scrollToTop")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
