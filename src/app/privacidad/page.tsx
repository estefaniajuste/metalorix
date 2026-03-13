import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad — Metalorix",
  description:
    "Política de privacidad y uso de cookies de Metalorix. Información sobre qué datos recopilamos y cómo los usamos.",
  alternates: {
    canonical: "https://metalorix.com/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[780px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Privacidad</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
          Política de privacidad
        </h1>
        <p className="text-sm text-content-3 mb-10">
          Última actualización: marzo 2026
        </p>

        <div className="space-y-8 text-[15px] text-content-1 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">
              1. Responsable del tratamiento
            </h2>
            <p>
              Metalorix es una plataforma informativa sobre precios de metales
              preciosos. Puedes contactarnos en{" "}
              <a
                href="mailto:hello@metalorix.com"
                className="text-brand-gold hover:underline"
              >
                hello@metalorix.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">
              2. Datos que recopilamos
            </h2>
            <p className="mb-3">Metalorix recopila la mínima información necesaria:</p>
            <ul className="list-disc list-inside space-y-2 text-content-2">
              <li>
                <strong className="text-content-1">Preferencias locales</strong>:
                tema (claro/oscuro), consentimiento de cookies. Se almacenan en
                tu navegador (localStorage) y no se envían a ningún servidor.
              </li>
              <li>
                <strong className="text-content-1">Alertas de precio</strong>:
                si te suscribes a alertas, almacenamos tu email y la
                configuración de alertas en nuestra base de datos para poder
                enviarte notificaciones.
              </li>
              <li>
                <strong className="text-content-1">Datos técnicos</strong>:
                nuestro proveedor de hosting (Google Cloud) puede registrar
                direcciones IP y agentes de usuario en sus logs del servidor
                como parte del funcionamiento estándar.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">
              3. Cookies y almacenamiento local
            </h2>
            <p className="mb-3">Utilizamos exclusivamente:</p>
            <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-left px-4 py-2.5 font-semibold text-content-0">
                      Nombre
                    </th>
                    <th className="text-left px-4 py-2.5 font-semibold text-content-0">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-2.5 font-semibold text-content-0">
                      Propósito
                    </th>
                  </tr>
                </thead>
                <tbody className="text-content-2">
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-mono text-xs">mtx-theme</td>
                    <td className="px-4 py-2.5">localStorage</td>
                    <td className="px-4 py-2.5">Preferencia de tema</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      mtx-cookie-consent
                    </td>
                    <td className="px-4 py-2.5">localStorage</td>
                    <td className="px-4 py-2.5">Estado del consentimiento</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-mono text-xs">_ga / _ga_*</td>
                    <td className="px-4 py-2.5">Cookie</td>
                    <td className="px-4 py-2.5">
                      Google Analytics 4 — estadísticas anónimas de uso
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-content-3">
              Utilizamos Google Analytics 4 para obtener estadísticas
              anónimas de uso. No utilizamos cookies de publicidad ni
              rastreo con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">
              4. Servicios de terceros
            </h2>
            <ul className="list-disc list-inside space-y-2 text-content-2">
              <li>
                <strong className="text-content-1">Google Analytics 4</strong>:
                estadísticas anónimas de visitas y uso del sitio (puede
                establecer cookies _ga)
              </li>
              <li>
                <strong className="text-content-1">Google Cloud</strong>:
                hosting y base de datos (UE, europe-west1)
              </li>
              <li>
                <strong className="text-content-1">APIs de precios</strong>:
                consultamos Gold API, Twelve Data y Yahoo Finance para obtener
                cotizaciones. No enviamos datos personales a estos servicios.
              </li>
              <li>
                <strong className="text-content-1">Resend</strong>: envío de
                emails de alertas de precio (solo si te suscribes).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">
              5. Tus derechos
            </h2>
            <p>
              Conforme al RGPD, tienes derecho a acceder, rectificar, suprimir
              y portar tus datos, así como a oponerte a su tratamiento. Para
              ejercer cualquier derecho, escribe a{" "}
              <a
                href="mailto:hello@metalorix.com"
                className="text-brand-gold hover:underline"
              >
                hello@metalorix.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-content-0 mb-3">
              6. Cambios en esta política
            </h2>
            <p>
              Nos reservamos el derecho de actualizar esta política. Cualquier
              cambio será publicado en esta página con la fecha de
              actualización correspondiente.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
