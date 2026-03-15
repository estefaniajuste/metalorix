import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function LearnBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://metalorix.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link
                href={item.href}
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
