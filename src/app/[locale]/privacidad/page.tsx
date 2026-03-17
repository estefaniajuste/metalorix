import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { CookieConsentManager } from "@/components/layout/CookieConsentManager";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: `${t("privacyTitle")} — Metalorix`,
    alternates: getAlternates(locale, "/privacidad"),
  };
}

export default async function PrivacidadPage() {
  const t = await getTranslations("legal");
  const tc = await getTranslations("common");

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[780px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
          <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("privacyTitle")}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
          {t("privacyTitle")}
        </h1>
        <p className="text-sm text-content-3 mb-10">{t("lastUpdated")}</p>

        <div className="space-y-8 text-[15px] text-content-1 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">1. {t("dataController")}</h2>
            <p>
              {t("privacy.dataControllerDesc")}{" "}
              {t("privacy.contactUs")} <a href="mailto:info@metalorix.com" className="text-brand-gold hover:underline">info@metalorix.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">2. {t("dataWeCollect")}</h2>
            <p className="mb-3">{t("privacy.dataCollectIntro")}</p>
            <ul className="list-disc list-inside space-y-2 text-content-2">
              <li><strong className="text-content-1">{t("privacy.localPrefsLabel")}</strong>: {t("privacy.localPrefsDesc")}</li>
              <li><strong className="text-content-1">{t("privacy.alertsLabel")}</strong>: {t("privacy.alertsDesc")}</li>
              <li><strong className="text-content-1">{t("privacy.techDataLabel")}</strong>: {t("privacy.techDataDesc")}</li>
            </ul>
          </section>

          <section id="gestionar-cookies">
            <h2 className="text-lg font-bold text-content-0 mb-3">3. {t("cookiesStorage")}</h2>
            <CookieConsentManager />
            <p className="mb-3 mt-4">{t("privacy.cookiesIntro")}</p>
            <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-start px-4 py-2.5 font-semibold text-content-0">{t("name")}</th>
                    <th className="text-start px-4 py-2.5 font-semibold text-content-0">{t("type")}</th>
                    <th className="text-start px-4 py-2.5 font-semibold text-content-0">{t("purpose")}</th>
                  </tr>
                </thead>
                <tbody className="text-content-2">
                  <tr className="border-b border-border"><td className="px-4 py-2.5 font-mono text-xs">mtx-theme</td><td className="px-4 py-2.5">localStorage</td><td className="px-4 py-2.5">{t("privacy.themePurpose")}</td></tr>
                  <tr className="border-b border-border"><td className="px-4 py-2.5 font-mono text-xs">mtx-cookie-consent</td><td className="px-4 py-2.5">localStorage</td><td className="px-4 py-2.5">{t("privacy.consentPurpose")}</td></tr>
                  <tr className="border-b border-border"><td className="px-4 py-2.5 font-mono text-xs">_ga / _ga_*</td><td className="px-4 py-2.5">Cookie</td><td className="px-4 py-2.5">{t("privacy.gaPurpose")}</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">4. {t("thirdPartyServices")}</h2>
            <ul className="list-disc list-inside space-y-2 text-content-2">
              <li><strong className="text-content-1">Google Analytics 4</strong>: {t("privacy.gaDesc")}</li>
              <li><strong className="text-content-1">Google Cloud</strong>: {t("privacy.cloudDesc")}</li>
              <li><strong className="text-content-1">{t("privacy.priceApisLabel")}</strong>: {t("privacy.priceApisDesc")}</li>
              <li><strong className="text-content-1">Resend</strong>: {t("privacy.resendDesc")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">5. {t("yourRights")}</h2>
            <p>
              {t("privacy.rightsDesc")}{" "}
              {t("privacy.rightsContact")} <a href="mailto:info@metalorix.com" className="text-brand-gold hover:underline">info@metalorix.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">6. {t("policyChanges")}</h2>
            <p>{t("privacy.changesDesc")}</p>
          </section>
        </div>
      </div>
    </section>
  );
}
