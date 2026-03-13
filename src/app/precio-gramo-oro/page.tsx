import type { Metadata } from "next";
import Link from "next/link";
import { GramPriceContent } from "@/components/seo/GramPriceContent";

export const metadata: Metadata = {
  title:
    "Precio del gramo de oro hoy en euros y dólares — Metalorix",
  description:
    "Precio del gramo de oro hoy actualizado en tiempo real en euros (EUR) y dólares (USD). También precio por onza y kilogramo de oro, plata y platino.",
  keywords: [
    "precio gramo oro",
    "precio gramo oro hoy",
    "precio gramo oro euros",
    "cuanto vale un gramo de oro",
    "precio gramo oro 18 kilates",
    "precio gramo oro 24 kilates",
    "valor gramo oro",
    "cotización gramo oro",
  ],
  alternates: {
    canonical: "https://metalorix.com/precio-gramo-oro",
  },
  openGraph: {
    title: "Precio del gramo de oro hoy — Metalorix",
    description:
      "¿Cuánto vale un gramo de oro? Precio actualizado en EUR y USD.",
    type: "website",
    url: "https://metalorix.com/precio-gramo-oro",
  },
};

export default function PrecioGramoOroPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Precio del gramo de oro</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          Precio del gramo de oro hoy
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          ¿Cuánto vale un gramo de oro? Precio actualizado en tiempo real en
          euros y dólares. También mostramos el precio por quilates para
          joyería.
        </p>

        <GramPriceContent />

        {/* SEO content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              ¿Cómo se calcula el precio del gramo de oro?
            </h2>
            <p className="text-content-2 leading-relaxed mb-4">
              El oro se cotiza internacionalmente en <strong>dólares por
              onza troy</strong>. Una onza troy equivale a 31,1035 gramos.
              Para obtener el precio por gramo, se divide el precio de la
              onza entre 31,1035.
            </p>
            <p className="text-content-2 leading-relaxed">
              Para convertir a euros, se aplica el tipo de cambio EUR/USD
              vigente. El precio en euros fluctúa tanto por el precio del
              oro como por el tipo de cambio.
            </p>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              Quilates y pureza
            </h2>
            <p className="text-content-2 leading-relaxed mb-4">
              El precio mostrado corresponde a <strong>oro puro de 24
              quilates</strong> (999 milésimas). El oro de joyería suele
              tener menor pureza:
            </p>
            <ul className="space-y-2 text-sm text-content-2">
              {[
                { k: "24K", purity: "99,9%", factor: "1.000" },
                { k: "22K", purity: "91,7%", factor: "0.917" },
                { k: "18K", purity: "75,0%", factor: "0.750" },
                { k: "14K", purity: "58,5%", factor: "0.585" },
                { k: "9K", purity: "37,5%", factor: "0.375" },
              ].map((item) => (
                <li key={item.k} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                  <span className="font-semibold text-content-0">{item.k}</span>
                  <span>{item.purity} pureza</span>
                  <span className="text-content-3">× {item.factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
