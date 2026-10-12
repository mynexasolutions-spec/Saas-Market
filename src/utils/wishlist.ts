/**
 * SaaS MRKT - Wishlist Utility & LocalStorage Helper
 */

export const WISHLIST_STORAGE_KEY = "saas_mrkt_wishlist";
export const WISHLIST_EVENT_NAME = "saas_mrkt_wishlist_updated";

export const DEFAULT_WISHLIST_IDS = [
  "prod-growthflow",
  "prod-manage360",
  "prod-taskflow",
];

export function getWishlist(): string[] {
  if (typeof window === "undefined") return DEFAULT_WISHLIST_IDS;
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(DEFAULT_WISHLIST_IDS));
      return DEFAULT_WISHLIST_IDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_WISHLIST_IDS;
  } catch {
    return DEFAULT_WISHLIST_IDS;
  }
}

export function addToWishlist(productId: string): string[] {
  if (typeof window === "undefined") return [];
  const current = getWishlist();
  if (!current.includes(productId)) {
    const updated = [productId, ...current];
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(WISHLIST_EVENT_NAME, { detail: updated }));
    } catch {}
    return updated;
  }
  return current;
}

export function removeFromWishlist(productId: string): string[] {
  if (typeof window === "undefined") return [];
  const current = getWishlist();
  const updated = current.filter((id) => id !== productId);
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT_NAME, { detail: updated }));
  } catch {}
  return updated;
}

export function toggleWishlist(productId: string): { wishlisted: boolean; list: string[] } {
  const current = getWishlist();
  if (current.includes(productId)) {
    const updated = removeFromWishlist(productId);
    return { wishlisted: false, list: updated };
  } else {
    const updated = addToWishlist(productId);
    return { wishlisted: true, list: updated };
  }
}

export function isWishlisted(productId: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getWishlist();
  return current.includes(productId);
}
