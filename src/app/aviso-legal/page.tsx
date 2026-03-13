import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal — Metalorix",
  description: "Aviso legal, condiciones de uso e información sobre el responsable de metalorix.com.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://metalorix.com/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Aviso legal</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-8">
          Aviso legal
        </h1>

        <div className="prose-metalorix space-y-6 text-content-2 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">1. Datos identificativos</h2>
            <p>
              En cumplimiento del deber de información establecido en la Ley 34/2002, de 11 de julio,
              de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE),
              se informa que el presente sitio web, metalorix.com, es propiedad y está gestionado
              por su titular (en adelante, &quot;Metalorix&quot;).
            </p>
            <p className="mt-2">
              Contacto: <a href="mailto:hello@metalorix.com" className="text-brand-gold hover:underline">hello@metalorix.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">2. Objeto del sitio</h2>
            <p>
              Metalorix es una plataforma informativa sobre metales preciosos (oro, plata y platino)
              que ofrece datos de precios en tiempo real, herramientas de análisis, artículos generados
              por inteligencia artificial y alertas por email.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">3. Exclusión de asesoramiento financiero</h2>
            <p>
              La información proporcionada en metalorix.com tiene carácter meramente informativo y
              educativo. <strong>No constituye asesoramiento financiero, de inversión ni recomendación
              de compra o venta de ningún activo.</strong>
            </p>
            <p className="mt-2">
              Los precios mostrados pueden tener un retraso de hasta 15 minutos respecto al mercado.
              Metalorix no garantiza la exactitud, integridad ni actualidad de los datos publicados.
            </p>
            <p className="mt-2">
              Antes de tomar cualquier decisión de inversión, se recomienda consultar con un asesor
              financiero cualificado y debidamente registrado.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">4. Propiedad intelectual</h2>
            <p>
              Todos los contenidos del sitio web (textos, gráficos, imágenes, diseño, código fuente,
              logotipos) son propiedad de Metalorix o de terceros que han autorizado su uso.
              Quedan protegidos por las leyes de propiedad intelectual e industrial aplicables.
            </p>
            <p className="mt-2">
              Los artículos generados por inteligencia artificial se identifican como tal y son
              propiedad de Metalorix.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">5. Limitación de responsabilidad</h2>
            <p>
              Metalorix no se hace responsable de las decisiones tomadas en base a la información
              publicada en este sitio web, ni de los posibles daños o perjuicios derivados de su uso.
            </p>
            <p className="mt-2">
              Metalorix no garantiza la disponibilidad continua e ininterrumpida del servicio,
              pudiendo producirse interrupciones por mantenimiento o causas técnicas.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">6. Enlaces externos</h2>
            <p>
              Este sitio puede contener enlaces a sitios web de terceros. Metalorix no se
              responsabiliza del contenido ni de las prácticas de privacidad de dichos sitios.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">7. Legislación aplicable</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para cualquier
              controversia que pudiera derivarse del acceso o uso de este sitio web, las partes
              se someten a los juzgados y tribunales del domicilio del titular.
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-content-3">
              Última actualización: marzo de 2026
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="/privacidad" className="text-xs text-brand-gold hover:underline">Política de privacidad</Link>
              <Link href="/terminos" className="text-xs text-brand-gold hover:underline">Términos de servicio</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
