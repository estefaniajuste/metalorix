"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const CONSENT_KEY = "mtx-cookie-consent";
const SHOW_BANNER_EVENT = "mtx-show-cookie-banner";

export function CookieConsentManager() {
  const [consent, setConsent] = useState<string | null>(null);
  const t = useTranslations("legal.privacy");

  useEffect(() => {
    setConsent(localStorage.getItem(CONSENT_KEY));
    const handleStorage = () => setConsent(localStorage.getItem(CONSENT_KEY));
    const handleConsentChanged = (e: CustomEvent<{ value: string }>) => setConsent(e.detail.value);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("mtx-consent-changed", handleConsentChanged as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mtx-consent-changed", handleConsentChanged as EventListener);
    };
  }, []);

  function showBannerAgain() {
    window.dispatchEvent(new CustomEvent(SHOW_BANNER_EVENT));
  }

  return (
    <div className="bg-surface-1 border-2 border-brand-gold/40 rounded-DEFAULT p-5 mb-6">
      <h3 className="text-base font-semibold text-content-0 mb-2">{t("manageCookies")}</h3>
      <p className="text-sm text-content-2 mb-4">
        {consent === "accepted"
          ? t("consentAccepted")
          : consent === "rejected"
            ? t("consentRejected")
            : t("consentPending")}
      </p>
      <button
        onClick={showBannerAgain}
        type="button"
        className="px-4 py-2 text-sm font-semibold bg-brand-gold text-[#0B0F17] rounded-sm hover:brightness-110 transition-all"
      >
        {t("changePreferences")}
      </button>
    </div>
  );
}
