import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const BASE_URL = "https://metalorix.com";

type StaticPathname = {
  [K in keyof typeof routing.pathnames]: (typeof routing.pathnames)[K] extends string
    ? K
    : K extends `${string}[${string}]${string}`
      ? never
      : K;
}[keyof typeof routing.pathnames];

type HrefInput =
  | StaticPathname
  | {
      pathname: keyof typeof routing.pathnames;
      params: Record<string, string>;
    };

export function getAlternates(locale: string, href: HrefInput) {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${BASE_URL}${getPathname({ locale: loc as Locale, href: href as any })}`;
  }
  languages["x-default"] = languages.es;

  return {
    canonical: `${BASE_URL}${getPathname({ locale: locale as Locale, href: href as any })}`,
    languages,
  };
}
