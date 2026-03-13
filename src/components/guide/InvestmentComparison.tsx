const methods = [
  {
    name: "Oro físico en casa",
    custody: "Propia",
    liquidity: "Baja",
    cost: "Bajo",
    risk: "Alto",
    idealFor: "Máxima privacidad",
  },
  {
    name: "Caja de seguridad bancaria",
    custody: "Banco",
    liquidity: "Baja",
    cost: "Medio",
    risk: "Medio",
    idealFor: "Seguridad delegada",
  },
  {
    name: "Bóveda en Suiza",
    custody: "Tercero (Suiza)",
    liquidity: "Media",
    cost: "Medio",
    risk: "Bajo",
    idealFor: "Diversificación jurisdiccional",
  },
  {
    name: "ETC con respaldo físico",
    custody: "Emisor (bóveda)",
    liquidity: "Alta",
    cost: "Bajo",
    risk: "Bajo",
    idealFor: "Inversores a largo plazo",
  },
  {
    name: "ETFs de metales",
    custody: "Gestora",
    liquidity: "Muy alta",
    cost: "Muy bajo",
    risk: "Bajo",
    idealFor: "Trading y carteras diversificadas",
  },
  {
    name: "Futuros y CFDs",
    custody: "Bróker",
    liquidity: "Muy alta",
    cost: "Variable",
    risk: "Muy alto",
    idealFor: "Traders expertos",
  },
];

type Level = "Bajo" | "Medio" | "Alto" | "Muy bajo" | "Muy alto" | "Variable";

function LevelBadge({ level }: { level: Level }) {
  const map: Record<Level, string> = {
    "Muy bajo": "bg-signal-up-bg text-signal-up",
    Bajo: "bg-signal-up-bg text-signal-up",
    Medio: "bg-[rgba(214,179,90,.12)] text-brand-gold",
    Alto: "bg-signal-down-bg text-signal-down",
    "Muy alto": "bg-signal-down-bg text-signal-down",
    Variable: "bg-surface-2 text-content-2",
  };
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${map[level]}`}>
      {level}
    </span>
  );
}

export function InvestmentComparison() {
  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" aria-label="Comparativa de métodos de inversión en metales preciosos">
          <thead>
            <tr>
              {["Método", "Custodia", "Liquidez", "Coste", "Riesgo", "Ideal para"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider bg-surface-2 border-b border-border whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.name} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 border-b border-border font-medium text-content-0 whitespace-nowrap">
                  {m.name}
                </td>
                <td className="px-4 py-3 border-b border-border text-content-2 whitespace-nowrap">
                  {m.custody}
                </td>
                <td className="px-4 py-3 border-b border-border">
                  <LevelBadge level={m.liquidity as Level} />
                </td>
                <td className="px-4 py-3 border-b border-border">
                  <LevelBadge level={m.cost as Level} />
                </td>
                <td className="px-4 py-3 border-b border-border">
                  <LevelBadge level={m.risk as Level} />
                </td>
                <td className="px-4 py-3 border-b border-border text-content-2 whitespace-nowrap">
                  {m.idealFor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
