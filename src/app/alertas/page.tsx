import type { Metadata } from "next";
import Link from "next/link";
import { SubscribeForm } from "@/components/alerts/SubscribeForm";

export const metadata: Metadata = {
  title: "Alertas de precio — Metalorix",
  description:
    "Configura alertas inteligentes de precio para oro, plata y platino. Recibe notificaciones por email cuando se alcancen niveles clave.",
  keywords: [
    "alertas precio oro",
    "alertas precio plata",
    "notificaciones metales preciosos",
    "alerta cambio precio oro",
  ],
  alternates: {
    canonical: "https://metalorix.com/alertas",
  },
};

const alertTypes = [
  {
    title: "Nivel de precio",
    description:
      "Recibe un aviso cuando el oro, plata o platino alcance el precio que definas.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Movimiento brusco",
    description:
      "Alerta automática cuando un metal se mueve más de un 2% en pocas horas.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "Máximos y mínimos",
    description:
      "Notificación cuando se alcancen nuevos máximos o mínimos de 52 semanas.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: "Ratio oro/plata",
    description:
      "Aviso cuando el ratio oro/plata entre en zonas extremas históricas.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Cruces técnicos",
    description:
      "Alertas de cruces de medias móviles y señales técnicas relevantes.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Email instantáneo",
    description:
      "Todas las alertas llegan directamente a tu correo. Sin app, sin notificaciones push.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function AlertasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
            Alertas inteligentes de precio
          </h1>
          <p className="text-content-2 leading-relaxed">
            Configura alertas personalizadas para oro, plata y platino.
            Te avisamos por email cuando se cumplan las condiciones que definas.
            Sin spam, solo lo que importa.
          </p>
        </div>

        {/* Subscribe form */}
        <div className="mb-16">
          <SubscribeForm />
        </div>

        {/* Alert types grid */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-content-0 mb-6 text-center">
            Tipos de alertas disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alertTypes.map((type) => (
              <div
                key={type.title}
                className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover transition-colors"
              >
                <div className="text-brand-gold mb-3">{type.icon}</div>
                <h3 className="text-base font-semibold text-content-0 mb-2">
                  {type.title}
                </h3>
                <p className="text-sm text-content-2 leading-relaxed">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-content-2 mb-4">
            Consulta los precios en tiempo real:
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/precio/oro"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all"
            >
              Precio del Oro
            </Link>
            <Link
              href="/herramientas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-1 border border-border text-content-0 hover:border-border-hover transition-all"
            >
              Herramientas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
