"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function Nav() {
  const { theme, toggle } = useTheme();
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const metalLinks: { href: any; label: string; symbol: string; color: string }[] = [
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("oro", locale) } }, label: t("gold"), symbol: "XAU", color: "#D6B35A" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("plata", locale) } }, label: t("silver"), symbol: "XAG", color: "#A7B0BE" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("platino", locale) } }, label: t("platinum"), symbol: "XPT", color: "#8B9DC3" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("paladio", locale) } }, label: t("palladium"), symbol: "XPD", color: "#CED0CE" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("cobre", locale) } }, label: t("copper"), symbol: "HG", color: "#B87333" },
    { href: "/ratio-oro-plata" as const, label: t("ratio"), symbol: "⚖️", color: "#D6B35A" },
  ];

  const navItems = [
    { href: "/", label: t("dashboard") },
    { href: "#precios", label: t("prices"), hasDropdown: true },
    { href: "/productos", label: t("products") },
    { href: "/herramientas", label: t("tools") },
    { href: "/guia-inversion", label: t("guide") },
    { href: "/noticias", label: t("news") },
    { href: "/alertas", label: t("alerts") },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (dropdownOpen) setDropdownOpen(false);
        if (mobileOpen) setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 bg-surface-1 border-b border-border backdrop-blur-xl transition-colors duration-250 ease-smooth">
        <div className="mx-auto max-w-[1200px] px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Metalorix Home">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xs text-sm font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                  >
                    {item.label}
                    <ChevronDown />
                  </button>
                  {dropdownOpen && (
                    <div role="menu" aria-label={t("metalPrices")} className="absolute top-full start-0 mt-1 w-48 bg-surface-1 border border-border rounded-DEFAULT shadow-card py-1.5 z-50">
                      {metalLinks.map((metal) => (
                        <Link
                          key={typeof metal.href === "string" ? metal.href : metal.href.params.metal}
                          href={metal.href as any}
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: metal.color }}
                          />
                          <span className="font-medium">{metal.label}</span>
                          <span className="text-xs text-content-3 ms-auto">{metal.symbol}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className="px-3.5 py-2 rounded-xs text-sm font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />

            <button
              onClick={toggle}
              className="w-10 h-10 rounded-xs flex items-center justify-center text-content-2 hover:text-brand-gold hover:bg-surface-2 transition-colors"
              aria-label={t("toggleTheme")}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              className="md:hidden w-10 h-10 rounded-xs flex items-center justify-center text-content-1 hover:bg-surface-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav - outside <nav> so backdrop-blur doesn't break fixed positioning */}
      {mobileOpen && (
        <div role="dialog" aria-label={t("openMenu")} className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-surface-1 border-t border-border p-4 z-40 overflow-y-auto">
          {navItems.map((item) =>
            item.hasDropdown ? (
              <div key={item.href}>
                <div className="px-4 py-2 text-xs font-semibold text-content-3 uppercase tracking-wider">
                  {t("prices")}
                </div>
                {metalLinks.map((metal) => (
                  <Link
                    key={typeof metal.href === "string" ? metal.href : metal.href.params.metal}
                    href={metal.href as any}
                    className="flex items-center gap-3 px-4 py-3 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: metal.color }}
                    />
                    {metal.label}
                    <span className="text-xs text-content-3 ms-auto">{metal.symbol}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href as any}
                className="block px-4 py-3.5 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
}
