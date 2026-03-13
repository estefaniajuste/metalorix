import type { Metadata } from "next";
import Link from "next/link";
import { MetalComparator } from "@/components/tools/MetalComparator";

export const metadata: Metadata = {
  title: "Comparador Oro vs Plata vs Platino — Rendimiento histórico | Metalorix",
  description:
    "Compara el rendimiento histórico del oro, plata y platino. Gráfico interactivo con periodos de 1 mes a 10+ años. ¿Qué metal ha subido más?",
  keywords: [
    "oro vs plata",
    "comparar oro plata platino",
    "rendimiento oro vs plata",
    "gold vs silver performance",
    "mejor inversión metales preciosos",
    "comparativa metales preciosos",
  ],
  alternates: {
    canonical: "https://metalorix.com/comparador",
  },
  openGraph: {
    title: "Comparador Oro vs Plata vs Platino — Metalorix",
    description:
      "¿Qué metal ha rendido más? Compara oro, plata y platino en un gráfico interactivo.",
    type: "website",
    url: "https://metalorix.com/comparador",
  },
};

export default function ComparadorPage() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/herramientas" className="hover:text-content-1 transition-colors">
            Herramientas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">Comparador</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          Comparador: Oro vs Plata vs Platino
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          Compara el rendimiento histórico de los tres metales preciosos
          principales. Activa o desactiva cada metal, alterna entre variación
          porcentual y precio absoluto, y selecciona el periodo que prefieras.
        </p>

        <MetalComparator />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              ¿Cómo interpretar el comparador?
            </h2>
            <p className="text-content-2 text-sm leading-relaxed mb-3">
              En el modo <strong>&quot;% Variación&quot;</strong>, todos los metales parten de 0%
              al inicio del periodo seleccionado, lo que permite comparar qué metal
              ha subido o bajado más en términos relativos.
            </p>
            <p className="text-content-2 text-sm leading-relaxed">
              En el modo <strong>&quot;Precio USD&quot;</strong> se muestra el precio absoluto
              en dólares por onza troy. Dado que el oro cotiza mucho más alto que
              la plata, este modo es útil para ver la evolución individual de cada
              metal.
            </p>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              Factores que afectan a cada metal
            </h2>
            <ul className="space-y-3 text-sm text-content-2 leading-relaxed">
              {[
                { metal: "Oro", desc: "Refugio seguro, reservas de bancos centrales, inflación" },
                { metal: "Plata", desc: "Demanda industrial (solar, electrónica) + refugio" },
                { metal: "Platino", desc: "Industria automovilística (catalizadores), hidrógeno verde" },
              ].map((item) => (
                <li key={item.metal} className="flex gap-3">
                  <span className="flex-shrink-0 font-semibold text-content-0 w-16">
                    {item.metal}
                  </span>
                  <span>{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
