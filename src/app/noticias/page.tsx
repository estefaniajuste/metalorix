import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noticias — Metalorix",
  description:
    "Últimas noticias y análisis del mercado de metales preciosos: oro, plata y platino.",
};

export default function NoticiasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <h1 className="text-[28px] font-bold text-content-0 mb-4">
          Noticias del mercado
        </h1>
        <p className="text-content-2 mb-12 max-w-xl">
          Análisis diario, resúmenes semanales y artículos generados con IA
          sobre el mercado de metales preciosos.
        </p>
        <div className="text-center py-20 text-content-3 border border-dashed border-border rounded-DEFAULT">
          Próximamente — Fase 2
        </div>
      </div>
    </section>
  );
}
