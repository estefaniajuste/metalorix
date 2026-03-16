"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-9K1MTS78FF";
const CONSENT_KEY = "mtx-cookie-consent";

export function AnalyticsLoader() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem(CONSENT_KEY));

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) setConsent(e.newValue);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (consent !== "accepted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
