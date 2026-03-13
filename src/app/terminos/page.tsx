import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de servicio — Metalorix",
  description: "Términos y condiciones de uso de la plataforma metalorix.com.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://metalorix.com/terminos" },
};

export default function TerminosPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Términos de servicio</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-8">
          Términos de servicio
        </h1>

        <div className="prose-metalorix space-y-6 text-content-2 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar metalorix.com (en adelante, &quot;la Plataforma&quot;), aceptas
              estos Términos de Servicio. Si no estás de acuerdo, te rogamos que no utilices
              la Plataforma.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">2. Descripción del servicio</h2>
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
            <h2 className="text-lg font-bold text-content-0 mb-2">3. Registro y alertas por email</h2>
            <p>
              Para recibir alertas de precio y la newsletter, solo necesitas proporcionar tu
              dirección de email. No se requiere contraseña ni datos personales adicionales.
            </p>
            <p className="mt-2">
              Al suscribirte, aceptas recibir comunicaciones relacionadas con el servicio
              (alertas de precio, newsletter semanal). Puedes cancelar la suscripción en
              cualquier momento contactando a hello@metalorix.com.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">4. Uso aceptable</h2>
            <p>El usuario se compromete a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>No utilizar la Plataforma para fines ilegales</li>
              <li>No intentar acceder a áreas restringidas del sistema</li>
              <li>No realizar scraping masivo o automatizado sin autorización</li>
              <li>No reproducir o distribuir el contenido sin citar la fuente</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">5. Exactitud de los datos</h2>
            <p>
              Los precios y datos mostrados se obtienen de fuentes públicas (mercados de futuros)
              y pueden tener un retraso. <strong>Metalorix no garantiza la exactitud ni la
              disponibilidad continua de los datos.</strong>
            </p>
            <p className="mt-2">
              Los artículos generados por inteligencia artificial pueden contener inexactitudes.
              Se recomienda contrastar la información con fuentes adicionales.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">6. Exclusión de responsabilidad</h2>
            <p>
              La Plataforma se proporciona &quot;tal cual&quot; (&quot;as is&quot;). Metalorix no ofrece
              garantías de ningún tipo, ya sean expresas o implícitas, sobre la idoneidad
              del servicio para un propósito particular.
            </p>
            <p className="mt-2">
              En ningún caso Metalorix será responsable de pérdidas financieras, daños directos
              o indirectos derivados del uso de la información proporcionada.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">7. Modificaciones</h2>
            <p>
              Metalorix se reserva el derecho de modificar estos Términos de Servicio en cualquier
              momento. Los cambios serán efectivos desde su publicación en la Plataforma.
              El uso continuado del servicio tras los cambios implica la aceptación de los
              nuevos términos.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">8. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estos términos, puedes escribir a:{" "}
              <a href="mailto:hello@metalorix.com" className="text-brand-gold hover:underline">
                hello@metalorix.com
              </a>
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-content-3">
              Última actualización: marzo de 2026
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="/aviso-legal" className="text-xs text-brand-gold hover:underline">Aviso legal</Link>
              <Link href="/privacidad" className="text-xs text-brand-gold hover:underline">Política de privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
