import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { Link } from "@/i18n/navigation";
import {
  breadcrumbSchema,
  softwareAppSchema,
  faqSchema,
} from "@/lib/seo/schemas";

const BitcoinPriceDashboard = dynamic(
  () =>
    import("@/components/bitcoin/BitcoinPriceDashboard").then(
      (m) => m.BitcoinPriceDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-8 animate-shimmer h-[360px]" />
    ),
  },
);

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "bitcoinPrice" });
  const rawDesc = t("metaDesc");
  const description =
    rawDesc.length > 155
      ? rawDesc.slice(0, rawDesc.lastIndexOf(" ", 152)) + "…"
      : rawDesc;
  return {
    title: t("metaTitle"),
    description,
    keywords:
      locale === "es"
        ? [
            "precio bitcoin hoy",
            "bitcoin precio",
            "btc usd",
            "cotización bitcoin",
            "bitcoin tiempo real",
            "bitcoin vs oro",
          ]
        : locale === "de"
          ? [
              "Bitcoin Preis",
              "Bitcoin Kurs",
              "BTC USD",
              "Bitcoin heute",
              "Bitcoin vs Gold",
            ]
          : [
              "bitcoin price",
              "bitcoin price today",
              "btc price",
              "btc usd",
              "bitcoin live price",
              "bitcoin vs gold",
              "bitcoin market cap",
            ],
    alternates: getAlternates(locale, "/precio-bitcoin"),
    openGraph: {
      title: t("metaTitle"),
      description,
      type: "website",
      url: getAlternates(locale, "/precio-bitcoin").canonical,
    },
  };
}

export default async function BitcoinPricePage() {
  const locale = await getLocale();
  const t = await getTranslations("bitcoinPrice");
  const tc = await getTranslations("common");

  const bc = breadcrumbSchema(
    [{ name: t("h1"), path: "/precio-bitcoin" }],
    tc("breadcrumbHome"),
    locale,
  );

  const app = softwareAppSchema({
    name: t("h1"),
    description: t("metaDesc"),
    path: "/precio-bitcoin",
    locale,
  });

  const faqItems = Array.from({ length: 5 }, (_, i) => ({
    question: t(`faq${i + 1}Q`),
    answer: t(`faq${i + 1}A`),
  }));
  const faqLd = faqSchema(faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav
            className="text-sm text-content-3 mb-6"
            aria-label={tc("breadcrumbNav")}
          >
            <Link href="/" className="hover:text-content-1 transition-colors">
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("h1")}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("h1")}
          </h1>
          <p className="text-content-2 mb-8 max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>

          <BitcoinPriceDashboard />

          {/* What is Bitcoin */}
          <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("whatIsTitle")}
            </h2>
            <p className="text-sm text-content-2 leading-relaxed">
              {t("whatIsText")}
            </p>
          </div>

          {/* Key factors */}
          <div className="mt-8 bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("factorsTitle")}
            </h2>
            <ul className="space-y-3 text-sm text-content-2 leading-relaxed">
              {[1, 2, 3, 4, 5].map((n) => (
                <li key={n} className="flex gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#F7931A] mt-2" />
                  {t(`factor${n}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="mt-12 mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-4">FAQ</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group bg-surface-1 border border-border rounded-DEFAULT"
                >
                  <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-content-0 flex items-center justify-between">
                    {item.question}
                    <span className="text-content-3 group-open:rotate-45 transition-transform text-lg leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-content-2 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related links */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/comparar/oro-vs-bitcoin"
              className="text-sm font-medium text-brand-gold hover:underline"
            >
              {t("goldVsBtcLink")}
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-medium text-brand-gold hover:underline"
            >
              {t("portfolioLink")}
            </Link>
            <Link
              href="/fear-greed"
              className="text-sm font-medium text-brand-gold hover:underline"
            >
              {t("fearGreedLink")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
