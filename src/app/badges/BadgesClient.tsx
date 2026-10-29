"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS } from "@/data/products";
import "./badges-page.css";

export default function BadgesClient() {
  const [selectedProductId, setSelectedProductId] = useState<string>("prod-taskflow");
  const [selectedBadge, setSelectedBadge] = useState<string>("top-rated");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [previewDark, setPreviewDark] = useState<boolean>(false);
  const [embedFormat, setEmbedFormat] = useState<"html" | "markdown">("html");

  const selectedProduct = ALL_PRODUCTS.find((p) => p.id === selectedProductId) || ALL_PRODUCTS[0];

  const badges = [
    {
      id: "top-rated",
      name: "Top Rated 2026",
      file: "/badges/top-rated-2026.svg",
      description: "For tools maintaining 4.7+ stars across 1,000+ verified customer reviews.",
      color: "#CA8A04",
    },
    {
      id: "featured",
      name: "Featured on SaaS MRKT",
      file: "/badges/featured-on-saasmrkt.svg",
      description: "Official verification badge showcasing active catalog listing and editorial review.",
      color: "#4F46E5",
    },
    {
      id: "verified-vendor",
      name: "Verified Vendor (Escrow Safe)",
      file: "/badges/verified-vendor-2026.svg",
      description: "Validates verified business registration and 30-day buyer escrow coverage.",
      color: "#059669",
    },
  ];

  const currentBadgeObj = badges.find((b) => b.id === selectedBadge) || badges[0];

  const embedHtml = `<a href="https://saasmrkt.com/products/${selectedProduct.slug || selectedProduct.id}" target="_blank" rel="noopener noreferrer">
  <img src="https://saasmrkt.com${currentBadgeObj.file}" alt="${currentBadgeObj.name} on SaaS MRKT" width="220" height="60" style="border-radius: 12px; display: inline-block;" />
</a>`;

  const embedMarkdown = `[![${currentBadgeObj.name} on SaaS MRKT](https://saasmrkt.com${currentBadgeObj.file})](https://saasmrkt.com/products/${selectedProduct.slug || selectedProduct.id})`;

  const activeCode = embedFormat === "html" ? embedHtml : embedMarkdown;

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(activeCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <PageLayout noContainer>
      <div className="badges-page-wrapper">
        <div className="badges-container">
          {/* 1. Breadcrumbs (Compact) */}
          <nav className="badges-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="badges-breadcrumb-sep">›</span>
            <span className="badges-breadcrumb-current">Vendor Trust Badges</span>
          </nav>

          {/* 2. Hero Section (Compact & Modern) */}
          <header className="badges-hero">
            <div className="badges-hero-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              2026 Official Recognition Badges
            </div>

            <h1 className="badges-hero-title">
              Showcase Your <span className="badges-title-gradient">Verified Excellence</span>
            </h1>

            <p className="badges-hero-desc">
              Boost landing page conversions by up to 26%. Embed your verified SaaS MRKT trust badge on your website, pricing page, or footer.
            </p>

            {/* 3 Trust Badges (Matching /buyers) */}
            <div className="badges-trust-row">
              <div className="badges-trust-badge">
                <div className="badges-trust-icon-box icon-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div className="badges-trust-text">
                  <span className="badges-trust-num">+26% Conversion</span>
                  <span className="badges-trust-label">Average Social Proof Uplift</span>
                </div>
              </div>

              <div className="badges-trust-badge">
                <div className="badges-trust-icon-box icon-purple">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div className="badges-trust-text">
                  <span className="badges-trust-num">Instant Embed</span>
                  <span className="badges-trust-label">HTML &amp; Markdown Support</span>
                </div>
              </div>

              <div className="badges-trust-badge">
                <div className="badges-trust-icon-box icon-blue">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="badges-trust-text">
                  <span className="badges-trust-num">100% Free</span>
                  <span className="badges-trust-label">For All Listed Software</span>
                </div>
              </div>
            </div>
          </header>

          {/* 3. Main 2-Column Generator Grid (Compact & Dense) */}
          <div className="badges-main-grid">
            {/* Left Column: Configuration Controls */}
            <div className="badges-card">
              <h2 className="badges-card-title">1. Select Listed Software</h2>
              <p className="badges-card-desc">
                Your badge links directly to your verified product listing and customer review score.
              </p>

              <label htmlFor="badge-tool-select" className="badges-select-label">
                Software Listing
              </label>
              <select
                id="badge-tool-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="badges-select"
              >
                {ALL_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category}) — ★ {p.rating}
                  </option>
                ))}
              </select>

              <h2 className="badges-card-title">2. Choose Award Badge Design</h2>
              <p className="badges-card-desc">
                Pick the badge design that best matches your landing page theme.
              </p>

              <div className="badges-tile-list">
                {badges.map((b) => {
                  const isSelected = selectedBadge === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBadge(b.id)}
                      className={`badges-tile ${isSelected ? "active" : ""}`}
                    >
                      <div className="badges-tile-img">
                        <Image src={b.file} alt={b.name} width={115} height={32} style={{ objectFit: "contain" }} />
                      </div>
                      <div className="badges-tile-info">
                        <div className="badges-tile-name">{b.name}</div>
                        <div className="badges-tile-desc">{b.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Preview & Code Export (Sticky) */}
            <div className="badges-sticky-col">
              <div className="badges-card">
                <div className="badges-preview-head">
                  <h3 className="badges-card-title" style={{ margin: 0 }}>
                    Live Badge Preview
                  </h3>
                  <div className="badges-mode-toggle">
                    <button
                      type="button"
                      className={`badges-mode-btn ${!previewDark ? "active" : ""}`}
                      onClick={() => setPreviewDark(false)}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      className={`badges-mode-btn ${previewDark ? "active" : ""}`}
                      onClick={() => setPreviewDark(true)}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Display Simulator */}
                <div className={`badges-canvas ${previewDark ? "dark" : "light"}`}>
                  <div className="badges-canvas-img-wrap">
                    <a
                      href={`/products/${selectedProduct.slug || selectedProduct.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={currentBadgeObj.file}
                        alt={currentBadgeObj.name}
                        width={200}
                        height={55}
                        style={{ borderRadius: "10px", filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.12))" }}
                      />
                    </a>
                  </div>
                  <div className="badges-canvas-target">
                    Links to: <code>saasmrkt.com/products/{selectedProduct.slug || selectedProduct.id}</code>
                  </div>
                </div>

                {/* Embed Code Tabs & Copy */}
                <div className="badges-code-section">
                  <div className="badges-code-head">
                    <div className="badges-format-tabs">
                      <button
                        type="button"
                        className={`badges-format-tab ${embedFormat === "html" ? "active" : ""}`}
                        onClick={() => setEmbedFormat("html")}
                      >
                        HTML Code
                      </button>
                      <button
                        type="button"
                        className={`badges-format-tab ${embedFormat === "markdown" ? "active" : ""}`}
                        onClick={() => setEmbedFormat("markdown")}
                      >
                        Markdown (GitHub)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`badges-copy-btn ${copiedCode ? "copied" : ""}`}
                    >
                      {copiedCode ? "Copied! ✓" : `Copy ${embedFormat.toUpperCase()}`}
                    </button>
                  </div>

                  <textarea
                    readOnly
                    value={activeCode}
                    rows={3}
                    className="badges-textarea"
                    aria-label="Embed Code"
                  />
                </div>

                {/* Conversion Tip */}
                <div className="badges-tip-box">
                  💡 <strong>Pro Tip:</strong> Placing your badge directly adjacent to &quot;Start Free Trial&quot; or pricing tables yields the highest conversion lift.
                </div>
              </div>
            </div>
          </div>

          {/* 4. Where to Place Your Badge Section (Compact 3-Card Row) */}
          <section className="badges-placement-section">
            <div className="badges-placement-head">
              <h2 className="badges-placement-title">Recommended Badge Placements</h2>
              <p className="badges-placement-sub">
                Best practices for maximizing conversion uplift and social proof.
              </p>
            </div>

            <div className="badges-placement-grid">
              <div className="badges-placement-card">
                <div className="badges-placement-step purple">1. Hero Section</div>
                <p className="badges-placement-text">
                  Directly underneath your main call-to-action button alongside star ratings.
                </p>
              </div>

              <div className="badges-placement-card">
                <div className="badges-placement-step green">2. Pricing Table</div>
                <p className="badges-placement-text">
                  Adjacent to paid plans to reassure buyers and confirm verified escrow protection.
                </p>
              </div>

              <div className="badges-placement-card">
                <div className="badges-placement-step amber">3. Website Footer</div>
                <p className="badges-placement-text">
                  Next to security and compliance certifications (SOC2, GDPR, ISO 27001).
                </p>
              </div>
            </div>
          </section>

          {/* 5. Cosmic Bottom CTA Banner (Compact) */}
          <div className="badges-cta-banner">
            <div className="badges-cta-content">
              <div className="badges-cta-left">
                <span className="badges-cta-pill">GROW BUYER TRUST</span>
                <h2 className="badges-cta-title">
                  Not listed on SaaS MRKT yet?{" "}
                  <span className="badges-cta-title-highlight">Claim your profile</span>
                </h2>
                <p className="badges-cta-desc">
                  Submit your software tool for editorial review to unlock official trust badges and reach 50,000+ software buyers.
                </p>
              </div>

              <div className="badges-cta-buttons">
                <Link href="/contact" className="badges-cta-btn-primary">
                  <span>Submit Software</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/products" className="badges-cta-btn-secondary">
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
