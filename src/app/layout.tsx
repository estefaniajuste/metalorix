import type { Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { WebVitals } from "./web-vitals";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorker";
import { rtlLocales, type Locale } from "@/i18n/config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-noto-sc",
});

export async function generateMetadata() {
  const t = await getTranslations("metadata");
  const locale = await getLocale();
  const localeMap: Record<string, string> = {
    es: "es_ES", en: "en_US", zh: "zh_CN", ar: "ar_SA", tr: "tr_TR", de: "de_DE",
  };

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://metalorix.com"),
    icons: {
      icon: "/favicon.png",
      apple: "/icon-192.png",
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent" as const,
      title: "Metalorix",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: "https://metalorix.com",
      siteName: "Metalorix",
      locale: localeMap[locale] || "es_ES",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://metalorix.com",
      languages: {
        es: "https://metalorix.com",
        en: "https://metalorix.com",
        zh: "https://metalorix.com",
        ar: "https://metalorix.com",
        tr: "https://metalorix.com",
        de: "https://metalorix.com",
        "x-default": "https://metalorix.com",
      },
    },
  };
}

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
  const t = await getTranslations("home");
  const isRtl = rtlLocales.includes(locale as Locale);
  const isCJK = locale === "zh";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.gold-api.com" />
        <link rel="dns-prefetch" href="https://api.twelvedata.com" />
      </head>
      <body className={`${inter.variable} ${notoSansSC.variable} ${isCJK ? "font-cjk" : "font-sans"}`}>
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
              {t("skipToContent")}
            </a>
            <Nav />
            <main id="main-content">{children}</main>
            <Footer />
            <ScrollToTop />
            <CookieConsent />
            <WebVitals />
            <ServiceWorkerRegistration />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
