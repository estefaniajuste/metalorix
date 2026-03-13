import { Hero } from "@/components/dashboard/Hero";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getTranslations, getLocale } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("metadata");
  const locale = await getLocale();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Metalorix",
    url: "https://metalorix.com",
    logo: "https://metalorix.com/icon-512.png",
    description: t("description"),
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Metalorix",
    url: "https://metalorix.com",
    description: t("description"),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://metalorix.com/precio/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

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
