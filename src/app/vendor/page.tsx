"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import {
  normalizeMarketplaceCategory,
  VendorSaaSListing,
  VENDOR_PRODUCTS_EVENT_KEY,
  VENDOR_PRODUCTS_STORAGE_KEY,
} from "@/utils/vendorProducts";

interface PurchaseInquiry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerWhatsapp: string;
  companyName: string;
  softwareName: string;
  purchaseType: "Direct Purchase" | "Enterprise License" | "Custom Quote" | "Volume Discount";
  teamSize: string;
  budgetOffer: string;
  inquiryDate: string;
  message: string;
  status: "New Request" | "Contacted" | "Quote Sent" | "Purchased";
}

const DEFAULT_VENDOR_LISTINGS: VendorSaaSListing[] = [
  {
    id: "prod-growthflow",
    name: "GrowthFlow AI",
    category: "Marketing",
    tagline: "Autonomous omnichannel AI marketing engine for high-velocity SaaS growth teams",
    price: 49,
    period: "mo",
    pricingModel: "Subscription",
    description: "Multi-channel lifecycle marketing automation platform with autonomous AI campaign drafting and native conversion attribution.",
    website: "https://growthflow.ai",
    brandColor: "#6366F1",
    brandLetter: "GF",
    features: ["Autonomous Email & SMS Sequences", "Predictive Churn Attribution", "Cross-Platform Cohort Tracking"],
    status: "Live & Active",
    inquiriesCount: 84,
    viewsCount: 4200,
    listedDate: "12 Oct 2025",
  },
  {
    id: "prod-manage360",
    name: "Manage360 Suite",
    category: "Project Management",
    tagline: "Unified sprint planning, velocity burndown telemetry, and team capacity orchestration",
    price: 79,
    period: "mo",
    pricingModel: "Subscription",
    description: "Enterprise agile delivery workspace consolidating Jira issues, GitHub pull requests, and automated product release documentation.",
    website: "https://manage360.io",
    brandColor: "#059669",
    brandLetter: "M3",
    features: ["Two-Way GitHub & GitLab Sync", "Interactive Multiplayer Gantt Charts", "Capacity & Workload Telemetry"],
    status: "Live & Active",
    inquiriesCount: 62,
    viewsCount: 3100,
    listedDate: "18 Nov 2025",
  },
  {
    id: "prod-taskflow",
    name: "TaskFlow Workspace",
    category: "Project Management",
    tagline: "Modern collaborative documentation and real-time multiplayer agile coordination",
    price: 29,
    period: "mo",
    pricingModel: "Subscription",
    description: "High-performance collaborative Kanban and project planning suite for modern remote engineering squads.",
    website: "https://taskflow.dev",
    brandColor: "#3B82F6",
    brandLetter: "TF",
    features: ["Sub-110ms Edge Collaboration", "SOC 2 Type II Certified", "Automated Sprint Burndowns"],
    status: "Live & Active",
    inquiriesCount: 45,
    viewsCount: 2800,
    listedDate: "05 Jan 2026",
  },
];

interface CompanyDocument {
  id: string;
  title: string;
  category: "Legal & Incorporation" | "Tax & Financial" | "Security & Compliance" | "Service Level Agreement";
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  status: "Verified" | "In Review" | "Action Required";
  verifiedBy: string;
}

interface ListingFormErrors {
  name?: string;
  tagline?: string;
  price?: string;
  website?: string;
}

export default function VendorPage() {
  const { user, loginAsRole, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState<"listings" | "purchase-requests" | "documents">("listings");
  const [vendorProducts, setVendorProducts] = useState<VendorSaaSListing[]>(DEFAULT_VENDOR_LISTINGS);
  const [listingSearch, setListingSearch] = useState("");
  const [listingCategoryFilter, setListingCategoryFilter] = useState("all");

  // New Listing Modal State
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [newListingName, setNewListingName] = useState("");
  const [newListingCategory, setNewListingCategory] = useState("Project Management");
  const [newListingTagline, setNewListingTagline] = useState("");
  const [newListingPrice, setNewListingPrice] = useState("");
  const [newListingPeriod, setNewListingPeriod] = useState("mo");
  const [newListingModel, setNewListingModel] = useState("Subscription");
  const [newListingDesc, setNewListingDesc] = useState("");
  const [newListingWebsite, setNewListingWebsite] = useState("");
  const [newListingFeatures, setNewListingFeatures] = useState([""]);
  const [listingFormErrors, setListingFormErrors] = useState<ListingFormErrors>({});
  const [isListingOptionalOpen, setIsListingOptionalOpen] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [inquiryFilter, setInquiryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInquiry, setSelectedInquiry] = useState<PurchaseInquiry | null>(null);

  // Document Upload Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState<CompanyDocument["category"]>("Legal & Incorporation");
  const [docFileName, setDocFileName] = useState("");

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const persistVendorProducts = (products: VendorSaaSListing[]): boolean => {
    try {
      localStorage.setItem(VENDOR_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(new CustomEvent(VENDOR_PRODUCTS_EVENT_KEY, { detail: products }));
      return true;
    } catch {
      showToast("We could not save that change. Free browser storage and try again.");
      return false;
    }
  };

  const resetListingForm = () => {
    setEditingListingId(null);
    setNewListingName("");
    setNewListingCategory("Project Management");
    setNewListingTagline("");
    setNewListingPrice("");
    setNewListingPeriod("mo");
    setNewListingModel("Subscription");
    setNewListingDesc("");
    setNewListingWebsite("");
    setNewListingFeatures([""]);
    setListingFormErrors({});
    setIsListingOptionalOpen(false);
  };

  const openCreateListing = () => {
    resetListingForm();
    setIsListingModalOpen(true);
  };

  const openEditListing = (listing: VendorSaaSListing) => {
    setEditingListingId(listing.id);
    setNewListingName(listing.name);
    setNewListingCategory(normalizeMarketplaceCategory(listing.category));
    setNewListingTagline(listing.tagline);
    setNewListingPrice(listing.price > 0 ? String(listing.price) : "");
    setNewListingPeriod(listing.period || "mo");
    setNewListingModel(listing.pricingModel || "Subscription");
    setNewListingDesc(listing.description || "");
    setNewListingWebsite(listing.website || "");
    setNewListingFeatures(listing.features.length > 0 ? listing.features : [""]);
    setListingFormErrors({});
    setIsListingOptionalOpen(Boolean(listing.description || listing.features.length > 0));
    setIsListingModalOpen(true);
  };

  const closeListingModal = () => {
    setIsListingModalOpen(false);
    resetListingForm();
  };

  // Load vendor listings from localStorage
  useEffect(() => {
    let frameId: number | null = null;
    const loadSavedListings = () => {
      try {
        const saved = localStorage.getItem(VENDOR_PRODUCTS_STORAGE_KEY);
        if (saved !== null) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            frameId = window.requestAnimationFrame(() => setVendorProducts(parsed as VendorSaaSListing[]));
          }
        }
      } catch {}
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === VENDOR_PRODUCTS_STORAGE_KEY) loadSavedListings();
    };

    loadSavedListings();
    window.addEventListener(VENDOR_PRODUCTS_EVENT_KEY, loadSavedListings);
    window.addEventListener("storage", handleStorage);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener(VENDOR_PRODUCTS_EVENT_KEY, loadSavedListings);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: ListingFormErrors = {};
    if (!newListingName.trim()) nextErrors.name = "Enter the product name buyers will recognize.";
    if (!newListingWebsite.trim()) {
      nextErrors.website = "Enter the website where buyers can learn about your product.";
    } else {
      try {
        const url = new URL(newListingWebsite.trim());
        if (url.protocol !== "http:" && url.protocol !== "https:") nextErrors.website = "Use a complete URL beginning with https://.";
      } catch {
        nextErrors.website = "Use a complete URL beginning with https://.";
      }
    }
    if (newListingTagline.trim().length < 20) nextErrors.tagline = "Describe your product in at least 20 characters.";
    if (newListingModel !== "Free" && (!(Number(newListingPrice) > 0) || !Number.isFinite(Number(newListingPrice)))) {
      nextErrors.price = "Enter a starting price greater than zero.";
    }
    setListingFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      window.setTimeout(() => document.querySelector<HTMLElement>(`[data-listing-field="${firstField}"]`)?.focus(), 0);
      return;
    }

    const brandLetters = newListingName.trim().slice(0, 2).toUpperCase();
    const cleanFeatures = newListingFeatures.map(f => f.trim()).filter(Boolean);

    const existingListing = editingListingId
      ? vendorProducts.find((listing) => listing.id === editingListingId)
      : undefined;
    const savedListing: VendorSaaSListing = {
      ...existingListing,
      id: existingListing?.id || `prod-${Date.now()}`,
      name: newListingName.trim(),
      category: newListingCategory,
      tagline: newListingTagline.trim(),
      price: newListingModel === "Free" ? 0 : Number(newListingPrice),
      period: newListingModel === "Subscription" ? newListingPeriod : "once",
      pricingModel: newListingModel,
      description: newListingDesc.trim() || newListingTagline.trim(),
      website: newListingWebsite.trim(),
      brandColor: "#6366F1",
      brandLetter: brandLetters,
      features: cleanFeatures,
      status: existingListing?.status || "Under Review",
      inquiriesCount: existingListing?.inquiriesCount || 0,
      viewsCount: existingListing?.viewsCount || 0,
      listedDate: existingListing?.listedDate || "Just now",
      deleted: false,
    };

    const updated = existingListing
      ? vendorProducts.map((listing) => listing.id === existingListing.id ? savedListing : listing)
      : [savedListing, ...vendorProducts];
    if (!persistVendorProducts(updated)) return;
    setVendorProducts(updated);
    setIsListingModalOpen(false);
    resetListingForm();
    showToast(existingListing
      ? `"${savedListing.name}" was updated successfully.`
      : `"${savedListing.name}" was submitted for marketplace review.`);
  };

  const handleToggleListingStatus = (id: string) => {
    const updated = vendorProducts.map((p) => {
      if (p.id === id) {
        const nextStatus = p.status === "Live & Active" ? "Paused" : "Live & Active";
        return { ...p, status: nextStatus as VendorSaaSListing["status"] };
      }
      return p;
    });
    if (!persistVendorProducts(updated)) return;
    setVendorProducts(updated);
    const changedListing = updated.find((listing) => listing.id === id);
    if (changedListing) showToast(`"${changedListing.name}" status changed to ${changedListing.status}.`);
  };

  const handleDeleteListing = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your active listings?`)) return;
    const updated = vendorProducts.map((listing) => (
      listing.id === id ? { ...listing, deleted: true, status: "Paused" as const } : listing
    ));
    if (!persistVendorProducts(updated)) return;
    setVendorProducts(updated);
    showToast(`"${name}" has been removed from your listings.`);
  };

  // List of users who want to contact the vendor to purchase software
  const [inquiries, setInquiries] = useState<PurchaseInquiry[]>([
    {
      id: "inq-101",
      buyerName: "Sarah Jenkins",
      buyerEmail: "sarah.j@finscale.ai",
      buyerPhone: "+1 (415) 890-2341",
      buyerWhatsapp: "14158902341",
      companyName: "FinScale AI",
      softwareName: "GrowthFlow AI",
      purchaseType: "Enterprise License",
      teamSize: "75 seats",
      budgetOffer: "$7,500 / year",
      inquiryDate: "Oct 11, 2026",
      message: "We need 75 enterprise seats for our product marketing team. Ready to purchase via corporate invoice or ACH transfer once SSO details are confirmed.",
      status: "New Request",
    },
    {
      id: "inq-102",
      buyerName: "David Vance",
      buyerEmail: "dvance@cloudcore.io",
      buyerPhone: "+1 (206) 555-8910",
      buyerWhatsapp: "12065558910",
      companyName: "CloudCore Systems",
      softwareName: "DevEdge Edge Cloud",
      purchaseType: "Direct Purchase",
      teamSize: "30 developers",
      budgetOffer: "$3,600 / year",
      inquiryDate: "Oct 10, 2026",
      message: "Looking to purchase 30 developer licenses immediately. Please send direct payment link and procurement order confirmation.",
      status: "Contacted",
    },
    {
      id: "inq-103",
      buyerName: "Elena Rostova",
      buyerEmail: "e.rostova@acuityhealth.org",
      buyerPhone: "+1 (617) 442-9901",
      buyerWhatsapp: "16174429901",
      companyName: "Acuity Healthtech",
      softwareName: "CloudSentinel AI",
      purchaseType: "Custom Quote",
      teamSize: "200+ employees",
      budgetOffer: "$14,400 / year",
      inquiryDate: "Oct 09, 2026",
      message: "Evaluating for hospital-wide cybersecurity compliance. Need HIPAA business associate agreement and multi-year volume pricing discount.",
      status: "Quote Sent",
    },
    {
      id: "inq-104",
      buyerName: "Marcus Vance",
      buyerEmail: "marcus@vanceretail.com",
      buyerPhone: "+1 (312) 771-4820",
      buyerWhatsapp: "13127714820",
      companyName: "Vance Retail Labs",
      softwareName: "GrowthFlow AI",
      purchaseType: "Direct Purchase",
      teamSize: "15 seats",
      budgetOffer: "$1,800 / year",
      inquiryDate: "Oct 07, 2026",
      message: "Confirmed purchase order approved by our CFO. Awaiting license key activation and onboarding setup documentation.",
      status: "Purchased",
    },
    {
      id: "inq-105",
      buyerName: "Amanda Brooks",
      buyerEmail: "abrooks@starlightfin.com",
      buyerPhone: "+1 (212) 330-9411",
      buyerWhatsapp: "12123309411",
      companyName: "Starlight Financial",
      softwareName: "DataPulse 2.0 Engine",
      purchaseType: "Volume Discount",
      teamSize: "50 seats",
      budgetOffer: "$6,000 / year",
      inquiryDate: "Oct 05, 2026",
      message: "We want to purchase DataPulse 2.0 for our quantitative trading research team. Can you provide a vendor W-9 and direct ACH payment details?",
      status: "Contacted",
    },
  ]);

  // Company Documents
  const [documents, setDocuments] = useState<CompanyDocument[]>([
    {
      id: "doc-1",
      title: "Certificate of Incorporation & Business Registration",
      category: "Legal & Incorporation",
      fileName: "saasmrkt_cert_of_incorporation_2024.pdf",
      fileSize: "2.4 MB",
      uploadedDate: "Aug 15, 2024",
      status: "Verified",
      verifiedBy: "SaaS MRKT Governance Team",
    },
    {
      id: "doc-2",
      title: "Corporate Tax ID & Form W-9 Verification",
      category: "Tax & Financial",
      fileName: "saasmrkt_tax_w9_form_2026.pdf",
      fileSize: "1.1 MB",
      uploadedDate: "Jan 10, 2026",
      status: "Verified",
      verifiedBy: "SaaS MRKT Finance & Compliance",
    },
    {
      id: "doc-3",
      title: "Vendor Marketplace Master Agreement",
      category: "Legal & Incorporation",
      fileName: "vendor_marketplace_master_agreement_signed.pdf",
      fileSize: "3.8 MB",
      uploadedDate: "Oct 01, 2024",
      status: "Verified",
      verifiedBy: "Legal Operations",
    },
    {
      id: "doc-4",
      title: "SOC-2 Type II Compliance & Security Audit Report",
      category: "Security & Compliance",
      fileName: "soc2_type2_security_audit_report.pdf",
      fileSize: "5.6 MB",
      uploadedDate: "May 20, 2026",
      status: "Verified",
      verifiedBy: "Third-Party Auditor (Kroll)",
    },
    {
      id: "doc-5",
      title: "Master Enterprise SLA & Uptime Guarantee Agreement (99.9%)",
      category: "Service Level Agreement",
      fileName: "saasmrkt_enterprise_sla_terms.pdf",
      fileSize: "1.8 MB",
      uploadedDate: "Sep 12, 2026",
      status: "Verified",
      verifiedBy: "SaaS MRKT Platform Ops",
    },
    {
      id: "doc-6",
      title: "Corporate Banking & Payout KYC Letter",
      category: "Tax & Financial",
      fileName: "chase_bank_kyc_verification_letter.pdf",
      fileSize: "920 KB",
      uploadedDate: "Oct 08, 2026",
      status: "In Review",
      verifiedBy: "Pending Admin Review",
    },
  ]);

  const handleUpdateInquiryStatus = (id: string, status: PurchaseInquiry["status"]) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    showToast(`Purchase request updated to: "${status}".`);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: CompanyDocument = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      category: docCategory,
      fileName: docFileName.trim() || `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.pdf`,
      fileSize: "1.4 MB",
      uploadedDate: "Today",
      status: "In Review",
      verifiedBy: "Pending Admin Verification",
    };

    setDocuments([newDoc, ...documents]);
    setIsDocModalOpen(false);
    setDocTitle("");
    setDocFileName("");
    showToast(`"${newDoc.title}" uploaded! Sent to compliance team for review.`);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    // Filter by status
    if (inquiryFilter === "new" && inq.status !== "New Request") return false;
    if (inquiryFilter === "contacted" && inq.status !== "Contacted" && inq.status !== "Quote Sent") return false;
    if (inquiryFilter === "purchased" && inq.status !== "Purchased") return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inq.buyerName.toLowerCase().includes(q) ||
        inq.buyerEmail.toLowerCase().includes(q) ||
        inq.softwareName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const visibleVendorProducts = vendorProducts.filter((product) => !product.deleted);
  const filteredVendorListings = visibleVendorProducts.filter((prod) => {
    if (listingCategoryFilter !== "all" && normalizeMarketplaceCategory(prod.category) !== listingCategoryFilter) return false;
    if (listingSearch.trim()) {
      const q = listingSearch.toLowerCase();
      const match =
        prod.name.toLowerCase().includes(q) ||
        prod.tagline.toLowerCase().includes(q) ||
        normalizeMarketplaceCategory(prod.category).toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (!isInitialized) {
    return (
      <PageLayout activeNav="sellers" noContainer>
        <div className="container" style={{ paddingTop: "6rem", paddingBottom: "8rem", textAlign: "center" }}>
          <div style={{ maxWidth: "460px", margin: "0 auto", padding: "3rem" }}>
            <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Loading Vendor Portal...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout activeNav="sellers" noContainer>
        <div className="container" style={{ paddingTop: "5rem", paddingBottom: "7rem", textAlign: "center" }}>
          <div style={{ maxWidth: "480px", margin: "0 auto", background: "#FFFFFF", padding: "2.75rem 2rem", borderRadius: "20px", border: "1px solid #E2E8F0", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.06)" }}>
            <div style={{ width: "62px", height: "62px", borderRadius: "50%", background: "#EFF6FF", color: "#3B82F6", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
              Vendor Sign In Required
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.92rem", lineHeight: 1.55, marginBottom: "1.75rem" }}>
              You are currently signed out. Please sign in to manage your SaaS listings, company legal documents, and software purchase inquiries.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => loginAsRole("vendor")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Sign In as Vendor (David Miller)
              </button>
              <Link href="/" className="btn-secondary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                Return to Marketplace
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const vendorName = (user?.name || "David Miller").replace(/\s*\(NexaSaaS\)/gi, "").trim();
  const vendorEmail = (user?.email || "vendor@saasmrkt.com").replace(/nexasaas\.io/gi, "saasmrkt.com");

  return (
    <PageLayout activeNav="sellers" noContainer>
      <div className="vendor-dashboard-wrapper">
        <div className="container">
          {/* Header Card */}
          <div className="vendor-header-card">
            <div className="vendor-header-top">
              <div className="vendor-title-col">
                <div className="vendor-badge-group">
                  <span className="vendor-partner-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Verified SaaS Vendor
                  </span>
                  <span className="vendor-zero-cut-tag">Direct Purchase Desk</span>
                </div>
                <h1 className="vendor-company-title">SaaS MRKT</h1>
                <p className="vendor-company-sub">
                  Signed in as <strong>{vendorName}</strong> ({vendorEmail}) &bull; Prospective Buyers Contact List &amp; Official Company Documents
                </p>
              </div>

              <div className="vendor-cta-col" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn-primary vendor-add-btn"
                  onClick={openCreateListing}
                  style={{
                    background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.7rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>List New SaaS Product</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary vendor-add-btn"
                  onClick={() => setIsDocModalOpen(true)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #CBD5E1",
                    color: "#334155",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.7rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Upload Document</span>
                </button>
              </div>
            </div>

            {/* 3 Metrics Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.25rem",
                marginTop: "1.75rem",
              }}
            >
              <div
                className="vendor-kpi-box"
                style={{
                  cursor: "pointer",
                  border: activeTab === "listings" ? "2px solid #4F46E5" : "1px solid #E2E8F0",
                  background: activeTab === "listings" ? "#EEF2FF" : "#F8FAFC",
                }}
                onClick={() => setActiveTab("listings")}
              >
                <div className="vendor-kpi-icon-wrap" style={{ background: "#E0E7FF", color: "#4F46E5", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div className="vendor-kpi-meta">
                  <span className="vendor-kpi-label">My SaaS Product Catalog</span>
                  <div className="vendor-kpi-val-row">
                    <span className="vendor-kpi-val">{visibleVendorProducts.length} Listings</span>
                    <span className="vendor-kpi-trend positive">
                      {visibleVendorProducts.filter(p => p.status === "Live & Active").length} Live
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="vendor-kpi-box"
                style={{
                  cursor: "pointer",
                  border: activeTab === "purchase-requests" ? "2px solid #3B82F6" : "1px solid #E2E8F0",
                  background: activeTab === "purchase-requests" ? "#F5F3FF" : "#F8FAFC",
                }}
                onClick={() => setActiveTab("purchase-requests")}
              >
                <div className="vendor-kpi-icon-wrap leads">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="vendor-kpi-meta">
                  <span className="vendor-kpi-label">Buyers Wanting to Purchase Software</span>
                  <div className="vendor-kpi-val-row">
                    <span className="vendor-kpi-val">{inquiries.length} Buyers</span>
                    <span className="vendor-kpi-trend positive">Active Purchase Contacts</span>
                  </div>
                </div>
              </div>

              <div
                className="vendor-kpi-box"
                style={{
                  cursor: "pointer",
                  border: activeTab === "documents" ? "2px solid #059669" : "1px solid #E2E8F0",
                  background: activeTab === "documents" ? "#ECFDF5" : "#F8FAFC",
                }}
                onClick={() => setActiveTab("documents")}
              >
                <div className="vendor-kpi-icon-wrap mrr">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="vendor-kpi-meta">
                  <span className="vendor-kpi-label">Official Company Documents</span>
                  <div className="vendor-kpi-val-row">
                    <span className="vendor-kpi-val">{documents.length} Documents</span>
                    <span className="vendor-kpi-trend positive">
                      {documents.filter((d) => d.status === "Verified").length} Verified ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {toastNotice && (
            <div className="vendor-alert-banner">
              <span>⚡</span>
              <span>{toastNotice}</span>
            </div>
          )}

          {/* Clean 3 Tabs Switcher */}
          <div className="vendor-tabs-bar">
            <button
              type="button"
              className={`vendor-tab-btn${activeTab === "listings" ? " active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>My SaaS Products &amp; Listings ({visibleVendorProducts.length})</span>
            </button>

            <button
              type="button"
              className={`vendor-tab-btn${activeTab === "purchase-requests" ? " active" : ""}`}
              onClick={() => setActiveTab("purchase-requests")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>User List Wanting to Purchase Software ({inquiries.length})</span>
            </button>

            <button
              type="button"
              className={`vendor-tab-btn${activeTab === "documents" ? " active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Company Documents &amp; Verification ({documents.length})</span>
            </button>
          </div>

          {/* =========================================================================
              VIEW 0: MY SAAS PRODUCTS & LISTINGS (SELLERS CAN LIST & MANAGE)
             ========================================================================= */}
          {activeTab === "listings" && (
            <div className="vendor-tab-content">
              {/* Search & Action Bar */}
              <div className="vendor-filter-row">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", flex: 1 }}>
                  {/* Search */}
                  <div style={{ position: "relative", minWidth: "260px" }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search listings by title, tagline or category..."
                      value={listingSearch}
                      onChange={(e) => setListingSearch(e.target.value)}
                      style={{
                        padding: "0.6rem 1rem 0.6rem 2.4rem",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.88rem",
                        width: "100%",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={listingCategoryFilter}
                    onChange={(e) => setListingCategoryFilter(e.target.value)}
                    style={{
                      padding: "0.6rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.88rem",
                      background: "#FFFFFF",
                      outline: "none",
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="Project Management">Project Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="CRM & Sales">CRM & Sales</option>
                    <option value="Accounting & Finance">Accounting &amp; Finance</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Security & Compliance">Security & Compliance</option>
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Analytics & BI">Analytics & BI</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={openCreateListing}
                    style={{
                      background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.65rem 1.25rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>+ List New SaaS Product</span>
                  </button>

                  <Link
                    href="/submit-product"
                    style={{
                      background: "#F1F5F9",
                      color: "#334155",
                      border: "1px solid #E2E8F0",
                      padding: "0.65rem 1rem",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      textDecoration: "none",
                    }}
                  >
                    Full Onboarding Form
                  </Link>
                </div>
              </div>

              {/* Product Listings Grid/Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredVendorListings.length === 0 ? (
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px dashed #CBD5E1",
                      borderRadius: "16px",
                      padding: "3.5rem 2rem",
                      textAlign: "center",
                      color: "#64748B",
                    }}
                  >
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>
                      No SaaS listings found
                    </p>
                    <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                      You haven&apos;t added any software matching your filters yet.
                    </p>
                    <button
                      type="button"
                      onClick={openCreateListing}
                      style={{
                        background: "#4F46E5",
                        color: "#ffffff",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "10px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      + Create Your First SaaS Listing
                    </button>
                  </div>
                ) : (
                  filteredVendorListings.map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1.5rem",
                        flexWrap: "wrap",
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", flex: 1, minWidth: "300px" }}>
                        {/* Brand Icon */}
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "14px",
                            background: prod.brandColor || "#6366F1",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            flexShrink: 0,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                          }}
                        >
                          {prod.brandLetter || prod.name.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Title & Details */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>
                              {prod.name}
                            </h3>
                            <span
                              style={{
                                background: "#F1F5F9",
                                color: "#475569",
                                padding: "0.2rem 0.65rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            >
                              {normalizeMarketplaceCategory(prod.category)}
                            </span>
                            <span
                              style={{
                                background: prod.status === "Live & Active" ? "#ECFDF5" : "#FEF3C7",
                                color: prod.status === "Live & Active" ? "#059669" : "#D97706",
                                padding: "0.2rem 0.65rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: prod.status === "Live & Active" ? "#10B981" : "#F59E0B" }} />
                              {prod.status}
                            </span>
                          </div>

                          <p style={{ margin: "0 0 0.65rem", color: "#64748B", fontSize: "0.88rem", lineHeight: 1.45 }}>
                            {prod.tagline}
                          </p>

                          {/* Features Pills */}
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {prod.features.slice(0, 3).map((feat, fi) => (
                              <span
                                key={fi}
                                style={{
                                  background: "#F8FAFC",
                                  border: "1px solid #E2E8F0",
                                  color: "#334155",
                                  fontSize: "0.76rem",
                                  padding: "0.15rem 0.55rem",
                                  borderRadius: "6px",
                                }}
                              >
                                ✓ {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Telemetry */}
                      <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                        <div style={{ textAlign: "right", minWidth: "110px" }}>
                          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A" }}>
                            ${prod.price}
                            <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#64748B" }}>/{prod.period}</span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#64748B", textTransform: "uppercase", fontWeight: 600 }}>
                            {prod.pricingModel}
                          </div>
                        </div>

                        <div style={{ borderLeft: "1px solid #E2E8F0", paddingLeft: "1.25rem", textAlign: "left" }}>
                          <div style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 700 }}>
                            {prod.inquiriesCount || 0} Inquiries
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                            {(prod.viewsCount || 0).toLocaleString()} Buyer Views
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => openEditListing(prod)}
                            style={{
                              background: "#EEF2FF",
                              border: "1px solid #C7D2FE",
                              color: "#4F46E5",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>

                          <Link
                            href={`/products/${prod.id}`}
                            style={{
                              background: "#F8FAFC",
                              border: "1px solid #CBD5E1",
                              color: "#334155",
                              padding: "0.5rem 0.85rem",
                              borderRadius: "8px",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <span>Live Page</span>
                            <span>↗</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggleListingStatus(prod.id)}
                            style={{
                              background: "#FFFFFF",
                              border: "1px solid #CBD5E1",
                              color: prod.status === "Live & Active" ? "#D97706" : "#059669",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {prod.status === "Live & Active" ? "Pause" : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteListing(prod.id, prod.name)}
                            style={{
                              background: "#FEE2E2",
                              border: "none",
                              color: "#DC2626",
                              padding: "0.5rem 0.65rem",
                              borderRadius: "8px",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                            title="Delete listing"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: USER LIST WHO WANT TO CONTACT VENDORS FOR PURCHASING SOFTWARE
             ========================================================================= */}
          {activeTab === "purchase-requests" && (
            <div className="vendor-tab-content">
              {/* Search & Filter Header */}
              <div className="vendor-filter-row">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", flex: 1 }}>
                  {/* Search input */}
                  <div style={{ position: "relative", minWidth: "260px" }}>
                    <input
                      type="text"
                      placeholder="Search buyer name, software..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        padding: "0.55rem 0.85rem 0.55rem 2.2rem",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.85rem",
                        width: "100%",
                        outline: "none",
                      }}
                    />
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                      style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>

                  {/* Filter Pills */}
                  <div className="vendor-filter-tabs">
                    <button
                      type="button"
                      className={`vendor-subfilter-btn${inquiryFilter === "all" ? " active" : ""}`}
                      onClick={() => setInquiryFilter("all")}
                    >
                      All ({inquiries.length})
                    </button>
                    <button
                      type="button"
                      className={`vendor-subfilter-btn${inquiryFilter === "new" ? " active" : ""}`}
                      onClick={() => setInquiryFilter("new")}
                    >
                      New Requests ({inquiries.filter((i) => i.status === "New Request").length})
                    </button>
                    <button
                      type="button"
                      className={`vendor-subfilter-btn${inquiryFilter === "contacted" ? " active" : ""}`}
                      onClick={() => setInquiryFilter("contacted")}
                    >
                      In Discussion ({inquiries.filter((i) => i.status === "Contacted" || i.status === "Quote Sent").length})
                    </button>
                    <button
                      type="button"
                      className={`vendor-subfilter-btn${inquiryFilter === "purchased" ? " active" : ""}`}
                      onClick={() => setInquiryFilter("purchased")}
                    >
                      Purchased ({inquiries.filter((i) => i.status === "Purchased").length})
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => showToast("Exporting buyer contact list (.csv)...")}
                >
                  Export Contact List (.csv)
                </button>
              </div>

              {/* Purchase Inquiries Table */}
              <div className="vendor-table-card">
                <div className="vendor-table-header">
                  <div>
                    <h2 className="profile-section-title">Prospective Buyers Inquiring to Purchase Software</h2>
                    <p className="profile-section-desc">
                      Verified enterprise buyers and teams requesting license purchases, custom contracts, and direct software quotes.
                    </p>
                  </div>
                </div>

                {filteredInquiries.length === 0 ? (
                  <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
                    <p style={{ fontSize: "1rem", fontWeight: 600 }}>No purchase requests match your filter.</p>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ marginTop: "0.5rem" }}
                      onClick={() => {
                        setInquiryFilter("all");
                        setSearchQuery("");
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="vendor-table-wrap">
                    <table className="vendor-data-table">
                      <thead>
                        <tr>
                          <th>Buyer Name</th>
                          <th>WhatsApp Number</th>
                          <th>Software to Purchase</th>
                          <th>Purchase Type</th>
                          <th>Inquiry Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInquiries.map((inq) => (
                          <tr key={inq.id}>
                            <td>
                              <strong style={{ fontSize: "0.95rem", color: "#0F172A" }}>{inq.buyerName}</strong>
                            </td>
                            <td>
                              <a
                                href={`https://wa.me/${inq.buyerWhatsapp}?text=${encodeURIComponent(`Hello ${inq.buyerName}, I am contacting you from SaaS MRKT regarding your purchase inquiry for ${inq.softwareName}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.4rem",
                                  color: "#059669",
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                  textDecoration: "none",
                                  padding: "0.3rem 0.65rem",
                                  background: "#ECFDF5",
                                  borderRadius: "8px",
                                  border: "1px solid #A7F3D0",
                                }}
                                title="Chat on WhatsApp"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                {inq.buyerPhone}
                              </a>
                            </td>
                            <td>
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <strong style={{ color: "#0F172A", fontSize: "0.95rem" }}>{inq.softwareName}</strong>
                                <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600 }}>Ready to Purchase</span>
                              </div>
                            </td>
                            <td>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "0.25rem 0.6rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  background: "#EEF2FF",
                                  color: "#4F46E5",
                                }}
                              >
                                {inq.purchaseType}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.85rem", color: "#475569" }}>{inq.inquiryDate}</span>
                            </td>
                            <td>
                              <span
                                className={`lead-status-pill ${
                                  inq.status === "Purchased"
                                    ? "contacted"
                                    : inq.status === "New Request"
                                    ? "new"
                                    : "demo-scheduled"
                                }`}
                              >
                                {inq.status}
                              </span>
                            </td>
                            <td>
                              <div className="vendor-action-cell">
                                <button
                                  type="button"
                                  className="vendor-btn-small primary"
                                  onClick={() => setSelectedInquiry(inq)}
                                >
                                  View Details
                                </button>
                                <a
                                  href={`https://wa.me/${inq.buyerWhatsapp}?text=${encodeURIComponent(
                                    `Hello ${inq.buyerName}, I'm reaching out from SaaS MRKT regarding your purchase inquiry for ${inq.softwareName} (${inq.purchaseType}). Are you ready to proceed?`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="vendor-btn-small"
                                  style={{
                                    background: "#25D366",
                                    color: "#FFFFFF",
                                    borderColor: "#25D366",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                  </svg>
                                  WhatsApp
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: COMPANY DOCUMENTS & VERIFICATION
             ========================================================================= */}
          {activeTab === "documents" && (
            <div className="vendor-tab-content">
              <div className="vendor-table-card">
                <div className="vendor-table-header">
                  <div>
                    <h2 className="profile-section-title">Official Vendor &amp; Company Documents</h2>
                    <p className="profile-section-desc">
                      Verified legal, tax, compliance, and SLA documentation certifying your vendor credentials on SaaS MRKT.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setIsDocModalOpen(true)}
                  >
                    + Upload New Document
                  </button>
                </div>

                <div className="vendor-table-wrap">
                  <table className="vendor-data-table">
                    <thead>
                      <tr>
                        <th>Document Title &amp; File</th>
                        <th>Category</th>
                        <th>File Size</th>
                        <th>Uploaded Date</th>
                        <th>Verification Status</th>
                        <th>Verified By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "8px",
                                  background: "#EEF2FF",
                                  color: "#4F46E5",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <div>
                                <strong style={{ display: "block", fontSize: "0.9rem", color: "#0F172A" }}>
                                  {doc.title}
                                </strong>
                                <span style={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "monospace" }}>
                                  {doc.fileName}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                background: "#F1F5F9",
                                color: "#475569",
                              }}
                            >
                              {doc.category}
                            </span>
                          </td>
                          <td>{doc.fileSize}</td>
                          <td>{doc.uploadedDate}</td>
                          <td>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.2rem 0.55rem",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                background: doc.status === "Verified" ? "#ECFDF5" : "#FFFBEB",
                                color: doc.status === "Verified" ? "#059669" : "#D97706",
                              }}
                            >
                              {doc.status === "Verified" ? "✓ Verified" : "⏳ In Review"}
                            </span>
                          </td>
                          <td>
                            <small style={{ color: "#64748B" }}>{doc.verifiedBy}</small>
                          </td>
                          <td>
                            <div className="vendor-action-cell">
                              <button
                                type="button"
                                className="vendor-btn-small"
                                onClick={() => showToast(`Opening preview of "${doc.fileName}"...`)}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="vendor-btn-small primary"
                                onClick={() => showToast(`Downloading "${doc.fileName}"...`)}
                              >
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL: VIEW BUYER MESSAGE & PURCHASE DETAILS
         ========================================================================= */}
      {selectedInquiry && (
        <div className="modal-backdrop" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-container vendor-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="vendor-modal-header">
              <div>
                <h2 className="vendor-modal-title">Buyer Software Purchase Request</h2>
                <p className="vendor-modal-sub">
                  From <strong>{selectedInquiry.buyerName}</strong>
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedInquiry(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  background: "#F8FAFC",
                  padding: "1rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                }}
              >
                <div>
                  <span style={{ color: "#64748B", display: "block" }}>Target Software:</span>
                  <strong style={{ color: "#0F172A", fontSize: "1rem" }}>{selectedInquiry.softwareName}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748B", display: "block" }}>Purchase Type:</span>
                  <strong style={{ color: "#4F46E5" }}>{selectedInquiry.purchaseType}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748B", display: "block" }}>WhatsApp Number:</span>
                  <a
                    href={`https://wa.me/${selectedInquiry.buyerWhatsapp}?text=${encodeURIComponent(
                      `Hello ${selectedInquiry.buyerName}, reaching out regarding your purchase inquiry for ${selectedInquiry.softwareName} on SaaS MRKT.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#059669",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      textDecoration: "none",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    {selectedInquiry.buyerPhone} (Direct WhatsApp)
                  </a>
                </div>
                <div>
                  <span style={{ color: "#64748B", display: "block" }}>Buyer Email:</span>
                  <span style={{ color: "#0F172A", fontWeight: 600 }}>{selectedInquiry.buyerEmail}</span>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                  Message &amp; Purchase Specifications from Buyer:
                </label>
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "1rem",
                    fontSize: "0.9rem",
                    color: "#334155",
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;{selectedInquiry.message}&rdquo;
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                  Update Order / Contact Status:
                </label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="vendor-btn-small"
                    onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, "Contacted")}
                  >
                    Mark as Contacted
                  </button>
                  <button
                    type="button"
                    className="vendor-btn-small"
                    onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, "Quote Sent")}
                  >
                    Mark Quote Sent
                  </button>
                  <button
                    type="button"
                    className="vendor-btn-small primary"
                    onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, "Purchased")}
                  >
                    Mark Purchased &amp; Won ✓
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href={`https://wa.me/${selectedInquiry.buyerWhatsapp}?text=${encodeURIComponent(
                  `Hello ${selectedInquiry.buyerName}, I'm reaching out from SaaS MRKT regarding your purchase inquiry for ${selectedInquiry.softwareName} (${selectedInquiry.purchaseType}). Let's discuss your deployment and license activation!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 1.5rem",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat with Buyer on WhatsApp</span>
              </a>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: UPLOAD COMPANY DOCUMENT
         ========================================================================= */}
      {isDocModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDocModalOpen(false)}>
          <div className="modal-container vendor-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="vendor-modal-header">
              <div>
                <h2 className="vendor-modal-title">Upload Company Document</h2>
                <p className="vendor-modal-sub">Upload corporate legal, tax, or compliance verification certificates.</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsDocModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="vendor-modal-form">
              <div className="form-group">
                <label htmlFor="doc-title-input">Document Title *</label>
                <input
                  id="doc-title-input"
                  type="text"
                  placeholder="e.g. ISO 27001 Security Audit Certificate"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="doc-cat-select">Document Category</label>
                <select
                  id="doc-cat-select"
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as CompanyDocument["category"])}
                >
                  <option value="Legal & Incorporation">Legal &amp; Incorporation</option>
                  <option value="Tax & Financial">Tax &amp; Financial</option>
                  <option value="Security & Compliance">Security &amp; Compliance</option>
                  <option value="Service Level Agreement">Service Level Agreement</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="doc-file-input">PDF File Name</label>
                <input
                  id="doc-file-input"
                  type="text"
                  placeholder="e.g. iso_27001_certificate_2026.pdf"
                  value={docFileName}
                  onChange={(e) => setDocFileName(e.target.value)}
                />
              </div>

              <div
                style={{
                  border: "2px dashed #CBD5E1",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  textAlign: "center",
                  background: "#F8FAFC",
                  color: "#64748B",
                  fontSize: "0.85rem",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.5rem" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <strong style={{ display: "block", color: "#334155" }}>Click or drag PDF document to attach</strong>
                <span>Supports PDF, DOCX up to 25 MB</span>
              </div>

              <div className="vendor-modal-actions">
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  Submit Document for Verification
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: "100%" }}
                  onClick={() => setIsDocModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE NEW SAAS PRODUCT LISTING
         ========================================================================= */}
      {isListingModalOpen && (
        <div className="modal-backdrop" onClick={closeListingModal}>
          <div
            aria-labelledby="vendor-listing-title"
            aria-modal="true"
            className="modal-container vendor-modal-box vendor-listing-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="vendor-modal-header">
              <div>
                <p className="vendor-listing-kicker">{editingListingId ? "Update marketplace listing" : "New marketplace listing"}</p>
                <h2 className="vendor-modal-title" id="vendor-listing-title">{editingListingId ? "Edit SaaS product" : "Add a SaaS product"}</h2>
                <p className="vendor-modal-sub">{editingListingId ? "Update the listing details buyers see across the marketplace." : "Start with the essentials. You can add advanced details after approval."}</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close product listing form"
                onClick={closeListingModal}
              >
                ✕
              </button>
            </div>

            <form className="vendor-modal-form" noValidate onSubmit={handleCreateListing}>
              {Object.keys(listingFormErrors).length > 0 && (
                <div className="vendor-listing-error-summary" role="alert">
                  <strong>Please check the highlighted fields.</strong>
                  <span>Your other information is still here.</span>
                </div>
              )}

              <div className="vendor-listing-fields">
                <div className="vendor-listing-grid vendor-listing-grid--two">
                  <div className="form-group">
                    <label htmlFor="listing-name">Product name <span className="vendor-required">*</span></label>
                    <input
                      id="listing-name"
                      data-listing-field="name"
                      type="text"
                      placeholder="e.g. TaskFlow"
                      value={newListingName}
                      aria-invalid={Boolean(listingFormErrors.name)}
                      onChange={(e) => { setNewListingName(e.target.value); setListingFormErrors((errors) => ({ ...errors, name: undefined })); }}
                    />
                    {listingFormErrors.name && <small className="vendor-field-error">{listingFormErrors.name}</small>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="listing-cat">Primary category <span className="vendor-required">*</span></label>
                    <select
                      id="listing-cat"
                      value={newListingCategory}
                      onChange={(e) => setNewListingCategory(e.target.value)}
                    >
                      <option value="Project Management">Project Management</option>
                      <option value="Marketing">Marketing</option>
                      <option value="CRM & Sales">CRM & Sales</option>
                      <option value="Accounting & Finance">Accounting &amp; Finance</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Security & Compliance">Security & Compliance</option>
                      <option value="Developer Tools">Developer Tools</option>
                      <option value="Analytics & BI">Analytics & BI</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="listing-web">Product website <span className="vendor-required">*</span></label>
                  <input
                    id="listing-web"
                    data-listing-field="website"
                    type="url"
                    placeholder="https://yourproduct.com"
                    value={newListingWebsite}
                    aria-invalid={Boolean(listingFormErrors.website)}
                    onChange={(e) => { setNewListingWebsite(e.target.value); setListingFormErrors((errors) => ({ ...errors, website: undefined })); }}
                  />
                  {listingFormErrors.website && <small className="vendor-field-error">{listingFormErrors.website}</small>}
                </div>

                <div className="form-group">
                  <label htmlFor="listing-tagline">Short description <span className="vendor-required">*</span></label>
                  <textarea
                    id="listing-tagline"
                    data-listing-field="tagline"
                    rows={2}
                    maxLength={200}
                    placeholder="What does your product do, who is it for, and what result does it deliver?"
                    value={newListingTagline}
                    aria-invalid={Boolean(listingFormErrors.tagline)}
                    onChange={(e) => { setNewListingTagline(e.target.value); setListingFormErrors((errors) => ({ ...errors, tagline: undefined })); }}
                  />
                  <small className={listingFormErrors.tagline ? "vendor-field-error" : "vendor-field-help"}>{listingFormErrors.tagline || "Keep it to one or two clear sentences."}</small>
                </div>

                <div className="vendor-listing-grid vendor-listing-grid--pricing">
                  <div className="form-group">
                    <label htmlFor="listing-model">Pricing <span className="vendor-required">*</span></label>
                    <select
                      id="listing-model"
                      value={newListingModel}
                      onChange={(e) => {
                        const model = e.target.value;
                        setNewListingModel(model);
                        if (model === "Free") {
                          setNewListingPrice("");
                          setListingFormErrors((errors) => ({ ...errors, price: undefined }));
                        }
                      }}
                    >
                      <option value="Subscription">Recurring subscription</option>
                      <option value="One-time purchase">One-time purchase</option>
                      <option value="Free">Free</option>
                    </select>
                  </div>

                  {newListingModel !== "Free" && (
                    <div className="form-group">
                      <label htmlFor="listing-price">Starting price in USD <span className="vendor-required">*</span></label>
                      <input
                        id="listing-price"
                        data-listing-field="price"
                        type="number"
                        min="1"
                        inputMode="decimal"
                        placeholder="e.g. 29"
                        value={newListingPrice}
                        aria-invalid={Boolean(listingFormErrors.price)}
                        onChange={(e) => { setNewListingPrice(e.target.value); setListingFormErrors((errors) => ({ ...errors, price: undefined })); }}
                      />
                      {listingFormErrors.price && <small className="vendor-field-error">{listingFormErrors.price}</small>}
                    </div>
                  )}
                </div>
              </div>

              <details className="vendor-listing-optional" open={isListingOptionalOpen} onToggle={(event) => setIsListingOptionalOpen(event.currentTarget.open)}>
                <summary><span>Optional details</span><small>Billing, detailed description and benefits</small></summary>
                <div className="vendor-listing-optional-body">
                {newListingModel === "Subscription" && <div className="form-group">
                  <label htmlFor="listing-period">Billing frequency <span className="vendor-optional-label">Optional</span></label>
                  <select
                    id="listing-period"
                    value={newListingPeriod}
                    onChange={(e) => setNewListingPeriod(e.target.value)}
                  >
                    <option value="mo">Per month</option>
                    <option value="yr">Per year</option>
                  </select>
                </div>}

                <div className="form-group">
                  <label htmlFor="listing-desc">Detailed description <span className="vendor-optional-label">Optional</span></label>
                  <textarea
                    id="listing-desc"
                    rows={4}
                    maxLength={500}
                    placeholder="Add more detail about the problem, ideal customer, and key differentiators."
                    value={newListingDesc}
                    onChange={(e) => setNewListingDesc(e.target.value)}
                  />
                  <small className="vendor-field-help">{newListingDesc.length}/500 · You can add or revise this after approval.</small>
                </div>

              <div className="form-group">
                <label>Key benefits <span className="vendor-optional-label">Optional · up to 3</span></label>
                <p className="vendor-field-intro">Use short, outcome-focused phrases. You can expand this list later.</p>
                <div className="vendor-benefit-list">
                  {newListingFeatures.map((feature, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={idx === 0 ? "e.g. Build weekly reports in minutes" : `Benefit ${idx + 1}`}
                      value={feature}
                      onChange={(e) => {
                        const updated = [...newListingFeatures];
                        updated[idx] = e.target.value;
                        setNewListingFeatures(updated);
                      }}
                    />
                  ))}
                </div>
                {newListingFeatures.length < 3 && <button type="button" className="vendor-add-benefit" onClick={() => setNewListingFeatures((features) => [...features, ""])}>+ Add another benefit</button>}
              </div>
                </div>
              </details>

              <div className="vendor-modal-actions">
                <button type="button" className="btn-secondary" onClick={closeListingModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingListingId ? "Save changes" : "Submit for review"} <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
