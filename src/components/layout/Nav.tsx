"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchModal } from "./SearchModal";
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

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

type DropdownId = "prices" | "buy" | "learn" | null;

export function Nav() {
  const { theme, toggle } = useTheme();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const navRef = useRef<HTMLElement>(null);

  const metalLinks: { href: any; label: string; symbol: string; color: string }[] = [
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("oro", locale) } }, label: t("gold"), symbol: "XAU", color: "#D6B35A" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("plata", locale) } }, label: t("silver"), symbol: "XAG", color: "#A7B0BE" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("platino", locale) } }, label: t("platinum"), symbol: "XPT", color: "#8B9DC3" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("paladio", locale) } }, label: t("palladium"), symbol: "XPD", color: "#CED0CE" },
    { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("cobre", locale) } }, label: t("copper"), symbol: "HG", color: "#B87333" },
    { href: "/ratio-oro-plata" as const, label: t("ratio"), symbol: "⚖️", color: "#D6B35A" },
  ];

  const buyLinks = [
    { href: "/productos" as const, label: t("products") },
    { href: "/donde-comprar" as const, label: t("whereToBuy") },
  ];

  const learnLinks = [
    { href: "/guia-inversion" as const, label: t("guide") },
    { href: "/learn" as const, label: t("learn") },
  ];

  const toggleDropdown = (id: DropdownId) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const isPricesActive = pathname.startsWith("/precio/") || pathname === "/ratio-oro-plata";
  const isBuyActive = pathname.startsWith("/productos") || pathname.startsWith("/donde-comprar");
  const isToolsActive = pathname.startsWith("/herramientas");
  const isNewsActive = pathname.startsWith("/noticias");
  const isPortfolioActive = pathname.startsWith("/portfolio");
  const isLearnActive =
    pathname.startsWith("/guia-inversion") ||
    pathname.startsWith("/learn");
  const isAlertsActive = pathname.startsWith("/alertas");

  function navLinkClass(active: boolean) {
    return `flex items-center gap-1 px-3.5 py-2 rounded-xs text-sm font-medium transition-colors ${
      active
        ? "text-brand-gold bg-surface-2"
        : "text-content-2 hover:text-content-0 hover:bg-surface-2"
    }`;
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (openDropdown) setOpenDropdown(null);
        if (mobileOpen) setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openDropdown, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 h-16 bg-surface-1 border-b border-border backdrop-blur-xl transition-colors duration-250 ease-smooth"
      >
        <div className="mx-auto max-w-[1200px] px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label={t("homeLink")}>
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Prices dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("prices")}
                aria-expanded={openDropdown === "prices"}
                aria-haspopup="menu"
                className={navLinkClass(isPricesActive)}
              >
                {t("prices")}
                <ChevronDown open={openDropdown === "prices"} />
              </button>
              {openDropdown === "prices" && (
                <div
                  role="menu"
                  aria-label={t("metalPrices")}
                  className="absolute top-full start-0 mt-1 w-52 bg-surface-1 border border-border rounded-DEFAULT shadow-card py-1.5 z-50"
                >
                  {metalLinks.map((metal) => (
                    <Link
                      key={typeof metal.href === "string" ? metal.href : metal.href.params.metal}
                      href={metal.href}
                      role="menuitem"
                      onClick={() => setOpenDropdown(null)}
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

            {/* Buy dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("buy")}
                aria-expanded={openDropdown === "buy"}
                aria-haspopup="menu"
                className={navLinkClass(isBuyActive)}
              >
                {t("buy")}
                <ChevronDown open={openDropdown === "buy"} />
              </button>
              {openDropdown === "buy" && (
                <div role="menu" className="absolute top-full start-0 mt-1 w-48 bg-surface-1 border border-border rounded-DEFAULT shadow-card py-1.5 z-50">
                  {buyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href as any}
                      role="menuitem"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tools link */}
            <Link
              href={"/herramientas" as any}
              className={navLinkClass(isToolsActive)}
            >
              {t("tools")}
            </Link>

            {/* News link */}
            <Link
              href={"/noticias" as any}
              className={navLinkClass(isNewsActive)}
            >
              {t("news")}
            </Link>

            {/* Portfolio link */}
            <Link
              href={"/portfolio" as any}
              className={navLinkClass(isPortfolioActive)}
            >
              {t("portfolio")}
            </Link>

            {/* Learn dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("learn")}
                aria-expanded={openDropdown === "learn"}
                aria-haspopup="menu"
                className={navLinkClass(isLearnActive)}
              >
                {t("learn")}
                <ChevronDown open={openDropdown === "learn"} />
              </button>
              {openDropdown === "learn" && (
                <div role="menu" className="absolute top-full start-0 mt-1 w-44 bg-surface-1 border border-border rounded-DEFAULT shadow-card py-1.5 z-50">
                  {learnLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href as any}
                      role="menuitem"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SearchModal />
            <LanguageSwitcher />

            <button
              onClick={toggle}
              className="w-10 h-10 rounded-xs flex items-center justify-center text-content-2 hover:text-brand-gold hover:bg-surface-2 transition-colors"
              aria-label={t("toggleTheme")}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Alerts CTA button — desktop only */}
            <Link
              href={"/alertas" as any}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xs transition-all ${
                isAlertsActive
                  ? "bg-brand-gold/80 text-[#0B0F17]"
                  : "bg-brand-gold text-[#0B0F17] hover:brightness-110 active:scale-95"
              }`}
            >
              <BellIcon />
              {t("alerts")}
            </Link>

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

      {/* Mobile nav — outside <nav> so backdrop-blur doesn't break fixed positioning */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-label={t("openMenu")}
          className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-surface-1 border-t border-border z-40 overflow-y-auto"
        >
          <div className="p-4 space-y-0.5">
            {/* Alerts CTA — prominent at the top on mobile */}
            <Link
              href={"/alertas" as any}
              className="flex items-center justify-center gap-2 px-4 py-3.5 mb-3 text-base font-semibold bg-brand-gold text-[#0B0F17] rounded-xs hover:brightness-110 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              <BellIcon />
              {t("alerts")}
            </Link>

            {/* Prices section */}
            <div className="px-4 pt-3 pb-1 text-xs font-semibold text-content-3 uppercase tracking-wider">
              {t("prices")}
            </div>
            {metalLinks.map((metal) => (
              <Link
                key={typeof metal.href === "string" ? metal.href : metal.href.params.metal}
                href={metal.href}
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

            <div className="h-px bg-border my-3" />

            {/* Buy section */}
            <div className="px-4 pb-1 text-xs font-semibold text-content-3 uppercase tracking-wider">
              {t("buy")}
            </div>
            {buyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="block px-4 py-3 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-border my-3" />

            {/* Tools */}
            <Link
              href={"/herramientas" as any}
              className="block px-4 py-3 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("tools")}
            </Link>

            {/* News */}
            <Link
              href={"/noticias" as any}
              className="block px-4 py-3 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("news")}
            </Link>

            {/* Portfolio */}
            <Link
              href={"/portfolio" as any}
              className="block px-4 py-3 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("portfolio")}
            </Link>

            <div className="h-px bg-border my-3" />

            {/* Learn section */}
            <div className="px-4 pb-1 text-xs font-semibold text-content-3 uppercase tracking-wider">
              {t("learn")}
            </div>
            {learnLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="block px-4 py-3 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
