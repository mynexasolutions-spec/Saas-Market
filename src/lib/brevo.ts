import "server-only";
import { createHash, randomInt } from "crypto";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL!;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME!;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || options.html.replace(/<[^>]*>/g, ""),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Brevo send error:", response.status, error);
      return { success: false, error: `Email delivery failed: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Brevo send exception:", error);
    return { success: false, error: "Email service temporarily unavailable" };
  }
}

export function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

export async function hashOTP(otp: string): Promise<string> {
  return createHash("sha256").update(otp).digest("hex");
}

export function getOTPExpiryMinutes(): number {
  return 10;
}

export function getMaxAttempts(): number {
  return 5;
}

export function getMaxResends(): number {
  return 3;
}

export function getResendWindowMinutes(): number {
  return 15;
}

export function createOTPEmailHTML(otp: string, purpose: "login" | "signup", role: "buyer" | "vendor", name?: string): string {
  const roleLabel = role === "vendor" ? "SaaS Seller" : "Buyer";
  const actionLabel = purpose === "signup" ? "Complete Your Registration" : "Sign In to Your Account";
  const expiryMinutes = getOTPExpiryMinutes();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actionLabel} - SaaS MRKT</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);">
    <tr>
      <td style="padding: 40px 48px;">
        <!-- Header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); margin-bottom: 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">SaaS MRKT</h1>
              <p style="margin: 0; font-size: 14px; color: #64748b;">${actionLabel}</p>
            </td>
          </tr>
        </table>

        <!-- OTP Code -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #334155; line-height: 1.6;">
                ${purpose === "signup" ? `Welcome${name ? `, ${name}` : ""}!` : "Hello!"}<br>
                Use the verification code below to ${purpose === "signup" ? "create your" : "access your"} <strong>${roleLabel}</strong> account.
              </p>
              <div style="display: inline-block; padding: 20px 32px; background: #f1f5f9; border-radius: 12px; border: 2px dashed #cbd5e1; margin: 8px 0 24px;">
                <span style="font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: 8px; font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;">${otp}</span>
              </div>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                This code expires in <strong>${expiryMinutes} minutes</strong>. Do not share it with anyone.
              </p>
            </td>
          </tr>
        </table>

        <!-- Security Notice -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
          <tr>
            <td style="padding: 16px; background: #fef3c7; border-radius: 10px; border: 1px solid #fde68a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 24px; vertical-align: top;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </td>
                  <td style="font-size: 13px; color: #92400e; line-height: 1.6;">
                    <strong>Security reminder:</strong> SaaS MRKT will never ask for your verification code via phone, chat, or email. If you didn't request this code, please ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <tr>
            <td style="text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
              <p style="margin: 0 0 8px;">&copy; ${new Date().getFullYear()} SaaS MRKT. All rights reserved.</p>
              <p style="margin: 0;">If you have questions, contact <a href="mailto:support@saasmrkt.com" style="color: #6366f1; text-decoration: none;">support@saasmrkt.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function createOTPEmailText(otp: string, purpose: "login" | "signup", role: "buyer" | "vendor"): string {
  const roleLabel = role === "vendor" ? "SaaS Seller" : "Buyer";
  const actionLabel = purpose === "signup" ? "Complete Your Registration" : "Sign In to Your Account";
  const expiryMinutes = getOTPExpiryMinutes();

  return `
${actionLabel} - SaaS MRKT

Your verification code for ${roleLabel} account: ${otp}

This code expires in ${expiryMinutes} minutes. Do not share it with anyone.

Security reminder: SaaS MRKT will never ask for your verification code via phone, chat, or email. If you didn't request this code, please ignore this email.

&copy; ${new Date().getFullYear()} SaaS MRKT. All rights reserved.
If you have questions, contact support@saasmrkt.com
  `.trim();
}