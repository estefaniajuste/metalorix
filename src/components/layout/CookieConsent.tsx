"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "mtx-cookie-consent";

type ConsentState = "pending" | "accepted" | "rejected";

export function CookieConsent() {
  const [state, setState] = useState<ConsentState>("accepted");

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setState("pending");
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setState("accepted");
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setState("rejected");
  }

  if (state !== "pending") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="mx-auto max-w-[720px] bg-surface-1 border border-border rounded-DEFAULT shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-content-1 leading-relaxed">
            Usamos cookies esenciales y Google Analytics para entender
            cómo se usa el sitio. No usamos cookies de publicidad.{" "}
            <Link
              href="/privacidad"
              className="text-brand-gold hover:underline"
            >
              Más información
            </Link>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-xs font-semibold text-content-2 bg-surface-2 rounded-sm hover:text-content-0 transition-colors"
          >
            Solo esenciales
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-semibold text-[#0B0F17] bg-brand-gold rounded-sm hover:brightness-110 transition-all"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
