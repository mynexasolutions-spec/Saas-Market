"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { FEATURED_PRODUCTS_LIST, ProductItem } from "@/components/FeaturedProducts";
import ProductModal from "@/components/ProductModal";

const CATEGORIES = [
  { label: "All Products", value: "" },
  { label: "HR & Payroll", value: "HR & Payroll" },
  { label: "Project Management", value: "Project Management" },
  { label: "Accounting & Finance", value: "Accounting & Finance" },
  { label: "Marketing", value: "Marketing" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Developer Tools", value: "Developer Tools" },
  { label: "CRM & Sales", value: "CRM & Sales" },
];

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

// Extend the product list with extra placeholder products for the page
const EXTENDED_PRODUCTS: ProductItem[] = [
  ...FEATURED_PRODUCTS_LIST,
  {
    id: "prod-crmpro",
    name: "CRM Pro",
    category: "CRM & Sales",
    rating: 4.7,
    reviewCount: 243,
    description: "Intelligent CRM to close deals faster with AI-powered follow-ups.",
    image: "/images/crmpro.jpg",
    price: 39,
    period: "month",
    brandColor: "#EF4444",
    brandLetter: "C",
    features: [
      "Visual sales pipeline with drag-drop stages",
      "AI-powered email follow-up suggestions",
      "Deal probability scoring",
      "Revenue forecasting dashboards",
    ],
  },
  {
    id: "prod-devhub",
    name: "DevHub",
    category: "Developer Tools",
    rating: 4.9,
    reviewCount: 631,
    description: "The all-in-one dev platform: CI/CD, monitoring, and code review.",
    image: "/images/devhub.jpg",
    price: 49,
    period: "month",
    brandColor: "#1E293B",
    brandLetter: "D",
    features: [
      "One-click CI/CD pipeline builder",
      "Real-time performance monitoring",
      "Automated code review bots",
      "Multi-cloud deployment support",
    ],
  },
  {
    id: "prod-analytica",
    name: "Analytica",
    category: "Marketing",
    rating: 4.6,
    reviewCount: 187,
    description: "Marketing analytics and attribution platform for data-driven teams.",
    image: "/images/analytica.jpg",
    price: 45,
    period: "month",
    brandColor: "#0891B2",
    brandLetter: "A",
    features: [
      "Multi-touch attribution modeling",
      "Cross-channel campaign analytics",
      "Predictive audience segmentation",
      "Custom KPI dashboard builder",
    ],
  },
];

export default function ProductsPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = EXTENDED_PRODUCTS.filter((p) => {
    const matchesCat = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <PageLayout activeNav="products">
      {/* Page Hero */}
      <section className="products-hero">
        <div className="container">
          <div className="products-hero-content">
            <div className="section-badge">MARKETPLACE</div>
            <h1 className="products-hero-title">
              Discover the Best <span className="section-title-highlight">SaaS Tools</span>
            </h1>
            <p className="products-hero-subtitle">
              Browse {EXTENDED_PRODUCTS.length}+ handpicked SaaS products across every category. Compare, try, and buy with confidence.
            </p>
            <div className="products-search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="products-search-input"
                type="text"
                placeholder="Search tools, categories, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="products-search-input"
              />
            </div>
          </div>
        </div>
        <div className="products-hero-blob products-hero-blob--1" />
        <div className="products-hero-blob products-hero-blob--2" />
      </section>

      {/* Main Content */}
      <section className="products-main">
        <div className="container">
          <div className="products-layout">
            {/* Sidebar Filters */}
            <aside className="products-sidebar">
              <div className="products-filter-card">
                <h3 className="products-filter-title">Categories</h3>
                <ul className="products-filter-list">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.value}>
                      <button
                        id={`cat-filter-${cat.value.toLowerCase().replace(/[^a-z]/g, "-") || "all"}`}
                        className={`products-filter-item${selectedCategory === cat.value ? " products-filter-item--active" : ""}`}
                        onClick={() => setSelectedCategory(cat.value)}
                      >
                        <span>{cat.label}</span>
                        <span className="products-filter-count">
                          {EXTENDED_PRODUCTS.filter((p) => !cat.value || p.category === cat.value).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="products-filter-card">
                <h3 className="products-filter-title">Price Range</h3>
                <div className="products-price-range">
                  <div className="products-price-row">
                    <input type="number" placeholder="Min $" className="products-price-input" id="price-min" defaultValue={0} min={0} />
                    <span>–</span>
                    <input type="number" placeholder="Max $" className="products-price-input" id="price-max" defaultValue={200} min={0} />
                  </div>
                </div>
              </div>

              <div className="products-filter-card">
                <h3 className="products-filter-title">Rating</h3>
                {[4.5, 4, 3.5].map((r) => (
                  <label key={r} className="products-rating-label">
                    <input type="radio" name="rating-filter" id={`rating-filter-${r}`} />
                    <span style={{ color: "#F59E0B" }}>{"★".repeat(Math.floor(r))}</span>
                    <span> {r}+ stars</span>
                  </label>
                ))}
              </div>
            </aside>

            {/* Product Grid */}
            <div className="products-content">
              {/* Top Bar */}
              <div className="products-topbar">
                <p className="products-result-count">
                  Showing <strong>{filtered.length}</strong> products
                </p>
                <div className="products-sort-row">
                  <label htmlFor="products-sort" className="products-sort-label">Sort by:</label>
                  <select
                    id="products-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="products-sort-select"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="blog-empty-state">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p>No products found matching &ldquo;{searchQuery}&rdquo;</p>
                  <button className="btn-primary" onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filtered.map((product) => {
                    const isSaved = !!bookmarks[product.id];
                    return (
                      <div
                        key={product.id}
                        id={product.id}
                        className="product-card"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div>
                          <div className="product-card-top">
                            <div className="product-brand-group">
                              <div className="product-logo-box" style={{ backgroundColor: product.brandColor }}>
                                {product.brandLetter}
                              </div>
                              <div className="product-meta-header">
                                <h3 className="product-name">{product.name}</h3>
                                <span className="product-category-tag">{product.category}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`bookmark-btn${isSaved ? " saved" : ""}`}
                              onClick={(e) => toggleBookmark(product.id, e)}
                              aria-label={`Bookmark ${product.name}`}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "#EC4899" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            </button>
                          </div>
                          <div className="product-rating-row">
                            <span style={{ color: "#F59E0B" }}>★</span>
                            <span className="product-rating-score">{product.rating.toFixed(1)}</span>
                            <span className="product-rating-count">({product.reviewCount})</span>
                          </div>
                          <p className="product-snippet">{product.description}</p>
                        </div>
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
                  })}
                </div>
              )}

              {/* Pagination */}
              {filtered.length > 0 && (
                <div className="products-pagination">
                  <button className="products-page-btn products-page-btn--active" id="page-1">1</button>
                  <button className="products-page-btn" id="page-2">2</button>
                  <button className="products-page-btn" id="page-3">3</button>
                  <span className="products-page-ellipsis">…</span>
                  <button className="products-page-btn" id="page-next">Next</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Submit Your Product CTA */}
      <section className="products-seller-cta">
        <div className="container">
          <div className="products-seller-cta-inner">
            <div>
              <h2 className="products-seller-cta-title">Have a SaaS product to list?</h2>
              <p className="products-seller-cta-sub">Join 500+ sellers reaching 50,000+ qualified buyers on SaaS MRKT.</p>
            </div>
            <Link href="/pricing" className="btn-primary products-seller-cta-btn" id="products-list-product-btn">
              List Your Product
            </Link>
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectPlan={(prod) => {
          setSelectedProduct(null);
          showToast(`Started free trial for ${prod.name}! Check your inbox.`);
        }}
      />

      {toastMsg && (
        <div className="toast-notice" role="status">
          <span>⚡</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </PageLayout>
  );
}

