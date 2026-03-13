import type { Metadata } from "next";
import Link from "next/link";
import { UserPanel } from "@/components/panel/UserPanel";

export const metadata: Metadata = {
  title: "Mi panel de alertas — Metalorix",
  description: "Gestiona tus alertas de precio de metales preciosos. Acceso sin contraseña via magic link.",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Mi panel</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-2">
          Mi panel
        </h1>
        <p className="text-content-2 mb-8 text-sm">
          Gestiona tus alertas de precio y suscripciones.
        </p>

        <UserPanel />
      </div>
    </section>
  );
}
