import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Noticias del mercado de metales preciosos — Metalorix",
  description:
    "Últimas noticias, análisis diario y resúmenes semanales del mercado de oro, plata y platino. Contenido generado con IA y curado por expertos.",
  keywords: [
    "noticias oro",
    "noticias plata",
    "análisis mercado metales preciosos",
    "resumen semanal oro",
    "mercado oro hoy",
  ],
  alternates: {
    canonical: "https://metalorix.com/noticias",
  },
};

const contentTypes = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Resumen diario",
    description: "Cada día a las 20:00 CET, un resumen automático de lo que ha pasado en el mercado de metales preciosos.",
    frequency: "Diario",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Análisis semanal",
    description: "Cada domingo, un análisis en profundidad de la semana: tendencias, niveles clave y perspectivas.",
    frequency: "Semanal",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Alertas de mercado",
    description: "Artículos automáticos cuando un metal se mueve más de un 2% en un día. Contexto inmediato.",
    frequency: "Por evento",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Contenido educativo",
    description: "Artículos sobre conceptos clave: qué es el ratio oro/plata, cómo funciona el mercado spot, DCA en metales.",
    frequency: "Semanal",
  },
];

const sources = [
  "Reuters Commodities",
  "Kitco News",
  "World Gold Council",
  "BullionVault",
  "Investing.com",
  "London Bullion Market",
];

export default function NoticiasPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider mb-5">
            Próximamente
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
            Noticias del mercado
          </h1>
          <p className="text-content-2 leading-relaxed">
            Análisis diario, resúmenes semanales y artículos generados con IA
            sobre el mercado de oro, plata y platino. Contenido en español
            basado en las fuentes más fiables del sector.
          </p>
        </div>

        {/* Content types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {contentTypes.map((type) => (
            <div
              key={type.title}
              className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-[rgba(214,179,90,0.08)] flex items-center justify-center text-brand-gold">
                  {type.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-content-0">
                      {type.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-content-3 uppercase tracking-wider">
                      {type.frequency}
                    </span>
                  </div>
                  <p className="text-sm text-content-2 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Article preview mockup */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-content-0 mb-6">
            Vista previa del formato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                category: "Resumen diario",
                title: "El oro cierra por encima de los $2.400 tras datos de empleo mixtos",
                date: "Próximamente",
                metal: "XAU",
                color: "#D6B35A",
              },
              {
                category: "Análisis semanal",
                title: "Plata: ¿rotura de los $30 a la vista? Análisis técnico y fundamental",
                date: "Próximamente",
                metal: "XAG",
                color: "#A7B0BE",
              },
              {
                category: "Educativo",
                title: "¿Qué es el ratio oro/plata y cómo usarlo para invertir?",
                date: "Próximamente",
                metal: "Todos",
                color: "#D6B35A",
              },
            ].map((article) => (
              <div
                key={article.title}
                className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden group"
              >
                <div className="h-2" style={{ backgroundColor: article.color }} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-content-3 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-content-3">{article.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-content-0 leading-snug mb-3 line-clamp-3">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: article.color }}
                    />
                    <span className="text-xs text-content-3">{article.metal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-[10px] text-content-3 uppercase tracking-wider font-medium">
              Vista previa — contenido de ejemplo
            </span>
          </div>
        </div>

        {/* Sources */}
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 max-w-2xl mx-auto mb-12">
          <h3 className="text-base font-semibold text-content-0 mb-4 text-center">
            Fuentes de información
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {sources.map((source) => (
              <span
                key={source}
                className="text-xs font-medium text-content-2 bg-surface-2 px-3 py-1.5 rounded-full"
              >
                {source}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-content-3 text-center mt-4">
            Noticias recopiladas automáticamente, procesadas con Gemini AI y
            publicadas en español.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-content-2 mb-4">
            Mientras tanto, consulta los precios en tiempo real:
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all"
            >
              Ver Dashboard
            </Link>
            <Link
              href="/precio/oro"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-1 border border-border text-content-0 hover:border-border-hover transition-all"
            >
              Precio del Oro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
