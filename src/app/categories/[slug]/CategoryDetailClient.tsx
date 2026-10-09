"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { CategoryDetailData, CategoryProduct } from "@/data/categoriesData";
import { BlogPostData } from "@/app/blog/[slug]/page";

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
  const [selectedProduct, setSelectedProduct] = useState<CategoryProduct | null>(null);
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
      showToast(next[id] ? "Saved to your shortlisted tools!" : "Removed from shortlisted tools");
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
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            backgroundColor: "var(--slate-900)",
            color: "#ffffff",
            padding: "0.85rem 1.4rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Category Hero Section */}
      <section
        style={{
          background: "linear-gradient(180deg, rgba(94, 75, 238, 0.06) 0%, rgba(255, 255, 255, 0) 100%)",
          padding: "3.5rem 0 2.5rem",
          borderBottom: "1px solid var(--slate-200)",
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: "var(--slate-500)",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={{ color: "var(--slate-500)", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" style={{ color: "var(--slate-500)", textDecoration: "none" }}>
              Categories
            </Link>
            <span>/</span>
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>{category.name}</span>
          </nav>

          <div style={{ maxWidth: "880px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(94, 75, 238, 0.1)",
                color: "var(--primary)",
                fontSize: "0.825rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "inline-block",
                }}
              />
              2026 Verified Software Benchmark
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.85rem)",
                fontWeight: 800,
                color: "var(--slate-900)",
                lineHeight: 1.2,
                marginBottom: "1rem",
                letterSpacing: "-0.02em",
              }}
            >
              {category.headline}
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--slate-600)",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              {category.subheadline}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              padding: "1.25rem 1.5rem",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid var(--slate-200)",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div>
              <div style={{ fontSize: "0.775rem", color: "var(--slate-500)", fontWeight: 600, textTransform: "uppercase" }}>
                Category Avg. Score
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ color: "#F59E0B" }}>★</span> {category.stats.avgRating} <span style={{ fontSize: "0.85rem", color: "var(--slate-400)", fontWeight: 500 }}>/ 5.0</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.775rem", color: "var(--slate-500)", fontWeight: 600, textTransform: "uppercase" }}>
                Verified User Reviews
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "0.2rem" }}>
                {category.stats.verifiedReviews}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.775rem", color: "var(--slate-500)", fontWeight: 600, textTransform: "uppercase" }}>
                Starting Price
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.2rem" }}>
                {category.stats.startingPrice}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.775rem", color: "var(--slate-500)", fontWeight: 600, textTransform: "uppercase" }}>
                Free Trial Guarantee
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#10B981", marginTop: "0.2rem" }}>
                {category.stats.freeTrialPct}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: "3rem 0 5rem" }}>
        <div className="container">
          {/* Controls Bar: Search & Sort */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--slate-900)" }}>
                Showing {filteredProducts.length} Ranked {category.name} Solutions
              </span>
              <span
                style={{
                  fontSize: "0.775rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--slate-100)",
                  color: "var(--slate-600)",
                  fontWeight: 600,
                }}
              >
                Zero-bias editorial review
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Search Within Category */}
              <div style={{ position: "relative", minWidth: "240px" }}>
                <input
                  type="text"
                  placeholder={`Search ${category.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 2.2rem 0.6rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid var(--slate-300)",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "0.6rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--slate-400)",
                      fontSize: "0.85rem",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--slate-300)",
                  fontSize: "0.875rem",
                  color: "var(--slate-700)",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="reviews">Sort: Most Reviews</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px dashed var(--slate-300)",
              }}
            >
              <p style={{ fontSize: "1.1rem", color: "var(--slate-600)", marginBottom: "1rem" }}>
                No tools found matching &ldquo;{searchQuery}&rdquo; in {category.name}.
              </p>
              <button
                className="btn-primary"
                onClick={() => setSearchQuery("")}
                style={{ padding: "0.6rem 1.4rem", borderRadius: "8px" }}
              >
                Reset Search Filter
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
                marginBottom: "4rem",
              }}
            >
              {filteredProducts.map((prod, idx) => {
                const isBookmarked = !!savedTools[prod.id];
                return (
                  <div
                    key={prod.id}
                    id={`product-card-${prod.id}`}
                    style={{
                      background: "#ffffff",
                      borderRadius: "18px",
                      border: "1px solid var(--slate-200)",
                      padding: "1.75rem",
                      boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: "1.75rem",
                      alignItems: "start",
                      transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    {/* Rank & Logo */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 800,
                          color: "var(--slate-400)",
                          lineHeight: 1,
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "14px",
                          backgroundColor: prod.brandColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          boxShadow: `0 6px 16px ${prod.brandColor}33`,
                        }}
                      >
                        {prod.brandLetter}
                      </div>
                    </div>

                    {/* Middle Info */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                        <h2
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            color: "var(--slate-900)",
                            margin: 0,
                          }}
                        >
                          {prod.name}
                        </h2>

                        {prod.verified && (
                          <span
                            title="Verified SaaS MRKT Vendor"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.725rem",
                              fontWeight: 700,
                              color: "#2563EB",
                              background: "rgba(37, 99, 235, 0.08)",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "var(--radius-full)",
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            Verified
                          </span>
                        )}

                        {prod.badge && (
                          <span
                            style={{
                              fontSize: "0.725rem",
                              fontWeight: 700,
                              color: "#7C3AED",
                              background: "rgba(124, 58, 237, 0.08)",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "var(--radius-full)",
                            }}
                          >
                            {prod.badge}
                          </span>
                        )}
                      </div>

                      {/* Ratings */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                        <div style={{ color: "#F59E0B", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.2rem" }}>
                          ★ {prod.rating.toFixed(1)}
                        </div>
                        <span style={{ color: "var(--slate-400)" }}>•</span>
                        <span style={{ color: "var(--slate-600)" }}>{prod.reviewCount} customer reviews</span>
                        <span style={{ color: "var(--slate-400)" }}>•</span>
                        <span style={{ color: "#10B981", fontWeight: 600 }}>{prod.trialDays}-Day Free Trial</span>
                      </div>

                      <p style={{ color: "var(--slate-600)", fontSize: "0.925rem", lineHeight: 1.5, marginBottom: "0.9rem" }}>
                        {prod.description}
                      </p>

                      {/* Features bullets */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "0.45rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {prod.features.map((feat, fi) => (
                          <div
                            key={fi}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                              fontSize: "0.825rem",
                              color: "var(--slate-700)",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pros Tag Chips */}
                      {prod.pros && prod.pros.length > 0 && (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-500)" }}>Why users love it:</span>
                          {prod.pros.map((pro, pi) => (
                            <span
                              key={pi}
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.2rem 0.55rem",
                                borderRadius: "6px",
                                background: "var(--slate-100)",
                                color: "var(--slate-700)",
                                fontWeight: 500,
                              }}
                            >
                              ✓ {pro}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Price & Actions */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        height: "100%",
                        minWidth: "170px",
                        textAlign: "right",
                      }}
                    >
                      <button
                        onClick={(e) => toggleBookmark(prod.id, e)}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark this software"}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: isBookmarked ? "var(--primary)" : "var(--slate-400)",
                          padding: "0.25rem",
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>

                      <div style={{ margin: "1rem 0" }}>
                        <div style={{ fontSize: "0.8rem", color: "var(--slate-500)", fontWeight: 500 }}>
                          Starting at
                        </div>
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--slate-900)", lineHeight: 1.1 }}>
                          ${prod.price}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                          per {prod.period}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                        <button
                          onClick={() => showToast(`Starting free trial for ${prod.name}...`)}
                          style={{
                            padding: "0.7rem 1.1rem",
                            borderRadius: "10px",
                            backgroundColor: "var(--primary)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "center",
                            boxShadow: "0 4px 12px rgba(94, 75, 238, 0.25)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Try {prod.trialDays} Days Free
                        </button>
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          style={{
                            padding: "0.55rem 1rem",
                            borderRadius: "10px",
                            backgroundColor: "var(--slate-100)",
                            color: "var(--slate-700)",
                            fontWeight: 600,
                            fontSize: "0.825rem",
                            border: "1px solid var(--slate-200)",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "center",
                          }}
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

          {/* Educational Buyer's Guide Section */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid var(--slate-200)",
              padding: "2.5rem",
              marginBottom: "4rem",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
            }}
          >
            <div style={{ maxWidth: "800px", marginBottom: "2rem" }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Procurement Guide
              </div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.75rem" }}>
                {category.buyingGuide.title}
              </h2>
              <p style={{ color: "var(--slate-600)", lineHeight: 1.6, fontSize: "1rem" }}>
                {category.buyingGuide.description}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {category.buyingGuide.keyFactors.map((factor, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1.5rem",
                    borderRadius: "14px",
                    background: "var(--slate-50)",
                    border: "1px solid var(--slate-200)",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(94, 75, 238, 0.1)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
                    {factor.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--slate-600)", lineHeight: 1.5, margin: 0 }}>
                    {factor.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive FAQ Accordion (Google FAQPage Schema Entity) */}
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 2.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                Frequently Asked Questions
              </span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "0.4rem" }}>
                Common Questions About {category.name} Software
              </h2>
            </div>

            <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {category.faqs.map((faq, fIdx) => {
                const isOpen = openFaq === fIdx;
                return (
                  <div
                    key={fIdx}
                    style={{
                      borderRadius: "14px",
                      border: isOpen ? "1.5px solid var(--primary)" : "1px solid var(--slate-200)",
                      backgroundColor: "#ffffff",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                      boxShadow: isOpen ? "0 6px 20px rgba(94, 75, 238, 0.08)" : "none",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                      style={{
                        width: "100%",
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        color: "var(--slate-900)",
                        fontSize: "1.025rem",
                        fontWeight: 700,
                      }}
                    >
                      <span>{faq.question}</span>
                      <span
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                          color: "var(--primary)",
                          fontSize: "1.2rem",
                          fontWeight: 400,
                        }}
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: "0 1.5rem 1.25rem",
                          color: "var(--slate-600)",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          borderTop: "1px solid var(--slate-100)",
                          paddingTop: "1rem",
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related In-Depth Guides / Blog Articles */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <div style={{ marginBottom: "4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                    Expert Insights & Tutorials
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "0.3rem" }}>
                    Deep-Dive Articles for {category.name}
                  </h2>
                </div>
                <Link
                  href="/blog"
                  style={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  View all articles →
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {relatedBlogs.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/blog/${b.slug}`}
                    style={{ textDecoration: "none", color: "inherit", display: "flex" }}
                  >
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid var(--slate-200)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.03)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          height: "140px",
                          background: b.gradient,
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "1rem",
                        }}
                      >
                        <span
                          style={{
                            background: "rgba(0,0,0,0.3)",
                            backdropFilter: "blur(6px)",
                            color: "#ffffff",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.725rem",
                            fontWeight: 700,
                          }}
                        >
                          {b.tag}
                        </span>
                      </div>
                      <div style={{ padding: "1.25rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--slate-900)", marginBottom: "0.5rem", lineHeight: 1.35 }}>
                          {b.title}
                        </h3>
                        <p style={{ fontSize: "0.825rem", color: "var(--slate-600)", lineHeight: 1.45, marginBottom: "1rem", flexGrow: 1 }}>
                          {b.excerpt}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--slate-500)", fontWeight: 600 }}>
                          <span>{b.author}</span>
                          <span>{b.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Explore Other Software Categories */}
          <div>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--slate-900)" }}>
                Explore Other Software Categories
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--slate-600)", marginTop: "0.25rem" }}>
                Compare verified solutions across the entire B2B software ecosystem.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center" }}>
              {allCategories.map((c) => {
                const isCurrent = c.id === category.id;
                return (
                  <Link
                    key={c.id}
                    href={`/categories/${c.id}`}
                    style={{
                      textDecoration: "none",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      background: isCurrent ? "var(--primary)" : "#ffffff",
                      color: isCurrent ? "#ffffff" : "var(--slate-700)",
                      border: isCurrent ? "1px solid var(--primary)" : "1px solid var(--slate-200)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {c.name} ({c.count})
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Product Spec Inspector Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "2rem",
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "var(--slate-400)",
              }}
            >
              ✕
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: selectedProduct.brandColor,
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedProduct.brandLetter}
              </div>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>
                  {selectedProduct.name}
                </h3>
                <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
                  {category.name}
                </div>
              </div>
            </div>

            <p style={{ color: "var(--slate-600)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              {selectedProduct.description}
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--slate-900)", marginBottom: "0.6rem" }}>
                Feature Breakdown:
              </h4>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, color: "var(--slate-700)", fontSize: "0.875rem", lineHeight: 1.7 }}>
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
                padding: "1rem 1.25rem",
                background: "var(--slate-50)",
                borderRadius: "12px",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 600 }}>
                  Pricing Model
                </div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--slate-900)" }}>
                  ${selectedProduct.price} <span style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>/{selectedProduct.period}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 600 }}>
                  Trial Terms
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#10B981" }}>
                  {selectedProduct.trialDays} Days Free
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedProduct(null);
                  showToast(`Redirecting to ${selectedProduct.name} free trial...`);
                }}
                style={{ flex: 1, padding: "0.8rem", borderRadius: "10px", textAlign: "center" }}
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  padding: "0.8rem 1.25rem",
                  borderRadius: "10px",
                  border: "1px solid var(--slate-300)",
                  background: "#ffffff",
                  color: "var(--slate-700)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
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
