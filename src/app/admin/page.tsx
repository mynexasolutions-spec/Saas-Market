"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { FEATURED_PRODUCTS_LIST, ProductItem } from "@/components/FeaturedProducts";

// ============================================================================
// Types
// ============================================================================
interface VendorDocument {
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

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "Buyer" | "Vendor" | "Admin";
  status: "Active" | "Verified" | "Suspended";
  joinedDate: string;
  company?: string;
}

interface VendorProject {
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

interface VendorCatalogProduct {
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

// Initial verified products uploaded exclusively by vendors
const VENDOR_UPLOADED_PRODUCTS: VendorCatalogProduct[] = [
  {
    id: "prod-manage360",
    name: "Manage360",
    vendor: "CloudCore HR (David Miller)",
    vendorEmail: "vendor@saasmrkt.com",
    category: "HR & Payroll",
    rating: 4.8,
    reviewCount: 3200,
    description: "Complete HRMS for modern teams with payroll, attendance and more.",
    image: "/images/manage360.jpg",
    price: 29,
    period: "mo",
    brandColor: "#2563EB",
    brandLetter: "M",
    topBadge: "Top Rated",
    tags: ["HRMS", "Payroll"],
    features: [
      "Automated tax filings and payroll calculations",
      "Biometric and remote attendance tracking",
      "Employee self-service mobile portal",
    ],
    uploadedDate: "Aug 12, 2024",
  },
  {
    id: "prod-taskflow",
    name: "TaskFlow",
    vendor: "Workflow Systems (Liam Scott)",
    vendorEmail: "contact@workflow.co",
    category: "Project Management",
    rating: 4.9,
    reviewCount: 5100,
    description: "All-in-one workspace for notes, docs, sprints and task management.",
    image: "/images/taskflow.jpg",
    price: 19,
    period: "mo",
    brandColor: "#6366F1",
    brandLetter: "T",
    topBadge: "Top Rated",
    tags: ["Productivity", "Collaboration"],
    features: [
      "Flexible Kanban, Gantt, and Sprint workflows",
      "Real-time team chat and document sharing",
      "Over 100+ automation templates",
    ],
    uploadedDate: "Sep 04, 2024",
  },
  {
    id: "prod-finmate",
    name: "FinMate",
    vendor: "FinScale AI (Sarah Jenkins)",
    vendorEmail: "sarah.j@finscale.ai",
    category: "Accounting & Finance",
    rating: 4.7,
    reviewCount: 1800,
    description: "Simple and powerful accounting and reconciliation for growing companies.",
    image: "/images/finmate.jpg",
    price: 35,
    period: "mo",
    brandColor: "#10B981",
    brandLetter: "F",
    topBadge: "Trending",
    tags: ["Accounting", "Finance"],
    features: [
      "Smart multi-currency invoice generation",
      "Automated bank feed reconciliation",
      "Built-in recurring subscription billing",
    ],
    uploadedDate: "Jul 19, 2024",
  },
  {
    id: "prod-mailboost",
    name: "MailBoost",
    vendor: "EmailOps Lab (Rachel Green)",
    vendorEmail: "rachel@ralphops.com",
    category: "Marketing",
    rating: 4.6,
    reviewCount: 1500,
    description: "All-in-one email marketing, behavioral flows and lifecycle automation.",
    image: "/images/mailboost.jpg",
    price: 25,
    period: "mo",
    brandColor: "#F97316",
    brandLetter: "M",
    topBadge: "Popular",
    tags: ["Marketing", "Email Ops"],
    features: [
      "Drag-and-drop responsive email builder",
      "Behavioral segmentation and triggers",
      "Detailed open-rate and CTR heatmaps",
    ],
    uploadedDate: "Jun 11, 2024",
  },
  {
    id: "prod-supportly",
    name: "Supportly",
    vendor: "SupportDesk AI (Elena Rostova)",
    vendorEmail: "e.rostova@acuityhealth.org",
    category: "Customer Support",
    rating: 4.8,
    reviewCount: 2400,
    description: "Provide amazing customer support with omnichannel AI assistance.",
    image: "/images/supportly.jpg",
    price: 45,
    period: "mo",
    brandColor: "#8B5CF6",
    brandLetter: "S",
    topBadge: "Top Rated",
    tags: ["Support", "Helpdesk"],
    features: [
      "Omnichannel inbox (email, live chat, social)",
      "Automated AI ticket categorization and SLA alerts",
      "Self-service knowledge base builder",
    ],
    uploadedDate: "May 25, 2024",
  },
  {
    id: "prod-dealflow",
    name: "DealFlow",
    vendor: "Pipeline Dynamics (Marcus Vance)",
    vendorEmail: "marcus@vanceretail.com",
    category: "CRM & Sales",
    rating: 4.9,
    reviewCount: 4200,
    description: "Close deals faster with intelligent predictive sales CRM pipelines.",
    image: "/images/dealflow.jpg",
    price: 39,
    period: "mo",
    brandColor: "#EF4444",
    brandLetter: "D",
    topBadge: "Verified",
    tags: ["CRM & Sales", "Pipelines"],
    features: [
      "Visual sales pipeline with drag-and-drop deals",
      "Automated email sequences & smart follow-ups",
      "Real-time revenue forecast analytics",
    ],
    uploadedDate: "Apr 08, 2024",
  },
  {
    id: "prod-datapulse",
    name: "DataPulse 2.0 Engine",
    vendor: "SaaS MRKT Solutions (David Miller)",
    vendorEmail: "vendor@saasmrkt.com",
    category: "Analytics & BI",
    rating: 4.9,
    reviewCount: 380,
    description: "Real-time analytics engine and embedded telemetry dashboards for enterprise SaaS.",
    image: "/images/manage360.jpg",
    price: 180,
    period: "mo",
    brandColor: "#059669",
    brandLetter: "D",
    topBadge: "New Upload",
    tags: ["Analytics", "Business Intelligence"],
    features: [
      "Sub-second SQL queries across petabyte databases",
      "Automated executive dashboard exports and slack alerts",
      "Enterprise SOC-2 Type II audit passed",
    ],
    uploadedDate: "Oct 11, 2026",
  },
  {
    id: "prod-omnichat",
    name: "OmniChat Support AI",
    vendor: "OmniSystems Labs (Alex Carter)",
    vendorEmail: "ops@omnisystems.io",
    category: "Customer Support",
    rating: 4.8,
    reviewCount: 290,
    description: "Autonomous LLM support bot that resolves 70% of buyer questions instantly.",
    image: "/images/supportly.jpg",
    price: 79,
    period: "mo",
    brandColor: "#3B82F6",
    brandLetter: "O",
    topBadge: "New Upload",
    tags: ["Customer Support", "AI Bot"],
    features: [
      "Trained on your custom API docs & knowledge base",
      "Human escalation handoff with full conversational context",
      "Zero-latency response webhook",
    ],
    uploadedDate: "Oct 10, 2026",
  },
  {
    id: "prod-kubescape",
    name: "Kubescape Orchestrator",
    vendor: "KubeLabs Cloud (DevOps Tech)",
    vendorEmail: "devops@kubelabs.tech",
    category: "DevOps & Cloud",
    rating: 4.9,
    reviewCount: 410,
    description: "Automated Kubernetes cluster cost-optimization and vulnerability hardening.",
    image: "/images/taskflow.jpg",
    price: 210,
    period: "mo",
    brandColor: "#6366F1",
    brandLetter: "K",
    topBadge: "Enterprise",
    tags: ["DevOps", "Kubernetes", "Cloud"],
    features: [
      "Automatically eliminates 40% of idle AWS/GCP nodes",
      "Real-time continuous CIS benchmark scanning",
      "Multi-cluster single pane of glass dashboard",
    ],
    uploadedDate: "Oct 09, 2026",
  },
  {
    id: "prod-growthflow",
    name: "GrowthFlow AI",
    vendor: "FinScale AI (Sarah Jenkins)",
    vendorEmail: "sarah.j@finscale.ai",
    category: "Marketing & Growth",
    rating: 4.8,
    reviewCount: 1400,
    description: "AI-powered product marketing and customer acquisition attribution suite.",
    image: "/images/dealflow.jpg",
    price: 120,
    period: "mo",
    brandColor: "#8B5CF6",
    brandLetter: "G",
    topBadge: "Trending",
    tags: ["Marketing", "Growth", "Analytics"],
    features: [
      "Multi-touch conversion attribution models",
      "Automated landing page optimization bot",
      "Integrates with HubSpot, Salesforce, and Stripe",
    ],
    uploadedDate: "Oct 05, 2026",
  },
];

// ============================================================================
// Main Admin Page Component
// ============================================================================
export default function AdminPage() {
  const { user, loginAsRole, openAuth, isInitialized } = useAuth();
  
  // 4 Core Admin Tabs per specification:
  // 1. "documents" -> Approve Vendor Documents
  // 2. "projects"  -> Remove / Moderate Vendor Projects
  // 3. "users"     -> Remove Users and Vendors
  // 4. "home"      -> Select Vendor-Uploaded Products to Show on Home Page
  const [activeTab, setActiveTab] = useState<"documents" | "projects" | "users" | "home">("documents");
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // 1. Vendor Documents State (Admin approves vendor documents)
  // --------------------------------------------------------------------------
  const [documents, setDocuments] = useState<VendorDocument[]>([
    {
      id: "doc-1",
      title: "Certificate of Incorporation & Corporate Registration",
      vendorName: "David Miller",
      vendorEmail: "vendor@saasmrkt.com",
      category: "Legal & Incorporation",
      fileName: "saasmrkt_cert_of_incorporation_2026.pdf",
      fileSize: "2.4 MB",
      uploadedDate: "Oct 11, 2026",
      status: "Pending Approval",
    },
    {
      id: "doc-2",
      title: "Corporate Tax ID & Form W-9 Verification",
      vendorName: "David Miller",
      vendorEmail: "vendor@saasmrkt.com",
      category: "Tax & Financial",
      fileName: "saasmrkt_tax_w9_form_2026.pdf",
      fileSize: "1.1 MB",
      uploadedDate: "Oct 10, 2026",
      status: "Pending Approval",
    },
    {
      id: "doc-3",
      title: "SOC-2 Type II Compliance & Data Security Audit Report",
      vendorName: "Marcus Vance",
      vendorEmail: "marcus@vanceretail.com",
      category: "Security & Compliance",
      fileName: "soc2_type2_security_audit_report.pdf",
      fileSize: "5.6 MB",
      uploadedDate: "Oct 09, 2026",
      status: "Pending Approval",
    },
    {
      id: "doc-4",
      title: "Vendor Marketplace Master SaaS Agreement",
      vendorName: "David Miller",
      vendorEmail: "vendor@saasmrkt.com",
      category: "Legal & Incorporation",
      fileName: "vendor_marketplace_master_agreement_signed.pdf",
      fileSize: "3.8 MB",
      uploadedDate: "Oct 01, 2026",
      status: "Approved & Verified",
      verifiedBy: "Admin",
      verifiedDate: "Oct 02, 2026",
    },
    {
      id: "doc-5",
      title: "Master Enterprise SLA & 99.9% Uptime Guarantee Terms",
      vendorName: "David Miller",
      vendorEmail: "vendor@saasmrkt.com",
      category: "Service Level Agreement",
      fileName: "saasmrkt_enterprise_sla_terms.pdf",
      fileSize: "1.8 MB",
      uploadedDate: "Sep 28, 2026",
      status: "Approved & Verified",
      verifiedBy: "Admin",
      verifiedDate: "Sep 29, 2026",
    },
    {
      id: "doc-6",
      title: "California Privacy Rights (CPRA) & GDPR Vendor Addendum",
      vendorName: "Sarah Jenkins",
      vendorEmail: "sarah.j@finscale.ai",
      category: "Legal & Incorporation",
      fileName: "finscale_gdpr_compliance_addendum.pdf",
      fileSize: "2.1 MB",
      uploadedDate: "Oct 08, 2026",
      status: "Pending Approval",
    },
  ]);

  const [docFilter, setDocFilter] = useState<string>("all");

  // --------------------------------------------------------------------------
  // 2. Vendor Projects State (Admin can remove vendor project)
  // --------------------------------------------------------------------------
  const [projects, setProjects] = useState<VendorProject[]>([
    {
      id: "proj-1",
      name: "DataPulse 2.0 Engine",
      vendor: "David Miller",
      vendorEmail: "vendor@saasmrkt.com",
      category: "Analytics & BI",
      price: "$180/mo",
      submittedDate: "Oct 11, 2026",
      securityScan: "Passed",
      status: "Pending Review",
    },
    {
      id: "proj-2",
      name: "OmniChat Support AI",
      vendor: "OmniSystems Labs",
      vendorEmail: "ops@omnisystems.io",
      category: "Customer Support",
      price: "$79/mo",
      submittedDate: "Oct 10, 2026",
      securityScan: "Passed",
      status: "Pending Review",
    },
    {
      id: "proj-3",
      name: "Kubescape Orchestrator",
      vendor: "KubeLabs Cloud",
      vendorEmail: "devops@kubelabs.tech",
      category: "DevOps & Cloud",
      price: "$210/mo",
      submittedDate: "Oct 09, 2026",
      securityScan: "Pending",
      status: "Pending Review",
    },
    {
      id: "proj-4",
      name: "GrowthFlow AI",
      vendor: "Sarah Jenkins",
      vendorEmail: "sarah.j@finscale.ai",
      category: "Marketing & Growth",
      price: "$120/mo",
      submittedDate: "Oct 05, 2026",
      securityScan: "Passed",
      status: "Live",
    },
    {
      id: "proj-5",
      name: "TaskFlow Enterprise",
      vendor: "Workflow Systems",
      vendorEmail: "contact@workflow.co",
      category: "Project Management",
      price: "$95/mo",
      submittedDate: "Oct 01, 2026",
      securityScan: "Passed",
      status: "Live",
    },
  ]);

  // --------------------------------------------------------------------------
  // 3. User & Vendor Directory State (Admin can remove user and vendor)
  // --------------------------------------------------------------------------
  const [users, setUsers] = useState<PlatformUser[]>([
    {
      id: "usr-1",
      name: "Admin",
      email: "admin@saasmrkt.com",
      role: "Admin",
      status: "Verified",
      joinedDate: "Oct 2024",
      company: "SaaS MRKT Operations",
    },
    {
      id: "usr-2",
      name: "Alex Morgan",
      email: "alex@company.com",
      role: "Buyer",
      status: "Verified",
      joinedDate: "Jan 2025",
      company: "Acme Cloud Ventures",
    },
    {
      id: "usr-3",
      name: "David Miller",
      email: "vendor@saasmrkt.com",
      role: "Vendor",
      status: "Verified",
      joinedDate: "Feb 2025",
      company: "SaaS MRKT Solutions",
    },
    {
      id: "usr-4",
      name: "Elena Rostova",
      email: "e.rostova@acuityhealth.org",
      role: "Buyer",
      status: "Active",
      joinedDate: "Apr 2025",
      company: "Acuity Health Network",
    },
    {
      id: "usr-5",
      name: "Marcus Vance",
      email: "marcus@vanceretail.com",
      role: "Vendor",
      status: "Active",
      joinedDate: "May 2025",
      company: "Vance Retail Global",
    },
    {
      id: "usr-6",
      name: "Rachel Green",
      email: "rachel@ralphops.com",
      role: "Buyer",
      status: "Active",
      joinedDate: "Jun 2025",
      company: "RalphOps Tech",
    },
  ]);

  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");

  // --------------------------------------------------------------------------
  // 4. Home Page Products Curation (Vendor-Uploaded Products ONLY)
  // --------------------------------------------------------------------------
  const [vendorProducts, setVendorProducts] = useState<VendorCatalogProduct[]>(VENDOR_UPLOADED_PRODUCTS);
  const [homeProductIds, setHomeProductIds] = useState<string[]>([
    "prod-manage360",
    "prod-taskflow",
    "prod-finmate",
    "prod-mailboost",
    "prod-supportly",
    "prod-dealflow",
  ]);

  const [homeFilter, setHomeFilter] = useState<"all" | "live" | "not-live">("all");
  const [homeSearchQuery, setHomeSearchQuery] = useState("");

  // Sync home products with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("saas_mrkt_featured_products");
      if (saved) {
        const parsed: ProductItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = parsed.map((p) => p.id);
          setHomeProductIds(ids);
          return;
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveLiveHomeProducts = (updatedIds: string[]) => {
    setHomeProductIds(updatedIds);
    // Build list of ProductItem from vendor catalog
    const activeProducts: ProductItem[] = vendorProducts
      .filter((vp) => updatedIds.includes(vp.id))
      .map((vp) => ({
        id: vp.id,
        name: vp.name,
        category: vp.category,
        rating: vp.rating,
        reviewCount: vp.reviewCount,
        description: vp.description,
        image: vp.image,
        price: vp.price,
        period: vp.period,
        brandColor: vp.brandColor,
        brandLetter: vp.brandLetter,
        topBadge: vp.topBadge,
        tags: vp.tags,
        features: vp.features,
      }));

    try {
      localStorage.setItem("saas_mrkt_featured_products", JSON.stringify(activeProducts));
    } catch {
      // Ignore
    }
  };

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3800);
  };

  // --------------------------------------------------------------------------
  // Handlers for 1. Vendor Document Approval
  // --------------------------------------------------------------------------
  const handleApproveDocument = (id: string, title: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: "Approved & Verified",
              verifiedBy: "Admin",
              verifiedDate: "Oct 11, 2026",
            }
          : doc
      )
    );
    showToast(`✓ Approved vendor document: "${title}". Verified badge assigned.`);
  };

  const handleRejectDocument = (id: string, title: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: "Rejected",
            }
          : doc
      )
    );
    showToast(`Document "${title}" marked as rejected. Revision requested from vendor.`);
  };

  // --------------------------------------------------------------------------
  // Handlers for 2. Remove Vendor Project
  // --------------------------------------------------------------------------
  const handleRemoveProject = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove vendor project "${name}" from the marketplace?`)) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      // Also remove from home page if present
      if (homeProductIds.includes(id)) {
        saveLiveHomeProducts(homeProductIds.filter((pid) => pid !== id));
      }
      showToast(`✓ Removed vendor project "${name}" from SaaS MRKT marketplace.`);
    }
  };

  const handleApproveProject = (id: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Live" } : p))
    );
    showToast(`✓ Vendor project "${name}" is now approved and live!`);
  };

  // --------------------------------------------------------------------------
  // Handlers for 3. Remove User and Vendor
  // --------------------------------------------------------------------------
  const handleRemoveUser = (id: string, name: string, role: string) => {
    if (role === "Admin") {
      alert("Platform Super Administrator account cannot be removed.");
      return;
    }
    const label = role === "Vendor" ? "Vendor" : "User";
    if (confirm(`Are you sure you want to permanently remove ${label} "${name}"? This action cannot be undone.`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`✓ ${label} "${name}" has been permanently removed from the platform.`);
    }
  };

  // --------------------------------------------------------------------------
  // Handlers for 4. Curate Home Page Products (Vendor Uploaded Only)
  // --------------------------------------------------------------------------
  const handleShowProductOnHome = (product: VendorCatalogProduct) => {
    if (homeProductIds.includes(product.id)) {
      showToast(`"${product.name}" is already showing on the Home Page.`);
      return;
    }
    const updated = [product.id, ...homeProductIds];
    saveLiveHomeProducts(updated);
    showToast(`✓ "${product.name}" (uploaded by ${product.vendor}) is now live on the Home Page!`);
  };

  const handleRemoveProductFromHome = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the Home Page featured showcase?`)) {
      const updated = homeProductIds.filter((pid) => pid !== id);
      saveLiveHomeProducts(updated);
      showToast(`✓ Removed "${name}" from the Home Page.`);
    }
  };

  // --------------------------------------------------------------------------
  // Filtering Helpers
  // --------------------------------------------------------------------------
  const pendingDocsCount = documents.filter((d) => d.status === "Pending Approval").length;

  const filteredDocs = documents.filter((d) => {
    if (docFilter === "pending") return d.status === "Pending Approval";
    if (docFilter === "approved") return d.status === "Approved & Verified";
    if (docFilter === "rejected") return d.status === "Rejected";
    return true;
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(searchUserQuery.toLowerCase()));

    const matchesRole =
      userRoleFilter === "all" || u.role.toLowerCase() === userRoleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const filteredVendorProducts = vendorProducts.filter((vp) => {
    const isLive = homeProductIds.includes(vp.id);
    if (homeFilter === "live" && !isLive) return false;
    if (homeFilter === "not-live" && isLive) return false;

    if (!homeSearchQuery) return true;
    const query = homeSearchQuery.toLowerCase();
    return (
      vp.name.toLowerCase().includes(query) ||
      vp.vendor.toLowerCase().includes(query) ||
      vp.category.toLowerCase().includes(query)
    );
  });

  const isAdmin = user?.role === "admin";

  if (!isInitialized) {
    return (
      <PageLayout activeNav="admin" noContainer>
        <div className="container" style={{ paddingTop: "6rem", paddingBottom: "8rem", textAlign: "center" }}>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Loading Admin Console...</p>
        </div>
      </PageLayout>
    );
  }

  // Access Control: If user is not an Admin, show Admin Access Gate
  if (!isAdmin) {
    return (
      <PageLayout activeNav="admin" noContainer>
        <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem", maxWidth: "680px" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "20px",
              padding: "3rem 2.5rem",
              textAlign: "center",
              boxShadow: "0 12px 36px -4px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "#FEF3C7",
                color: "#D97706",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
              Administrator Access Required
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              The SaaS MRKT Platform Administrator Console is restricted to authorized personnel with Master Governance privileges to approve vendor documents, remove users/vendors, remove vendor projects, and feature vendor-uploaded products on the homepage.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "340px", margin: "0 auto" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => loginAsRole("admin")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Sign In as Platform Admin
              </button>
              <Link href="/" className="btn-secondary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                &larr; Return to SaaS MRKT Home
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const adminName = user?.role === "admin" ? "Admin" : (user?.name || "Admin");
  const adminEmail = user?.email || "admin@saasmrkt.com";

  return (
    <PageLayout activeNav="admin" noContainer>
      <div className="admin-dashboard-wrapper">
        <div className="container">
          {/* Admin Header Hero */}
          <div className="admin-header-card">
            <div className="admin-header-top">
              <div className="admin-title-col">
                <div className="admin-badge-group">
                  <span className="admin-shield-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Master Governance
                  </span>
                  <span className="admin-uptime-tag">
                    <span className="uptime-dot"></span>
                    All Systems Operational (99.98% Uptime)
                  </span>
                </div>
                <h1 className="admin-portal-title">Platform Administrator Console</h1>
                <p className="admin-portal-sub">
                  Super Administrator Access &bull; Signed in as <strong>{adminName}</strong> ({adminEmail})
                </p>
              </div>

              <div className="admin-actions-col">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveTab("home")}
                  style={{ gap: "0.5rem", display: "inline-flex", alignItems: "center" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Curate Home Page Showcase</span>
                </button>
              </div>
            </div>

            {/* Admin 4-KPI Grid matching the 4 exact admin responsibilities */}
            <div className="admin-kpi-grid">
              <div
                className="admin-kpi-box"
                style={{ cursor: "pointer", border: activeTab === "documents" ? "1px solid #38BDF8" : undefined }}
                onClick={() => setActiveTab("documents")}
              >
                <span className="admin-kpi-label">Vendor Documents</span>
                <div className="admin-kpi-val-row">
                  <span className="admin-kpi-val" style={{ color: pendingDocsCount > 0 ? "#F59E0B" : "#10B981" }}>
                    {pendingDocsCount}
                  </span>
                  <span className="admin-kpi-trend neutral">{pendingDocsCount} Awaiting Review</span>
                </div>
                <span className="admin-kpi-note">Approve vendor legal &amp; compliance docs</span>
              </div>

              <div
                className="admin-kpi-box"
                style={{ cursor: "pointer", border: activeTab === "projects" ? "1px solid #38BDF8" : undefined }}
                onClick={() => setActiveTab("projects")}
              >
                <span className="admin-kpi-label">Vendor Projects</span>
                <div className="admin-kpi-val-row">
                  <span className="admin-kpi-val">{projects.length}</span>
                  <span className="admin-kpi-trend positive">Active Projects</span>
                </div>
                <span className="admin-kpi-note">Remove / moderate vendor SaaS projects</span>
              </div>

              <div
                className="admin-kpi-box"
                style={{ cursor: "pointer", border: activeTab === "users" ? "1px solid #38BDF8" : undefined }}
                onClick={() => setActiveTab("users")}
              >
                <span className="admin-kpi-label">Users &amp; Vendors</span>
                <div className="admin-kpi-val-row">
                  <span className="admin-kpi-val">{users.length}</span>
                  <span className="admin-kpi-trend positive">{users.filter(u => u.role === "Vendor").length} Vendors</span>
                </div>
                <span className="admin-kpi-note">Remove users and vendors</span>
              </div>

              <div
                className="admin-kpi-box"
                style={{ cursor: "pointer", border: activeTab === "home" ? "1px solid #38BDF8" : undefined }}
                onClick={() => setActiveTab("home")}
              >
                <span className="admin-kpi-label">Home Page Showcase</span>
                <div className="admin-kpi-val-row">
                  <span className="admin-kpi-val">{homeProductIds.length}</span>
                  <span className="admin-kpi-trend positive">Live on Home</span>
                </div>
                <span className="admin-kpi-note">Only vendor-uploaded products allowed</span>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {toastNotice && (
            <div className="admin-alert-banner" style={{ marginBottom: "1.5rem" }}>
              <span>⚡</span>
              <span>{toastNotice}</span>
            </div>
          )}

          {/* Admin Navigation Tabs: Exactly 4 Core Roles */}
          <div className="admin-tabs-bar">
            <button
              type="button"
              className={`admin-tab-btn${activeTab === "documents" ? " active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Approve Vendor Documents ({pendingDocsCount})</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn${activeTab === "projects" ? " active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Remove Vendor Projects ({projects.length})</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn${activeTab === "users" ? " active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Remove Users &amp; Vendors ({users.length})</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn${activeTab === "home" ? " active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Curate Home Page ({homeProductIds.length} Live)</span>
            </button>
          </div>

          {/* ================================================================
              TAB 1: APPROVE VENDOR DOCUMENTS
              ================================================================ */}
          {activeTab === "documents" && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h2 className="profile-section-title">Vendor Corporate Documents Verification</h2>
                    <p className="profile-section-desc">
                      Review and approve vendor legal certificates, W-9 forms, security reports, and SLA terms to verify their SaaS marketplace store.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className={`admin-btn-action ${docFilter === "all" ? "status-toggle" : "view"}`}
                      onClick={() => setDocFilter("all")}
                    >
                      All ({documents.length})
                    </button>
                    <button
                      type="button"
                      className={`admin-btn-action ${docFilter === "pending" ? "status-toggle" : "view"}`}
                      onClick={() => setDocFilter("pending")}
                    >
                      Pending ({pendingDocsCount})
                    </button>
                    <button
                      type="button"
                      className={`admin-btn-action ${docFilter === "approved" ? "status-toggle" : "view"}`}
                      onClick={() => setDocFilter("approved")}
                    >
                      Approved
                    </button>
                  </div>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Document Title &amp; Category</th>
                        <th>Submitting Vendor</th>
                        <th>File Name &amp; Size</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <div className="listing-cell-main">
                              <strong style={{ color: "#0F172A", fontSize: "0.92rem" }}>{doc.title}</strong>
                              <span style={{ color: "#64748B", fontSize: "0.78rem" }}>{doc.category}</span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong style={{ fontSize: "0.88rem", color: "#1E293B" }}>{doc.vendorName}</strong>
                              <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{doc.vendorEmail}</div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", color: "#475569" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              <span>{doc.fileName}</span>
                              <span style={{ color: "#94A3B8" }}>({doc.fileSize})</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: "0.82rem", color: "#64748B" }}>{doc.uploadedDate}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-status-pill ${
                                doc.status === "Approved & Verified"
                                  ? "approved"
                                  : doc.status === "Rejected"
                                  ? "rejected"
                                  : "pending"
                              }`}
                            >
                              {doc.status === "Approved & Verified" ? "✓ Verified" : doc.status}
                            </span>
                            {doc.verifiedBy && (
                              <div style={{ fontSize: "0.72rem", color: "#059669", marginTop: "0.2rem" }}>
                                {doc.verifiedBy}
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="admin-action-cell" style={{ justifyContent: "flex-end", gap: "0.45rem" }}>
                              {doc.status !== "Approved & Verified" && (
                                <button
                                  type="button"
                                  className="admin-btn-action approve"
                                  onClick={() => handleApproveDocument(doc.id, doc.title)}
                                  title="Approve and verify vendor document"
                                >
                                  ✓ Approve Document
                                </button>
                              )}
                              {doc.status !== "Rejected" && (
                                <button
                                  type="button"
                                  className="admin-btn-action reject"
                                  onClick={() => handleRejectDocument(doc.id, doc.title)}
                                  title="Reject document and request changes"
                                >
                                  Reject
                                </button>
                              )}
                              {doc.status === "Approved & Verified" && (
                                <span style={{ fontSize: "0.8rem", color: "#10B981", fontWeight: 700 }}>
                                  ✓ Approved
                                </span>
                              )}
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

          {/* ================================================================
              TAB 2: VENDOR PROJECTS MODERATION (Remove / Approve Vendor Project)
              ================================================================ */}
          {activeTab === "projects" && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h2 className="profile-section-title">Vendor Software Projects &amp; Listings</h2>
                    <p className="profile-section-desc">
                      Admin authority to evaluate new software projects, approve them for the marketplace, and remove unauthorized vendor projects.
                    </p>
                  </div>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Project &amp; Category</th>
                        <th>Vendor Owner</th>
                        <th>Price Tier</th>
                        <th>Security Audit</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Project Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((listing) => {
                        const isPinnedToHome = homeProductIds.includes(listing.id);
                        return (
                          <tr key={listing.id}>
                            <td>
                              <div className="listing-cell-main">
                                <strong style={{ color: "#0F172A", fontSize: "0.92rem" }}>{listing.name}</strong>
                                <span style={{ color: "#64748B", fontSize: "0.78rem" }}>{listing.category}</span>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong style={{ fontSize: "0.88rem", color: "#1E293B" }}>{listing.vendor}</strong>
                                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{listing.vendorEmail}</div>
                              </div>
                            </td>
                            <td>
                              <strong>{listing.price}</strong>
                            </td>
                            <td>
                              <span className={`security-pill ${listing.securityScan.toLowerCase()}`}>
                                {listing.securityScan === "Passed" ? "✓ Scan Passed" : "⏳ Scanning..."}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.82rem", color: "#64748B" }}>{listing.submittedDate}</span>
                            </td>
                            <td>
                              <span className={`admin-status-pill ${listing.status.toLowerCase().replace(" ", "-")}`}>
                                {listing.status}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div className="admin-action-cell" style={{ justifyContent: "flex-end", gap: "0.45rem" }}>
                                {listing.status !== "Live" && (
                                  <button
                                    type="button"
                                    className="admin-btn-action approve"
                                    onClick={() => handleApproveProject(listing.id, listing.name)}
                                  >
                                    ✓ Approve
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="admin-btn-action remove"
                                  onClick={() => handleRemoveProject(listing.id, listing.name)}
                                  title="Remove this vendor project from marketplace"
                                >
                                  🗑 Remove Project
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 3: USER & VENDOR DIRECTORY (Remove User and Vendor)
              ================================================================ */}
          {activeTab === "users" && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h2 className="profile-section-title">User &amp; Vendor Management Directory</h2>
                    <p className="profile-section-desc">
                      Inspect platform accounts and exercise admin removal power to remove bad actors, inactive users, or rule-violating vendors.
                    </p>
                  </div>

                  <div className="admin-user-filters">
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Search member, email, company..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                    />
                    <select
                      className="admin-role-select"
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="vendor">Vendors Only</option>
                      <option value="buyer">Buyers Only</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Account Member</th>
                        <th>Work Email</th>
                        <th>Company Affiliation</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th style={{ textAlign: "right" }}>Admin Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong style={{ color: "#0F172A", fontSize: "0.92rem" }}>{u.name}</strong>
                          </td>
                          <td style={{ fontSize: "0.85rem", color: "#475569" }}>{u.email}</td>
                          <td style={{ fontSize: "0.85rem", color: "#475569" }}>{u.company || "—"}</td>
                          <td>
                            <span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span>
                          </td>
                          <td>
                            <span className={`user-status-pill ${u.status.toLowerCase()}`}>{u.status}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "0.82rem", color: "#64748B" }}>{u.joinedDate}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="admin-action-cell" style={{ justifyContent: "flex-end" }}>
                              {u.role === "Admin" ? (
                                <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontStyle: "italic" }}>
                                  Super Admin Protected
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="admin-btn-action remove"
                                  onClick={() => handleRemoveUser(u.id, u.name, u.role)}
                                  title={`Permanently remove this ${u.role}`}
                                >
                                  🗑 Remove {u.role === "Vendor" ? "Vendor" : "User"}
                                </button>
                              )}
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

          {/* ================================================================
              TAB 4: CURATE HOME PAGE (Vendor-Uploaded Products ONLY)
              ================================================================ */}
          {activeTab === "home" && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                      <h2 className="profile-section-title" style={{ margin: 0 }}>
                        Home Page Featured Products Curation
                      </h2>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "9999px",
                          background: "#ECFDF5",
                          color: "#059669",
                          border: "1px solid #A7F3D0",
                        }}
                      >
                        🔒 Vendor-Uploaded Products Only
                      </span>
                    </div>
                    <p className="profile-section-desc" style={{ margin: 0 }}>
                      Admin can only show products uploaded and verified by SaaS vendors. No admin-created products are permitted.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Search vendor product or creator..."
                      value={homeSearchQuery}
                      onChange={(e) => setHomeSearchQuery(e.target.value)}
                      style={{ width: "240px" }}
                    />

                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <button
                        type="button"
                        className={`admin-btn-action ${homeFilter === "all" ? "status-toggle" : "view"}`}
                        onClick={() => setHomeFilter("all")}
                      >
                        All ({vendorProducts.length})
                      </button>
                      <button
                        type="button"
                        className={`admin-btn-action ${homeFilter === "live" ? "status-toggle" : "view"}`}
                        onClick={() => setHomeFilter("live")}
                      >
                        Live on Home ({homeProductIds.length})
                      </button>
                      <button
                        type="button"
                        className={`admin-btn-action ${homeFilter === "not-live" ? "status-toggle" : "view"}`}
                        onClick={() => setHomeFilter("not-live")}
                      >
                        Available ({vendorProducts.length - homeProductIds.length})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Vendor Product &amp; Category</th>
                        <th>Submitting Vendor</th>
                        <th>Price Tier</th>
                        <th>Rating &amp; Reviews</th>
                        <th>Home Page Status</th>
                        <th style={{ textAlign: "right" }}>Home Page Curation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendorProducts.map((prod) => {
                        const isLiveOnHome = homeProductIds.includes(prod.id);
                        return (
                          <tr key={prod.id}>
                            <td>
                              <div className="listing-cell-main">
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <strong style={{ color: "#0F172A", fontSize: "0.92rem" }}>{prod.name}</strong>
                                  <span style={{ background: "#EEF2FF", color: "#4F46E5", padding: "0.15rem 0.45rem", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
                                    {prod.topBadge}
                                  </span>
                                </div>
                                <span style={{ color: "#64748B", fontSize: "0.78rem" }}>{prod.category}</span>
                                <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#64748B", maxWidth: "340px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {prod.description}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong style={{ fontSize: "0.88rem", color: "#1E293B" }}>{prod.vendor}</strong>
                                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{prod.vendorEmail}</div>
                              </div>
                            </td>
                            <td>
                              <strong>${prod.price}</strong> <span style={{ fontSize: "0.78rem", color: "#64748B" }}>/{prod.period}</span>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}>
                                <span style={{ color: "#F59E0B" }}>★</span>
                                <strong style={{ color: "#0F172A" }}>{prod.rating}</strong>
                                <span style={{ color: "#64748B", fontSize: "0.78rem" }}>({prod.reviewCount})</span>
                              </div>
                            </td>
                            <td>
                              {isLiveOnHome ? (
                                <span className="admin-status-pill approved">
                                  ✓ Showing on Home
                                </span>
                              ) : (
                                <span className="admin-status-pill" style={{ background: "#F1F5F9", color: "#64748B" }}>
                                  Hidden from Home
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div className="admin-action-cell" style={{ justifyContent: "flex-end" }}>
                                {isLiveOnHome ? (
                                  <button
                                    type="button"
                                    className="admin-btn-action remove"
                                    onClick={() => handleRemoveProductFromHome(prod.id, prod.name)}
                                    title="Hide this vendor product from the Home Page"
                                  >
                                    ✕ Remove from Home
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="admin-btn-action pin"
                                    onClick={() => handleShowProductOnHome(prod)}
                                    title="Show this vendor-uploaded product on the Home Page"
                                  >
                                    📌 Show on Home Page
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
