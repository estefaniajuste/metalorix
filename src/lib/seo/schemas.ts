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

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  url: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    inLanguage: opts.locale,
    url: opts.url,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function productSchema(opts: {
  name: string;
  description: string;
  brand: string;
  url: string;
  image: string;
  weightG: number;
  material: string;
  priceCurrency: string;
  price: number;
  countryOfOrigin?: string;
  ratingValue: number;
  reviewBody: string;
}) {
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    image: opts.image,
    brand: { "@type": "Brand", name: opts.brand },
    material: opts.material,
    weight: {
      "@type": "QuantitativeValue",
      value: opts.weightG,
      unitCode: "GRM",
    },
    ...(opts.countryOfOrigin && {
      countryOfOrigin: { "@type": "Country", name: opts.countryOfOrigin },
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: opts.ratingValue.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1",
      reviewCount: "1",
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Organization",
        name: "Metalorix",
        url: "https://metalorix.com",
      },
      datePublished: "2026-03-01",
      reviewRating: {
        "@type": "Rating",
        ratingValue: opts.ratingValue.toFixed(1),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: opts.reviewBody,
    },
    offers: {
      "@type": "Offer",
      price: opts.price.toFixed(2),
      priceCurrency: opts.priceCurrency,
      availability: "https://schema.org/InStock",
      priceValidUntil: tomorrow,
      url: opts.url,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: opts.priceCurrency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Metalorix",
    url: "https://metalorix.com",
    logo: {
      "@type": "ImageObject",
      url: "https://metalorix.com/favicon.png",
      width: 512,
      height: 512,
    },
    description:
      "Precious metals price tracking platform for gold, silver, platinum, palladium and copper.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hola@metalorix.com",
      availableLanguage: ["Spanish", "English", "German", "Chinese", "Arabic", "Turkish"],
    },
  };
}
