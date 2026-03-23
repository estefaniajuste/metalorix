export interface CurrencyPageData {
  code: string;
  slug: string;
  symbols: string;
  names: Record<string, string>;
}

export const CURRENCY_PAGES: CurrencyPageData[] = [
  {
    code: "INR",
    slug: "inr",
    symbols: "₹",
    names: {
      es: "Rupia india",
      en: "Indian Rupee",
      de: "Indische Rupie",
      zh: "印度卢比",
      ar: "الروبية الهندية",
      tr: "Hint Rupisi",
      hi: "भारतीय रुपया",
    },
  },
  {
    code: "TRY",
    slug: "try",
    symbols: "₺",
    names: {
      es: "Lira turca",
      en: "Turkish Lira",
      de: "Türkische Lira",
      zh: "土耳其里拉",
      ar: "الليرة التركية",
      tr: "Türk Lirası",
      hi: "तुर्की लीरा",
    },
  },
  {
    code: "CNY",
    slug: "cny",
    symbols: "¥",
    names: {
      es: "Yuan chino",
      en: "Chinese Yuan",
      de: "Chinesischer Yuan",
      zh: "人民币",
      ar: "اليوان الصيني",
      tr: "Çin Yuanı",
      hi: "चीनी युआन",
    },
  },
  {
    code: "AED",
    slug: "aed",
    symbols: "د.إ",
    names: {
      es: "Dírham emiratí",
      en: "UAE Dirham",
      de: "VAE-Dirham",
      zh: "阿联酋迪拉姆",
      ar: "الدرهم الإماراتي",
      tr: "BAE Dirhemi",
      hi: "UAE दिरहम",
    },
  },
  {
    code: "SAR",
    slug: "sar",
    symbols: "﷼",
    names: {
      es: "Riyal saudí",
      en: "Saudi Riyal",
      de: "Saudi-Riyal",
      zh: "沙特里亚尔",
      ar: "الريال السعودي",
      tr: "Suudi Riyali",
      hi: "सऊदी रियाल",
    },
  },
  {
    code: "GBP",
    slug: "gbp",
    symbols: "£",
    names: {
      es: "Libra esterlina",
      en: "British Pound",
      de: "Britisches Pfund",
      zh: "英镑",
      ar: "الجنيه الإسترليني",
      tr: "İngiliz Sterlini",
      hi: "ब्रिटिश पाउंड",
    },
  },
  {
    code: "EUR",
    slug: "eur",
    symbols: "€",
    names: {
      es: "Euro",
      en: "Euro",
      de: "Euro",
      zh: "欧元",
      ar: "اليورو",
      tr: "Euro",
      hi: "यूरो",
    },
  },
  {
    code: "JPY",
    slug: "jpy",
    symbols: "¥",
    names: {
      es: "Yen japonés",
      en: "Japanese Yen",
      de: "Japanischer Yen",
      zh: "日元",
      ar: "الين الياباني",
      tr: "Japon Yeni",
      hi: "जापानी येन",
    },
  },
];

export function getCurrencyBySlug(
  slug: string
): CurrencyPageData | undefined {
  return CURRENCY_PAGES.find((c) => c.slug === slug);
}
