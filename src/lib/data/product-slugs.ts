const PRODUCT_SLUGS_I18N: Record<string, Record<string, string>> = {
  en: {
    "krugerrand-oro": "krugerrand-gold",
    "american-eagle-oro": "american-eagle-gold",
    "maple-leaf-oro": "maple-leaf-gold",
    "filarmonica-oro": "philharmonic-gold",
    "britannia-oro": "britannia-gold",
    "canguro-oro": "kangaroo-gold",
    "bufalo-americano-oro": "american-buffalo-gold",
    "panda-oro": "panda-gold",
    "lingote-oro-100g": "gold-bar-100g",
    "lingote-oro-1oz": "gold-bar-1oz",
    "lingote-oro-10g": "gold-bar-10g",
    "lingote-oro-1kg": "gold-bar-1kg",
    "american-eagle-plata": "american-eagle-silver",
    "maple-leaf-plata": "maple-leaf-silver",
    "filarmonica-plata": "philharmonic-silver",
    "britannia-plata": "britannia-silver",
    "canguro-plata": "kangaroo-silver",
    "krugerrand-plata": "krugerrand-silver",
    "panda-plata": "panda-silver",
    "libertad-plata": "libertad-silver",
    "lingote-plata-1kg": "silver-bar-1kg",
    "lingote-plata-100oz": "silver-bar-100oz",
  },
  de: {
    "krugerrand-oro": "krugerrand-gold",
    "american-eagle-oro": "american-eagle-gold",
    "maple-leaf-oro": "maple-leaf-gold",
    "filarmonica-oro": "philharmoniker-gold",
    "britannia-oro": "britannia-gold",
    "canguro-oro": "kanguru-gold",
    "bufalo-americano-oro": "american-buffalo-gold",
    "panda-oro": "panda-gold",
    "lingote-oro-100g": "goldbarren-100g",
    "lingote-oro-1oz": "goldbarren-1oz",
    "lingote-oro-10g": "goldbarren-10g",
    "lingote-oro-1kg": "goldbarren-1kg",
    "american-eagle-plata": "american-eagle-silber",
    "maple-leaf-plata": "maple-leaf-silber",
    "filarmonica-plata": "philharmoniker-silber",
    "britannia-plata": "britannia-silber",
    "canguro-plata": "kanguru-silber",
    "krugerrand-plata": "krugerrand-silber",
    "panda-plata": "panda-silber",
    "libertad-plata": "libertad-silber",
    "lingote-plata-1kg": "silberbarren-1kg",
    "lingote-plata-100oz": "silberbarren-100oz",
  },
  tr: {
    "krugerrand-oro": "krugerrand-altin",
    "american-eagle-oro": "american-eagle-altin",
    "maple-leaf-oro": "maple-leaf-altin",
    "filarmonica-oro": "filarmoni-altin",
    "britannia-oro": "britannia-altin",
    "canguro-oro": "kanguru-altin",
    "bufalo-americano-oro": "american-buffalo-altin",
    "panda-oro": "panda-altin",
    "lingote-oro-100g": "altin-kulce-100g",
    "lingote-oro-1oz": "altin-kulce-1oz",
    "lingote-oro-10g": "altin-kulce-10g",
    "lingote-oro-1kg": "altin-kulce-1kg",
    "american-eagle-plata": "american-eagle-gumus",
    "maple-leaf-plata": "maple-leaf-gumus",
    "filarmonica-plata": "filarmoni-gumus",
    "britannia-plata": "britannia-gumus",
    "canguro-plata": "kanguru-gumus",
    "krugerrand-plata": "krugerrand-gumus",
    "panda-plata": "panda-gumus",
    "libertad-plata": "libertad-gumus",
    "lingote-plata-1kg": "gumus-kulce-1kg",
    "lingote-plata-100oz": "gumus-kulce-100oz",
  },
  // ZH and AR use English slugs for URL readability
};
PRODUCT_SLUGS_I18N.zh = PRODUCT_SLUGS_I18N.en;
PRODUCT_SLUGS_I18N.ar = PRODUCT_SLUGS_I18N.en;

const PRODUCT_REVERSE: Record<string, Record<string, string>> = {};
for (const [locale, mapping] of Object.entries(PRODUCT_SLUGS_I18N)) {
  PRODUCT_REVERSE[locale] = {};
  for (const [base, localized] of Object.entries(mapping)) {
    PRODUCT_REVERSE[locale][localized] = base;
  }
}

export function getLocalizedProductSlug(baseSlug: string, locale: string): string {
  if (locale === "es") return baseSlug;
  return PRODUCT_SLUGS_I18N[locale]?.[baseSlug] ?? PRODUCT_SLUGS_I18N.en?.[baseSlug] ?? baseSlug;
}

export function getBaseProductSlug(localizedSlug: string, locale: string): string {
  if (locale === "es") return localizedSlug;
  if (locale !== "es") {
    const result = PRODUCT_REVERSE[locale]?.[localizedSlug];
    if (result) return result;
  }
  for (const mapping of Object.values(PRODUCT_REVERSE)) {
    if (mapping[localizedSlug]) return mapping[localizedSlug];
  }
  return localizedSlug;
}

export function getAllLocalizedSlugsForBase(baseSlug: string): string[] {
  const all = new Set<string>([baseSlug]);
  for (const mapping of Object.values(PRODUCT_SLUGS_I18N)) {
    const localized = (mapping as Record<string, string>)[baseSlug];
    if (localized) all.add(localized);
  }
  return Array.from(all);
}

export function getProductSlugsByLocale(baseSlug: string): Record<string, string> {
  const result: Record<string, string> = { es: baseSlug };
  for (const [locale, mapping] of Object.entries(PRODUCT_SLUGS_I18N)) {
    result[locale] = mapping[baseSlug] ?? baseSlug;
  }
  return result;
}
