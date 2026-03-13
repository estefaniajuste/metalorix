import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Glosario de metales preciosos — Metalorix",
  description:
    "Diccionario completo de términos del mercado de metales preciosos: precio spot, onza troy, ratio oro/plata, LBMA, COMEX y más.",
  keywords: [
    "glosario metales preciosos",
    "qué es precio spot",
    "qué es onza troy",
    "ratio oro plata significado",
    "LBMA significado",
    "COMEX metales",
    "terminología trading oro",
  ],
  alternates: {
    canonical: "https://metalorix.com/glosario",
  },
};

interface Term {
  term: string;
  id: string;
  definition: string;
  related?: string[];
}

const terms: Term[] = [
  {
    term: "Precio Spot",
    id: "precio-spot",
    definition:
      "El precio actual de mercado al que se puede comprar o vender un metal precioso para entrega inmediata. Es el precio de referencia que se muestra en Metalorix y se actualiza continuamente durante las horas de mercado.",
    related: ["precio-spot-vs-futures"],
  },
  {
    term: "Onza Troy",
    id: "onza-troy",
    definition:
      "Unidad de medida estándar para metales preciosos. Equivale a 31,1035 gramos (no confundir con la onza avoirdupois de 28,35 g). Todos los precios internacionales de oro, plata y platino se cotizan por onza troy.",
  },
  {
    term: "XAU",
    id: "xau",
    definition:
      "Código ISO 4217 para el oro. La X indica que no es una moneda de un país, y AU viene del latín «aurum». XAU/USD es el par que representa el precio de una onza troy de oro en dólares estadounidenses.",
    related: ["xag", "xpt"],
  },
  {
    term: "XAG",
    id: "xag",
    definition:
      "Código ISO 4217 para la plata. AG proviene del latín «argentum». XAG/USD representa el precio de una onza troy de plata en dólares.",
    related: ["xau", "xpt"],
  },
  {
    term: "XPT",
    id: "xpt",
    definition:
      "Código ISO 4217 para el platino. PT del latín «platinum». XPT/USD representa el precio de una onza troy de platino en dólares.",
    related: ["xau", "xag"],
  },
  {
    term: "Ratio Oro/Plata",
    id: "ratio-oro-plata",
    definition:
      "Indica cuántas onzas de plata se necesitan para comprar una onza de oro. Se calcula dividiendo el precio del oro entre el precio de la plata. Un ratio alto (>70) sugiere que la plata está relativamente barata; un ratio bajo (<50) sugiere que está relativamente cara. La media histórica de los últimos 20 años es aproximadamente 65x.",
  },
  {
    term: "LBMA",
    id: "lbma",
    definition:
      "London Bullion Market Association. Organización que supervisa el mercado de metales preciosos más grande del mundo, con sede en Londres. Establece los estándares «Good Delivery» para lingotes y realiza las fijaciones de precio (fixings) de oro y plata dos veces al día.",
  },
  {
    term: "COMEX",
    id: "comex",
    definition:
      "Commodity Exchange, división de la bolsa CME Group en Nueva York. Es el principal mercado de futuros de oro y plata del mundo. Los contratos de futuros de oro en COMEX son de 100 onzas troy.",
  },
  {
    term: "Precio Spot vs Futuros",
    id: "precio-spot-vs-futures",
    definition:
      "El precio spot es para entrega inmediata; el precio de futuros es un contrato para comprar o vender a un precio acordado en una fecha futura. La diferencia entre ambos se llama «contango» (futuros más caros) o «backwardation» (futuros más baratos).",
    related: ["precio-spot"],
  },
  {
    term: "Lingote",
    id: "lingote",
    definition:
      "Pieza de metal precioso fundida en forma de barra. Los lingotes estándar de oro (Good Delivery) pesan aproximadamente 400 onzas troy (~12,4 kg). También existen lingotes más pequeños de 1 oz, 10 oz, 1 kg, etc. para inversores particulares.",
  },
  {
    term: "Bullion",
    id: "bullion",
    definition:
      "Término inglés que se refiere a metales preciosos en forma de lingotes o monedas valorados por su contenido metálico (no por su valor numismático). «Gold bullion» = oro de inversión.",
  },
  {
    term: "Premium (Prima)",
    id: "premium",
    definition:
      "Diferencia entre el precio de un producto físico (moneda, lingote) y el precio spot del metal que contiene. Incluye costes de fabricación, distribución y margen del vendedor. Las monedas suelen tener primas más altas que los lingotes.",
  },
  {
    term: "DCA (Dollar Cost Averaging)",
    id: "dca",
    definition:
      "Estrategia de inversión que consiste en comprar una cantidad fija en euros/dólares de forma periódica (mensual, semanal), independientemente del precio. Reduce el impacto de la volatilidad y el riesgo de comprar en un momento desfavorable.",
  },
  {
    term: "Activo Refugio",
    id: "activo-refugio",
    definition:
      "Inversión que se espera que mantenga o aumente su valor en periodos de incertidumbre económica o turbulencia en los mercados. El oro es el activo refugio por excelencia, junto con los bonos del tesoro y el franco suizo.",
  },
  {
    term: "Fixing",
    id: "fixing",
    definition:
      "Proceso de fijación de precio de referencia que realiza la LBMA dos veces al día (AM y PM) para el oro, y una vez al día para la plata y el platino. Estos precios se usan como referencia en contratos, ETFs y transacciones institucionales.",
    related: ["lbma"],
  },
  {
    term: "ETF de Oro",
    id: "etf-oro",
    definition:
      "Fondo cotizado en bolsa respaldado por oro físico. Permite invertir en oro sin poseerlo físicamente. El más grande es SPDR Gold Shares (GLD). Cada acción representa una fracción de una onza de oro almacenada en bóvedas.",
  },
  {
    term: "Ley (Pureza)",
    id: "ley-pureza",
    definition:
      "Proporción de metal puro en una aleación. Se expresa en milésimas: oro de 999,9 milésimas (24 quilates) es oro puro al 99,99%. Las monedas de inversión como el Krugerrand tienen 916,7 milésimas (22 quilates).",
  },
  {
    term: "Quilate",
    id: "quilate",
    definition:
      "Unidad de pureza del oro. 24 quilates = oro puro (999,9‰). 18 quilates = 75% oro. No confundir con el quilate de gemas (unidad de peso = 0,2 gramos). En joyería se usa frecuentemente oro de 18K (750‰).",
    related: ["ley-pureza"],
  },
  {
    term: "Spread (Diferencial)",
    id: "spread",
    definition:
      "Diferencia entre el precio de compra (bid) y el precio de venta (ask) de un metal precioso. Cuanto menor sea el spread, mayor es la liquidez del mercado. El oro tiene spreads más ajustados que el platino.",
  },
  {
    term: "Reservas de Oro",
    id: "reservas-oro",
    definition:
      "Cantidad de oro que poseen los bancos centrales como parte de sus reservas monetarias. EE.UU. lidera con más de 8.000 toneladas, seguido de Alemania, Italia y Francia. Los bancos centrales han sido compradores netos de oro desde 2010.",
  },
];

export default function GlosarioPage() {
  const sortedTerms = [...terms].sort((a, b) =>
    a.term.localeCompare(b.term, "es")
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glosario de Metales Preciosos",
    description:
      "Diccionario de términos del mercado de oro, plata y platino.",
    url: "https://metalorix.com/glosario",
    hasDefinedTerm: sortedTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: `https://metalorix.com/glosario#${t.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[900px] px-6">
          {/* Breadcrumb */}
          <nav
            className="text-sm text-content-3 mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-content-1 transition-colors"
            >
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">Glosario</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            Glosario de metales preciosos
          </h1>
          <p className="text-content-2 mb-10 leading-relaxed max-w-2xl">
            Diccionario con los términos más importantes del mercado de oro,
            plata y platino. Desde conceptos básicos como «onza troy» hasta
            terminología avanzada de trading.
          </p>

          {/* Quick nav */}
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-5 mb-10">
            <div className="text-xs font-semibold text-content-3 uppercase tracking-wider mb-3">
              Índice rápido
            </div>
            <div className="flex flex-wrap gap-2">
              {sortedTerms.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="text-xs text-content-2 hover:text-brand-gold px-2 py-1 bg-surface-2 rounded-xs transition-colors"
                >
                  {t.term}
                </a>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="space-y-0">
            {sortedTerms.map((t, i) => (
              <div
                key={t.id}
                id={t.id}
                className={`py-6 scroll-mt-20 ${
                  i < sortedTerms.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <h2 className="text-lg font-bold text-content-0 mb-2">
                  {t.term}
                </h2>
                <p className="text-sm text-content-1 leading-relaxed">
                  {t.definition}
                </p>
                {t.related && t.related.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-content-3 font-medium uppercase tracking-wider">
                      Relacionado:
                    </span>
                    {t.related.map((rid) => {
                      const rel = terms.find((x) => x.id === rid);
                      if (!rel) return null;
                      return (
                        <a
                          key={rid}
                          href={`#${rid}`}
                          className="text-xs text-brand-gold hover:underline"
                        >
                          {rel.term}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6 text-center">
            <h3 className="text-base font-semibold text-content-0 mb-2">
              Pon en práctica lo aprendido
            </h3>
            <p className="text-sm text-content-2 mb-4">
              Consulta los precios en tiempo real y usa nuestras herramientas
              de análisis.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all"
              >
                Ver Dashboard
              </Link>
              <Link
                href="/herramientas"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-2 text-content-0 hover:bg-surface-2/80 transition-all"
              >
                Herramientas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
