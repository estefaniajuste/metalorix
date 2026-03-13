import type { Metadata } from "next";
import Link from "next/link";

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
    icon: "📊",
    title: "Nivel de precio",
    description:
      "Recibe un aviso cuando el oro, plata o platino alcance el precio que definas.",
  },
  {
    icon: "⚡",
    title: "Movimiento brusco",
    description:
      "Alerta automática cuando un metal se mueve más de un 3% en pocas horas.",
  },
  {
    icon: "📈",
    title: "Máximos y mínimos",
    description:
      "Notificación cuando se alcancen nuevos máximos o mínimos de 52 semanas.",
  },
  {
    icon: "⚖️",
    title: "Ratio oro/plata",
    description:
      "Aviso cuando el ratio oro/plata entre en zonas extremas de sobrevaloración o infravaloración.",
  },
  {
    icon: "📉",
    title: "Cruces técnicos",
    description:
      "Alertas cuando se produzcan cruces de medias móviles u otras señales técnicas.",
  },
  {
    icon: "✉️",
    title: "Por email",
    description:
      "Todas las alertas se envían directamente a tu correo electrónico de forma instantánea.",
  },
];

export default function AlertasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider mb-5">
            Próximamente
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
            Alertas inteligentes de precio
          </h1>
          <p className="text-content-2 leading-relaxed">
            Configura alertas personalizadas para oro, plata y platino.
            Te avisamos por email cuando se cumplan las condiciones que definas.
            Sin spam, solo lo que importa.
          </p>
        </div>

        {/* Alert types grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {alertTypes.map((type) => (
            <div
              key={type.title}
              className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover transition-colors"
            >
              <div className="text-2xl mb-3">{type.icon}</div>
              <h3 className="text-base font-semibold text-content-0 mb-2">
                {type.title}
              </h3>
              <p className="text-sm text-content-2 leading-relaxed">
                {type.description}
              </p>
            </div>
          ))}
        </div>

        {/* Preview mockup */}
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-8 max-w-2xl mx-auto mb-16">
          <h2 className="text-lg font-bold text-content-0 mb-6 text-center">
            Así funcionará
          </h2>
          <div className="space-y-3">
            {[
              {
                metal: "Oro",
                color: "#D6B35A",
                condition: "Precio ≥ $2.500",
                status: "Activa",
              },
              {
                metal: "Plata",
                color: "#A7B0BE",
                condition: "Cambio diario > 3%",
                status: "Activa",
              },
              {
                metal: "Platino",
                color: "#8B9DC3",
                condition: "Mínimo 52 semanas",
                status: "Activa",
              },
            ].map((alert) => (
              <div
                key={alert.metal}
                className="flex items-center gap-4 bg-surface-0 border border-border rounded-sm p-4"
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: alert.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-content-0">
                    {alert.metal}
                  </div>
                  <div className="text-xs text-content-3">{alert.condition}</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-signal-up-bg text-signal-up">
                  {alert.status}
                </span>
                <div className="flex gap-1">
                  <div className="w-7 h-7 rounded-xs bg-surface-2 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-3">
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div className="w-7 h-7 rounded-xs bg-surface-2 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-3">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <div className="text-[10px] text-content-3 uppercase tracking-wider font-medium">
              Vista previa — no funcional aún
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-content-2 mb-4">
            Mientras tanto, consulta los precios en tiempo real:
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
