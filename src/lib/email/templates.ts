interface EmailI18n {
  footer: string;
  manageAlerts: string;
  priceAlert: string;
  viewChart: string;
  viewDashboard: string;
  welcomeSubject: string;
  welcomeTitle: string;
  welcomeDesc: string;
  welcomeAlertsTitle: string;
  welcomeAlert1: string;
  welcomeAlert2: string;
  welcomeAlert3: string;
  goToMetalorix: string;
  reachedPrice: string;
}

const EMAIL_I18N: Record<string, EmailI18n> = {
  es: {
    footer: "Recibes este email porque te suscribiste a alertas en metalorix.com",
    manageAlerts: "Gestionar alertas",
    priceAlert: "Alerta de precio",
    viewChart: "Ver gráfico de",
    viewDashboard: "Ver Dashboard",
    welcomeSubject: "Bienvenido a las alertas de Metalorix",
    welcomeTitle: "Bienvenido a Metalorix!",
    welcomeDesc: "Te has suscrito a las alertas inteligentes de precios de metales preciosos. Recibirás notificaciones cuando se produzcan movimientos importantes en oro, plata y platino.",
    welcomeAlertsTitle: "Recibirás alertas de:",
    welcomeAlert1: "Nuevos máximos y mínimos de 52 semanas",
    welcomeAlert2: "Movimientos bruscos (>2% en un día)",
    welcomeAlert3: "Ratio oro/plata en zonas extremas",
    goToMetalorix: "Ir a Metalorix",
    reachedPrice: "ha alcanzado",
  },
  en: {
    footer: "You receive this email because you subscribed to alerts on metalorix.com",
    manageAlerts: "Manage alerts",
    priceAlert: "Price alert",
    viewChart: "View chart for",
    viewDashboard: "View Dashboard",
    welcomeSubject: "Welcome to Metalorix alerts",
    welcomeTitle: "Welcome to Metalorix!",
    welcomeDesc: "You have subscribed to smart precious metals price alerts. You will receive notifications when significant moves occur in gold, silver and platinum.",
    welcomeAlertsTitle: "You will receive alerts for:",
    welcomeAlert1: "New 52-week highs and lows",
    welcomeAlert2: "Sharp movements (>2% in a day)",
    welcomeAlert3: "Gold/silver ratio in extreme zones",
    goToMetalorix: "Go to Metalorix",
    reachedPrice: "has reached",
  },
};

function getEmailI18n(locale: string = "es"): EmailI18n {
  return EMAIL_I18N[locale] || EMAIL_I18N.es;
}

function baseTemplate(content: string, locale: string = "es"): string {
  const t = getEmailI18n(locale);
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
  </td></tr>
  <tr><td style="background:#131720;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:32px">
    ${content}
  </td></tr>
  <tr><td style="padding:24px 32px;text-align:center">
    <p style="color:#6B7280;font-size:11px;margin:0;line-height:1.6">
      ${t.footer}<br>
      <a href="https://metalorix.com/alertas" style="color:#D6B35A;text-decoration:none">${t.manageAlerts}</a> · 
      <a href="https://metalorix.com" style="color:#D6B35A;text-decoration:none">metalorix.com</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function priceAlertEmail({
  metalName,
  symbol,
  currentPrice,
  condition,
  threshold,
  locale = "es",
}: {
  metalName: string;
  symbol: string;
  currentPrice: number;
  condition: string;
  threshold: number;
  locale?: string;
}): { subject: string; html: string } {
  const t = getEmailI18n(locale);
  const subject = `⚡ ${metalName} ${t.reachedPrice} $${currentPrice.toFixed(2)} — Metalorix`;
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">⚡</div>
      <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 8px">${t.priceAlert}: ${metalName}</h1>
      <p style="color:#9CA3AF;font-size:14px;margin:0">${condition}: $${threshold.toFixed(2)}</p>
    </div>
    <div style="background:#0B0F17;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
      <div style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${symbol}/USD</div>
      <div style="color:#D6B35A;font-size:36px;font-weight:800">$${currentPrice.toFixed(2)}</div>
    </div>
    <div style="text-align:center">
      <a href="https://metalorix.com/precio/${metalName.toLowerCase()}" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        ${t.viewChart} ${metalName}
      </a>
    </div>
  `, locale);
  return { subject, html };
}

export function smartAlertEmail({
  title,
  description,
  metals,
  locale = "es",
}: {
  title: string;
  description: string;
  metals: Array<{ name: string; symbol: string; price: number; changePct: number }>;
  locale?: string;
}): { subject: string; html: string } {
  const t = getEmailI18n(locale);
  const subject = `📊 ${title} — Metalorix`;

  const metalRows = metals
    .map(
      (m) => `
    <tr>
      <td style="padding:8px 0;color:#F9FAFB;font-size:14px;font-weight:600">${m.name} (${m.symbol})</td>
      <td style="padding:8px 0;color:#F9FAFB;font-size:14px;text-align:right">$${m.price.toFixed(2)}</td>
      <td style="padding:8px 0;text-align:right">
        <span style="color:${m.changePct >= 0 ? "#34D399" : "#F87171"};font-size:13px;font-weight:500">${m.changePct >= 0 ? "+" : ""}${m.changePct.toFixed(2)}%</span>
      </td>
    </tr>`
    )
    .join("");

  const html = baseTemplate(`
    <h1 style="color:#F9FAFB;font-size:20px;font-weight:700;margin:0 0 12px">${title}</h1>
    <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0 0 24px">${description}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.06);margin-bottom:24px">
      ${metalRows}
    </table>
    <div style="text-align:center">
      <a href="https://metalorix.com" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        ${t.viewDashboard}
      </a>
    </div>
  `, locale);
  return { subject, html };
}

export function welcomeEmail(locale: string = "es"): { subject: string; html: string } {
  const t = getEmailI18n(locale);
  const subject = t.welcomeSubject;
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">👋</div>
      <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 12px">${t.welcomeTitle}</h1>
      <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0">
        ${t.welcomeDesc}
      </p>
    </div>
    <div style="background:#0B0F17;border-radius:8px;padding:20px;margin-bottom:24px">
      <h2 style="color:#F9FAFB;font-size:14px;font-weight:600;margin:0 0 12px">${t.welcomeAlertsTitle}</h2>
      <ul style="color:#9CA3AF;font-size:13px;line-height:2;margin:0;padding-left:20px">
        <li>${t.welcomeAlert1}</li>
        <li>${t.welcomeAlert2}</li>
        <li>${t.welcomeAlert3}</li>
      </ul>
    </div>
    <div style="text-align:center">
      <a href="https://metalorix.com" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        ${t.goToMetalorix}
      </a>
    </div>
  `, locale);
  return { subject, html };
}
