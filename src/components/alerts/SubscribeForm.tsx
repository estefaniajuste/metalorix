"use client";

import { useState } from "react";

const METALS = [
  { symbol: "XAU", name: "Oro", color: "#D6B35A" },
  { symbol: "XAG", name: "Plata", color: "#A7B0BE" },
  { symbol: "XPT", name: "Platino", color: "#8B9DC3" },
];

interface CustomAlert {
  symbol: string;
  type: "price_above" | "price_below";
  threshold: string;
}

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
        setMessage(data.error || "Error al suscribirse");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Inténtalo de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-surface-1 border border-signal-up/30 rounded-DEFAULT p-8 text-center max-w-md mx-auto">
        <div className="text-3xl mb-4">✅</div>
        <h3 className="text-lg font-bold text-content-0 mb-2">
          ¡Suscripción completada!
        </h3>
        <p className="text-sm text-content-2 leading-relaxed">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
        <h2 className="text-lg font-bold text-content-0 mb-2 text-center">
          Recibe alertas inteligentes
        </h2>
        <p className="text-sm text-content-2 text-center mb-6">
          Solo tu email. Sin contraseña, sin spam.
        </p>

        {/* Email input */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            aria-label="Correo electrónico"
            className="w-full bg-surface-0 border border-border rounded-sm px-4 py-3 text-sm text-content-0 placeholder:text-content-3 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        {/* Smart alerts (always included) */}
        <div className="mb-4 bg-surface-0 border border-border rounded-sm p-4">
          <div className="text-xs font-semibold text-content-0 mb-2 uppercase tracking-wider">
            Alertas automáticas incluidas
          </div>
          <div className="space-y-1.5 text-xs text-content-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-up flex-shrink-0" />
              Máximos y mínimos de 52 semanas
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-down flex-shrink-0" />
              Movimientos bruscos (&gt;2% diario)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
              Ratio oro/plata en zonas extremas
            </div>
          </div>
        </div>

        {/* Custom alerts toggle */}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="w-full text-xs font-medium text-brand-gold hover:text-brand-gold-hover transition-colors mb-4 flex items-center justify-center gap-1"
        >
          {showCustom ? "▾ Ocultar alertas personalizadas" : "▸ Añadir alertas de nivel de precio"}
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
                  aria-label="Tipo de alerta"
                  className="bg-surface-1 border border-border rounded-xs text-xs text-content-0 px-2 py-1.5 focus:outline-none"
                >
                  <option value="price_above">Sube a</option>
                  <option value="price_below">Baja a</option>
                </select>
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-xs text-content-3">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={alert.threshold}
                    onChange={(e) => updateAlert(i, "threshold", e.target.value)}
                    placeholder="0.00"
                    aria-label="Umbral de precio (USD)"
                    className="w-full bg-surface-1 border border-border rounded-xs text-xs text-content-0 px-2 py-1.5 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAlert(i)}
                  aria-label="Eliminar alerta"
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
              + Añadir alerta de precio
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-brand-gold text-[#0B0F17] font-semibold text-sm py-3 rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
        >
          {status === "loading" ? "Suscribiendo..." : "Suscribirme a las alertas"}
        </button>

        {status === "error" && (
          <p className="text-xs text-signal-down text-center mt-3">{message}</p>
        )}

        <p className="text-[10px] text-content-3 text-center mt-3">
          Podrás cancelar en cualquier momento. Sin spam.
        </p>
      </div>
    </form>
  );
}
