"use client";

interface OutlookGaugeProps {
  score: number;
  signal: string;
  signalLabel: string;
  size?: "sm" | "lg";
}

function scoreColor(score: number): string {
  if (score >= 60) return "#22c55e";
  if (score >= 20) return "#84cc16";
  if (score > -20) return "#eab308";
  if (score > -60) return "#f97316";
  return "#ef4444";
}

export function OutlookGauge({ score, signal, signalLabel, size = "lg" }: OutlookGaugeProps) {
  const normalized = (score + 100) / 200;
  const angle = -180 + normalized * 180;
  const color = scoreColor(score);

  const w = size === "lg" ? 220 : 140;
  const h = size === "lg" ? 130 : 85;
  const cx = w / 2;
  const cy = size === "lg" ? 110 : 72;
  const r = size === "lg" ? 90 : 58;
  const strokeW = size === "lg" ? 14 : 10;
  const needleLen = size === "lg" ? 70 : 45;

  const arcPath = (startAngle: number, endAngle: number) => {
    const s = (startAngle * Math.PI) / 180;
    const e = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const needleAngle = (angle * Math.PI) / 180;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy + needleLen * Math.sin(needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <defs>
          <linearGradient id={`gauge-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        <path
          d={arcPath(-180, 0)}
          fill="none"
          stroke="var(--bg-3)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        <path
          d={arcPath(-180, 0)}
          fill="none"
          stroke={`url(#gauge-grad-${size})`}
          strokeWidth={strokeW}
          strokeLinecap="round"
          opacity={0.4}
        />

        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={color}
          strokeWidth={size === "lg" ? 3 : 2}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={size === "lg" ? 6 : 4} fill={color} />

        {size === "lg" && (
          <>
            <text x={8} y={cy + 20} fill="var(--text-3)" fontSize="10" fontFamily="inherit">-100</text>
            <text x={w - 28} y={cy + 20} fill="var(--text-3)" fontSize="10" fontFamily="inherit">+100</text>
          </>
        )}
      </svg>

      <div className="text-center -mt-1">
        <span
          className={`font-extrabold ${size === "lg" ? "text-3xl" : "text-xl"}`}
          style={{ color }}
        >
          {score > 0 ? "+" : ""}{score}
        </span>
        <div
          className={`font-bold uppercase tracking-wide ${size === "lg" ? "text-sm mt-1" : "text-xs mt-0.5"}`}
          style={{ color }}
        >
          {signalLabel}
        </div>
      </div>
    </div>
  );
}
