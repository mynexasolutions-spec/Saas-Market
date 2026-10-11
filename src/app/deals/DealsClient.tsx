"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";

interface SaaSDeal {
  id: string;
  productId: string;
  productName: string;
  category: string;
  logo: string;
  brandColor: string;
  tagline: string;
  badge: string;
  badgeType: "ltd" | "discount" | "credits";
  originalPrice: number;
  dealPrice: number;
  dealPeriod: string;
  discountPercentage: number;
  couponCode: string;
  expiresIn: string;
  claimedPercent: number;
  description: string;
}

export default function DealsClient() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [emailAlert, setEmailAlert] = useState<string>("");
  const [subscribedToast, setSubscribedToast] = useState<boolean>(false);

  // Curated deals referencing existing products
  const DEALS_DATA: SaaSDeal[] = useMemo(() => [
    {
      id: "deal-growthflow",
      productId: "prod-growthflow",
      productName: "GrowthFlow",
      category: "CRM & Sales",
      logo: "/images/logos/dealflow.jpg",
      brandColor: "#8B5CF6",
      tagline: "All-in-one CRM for sales pipelines and automated lead tracking",
      badge: "60% OFF ANNUAL",
      badgeType: "discount",
      originalPrice: 29,
      dealPrice: 11.6,
      dealPeriod: "mo (billed yearly)",
      discountPercentage: 60,
      couponCode: "GROWTH60",
      expiresIn: "3 days left",
      claimedPercent: 78,
      description: "Get unlimited pipeline stages, automated email cadence tracking, and lead scoring at 60% off.",
    },
    {
      id: "deal-taskflow",
      productId: "prod-taskflow",
      productName: "TaskFlow",
      category: "Project Management",
      logo: "/images/logos/taskflow.jpg",
      brandColor: "#6366F1",
      tagline: "Agile sprints, docs wikis, and multiplayer engineering roadmaps",
      badge: "LIFETIME PASS",
      badgeType: "ltd",
      originalPrice: 228,
      dealPrice: 79,
      dealPeriod: "one-time (lifetime access)",
      discountPercentage: 65,
      couponCode: "TASKLIFETIME",
      expiresIn: "5 days left",
      claimedPercent: 92,
      description: "Pay once and unlock all TaskFlow PRO features for up to 5 team members with lifetime updates.",
    },
    {
      id: "deal-manage360",
      productId: "prod-manage360",
      productName: "Manage360",
      category: "HR & Payroll",
      logo: "/images/logos/manage360.jpg",
      brandColor: "#2563EB",
      tagline: "Complete HRMS, tax compliance, and automated payroll system",
      badge: "50% OFF FIRST YEAR",
      badgeType: "discount",
      originalPrice: 29,
      dealPrice: 14.5,
      dealPeriod: "mo for 12 months",
      discountPercentage: 50,
      couponCode: "HR50NOW",
      expiresIn: "6 days left",
      claimedPercent: 64,
      description: "Automate biometric attendance and multi-state compliance filing at half the regular subscription fee.",
    },
    {
      id: "deal-finmate",
      productId: "prod-finmate",
      productName: "FinMate",
      category: "Finance & Accounting",
      logo: "/images/logos/finmate.jpg",
      brandColor: "#10B981",
      tagline: "Automated bookkeeping, ledger reconciliation, and runway forecasting",
      badge: "LIFETIME DEAL",
      badgeType: "ltd",
      originalPrice: 420,
      dealPrice: 129,
      dealPeriod: "one-time payment",
      discountPercentage: 69,
      couponCode: "FINLTD2026",
      expiresIn: "48 hours left",
      claimedPercent: 88,
      description: "Eliminate recurring accounting subscription fees with this verified lifetime founder pass.",
    },
    {
      id: "deal-mailboost",
      productId: "prod-mailboost",
      productName: "MailBoost",
      category: "Marketing & Email",
      logo: "/images/logos/mailboost.jpg",
      brandColor: "#F59E0B",
      tagline: "Behavioral lifecycle email marketing and conversion flows",
      badge: "70% OFF Q1",
      badgeType: "discount",
      originalPrice: 24,
      dealPrice: 7.2,
      dealPeriod: "mo for 3 months",
      discountPercentage: 70,
      couponCode: "BOOST70",
      expiresIn: "4 days left",
      claimedPercent: 55,
      description: "Access unlimited email sends, visual flow builder, and spam score analyzer at a fraction of cost.",
    },
    {
      id: "deal-supportly",
      productId: "prod-supportly",
      productName: "Supportly",
      category: "Customer Support",
      logo: "/images/logos/supportly.jpg",
      brandColor: "#6366F1",
      tagline: "Shared inbox, omnichannel live chat, and AI knowledgebase",
      badge: "$300 CREDITS",
      badgeType: "credits",
      originalPrice: 39,
      dealPrice: 0,
      dealPeriod: "with $300 startup credit",
      discountPercentage: 100,
      couponCode: "SUPPORTFREE",
      expiresIn: "Limited 30 codes",
      claimedPercent: 82,
      description: "Claim $300 in free platform credits on Supportly directly through the SaaS MRKT partner program.",
    },
  ], []);

  const handleCopy = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailAlert) {
      setSubscribedToast(true);
      setEmailAlert("");
      setTimeout(() => setSubscribedToast(false), 3500);
    }
  };

  const filteredDeals = useMemo(() => {
    return DEALS_DATA.filter((deal) => {
      const matchesSearch =
        deal.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "all") return true;
      if (activeTab === "ltd") return deal.badgeType === "ltd";
      if (activeTab === "discounts") return deal.discountPercentage >= 50 && deal.badgeType === "discount";
      if (activeTab === "credits") return deal.badgeType === "credits";
      return true;
    });
  }, [DEALS_DATA, searchQuery, activeTab]);

  return (
    <PageLayout activeNav="products" noContainer>
      {/* Hero Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)",
          color: "#ffffff",
          padding: "4.5rem 1.5rem 3.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(239, 68, 68, 0.2)",
              color: "#FCA5A5",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "9999px",
              padding: "0.35rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            <span>🔥</span> Verified SaaS Deals &amp; Lifetime Discounts
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              letterSpacing: "-0.03em",
            }}
          >
            Save up to 70% on <span style={{ color: "#818CF8" }}>World-Class Software</span>
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#CBD5E1",
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Access exclusive coupon codes, limited lifetime deals, and vetted startup discounts backed by the SaaS MRKT 30-day escrow guarantee.
          </p>

          {/* Quick Search & Filter Controls */}
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <input
              type="text"
              placeholder="Search deals by software name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.9rem 1.25rem 0.9rem 3rem",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                color: "#ffffff",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <svg
              style={{ position: "absolute", left: "1.1rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {[
            { id: "all", label: "All Active Deals" },
            { id: "ltd", label: "💎 Lifetime Deals (LTD)" },
            { id: "discounts", label: "🏷️ 50%+ Price Cuts" },
            { id: "credits", label: "🎁 Free Startup Credits" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "9999px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: activeTab === tab.id ? "1px solid var(--primary)" : "1px solid var(--slate-200)",
                background: activeTab === tab.id ? "var(--primary)" : "#ffffff",
                color: activeTab === tab.id ? "#ffffff" : "var(--slate-700)",
                boxShadow: activeTab === tab.id ? "0 4px 12px rgba(79, 70, 229, 0.25)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Deals Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                border: "1px solid var(--slate-200)",
                padding: "1.75rem",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {/* Badge & Expiration */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <span
                  style={{
                    background:
                      deal.badgeType === "ltd"
                        ? "linear-gradient(135deg, #8B5CF6, #6366F1)"
                        : deal.badgeType === "credits"
                        ? "linear-gradient(135deg, #10B981, #059669)"
                        : "linear-gradient(135deg, #EF4444, #DC2626)",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "8px",
                    letterSpacing: "0.03em",
                  }}
                >
                  {deal.badge}
                </span>

                <span style={{ fontSize: "0.8rem", color: "#EA580C", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {deal.expiresIn}
                </span>
              </div>

              {/* Product Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: deal.brandColor,
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Image src={deal.logo} alt={deal.productName} fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>
                    {deal.productName}
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--slate-500)", fontWeight: 500 }}>
                    {deal.category}
                  </div>
                </div>
              </div>

              <p style={{ color: "var(--slate-600)", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 1.25rem", flexGrow: 1 }}>
                {deal.description}
              </p>

              {/* Progress Bar */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--slate-500)", marginBottom: "0.35rem" }}>
                  <span>Claimed: {deal.claimedPercent}%</span>
                  <span>{100 - deal.claimedPercent}% available</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--slate-100)", borderRadius: "9999px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${deal.claimedPercent}%`,
                      height: "100%",
                      background: deal.claimedPercent > 85 ? "#EF4444" : "var(--primary)",
                      borderRadius: "9999px",
                    }}
                  />
                </div>
              </div>

              {/* Pricing Box */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: "14px",
                  padding: "0.9rem 1.1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                  border: "1px solid var(--slate-100)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", textDecoration: "line-through", color: "var(--slate-400)", fontWeight: 600 }}>
                    ${deal.originalPrice}
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--slate-900)" }}>
                    ${deal.dealPrice}
                    <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--slate-500)" }}> / {deal.dealPeriod}</span>
                  </div>
                </div>

                <div
                  style={{
                    background: "#ECFDF5",
                    color: "#059669",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                  }}
                >
                  Save {deal.discountPercentage}%
                </div>
              </div>

              {/* Coupon Code Strip */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#EFF6FF",
                  border: "1px dashed #3B82F6",
                  borderRadius: "10px",
                  padding: "0.5rem 0.85rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ fontSize: "0.82rem", color: "#1E40AF" }}>
                  Code: <strong style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{deal.couponCode}</strong>
                </div>
                <button
                  onClick={() => handleCopy(deal.couponCode)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #BFDBFE",
                    borderRadius: "6px",
                    padding: "0.25rem 0.6rem",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#1D4ED8",
                    cursor: "pointer",
                  }}
                >
                  {copiedCode === deal.couponCode ? "Copied! ✓" : "Copy Code"}
                </button>
              </div>

              {/* CTA Button */}
              <Link
                href={`/products/${deal.productId}/buy`}
                style={{
                  background: "var(--primary)",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                }}
              >
                Claim This Deal
              </Link>
            </div>
          ))}
        </div>

        {/* Newsletter Deal Alerts */}
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            borderRadius: "24px",
            padding: "3rem 2rem",
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#818CF8",
              marginBottom: "0.5rem",
            }}
          >
            Never Miss a Price Drop
          </div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 0.75rem", color: "#ffffff" }}>
            Get Instant VIP Alerts on Secret Lifetime Deals
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "540px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Join 12,000+ founders and CTOs who receive our Friday deal digest. Zero spam, 100% curated discounts.
          </p>

          <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.75rem", maxWidth: "480px", margin: "0 auto" }}>
            <input
              type="email"
              required
              placeholder="Enter your work email..."
              value={emailAlert}
              onChange={(e) => setEmailAlert(e.target.value)}
              style={{
                flex: 1,
                padding: "0.85rem 1.25rem",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "var(--primary)",
                color: "#ffffff",
                padding: "0.85rem 1.5rem",
                borderRadius: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Get Alerts
            </button>
          </form>

          {subscribedToast && (
            <div style={{ marginTop: "1rem", color: "#34D399", fontWeight: 600, fontSize: "0.9rem" }}>
              ✓ You are subscribed! We will send new verified deals straight to your inbox.
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
