import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { WebVitals } from "./web-vitals";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Metalorix — Precios de Oro, Plata y Platino",
  description:
    "Precios spot en tiempo real y analítica para Oro (XAU), Plata (XAG) y Platino (XPT). Datos limpios, gráficos profesionales, cero ruido.",
  metadataBase: new URL("https://metalorix.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Metalorix",
  },
  openGraph: {
    title: "Metalorix — Precios de Oro, Plata y Platino",
    description:
      "Precios spot en tiempo real y analítica para Oro, Plata y Platino. Datos limpios, gráficos profesionales, cero ruido.",
    type: "website",
    url: "https://metalorix.com",
    siteName: "Metalorix",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Metalorix — Precios de Oro, Plata y Platino",
    description:
      "Precios spot en tiempo real para Oro, Plata y Platino.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://metalorix.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#D6B35A",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.gold-api.com" />
        <link rel="dns-prefetch" href="https://api.twelvedata.com" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9K1MTS78FF"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9K1MTS78FF');`}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-gold focus:text-[#0B0F17] focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm focus:font-semibold"
            >
              Saltar al contenido
            </a>
            <Nav />
            <main id="main-content">{children}</main>
            <Footer />
            <ScrollToTop />
            <CookieConsent />
            <WebVitals />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
