import type { Metadata } from "next";
import Link from "next/link";
import { GoldSilverRatioContent } from "@/components/ratio/GoldSilverRatioContent";

export const metadata: Metadata = {
  title: "Ratio Oro/Plata hoy — Gráfico histórico y análisis | Metalorix",
  description:
    "Ratio oro/plata en tiempo real con gráfico histórico. Descubre si el oro está sobrevalorado respecto a la plata y cuándo es mejor momento para invertir.",
  keywords: [
    "ratio oro plata",
    "gold silver ratio",
    "ratio oro plata histórico",
    "oro vs plata",
    "proporción oro plata",
    "invertir oro o plata",
  ],
  alternates: {
    canonical: "https://metalorix.com/ratio-oro-plata",
  },
  openGraph: {
    title: "Ratio Oro/Plata hoy — Metalorix",
    description:
      "Ratio oro/plata en tiempo real con gráfico histórico y zonas de sobrevaloración.",
    type: "website",
    url: "https://metalorix.com/ratio-oro-plata",
  },
};

function JsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Ratio Oro/Plata — Metalorix",
      description:
        "Ratio oro/plata en tiempo real con gráfico histórico y análisis de zonas extremas.",
      url: "https://metalorix.com/ratio-oro-plata",
      publisher: {
        "@type": "Organization",
        name: "Metalorix",
        url: "https://metalorix.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://metalorix.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Ratio Oro/Plata",
          item: "https://metalorix.com/ratio-oro-plata",
        },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export default function RatioOroPlataPage() {
  return (
    <>
      <JsonLd />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-content-1 transition-colors">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">Ratio Oro/Plata</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
            Ratio Oro/Plata hoy
          </h1>
          <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
            El ratio oro/plata indica cuántas onzas de plata se necesitan para
            comprar una onza de oro. Es una de las métricas más antiguas y
            seguidas por inversores de metales preciosos.
          </p>

          {/* Interactive content */}
          <GoldSilverRatioContent />

          {/* Educational content */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
              <h2 className="text-xl font-bold text-content-0 mb-4">
                ¿Qué es el ratio oro/plata?
              </h2>
              <p className="text-content-2 leading-relaxed mb-4">
                El ratio oro/plata (Gold/Silver Ratio) es simplemente el precio
                del oro dividido entre el precio de la plata. Si el oro vale
                $2.000/oz y la plata $25/oz, el ratio es 80.
              </p>
              <p className="text-content-2 leading-relaxed">
                Históricamente, este ratio ha fluctuado entre 15 y 120. Un ratio
                alto sugiere que la plata está &quot;barata&quot; respecto al oro, mientras
                que un ratio bajo indica que la plata está &quot;cara&quot; en comparación.
              </p>
            </div>

            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
              <h2 className="text-xl font-bold text-content-0 mb-4">
                ¿Cómo usarlo para invertir?
              </h2>
              <ul className="space-y-3">
                {[
                  {
                    zone: "Ratio > 80",
                    color: "text-signal-up",
                    text: "Plata potencialmente infravalorada. Históricamente, buen momento para comprar plata o hacer swap de oro a plata.",
                  },
                  {
                    zone: "Ratio 60-80",
                    color: "text-brand-gold",
                    text: "Zona normal. No hay una señal clara de sobrevaloración o infravaloración.",
                  },
                  {
                    zone: "Ratio < 60",
                    color: "text-signal-down",
                    text: "Oro potencialmente infravalorado respecto a plata. Considerar aumentar posición en oro.",
                  },
                ].map((item) => (
                  <li key={item.zone} className="flex gap-3 text-sm">
                    <span
                      className={`font-bold whitespace-nowrap ${item.color}`}
                    >
                      {item.zone}
                    </span>
                    <span className="text-content-2 leading-relaxed">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Historical context */}
          <div className="mt-6 bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              Contexto histórico
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Media histórica (50 años)",
                  value: "~60",
                  desc: "El ratio medio desde 1970",
                },
                {
                  label: "Máximo histórico",
                  value: "~127",
                  desc: "Marzo 2020 (crisis COVID)",
                },
                {
                  label: "Mínimo reciente",
                  value: "~31",
                  desc: "Abril 2011 (rally de plata)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface-0 border border-border rounded-sm p-4"
                >
                  <div className="text-xs text-content-3 font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-brand-gold tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-content-3 mt-1">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
