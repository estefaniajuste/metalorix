import { getDb } from "@/lib/db";
import { users, metalPrices } from "@/lib/db/schema";
import { generateText, isConfigured } from "@/lib/ai/gemini";
import { sendEmail } from "./resend";

const METAL_NAMES: Record<string, string> = {
  XAU: "Oro",
  XAG: "Plata",
  XPT: "Platino",
};

function newsletterTemplate(content: string, weekLabel: string): string {
  return `<!DOCTYPE html>
<html lang="es">
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
        Ver Dashboard
      </a>
    </div>
  </td></tr>
  <tr><td style="padding:24px 32px;text-align:center">
    <p style="color:#6B7280;font-size:11px;margin:0;line-height:1.6">
      Recibes esta newsletter porque te suscribiste en metalorix.com<br>
      <a href="https://metalorix.com/alertas" style="color:#D6B35A;text-decoration:none">Gestionar suscripción</a> · 
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
  const priceLines = rows
    .map(
      (r) =>
        `${METAL_NAMES[r.symbol] || r.symbol}: $${parseFloat(r.priceUsd).toFixed(2)} (${parseFloat(r.changePct24h ?? "0") >= 0 ? "+" : ""}${parseFloat(r.changePct24h ?? "0").toFixed(2)}%)`
    )
    .join("\n");

  const now = new Date();
  const weekLabel = `Semana del ${now.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`;

  const prompt = `Eres un analista de metales preciosos escribiendo una newsletter semanal en español para inversores.

Precios actuales:
${priceLines}

Genera una newsletter breve y profesional (máximo 300 palabras) con:
1. Un titular atractivo para la semana
2. Resumen del comportamiento semanal de oro, plata y platino
3. Un dato o contexto macroeconómico relevante (Fed, inflación, dólar, geopolítica)
4. Una frase de cierre con perspectiva para la próxima semana

Formato: HTML simple (usa <h2>, <p>, <strong>, <ul><li>). No uses estilos inline. No incluyas saludos ni despedidas genéricas.`;

  const aiContent = await generateText(prompt);
  if (!aiContent) return { generated: false, sent: 0, error: "AI generation failed" };

  const html = newsletterTemplate(aiContent, weekLabel);
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
