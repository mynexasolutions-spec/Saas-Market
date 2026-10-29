"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { LegacyToolData } from "@/data/alternativesData";
import "./alternative-detail.css";

interface AlternativeDetailClientProps {
  tool: LegacyToolData;
}

const POPULAR_TOOLS = [
  { name: "Slack", slug: "slack" },
  { name: "Asana", slug: "asana" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Salesforce", slug: "salesforce" },
  { name: "QuickBooks", slug: "quickbooks" },
  { name: "Jira", slug: "jira" },
];

export default function AlternativeDetailClient({ tool }: AlternativeDetailClientProps) {
  const legacyPriceShort = tool.legacyPricing.split("–")[0].trim();

  return (
    <PageLayout noContainer>
      <div className="alt-detail-wrapper">
        <div className="alt-detail-container">
          {/* 1. Breadcrumbs (Compact) */}
          <nav className="alt-detail-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="alt-detail-breadcrumb-sep">›</span>
            <Link href="/alternatives">Alternatives</Link>
            <span className="alt-detail-breadcrumb-sep">›</span>
            <span className="alt-detail-breadcrumb-current">{tool.name}</span>
          </nav>

          {/* 2. Hero Section (Ultra-Compact) */}
          <header className="alt-detail-hero">
            <div className="alt-detail-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              2026 Vetted Replacements
            </div>

            <h1 className="alt-detail-title">
              Best <span className="alt-detail-title-gradient">{tool.name} Alternatives</span>
            </h1>

            <p className="alt-detail-desc">
              Looking to replace {tool.name}? Discover faster, more affordable software with higher ROI and zero bloat.
            </p>

            {/* Spec Strip */}
            <div className="alt-detail-meta-strip">
              <div className="alt-detail-meta-item">
                <span className="alt-detail-meta-label">Category:</span>
                <span className="alt-detail-meta-val">{tool.category.split("&")[0].trim()}</span>
              </div>
              <span className="alt-detail-meta-sep">•</span>
              <div className="alt-detail-meta-item">
                <span className="alt-detail-meta-label">Legacy:</span>
                <span className="alt-detail-meta-val price">{legacyPriceShort}</span>
              </div>
              <span className="alt-detail-meta-sep">•</span>
              <div className="alt-detail-meta-item">
                <span className="alt-detail-meta-label">Savings:</span>
                <span className="alt-detail-meta-val savings">Up to 75%</span>
              </div>
            </div>
          </header>

          {/* 3. Why Teams Leave Section (Compact) */}
          {tool.commonComplaints && tool.commonComplaints.length > 0 && (
            <section className="alt-detail-complaints-box">
              <div className="alt-detail-complaints-head">
                <span className="alt-detail-complaints-icon">⚠️</span>
                <h2 className="alt-detail-complaints-title">
                  Why Teams Are Leaving {tool.name} in 2026
                </h2>
              </div>
              <p className="alt-detail-complaints-desc">
                Top friction points reported by software buyers and engineering managers:
              </p>
              <div className="alt-detail-complaints-grid">
                {tool.commonComplaints.map((c, i) => (
                  <div key={i} className="alt-detail-complaint-item">
                    <span className="alt-detail-complaint-cross">✕</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Ranked Alternatives Cards */}
          <section>
            <div className="alt-detail-section-head">
              <h2 className="alt-detail-section-title">
                Top Rated Alternatives to {tool.name}
              </h2>
              <span className="alt-detail-section-sub">
                {tool.alternatives.length} verified replacements
              </span>
            </div>

            <div className="alt-detail-cards-col">
              {tool.alternatives.map((alt, idx) => (
                <article key={alt.name} className="alt-detail-card">
                  {/* Top Row: Brand Avatar, Name, Rating + Rank Badge */}
                  <div className="alt-detail-card-top-row">
                    <div className="alt-detail-brand-left">
                      <div
                        className="alt-detail-logo-box"
                        style={{ background: alt.brandColor || "#4F46E5" }}
                      >
                        {alt.logo ? (
                          <Image src={alt.logo} alt={alt.name} fill style={{ objectFit: "cover" }} />
                        ) : (
                          alt.name.charAt(0)
                        )}
                      </div>

                      <div className="alt-detail-name-wrap">
                        <h3 className="alt-detail-card-name">{alt.name}</h3>
                        <div className="alt-detail-card-rating">
                          <span className="alt-detail-rating-stars">★ {alt.rating}</span>
                          <span className="alt-detail-rating-reviews">({alt.reviewCount.toLocaleString()})</span>
                          <span className="alt-detail-card-cat">• {alt.category.split("&")[0].trim()}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`alt-detail-rank-badge ${idx === 0 ? "gold" : "blue"}`}>
                      {idx === 0 ? "🏆 #1 Pick" : `#${idx + 1} Alternative`}
                    </div>
                  </div>

                  {/* Key Advantage Pill */}
                  <div className="alt-detail-advantage-pill">
                    <span>✓ Key Advantage:</span>
                    <span>{alt.keyAdvantage}</span>
                  </div>

                  {/* Description */}
                  <p className="alt-detail-card-desc">{alt.description}</p>

                  {/* Feature Highlights Grid */}
                  <div className="alt-detail-features-grid">
                    {alt.features.map((feat, i) => (
                      <div key={i} className="alt-detail-feature-item">
                        <span className="alt-detail-feature-check">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row: Pricing & CTAs */}
                  <div className="alt-detail-card-bottom">
                    <div className="alt-detail-price-box">
                      <span className="alt-detail-price-label">Pricing vs {tool.name}</span>
                      <span className="alt-detail-price-val">{alt.priceText}</span>
                    </div>

                    <div className="alt-detail-card-actions">
                      <Link
                        href={`/products/${alt.productId || "prod-taskflow"}/buy`}
                        className="alt-detail-btn-deal"
                      >
                        <span>Get {alt.name} Deal</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                      <Link
                        href={`/compare?tool1=${alt.name.toLowerCase()}&tool2=${tool.slug}`}
                        className="alt-detail-btn-compare"
                      >
                        <span>Compare vs {tool.name}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 5. Other Popular Alternatives Explorer (Compact) */}
          <section className="alt-detail-others-box">
            <h3 className="alt-detail-others-title">
              Looking for other software alternatives?
            </h3>
            <div className="alt-detail-others-list">
              {POPULAR_TOOLS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/alternatives/${t.slug}`}
                  className={`alt-detail-other-pill ${t.slug === tool.slug ? "active" : ""}`}
                >
                  {t.name} Alternatives
                </Link>
              ))}
            </div>
          </section>

          {/* 6. Cosmic Bottom CTA Banner (Compact) */}
          <div className="alt-detail-cta-banner">
            <div className="alt-detail-cta-content">
              <div className="alt-detail-cta-left">
                <span className="alt-detail-cta-pill">UPGRADE YOUR SOFTWARE STACK</span>
                <h2 className="alt-detail-cta-title">
                  Ready to modernize your tools and{" "}
                  <span className="alt-detail-cta-title-highlight">cut SaaS costs?</span>
                </h2>
                <p className="alt-detail-cta-desc">
                  Browse verified alternatives, compare side-by-side specs, or audit your stack.
                </p>
              </div>

              <div className="alt-detail-cta-buttons">
                <Link href="/alternatives" className="alt-detail-cta-btn-primary">
                  <span>All Alternatives</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/tools/saas-spend-calculator" className="alt-detail-cta-btn-secondary">
                  Calculate Stack Waste
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
