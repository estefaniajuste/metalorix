import Link from "next/link";
import { Logo } from "./Logo";

const sections = [
  {
    title: "Precios",
    links: [
      { href: "/precio/oro", label: "Precio del Oro" },
      { href: "/precio/plata", label: "Precio de la Plata" },
      { href: "/precio/platino", label: "Precio del Platino" },
    ],
  },
  {
    title: "Plataforma",
    links: [
      { href: "/", label: "Dashboard" },
      { href: "/productos", label: "Productos" },
      { href: "/herramientas", label: "Herramientas" },
      { href: "/guia-inversion", label: "Guía de inversión" },
      { href: "/noticias", label: "Noticias" },
      { href: "/alertas", label: "Alertas" },
      { href: "/glosario", label: "Glosario" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/aviso-legal", label: "Aviso legal" },
      { href: "/terminos", label: "Términos de servicio" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "mailto:hello@metalorix.com", label: "Contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-0">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Logo className="h-7 w-auto" />
            </Link>
            <p className="text-xs text-content-3 leading-relaxed max-w-[200px]">
              Precios de metales preciosos en tiempo real. Datos limpios,
              gráficos profesionales.
            </p>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-content-1 uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-content-3 hover:text-content-1 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[12px] text-content-3">
            <span>&copy; {new Date().getFullYear()} Metalorix</span>
            <span className="inline-flex items-center gap-1.5 text-signal-up">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-up" />
              Operativo
            </span>
          </div>
          <p className="text-[11px] text-content-3 leading-relaxed max-w-lg">
            Los datos mostrados son informativos y no constituyen asesoramiento
            financiero. Los precios pueden tener un retraso de hasta 15 minutos.
          </p>
        </div>
      </div>
    </footer>
  );
}
