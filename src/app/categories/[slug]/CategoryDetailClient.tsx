"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { CategoryDetailData, CategoryProduct } from "@/data/categoriesData";
import { BlogPostData } from "@/app/blog/[slug]/page";
import "./category-detail.css";

interface CategorySummary {
  id: string;
  name: string;
  count: number;
  group: string;
}

interface CategoryDetailClientProps {
  category: CategoryDetailData;
  allCategories: CategorySummary[];
  relatedBlogs?: BlogPostData[];
}

export default function CategoryDetailClient({
  category,
  allCategories,
  relatedBlogs = [],
}: CategoryDetailClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedProduct, setSelectedProduct] =
    useState<CategoryProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedTools, setSavedTools] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedTools((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(
        next[id]
          ? "Saved to your shortlisted tools!"
          : "Removed from shortlisted tools",
      );
      return next;
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = category.products.filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q))
      );
    });

    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews") {
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [category.products, searchQuery, sortBy]);

  return (
    <PageLayout activeNav="categories">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="cat-toast" role="status">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="cat-detail-wrapper">
        {/* 1. Compact Hero Section (Exact /alternatives & /buyers scale) */}
        <section className="cat-detail-hero">
          <div className="cat-detail-container">
            {/* Breadcrumbs (Exact /alternatives: 0.84rem) */}
            <nav aria-label="Breadcrumb" className="cat-breadcrumbs">
              <Link href="/" className="cat-breadcrumb-link">
                Home
              </Link>
              <span className="cat-breadcrumb-sep">/</span>
              <Link href="/categories" className="cat-breadcrumb-link">
                Categories
              </Link>
              <span className="cat-breadcrumb-sep">/</span>
              <span className="cat-breadcrumb-current">{category.name}</span>
            </nav>

            <div className="cat-hero-content">
              <div className="cat-badge-pill">
                <span className="cat-badge-dot" />
                2026 VERIFIED BENCHMARK
              </div>

              <h1 className="cat-headline">{category.headline}</h1>

              <p className="cat-subheadline">{category.subheadline}</p>
            </div>

            {/* Quick Metrics Badges (Exact /alternatives .buyers-hero-trust-row: 0.95rem num, 0.73rem label) */}
            <div className="buyers-hero-trust-row">
              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-amber">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">{category.stats.avgRating} / 5.0</span>
                  <span className="buyers-trust-label">Category Avg. Score</span>
                </div>
              </div>

              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-blue">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">{category.stats.verifiedReviews}</span>
                  <span className="buyers-trust-label">Verified User Reviews</span>
                </div>
              </div>

              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-purple">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">{category.stats.startingPrice}</span>
                  <span className="buyers-trust-label">Starting Price</span>
                </div>
              </div>

              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-green">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">{category.stats.freeTrialPct}</span>
                  <span className="buyers-trust-label">Free Trial Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Content Area */}
        <section className="cat-detail-main">
          <div className="cat-detail-container">
            {/* Controls Bar: Search & Sort (Exact /alternatives directory style) */}
            <div className="cat-controls-bar">
              <div className="cat-controls-left">
                <span className="cat-results-title">
                  Showing {filteredProducts.length} Ranked {category.name} Solutions
                </span>
                <span className="cat-editorial-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Zero-bias editorial review
                </span>
              </div>

              <div className="cat-controls-right">
                {/* Search Box (Exact /alternatives: 0.92rem font) */}
                <div className="cat-search-box">
                  <svg
                    className="cat-search-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="cat-search-input"
                    placeholder={`Search ${category.name}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label={`Search ${category.name}`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="cat-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <select
                  className="cat-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="reviews">Sort: Most Reviews</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products List */}
            {filteredProducts.length === 0 ? (
              <div className="cat-empty-state">
                <p className="cat-empty-title">
                  No tools found matching &ldquo;{searchQuery}&rdquo; in {category.name}.
                </p>
                <button
                  type="button"
                  className="cat-empty-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Search Filter
                </button>
              </div>
            ) : (
              <div className="cat-products-list">
                {filteredProducts.map((prod, idx) => {
                  const isBookmarked = !!savedTools[prod.id];
                  return (
                    <div
                      key={prod.id}
                      id={`product-card-${prod.id}`}
                      className="cat-product-card"
                    >
                      {/* Left: Rank & Logo */}
                      <div className="cat-card-left">
                        <span className="cat-card-rank">#{idx + 1}</span>
                        <div
                          className="cat-card-logo"
                          style={{
                            backgroundColor: prod.brandColor,
                            boxShadow: `0 4px 14px ${prod.brandColor}33`,
                          }}
                        >
                          {prod.brandLetter}
                        </div>
                      </div>

                      {/* Middle: Details */}
                      <div className="cat-card-body">
                        <div className="cat-card-title-row">
                          <h2 className="cat-card-name">{prod.name}</h2>

                          {prod.verified && (
                            <span
                              className="cat-card-verified"
                              title="Verified SaaS Vendor"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                              Verified
                            </span>
                          )}

                          {prod.badge && (
                            <span className="cat-card-badge">{prod.badge}</span>
                          )}
                        </div>

                        {/* Ratings & Trial Meta (Exact /alternatives: 0.84rem) */}
                        <div className="cat-card-meta-row">
                          <span className="cat-card-score">
                            ★ {prod.rating.toFixed(1)}
                          </span>
                          <span className="cat-card-meta-sep">•</span>
                          <span className="cat-card-reviews">
                            {prod.reviewCount} customer reviews
                          </span>
                          <span className="cat-card-meta-sep">•</span>
                          <span className="cat-card-trial">
                            {prod.trialDays}-Day Free Trial
                          </span>
                        </div>

                        <p className="cat-card-desc">{prod.description}</p>

                        {/* Features Grid */}
                        <div className="cat-card-features-grid">
                          {prod.features.map((feat, fi) => (
                            <div key={fi} className="cat-card-feature-item">
                              <svg
                                className="cat-card-feature-icon"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Pros Tags */}
                        {prod.pros && prod.pros.length > 0 && (
                          <div className="cat-card-pros-row">
                            <span className="cat-card-pros-label">
                              Why users love it:
                            </span>
                            {prod.pros.map((pro, pi) => (
                              <span key={pi} className="cat-card-pro-tag">
                                ✓ {pro}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Pricing & CTAs (Exact /alternatives & /buyers scale) */}
                      <div className="cat-card-right">
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(prod.id, e)}
                          title={
                            isBookmarked
                              ? "Remove bookmark"
                              : "Bookmark this software"
                          }
                          className={`cat-card-bookmark-btn ${
                            isBookmarked ? "bookmarked" : ""
                          }`}
                          aria-label={
                            isBookmarked ? "Remove bookmark" : "Bookmark software"
                          }
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={isBookmarked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>

                        <div className="cat-card-price-group">
                          <div className="cat-card-price-lbl">Starting at</div>
                          <div className="cat-card-price-amount">${prod.price}</div>
                          <div className="cat-card-price-period">
                            per {prod.period}
                          </div>
                        </div>

                        <div className="cat-card-actions">
                          <button
                            type="button"
                            className="cat-card-btn-primary"
                            onClick={() =>
                              showToast(`Starting free trial for ${prod.name}...`)
                            }
                          >
                            Try {prod.trialDays} Days Free
                          </button>
                          <button
                            type="button"
                            className="cat-card-btn-secondary"
                            onClick={() => setSelectedProduct(prod)}
                          >
                            Inspect Specs
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Educational Buyer's Guide Section */}
            <div className="cat-guide-box">
              <div className="cat-guide-header">
                <div className="cat-guide-pill">Procurement Guide</div>
                <h2 className="cat-guide-title">{category.buyingGuide.title}</h2>
                <p className="cat-guide-desc">
                  {category.buyingGuide.description}
                </p>
              </div>

              <div className="cat-factors-grid">
                {category.buyingGuide.keyFactors.map((factor, i) => (
                  <div key={i} className="cat-factor-card">
                    <div className="cat-factor-num">0{i + 1}</div>
                    <h3 className="cat-factor-title">{factor.title}</h3>
                    <p className="cat-factor-desc">{factor.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Interactive FAQ Accordion */}
            <div className="cat-faq-section">
              <div className="cat-faq-header">
                <span className="cat-faq-pill">Frequently Asked Questions</span>
                <h2 className="cat-faq-title">
                  Common Questions About {category.name} Software
                </h2>
              </div>

              <div className="cat-faq-list">
                {category.faqs.map((faq, fIdx) => {
                  const isOpen = openFaq === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className={`cat-faq-item ${isOpen ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="cat-faq-btn"
                        onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span
                          className={`cat-faq-chevron ${isOpen ? "open" : ""}`}
                        >
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="cat-faq-answer">{faq.answer}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Related In-Depth Guides / Blog Articles */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <div className="cat-articles-section">
                <div className="cat-articles-header">
                  <div>
                    <span className="cat-articles-pill">
                      Expert Insights &amp; Tutorials
                    </span>
                    <h2 className="cat-articles-title">
                      Deep-Dive Articles for {category.name}
                    </h2>
                  </div>
                  <Link href="/blog" className="cat-articles-more">
                    View all articles →
                  </Link>
                </div>

                <div className="cat-articles-grid">
                  {relatedBlogs.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/blog/${b.slug}`}
                      className="cat-article-card"
                    >
                      <div
                        className="cat-article-banner"
                        style={{ background: b.gradient }}
                      >
                        <span className="cat-article-tag">{b.tag}</span>
                      </div>
                      <div className="cat-article-body">
                        <h3 className="cat-article-name">{b.title}</h3>
                        <p className="cat-article-excerpt">{b.excerpt}</p>
                        <div className="cat-article-meta">
                          <span>{b.author}</span>
                          <span>{b.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Explore Other Software Categories */}
            <div className="cat-other-section">
              <div className="cat-other-header">
                <h3 className="cat-other-title">
                  Explore Other Software Categories
                </h3>
                <p className="cat-other-sub">
                  Compare verified solutions across the entire B2B software
                  ecosystem.
                </p>
              </div>

              <div className="cat-other-pills">
                {allCategories.map((c) => {
                  const isCurrent = c.id === category.id;
                  return (
                    <Link
                      key={c.id}
                      href={`/categories/${c.id}`}
                      className={`cat-other-pill ${isCurrent ? "active" : ""}`}
                    >
                      {c.name} ({c.count})
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 7. Cosmic High-Conversion CTA Banner (Exact /alternatives & /buyers)
            <section className="buyers-cta-banner">
              <div className="buyers-cta-content">
                <div className="buyers-cta-left">
                  <div className="buyers-cta-pill">LOOKING FOR THE RIGHT SOFTWARE?</div>
                  <h2 className="buyers-cta-title">
                    Find the best verified software in{" "}
                    <span className="buyers-cta-title-highlight">{category.name}</span>
                  </h2>
                  <p className="buyers-cta-desc">
                    Save weeks of opaque vendor demos. Compare verified pricing, user benchmarks, and secure your license with guaranteed escrow protection.
                  </p>
                  <div className="buyers-cta-actions">
                    <Link href="/products" className="buyers-btn-primary">
                      Browse Verified Products
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                    <Link href="/tools/saas-spend-calculator" className="buyers-btn-secondary">
                      Calculate SaaS Spend
                    </Link>
                  </div>
                </div>
              </div>
            </section> */}
          </div>
        </section>
      </div>

      {/* Product Spec Inspector Modal */}
      {selectedProduct && (
        <div
          className="cat-modal-backdrop"
          onClick={() => setSelectedProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cat-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cat-modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                marginBottom: "1.15rem",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "8px",
                  backgroundColor: selectedProduct.brandColor,
                  color: "#ffffff",
                  fontSize: "1.25rem",
                  fontWeight: 850,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px ${selectedProduct.brandColor}33`,
                }}
              >
                {selectedProduct.brandLetter}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.18rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    margin: 0,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {selectedProduct.name}
                </h3>
                <div
                  style={{
                    fontSize: "0.84rem",
                    color: "#4F46E5",
                    fontWeight: 700,
                  }}
                >
                  {category.name}
                </div>
              </div>
            </div>

            <p
              style={{
                color: "#64748B",
                lineHeight: 1.5,
                fontSize: "0.88rem",
                marginBottom: "1.15rem",
              }}
            >
              {selectedProduct.description}
            </p>

            <div style={{ marginBottom: "1.15rem" }}>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "#0F172A",
                  marginBottom: "0.5rem",
                }}
              >
                Feature Breakdown:
              </h4>
              <ul
                style={{
                  paddingLeft: "1.15rem",
                  margin: 0,
                  color: "#334155",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                {selectedProduct.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.85rem 1rem",
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                borderRadius: "6px",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    textTransform: "uppercase",
                    fontWeight: 650,
                  }}
                >
                  Pricing Model
                </div>
                <div
                  style={{
                    fontSize: "1.55rem",
                    fontWeight: 850,
                    color: "#0F172A",
                  }}
                >
                  ${selectedProduct.price}{" "}
                  <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                    /{selectedProduct.period}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    textTransform: "uppercase",
                    fontWeight: 650,
                  }}
                >
                  Trial Terms
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 750,
                    color: "#059669",
                  }}
                >
                  {selectedProduct.trialDays} Days Free
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.65rem" }}>
              <button
                type="button"
                className="cat-card-btn-primary"
                onClick={() => {
                  setSelectedProduct(null);
                  showToast(
                    `Redirecting to ${selectedProduct.name} free trial...`,
                  );
                }}
                style={{ flex: 1 }}
              >
                Start Free Trial
              </button>
              <button
                type="button"
                className="cat-card-btn-secondary"
                onClick={() => setSelectedProduct(null)}
                style={{ width: "auto" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
