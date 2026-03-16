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

const METAL_SEO_DE: Record<string, Omit<MetalSEO, "slug" | "symbol">> = {
  oro: {
    name: "Gold",
    fullName: "Gold (XAU/USD)",
    description:
      "Goldpreis heute in Echtzeit. Aktuelle XAU/USD-Kursnotierung, historisches Chart, Höchst- und Tiefststände sowie Goldmarktanalyse.",
    about:
      "Gold ist das am meisten gehandelte Edelmetall der Welt. Es wird als Wertaufbewahrungsmittel, Inflationsschutz und sicherer Hafen in Zeiten wirtschaftlicher Unsicherheit genutzt. Der Preis wird in US-Dollar pro Feinunze (31,1 Gramm) gemessen.",
    keywords: [
      "Goldpreis heute",
      "Goldkurs",
      "XAU/USD",
      "Gold Echtzeit",
      "in Gold investieren",
      "Goldpreis Unze",
    ],
    facts: [
      "Gold wird 24 Stunden am Tag, 5 Tage die Woche an globalen Märkten wie COMEX, LBMA und Shanghai Gold Exchange gehandelt.",
      "Zentralbanken halten etwa 36.000 Tonnen Gold in Reserven, wobei die USA mit über 8.000 Tonnen der größte Halter sind.",
      "Die Goldnachfrage kommt aus Schmuck (~50%), Investition (~25%), Zentralbanken (~15%) und Technologie (~10%).",
      "Das Gold/Silber-Verhältnis misst, wie viele Unzen Silber nötig sind, um eine Unze Gold zu kaufen. Historisch schwankt es zwischen 40x und 90x.",
    ],
  },
  plata: {
    name: "Silber",
    fullName: "Silber (XAG/USD)",
    description:
      "Silberpreis heute in Echtzeit. Aktuelle XAG/USD-Kursnotierung, historisches Chart, Höchst- und Tiefststände sowie Silbermarktanalyse.",
    about:
      "Silber ist ein Edelmetall mit dualem Profil: Es ist sowohl ein Anlagevermögen als auch ein unverzichtbarer Industriemetall. Es wird in Elektronik, Solarpanelen, Medizin und Schmuck verwendet. Seine Volatilität ist höher als die von Gold, was es bei Händlern beliebt macht.",
    keywords: [
      "Silberpreis heute",
      "Silberkurs",
      "XAG/USD",
      "Silber Echtzeit",
      "in Silber investieren",
      "Silberpreis Unze",
    ],
    facts: [
      "Silber hat die höchste elektrische und thermische Leitfähigkeit aller Metalle und ist in der Elektronik unverzichtbar.",
      "Die Solarindustrie verbraucht etwa 10% der jährlichen weltweiten Silberproduktion, eine Zahl, die jedes Jahr wächst.",
      "Mexiko, Peru und China sind die drei größten Silberproduzenten der Welt.",
      "Silber ist deutlich volatiler als Gold: Die täglichen Bewegungen sind typischerweise 1,5-2x größer in Prozent.",
    ],
  },
  platino: {
    name: "Platin",
    fullName: "Platin (XPT/USD)",
    description:
      "Platinpreis heute in Echtzeit. Aktuelle XPT/USD-Kursnotierung, historisches Chart, Höchst- und Tiefststände sowie Platinmarktanalyse.",
    about:
      "Platin ist ein seltenes Edelmetall mit starkem Industrieanteil. Es wird hauptsächlich in Auto-Katalysatoren, Schmuck, Medizintechnik und der chemischen Industrie verwendet. Sein Preis ist eng mit der Automobilindustrie und dem südafrikanischen Angebot verbunden.",
    keywords: [
      "Platinpreis heute",
      "Platinkurs",
      "XPT/USD",
      "Platin Echtzeit",
      "in Platin investieren",
      "Platinpreis Unze",
    ],
    facts: [
      "Südafrika produziert etwa 70% des weltweiten Platins, was den Preis anfällig für geopolitische Ereignisse in der Region macht.",
      "Platin ist 30-mal seltener als Gold in der Erdkruste.",
      "Die Automobilindustrie verbraucht etwa 40% der Platinnachfrage für Abgaskatalysatoren.",
      "Historisch handelte Platin über Gold. Die Umkehrung dieses Verhältnisses (Platin günstiger als Gold) ist ein relativ junges Phänomen.",
    ],
  },
  paladio: {
    name: "Palladium",
    fullName: "Palladium (XPD/USD)",
    description:
      "Palladiumpreis heute in Echtzeit. Aktuelle XPD/USD-Kursnotierung, historisches Chart, Höchst- und Tiefststände sowie Palladiummarktanalyse.",
    about:
      "Palladium ist ein Edelmetall der Platingruppe, stark nachgefragt von der Automobilindustrie für Benzin-Katalysatoren. Es wird auch in Elektronik, Zahnmedizin und Schmuck verwendet. Das Angebot ist begrenzt und konzentriert sich auf Russland und Südafrika.",
    keywords: [
      "Palladiumpreis heute",
      "Palladiumkurs",
      "XPD/USD",
      "Palladium Echtzeit",
      "in Palladium investieren",
      "Palladiumpreis Unze",
    ],
    facts: [
      "Russland produziert etwa 40% des weltweiten Palladiums, gefolgt von Südafrika mit 35%.",
      "Palladium wird hauptsächlich in Benzin-Auto-Katalysatoren verwendet und absorbiert über 80% der Nachfrage.",
      "2022 erreichte Palladium historische Höchststände über 3.000 $/oz aufgrund von Russland-Sanktionen und Angebotsknappheit.",
      "Palladium ist 15-mal seltener als Platin und 30-mal seltener als Gold in der Erdkruste.",
    ],
  },
  cobre: {
    name: "Kupfer",
    fullName: "Kupfer (HG/USD)",
    description:
      "Kupferpreis heute in Echtzeit. Aktuelle HG/USD-Kursnotierung, historisches Chart, Höchst- und Tiefststände sowie Kupfermarktanalyse.",
    about:
      "Kupfer ist das wichtigste Industriemetall der Welt. Es ist unerlässlich für Elektrifizierung, erneuerbare Energien, Elektrofahrzeuge und Bauwesen. Sein Preis gilt als Frühindikator der Weltwirtschaft, bekannt als „Doctor Copper“. Er wird in USD pro Pfund (lb) notiert.",
    keywords: [
      "Kupferpreis heute",
      "Kupferkurs",
      "HG/USD",
      "Kupfer Echtzeit",
      "in Kupfer investieren",
      "Kupferpreis Pfund",
    ],
    facts: [
      "Chile ist der größte Kupferproduzent der Welt und stellt etwa 25% der globalen Produktion.",
      "Kupfer ist für die Energiewende unerlässlich: Ein Elektrofahrzeug verbraucht 3-4 mal mehr Kupfer als ein konventionelles.",
      "Die Kupfernachfrage für KI-Rechenzentren ist seit 2024 exponentiell gewachsen.",
      "Die London Metal Exchange (LME) verzeichnete 2025 Rekordhandelsvolumen bei Kupfer.",
    ],
  },
};

const METAL_SEO_TR: Record<string, Omit<MetalSEO, "slug" | "symbol">> = {
  oro: {
    name: "Altın",
    fullName: "Altın (XAU/USD)",
    description:
      "Altın fiyatı bugün gerçek zamanlı. Güncel XAU/USD kotasyonu, tarihsel grafik, yüksek/düşük seviyeler ve altın piyasası analizi.",
    about:
      "Altın dünyada en çok işlem gören değerli metaldir. Değer saklama aracı, enflasyona karşı koruma ve ekonomik belirsizlik dönemlerinde güvenli liman varlığı olarak kullanılır. Fiyatı troy ons (31,1 gram) başına ABD doları cinsinden ölçülür.",
    keywords: [
      "altın fiyatı bugün",
      "altın kotasyonu",
      "XAU/USD",
      "altın gerçek zamanlı",
      "altına yatırım",
      "altın ons fiyatı",
    ],
    facts: [
      "Altın COMEX, LBMA ve Şangay Altın Borsası gibi küresel piyasalarda haftada 5 gün, günde 24 saat işlem görür.",
      "Merkez bankaları rezervlerinde yaklaşık 36.000 ton altın tutuyor; ABD 8.000 tonun üzeriyle en büyük sahip.",
      "Altın talebi mücevher (~%50), yatırım (~%25), merkez bankaları (~%15) ve teknoloji (~%10) kaynaklıdır.",
      "Altın/gümüş oranı bir ons altın almak için kaç ons gümüş gerektiğini ölçer. Tarihsel olarak 40x ile 90x arasında değişir.",
    ],
  },
  plata: {
    name: "Gümüş",
    fullName: "Gümüş (XAG/USD)",
    description:
      "Gümüş fiyatı bugün gerçek zamanlı. Güncel XAG/USD kotasyonu, tarihsel grafik, yüksek/düşük seviyeler ve gümüş piyasası analizi.",
    about:
      "Gümüş çift profilli bir değerli metaldir: hem yatırım varlığı hem de temel endüstriyel metal. Elektronik, güneş panelleri, tıp ve mücevheratta kullanılır. Volatilitesi altından yüksektir, bu da onu yatırımcılar için popüler bir seçenek yapar.",
    keywords: [
      "gümüş fiyatı bugün",
      "gümüş kotasyonu",
      "XAG/USD",
      "gümüş gerçek zamanlı",
      "gümüşe yatırım",
      "gümüş ons fiyatı",
    ],
    facts: [
      "Gümüş tüm metaller arasında en yüksek elektrik ve ısı iletkenliğine sahiptir; elektronikte vazgeçilmezdir.",
      "Güneş enerjisi sektörü dünya yıllık gümüş üretiminin yaklaşık %10'unu tüketir; bu oran her yıl artıyor.",
      "Meksika, Peru ve Çin dünyanın en büyük üç gümüş üreticisidir.",
      "Gümüş altından belirgin şekilde daha volatildir: günlük hareketleri genellikle yüzde olarak 1,5-2 kat daha büyüktür.",
    ],
  },
  platino: {
    name: "Platin",
    fullName: "Platin (XPT/USD)",
    description:
      "Platin fiyatı bugün gerçek zamanlı. Güncel XPT/USD kotasyonu, tarihsel grafik, yüksek/düşük seviyeler ve platin piyasası analizi.",
    about:
      "Platin güçlü endüstriyel bileşeni olan nadir bir değerli metaldir. Başlıca otomotiv katalizörlerinde, mücevheratta, tıbbi ekipmanlarda ve kimya sanayisinde kullanılır. Fiyatı otomotiv sektörüne ve Güney Afrika arzına sıkı bağlıdır.",
    keywords: [
      "platin fiyatı bugün",
      "platin kotasyonu",
      "XPT/USD",
      "platin gerçek zamanlı",
      "platine yatırım",
      "platin ons fiyatı",
    ],
    facts: [
      "Güney Afrika dünya platininin yaklaşık %70'ini üretir; bu da fiyatını bölgedeki jeopolitik olaylara duyarlı kılar.",
      "Platin yer kabuğunda altından 30 kat daha nadirdir.",
      "Otomotiv sektörü platin talebinin yaklaşık %40'ını emisyon katalizörleri için tüketir.",
      "Tarihsel olarak platin altının üzerinde işlem görürdü. Bu oranın tersine dönmesi (platin altından ucuz) nispeten yeni bir olgudur.",
    ],
  },
  paladio: {
    name: "Paladyum",
    fullName: "Paladyum (XPD/USD)",
    description:
      "Paladyum fiyatı bugün gerçek zamanlı. Güncel XPD/USD kotasyonu, tarihsel grafik, yüksek/düşük seviyeler ve paladyum piyasası analizi.",
    about:
      "Paladyum platin grubundan bir değerli metal olup benzinli araç katalizörleri için otomotiv sektörü tarafından yoğun talep görür. Elektronik, diş hekimliği ve mücevheratta da kullanılır. Arz sınırlıdır; Rusya ve Güney Afrika'da yoğunlaşmıştır.",
    keywords: [
      "paladyum fiyatı bugün",
      "paladyum kotasyonu",
      "XPD/USD",
      "paladyum gerçek zamanlı",
      "paladyuma yatırım",
      "paladyum ons fiyatı",
    ],
    facts: [
      "Rusya dünya paladyumunun yaklaşık %40'ını üretir; Güney Afrika %35 ile onu izler.",
      "Paladyum öncelikle benzinli araç katalizörlerinde kullanılır; talebin %80'inden fazlasını karşılar.",
      "2022'de Rusya yaptırımları ve arz kıtlığı nedeniyle paladyum 3.000$/ons üzerinde tarihi zirvelere ulaştı.",
      "Paladyum yer kabuğunda platinden 15 kat, altından 30 kat daha nadirdir.",
    ],
  },
  cobre: {
    name: "Bakır",
    fullName: "Bakır (HG/USD)",
    description:
      "Bakır fiyatı bugün gerçek zamanlı. Güncel HG/USD kotasyonu, tarihsel grafik, yüksek/düşük seviyeler ve bakır piyasası analizi.",
    about:
      "Bakır dünyanın en önemli endüstriyel metalidir. Elektrifikasyon, yenilenebilir enerji, elektrikli araçlar ve inşaat için vazgeçilmezdir. Fiyatı küresel ekonominin öncü göstergesi olarak kabul edilir; 'Doctor Copper' olarak bilinir. Libre (lb) başına USD cinsinden kotlanır.",
    keywords: [
      "bakır fiyatı bugün",
      "bakır kotasyonu",
      "HG/USD",
      "bakır gerçek zamanlı",
      "bakıra yatırım",
      "bakır libre fiyatı",
    ],
    facts: [
      "Şili dünyanın en büyük bakır üreticisidir; küresel üretimin yaklaşık %25'ini temsil eder.",
      "Bakır enerji dönüşümü için vazgeçilmezdir: bir elektrikli araç geleneksel olandan 3-4 kat daha fazla bakır kullanır.",
      "Yapay zeka veri merkezleri için bakır talebi 2024'ten bu yana katlanarak arttı.",
      "Londra Metal Borsası (LME) 2025'te bakır işlem hacminde rekor kaydetti.",
    ],
  },
};

const METAL_SEO_ZH: Record<string, Omit<MetalSEO, "slug" | "symbol">> = {
  oro: {
    name: "黄金",
    fullName: "黄金 (XAU/USD)",
    description: "黄金今日实时价格。XAU/USD 最新报价、历史图表、高低点及黄金市场分析。",
    about: "黄金是全球交易量最大的贵金属。作为价值储存、通胀对冲和避险资产，在经济不确定性时期备受青睐。价格以美元/金衡盎司（31.1克）计。",
    keywords: ["黄金价格今日", "黄金报价", "XAU/USD", "黄金实时", "投资黄金", "黄金盎司价格"],
    facts: [
      "黄金在全球市场（如COMEX、LBMA、上海黄金交易所）每周5天、每天24小时交易。",
      "各国央行持有约36,000吨黄金储备，美国为最大持有国，超过8,000吨。",
      "黄金需求来自珠宝（约50%）、投资（约25%）、央行（约15%）和科技（约10%）。",
      "金银比衡量购买一盎司黄金需要多少盎司白银。历史上在40倍至90倍之间波动。",
    ],
  },
  plata: {
    name: "白银",
    fullName: "白银 (XAG/USD)",
    description: "白银今日实时价格。XAG/USD 最新报价、历史图表、高低点及白银市场分析。",
    about: "白银具有双重属性：既是投资资产，也是重要的工业金属。用于电子、太阳能、医疗和珠宝。其波动性高于黄金，深受交易者青睐。",
    keywords: ["白银价格今日", "白银报价", "XAG/USD", "白银实时", "投资白银", "白银盎司价格"],
    facts: [
      "白银在所有金属中导电性和导热性最高，是电子行业不可或缺的材料。",
      "太阳能行业每年消耗全球白银产量的约10%，且逐年增长。",
      "墨西哥、秘鲁和中国是全球三大白银生产国。",
      "白银波动性显著高于黄金：日波动幅度通常为黄金的1.5-2倍。",
    ],
  },
  platino: {
    name: "铂金",
    fullName: "铂金 (XPT/USD)",
    description: "铂金今日实时价格。XPT/USD 最新报价、历史图表、高低点及铂金市场分析。",
    about: "铂金是稀有的贵金属，工业用途广泛。主要用于汽车催化转化器、珠宝、医疗设备和化工。价格与汽车行业及南非供应密切相关。",
    keywords: ["铂金价格今日", "铂金报价", "XPT/USD", "铂金实时", "投资铂金", "铂金盎司价格"],
    facts: [
      "南非产量约占全球铂金的70%，价格对当地地缘政治事件敏感。",
      "铂金在地壳中的稀有度是黄金的30倍。",
      "汽车行业消耗约40%的铂金需求用于排放催化转化器。",
      "历史上铂金价格高于黄金。铂金低于黄金的现象是相对近期才出现的。",
    ],
  },
  paladio: {
    name: "钯金",
    fullName: "钯金 (XPD/USD)",
    description: "钯金今日实时价格。XPD/USD 最新报价、历史图表、高低点及钯金市场分析。",
    about: "钯金是铂族贵金属，汽车行业对汽油催化转化器需求旺盛。也用于电子、牙科和珠宝。供应有限，集中在俄罗斯和南非。",
    keywords: ["钯金价格今日", "钯金报价", "XPD/USD", "钯金实时", "投资钯金", "钯金盎司价格"],
    facts: [
      "俄罗斯产量约占全球钯金的40%，南非约占35%。",
      "钯金主要用于汽油车催化转化器，占需求80%以上。",
      "2022年因对俄制裁和供应短缺，钯金创下每盎司3,000美元以上的历史新高。",
      "钯金在地壳中的稀有度是铂金的15倍、黄金的30倍。",
    ],
  },
  cobre: {
    name: "铜",
    fullName: "铜 (HG/USD)",
    description: "铜今日实时价格。HG/USD 最新报价、历史图表、高低点及铜市场分析。",
    about: "铜是全球最重要的工业金属。对电气化、可再生能源、电动汽车和建筑业至关重要。其价格被视为全球经济领先指标，素有「铜博士」之称。以美元/磅报价。",
    keywords: ["铜价格今日", "铜报价", "HG/USD", "铜实时", "投资铜", "铜磅价格"],
    facts: [
      "智利是全球最大铜生产国，约占全球产量的25%。",
      "铜对能源转型至关重要：电动汽车用铜量是传统汽车的3-4倍。",
      "自2024年以来，人工智能数据中心对铜的需求呈指数级增长。",
      "伦敦金属交易所（LME）2025年铜交易量创历史纪录。",
    ],
  },
};

export function getMetalSEO(slug: string, locale: string = "es"): MetalSEO | null {
  const base = METAL_SEO[slug];
  if (!base) return null;
  if (locale === "es") return base;
  const localeMap: Record<string, Record<string, Omit<MetalSEO, "slug" | "symbol">>> = {
    ar: METAL_SEO_AR,
    de: METAL_SEO_DE,
    tr: METAL_SEO_TR,
    zh: METAL_SEO_ZH,
  };
  const localized = localeMap[locale]?.[slug];
  if (localized) return { ...base, ...localized };
  const en = METAL_SEO_EN[slug];
  if (!en) return base;
  return { ...base, ...en };
}
