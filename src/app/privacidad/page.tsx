import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("legal");
  return {
    title: `${t("privacyTitle")} — Metalorix`,
    alternates: { canonical: "https://metalorix.com/privacidad" },
  };
}

export default async function PrivacidadPage() {
  const t = await getTranslations("legal");
  const tc = await getTranslations("common");

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[780px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
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
              Metalorix es una plataforma informativa sobre precios de metales preciosos.
              Puedes contactarnos en <a href="mailto:hello@metalorix.com" className="text-brand-gold hover:underline">hello@metalorix.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">2. {t("dataWeCollect")}</h2>
            <p className="mb-3">Metalorix recopila la mínima información necesaria:</p>
            <ul className="list-disc list-inside space-y-2 text-content-2">
              <li><strong className="text-content-1">Preferencias locales</strong>: tema (claro/oscuro), consentimiento de cookies. Se almacenan en tu navegador (localStorage) y no se envían a ningún servidor.</li>
              <li><strong className="text-content-1">Alertas de precio</strong>: si te suscribes a alertas, almacenamos tu email y la configuración de alertas en nuestra base de datos para poder enviarte notificaciones.</li>
              <li><strong className="text-content-1">Datos técnicos</strong>: nuestro proveedor de hosting (Google Cloud) puede registrar direcciones IP y agentes de usuario en sus logs del servidor como parte del funcionamiento estándar.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">3. {t("cookiesStorage")}</h2>
            <p className="mb-3">Utilizamos exclusivamente:</p>
            <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-start px-4 py-2.5 font-semibold text-content-0">{t("cookieName")}</th>
                    <th className="text-start px-4 py-2.5 font-semibold text-content-0">{t("cookieType")}</th>
                    <th className="text-start px-4 py-2.5 font-semibold text-content-0">{t("cookiePurpose")}</th>
                  </tr>
                </thead>
                <tbody className="text-content-2">
                  <tr className="border-b border-border"><td className="px-4 py-2.5 font-mono text-xs">mtx-theme</td><td className="px-4 py-2.5">localStorage</td><td className="px-4 py-2.5">Preferencia de tema</td></tr>
                  <tr className="border-b border-border"><td className="px-4 py-2.5 font-mono text-xs">mtx-cookie-consent</td><td className="px-4 py-2.5">localStorage</td><td className="px-4 py-2.5">Estado del consentimiento</td></tr>
                  <tr className="border-b border-border"><td className="px-4 py-2.5 font-mono text-xs">_ga / _ga_*</td><td className="px-4 py-2.5">Cookie</td><td className="px-4 py-2.5">Google Analytics 4</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">4. {t("thirdPartyServices")}</h2>
            <ul className="list-disc list-inside space-y-2 text-content-2">
              <li><strong className="text-content-1">Google Analytics 4</strong>: estadísticas anónimas</li>
              <li><strong className="text-content-1">Google Cloud</strong>: hosting y base de datos (UE, europe-west1)</li>
              <li><strong className="text-content-1">APIs de precios</strong>: Gold API, Twelve Data, Yahoo Finance</li>
              <li><strong className="text-content-1">Resend</strong>: envío de emails de alertas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">5. {t("yourRights")}</h2>
            <p>
              Conforme al RGPD, tienes derecho a acceder, rectificar, suprimir y portar tus datos.
              Contacto: <a href="mailto:hello@metalorix.com" className="text-brand-gold hover:underline">hello@metalorix.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">6. {t("policyChanges")}</h2>
            <p>Nos reservamos el derecho de actualizar esta política. Cualquier cambio será publicado en esta página.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
