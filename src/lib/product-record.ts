import type { VendorSaaSListing } from "@/utils/vendorProducts";
export interface ProductRecord {
 id:string; name:string; category_slug:string; tagline:string; price:number; period:string;
 pricing_model:string; description:string; website:string; brand_color:string; brand_letter:string;
 logo_path:string; image_path:string; target_audience:string; features:string[];
 status:VendorSaaSListing["status"]; deleted_at:string|null; created_at:string; founder_name:string;
 vendor_id:string;
}
export function listingFromRecord(p: ProductRecord, category: string): VendorSaaSListing {
 return { id:p.id,name:p.name,category,tagline:p.tagline,price:Number(p.price),period:p.period,
 pricingModel:p.pricing_model,description:p.description,website:p.website,brandColor:p.brand_color,
 brandLetter:p.brand_letter,logo:p.logo_path,image:p.image_path,targetAudience:p.target_audience,
 features:p.features,status:p.status,deleted:!!p.deleted_at,listedDate:p.created_at,sellerName:p.founder_name };
}
