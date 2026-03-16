import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Href = string | { pathname: string; params: Record<string, string> };

interface BreadcrumbItem {
  label: string;
  href?: Href;
}

const BASE_URL = "https://metalorix.com";

export function LearnBreadcrumb({
  items,
  locale,
  ariaLabel = "Breadcrumb",
}: {
  items: BreadcrumbItem[];
  locale: string;
  ariaLabel?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? { item: `${BASE_URL}${getPathname({ locale: locale as Locale, href: item.href as any })}` }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-content-3 mb-6" aria-label={ariaLabel}>
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link
                href={item.href as any}
                className="hover:text-content-1 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-content-1">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
