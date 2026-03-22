import type { MetalSymbol } from "@/lib/providers/metals";

export type ProductType = "moneda" | "lingote";
export type MetalType = "oro" | "plata";
export type LiquidityLevel = "Muy alta" | "Alta" | "Media";

export interface ProductTexts {
  name: string;
  shortName: string;
  country: string;
  purityLabel: string;
  liquidity: string;
  vatNote: string;
  idealFor: string;
  description: string;
  highlights: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Product {
  slug: string;
  name: string;
  shortName: string;
  type: ProductType;
  metal: MetalType;
  symbol: MetalSymbol;
  country: string;
  mint: string;
  year: string;
  purity: number;
  purityLabel: string;
  fineWeightOz: number;
  grossWeightG: number;
  diameter?: number;
  thickness?: number;
  premiumRange: string;
  liquidity: LiquidityLevel | string;
  investmentGold: boolean;
  vatNote: string;
  idealFor: string;
  description: string;
  highlights: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const PRODUCTS: Product[] = [
  // ─── MONEDAS DE ORO ─────────────────────────────────────
  {
    slug: "krugerrand-oro",
    name: "Krugerrand 1 oz Oro",
    shortName: "Krugerrand",
    type: "moneda",
    metal: "oro",
    symbol: "XAU",
    country: "Sudáfrica",
    mint: "South African Mint",
    year: "1967–presente",
    purity: 0.9167,
    purityLabel: "916,7 milésimas (22 quilates)",
    fineWeightOz: 1,
    grossWeightG: 33.93,
    diameter: 32.77,
    thickness: 2.84,
    premiumRange: "3–6 %",
    liquidity: "Muy alta",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (ley ≥ 900 milésimas, acuñada después de 1800, curso legal en país de origen). Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que buscan la moneda de oro más reconocida del mundo, con la máxima liquidez en el mercado secundario.",
    description:
      "El Krugerrand fue la primera moneda de oro de inversión moderna, lanzada en 1967 por Sudáfrica para promover la venta de oro sudafricano en mercados internacionales. Se convirtió rápidamente en el estándar de la industria. Su aleación de 22 quilates (con cobre) le da mayor resistencia al desgaste que las monedas de oro puro, manteniendo exactamente 1 onza troy de oro fino.",
    highlights: [
      "Primera moneda bullion de la historia — definió la categoría",
      "Contiene exactamente 1 oz de oro fino a pesar de ser aleación 22k",
      "La moneda de oro más comercializada del mundo, con más de 50 millones de unidades vendidas",
      "Su color rojizo característico proviene de la aleación con cobre",
      "Sin valor facial, su valor nominal es el precio del oro contenido",
    ],
    seo: {
      title: "Krugerrand 1 oz Oro — Ficha, precio y características",
      description:
        "Ficha completa del Krugerrand de oro 1 oz: pureza, peso fino, prima sobre spot, liquidez, fiscalidad y para qué perfil de inversor es ideal.",
      keywords: [
        "Krugerrand oro",
        "Krugerrand precio",
        "moneda oro Sudáfrica",
        "comprar Krugerrand",
        "Krugerrand 1 oz",
      ],
    },
  },
  {
    slug: "maple-leaf-oro",
    name: "Maple Leaf 1 oz Oro",
    shortName: "Maple Leaf Oro",
    type: "moneda",
    metal: "oro",
    symbol: "XAU",
    country: "Canadá",
    mint: "Royal Canadian Mint",
    year: "1979–presente",
    purity: 0.9999,
    purityLabel: "999,9 milésimas (24 quilates)",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 30,
    thickness: 2.87,
    premiumRange: "3–5 %",
    liquidity: "Muy alta",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (ley ≥ 900 milésimas, acuñada después de 1800, curso legal en país de origen). Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que priorizan la máxima pureza (oro 24k) combinada con alta liquidez global y tecnología anti-falsificación avanzada.",
    description:
      "La Maple Leaf canadiense es una de las monedas de oro de inversión más puras del mundo, con un contenido de oro de 999,9 milésimas. Fue la primera moneda bullion en alcanzar esta pureza en 1982. La Royal Canadian Mint incorpora tecnología de seguridad avanzada (micro-grabado láser, marca DNA) que la hace prácticamente imposible de falsificar.",
    highlights: [
      "Una de las monedas de mayor pureza del mercado: 999,9 milésimas (four nines)",
      "Tecnología anti-falsificación MintShield y micro-grabado láser DN",
      "Valor facial de 50 CAD (simbólico, respaldada por Canadá)",
      "Reconocida y aceptada por dealers en todo el mundo",
      "Acabado más brillante que el Krugerrand por su mayor pureza",
    ],
    seo: {
      title: "Maple Leaf 1 oz Oro — Ficha, precio y características",
      description:
        "Ficha completa de la Maple Leaf de oro 1 oz: pureza 999,9, peso, prima sobre spot, liquidez, fiscalidad y para qué inversor es ideal.",
      keywords: [
        "Maple Leaf oro",
        "Maple Leaf precio",
        "moneda oro Canadá",
        "comprar Maple Leaf",
        "Maple Leaf 1 oz oro",
      ],
    },
  },
  {
    slug: "filarmonica-oro",
    name: "Filarmónica 1 oz Oro",
    shortName: "Filarmónica Oro",
    type: "moneda",
    metal: "oro",
    symbol: "XAU",
    country: "Austria",
    mint: "Münze Österreich (Casa de la Moneda de Austria)",
    year: "1989–presente",
    purity: 0.9999,
    purityLabel: "999,9 milésimas (24 quilates)",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 37,
    thickness: 2,
    premiumRange: "3–5 %",
    liquidity: "Muy alta",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (ley ≥ 900 milésimas, acuñada después de 1800, curso legal en país de origen). Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que buscan una moneda de máxima pureza denominada en euros, con alta liquidez global y amplia aceptación internacional.",
    description:
      "La Filarmónica de Viena (Wiener Philharmoniker) es la moneda de oro de inversión más vendida en Europa y una de las más populares del mundo. Emitida por la Casa de la Moneda de Austria (una de las más antiguas del mundo, fundada en 1194), combina máxima pureza con un diseño icónico que homenajea a la Orquesta Filarmónica de Viena. Su valor facial está denominado en euros.",
    highlights: [
      "Moneda de oro de inversión más vendida en Europa y reconocida mundialmente",
      "Valor facial de 100 € — denominada en euros",
      "Diseño icónico: instrumentos de la Filarmónica de Viena",
      "Emitida por una de las casas de moneda más antiguas del mundo (1194)",
      "Exenta de IVA como oro de inversión en la UE y reconocida fiscalmente en múltiples jurisdicciones",
    ],
    seo: {
      title: "Filarmónica de Viena 1 oz Oro — Ficha, precio y características",
      description:
        "Ficha completa de la Filarmónica de Viena de oro 1 oz: pureza 999,9, peso, prima, liquidez, fiscalidad y perfil de inversor ideal.",
      keywords: [
        "Filarmónica oro",
        "Philharmoniker oro",
        "moneda oro Austria",
        "comprar Filarmónica",
        "Filarmónica Viena 1 oz",
      ],
    },
  },
  {
    slug: "britannia-oro",
    name: "Britannia 1 oz Oro",
    shortName: "Britannia Oro",
    type: "moneda",
    metal: "oro",
    symbol: "XAU",
    country: "Reino Unido",
    mint: "The Royal Mint",
    year: "1987–presente",
    purity: 0.9999,
    purityLabel: "999,9 milésimas (24 quilates, desde 2013)",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 32.69,
    thickness: 2.79,
    premiumRange: "3–6 %",
    liquidity: "Alta",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (ley ≥ 900 milésimas, acuñada después de 1800, curso legal en país de origen). Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que buscan una moneda de máxima pureza con el respaldo de The Royal Mint y buena liquidez internacional.",
    description:
      "La Britannia es la moneda de oro de inversión del Reino Unido, emitida por The Royal Mint desde 1987. Desde 2013 se acuña en oro de 999,9 milésimas (anteriormente era 916,7). Incorpora cuatro elementos de seguridad avanzados, incluyendo una imagen latente y micro-texto. Es curso legal en el Reino Unido con un valor facial de 100 GBP.",
    highlights: [
      "Emitida por The Royal Mint — una de las cecas más prestigiosas del mundo",
      "Pureza 999,9 desde 2013 (anteriormente 22k como el Krugerrand)",
      "Cuatro características de seguridad integradas en el diseño",
      "Valor facial de 100 GBP — curso legal en Reino Unido",
      "Diseño basado en la figura alegórica de Britannia, símbolo del Reino Unido",
    ],
    seo: {
      title: "Britannia 1 oz Oro — Ficha, precio y características",
      description:
        "Ficha completa de la Britannia de oro 1 oz: pureza, peso fino, prima sobre spot, liquidez, fiscalidad y perfil de inversor.",
      keywords: [
        "Britannia oro",
        "Britannia oro precio",
        "moneda oro Reino Unido",
        "comprar Britannia",
        "Britannia 1 oz oro",
      ],
    },
  },
  {
    slug: "eagle-oro",
    name: "American Eagle 1 oz Oro",
    shortName: "Eagle Oro",
    type: "moneda",
    metal: "oro",
    symbol: "XAU",
    country: "Estados Unidos",
    mint: "United States Mint",
    year: "1986–presente",
    purity: 0.9167,
    purityLabel: "916,7 milésimas (22 quilates)",
    fineWeightOz: 1,
    grossWeightG: 33.93,
    diameter: 32.7,
    thickness: 2.87,
    premiumRange: "4–7 %",
    liquidity: "Muy alta",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (ley ≥ 900 milésimas, acuñada después de 1800, curso legal en país de origen). Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que valoran la máxima liquidez global, especialmente en mercados americanos, y la garantía del gobierno de EE.UU.",
    description:
      "El American Gold Eagle es la moneda de oro de inversión oficial de los Estados Unidos, acuñada por la U.S. Mint desde 1986. Como el Krugerrand, utiliza una aleación de 22 quilates (oro, cobre y plata) que le da mayor durabilidad, pero contiene exactamente 1 onza troy de oro puro. En 2021 se rediseñó el reverso por primera vez en 35 años, mejorando las características de seguridad.",
    highlights: [
      "Moneda de oro oficial de EE.UU. — respaldada por el gobierno federal",
      "Contiene exactamente 1 oz de oro fino en aleación 22k (con plata y cobre)",
      "Valor facial de 50 USD (simbólico)",
      "Reverso rediseñado en 2021 con nuevas medidas anti-falsificación",
      "Máxima liquidez en mercados americanos e internacionales",
    ],
    seo: {
      title: "American Eagle 1 oz Oro — Ficha, precio y características",
      description:
        "Ficha completa del American Gold Eagle 1 oz: pureza, peso, prima sobre spot, liquidez, fiscalidad y para qué inversor es ideal.",
      keywords: [
        "American Eagle oro",
        "Gold Eagle precio",
        "moneda oro Estados Unidos",
        "comprar American Eagle",
        "Eagle 1 oz oro",
      ],
    },
  },

  // ─── MONEDAS DE PLATA ────────────────────────────────────
  {
    slug: "maple-leaf-plata",
    name: "Maple Leaf 1 oz Plata",
    shortName: "Maple Leaf Plata",
    type: "moneda",
    metal: "plata",
    symbol: "XAG",
    country: "Canadá",
    mint: "Royal Canadian Mint",
    year: "1988–presente",
    purity: 0.9999,
    purityLabel: "999,9 milésimas",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 38,
    thickness: 3.29,
    premiumRange: "15–30 %",
    liquidity: "Muy alta",
    investmentGold: false,
    vatNote:
      "La plata no se beneficia del régimen especial del oro de inversión en la mayoría de jurisdicciones. Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores en plata que quieren la referencia del mercado: máxima pureza, máxima liquidez y tecnología anti-falsificación.",
    description:
      "La Silver Maple Leaf es la moneda de plata de inversión más pura del mercado (999,9 milésimas) y una de las más negociadas a nivel mundial. Comparte la tecnología de seguridad de su versión de oro, incluyendo micro-grabado láser y la marca radial. Es la elección estándar para acumuladores de plata en todo el mundo.",
    highlights: [
      "La moneda de plata de mayor pureza del mercado: 999,9 milésimas",
      "Tecnología anti-falsificación MintShield de la Royal Canadian Mint",
      "Valor facial de 5 CAD — curso legal en Canadá",
      "Una de las monedas de plata más líquidas del mundo",
      "Las primas sobre spot son más altas que en oro — efecto inherente al mercado de plata",
    ],
    seo: {
      title: "Maple Leaf 1 oz Plata — Ficha, precio y características",
      description:
        "Ficha completa de la Maple Leaf de plata 1 oz: pureza 999,9, peso, prima sobre spot, liquidez, fiscalidad y perfil de inversor.",
      keywords: [
        "Maple Leaf plata",
        "Maple Leaf plata precio",
        "moneda plata Canadá",
        "comprar Maple Leaf plata",
        "Maple Leaf 1 oz plata",
      ],
    },
  },
  {
    slug: "filarmonica-plata",
    name: "Filarmónica 1 oz Plata",
    shortName: "Filarmónica Plata",
    type: "moneda",
    metal: "plata",
    symbol: "XAG",
    country: "Austria",
    mint: "Münze Österreich",
    year: "2008–presente",
    purity: 0.999,
    purityLabel: "999 milésimas",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 37,
    thickness: 3.2,
    premiumRange: "15–30 %",
    liquidity: "Muy alta",
    investmentGold: false,
    vatNote:
      "La plata no se beneficia del régimen especial del oro de inversión en la mayoría de jurisdicciones. Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que buscan acumular plata en monedas denominadas en euros, con alta liquidez en Europa y creciente aceptación internacional.",
    description:
      "La Filarmónica de Viena en plata comparte el diseño icónico de su versión de oro y es la moneda de plata más vendida en Europa, con creciente presencia en mercados internacionales. Con un valor facial de 1,50 €, es curso legal en Austria y toda la zona euro.",
    highlights: [
      "Moneda de plata más vendida en Europa y popular internacionalmente",
      "Valor facial de 1,50 € — curso legal en la eurozona",
      "Mismo diseño icónico que la versión de oro",
      "Muy líquida en mercados europeos e internacionales",
      "Disponible también en versiones de 1/25 oz (miniatura) y tubos de 20 unidades",
    ],
    seo: {
      title:
        "Filarmónica de Viena 1 oz Plata — Ficha, precio y características",
      description:
        "Ficha completa de la Filarmónica de Viena de plata 1 oz: pureza, peso, prima, liquidez, fiscalidad y perfil de inversor ideal.",
      keywords: [
        "Filarmónica plata",
        "Philharmoniker plata",
        "moneda plata Austria",
        "comprar Filarmónica plata",
        "Filarmónica Viena plata",
      ],
    },
  },
  {
    slug: "britannia-plata",
    name: "Britannia 1 oz Plata",
    shortName: "Britannia Plata",
    type: "moneda",
    metal: "plata",
    symbol: "XAG",
    country: "Reino Unido",
    mint: "The Royal Mint",
    year: "1997–presente",
    purity: 0.999,
    purityLabel: "999 milésimas",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 38.61,
    thickness: 3,
    premiumRange: "20–35 %",
    liquidity: "Alta",
    investmentGold: false,
    vatNote:
      "La plata no se beneficia del régimen especial del oro de inversión en la mayoría de jurisdicciones. Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que valoran el prestigio de The Royal Mint y buscan diversificar con una moneda de plata de alta calidad.",
    description:
      "La Silver Britannia es la moneda de plata de inversión del Reino Unido, emitida por The Royal Mint. Incorpora las mismas características de seguridad avanzadas que la versión de oro, con cuatro elementos anti-falsificación. Desde 2021, se acuña en plata de 999 milésimas (anteriormente 958).",
    highlights: [
      "Emitida por The Royal Mint con cuatro medidas de seguridad avanzadas",
      "Valor facial de 2 GBP — curso legal en el Reino Unido",
      "Pureza mejorada a 999 milésimas desde 2021",
      "Diseño de Britannia con acabado de alta calidad",
      "Primas ligeramente superiores a Maple Leaf y Filarmónica",
    ],
    seo: {
      title: "Britannia 1 oz Plata — Ficha, precio y características",
      description:
        "Ficha completa de la Britannia de plata 1 oz: pureza, peso fino, prima sobre spot, liquidez, fiscalidad y perfil de inversor.",
      keywords: [
        "Britannia plata",
        "Britannia plata precio",
        "moneda plata Reino Unido",
        "comprar Britannia plata",
        "Britannia 1 oz plata",
      ],
    },
  },
  {
    slug: "eagle-plata",
    name: "American Eagle 1 oz Plata",
    shortName: "Eagle Plata",
    type: "moneda",
    metal: "plata",
    symbol: "XAG",
    country: "Estados Unidos",
    mint: "United States Mint",
    year: "1986–presente",
    purity: 0.999,
    purityLabel: "999 milésimas",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 40.6,
    thickness: 2.98,
    premiumRange: "20–40 %",
    liquidity: "Muy alta",
    investmentGold: false,
    vatNote:
      "La plata no se beneficia del régimen especial del oro de inversión en la mayoría de jurisdicciones. Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que quieren la moneda de plata más reconocida del mundo, con máxima liquidez especialmente en mercados americanos.",
    description:
      "El American Silver Eagle es la moneda de plata de inversión más vendida del mundo. Emitida por la U.S. Mint desde 1986 con el icónico diseño de Walking Liberty, fue rediseñada en 2021 con un nuevo reverso (águila aterrizando) y mejoras de seguridad. Sus primas tienden a ser más altas que las de competidores europeos, pero su liquidez es inigualable.",
    highlights: [
      "La moneda de plata más vendida del mundo — millones de unidades al año",
      "Diseño icónico Walking Liberty (anverso) desde 1986",
      "Reverso rediseñado en 2021 con nuevas medidas anti-falsificación",
      "Valor facial de 1 USD — respaldada por el gobierno de EE.UU.",
      "Primas más altas que otros competidores internacionales, compensadas por su liquidez global",
    ],
    seo: {
      title: "American Eagle 1 oz Plata — Ficha, precio y características",
      description:
        "Ficha completa del American Silver Eagle 1 oz: pureza, peso, prima sobre spot, liquidez, fiscalidad y perfil de inversor ideal.",
      keywords: [
        "American Eagle plata",
        "Silver Eagle precio",
        "moneda plata Estados Unidos",
        "comprar Silver Eagle",
        "Eagle 1 oz plata",
      ],
    },
  },
  {
    slug: "krugerrand-plata",
    name: "Krugerrand 1 oz Plata",
    shortName: "Krugerrand Plata",
    type: "moneda",
    metal: "plata",
    symbol: "XAG",
    country: "Sudáfrica",
    mint: "South African Mint",
    year: "2017–presente",
    purity: 0.999,
    purityLabel: "999 milésimas",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    diameter: 38.7,
    thickness: 3.2,
    premiumRange: "20–35 %",
    liquidity: "Alta",
    investmentGold: false,
    vatNote:
      "La plata no se beneficia del régimen especial del oro de inversión en la mayoría de jurisdicciones. Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que ya conocen el Krugerrand de oro y quieren diversificar en plata manteniendo la misma marca reconocida.",
    description:
      "El Krugerrand de plata fue lanzado en 2017 para el 50 aniversario del Krugerrand original de oro. Mantiene el diseño icónico del springbok y Paul Kruger pero en plata de 999 milésimas. Aunque es más reciente que sus competidores, se beneficia del enorme reconocimiento de marca del Krugerrand.",
    highlights: [
      "Lanzada en 2017 para el 50 aniversario del Krugerrand de oro",
      "Mismo diseño icónico: Paul Kruger y springbok",
      "Se beneficia del reconocimiento global de la marca Krugerrand",
      "Valor facial de 1 Rand — curso legal en Sudáfrica",
      "Relativamente nueva en el mercado, con liquidez creciente",
    ],
    seo: {
      title: "Krugerrand 1 oz Plata — Ficha, precio y características",
      description:
        "Ficha completa del Krugerrand de plata 1 oz: pureza, peso fino, prima sobre spot, liquidez, fiscalidad y perfil de inversor.",
      keywords: [
        "Krugerrand plata",
        "Krugerrand plata precio",
        "moneda plata Sudáfrica",
        "comprar Krugerrand plata",
        "Krugerrand 1 oz plata",
      ],
    },
  },

  // ─── LINGOTES ────────────────────────────────────────────
  {
    slug: "lingote-oro-1oz",
    name: "Lingote de Oro 1 oz (31,1 g)",
    shortName: "Lingote Oro 1 oz",
    type: "lingote",
    metal: "oro",
    symbol: "XAU",
    country: "Varios",
    mint: "PAMP, Heraeus, Argor-Heraeus, Umicore, Valcambi",
    year: "Producción continua",
    purity: 0.9999,
    purityLabel: "999,9 milésimas",
    fineWeightOz: 1,
    grossWeightG: 31.1,
    premiumRange: "2–5 %",
    liquidity: "Muy alta",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (lingote de ley ≥ 995 milésimas). Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores que quieren la menor prima posible por onza de oro. Ideal como unidad estándar de acumulación.",
    description:
      "El lingote de oro de 1 onza troy es el formato estándar de inversión en oro físico. Fabricado por refinadoras acreditadas por la LBMA (London Bullion Market Association), ofrece las primas más bajas del mercado para cantidades de 1 oz. Los más comunes provienen de PAMP Suisse, Heraeus, Argor-Heraeus y Valcambi, y suelen venir en blíster sellado con certificado de ensayo.",
    highlights: [
      "Formato estándar de inversión — 1 onza troy (31,1 g) de oro puro",
      "Primas más bajas que las monedas para el mismo peso",
      "Fabricados por refinadoras LBMA (PAMP, Heraeus, Valcambi, etc.)",
      "Incluyen certificado de ensayo y blíster sellado de fábrica",
      "Fácil de almacenar por su forma compacta y estandarizada",
    ],
    seo: {
      title: "Lingote de Oro 1 oz — Ficha, precio y características",
      description:
        "Ficha completa del lingote de oro de 1 oz: pureza, peso, prima sobre spot, refinadoras LBMA, fiscalidad y perfil de inversor.",
      keywords: [
        "lingote oro 1 oz",
        "lingote oro precio",
        "comprar lingote oro",
        "lingote PAMP oro",
        "lingote oro inversión",
      ],
    },
  },
  {
    slug: "lingote-oro-100g",
    name: "Lingote de Oro 100 g",
    shortName: "Lingote Oro 100 g",
    type: "lingote",
    metal: "oro",
    symbol: "XAU",
    country: "Varios",
    mint: "PAMP, Heraeus, Argor-Heraeus, Umicore, Valcambi",
    year: "Producción continua",
    purity: 0.9999,
    purityLabel: "999,9 milésimas",
    fineWeightOz: 3.215,
    grossWeightG: 100,
    premiumRange: "1,5–3 %",
    liquidity: "Alta",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (lingote de ley ≥ 995 milésimas). Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores con mayor capital que buscan optimizar la prima por gramo. Buen equilibrio entre coste, liquidez y almacenamiento.",
    description:
      "El lingote de 100 gramos es un formato intermedio muy popular entre inversores serios. Ofrece una prima por gramo significativamente menor que los lingotes de 1 oz y las monedas, manteniendo una liquidez alta en el mercado secundario. Es el formato preferido por muchos inversores profesionales que buscan el equilibrio entre coste de entrada y facilidad de reventa.",
    highlights: [
      "Excelente relación prima/peso — más eficiente que 1 oz",
      "Equivale a aproximadamente 3,22 onzas troy",
      "Formato muy popular en Europa, Asia y Oriente Medio",
      "Fácil de revender en mercados secundarios internacionales",
      "Suele incluir número de serie grabado y certificado de ensayo",
    ],
    seo: {
      title: "Lingote de Oro 100 g — Ficha, precio y características",
      description:
        "Ficha completa del lingote de oro de 100 g: pureza, peso, prima sobre spot, refinadoras, fiscalidad y perfil de inversor ideal.",
      keywords: [
        "lingote oro 100g",
        "lingote oro 100 gramos precio",
        "comprar lingote oro 100g",
        "lingote oro inversión",
        "lingote PAMP 100g",
      ],
    },
  },
  {
    slug: "lingote-oro-1kg",
    name: "Lingote de Oro 1 kg",
    shortName: "Lingote Oro 1 kg",
    type: "lingote",
    metal: "oro",
    symbol: "XAU",
    country: "Varios",
    mint: "PAMP, Heraeus, Argor-Heraeus, Umicore, Valcambi",
    year: "Producción continua",
    purity: 0.9999,
    purityLabel: "999,9 milésimas",
    fineWeightOz: 32.15,
    grossWeightG: 1000,
    premiumRange: "1–2 %",
    liquidity: "Media",
    investmentGold: true,
    vatNote:
      "Clasificado como oro de inversión en la mayoría de jurisdicciones (lingote de ley ≥ 995 milésimas). Consulta la fiscalidad de tu país.",
    idealFor:
      "Grandes inversores que buscan la menor prima posible y priorizan el coste total sobre la liquidez inmediata.",
    description:
      "El lingote de oro de 1 kilogramo es el formato de gran inversión con la menor prima sobre spot. Contiene 32,15 onzas troy de oro puro y su precio suele superar los 70.000 € / ~$75.000 USD (variable según cotización). La contrapartida es una liquidez menor que los formatos más pequeños: no todos los dealers pueden absorber una venta de 1 kg inmediatamente, y el pool de compradores es más reducido.",
    highlights: [
      "Prima mínima sobre spot — el formato más eficiente en coste",
      "Contiene 32,15 onzas troy (1.000 g de oro fino)",
      "Formato institucional — también usado por bancos centrales en versión 12,4 kg (400 oz)",
      "Liquidez limitada: la venta puede requerir más tiempo que formatos pequeños",
      "Requiere custodia profesional o caja de seguridad por su alto valor",
    ],
    seo: {
      title: "Lingote de Oro 1 kg — Ficha, precio y características",
      description:
        "Ficha completa del lingote de oro de 1 kg: pureza, peso, prima sobre spot, refinadoras LBMA, fiscalidad y perfil de inversor.",
      keywords: [
        "lingote oro 1 kg",
        "lingote oro kilo precio",
        "comprar lingote oro 1kg",
        "lingote oro inversión",
        "lingote oro LBMA",
      ],
    },
  },
  {
    slug: "lingote-plata-1kg",
    name: "Lingote de Plata 1 kg",
    shortName: "Lingote Plata 1 kg",
    type: "lingote",
    metal: "plata",
    symbol: "XAG",
    country: "Varios",
    mint: "PAMP, Heraeus, Argor-Heraeus, Umicore, Valcambi",
    year: "Producción continua",
    purity: 0.999,
    purityLabel: "999 milésimas",
    fineWeightOz: 32.15,
    grossWeightG: 1000,
    premiumRange: "8–15 %",
    liquidity: "Alta",
    investmentGold: false,
    vatNote:
      "La plata no se beneficia del régimen especial del oro de inversión en la mayoría de jurisdicciones. Consulta la fiscalidad de tu país.",
    idealFor:
      "Inversores en plata que quieren minimizar la prima por onza y no les importa el peso/volumen. El formato más eficiente para acumular plata.",
    description:
      "El lingote de plata de 1 kilogramo es el formato más popular para inversión seria en plata física. Contiene 32,15 onzas troy de plata y ofrece la mejor relación prima/peso del mercado de plata (excluyendo lingotes mayores de 5 o 15 kg). El principal inconveniente es el impuesto (IVA u otros según la jurisdicción), que encarece significativamente la entrada frente al oro de inversión, que suele estar exento.",
    highlights: [
      "Formato estándar de inversión en plata — mejor prima/peso que monedas",
      "32,15 onzas troy por lingote — mucho más eficiente que comprar moneda a moneda",
      "Fabricados por refinadoras LBMA con certificado de ensayo",
      "El impuesto (IVA u otro según jurisdicción) es el principal inconveniente vs. el oro de inversión (exento en la mayoría de países)",
      "Considerar opciones de almacenamiento fiscalmente eficientes según tu país",
    ],
    seo: {
      title: "Lingote de Plata 1 kg — Ficha, precio y características",
      description:
        "Ficha completa del lingote de plata de 1 kg: pureza, peso, prima sobre spot, fiscalidad, refinadoras LBMA y perfil de inversor.",
      keywords: [
        "lingote plata 1 kg",
        "lingote plata kilo precio",
        "comprar lingote plata",
        "lingote plata inversión",
        "lingote plata LBMA",
      ],
    },
  },
];

const PRODUCTS_EN: Record<string, ProductTexts> = {
  "krugerrand-oro": {
    name: "Krugerrand 1 oz Gold",
    shortName: "Krugerrand",
    country: "South Africa",
    purityLabel: "916.7 millesimal (22 karats)",
    liquidity: "Very high",
    vatNote: "Classified as investment gold in most jurisdictions (fineness ≥ 900, minted after 1800, legal tender). Check the tax treatment in your country.",
    idealFor: "Investors seeking the world's most recognized gold coin, with maximum liquidity on the secondary market.",
    description: "The Krugerrand was the first modern investment gold coin, launched in 1967 by South Africa to promote the sale of South African gold in international markets. It quickly became the industry standard. Its 22-karat alloy (with copper) gives it greater wear resistance than pure gold coins, while maintaining exactly 1 troy ounce of fine gold.",
    highlights: [
      "First bullion coin in history — defined the category",
      "Contains exactly 1 oz of fine gold despite being a 22k alloy",
      "The world's most traded gold coin, with over 50 million units sold",
      "Its distinctive reddish colour comes from the copper alloy",
      "No face value — its nominal value is the price of its gold content",
    ],
    seo: {
      title: "Krugerrand 1 oz Gold — Profile, Price & Specs",
      description: "Complete profile of the Gold Krugerrand 1 oz: purity, fine weight, premium over spot, liquidity, tax treatment and ideal investor profile.",
      keywords: ["Krugerrand gold", "Krugerrand price", "South Africa gold coin", "buy Krugerrand", "Krugerrand 1 oz"],
    },
  },
  "maple-leaf-oro": {
    name: "Maple Leaf 1 oz Gold",
    shortName: "Maple Leaf Gold",
    country: "Canada",
    purityLabel: "999.9 millesimal (24 karats)",
    liquidity: "Very high",
    vatNote: "Classified as investment gold in most jurisdictions (fineness ≥ 900, minted after 1800, legal tender). Check the tax treatment in your country.",
    idealFor: "Investors who prioritize maximum purity (24k gold) combined with high global liquidity and advanced anti-counterfeiting technology.",
    description: "The Canadian Maple Leaf is one of the purest investment gold coins in the world, with a gold content of 999.9 millesimal fineness. It was the first bullion coin to reach this purity in 1982. The Royal Canadian Mint incorporates advanced security technology (laser micro-engraving, DNA mark) making it virtually impossible to counterfeit.",
    highlights: [
      "One of the purest coins on the market: 999.9 millesimal (four nines)",
      "MintShield anti-counterfeiting technology and laser micro-engraving",
      "Face value of 50 CAD (symbolic, backed by Canada)",
      "Recognized and accepted by dealers worldwide",
      "Brighter finish than the Krugerrand due to higher purity",
    ],
    seo: {
      title: "Maple Leaf 1 oz Gold — Profile, Price & Specs",
      description: "Complete profile of the Gold Maple Leaf 1 oz: 999.9 purity, weight, premium over spot, liquidity, tax treatment and ideal investor profile.",
      keywords: ["Maple Leaf gold", "Maple Leaf price", "Canada gold coin", "buy Maple Leaf", "Maple Leaf 1 oz gold"],
    },
  },
  "filarmonica-oro": {
    name: "Philharmonic 1 oz Gold",
    shortName: "Philharmonic Gold",
    country: "Austria",
    purityLabel: "999.9 millesimal (24 karats)",
    liquidity: "Very high",
    vatNote: "Classified as investment gold in most jurisdictions (fineness ≥ 900, minted after 1800, legal tender). Check the tax treatment in your country.",
    idealFor: "Investors seeking a maximum-purity coin denominated in euros, with high global liquidity and broad international acceptance.",
    description: "The Vienna Philharmonic (Wiener Philharmoniker) is the best-selling investment gold coin in Europe and one of the most popular worldwide. Issued by the Austrian Mint (one of the oldest in the world, founded in 1194), it combines maximum purity with an iconic design honouring the Vienna Philharmonic Orchestra. Its face value is denominated in euros.",
    highlights: [
      "Best-selling investment gold coin in Europe and recognized worldwide",
      "Face value of €100 — denominated in euros",
      "Iconic design: instruments of the Vienna Philharmonic",
      "Issued by one of the world's oldest mints (1194)",
      "VAT-exempt as investment gold in the EU and recognized in multiple jurisdictions",
    ],
    seo: {
      title: "Vienna Philharmonic 1 oz Gold — Profile, Price & Specs",
      description: "Complete profile of the Vienna Philharmonic 1 oz Gold: 999.9 purity, weight, premium, liquidity, tax treatment and ideal investor profile.",
      keywords: ["Philharmonic gold", "Philharmoniker gold", "Austria gold coin", "buy Philharmonic gold", "Vienna Philharmonic 1 oz"],
    },
  },
  "britannia-oro": {
    name: "Britannia 1 oz Gold",
    shortName: "Britannia Gold",
    country: "United Kingdom",
    purityLabel: "999.9 millesimal (24 karats, since 2013)",
    liquidity: "High",
    vatNote: "Classified as investment gold in most jurisdictions (fineness ≥ 900, minted after 1800, legal tender). Check the tax treatment in your country.",
    idealFor: "Investors seeking a maximum-purity coin backed by The Royal Mint with good international liquidity.",
    description: "The Britannia is the United Kingdom's investment gold coin, issued by The Royal Mint since 1987. Since 2013 it has been minted in 999.9 gold (previously 916.7). It incorporates four advanced security features, including a latent image and micro-text. It is legal tender in the UK with a face value of 100 GBP.",
    highlights: [
      "Issued by The Royal Mint — one of the most prestigious mints in the world",
      "999.9 purity since 2013 (previously 22k like the Krugerrand)",
      "Four security features integrated into the design",
      "Face value of 100 GBP — legal tender in the UK",
      "Design based on the allegorical figure of Britannia, symbol of the United Kingdom",
    ],
    seo: {
      title: "Britannia 1 oz Gold — Profile, Price & Specs",
      description: "Complete profile of the Britannia Gold 1 oz: purity, fine weight, premium over spot, liquidity, tax treatment and investor profile.",
      keywords: ["Britannia gold", "Britannia gold price", "UK gold coin", "buy Britannia gold", "Britannia 1 oz gold"],
    },
  },
  "eagle-oro": {
    name: "American Eagle 1 oz Gold",
    shortName: "Eagle Gold",
    country: "United States",
    purityLabel: "916.7 millesimal (22 karats)",
    liquidity: "Very high",
    vatNote: "Classified as investment gold in most jurisdictions (fineness ≥ 900, minted after 1800, legal tender). Check the tax treatment in your country.",
    idealFor: "Investors who value maximum global liquidity, especially in American markets, and the backing of the US government.",
    description: "The American Gold Eagle is the official investment gold coin of the United States, minted by the U.S. Mint since 1986. Like the Krugerrand, it uses a 22-karat alloy (gold, copper, and silver) for greater durability, but contains exactly 1 troy ounce of pure gold. In 2021, the reverse was redesigned for the first time in 35 years, improving security features.",
    highlights: [
      "Official US gold coin — backed by the federal government",
      "Contains exactly 1 oz of fine gold in a 22k alloy (with silver and copper)",
      "Face value of 50 USD (symbolic)",
      "Reverse redesigned in 2021 with new anti-counterfeiting measures",
      "Maximum liquidity in American and international markets",
    ],
    seo: {
      title: "American Eagle 1 oz Gold — Profile, Price & Specs",
      description: "Complete profile of the American Gold Eagle 1 oz: purity, weight, premium over spot, liquidity, tax treatment and ideal investor profile.",
      keywords: ["American Eagle gold", "Gold Eagle price", "US gold coin", "buy American Eagle", "Eagle 1 oz gold"],
    },
  },
  "maple-leaf-plata": {
    name: "Maple Leaf 1 oz Silver",
    shortName: "Maple Leaf Silver",
    country: "Canada",
    purityLabel: "999.9 millesimal",
    liquidity: "Very high",
    vatNote: "Silver does not benefit from the investment gold tax exemption in most jurisdictions. Check the tax treatment in your country.",
    idealFor: "Silver investors who want the market reference: maximum purity, maximum liquidity and anti-counterfeiting technology.",
    description: "The Silver Maple Leaf is the purest investment silver coin on the market (999.9 millesimal) and one of the most traded worldwide. It shares the security technology of its gold version, including laser micro-engraving and the radial mark. It is the standard choice for silver stackers around the world.",
    highlights: [
      "The purest silver coin on the market: 999.9 millesimal",
      "Royal Canadian Mint MintShield anti-counterfeiting technology",
      "Face value of 5 CAD — legal tender in Canada",
      "One of the most liquid silver coins in the world",
      "Premiums over spot are higher than for gold — inherent to the silver market",
    ],
    seo: {
      title: "Maple Leaf 1 oz Silver — Profile, Price & Specs",
      description: "Complete profile of the Silver Maple Leaf 1 oz: 999.9 purity, weight, premium over spot, liquidity, tax treatment and investor profile.",
      keywords: ["Maple Leaf silver", "Maple Leaf silver price", "Canada silver coin", "buy Maple Leaf silver", "Maple Leaf 1 oz silver"],
    },
  },
  "filarmonica-plata": {
    name: "Philharmonic 1 oz Silver",
    shortName: "Philharmonic Silver",
    country: "Austria",
    purityLabel: "999 millesimal",
    liquidity: "Very high",
    vatNote: "Silver does not benefit from the investment gold tax exemption in most jurisdictions. Check the tax treatment in your country.",
    idealFor: "Investors looking to accumulate silver in euro-denominated coins with high liquidity in Europe and growing international acceptance.",
    description: "The Vienna Philharmonic in silver shares the iconic design of its gold version and is the best-selling silver coin in Europe, with growing presence in international markets. With a face value of €1.50, it is legal tender in Austria and the entire eurozone.",
    highlights: [
      "Best-selling silver coin in Europe and popular internationally",
      "Face value of €1.50 — legal tender in the eurozone",
      "Same iconic design as the gold version",
      "Highly liquid in European and international markets",
      "Also available in 1/25 oz (miniature) versions and tubes of 20 units",
    ],
    seo: {
      title: "Vienna Philharmonic 1 oz Silver — Profile, Price & Specs",
      description: "Complete profile of the Silver Vienna Philharmonic 1 oz: purity, weight, premium, liquidity, tax treatment and ideal investor profile.",
      keywords: ["Philharmonic silver", "Philharmoniker silver", "Austria silver coin", "buy Philharmonic silver", "Vienna Philharmonic silver"],
    },
  },
  "britannia-plata": {
    name: "Britannia 1 oz Silver",
    shortName: "Britannia Silver",
    country: "United Kingdom",
    purityLabel: "999 millesimal",
    liquidity: "High",
    vatNote: "Silver does not benefit from the investment gold tax exemption in most jurisdictions. Check the tax treatment in your country.",
    idealFor: "Investors who value The Royal Mint's prestige and seek to diversify with a high-quality silver coin.",
    description: "The Silver Britannia is the United Kingdom's investment silver coin, issued by The Royal Mint. It incorporates the same advanced security features as the gold version, with four anti-counterfeiting elements. Since 2021, it has been minted in 999 millesimal silver (previously 958).",
    highlights: [
      "Issued by The Royal Mint with four advanced security measures",
      "Face value of 2 GBP — legal tender in the United Kingdom",
      "Purity improved to 999 millesimal since 2021",
      "Britannia design with high-quality finish",
      "Premiums slightly higher than Maple Leaf and Philharmonic",
    ],
    seo: {
      title: "Britannia 1 oz Silver — Profile, Price & Specs",
      description: "Complete profile of the Silver Britannia 1 oz: purity, fine weight, premium over spot, liquidity, tax treatment and investor profile.",
      keywords: ["Britannia silver", "Britannia silver price", "UK silver coin", "buy Britannia silver", "Britannia 1 oz silver"],
    },
  },
  "eagle-plata": {
    name: "American Eagle 1 oz Silver",
    shortName: "Eagle Silver",
    country: "United States",
    purityLabel: "999 millesimal",
    liquidity: "Very high",
    vatNote: "Silver does not benefit from the investment gold tax exemption in most jurisdictions. Check the tax treatment in your country.",
    idealFor: "Investors wanting the world's most recognized silver coin, with maximum liquidity especially in American markets.",
    description: "The American Silver Eagle is the world's best-selling investment silver coin. Issued by the U.S. Mint since 1986 with the iconic Walking Liberty design, it was redesigned in 2021 with a new reverse (landing eagle) and security improvements. Its premiums tend to be higher than other major competitors, but its liquidity is unmatched.",
    highlights: [
      "The world's best-selling silver coin — millions of units per year",
      "Iconic Walking Liberty design (obverse) since 1986",
      "Reverse redesigned in 2021 with new anti-counterfeiting measures",
      "Face value of 1 USD — backed by the US government",
      "Higher premiums than other major competitors, offset by unmatched global liquidity",
    ],
    seo: {
      title: "American Eagle 1 oz Silver — Profile, Price & Specs",
      description: "Complete profile of the American Silver Eagle 1 oz: purity, weight, premium over spot, liquidity, tax treatment and ideal investor profile.",
      keywords: ["American Eagle silver", "Silver Eagle price", "US silver coin", "buy Silver Eagle", "Eagle 1 oz silver"],
    },
  },
  "krugerrand-plata": {
    name: "Krugerrand 1 oz Silver",
    shortName: "Krugerrand Silver",
    country: "South Africa",
    purityLabel: "999 millesimal",
    liquidity: "High",
    vatNote: "Silver does not benefit from the investment gold tax exemption in most jurisdictions. Check the tax treatment in your country.",
    idealFor: "Investors who already know the Gold Krugerrand and want to diversify into silver while keeping the same recognized brand.",
    description: "The Silver Krugerrand was launched in 2017 for the 50th anniversary of the original Gold Krugerrand. It retains the iconic springbok and Paul Kruger design in 999 millesimal silver. Although newer than its competitors, it benefits from the enormous brand recognition of the Krugerrand.",
    highlights: [
      "Launched in 2017 for the 50th anniversary of the Gold Krugerrand",
      "Same iconic design: Paul Kruger and springbok",
      "Benefits from the global brand recognition of the Krugerrand",
      "Face value of 1 Rand — legal tender in South Africa",
      "Relatively new to the market, with growing liquidity",
    ],
    seo: {
      title: "Krugerrand 1 oz Silver — Profile, Price & Specs",
      description: "Complete profile of the Silver Krugerrand 1 oz: purity, fine weight, premium over spot, liquidity, tax treatment and investor profile.",
      keywords: ["Krugerrand silver", "Krugerrand silver price", "South Africa silver coin", "buy Krugerrand silver", "Krugerrand 1 oz silver"],
    },
  },
  "lingote-oro-1oz": {
    name: "Gold Bar 1 oz (31.1 g)",
    shortName: "Gold Bar 1 oz",
    country: "Various",
    purityLabel: "999.9 millesimal",
    liquidity: "Very high",
    vatNote: "Classified as investment gold in most jurisdictions (bar with fineness ≥ 995). Check the tax treatment in your country.",
    idealFor: "Investors seeking the lowest possible premium per ounce of gold. Ideal as a standard unit for accumulation.",
    description: "The 1 troy ounce gold bar is the standard format for physical gold investment. Manufactured by LBMA-accredited refineries (London Bullion Market Association), it offers the lowest market premiums for 1 oz quantities. The most common come from PAMP Suisse, Heraeus, Argor-Heraeus and Valcambi, and usually come in a sealed blister with an assay certificate.",
    highlights: [
      "Standard investment format — 1 troy ounce (31.1 g) of pure gold",
      "Lower premiums than coins for the same weight",
      "Manufactured by LBMA refineries (PAMP, Heraeus, Valcambi, etc.)",
      "Includes assay certificate and factory-sealed blister",
      "Easy to store due to its compact, standardized shape",
    ],
    seo: {
      title: "Gold Bar 1 oz — Profile, Price & Specs",
      description: "Complete profile of the 1 oz gold bar: purity, weight, premium over spot, LBMA refineries, tax treatment and investor profile.",
      keywords: ["gold bar 1 oz", "gold bar price", "buy gold bar", "PAMP gold bar", "gold bar investment"],
    },
  },
  "lingote-oro-100g": {
    name: "Gold Bar 100 g",
    shortName: "Gold Bar 100 g",
    country: "Various",
    purityLabel: "999.9 millesimal",
    liquidity: "High",
    vatNote: "Classified as investment gold in most jurisdictions (bar with fineness ≥ 995). Check the tax treatment in your country.",
    idealFor: "Investors with higher capital seeking to optimize the premium per gram. Good balance between cost, liquidity and storage.",
    description: "The 100 gram gold bar is a very popular intermediate format among serious investors. It offers a significantly lower premium per gram than 1 oz bars and coins, while maintaining high liquidity in the secondary market. It is the preferred format for many professional investors seeking the balance between entry cost and ease of resale.",
    highlights: [
      "Excellent premium-to-weight ratio — more efficient than 1 oz",
      "Equivalent to approximately 3.22 troy ounces",
      "Very popular format in Europe, Asia and the Middle East",
      "Easy to resell on international secondary markets",
      "Usually includes engraved serial number and assay certificate",
    ],
    seo: {
      title: "Gold Bar 100 g — Profile, Price & Specs",
      description: "Complete profile of the 100 g gold bar: purity, weight, premium over spot, refineries, tax treatment and ideal investor profile.",
      keywords: ["gold bar 100g", "gold bar 100 grams price", "buy gold bar 100g", "gold bar investment", "PAMP 100g"],
    },
  },
  "lingote-oro-1kg": {
    name: "Gold Bar 1 kg",
    shortName: "Gold Bar 1 kg",
    country: "Various",
    purityLabel: "999.9 millesimal",
    liquidity: "Medium",
    vatNote: "Classified as investment gold in most jurisdictions (bar with fineness ≥ 995). Check the tax treatment in your country.",
    idealFor: "Large investors seeking the lowest possible premium who prioritize total cost over immediate liquidity.",
    description: "The 1 kilogram gold bar is the large investment format with the lowest premium over spot. It contains 32.15 troy ounces of pure gold and its price usually exceeds €70,000 / ~$75,000 USD (variable depending on the spot price). The trade-off is lower liquidity than smaller formats: not all dealers can absorb a 1 kg sale immediately, and the buyer pool is smaller.",
    highlights: [
      "Minimum premium over spot — the most cost-efficient format",
      "Contains 32.15 troy ounces (1,000 g of fine gold)",
      "Institutional format — also used by central banks in the 12.4 kg (400 oz) version",
      "Limited liquidity: selling may take longer than smaller formats",
      "Requires professional storage or safe deposit box due to its high value",
    ],
    seo: {
      title: "Gold Bar 1 kg — Profile, Price & Specs",
      description: "Complete profile of the 1 kg gold bar: purity, weight, premium over spot, LBMA refineries, tax treatment and investor profile.",
      keywords: ["gold bar 1 kg", "gold bar kilo price", "buy gold bar 1kg", "gold bar investment", "gold bar LBMA"],
    },
  },
  "lingote-plata-1kg": {
    name: "Silver Bar 1 kg",
    shortName: "Silver Bar 1 kg",
    country: "Various",
    purityLabel: "999 millesimal",
    liquidity: "High",
    vatNote: "Silver does not benefit from the investment gold tax exemption in most jurisdictions. Check the tax treatment in your country.",
    idealFor: "Silver investors looking to minimize the premium per ounce who don't mind weight/volume. The most efficient format for accumulating silver.",
    description: "The 1 kilogram silver bar is the most popular format for serious physical silver investment. It contains 32.15 troy ounces of silver and offers the best premium-to-weight ratio in the silver market (excluding larger 5 or 15 kg bars). The main drawback is VAT or sales tax, which significantly increases the entry cost in many countries (especially in the EU and UK). Many investors buy from dealers in tax-advantaged jurisdictions or use bonded storage to optimize taxation.",
    highlights: [
      "Standard silver investment format — better premium-to-weight ratio than coins",
      "32.15 troy ounces per bar — much more efficient than buying coin by coin",
      "Manufactured by LBMA refineries with assay certificate",
      "VAT is the main disadvantage vs. gold (which is exempt)",
      "Consider tax-efficient storage options available in your jurisdiction",
    ],
    seo: {
      title: "Silver Bar 1 kg — Profile, Price & Specs",
      description: "Complete profile of the 1 kg silver bar: purity, weight, premium over spot, tax treatment, LBMA refineries and investor profile.",
      keywords: ["silver bar 1 kg", "silver bar kilo price", "buy silver bar", "silver bar investment", "silver bar LBMA"],
    },
  },
};

const PRODUCTS_AR: Record<string, ProductTexts> = {
  "krugerrand-oro": {
    name: "كروغراند 1 أونصة ذهب",
    shortName: "كروغراند",
    country: "جنوب أفريقيا",
    purityLabel: "916,7 جزء من الألف (22 قيراط)",
    liquidity: "عالية جداً",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (عيار ≥ 900، مسكوك بعد 1800، عملة قانونية). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الباحثون عن أشهر عملة ذهبية في العالم، مع أقصى سيولة في السوق الثانوية.",
    description:
      "كان الكروغراند أول عملة ذهبية استثمارية حديثة، أُطلقت عام 1967 من جنوب أفريقيا لتعزيز بيع الذهب في الأسواق الدولية. أصبحت بسرعة المعيار في الصناعة. سبيكتها من 22 قيراطاً (مع النحاس) تمنحها مقاومة أكبر للتآكل مقارنة بعملات الذهب الخالص، مع الحفاظ على أونصة تروي واحدة بالضبط من الذهب الخالص.",
    highlights: [
      "أول عملة سبائك في التاريخ — أسست هذه الفئة",
      "تحتوي على 1 أونصة بالضبط من الذهب الخالص رغم كونها سبيكة 22 قيراط",
      "أكثر عملة ذهبية تداولاً في العالم، مع أكثر من 50 مليون وحدة مباعة",
      "لونها المحمر المميز يأتي من سبيكة النحاس",
      "بدون قيمة اسمية — قيمتها الاسمية هي سعر الذهب المحتوى",
    ],
    seo: {
      title: "كروغراند 1 أونصة ذهب — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة كروغراند الذهبية 1 أونصة: النقاء، الوزن الصافي، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر المثالي.",
      keywords: ["كروغراند ذهب", "سعر كروغراند", "عملة ذهب جنوب أفريقيا", "شراء كروغراند", "كروغراند 1 أونصة"],
    },
  },
  "maple-leaf-oro": {
    name: "مابل ليف 1 أونصة ذهب",
    shortName: "مابل ليف ذهب",
    country: "كندا",
    purityLabel: "999,9 جزء من الألف (24 قيراط)",
    liquidity: "عالية جداً",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (عيار ≥ 900، مسكوك بعد 1800، عملة قانونية). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الذين يعطون الأولوية لأقصى نقاء (ذهب 24 قيراط) مع سيولة عالمية عالية وتقنية متقدمة لمكافحة التزييف.",
    description:
      "تعد عملة مابل ليف الكندية من أنقى عملات الذهب الاستثمارية في العالم، بمحتوى ذهب 999,9 جزء من الألف. كانت أول عملة سبائك تصل إلى هذا النقاء عام 1982. تدمج دار السك الملكية الكندية تقنية أمان متقدمة (نقش ليزري دقيق، علامة DNA) مما يجعلها شبه مستحيلة التزييف.",
    highlights: [
      "من أنقى العملات في السوق: 999,9 جزء من الألف (أربع تسعات)",
      "تقنية MintShield لمكافحة التزييف والنقش الليزري الدقيق",
      "قيمة اسمية 50 دولار كندي (رمزية، مدعومة من كندا)",
      "معترف بها ومقبولة من التجار حول العالم",
      "لمعان أكثر من الكروغراند بسبب النقاء الأعلى",
    ],
    seo: {
      title: "مابل ليف 1 أونصة ذهب — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة مابل ليف الذهبية 1 أونصة: نقاء 999,9، الوزن، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر المثالي.",
      keywords: ["مابل ليف ذهب", "سعر مابل ليف", "عملة ذهب كندا", "شراء مابل ليف", "مابل ليف 1 أونصة ذهب"],
    },
  },
  "filarmonica-oro": {
    name: "الفيلهارموني 1 أونصة ذهب",
    shortName: "الفيلهارموني ذهب",
    country: "النمسا",
    purityLabel: "999,9 جزء من الألف (24 قيراط)",
    liquidity: "عالية جداً",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (عيار ≥ 900، مسكوك بعد 1800، عملة قانونية). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الباحثون عن عملة بأقصى نقاء مقومة باليورو، مع سيولة عالمية عالية وقبول دولي واسع.",
    description:
      "الفيلهارموني فيينا (Wiener Philharmoniker) هي عملة الذهب الاستثمارية الأكثر مبيعاً في أوروبا ومن الأكثر شعبية عالمياً. صادرة عن دار السك النمساوية (من أقدم الدور في العالم، تأسست عام 1194)، تجمع بين أقصى نقاء وتصميم أيقوني يكرّم أوركسترا فيينا الفيلهارمونية. قيمتها الاسمية مقومة باليورو.",
    highlights: [
      "عملة الذهب الاستثمارية الأكثر مبيعاً في أوروبا ومعترف بها عالمياً",
      "قيمة اسمية 100 يورو — مقومة باليورو",
      "تصميم أيقوني: آلات أوركسترا فيينا الفيلهارمونية",
      "صادرة عن واحدة من أقدم دور السك في العالم (1194)",
      "معفاة من ضريبة القيمة المضافة كذهب استثماري في الاتحاد الأوروبي ومعترف بها في ولايات قضائية متعددة",
    ],
    seo: {
      title: "فيلهارموني فيينا 1 أونصة ذهب — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة فيلهارموني فيينا الذهبية 1 أونصة: نقاء 999,9، الوزن، العلاوة، السيولة، المعاملة الضريبية وملف المستثمر المثالي.",
      keywords: ["فيلهارموني ذهب", "فيلهارمونيكر ذهب", "عملة ذهب النمسا", "شراء فيلهارموني", "فيلهارموني فيينا 1 أونصة"],
    },
  },
  "britannia-oro": {
    name: "بريتانيا 1 أونصة ذهب",
    shortName: "بريتانيا ذهب",
    country: "المملكة المتحدة",
    purityLabel: "999,9 جزء من الألف (24 قيراط، منذ 2013)",
    liquidity: "عالية",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (عيار ≥ 900، مسكوك بعد 1800، عملة قانونية). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الباحثون عن عملة بأقصى نقاء مدعومة من The Royal Mint مع سيولة دولية جيدة.",
    description:
      "بريتانيا هي عملة الذهب الاستثمارية للمملكة المتحدة، صادرة عن The Royal Mint منذ 1987. منذ 2013 تُسك بذهب 999,9 (سابقاً 916,7). تتضمن أربع ميزات أمان متقدمة، بما في ذلك صورة كامنة ونص مجهري. هي عملة قانونية في المملكة المتحدة بقيمة اسمية 100 جنيه إسترليني.",
    highlights: [
      "صادرة عن The Royal Mint — واحدة من أعرق دور السك في العالم",
      "نقاء 999,9 منذ 2013 (سابقاً 22 قيراط مثل الكروغراند)",
      "أربع ميزات أمان مدمجة في التصميم",
      "قيمة اسمية 100 جنيه إسترليني — عملة قانونية في المملكة المتحدة",
      "تصميم مبني على الشخصية الرمزية بريتانيا، رمز المملكة المتحدة",
    ],
    seo: {
      title: "بريتانيا 1 أونصة ذهب — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة بريتانيا الذهبية 1 أونصة: النقاء، الوزن الصافي، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر.",
      keywords: ["بريتانيا ذهب", "سعر بريتانيا ذهب", "عملة ذهب المملكة المتحدة", "شراء بريتانيا", "بريتانيا 1 أونصة ذهب"],
    },
  },
  "eagle-oro": {
    name: "أمريكان إيغل 1 أونصة ذهب",
    shortName: "إيغل ذهب",
    country: "الولايات المتحدة",
    purityLabel: "916,7 جزء من الألف (22 قيراط)",
    liquidity: "عالية جداً",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (عيار ≥ 900، مسكوك بعد 1800، عملة قانونية). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الذين يقدّرون أقصى سيولة عالمية، خاصة في الأسواق الأمريكية، وضمان الحكومة الأمريكية.",
    description:
      "أمريكان غولد إيغل هي عملة الذهب الاستثمارية الرسمية للولايات المتحدة، تسكها U.S. Mint منذ 1986. مثل الكروغراند، تستخدم سبيكة 22 قيراط (ذهب ونحاس وفضة) لمتانة أكبر، لكنها تحتوي على أونصة تروي واحدة بالضبط من الذهب الخالص. في 2021 أُعيد تصميم الوجه الخلفي لأول مرة منذ 35 عاماً مع تحسين ميزات الأمان.",
    highlights: [
      "عملة الذهب الرسمية للولايات المتحدة — مدعومة من الحكومة الفيدرالية",
      "تحتوي على 1 أونصة بالضبط من الذهب الخالص في سبيكة 22 قيراط (مع فضة ونحاس)",
      "قيمة اسمية 50 دولار أمريكي (رمزية)",
      "أُعيد تصميم الوجه الخلفي في 2021 مع إجراءات جديدة لمكافحة التزييف",
      "أقصى سيولة في الأسواق الأمريكية والدولية",
    ],
    seo: {
      title: "أمريكان إيغل 1 أونصة ذهب — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة أمريكان غولد إيغل 1 أونصة: النقاء، الوزن، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر المثالي.",
      keywords: ["أمريكان إيغل ذهب", "غولد إيغل سعر", "عملة ذهب الولايات المتحدة", "شراء أمريكان إيغل", "إيغل 1 أونصة ذهب"],
    },
  },
  "maple-leaf-plata": {
    name: "مابل ليف 1 أونصة فضة",
    shortName: "مابل ليف فضة",
    country: "كندا",
    purityLabel: "999,9 جزء من الألف",
    liquidity: "عالية جداً",
    vatNote:
      "الفضة لا تستفيد من نظام الإعفاء الضريبي للذهب الاستثماري في معظم الولايات القضائية. تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "مستثمرو الفضة الذين يريدون المرجع في السوق: أقصى نقاء، أقصى سيولة وتقنية مكافحة التزييف.",
    description:
      "مابل ليف الفضية هي أنقى عملة فضة استثمارية في السوق (999,9 جزء من الألف) ومن الأكثر تداولاً عالمياً. تشارك تقنية الأمان مع نسختها الذهبية، بما في ذلك النقش الليزري الدقيق والعلامة الشعاعية. هي الخيار المعياري لمجمّعي الفضة حول العالم.",
    highlights: [
      "أنقى عملة فضة في السوق: 999,9 جزء من الألف",
      "تقنية MintShield لمكافحة التزييف من دار السك الملكية الكندية",
      "قيمة اسمية 5 دولارات كندية — عملة قانونية في كندا",
      "من أكثر عملات الفضة سيولة في العالم",
      "العلاوات فوق السعر الفوري أعلى من الذهب — سمة متأصلة في سوق الفضة",
    ],
    seo: {
      title: "مابل ليف 1 أونصة فضة — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة مابل ليف الفضية 1 أونصة: نقاء 999,9، الوزن، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر.",
      keywords: ["مابل ليف فضة", "سعر مابل ليف فضة", "عملة فضة كندا", "شراء مابل ليف فضة", "مابل ليف 1 أونصة فضة"],
    },
  },
  "filarmonica-plata": {
    name: "الفيلهارموني 1 أونصة فضة",
    shortName: "الفيلهارموني فضة",
    country: "النمسا",
    purityLabel: "999 جزء من الألف",
    liquidity: "عالية جداً",
    vatNote:
      "الفضة لا تستفيد من نظام الإعفاء الضريبي للذهب الاستثماري في معظم الولايات القضائية. تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الباحثون عن تجميع الفضة في عملات مقومة باليورو مع سيولة عالية في أوروبا وقبول دولي متزايد.",
    description:
      "الفيلهارموني فيينا الفضية تشارك التصميم الأيقوني مع نسختها الذهبية وهي عملة الفضة الأكثر مبيعاً في أوروبا، مع حضور متزايد في الأسواق الدولية. بقيمة اسمية 1,50 يورو، هي عملة قانونية في النمسا ومنطقة اليورو بأكملها.",
    highlights: [
      "عملة الفضة الأكثر مبيعاً في أوروبا وشعبية دولياً",
      "قيمة اسمية 1,50 يورو — عملة قانونية في منطقة اليورو",
      "نفس التصميم الأيقوني للنسخة الذهبية",
      "سيولة عالية جداً في الأسواق الأوروبية والدولية",
      "متوفرة أيضاً بنسخ 1/25 أونصة (مصغرة) وأنابيب من 20 وحدة",
    ],
    seo: {
      title: "فيلهارموني فيينا 1 أونصة فضة — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة فيلهارموني فيينا الفضية 1 أونصة: النقاء، الوزن، العلاوة، السيولة، المعاملة الضريبية وملف المستثمر المثالي.",
      keywords: ["فيلهارموني فضة", "فيلهارمونيكر فضة", "عملة فضة النمسا", "شراء فيلهارموني فضة", "فيلهارموني فيينا فضة"],
    },
  },
  "britannia-plata": {
    name: "بريتانيا 1 أونصة فضة",
    shortName: "بريتانيا فضة",
    country: "المملكة المتحدة",
    purityLabel: "999 جزء من الألف",
    liquidity: "عالية",
    vatNote:
      "الفضة لا تستفيد من نظام الإعفاء الضريبي للذهب الاستثماري في معظم الولايات القضائية. تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الذين يقدّرون مكانة The Royal Mint ويسعون للتنويع بعملة فضة عالية الجودة.",
    description:
      "بريتانيا الفضية هي عملة الفضة الاستثمارية للمملكة المتحدة، صادرة عن The Royal Mint. تتضمن نفس ميزات الأمان المتقدمة للنسخة الذهبية، مع أربعة عناصر لمكافحة التزييف. منذ 2021 تُسك بفضة 999 جزء من الألف (سابقاً 958).",
    highlights: [
      "صادرة عن The Royal Mint مع أربع إجراءات أمان متقدمة",
      "قيمة اسمية 2 جنيه إسترليني — عملة قانونية في المملكة المتحدة",
      "تحسّن النقاء إلى 999 جزء من الألف منذ 2021",
      "تصميم بريتانيا بتشطيب عالي الجودة",
      "علاوات أعلى قليلاً من مابل ليف والفيلهارموني",
    ],
    seo: {
      title: "بريتانيا 1 أونصة فضة — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة بريتانيا الفضية 1 أونصة: النقاء، الوزن الصافي، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر.",
      keywords: ["بريتانيا فضة", "سعر بريتانيا فضة", "عملة فضة المملكة المتحدة", "شراء بريتانيا فضة", "بريتانيا 1 أونصة فضة"],
    },
  },
  "eagle-plata": {
    name: "أمريكان إيغل 1 أونصة فضة",
    shortName: "إيغل فضة",
    country: "الولايات المتحدة",
    purityLabel: "999 جزء من الألف",
    liquidity: "عالية جداً",
    vatNote:
      "الفضة لا تستفيد من نظام الإعفاء الضريبي للذهب الاستثماري في معظم الولايات القضائية. تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الذين يريدون أشهر عملة فضة في العالم، مع أقصى سيولة خاصة في الأسواق الأمريكية.",
    description:
      "أمريكان سيلفر إيغل هي عملة الفضة الاستثمارية الأكثر مبيعاً في العالم. صادرة عن U.S. Mint منذ 1986 بتصميم Walking Liberty الأيقوني، أُعيد تصميمها في 2021 بوجه خلفي جديد (نسر يهبط) وتحسينات أمنية. علاواتها تميل لأن تكون أعلى من المنافسين لكن سيولتها لا تُضاهى.",
    highlights: [
      "عملة الفضة الأكثر مبيعاً في العالم — ملايين الوحدات سنوياً",
      "تصميم Walking Liberty الأيقوني (الوجه الأمامي) منذ 1986",
      "أُعيد تصميم الوجه الخلفي في 2021 مع إجراءات جديدة لمكافحة التزييف",
      "قيمة اسمية 1 دولار أمريكي — مدعومة من حكومة الولايات المتحدة",
      "علاوات أعلى من المنافسين الدوليين الآخرين، يعوضها السيولة العالمية الفائقة",
    ],
    seo: {
      title: "أمريكان إيغل 1 أونصة فضة — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة أمريكان سيلفر إيغل 1 أونصة: النقاء، الوزن، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر المثالي.",
      keywords: ["أمريكان إيغل فضة", "سيلفر إيغل سعر", "عملة فضة الولايات المتحدة", "شراء سيلفر إيغل", "إيغل 1 أونصة فضة"],
    },
  },
  "krugerrand-plata": {
    name: "كروغراند 1 أونصة فضة",
    shortName: "كروغراند فضة",
    country: "جنوب أفريقيا",
    purityLabel: "999 جزء من الألف",
    liquidity: "عالية",
    vatNote:
      "الفضة لا تستفيد من نظام الإعفاء الضريبي للذهب الاستثماري في معظم الولايات القضائية. تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الذين يعرفون كروغراند الذهبي ويريدون التنويع في الفضة مع الحفاظ على نفس العلامة التجارية المعروفة.",
    description:
      "أُطلق كروغراند الفضي عام 2017 بمناسبة الذكرى الخمسين لعملة كروغراند الذهبية الأصلية. يحتفظ بالتصميم الأيقوني للظبي القافز وبول كروغر لكن بفضة 999 جزء من الألف. رغم أنه أحدث من منافسيه، يستفيد من الشهرة الهائلة لعلامة كروغراند.",
    highlights: [
      "أُطلق في 2017 بمناسبة الذكرى الخمسين لكروغراند الذهبي",
      "نفس التصميم الأيقوني: بول كروغر والظبي القافز",
      "يستفيد من الشهرة العالمية لعلامة كروغراند",
      "قيمة اسمية 1 راند — عملة قانونية في جنوب أفريقيا",
      "جديدة نسبياً في السوق، مع سيولة متزايدة",
    ],
    seo: {
      title: "كروغراند 1 أونصة فضة — الملف والسعر والمواصفات",
      description:
        "ملف كامل لعملة كروغراند الفضية 1 أونصة: النقاء، الوزن الصافي، العلاوة فوق السعر الفوري، السيولة، المعاملة الضريبية وملف المستثمر.",
      keywords: ["كروغراند فضة", "سعر كروغراند فضة", "عملة فضة جنوب أفريقيا", "شراء كروغراند فضة", "كروغراند 1 أونصة فضة"],
    },
  },
  "lingote-oro-1oz": {
    name: "سبيكة ذهب 1 أونصة (31,1 غ)",
    shortName: "سبيكة ذهب 1 أونصة",
    country: "متعدد",
    purityLabel: "999,9 جزء من الألف",
    liquidity: "عالية جداً",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (سبيكة بعيار ≥ 995). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الباحثون عن أقل علاوة ممكنة لكل أونصة ذهب. مثالية كوحدة معيارية للتجميع.",
    description:
      "سبيكة الذهب بوزن أونصة تروي واحدة هي الشكل المعياري للاستثمار في الذهب المادي. تصنعها مصافٍ معتمدة من LBMA (جمعية سوق لندن للسبائك)، وتقدم أقل العلاوات في السوق لكميات 1 أونصة. أشهرها من PAMP Suisse وHeraeus وArgor-Heraeus وValcambi، وعادة تأتي في غلاف محكم مع شهادة فحص.",
    highlights: [
      "الشكل المعياري للاستثمار — أونصة تروي واحدة (31,1 غ) من الذهب الخالص",
      "علاوات أقل من العملات لنفس الوزن",
      "مصنوعة من مصافٍ معتمدة من LBMA (PAMP، Heraeus، Valcambi، إلخ)",
      "تتضمن شهادة فحص وغلاف مختوم من المصنع",
      "سهلة التخزين بفضل شكلها المدمج والموحد",
    ],
    seo: {
      title: "سبيكة ذهب 1 أونصة — الملف والسعر والمواصفات",
      description:
        "ملف كامل لسبيكة الذهب 1 أونصة: النقاء، الوزن، العلاوة فوق السعر الفوري، مصافي LBMA، المعاملة الضريبية وملف المستثمر.",
      keywords: ["سبيكة ذهب 1 أونصة", "سعر سبيكة ذهب", "شراء سبيكة ذهب", "سبيكة PAMP ذهب", "سبيكة ذهب استثمارية"],
    },
  },
  "lingote-oro-100g": {
    name: "سبيكة ذهب 100 غ",
    shortName: "سبيكة ذهب 100 غ",
    country: "متعدد",
    purityLabel: "999,9 جزء من الألف",
    liquidity: "عالية",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (سبيكة بعيار ≥ 995). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون ذوو رأس المال الأكبر الباحثون عن تحسين العلاوة لكل غرام. توازن جيد بين التكلفة والسيولة والتخزين.",
    description:
      "سبيكة الذهب 100 غرام هي شكل وسيط شائع جداً بين المستثمرين الجادين. تقدم علاوة لكل غرام أقل بكثير من سبائك 1 أونصة والعملات، مع الحفاظ على سيولة عالية في السوق الثانوية. هي الشكل المفضل لكثير من المستثمرين المحترفين الباحثين عن التوازن بين تكلفة الدخول وسهولة إعادة البيع.",
    highlights: [
      "نسبة ممتازة بين العلاوة والوزن — أكثر كفاءة من 1 أونصة",
      "تعادل تقريباً 3,22 أونصة تروي",
      "شكل شائع جداً في أوروبا وآسيا والشرق الأوسط",
      "سهلة إعادة البيع في الأسواق الثانوية الدولية",
      "عادة تتضمن رقم تسلسلي محفور وشهادة فحص",
    ],
    seo: {
      title: "سبيكة ذهب 100 غ — الملف والسعر والمواصفات",
      description:
        "ملف كامل لسبيكة الذهب 100 غ: النقاء، الوزن، العلاوة فوق السعر الفوري، المصافي، المعاملة الضريبية وملف المستثمر المثالي.",
      keywords: ["سبيكة ذهب 100 غ", "سعر سبيكة ذهب 100 غرام", "شراء سبيكة ذهب 100 غ", "سبيكة ذهب استثمارية", "سبيكة PAMP 100 غ"],
    },
  },
  "lingote-oro-1kg": {
    name: "سبيكة ذهب 1 كغ",
    shortName: "سبيكة ذهب 1 كغ",
    country: "متعدد",
    purityLabel: "999,9 جزء من الألف",
    liquidity: "متوسطة",
    vatNote:
      "مصنّف كذهب استثماري في معظم الولايات القضائية (سبيكة بعيار ≥ 995). تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "المستثمرون الكبار الباحثون عن أقل علاوة ممكنة والذين يعطون الأولوية للتكلفة الإجمالية على السيولة الفورية.",
    description:
      "سبيكة الذهب 1 كيلوغرام هي شكل الاستثمار الكبير بأقل علاوة فوق السعر الفوري. تحتوي على 32,15 أونصة تروي من الذهب الخالص وسعرها يتجاوز عادة 70.000 يورو / ~75.000 دولار أمريكي (متغير حسب السعر الفوري). المقابل هو سيولة أقل من الأشكال الأصغر: ليس كل التجار يستطيعون استيعاب بيع 1 كغ فوراً، ومجمع المشترين أصغر.",
    highlights: [
      "أقل علاوة فوق السعر الفوري — الشكل الأكثر كفاءة من حيث التكلفة",
      "تحتوي على 32,15 أونصة تروي (1.000 غ من الذهب الخالص)",
      "شكل مؤسسي — تستخدمه أيضاً البنوك المركزية بنسخة 12,4 كغ (400 أونصة)",
      "سيولة محدودة: البيع قد يستغرق وقتاً أطول من الأشكال الأصغر",
      "تتطلب تخزيناً احترافياً أو صندوق أمانات بسبب قيمتها العالية",
    ],
    seo: {
      title: "سبيكة ذهب 1 كغ — الملف والسعر والمواصفات",
      description:
        "ملف كامل لسبيكة الذهب 1 كغ: النقاء، الوزن، العلاوة فوق السعر الفوري، مصافي LBMA، المعاملة الضريبية وملف المستثمر.",
      keywords: ["سبيكة ذهب 1 كغ", "سعر سبيكة ذهب كيلو", "شراء سبيكة ذهب 1 كغ", "سبيكة ذهب استثمارية", "سبيكة ذهب LBMA"],
    },
  },
  "lingote-plata-1kg": {
    name: "سبيكة فضة 1 كغ",
    shortName: "سبيكة فضة 1 كغ",
    country: "متعدد",
    purityLabel: "999 جزء من الألف",
    liquidity: "عالية",
    vatNote:
      "الفضة لا تستفيد من نظام الإعفاء الضريبي للذهب الاستثماري في معظم الولايات القضائية. تحقق من المعاملة الضريبية في بلدك.",
    idealFor:
      "مستثمرو الفضة الباحثون عن تقليل العلاوة لكل أونصة ولا يمانعون الوزن/الحجم. الشكل الأكثر كفاءة لتجميع الفضة.",
    description:
      "سبيكة الفضة 1 كيلوغرام هي الشكل الأكثر شعبية للاستثمار الجاد في الفضة المادية. تحتوي على 32,15 أونصة تروي من الفضة وتقدم أفضل نسبة علاوة/وزن في سوق الفضة (باستثناء السبائك الأكبر 5 أو 15 كغ). العائق الرئيسي هو الضريبة (ضريبة القيمة المضافة أو غيرها حسب الولاية القضائية)، التي ترفع تكلفة الدخول بشكل ملحوظ مقارنة بالذهب الاستثماري المعفى عادة.",
    highlights: [
      "الشكل المعياري للاستثمار في الفضة — نسبة علاوة/وزن أفضل من العملات",
      "32,15 أونصة تروي لكل سبيكة — أكثر كفاءة بكثير من الشراء عملة بعملة",
      "مصنوعة من مصافٍ معتمدة من LBMA مع شهادة فحص",
      "ضريبة القيمة المضافة هي العائق الرئيسي مقارنة بالذهب (المعفى عادة)",
      "يُنصح بالنظر في خيارات التخزين ذات الكفاءة الضريبية المتاحة في ولايتك القضائية",
    ],
    seo: {
      title: "سبيكة فضة 1 كغ — الملف والسعر والمواصفات",
      description:
        "ملف كامل لسبيكة الفضة 1 كغ: النقاء، الوزن، العلاوة فوق السعر الفوري، المعاملة الضريبية، مصافي LBMA وملف المستثمر.",
      keywords: ["سبيكة فضة 1 كغ", "سعر سبيكة فضة كيلو", "شراء سبيكة فضة", "سبيكة فضة استثمارية", "سبيكة فضة LBMA"],
    },
  },
};

const PRODUCTS_DE: Record<string, ProductTexts> = {
  "krugerrand-oro": {
    name: "Krugerrand 1 oz Gold",
    shortName: "Krugerrand",
    country: "Südafrika",
    purityLabel: "916,7 Tausendstel (22 Karat)",
    liquidity: "Sehr hoch",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Feingehalt ≥ 900, nach 1800 geprägt, gesetzliches Zahlungsmittel). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die die weltweit bekannteste Goldmünze suchen, mit maximaler Liquidität auf dem Sekundärmarkt.",
    description:
      "Der Krugerrand war die erste moderne Anlagegoldmünze, 1967 von Südafrika herausgegeben, um den Verkauf südafrikanischen Goldes auf internationalen Märkten zu fördern. Er wurde schnell zum Branchenstandard. Seine 22-Karat-Legierung (mit Kupfer) verleiht ihm eine höhere Verschleißfestigkeit als reine Goldmünzen, wobei er genau 1 Feinunze Gold enthält.",
    highlights: [
      "Erste Bullionmünze der Geschichte — begründete die Kategorie",
      "Enthält genau 1 oz Feingold trotz 22k-Legierung",
      "Die meistgehandelte Goldmünze der Welt mit über 50 Millionen verkauften Einheiten",
      "Die charakteristische rötliche Farbe stammt von der Kupferlegierung",
      "Kein Nennwert — der Nominalwert entspricht dem Goldpreis des Inhalts",
    ],
    seo: {
      title: "Krugerrand 1 oz Gold — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Gold-Krugerrand 1 oz: Feingehalt, Feingewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und ideales Anlegerprofil.",
      keywords: ["Krugerrand Gold", "Krugerrand Preis", "Goldmünze Südafrika", "Krugerrand kaufen", "Krugerrand 1 oz"],
    },
  },
  "maple-leaf-oro": {
    name: "Maple Leaf 1 oz Gold",
    shortName: "Maple Leaf Gold",
    country: "Kanada",
    purityLabel: "999,9 Tausendstel (24 Karat)",
    liquidity: "Sehr hoch",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Feingehalt ≥ 900, nach 1800 geprägt, gesetzliches Zahlungsmittel). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die maximale Reinheit (24k Gold) in Kombination mit hoher globaler Liquidität und fortschrittlicher Fälschungsschutztechnologie priorisieren.",
    description:
      "Der kanadische Maple Leaf ist eine der reinsten Anlagegoldmünzen der Welt mit einem Goldgehalt von 999,9 Tausendstel. Er war 1982 die erste Bullionmünze, die diese Reinheit erreichte. Die Royal Canadian Mint integriert fortschrittliche Sicherheitstechnologie (Laser-Mikrogravur, DNA-Markierung), die ihn praktisch fälschungssicher macht.",
    highlights: [
      "Eine der reinsten Münzen auf dem Markt: 999,9 Tausendstel (vier Neunen)",
      "MintShield-Fälschungsschutztechnologie und Laser-Mikrogravur",
      "Nennwert von 50 CAD (symbolisch, durch Kanada gedeckt)",
      "Weltweit von Händlern anerkannt und akzeptiert",
      "Glänzenderes Finish als der Krugerrand aufgrund höherer Reinheit",
    ],
    seo: {
      title: "Maple Leaf 1 oz Gold — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Gold Maple Leaf 1 oz: 999,9 Reinheit, Gewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und ideales Anlegerprofil.",
      keywords: ["Maple Leaf Gold", "Maple Leaf Preis", "Goldmünze Kanada", "Maple Leaf kaufen", "Maple Leaf 1 oz Gold"],
    },
  },
  "filarmonica-oro": {
    name: "Wiener Philharmoniker 1 oz Gold",
    shortName: "Philharmoniker Gold",
    country: "Österreich",
    purityLabel: "999,9 Tausendstel (24 Karat)",
    liquidity: "Sehr hoch",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Feingehalt ≥ 900, nach 1800 geprägt, gesetzliches Zahlungsmittel). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die eine Münze mit maximaler Reinheit in Euro suchen, mit hoher globaler Liquidität und breiter internationaler Akzeptanz.",
    description:
      "Der Wiener Philharmoniker ist die meistverkaufte Anlagegoldmünze in Europa und eine der beliebtesten weltweit. Herausgegeben von der Münze Österreich (eine der ältesten der Welt, gegründet 1194), vereint er maximale Reinheit mit einem ikonischen Design zu Ehren der Wiener Philharmoniker. Sein Nennwert ist in Euro angegeben.",
    highlights: [
      "Meistverkaufte Anlagegoldmünze in Europa und weltweit anerkannt",
      "Nennwert von 100 € — in Euro denominiert",
      "Ikonisches Design: Instrumente der Wiener Philharmoniker",
      "Herausgegeben von einer der ältesten Münzprägeanstalten der Welt (1194)",
      "Mehrwertsteuerbefreit als Anlagegold in der EU und in mehreren Rechtsordnungen anerkannt",
    ],
    seo: {
      title: "Wiener Philharmoniker 1 oz Gold — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Wiener Philharmoniker 1 oz Gold: 999,9 Reinheit, Gewicht, Aufschlag, Liquidität, steuerliche Behandlung und ideales Anlegerprofil.",
      keywords: ["Philharmoniker Gold", "Wiener Philharmoniker Gold", "Goldmünze Österreich", "Philharmoniker kaufen", "Wiener Philharmoniker 1 oz"],
    },
  },
  "britannia-oro": {
    name: "Britannia 1 oz Gold",
    shortName: "Britannia Gold",
    country: "Vereinigtes Königreich",
    purityLabel: "999,9 Tausendstel (24 Karat, seit 2013)",
    liquidity: "Hoch",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Feingehalt ≥ 900, nach 1800 geprägt, gesetzliches Zahlungsmittel). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die eine Münze mit maximaler Reinheit suchen, unterstützt von The Royal Mint mit guter internationaler Liquidität.",
    description:
      "Die Britannia ist die Anlagegoldmünze des Vereinigten Königreichs, herausgegeben von The Royal Mint seit 1987. Seit 2013 wird sie in 999,9 Gold geprägt (zuvor 916,7). Sie verfügt über vier fortschrittliche Sicherheitsmerkmale, darunter ein latentes Bild und Mikrotext. Sie ist gesetzliches Zahlungsmittel im Vereinigten Königreich mit einem Nennwert von 100 GBP.",
    highlights: [
      "Herausgegeben von The Royal Mint — eine der renommiertesten Prägeanstalten der Welt",
      "999,9 Reinheit seit 2013 (zuvor 22k wie der Krugerrand)",
      "Vier Sicherheitsmerkmale im Design integriert",
      "Nennwert von 100 GBP — gesetzliches Zahlungsmittel im Vereinigten Königreich",
      "Design basiert auf der allegorischen Figur Britannia, Symbol des Vereinigten Königreichs",
    ],
    seo: {
      title: "Britannia 1 oz Gold — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil der Britannia Gold 1 oz: Feingehalt, Feingewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und Anlegerprofil.",
      keywords: ["Britannia Gold", "Britannia Gold Preis", "Goldmünze Großbritannien", "Britannia kaufen", "Britannia 1 oz Gold"],
    },
  },
  "eagle-oro": {
    name: "American Eagle 1 oz Gold",
    shortName: "Eagle Gold",
    country: "Vereinigte Staaten",
    purityLabel: "916,7 Tausendstel (22 Karat)",
    liquidity: "Sehr hoch",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Feingehalt ≥ 900, nach 1800 geprägt, gesetzliches Zahlungsmittel). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die maximale globale Liquidität schätzen, besonders auf amerikanischen Märkten, und die Garantie der US-Regierung.",
    description:
      "Der American Gold Eagle ist die offizielle Anlagegoldmünze der Vereinigten Staaten, geprägt von der U.S. Mint seit 1986. Wie der Krugerrand verwendet er eine 22-Karat-Legierung (Gold, Kupfer und Silber) für höhere Haltbarkeit, enthält aber genau 1 Feinunze reines Gold. 2021 wurde die Rückseite erstmals seit 35 Jahren neu gestaltet und die Sicherheitsmerkmale verbessert.",
    highlights: [
      "Offizielle US-Goldmünze — von der Bundesregierung gedeckt",
      "Enthält genau 1 oz Feingold in 22k-Legierung (mit Silber und Kupfer)",
      "Nennwert von 50 USD (symbolisch)",
      "Rückseite 2021 neu gestaltet mit neuen Fälschungsschutzmaßnahmen",
      "Maximale Liquidität auf amerikanischen und internationalen Märkten",
    ],
    seo: {
      title: "American Eagle 1 oz Gold — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des American Gold Eagle 1 oz: Feingehalt, Gewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und ideales Anlegerprofil.",
      keywords: ["American Eagle Gold", "Gold Eagle Preis", "Goldmünze USA", "American Eagle kaufen", "Eagle 1 oz Gold"],
    },
  },
  "maple-leaf-plata": {
    name: "Maple Leaf 1 oz Silber",
    shortName: "Maple Leaf Silber",
    country: "Kanada",
    purityLabel: "999,9 Tausendstel",
    liquidity: "Sehr hoch",
    vatNote:
      "Silber profitiert in den meisten Rechtsordnungen nicht von der Steuerbefreiung für Anlagegold. Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Silberanleger, die die Marktreferenz wollen: maximale Reinheit, maximale Liquidität und Fälschungsschutztechnologie.",
    description:
      "Der Silver Maple Leaf ist die reinste Anlagesilbermünze auf dem Markt (999,9 Tausendstel) und eine der meistgehandelten weltweit. Er teilt die Sicherheitstechnologie seiner Goldversion, einschließlich Laser-Mikrogravur und radialem Zeichen. Er ist die Standardwahl für Silbersammler weltweit.",
    highlights: [
      "Die reinste Silbermünze auf dem Markt: 999,9 Tausendstel",
      "MintShield-Fälschungsschutztechnologie der Royal Canadian Mint",
      "Nennwert von 5 CAD — gesetzliches Zahlungsmittel in Kanada",
      "Eine der liquidesten Silbermünzen der Welt",
      "Aufschläge über Spot sind höher als bei Gold — dem Silbermarkt inhärent",
    ],
    seo: {
      title: "Maple Leaf 1 oz Silber — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Silver Maple Leaf 1 oz: 999,9 Reinheit, Gewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und Anlegerprofil.",
      keywords: ["Maple Leaf Silber", "Maple Leaf Silber Preis", "Silbermünze Kanada", "Maple Leaf Silber kaufen", "Maple Leaf 1 oz Silber"],
    },
  },
  "filarmonica-plata": {
    name: "Wiener Philharmoniker 1 oz Silber",
    shortName: "Philharmoniker Silber",
    country: "Österreich",
    purityLabel: "999 Tausendstel",
    liquidity: "Sehr hoch",
    vatNote:
      "Silber profitiert in den meisten Rechtsordnungen nicht von der Steuerbefreiung für Anlagegold. Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die Silber in Euro-denominierten Münzen sammeln möchten, mit hoher Liquidität in Europa und wachsender internationaler Akzeptanz.",
    description:
      "Der Wiener Philharmoniker in Silber teilt das ikonische Design seiner Goldversion und ist die meistverkaufte Silbermünze in Europa mit wachsender Präsenz auf internationalen Märkten. Mit einem Nennwert von 1,50 € ist er gesetzliches Zahlungsmittel in Österreich und der gesamten Eurozone.",
    highlights: [
      "Meistverkaufte Silbermünze in Europa und international beliebt",
      "Nennwert von 1,50 € — gesetzliches Zahlungsmittel in der Eurozone",
      "Gleiches ikonisches Design wie die Goldversion",
      "Sehr liquide auf europäischen und internationalen Märkten",
      "Auch in 1/25 oz (Miniatur) Versionen und Tuben zu 20 Stück erhältlich",
    ],
    seo: {
      title: "Wiener Philharmoniker 1 oz Silber — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Wiener Philharmoniker 1 oz Silber: Reinheit, Gewicht, Aufschlag, Liquidität, steuerliche Behandlung und ideales Anlegerprofil.",
      keywords: ["Philharmoniker Silber", "Wiener Philharmoniker Silber", "Silbermünze Österreich", "Philharmoniker Silber kaufen", "Wiener Philharmoniker Silber"],
    },
  },
  "britannia-plata": {
    name: "Britannia 1 oz Silber",
    shortName: "Britannia Silber",
    country: "Vereinigtes Königreich",
    purityLabel: "999 Tausendstel",
    liquidity: "Hoch",
    vatNote:
      "Silber profitiert in den meisten Rechtsordnungen nicht von der Steuerbefreiung für Anlagegold. Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die das Prestige von The Royal Mint schätzen und mit einer hochwertigen Silbermünze diversifizieren möchten.",
    description:
      "Die Silver Britannia ist die Anlagesilbermünze des Vereinigten Königreichs, herausgegeben von The Royal Mint. Sie verfügt über die gleichen fortschrittlichen Sicherheitsmerkmale wie die Goldversion mit vier Fälschungsschutzelementen. Seit 2021 wird sie in 999 Tausendstel Silber geprägt (zuvor 958).",
    highlights: [
      "Herausgegeben von The Royal Mint mit vier fortschrittlichen Sicherheitsmaßnahmen",
      "Nennwert von 2 GBP — gesetzliches Zahlungsmittel im Vereinigten Königreich",
      "Reinheit seit 2021 auf 999 Tausendstel verbessert",
      "Britannia-Design mit hochwertigem Finish",
      "Aufschläge etwas höher als bei Maple Leaf und Philharmoniker",
    ],
    seo: {
      title: "Britannia 1 oz Silber — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil der Britannia Silber 1 oz: Reinheit, Feingewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und Anlegerprofil.",
      keywords: ["Britannia Silber", "Britannia Silber Preis", "Silbermünze Großbritannien", "Britannia Silber kaufen", "Britannia 1 oz Silber"],
    },
  },
  "eagle-plata": {
    name: "American Eagle 1 oz Silber",
    shortName: "Eagle Silber",
    country: "Vereinigte Staaten",
    purityLabel: "999 Tausendstel",
    liquidity: "Sehr hoch",
    vatNote:
      "Silber profitiert in den meisten Rechtsordnungen nicht von der Steuerbefreiung für Anlagegold. Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die die weltweit bekannteste Silbermünze wollen, mit maximaler Liquidität besonders auf amerikanischen Märkten.",
    description:
      "Der American Silver Eagle ist die meistverkaufte Anlagesilbermünze der Welt. Herausgegeben von der U.S. Mint seit 1986 mit dem ikonischen Walking-Liberty-Design, wurde er 2021 mit einer neuen Rückseite (landender Adler) und Sicherheitsverbesserungen neu gestaltet. Seine Aufschläge sind tendenziell höher als die anderer Wettbewerber, aber seine Liquidität ist unübertroffen.",
    highlights: [
      "Die meistverkaufte Silbermünze der Welt — Millionen Einheiten pro Jahr",
      "Ikonisches Walking-Liberty-Design (Vorderseite) seit 1986",
      "Rückseite 2021 neu gestaltet mit neuen Fälschungsschutzmaßnahmen",
      "Nennwert von 1 USD — von der US-Regierung gedeckt",
      "Höhere Aufschläge als andere große Wettbewerber, ausgeglichen durch unerreichte globale Liquidität",
    ],
    seo: {
      title: "American Eagle 1 oz Silber — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des American Silver Eagle 1 oz: Reinheit, Gewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und ideales Anlegerprofil.",
      keywords: ["American Eagle Silber", "Silver Eagle Preis", "Silbermünze USA", "Silver Eagle kaufen", "Eagle 1 oz Silber"],
    },
  },
  "krugerrand-plata": {
    name: "Krugerrand 1 oz Silber",
    shortName: "Krugerrand Silber",
    country: "Südafrika",
    purityLabel: "999 Tausendstel",
    liquidity: "Hoch",
    vatNote:
      "Silber profitiert in den meisten Rechtsordnungen nicht von der Steuerbefreiung für Anlagegold. Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die den Gold-Krugerrand bereits kennen und mit derselben anerkannten Marke in Silber diversifizieren möchten.",
    description:
      "Der Silber-Krugerrand wurde 2017 zum 50. Jubiläum des originalen Gold-Krugerrand herausgegeben. Er behält das ikonische Springbock- und Paul-Kruger-Design in 999 Tausendstel Silber bei. Obwohl neuer als seine Wettbewerber, profitiert er von der enormen Markenbekanntheit des Krugerrand.",
    highlights: [
      "2017 zum 50. Jubiläum des Gold-Krugerrand herausgegeben",
      "Gleiches ikonisches Design: Paul Kruger und Springbock",
      "Profitiert von der weltweiten Markenbekanntheit des Krugerrand",
      "Nennwert von 1 Rand — gesetzliches Zahlungsmittel in Südafrika",
      "Relativ neu auf dem Markt mit wachsender Liquidität",
    ],
    seo: {
      title: "Krugerrand 1 oz Silber — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Silber-Krugerrand 1 oz: Reinheit, Feingewicht, Aufschlag über Spot, Liquidität, steuerliche Behandlung und Anlegerprofil.",
      keywords: ["Krugerrand Silber", "Krugerrand Silber Preis", "Silbermünze Südafrika", "Krugerrand Silber kaufen", "Krugerrand 1 oz Silber"],
    },
  },
  "lingote-oro-1oz": {
    name: "Goldbarren 1 oz (31,1 g)",
    shortName: "Goldbarren 1 oz",
    country: "Verschiedene",
    purityLabel: "999,9 Tausendstel",
    liquidity: "Sehr hoch",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Barren mit Feingehalt ≥ 995). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger, die den geringstmöglichen Aufschlag pro Unze Gold suchen. Ideal als Standardeinheit zur Akkumulation.",
    description:
      "Der Goldbarren mit 1 Feinunze ist das Standardformat für physische Goldinvestitionen. Von LBMA-akkreditierten Raffinerien (London Bullion Market Association) hergestellt, bietet er die niedrigsten Marktaufschläge für 1-oz-Mengen. Die gängigsten stammen von PAMP Suisse, Heraeus, Argor-Heraeus und Valcambi und werden meist in versiegelten Blistern mit Prüfzertifikat geliefert.",
    highlights: [
      "Standard-Anlageformat — 1 Feinunze (31,1 g) reines Gold",
      "Niedrigere Aufschläge als Münzen bei gleichem Gewicht",
      "Hergestellt von LBMA-Raffinerien (PAMP, Heraeus, Valcambi usw.)",
      "Mit Prüfzertifikat und werksversiegeltem Blister",
      "Dank kompakter, standardisierter Form leicht zu lagern",
    ],
    seo: {
      title: "Goldbarren 1 oz — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Goldbarrens 1 oz: Reinheit, Gewicht, Aufschlag über Spot, LBMA-Raffinerien, steuerliche Behandlung und Anlegerprofil.",
      keywords: ["Goldbarren 1 oz", "Goldbarren Preis", "Goldbarren kaufen", "PAMP Goldbarren", "Goldbarren Anlage"],
    },
  },
  "lingote-oro-100g": {
    name: "Goldbarren 100 g",
    shortName: "Goldbarren 100 g",
    country: "Verschiedene",
    purityLabel: "999,9 Tausendstel",
    liquidity: "Hoch",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Barren mit Feingehalt ≥ 995). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Anleger mit höherem Kapital, die den Aufschlag pro Gramm optimieren möchten. Gute Balance zwischen Kosten, Liquidität und Lagerung.",
    description:
      "Der 100-Gramm-Goldbarren ist ein sehr beliebtes Zwischenformat unter seriösen Anlegern. Er bietet einen deutlich niedrigeren Aufschlag pro Gramm als 1-oz-Barren und Münzen bei gleichzeitig hoher Liquidität auf dem Sekundärmarkt. Er ist das bevorzugte Format vieler professioneller Anleger, die das Gleichgewicht zwischen Einstiegskosten und Wiederverkaufbarkeit suchen.",
    highlights: [
      "Hervorragendes Aufschlag-Gewicht-Verhältnis — effizienter als 1 oz",
      "Entspricht etwa 3,22 Feinunzen",
      "Sehr beliebtes Format in Europa, Asien und dem Nahen Osten",
      "Einfach auf internationalen Sekundärmärkten wiederverkäuflich",
      "Enthält in der Regel eingravierte Seriennummer und Prüfzertifikat",
    ],
    seo: {
      title: "Goldbarren 100 g — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Goldbarrens 100 g: Reinheit, Gewicht, Aufschlag über Spot, Raffinerien, steuerliche Behandlung und ideales Anlegerprofil.",
      keywords: ["Goldbarren 100g", "Goldbarren 100 Gramm Preis", "Goldbarren 100g kaufen", "Goldbarren Anlage", "PAMP 100g"],
    },
  },
  "lingote-oro-1kg": {
    name: "Goldbarren 1 kg",
    shortName: "Goldbarren 1 kg",
    country: "Verschiedene",
    purityLabel: "999,9 Tausendstel",
    liquidity: "Mittel",
    vatNote:
      "Als Anlagegold in den meisten Rechtsordnungen eingestuft (Barren mit Feingehalt ≥ 995). Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Großanleger, die den geringstmöglichen Aufschlag suchen und Gesamtkosten über sofortige Liquidität priorisieren.",
    description:
      "Der 1-Kilogramm-Goldbarren ist das Großanlageformat mit dem niedrigsten Aufschlag über Spot. Er enthält 32,15 Feinunzen reines Gold und sein Preis übersteigt in der Regel 70.000 € / ~75.000 USD (variabel je nach Spotpreis). Der Kompromiss ist eine geringere Liquidität als kleinere Formate: Nicht alle Händler können einen 1-kg-Verkauf sofort aufnehmen, und der Käuferkreis ist kleiner.",
    highlights: [
      "Minimaler Aufschlag über Spot — das kosteneffizienteste Format",
      "Enthält 32,15 Feinunzen (1.000 g Feingold)",
      "Institutionelles Format — auch von Zentralbanken in der 12,4-kg-Version (400 oz) verwendet",
      "Begrenzte Liquidität: Der Verkauf kann länger dauern als bei kleineren Formaten",
      "Erfordert professionelle Lagerung oder Schließfach aufgrund des hohen Wertes",
    ],
    seo: {
      title: "Goldbarren 1 kg — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Goldbarrens 1 kg: Reinheit, Gewicht, Aufschlag über Spot, LBMA-Raffinerien, steuerliche Behandlung und Anlegerprofil.",
      keywords: ["Goldbarren 1 kg", "Goldbarren Kilo Preis", "Goldbarren 1kg kaufen", "Goldbarren Anlage", "Goldbarren LBMA"],
    },
  },
  "lingote-plata-1kg": {
    name: "Silberbarren 1 kg",
    shortName: "Silberbarren 1 kg",
    country: "Verschiedene",
    purityLabel: "999 Tausendstel",
    liquidity: "Hoch",
    vatNote:
      "Silber profitiert in den meisten Rechtsordnungen nicht von der Steuerbefreiung für Anlagegold. Prüfen Sie die steuerliche Behandlung in Ihrem Land.",
    idealFor:
      "Silberanleger, die den Aufschlag pro Unze minimieren möchten und Gewicht/Volumen nicht scheuen. Das effizienteste Format zur Silberakkumulation.",
    description:
      "Der 1-Kilogramm-Silberbarren ist das beliebteste Format für seriöse physische Silberinvestitionen. Er enthält 32,15 Feinunzen Silber und bietet das beste Aufschlag-Gewicht-Verhältnis auf dem Silbermarkt (ausgenommen größere 5- oder 15-kg-Barren). Der Hauptnachteil ist die Mehrwertsteuer, die die Einstiegskosten im Vergleich zum steuerbefreiten Anlagegold erheblich verteuert.",
    highlights: [
      "Standard-Silberanlageformat — besseres Aufschlag-Gewicht-Verhältnis als Münzen",
      "32,15 Feinunzen pro Barren — viel effizienter als Münze für Münze zu kaufen",
      "Von LBMA-Raffinerien mit Prüfzertifikat hergestellt",
      "MwSt. ist der Hauptnachteil gegenüber Gold (das befreit ist)",
      "Prüfen Sie steuereffiziente Lageroptionen in Ihrer Rechtsordnung",
    ],
    seo: {
      title: "Silberbarren 1 kg — Profil, Preis & Spezifikationen",
      description:
        "Vollständiges Profil des Silberbarrens 1 kg: Reinheit, Gewicht, Aufschlag über Spot, steuerliche Behandlung, LBMA-Raffinerien und Anlegerprofil.",
      keywords: ["Silberbarren 1 kg", "Silberbarren Kilo Preis", "Silberbarren kaufen", "Silberbarren Anlage", "Silberbarren LBMA"],
    },
  },
};

const PRODUCTS_ZH: Record<string, ProductTexts> = {
  "krugerrand-oro": {
    name: "克鲁格金币 1 盎司",
    shortName: "克鲁格金币",
    country: "南非",
    purityLabel: "916.7‰（22K）",
    liquidity: "非常高",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（成色 ≥ 900‰，1800年后铸造，法定货币）。请查阅您所在国家的税务规定。",
    idealFor:
      "寻求全球最知名金币的投资者，在二级市场拥有最高流动性。",
    description:
      "克鲁格金币是首枚现代投资金币，1967年由南非发行，旨在促进南非黄金在国际市场的销售。它迅速成为行业标准。其22K合金（含铜）比纯金币更耐磨，同时精确含有1金衡盎司纯金。",
    highlights: [
      "史上第一枚投资金币 — 开创了这一类别",
      "尽管是22K合金，仍精确含有1盎司纯金",
      "全球交易量最大的金币，已售出超过5000万枚",
      "独特的红色调来自铜合金",
      "无面值 — 其名义价值等于所含黄金的价格",
    ],
    seo: {
      title: "克鲁格金币 1 盎司 — 简介、价格与规格",
      description:
        "克鲁格金币 1 盎司完整简介：纯度、净重、现货溢价、流动性、税务待遇及理想投资者画像。",
      keywords: ["克鲁格金币", "克鲁格金币价格", "南非金币", "购买克鲁格金币", "克鲁格金币 1 盎司"],
    },
  },
  "maple-leaf-oro": {
    name: "枫叶金币 1 盎司",
    shortName: "枫叶金币",
    country: "加拿大",
    purityLabel: "999.9‰（24K）",
    liquidity: "非常高",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（成色 ≥ 900‰，1800年后铸造，法定货币）。请查阅您所在国家的税务规定。",
    idealFor:
      "优先考虑最高纯度（24K黄金）并兼顾全球高流动性和先进防伪技术的投资者。",
    description:
      "加拿大枫叶金币是世界上最纯的投资金币之一，含金量为999.9‰。1982年它成为首枚达到此纯度的投资金币。加拿大皇家铸币厂采用先进安全技术（激光微雕、DNA标记），使其几乎不可能被伪造。",
    highlights: [
      "市场上最纯的金币之一：999.9‰（四个9）",
      "MintShield防伪技术和激光微雕",
      "面值50加元（象征性，由加拿大政府担保）",
      "全球经销商认可和接受",
      "因纯度更高，光泽比克鲁格金币更亮",
    ],
    seo: {
      title: "枫叶金币 1 盎司 — 简介、价格与规格",
      description:
        "枫叶金币 1 盎司完整简介：999.9纯度、重量、现货溢价、流动性、税务待遇及理想投资者画像。",
      keywords: ["枫叶金币", "枫叶金币价格", "加拿大金币", "购买枫叶金币", "枫叶金币 1 盎司"],
    },
  },
  "filarmonica-oro": {
    name: "维也纳爱乐金币 1 盎司",
    shortName: "爱乐金币",
    country: "奥地利",
    purityLabel: "999.9‰（24K）",
    liquidity: "非常高",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（成色 ≥ 900‰，1800年后铸造，法定货币）。请查阅您所在国家的税务规定。",
    idealFor:
      "寻求以欧元计价的最高纯度金币、全球高流动性和广泛国际认可度的投资者。",
    description:
      "维也纳爱乐金币（Wiener Philharmoniker）是欧洲最畅销的投资金币，也是全球最受欢迎的金币之一。由奥地利铸币厂（世界上最古老的铸币厂之一，成立于1194年）发行，融合了最高纯度与向维也纳爱乐乐团致敬的标志性设计。其面值以欧元计价。",
    highlights: [
      "欧洲最畅销的投资金币，全球广受认可",
      "面值100欧元 — 以欧元计价",
      "标志性设计：维也纳爱乐乐团乐器",
      "由世界上最古老的铸币厂之一发行（1194年）",
      "在欧盟免征增值税（作为投资黄金），并在多个司法管辖区获认可",
    ],
    seo: {
      title: "维也纳爱乐金币 1 盎司 — 简介、价格与规格",
      description:
        "维也纳爱乐金币 1 盎司完整简介：999.9纯度、重量、溢价、流动性、税务待遇及理想投资者画像。",
      keywords: ["爱乐金币", "维也纳爱乐金币", "奥地利金币", "购买爱乐金币", "维也纳爱乐 1 盎司"],
    },
  },
  "britannia-oro": {
    name: "不列颠尼亚金币 1 盎司",
    shortName: "不列颠尼亚金币",
    country: "英国",
    purityLabel: "999.9‰（24K，自2013年起）",
    liquidity: "高",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（成色 ≥ 900‰，1800年后铸造，法定货币）。请查阅您所在国家的税务规定。",
    idealFor:
      "寻求由英国皇家铸币厂担保的最高纯度金币、并具有良好国际流动性的投资者。",
    description:
      "不列颠尼亚是英国的投资金币，由英国皇家铸币厂自1987年起发行。自2013年起以999.9黄金铸造（此前为916.7）。它包含四项先进安全特征，包括隐形图像和微缩文字。它是英国的法定货币，面值100英镑。",
    highlights: [
      "由英国皇家铸币厂发行 — 世界上最负盛名的铸币厂之一",
      "自2013年起纯度为999.9（此前为22K，类似克鲁格金币）",
      "四项安全特征融入设计",
      "面值100英镑 — 英国法定货币",
      "设计基于不列颠尼亚寓言人物，英国的象征",
    ],
    seo: {
      title: "不列颠尼亚金币 1 盎司 — 简介、价格与规格",
      description:
        "不列颠尼亚金币 1 盎司完整简介：纯度、净重、现货溢价、流动性、税务待遇及投资者画像。",
      keywords: ["不列颠尼亚金币", "不列颠尼亚金币价格", "英国金币", "购买不列颠尼亚金币", "不列颠尼亚 1 盎司金币"],
    },
  },
  "eagle-oro": {
    name: "美国鹰扬金币 1 盎司",
    shortName: "鹰扬金币",
    country: "美国",
    purityLabel: "916.7‰（22K）",
    liquidity: "非常高",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（成色 ≥ 900‰，1800年后铸造，法定货币）。请查阅您所在国家的税务规定。",
    idealFor:
      "重视全球最高流动性（尤其是美国市场）和美国政府担保的投资者。",
    description:
      "美国鹰扬金币是美国的官方投资金币，由美国铸币局自1986年起铸造。与克鲁格金币类似，它使用22K合金（金、铜、银）以增强耐久性，但精确含有1金衡盎司纯金。2021年背面设计35年来首次更新，改进了安全特征。",
    highlights: [
      "美国官方金币 — 由联邦政府担保",
      "在22K合金中精确含有1盎司纯金（含银和铜）",
      "面值50美元（象征性）",
      "2021年背面重新设计，增加新防伪措施",
      "在美国和国际市场拥有最高流动性",
    ],
    seo: {
      title: "美国鹰扬金币 1 盎司 — 简介、价格与规格",
      description:
        "美国鹰扬金币 1 盎司完整简介：纯度、重量、现货溢价、流动性、税务待遇及理想投资者画像。",
      keywords: ["美国鹰扬金币", "鹰扬金币价格", "美国金币", "购买美国鹰扬金币", "鹰扬 1 盎司金币"],
    },
  },
  "maple-leaf-plata": {
    name: "枫叶银币 1 盎司",
    shortName: "枫叶银币",
    country: "加拿大",
    purityLabel: "999.9‰",
    liquidity: "非常高",
    vatNote:
      "白银在大多数司法管辖区不享受投资黄金的税收豁免。请查阅您所在国家的税务规定。",
    idealFor:
      "想要市场标杆的白银投资者：最高纯度、最高流动性和防伪技术。",
    description:
      "枫叶银币是市场上最纯的投资银币（999.9‰），也是全球交易量最大的银币之一。它与金版共享安全技术，包括激光微雕和放射状标记。它是全球白银收藏者的标准选择。",
    highlights: [
      "市场上最纯的银币：999.9‰",
      "加拿大皇家铸币厂MintShield防伪技术",
      "面值5加元 — 加拿大法定货币",
      "全球流动性最高的银币之一",
      "现货溢价高于黄金 — 白银市场固有特性",
    ],
    seo: {
      title: "枫叶银币 1 盎司 — 简介、价格与规格",
      description:
        "枫叶银币 1 盎司完整简介：999.9纯度、重量、现货溢价、流动性、税务待遇及投资者画像。",
      keywords: ["枫叶银币", "枫叶银币价格", "加拿大银币", "购买枫叶银币", "枫叶银币 1 盎司"],
    },
  },
  "filarmonica-plata": {
    name: "维也纳爱乐银币 1 盎司",
    shortName: "爱乐银币",
    country: "奥地利",
    purityLabel: "999‰",
    liquidity: "非常高",
    vatNote:
      "白银在大多数司法管辖区不享受投资黄金的税收豁免。请查阅您所在国家的税务规定。",
    idealFor:
      "寻求以欧元计价的银币进行白银积累、在欧洲拥有高流动性且国际认可度日益增长的投资者。",
    description:
      "维也纳爱乐银币与金版共享标志性设计，是欧洲最畅销的银币，在国际市场上的影响力也日益增长。面值1.50欧元，是奥地利和整个欧元区的法定货币。",
    highlights: [
      "欧洲最畅销的银币，国际上也广受欢迎",
      "面值1.50欧元 — 欧元区法定货币",
      "与金版相同的标志性设计",
      "在欧洲和国际市场上流动性极高",
      "还提供1/25盎司（微型）版本和20枚管装",
    ],
    seo: {
      title: "维也纳爱乐银币 1 盎司 — 简介、价格与规格",
      description:
        "维也纳爱乐银币 1 盎司完整简介：纯度、重量、溢价、流动性、税务待遇及理想投资者画像。",
      keywords: ["爱乐银币", "维也纳爱乐银币", "奥地利银币", "购买爱乐银币", "维也纳爱乐银币"],
    },
  },
  "britannia-plata": {
    name: "不列颠尼亚银币 1 盎司",
    shortName: "不列颠尼亚银币",
    country: "英国",
    purityLabel: "999‰",
    liquidity: "高",
    vatNote:
      "白银在大多数司法管辖区不享受投资黄金的税收豁免。请查阅您所在国家的税务规定。",
    idealFor:
      "重视英国皇家铸币厂声誉并寻求以高品质银币进行多元化投资的投资者。",
    description:
      "不列颠尼亚银币是英国的投资银币，由英国皇家铸币厂发行。它具备与金版相同的先进安全特征，包含四项防伪元素。自2021年起以999‰纯银铸造（此前为958）。",
    highlights: [
      "由英国皇家铸币厂发行，具备四项先进安全措施",
      "面值2英镑 — 英国法定货币",
      "自2021年起纯度提升至999‰",
      "不列颠尼亚设计，高品质表面处理",
      "溢价略高于枫叶银币和爱乐银币",
    ],
    seo: {
      title: "不列颠尼亚银币 1 盎司 — 简介、价格与规格",
      description:
        "不列颠尼亚银币 1 盎司完整简介：纯度、净重、现货溢价、流动性、税务待遇及投资者画像。",
      keywords: ["不列颠尼亚银币", "不列颠尼亚银币价格", "英国银币", "购买不列颠尼亚银币", "不列颠尼亚 1 盎司银币"],
    },
  },
  "eagle-plata": {
    name: "美国鹰扬银币 1 盎司",
    shortName: "鹰扬银币",
    country: "美国",
    purityLabel: "999‰",
    liquidity: "非常高",
    vatNote:
      "白银在大多数司法管辖区不享受投资黄金的税收豁免。请查阅您所在国家的税务规定。",
    idealFor:
      "想要全球最知名银币的投资者，尤其在美国市场拥有最高流动性。",
    description:
      "美国鹰扬银币是全球最畅销的投资银币。由美国铸币局自1986年起发行，采用标志性的行走自由女神设计，2021年背面重新设计（降落的鹰）并改进了安全性能。其溢价往往高于其他主要竞争对手，但流动性无与伦比。",
    highlights: [
      "全球最畅销的银币 — 每年数百万枚",
      "标志性行走自由女神设计（正面）自1986年起",
      "2021年背面重新设计，增加新防伪措施",
      "面值1美元 — 由美国政府担保",
      "溢价高于其他主要竞争对手，但全球流动性无与伦比",
    ],
    seo: {
      title: "美国鹰扬银币 1 盎司 — 简介、价格与规格",
      description:
        "美国鹰扬银币 1 盎司完整简介：纯度、重量、现货溢价、流动性、税务待遇及理想投资者画像。",
      keywords: ["美国鹰扬银币", "鹰扬银币价格", "美国银币", "购买鹰扬银币", "鹰扬 1 盎司银币"],
    },
  },
  "krugerrand-plata": {
    name: "克鲁格银币 1 盎司",
    shortName: "克鲁格银币",
    country: "南非",
    purityLabel: "999‰",
    liquidity: "高",
    vatNote:
      "白银在大多数司法管辖区不享受投资黄金的税收豁免。请查阅您所在国家的税务规定。",
    idealFor:
      "已了解克鲁格金币并希望在保持同一知名品牌的同时分散投资白银的投资者。",
    description:
      "克鲁格银币于2017年发行，纪念原始克鲁格金币50周年。它保留了标志性的跳羚和保罗·克鲁格设计，采用999‰纯银。虽然比竞争对手更新，但受益于克鲁格品牌的巨大知名度。",
    highlights: [
      "2017年发行，纪念克鲁格金币50周年",
      "相同的标志性设计：保罗·克鲁格和跳羚",
      "受益于克鲁格品牌的全球知名度",
      "面值1兰特 — 南非法定货币",
      "市场上相对较新，流动性不断增长",
    ],
    seo: {
      title: "克鲁格银币 1 盎司 — 简介、价格与规格",
      description:
        "克鲁格银币 1 盎司完整简介：纯度、净重、现货溢价、流动性、税务待遇及投资者画像。",
      keywords: ["克鲁格银币", "克鲁格银币价格", "南非银币", "购买克鲁格银币", "克鲁格银币 1 盎司"],
    },
  },
  "lingote-oro-1oz": {
    name: "金条 1 盎司（31.1克）",
    shortName: "金条 1 盎司",
    country: "多国",
    purityLabel: "999.9‰",
    liquidity: "非常高",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（金条成色 ≥ 995‰）。请查阅您所在国家的税务规定。",
    idealFor:
      "寻求每盎司黄金最低溢价的投资者。作为标准积累单位的理想选择。",
    description:
      "1金衡盎司金条是实物黄金投资的标准格式。由LBMA认证的精炼厂（伦敦金银市场协会）制造，提供市场上1盎司规格的最低溢价。最常见的来自PAMP Suisse、Heraeus、Argor-Heraeus和Valcambi，通常配有密封包装和化验证书。",
    highlights: [
      "标准投资格式 — 1金衡盎司（31.1克）纯金",
      "同等重量下溢价低于金币",
      "由LBMA精炼厂制造（PAMP、Heraeus、Valcambi等）",
      "含化验证书和出厂密封包装",
      "因紧凑标准化的外形，易于存储",
    ],
    seo: {
      title: "金条 1 盎司 — 简介、价格与规格",
      description:
        "金条 1 盎司完整简介：纯度、重量、现货溢价、LBMA精炼厂、税务待遇及投资者画像。",
      keywords: ["金条 1 盎司", "金条价格", "购买金条", "PAMP金条", "金条投资"],
    },
  },
  "lingote-oro-100g": {
    name: "金条 100 克",
    shortName: "金条 100 克",
    country: "多国",
    purityLabel: "999.9‰",
    liquidity: "高",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（金条成色 ≥ 995‰）。请查阅您所在国家的税务规定。",
    idealFor:
      "拥有更多资金、希望优化每克溢价的投资者。在成本、流动性和存储之间取得良好平衡。",
    description:
      "100克金条是严肃投资者中非常受欢迎的中间格式。其每克溢价明显低于1盎司金条和金币，同时在二级市场保持较高流动性。它是许多专业投资者的首选格式，在入场成本和转售便利性之间取得平衡。",
    highlights: [
      "出色的溢价重量比 — 比1盎司更高效",
      "约等于3.22金衡盎司",
      "在欧洲、亚洲和中东非常受欢迎的格式",
      "在国际二级市场上容易转售",
      "通常包含刻印序列号和化验证书",
    ],
    seo: {
      title: "金条 100 克 — 简介、价格与规格",
      description:
        "金条 100 克完整简介：纯度、重量、现货溢价、精炼厂、税务待遇及理想投资者画像。",
      keywords: ["金条 100克", "金条 100克价格", "购买金条 100克", "金条投资", "PAMP 100克"],
    },
  },
  "lingote-oro-1kg": {
    name: "金条 1 公斤",
    shortName: "金条 1 公斤",
    country: "多国",
    purityLabel: "999.9‰",
    liquidity: "中等",
    vatNote:
      "在大多数司法管辖区被归类为投资黄金（金条成色 ≥ 995‰）。请查阅您所在国家的税务规定。",
    idealFor:
      "寻求最低溢价、优先考虑总成本而非即时流动性的大型投资者。",
    description:
      "1公斤金条是现货溢价最低的大型投资格式。含有32.15金衡盎司纯金，价格通常超过70,000欧元 / ~75,000美元（随现货价格变动）。代价是流动性低于较小格式：并非所有经销商能立即消化1公斤的卖单，买家群体也较小。",
    highlights: [
      "最低现货溢价 — 成本效率最高的格式",
      "含32.15金衡盎司（1,000克纯金）",
      "机构级格式 — 各国央行也使用12.4公斤（400盎司）版本",
      "流动性有限：出售可能比小格式需要更长时间",
      "因高价值需要专业保管或保险柜",
    ],
    seo: {
      title: "金条 1 公斤 — 简介、价格与规格",
      description:
        "金条 1 公斤完整简介：纯度、重量、现货溢价、LBMA精炼厂、税务待遇及投资者画像。",
      keywords: ["金条 1 公斤", "金条公斤价格", "购买金条 1公斤", "金条投资", "LBMA金条"],
    },
  },
  "lingote-plata-1kg": {
    name: "银条 1 公斤",
    shortName: "银条 1 公斤",
    country: "多国",
    purityLabel: "999‰",
    liquidity: "高",
    vatNote:
      "白银在大多数司法管辖区不享受投资黄金的税收豁免。请查阅您所在国家的税务规定。",
    idealFor:
      "希望最小化每盎司溢价且不介意重量/体积的白银投资者。积累白银最高效的格式。",
    description:
      "1公斤银条是严肃实物白银投资最受欢迎的格式。含32.15金衡盎司白银，在白银市场提供最佳溢价重量比（不含5公斤或15公斤的更大银条）。主要缺点是增值税或销售税，在许多国家（尤其是欧盟和英国）会显著提高入场成本，而投资黄金通常是免税的。",
    highlights: [
      "标准白银投资格式 — 溢价重量比优于银币",
      "每条32.15金衡盎司 — 比逐枚购买银币高效得多",
      "由LBMA精炼厂制造，附化验证书",
      "增值税是相对黄金（通常免税）的主要劣势",
      "请考虑您所在司法管辖区可用的税务优化存储方案",
    ],
    seo: {
      title: "银条 1 公斤 — 简介、价格与规格",
      description:
        "银条 1 公斤完整简介：纯度、重量、现货溢价、税务待遇、LBMA精炼厂及投资者画像。",
      keywords: ["银条 1 公斤", "银条公斤价格", "购买银条", "银条投资", "LBMA银条"],
    },
  },
};

const PRODUCTS_TR: Record<string, ProductTexts> = {
  "krugerrand-oro": {
    name: "Krugerrand 1 oz Altın",
    shortName: "Krugerrand",
    country: "Güney Afrika",
    purityLabel: "916,7 milyem (22 ayar)",
    liquidity: "Çok yüksek",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 900, 1800 sonrası basım, yasal ödeme aracı). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Dünyanın en tanınmış altın parasını arayan, ikincil piyasada maksimum likidite isteyen yatırımcılar.",
    description:
      "Krugerrand, 1967'de Güney Afrika tarafından uluslararası piyasalarda altın satışını teşvik etmek amacıyla piyasaya sürülen ilk modern yatırım altın parasıdır. Hızla sektör standardı haline geldi. 22 ayar alaşımı (bakır ile) saf altın paralara göre daha yüksek aşınma direnci sağlarken, tam olarak 1 troy ons saf altın içerir.",
    highlights: [
      "Tarihteki ilk yatırım altın parası — bu kategoriyi tanımladı",
      "22 ayar alaşım olmasına rağmen tam 1 oz saf altın içerir",
      "50 milyondan fazla satışla dünyanın en çok işlem gören altın parası",
      "Karakteristik kırmızımsı rengi bakır alaşımından gelir",
      "Nominal değeri yok — değeri içerdiği altının fiyatına eşittir",
    ],
    seo: {
      title: "Krugerrand 1 oz Altın — Profil, Fiyat ve Özellikler",
      description:
        "Krugerrand 1 oz altın para tam profili: saflık, net ağırlık, spot üzeri prim, likidite, vergi uygulaması ve ideal yatırımcı profili.",
      keywords: ["Krugerrand altın", "Krugerrand fiyat", "Güney Afrika altın para", "Krugerrand satın al", "Krugerrand 1 oz"],
    },
  },
  "maple-leaf-oro": {
    name: "Maple Leaf 1 oz Altın",
    shortName: "Maple Leaf Altın",
    country: "Kanada",
    purityLabel: "999,9 milyem (24 ayar)",
    liquidity: "Çok yüksek",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 900, 1800 sonrası basım, yasal ödeme aracı). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Maksimum saflığı (24 ayar altın), yüksek küresel likidite ve gelişmiş sahtecilik önleme teknolojisiyle birleştirmek isteyen yatırımcılar.",
    description:
      "Kanada Maple Leaf, 999,9 milyem altın içeriğiyle dünyanın en saf yatırım altın paralarından biridir. 1982'de bu saflığa ulaşan ilk yatırım parası olmuştur. Kanada Kraliyet Darphanesi, lazer mikro-gravür ve DNA işareti gibi gelişmiş güvenlik teknolojisi kullanarak sahtecilik yapılmasını neredeyse imkansız kılar.",
    highlights: [
      "Piyasadaki en saf paralardan biri: 999,9 milyem (dört dokuz)",
      "MintShield sahtecilik önleme teknolojisi ve lazer mikro-gravür",
      "50 CAD nominal değer (sembolik, Kanada tarafından desteklenir)",
      "Dünya genelinde bayiler tarafından tanınır ve kabul edilir",
      "Daha yüksek saflık nedeniyle Krugerrand'dan daha parlak yüzey",
    ],
    seo: {
      title: "Maple Leaf 1 oz Altın — Profil, Fiyat ve Özellikler",
      description:
        "Maple Leaf 1 oz altın para tam profili: 999,9 saflık, ağırlık, spot üzeri prim, likidite, vergi uygulaması ve ideal yatırımcı profili.",
      keywords: ["Maple Leaf altın", "Maple Leaf fiyat", "Kanada altın para", "Maple Leaf satın al", "Maple Leaf 1 oz altın"],
    },
  },
  "filarmonica-oro": {
    name: "Viyana Filarmoni 1 oz Altın",
    shortName: "Filarmoni Altın",
    country: "Avusturya",
    purityLabel: "999,9 milyem (24 ayar)",
    liquidity: "Çok yüksek",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 900, 1800 sonrası basım, yasal ödeme aracı). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Euro cinsinden maksimum saflıkta bir para arayan, yüksek küresel likidite ve geniş uluslararası kabul isteyen yatırımcılar.",
    description:
      "Viyana Filarmoni (Wiener Philharmoniker), Avrupa'da en çok satan yatırım altın parası ve dünyada en popüler paralardan biridir. Dünyanın en eski darphanelerinden biri olan Avusturya Darphanesi (1194'te kurulmuş) tarafından basılır; maksimum saflığı Viyana Filarmoni Orkestrası'nı onurlandıran ikonik bir tasarımla birleştirir. Nominal değeri euro cinsindendir.",
    highlights: [
      "Avrupa'da en çok satan yatırım altın parası ve dünya genelinde tanınır",
      "100 € nominal değer — euro cinsinden",
      "İkonik tasarım: Viyana Filarmoni Orkestrası enstrümanları",
      "Dünyanın en eski darphanelerinden biri tarafından basılır (1194)",
      "AB'de yatırım altını olarak KDV'den muaf ve birçok yargı alanında tanınır",
    ],
    seo: {
      title: "Viyana Filarmoni 1 oz Altın — Profil, Fiyat ve Özellikler",
      description:
        "Viyana Filarmoni 1 oz altın para tam profili: 999,9 saflık, ağırlık, prim, likidite, vergi uygulaması ve ideal yatırımcı profili.",
      keywords: ["Filarmoni altın", "Philharmoniker altın", "Avusturya altın para", "Filarmoni satın al", "Viyana Filarmoni 1 oz"],
    },
  },
  "britannia-oro": {
    name: "Britannia 1 oz Altın",
    shortName: "Britannia Altın",
    country: "Birleşik Krallık",
    purityLabel: "999,9 milyem (24 ayar, 2013'ten itibaren)",
    liquidity: "Yüksek",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 900, 1800 sonrası basım, yasal ödeme aracı). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "The Royal Mint desteğiyle maksimum saflıkta bir para ve iyi uluslararası likidite arayan yatırımcılar.",
    description:
      "Britannia, Birleşik Krallık'ın yatırım altın parasıdır ve 1987'den beri The Royal Mint tarafından basılmaktadır. 2013'ten itibaren 999,9 altından basılmaktadır (öncesinde 916,7). Gizli görüntü ve mikro metin dahil dört gelişmiş güvenlik özelliği içerir. 100 GBP nominal değerle Birleşik Krallık'ta yasal ödeme aracıdır.",
    highlights: [
      "The Royal Mint tarafından basılır — dünyanın en prestijli darphanelerinden biri",
      "2013'ten itibaren 999,9 saflık (öncesinde Krugerrand gibi 22 ayar)",
      "Tasarıma entegre edilmiş dört güvenlik özelliği",
      "100 GBP nominal değer — Birleşik Krallık'ta yasal ödeme aracı",
      "Birleşik Krallık'ın sembolü Britannia alegorik figürüne dayanan tasarım",
    ],
    seo: {
      title: "Britannia 1 oz Altın — Profil, Fiyat ve Özellikler",
      description:
        "Britannia 1 oz altın para tam profili: saflık, net ağırlık, spot üzeri prim, likidite, vergi uygulaması ve yatırımcı profili.",
      keywords: ["Britannia altın", "Britannia altın fiyat", "İngiltere altın para", "Britannia satın al", "Britannia 1 oz altın"],
    },
  },
  "eagle-oro": {
    name: "American Eagle 1 oz Altın",
    shortName: "Eagle Altın",
    country: "ABD",
    purityLabel: "916,7 milyem (22 ayar)",
    liquidity: "Çok yüksek",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 900, 1800 sonrası basım, yasal ödeme aracı). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Özellikle Amerikan piyasalarında maksimum küresel likiditeye ve ABD hükümeti garantisine değer veren yatırımcılar.",
    description:
      "American Gold Eagle, ABD'nin resmi yatırım altın parasıdır ve 1986'dan beri U.S. Mint tarafından basılmaktadır. Krugerrand gibi, daha yüksek dayanıklılık için 22 ayar alaşım (altın, bakır ve gümüş) kullanır ancak tam olarak 1 troy ons saf altın içerir. 2021'de arka yüz 35 yıl sonra ilk kez yeniden tasarlanarak güvenlik özellikleri iyileştirildi.",
    highlights: [
      "ABD'nin resmi altın parası — federal hükümet tarafından desteklenir",
      "22 ayar alaşımda (gümüş ve bakır ile) tam 1 oz saf altın içerir",
      "50 USD nominal değer (sembolik)",
      "2021'de arka yüz yeni sahtecilik önleme önlemleriyle yeniden tasarlandı",
      "Amerikan ve uluslararası piyasalarda maksimum likidite",
    ],
    seo: {
      title: "American Eagle 1 oz Altın — Profil, Fiyat ve Özellikler",
      description:
        "American Gold Eagle 1 oz tam profili: saflık, ağırlık, spot üzeri prim, likidite, vergi uygulaması ve ideal yatırımcı profili.",
      keywords: ["American Eagle altın", "Gold Eagle fiyat", "ABD altın para", "American Eagle satın al", "Eagle 1 oz altın"],
    },
  },
  "maple-leaf-plata": {
    name: "Maple Leaf 1 oz Gümüş",
    shortName: "Maple Leaf Gümüş",
    country: "Kanada",
    purityLabel: "999,9 milyem",
    liquidity: "Çok yüksek",
    vatNote:
      "Gümüş, çoğu yargı alanında yatırım altını vergi muafiyetinden yararlanamaz. Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Piyasa referansını isteyen gümüş yatırımcıları: maksimum saflık, maksimum likidite ve sahtecilik önleme teknolojisi.",
    description:
      "Gümüş Maple Leaf, piyasadaki en saf yatırım gümüş parasıdır (999,9 milyem) ve dünya genelinde en çok işlem gören gümüş paralardan biridir. Altın versiyonunun güvenlik teknolojisini paylaşır; lazer mikro-gravür ve radyal işaret dahildir. Dünya genelinde gümüş biriktirenlerin standart tercihindir.",
    highlights: [
      "Piyasadaki en saf gümüş para: 999,9 milyem",
      "Kanada Kraliyet Darphanesi MintShield sahtecilik önleme teknolojisi",
      "5 CAD nominal değer — Kanada'da yasal ödeme aracı",
      "Dünyanın en likit gümüş paralarından biri",
      "Spot üzeri primler altından daha yüksek — gümüş piyasasına özgü bir durum",
    ],
    seo: {
      title: "Maple Leaf 1 oz Gümüş — Profil, Fiyat ve Özellikler",
      description:
        "Maple Leaf 1 oz gümüş para tam profili: 999,9 saflık, ağırlık, spot üzeri prim, likidite, vergi uygulaması ve yatırımcı profili.",
      keywords: ["Maple Leaf gümüş", "Maple Leaf gümüş fiyat", "Kanada gümüş para", "Maple Leaf gümüş satın al", "Maple Leaf 1 oz gümüş"],
    },
  },
  "filarmonica-plata": {
    name: "Viyana Filarmoni 1 oz Gümüş",
    shortName: "Filarmoni Gümüş",
    country: "Avusturya",
    purityLabel: "999 milyem",
    liquidity: "Çok yüksek",
    vatNote:
      "Gümüş, çoğu yargı alanında yatırım altını vergi muafiyetinden yararlanamaz. Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Euro cinsinden gümüş paralarla birikim yapmak isteyen, Avrupa'da yüksek likidite ve artan uluslararası kabule sahip yatırımcılar.",
    description:
      "Gümüş Viyana Filarmoni, altın versiyonunun ikonik tasarımını paylaşır ve Avrupa'da en çok satan gümüş paradır; uluslararası piyasalarda da varlığı artmaktadır. 1,50 € nominal değerle Avusturya ve tüm avro bölgesinde yasal ödeme aracıdır.",
    highlights: [
      "Avrupa'da en çok satan gümüş para ve uluslararası alanda popüler",
      "1,50 € nominal değer — avro bölgesinde yasal ödeme aracı",
      "Altın versiyonuyla aynı ikonik tasarım",
      "Avrupa ve uluslararası piyasalarda çok likit",
      "1/25 oz (minyatür) versiyonlarda ve 20'lik tüplerde de mevcut",
    ],
    seo: {
      title: "Viyana Filarmoni 1 oz Gümüş — Profil, Fiyat ve Özellikler",
      description:
        "Viyana Filarmoni 1 oz gümüş para tam profili: saflık, ağırlık, prim, likidite, vergi uygulaması ve ideal yatırımcı profili.",
      keywords: ["Filarmoni gümüş", "Philharmoniker gümüş", "Avusturya gümüş para", "Filarmoni gümüş satın al", "Viyana Filarmoni gümüş"],
    },
  },
  "britannia-plata": {
    name: "Britannia 1 oz Gümüş",
    shortName: "Britannia Gümüş",
    country: "Birleşik Krallık",
    purityLabel: "999 milyem",
    liquidity: "Yüksek",
    vatNote:
      "Gümüş, çoğu yargı alanında yatırım altını vergi muafiyetinden yararlanamaz. Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "The Royal Mint'in prestijine değer veren ve yüksek kaliteli bir gümüş para ile çeşitlendirmek isteyen yatırımcılar.",
    description:
      "Gümüş Britannia, Birleşik Krallık'ın yatırım gümüş parasıdır ve The Royal Mint tarafından basılmaktadır. Altın versiyonuyla aynı gelişmiş güvenlik özelliklerine sahiptir; dört sahtecilik önleme unsuru içerir. 2021'den itibaren 999 milyem gümüşten basılmaktadır (öncesinde 958).",
    highlights: [
      "The Royal Mint tarafından dört gelişmiş güvenlik önlemiyle basılır",
      "2 GBP nominal değer — Birleşik Krallık'ta yasal ödeme aracı",
      "2021'den itibaren saflık 999 milyeme yükseltildi",
      "Yüksek kaliteli yüzey işlemeli Britannia tasarımı",
      "Maple Leaf ve Filarmoni'den biraz daha yüksek primler",
    ],
    seo: {
      title: "Britannia 1 oz Gümüş — Profil, Fiyat ve Özellikler",
      description:
        "Britannia 1 oz gümüş para tam profili: saflık, net ağırlık, spot üzeri prim, likidite, vergi uygulaması ve yatırımcı profili.",
      keywords: ["Britannia gümüş", "Britannia gümüş fiyat", "İngiltere gümüş para", "Britannia gümüş satın al", "Britannia 1 oz gümüş"],
    },
  },
  "eagle-plata": {
    name: "American Eagle 1 oz Gümüş",
    shortName: "Eagle Gümüş",
    country: "ABD",
    purityLabel: "999 milyem",
    liquidity: "Çok yüksek",
    vatNote:
      "Gümüş, çoğu yargı alanında yatırım altını vergi muafiyetinden yararlanamaz. Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Dünyanın en tanınmış gümüş parasını isteyen, özellikle Amerikan piyasalarında maksimum likiditeye sahip yatırımcılar.",
    description:
      "American Silver Eagle, dünyanın en çok satan yatırım gümüş parasıdır. 1986'dan beri U.S. Mint tarafından ikonik Walking Liberty tasarımıyla basılmakta olup 2021'de yeni bir arka yüz (konan kartal) ve güvenlik iyileştirmeleriyle yeniden tasarlandı. Primleri diğer büyük rakiplerden daha yüksek olma eğilimindedir ancak likiditesi eşsizdir.",
    highlights: [
      "Dünyanın en çok satan gümüş parası — yılda milyonlarca adet",
      "1986'dan beri ikonik Walking Liberty tasarımı (ön yüz)",
      "2021'de arka yüz yeni sahtecilik önleme önlemleriyle yeniden tasarlandı",
      "1 USD nominal değer — ABD hükümeti tarafından desteklenir",
      "Diğer büyük rakiplerden daha yüksek primler, eşsiz küresel likidite ile dengelenir",
    ],
    seo: {
      title: "American Eagle 1 oz Gümüş — Profil, Fiyat ve Özellikler",
      description:
        "American Silver Eagle 1 oz tam profili: saflık, ağırlık, spot üzeri prim, likidite, vergi uygulaması ve ideal yatırımcı profili.",
      keywords: ["American Eagle gümüş", "Silver Eagle fiyat", "ABD gümüş para", "Silver Eagle satın al", "Eagle 1 oz gümüş"],
    },
  },
  "krugerrand-plata": {
    name: "Krugerrand 1 oz Gümüş",
    shortName: "Krugerrand Gümüş",
    country: "Güney Afrika",
    purityLabel: "999 milyem",
    liquidity: "Yüksek",
    vatNote:
      "Gümüş, çoğu yargı alanında yatırım altını vergi muafiyetinden yararlanamaz. Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Altın Krugerrand'ı zaten tanıyan ve aynı tanınmış markayla gümüşe çeşitlendirmek isteyen yatırımcılar.",
    description:
      "Gümüş Krugerrand, orijinal Altın Krugerrand'ın 50. yıldönümü için 2017'de piyasaya sürüldü. 999 milyem gümüşte ikonik springbok ve Paul Kruger tasarımını korur. Rakiplerinden daha yeni olmasına rağmen, Krugerrand'ın muazzam marka bilinirliğinden yararlanır.",
    highlights: [
      "Altın Krugerrand'ın 50. yıldönümü için 2017'de piyasaya sürüldü",
      "Aynı ikonik tasarım: Paul Kruger ve springbok",
      "Krugerrand'ın küresel marka bilinirliğinden yararlanır",
      "1 Rand nominal değer — Güney Afrika'da yasal ödeme aracı",
      "Piyasada nispeten yeni, artan likiditeye sahip",
    ],
    seo: {
      title: "Krugerrand 1 oz Gümüş — Profil, Fiyat ve Özellikler",
      description:
        "Krugerrand 1 oz gümüş para tam profili: saflık, net ağırlık, spot üzeri prim, likidite, vergi uygulaması ve yatırımcı profili.",
      keywords: ["Krugerrand gümüş", "Krugerrand gümüş fiyat", "Güney Afrika gümüş para", "Krugerrand gümüş satın al", "Krugerrand 1 oz gümüş"],
    },
  },
  "lingote-oro-1oz": {
    name: "Altın Külçe 1 oz (31,1 g)",
    shortName: "Altın Külçe 1 oz",
    country: "Çeşitli",
    purityLabel: "999,9 milyem",
    liquidity: "Çok yüksek",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 995 milyem külçe). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Ons başına mümkün olan en düşük primi arayan yatırımcılar. Standart birikim birimi olarak idealdir.",
    description:
      "1 troy ons altın külçe, fiziki altın yatırımının standart formatıdır. LBMA akrediteli rafineriler (Londra Külçe Piyasası Birliği) tarafından üretilir ve 1 oz miktarları için piyasadaki en düşük primleri sunar. En yaygınları PAMP Suisse, Heraeus, Argor-Heraeus ve Valcambi'den gelir ve genellikle mühürlü blister ambalajda analiz sertifikasıyla birlikte sunulur.",
    highlights: [
      "Standart yatırım formatı — 1 troy ons (31,1 g) saf altın",
      "Aynı ağırlık için paralardan daha düşük primler",
      "LBMA rafinerileri tarafından üretilir (PAMP, Heraeus, Valcambi vb.)",
      "Analiz sertifikası ve fabrika mühürlü blister dahildir",
      "Kompakt, standart şekli sayesinde kolay depolama",
    ],
    seo: {
      title: "Altın Külçe 1 oz — Profil, Fiyat ve Özellikler",
      description:
        "Altın külçe 1 oz tam profili: saflık, ağırlık, spot üzeri prim, LBMA rafinerileri, vergi uygulaması ve yatırımcı profili.",
      keywords: ["altın külçe 1 oz", "altın külçe fiyat", "altın külçe satın al", "PAMP altın külçe", "altın külçe yatırım"],
    },
  },
  "lingote-oro-100g": {
    name: "Altın Külçe 100 g",
    shortName: "Altın Külçe 100 g",
    country: "Çeşitli",
    purityLabel: "999,9 milyem",
    liquidity: "Yüksek",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 995 milyem külçe). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Gram başına primi optimize etmek isteyen daha yüksek sermayeli yatırımcılar. Maliyet, likidite ve depolama arasında iyi denge.",
    description:
      "100 gram altın külçe, ciddi yatırımcılar arasında çok popüler bir ara formattır. 1 oz külçelere ve paralara göre gram başına önemli ölçüde daha düşük prim sunarken, ikincil piyasada yüksek likiditeyi korur. Giriş maliyeti ile yeniden satış kolaylığı arasında denge arayan birçok profesyonel yatırımcının tercih ettiği formattır.",
    highlights: [
      "Mükemmel prim-ağırlık oranı — 1 oz'dan daha verimli",
      "Yaklaşık 3,22 troy onsa eşdeğer",
      "Avrupa, Asya ve Orta Doğu'da çok popüler format",
      "Uluslararası ikincil piyasalarda kolay yeniden satış",
      "Genellikle kazınmış seri numarası ve analiz sertifikası içerir",
    ],
    seo: {
      title: "Altın Külçe 100 g — Profil, Fiyat ve Özellikler",
      description:
        "Altın külçe 100 g tam profili: saflık, ağırlık, spot üzeri prim, rafineriler, vergi uygulaması ve ideal yatırımcı profili.",
      keywords: ["altın külçe 100g", "altın külçe 100 gram fiyat", "altın külçe 100g satın al", "altın külçe yatırım", "PAMP 100g"],
    },
  },
  "lingote-oro-1kg": {
    name: "Altın Külçe 1 kg",
    shortName: "Altın Külçe 1 kg",
    country: "Çeşitli",
    purityLabel: "999,9 milyem",
    liquidity: "Orta",
    vatNote:
      "Çoğu yargı alanında yatırım altını olarak sınıflandırılır (saflık ≥ 995 milyem külçe). Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Mümkün olan en düşük primi arayan ve toplam maliyeti anlık likiditeden öncelikli tutan büyük yatırımcılar.",
    description:
      "1 kilogram altın külçe, spot üzeri en düşük prime sahip büyük yatırım formatıdır. 32,15 troy ons saf altın içerir ve fiyatı genellikle 70.000 € / ~75.000 USD'yi aşar (spot fiyata göre değişir). Karşılığı, daha küçük formatlardan düşük likiditedir: tüm bayiler 1 kg'lık bir satışı hemen karşılayamaz ve alıcı havuzu daha küçüktür.",
    highlights: [
      "Spot üzeri minimum prim — maliyet açısından en verimli format",
      "32,15 troy ons (1.000 g saf altın) içerir",
      "Kurumsal format — merkez bankaları tarafından 12,4 kg (400 oz) versiyonda da kullanılır",
      "Sınırlı likidite: satış küçük formatlardan daha uzun sürebilir",
      "Yüksek değeri nedeniyle profesyonel saklama veya kiralık kasa gerektirir",
    ],
    seo: {
      title: "Altın Külçe 1 kg — Profil, Fiyat ve Özellikler",
      description:
        "Altın külçe 1 kg tam profili: saflık, ağırlık, spot üzeri prim, LBMA rafinerileri, vergi uygulaması ve yatırımcı profili.",
      keywords: ["altın külçe 1 kg", "altın külçe kilo fiyat", "altın külçe 1kg satın al", "altın külçe yatırım", "altın külçe LBMA"],
    },
  },
  "lingote-plata-1kg": {
    name: "Gümüş Külçe 1 kg",
    shortName: "Gümüş Külçe 1 kg",
    country: "Çeşitli",
    purityLabel: "999 milyem",
    liquidity: "Yüksek",
    vatNote:
      "Gümüş, çoğu yargı alanında yatırım altını vergi muafiyetinden yararlanamaz. Ülkenizdeki vergi uygulamasını kontrol edin.",
    idealFor:
      "Ons başına primi minimize etmek isteyen ve ağırlık/hacmi önemsemeyen gümüş yatırımcıları. Gümüş biriktirmek için en verimli format.",
    description:
      "1 kilogram gümüş külçe, ciddi fiziki gümüş yatırımı için en popüler formattır. 32,15 troy ons gümüş içerir ve gümüş piyasasında en iyi prim-ağırlık oranını sunar (5 veya 15 kg'lık daha büyük külçeler hariç). Ana dezavantajı KDV veya satış vergisidir; bu vergi, birçok ülkede (özellikle AB ve İngiltere'de) giriş maliyetini önemli ölçüde artırır. Yatırım altını ise genellikle vergiden muaftır.",
    highlights: [
      "Standart gümüş yatırım formatı — paralardan daha iyi prim-ağırlık oranı",
      "Külçe başına 32,15 troy ons — para para almaktan çok daha verimli",
      "LBMA rafinerileri tarafından analiz sertifikasıyla üretilir",
      "KDV, altına (muaf olan) kıyasla ana dezavantajdır",
      "Yargı alanınızda mevcut vergi açısından verimli saklama seçeneklerini değerlendirin",
    ],
    seo: {
      title: "Gümüş Külçe 1 kg — Profil, Fiyat ve Özellikler",
      description:
        "Gümüş külçe 1 kg tam profili: saflık, ağırlık, spot üzeri prim, vergi uygulaması, LBMA rafinerileri ve yatırımcı profili.",
      keywords: ["gümüş külçe 1 kg", "gümüş külçe kilo fiyat", "gümüş külçe satın al", "gümüş külçe yatırım", "gümüş külçe LBMA"],
    },
  },
};

import { getLocalizedProductSlug, getBaseProductSlug } from "./product-slugs";

function applyLocale(product: Product, locale: string): Product {
  if (locale === "es") return product;
  const map: Record<string, Record<string, ProductTexts>> = {
    en: PRODUCTS_EN,
    ar: PRODUCTS_AR,
    de: PRODUCTS_DE,
    zh: PRODUCTS_ZH,
    tr: PRODUCTS_TR,
    hi: PRODUCTS_EN,
  };
  const texts = map[locale]?.[product.slug] || PRODUCTS_EN[product.slug];
  if (!texts) return product;
  return {
    ...product,
    slug: getLocalizedProductSlug(product.slug, locale),
    name: texts.name,
    shortName: texts.shortName,
    country: texts.country,
    purityLabel: texts.purityLabel,
    liquidity: texts.liquidity as LiquidityLevel,
    vatNote: texts.vatNote,
    idealFor: texts.idealFor,
    description: texts.description,
    highlights: texts.highlights,
    seo: texts.seo,
  };
}

export function getProduct(slug: string, locale: string = "es"): Product | null {
  let product = PRODUCTS.find((p) => p.slug === slug) ?? null;
  if (!product) {
    const baseSlug = getBaseProductSlug(slug, locale);
    product = PRODUCTS.find((p) => p.slug === baseSlug) ?? null;
  }
  if (!product) return null;
  return applyLocale(product, locale);
}

export function getProductsByMetal(metal: MetalType, locale: string = "es"): Product[] {
  return PRODUCTS.filter((p) => p.metal === metal).map((p) => applyLocale(p, locale));
}

export function getProductsByType(type: ProductType, locale: string = "es"): Product[] {
  return PRODUCTS.filter((p) => p.type === type).map((p) => applyLocale(p, locale));
}

export function getLocalizedProducts(locale: string = "es"): Product[] {
  return PRODUCTS.map((p) => applyLocale(p, locale));
}
