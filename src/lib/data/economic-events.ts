export interface EconomicEvent {
  id: string;
  name: string;
  nameShort: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "monetary-policy" | "inflation" | "employment" | "gdp" | "trade" | "sentiment";
  region: "US" | "EU" | "Global";
  metalImpact: string;
  frequency: string;
  dates2026: string[];
}

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: "fomc",
    name: "Reunión FOMC (Reserva Federal)",
    nameShort: "FOMC",
    description:
      "El Comité Federal de Mercado Abierto decide sobre los tipos de interés en EE.UU. Es el evento más importante para los metales preciosos.",
    impact: "high",
    category: "monetary-policy",
    region: "US",
    metalImpact: "Tipos más altos → oro baja. Tipos más bajos o pausa → oro sube.",
    frequency: "8 veces al año",
    dates2026: [
      "2026-01-28",
      "2026-03-18",
      "2026-05-06",
      "2026-06-17",
      "2026-07-29",
      "2026-09-16",
      "2026-11-04",
      "2026-12-16",
    ],
  },
  {
    id: "ecb",
    name: "Decisión BCE (Banco Central Europeo)",
    nameShort: "BCE",
    description:
      "El BCE decide los tipos de interés para la zona euro. Afecta al EUR/USD y por tanto al precio del oro en euros.",
    impact: "high",
    category: "monetary-policy",
    region: "EU",
    metalImpact: "Tipos más altos en UE → EUR sube → oro en EUR baja (y viceversa).",
    frequency: "6 veces al año",
    dates2026: [
      "2026-01-30",
      "2026-03-06",
      "2026-04-17",
      "2026-06-05",
      "2026-07-17",
      "2026-09-11",
      "2026-10-29",
      "2026-12-17",
    ],
  },
  {
    id: "cpi-us",
    name: "IPC EE.UU. (Inflación)",
    nameShort: "IPC USA",
    description:
      "El Índice de Precios al Consumidor mide la inflación. El oro es tradicionalmente una cobertura contra la inflación.",
    impact: "high",
    category: "inflation",
    region: "US",
    metalImpact: "Inflación más alta de lo esperado → oro sube (cobertura). Inflación baja → oro baja.",
    frequency: "Mensual",
    dates2026: [
      "2026-01-14",
      "2026-02-12",
      "2026-03-12",
      "2026-04-10",
      "2026-05-13",
      "2026-06-11",
      "2026-07-15",
      "2026-08-12",
      "2026-09-10",
      "2026-10-13",
      "2026-11-12",
      "2026-12-10",
    ],
  },
  {
    id: "nfp",
    name: "Nóminas no agrícolas (NFP)",
    nameShort: "NFP",
    description:
      "Datos de empleo de EE.UU. Un mercado laboral fuerte puede llevar a tipos más altos, lo que presiona al oro a la baja.",
    impact: "high",
    category: "employment",
    region: "US",
    metalImpact: "Empleo fuerte → USD sube → oro baja. Empleo débil → oro sube.",
    frequency: "Primer viernes de cada mes",
    dates2026: [
      "2026-01-10",
      "2026-02-06",
      "2026-03-06",
      "2026-04-03",
      "2026-05-01",
      "2026-06-05",
      "2026-07-02",
      "2026-08-07",
      "2026-09-04",
      "2026-10-02",
      "2026-11-06",
      "2026-12-04",
    ],
  },
  {
    id: "pce",
    name: "Deflactor PCE (medida favorita de la Fed)",
    nameShort: "PCE",
    description:
      "El índice PCE es la medida de inflación preferida por la Reserva Federal para tomar decisiones de política monetaria.",
    impact: "high",
    category: "inflation",
    region: "US",
    metalImpact: "PCE alto → la Fed podría subir tipos → presión bajista sobre oro.",
    frequency: "Mensual",
    dates2026: [
      "2026-01-31",
      "2026-02-28",
      "2026-03-27",
      "2026-04-30",
      "2026-05-29",
      "2026-06-26",
      "2026-07-31",
      "2026-08-28",
      "2026-09-25",
      "2026-10-30",
      "2026-11-25",
      "2026-12-23",
    ],
  },
  {
    id: "gdp-us",
    name: "PIB EE.UU.",
    nameShort: "PIB USA",
    description:
      "El Producto Interior Bruto mide el crecimiento económico. Una recesión suele ser alcista para el oro.",
    impact: "medium",
    category: "gdp",
    region: "US",
    metalImpact: "PIB débil → miedo a recesión → oro como refugio sube.",
    frequency: "Trimestral",
    dates2026: [
      "2026-01-30",
      "2026-04-29",
      "2026-07-30",
      "2026-10-29",
    ],
  },
  {
    id: "pmi",
    name: "PMI Manufacturero (ISM)",
    nameShort: "PMI",
    description:
      "El índice PMI mide la actividad del sector manufacturero. Un PMI por debajo de 50 indica contracción.",
    impact: "medium",
    category: "sentiment",
    region: "US",
    metalImpact: "PMI bajo → economía se debilita → oro sube como refugio.",
    frequency: "Mensual",
    dates2026: [
      "2026-01-03",
      "2026-02-03",
      "2026-03-02",
      "2026-04-01",
      "2026-05-01",
      "2026-06-01",
      "2026-07-01",
      "2026-08-03",
      "2026-09-01",
      "2026-10-01",
      "2026-11-02",
      "2026-12-01",
    ],
  },
  {
    id: "dxy",
    name: "Índice del Dólar (DXY)",
    nameShort: "DXY",
    description:
      "El índice DXY mide la fortaleza del dólar frente a 6 divisas principales. Tiene correlación inversa con el oro.",
    impact: "medium",
    category: "trade",
    region: "Global",
    metalImpact: "DXY sube → oro baja. DXY baja → oro sube. Correlación inversa.",
    frequency: "Continuo (referencia)",
    dates2026: [],
  },
];

interface EventTexts {
  name: string;
  nameShort: string;
  description: string;
  metalImpact: string;
  frequency: string;
}

const EVENTS_EN: Record<string, EventTexts> = {
  fomc: {
    name: "FOMC Meeting (Federal Reserve)",
    nameShort: "FOMC",
    description: "The Federal Open Market Committee decides on US interest rates. It is the most important event for precious metals.",
    metalImpact: "Higher rates → gold falls. Lower rates or pause → gold rises.",
    frequency: "8 times per year",
  },
  ecb: {
    name: "ECB Decision (European Central Bank)",
    nameShort: "ECB",
    description: "The ECB decides interest rates for the eurozone. It affects EUR/USD and therefore the gold price in euros.",
    metalImpact: "Higher EU rates → EUR rises → gold in EUR falls (and vice versa).",
    frequency: "6 times per year",
  },
  "cpi-us": {
    name: "US CPI (Inflation)",
    nameShort: "CPI USA",
    description: "The Consumer Price Index measures inflation. Gold is traditionally a hedge against inflation.",
    metalImpact: "Higher than expected inflation → gold rises (hedge). Low inflation → gold falls.",
    frequency: "Monthly",
  },
  nfp: {
    name: "Non-Farm Payrolls (NFP)",
    nameShort: "NFP",
    description: "US employment data. A strong labour market can lead to higher rates, which puts downward pressure on gold.",
    metalImpact: "Strong employment → USD rises → gold falls. Weak employment → gold rises.",
    frequency: "First Friday of each month",
  },
  pce: {
    name: "PCE Deflator (Fed's preferred measure)",
    nameShort: "PCE",
    description: "The PCE index is the Federal Reserve's preferred inflation measure for making monetary policy decisions.",
    metalImpact: "High PCE → the Fed could raise rates → bearish pressure on gold.",
    frequency: "Monthly",
  },
  "gdp-us": {
    name: "US GDP",
    nameShort: "GDP USA",
    description: "Gross Domestic Product measures economic growth. A recession is typically bullish for gold.",
    metalImpact: "Weak GDP → recession fears → gold rises as safe haven.",
    frequency: "Quarterly",
  },
  pmi: {
    name: "Manufacturing PMI (ISM)",
    nameShort: "PMI",
    description: "The PMI index measures manufacturing sector activity. A PMI below 50 indicates contraction.",
    metalImpact: "Low PMI → economy weakening → gold rises as safe haven.",
    frequency: "Monthly",
  },
  dxy: {
    name: "Dollar Index (DXY)",
    nameShort: "DXY",
    description: "The DXY index measures dollar strength against 6 major currencies. It has an inverse correlation with gold.",
    metalImpact: "DXY rises → gold falls. DXY falls → gold rises. Inverse correlation.",
    frequency: "Continuous (reference)",
  },
};

const EVENTS_AR: Record<string, EventTexts> = {
  fomc: {
    name: "اجتماع FOMC (الاحتياطي الفيدرالي)",
    nameShort: "FOMC",
    description: "لجنة السوق المفتوحة الفيدرالية تقرر أسعار الفائدة في الولايات المتحدة. إنه الحدث الأهم للمعادن الثمينة.",
    metalImpact: "أسعار أعلى → الذهب ينخفض. أسعار أقل أو توقف → الذهب يرتفع.",
    frequency: "8 مرات سنوياً",
  },
  ecb: {
    name: "قرار البنك المركزي الأوروبي",
    nameShort: "BCE",
    description: "البنك المركزي الأوروبي يقرر أسعار الفائدة لمنطقة اليورو. يؤثر على EUR/USD وبالتالي سعر الذهب باليورو.",
    metalImpact: "أسعار أعلى في الاتحاد الأوروبي → اليورو يرتفع → الذهب باليورو ينخفض (والعكس صحيح).",
    frequency: "6 مرات سنوياً",
  },
  "cpi-us": {
    name: "مؤشر أسعار المستهلك الأمريكي (التضخم)",
    nameShort: "IPC USA",
    description: "مؤشر أسعار المستهلك يقيس التضخم. الذهب تقليدياً تحوط ضد التضخم.",
    metalImpact: "تضخم أعلى من المتوقع → الذهب يرتفع (تحوط). تضخم منخفض → الذهب ينخفض.",
    frequency: "شهري",
  },
  nfp: {
    name: "رواتب القطاع غير الزراعي (NFP)",
    nameShort: "NFP",
    description: "بيانات التوظيف الأمريكية. سوق عمل قوي قد يؤدي لأسعار فائدة أعلى، مما يضغط على الذهب للانخفاض.",
    metalImpact: "توظيف قوي → الدولار يرتفع → الذهب ينخفض. توظيف ضعيف → الذهب يرتفع.",
    frequency: "أول جمعة من كل شهر",
  },
  pce: {
    name: "معامل انكماش PCE (المقياس المفضل للفيدرالي)",
    nameShort: "PCE",
    description: "مؤشر PCE هو مقياس التضخم المفضل لدى الاحتياطي الفيدرالي لاتخاذ قرارات السياسة النقدية.",
    metalImpact: "PCE مرتفع → الفيدرالي قد يرفع الأسعار → ضغط هبوطي على الذهب.",
    frequency: "شهري",
  },
  "gdp-us": {
    name: "الناتج المحلي الإجمالي الأمريكي",
    nameShort: "PIB USA",
    description: "الناتج المحلي الإجمالي يقيس النمو الاقتصادي. الركود عادة صاعد للذهب.",
    metalImpact: "ناتج ضعيف → مخاوف ركود → الذهب يرتفع كملاذ آمن.",
    frequency: "ربع سنوي",
  },
  pmi: {
    name: "مؤشر مديري المشتريات الصناعي (ISM)",
    nameShort: "PMI",
    description: "مؤشر PMI يقيس نشاط قطاع التصنيع. PMI أقل من 50 يشير إلى انكماش.",
    metalImpact: "PMI منخفض → الاقتصاد يضعف → الذهب يرتفع كملاذ آمن.",
    frequency: "شهري",
  },
  dxy: {
    name: "مؤشر الدولار (DXY)",
    nameShort: "DXY",
    description: "مؤشر DXY يقيس قوة الدولار مقابل 6 عملات رئيسية. له علاقة عكسية مع الذهب.",
    metalImpact: "DXY يرتفع → الذهب ينخفض. DXY ينخفض → الذهب يرتفع. علاقة عكسية.",
    frequency: "مستمر (مرجع)",
  },
};

const EVENTS_ZH: Record<string, EventTexts> = {
  fomc: {
    name: "FOMC会议（美联储）",
    nameShort: "FOMC",
    description: "联邦公开市场委员会决定美国利率。这是贵金属最重要的经济事件。",
    metalImpact: "利率上升 → 黄金下跌。利率下降或暂停 → 黄金上涨。",
    frequency: "每年8次",
  },
  ecb: {
    name: "欧洲央行利率决议",
    nameShort: "ECB",
    description: "欧洲央行决定欧元区利率。影响欧元/美元，进而影响以欧元计价的黄金价格。",
    metalImpact: "欧盟利率上升 → 欧元上涨 → 欧元计黄金下跌（反之亦然）。",
    frequency: "每年6次",
  },
  "cpi-us": {
    name: "美国CPI（通胀）",
    nameShort: "CPI美国",
    description: "消费者物价指数衡量通胀。黄金传统上是通胀对冲工具。",
    metalImpact: "通胀高于预期 → 黄金上涨（对冲）。通胀低迷 → 黄金下跌。",
    frequency: "每月",
  },
  nfp: {
    name: "非农就业人数（NFP）",
    nameShort: "NFP",
    description: "美国就业数据。劳动力市场强劲可能导致加息，对黄金构成下行压力。",
    metalImpact: "就业强劲 → 美元上涨 → 黄金下跌。就业疲弱 → 黄金上涨。",
    frequency: "每月第一个周五",
  },
  pce: {
    name: "PCE平减指数（美联储首选指标）",
    nameShort: "PCE",
    description: "PCE指数是美联储制定货币政策时首选的通胀指标。",
    metalImpact: "PCE高 → 美联储可能加息 → 黄金承压下跌。",
    frequency: "每月",
  },
  "gdp-us": {
    name: "美国GDP",
    nameShort: "GDP美国",
    description: "国内生产总值衡量经济增长。经济衰退通常利好黄金。",
    metalImpact: "GDP疲弱 → 衰退担忧 → 黄金作为避险资产上涨。",
    frequency: "每季度",
  },
  pmi: {
    name: "制造业PMI（ISM）",
    nameShort: "PMI",
    description: "PMI指数衡量制造业活动。PMI低于50表示收缩。",
    metalImpact: "PMI低 → 经济走弱 → 黄金作为避险资产上涨。",
    frequency: "每月",
  },
  dxy: {
    name: "美元指数（DXY）",
    nameShort: "DXY",
    description: "DXY指数衡量美元兑6种主要货币的强弱。与黄金呈负相关。",
    metalImpact: "DXY上涨 → 黄金下跌。DXY下跌 → 黄金上涨。负相关。",
    frequency: "连续（参考）",
  },
};

const EVENTS_DE: Record<string, EventTexts> = {
  fomc: {
    name: "FOMC-Sitzung (Federal Reserve)",
    nameShort: "FOMC",
    description: "Das Federal Open Market Committee entscheidet über die US-Zinsen. Es ist das wichtigste Ereignis für Edelmetalle.",
    metalImpact: "Höhere Zinsen → Gold fällt. Niedrigere Zinsen oder Pause → Gold steigt.",
    frequency: "8-mal pro Jahr",
  },
  ecb: {
    name: "EZB-Entscheidung (Europäische Zentralbank)",
    nameShort: "EZB",
    description: "Die EZB entscheidet über die Zinssätze für die Eurozone. Sie beeinflusst EUR/USD und damit den Goldpreis in Euro.",
    metalImpact: "Höhere EU-Zinsen → EUR steigt → Gold in EUR fällt (und umgekehrt).",
    frequency: "6-mal pro Jahr",
  },
  "cpi-us": {
    name: "US-VPI (Inflationsrate)",
    nameShort: "VPI USA",
    description: "Der Verbraucherpreisindex misst die Inflation. Gold gilt traditionell als Inflationsschutz.",
    metalImpact: "Höhere als erwartete Inflation → Gold steigt (Absicherung). Niedrige Inflation → Gold fällt.",
    frequency: "Monatlich",
  },
  nfp: {
    name: "Nichtlandwirtschaftliche Löhne (NFP)",
    nameShort: "NFP",
    description: "US-Beschäftigungsdaten. Ein starker Arbeitsmarkt kann zu höheren Zinsen führen, was Gold unter Druck setzt.",
    metalImpact: "Starke Beschäftigung → USD steigt → Gold fällt. Schwache Beschäftigung → Gold steigt.",
    frequency: "Erster Freitag jeden Monats",
  },
  pce: {
    name: "PCE-Deflator (bevorzugtes Maß der Fed)",
    nameShort: "PCE",
    description: "Der PCE-Index ist das bevorzugte Inflationsmaß der Federal Reserve für geldpolitische Entscheidungen.",
    metalImpact: "Hoher PCE → die Fed könnte Zinsen erhöhen → Abwärtsdruck auf Gold.",
    frequency: "Monatlich",
  },
  "gdp-us": {
    name: "US-BIP",
    nameShort: "BIP USA",
    description: "Das Bruttoinlandsprodukt misst das Wirtschaftswachstum. Eine Rezession ist typischerweise haussierend für Gold.",
    metalImpact: "Schwaches BIP → Rezessionsängste → Gold steigt als sicherer Hafen.",
    frequency: "Vierteljährlich",
  },
  pmi: {
    name: "Produktions-PMI (ISM)",
    nameShort: "PMI",
    description: "Der PMI-Index misst die Aktivität des verarbeitenden Gewerbes. Ein PMI unter 50 deutet auf Kontraktion hin.",
    metalImpact: "Niedriger PMI → Wirtschaft schwächt sich ab → Gold steigt als sicherer Hafen.",
    frequency: "Monatlich",
  },
  dxy: {
    name: "Dollar-Index (DXY)",
    nameShort: "DXY",
    description: "Der DXY-Index misst die Stärke des Dollars gegenüber 6 wichtigen Währungen. Er hat eine inverse Korrelation mit Gold.",
    metalImpact: "DXY steigt → Gold fällt. DXY fällt → Gold steigt. Inverse Korrelation.",
    frequency: "Kontinuierlich (Referenz)",
  },
};

const EVENTS_TR: Record<string, EventTexts> = {
  fomc: {
    name: "FOMC Toplantısı (Federal Rezerv)",
    nameShort: "FOMC",
    description: "Federal Açık Piyasa Komitesi ABD faiz oranlarına karar verir. Değerli metaller için en önemli olaydır.",
    metalImpact: "Daha yüksek oranlar → altın düşer. Daha düşük oranlar veya duraklama → altın yükselir.",
    frequency: "Yılda 8 kez",
  },
  ecb: {
    name: "ECB Kararı (Avrupa Merkez Bankası)",
    nameShort: "ECB",
    description: "ECB euro bölgesi için faiz oranlarına karar verir. EUR/USD'yi ve dolayısıyla euro cinsinden altın fiyatını etkiler.",
    metalImpact: "AB'de daha yüksek oranlar → EUR yükselir → euro cinsinden altın düşer (ve tersi).",
    frequency: "Yılda 6 kez",
  },
  "cpi-us": {
    name: "ABD TÜFE (Enflasyon)",
    nameShort: "TÜFE ABD",
    description: "Tüketici Fiyat Endeksi enflasyonu ölçer. Altın geleneksel olarak enflasyona karşı korumadır.",
    metalImpact: "Beklenenden yüksek enflasyon → altın yükselir (koruma). Düşük enflasyon → altın düşer.",
    frequency: "Aylık",
  },
  nfp: {
    name: "Tarım Dışı İstihdam (NFP)",
    nameShort: "NFP",
    description: "ABD istihdam verileri. Güçlü bir işgücü piyasası daha yüksek oranlara yol açabilir; bu da altına düşüş baskısı yapar.",
    metalImpact: "Güçlü istihdam → USD yükselir → altın düşer. Zayıf istihdam → altın yükselir.",
    frequency: "Her ayın ilk cuma günü",
  },
  pce: {
    name: "PCE Deflatörü (Fed'in tercih ettiği ölçüt)",
    nameShort: "PCE",
    description: "PCE endeksi Fed'in para politikası kararları için tercih ettiği enflasyon ölçütüdür.",
    metalImpact: "Yüksek PCE → Fed oranları yükseltebilir → altında düşüş baskısı.",
    frequency: "Aylık",
  },
  "gdp-us": {
    name: "ABD GSYİH",
    nameShort: "GSYİH ABD",
    description: "Gayri Safi Yurt İçi Hasıla ekonomik büyümeyi ölçer. Resesyon genellikle altın için yükselişçidir.",
    metalImpact: "Zayıf GSYİH → resesyon korkusu → altın güvenli liman olarak yükselir.",
    frequency: "Üç aylık",
  },
  pmi: {
    name: "İmalat PMI (ISM)",
    nameShort: "PMI",
    description: "PMI endeksi imalat sektörü faaliyetini ölçer. 50'nin altındaki PMI daralmayı gösterir.",
    metalImpact: "Düşük PMI → ekonomi zayıflıyor → altın güvenli liman olarak yükselir.",
    frequency: "Aylık",
  },
  dxy: {
    name: "Dolar Endeksi (DXY)",
    nameShort: "DXY",
    description: "DXY endeksi doların 6 ana para birimine karşı gücünü ölçer. Altınla ters korelasyona sahiptir.",
    metalImpact: "DXY yükselir → altın düşer. DXY düşer → altın yükselir. Ters korelasyon.",
    frequency: "Sürekli (referans)",
  },
};

function applyEventLocale(event: EconomicEvent, locale: string): EconomicEvent {
  if (locale === "es") return event;
  const map: Record<string, Record<string, EventTexts>> = {
    en: EVENTS_EN,
    ar: EVENTS_AR,
    zh: EVENTS_ZH,
    de: EVENTS_DE,
    tr: EVENTS_TR,
    hi: EVENTS_EN,
  };
  const texts = map[locale]?.[event.id];
  if (!texts) {
    const fallback = EVENTS_EN[event.id];
    if (!fallback) return event;
    return { ...event, ...fallback };
  }
  return { ...event, ...texts };
}

export function getLocalizedEvents(locale: string = "es"): EconomicEvent[] {
  return ECONOMIC_EVENTS.map((e) => applyEventLocale(e, locale));
}

export function getUpcomingEvents(days: number = 30, locale: string = "es"): Array<EconomicEvent & { nextDate: string; daysUntil: number }> {
  const now = new Date();
  const cutoff = new Date(now.getTime() + days * 86400000);

  const upcoming: Array<EconomicEvent & { nextDate: string; daysUntil: number }> = [];

  for (const event of ECONOMIC_EVENTS) {
    for (const dateStr of event.dates2026) {
      const d = new Date(dateStr + "T00:00:00Z");
      if (d >= now && d <= cutoff) {
        const daysUntil = Math.ceil((d.getTime() - now.getTime()) / 86400000);
        upcoming.push({ ...applyEventLocale(event, locale), nextDate: dateStr, daysUntil });
        break;
      }
    }
  }

  upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  return upcoming;
}
