import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { GramPriceContent } from "@/components/seo/GramPriceContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return {
    title: t("precioGramoOro.title"),
    description: t("precioGramoOro.description"),
    keywords: locale === "es"
      ? ["precio gramo oro", "precio gramo oro hoy", "precio gramo oro euros", "cuanto vale un gramo de oro", "precio gramo oro 18 kilates", "precio gramo oro 24 kilates", "valor gramo oro", "cotización gramo oro"]
      : ["gold price per gram", "gold price per gram today", "gold gram price euros", "how much is a gram of gold", "18 karat gold gram price", "24 karat gold gram price", "gold gram value"],
    alternates: getAlternates(locale, "/precio-gramo-oro"),
    openGraph: {
      title: t("precioGramoOro.ogTitle"),
      description: t("precioGramoOro.ogDescription"),
      type: "website",
      url: "https://metalorix.com/precio-gramo-oro",
    },
  };
}

export default async function PrecioGramoOroPage() {
  const t = await getTranslations("gramPrice");
  const tc = await getTranslations("common");

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            {tc("breadcrumbHome")}
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

        <GramPriceContent />

        {/* SEO content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("howCalculated")}
            </h2>
            <p className="text-content-2 leading-relaxed mb-4">
              {t("howCalculatedP1")}
            </p>
            <p className="text-content-2 leading-relaxed">
              {t("howCalculatedP2")}
            </p>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("karats")}
            </h2>
            <p className="text-content-2 leading-relaxed mb-4">
              {t("karatsDesc")}
            </p>
            <ul className="space-y-2 text-sm text-content-2">
              {[
                { k: "24K", purity: "99,9%", factor: "1.000" },
                { k: "22K", purity: "91,7%", factor: "0.917" },
                { k: "18K", purity: "75,0%", factor: "0.750" },
                { k: "14K", purity: "58,5%", factor: "0.585" },
                { k: "9K", purity: "37,5%", factor: "0.375" },
              ].map((item) => (
                <li key={item.k} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                  <span className="font-semibold text-content-0">{item.k}</span>
                  <span>{item.purity} {t("purity")}</span>
                  <span className="text-content-3">× {item.factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
