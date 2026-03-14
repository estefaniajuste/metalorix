"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";

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

export function UserPanel() {
  const t = useTranslations("userPanel");
  const tm = useTranslations("metals");
  const locale = useLocale();
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
        setLoginError(data.error || t("sendError"));
      }
    } catch {
      setLoginStatus("error");
      setLoginError(t("connectionError"));
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
            {t("loginTitle")}
          </h2>
          <p className="text-sm text-content-2 mb-6 leading-relaxed">
            {t("loginSubtitle")}
          </p>

          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 py-3 bg-surface-0 border border-border rounded-sm text-sm font-semibold text-content-0 hover:border-border-hover hover:bg-surface-1 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("googleLogin")}
          </a>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-content-3">{t("or")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {loginStatus === "sent" ? (
            <div className="bg-signal-up/10 border border-signal-up/20 rounded-sm p-4 text-center">
              <div className="text-signal-up font-semibold text-sm mb-1">
                {t("linkSent")}
              </div>
              <p className="text-xs text-content-2">
                {t("checkInbox", { email: loginEmail })}
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
                  ? t("sending")
                  : t("sendLink")}
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
            {t("planInfo", {
              tier: user.tier,
              date: new Date(user.createdAt).toLocaleDateString(locale, {
                month: "long",
                year: "numeric",
              }),
            })}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs text-content-3 border border-border rounded-sm hover:border-border-hover hover:text-content-1 transition-colors"
        >
          {t("logout")}
        </button>
      </div>

      {/* Alerts list */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-semibold text-content-0">
            {t("myAlerts", { count: userAlerts.length })}
          </h3>
        </div>

        {userAlerts.length === 0 ? (
          <div className="p-8 text-center text-content-3 text-sm">
            {t("noAlerts")}
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
                      {tm(alert.symbol as "XAU" | "XAG" | "XPT" | "XPD" | "HG") ?? alert.symbol}
                    </span>
                    <span className="text-xs text-content-3 bg-surface-0 px-2 py-0.5 rounded">
                      {alert.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-content-2 mt-1">
                    {t(`alertType_${alert.alertType}`)}{" "}
                    <strong>${parseFloat(alert.threshold).toLocaleString(locale)}</strong>
                  </div>
                  {alert.lastTriggered && (
                    <div className="text-[10px] text-content-3 mt-0.5">
                      {t("lastTriggered")}{" "}
                      {new Date(alert.lastTriggered).toLocaleDateString(locale)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-2 text-content-3 hover:text-signal-down transition-colors"
                  title={t("deleteAlert")}
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
          {t("createAlert")}
        </h3>
        <form
          onSubmit={handleCreateAlert}
          className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs text-content-3 mb-1">{t("metal")}</label>
            <select
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="w-full px-3 py-2 bg-surface-0 border border-border rounded-sm text-sm text-content-0 outline-none focus:border-brand-gold"
            >
              <option value="XAU">{tm("gold")} (XAU)</option>
              <option value="XAG">{tm("silver")} (XAG)</option>
              <option value="XPT">{tm("platinum")} (XPT)</option>
              <option value="XPD">{tm("palladium")} (XPD)</option>
              <option value="HG">{tm("copper")} (HG)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-content-3 mb-1">
              {t("condition")}
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full px-3 py-2 bg-surface-0 border border-border rounded-sm text-sm text-content-0 outline-none focus:border-brand-gold"
            >
              <option value="price_above">{t("alertType_price_above")}</option>
              <option value="price_below">{t("alertType_price_below")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-content-3 mb-1">
              {t("threshold")}
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
            {creating ? t("creating") : t("createAlertBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}
