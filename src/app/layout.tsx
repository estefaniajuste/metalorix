import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Metalorix — Precios de Oro, Plata y Platino",
  description:
    "Precios spot en tiempo real y analítica para Oro (XAU), Plata (XAG) y Platino (XPT). Datos limpios, gráficos profesionales, cero ruido.",
  metadataBase: new URL("https://metalorix.com"),
  icons: {
    icon: "/favicon.svg",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
  themeColor: "#D6B35A",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
