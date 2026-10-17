import { ProductItem } from "@/data/products";
import { BuyerOrder } from "@/utils/buyerOrders";

export const VENDOR_INQUIRIES_STORAGE_KEY = "saas_mrkt_vendor_inquiries";
export const VENDOR_INQUIRIES_EVENT_KEY = "saas_mrkt_vendor_inquiries_updated";

export type InquiryPurchaseType = "Direct Purchase" | "Enterprise License" | "Custom Quote" | "Volume Discount";
export type InquiryStatus = "New Request" | "Contacted" | "Quote Sent" | "Purchased";

export interface PurchaseInquiry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerWhatsapp: string;
  companyName: string;
  softwareName: string;
  purchaseType: InquiryPurchaseType;
  teamSize: string;
  budgetOffer: string;
  inquiryDate: string;
  message: string;
  status: InquiryStatus;
  productId?: string;
  sellerName?: string;
}

export function isPurchaseInquiry(value: unknown): value is PurchaseInquiry {
  if (typeof value !== "object" || value === null) return false;
  const inquiry = value as Partial<PurchaseInquiry>;
  return (
    typeof inquiry.id === "string" &&
    typeof inquiry.buyerName === "string" &&
    typeof inquiry.buyerEmail === "string" &&
    typeof inquiry.buyerPhone === "string" &&
    typeof inquiry.buyerWhatsapp === "string" &&
    typeof inquiry.companyName === "string" &&
    typeof inquiry.softwareName === "string" &&
    typeof inquiry.purchaseType === "string" &&
    typeof inquiry.teamSize === "string" &&
    typeof inquiry.budgetOffer === "string" &&
    typeof inquiry.inquiryDate === "string" &&
    typeof inquiry.message === "string" &&
    (inquiry.status === "New Request" || inquiry.status === "Contacted" || inquiry.status === "Quote Sent" || inquiry.status === "Purchased") &&
    (inquiry.productId === undefined || typeof inquiry.productId === "string") &&
    (inquiry.sellerName === undefined || typeof inquiry.sellerName === "string")
  );
}

export function getStoredVendorInquiries(): PurchaseInquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VENDOR_INQUIRIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPurchaseInquiry) : [];
  } catch {
    return [];
  }
}

export function saveVendorInquiries(inquiries: PurchaseInquiry[]): PurchaseInquiry[] {
  if (typeof window === "undefined") {
    throw new Error("Vendor inquiries can only be saved in the browser.");
  }
  const trimmed = inquiries.slice(0, 200);
  localStorage.setItem(VENDOR_INQUIRIES_STORAGE_KEY, JSON.stringify(trimmed));
  window.dispatchEvent(new CustomEvent(VENDOR_INQUIRIES_EVENT_KEY, { detail: trimmed }));
  return trimmed;
}

export function upsertVendorInquiry(inquiry: PurchaseInquiry): PurchaseInquiry[] {
  const remaining = getStoredVendorInquiries().filter((saved) => saved.id !== inquiry.id);
  return saveVendorInquiries([inquiry, ...remaining]);
}

export function formatInquiryDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(date);
}

export function createContactInquiry(
  product: ProductItem,
  details: { buyerName: string; buyerEmail: string; message: string },
): PurchaseInquiry {
  const hasPrice = typeof product.price === "number" && product.price > 0;
  return {
    id: `inq-contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    buyerName: details.buyerName.trim() || "Marketplace Buyer",
    buyerEmail: details.buyerEmail.trim() || "Not provided",
    buyerPhone: "Not provided",
    buyerWhatsapp: "",
    companyName: "Not provided",
    softwareName: product.name,
    purchaseType: "Custom Quote",
    teamSize: "Not specified",
    budgetOffer: hasPrice ? `$${product.price} / ${product.period || "mo"}` : "To be discussed",
    inquiryDate: formatInquiryDate(),
    message: details.message.trim() || `Buyer requested more information about ${product.name}.`,
    status: "New Request",
    productId: product.id,
    sellerName: product.sellerName,
  };
}

function getPaymentMethodLabel(paymentMethod: BuyerOrder["paymentMethod"]): string {
  if (paymentMethod === "paypal") return "PayPal";
  if (paymentMethod === "applepay") return "Digital Wallet";
  return "Credit / Debit Card";
}

export function createCheckoutInquiry(order: BuyerOrder, companyName?: string): PurchaseInquiry {
  return {
    id: `inq-order-${order.id}`,
    buyerName: order.buyerName || "Marketplace Buyer",
    buyerEmail: order.buyerEmail || "Not provided",
    buyerPhone: "Not provided",
    buyerWhatsapp: "",
    companyName: companyName?.trim() || "Not provided",
    softwareName: order.productName,
    purchaseType: "Direct Purchase",
    teamSize: "Not specified",
    budgetOffer: `$${order.price} / ${order.period}`,
    inquiryDate: formatInquiryDate(new Date(order.purchasedAt)),
    message: `Completed marketplace checkout (${order.id}) via ${getPaymentMethodLabel(order.paymentMethod)}. License key ${order.licenseKey} issued.`,
    status: "Purchased",
    productId: order.productId,
    sellerName: order.sellerName,
  };
}
