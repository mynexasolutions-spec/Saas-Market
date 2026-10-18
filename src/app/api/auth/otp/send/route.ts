import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/server";
import { apiError, RequestError, sameOrigin } from "@/lib/server-auth";
import { sendEmail, generateOTP, hashOTP, createOTPEmailHTML, createOTPEmailText, getOTPExpiryMinutes } from "@/lib/brevo";

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const body = await request.json().catch(() => { throw new RequestError(400, "Invalid request."); });
    const { email, purpose, role, name } = body;

    if (purpose !== "login" && purpose !== "signup") {
      throw new RequestError(400, "Invalid purpose. Must be 'login' or 'signup'.");
    }
    if (role !== "buyer" && role !== "vendor") {
      throw new RequestError(400, "Choose Buyer or Vendor.");
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254) {
      throw new RequestError(400, "Enter a valid email address.");
    }
    if (purpose === "signup") {
      if (typeof name !== "string" || !name.trim() || name.length > 120) {
        throw new RequestError(400, "Enter your name (max 120 characters).");
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = serviceClient();

    let userExists = false;
    for (let page = 1; ; page += 1) {
      const { data: users, error: usersError } = await db.auth.admin.listUsers({ page, perPage: 1000 });
      if (usersError) throw new RequestError(503, "Account lookup is temporarily unavailable.");
      if (users.users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
        userExists = true;
        break;
      }
      if (users.users.length < 1000) break;
    }
    if (purpose === "login" && !userExists) {
      throw new RequestError(404, "No account found with this email. Please register first.");
    }
    if (purpose === "signup" && userExists) {
      throw new RequestError(409, "An account with this email already exists. Please sign in instead.");
    }

    // Rate-limit with the service-role table access. The old private-schema RPC
    // was not exposed by PostgREST and made every OTP request fail with PGRST202.
    const now = new Date();
    const windowStartedAt = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
    const { data: recentOtp, error: recentOtpError } = await db
      .from("auth_otps")
      .select("id, created_at, last_resent_at, resend_count, expires_at, consumed_at")
      .eq("email", normalizedEmail)
      .eq("purpose", purpose)
      .eq("role", role)
      .gte("created_at", windowStartedAt)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentOtpError) {
      console.error("otp_rate_limit_lookup_failed", { code: recentOtpError.code });
      throw new RequestError(503, "Unable to verify rate limits. Please try again.");
    }

    const lastSentAt = recentOtp?.last_resent_at || recentOtp?.created_at;
    if (lastSentAt && now.getTime() - new Date(lastSentAt).getTime() < 90_000) {
      throw new RequestError(429, "A code was sent recently. Please wait 90 seconds before requesting another.");
    }
    if (recentOtp && recentOtp.resend_count >= 3) {
      throw new RequestError(429, "Too many code requests. Please wait 15 minutes before trying again.");
    }

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(now.getTime() + getOTPExpiryMinutes() * 60 * 1000).toISOString();

    // Check for existing unconsumed OTP to update (resend) or insert new
    const { data: existingOtp } = await db
      .from("auth_otps")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("purpose", purpose)
      .eq("role", role)
      .is("consumed_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let otpId: string;
    if (existingOtp) {
      // Update existing OTP (resend)
      const newResendCount = (existingOtp.resend_count || 0) + 1;
      const { data, error } = await db
        .from("auth_otps")
        .update({
          otp_hash: otpHash,
          expires_at: expiresAt,
          resend_count: newResendCount,
          last_resent_at: now.toISOString(),
          attempts: 0, // Reset attempts on resend
        })
        .eq("id", existingOtp.id)
        .select("id")
        .single();

      if (error || !data) throw new RequestError(503, "Failed to update OTP.");
      otpId = data.id;
    } else {
      // Insert new OTP
      const { data, error } = await db
        .from("auth_otps")
        .insert({
          email: normalizedEmail,
          otp_hash: otpHash,
          purpose,
          role,
          name: purpose === "signup" ? name.trim() : null,
          expires_at: expiresAt,
          resend_count: recentOtp ? recentOtp.resend_count + 1 : 0,
          last_resent_at: now.toISOString(),
        })
        .select("id")
        .single();

      if (error || !data) throw new RequestError(503, "Failed to create OTP.");
      otpId = data.id;
    }

    // Send email via Brevo
    const subject = purpose === "signup"
      ? `Verify your email - Create ${role === "vendor" ? "Vendor" : "Buyer"} Account | SaaS MRKT`
      : `Your sign-in code for ${role === "vendor" ? "Vendor" : "Buyer"} account | SaaS MRKT`;

    const html = createOTPEmailHTML(otp, purpose, role, purpose === "signup" ? name?.trim() : undefined);
    const text = createOTPEmailText(otp, purpose, role);

    const emailResult = await sendEmail({ to: normalizedEmail, subject, html, text });
    if (!emailResult.success) {
      // Clean up OTP if email fails
      await db.from("auth_otps").delete().eq("id", otpId);
      throw new RequestError(503, emailResult.error || "Failed to send verification email. Please try again.");
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Check your inbox (and spam folder).`,
      expiresInMinutes: getOTPExpiryMinutes(),
    }, { headers: { "Cache-Control": "no-store" } });

  } catch (error) { return apiError(error); }
}
