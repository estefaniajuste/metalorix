import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProductFilter } from "@/components/products/ProductFilter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("productsPage");
  return {
    title: t("title") + " | Metalorix",
    description: t("subtitle"),
    keywords: [
      "monedas oro inversión",
      "lingotes oro inversión",
      "Krugerrand",
      "Maple Leaf oro",
      "Filarmónica Viena oro",
      "comprar oro España",
      "monedas plata inversión",
      "lingote oro 1 oz",
      "lingote plata 1 kg",
    ],
    openGraph: {
      title: "Monedas y lingotes de inversión — Metalorix",
      description:
        "Fichas de las principales monedas y lingotes de oro y plata: pureza, prima sobre spot, liquidez y fiscalidad en España.",
      type: "website",
      url: "https://metalorix.com/productos",
    },
    alternates: {
      canonical: "https://metalorix.com/productos",
    },
  };
}

export default async function ProductosPage() {
  const t = await getTranslations("productsPage");
  const tc = await getTranslations("common");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tc("breadcrumbHome"),
        item: "https://metalorix.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb"),
        item: "https://metalorix.com/productos",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav
            className="text-sm text-content-3 mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-content-1 transition-colors"
            >
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("breadcrumb")}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("title")}
          </h1>
          <p className="text-content-2 mb-10 max-w-3xl leading-relaxed">
            {t("subtitle")}
          </p>

          <ProductFilter />
        </div>
      </section>
    </>
  );
}
