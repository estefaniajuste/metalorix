"use client";

import { useTranslations } from "next-intl";

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
  level: "beginner" | "intermediate" | "advanced";
  costRange: string;
}

function LevelTag({ level }: { level: InvestmentMethod["level"] }) {
  const t = useTranslations("investmentMethods");
  const colors: Record<InvestmentMethod["level"], string> = {
    beginner: "bg-signal-up-bg text-signal-up",
    intermediate: "bg-[rgba(214,179,90,.12)] text-brand-gold",
    advanced: "bg-signal-down-bg text-signal-down",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[level]}`}>
      {t(level)}
    </span>
  );
}

export function InvestmentMethodCard({ method }: { method: InvestmentMethod }) {
  const t = useTranslations("investmentMethods");
  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-content-0">{method.title}</h3>
        <LevelTag level={method.level} />
      </div>
      <p className="text-sm text-content-2 leading-relaxed mb-5">{method.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 flex-1">
        <div>
          <h4 className="text-xs font-semibold text-signal-up uppercase tracking-wider mb-2">{t("advantages")}</h4>
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
          <h4 className="text-xs font-semibold text-signal-down uppercase tracking-wider mb-2">{t("disadvantages")}</h4>
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
        <span>{t("estimatedCost")} <span className="font-medium text-content-2">{method.costRange}</span></span>
      </div>
    </div>
  );
}

export function InvestmentMethodsList() {
  const methods = useInvestmentMethods();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {methods.map((method) => (
        <InvestmentMethodCard key={method.title} method={method} />
      ))}
    </div>
  );
}

function useInvestmentMethods(): InvestmentMethod[] {
  const t = useTranslations("investmentMethods");
  return [
    {
      title: t("physicalTitle"),
      description: t("physicalDesc"),
      pros: [t("physicalPro1"), t("physicalPro2"), t("physicalPro3"), t("physicalPro4")],
      cons: [t("physicalCon1"), t("physicalCon2"), t("physicalCon3"), t("physicalCon4")],
      level: "beginner",
      costRange: t("physicalCost"),
    },
    {
      title: t("bankTitle"),
      description: t("bankDesc"),
      pros: [t("bankPro1"), t("bankPro2"), t("bankPro3"), t("bankPro4")],
      cons: [t("bankCon1"), t("bankCon2"), t("bankCon3"), t("bankCon4")],
      level: "beginner",
      costRange: t("bankCost"),
    },
    {
      title: t("vaultTitle"),
      description: t("vaultDesc"),
      pros: [t("vaultPro1"), t("vaultPro2"), t("vaultPro3"), t("vaultPro4")],
      cons: [t("vaultCon1"), t("vaultCon2"), t("vaultCon3"), t("vaultCon4")],
      level: "intermediate",
      costRange: t("vaultCost"),
    },
    {
      title: t("etcTitle"),
      description: t("etcDesc"),
      pros: [t("etcPro1"), t("etcPro2"), t("etcPro3"), t("etcPro4")],
      cons: [t("etcCon1"), t("etcCon2"), t("etcCon3"), t("etcCon4")],
      level: "beginner",
      costRange: t("etcCost"),
    },
    {
      title: t("etfTitle"),
      description: t("etfDesc"),
      pros: [t("etfPro1"), t("etfPro2"), t("etfPro3"), t("etfPro4")],
      cons: [t("etfCon1"), t("etfCon2"), t("etfCon3"), t("etfCon4")],
      level: "beginner",
      costRange: t("etfCost"),
    },
    {
      title: t("futuresTitle"),
      description: t("futuresDesc"),
      pros: [t("futuresPro1"), t("futuresPro2"), t("futuresPro3"), t("futuresPro4")],
      cons: [t("futuresCon1"), t("futuresCon2"), t("futuresCon3"), t("futuresCon4")],
      level: "advanced",
      costRange: t("futuresCost"),
    },
  ];
}
