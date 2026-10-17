"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";
import { getWishlist, removeFromWishlist, WISHLIST_EVENT_NAME } from "@/utils/wishlist";
import {
  BUYER_ORDERS_EVENT_NAME,
  BUYER_ORDERS_STORAGE_KEY,
  BuyerOrder,
  getBuyerOrders,
} from "@/utils/buyerOrders";

interface SavedInquiry {
  id: string;
  productName: string;
  category: string;
  vendorName: string;
  vendorEmail: string;
  vendorWhatsapp: string;
  quotedPrice: string;
  status: "Quote Received" | "Pending Vendor" | "Negotiation" | "Purchased";
  sentDate: string;
  note: string;
  productUrl: string;
}

interface StackItem {
  id: string;
  name: string;
  category: string;
  seats: number;
  monthlyCostPerSeat: number;
  billing: "Monthly" | "Annual";
}

interface DossierSummary {
  id: string;
  name: string;
  category: string;
  mrr: string;
  sla: string;
  soc2: string;
  color: string;
}

function isStackItem(value: unknown): value is StackItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<StackItem>;
  return (
    typeof item.id === "string"
    && typeof item.name === "string"
    && typeof item.category === "string"
    && typeof item.seats === "number"
    && Number.isFinite(item.seats)
    && item.seats >= 1
    && typeof item.monthlyCostPerSeat === "number"
    && Number.isFinite(item.monthlyCostPerSeat)
    && item.monthlyCostPerSeat >= 0
    && (item.billing === "Monthly" || item.billing === "Annual")
  );
}

function escapePdfText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function downloadDossierPdf(dossier: DossierSummary): void {
  const lines = [
    "SaaS MRKT - Due Diligence Audit",
    dossier.name,
    `Category: ${dossier.category}`,
    `Audited MRR: ${dossier.mrr}`,
    `Infrastructure SLA: ${dossier.sla}`,
    `Compliance Audit: ${dossier.soc2}`,
    "Generated from the Buyer Executive Dashboard.",
  ];
  const stream = lines
    .map((line, index) => `BT /F1 ${index < 2 ? 18 : 12} Tf 72 ${750 - index * 42} Td (${escapePdfText(line)}) Tj ET`)
    .join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${offset.toString().padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${dossier.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-due-diligence.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const DEFAULT_INQUIRIES: SavedInquiry[] = [
  {
    id: "inq-1",
    productName: "GrowthFlow AI",
    category: "CRM & Sales",
    vendorName: "David Miller (Lead Architect)",
    vendorEmail: "david.miller@growthflow.io",
    vendorWhatsapp: "14158902341",
    quotedPrice: "$149 / mo",
    status: "Quote Received",
    sentDate: "Oct 10, 2026",
    note: "Requested 25 seats for growth marketing squad. Enterprise discount applied.",
    productUrl: "/products/prod-growthflow/details",
  },
  {
    id: "inq-2",
    productName: "Manage360 Suite",
    category: "Project Management",
    vendorName: "Sarah Chen (Partnerships VP)",
    vendorEmail: "partnerships@manage360.io",
    vendorWhatsapp: "13126704491",
    quotedPrice: "$79 / mo",
    status: "Negotiation",
    sentDate: "Oct 08, 2026",
    note: "Evaluating 2-way GitHub synchronization & multiplayer sprint burndowns.",
    productUrl: "/products/prod-manage360/details",
  },
  {
    id: "inq-3",
    productName: "TaskFlow Workspace",
    category: "Project Management",
    vendorName: "Elena Rostova (Account Dir)",
    vendorEmail: "elena@taskflow.dev",
    vendorWhatsapp: "16504419022",
    quotedPrice: "$29 / mo",
    status: "Pending Vendor",
    sentDate: "Oct 11, 2026",
    note: "Inquired about SOC 2 Type II certificate and SSO Okta integration.",
    productUrl: "/products/prod-taskflow/details",
  },
];

const DEFAULT_STACK: StackItem[] = [
  { id: "s-1", name: "Slack Pro", category: "Communication", seats: 35, monthlyCostPerSeat: 8.75, billing: "Annual" },
  { id: "s-2", name: "GitHub Enterprise", category: "Developer Tools", seats: 20, monthlyCostPerSeat: 21, billing: "Annual" },
  { id: "s-3", name: "GrowthFlow AI", category: "Marketing Automation", seats: 5, monthlyCostPerSeat: 49, billing: "Monthly" },
  { id: "s-4", name: "Figma Organization", category: "Design", seats: 8, monthlyCostPerSeat: 45, billing: "Annual" },
];

export default function DashboardClient() {
  const { user, loginAsRole, openAuth, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState<"wishlist" | "orders" | "inquiries" | "dossiers" | "stack">("wishlist");

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Inquiries State
  const [inquiries] = useState<SavedInquiry[]>(DEFAULT_INQUIRIES);

  // Orders State
  const [orders, setOrders] = useState<BuyerOrder[]>([]);

  // Stack State
  const [stackItems, setStackItems] = useState<StackItem[]>(DEFAULT_STACK);
  const [isAddStackModalOpen, setIsAddStackModalOpen] = useState(false);
  const [newStackName, setNewStackName] = useState("");
  const [newStackCategory, setNewStackCategory] = useState("Productivity");
  const [newStackSeats, setNewStackSeats] = useState("10");
  const [newStackCost, setNewStackCost] = useState("20");

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Sync wishlist from localStorage and listen to events
  useEffect(() => {
    let frameId: number | null = null;
    const loadWishlist = () => {
      frameId = window.requestAnimationFrame(() => setWishlistIds(getWishlist()));
    };
    loadWishlist();

    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<string[]>).detail;
      if (detail) {
        setWishlistIds(detail);
      } else {
        loadWishlist();
      }
    };

    window.addEventListener(WISHLIST_EVENT_NAME, handleUpdate);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener(WISHLIST_EVENT_NAME, handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#orders") return;
    const frameId = window.requestAnimationFrame(() => setActiveTab("orders"));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    let frameId: number | null = null;
    const loadOrders = () => {
      try {
        const savedOrders = getBuyerOrders();
        frameId = window.requestAnimationFrame(() => setOrders(savedOrders));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Saved orders could not be loaded.";
        frameId = window.requestAnimationFrame(() => setToastNotice(message));
      }
    };
    const handleOrderUpdate = (event: Event) => {
      const detail = (event as CustomEvent<BuyerOrder[]>).detail;
      if (Array.isArray(detail)) {
        setOrders(detail);
      } else {
        loadOrders();
      }
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === BUYER_ORDERS_STORAGE_KEY) loadOrders();
    };

    loadOrders();
    window.addEventListener(BUYER_ORDERS_EVENT_NAME, handleOrderUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener(BUYER_ORDERS_EVENT_NAME, handleOrderUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Load stack from localStorage
  useEffect(() => {
    let frameId: number | null = null;
    try {
      const saved = localStorage.getItem("saas_mrkt_buyer_stack");
      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
          throw new TypeError("Saved tech stack is not in the expected format.");
        }
        const validItems = parsed.filter(isStackItem);
        frameId = window.requestAnimationFrame(() => setStackItems(validItems));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Saved tech stack could not be loaded.";
      frameId = window.requestAnimationFrame(() => setToastNotice(message));
    }
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleRemoveWishlist = (id: string, name: string) => {
    const updated = removeFromWishlist(id);
    setWishlistIds(updated);
    showToast(`Removed "${name}" from your saved wishlist.`);
  };

  const handleAddStackItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStackName.trim()) return;

    const seats = Number.parseInt(newStackSeats, 10);
    const monthlyCostPerSeat = Number.parseFloat(newStackCost);
    if (!Number.isFinite(seats) || seats < 1 || !Number.isFinite(monthlyCostPerSeat) || monthlyCostPerSeat < 0) {
      showToast("Enter a valid seat count and a non-negative monthly seat cost.");
      return;
    }

    const newItem: StackItem = {
      id: `s-${Date.now()}`,
      name: newStackName.trim(),
      category: newStackCategory,
      seats,
      monthlyCostPerSeat,
      billing: "Monthly",
    };

    const updated = [newItem, ...stackItems];
    try {
      localStorage.setItem("saas_mrkt_buyer_stack", JSON.stringify(updated));
    } catch (error) {
      const message = error instanceof Error ? error.message : "The tech stack could not be saved.";
      showToast(`Unable to add the software: ${message}`);
      return;
    }
    setStackItems(updated);

    setIsAddStackModalOpen(false);
    setNewStackName("");
    setNewStackSeats("10");
    setNewStackCost("20");
    showToast(`Added "${newItem.name}" to your company tech stack.`);
  };

  const handleDeleteStackItem = (id: string, name: string) => {
    const updated = stackItems.filter((i) => i.id !== id);
    try {
      localStorage.setItem("saas_mrkt_buyer_stack", JSON.stringify(updated));
    } catch (error) {
      const message = error instanceof Error ? error.message : "The tech stack could not be saved.";
      showToast(`Unable to remove the software: ${message}`);
      return;
    }
    setStackItems(updated);
    showToast(`Removed "${name}" from stack.`);
  };

  const handleExportDossier = (dossier: DossierSummary) => {
    downloadDossierPdf(dossier);
    showToast(`Downloaded the Due Diligence Audit PDF for ${dossier.name}.`);
  };

  // Compute wishlisted products
  const savedProducts: ProductItem[] = wishlistIds
    .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as ProductItem[];

  // Stack Calculations
  const totalMonthlySpend = stackItems.reduce((acc, item) => acc + item.seats * item.monthlyCostPerSeat, 0);
  const totalAnnualSpend = totalMonthlySpend * 12;
  const estimatedWasteSpend = Math.round(totalAnnualSpend * 0.28); // 28% Gartner/SaaS audit metric

  if (!isInitialized) {
    return (
      <PageLayout activeNav="dashboard" noContainer>
        <div className="container" style={{ paddingTop: "6rem", paddingBottom: "8rem", textAlign: "center" }}>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Loading Buyer Executive Dashboard...</p>
        </div>
      </PageLayout>
    );
  }

  // Auth gate if guest
  if (!user) {
    return (
      <PageLayout activeNav="dashboard" noContainer>
        <div className="container" style={{ paddingTop: "5rem", paddingBottom: "7rem", textAlign: "center" }}>
          <div
            style={{
              maxWidth: "520px",
              margin: "0 auto",
              background: "#FFFFFF",
              padding: "3rem 2.25rem",
              borderRadius: "24px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "#EEF2FF",
                color: "#5E4BEE",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.6rem" }}>
              Buyer Dashboard Sign In Required
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Sign in to manage your saved SaaS wishlist, active vendor quotes, unlocked confidential dossiers, and corporate software stack.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => loginAsRole("buyer")}
                style={{ width: "100%", justifyContent: "center", padding: "0.85rem 1.5rem" }}
              >
                1-Click Sign In as Buyer (Alex Morgan)
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => openAuth("signup", "buyer")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Create New Free Buyer Account
              </button>
              <Link href="/products" style={{ color: "#64748B", fontSize: "0.85rem", textDecoration: "none", marginTop: "0.5rem" }}>
                ← Browse Marketplace Products
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const buyerName = user.name || "Alex Morgan";
  const buyerEmail = user.email || "alex@company.com";
  const buyerRole = user.title || "Head of Product & Growth";
  const buyerCompany = user.company || "Acme Cloud Ventures";

  return (
    <PageLayout activeNav="dashboard" noContainer>
      {/* Toast Notice */}
      {toastNotice && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "0.85rem 1.4rem",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: 600,
            zIndex: 99999,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span>✓</span>
          <span>{toastNotice}</span>
        </div>
      )}

      <div style={{ background: "#FAFAFD", minHeight: "90vh", paddingBottom: "6rem" }}>
        <div className="container" style={{ paddingTop: "2.5rem" }}>
          {/* Header Card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid #E2E8F0",
              padding: "2rem 2.25rem",
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #5E4BEE 0%, #4F46E5 100%)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    boxShadow: "0 8px 16px -4px rgba(94, 75, 238, 0.4)",
                  }}
                >
                  {buyerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <h1 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      {buyerName}
                    </h1>
                    <span
                      style={{
                        background: "#EEF2FF",
                        color: "#4F46E5",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                      }}
                    >
                      Enterprise Procurement Officer
                    </span>
                  </div>
                  <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "0.25rem", margin: 0 }}>
                    {buyerRole} at <strong style={{ color: "#334155" }}>{buyerCompany}</strong> • {buyerEmail}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link
                  href="/tools/saas-spend-calculator"
                  className="btn-secondary"
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.85rem" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                  </svg>
                  Spend Calculator
                </Link>
                <Link
                  href="/products"
                  className="btn-primary"
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.85rem" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Discover Software
                </Link>
              </div>
            </div>

            {/* Metric KPI Banner */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "1.25rem",
                marginTop: "1.75rem",
                paddingTop: "1.75rem",
                borderTop: "1px solid #F1F5F9",
              }}
            >
              <div style={{ background: "#F8FAFC", padding: "1.1rem 1.25rem", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Saved Tools in Wishlist</span>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#5E4BEE", marginTop: "0.2rem" }}>
                  {savedProducts.length}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Ready for procurement & comparison</span>
              </div>

              <div style={{ background: "#F8FAFC", padding: "1.1rem 1.25rem", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Completed Purchases</span>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#7C3AED", marginTop: "0.2rem" }}>
                  {orders.length}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Active licenses and order records</span>
              </div>

              <div style={{ background: "#F8FAFC", padding: "1.1rem 1.25rem", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Active Purchase Quotes</span>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#059669", marginTop: "0.2rem" }}>
                  {inquiries.length}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Direct WhatsApp & vendor channels open</span>
              </div>

              <div style={{ background: "#F8FAFC", padding: "1.1rem 1.25rem", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Unlocked Due Diligence</span>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#3B82F6", marginTop: "0.2rem" }}>
                  3 Dossiers
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Financial & SOC-2 specs unlocked</span>
              </div>

              <div style={{ background: "#F8FAFC", padding: "1.1rem 1.25rem", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Tracked Stack Spend</span>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginTop: "0.2rem" }}>
                  ${totalAnnualSpend.toLocaleString()} <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748B" }}>/ yr</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#DC2626", fontWeight: 600 }}>~${estimatedWasteSpend.toLocaleString()} potential audit savings</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#E2E8F0",
              padding: "0.35rem",
              borderRadius: "14px",
              marginBottom: "2rem",
              width: "fit-content",
              maxWidth: "100%",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("wishlist")}
              style={{
                border: "none",
                background: activeTab === "wishlist" ? "#FFFFFF" : "transparent",
                color: activeTab === "wishlist" ? "#5E4BEE" : "#475569",
                fontWeight: 700,
                fontSize: "0.88rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: activeTab === "wishlist" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={activeTab === "wishlist" ? "#5E4BEE" : "none"} stroke="currentColor" strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Saved Wishlist ({savedProducts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              style={{
                border: "none",
                background: activeTab === "orders" ? "#FFFFFF" : "transparent",
                color: activeTab === "orders" ? "#5E4BEE" : "#475569",
                fontWeight: 700,
                fontSize: "0.88rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: activeTab === "orders" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 2h12l2 5H4l2-5Z" />
                <path d="M4 7v13h16V7" />
                <path d="M9 11h6" />
              </svg>
              Orders &amp; Purchases ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inquiries")}
              style={{
                border: "none",
                background: activeTab === "inquiries" ? "#FFFFFF" : "transparent",
                color: activeTab === "inquiries" ? "#5E4BEE" : "#475569",
                fontWeight: 700,
                fontSize: "0.88rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: activeTab === "inquiries" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Vendor Quotes & Inquiries ({inquiries.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("dossiers")}
              style={{
                border: "none",
                background: activeTab === "dossiers" ? "#FFFFFF" : "transparent",
                color: activeTab === "dossiers" ? "#5E4BEE" : "#475569",
                fontWeight: 700,
                fontSize: "0.88rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: activeTab === "dossiers" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Unlocked Dossiers (3)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("stack")}
              style={{
                border: "none",
                background: activeTab === "stack" ? "#FFFFFF" : "transparent",
                color: activeTab === "stack" ? "#5E4BEE" : "#475569",
                fontWeight: 700,
                fontSize: "0.88rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: activeTab === "stack" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              My Tech Stack ({stackItems.length})
            </button>
          </div>

          {/* TAB 1: WISHLIST */}
          {activeTab === "wishlist" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                    Saved Software for Evaluation
                  </h2>
                  <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Bookmark tools across the marketplace to track pricing, review architecture, and compare side-by-side.
                  </p>
                </div>
                {savedProducts.length > 1 && (
                  <Link
                    href={`/compare?tool1=${savedProducts[0]?.slug || savedProducts[0]?.id}&tool2=${savedProducts[1]?.slug || savedProducts[1]?.id}`}
                    className="btn-secondary"
                    style={{ textDecoration: "none", fontSize: "0.85rem" }}
                  >
                    Compare Top 2 Saved Tools →
                  </Link>
                )}
              </div>

              {savedProducts.length === 0 ? (
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: "4rem 2rem",
                    textAlign: "center",
                    border: "1px dashed #CBD5E1",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#F1F5F9",
                      color: "#94A3B8",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.4rem" }}>
                    Your Wishlist is Empty
                  </h3>
                  <p style={{ color: "#64748B", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem auto" }}>
                    Click the heart icon on any SaaS product card or details page to save it directly to your buyer dashboard.
                  </p>
                  <Link href="/products" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex" }}>
                    Explore Marketplace Tools
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                  {savedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "18px",
                        border: "1px solid #E2E8F0",
                        padding: "1.5rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      }}
                    >
                      {/* Top Row: Icon + Badge + Remove */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "12px",
                              backgroundColor: prod.brandColor || "#5E4BEE",
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "1.1rem",
                            }}
                          >
                            {prod.brandLetter || prod.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                              {prod.name}
                            </h3>
                            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>
                              {prod.category}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveWishlist(prod.id, prod.name)}
                          style={{
                            background: "#FEE2E2",
                            border: "none",
                            borderRadius: "8px",
                            width: "32px",
                            height: "32px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#DC2626",
                            cursor: "pointer",
                          }}
                          title="Remove from Wishlist"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>

                      {/* Tagline */}
                      <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.5, flex: 1, marginBottom: "1.25rem" }}>
                        {prod.tagline || prod.description}
                      </p>

                      {/* Pricing & Rating */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 0",
                          borderTop: "1px solid #F1F5F9",
                          borderBottom: "1px solid #F1F5F9",
                          marginBottom: "1.25rem",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                            License Price
                          </span>
                          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>
                            ${prod.price}{" "}
                            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>/{prod.period}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                            Buyer Rating
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.95rem", fontWeight: 800, color: "#0F172A" }}>
                            <span style={{ color: "#F59E0B" }}>★</span>
                            <span>{prod.rating}</span>
                            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>({prod.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                        <Link
                          href={`/products/${prod.id}/details`}
                          className="btn-primary"
                          style={{
                            textDecoration: "none",
                            fontSize: "0.82rem",
                            padding: "0.6rem 0.75rem",
                            justifyContent: "center",
                          }}
                        >
                          Due Diligence
                        </Link>
                        <Link
                          href={`/products/${prod.id}`}
                          className="btn-secondary"
                          style={{
                            textDecoration: "none",
                            fontSize: "0.82rem",
                            padding: "0.6rem 0.75rem",
                            justifyContent: "center",
                          }}
                        >
                          Overview
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS & PURCHASES */}
          {activeTab === "orders" && (
            <div id="orders">
              <div style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Orders &amp; Software Purchases
                </h2>
                <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  Review completed marketplace orders, active license keys, and seller details.
                </p>
              </div>

              {orders.length === 0 ? (
                <div style={{ background: "#FFFFFF", borderRadius: "18px", padding: "4rem 2rem", textAlign: "center", border: "1px dashed #CBD5E1" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.4rem" }}>
                    No Completed Orders Yet
                  </h3>
                  <p style={{ color: "#64748B", fontSize: "0.9rem", maxWidth: "440px", margin: "0 auto 1.5rem" }}>
                    Purchases completed through a product checkout will appear here with their order and license details.
                  </p>
                  <Link href="/products" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex" }}>
                    Browse Marketplace Products
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {orders.map((order) => (
                    <article key={order.id} style={{ background: "#FFFFFF", borderRadius: "18px", border: "1px solid #E2E8F0", padding: "1.5rem 1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>{order.productName}</h3>
                            <span style={{ background: "#ECFDF5", color: "#047857", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.65rem", borderRadius: "999px" }}>
                              {order.status}
                            </span>
                          </div>
                          <span style={{ color: "#64748B", fontSize: "0.8rem" }}>{order.category}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong style={{ display: "block", color: "#0F172A", fontSize: "0.9rem" }}>{order.id}</strong>
                          <span style={{ color: "#64748B", fontSize: "0.78rem" }}>
                            {new Date(order.purchasedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", padding: "1rem", background: "#F8FAFC", borderRadius: "12px", marginBottom: "1rem" }}>
                        <div>
                          <span style={{ display: "block", color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Amount Paid</span>
                          <strong style={{ color: "#059669" }}>${order.price.toLocaleString()} / {order.period}</strong>
                        </div>
                        <div>
                          <span style={{ display: "block", color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Payment</span>
                          <strong style={{ color: "#0F172A" }}>
                            {order.paymentMethod === "card" ? "Credit / Debit Card" : order.paymentMethod === "paypal" ? "PayPal" : "Digital Wallet"}
                          </strong>
                        </div>
                        <div>
                          <span style={{ display: "block", color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Seller</span>
                          <strong style={{ color: "#0F172A" }}>{order.sellerName}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <span style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: 700 }}>LICENSE KEY</span>
                          <code style={{ display: "block", color: "#4F46E5", fontSize: "0.85rem", marginTop: "0.2rem" }}>{order.licenseKey}</code>
                        </div>
                        <Link href={`/products/${order.productId}`} className="btn-secondary" style={{ textDecoration: "none", fontSize: "0.82rem", padding: "0.5rem 0.9rem" }}>
                          View Product
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INQUIRIES & ACTIVE QUOTES */}
          {activeTab === "inquiries" && (
            <div>
              <div style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Active Software Quotes & Vendor Conversations
                </h2>
                <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  All custom quotes, enterprise discounts, and direct seller WhatsApp discussions initiated through SaaS MRKT.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "18px",
                      border: "1px solid #E2E8F0",
                      padding: "1.5rem 1.75rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                          {inq.productName}
                        </h3>
                        <span
                          style={{
                            background:
                              inq.status === "Quote Received"
                                ? "#ECFDF5"
                                : inq.status === "Negotiation"
                                ? "#EFF6FF"
                                : "#FFFBEB",
                            color:
                              inq.status === "Quote Received"
                                ? "#059669"
                                : inq.status === "Negotiation"
                                ? "#2563EB"
                                : "#D97706",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.65rem",
                            borderRadius: "999px",
                          }}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Initiated: {inq.sentDate}</span>
                    </div>

                    <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                      &ldquo;{inq.note}&rdquo;
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem",
                        paddingTop: "0.85rem",
                        borderTop: "1px solid #F1F5F9",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div>
                        <span style={{ color: "#64748B" }}>Vendor Rep: </span>
                        <strong style={{ color: "#1E293B" }}>{inq.vendorName}</strong> ({inq.vendorEmail})
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <a
                          href={`https://wa.me/${inq.vendorWhatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#25D366",
                            color: "#FFFFFF",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            padding: "0.45rem 0.85rem",
                            borderRadius: "8px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          WhatsApp Rep
                        </a>
                        <Link
                          href={inq.productUrl}
                          className="btn-secondary"
                          style={{ textDecoration: "none", fontSize: "0.82rem", padding: "0.45rem 0.85rem" }}
                        >
                          View Live Listing
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: UNLOCKED DOSSIERS */}
          {activeTab === "dossiers" && (
            <div>
              <div style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Unlocked Due Diligence Dossiers
                </h2>
                <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  Confidential architectural schematics, audited ARR financial metrics, and legal vendor agreements unlocked by your buyer credentials.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {[
                  {
                    id: "prod-growthflow",
                    name: "GrowthFlow AI",
                    category: "CRM & Sales",
                    mrr: "$42,500 MRR",
                    sla: "99.98% Edge SLA",
                    soc2: "SOC-2 Type II Verified",
                    color: "#6366F1",
                  },
                  {
                    id: "prod-manage360",
                    name: "Manage360 Suite",
                    category: "Project Management",
                    mrr: "$68,200 MRR",
                    sla: "99.95% High Availability",
                    soc2: "ISO 27001 Certified",
                    color: "#059669",
                  },
                  {
                    id: "prod-taskflow",
                    name: "TaskFlow Workspace",
                    category: "Project Management",
                    mrr: "$31,400 MRR",
                    sla: "Sub-110ms Edge Sync",
                    soc2: "GDPR Compliant",
                    color: "#3B82F6",
                  },
                ].map((dos) => (
                  <div
                    key={dos.id}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "18px",
                      border: "1px solid #E2E8F0",
                      padding: "1.5rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          backgroundColor: dos.color,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                        }}
                      >
                        {dos.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                          {dos.name}
                        </h3>
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{dos.category}</span>
                      </div>
                    </div>

                    <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "0.85rem", marginBottom: "1.25rem", fontSize: "0.82rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <span style={{ color: "#64748B" }}>Audited MRR:</span>
                        <strong style={{ color: "#059669" }}>{dos.mrr}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <span style={{ color: "#64748B" }}>Infrastructure SLA:</span>
                        <strong style={{ color: "#0F172A" }}>{dos.sla}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748B" }}>Compliance Audit:</span>
                        <strong style={{ color: "#4F46E5" }}>{dos.soc2}</strong>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <Link
                        href={`/products/${dos.id}/details`}
                        className="btn-primary"
                        style={{
                          textDecoration: "none",
                          fontSize: "0.82rem",
                          padding: "0.55rem",
                          justifyContent: "center",
                        }}
                      >
                        Open Full Dossier
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleExportDossier(dos)}
                        className="btn-secondary"
                        style={{ fontSize: "0.82rem", padding: "0.55rem", justifyContent: "center" }}
                      >
                        Export PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MY TECH STACK & SPEND */}
          {activeTab === "stack" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                    Company Software Stack &amp; Seat Auditor
                  </h2>
                  <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Monitor active seats, billing cycles, and unallocated seat bloat across your enterprise organization.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStackModalOpen(true)}
                  className="btn-primary"
                  style={{ fontSize: "0.85rem" }}
                >
                  + Add Software to Stack
                </button>
              </div>

              {/* Stack Table */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  border: "1px solid #E2E8F0",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                        <th style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Software Name</th>
                        <th style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Category</th>
                        <th style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Active Seats</th>
                        <th style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Seat Cost</th>
                        <th style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Total / Month</th>
                        <th style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Billing</th>
                        <th style={{ padding: "0.85rem 1.25rem", fontWeight: 700, textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stackItems.map((item) => {
                        const monthlyTotal = item.seats * item.monthlyCostPerSeat;
                        return (
                          <tr key={item.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "#0F172A" }}>
                              {item.name}
                            </td>
                            <td style={{ padding: "1rem 1.25rem", color: "#64748B" }}>
                              {item.category}
                            </td>
                            <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "#1E293B" }}>
                              {item.seats} seats
                            </td>
                            <td style={{ padding: "1rem 1.25rem", color: "#64748B" }}>
                              ${item.monthlyCostPerSeat} / seat
                            </td>
                            <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: "#059669" }}>
                              ${monthlyTotal.toLocaleString()}
                            </td>
                            <td style={{ padding: "1rem 1.25rem" }}>
                              <span
                                style={{
                                  background: item.billing === "Annual" ? "#EEF2FF" : "#F1F5F9",
                                  color: item.billing === "Annual" ? "#4F46E5" : "#64748B",
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                }}
                              >
                                {item.billing}
                              </span>
                            </td>
                            <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteStackItem(item.id, item.name)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#DC2626",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  fontSize: "0.82rem",
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Totals */}
                <div
                  style={{
                    background: "#FAFAFD",
                    padding: "1rem 1.25rem",
                    borderTop: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <span style={{ color: "#64748B", fontSize: "0.85rem" }}>
                    Total active software in corporate stack: <strong>{stackItems.length} tools</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Total Monthly: </span>
                      <strong style={{ fontSize: "1.1rem", color: "#0F172A" }}>
                        ${totalMonthlySpend.toLocaleString()} / mo
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Annualized Run-Rate: </span>
                      <strong style={{ fontSize: "1.1rem", color: "#5E4BEE" }}>
                        ${totalAnnualSpend.toLocaleString()} / yr
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add to Tech Stack */}
      {isAddStackModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setIsAddStackModalOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              maxWidth: "480px",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                Add Software to Stack
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStackModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStackItem} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Software Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linear, Notion, AWS"
                  value={newStackName}
                  onChange={(e) => setNewStackName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.92rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Category
                </label>
                <select
                  value={newStackCategory}
                  onChange={(e) => setNewStackCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.92rem",
                    background: "#FFFFFF",
                  }}
                >
                  <option value="Productivity">Productivity &amp; Docs</option>
                  <option value="CRM & Sales">CRM &amp; Sales</option>
                  <option value="Developer Tools">Developer Tools &amp; Cloud</option>
                  <option value="Design">Design &amp; UI</option>
                  <option value="HR & Payroll">HR &amp; Operations</option>
                  <option value="Cybersecurity">Cybersecurity &amp; Auth</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Active Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStackSeats}
                    onChange={(e) => setNewStackSeats(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.92rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Cost / Seat ($/mo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={newStackCost}
                    onChange={(e) => setNewStackCost(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.92rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsAddStackModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
