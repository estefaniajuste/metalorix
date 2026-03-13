interface GlossaryTerm {
  term: string;
  id: string;
  definition: string;
  related?: string[];
}

const glossaryData: Record<string, GlossaryTerm[]> = {
  es: [
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
  ],

  en: [
    {
      term: "Spot Price",
      id: "precio-spot",
      definition:
        "The current market price at which a precious metal can be bought or sold for immediate delivery. It is the reference price shown on Metalorix and is updated continuously during market hours.",
      related: ["precio-spot-vs-futures"],
    },
    {
      term: "Troy Ounce",
      id: "onza-troy",
      definition:
        "The standard unit of measurement for precious metals. It equals 31.1035 grams (not to be confused with the avoirdupois ounce of 28.35 g). All international gold, silver, and platinum prices are quoted per troy ounce.",
    },
    {
      term: "XAU",
      id: "xau",
      definition:
        'ISO 4217 code for gold. The X indicates it is not a country\'s currency, and AU comes from the Latin "aurum." XAU/USD is the pair representing the price of one troy ounce of gold in US dollars.',
      related: ["xag", "xpt"],
    },
    {
      term: "XAG",
      id: "xag",
      definition:
        'ISO 4217 code for silver. AG comes from the Latin "argentum." XAG/USD represents the price of one troy ounce of silver in US dollars.',
      related: ["xau", "xpt"],
    },
    {
      term: "XPT",
      id: "xpt",
      definition:
        'ISO 4217 code for platinum. PT from the Latin "platinum." XPT/USD represents the price of one troy ounce of platinum in US dollars.',
      related: ["xau", "xag"],
    },
    {
      term: "Gold/Silver Ratio",
      id: "ratio-oro-plata",
      definition:
        "Indicates how many ounces of silver are needed to buy one ounce of gold. Calculated by dividing the gold price by the silver price. A high ratio (>70) suggests silver is relatively cheap; a low ratio (<50) suggests it is relatively expensive. The historical average over the last 20 years is approximately 65x.",
    },
    {
      term: "LBMA",
      id: "lbma",
      definition:
        'London Bullion Market Association. The organization that oversees the world\'s largest precious metals market, headquartered in London. It sets the "Good Delivery" standards for bars and conducts gold and silver price fixings twice daily.',
    },
    {
      term: "COMEX",
      id: "comex",
      definition:
        "Commodity Exchange, a division of the CME Group in New York. It is the world's primary gold and silver futures market. Gold futures contracts on COMEX are for 100 troy ounces.",
    },
    {
      term: "Spot Price vs Futures",
      id: "precio-spot-vs-futures",
      definition:
        'The spot price is for immediate delivery; the futures price is a contract to buy or sell at an agreed price on a future date. The difference between the two is called "contango" (futures more expensive) or "backwardation" (futures cheaper).',
      related: ["precio-spot"],
    },
    {
      term: "Ingot (Bar)",
      id: "lingote",
      definition:
        "A piece of precious metal cast in bar form. Standard gold bars (Good Delivery) weigh approximately 400 troy ounces (~12.4 kg). Smaller bars of 1 oz, 10 oz, 1 kg, etc. are also available for individual investors.",
    },
    {
      term: "Bullion",
      id: "bullion",
      definition:
        'Precious metals in the form of bars or coins valued for their metal content rather than numismatic value. "Gold bullion" refers to investment-grade gold.',
    },
    {
      term: "Premium",
      id: "premium",
      definition:
        "The difference between the price of a physical product (coin, bar) and the spot price of the metal it contains. It includes manufacturing, distribution, and dealer margin costs. Coins typically carry higher premiums than bars.",
    },
    {
      term: "DCA (Dollar Cost Averaging)",
      id: "dca",
      definition:
        "An investment strategy that involves buying a fixed amount in currency on a regular basis (monthly, weekly), regardless of price. It reduces the impact of volatility and the risk of buying at an unfavorable time.",
    },
    {
      term: "Safe Haven Asset",
      id: "activo-refugio",
      definition:
        "An investment expected to maintain or increase its value during periods of economic uncertainty or market turbulence. Gold is the quintessential safe haven asset, along with treasury bonds and the Swiss franc.",
    },
    {
      term: "Fixing",
      id: "fixing",
      definition:
        "The reference price-setting process conducted by the LBMA twice daily (AM and PM) for gold, and once daily for silver and platinum. These prices are used as benchmarks in contracts, ETFs, and institutional transactions.",
      related: ["lbma"],
    },
    {
      term: "Gold ETF",
      id: "etf-oro",
      definition:
        "An exchange-traded fund backed by physical gold. It allows investing in gold without physically owning it. The largest is SPDR Gold Shares (GLD). Each share represents a fraction of an ounce of gold stored in vaults.",
    },
    {
      term: "Fineness (Purity)",
      id: "ley-pureza",
      definition:
        "The proportion of pure metal in an alloy. Expressed in thousandths: 999.9 fine gold (24 karats) is 99.99% pure gold. Investment coins like the Krugerrand have 916.7 fineness (22 karats).",
    },
    {
      term: "Karat",
      id: "quilate",
      definition:
        "A unit of gold purity. 24 karats = pure gold (999.9‰). 18 karats = 75% gold. Not to be confused with the carat for gemstones (a unit of weight = 0.2 grams). In jewelry, 18K gold (750‰) is frequently used.",
      related: ["ley-pureza"],
    },
    {
      term: "Spread",
      id: "spread",
      definition:
        "The difference between the buy price (bid) and the sell price (ask) of a precious metal. The smaller the spread, the greater the market liquidity. Gold has tighter spreads than platinum.",
    },
    {
      term: "Gold Reserves",
      id: "reservas-oro",
      definition:
        "The amount of gold held by central banks as part of their monetary reserves. The US leads with over 8,000 tonnes, followed by Germany, Italy, and France. Central banks have been net buyers of gold since 2010.",
    },
  ],

  zh: [
    {
      term: "现货价格",
      id: "precio-spot",
      definition:
        "贵金属可以在市场上即时买卖的当前价格。它是Metalorix上显示的参考价格，在交易时段内持续更新。",
      related: ["precio-spot-vs-futures"],
    },
    {
      term: "金衡盎司",
      id: "onza-troy",
      definition:
        "贵金属的标准计量单位，等于31.1035克（不要与常衡盎司28.35克混淆）。所有国际黄金、白银和铂金价格均以金衡盎司报价。",
    },
    {
      term: "XAU",
      id: "xau",
      definition:
        "黄金的ISO 4217代码。X表示它不是某个国家的货币，AU来自拉丁语「aurum」。XAU/USD是代表一金衡盎司黄金以美元计价的货币对。",
      related: ["xag", "xpt"],
    },
    {
      term: "XAG",
      id: "xag",
      definition:
        "白银的ISO 4217代码。AG来自拉丁语「argentum」。XAG/USD代表一金衡盎司白银以美元计价的价格。",
      related: ["xau", "xpt"],
    },
    {
      term: "XPT",
      id: "xpt",
      definition:
        "铂金的ISO 4217代码。PT来自拉丁语「platinum」。XPT/USD代表一金衡盎司铂金以美元计价的价格。",
      related: ["xau", "xag"],
    },
    {
      term: "金银比",
      id: "ratio-oro-plata",
      definition:
        "表示需要多少盎司白银才能购买一盎司黄金。通过将黄金价格除以白银价格计算得出。高比率（>70）表明白银相对便宜；低比率（<50）表明白银相对昂贵。过去20年的历史平均值约为65倍。",
    },
    {
      term: "LBMA",
      id: "lbma",
      definition:
        "伦敦金银市场协会。监管全球最大贵金属市场的组织，总部位于伦敦。制定金条的「合格交割」标准，每天两次进行黄金和白银的定盘价。",
    },
    {
      term: "COMEX",
      id: "comex",
      definition:
        "商品交易所，纽约CME集团的一个部门。是全球主要的黄金和白银期货市场。COMEX的黄金期货合约为100金衡盎司。",
    },
    {
      term: "现货价格与期货价格",
      id: "precio-spot-vs-futures",
      definition:
        "现货价格用于即时交割；期货价格是在未来日期以约定价格买卖的合约。两者之间的差价称为「正价差」（期货更贵）或「逆价差」（期货更便宜）。",
      related: ["precio-spot"],
    },
    {
      term: "金条",
      id: "lingote",
      definition:
        "铸造成条状的贵金属块。标准金条（合格交割）重约400金衡盎司（约12.4公斤）。也有1盎司、10盎司、1公斤等较小规格的金条供个人投资者购买。",
    },
    {
      term: "金银条块",
      id: "bullion",
      definition:
        "指以条块或硬币形式存在的贵金属，按其金属含量定价（而非收藏价值）。Gold bullion即投资级黄金。",
    },
    {
      term: "溢价",
      id: "premium",
      definition:
        "实物产品（硬币、金条）价格与其所含金属现货价格之间的差额。包括制造、分销和经销商利润成本。硬币的溢价通常高于金条。",
    },
    {
      term: "DCA（定期定额投资）",
      id: "dca",
      definition:
        "一种投资策略，即定期（每月、每周）购买固定金额的资产，不论价格如何。它降低了波动性的影响以及在不利时机买入的风险。",
    },
    {
      term: "避险资产",
      id: "activo-refugio",
      definition:
        "预期在经济不确定性或市场动荡期间能保持或增加其价值的投资。黄金是最典型的避险资产，与国债和瑞士法郎齐名。",
    },
    {
      term: "定盘价",
      id: "fixing",
      definition:
        "LBMA每天两次（上午和下午）对黄金进行的参考价格确定过程，白银和铂金每天一次。这些价格用作合约、ETF和机构交易的基准。",
      related: ["lbma"],
    },
    {
      term: "黄金ETF",
      id: "etf-oro",
      definition:
        "以实物黄金为支撑的交易所交易基金。允许投资黄金而无需实际持有。最大的是SPDR Gold Shares（GLD）。每股代表存储在金库中的一小部分黄金。",
    },
    {
      term: "成色（纯度）",
      id: "ley-pureza",
      definition:
        "合金中纯金属的比例。以千分比表示：999.9成色的黄金（24K）纯度为99.99%。克鲁格金币等投资金币的成色为916.7（22K）。",
    },
    {
      term: "开（K）",
      id: "quilate",
      definition:
        "黄金纯度单位。24K = 纯金（999.9‰）。18K = 75%黄金。不要与宝石的克拉（重量单位 = 0.2克）混淆。珠宝中常用18K黄金（750‰）。",
      related: ["ley-pureza"],
    },
    {
      term: "价差",
      id: "spread",
      definition:
        "贵金属买入价（bid）和卖出价（ask）之间的差额。价差越小，市场流动性越强。黄金的价差比铂金更窄。",
    },
    {
      term: "黄金储备",
      id: "reservas-oro",
      definition:
        "各国央行作为货币储备持有的黄金数量。美国以超过8000吨位居首位，其次是德国、意大利和法国。自2010年以来，各国央行一直是黄金的净买家。",
    },
  ],

  ar: [
    {
      term: "السعر الفوري",
      id: "precio-spot",
      definition:
        "السعر السوقي الحالي الذي يمكن عنده شراء أو بيع معدن ثمين للتسليم الفوري. هو السعر المرجعي المعروض في Metalorix ويتم تحديثه باستمرار خلال ساعات السوق.",
      related: ["precio-spot-vs-futures"],
    },
    {
      term: "أونصة تروي",
      id: "onza-troy",
      definition:
        "وحدة القياس المعيارية للمعادن الثمينة. تساوي 31.1035 غرامًا (لا تخلط بينها وبين الأونصة العادية البالغة 28.35 غرامًا). جميع أسعار الذهب والفضة والبلاتين الدولية مقومة بأونصة تروي.",
    },
    {
      term: "XAU",
      id: "xau",
      definition:
        "رمز ISO 4217 للذهب. يشير الحرف X إلى أنه ليس عملة دولة، وAU مأخوذ من اللاتينية «aurum». XAU/USD هو الزوج الذي يمثل سعر أونصة تروي واحدة من الذهب بالدولار الأمريكي.",
      related: ["xag", "xpt"],
    },
    {
      term: "XAG",
      id: "xag",
      definition:
        "رمز ISO 4217 للفضة. AG مأخوذ من اللاتينية «argentum». XAG/USD يمثل سعر أونصة تروي واحدة من الفضة بالدولار.",
      related: ["xau", "xpt"],
    },
    {
      term: "XPT",
      id: "xpt",
      definition:
        "رمز ISO 4217 للبلاتين. PT من اللاتينية «platinum». XPT/USD يمثل سعر أونصة تروي واحدة من البلاتين بالدولار.",
      related: ["xau", "xag"],
    },
    {
      term: "نسبة الذهب/الفضة",
      id: "ratio-oro-plata",
      definition:
        "تشير إلى عدد أونصات الفضة اللازمة لشراء أونصة واحدة من الذهب. تُحسب بقسمة سعر الذهب على سعر الفضة. نسبة مرتفعة (>70) تشير إلى أن الفضة رخيصة نسبيًا؛ نسبة منخفضة (<50) تشير إلى أنها غالية نسبيًا. المتوسط التاريخي خلال السنوات العشرين الأخيرة حوالي 65 ضعفًا.",
    },
    {
      term: "LBMA",
      id: "lbma",
      definition:
        "رابطة سوق لندن للسبائك. منظمة تشرف على أكبر سوق للمعادن الثمينة في العالم، ومقرها لندن. تضع معايير «التسليم الصالح» للسبائك وتجري تثبيت أسعار الذهب والفضة مرتين يوميًا.",
    },
    {
      term: "COMEX",
      id: "comex",
      definition:
        "بورصة السلع، قسم من مجموعة CME في نيويورك. هي السوق الرئيسي لعقود الذهب والفضة الآجلة في العالم. عقود الذهب الآجلة في COMEX تبلغ 100 أونصة تروي.",
    },
    {
      term: "السعر الفوري مقابل العقود الآجلة",
      id: "precio-spot-vs-futures",
      definition:
        "السعر الفوري للتسليم الفوري؛ سعر العقود الآجلة هو عقد للشراء أو البيع بسعر متفق عليه في تاريخ مستقبلي. يُسمى الفرق بينهما «كونتانغو» (العقود الآجلة أغلى) أو «باكووردايشن» (العقود الآجلة أرخص).",
      related: ["precio-spot"],
    },
    {
      term: "سبيكة",
      id: "lingote",
      definition:
        "قطعة من المعدن الثمين مصبوبة على شكل قضيب. تزن سبائك الذهب المعيارية (التسليم الصالح) حوالي 400 أونصة تروي (~12.4 كغ). تتوفر أيضًا سبائك أصغر بأوزان 1 أونصة و10 أونصات و1 كغ وغيرها للمستثمرين الأفراد.",
    },
    {
      term: "بوليون",
      id: "bullion",
      definition:
        "مصطلح يشير إلى المعادن الثمينة على شكل سبائك أو عملات تُقيّم بمحتواها المعدني وليس بقيمتها النقدية التاريخية. «Gold bullion» = ذهب استثماري.",
    },
    {
      term: "العلاوة",
      id: "premium",
      definition:
        "الفرق بين سعر المنتج المادي (عملة، سبيكة) والسعر الفوري للمعدن الذي يحتويه. تشمل تكاليف التصنيع والتوزيع وهامش البائع. عادةً ما تكون علاوات العملات أعلى من السبائك.",
    },
    {
      term: "DCA (متوسط تكلفة الدولار)",
      id: "dca",
      definition:
        "استراتيجية استثمارية تتضمن شراء مبلغ ثابت بشكل دوري (شهريًا أو أسبوعيًا)، بغض النظر عن السعر. تقلل من تأثير التقلبات ومخاطر الشراء في وقت غير مناسب.",
    },
    {
      term: "أصل الملاذ الآمن",
      id: "activo-refugio",
      definition:
        "استثمار يُتوقع أن يحافظ على قيمته أو يزيدها في فترات عدم اليقين الاقتصادي أو اضطرابات الأسواق. الذهب هو أصل الملاذ الآمن بامتياز، إلى جانب سندات الخزانة والفرنك السويسري.",
    },
    {
      term: "التثبيت",
      id: "fixing",
      definition:
        "عملية تحديد السعر المرجعي التي تجريها LBMA مرتين يوميًا (صباحًا ومساءً) للذهب، ومرة يوميًا للفضة والبلاتين. تُستخدم هذه الأسعار كمرجع في العقود وصناديق ETF والمعاملات المؤسسية.",
      related: ["lbma"],
    },
    {
      term: "صندوق ETF للذهب",
      id: "etf-oro",
      definition:
        "صندوق متداول في البورصة مدعوم بالذهب المادي. يتيح الاستثمار في الذهب دون امتلاكه فعليًا. أكبرها SPDR Gold Shares (GLD). يمثل كل سهم جزءًا من أونصة ذهب مخزنة في خزائن.",
    },
    {
      term: "العيار (النقاء)",
      id: "ley-pureza",
      definition:
        "نسبة المعدن النقي في السبيكة. يُعبّر عنها بالألف: ذهب عيار 999.9 (24 قيراطًا) هو ذهب نقي بنسبة 99.99%. عملات الاستثمار مثل الكروغراند عيارها 916.7 (22 قيراطًا).",
    },
    {
      term: "قيراط",
      id: "quilate",
      definition:
        "وحدة لقياس نقاء الذهب. 24 قيراطًا = ذهب نقي (999.9‰). 18 قيراطًا = 75% ذهب. لا تخلط مع قيراط الأحجار الكريمة (وحدة وزن = 0.2 غرام). يُستخدم في المجوهرات عادةً ذهب عيار 18 قيراطًا (750‰).",
      related: ["ley-pureza"],
    },
    {
      term: "السبريد (الفارق)",
      id: "spread",
      definition:
        "الفرق بين سعر الشراء (bid) وسعر البيع (ask) للمعدن الثمين. كلما كان السبريد أصغر، زادت سيولة السوق. الذهب يتمتع بفروقات أضيق من البلاتين.",
    },
    {
      term: "احتياطيات الذهب",
      id: "reservas-oro",
      definition:
        "كمية الذهب التي تمتلكها البنوك المركزية كجزء من احتياطياتها النقدية. تتصدر الولايات المتحدة بأكثر من 8,000 طن، تليها ألمانيا وإيطاليا وفرنسا. كانت البنوك المركزية مشترية صافية للذهب منذ عام 2010.",
    },
  ],

  tr: [
    {
      term: "Spot Fiyat",
      id: "precio-spot",
      definition:
        "Kıymetli bir metalin anlık teslimat için alınıp satılabileceği güncel piyasa fiyatı. Metalorix'te gösterilen referans fiyattır ve piyasa saatleri boyunca sürekli güncellenir.",
      related: ["precio-spot-vs-futures"],
    },
    {
      term: "Troy Ons",
      id: "onza-troy",
      definition:
        "Kıymetli metaller için standart ölçü birimi. 31,1035 grama eşittir (28,35 gramlık avoirdupois ons ile karıştırılmamalıdır). Tüm uluslararası altın, gümüş ve platin fiyatları troy ons başına kote edilir.",
    },
    {
      term: "XAU",
      id: "xau",
      definition:
        "Altının ISO 4217 kodu. X harfi bir ülke para birimi olmadığını belirtir, AU ise Latince «aurum» kelimesinden gelir. XAU/USD, bir troy ons altının ABD doları cinsinden fiyatını temsil eden paritedir.",
      related: ["xag", "xpt"],
    },
    {
      term: "XAG",
      id: "xag",
      definition:
        "Gümüşün ISO 4217 kodu. AG, Latince «argentum» kelimesinden gelir. XAG/USD, bir troy ons gümüşün dolar cinsinden fiyatını temsil eder.",
      related: ["xau", "xpt"],
    },
    {
      term: "XPT",
      id: "xpt",
      definition:
        "Platinin ISO 4217 kodu. PT, Latince «platinum» kelimesinden gelir. XPT/USD, bir troy ons platinin dolar cinsinden fiyatını temsil eder.",
      related: ["xau", "xag"],
    },
    {
      term: "Altın/Gümüş Oranı",
      id: "ratio-oro-plata",
      definition:
        "Bir ons altın satın almak için kaç ons gümüş gerektiğini gösterir. Altın fiyatının gümüş fiyatına bölünmesiyle hesaplanır. Yüksek oran (>70) gümüşün görece ucuz olduğunu, düşük oran (<50) görece pahalı olduğunu gösterir. Son 20 yılın tarihsel ortalaması yaklaşık 65 kattır.",
    },
    {
      term: "LBMA",
      id: "lbma",
      definition:
        "Londra Külçe Piyasası Birliği. Londra merkezli, dünyanın en büyük kıymetli metaller piyasasını denetleyen kuruluş. Külçeler için «Good Delivery» standartlarını belirler ve günde iki kez altın ve gümüş fiyat tespiti (fixing) yapar.",
    },
    {
      term: "COMEX",
      id: "comex",
      definition:
        "New York'taki CME Group'un bir bölümü olan Emtia Borsası. Dünyanın başlıca altın ve gümüş vadeli işlem piyasasıdır. COMEX'teki altın vadeli işlem sözleşmeleri 100 troy onsluktur.",
    },
    {
      term: "Spot Fiyat ve Vadeli İşlemler",
      id: "precio-spot-vs-futures",
      definition:
        "Spot fiyat anlık teslimat içindir; vadeli fiyat ise gelecekteki bir tarihte üzerinde anlaşılan bir fiyattan alım veya satım sözleşmesidir. İkisi arasındaki farka «contango» (vadeli işlemler daha pahalı) veya «backwardation» (vadeli işlemler daha ucuz) denir.",
      related: ["precio-spot"],
    },
    {
      term: "Külçe",
      id: "lingote",
      definition:
        "Çubuk şeklinde dökülmüş kıymetli metal parçası. Standart altın külçeleri (Good Delivery) yaklaşık 400 troy ons (~12,4 kg) ağırlığındadır. Bireysel yatırımcılar için 1 ons, 10 ons, 1 kg gibi daha küçük külçeler de mevcuttur.",
    },
    {
      term: "Bullion",
      id: "bullion",
      definition:
        "Kıymetli metallerin, metal içerikleriyle değerlendirilen külçe veya madeni para formundaki halini ifade eden terim (nümizmatik değeri değil). «Gold bullion» = yatırım amaçlı altın.",
    },
    {
      term: "Prim",
      id: "premium",
      definition:
        "Fiziksel bir ürünün (madeni para, külçe) fiyatı ile içerdiği metalin spot fiyatı arasındaki fark. Üretim, dağıtım ve satıcı marjı maliyetlerini içerir. Madeni paraların primleri genellikle külçelerden daha yüksektir.",
    },
    {
      term: "DCA (Düzenli Yatırım Stratejisi)",
      id: "dca",
      definition:
        "Fiyattan bağımsız olarak düzenli aralıklarla (aylık, haftalık) sabit bir tutarda yatırım yapmayı içeren strateji. Oynaklığın etkisini ve olumsuz bir zamanda satın alma riskini azaltır.",
    },
    {
      term: "Güvenli Liman Varlığı",
      id: "activo-refugio",
      definition:
        "Ekonomik belirsizlik veya piyasa çalkantısı dönemlerinde değerini koruması veya artırması beklenen yatırım. Altın, hazine bonoları ve İsviçre frangı ile birlikte en bilinen güvenli liman varlığıdır.",
    },
    {
      term: "Fixing",
      id: "fixing",
      definition:
        "LBMA tarafından altın için günde iki kez (sabah ve öğleden sonra), gümüş ve platin için günde bir kez yapılan referans fiyat belirleme süreci. Bu fiyatlar sözleşmelerde, ETF'lerde ve kurumsal işlemlerde referans olarak kullanılır.",
      related: ["lbma"],
    },
    {
      term: "Altın ETF'si",
      id: "etf-oro",
      definition:
        "Fiziksel altınla desteklenen borsada işlem gören fon. Altına fiziksel olarak sahip olmadan yatırım yapmayı sağlar. En büyüğü SPDR Gold Shares (GLD)'dir. Her hisse, kasalarda saklanan bir ons altının bir bölümünü temsil eder.",
    },
    {
      term: "Ayar (Saflık)",
      id: "ley-pureza",
      definition:
        "Bir alaşımdaki saf metal oranı. Binde olarak ifade edilir: 999,9 ayar altın (24 karat) %99,99 saf altındır. Krugerrand gibi yatırım sikkeleri 916,7 ayardır (22 karat).",
    },
    {
      term: "Karat",
      id: "quilate",
      definition:
        "Altın saflık birimi. 24 karat = saf altın (999,9‰). 18 karat = %75 altın. Değerli taşlar için kullanılan karat (ağırlık birimi = 0,2 gram) ile karıştırılmamalıdır. Kuyumculukta sıklıkla 18 ayar altın (750‰) kullanılır.",
      related: ["ley-pureza"],
    },
    {
      term: "Spread (Fark)",
      id: "spread",
      definition:
        "Kıymetli bir metalin alış fiyatı (bid) ile satış fiyatı (ask) arasındaki fark. Spread ne kadar küçükse, piyasa likiditesi o kadar yüksektir. Altının spreadleri platinden daha dardır.",
    },
    {
      term: "Altın Rezervleri",
      id: "reservas-oro",
      definition:
        "Merkez bankalarının parasal rezervlerinin bir parçası olarak tuttukları altın miktarı. ABD 8.000 tonun üzerinde ile başı çekerken, onu Almanya, İtalya ve Fransa izler. Merkez bankaları 2010'dan bu yana altının net alıcısı olmuştur.",
    },
  ],

  de: [
    {
      term: "Spotpreis",
      id: "precio-spot",
      definition:
        "Der aktuelle Marktpreis, zu dem ein Edelmetall für sofortige Lieferung gekauft oder verkauft werden kann. Er ist der auf Metalorix angezeigte Referenzpreis und wird während der Handelszeiten kontinuierlich aktualisiert.",
      related: ["precio-spot-vs-futures"],
    },
    {
      term: "Feinunze (Troy Ounce)",
      id: "onza-troy",
      definition:
        "Die Standardmaßeinheit für Edelmetalle. Sie entspricht 31,1035 Gramm (nicht zu verwechseln mit der Avoirdupois-Unze von 28,35 g). Alle internationalen Gold-, Silber- und Platinpreise werden pro Feinunze notiert.",
    },
    {
      term: "XAU",
      id: "xau",
      definition:
        "ISO 4217-Code für Gold. Das X zeigt an, dass es sich nicht um eine Landeswährung handelt, und AU stammt vom lateinischen «aurum». XAU/USD ist das Währungspaar, das den Preis einer Feinunze Gold in US-Dollar darstellt.",
      related: ["xag", "xpt"],
    },
    {
      term: "XAG",
      id: "xag",
      definition:
        "ISO 4217-Code für Silber. AG kommt vom lateinischen «argentum». XAG/USD stellt den Preis einer Feinunze Silber in US-Dollar dar.",
      related: ["xau", "xpt"],
    },
    {
      term: "XPT",
      id: "xpt",
      definition:
        "ISO 4217-Code für Platin. PT vom lateinischen «platinum». XPT/USD stellt den Preis einer Feinunze Platin in US-Dollar dar.",
      related: ["xau", "xag"],
    },
    {
      term: "Gold/Silber-Verhältnis",
      id: "ratio-oro-plata",
      definition:
        "Gibt an, wie viele Unzen Silber benötigt werden, um eine Unze Gold zu kaufen. Berechnet durch Division des Goldpreises durch den Silberpreis. Ein hohes Verhältnis (>70) deutet darauf hin, dass Silber relativ günstig ist; ein niedriges (<50) deutet darauf hin, dass es relativ teuer ist. Der historische Durchschnitt der letzten 20 Jahre liegt bei etwa 65x.",
    },
    {
      term: "LBMA",
      id: "lbma",
      definition:
        "London Bullion Market Association. Organisation, die den weltweit größten Edelmetallmarkt mit Sitz in London beaufsichtigt. Sie legt die «Good Delivery»-Standards für Barren fest und führt zweimal täglich Gold- und Silber-Preisfixings durch.",
    },
    {
      term: "COMEX",
      id: "comex",
      definition:
        "Commodity Exchange, eine Abteilung der CME Group in New York. Der wichtigste Gold- und Silber-Terminmarkt der Welt. Gold-Futures-Kontrakte an der COMEX lauten auf 100 Feinunzen.",
    },
    {
      term: "Spotpreis vs. Futures",
      id: "precio-spot-vs-futures",
      definition:
        "Der Spotpreis gilt für sofortige Lieferung; der Futures-Preis ist ein Vertrag zum Kauf oder Verkauf zu einem vereinbarten Preis an einem zukünftigen Datum. Der Unterschied wird als «Contango» (Futures teurer) oder «Backwardation» (Futures günstiger) bezeichnet.",
      related: ["precio-spot"],
    },
    {
      term: "Barren",
      id: "lingote",
      definition:
        "Ein in Barrenform gegossenes Stück Edelmetall. Standard-Goldbarren (Good Delivery) wiegen ca. 400 Feinunzen (~12,4 kg). Für Privatanleger gibt es auch kleinere Barren zu 1 oz, 10 oz, 1 kg usw.",
    },
    {
      term: "Bullion",
      id: "bullion",
      definition:
        "Englischer Begriff für Edelmetalle in Form von Barren oder Münzen, die nach ihrem Metallgehalt bewertet werden (nicht nach numismatischem Wert). «Gold Bullion» = Anlagegold.",
    },
    {
      term: "Aufgeld (Premium)",
      id: "premium",
      definition:
        "Die Differenz zwischen dem Preis eines physischen Produkts (Münze, Barren) und dem Spotpreis des enthaltenen Metalls. Umfasst Herstellungs-, Vertriebs- und Händlermargenkosten. Münzen haben in der Regel höhere Aufgelder als Barren.",
    },
    {
      term: "DCA (Durchschnittskosteneffekt)",
      id: "dca",
      definition:
        "Eine Anlagestrategie, bei der regelmäßig (monatlich, wöchentlich) ein fester Betrag investiert wird, unabhängig vom Preis. Reduziert die Auswirkungen der Volatilität und das Risiko, zu einem ungünstigen Zeitpunkt zu kaufen.",
    },
    {
      term: "Sicherer Hafen",
      id: "activo-refugio",
      definition:
        "Eine Anlage, von der erwartet wird, dass sie in Zeiten wirtschaftlicher Unsicherheit oder Marktturbulenzen ihren Wert behält oder steigert. Gold ist der sichere Hafen schlechthin, zusammen mit Staatsanleihen und dem Schweizer Franken.",
    },
    {
      term: "Fixing",
      id: "fixing",
      definition:
        "Der von der LBMA zweimal täglich (vormittags und nachmittags) für Gold und einmal täglich für Silber und Platin durchgeführte Referenzpreisfeststellungsprozess. Diese Preise dienen als Referenz in Verträgen, ETFs und institutionellen Transaktionen.",
      related: ["lbma"],
    },
    {
      term: "Gold-ETF",
      id: "etf-oro",
      definition:
        "Ein börsengehandelter Fonds, der durch physisches Gold gedeckt ist. Ermöglicht Investitionen in Gold, ohne es physisch besitzen zu müssen. Der größte ist SPDR Gold Shares (GLD). Jede Aktie repräsentiert einen Bruchteil einer Unze Gold, die in Tresoren gelagert wird.",
    },
    {
      term: "Feingehalt (Reinheit)",
      id: "ley-pureza",
      definition:
        "Der Anteil reinen Metalls in einer Legierung. Ausgedrückt in Tausendstel: Gold mit 999,9 Tausendstel (24 Karat) ist zu 99,99 % reines Gold. Anlagemünzen wie der Krugerrand haben 916,7 Tausendstel (22 Karat).",
    },
    {
      term: "Karat",
      id: "quilate",
      definition:
        "Maßeinheit für die Reinheit von Gold. 24 Karat = reines Gold (999,9‰). 18 Karat = 75 % Gold. Nicht zu verwechseln mit dem Karat für Edelsteine (Gewichtseinheit = 0,2 Gramm). In der Schmuckherstellung wird häufig 18-karätiges Gold (750‰) verwendet.",
      related: ["ley-pureza"],
    },
    {
      term: "Spread (Spanne)",
      id: "spread",
      definition:
        "Die Differenz zwischen dem Kaufpreis (Bid) und dem Verkaufspreis (Ask) eines Edelmetalls. Je kleiner der Spread, desto höher die Marktliquidität. Gold hat engere Spreads als Platin.",
    },
    {
      term: "Goldreserven",
      id: "reservas-oro",
      definition:
        "Die Menge an Gold, die Zentralbanken als Teil ihrer Währungsreserven halten. Die USA führen mit über 8.000 Tonnen, gefolgt von Deutschland, Italien und Frankreich. Zentralbanken sind seit 2010 Nettokäufer von Gold.",
    },
  ],
};

export function getGlossaryTerms(locale: string): GlossaryTerm[] {
  return glossaryData[locale] || glossaryData.es;
}

export type { GlossaryTerm };
