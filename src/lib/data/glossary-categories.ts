export interface GlossaryCategory {
  id: string;
  label: Record<string, string>;
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  {
    id: "conceptos-basicos",
    label: {
      es: "Conceptos básicos",
      en: "Basic concepts",
      zh: "基本概念",
      ar: "المفاهيم الأساسية",
      tr: "Temel kavramlar",
      de: "Grundbegriffe",
    },
  },
  {
    id: "mercados-bolsas",
    label: {
      es: "Mercados y bolsas",
      en: "Markets and exchanges",
      zh: "市场与交易所",
      ar: "الأسواق والبورصات",
      tr: "Piyasalar ve borsalar",
      de: "Märkte und Börsen",
    },
  },
  {
    id: "inversion",
    label: {
      es: "Inversión",
      en: "Investment",
      zh: "投资",
      ar: "الاستثمار",
      tr: "Yatırım",
      de: "Investition",
    },
  },
  {
    id: "analisis-tecnico",
    label: {
      es: "Análisis técnico",
      en: "Technical analysis",
      zh: "技术分析",
      ar: "التحليل الفني",
      tr: "Teknik analiz",
      de: "Technische Analyse",
    },
  },
  {
    id: "macroeconomia",
    label: {
      es: "Macroeconomía",
      en: "Macroeconomics",
      zh: "宏观经济",
      ar: "الاقتصاد الكلي",
      tr: "Makroekonomi",
      de: "Makroökonomie",
    },
  },
  {
    id: "mineria-produccion",
    label: {
      es: "Minería y producción",
      en: "Mining and production",
      zh: "采矿与生产",
      ar: "التعدين والإنتاج",
      tr: "Madencilik ve üretim",
      de: "Bergbau und Produktion",
    },
  },
  {
    id: "numismatica",
    label: {
      es: "Numismática",
      en: "Numismatics",
      zh: "钱币学",
      ar: "علم العملات",
      tr: "Nümismatik",
      de: "Numismatik",
    },
  },
  {
    id: "joyeria-industria",
    label: {
      es: "Joyería e industria",
      en: "Jewelry and industry",
      zh: "珠宝与工业",
      ar: "المجوهرات والصناعة",
      tr: "Kuyumculuk ve sanayi",
      de: "Schmuck und Industrie",
    },
  },
  {
    id: "regulacion-fiscalidad",
    label: {
      es: "Regulación y fiscalidad",
      en: "Regulation and taxation",
      zh: "法规与税收",
      ar: "التنظيم والضرائب",
      tr: "Düzenleme ve vergilendirme",
      de: "Regulierung und Besteuerung",
    },
  },
  {
    id: "historia",
    label: {
      es: "Historia",
      en: "History",
      zh: "历史",
      ar: "التاريخ",
      tr: "Tarih",
      de: "Geschichte",
    },
  },
];

export function getCategoryLabel(
  categoryId: string,
  locale: string
): string {
  const cat = GLOSSARY_CATEGORIES.find((c) => c.id === categoryId);
  return cat?.label[locale] ?? cat?.label.es ?? categoryId;
}

export function getCategoryIds(): string[] {
  return GLOSSARY_CATEGORIES.map((c) => c.id);
}
