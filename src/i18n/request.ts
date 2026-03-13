import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";

const messageImports = {
  es: () => import("../../messages/es.json"),
  en: () => import("../../messages/en.json"),
  pt: () => import("../../messages/pt.json"),
} as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value as Locale | undefined;

  let locale: Locale = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const headerStore = await headers();
    const acceptLang = headerStore.get("accept-language") || "";
    const preferred = acceptLang
      .split(",")
      .map((l) => l.split(";")[0].trim().substring(0, 2).toLowerCase());

    for (const lang of preferred) {
      if (locales.includes(lang as Locale)) {
        locale = lang as Locale;
        break;
      }
    }
  }

  const messages = (await messageImports[locale]()).default;

  return { locale, messages };
});
