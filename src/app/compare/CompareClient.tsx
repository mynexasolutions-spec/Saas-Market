"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";
import {
  getAllMarketplaceProducts,
  VENDOR_PRODUCTS_EVENT_KEY,
  VENDOR_PRODUCTS_STORAGE_KEY,
} from "@/utils/vendorProducts";
import "./compare-page.css";

function findComparisonProduct(products: ProductItem[], id: string): ProductItem | undefined {
  const normalizedId = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  return products.find((product) => (
    product.id.toLowerCase() === id.toLowerCase() ||
    product.slug?.toLowerCase() === id.toLowerCase() ||
    product.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedId
  ));
}

export default function CompareClient() {
  const searchParams = useSearchParams();

  // Initial tool picks from URL params or defaults
  const initialTool1 = searchParams.get("tool1") || "taskflow";
  const initialTool2 = searchParams.get("tool2") || "manage360";

  const [tool1Id, setTool1Id] = useState<string>(initialTool1);
  const [tool2Id, setTool2Id] = useState<string>(initialTool2);
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [marketplaceProducts, setMarketplaceProducts] = useState<ProductItem[]>(ALL_PRODUCTS);

  const dropdown1Ref = useRef<HTMLDivElement>(null);
  const dropdown2Ref = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdown1Ref.current && !dropdown1Ref.current.contains(event.target as Node)) {
        setDropdown1Open(false);
      }
      if (dropdown2Ref.current && !dropdown2Ref.current.contains(event.target as Node)) {
        setDropdown2Open(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let frameId: number | null = null;
    const refreshProducts = () => {
      frameId = window.requestAnimationFrame(() => setMarketplaceProducts(getAllMarketplaceProducts()));
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === VENDOR_PRODUCTS_STORAGE_KEY) refreshProducts();
    };

    refreshProducts();
    window.addEventListener(VENDOR_PRODUCTS_EVENT_KEY, refreshProducts);
    window.addEventListener("storage", handleStorage);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener(VENDOR_PRODUCTS_EVENT_KEY, refreshProducts);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const t1 = searchParams.get("tool1");
    const t2 = searchParams.get("tool2");
    if (t1) setTool1Id(t1);
    if (t2) setTool2Id(t2);
  }, [searchParams]);

  // Resolve products
  const product1: ProductItem = useMemo(() => {
    const found = findComparisonProduct(marketplaceProducts, tool1Id);
    return found || marketplaceProducts.find((p) => p.slug === "taskflow") || marketplaceProducts[0] || ALL_PRODUCTS[0];
  }, [marketplaceProducts, tool1Id]);

  const product2: ProductItem = useMemo(() => {
    const found = findComparisonProduct(marketplaceProducts, tool2Id);
    return found || marketplaceProducts.find((p) => p.slug === "manage360") || marketplaceProducts[1] || ALL_PRODUCTS[1];
  }, [marketplaceProducts, tool2Id]);

  const handleCopyComparisonLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/compare?tool1=${product1.slug || product1.id}&tool2=${product2.slug || product2.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSwap = () => {
    setTool1Id(product2.slug || product2.id);
    setTool2Id(product1.slug || product1.id);
  };

  const comparisonPresets = [
    { name: "TaskFlow vs Manage360", t1: "taskflow", t2: "manage360" },
    { name: "GrowthFlow vs FinMate", t1: "growthflow", t2: "finmate" },
    { name: "MailBoost vs Supportly", t1: "mailboost", t2: "supportly" },
    { name: "TaskFlow vs GrowthFlow", t1: "taskflow", t2: "growthflow" },
  ];

  const isPresetActive = (t1: string, t2: string) => {
    const currentT1 = (product1.slug || product1.id).toLowerCase();
    const currentT2 = (product2.slug || product2.id).toLowerCase();
    return (
      (currentT1 === t1 && currentT2 === t2) ||
      (currentT1 === t2 && currentT2 === t1)
    );
  };

  const filteredProducts1 = useMemo(() => {
    if (!search1) return marketplaceProducts;
    return marketplaceProducts.filter((p) =>
      p.name.toLowerCase().includes(search1.toLowerCase()) ||
      p.category.toLowerCase().includes(search1.toLowerCase())
    );
  }, [marketplaceProducts, search1]);

  const filteredProducts2 = useMemo(() => {
    if (!search2) return marketplaceProducts;
    return marketplaceProducts.filter((p) =>
      p.name.toLowerCase().includes(search2.toLowerCase()) ||
      p.category.toLowerCase().includes(search2.toLowerCase())
    );
  }, [marketplaceProducts, search2]);

  return (
    <PageLayout activeNav="compare" noContainer>
      <div className="compare-page-wrapper">
        <div className="compare-container">
          {/* Breadcrumb Bar */}
          <div className="compare-top-bar">
            <nav aria-label="Breadcrumb" className="compare-breadcrumb">
              <Link href="/" className="compare-breadcrumb-home">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
              </Link>
              <span className="compare-breadcrumb-sep">›</span>
              <span className="compare-breadcrumb-current">Compare</span>
            </nav>
          </div>

          {/* Hero Section */}
          <section className="compare-hero-section">
            {/* Left Content */}
            <div className="compare-hero-left">
              <div className="compare-badge-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Side-by-Side Comparison
              </div>

              <h1 className="compare-hero-title">
                Compare SaaS Software <br />
                <span className="compare-hero-title-gradient">Side by Side</span>
              </h1>

              <p className="compare-hero-desc">
                Evaluate features, verified buyer ratings, pricing models, and tech
                specifications to find the perfect tool for your team.
              </p>

              {/* 3 Value Stats Badges Row */}
              <div className="compare-hero-stats-row">
                {/* Badge 1 */}
                <div className="compare-stat-badge">
                  <div className="compare-stat-icon compare-stat-purple">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div className="compare-stat-text">
                    <span className="compare-stat-num">Verified Reviews</span>
                    <span className="compare-stat-label">Real user feedback</span>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="compare-stat-badge">
                  <div className="compare-stat-icon compare-stat-blue">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div className="compare-stat-text">
                    <span className="compare-stat-num">Detailed Comparison</span>
                    <span className="compare-stat-label">Features &amp; pricing</span>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="compare-stat-badge">
                  <div className="compare-stat-icon compare-stat-violet">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="compare-stat-text">
                    <span className="compare-stat-num">Smarter Decisions</span>
                    <span className="compare-stat-label">Find the right tool</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3D Visual Floating Composition */}
            <div className="compare-hero-right" aria-hidden="true">
              <div className="compare-3d-scene">
                <div className="compare-ambient-glow" />
                <div className="compare-orbital-ring" />
                <div className="compare-dotted-grid" />

                {/* Floating Spheres */}
                <div className="compare-sphere compare-sphere-1" />
                <div className="compare-sphere compare-sphere-2" />
                <div className="compare-sphere compare-sphere-3" />

                {/* Tile 1: Top Left - Slack */}
                <div className="compare-tile-3d tile-slack">
                  <svg width="35" height="35" viewBox="0 0 128 128">
                    <path fill="#e01e5a" d="M27.2 80c-7.5 0-13.6-6.1-13.6-13.6s6.1-13.6 13.6-13.6h13.6v13.6c0 7.5-6.1 13.6-13.6 13.6z" />
                    <path fill="#e01e5a" d="M54.4 66.4c0-7.5-6.1-13.6-13.6-13.6s-13.6 6.1-13.6 13.6v34c0 7.5 6.1 13.6 13.6 13.6s13.6-6.1 13.6-13.6v-34z" />
                    <path fill="#36c5f0" d="M47.6 27.2c0-7.5 6.1-13.6 13.6-13.6s13.6 6.1 13.6 13.6v13.6H61.2c-7.5 0-13.6-6.1-13.6-13.6z" />
                    <path fill="#36c5f0" d="M61.2 54.4c7.5 0 13.6-6.1 13.6-13.6s-6.1-13.6-13.6-13.6h-34c-7.5 0-13.6 6.1-13.6 13.6s6.1 13.6 13.6 13.6h34z" />
                    <path fill="#2eb67d" d="M100.8 47.6c7.5 0 13.6 6.1 13.6 13.6s-6.1 13.6-13.6 13.6H87.2V61.2c0-7.5 6.1-13.6 13.6-13.6z" />
                    <path fill="#2eb67d" d="M73.6 61.2c0 7.5 6.1 13.6 13.6 13.6s13.6-6.1 13.6-13.6v-34c0-7.5-6.1-13.6-13.6-13.6s-13.6 6.1-13.6 13.6v34z" />
                    <path fill="#ecb22e" d="M80.4 100.8c0 7.5-6.1 13.6-13.6 13.6s-13.6-6.1-13.6-13.6V87.2h13.6c7.5 0 13.6 6.1 13.6 13.6z" />
                    <path fill="#ecb22e" d="M66.8 73.6c-7.5 0-13.6 6.1-13.6 13.6s6.1 13.6 13.6 13.6h34c7.5 0 13.6-6.1 13.6-13.6s-6.1-13.6-13.6-13.6h-34z" />
                  </svg>
                </div>

                {/* Tile 2: Top Right - Notion */}
                <div className="compare-tile-3d tile-notion">
                  <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" rx="14" fill="#000000" />
                    <path d="M26 24h18.5l25.8 38.2V24H82v52H63.5L37.7 37.8V76H26V24z" fill="#FFFFFF" />
                  </svg>
                </div>

                {/* Tile 3: Center - Swap Arrows ⇄ */}
                <div className="compare-tile-3d tile-swap">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </div>

                {/* Tile 4: Bottom Left - Figma */}
                <div className="compare-tile-3d tile-figma">
                  <svg width="26" height="38" viewBox="0 0 38 57" fill="none">
                    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                  </svg>
                </div>

                {/* Tile 5: Bottom Right - Modern 3D Gemstone */}
                <div className="compare-tile-3d tile-gem">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" fill="rgba(37, 99, 235, 0.15)" />
                    <line x1="12" y1="22" x2="12" y2="9" />
                    <line x1="2" y1="9" x2="22" y2="9" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Tool Selector Bar */}
          <section className="compare-selector-card">
            <div className="compare-selector-grid">
              {/* First Software Selector */}
              <div className="compare-selector-col" ref={dropdown1Ref}>
                <span className="compare-selector-label">First Software</span>
                <button
                  type="button"
                  className="compare-selector-btn"
                  onClick={() => {
                    setDropdown1Open(!dropdown1Open);
                    setDropdown2Open(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={dropdown1Open}
                >
                  <div className="compare-selector-tool-info">
                    <div
                      className="compare-tool-icon-mini"
                      style={{ background: product1.brandColor || "#6366F1" }}
                    >
                      {product1.brandLetter || "T"}
                    </div>
                    <span className="compare-tool-name-text">
                      {product1.name} ({product1.category}) — ${product1.price}/{product1.period}
                    </span>
                  </div>
                  <svg className={`compare-tool-chevron ${dropdown1Open ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdown1Open && (
                  <div className="compare-dropdown-menu" role="listbox">
                    <div style={{ padding: "0.25rem 0.5rem 0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Search software..."
                        value={search1}
                        onChange={(e) => setSearch1(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.45rem 0.75rem",
                          borderRadius: "8px",
                          border: "1px solid #E2E8F0",
                          fontSize: "0.82rem",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                        autoFocus
                      />
                    </div>
                    {filteredProducts1.map((p) => {
                      const isSelected = (product1.slug || product1.id) === (p.slug || p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`compare-dropdown-item ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setTool1Id(p.slug || p.id);
                            setDropdown1Open(false);
                            setSearch1("");
                          }}
                        >
                          <div className="dropdown-item-left">
                            <div
                              className="compare-tool-icon-mini"
                              style={{ background: p.brandColor || "#6366F1", width: "24px", height: "24px", fontSize: "0.75rem" }}
                            >
                              {p.brandLetter || p.name.charAt(0)}
                            </div>
                            <div>
                              <div className="dropdown-item-name">{p.name}</div>
                              <div className="dropdown-item-cat">{p.category}</div>
                            </div>
                          </div>
                          <span className="dropdown-item-price">${p.price}/{p.period}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <button
                type="button"
                className="compare-swap-btn"
                onClick={handleSwap}
                title="Swap tools"
                aria-label="Swap software 1 and software 2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </button>

              {/* Second Software Selector */}
              <div className="compare-selector-col" ref={dropdown2Ref}>
                <span className="compare-selector-label">Second Software</span>
                <button
                  type="button"
                  className="compare-selector-btn"
                  onClick={() => {
                    setDropdown2Open(!dropdown2Open);
                    setDropdown1Open(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={dropdown2Open}
                >
                  <div className="compare-selector-tool-info">
                    <div
                      className="compare-tool-icon-mini"
                      style={{ background: product2.brandColor || "#2563EB" }}
                    >
                      {product2.brandLetter || "M"}
                    </div>
                    <span className="compare-tool-name-text">
                      {product2.name} ({product2.category}) — ${product2.price}/{product2.period}
                    </span>
                  </div>
                  <svg className={`compare-tool-chevron ${dropdown2Open ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdown2Open && (
                  <div className="compare-dropdown-menu" role="listbox">
                    <div style={{ padding: "0.25rem 0.5rem 0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Search software..."
                        value={search2}
                        onChange={(e) => setSearch2(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.45rem 0.75rem",
                          borderRadius: "8px",
                          border: "1px solid #E2E8F0",
                          fontSize: "0.82rem",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                        autoFocus
                      />
                    </div>
                    {filteredProducts2.map((p) => {
                      const isSelected = (product2.slug || product2.id) === (p.slug || p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`compare-dropdown-item ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setTool2Id(p.slug || p.id);
                            setDropdown2Open(false);
                            setSearch2("");
                          }}
                        >
                          <div className="dropdown-item-left">
                            <div
                              className="compare-tool-icon-mini"
                              style={{ background: p.brandColor || "#2563EB", width: "24px", height: "24px", fontSize: "0.75rem" }}
                            >
                              {p.brandLetter || p.name.charAt(0)}
                            </div>
                            <div>
                              <div className="dropdown-item-name">{p.name}</div>
                              <div className="dropdown-item-cat">{p.category}</div>
                            </div>
                          </div>
                          <span className="dropdown-item-price">${p.price}/{p.period}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Popular Comparisons Pills & Share Link */}
          <section className="compare-presets-bar">
            <div className="compare-presets-left">
              <span className="compare-presets-title">Popular Comparisons:</span>
              {comparisonPresets.map((preset) => {
                const active = isPresetActive(preset.t1, preset.t2);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    className={`compare-preset-pill ${active ? "active" : ""}`}
                    onClick={() => {
                      setTool1Id(preset.t1);
                      setTool2Id(preset.t2);
                    }}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="compare-share-btn"
              onClick={handleCopyComparisonLink}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>{copiedLink ? "Link Copied!" : "Share Comparison"}</span>
            </button>
          </section>

          {/* Side-by-Side Summary Option Cards */}
          <section className="compare-cards-grid">
            {/* Option A: Tool 1 */}
            <div className="compare-option-card card-option-a">
              <div>
                <div className="compare-card-head">
                  <div className="compare-card-brand">
                    <div
                      className="compare-card-logo-box logo-taskflow"
                      style={{ background: product1.brandColor || "#6366F1" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="compare-card-title-group">
                      <h2 className="compare-card-name">{product1.name}</h2>
                      <span className="compare-card-cat">{product1.category}</span>
                    </div>
                  </div>
                  <span className="compare-card-pill pill-option-a">Option A</span>
                </div>

                <p className="compare-card-desc">
                  {product1.tagline || product1.description}
                </p>

                {/* 3 Mini Stats Box */}
                <div className="compare-mini-stats-row">
                  <div className="compare-mini-stat-box">
                    <div className="compare-mini-stat-icon icon-shield-purple">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div className="compare-mini-stat-text">
                      <span className="compare-mini-stat-lbl">Best for</span>
                      <span className="compare-mini-stat-val">
                        {product1.targetAudience?.includes("Engineering") ? "Engineering Teams" : (product1.targetAudience || "Fast Teams")}
                      </span>
                    </div>
                  </div>

                  <div className="compare-mini-stat-box">
                    <div className="compare-mini-stat-icon icon-star-yellow">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className="compare-mini-stat-text">
                      <span className="compare-mini-stat-val">{product1.rating}/5</span>
                      <span className="compare-mini-stat-lbl">{product1.reviewCount?.toLocaleString()} reviews</span>
                    </div>
                  </div>

                  <div className="compare-mini-stat-box">
                    <div className="compare-mini-stat-icon icon-dollar-blue">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="compare-mini-stat-text">
                      <span className="compare-mini-stat-val">${product1.price}/{product1.period}</span>
                      <span className="compare-mini-stat-lbl">Starting price</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="compare-card-actions">
                <Link
                  href={`/products/${product1.id}/buy`}
                  className="compare-btn-primary"
                >
                  Purchase {product1.name}
                </Link>
                <Link
                  href={`/products/${product1.id}`}
                  className="compare-btn-secondary"
                >
                  View Specs
                </Link>
              </div>
            </div>

            {/* Option B: Tool 2 */}
            <div className="compare-option-card card-option-b">
              <div>
                <div className="compare-card-head">
                  <div className="compare-card-brand">
                    <div
                      className="compare-card-logo-box logo-manage360"
                      style={{ background: product2.brandColor || "#0284C7" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                        <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z" />
                      </svg>
                    </div>
                    <div className="compare-card-title-group">
                      <h2 className="compare-card-name">{product2.name}</h2>
                      <span className="compare-card-cat">{product2.category}</span>
                    </div>
                  </div>
                  <span className="compare-card-pill pill-option-b">Option B</span>
                </div>

                <p className="compare-card-desc">
                  {product2.tagline || product2.description}
                </p>

                {/* 3 Mini Stats Box */}
                <div className="compare-mini-stats-row">
                  <div className="compare-mini-stat-box">
                    <div className="compare-mini-stat-icon icon-shield-blue">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div className="compare-mini-stat-text">
                      <span className="compare-mini-stat-lbl">Best for</span>
                      <span className="compare-mini-stat-val">
                        {product2.targetAudience?.includes("Mid-Market") ? "Mid-Market & Enterprise" : (product2.targetAudience || "Growing Teams")}
                      </span>
                    </div>
                  </div>

                  <div className="compare-mini-stat-box">
                    <div className="compare-mini-stat-icon icon-star-yellow">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className="compare-mini-stat-text">
                      <span className="compare-mini-stat-val">{product2.rating}/5</span>
                      <span className="compare-mini-stat-lbl">{product2.reviewCount?.toLocaleString()} reviews</span>
                    </div>
                  </div>

                  <div className="compare-mini-stat-box">
                    <div className="compare-mini-stat-icon icon-dollar-blue">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="compare-mini-stat-text">
                      <span className="compare-mini-stat-val">${product2.price}/{product2.period}</span>
                      <span className="compare-mini-stat-lbl">Starting price</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="compare-card-actions">
                <Link
                  href={`/products/${product2.id}/buy`}
                  className="compare-btn-primary"
                >
                  Purchase {product2.name}
                </Link>
                <Link
                  href={`/products/${product2.id}`}
                  className="compare-btn-secondary"
                >
                  View Specs
                </Link>
              </div>
            </div>
          </section>

          {/* Detailed Specification Matrix */}
          <section className="compare-matrix-card">
            <div className="compare-matrix-head-bar">
              <h3 className="compare-matrix-title">Detailed Specification Matrix</h3>
              <span className="compare-matrix-subtitle">Updated for 2026 SaaS benchmarks</span>
            </div>

            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="compare-th-metric">Metric / Feature</th>
                    <th className="compare-th-tool">
                      <div className="compare-th-brand">
                        <div
                          className="compare-tool-icon-mini"
                          style={{ background: product1.brandColor || "#6366F1", width: "24px", height: "24px", borderRadius: "6px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span>{product1.name}</span>
                      </div>
                    </th>
                    <th className="compare-th-tool">
                      <div className="compare-th-brand">
                        <div
                          className="compare-tool-icon-mini"
                          style={{ background: product2.brandColor || "#0284C7", width: "24px", height: "24px", borderRadius: "6px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="8" />
                          </svg>
                        </div>
                        <span>{product2.name}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Software Category */}
                  <tr>
                    <td className="compare-td-label">Software Category</td>
                    <td>
                      <span className="compare-tag-pill tag-purple">{product1.category}</span>
                    </td>
                    <td>
                      <span className="compare-tag-pill tag-blue">{product2.category}</span>
                    </td>
                  </tr>

                  {/* Row 2: Best Suited For */}
                  <tr>
                    <td className="compare-td-label">Best Suited For</td>
                    <td>{product1.targetAudience || "Engineering & Cross-Functional Teams"}</td>
                    <td>{product2.targetAudience || "Startups & Mid-Market Enterprises"}</td>
                  </tr>

                  {/* Row 3: Pricing Model */}
                  <tr>
                    <td className="compare-td-label">Pricing Model</td>
                    <td>
                      <strong>${product1.price}/{product1.period}</strong> ({product1.pricingModel || "Subscription"})
                    </td>
                    <td>
                      <strong>${product2.price}/{product2.period}</strong> ({product2.pricingModel || "Subscription"})
                    </td>
                  </tr>

                  {/* Row 4: Vendor Verification */}
                  <tr>
                    <td className="compare-td-label">Vendor Verification</td>
                    <td>
                      <span className="compare-verified-row">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified ({product1.sellerName || "Elena Rostova"})
                      </span>
                    </td>
                    <td>
                      <span className="compare-verified-row">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified ({product2.sellerName || "Marcus Vance"})
                      </span>
                    </td>
                  </tr>

                  {/* Row 5: Key Features */}
                  <tr>
                    <td className="compare-td-label" style={{ verticalAlign: "top", paddingTop: "1.2rem" }}>
                      Key Features
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <ul className="compare-features-list">
                        {(product1.features || []).slice(0, 4).map((f, i) => (
                          <li key={i} className="compare-feature-item">
                            <svg className="feat-check-purple" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="4" />
                              <polyline points="9 12 11 14 15 10" />
                            </svg>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <ul className="compare-features-list">
                        {(product2.features || []).slice(0, 4).map((f, i) => (
                          <li key={i} className="compare-feature-item">
                            <svg className="feat-check-blue" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="4" />
                              <polyline points="9 12 11 14 15 10" />
                            </svg>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  {/* Row 6: Architecture & Stack */}
                  <tr>
                    <td className="compare-td-label">Architecture &amp; Stack</td>
                    <td>
                      {product1.techStack ? product1.techStack.join(", ") : "Cloud native, REST API, Webhooks"}
                    </td>
                    <td>
                      {product2.techStack ? product2.techStack.join(", ") : "Cloud native, GraphQL, SSO"}
                    </td>
                  </tr>

                  {/* Row 7: Buyer Protection */}
                  <tr>
                    <td className="compare-td-label">Buyer Protection</td>
                    <td>
                      <span className="compare-escrow-row escrow-purple">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        30-Day Escrow Guarantee
                      </span>
                    </td>
                    <td>
                      <span className="compare-escrow-row escrow-blue">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        30-Day Escrow Guarantee
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* The SaaS MRKT Verdict Banner */}
          <section className="compare-verdict-banner">
            <div className="compare-verdict-left">
              <div className="compare-verdict-pill">The SaaS MRKT Verdict</div>
              <h2 className="compare-verdict-title">Which tool should your team choose?</h2>
              <p className="compare-verdict-desc">
                If your priority is <strong>{product1.category.toLowerCase()}</strong> and you need an agile solution at ${product1.price}/{product1.period}, go with <strong>{product1.name}</strong>. If you require specialized capabilities in <strong>{product2.category}</strong> with rich workflow management, <strong>{product2.name}</strong> delivers superior value.
              </p>

              <div className="compare-verdict-ctas">
                <Link href={`/products/${product1.id}/buy`} className="verdict-btn-purple">
                  Get {product1.name} (${product1.price}/{product1.period}) →
                </Link>
                <Link href={`/products/${product2.id}/buy`} className="verdict-btn-glass">
                  Get {product2.name} (${product2.price}/{product2.period}) →
                </Link>
              </div>
            </div>

            {/* Verdict 3D Visual VS Scene */}
            <div className="compare-verdict-right" aria-hidden="true">
              <div className="verdict-glow-back" />
              <div className="verdict-sparkle sparkle-1">✦</div>
              <div className="verdict-sparkle sparkle-2">✧</div>

              <div className="verdict-vs-scene">
                {/* 3D Option A Tile */}
                <div
                  className="verdict-3d-tile"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(238, 242, 255, 0.85) 100%)",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: product1.brandColor || "#6366F1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      boxShadow: "0 6px 18px rgba(99, 102, 241, 0.4)",
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="verdict-vs-pill">VS</div>

                {/* 3D Option B Tile */}
                <div
                  className="verdict-3d-tile verdict-tile-b"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.85) 100%)",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: product2.brandColor || "#0284C7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      boxShadow: "0 6px 18px rgba(2, 132, 199, 0.4)",
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
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
