import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Herramientas — Metalorix",
  description:
    "Herramientas de trading: ratio oro/plata, calculadora DCA, indicadores técnicos y más.",
};

const tools = [
  {
    title: "Ratio Oro/Plata",
    description:
      "Gráfico histórico del ratio con zonas de plata barata vs cara.",
    href: "/herramientas/ratio-oro-plata",
  },
  {
    title: "Calculadora DCA",
    description:
      "Simula el rendimiento de invertir una cantidad fija mensual en metales.",
    href: "/herramientas/calculadora-dca",
  },
  {
    title: "Calendario Económico",
    description:
      "Próximos eventos que afectan a los metales: FOMC, NFP, IPC, BCE.",
    href: "/herramientas/calendario-economico",
  },
];

export default function HerramientasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <h1 className="text-[28px] font-bold text-content-0 mb-4">
          Herramientas de trading
        </h1>
        <p className="text-content-2 mb-12 max-w-xl">
          Herramientas prácticas para analizar y operar en el mercado de metales
          preciosos.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <div
              key={tool.href}
              className="bg-surface-1 border border-border rounded-DEFAULT p-7 hover:border-border-hover hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <h3 className="text-lg font-semibold text-content-0 mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-content-2 leading-relaxed mb-4">
                {tool.description}
              </p>
              <span className="text-xs text-content-3">
                Próximamente — Fase 4
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
