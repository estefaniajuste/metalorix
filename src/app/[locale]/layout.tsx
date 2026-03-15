import type { Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { WebVitals } from "../web-vitals";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorker";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const localeMap: Record<string, string> = {
    es: "es_ES", en: "en_US", zh: "zh_CN", ar: "ar_SA", tr: "tr_TR", de: "de_DE",
  };

  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `https://metalorix.com/${loc}`;
  }
  alternates["x-default"] = "https://metalorix.com/es";

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
      url: `https://metalorix.com/${locale}`,
      siteName: "Metalorix",
      locale: localeMap[locale] || "es_ES",
      images: [
        {
          url: `https://metalorix.com/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Metalorix — Precious Metals Prices",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: t("title"),
      description: t("description"),
      images: [`https://metalorix.com/${locale}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://metalorix.com/${locale}`,
      languages: alternates,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#D6B35A",
};

const RTL_LOCALES = ["ar"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations("home");
  const isRtl = RTL_LOCALES.includes(locale);
  const isCJK = locale === "zh";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Metalorix — Noticias" href="/feed.xml" />
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
