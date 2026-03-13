function baseTemplate(content: string): string {
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
  </td></tr>
  <tr><td style="background:#131720;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:32px">
    ${content}
  </td></tr>
  <tr><td style="padding:24px 32px;text-align:center">
    <p style="color:#6B7280;font-size:11px;margin:0;line-height:1.6">
      Recibes este email porque te suscribiste a alertas en metalorix.com<br>
      <a href="https://metalorix.com/alertas" style="color:#D6B35A;text-decoration:none">Gestionar alertas</a> · 
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
}: {
  metalName: string;
  symbol: string;
  currentPrice: number;
  condition: string;
  threshold: number;
}): { subject: string; html: string } {
  const subject = `⚡ ${metalName} ha alcanzado $${currentPrice.toFixed(2)} — Alerta Metalorix`;
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">⚡</div>
      <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 8px">Alerta de precio: ${metalName}</h1>
      <p style="color:#9CA3AF;font-size:14px;margin:0">${condition}: $${threshold.toFixed(2)}</p>
    </div>
    <div style="background:#0B0F17;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
      <div style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${symbol}/USD</div>
      <div style="color:#D6B35A;font-size:36px;font-weight:800">$${currentPrice.toFixed(2)}</div>
    </div>
    <div style="text-align:center">
      <a href="https://metalorix.com/precio/${metalName.toLowerCase()}" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        Ver gráfico de ${metalName}
      </a>
    </div>
  `);
  return { subject, html };
}

export function smartAlertEmail({
  title,
  description,
  metals,
}: {
  title: string;
  description: string;
  metals: Array<{ name: string; symbol: string; price: number; changePct: number }>;
}): { subject: string; html: string } {
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
        Ver Dashboard
      </a>
    </div>
  `);
  return { subject, html };
}

export function welcomeEmail(): { subject: string; html: string } {
  const subject = "Bienvenido a las alertas de Metalorix";
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">👋</div>
      <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 12px">¡Bienvenido a Metalorix!</h1>
      <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0">
        Te has suscrito a las alertas inteligentes de precios de metales preciosos.
        Recibirás notificaciones cuando se produzcan movimientos importantes en oro, plata y platino.
      </p>
    </div>
    <div style="background:#0B0F17;border-radius:8px;padding:20px;margin-bottom:24px">
      <h2 style="color:#F9FAFB;font-size:14px;font-weight:600;margin:0 0 12px">Recibirás alertas de:</h2>
      <ul style="color:#9CA3AF;font-size:13px;line-height:2;margin:0;padding-left:20px">
        <li>Nuevos máximos y mínimos de 52 semanas</li>
        <li>Movimientos bruscos (>2% en un día)</li>
        <li>Ratio oro/plata en zonas extremas</li>
      </ul>
    </div>
    <div style="text-align:center">
      <a href="https://metalorix.com" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        Ir a Metalorix
      </a>
    </div>
  `);
  return { subject, html };
}
