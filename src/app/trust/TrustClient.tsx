"use client";

import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "@/app/buyers/buyers-page.css";
import "./trust-page.css";

export default function TrustClient() {
  const securityPillars = [
    {
      id: "escrow",
      tag: "Capital Safety",
      tagBg: "#ecfdf5",
      tagColor: "#059669",
      iconBg: "#ecfdf5",
      iconColor: "#059669",
      title: "100% Escrow Protection",
      description:
        "When you purchase any tool on SaaS MRKT, your payment is stored safely in escrow. Sellers are only paid after you receive your license and verify product functionality.",
      points: [
        "Funds held in regulated segregated escrow vault",
        "Payouts unlocked only after buyer verification",
        "Dispute mediation team ready 24/7",
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "vendor",
      tag: "Identity Audit",
      tagBg: "#ede9fe",
      tagColor: "#6d28d9",
      iconBg: "#ede9fe",
      iconColor: "#6d28d9",
      title: "Strict Vendor Verification",
      description:
        "Every vendor passes our multi-point corporate identity and domain verification screening. We verify company registrations, developer track records, and commercial copyright rights.",
      points: [
        "Government ID & corporate entity validation",
        "Git repository & original code ownership proof",
        "Domain DNS cross-referencing & email checks",
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      ),
    },
    {
      id: "malware",
      tag: "Code Integrity",
      tagBg: "#eff6ff",
      tagColor: "#2563eb",
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
      title: "Malware & Security Auditing",
      description:
        "Downloadable software, source code, and API endpoints are screened for backdoors, unauthorized telemetry, and known CVE vulnerabilities before listing approval.",
      points: [
        "Automated static dependency vulnerability scan",
        "Isolated sandbox execution & telemetry audit",
        "Zero hidden trackers or malicious backdoors",
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
        </svg>
      ),
    },
    {
      id: "guarantee",
      tag: "Satisfaction",
      tagBg: "#fef3c7",
      tagColor: "#d97706",
      iconBg: "#fef3c7",
      iconColor: "#d97706",
      title: "30-Day Money-Back Guarantee",
      description:
        "If a tool fails to work as advertised or the seller fails to deliver active license keys within 30 days, our dispute resolution team initiates a full 100% escrow refund.",
      points: [
        "100% complete refund on unfulfilled tools",
        "No complicated paperwork or hidden penalty fees",
        "Fast resolution turnaround within 48 hours",
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
  ];

  const complianceStandards = [
    {
      title: "PCI-DSS Level 1",
      subtitle: "Top tier payment processing",
      desc: "Bank-grade encrypted tokenization through certified payment gateways. No raw card numbers ever touch our databases.",
      color: "#4f46e5",
      bg: "#ede9fe",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      title: "256-Bit SSL / TLS",
      subtitle: "End-to-end encrypted traffic",
      desc: "All marketplace communication, API keys, and download handshakes are strictly wrapped in TLS 1.3 encryption.",
      color: "#059669",
      bg: "#ecfdf5",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "SOC2 Type II Ready",
      subtitle: "Strict data access isolation",
      desc: "Segregated cloud architecture with role-based access control, cryptographic secrets vaulting, and tamper-evident audit logs.",
      color: "#2563eb",
      bg: "#eff6ff",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
    },
    {
      title: "GDPR & CCPA Compliant",
      subtitle: "Complete user data sovereignty",
      desc: "Explicit consent management, strict zero-telemetry leaks, complete right-to-erasure data compliance for global teams.",
      color: "#d97706",
      bg: "#fef3c7",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      num: "01",
      title: "1. Secure Escrow Checkout",
      desc: "Purchase with confidence. Funds are locked into a segregated escrow account and held securely.",
      iconBg: "#eef2ff",
      iconColor: "#4f46e5",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "2. License & Delivery Inspection",
      desc: "Receive software keys or access repos immediately. You test functionality and verify specifications.",
      iconBg: "#ecfdf5",
      iconColor: "#059669",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "3. Verified Release or Full Refund",
      desc: "Happy with your tool? Escrow releases funds to vendor. Encounter an issue? 100% money-back guarantee.",
      iconBg: "#faf5ff",
      iconColor: "#7c3aed",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <PageLayout activeNav="trust" noContainer>
      <div className="trust-page-wrapper">
        <div className="trust-container">
          {/* 1. Breadcrumb: ⌂ Home › Trust & Buyer Protection */}
          <nav className="trust-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="trust-breadcrumb-sep">›</span>
            <span className="trust-breadcrumb-current">Trust &amp; Buyer Protection</span>
          </nav>

          {/* 2. Compact Modern Hero Section */}
          <section className="trust-hero">
            <div className="trust-hero-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              INSTITUTIONAL-GRADE SECURITY
            </div>

            <h1 className="trust-hero-title">
              Buy &amp; Sell SaaS with{" "}
              <span className="trust-title-gradient">Absolute Confidence</span>
            </h1>

            <p className="trust-hero-desc">
              We eliminate the risks of buying independent software online. Our four-layer security architecture safeguards your capital, your codebase, and your data.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="trust-hero-actions">
              <Link href="/products" className="buyers-btn-primary">
                Explore Verified Products
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/compare" className="buyers-btn-secondary">
                Compare Tools
              </Link>
            </div>

            {/* 3 Hero Trust Badges (Exact /buyers typography scale) */}
            <div className="trust-hero-badges">
              <div className="trust-badge-item">
                <div className="trust-badge-icon icon-green">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="trust-badge-text">
                  <span className="trust-badge-num">100% Escrow</span>
                  <span className="trust-badge-label">Protected Transactions</span>
                </div>
              </div>

              <div className="trust-badge-item">
                <div className="trust-badge-icon icon-purple">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="trust-badge-text">
                  <span className="trust-badge-num">Zero-Day</span>
                  <span className="trust-badge-label">CVE Malware Auditing</span>
                </div>
              </div>

              <div className="trust-badge-item">
                <div className="trust-badge-icon icon-blue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div className="trust-badge-text">
                  <span className="trust-badge-num">30-Day</span>
                  <span className="trust-badge-label">Money-Back Guarantee</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Four-Layer Security Architecture (Compact & Modern Grid) */}
          <section style={{ marginBottom: "2rem" }}>
            <div className="trust-section-head">
              <span className="trust-section-badge">FOUR-LAYER DEFENSE</span>
              <h2 className="trust-section-title">Built to Protect Every Transaction</h2>
              <p className="trust-section-sub">
                Enterprise-grade controls engineered to protect buyers and founders at every step of the software acquisition journey.
              </p>
            </div>

            <div className="trust-pillars-grid">
              {securityPillars.map((pillar) => (
                <div key={pillar.id} className="trust-pillar-card">
                  <div className="trust-pillar-head">
                    <div
                      className="trust-pillar-icon-box"
                      style={{ background: pillar.iconBg, color: pillar.iconColor }}
                    >
                      {pillar.icon}
                    </div>
                    <span
                      className="trust-pillar-tag"
                      style={{ background: pillar.tagBg, color: pillar.tagColor }}
                    >
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="trust-pillar-title">{pillar.title}</h3>
                  <p className="trust-pillar-desc">{pillar.description}</p>

                  <ul className="trust-pillar-list">
                    {pillar.points.map((pt, i) => (
                      <li key={i} className="trust-pillar-item">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Three-Step Buyer Escrow Workflow */}
          <section className="trust-flow-section">
            <div className="trust-section-head">
              <span className="trust-section-badge">HOW IT WORKS</span>
              <h2 className="trust-section-title">Escrow Protection in 3 Simple Steps</h2>
              <p className="trust-section-sub">
                Your payment remains untouched in our licensed vault until you inspect and approve the software.
              </p>
            </div>

            <div className="trust-steps-row">
              {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="trust-step-card">
                    <span className="trust-step-num">{step.num}</span>
                    <div
                      className="trust-step-icon"
                      style={{ background: step.iconBg, color: step.iconColor }}
                    >
                      {step.icon}
                    </div>
                    <h3 className="trust-step-title">{step.title}</h3>
                    <p className="trust-step-desc">{step.desc}</p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="trust-step-arrow" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* 5. Institutional Standards & Compliance Matrix */}
          <section className="trust-compliance-box">
            <div className="trust-section-head" style={{ marginBottom: "1.2rem" }}>
              <span className="trust-section-badge">GLOBAL PROTOCOLS</span>
              <h2 className="trust-section-title">Industry Compliance &amp; Standards</h2>
              <p className="trust-section-sub" style={{ marginBottom: 0 }}>
                We adhere to strict international protocols to protect your credentials, payments, and organizational data.
              </p>
            </div>

            <div className="trust-compliance-grid">
              {complianceStandards.map((std, i) => (
                <div key={i} className="trust-compliance-card">
                  <div
                    className="trust-compliance-icon"
                    style={{ background: std.bg, color: std.color }}
                  >
                    {std.icon}
                  </div>
                  <div className="trust-compliance-title" style={{ color: std.color }}>
                    {std.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.3rem" }}>
                    {std.subtitle}
                  </div>
                  {/* <p className="trust-compliance-desc">{std.desc}</p> */}
                </div>
              ))}
            </div>
          </section>

          {/* 6. High-Conversion Cosmic CTA Banner (Exact /buyers styling) */}
          <section className="buyers-cta-banner" style={{ margin: "1.5rem 0 0 0" }}>
            <div className="buyers-cta-content">
              {/* Left Column */}
              <div className="buyers-cta-left">
                <div className="buyers-cta-pill">100% RISK-FREE PURCHASING</div>
                <h2 className="buyers-cta-title">
                  Ready to explore{" "}
                  <span className="buyers-cta-title-highlight">verified SaaS tools?</span>
                </h2>
                <p className="buyers-cta-desc">
                  Browse over 2,000+ curated products backed by escrow protection, strict vendor background checks, and a 30-day money-back guarantee.
                </p>
                <div className="buyers-cta-buttons">
                  <Link href="/products" className="buyers-cta-btn-primary">
                    Browse Verified Products
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link href="/compare" className="buyers-cta-btn-secondary">
                    Compare Tools
                  </Link>
                </div>
              </div>

              {/* Right Column: Floating Decorative Badges */}
              <div className="buyers-cta-right" aria-hidden="true">
                <div className="buyers-cta-tiles-container">
                  <div className="buyers-cta-badge-deals">
                    <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span> 100% Escrow Protected
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-notion"
                    title="Tier-1 Escrow"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-slack"
                    title="Code Audited"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-figma"
                    title="Money Back"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>

                  <div className="buyers-cta-badge-verified">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    Verified Guarantee
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

