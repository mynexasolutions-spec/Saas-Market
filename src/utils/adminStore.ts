import { normalizeMarketplaceCategory, VendorSaaSListing } from "@/utils/vendorProducts";

export const PLATFORM_USERS_STORAGE_KEY = "saas_mrkt_platform_users";
export const PLATFORM_USERS_EVENT_KEY = "saas_mrkt_platform_users_updated";

export const ADMIN_DOCUMENTS_STORAGE_KEY = "saas_mrkt_admin_documents";
export const ADMIN_DOCUMENTS_EVENT_KEY = "saas_mrkt_admin_documents_updated";

export const ADMIN_PROJECTS_STORAGE_KEY = "saas_mrkt_admin_projects";
export const ADMIN_PROJECTS_EVENT_KEY = "saas_mrkt_admin_projects_updated";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "Buyer" | "Vendor" | "Admin";
  status: "Active" | "Verified" | "Suspended";
  joinedDate: string;
  company?: string;
}

export interface AdminVendorDocument {
  id: string;
  title: string;
  vendorName: string;
  vendorEmail: string;
  category: "Legal & Incorporation" | "Tax & Financial" | "Security & Compliance" | "Service Level Agreement";
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  status: "Pending Approval" | "Approved & Verified" | "Rejected";
  verifiedBy?: string;
  verifiedDate?: string;
}

export interface AdminVendorProject {
  id: string;
  name: string;
  vendor: string;
  vendorEmail: string;
  category: string;
  price: string;
  submittedDate: string;
  securityScan: "Passed" | "Pending" | "Flagged";
  status: "Pending Review" | "Approved" | "Live";
}

export interface AdminCatalogProduct {
  id: string;
  name: string;
  vendor: string;
  vendorEmail: string;
  category: string;
  price: number;
  period: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  brandColor: string;
  brandLetter: string;
  topBadge: string;
  tags: string[];
  features: string[];
  uploadedDate: string;
}

export function vendorListingToProject(listing: VendorSaaSListing): AdminVendorProject {
  const price = listing.pricingModel === "Free"
    ? "Free"
    : `$${listing.price}/${listing.period || "mo"}`;
  const status: AdminVendorProject["status"] = listing.status === "Live & Active"
    ? "Live"
    : listing.status === "Paused"
      ? "Approved"
      : "Pending Review";

  return {
    id: listing.id,
    name: listing.name,
    vendor: listing.sellerName || "Marketplace vendor",
    vendorEmail: "Submitted through vendor dashboard",
    category: normalizeMarketplaceCategory(listing.category),
    price,
    submittedDate: listing.listedDate || "Recently",
    securityScan: "Passed",
    status,
  };
}

export function mergeAdminProjects(
  storedProjects: AdminVendorProject[],
  listings: VendorSaaSListing[],
): AdminVendorProject[] {
  const vendorProjects = listings
    .filter((listing) => !listing.deleted)
    .map(vendorListingToProject);
  const vendorProjectIds = new Set(vendorProjects.map((project) => project.id));
  const vendorProjectNames = new Set(vendorProjects.map((project) => project.name));
  return [
    ...storedProjects.filter((project) => !vendorProjectIds.has(project.id) && !vendorProjectNames.has(project.name)),
    ...vendorProjects,
  ];
}

function listingToCatalogProduct(listing: VendorSaaSListing): AdminCatalogProduct {
  const category = normalizeMarketplaceCategory(listing.category);
  return {
    id: listing.id,
    name: listing.name,
    vendor: listing.sellerName || "Marketplace vendor",
    vendorEmail: "Submitted through vendor dashboard",
    category,
    price: listing.price,
    period: listing.period || "mo",
    rating: 5.0,
    reviewCount: 1,
    description: listing.description || listing.tagline,
    image: listing.image || "/images/dealflow.jpg",
    brandColor: listing.brandColor || "#5E4BEE",
    brandLetter: listing.brandLetter || listing.name.slice(0, 2).toUpperCase(),
    topBadge: "New Listing",
    tags: [category, "Verified Vendor", listing.pricingModel || "Subscription"],
    features: listing.features,
    uploadedDate: listing.listedDate || "Recently",
  };
}

export function buildHomeCatalog(
  base: AdminCatalogProduct[],
  listings: VendorSaaSListing[],
): AdminCatalogProduct[] {
  const listingById = new Map(listings.map((listing) => [listing.id, listing]));
  const catalog: AdminCatalogProduct[] = [];
  base.forEach((product) => {
    const listing = listingById.get(product.id);
    if (listing) {
      if (listing.deleted || listing.status !== "Live & Active") return;
      catalog.push({
        ...product,
        name: listing.name,
        category: normalizeMarketplaceCategory(listing.category),
        price: listing.price,
        period: listing.period || product.period,
        description: listing.description || listing.tagline || product.description,
        image: listing.image || product.image,
        brandColor: listing.brandColor || product.brandColor,
        brandLetter: listing.brandLetter || product.brandLetter,
        features: listing.features && listing.features.length > 0 ? listing.features : product.features,
      });
      return;
    }
    catalog.push(product);
  });
  const custom = listings
    .filter((listing) => !listing.deleted && listing.status === "Live & Active" && !base.some((product) => product.id === listing.id))
    .map(listingToCatalogProduct);
  return [...custom, ...catalog];
}

export function isPlatformUser(value: unknown): value is PlatformUser {
  if (typeof value !== "object" || value === null) return false;
  const user = value as Partial<PlatformUser>;
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    (user.role === "Buyer" || user.role === "Vendor" || user.role === "Admin") &&
    (user.status === "Active" || user.status === "Verified" || user.status === "Suspended") &&
    typeof user.joinedDate === "string" &&
    (user.company === undefined || typeof user.company === "string")
  );
}

export function isAdminVendorDocument(value: unknown): value is AdminVendorDocument {
  if (typeof value !== "object" || value === null) return false;
  const document = value as Partial<AdminVendorDocument>;
  return (
    typeof document.id === "string" &&
    typeof document.title === "string" &&
    typeof document.vendorName === "string" &&
    typeof document.vendorEmail === "string" &&
    (document.category === "Legal & Incorporation" ||
      document.category === "Tax & Financial" ||
      document.category === "Security & Compliance" ||
      document.category === "Service Level Agreement") &&
    typeof document.fileName === "string" &&
    typeof document.fileSize === "string" &&
    typeof document.uploadedDate === "string" &&
    (document.status === "Pending Approval" ||
      document.status === "Approved & Verified" ||
      document.status === "Rejected") &&
    (document.verifiedBy === undefined || typeof document.verifiedBy === "string") &&
    (document.verifiedDate === undefined || typeof document.verifiedDate === "string")
  );
}

export function isAdminVendorProject(value: unknown): value is AdminVendorProject {
  if (typeof value !== "object" || value === null) return false;
  const project = value as Partial<AdminVendorProject>;
  return (
    typeof project.id === "string" &&
    typeof project.name === "string" &&
    typeof project.vendor === "string" &&
    typeof project.vendorEmail === "string" &&
    typeof project.category === "string" &&
    typeof project.price === "string" &&
    typeof project.submittedDate === "string" &&
    (project.securityScan === "Passed" || project.securityScan === "Pending" || project.securityScan === "Flagged") &&
    (project.status === "Pending Review" || project.status === "Approved" || project.status === "Live")
  );
}

function readStoredArray<T>(storageKey: string, guard: (value: unknown) => value is T): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(guard) : [];
  } catch {
    return [];
  }
}

function writeStoredArray<T>(storageKey: string, eventKey: string, items: T[], cap: number): T[] {
  if (typeof window === "undefined") {
    throw new Error("Admin data can only be saved in the browser.");
  }
  const trimmed = items.slice(0, cap);
  localStorage.setItem(storageKey, JSON.stringify(trimmed));
  window.dispatchEvent(new CustomEvent(eventKey, { detail: trimmed }));
  return trimmed;
}

export function getStoredPlatformUsers(): PlatformUser[] {
  return readStoredArray(PLATFORM_USERS_STORAGE_KEY, isPlatformUser);
}

export function savePlatformUsers(users: PlatformUser[]): PlatformUser[] {
  return writeStoredArray(PLATFORM_USERS_STORAGE_KEY, PLATFORM_USERS_EVENT_KEY, users, 500);
}

export function getStoredAdminDocuments(): AdminVendorDocument[] {
  return readStoredArray(ADMIN_DOCUMENTS_STORAGE_KEY, isAdminVendorDocument);
}

export function saveAdminDocuments(documents: AdminVendorDocument[]): AdminVendorDocument[] {
  return writeStoredArray(ADMIN_DOCUMENTS_STORAGE_KEY, ADMIN_DOCUMENTS_EVENT_KEY, documents, 200);
}

export function getStoredAdminProjects(): AdminVendorProject[] {
  return readStoredArray(ADMIN_PROJECTS_STORAGE_KEY, isAdminVendorProject);
}

export function saveAdminProjects(projects: AdminVendorProject[]): AdminVendorProject[] {
  return writeStoredArray(ADMIN_PROJECTS_STORAGE_KEY, ADMIN_PROJECTS_EVENT_KEY, projects, 500);
}

export function formatAdminDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(date);
}
