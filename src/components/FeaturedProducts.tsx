"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  convertVendorListingToProductItem,
  type VendorSaaSListing,
} from "@/utils/vendorProducts";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  logo?: string;
  price: number;
  period: string;
  brandColor: string;
  brandLetter: string;
  features: string[];
  topBadge?: string;
  tags?: string[];
}

export const FEATURED_PRODUCTS_LIST: ProductItem[] = [
  {
    id: "prod-manage360",
    name: "Manage360",
    category: "HR & Payroll",
    rating: 4.8,
    reviewCount: 3200,
    description: "Complete HRMS for modern teams with payroll, attendance and more.",
    image: "/images/manage360.jpg",
    logo: "/images/logos/manage360.jpg",
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
      "Seamless integrations with Slack and QuickBooks",
    ],
  },
  {
    id: "prod-taskflow",
    name: "TaskFlow",
    category: "Project Management",
    rating: 4.9,
    reviewCount: 5100,
    description: "All-in-one workspace for notes, docs, sprints and task management.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 19,
    period: "mo",
    brandColor: "#6366F1",
    brandLetter: "T",
    topBadge: "Top Rated",
    tags: ["Productivity", "Collaboration"],
    features: [
      "Flexible Kanban, Gantt, and Sprint workflows",
      "Real-time team chat and document sharing",
      "AI-driven task estimation and deadlines",
      "Over 100+ automation templates",
    ],
  },
  {
    id: "prod-finmate",
    name: "FinMate",
    category: "Accounting & Finance",
    rating: 4.7,
    reviewCount: 1800,
    description: "Simple and powerful accounting and reconciliation for growing companies.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 35,
    period: "mo",
    brandColor: "#10B981",
    brandLetter: "F",
    topBadge: "Trending",
    tags: ["Accounting", "Finance"],
    features: [
      "Smart multi-currency invoice generation",
      "Automated bank feed reconciliation",
      "Comprehensive profit & loss reporting",
      "Built-in recurring subscription billing",
    ],
  },
  {
    id: "prod-mailboost",
    name: "MailBoost",
    category: "Marketing",
    rating: 4.6,
    reviewCount: 1500,
    description: "All-in-one email marketing, behavioral flows and lifecycle automation.",
    image: "/images/mailboost.jpg",
    logo: "/images/logos/mailboost.jpg",
    price: 25,
    period: "mo",
    brandColor: "#F97316",
    brandLetter: "M",
    topBadge: "Popular",
    tags: ["Marketing", "Email Ops"],
    features: [
      "Drag-and-drop responsive email builder",
      "Behavioral segmentation and triggers",
      "High deliverability with dedicated IPs",
      "Detailed open-rate and CTR heatmaps",
    ],
  },
  {
    id: "prod-supportly",
    name: "Supportly",
    category: "Customer Support",
    rating: 4.8,
    reviewCount: 2400,
    description: "Provide amazing customer support with omnichannel AI assistance.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 19,
    period: "mo",
    brandColor: "#8B5CF6",
    brandLetter: "S",
    topBadge: "Top Rated",
    tags: ["Customer Support", "Helpdesk"],
    features: [
      "Omnichannel inbox (Email, Chat, WhatsApp)",
      "AI bot auto-responses for common questions",
      "Customer satisfaction CSAT analytics",
      "Custom SLA rule management",
    ],
  },
  {
    id: "prod-dealflow",
    name: "DealFlow",
    category: "CRM & Sales",
    rating: 4.9,
    reviewCount: 4200,
    description: "Close deals faster with intelligent predictive sales CRM pipelines.",
    image: "/images/dealflow.jpg",
    logo: "/images/logos/dealflow.jpg",
    price: 39,
    period: "mo",
    brandColor: "#EF4444",
    brandLetter: "D",
    topBadge: "Verified",
    tags: ["CRM & Sales", "Pipelines"],
    features: [
      "Visual sales pipeline with drag-and-drop deals",
      "Automated email sequences & smart follow-ups",
      "Lead scoring with predictive AI",
      "Real-time revenue forecast analytics",
    ],
  },
  {
    id: "prod-cloudguard",
    name: "CloudGuard",
    category: "Security & Compliance",
    rating: 4.9,
    reviewCount: 3800,
    description: "Automated cloud security posture management and compliance auditor.",
    image: "/images/security-compliance-dashboard.jpg",
    logo: "/images/logos/cloudguard.jpg",
    price: 49,
    period: "mo",
    brandColor: "#0EA5E9",
    brandLetter: "C",
    topBadge: "Verified",
    tags: ["Cloud Security", "Compliance"],
    features: [
      "Continuous multi-cloud security posture monitoring",
      "Automated SOC 2, HIPAA & ISO 27001 audit readiness",
      "Real-time vulnerability detection and auto-remediation",
      "Zero-trust identity access and role compliance checks",
    ],
  },
  {
    id: "prod-analytica",
    name: "Analytica",
    category: "Analytics & BI",
    rating: 4.8,
    reviewCount: 2900,
    description: "Real-time product analytics, cohort retention and funnel tracking.",
    image: "/images/enterprise-growth-feature.jpg",
    logo: "/images/logos/analytica.jpg",
    price: 32,
    period: "mo",
    brandColor: "#10B981",
    brandLetter: "A",
    topBadge: "Trending",
    tags: ["Analytics", "Dashboards"],
    features: [
      "Interactive event tracking without engineering setup",
      "Behavioral cohort retention and churn heatmaps",
      "Self-serve SQL and drag-and-drop funnel builder",
      "Automated weekly executive KPI digest alerts",
    ],
  },
];

interface FeaturedProductsProps {
  onViewProduct: (prod: ProductItem) => void;
  searchFilter: string;
  categoryFilter: string;
  onResetFilters?: () => void;
}

export default function FeaturedProducts({
  onViewProduct,
  searchFilter,
  categoryFilter,
  onResetFilters,
}: FeaturedProductsProps) {
  const [productsList, setProductsList] = useState<ProductItem[]>(FEATURED_PRODUCTS_LIST);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      const response = await fetch("/api/catalog", { cache:"no-store" });
      if(!response.ok) throw new Error("Featured catalog unavailable.");
      const data: {listings: VendorSaaSListing[];featuredIds:string[]} = await response.json();
      if(active)setProductsList(data.featuredIds.flatMap(id=>{
        const listing=data.listings.find(p=>p.id===id);
        return listing ? [convertVendorListingToProductItem(listing)] : [];
      }));
    };
    void load().catch(()=>{if(active)setProductsList([]);});
    window.addEventListener("focus",load);
    return ()=>{active=false;window.removeEventListener("focus",load);};
  }, []);

  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      window.location.hash = "#featured";
      const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="Search"]');
      searchInputs.forEach((input) => {
        (input as HTMLInputElement).value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
  };

  // Filter based on search query or category
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      !categoryFilter ||
      p.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="featured-section" id="featured">
      {/* 3D Atmospheric Background */}
      <div className="featured-bg" aria-hidden="true">
        <svg
          className="featured-bg-waves"
          viewBox="0 0 1440 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="featWaveLeft" x1="0%" y1="0%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ede9fe" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="featWaveRight" x1="100%" y1="20%" x2="30%" y2="80%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-50 -20 C 120 40, 240 240, 160 480 C 100 660, -20 740, -50 820 L -100 820 L -100 -20 Z"
            fill="url(#featWaveLeft)"
          />
          <path
            d="M1490 60 C 1320 180, 1260 360, 1340 560 C 1410 720, 1470 780, 1500 840 L 1520 840 L 1520 60 Z"
            fill="url(#featWaveRight)"
          />
        </svg>

        {/* Dot matrix grids */}
        <div className="featured-dots featured-dots-tl" />
        <div className="featured-dots featured-dots-br" />

        {/* Ambient background glow orbs */}
        <span className="featured-orb featured-orb-1" />
        <span className="featured-orb featured-orb-2" />
      </div>

      <div className="container featured-inner">
        {/* Header Row with Centered Title & Right-Aligned Action Pill */}
        <div className="featured-header-wrapper">
          <div className="featured-header-center">
            <div className="section-badge featured-badge" id="featured-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="featured-badge-star" style={{ marginRight: "6px" }}>
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#6366F1" stroke="#6366F1" />
              </svg>
              <span>FEATURED PRODUCTS</span>
            </div>
            <h2 className="section-title">
              Featured <span className="section-title-highlight section-title-accent">SaaS Products</span>
            </h2>
            <p className="section-subtitle">
              Handpicked SaaS tools to help you work smarter and grow faster.
            </p>
          </div>

          {/* Right-Aligned Action Bar: View All Products */}
          <div className="featured-top-action-bar">
            <Link href="/products" className="view-all-link featured-view-all-pill" id="view-all-products-link">
              <span>View All Products</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "6px" }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Grid or Empty State Showcase Card */}
        <div className="featured-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  id={product.id}
                  className="product-card saas-discovery-card"
                  onClick={() => onViewProduct(product)}
                >
                  {/* Product Preview Image Banner — Clean & Unobstructed */}
                  <div className="discovery-card-image-wrap">
                    <Image
                      src={product.image}
                      alt={`${product.name} dashboard preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                      className="discovery-card-img"
                      unoptimized={product.image.startsWith("data:")}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="discovery-card-body">
                    {/* Header Row: Logo & Name on Left, Status Badge on Right */}
                    <div className="discovery-card-header-row">
                      <div className="discovery-card-brand-group">
                        {product.logo ? (
                          <div className="discovery-card-logo-wrap">
                            <Image
                              src={product.logo}
                              alt={`${product.name} logo`}
                              width={30}
                              unoptimized={product.logo.startsWith("data:")}
                              height={30}
                              className="discovery-card-logo-img"
                            />
                          </div>
                        ) : (
                          <div
                            className="discovery-card-logo"
                            style={{ backgroundColor: product.brandColor }}
                          >
                            {product.brandLetter}
                          </div>
                        )}
                        <h3 className="discovery-card-title">{product.name}</h3>
                      </div>

                      <span className={`discovery-top-badge ${
                        product.topBadge === "Trending"
                          ? "badge-trending"
                          : product.topBadge === "Popular"
                          ? "badge-popular"
                          : product.topBadge === "Verified"
                          ? "badge-verified"
                          : "badge-top-rated"
                      }`}>
                        {product.topBadge || "Top Rated"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="discovery-card-desc">{product.description}</p>

                    {/* Dedicated Badges Row: Attractive pills in single row */}
                    <div className="discovery-badges-row">
                      {(product.tags || [product.category]).slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
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
                        <span className="discovery-price-amount">${product.price}</span>
                      </div>

                      <div className="discovery-rating-inline">
                        <span className="discovery-stars">★</span>
                        <span className="discovery-rating-score">
                          {typeof product.rating === "number" ? product.rating.toFixed(1) : product.rating}
                        </span>
                        <span className="discovery-rating-count">
                          ({product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(1)}K` : product.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Primary CTA Button */}
                    <button
                      type="button"
                      className="discovery-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProduct(product);
                      }}
                    >
                      View Basic Info
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="featured-empty-card" style={{ gridColumn: "1 / -1" }}>
              {/* 3D Floating Glossy Spheres matching reference */}
              <div className="featured-sphere featured-sphere-left" aria-hidden="true" />
              <div className="featured-sphere featured-sphere-right" aria-hidden="true" />

              {/* 3D Isometric Empty Box Illustration matching reference image */}
              <div className="featured-empty-illustration" aria-hidden="true">
                <svg width="280" height="150" viewBox="0 0 280 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5F3FF" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="boxLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333EA" />
                      <stop offset="100%" stopColor="#7E22CE" />
                    </linearGradient>
                    <linearGradient id="boxRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#6D28D9" />
                    </linearGradient>
                    <linearGradient id="boxFlapFrontLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C4B5FD" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                    <linearGradient id="boxFlapFrontRight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#DDD6FE" />
                      <stop offset="100%" stopColor="#C4B5FD" />
                    </linearGradient>
                    <filter id="lensGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.28" />
                    </filter>
                  </defs>

                  {/* Cloud Blob Backdrop */}
                  <path
                    d="M 50 80 C 45 50, 75 35, 105 45 C 120 22, 165 20, 185 42 C 205 35, 235 50, 230 80 C 245 92, 238 120, 215 125 L 65 125 C 40 125, 40 95, 50 80 Z"
                    fill="url(#cloudGrad)"
                  />

                  {/* Horizontal decorative speed pills on left */}
                  <rect x="36" y="80" width="26" height="4.5" rx="2.25" fill="#DDD6FE" opacity="0.8" />
                  <rect x="26" y="92" width="18" height="4.5" rx="2.25" fill="#EDE9FE" opacity="0.8" />

                  {/* 3 Radiating Sparkle Rays above open box */}
                  <line x1="122" y1="44" x2="114" y2="28" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="140" y1="40" x2="140" y2="22" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="158" y1="44" x2="166" y2="28" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

                  {/* 3D Isometric Open Box */}
                  {/* Box interior shadow */}
                  <polygon points="98,72 140,54 182,72 140,90" fill="#4C1D95" />

                  {/* Box back flaps */}
                  <polygon points="98,72 140,54 130,40 88,56" fill="#DDD6FE" />
                  <polygon points="140,54 182,72 192,56 150,40" fill="#EDE9FE" />

                  {/* Box Left Front Face */}
                  <polygon points="98,72 140,92 140,132 98,112" fill="url(#boxLeftGrad)" />

                  {/* Box Right Front Face */}
                  <polygon points="140,92 182,72 182,112 140,132" fill="url(#boxRightGrad)" />

                  {/* Box front flaps (angled outward) */}
                  <polygon points="98,72 140,92 120,105 78,84" fill="url(#boxFlapFrontLeft)" />
                  <polygon points="140,92 182,72 202,84 160,105" fill="url(#boxFlapFrontRight)" />

                  {/* Dashed curved trail to the right */}
                  <path
                    d="M 205 60 C 220 75, 222 98, 238 90 C 248 84, 258 90, 264 96"
                    fill="none"
                    stroke="#C4B5FD"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                  />

                  {/* Floating Circular Search Lens Badge */}
                  <g filter="url(#lensGlow)">
                    <circle cx="202" cy="50" r="17" fill="#FFFFFF" />
                    <circle cx="200" cy="48" r="6" stroke="#6366F1" strokeWidth="2.2" fill="none" />
                    <line x1="204.5" y1="52.5" x2="209" y2="57" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>

              {/* Empty State Text matching reference image */}
              <p className="featured-empty-text">
                No SaaS products found matching &ldquo;{searchFilter || categoryFilter || " "}&rdquo;.
              </p>

              {/* Reset Filters Pill Button */}
              <button
                type="button"
                className="featured-reset-btn"
                id="featured-reset-filters-btn"
                onClick={handleResetFilters}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="reset-circle-icon">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
                </svg>
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
