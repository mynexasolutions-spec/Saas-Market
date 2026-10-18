import { NextResponse } from "next/server";
import { sessionClient } from "@/lib/supabase/server";
import { apiError, RequestError, sameOrigin, verifiedUser } from "@/lib/server-auth";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const client = await sessionClient();
    const user = await verifiedUser(client);
    const body = await request.json();
    const fields = ["name","title","company","bio","location","website","phone","avatarUrl"];
    if (Object.keys(body).some((key) => !fields.includes(key) && key !== "email"))
      throw new RequestError(400, "This profile field cannot be changed.");
    const patch: Record<string,string> = {};
    for (const field of fields) {
      if (body[field] === undefined) continue;
      if (typeof body[field] !== "string" || body[field].length > (field === "avatarUrl" ? 2_800_000 : 2000))
        throw new RequestError(400, "Invalid profile value or image too large.");
      patch[field === "avatarUrl" ? "avatar_path" : field] = body[field].trim();
    }
    if (patch.avatar_path && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(patch.avatar_path))
      throw new RequestError(400, "Use a PNG, JPG, or WebP profile photo.");
    const { error } = await client.from("profiles").update(patch).eq("id", user.id);
    if (error) throw new RequestError(400, "Profile could not be saved.");
    let message: string | undefined;
    if (body.email && body.email !== user.email) {
      if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
        throw new RequestError(400, "Enter a valid email.");
      const { error } = await client.auth.updateUser({ email: body.email });
      if (error) throw new RequestError(400, "Profile saved, but the email change could not be requested.");
      message = "Confirm the email change using the links Supabase sends.";
    }
    return NextResponse.json({ user: await verifiedUser(client), message }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
