"use client";

import { useTranslations } from "next-intl";
import type { TimeRange } from "@/lib/providers/metals";

const ranges: TimeRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "2Y", "5Y"];

interface RangeSelectorProps {
  active: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function RangeSelector({ active, onChange }: RangeSelectorProps) {
  const t = useTranslations("dashboard");
  return (
    <div
      className="flex items-center gap-1 bg-surface-2 rounded-sm p-1 w-fit"
      role="tablist"
      aria-label={t("timeRange")}
    >
      {ranges.map((range) => (
        <button
          key={range}
          role="tab"
          aria-selected={active === range}
          onClick={() => onChange(range)}
          className={`
            px-4 py-1.5 rounded-xs text-[13px] font-semibold transition-all duration-250 ease-smooth
            ${
              active === range
                ? "bg-surface-1 text-content-0 shadow-sm"
                : "text-content-2 hover:text-content-0"
            }
          `}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
