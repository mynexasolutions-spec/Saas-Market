"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";
import ProductModal from "@/components/ProductModal";
import {
  getAllMarketplaceProducts,
  VENDOR_PRODUCTS_EVENT_KEY,
  VENDOR_PRODUCTS_STORAGE_KEY,
} from "@/utils/vendorProducts";
import "./products-page.css";

const CATEGORIES = [
  { label: "All Products", value: "" },
  { label: "HR & Payroll", value: "HR & Payroll" },
  { label: "Project Management", value: "Project Management" },
  { label: "Accounting & Finance", value: "Accounting & Finance" },
  { label: "Marketing", value: "Marketing" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Developer Tools", value: "Developer Tools" },
  { label: "CRM & Sales", value: "CRM & Sales" },
  { label: "Analytics & BI", value: "Analytics & BI" },
  { label: "Security & Compliance", value: "Security & Compliance" },
];

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

const PRICE_PRESETS = [
  { label: "All", min: "0", max: "200" },
  { label: "Free", min: "0", max: "0" },
  { label: "< $25", min: "0", max: "25" },
  { label: "< $50", min: "0", max: "50" },
  { label: "$100+", min: "100", max: "200" },
];

const ITEMS_PER_PAGE = 24;

const CARD_AVATARS = [
  "/images/avatars/alex.jpg",
  "/images/avatars/ayesha.jpg",
  "/images/avatars/david.jpg",
];

function CategoryIcon(): React.ReactElement {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

export default function ProductsPageClient() {
  const router = useRouter();
  const [productsList, setProductsList] = useState<ProductItem[]>(ALL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("200");
  const [minimumRating, setMinimumRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync vendor products from localStorage on mount and on update events
  useEffect(() => {
    const updateProducts = () => {
      setProductsList(getAllMarketplaceProducts());
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === VENDOR_PRODUCTS_STORAGE_KEY) updateProducts();
    };
    updateProducts();
    window.addEventListener(VENDOR_PRODUCTS_EVENT_KEY, updateProducts);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(VENDOR_PRODUCTS_EVENT_KEY, updateProducts);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = productsList.filter((p) => {
    const matchesCat = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
      Boolean(p.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesMinPrice = minPrice === "" || p.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || p.price <= Number(maxPrice);
    const matchesRating = minimumRating === null || p.rating >= minimumRating;
    return matchesCat && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return (Date.parse(b.listedDate || "") || 0) - (Date.parse(a.listedDate || "") || 0);
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

    const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (minPrice !== "0" || maxPrice !== "200" ? 1 : 0) +
    (minimumRating !== null ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory("");
    setMinPrice("0");
    setMaxPrice("200");
    setMinimumRating(null);
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    setCurrentPage(1);
  };

  return (
    <PageLayout activeNav="products" noContainer>
      <div className="products-animated-page-wrapper products-reference-page">
        <section className="products-marketplace-hero">
          <Image
            src="/product_banner.png"
            alt="SaaS analytics dashboard with flowing purple waves"
            fill
            priority
            sizes="100vw"
            className="products-marketplace-hero-image"
          />
          <div className="products-marketplace-hero-shade" aria-hidden="true" />
          <div className="container">
            <div className="products-marketplace-hero-content">
              <h1>
                Discover the Best{" "}
                <span>SaaS Tools</span> for Your Business
              </h1>
              <p>
                Compare trusted SaaS products, transparent pricing, and verified customer feedback to find the perfect tools for your team.
              </p>
              <div className="products-hero-trust-row" aria-label="Marketplace highlights">
                <div className="products-hero-trust-item">
                  <span className="products-hero-trust-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 2 4 6v12l8 4 8-4V6l-8-4Z" /><path d="m8 12 3 3 5-6" />
                    </svg>
                  </span>
                  <span><strong>{productsList.length}+</strong>SaaS Products</span>
                </div>
                <div className="products-hero-trust-item">
                  <span className="products-hero-trust-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span><strong>10K+</strong>Happy Businesses</span>
                </div>
                <div className="products-hero-trust-item">
                  <span className="products-hero-trust-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" />
                    </svg>
                  </span>
                  <span><strong>Verified</strong>Real Reviews</span>
                </div>
                <div className="products-hero-trust-item">
                  <span className="products-hero-trust-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 12h8M12 8v8" />
                    </svg>
                  </span>
                  <span><strong>Easy Compare</strong>Side by Side</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="products-main">
          <div className="container">
            <div className="products-layout">
              {/* Sidebar Filters */}
              <aside className="products-sidebar">
                <div className="products-sidebar-header">
                  <div className="sidebar-header-left">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sidebar-header-icon"
                      aria-hidden="true"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <span className="sidebar-header-title">Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="sidebar-active-badge">{activeFiltersCount}</span>
                    )}
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="sidebar-reset-btn"
                      title="Reset all filters"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="products-filter-card">
                  <h3 className="products-filter-title">Categories</h3>
                  <ul className="products-filter-list">
                    {CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.value;
                      const count = cat.value
                        ? productsList.filter((product) => product.category === cat.value).length
                        : productsList.length;
                      return (
                        <li key={cat.value}>
                          <button
                            id={`cat-filter-${cat.value.toLowerCase().replace(/[^a-z]/g, "-") || "all"}`}
                            className={`products-filter-item${isActive ? " products-filter-item--active" : ""}`}
                            onClick={() => handleCategorySelect(cat.value)}
                          >
                            <span className="products-filter-item-label">
                              <CategoryIcon />
                              <span>{cat.label}</span>
                            </span>
                            <span className="products-filter-count">{count}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="products-filter-card">
                  <h3 className="products-filter-title">Price Range</h3>
                  <div className="products-price-filter-box">
                    <div className="products-price-presets">
                      {PRICE_PRESETS.map((preset) => {
                        const active = minPrice === preset.min && maxPrice === preset.max;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            className={`price-preset-chip${active ? " price-preset-chip--active" : ""}`}
                            onClick={() => {
                              setMinPrice(preset.min);
                              setMaxPrice(preset.max);
                              setCurrentPage(1);
                            }}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="products-price-inputs-row">
                      <div className="price-input-wrapper">
                        <span className="price-input-prefix">$</span>
                        <input
                          type="number"
                          aria-label="Minimum price"
                          placeholder="Min"
                          className="products-price-input"
                          id="price-min"
                          value={minPrice}
                          min={0}
                          onChange={(event) => { setMinPrice(event.target.value); setCurrentPage(1); }}
                        />
                      </div>
                      <span className="price-inputs-divider">–</span>
                      <div className="price-input-wrapper">
                        <span className="price-input-prefix">$</span>
                        <input
                          type="number"
                          aria-label="Maximum price"
                          placeholder="Max"
                          className="products-price-input"
                          id="price-max"
                          value={maxPrice}
                          min={0}
                          onChange={(event) => { setMaxPrice(event.target.value); setCurrentPage(1); }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="products-filter-card">
                  <h3 className="products-filter-title">Minimum Rating</h3>
                  <div className="products-rating-list">
                    {[4.5, 4, 3.5].map((r) => {
                      const isSelected = minimumRating === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          className={`products-rating-btn${isSelected ? " products-rating-btn--active" : ""}`}
                          onClick={() => {
                            setMinimumRating(isSelected ? null : r);
                            setCurrentPage(1);
                          }}
                          aria-pressed={isSelected}
                        >
                          <div className="products-rating-btn-left">
                            <span className="products-rating-stars" aria-hidden="true">
                              {"★".repeat(Math.floor(r))}
                              {r % 1 !== 0 ? "½" : ""}
                            </span>
                            <span className="products-rating-text">{r}+ stars</span>
                          </div>
                          {isSelected && <span className="products-rating-check" aria-hidden="true">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* Product Grid */}
              <div className="products-content">
                {/* Mobile Horizontal Category Pills Bar */}
                <div className="products-mobile-category-bar" aria-label="Filter by category">
                  <div className="products-mobile-category-scroll">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        className={`products-mobile-category-chip${selectedCategory === cat.value ? " active" : ""}`}
                        onClick={() => handleCategorySelect(cat.value)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Bar with Integrated Search & Sort */}
                <div className="products-topbar" id="products-content-top">
                  <p className="products-result-count">
                    <span className="result-count-indicator" />
                    Showing&nbsp;<strong>{filtered.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}</strong>&nbsp;of&nbsp;<strong>{filtered.length}</strong>&nbsp;products
                  </p>

                  <button
                    type="button"
                    className="products-mobile-filter-trigger"
                    onClick={() => setMobileFiltersOpen(true)}
                    aria-label="Open filter drawer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <span>Filters</span>
                    {(selectedCategory || minPrice !== "0" || maxPrice !== "200" || minimumRating !== null) && (
                      <span className="mobile-filter-active-dot" />
                    )}
                  </button>

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
                  <button className="btn-primary" onClick={() => { setSearchQuery(""); setSelectedCategory(""); setMinPrice("0"); setMaxPrice("200"); setMinimumRating(null); setCurrentPage(1); }}>
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
                        role="link"
                        tabIndex={0}
                        onClick={() => router.push(`/products/${product.id}`)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            router.push(`/products/${product.id}`);
                          }
                        }}
                      >
                        {/* Product Preview Image Banner */}
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
                                    height={30}
                                    className="discovery-card-logo-img"
                                    unoptimized={product.logo.startsWith("data:")}
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
                              <span className="discovery-verified-mark" title="Verified product" aria-label="Verified product">
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                  <circle cx="6" cy="6" r="6" fill="#2563EB" />
                                  <path d="m3.4 6.1 1.55 1.5L8.7 4" stroke="white" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </div>

                            <div className="discovery-card-header-rating">
                              <span aria-hidden="true">★</span>
                              <strong>{product.rating.toFixed(1)}</strong>
                              <span>
                                ({product.reviewCount >= 1000
                                  ? `${(product.reviewCount / 1000).toFixed(1)}K`
                                  : product.reviewCount})
                              </span>
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
                              <span className="discovery-price-amount">{product.price === 0 ? "Free" : `$${product.price}`}</span>
                              {product.price > 0 && <span className="discovery-price-period">{product.period === "once" ? "one-time" : `/${product.period}`}</span>}
                            </div>

                            {/* <div className="discovery-card-community" aria-label="Reviewed by marketplace customers">
                              <span className="discovery-card-avatars" aria-hidden="true">
                                {CARD_AVATARS.map((avatar) => (
                                  <Image key={avatar} src={avatar} alt="" width={18} height={18} />
                                ))}
                              </span>
                              <span>+{Math.max(100, Math.round(product.reviewCount / 4))}</span>
                            </div> */}

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

                            <span className="discovery-card-arrow" aria-hidden="true">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                              </svg>
                            </span>
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
                            View product
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
              About Our B2B SaaS Marketplace Platform &amp; Multi-Vendor Directory
            </h2>
            <div className="products-directory-info-content">
              <p>
                <strong>SaaS MRKT</strong> is a modern, high-converting <strong>B2B SaaS marketplace platform</strong> engineered to simplify how businesses discover, compare, and acquire top-tier cloud software. As a dedicated <strong>marketplace for SaaS products</strong>, we provide buyers with an open, multi-vendor SaaS marketplace experience featuring transparent pricing, verified customer reviews, and direct founder access with 0% listing commission.
              </p>
              <p>
                Unlike legacy platforms like AWS Marketplace SaaS or Azure SaaS Marketplace that require restrictive enterprise commitments and complex marketplace credits, SaaS MRKT offers flexible <strong>SaaS payment gateway alternatives</strong>, seamless sandboxes, and transparent billing. Explore verified software across CRM &amp; Sales, HR &amp; Payroll, Project Management, Developer APIs, and XBERT fintech marketplace tools.
              </p>
              <p>
                Whether you are evaluating <strong>SaaS vs marketplace revenue multiples</strong>, researching marketplace entry strategy, or auditing your team&apos;s cloud stack, our <strong>multi-vendor marketplace SaaS software</strong> gives your team the verified data and insights needed to scale efficiently.
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
      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="products-filter-drawer-overlay" onClick={() => setMobileFiltersOpen(false)}>
          <div className="products-filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3 className="drawer-title">Filter Products</h3>
                <p className="drawer-subtitle">Refine by category, price, and ratings</p>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="drawer-body">
              <div className="products-filter-card">
                <h3 className="products-filter-title">Categories</h3>
                <ul className="products-filter-list">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.value;
                    const count = cat.value
                      ? productsList.filter((product) => product.category === cat.value).length
                      : productsList.length;
                    return (
                      <li key={cat.value}>
                        <button
                          className={`products-filter-item${isActive ? " products-filter-item--active" : ""}`}
                          onClick={() => {
                            handleCategorySelect(cat.value);
                            setMobileFiltersOpen(false);
                          }}
                        >
                          <span className="products-filter-item-label">
                            <CategoryIcon />
                            <span>{cat.label}</span>
                          </span>
                          <span className="products-filter-count">{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="products-filter-card">
                <h3 className="products-filter-title">Price Range</h3>
                <div className="products-price-filter-box">
                  <div className="products-price-presets">
                    {PRICE_PRESETS.map((preset) => {
                      const active = minPrice === preset.min && maxPrice === preset.max;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          className={`price-preset-chip${active ? " price-preset-chip--active" : ""}`}
                          onClick={() => {
                            setMinPrice(preset.min);
                            setMaxPrice(preset.max);
                            setCurrentPage(1);
                          }}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="products-price-inputs-row">
                    <div className="price-input-wrapper">
                      <span className="price-input-prefix">$</span>
                      <input
                        type="number"
                        aria-label="Minimum price"
                        placeholder="Min"
                        className="products-price-input"
                        value={minPrice}
                        min={0}
                        onChange={(event) => { setMinPrice(event.target.value); setCurrentPage(1); }}
                      />
                    </div>
                    <span className="price-inputs-divider">–</span>
                    <div className="price-input-wrapper">
                      <span className="price-input-prefix">$</span>
                      <input
                        type="number"
                        aria-label="Maximum price"
                        placeholder="Max"
                        className="products-price-input"
                        value={maxPrice}
                        min={0}
                        onChange={(event) => { setMaxPrice(event.target.value); setCurrentPage(1); }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="products-filter-card">
                <h3 className="products-filter-title">Minimum Rating</h3>
                <div className="products-rating-list">
                  {[4.5, 4, 3.5].map((r) => {
                    const isSelected = minimumRating === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        className={`products-rating-btn${isSelected ? " products-rating-btn--active" : ""}`}
                        onClick={() => {
                          setMinimumRating(isSelected ? null : r);
                          setCurrentPage(1);
                        }}
                        aria-pressed={isSelected}
                      >
                        <div className="products-rating-btn-left">
                          <span className="products-rating-stars" aria-hidden="true">
                            {"★".repeat(Math.floor(r))}
                            {r % 1 !== 0 ? "½" : ""}
                          </span>
                          <span className="products-rating-text">{r}+ stars</span>
                        </div>
                        {isSelected && <span className="products-rating-check" aria-hidden="true">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button
                type="button"
                className="drawer-reset-btn"
                onClick={() => {
                  setSelectedCategory("");
                  setSearchQuery("");
                  setMinPrice("0");
                  setMaxPrice("200");
                  setMinimumRating(null);
                  setCurrentPage(1);
                  setMobileFiltersOpen(false);
                }}
              >
                Reset All
              </button>
              <button
                type="button"
                className="btn-primary drawer-apply-btn"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show {filtered.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageLayout>
  );
}

