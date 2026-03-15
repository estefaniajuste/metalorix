import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { MetalComparator } from "@/components/tools/MetalComparator";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/seo/schemas";
import { getAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return {
    title: t("comparador.title"),
    description: t("comparador.description"),
    keywords: locale === "es"
      ? ["oro vs plata", "comparar oro plata platino", "rendimiento oro vs plata", "gold vs silver performance", "mejor inversión metales preciosos", "comparativa metales preciosos"]
      : ["gold vs silver", "compare gold silver platinum", "gold vs silver performance", "best precious metals investment", "precious metals comparison"],
    alternates: getAlternates(locale, "/comparador"),
    openGraph: {
      title: t("comparador.ogTitle"),
      description: t("comparador.ogDescription"),
      type: "website",
      url: "https://metalorix.com/comparador",
    },
  };
}

export default async function ComparadorPage() {
  const t = await getTranslations("comparatorPage");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");
  const tm = await getTranslations("metals");

  const tp = await getTranslations("pages");

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("breadcrumb"), path: "/comparador" },
    ],
    tc("breadcrumbHome"),
  );
  const app = softwareAppSchema({
    name: tp("comparador.ogTitle"),
    description: tp("comparador.description"),
    path: "/comparador",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            {tc("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/herramientas" className="hover:text-content-1 transition-colors">
            {tt("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("breadcrumb")}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>

        <MetalComparator />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("howToInterpret")}
            </h2>
            <p className="text-content-2 text-sm leading-relaxed mb-3">
              {t("interpretP1")}
            </p>
            <p className="text-content-2 text-sm leading-relaxed">
              {t("interpretP2")}
            </p>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("factors")}
            </h2>
            <ul className="space-y-3 text-sm text-content-2 leading-relaxed">
              {[
                { metal: tm("gold"), desc: t("goldFactors") },
                { metal: tm("silver"), desc: t("silverFactors") },
                { metal: tm("platinum"), desc: t("platinumFactors") },
              ].map((item) => (
                <li key={item.metal} className="flex gap-3">
                  <span className="flex-shrink-0 font-semibold text-content-0 w-16">
                    {item.metal}
                  </span>
                  <span>{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
