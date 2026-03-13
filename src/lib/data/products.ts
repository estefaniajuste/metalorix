import type { MetalSymbol } from "@/lib/providers/metals";

export type ProductType = "moneda" | "lingote";
export type MetalType = "oro" | "plata";
export type LiquidityLevel = "Muy alta" | "Alta" | "Media";

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
  liquidity: LiquidityLevel;
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
      "Exenta de IVA en España como oro de inversión (ley ≥ 900 milésimas, acuñada después de 1800, curso legal en país de origen).",
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
        "Ficha completa del Krugerrand de oro 1 oz: pureza, peso fino, prima sobre spot, liquidez, fiscalidad en España y para qué perfil de inversor es ideal.",
      keywords: [
        "Krugerrand oro",
        "Krugerrand precio",
        "moneda oro Sudáfrica",
        "comprar Krugerrand España",
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
      "Exenta de IVA en España como oro de inversión (ley ≥ 900 milésimas, curso legal en Canadá).",
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
        "Ficha completa de la Maple Leaf de oro 1 oz: pureza 999,9, peso, prima sobre spot, liquidez, fiscalidad en España y para qué inversor es ideal.",
      keywords: [
        "Maple Leaf oro",
        "Maple Leaf precio",
        "moneda oro Canadá",
        "comprar Maple Leaf España",
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
      "Exenta de IVA en España como oro de inversión. Incluida en la lista oficial de monedas de oro de inversión publicada por la UE.",
    idealFor:
      "Inversores europeos que quieren una moneda de máxima pureza emitida dentro de la zona euro, con alta liquidez y amplia aceptación en Europa.",
    description:
      "La Filarmónica de Viena (Wiener Philharmoniker) es la moneda de oro de inversión más vendida en Europa y una de las más populares del mundo. Emitida por la Casa de la Moneda de Austria (una de las más antiguas del mundo, fundada en 1194), combina máxima pureza con un diseño icónico que homenajea a la Orquesta Filarmónica de Viena. Su valor facial está denominado en euros.",
    highlights: [
      "Moneda de oro de inversión más vendida en Europa",
      "Valor facial de 100 € — denominada en la divisa local",
      "Diseño icónico: instrumentos de la Filarmónica de Viena",
      "Emitida por una de las casas de moneda más antiguas del mundo (1194)",
      "Incluida en la lista oficial de la UE de monedas de oro de inversión exentas de IVA",
    ],
    seo: {
      title: "Filarmónica de Viena 1 oz Oro — Ficha, precio y características",
      description:
        "Ficha completa de la Filarmónica de Viena de oro 1 oz: pureza 999,9, peso, prima, liquidez, fiscalidad en España y perfil de inversor ideal.",
      keywords: [
        "Filarmónica oro",
        "Philharmoniker oro",
        "moneda oro Austria",
        "comprar Filarmónica España",
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
      "Exenta de IVA en España como oro de inversión. Incluida en la lista oficial de la UE.",
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
        "Ficha completa de la Britannia de oro 1 oz: pureza, peso fino, prima sobre spot, liquidez, fiscalidad en España y perfil de inversor.",
      keywords: [
        "Britannia oro",
        "Britannia oro precio",
        "moneda oro Reino Unido",
        "comprar Britannia España",
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
      "Exenta de IVA en España como oro de inversión (ley ≥ 900 milésimas, acuñada después de 1800, curso legal en EE.UU.).",
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
        "Ficha completa del American Gold Eagle 1 oz: pureza, peso, prima sobre spot, liquidez, fiscalidad en España y para qué inversor es ideal.",
      keywords: [
        "American Eagle oro",
        "Gold Eagle precio",
        "moneda oro Estados Unidos",
        "comprar American Eagle España",
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
      "Sujeta a IVA en España (21 %). La plata NO tiene el régimen especial del oro de inversión. Algunos dealers europeos ofrecen almacenamiento en Alemania con IVA diferencial.",
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
        "Ficha completa de la Maple Leaf de plata 1 oz: pureza 999,9, peso, prima sobre spot, liquidez, IVA en España y perfil de inversor.",
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
      "Sujeta a IVA en España (21 %). Muchos inversores europeos compran en Estonia (IVA 0 % en monedas de curso legal) o almacenan en Alemania con IVA diferencial.",
    idealFor:
      "Inversores europeos que quieren acumular plata en monedas con denominación en euros y alta liquidez en el continente.",
    description:
      "La Filarmónica de Viena en plata comparte el diseño icónico de su versión de oro y es la moneda de plata más vendida en Europa. Con un valor facial de 1,50 €, es curso legal en Austria y toda la zona euro. Su popularidad en Europa la hace especialmente fácil de vender en el mercado secundario continental.",
    highlights: [
      "Moneda de plata más vendida en Europa",
      "Valor facial de 1,50 € — curso legal en la eurozona",
      "Mismo diseño icónico que la versión de oro",
      "Especialmente líquida en mercados europeos",
      "Disponible también en versiones de 1/25 oz (miniatura) y tubos de 20 unidades",
    ],
    seo: {
      title:
        "Filarmónica de Viena 1 oz Plata — Ficha, precio y características",
      description:
        "Ficha completa de la Filarmónica de Viena de plata 1 oz: pureza, peso, prima, liquidez, IVA en España y perfil de inversor ideal.",
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
      "Sujeta a IVA en España (21 %). Tras el Brexit, la Britannia de plata ya no tiene ventajas fiscales dentro de la UE.",
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
        "Ficha completa de la Britannia de plata 1 oz: pureza, peso fino, prima sobre spot, liquidez, IVA en España y perfil de inversor.",
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
      "Sujeta a IVA en España (21 %). En EE.UU. puede estar exenta de sales tax dependiendo del estado.",
    idealFor:
      "Inversores que quieren la moneda de plata más reconocida del mundo, con máxima liquidez especialmente en mercados americanos.",
    description:
      "El American Silver Eagle es la moneda de plata de inversión más vendida del mundo. Emitida por la U.S. Mint desde 1986 con el icónico diseño de Walking Liberty, fue rediseñada en 2021 con un nuevo reverso (águila aterrizando) y mejoras de seguridad. Sus primas tienden a ser más altas que las de competidores europeos, pero su liquidez es inigualable.",
    highlights: [
      "La moneda de plata más vendida del mundo — millones de unidades al año",
      "Diseño icónico Walking Liberty (anverso) desde 1986",
      "Reverso rediseñado en 2021 con nuevas medidas anti-falsificación",
      "Valor facial de 1 USD — respaldada por el gobierno de EE.UU.",
      "Primas más altas que competidores europeos, compensadas por liquidez global",
    ],
    seo: {
      title: "American Eagle 1 oz Plata — Ficha, precio y características",
      description:
        "Ficha completa del American Silver Eagle 1 oz: pureza, peso, prima sobre spot, liquidez, IVA en España y perfil de inversor ideal.",
      keywords: [
        "American Eagle plata",
        "Silver Eagle precio",
        "moneda plata Estados Unidos",
        "comprar Silver Eagle España",
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
    vatNote: "Sujeta a IVA en España (21 %).",
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
        "Ficha completa del Krugerrand de plata 1 oz: pureza, peso fino, prima sobre spot, liquidez, IVA en España y perfil de inversor.",
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
      "Exento de IVA en España como oro de inversión (lingote de ley igual o superior a 995 milésimas).",
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
        "Ficha completa del lingote de oro de 1 oz: pureza, peso, prima sobre spot, refinadoras LBMA, fiscalidad en España y perfil de inversor.",
      keywords: [
        "lingote oro 1 oz",
        "lingote oro precio",
        "comprar lingote oro España",
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
      "Exento de IVA en España como oro de inversión (lingote ley ≥ 995 milésimas).",
    idealFor:
      "Inversores con mayor capital que buscan optimizar la prima por gramo. Buen equilibrio entre coste, liquidez y almacenamiento.",
    description:
      "El lingote de 100 gramos es un formato intermedio muy popular entre inversores serios. Ofrece una prima por gramo significativamente menor que los lingotes de 1 oz y las monedas, manteniendo una liquidez alta en el mercado secundario. Es el formato preferido por muchos inversores europeos que buscan el equilibrio entre coste de entrada y facilidad de reventa.",
    highlights: [
      "Excelente relación prima/peso — más eficiente que 1 oz",
      "Equivale a aproximadamente 3,22 onzas troy",
      "Formato muy popular en Europa continental",
      "Fácil de revender en el mercado secundario europeo",
      "Suele incluir número de serie grabado y certificado de ensayo",
    ],
    seo: {
      title: "Lingote de Oro 100 g — Ficha, precio y características",
      description:
        "Ficha completa del lingote de oro de 100 g: pureza, peso, prima sobre spot, refinadoras, fiscalidad en España y perfil de inversor ideal.",
      keywords: [
        "lingote oro 100g",
        "lingote oro 100 gramos precio",
        "comprar lingote oro 100g",
        "lingote oro inversión España",
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
      "Exento de IVA en España como oro de inversión (lingote ley ≥ 995 milésimas).",
    idealFor:
      "Grandes inversores que buscan la menor prima posible y priorizan el coste total sobre la liquidez inmediata.",
    description:
      "El lingote de oro de 1 kilogramo es el formato de gran inversión con la menor prima sobre spot. Contiene 32,15 onzas troy de oro puro y su precio suele superar los 70.000 € (variable según cotización). La contrapartida es una liquidez menor que los formatos más pequeños: no todos los dealers pueden absorber una venta de 1 kg inmediatamente, y el pool de compradores es más reducido.",
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
        "Ficha completa del lingote de oro de 1 kg: pureza, peso, prima sobre spot, refinadoras LBMA, fiscalidad en España y perfil de inversor.",
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
      "Sujeto a IVA en España (21 %). La plata no tiene exención como el oro de inversión. Algunos dealers ofrecen almacenamiento en depósito aduanero o en países con IVA diferencial.",
    idealFor:
      "Inversores en plata que quieren minimizar la prima por onza y no les importa el peso/volumen. El formato más eficiente para acumular plata.",
    description:
      "El lingote de plata de 1 kilogramo es el formato más popular para inversión seria en plata física. Contiene 32,15 onzas troy de plata y ofrece la mejor relación prima/peso del mercado de plata (excluyendo lingotes mayores de 5 o 15 kg). El principal inconveniente es el IVA del 21 % en España, que encarece significativamente la entrada. Muchos inversores compran a dealers en Estonia o almacenan en Alemania para optimizar fiscalmente.",
    highlights: [
      "Formato estándar de inversión en plata — mejor prima/peso que monedas",
      "32,15 onzas troy por lingote — mucho más eficiente que comprar moneda a moneda",
      "Fabricados por refinadoras LBMA con certificado de ensayo",
      "El IVA del 21 % en España es el principal inconveniente vs. el oro (exento)",
      "Considerar almacenamiento en depósito aduanero para diferir IVA",
    ],
    seo: {
      title: "Lingote de Plata 1 kg — Ficha, precio y características",
      description:
        "Ficha completa del lingote de plata de 1 kg: pureza, peso, prima sobre spot, IVA en España, refinadoras LBMA y perfil de inversor.",
      keywords: [
        "lingote plata 1 kg",
        "lingote plata kilo precio",
        "comprar lingote plata España",
        "lingote plata inversión",
        "lingote plata LBMA",
      ],
    },
  },
];

export function getProduct(slug: string): Product | null {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductsByMetal(metal: MetalType): Product[] {
  return PRODUCTS.filter((p) => p.metal === metal);
}

export function getProductsByType(type: ProductType): Product[] {
  return PRODUCTS.filter((p) => p.type === type);
}
