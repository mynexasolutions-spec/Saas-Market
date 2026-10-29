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
import "./dashboard-page.css";

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
        <div className="container" style={{ paddingTop: "4.5rem", paddingBottom: "6.5rem" }}>
          <div className="dashboard-guest-card">
            <div className="dashboard-guest-icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="dashboard-guest-title">
              Buyer Dashboard Sign In Required
            </h2>
            <p className="dashboard-guest-desc">
              Sign in to manage your saved SaaS wishlist, active vendor quotes, unlocked confidential dossiers, and corporate software stack.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => loginAsRole("buyer")}
                style={{ width: "100%", justifyContent: "center", padding: "0.75rem 1.25rem", fontSize: "0.9rem" }}
              >
                1-Click Sign In as Buyer (Alex Morgan)
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => openAuth("signup", "buyer")}
                style={{ width: "100%", justifyContent: "center", padding: "0.75rem 1.25rem", fontSize: "0.88rem" }}
              >
                Create New Free Buyer Account
              </button>
              <Link href="/products" style={{ color: "#64748B", fontSize: "0.84rem", textDecoration: "none", marginTop: "0.5rem" }}>
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
        <div className="dashboard-toast">
          <span style={{ color: "#34D399" }}>✓</span>
          <span>{toastNotice}</span>
        </div>
      )}

      <div className="dashboard-page-wrapper">
        <div className="container">
          {/* Header Card */}
          <div className="dashboard-header-card">
            <div className="dashboard-header-top">
              <div className="dashboard-user-profile">
                <div className="dashboard-avatar">
                  {buyerName.slice(0, 2).toUpperCase()}
                </div>
                <div className="dashboard-user-meta">
                  <div className="dashboard-user-title-row">
                    <h1 className="dashboard-user-name">{buyerName}</h1>
                    <span className="dashboard-role-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      </svg>
                      Enterprise Procurement Officer
                    </span>
                  </div>
                  <p className="dashboard-user-subtitle">
                    {buyerRole} at <strong>{buyerCompany}</strong> • {buyerEmail}
                  </p>
                </div>
              </div>

              <div className="dashboard-header-actions">
                <Link href="/tools/saas-spend-calculator" className="dashboard-action-btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                  </svg>
                  Spend Calculator
                </Link>
                <Link href="/products" className="dashboard-action-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Discover Software
                </Link>
              </div>
            </div>

            {/* Metric KPI Banner */}
            <div className="dashboard-kpi-grid">
              <div className="dashboard-kpi-card">
                <div className="dashboard-kpi-label">
                  <span>Saved Wishlist</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="dashboard-kpi-value" style={{ color: "#4F46E5" }}>
                  {savedProducts.length}
                </div>
                <span className="dashboard-kpi-sub">Ready for comparison</span>
              </div>

              <div className="dashboard-kpi-card">
                <div className="dashboard-kpi-label">
                  <span>Completed Purchases</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2">
                    <path d="M6 2h12l2 5H4l2-5Z" />
                    <path d="M4 7v13h16V7" />
                  </svg>
                </div>
                <div className="dashboard-kpi-value" style={{ color: "#7C3AED" }}>
                  {orders.length}
                </div>
                <span className="dashboard-kpi-sub">Active software licenses</span>
              </div>

              <div className="dashboard-kpi-card">
                <div className="dashboard-kpi-label">
                  <span>Vendor Quotes</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="dashboard-kpi-value" style={{ color: "#059669" }}>
                  {inquiries.length}
                </div>
                <span className="dashboard-kpi-sub">Active WhatsApp channels</span>
              </div>

              <div className="dashboard-kpi-card">
                <div className="dashboard-kpi-label">
                  <span>Unlocked Dossiers</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="dashboard-kpi-value" style={{ color: "#2563EB" }}>
                  3 Dossiers
                </div>
                <span className="dashboard-kpi-sub">Audited MRR &amp; SOC-2</span>
              </div>

              <div className="dashboard-kpi-card">
                <div className="dashboard-kpi-label">
                  <span>Tracked Spend</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="dashboard-kpi-value" style={{ color: "#0F172A" }}>
                  ${totalAnnualSpend.toLocaleString()} <span style={{ fontSize: "0.8rem", fontWeight: 650, color: "#64748B" }}>/ yr</span>
                </div>
                <span className="dashboard-kpi-danger-sub">~${estimatedWasteSpend.toLocaleString()} waste audit savings</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="dashboard-nav-tabs-wrapper">
            <div className="dashboard-nav-tabs">
              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`dashboard-tab-btn ${activeTab === "wishlist" ? "is-active" : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={activeTab === "wishlist" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>Saved Wishlist</span>
                <span className="dashboard-tab-badge">{savedProducts.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`dashboard-tab-btn ${activeTab === "orders" ? "is-active" : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2h12l2 5H4l2-5Z" />
                  <path d="M4 7v13h16V7" />
                  <path d="M9 11h6" />
                </svg>
                <span>Orders &amp; Purchases</span>
                <span className="dashboard-tab-badge">{orders.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("inquiries")}
                className={`dashboard-tab-btn ${activeTab === "inquiries" ? "is-active" : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Vendor Quotes</span>
                <span className="dashboard-tab-badge">{inquiries.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("dossiers")}
                className={`dashboard-tab-btn ${activeTab === "dossiers" ? "is-active" : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Unlocked Dossiers</span>
                <span className="dashboard-tab-badge">3</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("stack")}
                className={`dashboard-tab-btn ${activeTab === "stack" ? "is-active" : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                <span>My Tech Stack</span>
                <span className="dashboard-tab-badge">{stackItems.length}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: WISHLIST */}
          {activeTab === "wishlist" && (
            <div>
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">
                    Saved Software for Evaluation
                  </h2>
                  <p className="dashboard-section-desc">
                    Bookmark tools across the marketplace to track pricing, review architecture, and compare side-by-side.
                  </p>
                </div>
                {savedProducts.length > 1 && (
                  <Link
                    href={`/compare?tool1=${savedProducts[0]?.slug || savedProducts[0]?.id}&tool2=${savedProducts[1]?.slug || savedProducts[1]?.id}`}
                    className="dashboard-action-btn-secondary"
                  >
                    Compare Top 2 Saved Tools →
                  </Link>
                )}
              </div>

              {savedProducts.length === 0 ? (
                <div className="dashboard-empty-card">
                  <div className="dashboard-empty-icon-wrap">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h3 className="dashboard-empty-title">
                    Your Wishlist is Empty
                  </h3>
                  <p className="dashboard-empty-desc">
                    Click the heart icon on any SaaS product card or details page to save it directly to your buyer dashboard.
                  </p>
                  <Link href="/products" className="dashboard-action-btn-primary">
                    Explore Marketplace Tools
                  </Link>
                </div>
              ) : (
                <div className="dashboard-wishlist-grid">
                  {savedProducts.map((prod) => (
                    <div key={prod.id} className="dashboard-wishlist-card">
                      {/* Top Row: Icon + Badge + Remove */}
                      <div className="dashboard-card-top-row">
                        <div className="dashboard-card-brand-box">
                          <div
                            className="dashboard-brand-avatar"
                            style={{ backgroundColor: prod.brandColor || "#4F46E5" }}
                          >
                            {prod.brandLetter || prod.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="dashboard-card-tool-name">
                              {prod.name}
                            </h3>
                            <span className="dashboard-card-tool-cat">
                              {prod.category}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveWishlist(prod.id, prod.name)}
                          className="dashboard-icon-remove-btn"
                          title="Remove from Wishlist"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>

                      {/* Tagline */}
                      <p className="dashboard-card-desc">
                        {prod.tagline || prod.description}
                      </p>

                      {/* Pricing & Rating */}
                      <div className="dashboard-card-metrics-row">
                        <div>
                          <span className="dashboard-card-metric-label">
                            License Price
                          </span>
                          <div className="dashboard-card-metric-value">
                            ${prod.price}{" "}
                            <span className="dashboard-card-metric-period">/{prod.period}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span className="dashboard-card-metric-label">
                            Buyer Rating
                          </span>
                          <div className="dashboard-card-rating-wrap">
                            <span style={{ color: "#F59E0B" }}>★</span>
                            <span>{prod.rating}</span>
                            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>({prod.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="dashboard-card-actions">
                        <Link
                          href={`/products/${prod.id}/details`}
                          className="dashboard-btn-card-primary"
                        >
                          Due Diligence
                        </Link>
                        <Link
                          href={`/products/${prod.id}`}
                          className="dashboard-btn-card-secondary"
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
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">
                    Orders &amp; Software Purchases
                  </h2>
                  <p className="dashboard-section-desc">
                    Review completed marketplace orders, active license keys, and seller details.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="dashboard-empty-card">
                  <div className="dashboard-empty-icon-wrap">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2h12l2 5H4l2-5Z" />
                      <path d="M4 7v13h16V7" />
                    </svg>
                  </div>
                  <h3 className="dashboard-empty-title">
                    No Completed Orders Yet
                  </h3>
                  <p className="dashboard-empty-desc">
                    Purchases completed through a product checkout will appear here with their order and license details.
                  </p>
                  <Link href="/products" className="dashboard-action-btn-primary">
                    Browse Marketplace Products
                  </Link>
                </div>
              ) : (
                <div className="dashboard-orders-list">
                  {orders.map((order) => (
                    <article key={order.id} className="dashboard-order-card">
                      <div className="dashboard-order-header">
                        <div>
                          <div className="dashboard-order-title-group">
                            <h3 className="dashboard-order-product-name">{order.productName}</h3>
                            <span className="dashboard-order-status-badge">
                              {order.status}
                            </span>
                          </div>
                          <span style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "0.2rem", display: "inline-block" }}>{order.category}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong style={{ display: "block", color: "#0F172A", fontSize: "0.88rem" }}>{order.id}</strong>
                          <span style={{ color: "#64748B", fontSize: "0.76rem" }}>
                            {new Date(order.purchasedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="dashboard-order-grid-meta">
                        <div>
                          <span style={{ display: "block", color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Amount Paid</span>
                          <strong style={{ color: "#059669", fontSize: "0.95rem" }}>${order.price.toLocaleString()} / {order.period}</strong>
                        </div>
                        <div>
                          <span style={{ display: "block", color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Payment</span>
                          <strong style={{ color: "#0F172A", fontSize: "0.88rem" }}>
                            {order.paymentMethod === "card" ? "Credit / Debit Card" : order.paymentMethod === "paypal" ? "PayPal" : "Digital Wallet"}
                          </strong>
                        </div>
                        <div>
                          <span style={{ display: "block", color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Seller</span>
                          <strong style={{ color: "#0F172A", fontSize: "0.88rem" }}>{order.sellerName}</strong>
                        </div>
                      </div>

                      <div className="dashboard-order-footer">
                        <div className="dashboard-license-box">
                          <span style={{ color: "#64748B", fontSize: "0.74rem", fontWeight: 700, display: "block" }}>LICENSE KEY</span>
                          <code>{order.licenseKey}</code>
                        </div>
                        <Link href={`/products/${order.productId}`} className="dashboard-action-btn-secondary" style={{ fontSize: "0.82rem", padding: "0.45rem 0.9rem" }}>
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
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">
                    Active Software Quotes & Vendor Conversations
                  </h2>
                  <p className="dashboard-section-desc">
                    All custom quotes, enterprise discounts, and direct seller WhatsApp discussions initiated through SaaS MRKT.
                  </p>
                </div>
              </div>

              <div>
                {inquiries.map((inq) => {
                  const badgeClass =
                    inq.status === "Quote Received"
                      ? "received"
                      : inq.status === "Negotiation"
                      ? "negotiation"
                      : "pending";

                  return (
                    <div key={inq.id} className="dashboard-inquiry-card">
                      <div className="dashboard-inquiry-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: "1.12rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                            {inq.productName}
                          </h3>
                          <span className={`dashboard-quote-badge ${badgeClass}`}>
                            {inq.status}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Initiated: {inq.sentDate}</span>
                      </div>

                      <div className="dashboard-inquiry-note">
                        &ldquo;{inq.note}&rdquo;
                      </div>

                      <div className="dashboard-inquiry-footer">
                        <div>
                          <span style={{ color: "#64748B" }}>Vendor Rep: </span>
                          <strong style={{ color: "#1E293B" }}>{inq.vendorName}</strong> ({inq.vendorEmail})
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                          <a
                            href={`https://wa.me/${inq.vendorWhatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dashboard-whatsapp-btn"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            WhatsApp Rep
                          </a>
                          <Link
                            href={inq.productUrl}
                            className="dashboard-action-btn-secondary"
                            style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
                          >
                            View Live Listing
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: UNLOCKED DOSSIERS */}
          {activeTab === "dossiers" && (
            <div>
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">
                    Unlocked Due Diligence Dossiers
                  </h2>
                  <p className="dashboard-section-desc">
                    Confidential architectural schematics, audited ARR financial metrics, and legal vendor agreements unlocked by your buyer credentials.
                  </p>
                </div>
              </div>

              <div className="dashboard-dossier-grid">
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
                  <div key={dos.id} className="dashboard-dossier-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "12px",
                          backgroundColor: dos.color,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "1rem",
                          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {dos.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.08rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                          {dos.name}
                        </h3>
                        <span style={{ fontSize: "0.74rem", color: "#64748B", fontWeight: 600 }}>{dos.category}</span>
                      </div>
                    </div>

                    <div className="dashboard-dossier-metrics">
                      <div className="dashboard-dossier-metric-item">
                        <span style={{ color: "#64748B" }}>Audited MRR:</span>
                        <strong style={{ color: "#059669" }}>{dos.mrr}</strong>
                      </div>
                      <div className="dashboard-dossier-metric-item">
                        <span style={{ color: "#64748B" }}>Infrastructure SLA:</span>
                        <strong style={{ color: "#0F172A" }}>{dos.sla}</strong>
                      </div>
                      <div className="dashboard-dossier-metric-item">
                        <span style={{ color: "#64748B" }}>Compliance Audit:</span>
                        <strong style={{ color: "#4F46E5" }}>{dos.soc2}</strong>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
                      <Link
                        href={`/products/${dos.id}/details`}
                        className="dashboard-btn-card-primary"
                        style={{ padding: "0.55rem", fontSize: "0.8rem" }}
                      >
                        Open Full Dossier
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleExportDossier(dos)}
                        className="dashboard-btn-card-secondary"
                        style={{ padding: "0.55rem", fontSize: "0.8rem", cursor: "pointer" }}
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
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">
                    Company Software Stack &amp; Seat Auditor
                  </h2>
                  <p className="dashboard-section-desc">
                    Monitor active seats, billing cycles, and unallocated seat bloat across your enterprise organization.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStackModalOpen(true)}
                  className="dashboard-action-btn-primary"
                  style={{ cursor: "pointer" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Software to Stack
                </button>
              </div>

              {/* Stack Table Card */}
              <div className="dashboard-stack-card">
                {/* Desktop View Table */}
                <div className="dashboard-stack-table-wrapper">
                  <table className="dashboard-stack-table">
                    <thead>
                      <tr>
                        <th>Software Name</th>
                        <th>Category</th>
                        <th>Active Seats</th>
                        <th>Seat Cost</th>
                        <th>Total / Month</th>
                        <th>Billing</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stackItems.map((item) => {
                        const monthlyTotal = item.seats * item.monthlyCostPerSeat;
                        return (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 750, color: "#0F172A" }}>
                              {item.name}
                            </td>
                            <td style={{ color: "#64748B" }}>
                              {item.category}
                            </td>
                            <td style={{ fontWeight: 650, color: "#1E293B" }}>
                              {item.seats} seats
                            </td>
                            <td style={{ color: "#64748B" }}>
                              ${item.monthlyCostPerSeat} / seat
                            </td>
                            <td style={{ fontWeight: 800, color: "#059669" }}>
                              ${monthlyTotal.toLocaleString()}
                            </td>
                            <td>
                              <span
                                style={{
                                  background: item.billing === "Annual" ? "#EEF2FF" : "#F1F5F9",
                                  color: item.billing === "Annual" ? "#4F46E5" : "#64748B",
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px",
                                  fontSize: "0.74rem",
                                  fontWeight: 750,
                                }}
                              >
                                {item.billing}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteStackItem(item.id, item.name)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#DC2626",
                                  fontWeight: 650,
                                  cursor: "pointer",
                                  fontSize: "0.82rem",
                                  padding: "0.2rem 0.4rem",
                                  borderRadius: "6px",
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

                {/* Mobile Cards Alternative for screens <= 768px */}
                <div className="dashboard-stack-mobile-cards">
                  {stackItems.map((item) => {
                    const monthlyTotal = item.seats * item.monthlyCostPerSeat;
                    return (
                      <div key={item.id} className="dashboard-stack-mobile-card">
                        <div className="dashboard-stack-mobile-card-top">
                          <div>
                            <strong style={{ fontSize: "0.98rem", color: "#0F172A", display: "block" }}>{item.name}</strong>
                            <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{item.category}</span>
                          </div>
                          <span
                            style={{
                              background: item.billing === "Annual" ? "#EEF2FF" : "#F1F5F9",
                              color: item.billing === "Annual" ? "#4F46E5" : "#64748B",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "6px",
                              fontSize: "0.72rem",
                              fontWeight: 750,
                            }}
                          >
                            {item.billing}
                          </span>
                        </div>

                        <div className="dashboard-stack-mobile-meta-grid">
                          <div>
                            <span style={{ color: "#64748B", display: "block", fontSize: "0.7rem", textTransform: "uppercase" }}>Seats</span>
                            <strong>{item.seats} seats</strong>
                          </div>
                          <div>
                            <span style={{ color: "#64748B", display: "block", fontSize: "0.7rem", textTransform: "uppercase" }}>Per Seat</span>
                            <strong>${item.monthlyCostPerSeat}/mo</strong>
                          </div>
                          <div>
                            <span style={{ color: "#64748B", display: "block", fontSize: "0.7rem", textTransform: "uppercase" }}>Monthly Spend</span>
                            <strong style={{ color: "#059669" }}>${monthlyTotal.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span style={{ color: "#64748B", display: "block", fontSize: "0.7rem", textTransform: "uppercase" }}>Annualized</span>
                            <strong style={{ color: "#4F46E5" }}>${(monthlyTotal * 12).toLocaleString()}</strong>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteStackItem(item.id, item.name)}
                            style={{
                              background: "#fee2e2",
                              border: "none",
                              color: "#dc2626",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontSize: "0.78rem",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                            }}
                          >
                            Remove Software
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table Footer Totals */}
                <div className="dashboard-stack-footer">
                  <span style={{ color: "#64748B", fontSize: "0.84rem" }}>
                    Total active software in corporate stack: <strong>{stackItems.length} tools</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontSize: "0.74rem", color: "#64748B" }}>Total Monthly: </span>
                      <strong style={{ fontSize: "1.05rem", color: "#0F172A" }}>
                        ${totalMonthlySpend.toLocaleString()} / mo
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.74rem", color: "#64748B" }}>Annualized Run-Rate: </span>
                      <strong style={{ fontSize: "1.05rem", color: "#4F46E5" }}>
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
          className="dashboard-modal-backdrop"
          onClick={() => setIsAddStackModalOpen(false)}
        >
          <div
            className="dashboard-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dashboard-modal-header">
              <h3 className="dashboard-modal-title">
                Add Software to Stack
              </h3>
              <button
                type="button"
                className="dashboard-modal-close-btn"
                onClick={() => setIsAddStackModalOpen(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStackItem}>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">
                  Software Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linear, Notion, AWS"
                  value={newStackName}
                  onChange={(e) => setNewStackName(e.target.value)}
                  className="dashboard-form-input"
                />
              </div>

              <div className="dashboard-form-group">
                <label className="dashboard-form-label">
                  Category
                </label>
                <select
                  value={newStackCategory}
                  onChange={(e) => setNewStackCategory(e.target.value)}
                  className="dashboard-form-select"
                >
                  <option value="Productivity">Productivity &amp; Docs</option>
                  <option value="CRM & Sales">CRM &amp; Sales</option>
                  <option value="Developer Tools">Developer Tools &amp; Cloud</option>
                  <option value="Design">Design &amp; UI</option>
                  <option value="HR & Payroll">HR &amp; Operations</option>
                  <option value="Cybersecurity">Cybersecurity &amp; Auth</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">
                    Active Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStackSeats}
                    onChange={(e) => setNewStackSeats(e.target.value)}
                    className="dashboard-form-input"
                  />
                </div>

                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">
                    Cost / Seat ($/mo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={newStackCost}
                    onChange={(e) => setNewStackCost(e.target.value)}
                    className="dashboard-form-input"
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsAddStackModalOpen(false)}
                  className="dashboard-action-btn-secondary"
                  style={{ flex: 1, justifyContent: "center", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dashboard-action-btn-primary"
                  style={{ flex: 1, justifyContent: "center", cursor: "pointer" }}
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
