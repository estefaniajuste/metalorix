import { randomBytes, createHash } from "crypto";
import { sendEmail } from "@/lib/email/resend";

const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 min

const MAGIC_LINK_STRINGS: Record<
  string,
  { subject: string; heading: string; body: string; button: string; footer: string }
> = {
  es: {
    subject: "Accede a tu panel — Metalorix",
    heading: "Accede a tu panel",
    body: "Haz clic en el botón para acceder a tu panel de alertas. El enlace expira en 15 minutos.",
    button: "Acceder a mi panel",
    footer: "Si no solicitaste este enlace, ignora este email.",
  },
  en: {
    subject: "Access your panel — Metalorix",
    heading: "Access your panel",
    body: "Click the button to access your alerts panel. The link expires in 15 minutes.",
    button: "Access my panel",
    footer: "If you didn't request this link, ignore this email.",
  },
  de: {
    subject: "Zugang zu deinem Panel — Metalorix",
    heading: "Zugang zu deinem Panel",
    body: "Klicke auf den Button, um auf dein Benachrichtigungs-Panel zuzugreifen. Der Link läuft in 15 Minuten ab.",
    button: "Zum Panel",
    footer: "Wenn du diesen Link nicht angefordert hast, ignoriere diese E-Mail.",
  },
  zh: {
    subject: "访问您的面板 — Metalorix",
    heading: "访问您的面板",
    body: "点击按钮访问您的提醒面板。链接将在 15 分钟后过期。",
    button: "访问我的面板",
    footer: "如果您没有请求此链接，请忽略此邮件。",
  },
  ar: {
    subject: "الوصول إلى لوحتك — Metalorix",
    heading: "الوصول إلى لوحتك",
    body: "انقر على الزر للوصول إلى لوحة التنبيهات. تنتهي صلاحية الرابط خلال 15 دقيقة.",
    button: "الوصول إلى لوحتي",
    footer: "إذا لم تطلب هذا الرابط، تجاهل هذا البريد الإلكتروني.",
  },
  tr: {
    subject: "Panelinize erişin — Metalorix",
    heading: "Panelinize erişin",
    body: "Uyarı panelinize erişmek için düğmeye tıklayın. Bağlantı 15 dakika içinde sona erer.",
    button: "Panelime eriş",
    footer: "Bu bağlantıyı siz talep etmediyseniz, bu e-postayı yok sayın.",
  },
};

interface PendingToken {
  email: string;
  hash: string;
  expiresAt: number;
}

// In-memory store — in production with multiple instances, use Redis or DB
const pendingTokens = new Map<string, PendingToken>();

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateMagicLink(email: string, baseUrl: string): string {
  const token = randomBytes(32).toString("hex");
  const hash = hashToken(token);

  pendingTokens.set(hash, {
    email: email.toLowerCase().trim(),
    hash,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  });

  // Cleanup expired tokens
  pendingTokens.forEach((val, key) => {
    if (val.expiresAt < Date.now()) pendingTokens.delete(key);
  });

  return `${baseUrl}/api/auth/verify?token=${token}`;
}

export function verifyToken(token: string): string | null {
  const hash = hashToken(token);
  const pending = pendingTokens.get(hash);

  if (!pending) return null;
  if (pending.expiresAt < Date.now()) {
    pendingTokens.delete(hash);
    return null;
  }

  pendingTokens.delete(hash);
  return pending.email;
}

export async function sendMagicLink(
  email: string,
  baseUrl: string,
  locale: string = "es"
): Promise<boolean> {
  const link = generateMagicLink(email, baseUrl);
  const s = MAGIC_LINK_STRINGS[locale] ?? MAGIC_LINK_STRINGS.es;

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0B0F17; color: #E8E8EA; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="color: #D6B35A; font-weight: 800; font-size: 20px;">Metalorix</span>
      </div>
      <h2 style="margin: 0 0 12px; font-size: 18px; color: #E8E8EA;">${s.heading}</h2>
      <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        ${s.body}
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${link}" style="display: inline-block; background: #D6B35A; color: #0B0F17; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: 700; font-size: 14px;">
          ${s.button}
        </a>
      </div>
      <p style="color: #6B7280; font-size: 12px; text-align: center;">
        ${s.footer}
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: s.subject,
    html,
  });
}
