import type { Metadata } from "next";
import { GoldSilverRatio } from "@/components/tools/GoldSilverRatio";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { MetalComparison } from "@/components/tools/MetalComparison";

export const metadata: Metadata = {
  title: "Herramientas de trading — Metalorix",
  description:
    "Ratio oro/plata en tiempo real, conversor de unidades, calculadora DCA y más herramientas para invertir en metales preciosos.",
  keywords: [
    "ratio oro plata",
    "conversor onza troy gramos",
    "herramientas trading metales",
    "calculadora oro plata platino",
  ],
  alternates: {
    canonical: "https://metalorix.com/herramientas",
  },
};

const upcoming = [
  {
    title: "Calculadora DCA",
    description:
      "Simula el rendimiento de invertir una cantidad fija mensual en oro, plata o platino a lo largo del tiempo.",
    phase: "Fase 4",
  },
  {
    title: "Indicadores técnicos",
    description:
      "RSI, MACD y Bandas de Bollinger sobre los gráficos de precios de metales preciosos.",
    phase: "Fase 4",
  },
  {
    title: "Calendario económico",
    description:
      "Próximos eventos que afectan a los metales: FOMC, NFP, IPC, BCE y más.",
    phase: "Fase 4",
  },
];

export default function HerramientasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
          Herramientas
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          Herramientas prácticas para analizar y valorar metales preciosos.
          Datos actualizados en tiempo real.
        </p>

        {/* Comparison chart — full width */}
        <div className="mb-8">
          <MetalComparison />
        </div>

        {/* Side-by-side tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <GoldSilverRatio />
          <UnitConverter />
        </div>

        {/* Upcoming tools */}
        <div>
          <h2 className="text-xl font-bold text-content-0 mb-6">
            Próximamente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((tool) => (
              <div
                key={tool.title}
                className="bg-surface-1 border border-border rounded-DEFAULT p-6 opacity-60"
              >
                <h3 className="text-base font-semibold text-content-0 mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-content-2 leading-relaxed mb-3">
                  {tool.description}
                </p>
                <span className="text-[10px] font-semibold text-content-3 uppercase tracking-wider px-2 py-0.5 bg-surface-2 rounded-full">
                  {tool.phase}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
