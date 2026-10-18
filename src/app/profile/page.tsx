"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";

interface AppliedProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  desc: string;
  url: string;
  iconBg: string;
  iconLetter: string;
  applicationDate: string;
  inquiryNote: string;
  vendor: {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    whatsappNumber: string;
    approvalStatus: "approved" | "pending";
    statusNote?: string;
  };
}

const DEFAULT_APPLIED_PRODUCTS: AppliedProduct[] = [
  {
    id: "app-1",
    name: "GrowthFlow AI",
    category: "Marketing & SEO",
    price: "$149 / mo",
    rating: 4.9,
    desc: "Autonomous growth co-pilot for multi-channel B2B campaigns and revenue attribution.",
    url: "/products/prod-growthflow/details",
    iconBg: "#6366F1",
    iconLetter: "GF",
    applicationDate: "Oct 04, 2026",
    inquiryNote: "Applied for vendor WhatsApp & direct phone consultation",
    vendor: {
      name: "GrowthFlow Technologies HQ",
      contactPerson: "David Miller (Lead Architect)",
      email: "david.miller@growthflow.io",
      phone: "+1 (415) 890-2341",
      whatsappNumber: "14158902341",
      approvalStatus: "approved",
      statusNote: "Approved by vendor. Direct WhatsApp & phone unlocked.",
    },
  },
  {
    id: "app-2",
    name: "DevEdge Cloud Platform",
    category: "DevOps & Cloud",
    price: "$120 / mo",
    rating: 4.8,
    desc: "Next-gen zero-config serverless deployment runtime and distributed container orchestrator.",
    url: "/products",
    iconBg: "#3B82F6",
    iconLetter: "DE",
    applicationDate: "Sep 28, 2026",
    inquiryNote: "Applied for enterprise volume discount and custom API limits",
    vendor: {
      name: "DevEdge Systems Inc.",
      contactPerson: "Sarah Chen (VP Partnerships)",
      email: "partnerships@devedge.io",
      phone: "+1 (312) 670-4491",
      whatsappNumber: "13126704491",
      approvalStatus: "approved",
      statusNote: "Approved by vendor. Direct WhatsApp & phone unlocked.",
    },
  },
  {
    id: "app-3",
    name: "DataPulse Analytics AI",
    category: "Data & BI",
    price: "$122 / mo",
    rating: 4.7,
    desc: "Unified data pipeline observability and automated schema drift monitoring for enterprises.",
    url: "/products",
    iconBg: "#F59E0B",
    iconLetter: "DP",
    applicationDate: "Oct 09, 2026",
    inquiryNote: "Applied for enterprise POC & security compliance review",
    vendor: {
      name: "PulseCorp Intelligence",
      contactPerson: "Elena Rostova (Enterprise Account Director)",
      email: "elena@pulsecorp.ai",
      phone: "+1 (650) 441-9022",
      whatsappNumber: "16504419022",
      approvalStatus: "pending",
      statusNote: "Pending vendor approval. Contact details will unlock once approved by vendor.",
    },
  },
];

export default function ProfilePage() {
  const { user, updateUser, loginAsRole, isInitialized } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shouldOpenPhotoPicker, setShouldOpenPhotoPicker] = useState(false);

  // Active tab: "applied" | "edit" (User views products applied to contact vendor & edit profile)
  const [activeTab, setActiveTab] = useState<"applied" | "edit">("applied");

  // Applied products state with persistence
  const [appliedProducts, setAppliedProducts] = useState<AppliedProduct[]>(DEFAULT_APPLIED_PRODUCTS);

  // Local state for profile edit form
  const [formData, setFormData] = useState({
    name: user?.name || "Alex Morgan",
    email: user?.email || "alex@company.com",
    title: user?.title || "Head of Product & Growth",
    company: user?.company || "Acme Cloud Ventures",
    location: user?.location || "San Francisco, CA",
    website: user?.website || "https://acmecloud.io",
    bio: user?.bio || "SaaS software procurement lead evaluating cloud infrastructure and marketing tooling.",
    phone: user?.phone || "+1 (555) 234-8900",
    avatarUrl: user?.avatarUrl || "",
  });

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Load applied products from localStorage if available, otherwise initialize with defaults
  useEffect(() => {
    let nextProducts = DEFAULT_APPLIED_PRODUCTS;
    try {
      const saved = localStorage.getItem("saas_mrkt_applied_products");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          nextProducts = parsed as AppliedProduct[];
        }
      } else {
        localStorage.setItem("saas_mrkt_applied_products", JSON.stringify(DEFAULT_APPLIED_PRODUCTS));
      }
    } catch {}
    const frameId = window.requestAnimationFrame(() => setAppliedProducts(nextProducts));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  // Update formData when user changes
  useEffect(() => {
    if (!user) return;
    const frameId = window.requestAnimationFrame(() => {
      setFormData((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          title: user.title || prev.title,
          company: user.company || prev.company,
          location: user.location || prev.location,
          website: user.website || prev.website,
          bio: user.bio || prev.bio,
          phone: user.phone || prev.phone,
          avatarUrl: user.avatarUrl || prev.avatarUrl,
        }));
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [user]);

  useEffect(() => {
    if (activeTab !== "edit" || !shouldOpenPhotoPicker) return;

    const frameId = window.requestAnimationFrame(() => {
      fileInputRef.current?.click();
      setShouldOpenPhotoPicker(false);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activeTab, shouldOpenPhotoPicker]);

  // Save applied products to localStorage
  const saveAppliedProducts = (updated: AppliedProduct[]) => {
    setAppliedProducts(updated);
    try {
      localStorage.setItem("saas_mrkt_applied_products", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Remove product from applied list
  const handleRemoveApplied = (productId: string, productName: string) => {
    const updated = appliedProducts.filter((p) => p.id !== productId);
    saveAppliedProducts(updated);
    setSavedNotice(`Removed ${productName} from your applied vendor requests.`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  // Handle Profile Photo Upload from File
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSavedNotice("Please select a valid image file (JPG, PNG, WebP).");
      setTimeout(() => setSavedNotice(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      try {
        await updateUser({ avatarUrl: result });
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
        setSavedNotice("Profile picture updated successfully.");
      } catch (error) { setSavedNotice(error instanceof Error ? error.message : "Photo could not be saved."); }
      setTimeout(() => setSavedNotice(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  // Handle Remove Profile Photo
  const handleRemovePhoto = async () => {
    try {
      await updateUser({ avatarUrl: "" });
      setFormData((prev) => ({ ...prev, avatarUrl: "" }));
      setSavedNotice("Profile picture removed. Reverted to initials avatar.");
    } catch (error) { setSavedNotice(error instanceof Error ? error.message : "Photo could not be removed."); }
    setTimeout(() => setSavedNotice(null), 3000);
  };

  // Handle Save Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    await updateUser({
      name: formData.name,
      email: formData.email,
      title: formData.title,
      company: formData.company,
      location: formData.location,
      website: formData.website,
      bio: formData.bio,
      phone: formData.phone,
      avatarUrl: formData.avatarUrl,
    });
    setSavedNotice("Profile details & contact number saved successfully.");
    } catch (error) { setSavedNotice(error instanceof Error ? error.message : "Profile could not be saved."); }
    setTimeout(() => setSavedNotice(null), 3500);
  };

  if (!isInitialized) {
    return (
      <PageLayout activeNav="profile" noContainer>
        <div className="container" style={{ paddingTop: "6rem", paddingBottom: "8rem", textAlign: "center" }}>
          <div style={{ maxWidth: "460px", margin: "0 auto", padding: "3rem" }}>
            <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Loading User Profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout activeNav="profile" noContainer>
        <div className="container" style={{ paddingTop: "5rem", paddingBottom: "7rem", textAlign: "center" }}>
          <div style={{ maxWidth: "480px", margin: "0 auto", background: "#FFFFFF", padding: "2.75rem 2rem", borderRadius: "20px", border: "1px solid #E2E8F0", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.06)" }}>
            <div style={{ width: "62px", height: "62px", borderRadius: "50%", background: "#EEF2FF", color: "#4F46E5", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
              Account Sign In Required
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.92rem", lineHeight: 1.55, marginBottom: "1.75rem" }}>
              Please sign in to view products you applied to contact vendors for and manage your profile details.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => loginAsRole("buyer")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Sign In as Buyer (Alex Morgan)
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

  const currentName = user?.name || formData.name;
  const currentEmail = user?.email || formData.email;
  const currentPhone = user?.phone || formData.phone;
  const currentAvatar = user?.avatarUrl || formData.avatarUrl;
  const initials = currentName ? currentName.slice(0, 2).toUpperCase() : "AM";
  const userRole = user?.role || "buyer";

  const approvedVendorsCount = appliedProducts.filter((p) => p.vendor.approvalStatus === "approved").length;
  const pendingVendorsCount = appliedProducts.filter((p) => p.vendor.approvalStatus === "pending").length;

  return (
    <PageLayout activeNav="profile" noContainer>
      <div className="profile-page-wrapper">
        <div className="container">
          {/* Header notice if logged in with Vendor or Admin account */}
          {user && userRole !== "buyer" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.85rem 1.25rem",
                background: userRole === "admin" ? "#FFFBEB" : "#ECFDF5",
                border: `1px solid ${userRole === "admin" ? "#FDE68A" : "#A7F3D0"}`,
                borderRadius: "14px",
                marginBottom: "1.5rem",
                color: userRole === "admin" ? "#92400E" : "#065F46",
                fontSize: "0.9rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  You are currently logged in as a <strong>{userRole === "admin" ? "Platform Administrator" : "SaaS Vendor"}</strong> ({user.email}).
                </span>
              </div>
              <Link
                href={userRole === "admin" ? "/admin" : "/vendor"}
                className="btn-primary"
                style={{
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.8rem",
                  background: userRole === "admin" ? "#D97706" : "#059669",
                }}
              >
                Go to {userRole === "admin" ? "Admin Console" : "Vendor Portal"} &rarr;
              </Link>
            </div>
          )}

          {/* Profile Header Hero Card */}
          <div className="profile-hero-card">
            <div className="profile-hero-banner"></div>
            <div className="profile-hero-content">
              {/* Profile Avatar with Photo or Initials */}
              <div className="profile-avatar-wrapper" style={{ position: "relative" }}>
                <div
                  className="profile-avatar-img"
                  style={{
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => setActiveTab("edit")}
                  title="Click to edit profile picture"
                >
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={currentName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    initials
                  )}
                </div>
                {/* Status indicator */}
                <div className="profile-avatar-status" title="Active Account"></div>
                {/* Camera icon badge */}
                <button
                  type="button"
                  onClick={() => {
                    setShouldOpenPhotoPicker(true);
                    setActiveTab("edit");
                  }}
                  title="Change profile picture"
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: "2px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#0F172A",
                    color: "#FFFFFF",
                    border: "2px solid #FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>

              <div className="profile-header-main">
                <div className="profile-title-row">
                  <div className="profile-name-group">
                    <h1 className="profile-name">{currentName}</h1>
                    <span className="profile-verified-badge" title="Verified Account">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Verified
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        background: userRole === "admin" ? "#FEF3C7" : userRole === "vendor" ? "#ECFDF5" : "#EEF2FF",
                        color: userRole === "admin" ? "#B45309" : userRole === "vendor" ? "#059669" : "#4F46E5",
                        border: `1px solid ${userRole === "admin" ? "#FDE68A" : userRole === "vendor" ? "#A7F3D0" : "#C7D2FE"}`,
                      }}
                    >
                      {userRole === "admin" ? "Platform Administrator" : userRole === "vendor" ? "Verified Vendor" : "Software Buyer"}
                    </span>
                  </div>

                  <div className="profile-quick-actions">
                    <button
                      type="button"
                      className="profile-action-btn"
                      onClick={() => setActiveTab("edit")}
                      style={{
                        background: activeTab === "edit" ? "#4F46E5" : "#FFFFFF",
                        color: activeTab === "edit" ? "#FFFFFF" : "#334155",
                        borderColor: activeTab === "edit" ? "#4F46E5" : "#CBD5E1",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      Edit Profile &amp; Photo
                    </button>
                  </div>
                </div>

                <div className="profile-meta-row">
                  <span className="profile-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    {currentEmail}
                  </span>

                  {/* Phone / WhatsApp number display */}
                  <span className="profile-meta-item" style={{ color: "#0F172A", fontWeight: 600 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#10B981" }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {currentPhone || "+1 (555) 234-8900"}
                  </span>

                  <span className="profile-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {formData.title} &bull; {formData.company}
                  </span>

                  <span className="profile-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {formData.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="profile-metrics-strip">
              <div className="profile-kpi-item">
                <span className="profile-kpi-val" style={{ color: "#4F46E5" }}>{appliedProducts.length}</span>
                <span className="profile-kpi-lbl">Products Applied</span>
              </div>
              <div className="profile-kpi-item">
                <span className="profile-kpi-val" style={{ color: "#059669" }}>{approvedVendorsCount}</span>
                <span className="profile-kpi-lbl">Vendor Contacts Unlocked</span>
              </div>
              <div className="profile-kpi-item">
                <span className="profile-kpi-val" style={{ color: "#D97706" }}>{pendingVendorsCount}</span>
                <span className="profile-kpi-lbl">Awaiting Vendor Approval</span>
              </div>
              <div className="profile-kpi-item">
                <span className="profile-kpi-val" style={{ color: "#0F172A", fontSize: "1.1rem" }}>
                  {currentPhone ? "Verified" : "Pending Phone"}
                </span>
                <span className="profile-kpi-lbl">Buyer Contact Status</span>
              </div>
            </div>
          </div>

          {/* Toast Notice */}
          {savedNotice && (
            <div className="profile-alert-banner">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{savedNotice}</span>
            </div>
          )}

          {/* Profile Navigation Tabs (Products Applied to Contact Vendor & Edit Profile) */}
          <div className="profile-tabs-bar">
            <button
              type="button"
              className={`profile-tab-btn${activeTab === "applied" ? " active" : ""}`}
              onClick={() => setActiveTab("applied")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Products Applied to Contact Vendor ({appliedProducts.length})</span>
            </button>

            <button
              type="button"
              className={`profile-tab-btn${activeTab === "edit" ? " active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Edit Profile &amp; Contact Details</span>
            </button>
          </div>

          {/* TAB 1: PRODUCTS APPLIED TO CONTACT VENDOR */}
          {activeTab === "applied" && (
            <div className="profile-tab-content">
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <div>
                    <h2 className="profile-section-title">Products Applied to Contact Vendor</h2>
                    <p className="profile-section-desc">
                      SaaS software solutions where you submitted an application to contact the vendor. Once the vendor reviews and approves your buyer profile, their direct phone and WhatsApp number unlock below.
                    </p>
                  </div>
                  <Link href="/products" className="btn-secondary profile-browse-btn" style={{ textDecoration: "none" }}>
                    + Apply to Contact More Vendors
                  </Link>
                </div>

                {appliedProducts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3.5rem 1rem", background: "#F8FAFC", borderRadius: "16px", border: "1px dashed #CBD5E1" }}>
                    <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#EEF2FF", color: "#4F46E5", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>
                      No Contact Applications Yet
                    </h3>
                    <p style={{ color: "#64748B", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                      You haven&apos;t applied to contact any vendors yet. Explore SaaS solutions in the marketplace and apply to connect directly with verified vendors.
                    </p>
                    <Link href="/products" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex" }}>
                      Discover SaaS Products &rarr;
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {appliedProducts.map((product) => {
                      const isApproved = product.vendor.approvalStatus === "approved";

                      return (
                        <div
                          key={product.id}
                          style={{
                            background: "#FFFFFF",
                            border: isApproved ? "1.5px solid #E2E8F0" : "1.5px dashed #CBD5E1",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                          }}
                        >
                          {/* Top Row: Product Details */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: "1.25rem",
                              flexWrap: "wrap",
                              paddingBottom: "1.25rem",
                              borderBottom: "1px solid #F1F5F9",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "12px",
                                  backgroundColor: product.iconBg,
                                  color: "#FFFFFF",
                                  fontWeight: 800,
                                  fontSize: "1.1rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                {product.iconLetter}
                              </div>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                                    {product.name}
                                  </h3>
                                  <span
                                    style={{
                                      fontSize: "0.725rem",
                                      fontWeight: 700,
                                      background: "#EEF2FF",
                                      color: "#4F46E5",
                                      padding: "0.15rem 0.55rem",
                                      borderRadius: "9999px",
                                    }}
                                  >
                                    {product.category}
                                  </span>
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", color: "#D97706", fontWeight: 700 }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" aria-hidden="true">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    {product.rating}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.725rem",
                                      color: "#64748B",
                                      background: "#F1F5F9",
                                      padding: "0.15rem 0.55rem",
                                      borderRadius: "6px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Applied: {product.applicationDate}
                                  </span>
                                </div>
                                <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0.25rem 0 0", maxWidth: "620px" }}>
                                  {product.desc}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveApplied(product.id, product.name)}
                              title="Withdraw Contact Application"
                              aria-label={`Remove application for ${product.name}`}
                              style={{
                                background: "#FFFFFF",
                                border: "1px solid #E2E8F0",
                                borderRadius: "8px",
                                padding: "0.45rem 0.65rem",
                                color: "#64748B",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#EF4444";
                                e.currentTarget.style.borderColor = "#FCA5A5";
                                e.currentTarget.style.background = "#FEF2F2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#64748B";
                                e.currentTarget.style.borderColor = "#E2E8F0";
                                e.currentTarget.style.background = "#FFFFFF";
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                              Remove
                            </button>
                          </div>

                          {/* Bottom Row: Vendor Approval Status & Direct Phone Number */}
                          <div
                            style={{
                              marginTop: "1.25rem",
                              background: isApproved ? "#F0FDF4" : "#FFFBEB",
                              border: `1px solid ${isApproved ? "#BBF7D0" : "#FDE68A"}`,
                              borderRadius: "12px",
                              padding: "1rem 1.25rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "1rem",
                            }}
                          >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M3 21h18" />
                                  <path d="M5 21V7l8-4v18" />
                                  <path d="M19 21V11l-6-3" />
                                  <path d="M9 9h1" />
                                  <path d="M9 13h1" />
                                  <path d="M9 17h1" />
                                </svg>
                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>
                                  Vendor: {product.vendor.name}
                                </span>
                                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
                                  ({product.vendor.contactPerson})
                                </span>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                {/* Approval Badge */}
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    fontSize: "0.775rem",
                                    fontWeight: 700,
                                    padding: "0.28rem 0.75rem",
                                    borderRadius: "9999px",
                                    background: isApproved ? "#DCFCE7" : "#FEF3C7",
                                    color: isApproved ? "#15803D" : "#B45309",
                                    border: `1px solid ${isApproved ? "#86EFAC" : "#FCD34D"}`,
                                  }}
                                >
                                  {isApproved ? (
                                    <>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                      Vendor Approved
                                    </>
                                  ) : (
                                    <>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                      </svg>
                                      Pending Vendor Approval
                                    </>
                                  )}
                                </span>

                                {/* Vendor Phone Number: Revealed if approved, Locked if pending */}
                                {isApproved ? (
                                  <div
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      background: "#FFFFFF",
                                      padding: "0.32rem 0.8rem",
                                      borderRadius: "8px",
                                      border: "1px solid #86EFAC",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                    }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#065F46", letterSpacing: "0.01em" }}>
                                      {product.vendor.phone}
                                    </span>
                                    <span style={{ fontSize: "0.725rem", color: "#16A34A", fontWeight: 600 }}>
                                      (Direct Number)
                                    </span>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.45rem",
                                      background: "#FFF8E7",
                                      padding: "0.32rem 0.8rem",
                                      borderRadius: "8px",
                                      border: "1px dashed #F59E0B",
                                    }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#92400E", letterSpacing: "0.05em" }}>
                                      +1 (•••) •••-••••
                                    </span>
                                    <span style={{ fontSize: "0.725rem", color: "#B45309", fontWeight: 600 }}>
                                      (Locked until vendor approves)
                                    </span>
                                  </div>
                                )}
                              </div>

                              <p style={{ margin: "0.2rem 0 0", fontSize: "0.775rem", color: isApproved ? "#15803D" : "#92400E" }}>
                                {isApproved
                                  ? "Vendor has approved your application. You can call or chat on WhatsApp directly."
                                  : "This contact can only be approved by the vendor. Once approved by the vendor, direct contact details will unlock here."}
                              </p>
                            </div>

                            {/* Action Buttons for Vendor Contact */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                              {isApproved ? (
                                <>
                                  {/* WhatsApp Direct Chat Button */}
                                  <a
                                    href={`https://wa.me/${product.vendor.whatsappNumber}?text=Hello%20${encodeURIComponent(product.vendor.contactPerson)}%2C%20I%20applied%20to%20contact%20your%20team%20regarding%20${encodeURIComponent(product.name)}%20on%20SaaS%20MRKT%20and%20would%20like%20to%20connect.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.55rem",
                                      background: "#25D366",
                                      color: "#FFFFFF",
                                      fontWeight: 700,
                                      fontSize: "0.85rem",
                                      padding: "0.55rem 1rem",
                                      borderRadius: "9px",
                                      textDecoration: "none",
                                      boxShadow: "0 2px 8px rgba(37, 211, 102, 0.35)",
                                      transition: "transform 0.15s ease",
                                    }}
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2 22l4.98-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-.05 17.5a7.94 7.94 0 01-4.05-1.11l-.29-.17-3.01.84.84-2.93-.19-.3A7.95 7.95 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8.05 8zm4.41-5.97c-.24-.12-1.43-.71-1.65-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.12.16 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.11-.22-.18-.46-.3z"
                                        fill="#FFFFFF"
                                      />
                                    </svg>
                                    <span>Chat on WhatsApp</span>
                                  </a>

                                  {/* Direct Call Button */}
                                  <a
                                    href={`tel:${product.vendor.phone.replace(/[^0-9+]/g, "")}`}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.45rem",
                                      background: "#FFFFFF",
                                      color: "#0F172A",
                                      border: "1px solid #CBD5E1",
                                      fontWeight: 600,
                                      fontSize: "0.825rem",
                                      padding: "0.55rem 0.85rem",
                                      borderRadius: "9px",
                                      textDecoration: "none",
                                    }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    Call Vendor
                                  </a>
                                </>
                              ) : (
                                <div
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.45rem",
                                    background: "#FFFBEB",
                                    border: "1px solid #FDE68A",
                                    borderRadius: "8px",
                                    padding: "0.45rem 0.85rem",
                                    color: "#92400E",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                  </svg>
                                  Pending Vendor Approval
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE, PHOTO & PHONE NUMBER */}
          {activeTab === "edit" && (
            <div className="profile-tab-content">
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <div>
                    <h2 className="profile-section-title">Edit Profile Information</h2>
                    <p className="profile-section-desc">
                      Update your photo, phone / WhatsApp number, job title, and company details.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  {/* Profile Picture Uploader Section */}
                  <div
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1.5rem",
                      flexWrap: "wrap",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {/* Live Avatar Preview */}
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.85rem",
                        fontWeight: 800,
                        border: "3px solid #FFFFFF",
                        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
                        flexShrink: 0,
                      }}
                    >
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <h4 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>
                        Profile Picture
                      </h4>
                      <p style={{ margin: "0 0 0.85rem", fontSize: "0.825rem", color: "#64748B" }}>
                        Upload your personal photo or company avatar. Supported: JPG, PNG, WebP or GIF.
                      </p>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: "none" }}
                      />

                      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-primary"
                          style={{
                            padding: "0.45rem 0.95rem",
                            fontSize: "0.825rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Upload Photo
                        </button>

                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            style={{
                              background: "#FFFFFF",
                              border: "1px solid #CBD5E1",
                              color: "#EF4444",
                              fontSize: "0.825rem",
                              fontWeight: 600,
                              padding: "0.45rem 0.85rem",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact Details Row: Name & Phone Number */}
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="pf-name">Full Name *</label>
                      <input
                        id="pf-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g. Alex Morgan"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pf-phone">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        id="pf-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="e.g. +1 (555) 234-8900"
                      />
                      <span style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.25rem", display: "block" }}>
                        Vendors will see this number when your connection inquiry is approved.
                      </span>
                    </div>
                  </div>

                  {/* Work Email & Job Title */}
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="pf-email">Work Email *</label>
                      <input
                        id="pf-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="alex@company.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pf-title">Job Title</label>
                      <input
                        id="pf-title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Head of Product & Growth"
                      />
                    </div>
                  </div>

                  {/* Company & Location */}
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="pf-company">Company / Organization</label>
                      <input
                        id="pf-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Acme Cloud Ventures"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pf-location">Location</label>
                      <input
                        id="pf-location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="form-group">
                    <label htmlFor="pf-website">Website URL</label>
                    <input
                      id="pf-website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://acmecloud.io"
                    />
                  </div>

                  {/* Bio */}
                  <div className="form-group">
                    <label htmlFor="pf-bio">Professional Bio</label>
                    <textarea
                      id="pf-bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Briefly describe what SaaS software solutions you are looking to acquire or evaluate..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-action-row" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <button type="submit" className="btn-primary profile-save-btn">
                      Save Profile &amp; Contact Details
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveTab("applied")}
                    >
                      Cancel &amp; Back to Applied Products
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
