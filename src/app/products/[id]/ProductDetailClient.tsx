"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ProductItem, getSimilarProducts } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

interface ProductDetailClientProps {
  product: ProductItem;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { user, openAuth } = useAuth();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("product-detail-page-active");
    return () => {
      document.body.classList.remove("product-detail-page-active");
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    setToastMsg(msg);

    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactModalOpen(false);
    showToast(`Inquiry sent to ${product.sellerName || "the seller"}! They will reach out soon.`);
    setContactForm({ name: "", email: "", message: "" });
  };

  const similarProducts = getSimilarProducts(product);

  // Fallback defaults for rich specs
  const listedDate = product.listedDate || "12 Sep 2024";
  const pricingModel = product.pricingModel || (product.price ? `$${product.price}/mo` : "Subscription");
  const targetAudience = product.targetAudience || "Small & Medium Businesses";
  const hqLocation = product.hqLocation || "United States";
  const sellerName = product.sellerName || "Alex Carter";
  const sellerInitials = product.sellerInitials || "AC";
  const sellerMemberSince = product.sellerMemberSince || "Member since Jan 2023";
  const sellerVerified = product.sellerVerified !== undefined ? product.sellerVerified : true;
  const aboutText =
    product.aboutText ||
    `${product.name} is an all-in-one platform designed to help modern growing teams streamline workflows, automate repetitive tasks, close deals, and deliver exceptional experiences — all in one connected workspace.`;

  const keyFeatures =
    product.keyFeaturesList && product.keyFeaturesList.length > 0
      ? product.keyFeaturesList
      : [
          {
            title: "Lead Management",
            description: "Capture, organize and track all your leads in one place.",
            icon: "users",
            iconBg: "rgba(59, 130, 246, 0.12)",
            iconColor: "#2563EB",
          },
          {
            title: "Email Marketing",
            description: "Create and automate email campaigns to engage customers.",
            icon: "mail",
            iconBg: "rgba(236, 72, 153, 0.12)",
            iconColor: "#DB2777",
          },
          {
            title: "Sales Pipeline",
            description: "Visualize and manage your deals from start to close.",
            icon: "pipeline",
            iconBg: "rgba(16, 185, 129, 0.12)",
            iconColor: "#059669",
          },
          {
            title: "Workflow Automation",
            description: "Automate repetitive tasks and save time.",
            icon: "automation",
            iconBg: "rgba(249, 115, 22, 0.12)",
            iconColor: "#EA580C",
          },
          {
            title: "Analytics & Reports",
            description: "Get detailed insights and reports to grow your business.",
            icon: "analytics",
            iconBg: "rgba(139, 92, 246, 0.12)",
            iconColor: "#7C3AED",
          },
          {
            title: "Customer Support",
            description: "Manage customer inquiries and tickets efficiently.",
            icon: "support",
            iconBg: "rgba(234, 179, 8, 0.12)",
            iconColor: "#CA8A04",
          },
        ];

  const techStackList = product.techStack || ["Next.js", "React", "Node.js", "AWS"];

  // Helper icon renderer
  const renderFeatureIcon = (type: string, color: string) => {
    switch (type) {
      case "users":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "mail":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );
      case "pipeline":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        );
      case "automation":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="m4.93 4.93 2.83 2.83" />
            <path d="m16.24 16.24 2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
      case "analytics":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        );
      case "support":
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        );
    }
  };

  return (
    <PageLayout activeNav="products">
      <div className="product-detail-page-container">
        {/* Breadcrumb Navigation */}
        <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="crumb-link">
            Home
          </Link>
          <span className="crumb-separator">&gt;</span>
          <Link href="/products" className="crumb-link">
            Products
          </Link>
          <span className="crumb-separator">&gt;</span>
          <span className="crumb-current">{product.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="detail-hero-card">
          <div className="detail-hero-grid">
            {/* Left Column: Product Info */}
            <div className="detail-hero-left">
              {/* Product Logo / Icon */}
              <div
                className="detail-hero-logo"
                style={{
                  background:
                    product.logo
                      ? "transparent"
                      : `linear-gradient(135deg, ${product.brandColor} 0%, #4338CA 100%)`,
                }}
              >
                {product.logo ? (
                  <Image
                    src={product.logo}
                    alt={`${product.name} logo`}
                    width={72}
                    height={72}
                    className="detail-logo-img"
                  />
                ) : (
                  <span className="detail-logo-fallback">{product.brandLetter}</span>
                )}
              </div>

              {/* Title & Tagline */}
              <h1 className="detail-hero-title">{product.name}</h1>
              <p className="detail-hero-tagline">
                {product.tagline || product.description}
              </p>

              {/* Basic Idea of the Project */}
              <p className="detail-hero-idea">
                {product.aboutText ||
                  (product.description && product.description !== product.tagline
                    ? product.description
                    : `${product.name} provides modern teams with intuitive tools to streamline ${product.category} operations, unify communication, and automate workflows in a single workspace.`)}
              </p>

              {/* Tags Row */}
              <div className="detail-tags-row">
                {(product.tags && product.tags.length > 0
                  ? product.tags
                  : [product.category, "SaaS", "Automation"]
                ).map((tag, idx) => (
                  <span key={idx} className="detail-tag-badge">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Seller Information Box */}
              <div className="detail-seller-box">
                <div className="detail-seller-avatar">{sellerInitials}</div>
                <div className="detail-seller-info">
                  <div className="detail-seller-name-row">
                    <span className="detail-seller-label">Listed by</span>
                    <strong className="detail-seller-name">{sellerName}</strong>
                    {sellerVerified && (
                      <span className="detail-verified-badge">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Verified Seller
                      </span>
                    )}
                  </div>
                  <span className="detail-seller-date">{sellerMemberSince}</span>
                </div>
              </div>

              {/* Product Price & Rating */}
              <div className="detail-hero-price-row">
                <span className="detail-hero-price-amount">
                  ${product.price !== undefined ? product.price : 29}
                </span>
                <div className="detail-rating-row">
                  <span className="detail-stars">★★★★★</span>
                  <span className="detail-rating-score">
                    {typeof product.rating === "number" ? product.rating.toFixed(1) : product.rating}
                  </span>
                  <span className="detail-rating-count">
                    ({product.reviewCount >= 1000
                      ? `${(product.reviewCount / 1000).toFixed(1)}K`
                      : product.reviewCount}{" "}
                    reviews)
                  </span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="detail-actions-row">
                <button
                  type="button"
                  className="detail-btn-secondary"
                  onClick={() => setContactModalOpen(true)}
                >
                  Contact Seller
                </button>

                <Link
                  href={`/products/${product.id}/details`}
                  className="detail-btn-lock"
                  id="detail-see-more-btn"
                  style={{ textDecoration: "none" }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span>See More Detail</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Screenshot Preview & Moving Balls Area */}
            <div className="detail-hero-right">
              <div className="detail-preview-frame">
                <Image
                  src={product.image}
                  alt={`${product.name} dashboard preview`}
                  width={680}
                  height={440}
                  priority
                  className="detail-preview-image"
                />
              </div>

              {/* Bouncing Balls Moving in this Area */}
              <div className="detail-hero-moving-stage" aria-label="Playful balls moving and bouncing">
                <div className="ball-walker walker-one">
                  <div className="bouncing-sphere ball-one" />
                </div>
                <div className="ball-walker walker-two">
                  <div className="bouncing-sphere ball-two" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Ribbon (5 horizontal cards with SVG icons) */}
        <div className="detail-stats-ribbon">
          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <span className="detail-stat-label">Listed on</span>
              <strong className="detail-stat-value">{listedDate}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <span className="detail-stat-label">Pricing Model</span>
              <strong className="detail-stat-value">{pricingModel}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#D97706" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
            </div>
            <div>
              <span className="detail-stat-label">Category</span>
              <strong className="detail-stat-value">{product.category}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#E11D48" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <span className="detail-stat-label">Target Audience</span>
              <strong className="detail-stat-value">{targetAudience}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(14, 165, 233, 0.1)", color: "#0284C7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <span className="detail-stat-label">HQ Location</span>
              <strong className="detail-stat-value">{hqLocation}</strong>
            </div>
          </div>
        </div>

        {/* Section: Product Information */}
        <section className="detail-section" id="product-information">
          <div className="detail-section-header-left">
            <h2 className="detail-section-title">Product Information</h2>
            <p className="detail-section-subtitle">
              Key details about this SaaS product.
            </p>
          </div>

          <div className="detail-info-card">
            <div className="detail-info-grid">
              {/* Left Specs Column */}
              <div className="detail-info-col">
                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Pricing Model</span>
                    <strong className="detail-info-val">Subscription (Monthly / Annual)</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#D97706" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                      <path d="M7 7h.01" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Category</span>
                    <strong className="detail-info-val">{product.category}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Target Audience</span>
                    <strong className="detail-info-val">{targetAudience}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(100, 116, 139, 0.1)", color: "#475569" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Business Model</span>
                    <strong className="detail-info-val">SaaS</strong>
                  </div>
                </div>
              </div>

              {/* Right Specs Column */}
              <div className="detail-info-col">
                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Launch Date</span>
                    <strong className="detail-info-val">{product.launchDate || "2022"}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Annual Revenue</span>
                    <strong className="detail-info-val">$148,500 / yr</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#7C3AED" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                      <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
                      <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Team Size</span>
                    <strong className="detail-info-val">{product.teamSize || "5 - 10"}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Tech Stack</span>
                    <div className="detail-tech-badges">
                      {techStackList.map((tech, idx) => (
                        <span key={idx} className="detail-tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Key Features */}
        <section className="detail-section">
          <div className="detail-section-header-center">
            <h2 className="detail-section-title">Key Features</h2>
            <p className="detail-section-subtitle">
              Powerful features to help you manage and grow your business.
            </p>
          </div>

          <div className="detail-features-grid">
            {keyFeatures.map((feat, idx) => (
              <div key={idx} className="detail-feature-card">
                <div
                  className="detail-feature-icon-box"
                  style={{ backgroundColor: feat.iconBg || "rgba(99, 102, 241, 0.12)" }}
                >
                  {renderFeatureIcon(feat.icon, feat.iconColor || "#6366F1")}
                </div>
                <h3 className="detail-feature-title">{feat.title}</h3>
                <p className="detail-feature-desc">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Similar SaaS Products */}
        <section className="detail-section">
          <div className="detail-section-header-center">
            <h2 className="detail-section-title">Similar SaaS Products</h2>
            <p className="detail-section-subtitle">
              Explore other popular tools you might be interested in.
            </p>
          </div>

          <div className="detail-similar-grid">
            {similarProducts.map((sim) => (
              <div
                key={sim.id}
                className="product-card saas-discovery-card"
                onClick={() => router.push(`/products/${sim.id}`)}
              >
                {/* Product Preview Image Banner */}
                <div className="discovery-card-image-wrap">
                  <Image
                    src={sim.image || "/images/taskflow.jpg"}
                    alt={`${sim.name} dashboard preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                    className="discovery-card-img"
                  />
                </div>

                {/* Card Body */}
                <div className="discovery-card-body">
                  {/* Header Row: Logo & Name on Left, Status Badge on Right */}
                  <div className="discovery-card-header-row">
                    <div className="discovery-card-brand-group">
                      {sim.logo ? (
                        <div className="discovery-card-logo-wrap">
                          <Image
                            src={sim.logo}
                            alt={`${sim.name} logo`}
                            width={30}
                            height={30}
                            className="discovery-card-logo-img"
                          />
                        </div>
                      ) : (
                        <div
                          className="discovery-card-logo"
                          style={{ backgroundColor: sim.brandColor || "#6366F1" }}
                        >
                          {sim.brandLetter || sim.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="discovery-card-title">{sim.name}</h3>
                    </div>

                    <span
                      className={`discovery-top-badge ${
                        sim.topBadge === "Trending"
                          ? "badge-trending"
                          : sim.topBadge === "Popular"
                          ? "badge-popular"
                          : sim.topBadge === "Verified"
                          ? "badge-verified"
                          : "badge-top-rated"
                      }`}
                    >
                      {sim.topBadge || "Top Rated"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="discovery-card-desc">{sim.description}</p>

                  {/* Dedicated Badges Row: Attractive pills */}
                  <div className="discovery-badges-row">
                    {(sim.tags && sim.tags.length > 0 ? sim.tags : [sim.category]).slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="discovery-tag-pill"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price & Rating Row */}
                  <div className="discovery-meta-row">
                    <div className="discovery-price-group">
                      <span className="discovery-price-amount">${sim.price}</span>
                    </div>

                    <div className="discovery-rating-inline">
                      <span className="discovery-stars">★</span>
                      <span className="discovery-rating-score">
                        {typeof sim.rating === "number" ? sim.rating.toFixed(1) : sim.rating}
                      </span>
                      <span className="discovery-rating-count">
                        ({sim.reviewCount >= 1000
                          ? `${(sim.reviewCount / 1000).toFixed(1)}K`
                          : sim.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="button"
                    className="discovery-btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${sim.id}`);
                    }}
                  >
                    View Basic Info
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Explore More Callout (Text only, no card container or button) */}
          <div className="detail-explore-callout">
            <h3 className="detail-explore-title">Looking for more software solutions?</h3>
            <p className="detail-explore-text">
              Browse our full marketplace of 50+ verified tools across productivity, sales, marketing, and finance to power your team.
            </p>
          </div>
        </section>
      </div>

      {/* Contact Seller Modal */}
      {contactModalOpen && (
        <div className="detail-modal-overlay" onClick={() => setContactModalOpen(false)}>
          <div
            className="detail-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-modal-header">
              <h3>Contact Seller ({sellerName})</h3>
              <button
                type="button"
                className="detail-modal-close"
                onClick={() => setContactModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className="detail-modal-desc">
              Have questions about <strong>{product.name}</strong>? Send a message directly to the verified seller.
            </p>

            <form onSubmit={handleContactSubmit} className="detail-modal-form">
              <div className="detail-form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>

              <div className="detail-form-group">
                <label>Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>

              <div className="detail-form-group">
                <label>Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder={`Hi ${sellerName}, I am interested in ${product.name} and would like to learn more...`}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <div className="detail-modal-actions">
                <button
                  type="button"
                  className="detail-modal-btn-cancel"
                  onClick={() => setContactModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="detail-modal-btn-send">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Toast Notification Popup: Portaled to document.body for zero clipping */}
      {mounted &&
        toastMsg &&
        createPortal(
          <div
            className="toast-notice toast-notice--lock"
            role="status"
            aria-live="polite"
          >
            <span className="toast-notice-lock-badge">🔒</span>
            <span>{toastMsg}</span>
          </div>,
          document.body
        )}
    </PageLayout>
  );
}
