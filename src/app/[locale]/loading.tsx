export default function Loading() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="h-10 w-64 bg-surface-2 rounded-sm animate-shimmer mb-4" />
        <div className="h-5 w-96 max-w-full bg-surface-2 rounded-xs animate-shimmer mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-1 border border-border rounded-DEFAULT p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xs bg-surface-2 animate-shimmer" />
                <div>
                  <div className="h-4 w-14 bg-surface-2 rounded-xs animate-shimmer mb-1" />
                  <div className="h-3 w-10 bg-surface-2 rounded-xs animate-shimmer" />
                </div>
              </div>
              <div className="h-8 w-28 bg-surface-2 rounded-xs animate-shimmer mb-2" />
              <div className="h-3 w-20 bg-surface-2 rounded-xs animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
