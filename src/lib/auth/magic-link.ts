import { randomBytes, createHash } from "crypto";
import { sendEmail } from "@/lib/email/resend";

const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 min

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

export async function sendMagicLink(email: string, baseUrl: string): Promise<boolean> {
  const link = generateMagicLink(email, baseUrl);

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0B0F17; color: #E8E8EA; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="color: #D6B35A; font-weight: 800; font-size: 20px;">Metalorix</span>
      </div>
      <h2 style="margin: 0 0 12px; font-size: 18px; color: #E8E8EA;">Accede a tu panel</h2>
      <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Haz clic en el botón para acceder a tu panel de alertas. El enlace expira en 15 minutos.
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${link}" style="display: inline-block; background: #D6B35A; color: #0B0F17; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: 700; font-size: 14px;">
          Acceder a mi panel
        </a>
      </div>
      <p style="color: #6B7280; font-size: 12px; text-align: center;">
        Si no solicitaste este enlace, ignora este email.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Accede a tu panel — Metalorix",
    html,
  });
}
