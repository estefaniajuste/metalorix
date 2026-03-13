"use client";

import { useTranslations } from "next-intl";

const methodKeys = [
  {
    name: "physicalAtHome",
    custody: "custodyOwn",
    liquidity: "low",
    cost: "low",
    risk: "high",
    idealFor: "idealPrivacy",
  },
  {
    name: "bankSafeBox",
    custody: "custodyBank",
    liquidity: "low",
    cost: "medium",
    risk: "medium",
    idealFor: "idealBankSecurity",
  },
  {
    name: "swissVault",
    custody: "custodyThirdParty",
    liquidity: "medium",
    cost: "medium",
    risk: "low",
    idealFor: "idealJurisdiction",
  },
  {
    name: "physicalEtc",
    custody: "custodyIssuer",
    liquidity: "high",
    cost: "low",
    risk: "low",
    idealFor: "idealLongTerm",
  },
  {
    name: "metalEtfs",
    custody: "custodyManager",
    liquidity: "veryHigh",
    cost: "veryLow",
    risk: "low",
    idealFor: "idealTrading",
  },
  {
    name: "futuresCfds",
    custody: "custodyBroker",
    liquidity: "veryHigh",
    cost: "variable",
    risk: "veryHigh",
    idealFor: "idealExperts",
  },
];

type LevelKey = "veryLow" | "low" | "medium" | "high" | "veryHigh" | "variable";

const levelStyles: Record<LevelKey, string> = {
  veryLow: "bg-signal-up-bg text-signal-up",
  low: "bg-signal-up-bg text-signal-up",
  medium: "bg-[rgba(214,179,90,.12)] text-brand-gold",
  high: "bg-signal-down-bg text-signal-down",
  veryHigh: "bg-signal-down-bg text-signal-down",
  variable: "bg-surface-2 text-content-2",
};

function LevelBadge({ levelKey, label }: { levelKey: LevelKey; label: string }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${levelStyles[levelKey]}`}>
      {label}
    </span>
  );
}

export function InvestmentComparison() {
  const t = useTranslations("investmentTable");

  const headers = [
    t("method"), t("custody"), t("liquidity"), t("cost"), t("risk"), t("idealFor"),
  ];

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" aria-label={t("ariaLabel")}>
          <thead>
            <tr>
              {headers.map((h) => (
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
            {methodKeys.map((m) => (
              <tr key={m.name} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 border-b border-border font-medium text-content-0 whitespace-nowrap">
                  {t(m.name)}
                </td>
                <td className="px-4 py-3 border-b border-border text-content-2 whitespace-nowrap">
                  {t(m.custody)}
                </td>
                <td className="px-4 py-3 border-b border-border">
                  <LevelBadge levelKey={m.liquidity as LevelKey} label={t(m.liquidity)} />
                </td>
                <td className="px-4 py-3 border-b border-border">
                  <LevelBadge levelKey={m.cost as LevelKey} label={t(m.cost)} />
                </td>
                <td className="px-4 py-3 border-b border-border">
                  <LevelBadge levelKey={m.risk as LevelKey} label={t(m.risk)} />
                </td>
                <td className="px-4 py-3 border-b border-border text-content-2 whitespace-nowrap">
                  {t(m.idealFor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
