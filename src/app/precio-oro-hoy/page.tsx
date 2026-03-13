import type { Metadata } from "next";
import Link from "next/link";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";

export const metadata: Metadata = {
  title: "Precio del oro hoy en tiempo real — Cotización XAU/USD | Metalorix",
  description:
    "Precio del oro hoy actualizado en tiempo real. Cotización XAU/USD, gráfico interactivo, variación diaria, precio por gramo y kilogramo en dólares y euros.",
  keywords: [
    "precio oro hoy",
    "cotización oro hoy",
    "precio oro tiempo real",
    "gold price today",
    "xau usd hoy",
    "precio onza oro hoy",
    "valor del oro hoy",
  ],
  alternates: {
    canonical: "https://metalorix.com/precio-oro-hoy",
  },
  openGraph: {
    title: "Precio del oro hoy — Metalorix",
    description:
      "Cotización del oro en tiempo real. Gráfico, precio por gramo y variación diaria.",
    type: "website",
    url: "https://metalorix.com/precio-oro-hoy",
  },
};

export default function PrecioOroHoyPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Precio del oro hoy</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          Precio del oro hoy
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          Cotización del oro (XAU/USD) actualizada en tiempo real. Gráfico
          interactivo con datos históricos, variación diaria y precio por
          onza, gramo y kilogramo.
        </p>

        <MetalPageContent symbol="XAU" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              ¿Qué mueve el precio del oro hoy?
            </h2>
            <ul className="space-y-3 text-sm text-content-2 leading-relaxed">
              {[
                "Decisiones de la Reserva Federal (Fed) sobre tipos de interés",
                "Datos de inflación (IPC) en Estados Unidos y Europa",
                "Tensiones geopolíticas y conflictos internacionales",
                "Fortaleza o debilidad del dólar estadounidense (DXY)",
                "Demanda de bancos centrales (China, India, Turquía)",
                "Flujos de entrada/salida de ETFs de oro (GLD, IAU)",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-gold mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              Herramientas relacionadas
            </h2>
            <div className="space-y-3">
              {[
                { href: "/precio-gramo-oro", label: "Precio del gramo de oro", desc: "En EUR y USD" },
                { href: "/conversor-divisas", label: "Conversor multi-divisa", desc: "Oro en 11 divisas" },
                { href: "/ratio-oro-plata", label: "Ratio Oro/Plata", desc: "Análisis de valoración relativa" },
                { href: "/calculadora-rentabilidad", label: "Calculadora de rentabilidad", desc: "Simula inversiones pasadas" },
                { href: "/alertas", label: "Alertas de precio", desc: "Recibe avisos por email" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-sm hover:bg-surface-2 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-medium text-content-0 group-hover:text-brand-gold transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-content-3">{link.desc}</div>
                  </div>
                  <svg className="w-4 h-4 text-content-3 group-hover:text-brand-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
