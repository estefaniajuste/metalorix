import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { glossaryTerms } from "@/lib/db/schema";

const SEED_TERMS = [
  {
    slug: "precio-spot",
    term: "Precio Spot",
    definition:
      "El precio actual de mercado al que se puede comprar o vender un metal precioso para entrega inmediata. Es el precio de referencia que se muestra en Metalorix y se actualiza continuamente durante las horas de mercado.",
    category: "conceptos-basicos",
    relatedSlugs: ["precio-spot-vs-futures"],
  },
  {
    slug: "onza-troy",
    term: "Onza Troy",
    definition:
      "Unidad de medida estándar para metales preciosos. Equivale a 31,1035 gramos (no confundir con la onza avoirdupois de 28,35 g). Todos los precios internacionales de oro, plata y platino se cotizan por onza troy.",
    category: "conceptos-basicos",
    relatedSlugs: [],
  },
  {
    slug: "xau",
    term: "XAU",
    definition:
      "Código ISO 4217 para el oro. La X indica que no es una moneda de un país, y AU viene del latín «aurum». XAU/USD es el par que representa el precio de una onza troy de oro en dólares estadounidenses.",
    category: "conceptos-basicos",
    relatedSlugs: ["xag", "xpt"],
  },
  {
    slug: "xag",
    term: "XAG",
    definition:
      "Código ISO 4217 para la plata. AG proviene del latín «argentum». XAG/USD representa el precio de una onza troy de plata en dólares.",
    category: "conceptos-basicos",
    relatedSlugs: ["xau", "xpt"],
  },
  {
    slug: "xpt",
    term: "XPT",
    definition:
      "Código ISO 4217 para el platino. PT del latín «platinum». XPT/USD representa el precio de una onza troy de platino en dólares.",
    category: "conceptos-basicos",
    relatedSlugs: ["xau", "xag"],
  },
  {
    slug: "ratio-oro-plata",
    term: "Ratio Oro/Plata",
    definition:
      "Indica cuántas onzas de plata se necesitan para comprar una onza de oro. Se calcula dividiendo el precio del oro entre el precio de la plata. Un ratio alto (>70) sugiere que la plata está relativamente barata; un ratio bajo (<50) sugiere que está relativamente cara. La media histórica de los últimos 20 años es aproximadamente 65x.",
    category: "analisis-tecnico",
    relatedSlugs: [],
  },
  {
    slug: "lbma",
    term: "LBMA",
    definition:
      "London Bullion Market Association. Organización que supervisa el mercado de metales preciosos más grande del mundo, con sede en Londres. Establece los estándares «Good Delivery» para lingotes y realiza las fijaciones de precio (fixings) de oro y plata dos veces al día.",
    category: "mercados-bolsas",
    relatedSlugs: ["fixing"],
  },
  {
    slug: "comex",
    term: "COMEX",
    definition:
      "Commodity Exchange, división de la bolsa CME Group en Nueva York. Es el principal mercado de futuros de oro y plata del mundo. Los contratos de futuros de oro en COMEX son de 100 onzas troy.",
    category: "mercados-bolsas",
    relatedSlugs: [],
  },
  {
    slug: "precio-spot-vs-futures",
    term: "Precio Spot vs Futuros",
    definition:
      "El precio spot es para entrega inmediata; el precio de futuros es un contrato para comprar o vender a un precio acordado en una fecha futura. La diferencia entre ambos se llama «contango» (futuros más caros) o «backwardation» (futuros más baratos).",
    category: "mercados-bolsas",
    relatedSlugs: ["precio-spot"],
  },
  {
    slug: "lingote",
    term: "Lingote",
    definition:
      "Pieza de metal precioso fundida en forma de barra. Los lingotes estándar de oro (Good Delivery) pesan aproximadamente 400 onzas troy (~12,4 kg). También existen lingotes más pequeños de 1 oz, 10 oz, 1 kg, etc. para inversores particulares.",
    category: "conceptos-basicos",
    relatedSlugs: ["bullion"],
  },
  {
    slug: "bullion",
    term: "Bullion",
    definition:
      "Término inglés que se refiere a metales preciosos en forma de lingotes o monedas valorados por su contenido metálico (no por su valor numismático). «Gold bullion» = oro de inversión.",
    category: "conceptos-basicos",
    relatedSlugs: ["lingote"],
  },
  {
    slug: "premium",
    term: "Premium (Prima)",
    definition:
      "Diferencia entre el precio de un producto físico (moneda, lingote) y el precio spot del metal que contiene. Incluye costes de fabricación, distribución y margen del vendedor. Las monedas suelen tener primas más altas que los lingotes.",
    category: "inversion",
    relatedSlugs: ["precio-spot", "lingote"],
  },
  {
    slug: "dca",
    term: "DCA (Dollar Cost Averaging)",
    definition:
      "Estrategia de inversión que consiste en comprar una cantidad fija en euros/dólares de forma periódica (mensual, semanal), independientemente del precio. Reduce el impacto de la volatilidad y el riesgo de comprar en un momento desfavorable.",
    category: "inversion",
    relatedSlugs: [],
  },
  {
    slug: "activo-refugio",
    term: "Activo Refugio",
    definition:
      "Inversión que se espera que mantenga o aumente su valor en periodos de incertidumbre económica o turbulencia en los mercados. El oro es el activo refugio por excelencia, junto con los bonos del tesoro y el franco suizo.",
    category: "macroeconomia",
    relatedSlugs: [],
  },
  {
    slug: "fixing",
    term: "Fixing",
    definition:
      "Proceso de fijación de precio de referencia que realiza la LBMA dos veces al día (AM y PM) para el oro, y una vez al día para la plata y el platino. Estos precios se usan como referencia en contratos, ETFs y transacciones institucionales.",
    category: "mercados-bolsas",
    relatedSlugs: ["lbma"],
  },
  {
    slug: "etf-oro",
    term: "ETF de Oro",
    definition:
      "Fondo cotizado en bolsa respaldado por oro físico. Permite invertir en oro sin poseerlo físicamente. El más grande es SPDR Gold Shares (GLD). Cada acción representa una fracción de una onza de oro almacenada en bóvedas.",
    category: "inversion",
    relatedSlugs: [],
  },
  {
    slug: "ley-pureza",
    term: "Ley (Pureza)",
    definition:
      "Proporción de metal puro en una aleación. Se expresa en milésimas: oro de 999,9 milésimas (24 quilates) es oro puro al 99,99%. Las monedas de inversión como el Krugerrand tienen 916,7 milésimas (22 quilates).",
    category: "conceptos-basicos",
    relatedSlugs: ["quilate"],
  },
  {
    slug: "quilate",
    term: "Quilate",
    definition:
      "Unidad de pureza del oro. 24 quilates = oro puro (999,9‰). 18 quilates = 75% oro. No confundir con el quilate de gemas (unidad de peso = 0,2 gramos). En joyería se usa frecuentemente oro de 18K (750‰).",
    category: "conceptos-basicos",
    relatedSlugs: ["ley-pureza"],
  },
  {
    slug: "spread",
    term: "Spread (Diferencial)",
    definition:
      "Diferencia entre el precio de compra (bid) y el precio de venta (ask) de un metal precioso. Cuanto menor sea el spread, mayor es la liquidez del mercado. El oro tiene spreads más ajustados que el platino.",
    category: "mercados-bolsas",
    relatedSlugs: [],
  },
  {
    slug: "reservas-oro",
    term: "Reservas de Oro",
    definition:
      "Cantidad de oro que poseen los bancos centrales como parte de sus reservas monetarias. EE.UU. lidera con más de 8.000 toneladas, seguido de Alemania, Italia y Francia. Los bancos centrales han sido compradores netos de oro desde 2010.",
    category: "macroeconomia",
    relatedSlugs: [],
  },
];

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  let inserted = 0;
  let skipped = 0;

  for (const term of SEED_TERMS) {
    try {
      await db
        .insert(glossaryTerms)
        .values({
          slug: term.slug,
          term: term.term,
          locale: "es",
          definition: term.definition,
          content: null,
          category: term.category,
          relatedSlugs: term.relatedSlugs,
          published: true,
        })
        .onConflictDoNothing();
      inserted++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({
    message: `Seed complete: ${inserted} inserted, ${skipped} skipped`,
    total: SEED_TERMS.length,
  });
}
