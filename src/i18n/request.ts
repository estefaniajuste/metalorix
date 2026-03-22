import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messageImports = {
  es: () => import("../../messages/es.json"),
  en: () => import("../../messages/en.json"),
  zh: () => import("../../messages/zh.json"),
  ar: () => import("../../messages/ar.json"),
  tr: () => import("../../messages/tr.json"),
  de: () => import("../../messages/de.json"),
  hi: () => import("../../messages/hi.json"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  const messages = (await messageImports[locale as keyof typeof messageImports]()).default;

  return { locale, messages };
});
