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

const FAQ_MAP: Record<string, FaqItem[]> = { es: FAQ_ES, en: FAQ_EN, ar: FAQ_AR };

export function getFaqItems(locale: string = "es"): FaqItem[] {
  return FAQ_MAP[locale] || FAQ_ES;
}

export const FAQ_ITEMS = FAQ_ES;
