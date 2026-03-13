import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alertas de precio — Metalorix",
  description:
    "Configura alertas inteligentes de precio para oro, plata y platino. Recibe notificaciones por email.",
};

export default function AlertasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <h1 className="text-[28px] font-bold text-content-0 mb-4">
          Alertas de precio
        </h1>
        <p className="text-content-2 mb-12 max-w-xl">
          Configura alertas para que te avisemos cuando el precio de un metal
          alcance un nivel concreto o haya un movimiento brusco.
        </p>
        <div className="text-center py-20 text-content-3 border border-dashed border-border rounded-DEFAULT">
          Sistema de alertas — Próximamente (Fase 3)
        </div>
      </div>
    </section>
  );
}
