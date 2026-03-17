"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const CONSENT_KEY = "mtx-cookie-consent";

type ConsentState = "pending" | "accepted" | "rejected";

export function CookieConsent() {
  const [state, setState] = useState<ConsentState>("accepted");
  const t = useTranslations("cookie");
  const tf = useTranslations("footer");

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setState("pending");
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setState("accepted");
    window.dispatchEvent(new StorageEvent("storage", { key: CONSENT_KEY, newValue: "accepted" }));
    window.dispatchEvent(new CustomEvent("mtx-consent-changed", { detail: { value: "accepted" } }));
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setState("rejected");
    window.dispatchEvent(new StorageEvent("storage", { key: CONSENT_KEY, newValue: "rejected" }));
    window.dispatchEvent(new CustomEvent("mtx-consent-changed", { detail: { value: "rejected" } }));
  }

  if (state !== "pending") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in pointer-events-none">
      <div className="mx-auto max-w-[720px] bg-surface-1 border border-border rounded-DEFAULT shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-content-1 leading-relaxed">
            {t("message")}{" "}
            <Link
              href="/privacidad"
              className="text-brand-gold hover:underline"
            >
              {tf("privacy")}
            </Link>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-xs font-semibold text-content-2 bg-surface-2 rounded-sm hover:text-content-0 transition-colors"
          >
            {t("essentialOnly")}
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-semibold text-[#0B0F17] bg-brand-gold rounded-sm hover:brightness-110 transition-all"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
