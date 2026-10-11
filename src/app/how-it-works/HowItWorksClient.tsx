"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StepItem {
  number: string;
  badgeText: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tags: string[];
  ctaText: string;
  ctaHref: string;
}

export default function HowItWorksClient() {
  // Track which buttons have been clicked so they stay solid black
  const [clickedSteps, setClickedSteps] = useState<Record<string, boolean>>({});
  // Layout mode: 'grid' (2 cards in a row) vs 'timeline' (vertical stream)
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
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
      desc: "We only allow reviews from verified users. See what real customers think about the product's onboarding, support, and ROI before making a decision.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      tags: ["Domain Authentication", "Unbiased Feedback", "Support & ROI Scores"],
      ctaText: "Explore Top Rated",
      ctaHref: "/products",
    },
    {
      number: "03",
      badgeText: "STEP 03",
      title: "Purchase or Trial",
      desc: "Connect directly with the software vendor. SaaS MRKT enables you to start free trials instantly or negotiate enterprise contracts securely.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      tags: ["Instant Sandbox Access", "Direct Vendor Chat", "Zero Middleman Markup"],
      ctaText: "Explore Products",
      ctaHref: "/products",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="section-header" style={{ textAlign: "center", marginBottom: "2.5rem", marginTop: "3.5rem" }}>
        <div className="section-badge" style={{ marginBottom: "1rem" }}>
          SIMPLE 3-STEP PROCESS
        </div>
        <h1 className="section-title">
          How &nbsp;<span className="section-title-highlight">SaaS MRKT</span>&nbsp; Works
        </h1>
        <p className="section-subtitle" style={{ maxWidth: "720px", margin: "0 auto" }}>
          We&apos;ve built a seamless experience that takes you from problem to verified solution in minutes, not months.
        </p>

        {/* View Toggle (2 Cards in One Row vs Vertical Timeline) */}
        <div className="hiw-view-toggle-wrap">
          <div className="hiw-view-toggle">
            <button
              type="button"
              className={`hiw-toggle-btn ${layoutMode === "grid" ? "active" : ""}`}
              onClick={() => setLayoutMode("grid")}
              id="hiw-toggle-grid"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>2 Cards per Row</span>
            </button>
            <button
              type="button"
              className={`hiw-toggle-btn ${layoutMode === "timeline" ? "active" : ""}`}
              onClick={() => setLayoutMode("timeline")}
              id="hiw-toggle-timeline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>List Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Metrics Strip */}
      <div className="hiw-metrics-strip">
        <div className="hiw-metric-item">
          <span className="hiw-metric-num">2,000+</span>
          <span className="hiw-metric-label">Verified Software Tools</span>
        </div>
        <div className="hiw-metric-sep" />
        <div className="hiw-metric-item">
          <span className="hiw-metric-num">100%</span>
          <span className="hiw-metric-label">Authenticated Reviews</span>
        </div>
        <div className="hiw-metric-sep" />
        <div className="hiw-metric-item">
          <span className="hiw-metric-num">50,000+</span>
          <span className="hiw-metric-label">Active Software Buyers</span>
        </div>
        <div className="hiw-metric-sep" />
        <div className="hiw-metric-item">
          <span className="hiw-metric-num">$0 Cost</span>
          <span className="hiw-metric-label">Always Free for Buyers</span>
        </div>
      </div>

      {/* Interactive Step Cards */}
      <div className={layoutMode === "grid" ? "hiw-steps-grid" : "hiw-timeline"}>
        {steps.map((step, idx) => {
          const isClicked = !!clickedSteps[step.number];
          const isLastInGrid = layoutMode === "grid" && idx === 2;

          return (
            <div
              key={step.number}
              className={`hiw-step-card ${layoutMode === "grid" ? "hiw-step-card--grid" : ""} ${isLastInGrid ? "hiw-step-card--wide" : ""}`}
              id={`hiw-step-${step.number}`}
            >
              <div className="hiw-step-icon-wrap">
                <span className="hiw-step-badge">{step.number}</span>
                <div className="hiw-step-icon">{step.icon}</div>
              </div>

              <div className="hiw-step-content">
                <div className="hiw-step-header">
                  <h2 className="hiw-step-title">{step.title}</h2>
                  <span className="hiw-step-indicator">Step {step.number} of 03</span>
                </div>
                <p className="hiw-step-desc">{step.desc}</p>

                <div className="hiw-step-tags">
                  {step.tags.map((tag, ti) => (
                    <span key={ti} className="hiw-step-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="hiw-step-action">
                  <Link
                    href={step.ctaHref}
                    className={`hiw-step-btn ${isClicked ? "hiw-step-btn--black" : ""}`}
                    id={`hiw-btn-${step.number}`}
                    onClick={() => handleButtonClick(step.number)}
                  >
                    <span>{step.ctaText}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* 4th complementary card for balanced 2x2 grid when in grid mode */}
        {layoutMode === "grid" && (
          <div className="hiw-step-card hiw-step-card--grid hiw-step-card--bonus" id="hiw-step-04">
            <div className="hiw-step-icon-wrap">
              <span className="hiw-step-badge" style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>PRO</span>
              <div className="hiw-step-icon" style={{ color: "#10B981", borderColor: "rgba(16, 185, 129, 0.2)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
            </div>

            <div className="hiw-step-content">
              <div className="hiw-step-header">
                <h2 className="hiw-step-title">Enterprise Advisory</h2>
                <span className="hiw-step-indicator" style={{ color: "#10B981", background: "rgba(16, 185, 129, 0.1)" }}>Free Concierge</span>
              </div>
              <p className="hiw-step-desc">
                Need customized compliance vetting, custom bulk licensing, or multi-seat procurement assistance? Talk to our dedicated advisors.
              </p>

              <div className="hiw-step-tags">
                {["Dedicated Account Rep", "SOC2 / ISO Review", "Volume Negotiation"].map((tag, ti) => (
                  <span key={ti} className="hiw-step-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="hiw-step-action">
                <Link
                  href="/contact"
                  className={`hiw-step-btn ${clickedSteps["04"] ? "hiw-step-btn--black" : ""}`}
                  id="hiw-btn-04"
                  onClick={() => handleButtonClick("04")}
                >
                  <span>Talk to an Advisor</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="hiw-bottom-cta">
        <span className="section-badge">START EXPLORING</span>
        <h2 className="hiw-bottom-title">Ready to find your next software?</h2>
        <p className="hiw-bottom-desc">
          Explore our extensive catalog of hand-picked, verified SaaS tools. From initial discovery to finalizing contracts, SaaS MRKT acts as your comprehensive procurement partner.
        </p>

        <div className="hiw-bottom-btns">
          <Link href="/products" className="btn-primary" id="hiw-explore-products-btn">
            Browse All Products
          </Link>
          <Link href="/sellers" className="btn-secondary" id="hiw-view-pricing-btn">
            For SaaS Sellers
          </Link>
        </div>

        <div className="hiw-preview-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/taskflow.jpg" 
            alt="SaaS Platform Dashboard" 
            className="hiw-preview-img"
          />
        </div>

        {/* Text Section Under Preview Image */}
        <div className="hiw-bottom-details">
          <p className="hiw-bottom-lead-text">
            Whether you need project management, CRM, or advanced marketing automation, our streamlined marketplace connects you with top-tier vendors instantly. Stop guessing and start comparing verified features, pricing plans, and real user reviews all in one place.
          </p>

          <div className="hiw-bottom-perks">
            <div className="hiw-bottom-perk-item">
              <span className="hiw-perk-check">✓</span>
              <span>100% Unbiased &amp; Verified Reviews</span>
            </div>
            <div className="hiw-bottom-perk-item">
              <span className="hiw-perk-check">✓</span>
              <span>Transparent Pricing &amp; No Hidden Fees</span>
            </div>
            <div className="hiw-bottom-perk-item">
              <span className="hiw-perk-check">✓</span>
              <span>Direct Vendor Connections with Zero Markup</span>
            </div>
          </div>

          <p className="hiw-bottom-subtext">
            Join over <strong>50,000+</strong> business leaders, developers, and IT teams making smarter software investments every month.
          </p>
        </div>
      </div>
    </>
  );
}
