import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values) => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await client.auth.getUser();
  const path = request.nextUrl.pathname;
  let allowed = false;
  if (user) {
    const { data } = await client.from("account_roles").select("role,status").eq("user_id", user.id).single();
    const required = path.startsWith("/admin") ? "admin" : path.startsWith("/vendor") ? "vendor" : "buyer";
    allowed = !!data && ["active","verified"].includes(data.status) && (data.role === required || data.role === "admin");
  }
  if (!allowed) {
    const redirect = NextResponse.redirect(new URL("/?signin=1", request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    redirect.headers.set("Cache-Control", "no-store");
    return redirect;
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/admin/:path*", "/vendor/:path*", "/dashboard/:path*", "/profile/:path*"] };
