import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "zh", "ar", "tr", "de", "hi"] as const,
  defaultLocale: "en",
  localePrefix: "always",

  pathnames: {
    "/": "/",

    "/precio/[metal]": {
      es: "/precio/[metal]",
      en: "/price/[metal]",
      de: "/preis/[metal]",
      zh: "/jiage/[metal]",
      ar: "/sier/[metal]",
      tr: "/fiyat/[metal]",
      hi: "/mulya/[metal]",
    },

    "/precio/[metal]/[currency]": {
      es: "/precio/[metal]/[currency]",
      en: "/price/[metal]/[currency]",
      de: "/preis/[metal]/[currency]",
      zh: "/jiage/[metal]/[currency]",
      ar: "/sier/[metal]/[currency]",
      tr: "/fiyat/[metal]/[currency]",
      hi: "/mulya/[metal]/[currency]",
    },

    "/precio/[metal]/historico": {
      es: "/precio/[metal]/historico",
      en: "/price/[metal]/history",
      de: "/preis/[metal]/historie",
      zh: "/jiage/[metal]/lishi",
      ar: "/sier/[metal]/tarikhi",
      tr: "/fiyat/[metal]/gecmis",
      hi: "/mulya/[metal]/itihaas",
    },

    "/precio-oro-hoy": {
      es: "/precio-oro-hoy",
      en: "/gold-price-today",
      de: "/goldpreis-heute",
      zh: "/jin-ri-jin-jia",
      ar: "/sier-althahab-alyawm",
      tr: "/altin-fiyati-bugun",
      hi: "/sona-bhav-aaj",
    },

    "/precio-gramo-oro": {
      es: "/precio-gramo-oro",
      en: "/gold-price-per-gram",
      de: "/goldpreis-pro-gramm",
      zh: "/mei-ke-jin-jia",
      ar: "/sier-ghram-althahab",
      tr: "/gram-altin-fiyati",
      hi: "/sona-gram-mulya",
    },

    "/herramientas": {
      es: "/herramientas",
      en: "/tools",
      de: "/werkzeuge",
      zh: "/gongju",
      ar: "/adawat",
      tr: "/araclar",
      hi: "/upakar",
    },

    "/calculadora-rentabilidad": {
      es: "/calculadora-rentabilidad",
      en: "/roi-calculator",
      de: "/renditerechner",
      zh: "/shouyi-jisuan",
      ar: "/hasibat-alarabah",
      tr: "/getiri-hesaplayici",
      hi: "/laabh-ganak",
    },

    "/valor-joyas": {
      es: "/valor-joyas",
      en: "/jewelry-value-calculator",
      de: "/schmuck-wert-rechner",
      zh: "/zhusbao-jiazhi-jisuan",
      ar: "/hasibat-qimat-almujawaharat",
      tr: "/mucevher-deger-hesaplayici",
      hi: "/jewellery-mulya-ganak",
    },

    "/fear-greed": {
      es: "/miedo-codicia-metales",
      en: "/fear-greed-metals",
      de: "/angst-gier-metalle",
      zh: "/kongju-tanlan-zhishu",
      ar: "/maqyas-alkhawf-altamaa",
      tr: "/korku-acgozluluk-endeksi",
      hi: "/bhay-lobh-soochank",
    },

    "/conversor-divisas": {
      es: "/conversor-divisas",
      en: "/currency-converter",
      de: "/waehrungsrechner",
      zh: "/huobi-zhuanhua",
      ar: "/muhawwil-alumlat",
      tr: "/doviz-cevirici",
      hi: "/mudra-badlav",
    },

    "/comparador": {
      es: "/comparador",
      en: "/comparator",
      de: "/vergleich",
      zh: "/bijiao",
      ar: "/muqarin",
      tr: "/karsilastirma",
      hi: "/tulana",
    },

    "/comparar/oro-vs-bitcoin": {
      es: "/comparar/oro-vs-bitcoin",
      en: "/compare/gold-vs-bitcoin",
      de: "/vergleich/gold-vs-bitcoin",
      zh: "/bijiao/huangjin-vs-bitcoin",
      ar: "/muqarana/dhahab-vs-bitcoin",
      tr: "/karsilastir/altin-vs-bitcoin",
      hi: "/tulana/sona-vs-bitcoin",
    },

    "/comparar/oro-vs-sp500": {
      es: "/comparar/oro-vs-sp500",
      en: "/compare/gold-vs-sp500",
      de: "/vergleich/gold-vs-sp500",
      zh: "/bijiao/huangjin-vs-sp500",
      ar: "/muqarana/dhahab-vs-sp500",
      tr: "/karsilastir/altin-vs-sp500",
      hi: "/tulana/sona-vs-sp500",
    },

    "/ratio-oro-plata": {
      es: "/ratio-oro-plata",
      en: "/gold-silver-ratio",
      de: "/gold-silber-verhaeltnis",
      zh: "/jin-yin-bi",
      ar: "/nisbat-althahab-alfiddah",
      tr: "/altin-gumus-orani",
      hi: "/sona-chandi-anupat",
    },

    "/calendario-economico": {
      es: "/calendario-economico",
      en: "/economic-calendar",
      de: "/wirtschaftskalender",
      zh: "/jingji-rili",
      ar: "/altaqwim-aliqtisadi",
      tr: "/ekonomik-takvim",
      hi: "/arthik-patra",
    },

    "/guia-inversion": {
      es: "/guia-inversion",
      en: "/investment-guide",
      de: "/investitionsleitfaden",
      zh: "/touzi-zhinan",
      ar: "/dalil-alistithmar",
      tr: "/yatirim-rehberi",
      hi: "/nivesh-margdarshika",
    },

    "/productos": {
      es: "/productos",
      en: "/products",
      de: "/produkte",
      zh: "/chanpin",
      ar: "/muntajat",
      tr: "/urunler",
      hi: "/utpad",
    },

    "/productos/[slug]": {
      es: "/productos/[slug]",
      en: "/products/[slug]",
      de: "/produkte/[slug]",
      zh: "/chanpin/[slug]",
      ar: "/muntajat/[slug]",
      tr: "/urunler/[slug]",
      hi: "/utpad/[slug]",
    },

    "/noticias": {
      es: "/noticias",
      en: "/news",
      de: "/nachrichten",
      zh: "/xinwen",
      ar: "/akhbar",
      tr: "/haberler",
      hi: "/samachar",
    },

    "/noticias/[slug]": {
      es: "/noticias/[slug]",
      en: "/news/[slug]",
      de: "/nachrichten/[slug]",
      zh: "/xinwen/[slug]",
      ar: "/akhbar/[slug]",
      tr: "/haberler/[slug]",
      hi: "/samachar/[slug]",
    },

    "/learn": {
      es: "/aprende-inversion",
      en: "/learn",
      de: "/lernen-investition",
      zh: "/xuexi",
      ar: "/taallam",
      tr: "/ogren-yatirim",
      hi: "/gyaan-nivesh",
    },

    "/learn/[cluster]": {
      es: "/aprende-inversion/[cluster]",
      en: "/learn/[cluster]",
      de: "/lernen-investition/[cluster]",
      zh: "/xuexi/[cluster]",
      ar: "/taallam/[cluster]",
      tr: "/ogren-yatirim/[cluster]",
      hi: "/gyaan-nivesh/[cluster]",
    },

    "/learn/[cluster]/[slug]": {
      es: "/aprende-inversion/[cluster]/[slug]",
      en: "/learn/[cluster]/[slug]",
      de: "/lernen-investition/[cluster]/[slug]",
      zh: "/xuexi/[cluster]/[slug]",
      ar: "/taallam/[cluster]/[slug]",
      tr: "/ogren-yatirim/[cluster]/[slug]",
      hi: "/gyaan-nivesh/[cluster]/[slug]",
    },

    "/alertas": {
      es: "/alertas",
      en: "/alerts",
      de: "/benachrichtigungen",
      zh: "/jingbao",
      ar: "/tanbihat",
      tr: "/uyarilar",
      hi: "/suchnayen",
    },

    "/panel": {
      es: "/panel",
      en: "/dashboard",
      de: "/panel",
      zh: "/mianban",
      ar: "/lawha",
      tr: "/panel",
      hi: "/dashboard",
    },

    "/aviso-legal": {
      es: "/aviso-legal",
      en: "/legal-notice",
      de: "/impressum",
      zh: "/falv-shengming",
      ar: "/ishaar-qanuni",
      tr: "/yasal-uyari",
      hi: "/vidhey-suchna",
    },

    "/terminos": {
      es: "/terminos",
      en: "/terms",
      de: "/agb",
      zh: "/tiaokuan",
      ar: "/shurut",
      tr: "/sartlar",
      hi: "/sharten",
    },

    "/privacidad": {
      es: "/privacidad",
      en: "/privacy",
      de: "/datenschutz",
      zh: "/yinsi",
      ar: "/khususiyah",
      tr: "/gizlilik",
      hi: "/gagta",
    },

    "/donde-comprar": {
      es: "/donde-comprar",
      en: "/where-to-buy",
      de: "/wo-kaufen",
      zh: "/goumai-didian",
      ar: "/amakin-alshira",
      tr: "/nereden-alinir",
      hi: "/kahan-kharidem",
    },

    "/donde-comprar/mejores": {
      es: "/donde-comprar/mejores",
      en: "/where-to-buy/best",
      de: "/wo-kaufen/beste",
      zh: "/goumai-didian/zuijia",
      ar: "/amakin-alshira/afdal",
      tr: "/nereden-alinir/en-iyi",
      hi: "/kahan-kharidem/sabse-achhe",
    },

    "/donde-comprar/[country]": {
      es: "/donde-comprar/[country]",
      en: "/where-to-buy/[country]",
      de: "/wo-kaufen/[country]",
      zh: "/goumai-didian/[country]",
      ar: "/amakin-alshira/[country]",
      tr: "/nereden-alinir/[country]",
      hi: "/kahan-kharidem/[country]",
    },

    "/donde-comprar/[country]/[city]": {
      es: "/donde-comprar/[country]/[city]",
      en: "/where-to-buy/[country]/[city]",
      de: "/wo-kaufen/[country]/[city]",
      zh: "/goumai-didian/[country]/[city]",
      ar: "/amakin-alshira/[country]/[city]",
      tr: "/nereden-alinir/[country]/[city]",
      hi: "/kahan-kharidem/[country]/[city]",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
