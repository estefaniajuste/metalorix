"use client";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden text-center py-[100px] max-sm:py-[72px]"
      style={{ background: "var(--hero-grad)" }}
    >
      <div className="absolute -top-[40%] -left-[10%] w-[120%] h-[180%] pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,var(--gold-glow)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-[720px] mx-auto px-6">
        <h1 className="text-[clamp(36px,6vw,64px)] font-extrabold text-content-0 tracking-tight leading-[1.1] mb-5">
          Metales preciosos, <span className="text-brand-gold">al detalle.</span>
        </h1>
        <p className="text-[clamp(16px,2.2vw,20px)] text-content-2 max-w-[560px] mx-auto mb-9 leading-relaxed">
          Precios spot en tiempo real y analítica limpia para Oro (XAU), Plata
          (XAG) y Platino (XPT).
        </p>

        <div className="flex justify-center gap-3 flex-wrap mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-surface-2 text-content-2 border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-up animate-pulse-dot" />
            Actualizado ahora
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-surface-2 text-content-2 border border-border">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Mercado abierto
          </span>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="#dashboard"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(214,179,90,0.3)] transition-all"
          >
            Ver Dashboard
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
