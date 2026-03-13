import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { metal: string };
}): Metadata {
  const names: Record<string, string> = {
    oro: "Oro (XAU)",
    plata: "Plata (XAG)",
    platino: "Platino (XPT)",
  };
  const name = names[params.metal] ?? params.metal;
  return {
    title: `Precio del ${name} hoy — Metalorix`,
    description: `Cotización del ${name} en tiempo real, gráficos históricos y análisis técnico.`,
  };
}

export default function PrecioMetalPage({
  params,
}: {
  params: { metal: string };
}) {
  const names: Record<string, string> = {
    oro: "Oro (XAU)",
    plata: "Plata (XAG)",
    platino: "Platino (XPT)",
  };
  const name = names[params.metal] ?? params.metal;

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <h1 className="text-[28px] font-bold text-content-0 mb-4">
          Precio del {name} hoy
        </h1>
        <p className="text-content-2 mb-12 max-w-xl">
          Cotización en tiempo real, gráfico histórico y artículos relacionados.
        </p>
        <div className="text-center py-20 text-content-3 border border-dashed border-border rounded-DEFAULT">
          Página dedicada por metal — Próximamente (Fase 2)
        </div>
      </div>
    </section>
  );
}
