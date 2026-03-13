import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getMetalSEO, METAL_SEO } from "@/lib/seo/metal-content";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";
import { ShareButton } from "@/components/dashboard/ShareButton";
import Link from "next/link";

export const revalidate = 60;

export function generateStaticParams() {
  return Object.keys(METAL_SEO).map((metal) => ({ metal }));
}

export async function generateMetadata({
  params,
}: {
  params: { metal: string };
}): Promise<Metadata> {
  const t = await getTranslations("prices");
  const seo = getMetalSEO(params.metal);
  if (!seo) return { title: t("notFound") };

  return {
    title: `${t("priceOf", { metal: seo.name })} — Metalorix`,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${t("priceOf", { metal: seo.name })} — Metalorix`,
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
      provider: { "@type": "Organization", name: "Metalorix", url: "https://metalorix.com" },
      category: "Precious Metals",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Metalorix", item: "https://metalorix.com" },
        { "@type": "ListItem", position: 2, name: seo.name, item: `https://metalorix.com/precio/${seo.slug}` },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

export default async function PrecioMetalPage({
  params,
}: {
  params: { metal: string };
}) {
  const seo = getMetalSEO(params.metal);
  if (!seo) notFound();

  const t = await getTranslations("prices");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");
  const otherMetals = Object.values(METAL_SEO).filter((m) => m.slug !== seo.slug);

  return (
    <>
      <JsonLd slug={seo.slug} />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("breadcrumbPrice", { metal: seo.name })}</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight">
              {t("priceOf", { metal: seo.name })}
            </h1>
            <ShareButton
              title={`${t("priceOf", { metal: seo.name })} — Metalorix`}
              text={t("shareText", { metal: seo.fullName })}
              url={`https://metalorix.com/precio/${seo.slug}`}
            />
          </div>
          <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
            {t("description", { metal: seo.fullName })}
          </p>

          <MetalPageContent symbol={seo.symbol} />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h2 className="text-xl font-bold text-content-0 mb-4">
                  {t("about", { metal: seo.name })}
                </h2>
                <p className="text-content-2 leading-relaxed mb-6">{seo.about}</p>
                <h3 className="text-base font-semibold text-content-0 mb-3">{t("keyFacts")}</h3>
                <ul className="space-y-3">
                  {seo.facts.map((fact, i) => (
                    <li key={i} className="flex gap-3 text-sm text-content-1 leading-relaxed">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-gold mt-2" />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h3 className="text-base font-semibold text-content-0 mb-4">{t("otherMetals")}</h3>
                <div className="space-y-3">
                  {otherMetals.map((m) => (
                    <Link key={m.slug} href={`/precio/${m.slug}`} className="flex items-center gap-3 p-3 rounded-sm hover:bg-surface-2 transition-colors group">
                      <span className="text-sm font-bold text-content-3 group-hover:text-content-1 transition-colors w-8">{m.symbol.slice(1)}</span>
                      <div>
                        <div className="text-sm font-medium text-content-0">{m.name}</div>
                        <div className="text-xs text-content-3">{m.symbol}/USD</div>
                      </div>
                      <svg className="ms-auto w-4 h-4 text-content-3 group-hover:text-content-1 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mt-6">
                <h3 className="text-base font-semibold text-content-0 mb-3">{tf("legalNotice")}</h3>
                <p className="text-xs text-content-3 leading-relaxed">{tf("disclaimer")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
