"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
];

interface FeaturedProductsProps {
  onViewProduct: (prod: ProductItem) => void;
  searchFilter: string;
  categoryFilter: string;
}

export default function FeaturedProducts({
  onViewProduct,
  searchFilter,
  categoryFilter,
}: FeaturedProductsProps) {
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter based on search query or category
  const filteredProducts = FEATURED_PRODUCTS_LIST.filter((p) => {
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
      <div className="container">
        {/* Centered Section Header */}
        <div className="featured-header-center">
          <div className="section-badge" id="featured-badge">
            FEATURED PRODUCTS
          </div>
          <h2 className="section-title">Featured SaaS Products</h2>
          <p className="section-subtitle">
            Handpicked SaaS tools to help you work smarter and grow faster.
          </p>
        </div>

        {/* Right-Aligned Action Bar on its own line below subtitle */}
        <div className="featured-top-action-bar">
          <Link href="/products" className="view-all-link" id="view-all-products-link">
            <span>View All Products</span>
          </Link>
        </div>

        {/* 5 Cards Grid */}
        <div className="featured-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isSaved = !!bookmarks[product.id];
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
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "16px" }}>
              <p style={{ color: "var(--slate-500)", fontSize: "1.1rem" }}>
                No SaaS products found matching &ldquo;{searchFilter || categoryFilter}&rdquo;.
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  window.location.hash = "#featured";
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
