import type { Metadata } from "next";
import Link from "next/link";
import { RoiCalculator } from "@/components/tools/RoiCalculator";

export const metadata: Metadata = {
  title:
    "Calculadora de rentabilidad del oro, plata y platino — Metalorix",
  description:
    "Calcula cuánto habrías ganado invirtiendo en oro, plata o platino. Simulador con datos reales desde el año 2000.",
  keywords: [
    "calculadora rentabilidad oro",
    "simulador inversión oro",
    "cuanto habría ganado invirtiendo en oro",
    "rentabilidad histórica oro",
    "invertir en oro rentabilidad",
    "calculadora inversión metales preciosos",
  ],
  alternates: {
    canonical: "https://metalorix.com/calculadora-rentabilidad",
  },
  openGraph: {
    title: "Calculadora de rentabilidad — Metalorix",
    description:
      "¿Cuánto habrías ganado invirtiendo en oro? Calcula la rentabilidad con datos reales.",
    type: "website",
    url: "https://metalorix.com/calculadora-rentabilidad",
  },
};

export default function CalculadoraRentabilidadPage() {
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
          <span className="text-content-1">Calculadora de rentabilidad</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          Calculadora de rentabilidad histórica
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          ¿Cuánto habrías ganado si hubieras invertido en oro, plata o platino?
          Introduce la cantidad, elige el metal y la fecha, y calcula la
          rentabilidad real con datos históricos.
        </p>

        <RoiCalculator />

        {/* SEO content */}
        <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            ¿Es rentable invertir en oro?
          </h2>
          <p className="text-content-2 leading-relaxed mb-4">
            El oro ha sido históricamente uno de los activos refugio más
            fiables. En los últimos 20 años, ha pasado de cotizar alrededor de
            $400/oz a superar los $2.000/oz, ofreciendo una rentabilidad
            acumulada superior al 400%.
          </p>
          <p className="text-content-2 leading-relaxed mb-4">
            Sin embargo, la rentabilidad pasada no garantiza resultados futuros.
            El oro no genera dividendos ni intereses, y su valor depende
            principalmente de la percepción de riesgo global, la inflación y la
            política monetaria de los bancos centrales.
          </p>
          <p className="text-content-2 leading-relaxed">
            Esta calculadora utiliza precios históricos reales de los mercados
            de futuros para simular cómo habría evolucionado una inversión
            en el pasado.
          </p>
        </div>
      </div>
    </section>
  );
}
