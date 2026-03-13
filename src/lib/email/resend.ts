import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set, email not sent");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: "Metalorix <alertas@metalorix.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

export function isConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
