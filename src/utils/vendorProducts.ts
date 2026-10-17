import { ALL_PRODUCTS, ProductItem } from "@/data/products";

export const VENDOR_PRODUCTS_STORAGE_KEY = "saas_mrkt_vendor_products";
export const VENDOR_PRODUCTS_EVENT_KEY = "saas_mrkt_vendor_products_updated";

const MARKETPLACE_CATEGORY_ALIASES: Record<string, string> = {
  "Finance & Accounting": "Accounting & Finance",
  "Marketing & Email": "Marketing",
  "Marketing & Growth": "Marketing",
  "Cloud & DevOps": "Developer Tools",
  "DevOps & Cloud": "Developer Tools",
};

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
  logo?: string;
  image?: string;
  targetAudience?: string;
  features: string[];
  status: "Live & Active" | "Under Review" | "Paused";
  inquiriesCount?: number;
  viewsCount?: number;
  listedDate?: string;
  sellerName?: string;
  deleted?: boolean;
}

export function isVendorSaaSListing(value: unknown): value is VendorSaaSListing {
  if (typeof value !== "object" || value === null) return false;

  const listing = value as Partial<VendorSaaSListing>;
  return (
    typeof listing.id === "string" &&
    typeof listing.name === "string" &&
    typeof listing.category === "string" &&
    typeof listing.tagline === "string" &&
    typeof listing.price === "number" &&
    Number.isFinite(listing.price) &&
    typeof listing.period === "string" &&
    typeof listing.pricingModel === "string" &&
    typeof listing.description === "string" &&
    typeof listing.website === "string" &&
    typeof listing.brandColor === "string" &&
    typeof listing.brandLetter === "string" &&
    Array.isArray(listing.features) &&
    listing.features.every((feature) => typeof feature === "string") &&
    (listing.status === "Live & Active" || listing.status === "Under Review" || listing.status === "Paused")
  );
}

export function normalizeMarketplaceCategory(category: string): string {
  return MARKETPLACE_CATEGORY_ALIASES[category] || category;
}

export function convertVendorListingToProductItem(listing: VendorSaaSListing, baseProduct?: ProductItem): ProductItem {
  const category = normalizeMarketplaceCategory(listing.category);
  return {
    ...baseProduct,
    id: listing.id,
    name: listing.name,
    category,
    rating: baseProduct?.rating ?? 5.0,
    reviewCount: baseProduct?.reviewCount ?? 1,
    description: listing.description || listing.tagline,
    tagline: listing.tagline,
    image: listing.image || baseProduct?.image || "/images/dealflow.jpg",
    logo: listing.logo || baseProduct?.logo,
    price: listing.price,
    period: listing.period || "mo",
    pricingModel: listing.pricingModel || baseProduct?.pricingModel,
    brandColor: listing.brandColor || "#5E4BEE",
    brandLetter: listing.brandLetter || listing.name.slice(0, 2).toUpperCase(),
    features: listing.features && listing.features.length > 0
      ? listing.features
      : baseProduct?.features || [],
    topBadge: baseProduct?.topBadge || "New Listing",
    tags: [category, "Verified Vendor", listing.pricingModel || "Subscription"],
    listedDate: listing.listedDate || baseProduct?.listedDate,
    sellerName: listing.sellerName || baseProduct?.sellerName || "David Miller (NexaSaaS)",
    sellerVerified: true,
    sellerMemberSince: baseProduct?.sellerMemberSince || "Joined Oct 2026",
    aboutText: listing.description || baseProduct?.aboutText,
    targetAudience: listing.targetAudience || baseProduct?.targetAudience,
  };
}

export function getStoredVendorProducts(): VendorSaaSListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VENDOR_PRODUCTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isVendorSaaSListing) : [];
  } catch {
    return [];
  }
}

export function mergeVendorListingsIntoProducts(
  baseProducts: ProductItem[],
  vendorListings: VendorSaaSListing[],
): ProductItem[] {
  const vendorListingsById = new Map(vendorListings.map((listing) => [listing.id, listing]));
  const mergedBaseProducts = baseProducts.flatMap((product) => {
    const vendorListing = vendorListingsById.get(product.id);
    if (!vendorListing) return [product];
    if (vendorListing.deleted) return [];
    if (vendorListing.status && vendorListing.status !== "Live & Active") return [];
    return [convertVendorListingToProductItem(vendorListing, product)];
  });
  const customItems = vendorListings
    .filter((listing) => !baseProducts.some((product) => product.id === listing.id))
    .filter((listing) => !listing.deleted)
    .filter((listing) => listing.status === "Live & Active" || !listing.status)
    .map((listing) => convertVendorListingToProductItem(listing));

  return [...customItems, ...mergedBaseProducts];
}

export function getAllMarketplaceProducts(): ProductItem[] {
  return mergeVendorListingsIntoProducts(ALL_PRODUCTS, getStoredVendorProducts());
}

export function resolveFeaturedProducts(
  curated: ProductItem[] | null,
  vendorListings: VendorSaaSListing[],
  fallbackBase: ProductItem[],
): ProductItem[] {
  const merged = mergeVendorListingsIntoProducts(fallbackBase, vendorListings);
  if (!curated) return merged;
  const mergedById = new Map(merged.map((product) => [product.id, product]));
  const vendorListingIds = new Set(vendorListings.map((listing) => listing.id));
  return curated.flatMap((item) => {
    if (vendorListingIds.has(item.id)) {
      const liveItem = mergedById.get(item.id);
      return liveItem ? [liveItem] : [];
    }
    return [mergedById.get(item.id) ?? item];
  });
}

export function findProductByIdIncludingCustom(id: string): ProductItem | null {
  const vendorListings = getStoredVendorProducts();
  const foundVendor = vendorListings.find((v) => v.id === id);
  const foundStatic = ALL_PRODUCTS.find((p) => p.id === id);
  if (foundVendor) {
    if (foundVendor.deleted || foundVendor.status !== "Live & Active") return null;
    return convertVendorListingToProductItem(foundVendor, foundStatic);
  }
  return foundStatic || null;
}
