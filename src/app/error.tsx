"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-signal-down-bg mb-8">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-signal-down"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          Algo salió mal
        </h1>
        <p className="text-content-2 mb-8 max-w-md mx-auto leading-relaxed">
          Se ha producido un error inesperado. Puedes intentar recargar
          la página o volver al dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-brand-gold text-[#0B0F17] font-semibold text-sm px-6 py-3 rounded-sm hover:brightness-110 transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-surface-1 border border-border text-content-0 font-semibold text-sm px-6 py-3 rounded-sm hover:border-border-hover transition-all"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
