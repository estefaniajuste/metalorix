import { routing } from "./routing";

export type { Locale } from "./routing";

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
export const rtlLocales = ["ar"] as const;
