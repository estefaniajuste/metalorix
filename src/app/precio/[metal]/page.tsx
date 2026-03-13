import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetalSEO, METAL_SEO } from "@/lib/seo/metal-content";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";
import Link from "next/link";

export function generateStaticParams() {
  return Object.keys(METAL_SEO).map((metal) => ({ metal }));
}

export function generateMetadata({
  params,
}: {
  params: { metal: string };
}): Metadata {
  const seo = getMetalSEO(params.metal);
  if (!seo) return { title: "Metal no encontrado — Metalorix" };

  return {
    title: `Precio del ${seo.name} hoy — Metalorix`,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `Precio del ${seo.name} hoy en tiempo real — Metalorix`,
      description: seo.description,
      type: "website",
      url: `https://metalorix.com/precio/${seo.slug}`,
    },
    alternates: {
      canonical: `https://metalorix.com/precio/${seo.slug}`,
    },
  };
}

function JsonLd({ slug }: { slug: string }) {
  const seo = getMetalSEO(slug)!;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: seo.fullName,
      description: seo.about,
      url: `https://metalorix.com/precio/${seo.slug}`,
      provider: {
        "@type": "Organization",
        name: "Metalorix",
        url: "https://metalorix.com",
      },
      category: "Precious Metals",
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
          name: `Precio del ${seo.name}`,
          item: `https://metalorix.com/precio/${seo.slug}`,
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

export default function PrecioMetalPage({
  params,
}: {
  params: { metal: string };
}) {
  const seo = getMetalSEO(params.metal);
  if (!seo) notFound();

  const otherMetals = Object.values(METAL_SEO).filter(
    (m) => m.slug !== seo.slug
  );

  return (
    <>
      <JsonLd slug={seo.slug} />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-content-1 transition-colors">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">Precio del {seo.name}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            Precio del {seo.name} hoy
          </h1>
          <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
            Cotización {seo.fullName} en tiempo real. Gráfico interactivo,
            datos históricos y contexto del mercado.
          </p>

          {/* Chart + Data */}
          <MetalPageContent symbol={seo.symbol} />

          {/* About section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h2 className="text-xl font-bold text-content-0 mb-4">
                  Sobre el {seo.name}
                </h2>
                <p className="text-content-2 leading-relaxed mb-6">
                  {seo.about}
                </p>
                <h3 className="text-base font-semibold text-content-0 mb-3">
                  Datos clave
                </h3>
                <ul className="space-y-3">
                  {seo.facts.map((fact, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-content-1 leading-relaxed"
                    >
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-gold mt-2" />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar: other metals */}
            <div>
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h3 className="text-base font-semibold text-content-0 mb-4">
                  Otros metales
                </h3>
                <div className="space-y-3">
                  {otherMetals.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/precio/${m.slug}`}
                      className="flex items-center gap-3 p-3 rounded-sm hover:bg-surface-2 transition-colors group"
                    >
                      <span className="text-sm font-bold text-content-3 group-hover:text-content-1 transition-colors w-8">
                        {m.symbol.slice(1)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-content-0">
                          {m.name}
                        </div>
                        <div className="text-xs text-content-3">
                          {m.symbol}/USD
                        </div>
                      </div>
                      <svg
                        className="ml-auto w-4 h-4 text-content-3 group-hover:text-content-1 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mt-6">
                <h3 className="text-base font-semibold text-content-0 mb-3">
                  Aviso legal
                </h3>
                <p className="text-xs text-content-3 leading-relaxed">
                  Los datos mostrados son informativos y no constituyen
                  asesoramiento financiero. Los precios pueden tener un retraso
                  de hasta 15 minutos respecto al mercado. Consulta siempre con
                  un asesor cualificado antes de tomar decisiones de inversión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
