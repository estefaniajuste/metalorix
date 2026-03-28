"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export type NewsArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  metals: string[] | null;
  publishedAt: string | null;
};

const METAL_COLORS: Record<string, string> = {
  XAU: "#D6B35A",
  XAG: "#A7B0BE",
  XPT: "#8B9DC3",
  XPD: "#CED0CE",
  HG: "#B87333",
};

const CATEGORY_FILTERS = ["all", "daily", "weekly", "event"] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const METAL_FILTERS = ["all", "XAU", "XAG", "XPT"] as const;
type MetalFilter = (typeof METAL_FILTERS)[number];

const PER_PAGE = 12;

export function NewsFilters({ articles }: { articles: NewsArticle[] }) {
  const t = useTranslations("news");
  const tc = useTranslations("categories");
  const tm = useTranslations("metalNames");
  const locale = useLocale();

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [metal, setMetal] = useState<MetalFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = articles;
    if (category !== "all") {
      result = result.filter((a) => a.category === category);
    }
    if (metal !== "all") {
      result = result.filter((a) => a.metals?.includes(metal));
    }
    return result;
  }, [articles, category, metal]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePageIndex = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePageIndex - 1) * PER_PAGE,
    safePageIndex * PER_PAGE,
  );

  const resetPage = () => setPage(1);

  const categoryLabels: Record<CategoryFilter, string> = {
    all: t("filterAll"),
    daily: tc("daily"),
    weekly: tc("weekly"),
    event: tc("event"),
  };

  const metalLabels: Record<MetalFilter, string> = {
    all: t("allMetals"),
    XAU: tm("XAU"),
    XAG: tm("XAG"),
    XPT: tm("XPT"),
  };

  const chipClass = (active: boolean) =>
    `px-4 py-2 rounded-xs text-sm font-medium transition-colors ${
      active
        ? "bg-brand-gold text-[#0B0F17]"
        : "bg-surface-2 text-content-2 hover:text-content-0 hover:bg-surface-3"
    }`;

  const CATEGORY_LABELS_FULL: Record<string, string> = {
    daily: tc("daily"),
    weekly: tc("weekly"),
    event: tc("event"),
    educational: tc("educational"),
  };

  return (
    <div className="mb-16">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-content-3 uppercase tracking-wider">
            {t("filterByType")}
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterByType")}>
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { setCategory(f); resetPage(); }}
                className={chipClass(category === f)}
              >
                {categoryLabels[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:ml-6">
          <span className="text-xs font-medium text-content-3 uppercase tracking-wider">
            {t("filterByMetal")}
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterByMetal")}>
            {METAL_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { setMetal(f); resetPage(); }}
                className={chipClass(metal === f)}
              >
                {f !== "all" && (
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                    style={{ backgroundColor: METAL_COLORS[f] }}
                  />
                )}
                {metalLabels[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-content-3 mb-4">
        {t("articlesCount", { count: filtered.length })}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginated.map((article) => {
          const mainMetal = article.metals?.[0] ?? "XAU";
          const color = METAL_COLORS[mainMetal] ?? "#D6B35A";
          return (
            <Link
              key={article.id}
              href={{ pathname: "/noticias/[slug]" as const, params: { slug: article.slug } }}
              className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden hover:border-border-hover hover:shadow-card hover:-translate-y-0.5 transition-all group"
            >
              <div className="h-1.5" style={{ backgroundColor: color }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider">
                    {CATEGORY_LABELS_FULL[article.category] ?? article.category}
                  </span>
                  {article.metals?.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-content-3"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: METAL_COLORS[m] ?? "#D6B35A" }}
                      />
                      {tm(m as "XAU" | "XAG" | "XPT" | "XPD" | "HG")}
                    </span>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-content-0 leading-snug mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-xs text-content-2 leading-relaxed line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="text-[10px] text-content-3">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : null}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {paginated.length === 0 && (
        <p className="text-sm text-content-3 text-center py-12">
          {t("noResults")}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={safePageIndex === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xs text-sm font-medium bg-surface-2 text-content-2 hover:text-content-0 hover:bg-surface-3 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            ← {t("prev")}
          </button>
          <span className="text-sm text-content-2">
            {t("page", { current: safePageIndex, total: totalPages })}
          </span>
          <button
            disabled={safePageIndex === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xs text-sm font-medium bg-surface-2 text-content-2 hover:text-content-0 hover:bg-surface-3 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {t("next")} →
          </button>
        </div>
      )}
    </div>
  );
}
