/* eslint-disable @typescript-eslint/no-explicit-any */
// next-intl's router.replace is strictly typed; locale switching requires `as any` for dynamic pathnames.
"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import {
  getLocalePathOverrides,
  subscribeLocalePathOverrides,
} from "./locale-paths-store";

const LANGUAGES: { code: Locale; label: string; flag: string; name: string }[] = [
  { code: "es", label: "ES", flag: "🇪🇸", name: "Español" },
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "zh", label: "中文", flag: "🇨🇳", name: "中文" },
  { code: "ar", label: "AR", flag: "🇸🇦", name: "العربية" },
  { code: "tr", label: "TR", flag: "🇹🇷", name: "Türkçe" },
  { code: "de", label: "DE", flag: "🇩🇪", name: "Deutsch" },
  { code: "hi", label: "हि", flag: "🇮🇳", name: "हिन्दी" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const localeOverrides = useSyncExternalStore(
    subscribeLocalePathOverrides,
    getLocalePathOverrides,
    () => null
  );

  const params = useParams();

  const switchLocale = (code: Locale) => {
    setOpen(false);
    const override = localeOverrides?.[code];
    if (override) {
      router.replace(override as any, { locale: code });
    } else {
      const { locale: _, ...routeParams } = params;
      if (Object.keys(routeParams).length > 0) {
        router.replace(
          { pathname: pathname as any, params: routeParams as any },
          { locale: code }
        );
      } else {
        router.replace(pathname as any, { locale: code });
      }
    }
  };

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-content-2 hover:text-content-0 transition-colors rounded-sm hover:bg-surface-2"
        aria-label={t("changeLanguage")}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-1 bg-surface-1 border border-border rounded-sm shadow-card py-1 z-50 min-w-[160px]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                locale === lang.code
                  ? "text-brand-gold font-semibold"
                  : "text-content-2 hover:text-content-0 hover:bg-surface-2"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
