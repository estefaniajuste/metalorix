import { getDb } from "@/lib/db";
import { users, metalPrices } from "@/lib/db/schema";
import { generateText, isConfigured } from "@/lib/ai/gemini";
import { sendEmail } from "./resend";

const METAL_NAMES: Record<string, Record<string, string>> = {
  XAU: { es: "Oro", en: "Gold" },
  XAG: { es: "Plata", en: "Silver" },
  XPT: { es: "Platino", en: "Platinum" },
  XPD: { es: "Paladio", en: "Palladium" },
  HG:  { es: "Cobre", en: "Copper" },
};

function mName(symbol: string, locale: string = "es"): string {
  return METAL_NAMES[symbol]?.[locale] || METAL_NAMES[symbol]?.es || symbol;
}

interface NlI18n {
  viewDashboard: string;
  footer: string;
  manageSub: string;
  weekOf: string;
}

const NL_I18N: Record<string, NlI18n> = {
  es: { viewDashboard: "Ver Dashboard", footer: "Recibes esta newsletter porque te suscribiste en metalorix.com", manageSub: "Gestionar suscripción", weekOf: "Semana del" },
  en: { viewDashboard: "View Dashboard", footer: "You receive this newsletter because you subscribed on metalorix.com", manageSub: "Manage subscription", weekOf: "Week of" },
};

function newsletterTemplate(content: string, weekLabel: string, locale: string = "es"): string {
  const t = NL_I18N[locale] || NL_I18N.es;
  return `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0B0F17;font-family:'Inter',system-ui,-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F17;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
  <tr><td style="padding:24px 32px;text-align:center">
    <div style="display:inline-flex;align-items:center;gap:8px">
      <div style="width:28px;height:28px;border-radius:6px;background:linear-gradient(135deg,#D6B35A,#B8962E);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#0B0F17">M</div>
      <span style="color:#D6B35A;font-size:18px;font-weight:700;letter-spacing:-0.5px">Metalorix</span>
    </div>
    <div style="color:#6B7280;font-size:12px;margin-top:4px">${weekLabel}</div>
  </td></tr>
  <tr><td style="background:#131720;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:32px">
    <div style="color:#D1D5DB;font-size:14px;line-height:1.8">
      ${content}
    </div>
    <div style="text-align:center;margin-top:24px">
      <a href="https://metalorix.com" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        ${t.viewDashboard}
      </a>
    </div>
  </td></tr>
  <tr><td style="padding:24px 32px;text-align:center">
    <p style="color:#6B7280;font-size:11px;margin:0;line-height:1.6">
      ${t.footer}<br>
      <a href="https://metalorix.com/alertas" style="color:#D6B35A;text-decoration:none">${t.manageSub}</a> · 
      <a href="https://metalorix.com" style="color:#D6B35A;text-decoration:none">metalorix.com</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendWeeklyNewsletter(): Promise<{
  generated: boolean;
  sent: number;
  error?: string;
}> {
  const db = getDb();
  if (!db) return { generated: false, sent: 0, error: "DB not available" };
  if (!isConfigured()) return { generated: false, sent: 0, error: "Gemini not configured" };

  // Get current prices
  const rows = await db.select().from(metalPrices);
  const locale: string = "es";

  const priceLines = rows
    .map(
      (r) =>
        `${mName(r.symbol, locale)}: $${parseFloat(r.priceUsd).toFixed(2)} (${parseFloat(r.changePct24h ?? "0") >= 0 ? "+" : ""}${parseFloat(r.changePct24h ?? "0").toFixed(2)}%)`
    )
    .join("\n");

  const now = new Date();
  const nlI18n = NL_I18N[locale] || NL_I18N.es;
  const dateLocale = locale === "en" ? "en-US" : "es-ES";
  const weekLabel = `${nlI18n.weekOf} ${now.toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}`;

  const langInstruction = locale === "en"
    ? "You are a precious metals analyst writing a weekly newsletter in English for investors."
    : "Eres un analista de metales preciosos escribiendo una newsletter semanal en español para inversores.";

  const prompt = `${langInstruction}

${locale === "en" ? "Current prices" : "Precios actuales"}:
${priceLines}

${locale === "en"
  ? `Write a brief, professional newsletter (max 300 words) with:
1. An attractive headline for the week
2. Summary of weekly performance of gold, silver and platinum
3. A relevant macroeconomic context (Fed, inflation, dollar, geopolitics)
4. A closing sentence with outlook for next week`
  : `Genera una newsletter breve y profesional (máximo 300 palabras) con:
1. Un titular atractivo para la semana
2. Resumen del comportamiento semanal de oro, plata y platino
3. Un dato o contexto macroeconómico relevante (Fed, inflación, dólar, geopolítica)
4. Una frase de cierre con perspectiva para la próxima semana`}

${locale === "en"
  ? "Format: Simple HTML (use <h2>, <p>, <strong>, <ul><li>). No inline styles. No generic greetings or sign-offs."
  : "Formato: HTML simple (usa <h2>, <p>, <strong>, <ul><li>). No uses estilos inline. No incluyas saludos ni despedidas genéricas."}`;

  const aiContent = await generateText(prompt);
  if (!aiContent) return { generated: false, sent: 0, error: "AI generation failed" };

  const html = newsletterTemplate(aiContent, weekLabel, locale);
  const subject = `📊 Newsletter Metalorix — ${weekLabel}`;

  // Get all subscribers
  const subscribers = await db.select({ email: users.email }).from(users);
  if (subscribers.length === 0) return { generated: true, sent: 0 };

  let sent = 0;
  for (const sub of subscribers) {
    const ok = await sendEmail({ to: sub.email, subject, html });
    if (ok) sent++;
  }

  return { generated: true, sent };
}
