"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const METALS = [
  { id: "gold", symbol: "XAU" },
  { id: "silver", symbol: "XAG" },
  { id: "platinum", symbol: "XPT" },
  { id: "palladium", symbol: "XPD" },
  { id: "copper", symbol: "HG" },
] as const;

const METAL_COLORS: Record<string, string> = {
  gold: "#D6B35A",
  silver: "#A8B2C1",
  platinum: "#E5E7EB",
  palladium: "#9CA3AF",
  copper: "#B87333",
};

function calcHeight(count: number): number {
  return 80 + count * 40;
}

export function WidgetConfigurator() {
  const t = useTranslations("widget");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["gold"]));
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const metalsParam = METALS.filter((m) => selected.has(m.id))
    .map((m) => m.id)
    .join(",");
  const widgetUrl = `https://metalorix.com/api/widget?metals=${metalsParam}&theme=${theme}`;
  const height = calcHeight(selected.size);

  const embedCode = `<iframe src="${widgetUrl}"\n  width="320" height="${height}"\n  style="border:none;border-radius:12px"\n  loading="lazy"></iframe>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard not available */ }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* Preview */}
      <div>
        <h2 className="text-sm font-semibold text-content-1 uppercase tracking-wider mb-4">
          {t("preview")}
        </h2>
        <div className="flex justify-center lg:justify-start">
          <iframe
            key={`${metalsParam}-${theme}`}
            src={widgetUrl}
            width={320}
            height={height}
            style={{ border: "none", borderRadius: 12 }}
            loading="lazy"
            title="Metalorix Widget Preview"
          />
        </div>
      </div>

      {/* Configuration */}
      <div>
        <h2 className="text-sm font-semibold text-content-1 uppercase tracking-wider mb-4">
          {t("configure")}
        </h2>

        <div className="bg-surface-1 border border-border rounded-DEFAULT p-5 space-y-5">
          {/* Metals */}
          <div>
            <h3 className="text-xs font-medium text-content-2 mb-3">{t("selectMetals")}</h3>
            <div className="flex flex-wrap gap-2">
              {METALS.map((m) => {
                const active = selected.has(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-sm border transition-all ${
                      active
                        ? "border-brand-gold/50 bg-brand-gold/10 text-content-0"
                        : "border-border bg-surface-0 text-content-2 hover:border-border hover:text-content-1"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: METAL_COLORS[m.id] }}
                    />
                    {t(m.id)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme */}
          <div>
            <h3 className="text-xs font-medium text-content-2 mb-3">{t("theme")}</h3>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => setTheme(th)}
                  className={`text-sm px-4 py-1.5 rounded-sm border transition-all ${
                    theme === th
                      ? "border-brand-gold/50 bg-brand-gold/10 text-content-0"
                      : "border-border bg-surface-0 text-content-2 hover:text-content-1"
                  }`}
                >
                  {t(th)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Embed code */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-content-1 uppercase tracking-wider">
              {t("embedCode")}
            </h2>
            <button
              onClick={copy}
              className={`text-xs font-medium px-3 py-1 rounded-sm transition-all ${
                copied
                  ? "bg-signal-up/20 text-signal-up"
                  : "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20"
              }`}
            >
              {copied ? t("copied") : t("copyCode")}
            </button>
          </div>
          <pre className="bg-surface-1 border border-border rounded-DEFAULT p-4 text-xs text-content-1 overflow-x-auto leading-relaxed select-all">
            {embedCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
