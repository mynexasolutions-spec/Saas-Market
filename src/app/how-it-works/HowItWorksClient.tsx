"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "@/app/buyers/buyers-page.css";
import "./how-it-works.css";

interface StepItem {
  number: string;
  badgeText: string;
  title: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  tags: string[];
  ctaText: string;
  ctaHref: string;
}

export default function HowItWorksClient() {
  const [clickedSteps, setClickedSteps] = useState<Record<string, boolean>>({});
  const [layoutMode, setLayoutMode] = useState<"grid" | "timeline">("grid");

  const handleButtonClick = (stepNumber: string) => {
    setClickedSteps((prev) => ({
      ...prev,
      [stepNumber]: true,
    }));
  };

  const steps: StepItem[] = [
    {
      number: "01",
      badgeText: "STEP 01",
      title: "Discover & Compare",
      desc: "Use our advanced filters to find the exact software category you need. Compare features, pricing, and integrations side-by-side without creating an account.",
      iconBg: "#eef2ff",
      iconColor: "#4f46e5",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      tags: ["2,000+ Verified SaaS", "Side-by-Side Matrix", "Real-Time Pricing"],
      ctaText: "Browse Categories",
      ctaHref: "/categories",
    },
    {
      number: "02",
      badgeText: "STEP 02",
      title: "Read Verified Reviews",
      desc: "We only allow reviews from verified users. See what real customers think about the product's onboarding, customer support, and ROI before making a decision.",
      iconBg: "#ecfdf5",
      iconColor: "#059669",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      tags: ["Domain Authentication", "Unbiased Feedback", "Support & ROI Scores"],
      ctaText: "Explore Top Rated",
      ctaHref: "/products",
    },
    {
      number: "03",
      badgeText: "STEP 03",
      title: "Purchase or Free Trial",
      desc: "Connect directly with verified vendors. SaaS MRKT enables you to start free trials instantly or complete safe transactions with 100% escrow protection.",
      iconBg: "#faf5ff",
      iconColor: "#7c3aed",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      tags: ["Instant Sandbox Access", "Direct Vendor Chat", "100% Escrow Safe"],
      ctaText: "Explore Products",
      ctaHref: "/products",
    },
    {
      number: "04",
      badgeText: "CONCIERGE",
      title: "Enterprise Advisory",
      desc: "Need customized compliance vetting, custom bulk licensing, or multi-seat procurement assistance? Talk directly to our dedicated advisors at zero cost.",
      iconBg: "#fef3c7",
      iconColor: "#d97706",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      tags: ["Dedicated Account Rep", "SOC2 / ISO Review", "Volume Negotiation"],
      ctaText: "Talk to an Advisor",
      ctaHref: "/contact",
    },
  ];

  const flowSteps = [
    {
      num: "01",
      title: "1. Discover & Filter",
      desc: "Filter 2,000+ tools by budget, team size, rating, and technology integrations.",
      iconBg: "#eef2ff",
      iconColor: "#4f46e5",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "2. Compare & Evaluate",
      desc: "Run side-by-side matrices and read authenticated reviews from real customers.",
      iconBg: "#ecfdf5",
      iconColor: "#059669",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "3. Deploy with Escrow",
      desc: "Activate instant trials or purchase securely with our 30-day money-back guarantee.",
      iconBg: "#faf5ff",
      iconColor: "#7c3aed",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <PageLayout activeNav="resources" noContainer>
      <div className="hiw-page-wrapper">
        <div className="hiw-container">
          {/* 1. Breadcrumbs: ⌂ Home › How It Works */}
          <nav className="hiw-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="hiw-breadcrumb-sep">›</span>
            <span className="hiw-breadcrumb-current">How It Works</span>
          </nav>

          {/* 2. Compact Hero Section */}
          <header className="hiw-hero">
            <div className="hiw-hero-pill">SIMPLE 3-STEP PROCESS</div>

            <h1 className="hiw-hero-title">
              How <span className="hiw-title-gradient">SaaS MRKT</span> Works
            </h1>

            <p className="hiw-hero-desc">
              We&apos;ve built a seamless experience that takes you from software problem to verified solution in minutes, not months.
            </p>

            {/* 4 Trust Metrics Strip (Exact /buyers typography scale) */}
            <div className="hiw-hero-badges">
              <div className="hiw-badge-item">
                <div className="hiw-badge-icon icon-purple">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className="hiw-badge-text">
                  <span className="hiw-badge-num">2,000+</span>
                  <span className="hiw-badge-label">Verified Software Tools</span>
                </div>
              </div>

              <div className="hiw-badge-item">
                <div className="hiw-badge-icon icon-green">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="hiw-badge-text">
                  <span className="hiw-badge-num">100%</span>
                  <span className="hiw-badge-label">Authenticated Reviews</span>
                </div>
              </div>

              <div className="hiw-badge-item">
                <div className="hiw-badge-icon icon-blue">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="hiw-badge-text">
                  <span className="hiw-badge-num">50,000+</span>
                  <span className="hiw-badge-label">Active Software Buyers</span>
                </div>
              </div>

              <div className="hiw-badge-item">
                <div className="hiw-badge-icon icon-amber">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                </div>
                <div className="hiw-badge-text">
                  <span className="hiw-badge-num">$0 Cost</span>
                  <span className="hiw-badge-label">Always Free For Buyers</span>
                </div>
              </div>
            </div>
            <div className="hiw-hero-badges-line"></div>

            {/* View Mode Toggle: 2 Cards per Row vs Timeline */}
            <div className="hiw-toggle-wrap">
              <div className="hiw-toggle-box">
                <button
                  type="button"
                  className={`hiw-toggle-btn ${layoutMode === "grid" ? "is-active" : ""}`}
                  onClick={() => setLayoutMode("grid")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  2 Cards per Row
                </button>
                <button
                  type="button"
                  className={`hiw-toggle-btn ${layoutMode === "timeline" ? "is-active" : ""}`}
                  onClick={() => setLayoutMode("timeline")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  List Timeline
                </button>
              </div>
            </div>
          </header>

          {/* 3. Interactive Step Cards (Grid vs Timeline) */}
          <section style={{ marginBottom: "2rem" }}>
            <div className={layoutMode === "grid" ? "hiw-cards-grid" : "hiw-cards-timeline"}>
              {steps.map((step) => {
                const isClicked = !!clickedSteps[step.number];

                return (
                  <article key={step.number} className="hiw-card">
                    <div className="hiw-card-icon-wrap">
                      <div
                        className="hiw-card-icon"
                        style={{ background: step.iconBg, color: step.iconColor }}
                      >
                        {step.icon}
                      </div>
                      <span className={`hiw-card-badge hiw-card-badge--${step.number}`}>
                        {step.badgeText}
                      </span>
                    </div>

                    <div className="hiw-card-content">
                      <div className="hiw-card-head">
                        <h2 className="hiw-card-title">{step.title}</h2>
                        <span className="hiw-card-step-tag">Step {step.number} of 04</span>
                      </div>

                      <p className="hiw-card-desc">{step.desc}</p>

                      <div className="hiw-card-tags">
                        {step.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="hiw-card-tag">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="hiw-card-footer">
                        <Link
                          href={step.ctaHref}
                          className={`hiw-card-btn ${isClicked ? "is-clicked" : ""}`}
                          onClick={() => handleButtonClick(step.number)}
                        >
                          <span>{step.ctaText}</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 4. The 3-Step Rapid Escrow Flow (Compact & Frosted Lavender) */}
          <section className="hiw-journey-box">
            <div className="hiw-section-header">
              <span className="hiw-section-badge">RAPID PROCUREMENT</span>
              <h2 className="hiw-section-title">From Discovery to Deployment in 3 Steps</h2>
              <p className="hiw-section-sub">
                Our vetted procurement flow eliminates the friction and risk of buying independent software.
              </p>
            </div>

            <div className="hiw-flow-row">
              {flowSteps.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="hiw-flow-card">
                    <span className="hiw-flow-num">{step.num}</span>
                    <div
                      className="hiw-flow-icon"
                      style={{ background: step.iconBg, color: step.iconColor }}
                    >
                      {step.icon}
                    </div>
                    <h3 className="hiw-flow-title">{step.title}</h3>
                    <p className="hiw-flow-desc">{step.desc}</p>
                  </div>

                  {idx < flowSteps.length - 1 && (
                    <div className="hiw-flow-arrow" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Compact Key Perks Row */}
            <div className="hiw-perks-row">
              <div className="hiw-perk-pill">
                <span className="hiw-perk-check">✓</span>
                <span>100% Unbiased &amp; Verified Reviews</span>
              </div>
              <div className="hiw-perk-pill">
                <span className="hiw-perk-check">✓</span>
                <span>Transparent Pricing &amp; Zero Hidden Fees</span>
              </div>
              <div className="hiw-perk-pill">
                <span className="hiw-perk-check">✓</span>
                <span>Direct Vendor Connections with Zero Markup</span>
              </div>
            </div>
          </section>

          {/* 5. Cosmic High-Conversion CTA Banner (Exact /buyers styling) */}
          <section className="buyers-cta-banner" style={{ margin: "1.5rem 0 0 0" }}>
            <div className="buyers-cta-content">
              {/* Left Column */}
              <div className="buyers-cta-left">
                <div className="buyers-cta-pill">START EXPLORING TODAY</div>
                <h2 className="buyers-cta-title">
                  Ready to find your{" "}
                  <span className="buyers-cta-title-highlight">next software?</span>
                </h2>
                <p className="buyers-cta-desc">
                  Explore over 2,000+ curated products backed by escrow protection, strict vendor background checks, and authenticated customer reviews.
                </p>
                <div className="buyers-cta-buttons">
                  <Link href="/products" className="buyers-cta-btn-primary">
                    Browse All Products
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link href="/sellers" className="buyers-cta-btn-secondary">
                    For SaaS Sellers
                  </Link>
                </div>
              </div>

              {/* Right Column: Floating Decorative Badges */}
              <div className="buyers-cta-right" aria-hidden="true">
                <div className="buyers-cta-tiles-container">
                  <div className="buyers-cta-badge-deals">
                    <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span> 2,000+ Verified Tools
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-notion"
                    title="Discovery"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-slack"
                    title="Evaluation"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-figma"
                    title="Escrow Safe"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>

                  <div className="buyers-cta-badge-verified">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified Process
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
