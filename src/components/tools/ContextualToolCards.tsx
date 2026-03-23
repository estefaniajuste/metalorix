import { Link } from "@/i18n/navigation";

interface ToolSuggestion {
  href: string;
  icon: string;
  titleKey: string;
  descKey: string;
}

const TOOL_CATALOG: Record<string, ToolSuggestion> = {
  ratio: {
    href: "/ratio-oro-plata",
    icon: "⚖️",
    titleKey: "ratio",
    descKey: "ratioHint",
  },
  roi: {
    href: "/calculadora-rentabilidad",
    icon: "📈",
    titleKey: "roi",
    descKey: "roiHint",
  },
  converter: {
    href: "/conversor-divisas",
    icon: "💱",
    titleKey: "converter",
    descKey: "converterHint",
  },
  comparator: {
    href: "/comparador",
    icon: "📊",
    titleKey: "comparator",
    descKey: "comparatorHint",
  },
  calendar: {
    href: "/calendario-economico",
    icon: "📅",
    titleKey: "calendar",
    descKey: "calendarHint",
  },
  alerts: {
    href: "/alertas",
    icon: "🔔",
    titleKey: "alerts",
    descKey: "alertsHint",
  },
  guide: {
    href: "/guia-inversion",
    icon: "📖",
    titleKey: "guide",
    descKey: "guideHint",
  },
};

const CLUSTER_TOOLS: Record<string, string[]> = {
  "ratios-analytics": ["ratio", "comparator", "roi"],
  "price-factors": ["calendar", "converter", "alerts"],
  "markets-trading": ["comparator", "converter", "roi"],
  investment: ["roi", "guide", "alerts"],
  macroeconomics: ["calendar", "converter", "alerts"],
  "physical-metals": ["converter", "guide", "alerts"],
  fundamentals: ["converter", "comparator", "guide"],
  history: ["roi", "ratio", "guide"],
  "production-industry": ["comparator", "converter", "calendar"],
  "geology-science": ["comparator", "converter"],
  "regulation-tax": ["roi", "guide", "converter"],
  "security-authenticity": ["guide", "alerts"],
  guides: ["roi", "ratio", "converter"],
  "faq-mistakes": ["guide", "alerts", "roi"],
  comparisons: ["comparator", "ratio", "roi"],
  glossary: ["guide", "converter"],
};

const KEYWORD_TOOLS: Record<string, string[]> = {
  ratio: ["ratio"],
  dca: ["roi"],
  "dollar-cost": ["roi"],
  etf: ["comparator", "roi"],
  inflation: ["calendar", "converter"],
  "interest-rate": ["calendar"],
  volatility: ["comparator"],
  "gold-silver": ["ratio"],
  currency: ["converter"],
  price: ["alerts", "converter"],
  mining: ["comparator"],
};

export function getToolsForArticle(
  clusterSlug: string,
  articleSlug: string
): string[] {
  const tools = new Set<string>();

  const clusterTools = CLUSTER_TOOLS[clusterSlug] || ["converter", "guide", "alerts"];
  clusterTools.forEach((t) => tools.add(t));

  for (const [keyword, kTools] of Object.entries(KEYWORD_TOOLS)) {
    if (articleSlug.includes(keyword)) {
      kTools.forEach((t) => tools.add(t));
    }
  }

  return Array.from(tools).slice(0, 3);
}

export function getToolsForNews(metals: string[] | null): string[] {
  const tools: string[] = ["alerts", "converter"];
  if (metals?.includes("XAU") && metals?.includes("XAG")) {
    tools.unshift("ratio");
  } else {
    tools.unshift("comparator");
  }
  tools.push("roi");
  return tools.slice(0, 3);
}

interface Props {
  toolIds: string[];
  labels: Record<string, string>;
  heading: string;
}

export function ContextualToolCards({ toolIds, labels, heading }: Props) {
  const tools = toolIds
    .map((id) => TOOL_CATALOG[id])
    .filter(Boolean);

  if (tools.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <h3 className="text-sm font-semibold text-content-2 uppercase tracking-wider mb-4">
        {heading}
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href as any}
            className="group flex flex-col gap-1 p-4 rounded-lg bg-surface-1 border border-border hover:border-brand-gold/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{tool.icon}</span>
              <span className="text-sm font-semibold text-content-0 group-hover:text-brand-gold transition-colors">
                {labels[tool.titleKey] || tool.titleKey}
              </span>
            </div>
            <p className="text-xs text-content-3 leading-relaxed">
              {labels[tool.descKey] || ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
