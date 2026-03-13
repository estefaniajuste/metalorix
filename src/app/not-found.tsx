import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada — Metalorix",
};

export default function NotFound() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-[rgba(214,179,90,0.12)] mb-8">
          <span className="text-4xl font-extrabold text-brand-gold">404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          Página no encontrada
        </h1>
        <p className="text-content-2 mb-10 max-w-md mx-auto leading-relaxed">
          La página que buscas no existe o ha sido movida.
          Prueba a volver al dashboard o consulta los precios de metales.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-gold text-surface-0 font-semibold text-sm px-6 py-3 rounded-sm hover:brightness-110 transition-all"
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al Dashboard
          </Link>
          <Link
            href="/precio/oro"
            className="inline-flex items-center justify-center gap-2 bg-surface-1 border border-border text-content-0 font-semibold text-sm px-6 py-3 rounded-sm hover:border-border-hover hover:shadow-card transition-all"
          >
            Ver precio del Oro
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { href: "/precio/oro", label: "Precio del Oro", desc: "XAU/USD en tiempo real" },
            { href: "/precio/plata", label: "Precio de la Plata", desc: "XAG/USD en tiempo real" },
            { href: "/herramientas", label: "Herramientas", desc: "Ratio, conversor y más" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-surface-1 border border-border rounded-DEFAULT p-4 hover:border-border-hover hover:shadow-card transition-all text-left"
            >
              <div className="text-sm font-semibold text-content-0 mb-1">
                {link.label}
              </div>
              <div className="text-xs text-content-3">{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
