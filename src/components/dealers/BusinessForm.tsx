"use client";

import { useState } from "react";

interface CountryOption {
  code: string;
  name: string;
}

interface Props {
  countries: CountryOption[];
  t: Record<string, string>;
}

const METALS = ["XAU", "XAG", "XPT", "XPD"] as const;
const METAL_LABELS: Record<string, string> = {
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
};

const SERVICE_KEYS = [
  "buying",
  "selling",
  "jewelry",
  "investment",
  "refining",
  "appraisal",
] as const;

const TYPES = ["physical", "online", "both"] as const;

export function BusinessForm({ countries, t }: Props) {
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    countryCode: "",
    city: "",
    address: "",
    website: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    type: "physical" as string,
    metals: [] as string[],
    services: [] as string[],
    description: "",
    _website: "", // honeypot
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [verified, setVerified] = useState(false);

  // Check if arriving from verification redirect
  useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true") setVerified(true);
    }
  });

  const toggleArrayItem = (key: "metals" | "services", item: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((i) => i !== item)
        : [...prev[key], item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.businessName || !form.email || !form.countryCode || !form.city) {
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/dealers/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale: document.documentElement.lang || "en",
        }),
      });

      if (res.ok) {
        setResult("success");
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (verified) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-content-0 mb-2">Email verified!</h2>
        <p className="text-content-2 max-w-md mx-auto">
          {t.successMsg}
        </p>
      </div>
    );
  }

  if (result === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D6B35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-content-0 mb-2">{t.successTitle}</h2>
        <p className="text-content-2 max-w-md mx-auto">{t.successMsg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Honeypot */}
      <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
        <input
          type="text"
          name="_website"
          tabIndex={-1}
          autoComplete="off"
          value={form._website}
          onChange={(e) => setForm((f) => ({ ...f, _website: e.target.value }))}
        />
      </div>

      {/* Business name */}
      <div>
        <label className="block text-sm font-semibold text-content-0 mb-1.5">
          {t.formBusinessName} *
        </label>
        <input
          type="text"
          required
          maxLength={255}
          value={form.businessName}
          onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
          placeholder={t.formBusinessNameHint}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-content-0 mb-1.5">
          {t.formEmail} *
        </label>
        <input
          type="email"
          required
          maxLength={255}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
          placeholder={t.formEmailHint}
        />
      </div>

      {/* Country + City */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-content-0 mb-1.5">
            {t.formCountry} *
          </label>
          <select
            required
            value={form.countryCode}
            onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
          >
            <option value="">{t.formCountryPlaceholder}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-content-0 mb-1.5">
            {t.formCity} *
          </label>
          <input
            type="text"
            required
            maxLength={255}
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
            placeholder={t.formCityHint}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-content-0 mb-1.5">
          {t.formAddress}
        </label>
        <input
          type="text"
          maxLength={500}
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
        />
      </div>

      {/* Website + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-content-0 mb-1.5">
            {t.formWebsite}
          </label>
          <input
            type="url"
            maxLength={500}
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
            placeholder="https://"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-content-0 mb-1.5">
            {t.formPhone}
          </label>
          <input
            type="tel"
            maxLength={50}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* WhatsApp + Instagram */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-content-0 mb-1.5">
            {t.formWhatsApp}
          </label>
          <input
            type="tel"
            maxLength={50}
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
            placeholder="+971..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-content-0 mb-1.5">
            {t.formInstagram}
          </label>
          <input
            type="text"
            maxLength={100}
            value={form.instagram}
            onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors"
            placeholder={t.formInstagramHint}
          />
        </div>
      </div>

      {/* Business type */}
      <div>
        <label className="block text-sm font-semibold text-content-0 mb-2">
          {t.formType} *
        </label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: tp }))}
              className={`px-4 py-2 rounded-DEFAULT text-sm font-semibold border transition-colors ${
                form.type === tp
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-border bg-surface-2 text-content-2 hover:text-content-0"
              }`}
            >
              {tp === "physical" ? t.typePhysical : tp === "online" ? t.typeOnline : t.typeBoth}
            </button>
          ))}
        </div>
      </div>

      {/* Metals */}
      <div>
        <label className="block text-sm font-semibold text-content-0 mb-2">
          {t.formMetals}
        </label>
        <div className="flex flex-wrap gap-2">
          {METALS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleArrayItem("metals", m)}
              className={`px-4 py-2 rounded-DEFAULT text-sm font-semibold border transition-colors ${
                form.metals.includes(m)
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-border bg-surface-2 text-content-2 hover:text-content-0"
              }`}
            >
              {METAL_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-semibold text-content-0 mb-2">
          {t.formServices}
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_KEYS.map((s) => {
            const labelKey = `services${s.charAt(0).toUpperCase()}${s.slice(1)}` as keyof typeof t;
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleArrayItem("services", s)}
                className={`px-4 py-2 rounded-DEFAULT text-sm font-semibold border transition-colors ${
                  form.services.includes(s)
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                    : "border-border bg-surface-2 text-content-2 hover:text-content-0"
                }`}
              >
                {t[labelKey] || s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-content-0 mb-1.5">
          {t.formDescription}
        </label>
        <textarea
          maxLength={500}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-DEFAULT bg-surface-2 border border-border text-content-0 text-sm focus:border-brand-gold focus:outline-none transition-colors resize-none"
          placeholder={t.formDescriptionHint}
        />
        <p className="text-xs text-content-3 mt-1">{form.description.length}/500</p>
      </div>

      {result === "error" && (
        <p className="text-sm text-signal-down font-medium">{t.errorGeneric}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-DEFAULT bg-brand-gold text-black font-semibold text-sm hover:bg-brand-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t.formSubmitting}
          </>
        ) : (
          t.formSubmit
        )}
      </button>
    </form>
  );
}
