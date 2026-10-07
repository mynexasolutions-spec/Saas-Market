"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { ProductItem } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

interface ProductMoreDetailsClientProps {
  product: ProductItem;
}

export default function ProductMoreDetailsClient({ product }: ProductMoreDetailsClientProps) {
  const { isSubscribed } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "security" | "financials" | "reviews">("overview");

  const priceVal = product.price || 19;
  const sellerName = product.sellerName || "Elena Rostova";
  const techStack = product.techStack || ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS"];

  return (
    <PageLayout activeNav="products" noContainer>
      <div className="pdetails-page-wrapper">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="pdetails-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="pdetails-crumb-link">Home</Link>
            <span className="pdetails-crumb-sep">/</span>
            <Link href="/products" className="pdetails-crumb-link">Products</Link>
            <span className="pdetails-crumb-sep">/</span>
            <Link href={`/products/${product.id}`} className="pdetails-crumb-link">{product.name}</Link>
            <span className="pdetails-crumb-sep">/</span>
            <span className="pdetails-crumb-current">Full Specifications &amp; Deep Diligence</span>
          </nav>

          {/* Header Card */}
          <div className="pdetails-header-card">
            <div className="pdetails-header-left">
              <div
                className="pdetails-logo"
                style={{ backgroundColor: product.brandColor || "#6366F1" }}
              >
                {product.brandLetter || product.name.charAt(0)}
              </div>
              <div className="pdetails-header-meta">
                <div className="pdetails-badge-row">
                  <span className="pdetails-cat-badge">{product.category}</span>
                  {product.sellerVerified && <span className="pdetails-verified-pill">✓ Verified SaaS</span>}
                  <span className="pdetails-specs-pill">Full Diligence Report</span>
                </div>
                <h1 className="pdetails-title">{product.name} — Technical Specifications &amp; Due Diligence</h1>
                <p className="pdetails-tagline">
                  {product.tagline || product.description}
                </p>
              </div>
            </div>

            <div className="pdetails-header-right">
              <div className="pdetails-price-box">
                <span className="pdetails-price-label">Monthly Plan</span>
                <div className="pdetails-price-amount">
                  ${priceVal}
                  <span className="pdetails-price-period">/{product.period || "mo"}</span>
                </div>
                <div className="pdetails-rating-row">
                  <span className="pdetails-stars">★★★★★</span>
                  <span className="pdetails-rating-val">{product.rating || 4.9}</span>
                  <span className="pdetails-reviews-count">({product.reviewCount ? `${(product.reviewCount / 1000).toFixed(1)}k` : "5.1k"} reviews)</span>
                </div>
              </div>

              <div className="pdetails-action-buttons">
                <Link href={`/products/${product.id}/buy`} className="pdetails-btn-buy" id="pdetails-buy-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Buy Now (${priceVal}/mo)
                </Link>
                <Link href={`/products/${product.id}`} className="pdetails-btn-overview">
                  &larr; Back to Product
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="pdetails-nav-tabs">
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "overview" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              System Overview
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "architecture" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("architecture")}
            >
              Architecture &amp; Stack
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "security" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Security &amp; SLAs
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "financials" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("financials")}
            >
              Financial Diligence
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "reviews" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Customer Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="pdetails-content-body">
            {activeTab === "overview" && (
              <div className="pdetails-tab-pane">
                <div className="pdetails-specs-grid">
                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Product Details</h2>
                    <div className="pdetails-spec-table">
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Listed Date</span>
                        <strong className="pdetails-row-val">{product.listedDate || "18 Jul 2024"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Pricing Model</span>
                        <strong className="pdetails-row-val">{product.pricingModel || "Monthly Subscription"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Target Audience</span>
                        <strong className="pdetails-row-val">{product.targetAudience || "Engineering & Cross-Functional Teams"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Headquarters</span>
                        <strong className="pdetails-row-val">{product.hqLocation || "San Francisco, CA"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Launch Year</span>
                        <strong className="pdetails-row-val">{product.launchDate || "2022"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Core Team Size</span>
                        <strong className="pdetails-row-val">{product.teamSize || "5 - 10 Engineers"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Verified Seller Credentials</h2>
                    <div className="pdetails-seller-box">
                      <div className="pdetails-seller-avatar">
                        {product.sellerInitials || "ER"}
                      </div>
                      <div>
                        <h3 className="pdetails-seller-name">{sellerName}</h3>
                        <span className="pdetails-seller-sub">{product.sellerMemberSince || "Member since Feb 2023"}</span>
                        <span className="pdetails-seller-badge">✓ Identity &amp; Bank Verified</span>
                      </div>
                    </div>
                    <p className="pdetails-seller-desc">
                      Elena Rostova has verified ownership of the code repositories, Stripe billing accounts, and domain infrastructure. All transactions through SaaS MRKT are protected under full buyer escrow.
                    </p>
                    <div className="pdetails-trust-points">
                      <div className="pdetails-trust-point">✓ 100% On-time response rate</div>
                      <div className="pdetails-trust-point">✓ 14 Verified SaaS transfers completed</div>
                      <div className="pdetails-trust-point">✓ Escrow contract guaranteed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="pdetails-tab-pane">
                <div className="pdetails-specs-grid">
                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Technology Stack</h2>
                    <p className="pdetails-card-desc">
                      Built using high-performance modern tooling with automated CI/CD and zero downtime rolling deployments.
                    </p>
                    <div className="pdetails-stack-pills">
                      {techStack.map((tech, i) => (
                        <div key={i} className="pdetails-stack-item">
                          <span className="pdetails-stack-dot" />
                          <span>{tech}</span>
                        </div>
                      ))}
                      <div className="pdetails-stack-item"><span className="pdetails-stack-dot" />TailwindCSS</div>
                      <div className="pdetails-stack-item"><span className="pdetails-stack-dot" />Redis Cache</div>
                      <div className="pdetails-stack-item"><span className="pdetails-stack-dot" />Docker</div>
                    </div>

                    <h3 className="pdetails-subhead">API &amp; Integration Capabilities</h3>
                    <ul className="pdetails-check-list">
                      <li>REST API v2 with comprehensive OpenAPI 3.0 documentation</li>
                      <li>Webhook subscription engine with automatic retries and HMAC signatures</li>
                      <li>GraphQL endpoint for granular reporting and data extraction</li>
                      <li>Pre-built integrations: Slack, Zapier, GitHub, Jira, and Linear</li>
                    </ul>
                  </div>

                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Infrastructure &amp; Hosting</h2>
                    <div className="pdetails-metric-cards">
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">99.98%</span>
                        <span className="pdetails-metric-desc">Uptime SLA (Historical 12 mo)</span>
                      </div>
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">&lt;110ms</span>
                        <span className="pdetails-metric-desc">Global Edge Latency (P95)</span>
                      </div>
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">10M+</span>
                        <span className="pdetails-metric-desc">Monthly API Requests Handled</span>
                      </div>
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">Multi-Region</span>
                        <span className="pdetails-metric-desc">AWS US-East &amp; EU-Central Failover</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="pdetails-tab-pane">
                <div className="pdetails-spec-card">
                  <h2 className="pdetails-card-title">Security &amp; Data Compliance</h2>
                  <p className="pdetails-card-desc">
                    Enterprise-grade governance protocols and encryption standards protect buyer databases and communications.
                  </p>

                  <div className="pdetails-security-grid">
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon">🔒</div>
                      <h3>SOC2 Type II</h3>
                      <p>Annual third-party audit completed. Full compliance audit reports available upon subscription.</p>
                    </div>
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon">🇪🇺</div>
                      <h3>GDPR &amp; CCPA</h3>
                      <p>Full data subject request handlers, cookie privacy compliance, and EU data isolation.</p>
                    </div>
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon">🛡️</div>
                      <h3>AES 256-Bit</h3>
                      <p>Data encrypted in transit via TLS 1.3 and at rest with AWS KMS managed encryption keys.</p>
                    </div>
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon">🔑</div>
                      <h3>SAML SSO &amp; 2FA</h3>
                      <p>Enterprise single sign-on support for Okta, Google Workspace, Azure AD, and mandatory 2FA.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "financials" && (
              <div className="pdetails-tab-pane">
                {isSubscribed ? (
                  <div className="pdetails-unlocked-banner">
                    <div className="pdetails-banner-top">
                      <span className="pdetails-banner-pill">✓ PRO SUBSCRIPTION ACTIVE</span>
                      <h2>Verified Diligence Financial Data</h2>
                      <p>All metrics below have been audited and verified through Stripe and bank integration.</p>
                    </div>

                    <div className="pdetails-fin-cards">
                      <div className="pdetails-fin-card">
                        <span className="pdetails-fin-label">Annual Recurring Revenue</span>
                        <strong className="pdetails-fin-num">$148,500 / yr</strong>
                        <span className="pdetails-fin-badge">Stripe Verified</span>
                      </div>
                      <div className="pdetails-fin-card">
                        <span className="pdetails-fin-label">Monthly Growth Rate</span>
                        <strong className="pdetails-fin-num">+12.4% MoM</strong>
                        <span className="pdetails-fin-badge">TTM Verified</span>
                      </div>
                      <div className="pdetails-fin-card">
                        <span className="pdetails-fin-label">Gross Margin</span>
                        <strong className="pdetails-fin-num">84.2%</strong>
                        <span className="pdetails-fin-badge">Audited P&amp;L</span>
                      </div>
                      <div className="pdetails-fin-card">
                        <span className="pdetails-fin-label">Net Retention Rate</span>
                        <strong className="pdetails-fin-num">108.5%</strong>
                        <span className="pdetails-fin-badge">Cohort Analysis</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pdetails-locked-gate">
                    <div className="pdetails-gate-icon">🔒</div>
                    <h2>Financial Diligence Is Locked</h2>
                    <p>
                      Full verified Stripe growth curves, EBITDA statements, and cap tables are reserved for Pro Subscribers.
                    </p>
                    <Link href="/pricing" className="pdetails-gate-btn">
                      Get Premium To Unlock
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="pdetails-tab-pane">
                <div className="pdetails-spec-card">
                  <h2 className="pdetails-card-title">Customer Feedback &amp; Ratings</h2>
                  <div className="pdetails-reviews-summary">
                    <div className="pdetails-rev-big">
                      <span className="pdetails-rev-score">4.9</span>
                      <span className="pdetails-stars">★★★★★</span>
                      <span className="pdetails-rev-total">5,120 verified reviews</span>
                    </div>
                    <div className="pdetails-rev-bars">
                      <div className="pdetails-bar-row">
                        <span>5 stars</span>
                        <div className="pdetails-bar-track"><div className="pdetails-bar-fill" style={{ width: "91%" }} /></div>
                        <span>91%</span>
                      </div>
                      <div className="pdetails-bar-row">
                        <span>4 stars</span>
                        <div className="pdetails-bar-track"><div className="pdetails-bar-fill" style={{ width: "7%" }} /></div>
                        <span>7%</span>
                      </div>
                      <div className="pdetails-bar-row">
                        <span>3 stars</span>
                        <div className="pdetails-bar-track"><div className="pdetails-bar-fill" style={{ width: "2%" }} /></div>
                        <span>2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pdetails-quotes-grid">
                    <div className="pdetails-quote-card">
                      <p>&ldquo;{product.name} drastically accelerated our team sprint cycle. The integration was seamless and support was lightning fast.&rdquo;</p>
                      <strong>— Marcus Vance, VP Engineering at CloudSync</strong>
                    </div>
                    <div className="pdetails-quote-card">
                      <p>&ldquo;Best investment we made this quarter. Everything worked out of the box with zero configuration headache.&rdquo;</p>
                      <strong>— Sarah Lin, Head of Product at Vertex Labs</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
