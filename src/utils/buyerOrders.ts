export const BUYER_ORDERS_STORAGE_KEY = "saas_mrkt_buyer_orders";
export const BUYER_ORDERS_EVENT_NAME = "saas_mrkt_buyer_orders_updated";

export interface BuyerOrder {
  id: string;
  productId: string;
  productName: string;
  category: string;
  price: number;
  period: string;
  paymentMethod: "card" | "paypal" | "applepay";
  status: "Active";
  purchasedAt: string;
  buyerName: string;
  buyerEmail: string;
  licenseKey: string;
  sellerName: string;
}

function isBuyerOrder(value: unknown): value is BuyerOrder {
  if (!value || typeof value !== "object") return false;

  const order = value as Partial<BuyerOrder>;
  return (
    typeof order.id === "string"
    && typeof order.productId === "string"
    && typeof order.productName === "string"
    && typeof order.category === "string"
    && typeof order.price === "number"
    && Number.isFinite(order.price)
    && typeof order.period === "string"
    && (order.paymentMethod === "card" || order.paymentMethod === "paypal" || order.paymentMethod === "applepay")
    && order.status === "Active"
    && typeof order.purchasedAt === "string"
    && typeof order.buyerName === "string"
    && typeof order.buyerEmail === "string"
    && typeof order.licenseKey === "string"
    && typeof order.sellerName === "string"
  );
}

export function getBuyerOrders(): BuyerOrder[] {
  if (typeof window === "undefined") return [];

  const savedOrders = localStorage.getItem(BUYER_ORDERS_STORAGE_KEY);
  if (!savedOrders) return [];

  const parsed: unknown = JSON.parse(savedOrders);
  if (!Array.isArray(parsed)) {
    throw new TypeError("Saved buyer orders are not in the expected format.");
  }

  return parsed.filter(isBuyerOrder);
}

export function saveBuyerOrder(order: BuyerOrder): BuyerOrder[] {
  if (typeof window === "undefined") {
    throw new Error("Buyer orders can only be saved in the browser.");
  }

  const updatedOrders = [order, ...getBuyerOrders().filter((savedOrder) => savedOrder.id !== order.id)];
  localStorage.setItem(BUYER_ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  window.dispatchEvent(new CustomEvent(BUYER_ORDERS_EVENT_NAME, { detail: updatedOrders }));
  return updatedOrders;
}
