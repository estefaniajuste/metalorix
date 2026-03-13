import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/noticias", label: "Noticias" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "mailto:hello@metalorix.com", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="py-8 border-t border-border bg-surface-0">
      <div className="mx-auto max-w-[1200px] px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5 text-[13px] text-content-3">
          <span>&copy; {new Date().getFullYear()} Metalorix</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-signal-up">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-up" />
            Operativo
          </span>
        </div>
        <div className="flex gap-4 text-[13px]">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-content-3 hover:text-content-1 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
