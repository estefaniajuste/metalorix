export interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ES: FaqItem[] = [
  {
    question: "¿Es mejor comprar oro físico o invertir en un ETF?",
    answer:
      "Depende de tu objetivo. El oro físico te da control total y elimina el riesgo de contraparte, pero implica costes de custodia y menor liquidez. Los ETFs son más baratos, líquidos y fáciles de gestionar, pero no posees el metal directamente. Muchos inversores combinan ambos: una base de oro físico y ETFs para el trading o la gestión activa de la cartera.",
  },
  {
    question: "¿Qué ventajas tiene guardar oro en Suiza?",
    answer:
      "Suiza ofrece estabilidad política y jurídica, un sistema bancario sólido y una larga tradición en custodia de metales preciosos. Almacenar fuera de tu país diversifica el riesgo jurisdiccional (protección ante confiscaciones o restricciones). Servicios como BullionVault o PAMP ofrecen bóvedas auditadas con oro asignado individualmente.",
  },
  {
    question: "¿Qué es el TER de un ETF y por qué importa?",
    answer:
      "El TER (Total Expense Ratio) es el coste anual que cobra la gestora, expresado como porcentaje del valor invertido. Un TER de 0,12 % significa que por cada 10.000 € invertidos, pagas 12 € al año en comisiones. A largo plazo, la diferencia entre un TER de 0,12 % y 0,49 % puede ser significativa por el efecto del interés compuesto.",
  },
  {
    question: "¿El oro físico tributa de forma diferente que un ETF?",
    answer:
      "Sí, en la mayoría de países europeos el tratamiento fiscal difiere. En España, por ejemplo, la compraventa de oro de inversión (lingotes >99,5 % y monedas reconocidas) está exenta de IVA. Las plusvalías tributan como ganancias patrimoniales. Los ETFs tributan como productos financieros y pueden tener retención en origen. Consulta siempre con un asesor fiscal.",
  },
  {
    question: "¿Qué diferencia hay entre un ETF y un ETC?",
    answer:
      "Un ETF (Exchange-Traded Fund) es un fondo de inversión cotizado, regulado bajo normativa UCITS en Europa, que debe estar diversificado. Un ETC (Exchange-Traded Commodity) es un título de deuda respaldado por una materia prima. Como la normativa UCITS no permite fondos de un solo activo, los productos de oro en Europa suelen ser ETCs, no ETFs técnicamente, aunque se usen ambos términos coloquialmente.",
  },
  {
    question: "¿Cuánto oro debería tener en mi cartera?",
    answer:
      "No hay una cifra universal, pero las recomendaciones habituales oscilan entre el 5 % y el 15 % de una cartera diversificada. El oro actúa como cobertura contra la inflación y la incertidumbre. Ray Dalio sugiere un 7,5 % en su All Weather Portfolio. La cantidad ideal depende de tu tolerancia al riesgo, horizonte temporal y situación financiera global.",
  },
];

const FAQ_EN: FaqItem[] = [
  {
    question: "Is it better to buy physical gold or invest in an ETF?",
    answer:
      "It depends on your goals. Physical gold gives you full control and eliminates counterparty risk, but involves custody costs and lower liquidity. ETFs are cheaper, more liquid and easier to manage, but you don't own the metal directly. Many investors combine both: a base of physical gold and ETFs for trading or active portfolio management.",
  },
  {
    question: "What are the advantages of storing gold in Switzerland?",
    answer:
      "Switzerland offers political and legal stability, a solid banking system and a long tradition in precious metals custody. Storing outside your country diversifies jurisdictional risk (protection against confiscation or restrictions). Services like BullionVault or PAMP offer audited vaults with individually allocated gold.",
  },
  {
    question: "What is the TER of an ETF and why does it matter?",
    answer:
      "The TER (Total Expense Ratio) is the annual cost charged by the fund manager, expressed as a percentage of the invested value. A TER of 0.12% means that for every €10,000 invested, you pay €12 per year in fees. Over the long term, the difference between a TER of 0.12% and 0.49% can be significant due to the compounding effect.",
  },
  {
    question: "Is physical gold taxed differently than an ETF?",
    answer:
      "Yes, in most European countries the tax treatment differs. In many EU countries, investment gold (bars >99.5% purity and recognized coins) is VAT-exempt. Capital gains are taxed according to national rules. ETFs are taxed as financial products and may have withholding tax at source. Always consult a tax advisor.",
  },
  {
    question: "What is the difference between an ETF and an ETC?",
    answer:
      "An ETF (Exchange-Traded Fund) is a listed investment fund, regulated under UCITS rules in Europe, which must be diversified. An ETC (Exchange-Traded Commodity) is a debt security backed by a commodity. Since UCITS rules don't allow single-asset funds, gold products in Europe are usually ETCs, not technically ETFs, although both terms are used colloquially.",
  },
  {
    question: "How much gold should I have in my portfolio?",
    answer:
      "There is no universal figure, but common recommendations range between 5% and 15% of a diversified portfolio. Gold acts as a hedge against inflation and uncertainty. Ray Dalio suggests 7.5% in his All Weather Portfolio. The ideal amount depends on your risk tolerance, time horizon and overall financial situation.",
  },
];

const FAQ_AR: FaqItem[] = [
  {
    question: "هل من الأفضل شراء الذهب الفيزيائي أم الاستثمار في صندوق ETF؟",
    answer:
      "يعتمد ذلك على هدفك. الذهب الفيزيائي يمنحك تحكماً كاملاً ويُزيل مخاطر الطرف المقابل، لكنه يتضمن تكاليف حفظ وسيولة أقل. صناديق ETF أرخص وأكثر سيولة وأسهل في الإدارة، لكنك لا تملك المعدن مباشرة. يجمع كثير من المستثمرين بين الاثنين: قاعدة من الذهب الفيزيائي وETF للتداول أو الإدارة النشطة للمحفظة.",
  },
  {
    question: "ما مزايا تخزين الذهب في سويسرا؟",
    answer:
      "تقدم سويسرا استقراراً سياسياً وقانونياً، ونظاماً مصرفياً قوياً، وتقليداً طويلاً في حفظ المعادن الثمينة. التخزين خارج بلدك يُنوّع المخاطر القضائية (حماية من المصادرة أو القيود). خدمات مثل BullionVault أو PAMP تقدم خزائن مُراجعة مع ذهب مُخصص بشكل فردي.",
  },
  {
    question: "ما هو TER لصندوق ETF ولماذا يهم؟",
    answer:
      "TER (نسبة المصروفات الإجمالية) هو التكلفة السنوية التي تتقاضاها شركة الإدارة، معبّر عنها كنسبة مئوية من القيمة المستثمرة. TER بنسبة 0.12% يعني أنه مقابل كل 10,000 يورو مستثمرة، تدفع 12 يورو سنوياً كرسوم. على المدى الطويل، الفرق بين TER 0.12% و0.49% قد يكون كبيراً بسبب تأثير الفائدة المركبة.",
  },
  {
    question: "هل يُفرض على الذهب الفيزيائي ضريبة مختلفة عن ETF؟",
    answer:
      "نعم، في معظم الدول الأوروبية يختلف المعامل الضريبي. في إسبانيا مثلاً، بيع وشراء ذهب الاستثمار (سبائك بنقاء >99.5% وعملات معترف بها) معفى من ضريبة القيمة المضافة. الأرباح الرأسمالية تُفرض كأرباح مالية. صناديق ETF تُفرض كمنتجات مالية وقد تخضع للخصم في المنبع. استشر دائماً مستشاراً ضريبياً.",
  },
  {
    question: "ما الفرق بين ETF وETC؟",
    answer:
      "ETF (صندوق تداول في البورصة) هو صندوق استثمار مدرج، منظم بموجب قواعد UCITS في أوروبا، ويجب أن يكون متنوعاً. ETC (سلعة متداولة في البورصة) هو ورقة دين مضمونة بسلعة. بما أن قواعد UCITS لا تسمح بصناديق ذات أصل واحد، فإن منتجات الذهب في أوروبا عادةً ETCs وليست ETFs تقنياً، رغم استخدام المصطلحين بالعامية.",
  },
  {
    question: "كم من الذهب يجب أن يكون في محفظتي؟",
    answer:
      "لا يوجد رقم عالمي، لكن التوصيات المعتادة تتراوح بين 5% و15% من محفظة متنوعة. الذهب يعمل كتحوط ضد التضخم وعدم اليقين. يقترح راي داليو 7.5% في محفظته All Weather. الكمية المثالية تعتمد على تحملك للمخاطر، أفقك الزمني، ووضعك المالي العام.",
  },
];

const FAQ_ZH: FaqItem[] = [
  {
    question: "购买实物黄金还是投资ETF更好？",
    answer:
      "取决于您的目标。实物黄金让您完全掌控并消除对手方风险，但涉及托管成本和较低流动性。ETF更便宜、流动性更高、更易管理，但您不直接持有金属。许多投资者两者结合：以实物黄金为基础，用ETF进行交易或主动管理投资组合。",
  },
  {
    question: "在瑞士储存黄金有什么优势？",
    answer:
      "瑞士提供政治和法律稳定、健全的银行体系以及贵金属托管的悠久传统。在境外储存可分散司法管辖风险（防范没收或限制）。BullionVault或PAMP等服务提供经审计的金库，黄金单独分配。",
  },
  {
    question: "什么是ETF的TER，为什么重要？",
    answer:
      "TER（总费用率）是基金管理人收取的年度成本，以投资价值的百分比表示。0.12%的TER意味着每投资10,000欧元，您每年支付12欧元费用。长期来看，0.12%与0.49%的TER差异可能因复利效应而显著。",
  },
  {
    question: "实物黄金与ETF的税务处理是否不同？",
    answer:
      "是的，在大多数欧洲国家税务处理不同。例如在西班牙，投资级黄金（纯度>99.5%的金条和认可金币）的买卖免征增值税。资本利得按财产收益征税。ETF作为金融产品征税，可能需在源头预扣。请务必咨询税务顾问。",
  },
  {
    question: "ETF和ETC有什么区别？",
    answer:
      "ETF（交易所交易基金）是在欧洲受UCITS法规监管的上市投资基金，必须分散投资。ETC（交易所交易商品）是由大宗商品支持的债务证券。由于UCITS规则不允许单一资产基金，欧洲的黄金产品通常是ETC而非技术意义上的ETF，尽管两者在口语中常混用。",
  },
  {
    question: "我的投资组合中应持有多少黄金？",
    answer:
      "没有通用数字，但常见建议为多元化投资组合的5%至15%。黄金可作为通胀和不确定性的对冲。雷·达里奥在其全天候投资组合中建议7.5%。理想配置取决于您的风险承受能力、投资期限和整体财务状况。",
  },
];

const FAQ_DE: FaqItem[] = [
  {
    question: "Ist es besser, physisches Gold zu kaufen oder in einen ETF zu investieren?",
    answer:
      "Es hängt von Ihrem Ziel ab. Physisches Gold gibt Ihnen volle Kontrolle und eliminiert das Kontrahentenrisiko, aber bedeutet Lagerkosten und geringere Liquidität. ETFs sind günstiger, liquider und einfacher zu verwalten, aber Sie besitzen das Metall nicht direkt. Viele Anleger kombinieren beides: eine Basis aus physischem Gold und ETFs für den Handel oder aktives Portfoliomanagement.",
  },
  {
    question: "Welche Vorteile hat die Lagerung von Gold in der Schweiz?",
    answer:
      "Die Schweiz bietet politische und rechtliche Stabilität, ein solides Bankensystem und eine lange Tradition in der Verwahrung von Edelmetallen. Die Lagerung außerhalb Ihres Landes diversifiziert das jurisdiktionelle Risiko (Schutz vor Beschlagnahme oder Beschränkungen). Dienste wie BullionVault oder PAMP bieten geprüfte Tresore mit einzeln zugeordnetem Gold.",
  },
  {
    question: "Was ist die TER eines ETFs und warum ist sie wichtig?",
    answer:
      "Die TER (Total Expense Ratio) ist die jährliche Kostenquote, die der Fondsmanager berechnet, ausgedrückt als Prozentsatz des investierten Werts. Eine TER von 0,12 % bedeutet, dass Sie bei 10.000 € Anlage 12 € pro Jahr an Gebühren zahlen. Langfristig kann der Unterschied zwischen einer TER von 0,12 % und 0,49 % aufgrund des Zinseszinseffekts erheblich sein.",
  },
  {
    question: "Wird physisches Gold anders besteuert als ein ETF?",
    answer:
      "Ja, in den meisten europäischen Ländern unterscheidet sich die steuerliche Behandlung. In Deutschland beispielsweise ist Anlagegold (Barren >99,5 % Reinheit und anerkannte Münzen) von der Mehrwertsteuer befreit. Kursgewinne werden als Kapitalerträge versteuert. ETFs werden als Finanzprodukte besteuert und können Quellensteuer unterliegen. Konsultieren Sie immer einen Steuerberater.",
  },
  {
    question: "Was ist der Unterschied zwischen einem ETF und einem ETC?",
    answer:
      "Ein ETF (Exchange-Traded Fund) ist ein börsengehandelter Fonds, der in Europa unter UCITS-Regeln reguliert ist und diversifiziert sein muss. Ein ETC (Exchange-Traded Commodity) ist eine Schuldverschreibung, die durch eine Rohstoffposition besichert ist. Da UCITS keine Einzel-Asset-Fonds erlaubt, sind Goldprodukte in Europa meist ETCs, technisch keine ETFs, obwohl beide Begriffe umgangssprachlich verwendet werden.",
  },
  {
    question: "Wie viel Gold sollte ich in meinem Portfolio haben?",
    answer:
      "Es gibt keine universelle Zahl, aber übliche Empfehlungen liegen zwischen 5 % und 15 % eines diversifizierten Portfolios. Gold dient als Absicherung gegen Inflation und Unsicherheit. Ray Dalio empfiehlt 7,5 % in seinem All Weather Portfolio. Die ideale Menge hängt von Ihrer Risikotoleranz, Ihrem Anlagehorizont und Ihrer Gesamtfinanzsituation ab.",
  },
];

const FAQ_TR: FaqItem[] = [
  {
    question: "Fiziksel altın mı almak daha iyi yoksa ETF'ye yatırım mı?",
    answer:
      "Hedefinize bağlıdır. Fiziksel altın size tam kontrol sağlar ve karşı taraf riskini ortadan kaldırır, ancak saklama maliyetleri ve daha düşük likidite içerir. ETF'ler daha ucuz, daha likit ve yönetmesi daha kolaydır, ancak metale doğrudan sahip olmazsınız. Birçok yatırımcı ikisini birleştirir: fiziksel altın tabanı ve işlem veya aktif portföy yönetimi için ETF'ler.",
  },
  {
    question: "Altını İsviçre'de saklamanın avantajları nelerdir?",
    answer:
      "İsviçre siyasi ve hukuki istikrar, sağlam bir bankacılık sistemi ve değerli metallerin saklanmasında uzun bir gelenek sunar. Ülkeniz dışında saklamak yargı riskini çeşitlendirir (el koyma veya kısıtlamalara karşı koruma). BullionVault veya PAMP gibi hizmetler bireysel olarak tahsis edilmiş altınla denetlenmiş kasa depoları sunar.",
  },
  {
    question: "Bir ETF'nin TER'i nedir ve neden önemlidir?",
    answer:
      "TER (Toplam Gider Oranı), fon yöneticisinin yatırılan değerin yüzdesi olarak ifade edilen yıllık maliyetidir. %0,12 TER, her 10.000 € yatırım için yılda 12 € komisyon ödediğiniz anlamına gelir. Uzun vadede, %0,12 ve %0,49 TER arasındaki fark bileşik faiz etkisi nedeniyle önemli olabilir.",
  },
  {
    question: "Fiziksel altın bir ETF'den farklı mı vergilendirilir?",
    answer:
      "Evet, çoğu Avrupa ülkesinde vergi muamelesi farklıdır. Örneğin İspanya'da yatırım altını alım satımı (>%99,5 saflıkta külçeler ve tanınmış paralar) KDV'den muaftır. Sermaye kazançları malvarlığı kazançları olarak vergilendirilir. ETF'ler finansal ürünler olarak vergilendirilir ve kaynakta vergi kesintisine tabi olabilir. Her zaman bir vergi danışmanına başvurun.",
  },
  {
    question: "ETF ile ETC arasındaki fark nedir?",
    answer:
      "ETF (Borsa Yatırım Fonu) Avrupa'da UCITS kurallarına göre düzenlenen, çeşitlendirilmiş olması gereken borsada işlem gören bir yatırım fonudur. ETC (Borsada İşlem Gören Emtia) bir emtia tarafından desteklenen bir borç senedidir. UCITS kuralları tek varlıklı fonlara izin vermediği için Avrupa'daki altın ürünleri genellikle teknik olarak ETF değil ETC'dir, her iki terim de günlük kullanımda olsa da.",
  },
  {
    question: "Portföyümde ne kadar altın olmalı?",
    answer:
      "Evrensel bir rakam yoktur, ancak yaygın öneriler çeşitlendirilmiş bir portföyün %5 ile %15'i arasında değişir. Altın enflasyona ve belirsizliğe karşı koruma sağlar. Ray Dalio All Weather Portföyünde %7,5 önerir. İdeal miktar risk toleransınıza, zaman ufkunuza ve genel mali durumunuza bağlıdır.",
  },
];

const FAQ_MAP: Record<string, FaqItem[]> = {
  es: FAQ_ES,
  en: FAQ_EN,
  ar: FAQ_AR,
  zh: FAQ_ZH,
  de: FAQ_DE,
  tr: FAQ_TR,
  hi: FAQ_EN,
};

export function getFaqItems(locale: string = "es"): FaqItem[] {
  return FAQ_MAP[locale] || FAQ_ES;
}

export const FAQ_ITEMS = FAQ_ES;
