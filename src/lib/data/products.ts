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

function applyLocale(product: Product, locale: string): Product {
  if (locale === "es") return product;
  const texts = PRODUCTS_EN[product.slug];
  if (!texts) return product;
  return {
    ...product,
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
  const product = PRODUCTS.find((p) => p.slug === slug) ?? null;
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
