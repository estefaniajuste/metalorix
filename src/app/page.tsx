import { Hero } from "@/components/dashboard/Hero";
import { Dashboard } from "@/components/dashboard/Dashboard";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Metalorix",
  url: "https://metalorix.com",
  logo: "https://metalorix.com/icon-512.png",
  description:
    "Plataforma de seguimiento de precios de metales preciosos en tiempo real. Oro, plata y platino con gráficos profesionales y herramientas de análisis.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Metalorix",
  url: "https://metalorix.com",
  description:
    "Precios spot en tiempo real para Oro (XAU), Plata (XAG) y Platino (XPT). Gráficos profesionales, herramientas de trading y análisis del mercado de metales preciosos.",
  inLanguage: "es",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://metalorix.com/precio/{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Hero />
      <Dashboard />
    </>
  );
}
