import type { Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
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
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { DynamicTitle } from "@/components/layout/DynamicTitle";
import { AnalyticsLoader } from "@/components/layout/AnalyticsLoader";
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
    es: "es_ES", en: "en_US", zh: "zh_CN", ar: "ar_SA", tr: "tr_TR", de: "de_DE", hi: "hi_IN",
  };

  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `https://metalorix.com/${loc}`;
  }
  alternates["x-default"] = `https://metalorix.com/${routing.defaultLocale}`;

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://metalorix.com"),
    icons: {
      icon: "/favicon.png",
      apple: [
        { url: "/icon-192.png", sizes: "192x192" },
        { url: "/icon-512.png", sizes: "512x512" },
      ],
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
  const tNav = await getTranslations("nav");
  const isRtl = RTL_LOCALES.includes(locale);
  const isCJK = locale === "zh";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <meta name="impact-site-verification" content="32e0b93a-2315-4d86-904c-53db53e7bf33" />
        <link rel="alternate" type="application/rss+xml" title={`Metalorix — ${tNav("news")}`} href="/feed.xml" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.gold-api.com" />
        <link rel="dns-prefetch" href="https://api.twelvedata.com" />
        {/* Google Consent Mode v2 — must run before gtag.js loads */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:2000});` }} />
      </head>
      <body className={`${inter.variable} ${notoSansSC.variable} ${isCJK ? "font-cjk" : "font-sans"}`}>
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
            <AnalyticsLoader />
            <WebVitals />
            <ServiceWorkerRegistration />
            <InstallPrompt />
            <DynamicTitle />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
