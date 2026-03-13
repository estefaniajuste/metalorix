import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artículo — Metalorix",
};

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <p className="text-content-3 text-sm mb-4">
          Slug: {params.slug}
        </p>
        <div className="text-center py-20 text-content-3 border border-dashed border-border rounded-DEFAULT">
          Artículo — Próximamente (Fase 2)
        </div>
      </div>
    </section>
  );
}
