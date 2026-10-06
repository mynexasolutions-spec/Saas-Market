"use client";

import React from "react";
import MetricsBar from "./MetricsBar";

interface HeroProps {
  onExploreScroll?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedTag?: string;
  setSelectedTag?: (tag: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export default function Hero({ onExploreScroll }: HeroProps) {
  // Left Column Cards (Scrolls UP continuously)
  const renderLeftCards = () => (
    <>
      {/* Card 1: Cutting-Edge Digital Solutions */}
      <div className="hero-mockup-card card-cutting-edge">
        <div className="mockup-header-row">
          <div className="mockup-logo-glyph glyph-coral">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="mockup-rating-badge">
            <span className="rating-star">★</span> 4.9 Clutch
          </div>
        </div>
        <h3 className="mockup-card-title">Cutting-Edge Digital Solutions</h3>
        <div className="mockup-subtext">Enterprise workflow intelligence &amp; integrations</div>
        <div className="mockup-actions-row">
          <span className="mockup-pill-btn">View Demo</span>
          <span className="mockup-meta-tag">SOC-2 Type II</span>
        </div>
      </div>

      {/* Card 2: Transform HR & Payroll (Dark Dashboard Card) */}
      <div className="hero-mockup-card card-dark-dashboard">
        <div className="mockup-header-row">
          <div className="mockup-brand-dark">
            <span className="brand-dot-pulse" />
            <span className="mockup-brand-name">NovaHR Suite</span>
          </div>
          <span className="mockup-live-status">Live Sync</span>
        </div>
        <h3 className="mockup-card-title dark-title">
          Transform your HR and payroll processes today
        </h3>
        <div className="mockup-btn-glow">
          <span>Automate Payroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>

        {/* Dark Analytics Bars Preview */}
        <div className="mockup-dark-graph-preview">
          <div className="dark-graph-header">
            <span>Payroll Disbursed</span>
            <strong className="dark-graph-val">$84,200</strong>
          </div>
          <div className="dark-bars-container">
            <div className="dark-bar-item">
              <div className="bar-track">
                <div className="bar-fill bar-fill-orange" style={{ width: "82%" }} />
              </div>
              <span className="bar-label">Engineering</span>
            </div>
            <div className="dark-bar-item">
              <div className="bar-track">
                <div className="bar-fill bar-fill-cyan" style={{ width: "95%" }} />
              </div>
              <span className="bar-label">Sales &amp; Ops</span>
            </div>
            <div className="dark-bar-item">
              <div className="bar-track">
                <div className="bar-fill bar-fill-purple" style={{ width: "68%" }} />
              </div>
              <span className="bar-label">Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Marketing & AI Editorial */}
      <div className="hero-mockup-card card-marketing-guide">
        <div className="mockup-header-row">
          <span className="mockup-author-chip">Marketing OS</span>
          <span className="mockup-price-badge">$120 /mo</span>
        </div>
        <h3 className="mockup-card-title">
          Master digital marketing with comprehensive AI guides
        </h3>
        {/* Geometric Graphic Block (Upshift style) */}
        <div className="mockup-art-block">
          <div className="art-rect rect-coral" />
          <div className="art-rect rect-navy" />
          <div className="art-rect rect-cream" />
        </div>
        <div className="mockup-growth-stat">
          <span className="growth-indicator">▲ +38%</span>
          <span className="growth-text">Average conversion increase</span>
        </div>
      </div>

      {/* Card 4: Meeting / Collaboration SaaS */}
      <div className="hero-mockup-card card-collab-mini">
        <div className="collab-flex">
          <div className="collab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <div>
            <div className="collab-title">SyncPulse AI Meetings</div>
            <div className="collab-desc">Auto-summaries in 40+ languages</div>
          </div>
        </div>
      </div>
    </>
  );

  // Right Column Cards (Scrolls DOWN continuously)
  const renderRightCards = () => (
    <>
      {/* Card 5: Fintech & Investment (Mobile App Style) */}
      <div className="hero-mockup-card card-fintech-mobile">
        <div className="fintech-phone-top">
          <div className="phone-brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>PayFlow Pro</span>
          </div>
          <span className="phone-battery-pill">98%</span>
        </div>

        <h3 className="mockup-card-title fintech-heading">
          Invest with confidence,<br />Grow your future
        </h3>

        {/* Phone Screen Mockup */}
        <div className="fintech-phone-screen">
          <div className="phone-notch" />
          <div className="phone-balance-label">Total Balance</div>
          <div className="phone-balance-val">$10,520.45</div>
          <div className="phone-delta-chip">▲ +14.2% this week</div>

          {/* Sparkline Wave */}
          <div className="phone-sparkline-wrap">
            <svg width="100%" height="34" viewBox="0 0 160 34" fill="none">
              <path d="M0 26C20 26 35 8 55 14C75 20 90 4 110 9C130 14 145 2 160 3" stroke="#5E4BEE" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0 26C20 26 35 8 55 14C75 20 90 4 110 9C130 14 145 2 160 3V34H0V26Z" fill="url(#fintech-grad)" opacity="0.15" />
              <defs>
                <linearGradient id="fintech-grad" x1="80" y1="0" x2="80" y2="34" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5E4BEE" />
                  <stop offset="1" stopColor="#5E4BEE" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* App Icons Row */}
          <div className="phone-app-icons">
            <span className="app-badge-pill" title="Stripe">⚡ Stripe</span>
            <span className="app-badge-pill" title="Wise">🌐 Wise</span>
            <span className="app-badge-pill" title="PayPal">💳 PayPal</span>
          </div>
        </div>
      </div>

      {/* Card 6: CleanTech / PropTech Clean Card */}
      <div className="hero-mockup-card card-cleantech">
        <div className="mockup-header-row">
          <span className="mockup-category-tag tag-green">CleanTech OS</span>
          <span className="mockup-time-tag">Just updated</span>
        </div>
        <h3 className="mockup-card-title">
          Power your business with intelligent automation
        </h3>
        <div className="cleantech-metric-row">
          <div className="cleantech-metric">
            <strong>99.98%</strong>
            <span>System Reliability</span>
          </div>
          <div className="cleantech-metric">
            <strong>-42%</strong>
            <span>Overhead Cost</span>
          </div>
        </div>
      </div>

      {/* Card 7: Trading & Crypto Analytics Card */}
      <div className="hero-mockup-card card-trading-stats">
        <div className="mockup-header-row">
          <div className="trading-logo-pair">
            <span className="trading-icon-circle">📈</span>
            <span className="trading-name">TradeApex</span>
          </div>
          <span className="trading-change-pill">+24.8%</span>
        </div>
        <h3 className="mockup-card-title">
          Trade smarter, faster, and easier
        </h3>
        {/* SVG Chart */}
        <div className="trading-chart-svg-box">
          <svg width="100%" height="45" viewBox="0 0 200 45" fill="none">
            <path d="M0 38C30 38 45 24 70 28C95 32 110 12 135 18C160 24 175 6 200 4" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M0 38C30 38 45 24 70 28C95 32 110 12 135 18C160 24 175 6 200 4V45H0V38Z" fill="url(#trade-grad)" opacity="0.12" />
            <defs>
              <linearGradient id="trade-grad" x1="100" y1="0" x2="100" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="trading-actions-footer">
          <span className="trade-btn trade-buy">Buy Instant</span>
          <span className="trade-meta-vol">$4.2M 24h Vol</span>
        </div>
      </div>

      {/* Card 8: Cloud Infrastructure */}
      <div className="hero-mockup-card card-cloud-infra">
        <div className="mockup-header-row">
          <span className="mockup-author-chip chip-blue">DevOps Hub</span>
          <span className="mockup-status-green">● Healthy</span>
        </div>
        <h3 className="mockup-card-title">
          Deploy instantly across 35 edge regions
        </h3>
        <div className="infra-stats-grid">
          <div><strong>12ms</strong><span>Latency</span></div>
          <div><strong>0.00s</strong><span>Downtime</span></div>
        </div>
      </div>
    </>
  );

  return (
    <section className="hero-section upshift-hero-section" id="hero">
      {/* Background Soft Gradients & Glows */}
      <div className="hero-glow-bg" aria-hidden="true">
        <div className="hero-warm-orb" />
        <div className="hero-violet-orb" />
        <div className="hero-cyan-orb" />
      </div>

      <div className="hero-layout-container">
        {/* Left Column: Brand, Headline, Subtitle, CTA */}
        <div className="hero-left-column">
          {/* Brand Badge */}
          <div className="hero-brand-badge" id="hero-badge">
            <span className="hero-brand-logo-mark">
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8L14 2L24 8V20L14 26L4 20V8Z" fill="url(#brand-poly-grad1)" />
                <path d="M14 2L24 8L14 14L4 8L14 2Z" fill="url(#brand-poly-grad2)" />
                <path d="M14 14V26L4 20V8L14 14Z" fill="url(#brand-poly-grad3)" />
                <defs>
                  <linearGradient id="brand-poly-grad1" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5E4BEE" />
                    <stop offset="1" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="brand-poly-grad2" x1="4" y1="2" x2="24" y2="14" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06B6D4" />
                    <stop offset="1" stopColor="#5E4BEE" />
                  </linearGradient>
                  <linearGradient id="brand-poly-grad3" x1="4" y1="8" x2="14" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F43F5E" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="hero-brand-title">SaaS MRKT</span>
            <span className="hero-badge-divider" />
            <span className="hero-badge-tag">
              <span className="hero-badge-sparkle">✦</span> Verified Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-main-heading">
            A beautiful Startup &amp;<br />
            <span className="hero-heading-highlight">SaaS Discovery Market.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-description">
            Discover, compare, and deploy verified B2B software solutions. Transparent pricing, authentic reviews, and instant sandbox access.
          </p>

          {/* Action CTA */}
          <div className="hero-cta-actions-row">
            <button
              type="button"
              className="btn btn-primary hero-primary-cta"
              onClick={onExploreScroll}
              id="hero-explore-btn"
            >
              Explore Products
            </button>
          </div>
        </div>

        {/* Right Column: 3D Isometric Continuous Infinite Moving Cards */}
        <div className="hero-right-column">
          <div className="hero-isometric-stage">
            <div className="hero-isometric-grid">

              {/* Column 1 (Continuously Moving UP ↑) */}
              <div className="hero-isometric-col hero-col-left">
                <div className="hero-col-scroll-track hero-track-up">
                  {renderLeftCards()}
                  {/* Duplicated for seamless, infinite looping without stutter */}
                  {renderLeftCards()}
                </div>
              </div>

              {/* Column 2 (Continuously Moving DOWN ↓) */}
              <div className="hero-isometric-col hero-col-right">
                <div className="hero-col-scroll-track hero-track-down">
                  {renderRightCards()}
                  {/* Duplicated for seamless, infinite looping without stutter */}
                  {renderRightCards()}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Floating Hero Metrics Bar */}
      {/* <div className="hero-metrics-bar-wrapper">
        <MetricsBar />
      </div> */}
    </section>
  );
}
