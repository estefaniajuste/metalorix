import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { ProductFilter } from "@/components/products/ProductFilter";
import { breadcrumbSchema } from "@/lib/seo/schemas";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const rawDesc = t("productos.description");
  const description = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  return {
    title: t("productos.title"),
    description,
    keywords: locale === "es"
      ? ["monedas oro inversión", "lingotes oro inversión", "Krugerrand", "Maple Leaf oro", "Filarmónica Viena oro", "comprar oro España", "monedas plata inversión", "lingote oro 1 oz", "lingote plata 1 kg"]
      : ["gold investment coins", "gold investment bars", "Krugerrand", "Maple Leaf gold", "Vienna Philharmonic gold", "buy gold", "silver investment coins", "gold bar 1 oz", "silver bar 1 kg"],
    openGraph: {
      title: t("productos.ogTitle"),
      description: t("productos.ogDescription"),
      type: "website",
      url: getAlternates(locale, "/productos").canonical,
    },
    alternates: getAlternates(locale, "/productos"),
  };
}

export default async function ProductosPage() {
  const t = await getTranslations("products");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [{ name: t("breadcrumb"), path: "/productos" }],
    tc("breadcrumbHome"),
    locale,
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
            aria-label={tc("breadcrumbNav")}
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
