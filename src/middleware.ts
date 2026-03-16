import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const CANONICAL_HOST = "metalorix.com";

const LOCALES = new Set(["es", "en", "zh", "ar", "tr", "de"]);

const LEARN_PATHS: Record<string, string> = {
  es: "/aprende-inversion",
  en: "/learn",
  de: "/lernen-investition",
  zh: "/xuexi",
  ar: "/taallam",
  tr: "/ogren-yatirim",
};

const LEARN_LEGACY_SEGMENTS = new Set([
  "aprende", "glosario", "glossary", "education", "educacion",
  "aprender", "lernen", "learn", "xuexi", "taallam", "ogren",
]);

const PATH_ALIASES: Record<string, string> = {
  "/oro": "/precio/oro",
  "/plata": "/precio/plata",
  "/platino": "/precio/platino",
  "/paladio": "/precio/paladio",
  "/cobre": "/precio/cobre",
  "/gold": "/precio/oro",
  "/silver": "/precio/plata",
  "/platinum": "/precio/platino",
  "/palladium": "/precio/paladio",
  "/copper": "/precio/cobre",
  "/tools": "/herramientas",
  "/news": "/noticias",
  "/glossary": "/learn",
  "/glosario": "/learn",
  "/education": "/learn",
  "/educacion": "/learn",
  "/aprender": "/learn",
  "/lernen": "/learn",
  "/xuexi": "/learn",
  "/taallam": "/learn",
  "/ogren": "/learn",
};

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "");

  if (
    host &&
    host !== CANONICAL_HOST &&
    host !== "localhost" &&
    !host.startsWith("127.0.0.1")
  ) {
    const canonical = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(canonical, 301);
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/sitemap.xml") {
    const dest = request.nextUrl.clone();
    dest.pathname = "/api/sitemap";
    return NextResponse.rewrite(dest);
  }

  if (pathname === "/feed.xml") {
    const dest = request.nextUrl.clone();
    dest.pathname = "/api/feed";
    return NextResponse.rewrite(dest);
  }

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
  }

  const lower = pathname.toLowerCase();
  const segments = lower.split("/").filter(Boolean);

  // Handle /{locale}/{legacy-learn-segment}[/...] → /{locale}/{correct-learn-path}[/...]
  if (segments.length >= 2 && LOCALES.has(segments[0])) {
    const locale = segments[0];
    const correctLearnPath = LEARN_PATHS[locale];

    if (LEARN_LEGACY_SEGMENTS.has(segments[1]) && `/${segments[1]}` !== correctLearnPath) {
      const rest = segments.slice(2).join("/");
      const target = `/${locale}${correctLearnPath}${rest ? `/${rest}` : ""}`;
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
  }

  // Handle bare /aprende, /glosario etc. (no locale prefix)
  if (
    lower === "/aprende" || lower.startsWith("/aprende/") ||
    lower === "/glosario" || lower.startsWith("/glosario/")
  ) {
    return NextResponse.redirect(new URL("/learn", request.url), 301);
  }

  const alias = PATH_ALIASES[lower];
  if (alias) {
    const rewritten = new URL(alias, request.url);
    rewritten.search = request.nextUrl.search;
    return NextResponse.redirect(rewritten, 301);
  }

  const response = handleI18nRouting(request);
  // Propagate the original URL so not-found/error pages can log it
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.png|icon-.*\\.png|manifest\\.json|robots\\.txt|google.*\\.html).*)",
  ],
};
