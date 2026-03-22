const INTERNAL_TO_LOCALE: Record<string, Record<string, string>> = {
  oro: {
    es: "oro",
    en: "gold",
    de: "gold",
    zh: "gold",
    ar: "gold",
    tr: "altin",
    hi: "sona",
  },
  plata: {
    es: "plata",
    en: "silver",
    de: "silber",
    zh: "silver",
    ar: "silver",
    tr: "gumus",
    hi: "chandi",
  },
  platino: {
    es: "platino",
    en: "platinum",
    de: "platin",
    zh: "platinum",
    ar: "platinum",
    tr: "platin",
    hi: "platinam",
  },
  paladio: {
    es: "paladio",
    en: "palladium",
    de: "palladium",
    zh: "palladium",
    ar: "palladium",
    tr: "paladyum",
    hi: "palladium",
  },
  cobre: {
    es: "cobre",
    en: "copper",
    de: "kupfer",
    zh: "copper",
    ar: "copper",
    tr: "bakir",
    hi: "tamba",
  },
};

const LOCALE_TO_INTERNAL: Record<string, string> = {};
for (const [internal, locales] of Object.entries(INTERNAL_TO_LOCALE)) {
  for (const localized of Object.values(locales)) {
    LOCALE_TO_INTERNAL[localized] = internal;
  }
}

export function getLocalizedMetalSlug(
  internalSlug: string,
  locale: string
): string {
  return INTERNAL_TO_LOCALE[internalSlug]?.[locale] ?? internalSlug;
}

export function resolveMetalSlug(slug: string): string | null {
  return LOCALE_TO_INTERNAL[slug] ?? null;
}

export function getAllMetalSlugs(): string[] {
  const slugs = new Set<string>();
  for (const locales of Object.values(INTERNAL_TO_LOCALE)) {
    for (const slug of Object.values(locales)) {
      slugs.add(slug);
    }
  }
  return Array.from(slugs);
}

export const INTERNAL_METAL_SLUGS = Object.keys(INTERNAL_TO_LOCALE);
