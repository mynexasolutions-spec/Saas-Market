import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { request } from "@playwright/test";

const base = "http://localhost:3000";
const service = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const contexts = [];
const users = [];
const otpIds = [];
const hash = (value) => createHash("sha256").update(value).digest("hex");
const createContext = async () => {
  const context = await request.newContext({ baseURL: base, extraHTTPHeaders: { Origin: base } });
  contexts.push(context);
  return context;
};
const seedOtp = async ({ email, code, purpose, role, name }) => {
  const { data, error } = await service.from("auth_otps").insert({
    email, otp_hash: hash(code), purpose, role, name: name || null,
    expires_at: new Date(Date.now() + 600_000).toISOString(),
    last_resent_at: new Date().toISOString(),
  }).select("id").single();
  assert.ifError(error);
  otpIds.push(data.id);
  return data.id;
};
const createUser = async (role) => {
  const email = `otp-${role}-${randomUUID()}@example.com`;
  const { data, error } = await service.auth.admin.createUser({
    email, password: randomUUID() + "Aa1!", email_confirm: true,
    user_metadata: { role, name: `OTP ${role}` },
  });
  assert.ifError(error);
  users.push(data.user.id);
  return { id: data.user.id, email };
};

try {
  const brevoResponse = await fetch("https://api.brevo.com/v3/senders", {
    headers: { "api-key": process.env.BREVO_API_KEY, Accept: "application/json" },
  });
  assert.equal(brevoResponse.status, 200);
  const senders = await brevoResponse.json();
  const configuredSender = senders.senders?.find(
    (sender) => sender.email?.toLowerCase() === process.env.BREVO_SENDER_EMAIL.toLowerCase(),
  );
  assert(configuredSender, "Configured Brevo sender was not found.");
  assert.notEqual(configuredSender.active, false, "Configured Brevo sender is inactive.");
  console.log("PASS Brevo API credential and configured sender");

  const buyer = await createUser("buyer");
  const buyerCode = "183726";
  await seedOtp({ email: buyer.email, code: buyerCode, purpose: "login", role: "vendor" });
  const buyerContext = await createContext();
  const buyerVerify = await buyerContext.post("/api/auth/otp/verify", {
    data: { email: buyer.email, otp: buyerCode, purpose: "login", role: "vendor" },
  });
  assert.equal(buyerVerify.status(), 200, await buyerVerify.text());
  assert.equal((await buyerVerify.json()).user.role, "buyer");
  assert.equal((await (await buyerContext.get("/api/auth/session")).json()).user.role, "buyer");
  const replay = await buyerContext.post("/api/auth/otp/verify", {
    data: { email: buyer.email, otp: buyerCode, purpose: "login", role: "vendor" },
  });
  assert.equal(replay.status(), 401);
  console.log("PASS OTP login, database role recognition, session persistence, and replay rejection");

  const signupEmail = `otp-signup-${randomUUID()}@example.com`;
  const signupCode = "294837";
  await seedOtp({ email: signupEmail, code: signupCode, purpose: "signup", role: "vendor", name: "OTP Signup Vendor" });
  const signupContext = await createContext();
  const signupVerify = await signupContext.post("/api/auth/otp/verify", {
    data: { email: signupEmail, otp: signupCode, purpose: "signup", role: "vendor" },
  });
  assert.equal(signupVerify.status(), 200, await signupVerify.text());
  const signupUser = (await signupVerify.json()).user;
  assert.equal(signupUser.role, "vendor");
  users.push(signupUser.id);
  assert.equal((await (await signupContext.get("/api/auth/session")).json()).user.role, "vendor");
  console.log("PASS OTP registration, profile trigger, vendor role, and session");

  const adminCandidate = await createUser("buyer");
  const { error: promotionError } = await service.from("account_roles")
    .update({ role: "admin" }).eq("user_id", adminCandidate.id);
  assert.ifError(promotionError);
  const adminCode = "395948";
  await seedOtp({ email: adminCandidate.email, code: adminCode, purpose: "login", role: "buyer" });
  const adminContext = await createContext();
  const adminVerify = await adminContext.post("/api/auth/otp/verify", {
    data: { email: adminCandidate.email, otp: adminCode, purpose: "login", role: "buyer" },
  });
  assert.equal(adminVerify.status(), 200, await adminVerify.text());
  assert.equal((await adminVerify.json()).user.role, "admin");
  assert.equal((await adminContext.get("/api/admin")).status(), 200);
  console.log("PASS admin auto-recognition through a public role selection");

  const limited = await createUser("buyer");
  await seedOtp({ email: limited.email, code: "496059", purpose: "login", role: "buyer" });
  const rateContext = await createContext();
  const limitedResponse = await rateContext.post("/api/auth/otp/send", {
    data: { email: limited.email, purpose: "login", role: "buyer" },
  });
  assert.equal(limitedResponse.status(), 429, await limitedResponse.text());
  assert.match((await limitedResponse.json()).error, /90 seconds/);
  console.log("PASS server-side OTP cooldown without the broken private RPC");

  const invalid = await rateContext.post("/api/auth/otp/verify", {
    data: { email: limited.email, otp: "000000", purpose: "login", role: "buyer" },
  });
  assert.equal(invalid.status(), 401);
  console.log("PASS invalid OTP rejection");
} finally {
  if (otpIds.length) await service.from("auth_otps").delete().in("id", otpIds);
  for (const id of [...new Set(users)]) {
    const { error } = await service.auth.admin.deleteUser(id);
    assert.ifError(error);
  }
  for (const context of contexts) await context.dispose();
}
