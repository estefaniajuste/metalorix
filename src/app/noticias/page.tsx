import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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

export const revalidate = 300; // Revalidate every 5 minutes

const CATEGORY_LABELS: Record<string, string> = {
  daily: "Resumen diario",
  weekly: "Análisis semanal",
  event: "Alerta de mercado",
  educational: "Educativo",
};

const METAL_COLORS: Record<string, string> = {
  XAU: "#D6B35A",
  XAG: "#A7B0BE",
  XPT: "#8B9DC3",
};

const METAL_NAMES: Record<string, string> = {
  XAU: "Oro",
  XAG: "Plata",
  XPT: "Platino",
};

async function getPublishedArticles() {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(30);
  } catch {
    return [];
  }
}

const sources = [
  "Reuters Commodities",
  "Kitco News",
  "World Gold Council",
  "BullionVault",
  "Investing.com",
  "London Bullion Market",
];

const contentTypes = [
  {
    title: "Resumen diario",
    description: "Cada día a las 20:00 CET, un resumen automático de lo que ha pasado en el mercado de metales preciosos.",
    frequency: "Diario",
  },
  {
    title: "Análisis semanal",
    description: "Cada domingo, un análisis en profundidad de la semana: tendencias, niveles clave y perspectivas.",
    frequency: "Semanal",
  },
  {
    title: "Alertas de mercado",
    description: "Artículos automáticos cuando un metal se mueve más de un 2% en un día. Contexto inmediato.",
    frequency: "Por evento",
  },
  {
    title: "Contenido educativo",
    description: "Artículos sobre conceptos clave: qué es el ratio oro/plata, cómo funciona el mercado spot, DCA en metales.",
    frequency: "Semanal",
  },
];

function ArticleCard({
  article,
}: {
  article: Awaited<ReturnType<typeof getPublishedArticles>>[number];
}) {
  const mainMetal = article.metals?.[0] ?? "XAU";
  const color = METAL_COLORS[mainMetal] ?? "#D6B35A";

  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden hover:border-border-hover hover:shadow-card hover:-translate-y-0.5 transition-all group"
    >
      <div className="h-1.5" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
          {article.metals?.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-content-3"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: METAL_COLORS[m] ?? "#D6B35A" }}
              />
              {METAL_NAMES[m] ?? m}
            </span>
          ))}
        </div>
        <h3 className="text-sm font-semibold text-content-0 leading-snug mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-xs text-content-2 leading-relaxed line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}
        <div className="text-[10px] text-content-3">
          {article.publishedAt?.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </Link>
  );
}

export default async function NoticiasPage() {
  const publishedArticles = await getPublishedArticles();
  const hasArticles = publishedArticles.length > 0;

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          {!hasArticles && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider mb-5">
              Próximamente
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
            Noticias del mercado
          </h1>
          <p className="text-content-2 leading-relaxed">
            {hasArticles
              ? "Análisis, resúmenes y noticias del mercado de oro, plata y platino. Contenido actualizado con IA."
              : "Análisis diario, resúmenes semanales y artículos generados con IA sobre el mercado de oro, plata y platino. Contenido en español basado en las fuentes más fiables del sector."}
          </p>
        </div>

        {/* Real articles from DB */}
        {hasArticles && (
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Content types info (shown when no articles, or as secondary) */}
        <div className={hasArticles ? "mt-8" : ""}>
          <h2 className="text-xl font-bold text-content-0 mb-6">
            {hasArticles ? "Tipos de contenido" : "Qué publicaremos"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {contentTypes.map((type) => (
              <div
                key={type.title}
                className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover transition-colors"
              >
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
            ))}
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
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-content-2 mb-4">
            Consulta los precios en tiempo real:
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
