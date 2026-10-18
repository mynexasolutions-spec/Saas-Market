import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/server";
import { apiError, RequestError, requireUser } from "@/lib/server-auth";
export async function GET(request: Request) {
 try {
  const user = await requireUser(["vendor","admin"]);
  const db = serviceClient(), id = new URL(request.url).searchParams.get("id");
  const {data,error} = await db.from("vendor_documents").select("vendor_id,storage_path").eq("id",id).single();
  if(error || !data || (user.role!=="admin" && data.vendor_id!==user.id)) throw new RequestError(404,"Document not found.");
  const {data:link,error:linkError} = await db.storage.from("vendor-documents").createSignedUrl(data.storage_path,60);
  if(linkError)throw new RequestError(503,"Document unavailable.");
  const response = NextResponse.redirect(link.signedUrl);
  response.headers.set("Cache-Control","private, no-store");
  return response;
 }catch(error){return apiError(error);}
}
