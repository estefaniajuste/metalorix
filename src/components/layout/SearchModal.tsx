/* eslint-disable @typescript-eslint/no-explicit-any */
// next-intl's Link href is strictly typed; search result URLs require `as any`.
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

type SearchResult = { type: string; title: string; url: string; excerpt?: string };

export function SearchModal() {
  const t = useTranslations("search");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const search = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (q.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`,
          );
          const data = await res.json();
          setResults(data.results ?? []);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 250);
    },
    [locale],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
  };

  const TYPE_LABELS: Record<string, string> = {
    article: t("articles"),
    learn: t("learn"),
    product: t("products"),
    tool: t("tools"),
  };

  const TYPE_ICONS: Record<string, string> = {
    article: "\u{1F4F0}",
    learn: "\u{1F4D6}",
    product: "\u{1FA99}",
    tool: "\u{1F6E0}\uFE0F",
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-xs flex items-center justify-center text-content-2 hover:text-brand-gold hover:bg-surface-2 transition-colors"
        aria-label={t("placeholder")}
      >
        <SearchIcon />
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-surface-1 border border-border rounded-DEFAULT shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={t("placeholder")}
            className="flex-1 py-3.5 bg-transparent text-sm text-content-0 placeholder:text-content-3 outline-none"
          />
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-content-3 bg-surface-2 rounded border border-border">
            ESC
          </kbd>
        </div>

        {query.length >= 2 && (
          <div className="max-h-[50vh] overflow-y-auto">
            {loading && (
              <div className="px-4 py-6 text-center text-sm text-content-3">
                ...
              </div>
            )}
            {!loading && results.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-content-3">
                {t("noResults")}
              </div>
            )}
            {!loading && results.length > 0 && (
              <div className="py-2">
                {results.map((r, i) => (
                  <Link
                    key={`${r.type}-${r.url}-${i}`}
                    href={r.url as any}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-surface-2 transition-colors"
                  >
                    <span className="text-base mt-0.5">
                      {TYPE_ICONS[r.type] ?? "\u{1F4C4}"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-content-0 truncate">
                        {r.title}
                      </div>
                      {r.excerpt && (
                        <div className="text-xs text-content-3 truncate mt-0.5">
                          {r.excerpt}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-content-3 uppercase tracking-wider whitespace-nowrap mt-1">
                      {TYPE_LABELS[r.type] ?? r.type}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="px-4 py-4 text-center text-xs text-content-3">
            {t("hint")}
          </div>
        )}
      </div>
    </div>
  );
}
