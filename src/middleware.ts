import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SEO_REDIRECTS: Record<string, string> = {
  "/oro": "/precio/oro",
  "/plata": "/precio/plata",
  "/platino": "/precio/platino",
  "/gold": "/precio/oro",
  "/silver": "/precio/plata",
  "/platinum": "/precio/platino",
  "/tools": "/herramientas",
  "/news": "/noticias",
  "/glossary": "/glosario",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const redirect = SEO_REDIRECTS[pathname.toLowerCase()];
  if (redirect) {
    return NextResponse.redirect(new URL(redirect, request.url), 301);
  }

  const response = NextResponse.next();

  if (pathname.startsWith("/api/")) {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.svg|icon-.*\\.png|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};
