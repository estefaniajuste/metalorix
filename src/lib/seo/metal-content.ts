import type { MetalSymbol } from "@/lib/providers/metals";

export interface MetalSEO {
  slug: string;
  symbol: MetalSymbol;
  name: string;
  fullName: string;
  description: string;
  about: string;
  keywords: string[];
  facts: string[];
}

export const METAL_SEO: Record<string, MetalSEO> = {
  oro: {
    slug: "oro",
    symbol: "XAU",
    name: "Oro",
    fullName: "Oro (XAU/USD)",
    description:
      "Precio del oro hoy en tiempo real. Cotización XAU/USD actualizada, gráfico histórico, máximos, mínimos y análisis del mercado del oro.",
    about:
      "El oro es el metal precioso más negociado del mundo. Se utiliza como reserva de valor, cobertura contra la inflación y activo refugio en periodos de incertidumbre económica. Su precio se mide en dólares por onza troy (31,1 gramos).",
    keywords: [
      "precio del oro hoy",
      "cotización oro",
      "XAU/USD",
      "oro en tiempo real",
      "invertir en oro",
      "precio oro onza",
    ],
    facts: [
      "El oro cotiza las 24 horas del día, 5 días a la semana, en mercados globales como COMEX, LBMA y Shanghai Gold Exchange.",
      "Los bancos centrales poseen aproximadamente 36.000 toneladas de oro en reservas, siendo EE.UU. el mayor tenedor con más de 8.000 toneladas.",
      "La demanda de oro proviene de joyería (~50%), inversión (~25%), bancos centrales (~15%) y tecnología (~10%).",
      "El ratio oro/plata mide cuántas onzas de plata se necesitan para comprar una onza de oro. Históricamente oscila entre 40x y 90x.",
    ],
  },
  plata: {
    slug: "plata",
    symbol: "XAG",
    name: "Plata",
    fullName: "Plata (XAG/USD)",
    description:
      "Precio de la plata hoy en tiempo real. Cotización XAG/USD actualizada, gráfico histórico, máximos, mínimos y análisis del mercado de la plata.",
    about:
      "La plata es un metal precioso con un perfil dual: es tanto un activo de inversión como un metal industrial esencial. Se usa en electrónica, paneles solares, medicina y joyería. Su volatilidad es mayor que la del oro, lo que la convierte en una opción popular para traders.",
    keywords: [
      "precio de la plata hoy",
      "cotización plata",
      "XAG/USD",
      "plata en tiempo real",
      "invertir en plata",
      "precio plata onza",
    ],
    facts: [
      "La plata tiene la mayor conductividad eléctrica y térmica de todos los metales, lo que la hace indispensable en electrónica.",
      "La industria solar consume aproximadamente el 10% de la producción mundial de plata anualmente, una cifra que crece cada año.",
      "México, Perú y China son los tres mayores productores mundiales de plata.",
      "La plata es significativamente más volátil que el oro: sus movimientos diarios suelen ser 1,5-2x mayores en términos porcentuales.",
    ],
  },
  platino: {
    slug: "platino",
    symbol: "XPT",
    name: "Platino",
    fullName: "Platino (XPT/USD)",
    description:
      "Precio del platino hoy en tiempo real. Cotización XPT/USD actualizada, gráfico histórico, máximos, mínimos y análisis del mercado del platino.",
    about:
      "El platino es un metal precioso raro con un fuerte componente industrial. Se utiliza principalmente en catalizadores de automóviles, joyería, equipos médicos y en la industria química. Su precio está fuertemente ligado a la industria automotriz y a la oferta sudafricana.",
    keywords: [
      "precio del platino hoy",
      "cotización platino",
      "XPT/USD",
      "platino en tiempo real",
      "invertir en platino",
      "precio platino onza",
    ],
    facts: [
      "Sudáfrica produce aproximadamente el 70% del platino mundial, lo que hace su precio sensible a eventos geopolíticos en la región.",
      "El platino es 30 veces más raro que el oro en la corteza terrestre.",
      "La industria automotriz consume cerca del 40% de la demanda de platino para catalizadores de emisiones.",
      "Históricamente el platino cotizaba por encima del oro. La inversión del ratio (platino más barato que el oro) es un fenómeno relativamente reciente.",
    ],
  },
};

const METAL_SEO_EN: Record<string, Omit<MetalSEO, "slug" | "symbol">> = {
  oro: {
    name: "Gold",
    fullName: "Gold (XAU/USD)",
    description: "Gold price today in real time. Updated XAU/USD quote, historical chart, highs, lows and gold market analysis.",
    about: "Gold is the most traded precious metal in the world. It is used as a store of value, a hedge against inflation and a safe-haven asset during periods of economic uncertainty. Its price is measured in US dollars per troy ounce (31.1 grams).",
    keywords: ["gold price today", "gold quote", "XAU/USD", "gold real time", "invest in gold", "gold ounce price"],
    facts: [
      "Gold trades 24 hours a day, 5 days a week, on global markets such as COMEX, LBMA and Shanghai Gold Exchange.",
      "Central banks hold approximately 36,000 tonnes of gold in reserves, with the US being the largest holder at over 8,000 tonnes.",
      "Gold demand comes from jewellery (~50%), investment (~25%), central banks (~15%) and technology (~10%).",
      "The gold/silver ratio measures how many ounces of silver are needed to buy one ounce of gold. Historically it ranges between 40x and 90x.",
    ],
  },
  plata: {
    name: "Silver",
    fullName: "Silver (XAG/USD)",
    description: "Silver price today in real time. Updated XAG/USD quote, historical chart, highs, lows and silver market analysis.",
    about: "Silver is a precious metal with a dual profile: it is both an investment asset and an essential industrial metal. It is used in electronics, solar panels, medicine and jewellery. Its volatility is higher than gold, making it a popular choice for traders.",
    keywords: ["silver price today", "silver quote", "XAG/USD", "silver real time", "invest in silver", "silver ounce price"],
    facts: [
      "Silver has the highest electrical and thermal conductivity of all metals, making it indispensable in electronics.",
      "The solar industry consumes approximately 10% of the world's annual silver production, a figure that grows every year.",
      "Mexico, Peru and China are the three largest silver producers in the world.",
      "Silver is significantly more volatile than gold: its daily movements are typically 1.5-2x larger in percentage terms.",
    ],
  },
  platino: {
    name: "Platinum",
    fullName: "Platinum (XPT/USD)",
    description: "Platinum price today in real time. Updated XPT/USD quote, historical chart, highs, lows and platinum market analysis.",
    about: "Platinum is a rare precious metal with a strong industrial component. It is primarily used in automotive catalytic converters, jewellery, medical equipment and the chemical industry. Its price is strongly linked to the automotive industry and South African supply.",
    keywords: ["platinum price today", "platinum quote", "XPT/USD", "platinum real time", "invest in platinum", "platinum ounce price"],
    facts: [
      "South Africa produces approximately 70% of the world's platinum, making its price sensitive to geopolitical events in the region.",
      "Platinum is 30 times rarer than gold in the Earth's crust.",
      "The automotive industry consumes about 40% of platinum demand for catalytic converters.",
      "Historically, platinum traded above gold. The inversion of this ratio (platinum cheaper than gold) is a relatively recent phenomenon.",
    ],
  },
};

export function getMetalSEO(slug: string, locale: string = "es"): MetalSEO | null {
  const base = METAL_SEO[slug];
  if (!base) return null;
  if (locale === "es") return base;
  const en = METAL_SEO_EN[slug];
  if (!en) return base;
  return { ...base, ...en };
}
