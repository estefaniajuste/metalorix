"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const DISMISS_KEY = "mtx-pwa-dismiss";
const SHOW_DELAY_MS = 45_000;
const MIN_VISITS = 2;
const VISIT_KEY = "mtx-visit-count";

type Platform = "android" | "ios" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    return "ios";
  }
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function PlusBoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const t = useTranslations("installPrompt");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isInStandaloneMode()) return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const visits = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));
    if (visits < MIN_VISITS) return;

    const plat = detectPlatform();
    setPlatform(plat);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const timer = setTimeout(() => {
      const cookieConsent = localStorage.getItem("mtx-cookie-consent");
      if (cookieConsent !== "accepted" && cookieConsent !== "rejected") return;

      if (plat === "ios") {
        const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(navigator.userAgent);
        if (isSafari) setVisible(true);
      } else if (plat === "android") {
        setVisible(true);
      }
    }, SHOW_DELAY_MS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    const prompt = deferredPrompt || window.__pwaPrompt;
    if (prompt) {
      prompt.prompt();
      const result = await prompt.userChoice;
      if (result.outcome === "accepted") {
        setVisible(false);
      }
      setDeferredPrompt(null);
      window.__pwaPrompt = null;
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }, []);

  if (!visible) return null;

  if (platform === "ios") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[51] p-4 animate-fade-in-up pointer-events-none">
        <div className="mx-auto max-w-[420px] bg-surface-1 border border-border rounded-DEFAULT shadow-card overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <div className="w-10 h-10 rounded-[10px] bg-[#D6B35A]/15 flex items-center justify-center flex-shrink-0">
              <img src="/icon-192.png" alt="Metalorix" width={28} height={28} className="rounded-md" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-content-0">{t("title")}</p>
              <p className="text-xs text-content-2 mt-0.5">{t("iosSubtitle")}</p>
            </div>
            <button onClick={handleDismiss} className="p-1.5 text-content-3 hover:text-content-1 transition-colors" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
            </button>
          </div>

          {/* Steps */}
          <div className="px-4 pb-4 pt-1 space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold flex-shrink-0">1</span>
              <span className="text-sm text-content-1">
                {t("iosStep1")} <ShareIcon className="inline-block -mt-0.5 text-[#007AFF]" />
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold flex-shrink-0">2</span>
              <span className="text-sm text-content-1">
                {t("iosStep2")} <PlusBoxIcon className="inline-block -mt-0.5 text-content-2" />
              </span>
            </div>
          </div>

          {/* Bottom triangle pointer */}
          <div className="flex justify-center -mb-2 pb-1">
            <svg width="20" height="10" viewBox="0 0 20 10" className="text-surface-1 drop-shadow-sm">
              <polygon points="0,0 10,10 20,0" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[51] p-4 animate-fade-in-up pointer-events-none">
      <div className="mx-auto max-w-[420px] bg-surface-1 border border-border rounded-DEFAULT shadow-card pointer-events-auto">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#D6B35A]/15 flex items-center justify-center flex-shrink-0">
            <img src="/icon-192.png" alt="Metalorix" width={28} height={28} className="rounded-md" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-content-0">{t("title")}</p>
            <p className="text-xs text-content-2 mt-0.5">{t("subtitle")}</p>
          </div>
          <button onClick={handleDismiss} className="p-1.5 text-content-3 hover:text-content-1 transition-colors" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
          </button>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-content-2 bg-surface-2 rounded-sm hover:text-content-0 transition-colors"
          >
            {t("notNow")}
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-[#0B0F17] bg-brand-gold rounded-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            {t("install")}
          </button>
        </div>
      </div>
    </div>
  );
}
