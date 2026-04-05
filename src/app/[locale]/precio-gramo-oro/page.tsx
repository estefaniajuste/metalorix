import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { GramPriceContent } from "@/components/seo/GramPriceContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const rawDesc = t("precioGramoOro.description");
  const description = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  const alternates = getAlternates(locale, "/precio-gramo-oro");
  return {
    title: t("precioGramoOro.title"),
    description,
    keywords: locale === "es"
      ? ["precio gramo oro", "precio gramo oro hoy", "precio gramo oro euros", "cuanto vale un gramo de oro", "precio gramo oro 18 kilates", "precio gramo oro 24 kilates", "valor gramo oro", "cotización gramo oro"]
      : ["gold price per gram", "gold price per gram today", "gold gram price euros", "how much is a gram of gold", "18 karat gold gram price", "24 karat gold gram price", "gold gram value"],
    alternates,
    openGraph: {
      title: t("precioGramoOro.ogTitle"),
      description,
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function PrecioGramoOroPage() {
  const t = await getTranslations("gramPrice");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [{ name: t("breadcrumb"), path: "/precio-gramo-oro" }],
    tc("breadcrumbHome"),
    locale,
  );
  const faqItems = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
  ];
  const faq = faqSchema(faqItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
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
        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-content-0 mb-5">{t("faqTitle")}</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-DEFAULT border border-border bg-surface-1 overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-content-0 [&::-webkit-details-marker]:hidden list-none">
                  {item.question}
                  <svg className="shrink-0 ml-3 w-4 h-4 text-content-3 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-content-2 leading-relaxed border-t border-border pt-3">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
