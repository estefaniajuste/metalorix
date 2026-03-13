"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";

const metalLinks = [
  { href: "/precio/oro", label: "Oro", symbol: "XAU", color: "#D6B35A" },
  { href: "/precio/plata", label: "Plata", symbol: "XAG", color: "#A7B0BE" },
  { href: "/precio/platino", label: "Platino", symbol: "XPT", color: "#8B9DC3" },
];

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "#precios", label: "Precios", hasDropdown: true },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/noticias", label: "Noticias" },
  { href: "/alertas", label: "Alertas" },
];

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xs text-sm font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                >
                  {item.label}
                  <ChevronDown />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-surface-1 border border-border rounded-DEFAULT shadow-card py-1.5 z-50">
                    {metalLinks.map((metal) => (
                      <Link
                        key={metal.href}
                        href={metal.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: metal.color }}
                        />
                        <span className="font-medium">{metal.label}</span>
                        <span className="text-xs text-content-3 ml-auto">{metal.symbol}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-xs text-sm font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-xs flex items-center justify-center text-content-2 hover:text-brand-gold hover:bg-surface-2 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            className="md:hidden w-10 h-10 rounded-xs flex items-center justify-center text-content-1 hover:bg-surface-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 inset-x-0 bottom-0 bg-surface-1 border-t border-border p-4 z-40 overflow-y-auto">
          {navItems.map((item) =>
            item.hasDropdown ? (
              <div key={item.href}>
                <div className="px-4 py-2 text-xs font-semibold text-content-3 uppercase tracking-wider">
                  Precios
                </div>
                {metalLinks.map((metal) => (
                  <Link
                    key={metal.href}
                    href={metal.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: metal.color }}
                    />
                    {metal.label}
                    <span className="text-xs text-content-3 ml-auto">{metal.symbol}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3.5 rounded-sm text-base font-medium text-content-2 hover:text-content-0 hover:bg-surface-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
