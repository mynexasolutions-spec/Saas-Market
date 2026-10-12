import { ALL_PRODUCTS, ProductItem } from "@/data/products";

export const VENDOR_PRODUCTS_STORAGE_KEY = "saas_mrkt_vendor_products";
export const VENDOR_PRODUCTS_EVENT_KEY = "saas_mrkt_vendor_products_updated";

export interface VendorSaaSListing {
  id: string;
  name: string;
  category: string;
  tagline: string;
  price: number;
  period: string;
  pricingModel: string;
  description: string;
  website: string;
  brandColor: string;
  brandLetter: string;
  features: string[];
  status: "Live & Active" | "Under Review" | "Paused";
  inquiriesCount?: number;
  viewsCount?: number;
  listedDate?: string;
  sellerName?: string;
}

export function convertVendorListingToProductItem(listing: VendorSaaSListing): ProductItem {
  return {
    id: listing.id,
    name: listing.name,
    category: listing.category,
    rating: 5.0,
    reviewCount: 1,
    description: listing.description || listing.tagline,
    tagline: listing.tagline,
    image: "/images/dealflow.jpg",
    price: listing.price,
    period: listing.period || "mo",
    brandColor: listing.brandColor || "#5E4BEE",
    brandLetter: listing.brandLetter || listing.name.slice(0, 2).toUpperCase(),
    features: listing.features && listing.features.length > 0
      ? listing.features
      : ["Cloud API Integrations", "Role-Based Access Control", "99.98% High-Availability SLA"],
    topBadge: "New Listing",
    tags: [listing.category, "Verified Vendor", listing.pricingModel || "Subscription"],
    sellerName: listing.sellerName || "David Miller (NexaSaaS)",
    sellerVerified: true,
    sellerMemberSince: "Joined Oct 2026",
    aboutText: listing.description,
  };
}

export function getStoredVendorProducts(): VendorSaaSListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VENDOR_PRODUCTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAllMarketplaceProducts(): ProductItem[] {
  const vendorListings = getStoredVendorProducts();
  const customItems: ProductItem[] = vendorListings
    .filter((v) => v.status === "Live & Active" || !v.status)
    .filter((v) => !ALL_PRODUCTS.some((p) => p.id === v.id))
    .map(convertVendorListingToProductItem);

  return [...customItems, ...ALL_PRODUCTS];
}

export function findProductByIdIncludingCustom(id: string): ProductItem | null {
  const vendorListings = getStoredVendorProducts();
  const foundVendor = vendorListings.find((v) => v.id === id);
  if (foundVendor) {
    return convertVendorListingToProductItem(foundVendor);
  }
  const foundStatic = ALL_PRODUCTS.find((p) => p.id === id);
  return foundStatic || null;
}
