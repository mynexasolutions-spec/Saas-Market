"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  price: number;
  period: string;
  brandColor: string;
  brandLetter: string;
  features: string[];
}

export const FEATURED_PRODUCTS_LIST: ProductItem[] = [
  {
    id: "prod-manage360",
    name: "Manage360",
    category: "HR & Payroll",
    rating: 4.8,
    reviewCount: 320,
    description: "Complete HRMS for modern teams with payroll, attendance and more.",
    image: "/images/manage360.jpg",
    price: 29,
    period: "month",
    brandColor: "#2563EB",
    brandLetter: "M",
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
    reviewCount: 510,
    description: "Manage tasks, teams and projects with ease.",
    image: "/images/taskflow.jpg",
    price: 19,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "T",
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
    reviewCount: 180,
    description: "Simple and powerful accounting for growing businesses.",
    image: "/images/finmate.jpg",
    price: 35,
    period: "month",
    brandColor: "#10B981",
    brandLetter: "F",
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
    reviewCount: 158,
    description: "All-in-one email marketing automation platform.",
    image: "/images/mailboost.jpg",
    price: 25,
    period: "month",
    brandColor: "#F97316",
    brandLetter: "M",
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
    reviewCount: 158,
    description: "Provide amazing customer support with smart tools.",
    image: "/images/supportly.jpg",
    price: 19,
    period: "month",
    brandColor: "#8B5CF6",
    brandLetter: "S",
    features: [
      "Omnichannel inbox (Email, Chat, WhatsApp)",
      "AI bot auto-responses for common questions",
      "Customer satisfaction CSAT analytics",
      "Custom SLA rule management",
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
        {/* Header */}
        <div className="section-badge" id="featured-badge">
          FEATURED PRODUCTS
        </div>
        <div className="section-header-row">
          <p className="section-subtitle" style={{ marginTop: 0 }}>
            Handpicked SaaS tools to help you work smarter and grow faster.
          </p>
          <a href="#featured" className="view-all-link" id="view-all-products-link">
            <span>View All Products</span>
          </a>
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
                  className="product-card"
                  onClick={() => onViewProduct(product)}
                >
                  {/* Top Row: Brand Icon, Name, Category, Bookmark */}
                  <div>
                    <div className="product-card-top">
                      <div className="product-brand-group">
                        <div
                          className="product-logo-box"
                          style={{ backgroundColor: product.brandColor }}
                        >
                          {product.brandLetter}
                        </div>
                        <div className="product-meta-header">
                          <h3 className="product-name">{product.name}</h3>
                          <span className="product-category-tag">{product.category}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`bookmark-btn ${isSaved ? "saved" : ""}`}
                        onClick={(e) => toggleBookmark(product.id, e)}
                        aria-label={`Bookmark ${product.name}`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={isSaved ? "#EC4899" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Star Rating */}
                    <div className="product-rating-row">
                      <span style={{ color: "#F59E0B" }}>★</span>
                      <span className="product-rating-score">{product.rating.toFixed(1)}</span>
                      <span className="product-rating-count">({product.reviewCount})</span>
                    </div>

                    {/* Description Snippet */}
                    <p className="product-snippet">{product.description}</p>

                    {/* Preview UI Screenshot Frame */}
                    <div className="product-preview-frame">
                      <Image
                        src={product.image}
                        alt={`${product.name} interface dashboard preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, 240px"
                        className="product-preview-img"
                      />
                    </div>
                  </div>

                  {/* Card Bottom: Price & View Details */}
                  <div className="product-card-bottom">
                    <div>
                      <span className="product-price">${product.price}</span>
                      <span className="product-price-term">/{product.period}</span>
                    </div>

                    <span className="product-details-btn">
                      <span>View Details</span>
                    </span>
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
