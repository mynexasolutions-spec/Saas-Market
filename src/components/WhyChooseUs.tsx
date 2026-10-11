import React from "react";

const WHY_FEATURES = [
  {
    title: "B2B SaaS Marketplace",
    desc: "500+ verified cloud tools & software solutions",
    bg: "#EFF6FF",
    color: "#3B82F6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: "Multi-Vendor Platform",
    desc: "Direct founder access & verified reviews",
    bg: "#ECFEFF",
    color: "#06B6D4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="9" cy="10" r="1" />
        <circle cx="12" cy="10" r="1" />
        <circle cx="15" cy="10" r="1" />
      </svg>
    ),
  },
  {
    title: "Payment Gateway Alternatives",
    desc: "Safe checkouts with zero credit lock-in",
    bg: "#ECFDF5",
    color: "#10B981",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Cloud & AWS Alternatives",
    desc: "Fast onboarding without complex listing rules",
    bg: "#FEF2F2",
    color: "#EF4444",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    title: "SaaS vs Marketplace Metrics",
    desc: "Transparent revenue multiples & benchmarks",
    bg: "#EFF6FF",
    color: "#2563EB",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "Fintech & Developer Tools",
    desc: "From XBERT fintech to modern cloud APIs",
    bg: "#F5F3FF",
    color: "#8B5CF6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
      <div className="container">
        <div className="why-choose-box">
          {/* Left Column */}
          <div className="why-left-content">
            <div className="section-badge" id="why-choose-badge" style={{ alignSelf: "flex-start" }}>
              B2B SAAS MARKETPLACE PLATFORM
            </div>
            <h2 className="why-heading">
              The Premier Multi-Vendor{" "}
              <span className="section-title-highlight">SaaS Marketplace</span>
            </h2>
            <p className="why-desc">
              Discover, compare, and acquire from a curated marketplace for SaaS products. Experience flexible SaaS payment gateway alternatives, verified cloud software solutions, and 0% commission founder listings.
            </p>
            <div className="why-btn-group">
              <button
                type="button"
                className="btn-primary"
                onClick={onExploreClick}
                id="why-explore-btn"
              >
                <span>Explore Products</span>
              </button>
              <a href="#how-it-works" className="btn-secondary" id="why-learn-more-btn">
                <span>Learn More</span>
              </a>
            </div>
          </div>

          {/* Right Column: 6 Feature Cards Grid */}
          <div className="why-features-grid">
            {WHY_FEATURES.map((item) => (
              <div key={item.title} className="why-feature-card">
                <div
                  className="why-feature-icon"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="why-feature-title">{item.title}</h3>
                <p className="why-feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

