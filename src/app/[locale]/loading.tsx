export default function Loading() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="h-10 w-64 bg-surface-2 rounded-sm animate-shimmer mb-4" />
        <div className="h-5 w-96 max-w-full bg-surface-2 rounded-xs animate-shimmer mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-1 border border-border rounded-DEFAULT p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xs bg-surface-2 animate-shimmer" />
                <div>
                  <div className="h-4 w-16 bg-surface-2 rounded-xs animate-shimmer mb-1.5" />
                  <div className="h-3 w-10 bg-surface-2 rounded-xs animate-shimmer" />
                </div>
              </div>
              <div className="h-9 w-40 bg-surface-2 rounded-xs animate-shimmer mb-2" />
              <div className="h-4 w-24 bg-surface-2 rounded-xs animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
