"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import type { AdminCatalogProduct as VendorCatalogProduct, AdminVendorDocument as VendorDocument,
  AdminVendorProject as VendorProject, PlatformUser } from "@/utils/adminStore";
import type { AdminSnapshot, AdminAction } from "@/lib/admin-types";

function getPaymentMethodLabel(method: string): string {
  return method === "paypal" ? "PayPal" : method === "applepay" ? "Digital Wallet" : "Credit / Debit Card";
}

export default function AdminPage() {
  const { user, loginAsRole, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState<"documents" | "projects" | "users" | "orders" | "home">("documents");
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [projects, setProjects] = useState<VendorProject[]>([]);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [orders, setOrders] = useState<AdminSnapshot["orders"]>([]);
  const [homeCatalogProducts, setHomeCatalogProducts] = useState<VendorCatalogProduct[]>([]);
  const [homeProductIds, setHomeProductIds] = useState<string[]>([]);
  const [docFilter, setDocFilter] = useState("all");
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [homeFilter, setHomeFilter] = useState<"all" | "live" | "not-live">("all");
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const loadDashboard = useCallback(async () => {
    const response = await fetch("/api/admin", { cache:"no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Dashboard could not be loaded.");
    const snapshot: AdminSnapshot = data;
    setDocuments(snapshot.documents); setProjects(snapshot.projects); setUsers(snapshot.users);
    setOrders(snapshot.orders); setHomeCatalogProducts(snapshot.catalog); setHomeProductIds(snapshot.featuredIds);
  }, []);
  useEffect(() => {
    if (user?.role !== "admin") return;
    const frame = requestAnimationFrame(() => {
      void loadDashboard().catch((error: Error) => setToastNotice(error.message));
    });
    return () => cancelAnimationFrame(frame);
  }, [user?.role, loadDashboard]);

  const performAction = async (action: AdminAction, id: string, success: string) => {
    try {
      const response = await fetch("/api/admin", { method:"POST",
        headers:{"Content-Type":"application/json"}, body:JSON.stringify({ action,id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action failed.");
      await loadDashboard();
      setToastNotice(success);
    } catch (error) { setToastNotice(error instanceof Error ? error.message : "Action failed."); }
  };
  const handleApproveDocument = (id: string, title: string) =>
    performAction("approve-document",id,`Approved document: "${title}".`);
  const handleRejectDocument = (id: string, title: string) =>
    performAction("reject-document",id,`Rejected document: "${title}".`);
  const handleApproveProject = (id: string, name: string) =>
    performAction("approve-project",id,`"${name}" is approved and live.`);
  const handleRemoveProject = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the marketplace?`))
      void performAction("remove-project",id,`Removed "${name}".`);
  };
  const handleRemoveUser = (id: string, name: string, role: string) => {
    if (role === "Admin" || id === user?.id) { setToastNotice("Administrator accounts cannot be removed."); return; }
    if (confirm(`Permanently remove "${name}"? Accounts with historical records may not be removable.`))
      void performAction("remove-user",id,`Removed "${name}".`);
  };
  const handleShowProductOnHome = (product: VendorCatalogProduct) =>
    performAction("feature-product",product.id,`"${product.name}" is featured on the home page.`);
  const handleRemoveProductFromHome = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the featured showcase?`))
      void performAction("unfeature-product",id,`Removed "${name}" from the showcase.`);
  };

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

  const filteredOrders = orders.filter((order) => {
    if (!orderSearch.trim()) return true;
    const query = orderSearch.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.licenseKey.toLowerCase().includes(query) ||
      order.buyerName.toLowerCase().includes(query) ||
      order.buyerEmail.toLowerCase().includes(query) ||
      order.productName.toLowerCase().includes(query) ||
      order.sellerName.toLowerCase().includes(query)
    );
  });

  const totalOrderValue = orders.reduce((sum, order) => sum + order.price, 0);
  const homeLiveCount = homeCatalogProducts.filter((vp) => homeProductIds.includes(vp.id)).length;

  const filteredVendorProducts = homeCatalogProducts.filter((vp) => {
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
                  <span className="admin-kpi-val">{homeLiveCount}</span>
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
              className={`admin-tab-btn${activeTab === "orders" ? " active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Orders &amp; Revenue ({orders.length})</span>
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
              <span>Curate Home Page ({homeLiveCount} Live)</span>
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
              TAB 4: MARKETPLACE ORDERS & REVENUE OVERSIGHT (Read Only)
              ================================================================ */}
          {activeTab === "orders" && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h2 className="profile-section-title">Marketplace Orders &amp; Revenue Oversight</h2>
                    <p className="profile-section-desc">
                      Every completed buyer checkout across SaaS MRKT is synced here live from the buyer orders ledger.{" "}
                      {orders.length > 0 && (
                        <>
                          <strong>{orders.length}</strong> order{orders.length === 1 ? "" : "s"} &bull;{" "}
                          <strong>${totalOrderValue.toLocaleString()}</strong> total order value.
                        </>
                      )}
                    </p>
                  </div>

                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search order, buyer, product, seller..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{ width: "280px" }}
                  />
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Order &amp; License</th>
                        <th>Buyer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Seller</th>
                        <th>Purchased</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", color: "#64748B", fontSize: "0.9rem", padding: "2.25rem" }}>
                            {orders.length === 0
                              ? "No marketplace orders yet. Orders appear here as soon as a buyer completes checkout."
                              : "No orders match your search."}
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <div className="listing-cell-main">
                                <strong style={{ color: "#0F172A", fontSize: "0.88rem" }}>{order.id}</strong>
                                <code style={{ fontSize: "0.75rem", color: "#4F46E5" }}>{order.licenseKey}</code>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong style={{ fontSize: "0.88rem", color: "#1E293B" }}>{order.buyerName}</strong>
                                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{order.buyerEmail}</div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong style={{ fontSize: "0.88rem", color: "#1E293B" }}>{order.productName}</strong>
                                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{order.category}</div>
                              </div>
                            </td>
                            <td>
                              <strong>${order.price}</strong> <span style={{ fontSize: "0.78rem", color: "#64748B" }}>/{order.period}</span>
                            </td>
                            <td>
                              <span className="admin-status-pill" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                                {getPaymentMethodLabel(order.paymentMethod)}
                              </span>
                            </td>
                            <td style={{ fontSize: "0.85rem", color: "#475569" }}>{order.sellerName}</td>
                            <td>
                              <span style={{ fontSize: "0.82rem", color: "#64748B" }}>
                                {new Date(order.purchasedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                            </td>
                            <td>
                              <span className="admin-status-pill approved">✓ {order.status}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 5: CURATE HOME PAGE (Vendor-Uploaded Products ONLY)
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
                        All ({homeCatalogProducts.length})
                      </button>
                      <button
                        type="button"
                        className={`admin-btn-action ${homeFilter === "live" ? "status-toggle" : "view"}`}
                        onClick={() => setHomeFilter("live")}
                      >
                        Live on Home ({homeLiveCount})
                      </button>
                      <button
                        type="button"
                        className={`admin-btn-action ${homeFilter === "not-live" ? "status-toggle" : "view"}`}
                        onClick={() => setHomeFilter("not-live")}
                      >
                        Available ({homeCatalogProducts.length - homeLiveCount})
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
