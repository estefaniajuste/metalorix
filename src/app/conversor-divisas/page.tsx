import type { Metadata } from "next";
import Link from "next/link";
import { MultiCurrencyTable } from "@/components/tools/MultiCurrencyTable";

export const metadata: Metadata = {
  title: "Precio del oro en euros, libras, francos y más divisas — Metalorix",
  description:
    "Precio del oro, plata y platino en 11 divisas: EUR, GBP, CHF, JPY, AUD, CAD, CNY, INR, MXN, BRL. Por onza, gramo y kilogramo.",
  keywords: [
    "precio oro en euros",
    "precio oro en libras",
    "precio gramo oro euros",
    "gold price eur",
    "precio platino euros",
    "precio plata euros",
    "conversor divisas oro",
  ],
  alternates: {
    canonical: "https://metalorix.com/conversor-divisas",
  },
  openGraph: {
    title: "Precio del oro en diferentes divisas — Metalorix",
    description:
      "Consulta el precio del oro, plata y platino en EUR, GBP, CHF, JPY y más divisas.",
    type: "website",
    url: "https://metalorix.com/conversor-divisas",
  },
};

export default function ConversorDivisasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/herramientas"
            className="hover:text-content-1 transition-colors"
          >
            Herramientas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Conversor de divisas</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          Precio del oro en diferentes divisas
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          Consulta el precio del oro, plata y platino en 11 divisas
          internacionales. Elige entre onza troy, gramo o kilogramo. Tipos de
          cambio actualizados en tiempo real.
        </p>

        <MultiCurrencyTable />

        {/* SEO content */}
        <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            ¿Por qué importa la divisa al invertir en oro?
          </h2>
          <p className="text-content-2 leading-relaxed mb-4">
            El oro cotiza internacionalmente en dólares estadounidenses (USD),
            pero el coste real de tu inversión depende de la divisa en la que
            operas. Un inversor europeo puede ver cómo el oro sube en USD pero
            se mantiene estable en EUR si el euro se fortalece frente al dólar.
          </p>
          <p className="text-content-2 leading-relaxed">
            Por eso es fundamental consultar el precio en tu divisa local. Esta
            herramienta te muestra el precio actualizado en EUR, GBP, CHF, JPY,
            AUD, CAD, CNY, INR, MXN y BRL, por onza troy, gramo y kilogramo.
          </p>
        </div>
      </div>
    </section>
  );
}
