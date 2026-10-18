import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { serviceClient } from "@/lib/supabase/server";
import { apiError, RequestError, requireUser, sameOrigin } from "@/lib/server-auth";
import { isVendorSaaSListing, normalizeMarketplaceCategory } from "@/utils/vendorProducts";
import { listingFromRecord, type ProductRecord } from "@/lib/product-record";

export async function GET() {
 try {
  const user = await requireUser(["vendor"]);
  const db = serviceClient();
  const [products,categories,documents,inquiries] = await Promise.all([
   db.from("products").select("*").eq("vendor_id",user.id).is("deleted_at",null).returns<ProductRecord[]>(),
   db.from("categories").select("slug,name"),
   db.from("vendor_documents").select("*").eq("vendor_id",user.id),
   db.from("purchase_inquiries").select("*").eq("vendor_id",user.id),
  ]);
  if ([products,categories,documents,inquiries].some(r=>r.error)) throw new RequestError(503,"Vendor data could not be loaded.");
  return NextResponse.json({
   products:products.data!.map(p=>listingFromRecord(p,categories.data!.find(c=>c.slug===p.category_slug)?.name||"")),
   documents:documents.data!.map(d=>({
    id:d.id,title:d.title,category:d.category,fileName:d.file_name,fileSize:`${Math.ceil(d.byte_size/1024)} KB`,
    uploadedDate:new Date(d.created_at).toLocaleDateString(),status:d.status==="verified"?"Verified":d.status==="rejected"?"Action Required":"In Review",
    verifiedBy:d.reviewed_by ? "Platform administrator" : "Pending Admin Review",
    downloadUrl:`/api/vendor/document?id=${d.id}`,
   })),
   inquiries:inquiries.data!.map(i=>({
    id:i.id,buyerName:i.buyer_name||"",buyerEmail:i.buyer_email||"",buyerPhone:i.buyer_phone||"",
    buyerWhatsapp:i.buyer_whatsapp||"",companyName:i.company_name||"",
    softwareName:products.data!.find(p=>p.id===i.product_id)?.name||i.product_id,
    purchaseType:i.purchase_type,teamSize:i.team_size||"",budgetOffer:i.budget_offer||"",
    inquiryDate:new Date(i.created_at).toLocaleDateString(),message:i.message,status:i.status,productId:i.product_id,
   })),
  },{headers:{"Cache-Control":"no-store"}});
 } catch(error){return apiError(error);}
}
export async function POST(request: Request) {
 try {
  sameOrigin(request);
  const user = await requireUser(["vendor"]);
  const db = serviceClient();
  const body = await request.json();
  if (body.action === "listing") {
   const p = body.listing;
   if (!isVendorSaaSListing(p) || p.price < 0 || !p.name.trim() || p.name.length>150 || p.tagline.length<20)
    throw new RequestError(400,"Invalid listing.");
   const website = new URL(p.website);
   if (!["http:","https:"].includes(website.protocol)) throw new RequestError(400,"Invalid product website.");
   const {data:existing,error:existingError} = await db.from("products").select("vendor_id,status,approved_at").eq("id",p.id).maybeSingle();
   if (existingError) throw new RequestError(503,"Listing lookup failed.");
   if (existing && existing.vendor_id !== user.id) throw new RequestError(403,"This listing belongs to another vendor.");
   if (p.status === "Live & Active" && (!existing || !existing.approved_at))
    throw new RequestError(403,"Only an administrator can approve a listing.");
   const {data:category} = await db.from("categories").select("slug").eq("name",normalizeMarketplaceCategory(p.category)).single();
   if (!category) throw new RequestError(400,"Select a supported category.");
   const row = {
    name:p.name.trim(),category_slug:category.slug,tagline:p.tagline,description:p.description,
    price:p.price,period:p.period,pricing_model:p.pricingModel,website:p.website,brand_color:p.brandColor,
    brand_letter:p.brandLetter,features:p.features,logo_path:p.logo||null,image_path:p.image||null,
    target_audience:p.targetAudience||null,founder_name:user.name,
    status:existing ? p.status : "Under Review",deleted_at:p.deleted ? new Date().toISOString():null,
   };
   const result = existing
    ? await db.from("products").update(row).eq("id",p.id).eq("vendor_id",user.id)
    : await db.from("products").insert({...row,id:p.id,vendor_id:user.id});
   if (result.error) throw new RequestError(400,"Listing could not be saved.");
  } else if(body.action === "inquiry") {
   if (!["New Request","Contacted","Quote Sent","Purchased"].includes(body.status))
    throw new RequestError(400,"Invalid inquiry status.");
   const {error,data} = await db.from("purchase_inquiries").update({status:body.status})
    .eq("id",body.id).eq("vendor_id",user.id).select("id").single();
   if(error||!data)throw new RequestError(403,"Inquiry could not be updated.");
  } else if(body.action === "document") {
   const d = body.document;
   const match = typeof d?.dataUrl==="string" ? d.dataUrl.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/) : null;
   const types = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
   if(!match || !types.includes(match[1]) || typeof d.title!=="string" || !d.title.trim() || typeof d.fileName!=="string")
    throw new RequestError(400,"Select a valid PDF, DOC, or DOCX document.");
   const bytes = Buffer.from(match[2],"base64");
   if(!bytes.length || bytes.length>1024*1024)throw new RequestError(400,"Document must be at most 1 MB.");
   const id = randomUUID(), path = `${user.id}/${id}`;
   const {error:uploadError} = await db.storage.from("vendor-documents").upload(path,bytes,{contentType:match[1]});
   if(uploadError)throw new RequestError(400,"Document upload failed.");
   const {error} = await db.from("vendor_documents").insert({id,vendor_id:user.id,title:d.title,category:d.category,
     storage_path:path,file_name:d.fileName,byte_size:bytes.length,mime_type:match[1]});
   if(error){
    await db.storage.from("vendor-documents").remove([path]);
    throw new RequestError(400,"Document metadata could not be saved.");
   }
  } else throw new RequestError(400,"Unknown vendor action.");
  return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 }catch(error){return apiError(error);}
}
