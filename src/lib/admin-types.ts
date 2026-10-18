import type { AdminCatalogProduct, AdminVendorDocument, AdminVendorProject, PlatformUser } from "@/utils/adminStore";
import type { BuyerOrder } from "@/utils/buyerOrders";
export interface AdminSnapshot {
  documents: AdminVendorDocument[];
  projects: AdminVendorProject[];
  users: PlatformUser[];
  orders: (Omit<BuyerOrder,"status"> & { status: string })[];
  catalog: AdminCatalogProduct[];
  featuredIds: string[];
}
export type AdminAction = "approve-document" | "reject-document" | "approve-project" | "remove-project" | "remove-user" | "feature-product" | "unfeature-product";
