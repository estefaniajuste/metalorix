interface EmailI18n {
  footer: string;
  manageAlerts: string;
  unsubscribe: string;
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
  high52Subject: string;
  low52Subject: string;
  high52Title: string;
  low52Title: string;
  weekHigh: string;
  weekLow: string;
  ratioHighSubject: string;
  ratioLowSubject: string;
  ratioHighTitle: string;
  ratioLowTitle: string;
  ratioHighDesc: string;
  ratioLowDesc: string;
  currentRatio: string;
}

const EMAIL_I18N: Record<string, EmailI18n> = {
  es: {
    footer: "Recibes este email porque te suscribiste a alertas en metalorix.com",
    manageAlerts: "Gestionar alertas",
    unsubscribe: "Cancelar suscripción",
    priceAlert: "Alerta de precio",
    viewChart: "Ver gráfico de",
    viewDashboard: "Ver Dashboard",
    welcomeSubject: "Bienvenido a las alertas de Metalorix",
    welcomeTitle: "¡Bienvenido a Metalorix!",
    welcomeDesc: "Te has suscrito a las alertas inteligentes de precios de metales preciosos. Recibirás notificaciones cuando se produzcan movimientos importantes en oro, plata y platino.",
    welcomeAlertsTitle: "Recibirás alertas de:",
    welcomeAlert1: "Nuevos máximos y mínimos de 52 semanas",
    welcomeAlert2: "Movimientos bruscos (>2% en un día)",
    welcomeAlert3: "Ratio oro/plata en zonas extremas",
    goToMetalorix: "Ir a Metalorix",
    reachedPrice: "ha alcanzado",
    high52Subject: "🚀 Nuevo máximo de 52 semanas",
    low52Subject: "📉 Nuevo mínimo de 52 semanas",
    high52Title: "Nuevo máximo de 52 semanas",
    low52Title: "Nuevo mínimo de 52 semanas",
    weekHigh: "Máximo 52 semanas",
    weekLow: "Mínimo 52 semanas",
    ratioHighSubject: "📊 Ratio oro/plata en zona extrema alta",
    ratioLowSubject: "📊 Ratio oro/plata en zona extrema baja",
    ratioHighTitle: "Ratio oro/plata extremadamente alto",
    ratioLowTitle: "Ratio oro/plata extremadamente bajo",
    ratioHighDesc: "El ratio oro/plata está en una zona históricamente extrema. El oro está muy caro respecto a la plata. Históricamente, estos niveles preceden a un rebote de la plata.",
    ratioLowDesc: "El ratio oro/plata está en una zona históricamente extrema. La plata está muy cara respecto al oro. Históricamente, estos niveles preceden a una corrección de la plata.",
    currentRatio: "Ratio actual",
  },
  en: {
    footer: "You receive this email because you subscribed to alerts on metalorix.com",
    manageAlerts: "Manage alerts",
    unsubscribe: "Unsubscribe",
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
    high52Subject: "🚀 New 52-week high",
    low52Subject: "📉 New 52-week low",
    high52Title: "New 52-week high",
    low52Title: "New 52-week low",
    weekHigh: "52-week high",
    weekLow: "52-week low",
    ratioHighSubject: "📊 Gold/silver ratio at extreme high",
    ratioLowSubject: "📊 Gold/silver ratio at extreme low",
    ratioHighTitle: "Gold/silver ratio extremely high",
    ratioLowTitle: "Gold/silver ratio extremely low",
    ratioHighDesc: "The gold/silver ratio is in a historically extreme zone. Gold is very expensive relative to silver. Historically, these levels have preceded a silver rebound.",
    ratioLowDesc: "The gold/silver ratio is in a historically extreme zone. Silver is very expensive relative to gold. Historically, these levels have preceded a silver correction.",
    currentRatio: "Current ratio",
  },
  ar: {
    footer: "تتلقى هذا البريد لأنك اشتركت في تنبيهات metalorix.com",
    manageAlerts: "إدارة التنبيهات",
    unsubscribe: "إلغاء الاشتراك",
    priceAlert: "تنبيه السعر",
    viewChart: "عرض رسم بياني لـ",
    viewDashboard: "عرض لوحة المعلومات",
    welcomeSubject: "مرحبًا بك في تنبيهات Metalorix",
    welcomeTitle: "!مرحبًا بك في Metalorix",
    welcomeDesc: "لقد اشتركت في تنبيهات أسعار المعادن الثمينة الذكية. ستتلقى إشعارات عند حدوث تحركات مهمة في الذهب والفضة والبلاتين.",
    welcomeAlertsTitle: "ستتلقى تنبيهات بشأن:",
    welcomeAlert1: "أعلى وأدنى مستويات جديدة خلال 52 أسبوعًا",
    welcomeAlert2: "تحركات حادة (أكثر من 2% في يوم واحد)",
    welcomeAlert3: "نسبة الذهب/الفضة في مناطق متطرفة",
    goToMetalorix: "الذهاب إلى Metalorix",
    reachedPrice: "وصل إلى",
    high52Subject: "🚀 أعلى مستوى جديد في 52 أسبوعًا",
    low52Subject: "📉 أدنى مستوى جديد في 52 أسبوعًا",
    high52Title: "أعلى مستوى جديد في 52 أسبوعًا",
    low52Title: "أدنى مستوى جديد في 52 أسبوعًا",
    weekHigh: "أعلى مستوى 52 أسبوعًا",
    weekLow: "أدنى مستوى 52 أسبوعًا",
    ratioHighSubject: "📊 نسبة الذهب/الفضة في منطقة متطرفة عالية",
    ratioLowSubject: "📊 نسبة الذهب/الفضة في منطقة متطرفة منخفضة",
    ratioHighTitle: "نسبة الذهب/الفضة مرتفعة للغاية",
    ratioLowTitle: "نسبة الذهب/الفضة منخفضة للغاية",
    ratioHighDesc: "نسبة الذهب/الفضة في منطقة متطرفة تاريخيًا. الذهب مكلف جدًا مقارنة بالفضة.",
    ratioLowDesc: "نسبة الذهب/الفضة في منطقة متطرفة تاريخيًا. الفضة مكلفة جدًا مقارنة بالذهب.",
    currentRatio: "النسبة الحالية",
  },
  de: {
    footer: "Du erhältst diese E-Mail, weil du dich für Benachrichtigungen auf metalorix.com angemeldet hast",
    manageAlerts: "Benachrichtigungen verwalten",
    unsubscribe: "Abmelden",
    priceAlert: "Preisalarm",
    viewChart: "Chart anzeigen für",
    viewDashboard: "Dashboard anzeigen",
    welcomeSubject: "Willkommen bei Metalorix-Benachrichtigungen",
    welcomeTitle: "Willkommen bei Metalorix!",
    welcomeDesc: "Du hast dich für intelligente Edelmetall-Preisbenachrichtigungen angemeldet. Du wirst benachrichtigt, wenn es bedeutende Bewegungen bei Gold, Silber und Platin gibt.",
    welcomeAlertsTitle: "Du wirst benachrichtigt bei:",
    welcomeAlert1: "Neue 52-Wochen-Hochs und -Tiefs",
    welcomeAlert2: "Starke Bewegungen (>2% an einem Tag)",
    welcomeAlert3: "Gold/Silber-Verhältnis in Extremzonen",
    goToMetalorix: "Zu Metalorix",
    reachedPrice: "hat erreicht",
    high52Subject: "🚀 Neues 52-Wochen-Hoch",
    low52Subject: "📉 Neues 52-Wochen-Tief",
    high52Title: "Neues 52-Wochen-Hoch",
    low52Title: "Neues 52-Wochen-Tief",
    weekHigh: "52-Wochen-Hoch",
    weekLow: "52-Wochen-Tief",
    ratioHighSubject: "📊 Gold/Silber-Verhältnis extrem hoch",
    ratioLowSubject: "📊 Gold/Silber-Verhältnis extrem niedrig",
    ratioHighTitle: "Gold/Silber-Verhältnis extrem hoch",
    ratioLowTitle: "Gold/Silber-Verhältnis extrem niedrig",
    ratioHighDesc: "Das Gold/Silber-Verhältnis befindet sich in einer historisch extremen Zone. Gold ist im Vergleich zu Silber sehr teuer.",
    ratioLowDesc: "Das Gold/Silber-Verhältnis befindet sich in einer historisch extremen Zone. Silber ist im Vergleich zu Gold sehr teuer.",
    currentRatio: "Aktuelles Verhältnis",
  },
  tr: {
    footer: "Bu e-postayı metalorix.com'da uyarılara abone olduğunuz için alıyorsunuz",
    manageAlerts: "Uyarıları yönet",
    unsubscribe: "Aboneliği iptal et",
    priceAlert: "Fiyat uyarısı",
    viewChart: "Grafik görüntüle:",
    viewDashboard: "Paneli Görüntüle",
    welcomeSubject: "Metalorix uyarılarına hoş geldiniz",
    welcomeTitle: "Metalorix'e hoş geldiniz!",
    welcomeDesc: "Akıllı değerli metal fiyat uyarılarına abone oldunuz. Altın, gümüş ve platinde önemli hareketler olduğunda bildirim alacaksınız.",
    welcomeAlertsTitle: "Şu durumlarda uyarı alacaksınız:",
    welcomeAlert1: "Yeni 52 haftalık en yüksek ve en düşük seviyeler",
    welcomeAlert2: "Keskin hareketler (bir günde >%2)",
    welcomeAlert3: "Altın/gümüş oranı aşırı bölgelerde",
    goToMetalorix: "Metalorix'e Git",
    reachedPrice: "seviyesine ulaştı",
    high52Subject: "🚀 Yeni 52 haftalık en yüksek",
    low52Subject: "📉 Yeni 52 haftalık en düşük",
    high52Title: "Yeni 52 haftalık en yüksek",
    low52Title: "Yeni 52 haftalık en düşük",
    weekHigh: "52 haftalık en yüksek",
    weekLow: "52 haftalık en düşük",
    ratioHighSubject: "📊 Altın/gümüş oranı aşırı yüksek",
    ratioLowSubject: "📊 Altın/gümüş oranı aşırı düşük",
    ratioHighTitle: "Altın/gümüş oranı aşırı yüksek",
    ratioLowTitle: "Altın/gümüş oranı aşırı düşük",
    ratioHighDesc: "Altın/gümüş oranı tarihsel olarak aşırı bir bölgede. Altın, gümüşe kıyasla çok pahalı.",
    ratioLowDesc: "Altın/gümüş oranı tarihsel olarak aşırı bir bölgede. Gümüş, altına kıyasla çok pahalı.",
    currentRatio: "Mevcut oran",
  },
  zh: {
    footer: "您收到此电子邮件是因为您在 metalorix.com 上订阅了提醒",
    manageAlerts: "管理提醒",
    unsubscribe: "取消订阅",
    priceAlert: "价格提醒",
    viewChart: "查看图表",
    viewDashboard: "查看仪表板",
    welcomeSubject: "欢迎使用 Metalorix 提醒",
    welcomeTitle: "欢迎来到 Metalorix！",
    welcomeDesc: "您已订阅贵金属智能价格提醒。当黄金、白银和铂金出现重大波动时，您将收到通知。",
    welcomeAlertsTitle: "您将收到以下提醒：",
    welcomeAlert1: "新的52周高点和低点",
    welcomeAlert2: "剧烈波动（单日超过2%）",
    welcomeAlert3: "金银比处于极端区域",
    goToMetalorix: "前往 Metalorix",
    reachedPrice: "已达到",
    high52Subject: "🚀 新的52周高点",
    low52Subject: "📉 新的52周低点",
    high52Title: "新的52周高点",
    low52Title: "新的52周低点",
    weekHigh: "52周高点",
    weekLow: "52周低点",
    ratioHighSubject: "📊 金银比处于极端高位",
    ratioLowSubject: "📊 金银比处于极端低位",
    ratioHighTitle: "金银比极端偏高",
    ratioLowTitle: "金银比极端偏低",
    ratioHighDesc: "金银比处于历史极端区域。相对于白银，黄金非常昂贵。",
    ratioLowDesc: "金银比处于历史极端区域。相对于黄金，白银非常昂贵。",
    currentRatio: "当前比率",
  },
  hi: {
    footer: "आपको यह ईमेल इसलिए मिला क्योंकि आपने metalorix.com पर अलर्ट की सदस्यता ली",
    manageAlerts: "अलर्ट प्रबंधित करें",
    unsubscribe: "सदस्यता रद्द करें",
    priceAlert: "कीमत अलर्ट",
    viewChart: "चार्ट देखें",
    viewDashboard: "डैशबोर्ड देखें",
    welcomeSubject: "Metalorix अलर्ट में आपका स्वागत है",
    welcomeTitle: "Metalorix में आपका स्वागत है!",
    welcomeDesc: "आपने कीमती धातुओं की स्मार्ट कीमत अलर्ट की सदस्यता ली। सोना, चांदी और प्लैटिनम में महत्वपूर्ण हलचल होने पर आपको सूचनाएं मिलेंगी।",
    welcomeAlertsTitle: "आपको ये अलर्ट मिलेंगे:",
    welcomeAlert1: "नए 52-सप्ताह के उच्च और निम्न",
    welcomeAlert2: "तेज़ हलचलें (एक दिन में >2%)",
    welcomeAlert3: "सोना/चांदी अनुपात चरम क्षेत्रों में",
    goToMetalorix: "Metalorix पर जाएं",
    reachedPrice: "तक पहुंच गया",
    high52Subject: "🚀 नया 52-सप्ताह का उच्च",
    low52Subject: "📉 नया 52-सप्ताह का निम्न",
    high52Title: "नया 52-सप्ताह का उच्च",
    low52Title: "नया 52-सप्ताह का निम्न",
    weekHigh: "52-सप्ताह का उच्च",
    weekLow: "52-सप्ताह का निम्न",
    ratioHighSubject: "📊 सोना/चांदी अनुपात अत्यंत उच्च",
    ratioLowSubject: "📊 सोना/चांदी अनुपात अत्यंत निम्न",
    ratioHighTitle: "सोना/चांदी अनुपात अत्यंत उच्च",
    ratioLowTitle: "सोना/चांदी अनुपात अत्यंत निम्न",
    ratioHighDesc: "सोना/चांदी अनुपात ऐतिहासिक रूप से चरम क्षेत्र में है। चांदी के मुकाबले सोना बहुत महंगा है।",
    ratioLowDesc: "सोना/चांदी अनुपात ऐतिहासिक रूप से चरम क्षेत्र में है। सोने के मुकाबले चांदी बहुत महंगी है।",
    currentRatio: "वर्तमान अनुपात",
  },
};

function getEmailI18n(locale: string = "es"): EmailI18n {
  return EMAIL_I18N[locale] || EMAIL_I18N.es;
}

function baseTemplate(content: string, locale: string = "es", unsubscribeUrl?: string): string {
  const t = getEmailI18n(locale);
  const unsubscribeLink = unsubscribeUrl
    ? ` · <a href="${unsubscribeUrl}" style="color:#5A6478;text-decoration:none">${t.unsubscribe}</a>`
    : "";
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
      <a href="https://metalorix.com" style="color:#D6B35A;text-decoration:none">metalorix.com</a>${unsubscribeLink}
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
  unsubscribeUrl,
}: {
  metalName: string;
  symbol: string;
  currentPrice: number;
  condition: string;
  threshold: number;
  locale?: string;
  unsubscribeUrl?: string;
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
  `, locale, unsubscribeUrl);
  return { subject, html };
}

export function week52AlertEmail({
  metalName,
  symbol,
  currentPrice,
  weekRecord,
  isHigh,
  locale = "es",
  unsubscribeUrl,
}: {
  metalName: string;
  symbol: string;
  currentPrice: number;
  weekRecord: number;
  isHigh: boolean;
  locale?: string;
  unsubscribeUrl?: string;
}): { subject: string; html: string } {
  const t = getEmailI18n(locale);
  const subject = `${isHigh ? t.high52Subject : t.low52Subject}: ${metalName} — Metalorix`;
  const title = isHigh ? t.high52Title : t.low52Title;
  const recordLabel = isHigh ? t.weekHigh : t.weekLow;
  const emoji = isHigh ? "🚀" : "📉";
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">${emoji}</div>
      <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 8px">${title}</h1>
      <p style="color:#9CA3AF;font-size:14px;margin:0">${metalName} (${symbol}/USD)</p>
    </div>
    <div style="background:#0B0F17;border-radius:8px;padding:20px;text-align:center;margin-bottom:16px">
      <div style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${symbol}/USD</div>
      <div style="color:#D6B35A;font-size:36px;font-weight:800">$${currentPrice.toFixed(2)}</div>
    </div>
    <div style="background:#0B0F17;border-radius:8px;padding:12px 20px;text-align:center;margin-bottom:24px">
      <span style="color:#6B7280;font-size:12px">${recordLabel}: </span>
      <span style="color:#F9FAFB;font-size:14px;font-weight:600">$${weekRecord.toFixed(2)}</span>
    </div>
    <div style="text-align:center">
      <a href="https://metalorix.com" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        ${t.viewDashboard}
      </a>
    </div>
  `, locale, unsubscribeUrl);
  return { subject, html };
}

export function ratioAlertEmail({
  currentRatio,
  xauPrice,
  xagPrice,
  isHigh,
  locale = "es",
  unsubscribeUrl,
}: {
  currentRatio: number;
  xauPrice: number;
  xagPrice: number;
  isHigh: boolean;
  locale?: string;
  unsubscribeUrl?: string;
}): { subject: string; html: string } {
  const t = getEmailI18n(locale);
  const subject = `${isHigh ? t.ratioHighSubject : t.ratioLowSubject} (${currentRatio.toFixed(1)}) — Metalorix`;
  const title = isHigh ? t.ratioHighTitle : t.ratioLowTitle;
  const desc = isHigh ? t.ratioHighDesc : t.ratioLowDesc;
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">📊</div>
      <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 8px">${title}</h1>
    </div>
    <div style="background:#0B0F17;border-radius:8px;padding:20px;text-align:center;margin-bottom:16px">
      <div style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${t.currentRatio}</div>
      <div style="color:#D6B35A;font-size:48px;font-weight:800;line-height:1">${currentRatio.toFixed(1)}</div>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F17;border-radius:8px;padding:12px 20px;margin-bottom:16px">
      <tr>
        <td style="color:#6B7280;font-size:12px;padding:6px 0">XAU/USD</td>
        <td style="color:#F9FAFB;font-size:14px;font-weight:600;text-align:right;padding:6px 0">$${xauPrice.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="color:#6B7280;font-size:12px;padding:6px 0">XAG/USD</td>
        <td style="color:#F9FAFB;font-size:14px;font-weight:600;text-align:right;padding:6px 0">$${xagPrice.toFixed(2)}</td>
      </tr>
    </table>
    <p style="color:#9CA3AF;font-size:13px;line-height:1.6;margin:0 0 24px">${desc}</p>
    <div style="text-align:center">
      <a href="https://metalorix.com/ratio-oro-plata" style="display:inline-block;background:#D6B35A;color:#0B0F17;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">
        ${t.viewDashboard}
      </a>
    </div>
  `, locale, unsubscribeUrl);
  return { subject, html };
}

export function smartAlertEmail({
  title,
  description,
  metals,
  locale = "es",
  unsubscribeUrl,
}: {
  title: string;
  description: string;
  metals: Array<{ name: string; symbol: string; price: number; changePct: number }>;
  locale?: string;
  unsubscribeUrl?: string;
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
  `, locale, unsubscribeUrl);
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
