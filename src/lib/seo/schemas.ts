import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const BASE_URL = "https://metalorix.com";

function localizedUrl(locale: string, pathname: string): string {
  return `${BASE_URL}${getPathname({ locale: locale as Locale, href: pathname as any })}`;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(
  items: BreadcrumbItem[],
  homeName: string,
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: localizedUrl(locale, "/") },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: localizedUrl(locale, item.path),
      })),
    ],
  };
}

export function webPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: localizedUrl(opts.locale, opts.path),
    isPartOf: { "@type": "WebSite", name: "Metalorix", url: BASE_URL },
    inLanguage: opts.locale,
  };
}

export function softwareAppSchema(opts: {
  name: string;
  description: string;
  path: string;
  locale: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url: localizedUrl(opts.locale, opts.path),
    applicationCategory: opts.category || "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function schemaTag(schema: Record<string, unknown>) {
  return JSON.stringify(schema);
}
