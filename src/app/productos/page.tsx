import type { Metadata } from "next";
import Link from "next/link";
import { ProductFilter } from "@/components/products/ProductFilter";

export const metadata: Metadata = {
  title:
    "Monedas y lingotes de inversión — Guía de productos | Metalorix",
  description:
    "Fichas completas de las monedas y lingotes de oro y plata más populares: Krugerrand, Maple Leaf, Filarmónica, Britannia, Eagle y lingotes LBMA. Pureza, prima, liquidez y fiscalidad en España.",
  keywords: [
    "monedas oro inversión",
    "lingotes oro inversión",
    "Krugerrand",
    "Maple Leaf oro",
    "Filarmónica Viena oro",
    "comprar oro España",
    "monedas plata inversión",
    "lingote oro 1 oz",
    "lingote plata 1 kg",
  ],
  openGraph: {
    title: "Monedas y lingotes de inversión — Metalorix",
    description:
      "Fichas de las principales monedas y lingotes de oro y plata: pureza, prima sobre spot, liquidez y fiscalidad en España.",
    type: "website",
    url: "https://metalorix.com/productos",
  },
  alternates: {
    canonical: "https://metalorix.com/productos",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://metalorix.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Productos",
      item: "https://metalorix.com/productos",
    },
  ],
};

export default function ProductosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav
            className="text-sm text-content-3 mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-content-1 transition-colors"
            >
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">Productos</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            Monedas y lingotes de inversión
          </h1>
          <p className="text-content-2 mb-10 max-w-3xl leading-relaxed">
            Fichas detalladas de las monedas y lingotes de oro y plata más
            negociados del mercado. Pureza, peso fino, prima típica sobre
            spot, liquidez, fiscalidad en España y para qué perfil de
            inversor es cada producto.
          </p>

          <ProductFilter />
        </div>
      </section>
    </>
  );
}
