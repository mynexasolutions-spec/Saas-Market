import React from "react";

const WHY_FEATURES = [
  {
    id: "feat-b2b",
    title: "B2B SaaS Marketplace",
    desc: "500+ verified cloud tools & software solutions",
    bg: "#EFF6FF",
    color: "#2563EB",
    cornerColor: "rgba(37, 99, 235, 0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    id: "feat-multi-vendor",
    title: "Multi-Vendor Platform",
    desc: "Direct founder access & verified reviews",
    bg: "#ECFDF5",
    color: "#10B981",
    cornerColor: "rgba(16, 185, 129, 0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: "feat-gateway",
    title: "Payment Gateway Alternatives",
    desc: "Safe checkouts with zero credit lock-in",
    bg: "#FFFBEB",
    color: "#F59E0B",
    cornerColor: "rgba(245, 158, 11, 0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    ),
  },
  {
    id: "feat-cloud-aws",
    title: "Cloud & AWS Alternatives",
    desc: "Fast onboarding without complex listing rules",
    bg: "#FDF2F8",
    color: "#EC4899",
    cornerColor: "rgba(236, 72, 153, 0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="15" x2="4" y2="15" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="15" x2="23" y2="15" />
      </svg>
    ),
  },
  {
    id: "feat-metrics",
    title: "SaaS vs Marketplace Metrics",
    desc: "Transparent revenue multiples & benchmarks",
    bg: "#F5F3FF",
    color: "#8B5CF6",
    cornerColor: "rgba(139, 92, 246, 0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "feat-fintech-dev",
    title: "Fintech & Developer Tools",
    desc: "From XBERT fintech to modern cloud APIs",
    bg: "#ECFEFF",
    color: "#06B6D4",
    cornerColor: "rgba(6, 182, 212, 0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

interface WhyChooseUsProps {
  onExploreClick: () => void;
}

export default function WhyChooseUs({ onExploreClick }: WhyChooseUsProps) {
  return (
    <section className="why-choose-section" id="why-choose">
      {/* 3D Atmospheric Background */}
      <div className="why-choose-bg" aria-hidden="true">
        <svg
          className="why-choose-bg-waves"
          viewBox="0 0 1440 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="whyWaveLeft" x1="0%" y1="0%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ede9fe" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="whyWaveRight" x1="100%" y1="20%" x2="30%" y2="80%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-50 -20 C 120 40, 240 240, 160 480 C 100 660, -20 740, -50 820 L -100 820 L -100 -20 Z"
            fill="url(#whyWaveLeft)"
          />
          <path
            d="M1490 60 C 1320 180, 1260 360, 1340 560 C 1410 720, 1470 780, 1500 840 L 1520 840 L 1520 60 Z"
            fill="url(#whyWaveRight)"
          />
        </svg>

        {/* Ambient glow orbs */}
        <span className="why-choose-orb why-choose-orb-1" />
        <span className="why-choose-orb why-choose-orb-2" />
      </div>

      <div className="container why-choose-inner">
        <div className="why-choose-box">
          {/* Left Column: Heading, Description, CTA Buttons, & Bottom Metrics */}
          <div className="why-left-content">
            <div className="section-badge why-choose-badge" id="why-choose-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span>B2B SAAS MARKETPLACE PLATFORM</span>
                </div>

                <h2 className="why-heading">
                  The Premier Multi-<br className="why-heading-br" />Vendor{" "}
                  <span className="section-title-highlight section-title-accent">SaaS Marketplace</span>
                </h2>

                <p className="why-desc">
                  Discover, compare, and acquire from a curated marketplace for SaaS products. Experience flexible SaaS payment gateway alternatives, verified cloud software solutions, and 0% commission founder listings.
                </p>

                <div className="why-btn-group">
                  <button
                    type="button"
                    className="why-primary-btn"
                    onClick={onExploreClick}
                    id="why-explore-btn"
                  >
                    <span>Explore Products</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                  <a href="#how-it-works" className="why-secondary-btn" id="why-learn-more-btn">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16" fill="#6366F1" />
                    </svg>
                    <span>Learn More</span>
                  </a>
                </div>

                {/* Bottom 3 Metrics Bar */}
                <div className="why-metrics-bar">
                  <div className="why-metric-item">
                    <div className="why-metric-icon why-metric-green">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="why-metric-info">
                      <span className="why-metric-value">10K+</span>
                      <span className="why-metric-label">Active Buyers</span>
                    </div>
                  </div>

                  <div className="why-metric-divider" />

                  <div className="why-metric-item">
                    <div className="why-metric-icon why-metric-blue">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                    </div>
                    <div className="why-metric-info">
                      <span className="why-metric-value">500+</span>
                      <span className="why-metric-label">SaaS Products</span>
                    </div>
                  </div>
                </div>
              </div>

          {/* Right Column: 6 Feature Cards Grid (2 columns x 3 rows) */}
          <div className="why-features-grid">
            {WHY_FEATURES.map((item) => (
              <div key={item.id} className="why-feature-card" id={item.id}>
                {/* Left Icon */}
                <div
                  className="why-feature-icon"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div className="why-feature-content">
                  <h3 className="why-feature-title">{item.title}</h3>
                  <p className="why-feature-desc">{item.desc}</p>
                </div>

                {/* Right Circular Action Button with Arrow */}
                <div className="why-feature-arrow-btn" aria-hidden="true" style={{ color: item.color }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>

                {/* Corner Soft Color Accent Wave */}
                <div
                  className="why-feature-corner-glow"
                  aria-hidden="true"
                  style={{ background: item.cornerColor }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
