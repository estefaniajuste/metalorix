"use client";

import { useTranslations } from "next-intl";

const SECTIONS = [
  { id: "prices", key: "anchorPrices" },
  { id: "news", key: "anchorNews" },
  { id: "tools", key: "anchorTools" },
  { id: "portfolio", key: "anchorPortfolio" },
  { id: "dealers", key: "anchorDealers" },
] as const;

export function MobileSectionNav() {
  const t = useTranslations("home");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-2 py-1.5 bg-surface-1/90 backdrop-blur-lg border border-border rounded-full shadow-lg">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="px-3 py-1.5 text-xs font-medium text-content-2 hover:text-brand-gold hover:bg-surface-2 rounded-full transition-colors whitespace-nowrap"
        >
          {t(s.key)}
        </button>
      ))}
    </div>
  );
}
