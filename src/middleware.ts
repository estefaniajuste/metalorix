import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const LEGACY_REDIRECTS: Record<string, string> = {
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
  "/learn": "/aprende",
  "/herramientas": "/es/herramientas",
  "/noticias": "/es/noticias",
  "/productos": "/es/productos",
  "/alertas": "/es/alertas",
  "/precio/oro": "/es/precio/oro",
  "/precio/plata": "/es/precio/plata",
  "/precio/platino": "/es/precio/platino",
  "/precio/paladio": "/es/precio/paladio",
  "/precio/cobre": "/es/precio/cobre",
  "/precio-oro-hoy": "/es/precio-oro-hoy",
  "/precio-gramo-oro": "/es/precio-gramo-oro",
  "/ratio-oro-plata": "/es/ratio-oro-plata",
  "/calculadora-rentabilidad": "/es/calculadora-rentabilidad",
  "/conversor-divisas": "/es/conversor-divisas",
  "/comparador": "/es/comparador",
  "/calendario-economico": "/es/calendario-economico",
  "/guia-inversion": "/es/guia-inversion",
  "/aprende": "/es/aprende",
  "/aviso-legal": "/es/aviso-legal",
  "/terminos": "/es/terminos",
  "/privacidad": "/es/privacidad",
  "/panel": "/es/panel",
};

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
  }

  const redirect = LEGACY_REDIRECTS[pathname.toLowerCase()];
  if (redirect) {
    return NextResponse.redirect(new URL(redirect, request.url), 301);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.png|icon-.*\\.png|manifest\\.json|robots\\.txt|sitemap\\.xml).*)",
  ],
};
