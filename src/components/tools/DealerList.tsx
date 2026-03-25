"use client";

import { useState } from "react";
import type { Dealer } from "@/lib/data/dealers";
import { DealerCard } from "./DealerCard";

type FilterType = "all" | "online" | "physical";

interface DealerListProps {
  dealers: Dealer[];
  locale: string;
  t: {
    filterAll: string;
    filterOnline: string;
    filterPhysical: string;
    noResults: string;
    dealersFound: string;
    typeOnline: string;
    typePhysical: string;
    typeBoth: string;
    visitWebsite: string;
    metalsAccepted: string;
    featured: string;
  };
}

export function DealerList({ dealers, locale, t }: DealerListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = dealers.filter((d) => {
    if (filter === "all") return true;
    if (filter === "online") return d.type === "online" || d.type === "both";
    if (filter === "physical") return d.type === "physical" || d.type === "both";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });

  const FILTERS: { id: FilterType; label: string }[] = [
    { id: "all", label: t.filterAll },
    { id: "online", label: t.filterOnline },
    { id: "physical", label: t.filterPhysical },
  ];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-surface-2 rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filter === f.id
                  ? "bg-surface-0 text-content-0 shadow-sm"
                  : "text-content-2 hover:text-content-0"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-content-3">
          {t.dealersFound.replace("{n}", String(filtered.length))}
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-content-3 py-8 text-center">{t.noResults}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((dealer) => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
