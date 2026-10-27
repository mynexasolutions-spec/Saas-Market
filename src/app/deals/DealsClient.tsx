"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import "./deals-page.css";

interface SaaSDeal {
  id: string;
  productId: string;
  productName: string;
  category: string;
  logo: string;
  brandColor: string;
  badge: string;
  badgeType: "ltd" | "discount" | "credits";
  rating: number;
  reviewsCount: string;
  originalPrice: number;
  dealPrice: number;
  dealPeriod: string;
  discountPercentage: number;
  couponCode: string;
  expiresIn: string;
  endingDays: number;
  description: string;
  popularityScore: number;
}

export default function DealsClient() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("Most Popular");
  const [sortDropdownOpen, setSortDropdownOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [emailAlert, setEmailAlert] = useState<string>("");
  const [subscribedToast, setSubscribedToast] = useState<boolean>(false);

  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 9 Curated Deals exactly matching reference design
  const DEALS_DATA: SaaSDeal[] = useMemo(
    () => [
      {
        id: "deal-growthflow",
        productId: "prod-growthflow",
        productName: "GrowthFlow",
        category: "CRM & Sales",
        logo: "/images/logos/dealflow.jpg",
        brandColor: "#8B5CF6",
        badge: "60% OFF ANNUAL",
        badgeType: "discount",
        rating: 4.8,
        reviewsCount: "2.1K reviews",
        originalPrice: 29,
        dealPrice: 11.6,
        dealPeriod: "/mo (billed yearly)",
        discountPercentage: 60,
        couponCode: "GROWTH60",
        expiresIn: "3 days left",
        endingDays: 3,
        description: "Get unlimited pipeline stages, automated email cadence tracking, and lead scoring at 60% off.",
        popularityScore: 98,
      },
      {
        id: "deal-taskflow",
        productId: "prod-taskflow",
        productName: "TaskFlow",
        category: "Project Management",
        logo: "/images/logos/taskflow.jpg",
        brandColor: "#6366F1",
        badge: "LIFETIME PASS",
        badgeType: "ltd",
        rating: 4.9,
        reviewsCount: "5.1K reviews",
        originalPrice: 228,
        dealPrice: 79,
        dealPeriod: "/one-time (lifetime access)",
        discountPercentage: 65,
        couponCode: "TASKLIFETIME",
        expiresIn: "5 days left",
        endingDays: 5,
        description: "Pay once and unlock all TaskFlow PRO features for up to 5 team members with lifetime updates.",
        popularityScore: 99,
      },
      {
        id: "deal-manage360",
        productId: "prod-manage360",
        productName: "Manage360",
        category: "HR & Payroll",
        logo: "/images/logos/manage360.jpg",
        brandColor: "#2563EB",
        badge: "50% OFF FIRST YEAR",
        badgeType: "discount",
        rating: 4.8,
        reviewsCount: "3.2K reviews",
        originalPrice: 29,
        dealPrice: 14.5,
        dealPeriod: "/mo for 12 months",
        discountPercentage: 50,
        couponCode: "HR50NOW",
        expiresIn: "6 days left",
        endingDays: 6,
        description: "Automate biometric attendance and multi-state compliance filing at half the regular subscription fee.",
        popularityScore: 94,
      },
      {
        id: "deal-finmate",
        productId: "prod-finmate",
        productName: "FinMate",
        category: "Finance & Accounting",
        logo: "/images/logos/finmate.jpg",
        brandColor: "#10B981",
        badge: "LIFETIME DEAL",
        badgeType: "ltd",
        rating: 4.7,
        reviewsCount: "1.8K reviews",
        originalPrice: 420,
        dealPrice: 129,
        dealPeriod: "/one-time payment",
        discountPercentage: 69,
        couponCode: "FINLTD2026",
        expiresIn: "48 hours left",
        endingDays: 2,
        description: "Eliminate recurring accounting subscription fees with this verified lifetime founder pass.",
        popularityScore: 96,
      },
      {
        id: "deal-mailboost",
        productId: "prod-mailboost",
        productName: "MailBoost",
        category: "Marketing & Email",
        logo: "/images/logos/mailboost.jpg",
        brandColor: "#F59E0B",
        badge: "70% OFF Q1",
        badgeType: "discount",
        rating: 4.6,
        reviewsCount: "1.4K reviews",
        originalPrice: 24,
        dealPrice: 7.2,
        dealPeriod: "/mo for 3 months",
        discountPercentage: 70,
        couponCode: "BOOST70",
        expiresIn: "4 days left",
        endingDays: 4,
        description: "Access unlimited email sends, visual flow builder, and spam score analyzer at a fraction of cost.",
        popularityScore: 92,
      },
      {
        id: "deal-supportly",
        productId: "prod-supportly",
        productName: "Supportly",
        category: "Customer Support",
        logo: "/images/logos/supportly.jpg",
        brandColor: "#8B5CF6",
        badge: "$300 CREDITS",
        badgeType: "credits",
        rating: 4.9,
        reviewsCount: "2.9K reviews",
        originalPrice: 39,
        dealPrice: 0,
        dealPeriod: "/with $300 startup credit",
        discountPercentage: 100,
        couponCode: "SUPPORTFREE",
        expiresIn: "Limited 30 codes",
        endingDays: 1,
        description: "Claim $300 in free platform credits on Supportly directly through the SaaS MRKT partner program.",
        popularityScore: 97,
      },
      {
        id: "deal-designkit",
        productId: "prod-designkit",
        productName: "DesignKit",
        category: "Design & UX",
        logo: "",
        brandColor: "#A855F7",
        badge: "40% OFF",
        badgeType: "discount",
        rating: 4.8,
        reviewsCount: "1.2K reviews",
        originalPrice: 20,
        dealPrice: 12,
        dealPeriod: "/mo",
        discountPercentage: 40,
        couponCode: "DESIGN40",
        expiresIn: "2 days left",
        endingDays: 2,
        description: "All-in-one UI kit, wireframing, and prototyping tools for modern teams.",
        popularityScore: 89,
      },
      {
        id: "deal-datapeak",
        productId: "prod-datapeak",
        productName: "DataPeak",
        category: "Analytics & BI",
        logo: "/images/logos/analytica.jpg",
        brandColor: "#0284C7",
        badge: "LIFETIME DEAL",
        badgeType: "ltd",
        rating: 4.7,
        reviewsCount: "930 reviews",
        originalPrice: 199,
        dealPrice: 89,
        dealPeriod: "/one-time payment",
        discountPercentage: 55,
        couponCode: "DATAPEAK55",
        expiresIn: "7 days left",
        endingDays: 7,
        description: "Turn your data into insights with advanced analytics dashboards and lifetime access.",
        popularityScore: 90,
      },
      {
        id: "deal-cloudflex",
        productId: "prod-cloudflex",
        productName: "CloudFlex",
        category: "Cloud Infrastructure",
        logo: "/images/logos/cloudguard.jpg",
        brandColor: "#2563EB",
        badge: "35% OFF",
        badgeType: "discount",
        rating: 4.6,
        reviewsCount: "1.1K reviews",
        originalPrice: 49,
        dealPrice: 31.8,
        dealPeriod: "/mo",
        discountPercentage: 35,
        couponCode: "CLOUDFLEX35",
        expiresIn: "5 days left",
        endingDays: 5,
        description: "Deploy and manage cloud resources faster with simplified infrastructure tools.",
        popularityScore: 88,
      },
    ],
    []
  );

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
      setTimeout(() => setSubscribedToast(false), 4000);
    }
  };

  // Filter & Sort Logic
  const filteredDeals = useMemo(() => {
    const list = DEALS_DATA.filter((deal) => {
      const matchesSearch =
        deal.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "all") return true;
      if (activeTab === "ltd") return deal.badgeType === "ltd";
      if (activeTab === "discounts") return deal.discountPercentage >= 50 && deal.badgeType === "discount";
      if (activeTab === "credits") return deal.badgeType === "credits";
      if (activeTab === "ending") return deal.endingDays <= 3;
      return true;
    });

    // Apply Sorting
    return [...list].sort((a, b) => {
      if (selectedSort === "Highest Discount") {
        return b.discountPercentage - a.discountPercentage;
      }
      if (selectedSort === "Ending Soonest") {
        return a.endingDays - b.endingDays;
      }
      if (selectedSort === "Price: Low to High") {
        return a.dealPrice - b.dealPrice;
      }
      if (selectedSort === "Price: High to Low") {
        return b.dealPrice - a.dealPrice;
      }
      // default: Most Popular
      return b.popularityScore - a.popularityScore;
    });
  }, [DEALS_DATA, searchQuery, activeTab, selectedSort]);

  // Fallback / Custom SVG Brand Icon Renderer
  const renderBrandLogo = (deal: SaaSDeal) => {
    if (deal.logo) {
      return (
        <Image
          src={deal.logo}
          alt={deal.productName}
          fill
          sizes="44px"
          style={{ objectFit: "cover" }}
        />
      );
    }

    if (deal.id === "deal-designkit") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: deal.brandColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontWeight: 800,
          fontSize: "1.2rem",
        }}
      >
        {deal.productName.charAt(0)}
      </div>
    );
  };

  return (
    <PageLayout activeNav="products" noContainer>
      <div className="deals-page-wrapper">
        <div className="deals-container">
          {/* Hero Section: Centered Layout */}
          <section className="deals-hero-section">
            {/* Centered Hero Content */}
            <div className="deals-hero-left deals-hero-centered">
              <div className="deals-hero-badge">
                <span className="deals-hero-badge-icon">🔥</span>
                <span>Verified SaaS Deals</span>
              </div>

              <h1 className="deals-hero-title">
                Save up to 70% on <br />
                <span className="deals-hero-title-gradient">World-Class Software</span>
              </h1>

              <p className="deals-hero-desc">
                Access exclusive coupon codes, limited lifetime deals, and vetted startup discounts backed by the SaaS MRKT 30-day escrow guarantee.
              </p>

              {/* Full Pill Search Box with Purple Arrow Action Button */}
              <div className="deals-search-wrapper">
                <span className="deals-search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="deals-search-input"
                  placeholder="Search deals by software name, category, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search SaaS deals"
                />
                <button
                  className="deals-search-btn"
                  title="Search deals"
                  aria-label="Execute search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>

              {/* 4 Value Badges Row */}
              <div className="deals-hero-values-row">
                {/* 1. Verified Deals */}
                <div className="deals-value-item">
                  <div className="deals-value-icon icon-purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div className="deals-value-text">
                    <span className="deals-value-title">Verified Deals</span>
                    <span className="deals-value-sub">Manually checked</span>
                  </div>
                </div>

                {/* 2. Exclusive Discounts */}
                <div className="deals-value-item">
                  <div className="deals-value-icon icon-blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                  <div className="deals-value-text">
                    <span className="deals-value-title">Exclusive Discounts</span>
                    <span className="deals-value-sub">Up to 70% off</span>
                  </div>
                </div>

                {/* 3. Lifetime Access */}
                <div className="deals-value-item">
                  <div className="deals-value-icon icon-violet">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="deals-value-text">
                    <span className="deals-value-title">Lifetime Access</span>
                    <span className="deals-value-sub">One-time payment</span>
                  </div>
                </div>

                {/* 4. 30-Day Escrow */}
                <div className="deals-value-item">
                  <div className="deals-value-icon icon-indigo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="deals-value-text">
                    <span className="deals-value-title">30-Day Escrow</span>
                    <span className="deals-value-sub">Safe &amp; secure</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Filter Tabs & Sort Row */}
          <div className="deals-controls-bar">
            {/* 5 Filter Tabs */}
            <div className="deals-tabs-list" role="tablist">
              {[
                { id: "all", label: "★ All Deals (245)" },
                { id: "ltd", label: "💎 Lifetime Deals (LTD)" },
                { id: "discounts", label: "🏷 50%+ Price Cuts" },
                { id: "credits", label: "🎁 Free Startup Credits" },
                { id: "ending", label: "⏰ Ending Soon" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`deals-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="deals-sort-wrapper" ref={sortRef}>
              <button
                className="deals-sort-btn"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                aria-expanded={sortDropdownOpen}
                aria-haspopup="true"
              >
                <span>{selectedSort}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {sortDropdownOpen && (
                <div className="deals-sort-dropdown" role="menu">
                  {[
                    "Most Popular",
                    "Highest Discount",
                    "Ending Soonest",
                    "Price: Low to High",
                    "Price: High to Low",
                  ].map((option) => (
                    <button
                      key={option}
                      role="menuitem"
                      className={`deals-sort-option ${selectedSort === option ? "active" : ""}`}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortDropdownOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3x3 Deals Cards Grid */}
          <div className="deals-cards-grid">
            {filteredDeals.map((deal) => (
              <article key={deal.id} className="deal-card">
                {/* Top Strip: Badge & Timer */}
                <div className="deal-card-top-strip">
                  <span
                    className={`deal-badge-pill ${
                      deal.badgeType === "ltd"
                        ? "deal-badge-ltd"
                        : deal.badgeType === "credits"
                        ? "deal-badge-credits"
                        : "deal-badge-discount"
                    }`}
                  >
                    {deal.badge}
                  </span>

                  <span className="deal-timer-indicator">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {deal.expiresIn}
                  </span>
                </div>

                {/* Product Header: Logo + Name/Category + Rating */}
                <div className="deal-card-header">
                  <div className="deal-identity-group">
                    <div className="deal-logo-box">
                      {renderBrandLogo(deal)}
                    </div>
                    <div className="deal-info">
                      <h3 className="deal-name">{deal.productName}</h3>
                      <span className="deal-category">{deal.category}</span>
                    </div>
                  </div>

                  <div className="deal-rating-box">
                    <div className="deal-rating-score">
                      <span className="deal-star-icon">★</span>
                      <span>{deal.rating}</span>
                    </div>
                    <span className="deal-rating-count">({deal.reviewsCount})</span>
                  </div>
                </div>

                {/* Description */}
                <p className="deal-desc-text">{deal.description}</p>

                {/* Pricing Strip */}
                <div className="deal-pricing-row">
                  <div className="deal-pricing-left">
                    <span className="deal-old-price">${deal.originalPrice}</span>
                    <div className="deal-current-price-group">
                      <span className="deal-current-price">${deal.dealPrice}</span>
                      <span className="deal-period">{deal.dealPeriod}</span>
                    </div>
                  </div>

                  <span className="deal-save-badge">
                    Save {deal.discountPercentage}%
                  </span>
                </div>

                {/* Coupon Code Strip */}
                <div className="deal-code-strip">
                  <div className="deal-code-label">
                    Code:
                    <strong className="deal-code-strong">{deal.couponCode}</strong>
                  </div>
                  <button
                    onClick={() => handleCopy(deal.couponCode)}
                    className={`deal-copy-btn ${copiedCode === deal.couponCode ? "copied" : ""}`}
                    aria-label={`Copy code ${deal.couponCode}`}
                  >
                    {copiedCode === deal.couponCode ? (
                      <>
                        <span>Copied!</span>
                        <span>✓</span>
                      </>
                    ) : (
                      <>
                        <span>Copy</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/products/${deal.productId}`}
                  className="deal-claim-btn"
                >
                  <span>Claim This Deal</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>

          {/* Bottom Alerts Banner (Dark Cosmic Nebula Card) */}
          <section className="deals-alert-banner">
            <div className="deals-alert-content">
              {/* Left Column */}
              <div className="deals-alert-left">
                <span className="deals-alert-pill">NEVER MISS A DEAL</span>
                <h2 className="deals-alert-title">
                  Get Instant Alerts on Exclusive SaaS Deals
                </h2>
                <p className="deals-alert-desc">
                  Join 12,000+ founders and CTOs who receive our weekly deal digest. <br />
                  Be the first to access limited-time offers, price drops, and new lifetime deals.
                </p>
              </div>

              {/* Center Floating 3D Bell */}
              <div className="deals-alert-center-graphic">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>

              {/* Right Column: Form + Guarantees */}
              <div className="deals-alert-right">
                <form className="deals-alert-form" onSubmit={handleSubscribe}>
                  <span className="deals-alert-mail-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    className="deals-alert-input"
                    placeholder="Enter your email address..."
                    value={emailAlert}
                    onChange={(e) => setEmailAlert(e.target.value)}
                    aria-label="Email address for deal alerts"
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background: "transparent",
                    }}
                  />
                  <button type="submit" className="deals-alert-submit-btn">
                    <span>Get Alerts</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </form>

                {subscribedToast && (
                  <div className="deals-alert-toast">
                    ✓ You are subscribed! Exclusive alerts will arrive in your inbox.
                  </div>
                )}

                <div className="deals-alert-guarantees">
                  <div className="deals-guarantee-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>No spam</span>
                  </div>
                  <div className="deals-guarantee-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Unsubscribe anytime</span>
                  </div>
                  <div className="deals-guarantee-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Only verified deals</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
