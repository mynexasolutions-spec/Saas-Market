"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { ALTERNATIVES_DATA, LegacyToolData } from "@/data/alternativesData";
import "@/app/buyers/buyers-page.css";
import "./alternatives-page.css";

const CATEGORIES = [
  "All",
  "Team Communication",
  "Project Management",
  "CRM & Sales",
  "Accounting",
  "Issue Tracking",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const TOOL_AVATARS: Record<string, { letter: string; className: string }> = {
  slack: { letter: "S", className: "avatar-slack" },
  asana: { letter: "A", className: "avatar-asana" },
  hubspot: { letter: "H", className: "avatar-hubspot" },
  salesforce: { letter: "SF", className: "avatar-salesforce" },
  quickbooks: { letter: "QB", className: "avatar-quickbooks" },
  jira: { letter: "J", className: "avatar-jira" },
};

export default function AlternativesIndexClient() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");

  const allTools = useMemo(() => Object.values(ALTERNATIVES_DATA), []);

  const filteredTools = useMemo(() => {
    return allTools.filter((tool: LegacyToolData) => {
      // Category filter
      if (selectedCategory !== "All") {
        const catLower = tool.category.toLowerCase();
        if (selectedCategory === "Team Communication" && !catLower.includes("communication")) {
          return false;
        }
        if (selectedCategory === "Project Management" && !catLower.includes("project")) {
          return false;
        }
        if (selectedCategory === "CRM & Sales" && !catLower.includes("crm")) {
          return false;
        }
        if (selectedCategory === "Accounting" && !catLower.includes("accounting") && !catLower.includes("bookkeeping")) {
          return false;
        }
        if (selectedCategory === "Issue Tracking" && !catLower.includes("issue") && !catLower.includes("tracking")) {
          return false;
        }
      }

      // Search query
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.alternatives.some((a) =>
          a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
        )
      );
    });
  }, [allTools, search, selectedCategory]);

  return (
    <PageLayout noContainer>
      <div className="buyers-page-wrapper">
        <div className="buyers-container">
          {/* 1. Breadcrumb: ⌂ Home › Alternatives (Exact /buyers classes) */}
          <nav className="buyers-breadcrumb-row" aria-label="Breadcrumb">
            <Link href="/" className="buyers-breadcrumb-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="buyers-breadcrumb-sep">›</span>
            <span className="buyers-breadcrumb-current">Alternatives Directory</span>
          </nav>

          {/* 2. Hero Section (Exact /buyers classes & typography) */}
          <header style={{ textAlign: "center", padding: "0.25rem 0 1.25rem" }}>
            <div className="buyers-hero-badge">
              🔍 2026 SAAS ALTERNATIVES DIRECTORY
            </div>

            <h1 className="buyers-hero-title">
              Find Cheaper, Faster{" "}
              <span className="buyers-hero-title-gradient">Software Alternatives</span>
            </h1>

            <p className="buyers-hero-desc" style={{ margin: "0 auto 1.35rem", maxWidth: "660px" }}>
              Stop overpaying on bloated legacy tools. Browse our curated directories to discover vetted, high-converting replacements with transparent pricing.
            </p>

            {/* 3 Trust Badges (Exact /buyers classes) */}
            <div className="buyers-hero-trust-row">
              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">6 Core Stacks</span>
                  <span className="buyers-trust-label">Curated &amp; Audited</span>
                </div>
              </div>

              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">Up to 80%</span>
                  <span className="buyers-trust-label">Average Cost Savings</span>
                </div>
              </div>

              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">100% Unbiased</span>
                  <span className="buyers-trust-label">Verified User Reviews</span>
                </div>
              </div>
            </div>

            {/* Fast Search Bar */}
            <div className="alt-search-container">
              <div className="alt-search-input-wrap">
                <span className="alt-search-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by legacy software (e.g. Slack, Asana, HubSpot, Jira)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="alt-search-input"
                  aria-label="Search alternatives"
                />
                {search && (
                  <button
                    type="button"
                    className="alt-search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Fast Category Filter Tabs */}
            <div className="alt-filter-tabs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`alt-filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>

          {/* 3. Results Header Bar */}
          <div className="alt-results-header">
            <span className="alt-results-title">
              {selectedCategory === "All" ? "All Legacy Software" : `${selectedCategory} Tools`}
            </span>
            <span className="alt-results-count">
              {filteredTools.length} {filteredTools.length === 1 ? "result" : "results"}
            </span>
          </div>

          {/* 4. Directory Cards Grid */}
          {filteredTools.length === 0 ? (
            <div className="alt-empty-box">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
              <h3 className="alt-empty-title">No alternatives found</h3>
              <p className="alt-empty-desc">
                No matching legacy tools found for &quot;{search}&quot;. Try clearing filters or searching for another tool.
              </p>
              <button
                type="button"
                className="alt-empty-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="alt-cards-grid">
              {filteredTools.map((tool: LegacyToolData) => {
                const avatar = TOOL_AVATARS[tool.slug] || {
                  letter: tool.name[0].toUpperCase(),
                  className: "avatar-slack",
                };
                const legacyPriceShort = tool.legacyPricing.split("–")[0].trim();

                return (
                  <article key={tool.slug} className="alt-tool-card">
                    {/* Top Meta Row */}
                    <div className="alt-card-top-row">
                      <span className="alt-card-cat-badge">{tool.category.split("&")[0].trim()}</span>
                      <span className="alt-card-legacy-tag">
                        Legacy: {legacyPriceShort}
                      </span>
                    </div>

                    {/* Tool Brand Identity */}
                    <div className="alt-tool-identity">
                      <div className={`alt-tool-avatar ${avatar.className}`}>
                        {avatar.letter}
                      </div>
                      <h2 className="alt-tool-name">{tool.name} Alternatives</h2>
                    </div>

                    {/* Tagline */}
                    <p className="alt-tool-tagline">{tool.tagline}</p>

                    {/* Common Complaints Chips */}
                    {tool.commonComplaints && tool.commonComplaints.length > 0 && (
                      <div className="alt-complaints-wrap">
                        {tool.commonComplaints.slice(0, 2).map((complaint: string, idx: number) => (
                          <span key={idx} className="alt-complaint-chip">
                            ⚠️ {complaint.length > 42 ? complaint.slice(0, 42) + "..." : complaint}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Top Ranked Replacements Box */}
                    <div className="alt-replacements-box">
                      <div className="alt-replacements-head">
                        <span>Top Rated Replacements ({tool.alternatives.length})</span>
                      </div>
                      <div className="alt-replacements-list">
                        {tool.alternatives.map((alt) => (
                          <span key={alt.name} className="alt-match-pill">
                            <span className="alt-match-star">★</span>
                            <span>{alt.name}</span>
                            <span className="alt-match-price">({alt.priceText.split("(")[0].trim()})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Primary Card CTA Button (Using exact .buyers-btn-primary) */}
                    <Link
                      href={`/alternatives/${tool.slug}`}
                      className="buyers-btn-primary"
                    >
                      <span>Explore {tool.name} Alternatives</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

          {/* 5. Section: "Why Modern Teams Replace Legacy SaaS" (Exact /buyers Features Box) */}
          <div className="buyers-features-box">
            <div className="buyers-section-badge-wrapper">
              <span className="buyers-section-badge">
                BENEFITS OF SWITCHING
              </span>
            </div>
            <h2 className="buyers-section-title">
              Why Teams Replace Legacy Software
            </h2>
            <p className="buyers-section-sub">
              Modern tools deliver superior speed, transparent pricing, and zero administrative bloat.
            </p>

            <div className="buyers-features-grid">
              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-shield">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">No Per-Seat Penalties</h3>
                <p className="buyers-feature-desc">
                  Modern competitors offer flat-rate or predictable tiers so expanding your team doesn&apos;t double your software bill.
                </p>
              </div>

              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-tag">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Sub-100ms Velocity</h3>
                <p className="buyers-feature-desc">
                  Built on modern frameworks without decades of legacy code. Enjoy instant searches, keyboard shortcuts, and snappy UI.
                </p>
              </div>

              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">No Multi-Year Lock-In</h3>
                <p className="buyers-feature-desc">
                  Say goodbye to strict auto-renewing enterprise annual agreements. Switch, cancel, or modify tiers whenever you need.
                </p>
              </div>

              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-star">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Exclusive Deals</h3>
                <p className="buyers-feature-desc">
                  Access vetted lifetime and annual deals through SaaS MRKT to trade ongoing rental costs for permanent software access.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Section: Bottom CTA Card (Exact /buyers CTA Banner) */}
          <div className="buyers-cta-banner">
            <div className="buyers-cta-content" style={{ gridTemplateColumns: "1fr auto" }}>
              <div className="buyers-cta-left">
                <span className="buyers-cta-pill">UPGRADE YOUR SOFTWARE STACK</span>
                <h2 className="buyers-cta-title">
                  Ready to ditch bloated legacy software and{" "}
                  <span className="buyers-cta-title-highlight">save thousands?</span>
                </h2>
                <p className="buyers-cta-desc">
                  Browse hundreds of verified software tools with transparent pricing and real buyer reviews on SaaS MRKT.
                </p>
              </div>

              <div className="buyers-cta-buttons">
                <Link href="/products" className="buyers-btn-primary">
                  <span>Browse All Tools</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/tools/saas-spend-calculator" className="buyers-btn-secondary">
                  Calculate Spend Waste
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
