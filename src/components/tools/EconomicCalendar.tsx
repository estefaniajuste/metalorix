"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  getLocalizedEvents,
  type EconomicEvent,
} from "@/lib/data/economic-events";

type FilterImpact = "all" | "high" | "medium" | "low";
type ViewMode = "upcoming" | "all-events";

const IMPACT_COLORS: Record<string, string> = {
  high: "bg-signal-down",
  medium: "bg-brand-gold",
  low: "bg-content-3",
};

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00Z");
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

export function EconomicCalendar() {
  const t = useTranslations("calendarPage");
  const locale = useLocale();

  const impactLabels: Record<string, string> = {
    high: t("impactHigh"),
    medium: t("impactMedium"),
    low: t("impactLow"),
  };

  const categoryLabels: Record<string, string> = {
    "monetary-policy": t("catMonetaryPolicy"),
    inflation: t("catInflation"),
    employment: t("catEmployment"),
    gdp: t("catGDP"),
    trade: t("catTrade"),
    sentiment: t("catSentiment"),
  };

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00Z");
    return d.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function daysLabel(n: number): string {
    if (n === 0) return t("today");
    if (n === 1) return t("tomorrow");
    if (n < 0) return t("daysAgo", { n: Math.abs(n) });
    return t("inDays", { n });
  }

  const [filter, setFilter] = useState<FilterImpact>("all");
  const [view, setView] = useState<ViewMode>("upcoming");
  const [expanded, setExpanded] = useState<string | null>(null);

  const localizedEvents = useMemo(() => getLocalizedEvents(locale), [locale]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const cutoff = new Date(now.getTime() + 60 * 86400000);

    const events: Array<
      EconomicEvent & { nextDate: string; daysUntilEvent: number }
    > = [];

    for (const ev of localizedEvents) {
      if (filter !== "all" && ev.impact !== filter) continue;

      for (const dateStr of ev.dates2026) {
        const d = new Date(dateStr + "T00:00:00Z");
        if (d >= now && d <= cutoff) {
          events.push({
            ...ev,
            nextDate: dateStr,
            daysUntilEvent: daysUntil(dateStr),
          });
          break;
        }
      }
    }

    events.sort((a, b) => a.daysUntilEvent - b.daysUntilEvent);
    return events;
  }, [filter, localizedEvents]);

  const allEvents = useMemo(() => {
    return localizedEvents.filter(
      (ev) => filter === "all" || ev.impact === filter
    );
  }, [filter, localizedEvents]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setView("upcoming")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              view === "upcoming"
                ? "bg-brand-gold text-[#0B0F17]"
                : "text-content-3 hover:text-content-1"
            }`}
          >
            {t("upcomingEvents")}
          </button>
          <button
            onClick={() => setView("all-events")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              view === "all-events"
                ? "bg-brand-gold text-[#0B0F17]"
                : "text-content-3 hover:text-content-1"
            }`}
          >
            {t("allEvents")}
          </button>
        </div>

        <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
          {(["all", "high", "medium"] as FilterImpact[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-brand-gold text-[#0B0F17]"
                  : "text-content-3 hover:text-content-1"
              }`}
            >
              {f === "all"
                ? t("all")
                : f === "high"
                  ? t("highImpact")
                  : t("mediumImpact")}
            </button>
          ))}
        </div>
      </div>

      {view === "upcoming" ? (
        <div className="space-y-3">
          {upcomingEvents.length === 0 ? (
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-8 text-center text-content-3 text-sm">
              {t("noEvents")}
            </div>
          ) : (
            upcomingEvents.map((ev) => (
              <button
                key={`${ev.id}-${ev.nextDate}`}
                onClick={() =>
                  setExpanded(
                    expanded === `${ev.id}-${ev.nextDate}`
                      ? null
                      : `${ev.id}-${ev.nextDate}`
                  )
                }
                className="w-full text-left bg-surface-1 border border-border rounded-DEFAULT p-4 hover:border-border-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${IMPACT_COLORS[ev.impact]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-content-0">
                        {ev.nameShort}
                      </span>
                      <span className="text-xs text-content-3 bg-surface-0 px-2 py-0.5 rounded">
                        {ev.region}
                      </span>
                      <span className="text-xs text-content-3 bg-surface-0 px-2 py-0.5 rounded">
                        {categoryLabels[ev.category]}
                      </span>
                    </div>
                    <div className="text-xs text-content-3 mt-1">
                      {ev.name}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-content-0">
                      {formatDate(ev.nextDate)}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        ev.daysUntilEvent <= 1
                          ? "text-signal-down"
                          : ev.daysUntilEvent <= 7
                            ? "text-brand-gold"
                            : "text-content-3"
                      }`}
                    >
                      {daysLabel(ev.daysUntilEvent)}
                    </div>
                  </div>
                </div>

                {expanded === `${ev.id}-${ev.nextDate}` && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm">
                    <p className="text-content-2 leading-relaxed">
                      {ev.description}
                    </p>
                    <div className="flex items-start gap-2">
                      <span className="text-brand-gold font-medium flex-shrink-0">
                        {t("metalImpact")}
                      </span>
                      <span className="text-content-2">
                        {ev.metalImpact}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-content-3">
                      <span>
                        {t("impact")}{" "}
                        <span className="font-medium text-content-1">
                          {impactLabels[ev.impact]}
                        </span>
                      </span>
                      <span>
                        {t("frequency")}{" "}
                        <span className="font-medium text-content-1">
                          {ev.frequency}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-0">
                  <th className="text-left text-content-3 font-medium py-3 px-4">
                    {t("event")}
                  </th>
                  <th className="text-left text-content-3 font-medium py-3 px-4 hidden sm:table-cell">
                    {t("category")}
                  </th>
                  <th className="text-center text-content-3 font-medium py-3 px-4">
                    {t("impact")}
                  </th>
                  <th className="text-left text-content-3 font-medium py-3 px-4">
                    {t("frequency")}
                  </th>
                  <th className="text-left text-content-3 font-medium py-3 px-4 hidden md:table-cell">
                    {t("metalEffect")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allEvents.map((ev) => (
                  <tr
                    key={ev.id}
                    className="border-b border-border/50 last:border-0 hover:bg-surface-0/50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-content-0">
                        {ev.nameShort}
                      </div>
                      <div className="text-xs text-content-3">{ev.region}</div>
                    </td>
                    <td className="py-3 px-4 text-content-2 hidden sm:table-cell">
                      {categoryLabels[ev.category]}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${IMPACT_COLORS[ev.impact]}`}
                        />
                        <span className="text-xs text-content-2">
                          {impactLabels[ev.impact]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-content-2 text-xs">
                      {ev.frequency}
                    </td>
                    <td className="py-3 px-4 text-content-2 text-xs leading-relaxed hidden md:table-cell max-w-[250px]">
                      {ev.metalImpact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
