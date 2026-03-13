export const locales = ["es", "en", "zh", "ar", "tr", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const rtlLocales: Locale[] = ["ar"];
