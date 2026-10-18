import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/server";
import { apiError, RequestError, requireUser, sameOrigin } from "@/lib/server-auth";
import type { AdminSnapshot } from "@/lib/admin-types";

export async function GET() {
  try {
    await requireUser(["admin"]);
    const db = serviceClient();
    const [profiles, roles, documents, products, orders, licenses, featured, categories] = await Promise.all([
      db.from("profiles").select("*"), db.from("account_roles").select("*"),
      db.from("vendor_documents").select("*"), db.from("products").select("*").is("deleted_at",null),
      db.from("orders").select("*"), db.from("licenses").select("*"),
      db.from("featured_products").select("*").order("position"), db.from("categories").select("slug,name"),
    ]);
    if ([profiles,roles,documents,products,orders,licenses,featured,categories].some((r) => r.error))
      throw new RequestError(503,"Dashboard data could not be loaded.");
    const emails = new Map<string,string>();
    for (let page = 1; ; page++) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw new RequestError(503,"Account directory could not be loaded.");
      data.users.forEach((u) => emails.set(u.id,u.email || ""));
      if (data.users.length < 1000) break;
    }
    const names = new Map((profiles.data || []).map((p) => [p.id,p.name]));
    const categoryNames = new Map((categories.data || []).map((c) => [c.slug,c.name]));
    const date = (value: string) => new Date(value).toLocaleDateString("en-US");
    const snapshot: AdminSnapshot = {
      users: (profiles.data || []).map((p) => {
        const r = roles.data?.find((r) => r.user_id === p.id);
        return { id:p.id,name:p.name,email:emails.get(p.id)||"",company:p.company||"",
          role:r?.role === "admin" ? "Admin" : r?.role === "vendor" ? "Vendor" : "Buyer",
          status:r?.status === "suspended" ? "Suspended" : r?.status === "verified" ? "Verified" : "Active",
          joinedDate:date(p.created_at) };
      }),
      documents: (documents.data || []).map((d) => ({
        id:d.id,title:d.title,vendorName:names.get(d.vendor_id)||"Vendor",vendorEmail:emails.get(d.vendor_id)||"",
        category:d.category,fileName:d.file_name,fileSize:`${Math.ceil(d.byte_size/1024)} KB`,
        uploadedDate:date(d.created_at),status:d.status==="verified" ? "Approved & Verified" : d.status==="rejected" ? "Rejected" : "Pending Approval",
        verifiedBy:names.get(d.reviewed_by),verifiedDate:d.reviewed_at ? date(d.reviewed_at) : undefined,
      })),
      projects:(products.data || []).map((p) => ({
        id:p.id,name:p.name,vendor:names.get(p.vendor_id)||"Vendor",vendorEmail:emails.get(p.vendor_id)||"",
        category:categoryNames.get(p.category_slug)||"",price:`$${p.price}/${p.period}`,
        submittedDate:date(p.created_at),securityScan:p.security_scan,
        status:p.status==="Live & Active" ? "Live" : p.status==="Paused" ? "Approved" : "Pending Review",
      })),
      orders:(orders.data || []).map((o) => ({
        id:o.id,productId:o.product_id,productName:o.product_name,category:o.category||"",
        price:Number(o.amount),period:o.period,paymentMethod:o.payment_method,status:o.status,
        purchasedAt:o.purchased_at || o.created_at,buyerName:names.get(o.buyer_id)||"",
        buyerEmail:emails.get(o.buyer_id)||"",licenseKey:licenses.data?.find((l)=>l.order_id===o.id)?.license_key||"",
        sellerName:o.seller_name||names.get(o.vendor_id)||"",
      })),
      catalog:(products.data || []).filter((p)=>p.status==="Live & Active").map((p)=>({
        id:p.id,name:p.name,vendor:names.get(p.vendor_id)||"Vendor",vendorEmail:emails.get(p.vendor_id)||"",
        category:categoryNames.get(p.category_slug)||"",price:Number(p.price),period:p.period,
        rating:0,reviewCount:0,description:p.description,image:p.image_path||"",
        brandColor:p.brand_color||"#6366F1",brandLetter:p.brand_letter||p.name.slice(0,2),
        topBadge:"",tags:p.tags,features:p.features,uploadedDate:date(p.created_at),
      })),
      featuredIds:(featured.data || []).map((p)=>p.product_id),
    };
    return NextResponse.json(snapshot, { headers: { "Cache-Control":"private, no-store" } });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireUser(["admin"]);
    const { action,id } = await request.json();
    if (typeof id !== "string" || !id || id.length > 200) throw new RequestError(400,"Invalid record ID.");
    const db = serviceClient();
    const now = new Date().toISOString();
    if (action === "remove-user") {
      const { data:target,error } = await db.from("account_roles").select("role").eq("user_id",id).single();
      if (error || !target) throw new RequestError(404,"Account not found.");
      if (target.role === "admin" || id === user.id) throw new RequestError(403,"Administrator accounts cannot be removed.");
      const { error:removeError } = await db.auth.admin.deleteUser(id);
      if (removeError) throw new RequestError(409,"This account could not be removed. Existing orders or other records may reference it.");
    } else if (action === "approve-document" || action === "reject-document") {
      const { data,error } = await db.from("vendor_documents").update({
        status:action === "approve-document" ? "verified" : "rejected",reviewed_by:user.id,reviewed_at:now,
      }).eq("id",id).select("id").single();
      if (error || !data) throw new RequestError(400,"Document decision could not be saved.");
    } else if (action === "approve-project" || action === "remove-project") {
      const patch = action === "approve-project" ? { status:"Live & Active",approved_by:user.id,approved_at:now } : { status:"Paused",deleted_at:now };
      const { error,data } = await db.from("products").update(patch).eq("id",id).is("deleted_at",null).select("id").single();
      if (error || !data) throw new RequestError(400,"Product change could not be saved.");
      if (action === "remove-project") {
        const { error } = await db.from("featured_products").delete().eq("product_id",id);
        if (error) throw new RequestError(503,"Product removed, but featured placement cleanup failed.");
      }
    } else if (action === "feature-product") {
      const { data } = await db.from("products").select("id").eq("id",id).eq("status","Live & Active").is("deleted_at",null).single();
      if (!data) throw new RequestError(400,"Only approved, active products can be featured.");
      const { error } = await db.from("featured_products").upsert({ product_id:id,position:0 });
      if (error) throw new RequestError(400,"Product could not be featured.");
    } else if (action === "unfeature-product") {
      const { error } = await db.from("featured_products").delete().eq("product_id",id);
      if (error) throw new RequestError(400,"Featured placement could not be removed.");
    } else throw new RequestError(400,"Unknown admin action.");
    const { error:auditError } = await db.from("admin_audit_log").insert({
      actor_id:user.id,action,entity_type:"admin_dashboard",entity_id:id,
    });
    if (auditError) throw new RequestError(503,"Change saved, but its audit record could not be written.");
    return NextResponse.json({ ok:true }, { headers: { "Cache-Control":"no-store" } });
  } catch (error) { return apiError(error); }
}
