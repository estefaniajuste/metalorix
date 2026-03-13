import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("legal");
  return {
    title: `${t("termsTitle")} — Metalorix`,
    robots: { index: true, follow: true },
    alternates: { canonical: "https://metalorix.com/terminos" },
  };
}

export default async function TerminosPage() {
  const t = await getTranslations("legal");
  const tc = await getTranslations("common");

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("termsTitle")}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-8">
          {t("termsTitle")}
        </h1>

        <div className="prose-metalorix space-y-6 text-content-2 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">1. {t("acceptance")}</h2>
            <p>Al acceder y utilizar metalorix.com (en adelante, &quot;la Plataforma&quot;), aceptas estos Términos de Servicio. Si no estás de acuerdo, te rogamos que no utilices la Plataforma.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">2. {t("serviceDescription")}</h2>
            <p>Metalorix ofrece de forma gratuita:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Precios de metales preciosos (oro, plata, platino) con actualización periódica</li>
              <li>Gráficos interactivos y datos históricos</li>
              <li>Herramientas de análisis (ratio, conversores, calculadoras)</li>
              <li>Artículos y análisis generados por inteligencia artificial</li>
              <li>Alertas de precio por email</li>
              <li>Newsletter semanal</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">3. {t("registration")}</h2>
            <p>Para recibir alertas de precio y la newsletter, solo necesitas proporcionar tu dirección de email. No se requiere contraseña ni datos personales adicionales.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">4. {t("acceptableUse")}</h2>
            <p>El usuario se compromete a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>No utilizar la Plataforma para fines ilegales</li>
              <li>No intentar acceder a áreas restringidas del sistema</li>
              <li>No realizar scraping masivo o automatizado sin autorización</li>
              <li>No reproducir o distribuir el contenido sin citar la fuente</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">5. {t("dataAccuracy")}</h2>
            <p>Los precios y datos mostrados se obtienen de fuentes públicas y pueden tener un retraso. <strong>Metalorix no garantiza la exactitud ni la disponibilidad continua de los datos.</strong></p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">6. {t("disclaimer")}</h2>
            <p>La Plataforma se proporciona &quot;tal cual&quot; (&quot;as is&quot;). Metalorix no ofrece garantías de ningún tipo. En ningún caso Metalorix será responsable de pérdidas financieras derivadas del uso de la información proporcionada.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">7. {t("modifications")}</h2>
            <p>Metalorix se reserva el derecho de modificar estos Términos de Servicio en cualquier momento.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">8. {t("contact")}</h2>
            <p>Para cualquier consulta: <a href="mailto:hello@metalorix.com" className="text-brand-gold hover:underline">hello@metalorix.com</a></p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-content-3">{t("lastUpdated")}</p>
            <div className="flex gap-4 mt-2">
              <Link href="/aviso-legal" className="text-xs text-brand-gold hover:underline">{t("legalNotice")}</Link>
              <Link href="/privacidad" className="text-xs text-brand-gold hover:underline">{t("privacyPolicy")}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
