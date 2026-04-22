"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = "G-9K1MTS78FF";
const CONSENT_KEY = "mtx-cookie-consent";

function updateGAConsent(value: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const granted = value === "accepted" ? "granted" : "denied";
  window.gtag("consent", "update", {
    analytics_storage: granted,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function AnalyticsLoader() {
  useEffect(() => {
    // Apply stored consent immediately on mount
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      updateGAConsent(stored);
    }

    const handleConsentChanged = (e: CustomEvent<{ value: string }>) => {
      updateGAConsent(e.detail.value);
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue) updateGAConsent(e.newValue);
    };

    window.addEventListener("mtx-consent-changed", handleConsentChanged as EventListener);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("mtx-consent-changed", handleConsentChanged as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isDebug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug_ga") === "1";

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`gtag('js',new Date());gtag('config','${GA_ID}'${isDebug ? ",{debug_mode:true}" : ""});`}
      </Script>
    </>
  );
}
