import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProductFilter } from "@/components/products/ProductFilter";
import { breadcrumbSchema } from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages");
  return {
    title: t("productos.title"),
    description: t("productos.description"),
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
      title: t("productos.ogTitle"),
      description: t("productos.ogDescription"),
      type: "website",
      url: "https://metalorix.com/productos",
    },
    alternates: {
      canonical: "https://metalorix.com/productos",
    },
  };
}

export default async function ProductosPage() {
  const t = await getTranslations("products");
  const tc = await getTranslations("common");

  const bc = breadcrumbSchema(
    [{ name: t("breadcrumb"), path: "/productos" }],
    tc("breadcrumbHome"),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
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
