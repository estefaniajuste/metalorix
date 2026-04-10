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

type HrefInputOrPerLocale = HrefInput | ((loc: Locale) => HrefInput);

const MAX_TITLE = 60;
const BRAND = " | Metalorix";
const BRAND_DASH = " — Metalorix";

/**
 * Build a <title> that fits within Google's ~60-char display limit.
 * Appends the brand suffix only if the total stays ≤ 60 chars.
 */
export function buildMetaTitle(title: string, separator: "|" | "—" = "|"): string {
  const suffix = separator === "—" ? BRAND_DASH : BRAND;
  return (title.length + suffix.length <= MAX_TITLE)
    ? `${title}${suffix}`
    : title;
}

export function getAlternates(
  locale: string,
  href: HrefInputOrPerLocale
) {
  const resolveHref = (loc: Locale) =>
    typeof href === "function" ? href(loc) : href;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    const h = resolveHref(loc as Locale);
    languages[loc] = `${BASE_URL}${getPathname({ locale: loc as Locale, href: h as any })}`;
  }
  languages["x-default"] = languages[routing.defaultLocale];

  return {
    canonical: `${BASE_URL}${getPathname({ locale: locale as Locale, href: resolveHref(locale as Locale) as any })}`,
    languages,
  };
}
