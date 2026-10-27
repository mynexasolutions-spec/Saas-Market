import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sessionClient } from "@/lib/supabase/server";
import type { User, UserRole } from "@/lib/auth-types";

export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function sameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const expectedHost = request.headers.get("host") || new URL(request.url).host;
  let valid = false;
  try {
    const parsed = new URL(origin || "");
    valid =
      ["http:", "https:"].includes(parsed.protocol) &&
      parsed.host === expectedHost;
  } catch {
    valid = false;
  }
  if (!valid)
    throw new RequestError(403, "This request must come from this website.");
}
export async function verifiedUser(client: SupabaseClient): Promise<User> {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user)
    throw new RequestError(401, "Please sign in to continue.");
  const [
    { data: role, error: roleError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    client
      .from("account_roles")
      .select("role,status")
      .eq("user_id", user.id)
      .single(),
    client.from("profiles").select("*").eq("id", user.id).single(),
  ]);
  if (roleError || !role || !["buyer", "vendor", "admin"].includes(role.role))
    throw new RequestError(
      403,
      "Your account role is unavailable. Contact support.",
    );
  if (!["active", "verified"].includes(role.status))
    throw new RequestError(403, "Your account is suspended. Contact support.");
  if (profileError || !profile)
    throw new RequestError(
      403,
      "Your profile is unavailable. Contact support.",
    );
  const name: string = profile.name || user.email?.split("@")[0] || "User";
  return {
    id: user.id,
    email: user.email || "",
    name,
    role: role.role as UserRole,
    initials: name
      .split(/\s+/)
      .slice(0, 2)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase(),
    title: profile.title || "",
    company: profile.company || "",
    bio: profile.bio || "",
    location: profile.location || "",
    website: profile.website || "",
    phone: profile.phone || "",
    avatarUrl: profile.avatar_path || "",
  };
}
export async function requireUser(roles: UserRole[]): Promise<User> {
  const user = await verifiedUser(await sessionClient());
  if (!roles.includes(user.role))
    throw new RequestError(403, "You do not have permission for this action.");
  return user;
}
export function apiError(error: unknown): NextResponse {
  if (error instanceof RequestError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  console.error("request_failed", {
    type: error instanceof Error ? error.name : typeof error,
  });
  return NextResponse.json(
    { error: "The service is unavailable. Please try again." },
    { status: 503 },
  );
}
