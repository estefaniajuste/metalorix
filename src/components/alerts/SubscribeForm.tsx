"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CustomAlert {
  symbol: string;
  type: "price_above" | "price_below";
  threshold: string;
}

export function SubscribeForm() {
  const t = useTranslations("subscribeForm");
  const [email, setEmail] = useState("");
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const METALS = [
    { symbol: "XAU", name: t("gold"), color: "#D6B35A" },
    { symbol: "XAG", name: t("silver"), color: "#A7B0BE" },
    { symbol: "XPT", name: t("platinum"), color: "#8B9DC3" },
    { symbol: "XPD", name: t("palladium"), color: "#CED0CE" },
    { symbol: "HG", name: t("copper"), color: "#B87333" },
  ];

  function addCustomAlert() {
    setCustomAlerts((prev) => [
      ...prev,
      { symbol: "XAU", type: "price_above", threshold: "" },
    ]);
  }

  function removeAlert(index: number) {
    setCustomAlerts((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAlert(index: number, field: keyof CustomAlert, value: string) {
    setCustomAlerts((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    setStatus("loading");
    try {
      const alertsPayload = customAlerts
        .filter((a) => a.threshold && parseFloat(a.threshold) > 0)
        .map((a) => ({
          symbol: a.symbol,
          type: a.type,
          threshold: parseFloat(a.threshold),
        }));

      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, alerts: alertsPayload }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || t("errorSubscribe"));
      }
    } catch {
      setStatus("error");
      setMessage(t("errorConnection"));
    }
  }

  if (status === "success") {
    return (
      <div role="alert" className="bg-surface-1 border border-signal-up/30 rounded-DEFAULT p-8 text-center max-w-md mx-auto">
        <div className="text-3xl mb-4" aria-hidden="true">✅</div>
        <h3 className="text-lg font-bold text-content-0 mb-2">
          {t("subscriptionComplete")}
        </h3>
        <p className="text-sm text-content-2 leading-relaxed">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
        <h2 className="text-lg font-bold text-content-0 mb-2 text-center">
          {t("receiveAlerts")}
        </h2>
        <p className="text-sm text-content-2 text-center mb-6">
          {t("onlyEmail")}
        </p>

        {/* Email input */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            aria-label={t("emailLabel")}
            className="w-full bg-surface-0 border border-border rounded-sm px-4 py-3 text-sm text-content-0 placeholder:text-content-3 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        {/* Smart alerts (always included) */}
        <div className="mb-4 bg-surface-0 border border-border rounded-sm p-4">
          <div className="text-xs font-semibold text-content-0 mb-2 uppercase tracking-wider">
            {t("autoAlerts")}
          </div>
          <div className="space-y-1.5 text-xs text-content-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-up flex-shrink-0" />
              {t("highLow52")}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-down flex-shrink-0" />
              {t("sharpMoves")}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
              {t("ratioExtremes")}
            </div>
          </div>
        </div>

        {/* Custom alerts toggle */}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="w-full text-xs font-medium text-brand-gold hover:text-brand-gold-hover transition-colors mb-4 flex items-center justify-center gap-1"
        >
          {showCustom ? `▾ ${t("hideCustom")}` : `▸ ${t("addPriceAlerts")}`}
        </button>

        {/* Custom alerts */}
        {showCustom && (
          <div className="space-y-3 mb-4">
            {customAlerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-surface-0 border border-border rounded-sm p-3"
              >
                <select
                  value={alert.symbol}
                  onChange={(e) => updateAlert(i, "symbol", e.target.value)}
                  aria-label="Metal"
                  className="bg-surface-1 border border-border rounded-xs text-xs text-content-0 px-2 py-1.5 focus:outline-none"
                >
                  {METALS.map((m) => (
                    <option key={m.symbol} value={m.symbol}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  value={alert.type}
                  onChange={(e) => updateAlert(i, "type", e.target.value)}
                  aria-label={t("priceAbove")}
                  className="bg-surface-1 border border-border rounded-xs text-xs text-content-0 px-2 py-1.5 focus:outline-none"
                >
                  <option value="price_above">{t("priceAbove")}</option>
                  <option value="price_below">{t("priceBelow")}</option>
                </select>
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-xs text-content-3">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={alert.threshold}
                    onChange={(e) => updateAlert(i, "threshold", e.target.value)}
                    placeholder="0.00"
                    aria-label={t("priceThreshold")}
                    className="w-full bg-surface-1 border border-border rounded-xs text-xs text-content-0 px-2 py-1.5 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAlert(i)}
                  aria-label={t("removeAlert")}
                  className="text-content-3 hover:text-signal-down transition-colors p-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCustomAlert}
              className="w-full text-xs font-medium text-content-2 hover:text-content-0 border border-dashed border-border hover:border-border-hover rounded-sm py-2 transition-colors"
            >
              {t("addAlert")}
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-brand-gold text-[#0B0F17] font-semibold text-sm py-3 rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
        >
          {status === "loading" ? t("subscribing") : t("subscribe")}
        </button>

        {status === "error" && (
          <p role="alert" className="text-xs text-signal-down text-center mt-3">{message}</p>
        )}

        <p className="text-[10px] text-content-3 text-center mt-3">
          {t("cancelAnytime")}
        </p>
      </div>
    </form>
  );
}
