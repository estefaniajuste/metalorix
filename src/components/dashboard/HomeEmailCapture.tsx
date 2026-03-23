"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export function HomeEmailCapture() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-[rgba(214,179,90,0.06)] border border-brand-gold/20 rounded-DEFAULT p-6 text-center">
        <p className="text-brand-gold font-semibold">{t("emailSuccess")}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-content-0">{t("emailCta")}</h3>
          <p className="text-sm text-content-3 mt-1">{t("emailCtaDesc")}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className="flex-1 sm:w-64 px-3 py-2 text-sm bg-surface-0 border border-border rounded-sm text-content-0 placeholder:text-content-3 focus:outline-none focus:border-brand-gold transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-sm font-bold text-[#0B0F17] bg-brand-gold hover:brightness-110 transition-all rounded-sm whitespace-nowrap disabled:opacity-60"
          >
            {status === "loading" ? "..." : t("emailBtn")}
          </button>
        </form>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-2">{t("emailError")}</p>
      )}
    </div>
  );
}
