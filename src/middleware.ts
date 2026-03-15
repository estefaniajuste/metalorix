import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const CANONICAL_HOST = "metalorix.com";

/**
 * Path aliases that map non-standard legacy URLs to internal pathnames.
 * next-intl's handleI18nRouting then detects locale via Accept-Language /
 * cookie and serves the correct localized URL. We no longer hardcode `/es/`.
 */
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
  "/glossary": "/aprende",
  "/glosario": "/aprende",
  "/education": "/aprende",
  "/educacion": "/aprende",
  "/aprender": "/aprende",
  "/lernen": "/aprende",
  "/xuexi": "/aprende",
  "/taallam": "/aprende",
  "/ogren": "/aprende",
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

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
  }

  const alias = PATH_ALIASES[pathname.toLowerCase()];
  if (alias) {
    const rewritten = new URL(alias, request.url);
    rewritten.search = request.nextUrl.search;
    return NextResponse.redirect(rewritten, 301);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.png|icon-.*\\.png|manifest\\.json|robots\\.txt|sitemap\\.xml|google.*\\.html).*)",
  ],
};
