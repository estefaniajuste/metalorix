import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MetalComparator } from "@/components/tools/MetalComparator";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/seo/schemas";

export async function generateMetadata() {
  const t = await getTranslations("comparatorPage");
  return {
    title: t("title") + " — Metalorix",
    description: t("subtitle"),
    keywords: [
      "oro vs plata",
      "comparar oro plata platino",
      "rendimiento oro vs plata",
      "gold vs silver performance",
      "mejor inversión metales preciosos",
      "comparativa metales preciosos",
    ],
    alternates: {
      canonical: "https://metalorix.com/comparador",
    },
    openGraph: {
      title: t("title") + " — Metalorix",
      description: t("subtitle"),
      type: "website",
      url: "https://metalorix.com/comparador",
    },
  };
}

export default async function ComparadorPage() {
  const t = await getTranslations("comparatorPage");
  const tc = await getTranslations("common");
  const tm = await getTranslations("metals");

  const bc = breadcrumbSchema([
    { name: t("breadcrumbTools"), path: "/herramientas" },
    { name: t("breadcrumb"), path: "/comparador" },
  ]);
  const app = softwareAppSchema({
    name: t("title") + " — Metalorix",
    description: t("subtitle"),
    path: "/comparador",
  });

  const factorItems = [
    { metal: tm("gold"), desc: t("goldFactors") },
    { metal: tm("silver"), desc: t("silverFactors") },
    { metal: tm("platinum"), desc: t("platinumFactors") },
  ];

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
            {t("breadcrumbTools")}
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
              {t("howToRead")}
            </h2>
            <p className="text-content-2 text-sm leading-relaxed mb-3">
              {t("howToReadP1")}
            </p>
            <p className="text-content-2 text-sm leading-relaxed">
              {t("howToReadP2")}
            </p>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("factorsTitle")}
            </h2>
            <ul className="space-y-3 text-sm text-content-2 leading-relaxed">
              {factorItems.map((item) => (
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
