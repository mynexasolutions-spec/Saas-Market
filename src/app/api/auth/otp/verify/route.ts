import { NextResponse } from "next/server";
import { sessionClient, serviceClient } from "@/lib/supabase/server";
import { apiError, RequestError, sameOrigin, verifiedUser } from "@/lib/server-auth";
import { hashOTP } from "@/lib/brevo";

async function establishEmailSession(email: string) {
  const db = serviceClient();
  const client = await sessionClient();
  const { data: linkData, error: linkError } = await db.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const tokenHash = linkData?.properties?.hashed_token;
  if (linkError || !tokenHash) {
    throw new RequestError(503, "Failed to create a secure session. Please try again.");
  }
  const { data: sessionData, error: sessionError } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type: "magiclink",
  });
  if (sessionError || !sessionData.session) {
    throw new RequestError(503, "Failed to create a secure session. Please try again.");
  }
  return { client, user: await verifiedUser(client) };
}

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const body = await request.json().catch(() => { throw new RequestError(400, "Invalid request."); });
    const { email, otp, purpose, role } = body;

    if (purpose !== "login" && purpose !== "signup") {
      throw new RequestError(400, "Invalid purpose. Must be 'login' or 'signup'.");
    }
    if (role !== "buyer" && role !== "vendor") {
      throw new RequestError(400, "Choose Buyer or Vendor.");
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254) {
      throw new RequestError(400, "Enter a valid email address.");
    }
    if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
      throw new RequestError(400, "Enter the 6-digit verification code.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpHash = await hashOTP(otp);
    const db = serviceClient();

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await db
      .from("auth_otps")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("purpose", purpose)
      .eq("role", role)
      .eq("otp_hash", otpHash)
      .is("consumed_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) throw new RequestError(503, "Verification failed. Please try again.");

    if (!otpRecord) {
      // Increment attempts on any matching unconsumed OTP
      const { data: anyOtp } = await db
        .from("auth_otps")
        .select("id, attempts")
        .eq("email", normalizedEmail)
        .eq("purpose", purpose)
        .eq("role", role)
        .is("consumed_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (anyOtp) {
        const newAttempts = (anyOtp.attempts || 0) + 1;
        const maxAttempts = 5;
        await db
          .from("auth_otps")
          .update({ attempts: newAttempts })
          .eq("id", anyOtp.id);

        if (newAttempts >= maxAttempts) {
          await db
            .from("auth_otps")
            .update({ consumed_at: new Date().toISOString() })
            .eq("id", anyOtp.id);
          throw new RequestError(429, "Too many failed attempts. Please request a new code.");
        }
      }
      throw new RequestError(401, "Invalid or expired verification code. Please request a new one.");
    }

    // Check attempt limit
    const maxAttempts = 5;
    if ((otpRecord.attempts || 0) >= maxAttempts) {
      await db
        .from("auth_otps")
        .update({ consumed_at: new Date().toISOString() })
        .eq("id", otpRecord.id);
      throw new RequestError(429, "Too many failed attempts. Please request a new code.");
    }

    // Claim the code before creating a session so concurrent replay attempts cannot
    // both authenticate. A downstream failure requires requesting a fresh code.
    const consumedAt = new Date().toISOString();
    const { data: consumedOtp, error: consumeError } = await db
      .from("auth_otps")
      .update({ consumed_at: consumedAt, attempts: (otpRecord.attempts || 0) + 1 })
      .eq("id", otpRecord.id)
      .is("consumed_at", null)
      .select("id")
      .single();
    if (consumeError || !consumedOtp) {
      throw new RequestError(409, "This verification code has already been used.");
    }

    if (purpose === "signup") {
      // Supabase owns the account and session. The temporary credential is never
      // returned or stored; the account can continue using OTP or set a password.
      const { error: createError } = await db.auth.admin.createUser({
        email: normalizedEmail,
        password: crypto.randomUUID() + "Aa1!",
        email_confirm: true,
        user_metadata: { name: otpRecord.name, role },
      });

      if (createError) {
        if (createError.status === 429) throw new RequestError(429, "Registration failed. Please try again later.");
        throw new RequestError(400, "Account creation failed. Please try again.");
      }

    }

    const { user } = await establishEmailSession(normalizedEmail);
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });

  } catch (error) { return apiError(error); }
}
