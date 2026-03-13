import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const sections = [
    {
      title: t("prices"),
      links: [
        { href: "/precio/oro", label: tn("gold") },
        { href: "/precio/plata", label: tn("silver") },
        { href: "/precio/platino", label: tn("platinum") },
      ],
    },
    {
      title: t("platform"),
      links: [
        { href: "/", label: tn("dashboard") },
        { href: "/productos", label: tn("products") },
        { href: "/herramientas", label: tn("tools") },
        { href: "/guia-inversion", label: t("investmentGuide") },
        { href: "/noticias", label: tn("news") },
        { href: "/alertas", label: tn("alerts") },
        { href: "/glosario", label: t("glossary") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/aviso-legal", label: t("legalNotice") },
        { href: "/terminos", label: t("terms") },
        { href: "/privacidad", label: t("privacy") },
        { href: "mailto:hello@metalorix.com", label: t("contact") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface-0">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Logo className="h-7 w-auto" />
            </Link>
            <p className="text-xs text-content-3 leading-relaxed max-w-[200px]">
              {t("description")}
            </p>
          </div>

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

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[12px] text-content-3">
            <span>&copy; {new Date().getFullYear()} Metalorix</span>
            <span className="inline-flex items-center gap-1.5 text-signal-up">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-up" />
              {t("status")}
            </span>
          </div>
          <p className="text-[11px] text-content-3 leading-relaxed max-w-lg">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
