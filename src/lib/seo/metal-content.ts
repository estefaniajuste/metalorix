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

export function getMetalSEO(slug: string): MetalSEO | null {
  return METAL_SEO[slug] ?? null;
}
