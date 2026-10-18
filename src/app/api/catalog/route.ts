import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { listingFromRecord, type ProductRecord } from "@/lib/product-record";
export async function GET() {
 const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 {auth:{persistSession:false,autoRefreshToken:false}});
 const [products,categories,featured] = await Promise.all([
 db.from("products").select("*").eq("status","Live & Active").is("deleted_at",null).returns<ProductRecord[]>(),
 db.from("categories").select("slug,name"),db.from("featured_products").select("*").order("position")]);
 if(products.error||categories.error||featured.error)return NextResponse.json({error:"Catalog unavailable."},{status:503});
 return NextResponse.json({
  listings:products.data.map(p=>listingFromRecord(p,categories.data.find(c=>c.slug===p.category_slug)?.name||"")),
  featuredIds:featured.data.map(p=>p.product_id),
 },{headers:{"Cache-Control":"no-store"}});
}
