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
  paladio: {
    slug: "paladio",
    symbol: "XPD",
    name: "Paladio",
    fullName: "Paladio (XPD/USD)",
    description:
      "Precio del paladio hoy en tiempo real. Cotización XPD/USD actualizada, gráfico histórico, máximos, mínimos y análisis del mercado del paladio.",
    about:
      "El paladio es un metal precioso del grupo del platino, muy demandado por la industria automotriz para catalizadores de gasolina. También se usa en electrónica, odontología y joyería. Su oferta es limitada, concentrada en Rusia y Sudáfrica.",
    keywords: [
      "precio del paladio hoy",
      "cotización paladio",
      "XPD/USD",
      "paladio en tiempo real",
      "invertir en paladio",
      "precio paladio onza",
    ],
    facts: [
      "Rusia produce aproximadamente el 40% del paladio mundial, seguida de Sudáfrica con un 35%.",
      "El paladio se usa principalmente en catalizadores de coches de gasolina, absorbiendo más del 80% de la demanda.",
      "En 2022 el paladio alcanzó máximos históricos por encima de $3.000/oz debido a sanciones a Rusia y escasez de suministro.",
      "El paladio es 15 veces más raro que el platino y 30 veces más raro que el oro en la corteza terrestre.",
    ],
  },
  cobre: {
    slug: "cobre",
    symbol: "HG",
    name: "Cobre",
    fullName: "Cobre (HG/USD)",
    description:
      "Precio del cobre hoy en tiempo real. Cotización HG/USD actualizada, gráfico histórico, máximos, mínimos y análisis del mercado del cobre.",
    about:
      "El cobre es el metal industrial más importante del mundo. Es esencial para la electrificación, energías renovables, vehículos eléctricos y construcción. Su precio se considera un indicador adelantado de la economía global, conocido como 'Doctor Copper'. Se cotiza en USD por libra (lb).",
    keywords: [
      "precio del cobre hoy",
      "cotización cobre",
      "HG/USD",
      "cobre en tiempo real",
      "invertir en cobre",
      "precio cobre libra",
    ],
    facts: [
      "Chile es el mayor productor mundial de cobre, representando cerca del 25% de la producción global.",
      "El cobre es esencial para la transición energética: un vehículo eléctrico usa 3-4 veces más cobre que uno convencional.",
      "La demanda de cobre para centros de datos de IA ha crecido exponencialmente desde 2024.",
      "El London Metal Exchange (LME) registró volúmenes récord de negociación de cobre en 2025.",
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
  paladio: {
    name: "Palladium",
    fullName: "Palladium (XPD/USD)",
    description: "Palladium price today in real time. Updated XPD/USD quote, historical chart, highs, lows and palladium market analysis.",
    about: "Palladium is a precious metal in the platinum group, highly demanded by the automotive industry for gasoline catalytic converters. It is also used in electronics, dentistry and jewellery. Supply is limited, concentrated in Russia and South Africa.",
    keywords: ["palladium price today", "palladium quote", "XPD/USD", "palladium real time", "invest in palladium", "palladium ounce price"],
    facts: [
      "Russia produces approximately 40% of the world's palladium, followed by South Africa at 35%.",
      "Palladium is primarily used in gasoline car catalytic converters, absorbing over 80% of demand.",
      "In 2022, palladium hit all-time highs above $3,000/oz due to Russian sanctions and supply shortages.",
      "Palladium is 15 times rarer than platinum and 30 times rarer than gold in the Earth's crust.",
    ],
  },
  cobre: {
    name: "Copper",
    fullName: "Copper (HG/USD)",
    description: "Copper price today in real time. Updated HG/USD quote, historical chart, highs, lows and copper market analysis.",
    about: "Copper is the most important industrial metal in the world. It is essential for electrification, renewable energy, electric vehicles and construction. Its price is considered a leading indicator of the global economy, known as 'Doctor Copper'. It is quoted in USD per pound (lb).",
    keywords: ["copper price today", "copper quote", "HG/USD", "copper real time", "invest in copper", "copper pound price"],
    facts: [
      "Chile is the world's largest copper producer, accounting for about 25% of global production.",
      "Copper is essential for the energy transition: an electric vehicle uses 3-4 times more copper than a conventional one.",
      "Copper demand for AI data centres has grown exponentially since 2024.",
      "The London Metal Exchange (LME) recorded record copper trading volumes in 2025.",
    ],
  },
};

const METAL_SEO_AR: Record<string, Omit<MetalSEO, "slug" | "symbol">> = {
  oro: {
    name: "الذهب",
    fullName: "الذهب (XAU/USD)",
    description:
      "سعر الذهب اليوم في الوقت الفعلي. سعر XAU/USD محدث، رسم بياني تاريخي، أعلى وأدنى مستويات وتحليل سوق الذهب.",
    about:
      "الذهب هو أكثر المعادن الثمينة تداولاً في العالم. يُستخدم كمخزن للقيمة وتحوط ضد التضخم وأصل ملاذ آمن خلال فترات عدم اليقين الاقتصادي. يُقاس سعره بالدولار الأمريكي لكل أونصة تروي (31.1 جرام).",
    keywords: [
      "سعر الذهب اليوم",
      "سعر الذهب",
      "XAU/USD",
      "الذهب في الوقت الفعلي",
      "الاستثمار في الذهب",
      "سعر أونصة الذهب",
    ],
    facts: [
      "يتداول الذهب على مدار 24 ساعة يومياً، 5 أيام أسبوعياً، في أسواق عالمية مثل COMEX وLBMA وبورصة شنغهاي للذهب.",
      "تمتلك البنوك المركزية نحو 36,000 طن من الذهب في احتياطياتها، وتعد الولايات المتحدة أكبر المالكين بأكثر من 8,000 طن.",
      "يأتي الطلب على الذهب من المجوهرات (~50%) والاستثمار (~25%) والبنوك المركزية (~15%) والتكنولوجيا (~10%).",
      "نسبة الذهب إلى الفضة تقيس عدد أونصات الفضة اللازمة لشراء أونصة واحدة من الذهب. تاريخياً تتراوح بين 40x و90x.",
    ],
  },
  plata: {
    name: "الفضة",
    fullName: "الفضة (XAG/USD)",
    description:
      "سعر الفضة اليوم في الوقت الفعلي. سعر XAG/USD محدث، رسم بياني تاريخي، أعلى وأدنى مستويات وتحليل سوق الفضة.",
    about:
      "الفضة معدن ثمين له ميزة مزدوجة: فهي أصل استثماري ومعدن صناعي أساسي. تُستخدم في الإلكترونيات والألواح الشمسية والطب والمجوهرات. تقلباتها أعلى من الذهب، مما يجعلها خياراً شائعاً للمتداولين.",
    keywords: [
      "سعر الفضة اليوم",
      "سعر الفضة",
      "XAG/USD",
      "الفضة في الوقت الفعلي",
      "الاستثمار في الفضة",
      "سعر أونصة الفضة",
    ],
    facts: [
      "تمتلك الفضة أعلى موصلية كهربائية وحرارية بين جميع المعادن، مما يجعلها لا غنى عنها في الإلكترونيات.",
      "تستهلك صناعة الطاقة الشمسية نحو 10% من الإنتاج العالمي السنوي من الفضة، وهي نسبة تتزايد كل عام.",
      "المكسيك وبيرو والصين هي أكبر ثلاثة منتجين للفضة في العالم.",
      "الفضة أكثر تقلباً بكثير من الذهب: حركاتها اليومية عادةً أكبر بـ 1.5-2 مرة من حيث النسبة المئوية.",
    ],
  },
  platino: {
    name: "البلاتين",
    fullName: "البلاتين (XPT/USD)",
    description:
      "سعر البلاتين اليوم في الوقت الفعلي. سعر XPT/USD محدث، رسم بياني تاريخي، أعلى وأدنى مستويات وتحليل سوق البلاتين.",
    about:
      "البلاتين معدن ثمين نادر بمكون صناعي قوي. يُستخدم بشكل أساسي في محفزات السيارات والمجوهرات والمعدات الطبية والصناعة الكيميائية. يرتبط سعره ارتباطاً وثيقاً بصناعة السيارات والإمدادات الجنوب أفريقية.",
    keywords: [
      "سعر البلاتين اليوم",
      "سعر البلاتين",
      "XPT/USD",
      "البلاتين في الوقت الفعلي",
      "الاستثمار في البلاتين",
      "سعر أونصة البلاتين",
    ],
    facts: [
      "تنتج جنوب أفريقيا نحو 70% من البلاتين العالمي، مما يجعل سعره حساساً للأحداث الجيوسياسية في المنطقة.",
      "البلاتين أندر بـ 30 مرة من الذهب في قشرة الأرض.",
      "تستهلك صناعة السيارات نحو 40% من الطلب على البلاتين لمحفزات انبعاثات العادم.",
      "تاريخياً كان البلاتين يتداول بأعلى من الذهب. انعكاس هذه النسبة (البلاتين أرخص من الذهب) ظاهرة حديثة نسبياً.",
    ],
  },
  paladio: {
    name: "البلاديوم",
    fullName: "البلاديوم (XPD/USD)",
    description:
      "سعر البلاديوم اليوم في الوقت الفعلي. سعر XPD/USD محدث، رسم بياني تاريخي، أعلى وأدنى مستويات وتحليل سوق البلاديوم.",
    about:
      "البلاديوم معدن ثمين من مجموعة البلاتين، يُطلب بكثافة من صناعة السيارات لمحفزات البنزين. يُستخدم أيضاً في الإلكترونيات وطب الأسنان والمجوهرات. المعروض محدود ومتركز في روسيا وجنوب أفريقيا.",
    keywords: [
      "سعر البلاديوم اليوم",
      "سعر البلاديوم",
      "XPD/USD",
      "البلاديوم في الوقت الفعلي",
      "الاستثمار في البلاديوم",
      "سعر أونصة البلاديوم",
    ],
    facts: [
      "تنتج روسيا نحو 40% من البلاديوم العالمي، تليها جنوب أفريقيا بنسبة 35%.",
      "يُستخدم البلاديوم بشكل أساسي في محفزات سيارات البنزين، مستحوذاً على أكثر من 80% من الطلب.",
      "في 2022 بلغ البلاديوم مستويات قياسية فوق 3,000 دولار/أونصة بسبب العقوبات على روسيا ونقص المعروض.",
      "البلاديوم أندر بـ 15 مرة من البلاتين و30 مرة من الذهب في قشرة الأرض.",
    ],
  },
  cobre: {
    name: "النحاس",
    fullName: "النحاس (HG/USD)",
    description:
      "سعر النحاس اليوم في الوقت الفعلي. سعر HG/USD محدث، رسم بياني تاريخي، أعلى وأدنى مستويات وتحليل سوق النحاس.",
    about:
      "النحاس هو أهم معدن صناعي في العالم. إنه ضروري للكهربة والطاقة المتجددة والمركبات الكهربائية والبناء. يُعتبر سعره مؤشراً رائداً للاقتصاد العالمي، ويُعرف باسم «دكتور كوبر». يُسعر بالدولار الأمريكي لكل رطل (lb).",
    keywords: [
      "سعر النحاس اليوم",
      "سعر النحاس",
      "HG/USD",
      "النحاس في الوقت الفعلي",
      "الاستثمار في النحاس",
      "سعر رطل النحاس",
    ],
    facts: [
      "تشيلي هي أكبر منتج للنحاس في العالم، تمثل نحو 25% من الإنتاج العالمي.",
      "النحاس ضروري للتحول الطاقي: المركبة الكهربائية تستخدم 3-4 أضعاف النحاس مقارنة بالمركبة التقليدية.",
      "نما الطلب على النحاس لمراكز بيانات الذكاء الاصطناعي بشكل كبير منذ 2024.",
      "سجلت بورصة لندن للمعادن (LME) أرقاماً قياسية في تداول النحاس عام 2025.",
    ],
  },
};

export function getMetalSEO(slug: string, locale: string = "es"): MetalSEO | null {
  const base = METAL_SEO[slug];
  if (!base) return null;
  if (locale === "es") return base;
  if (locale === "ar") {
    const ar = METAL_SEO_AR[slug];
    if (ar) return { ...base, ...ar };
  }
  const en = METAL_SEO_EN[slug];
  if (!en) return base;
  return { ...base, ...en };
}
