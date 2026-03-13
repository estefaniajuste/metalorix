function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-signal-up mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-signal-down mt-0.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export interface InvestmentMethod {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  level: "Principiante" | "Intermedio" | "Avanzado";
  costRange: string;
}

function LevelTag({ level }: { level: InvestmentMethod["level"] }) {
  const colors: Record<InvestmentMethod["level"], string> = {
    Principiante: "bg-signal-up-bg text-signal-up",
    Intermedio: "bg-[rgba(214,179,90,.12)] text-brand-gold",
    Avanzado: "bg-signal-down-bg text-signal-down",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[level]}`}>
      {level}
    </span>
  );
}

export function InvestmentMethodCard({ method }: { method: InvestmentMethod }) {
  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-content-0">{method.title}</h3>
        <LevelTag level={method.level} />
      </div>
      <p className="text-sm text-content-2 leading-relaxed mb-5">{method.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 flex-1">
        <div>
          <h4 className="text-xs font-semibold text-signal-up uppercase tracking-wider mb-2">Ventajas</h4>
          <ul className="space-y-2">
            {method.pros.map((pro) => (
              <li key={pro} className="flex gap-2 text-sm text-content-1 leading-relaxed">
                <CheckIcon />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-signal-down uppercase tracking-wider mb-2">Inconvenientes</h4>
          <ul className="space-y-2">
            {method.cons.map((con) => (
              <li key={con} className="flex gap-2 text-sm text-content-1 leading-relaxed">
                <XIcon />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-content-3">
        <span>Coste estimado: <span className="font-medium text-content-2">{method.costRange}</span></span>
      </div>
    </div>
  );
}

export const INVESTMENT_METHODS: InvestmentMethod[] = [
  {
    title: "Oro físico en casa",
    description:
      "Comprar lingotes, monedas de inversión (Krugerrand, Maple Leaf, Filarmónica) o monedas históricas y guardarlas en un lugar seguro de tu propiedad.",
    pros: [
      "Control total y acceso inmediato",
      "Sin riesgo de contraparte",
      "Privacidad máxima",
      "No depende de intermediarios",
    ],
    cons: [
      "Riesgo de robo o pérdida",
      "Coste de seguro doméstico",
      "Difícil de liquidar rápidamente",
      "Spreads más altos al comprar/vender",
    ],
    level: "Principiante",
    costRange: "0 € (sin seguro) — 100-300 €/año (con seguro hogar)",
  },
  {
    title: "Caja de seguridad bancaria",
    description:
      "Almacenar oro físico en una caja fuerte alquilada en una entidad bancaria. El banco no conoce el contenido de la caja.",
    pros: [
      "Mayor seguridad que en casa",
      "Protección contra robo y catástrofes",
      "Sin riesgo de contraparte sobre el metal",
      "Privacidad del contenido",
    ],
    cons: [
      "Coste de alquiler anual (50-500 €)",
      "Acceso limitado al horario bancario",
      "El banco puede rescindir el contrato",
      "No asegurado por el fondo de garantía de depósitos",
    ],
    level: "Principiante",
    costRange: "50-500 €/año según tamaño",
  },
  {
    title: "Bóveda en Suiza u otra jurisdicción",
    description:
      "Servicios como BullionVault, GoldRepublic o PAMP permiten comprar oro asignado y custodiarlo en bóvedas de alta seguridad fuera de tu país de residencia.",
    pros: [
      "Máxima seguridad (bóvedas profesionales)",
      "Diversificación jurisdiccional",
      "Oro asignado y auditado",
      "Liquidez online 24/7",
    ],
    cons: [
      "Coste de custodia (0,10-0,50 %/año)",
      "Dependencia del proveedor",
      "Posibles implicaciones fiscales internacionales",
      "No tienes acceso físico directo",
    ],
    level: "Intermedio",
    costRange: "0,10 % — 0,50 % anual sobre el valor custodiado",
  },
  {
    title: "ETC con respaldo físico",
    description:
      "Exchange-Traded Commodities como Xetra-Gold o Invesco Physical Gold ETC están respaldados 1:1 por lingotes de oro en bóvedas. Algunos ofrecen derecho a entrega física.",
    pros: [
      "Respaldado por oro real en bóveda",
      "Negociable en bolsa como una acción",
      "Bajo coste (TER 0,00-0,25 %)",
      "Algunos permiten entrega física (Xetra-Gold)",
    ],
    cons: [
      "Riesgo de contraparte con el emisor",
      "No posees el oro directamente",
      "Costes de bróker al operar",
      "Tratamiento fiscal varía por país",
    ],
    level: "Principiante",
    costRange: "TER 0,00-0,25 % + comisiones de bróker",
  },
  {
    title: "ETFs de metales preciosos",
    description:
      "Fondos cotizados que replican el precio del oro, plata o platino. Máxima liquidez y mínimo coste. Se compran y venden como acciones desde cualquier bróker.",
    pros: [
      "Liquidez máxima en horario de bolsa",
      "TER muy bajo (desde 0,07 %)",
      "Fácil de integrar en una cartera diversificada",
      "Sin preocupaciones de custodia ni seguro",
    ],
    cons: [
      "No posees metal físico",
      "Riesgo sistémico del mercado financiero",
      "Posibles préstamos de títulos (securities lending)",
      "Tracking error respecto al spot",
    ],
    level: "Principiante",
    costRange: "TER 0,07-0,40 % + comisiones de bróker",
  },
  {
    title: "Futuros y CFDs",
    description:
      "Contratos derivados que permiten especular con el precio del oro con apalancamiento. Solo recomendable para traders con experiencia y gestión activa del riesgo.",
    pros: [
      "Apalancamiento (mayor exposición con menos capital)",
      "Posibilidad de posiciones cortas (beneficio en caídas)",
      "Liquidez extrema en mercados regulados",
      "Costes de transacción bajos",
    ],
    cons: [
      "Riesgo de pérdida superior al capital invertido",
      "Requiere gestión activa y conocimiento avanzado",
      "Costes de financiación diarios (rollover/swap)",
      "Alta volatilidad emocional",
    ],
    level: "Avanzado",
    costRange: "Variable (spreads + financiación nocturna)",
  },
];
