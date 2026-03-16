import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "zh", "ar", "tr", "de"] as const,
  defaultLocale: "es",
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
    },

    "/precio-oro-hoy": {
      es: "/precio-oro-hoy",
      en: "/gold-price-today",
      de: "/goldpreis-heute",
      zh: "/jin-ri-jin-jia",
      ar: "/sier-althahab-alyawm",
      tr: "/altin-fiyati-bugun",
    },

    "/precio-gramo-oro": {
      es: "/precio-gramo-oro",
      en: "/gold-price-per-gram",
      de: "/goldpreis-pro-gramm",
      zh: "/mei-ke-jin-jia",
      ar: "/sier-ghram-althahab",
      tr: "/gram-altin-fiyati",
    },

    "/herramientas": {
      es: "/herramientas",
      en: "/tools",
      de: "/werkzeuge",
      zh: "/gongju",
      ar: "/adawat",
      tr: "/araclar",
    },

    "/calculadora-rentabilidad": {
      es: "/calculadora-rentabilidad",
      en: "/roi-calculator",
      de: "/renditerechner",
      zh: "/shouyi-jisuan",
      ar: "/hasibat-alarabah",
      tr: "/getiri-hesaplayici",
    },

    "/conversor-divisas": {
      es: "/conversor-divisas",
      en: "/currency-converter",
      de: "/waehrungsrechner",
      zh: "/huobi-zhuanhua",
      ar: "/muhawwil-alumlat",
      tr: "/doviz-cevirici",
    },

    "/comparador": {
      es: "/comparador",
      en: "/comparator",
      de: "/vergleich",
      zh: "/bijiao",
      ar: "/muqarin",
      tr: "/karsilastirma",
    },

    "/ratio-oro-plata": {
      es: "/ratio-oro-plata",
      en: "/gold-silver-ratio",
      de: "/gold-silber-verhaeltnis",
      zh: "/jin-yin-bi",
      ar: "/nisbat-althahab-alfiddah",
      tr: "/altin-gumus-orani",
    },

    "/calendario-economico": {
      es: "/calendario-economico",
      en: "/economic-calendar",
      de: "/wirtschaftskalender",
      zh: "/jingji-rili",
      ar: "/altaqwim-aliqtisadi",
      tr: "/ekonomik-takvim",
    },

    "/guia-inversion": {
      es: "/guia-inversion",
      en: "/investment-guide",
      de: "/anleitfaden",
      zh: "/touzi-zhinan",
      ar: "/dalil-alistithmar",
      tr: "/yatirim-rehberi",
    },

    "/productos": {
      es: "/productos",
      en: "/products",
      de: "/produkte",
      zh: "/chanpin",
      ar: "/muntajat",
      tr: "/urunler",
    },

    "/productos/[slug]": {
      es: "/productos/[slug]",
      en: "/products/[slug]",
      de: "/produkte/[slug]",
      zh: "/chanpin/[slug]",
      ar: "/muntajat/[slug]",
      tr: "/urunler/[slug]",
    },

    "/noticias": {
      es: "/noticias",
      en: "/news",
      de: "/nachrichten",
      zh: "/xinwen",
      ar: "/akhbar",
      tr: "/haberler",
    },

    "/noticias/[slug]": {
      es: "/noticias/[slug]",
      en: "/news/[slug]",
      de: "/nachrichten/[slug]",
      zh: "/xinwen/[slug]",
      ar: "/akhbar/[slug]",
      tr: "/haberler/[slug]",
    },

    "/learn": {
      es: "/aprende-inversion",
      en: "/learn",
      de: "/lernen-investition",
      zh: "/xuexi",
      ar: "/taallam",
      tr: "/ogren-yatirim",
    },

    "/learn/[cluster]": {
      es: "/aprende-inversion/[cluster]",
      en: "/learn/[cluster]",
      de: "/lernen-investition/[cluster]",
      zh: "/xuexi/[cluster]",
      ar: "/taallam/[cluster]",
      tr: "/ogren-yatirim/[cluster]",
    },

    "/learn/[cluster]/[slug]": {
      es: "/aprende-inversion/[cluster]/[slug]",
      en: "/learn/[cluster]/[slug]",
      de: "/lernen-investition/[cluster]/[slug]",
      zh: "/xuexi/[cluster]/[slug]",
      ar: "/taallam/[cluster]/[slug]",
      tr: "/ogren-yatirim/[cluster]/[slug]",
    },

    "/alertas": {
      es: "/alertas",
      en: "/alerts",
      de: "/benachrichtigungen",
      zh: "/jingbao",
      ar: "/tanbihat",
      tr: "/uyarilar",
    },

    "/panel": {
      es: "/panel",
      en: "/dashboard",
      de: "/panel",
      zh: "/mianban",
      ar: "/lawha",
      tr: "/panel",
    },

    "/aviso-legal": {
      es: "/aviso-legal",
      en: "/legal-notice",
      de: "/impressum",
      zh: "/falv-shengming",
      ar: "/ishaar-qanuni",
      tr: "/yasal-uyari",
    },

    "/terminos": {
      es: "/terminos",
      en: "/terms",
      de: "/agb",
      zh: "/tiaokuan",
      ar: "/shurut",
      tr: "/sartlar",
    },

    "/privacidad": {
      es: "/privacidad",
      en: "/privacy",
      de: "/datenschutz",
      zh: "/yinsi",
      ar: "/khususiyah",
      tr: "/gizlilik",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
