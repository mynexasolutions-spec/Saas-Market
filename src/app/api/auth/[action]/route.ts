import { NextResponse } from "next/server";
import { sessionClient } from "@/lib/supabase/server";
import { apiError, RequestError, sameOrigin, verifiedUser } from "@/lib/server-auth";

export async function GET(_request: Request, context: { params: Promise<{ action: string }> }) {
  if ((await context.params).action !== "session") return new NextResponse(null, { status: 404 });
  try {
    const user = await verifiedUser(await sessionClient());
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  try {
    sameOrigin(request);
    const { action } = await context.params;
    const client = await sessionClient();
    if (action === "logout") {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw new RequestError(503, "Sign out failed. Please try again.");
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    if (action !== "login" && action !== "signup") throw new RequestError(404, "Unknown authentication action.");
    const body = await request.json().catch(() => { throw new RequestError(400, "Invalid request."); });
    const { email, password, role, name } = body;
    if (role !== "buyer" && role !== "vendor") throw new RequestError(400, "Choose Buyer or Vendor.");
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        email.length > 254 || typeof password !== "string" || !password || password.length > 1024)
      throw new RequestError(400, "Enter a valid email and password.");
    if (action === "signup") {
      if (password.length < 8 || typeof name !== "string" || !name.trim() || name.length > 120)
        throw new RequestError(400, "Enter your name and a password of at least 8 characters.");
      const { data, error } = await client.auth.signUp({
        email: email.trim(), password, options: { data: { name: name.trim(), role } },
      });
      if (error) throw new RequestError(error.status === 429 ? 429 : 400, "Registration failed. Check your details or try again later.");
      if (!data.session) return NextResponse.json({ user: null, message: "Check your email to confirm your account, then sign in." });
    } else {
      const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        console.error("password_login_failed", { status: error.status, code: error.code });
        throw new RequestError(error.status === 429 ? 429 : 401, "Unable to sign in. Check your email, password, and email confirmation.");
      }
    }
    // The chosen login tab never assigns or overrides the database role.
    try {
      return NextResponse.json({ user: await verifiedUser(client) }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      await client.auth.signOut({ scope: "local" });
      throw error;
    }
  } catch (error) { return apiError(error); }
}
