"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";
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

const EXTENDED_PRODUCTS: ProductItem[] = ALL_PRODUCTS;

const ITEMS_PER_PAGE = 18;

export default function ProductsPageClient() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
    const anchor = document.getElementById("products-content-top");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const handleCategorySelect = (catValue: string) => {
    setSelectedCategory(catValue);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    setCurrentPage(1);
  };

  return (
    <PageLayout activeNav="products" noContainer>
      <div className="products-animated-page-wrapper">
        {/* Dynamic Animated Colorful Ambient Background Canvas */}
        <div className="products-bg-mesh" aria-hidden="true">
          <div className="products-mesh-orb orb-purple" />
          <div className="products-mesh-orb orb-cyan" />
          <div className="products-mesh-orb orb-pink" />
          <div className="products-mesh-orb orb-amber" />
          <div className="products-mesh-orb orb-emerald" />
          <div className="products-mesh-grid-pattern" />
          <div className="products-floating-particles">
            <span className="particle p1" />
            <span className="particle p2" />
            <span className="particle p3" />
            <span className="particle p4" />
            <span className="particle p5" />
          </div>
        </div>

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
                          onClick={() => handleCategorySelect(cat.value)}
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
                {/* Top Bar with Integrated Search & Sort */}
                <div className="products-topbar" id="products-content-top">
                  <p className="products-result-count">
                    <span className="result-count-indicator" />
                    Showing&nbsp;<strong>{filtered.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}</strong>&nbsp;of&nbsp;<strong>{filtered.length}</strong>&nbsp;products
                  </p>

                  <div className="products-topbar-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="topbar-search-icon">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      id="products-search-input"
                      type="text"
                      placeholder="Search tools by name, features..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="products-topbar-search-input"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="topbar-search-clear"
                        onClick={() => handleSearchChange("")}
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="products-sort-row">
                    <label htmlFor="products-sort" className="products-sort-label">Sort by:</label>
                    <select
                      id="products-sort"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
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
                  <button className="btn-primary" onClick={() => { setSearchQuery(""); setSelectedCategory(""); setCurrentPage(1); }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {paginatedProducts.map((product) => {
                    return (
                      <div
                        key={product.id}
                        id={product.id}
                        className="product-card saas-discovery-card"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        {/* Product Preview Image Banner */}
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

                            <span
                              className={`discovery-top-badge ${
                                product.topBadge === "Trending"
                                  ? "badge-trending"
                                  : product.topBadge === "Popular"
                                  ? "badge-popular"
                                  : product.topBadge === "Verified"
                                  ? "badge-verified"
                                  : "badge-top-rated"
                              }`}
                            >
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
                                {typeof product.rating === "number"
                                  ? product.rating.toFixed(1)
                                  : product.rating}
                              </span>
                              <span className="discovery-rating-count">
                                ({product.reviewCount >= 1000
                                  ? `${(product.reviewCount / 1000).toFixed(1)}K`
                                  : product.reviewCount})
                              </span>
                            </div>
                          </div>

                          {/* Primary CTA Button */}
                          <button
                            type="button"
                            className="discovery-btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/products/${product.id}`);
                            }}
                          >
                            View Basic Info
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Interactive Pagination */}
              {totalPages > 1 && (
                <div className="products-pagination" role="navigation" aria-label="Products pagination">
                  {validPage > 1 && (
                    <button
                      type="button"
                      className="products-page-btn"
                      id="page-prev"
                      onClick={() => handlePageChange(validPage - 1)}
                      aria-label="Previous page"
                    >
                      Prev
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`products-page-btn${validPage === pageNum ? " products-page-btn--active" : ""}`}
                      id={`page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      aria-label={`Page ${pageNum}`}
                      aria-current={validPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="products-page-btn"
                    id="page-next"
                    disabled={validPage === totalPages}
                    onClick={() => handlePageChange(validPage + 1)}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Overview Editorial Paragraphs */}
      <section className="products-directory-info-section">
        <div className="container">
          <div className="products-directory-info-card">
            <h2 className="products-directory-info-title">
              About Our Verified SaaS Marketplace Directory
            </h2>
            <div className="products-directory-info-content">
              <p>
                SaaS MRKT is built to simplify how modern teams discover, evaluate, and acquire top-tier business software. 
                Instead of navigating fragmented pricing tiers and biased sponsor listings, our directory curates high-impact SaaS tools 
                across core operational departments including HR &amp; Payroll, CRM &amp; Sales, Project Management, Developer Tools, 
                and Finance.
              </p>
              <p>
                Each software application featured on our platform includes real-time user ratings, transparent pricing details, 
                and verified user feedback. Whether you are an early-stage startup looking for your first productivity stack or an enterprise 
                streamlining software expenditures, SaaS MRKT empowers your team to make confident, data-backed software choices with speed.
              </p>
            </div>
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
      </div>
    </PageLayout>
  );
}

