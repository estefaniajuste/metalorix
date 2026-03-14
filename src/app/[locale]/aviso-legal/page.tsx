import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: `${t("legalTitle")} — Metalorix`,
    robots: { index: true, follow: true },
    alternates: getAlternates(locale, "/aviso-legal"),
  };
}

export default async function AvisoLegalPage() {
  const t = await getTranslations("legal");
  const tc = await getTranslations("common");

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("legalTitle")}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-8">
          {t("legalTitle")}
        </h1>

        <div className="prose-metalorix space-y-6 text-content-2 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">1. {t("identifyingData")}</h2>
            <p>{t("legalNotice.identifyingDataContent")}</p>
            <p className="mt-2">
              {t("legalNotice.contactLabel")} <a href="mailto:hello@metalorix.com" className="text-brand-gold hover:underline">hello@metalorix.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">2. {t("siteObjective")}</h2>
            <p>{t("legalNotice.siteObjectiveContent")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">3. {t("noFinancialAdvice")}</h2>
            <p>
              {t("legalNotice.noAdviceP1")}{" "}
              <strong>{t("legalNotice.noAdviceP1Bold")}</strong>
            </p>
            <p className="mt-2">{t("legalNotice.noAdviceP2")}</p>
            <p className="mt-2">{t("legalNotice.noAdviceP3")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">4. {t("intellectualProperty")}</h2>
            <p>{t("legalNotice.ipP1")}</p>
            <p className="mt-2">{t("legalNotice.ipP2")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">5. {t("limitationOfLiability")}</h2>
            <p>{t("legalNotice.liabilityP1")}</p>
            <p className="mt-2">{t("legalNotice.liabilityP2")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">6. {t("externalLinks")}</h2>
            <p>{t("legalNotice.externalLinksContent")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">7. {t("applicableLaw")}</h2>
            <p>{t("legalNotice.applicableLawContent")}</p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-content-3">{t("lastUpdated")}</p>
            <div className="flex gap-4 mt-2">
              <Link href="/privacidad" className="text-xs text-brand-gold hover:underline">{t("privacyPolicy")}</Link>
              <Link href="/terminos" className="text-xs text-brand-gold hover:underline">{t("termsOfService")}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
