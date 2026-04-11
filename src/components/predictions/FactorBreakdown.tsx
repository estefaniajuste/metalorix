"use client";

interface Factor {
  key: string;
  label: string;
  description: string;
  score: number;
  weight: number;
}

interface FactorBreakdownProps {
  factors: Factor[];
  title: string;
}

function barColor(score: number): string {
  if (score >= 40) return "#22c55e";
  if (score >= 10) return "#84cc16";
  if (score > -10) return "#eab308";
  if (score > -40) return "#f97316";
  return "#ef4444";
}

export function FactorBreakdown({ factors, title }: FactorBreakdownProps) {
  const sorted = [...factors].sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

  return (
    <div>
      <h3 className="text-sm font-bold text-content-0 mb-3">{title}</h3>
      <div className="space-y-3">
        {sorted.map((f) => {
          const width = Math.abs(f.score);
          const isPositive = f.score >= 0;
          const color = barColor(f.score);

          return (
            <div key={f.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-content-0">{f.label}</span>
                  <span className="text-[10px] text-content-3 bg-surface-2 px-1.5 py-0.5 rounded">
                    {Math.round(f.weight * 100)}%
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color }}>
                  {f.score > 0 ? "+" : ""}{f.score}
                </span>
              </div>

              <div className="relative h-2 bg-surface-2 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2" />
                  <div className="w-px bg-border h-full" />
                  <div className="w-1/2" />
                </div>

                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: color,
                    width: `${width / 2}%`,
                    left: isPositive ? "50%" : `${50 - width / 2}%`,
                  }}
                />
              </div>

              <p className="text-[10px] text-content-3 mt-0.5">{f.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
