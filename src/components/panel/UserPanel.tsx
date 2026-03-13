"use client";

import { useEffect, useState, useCallback } from "react";

interface UserData {
  id: number;
  email: string;
  tier: string;
  createdAt: string;
}

interface AlertData {
  id: number;
  symbol: string;
  alertType: string;
  threshold: string;
  active: boolean;
  lastTriggered: string | null;
  createdAt: string;
}

const METAL_NAMES: Record<string, string> = {
  XAU: "Oro",
  XAG: "Plata",
  XPT: "Platino",
};

const ALERT_TYPE_LABELS: Record<string, string> = {
  price_above: "Precio por encima de",
  price_below: "Precio por debajo de",
  pct_change: "Cambio % mayor que",
};

export function UserPanel() {
  const [user, setUser] = useState<UserData | null>(null);
  const [userAlerts, setUserAlerts] = useState<AlertData[]>([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);

  // New alert form
  const [newSymbol, setNewSymbol] = useState("XAU");
  const [newType, setNewType] = useState("price_above");
  const [newThreshold, setNewThreshold] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          return true;
        }
      }
    } catch {}
    setUser(null);
    return false;
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/user/alerts");
      if (res.ok) {
        const data = await res.json();
        setUserAlerts(data.alerts || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchUser().then((loggedIn) => {
      if (loggedIn) fetchAlerts();
      setLoading(false);
    });
  }, [fetchUser, fetchAlerts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus("sending");
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        setLoginStatus("sent");
      } else {
        setLoginStatus("error");
        setLoginError(data.error || "Error al enviar el enlace");
      }
    } catch {
      setLoginStatus("error");
      setLoginError("Error de conexión");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserAlerts([]);
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreshold) return;
    setCreating(true);

    try {
      const res = await fetch("/api/user/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: newSymbol,
          alertType: newType,
          threshold: parseFloat(newThreshold),
        }),
      });

      if (res.ok) {
        setNewThreshold("");
        fetchAlerts();
      }
    } catch {}
    setCreating(false);
  };

  const handleDeleteAlert = async (id: number) => {
    await fetch(`/api/user/alerts?id=${id}`, { method: "DELETE" });
    setUserAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <div className="h-64 bg-surface-1 border border-border rounded-DEFAULT animate-shimmer" />
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-lg font-bold text-content-0 mb-2">
            Accede a tu panel
          </h2>
          <p className="text-sm text-content-2 mb-6 leading-relaxed">
            Introduce tu email de suscripción y recibirás un enlace de acceso.
            Sin contraseña.
          </p>

          {loginStatus === "sent" ? (
            <div className="bg-signal-up/10 border border-signal-up/20 rounded-sm p-4 text-center">
              <div className="text-signal-up font-semibold text-sm mb-1">
                Enlace enviado
              </div>
              <p className="text-xs text-content-2">
                Revisa tu bandeja de entrada en <strong>{loginEmail}</strong>.
                El enlace expira en 15 minutos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="tu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-0 border border-border rounded-sm text-sm text-content-0 placeholder:text-content-3 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
              />
              {loginStatus === "error" && (
                <p className="text-xs text-signal-down">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={loginStatus === "sending"}
                className="w-full py-3 bg-brand-gold text-[#0B0F17] font-semibold text-sm rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loginStatus === "sending"
                  ? "Enviando..."
                  : "Enviar enlace de acceso"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Logged in
  return (
    <div className="space-y-6">
      {/* User info bar */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-content-0">
            {user.email}
          </div>
          <div className="text-xs text-content-3">
            Plan {user.tier} · Suscrito desde{" "}
            {new Date(user.createdAt).toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs text-content-3 border border-border rounded-sm hover:border-border-hover hover:text-content-1 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Alerts list */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-semibold text-content-0">
            Mis alertas ({userAlerts.length})
          </h3>
        </div>

        {userAlerts.length === 0 ? (
          <div className="p-8 text-center text-content-3 text-sm">
            No tienes alertas configuradas. Crea una abajo.
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {userAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        alert.active ? "bg-signal-up" : "bg-content-3"
                      }`}
                    />
                    <span className="text-sm font-medium text-content-0">
                      {METAL_NAMES[alert.symbol] ?? alert.symbol}
                    </span>
                    <span className="text-xs text-content-3 bg-surface-0 px-2 py-0.5 rounded">
                      {alert.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-content-2 mt-1">
                    {ALERT_TYPE_LABELS[alert.alertType] ?? alert.alertType}{" "}
                    <strong>${parseFloat(alert.threshold).toLocaleString("es-ES")}</strong>
                  </div>
                  {alert.lastTriggered && (
                    <div className="text-[10px] text-content-3 mt-0.5">
                      Última vez:{" "}
                      {new Date(alert.lastTriggered).toLocaleDateString("es-ES")}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-2 text-content-3 hover:text-signal-down transition-colors"
                  title="Eliminar alerta"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create alert */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-4">
        <h3 className="text-base font-semibold text-content-0 mb-4">
          Crear nueva alerta
        </h3>
        <form
          onSubmit={handleCreateAlert}
          className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs text-content-3 mb-1">Metal</label>
            <select
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="w-full px-3 py-2 bg-surface-0 border border-border rounded-sm text-sm text-content-0 outline-none focus:border-brand-gold"
            >
              <option value="XAU">Oro (XAU)</option>
              <option value="XAG">Plata (XAG)</option>
              <option value="XPT">Platino (XPT)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-content-3 mb-1">
              Condición
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full px-3 py-2 bg-surface-0 border border-border rounded-sm text-sm text-content-0 outline-none focus:border-brand-gold"
            >
              <option value="price_above">Precio por encima de</option>
              <option value="price_below">Precio por debajo de</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-content-3 mb-1">
              Umbral (USD)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="2800"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              required
              className="w-full px-3 py-2 bg-surface-0 border border-border rounded-sm text-sm text-content-0 placeholder:text-content-3 outline-none focus:border-brand-gold"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="py-2 bg-brand-gold text-[#0B0F17] font-semibold text-sm rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
          >
            {creating ? "Creando..." : "Crear alerta"}
          </button>
        </form>
      </div>
    </div>
  );
}
