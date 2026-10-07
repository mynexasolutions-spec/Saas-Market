"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const PLANS = [
  {
    id: "plan-starter",
    name: "Starter",
    tagline: "Perfect for indie founders",
    price: 0,
    period: "month",
    badge: null,
    color: "#5E4BEE",
    features: [
      "1 product listing",
      "Basic analytics dashboard",
      "Standard listing page",
      "Community support",
      "Up to 500 buyer profile views/mo",
    ],
    cta: "Start Free",
    ctaVariant: "secondary",
  },
  {
    id: "plan-growth",
    name: "Growth",
    tagline: "For growing SaaS businesses",
    price: 49,
    period: "month",
    badge: "Most Popular",
    color: "#5E4BEE",
    features: [
      "5 product listings",
      "Advanced analytics & insights",
      "Priority search placement",
      "Featured badge on listings",
      "Email marketing integrations",
      "Priority support (< 24h)",
      "Up to 5,000 buyer profile views/mo",
    ],
    cta: "Start 14-Day Trial",
    ctaVariant: "primary",
  },
  {
    id: "plan-scale",
    name: "Scale",
    tagline: "For established SaaS companies",
    price: 149,
    period: "month",
    badge: null,
    color: "#1E293B",
    features: [
      "Unlimited product listings",
      "Full analytics suite + CSV export",
      "Top search placement guarantee",
      "Homepage featured slot (monthly)",
      "Custom seller storefront page",
      "API access for listing management",
      "Dedicated account manager",
      "SLA-backed support (< 4h)",
      "Unlimited buyer profile views",
    ],
    cta: "Contact Sales",
    ctaVariant: "dark",
  },
];

const FAQS = [
  {
    q: "Is there a free plan for sellers?",
    a: "Yes! Our Starter plan is completely free and lets you list one product with basic analytics. Upgrade anytime as your needs grow.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your seller dashboard. Changes take effect immediately.",
  },
  {
    q: "Do you charge a commission on sales?",
    a: "No. SaaS MRKT charges only the flat monthly plan fee. We never take a percentage of your revenue — what you earn is yours.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, PayPal, and wire transfer for annual Scale plan contracts.",
  },
  {
    q: "Is there a setup fee or contract?",
    a: "No setup fees and no long-term contracts. All plans are month-to-month by default. Annual billing is available at a 20% discount.",
  },
  {
    q: "What is the 14-day free trial?",
    a: "Growth plan subscribers get a full 14-day free trial with complete access to all Growth features. No credit card required to start.",
  },
];

export default function PricingPageClient() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("plan-growth");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clickedPlan, setClickedPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setHoveredCard(planId);
  };

  const handleButtonClick = (planId: string, planName: string) => {
    setSelectedPlan(planId);
    setHoveredCard(planId);
    setClickedPlan(planId);
    showToast(`Starting ${planName} plan...`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getPrice = (base: number) => {
    if (base === 0) return 0;
    return billingCycle === "annual" ? Math.round(base * 0.8) : base;
  };

  const activeCardId = hoveredCard || selectedPlan;

  return (
    <PageLayout activeNav="pricing" noContainer>
      {/* Hero */}
      <section className="pricing-hero">
        <div className="container">
          <div className="pricing-hero-content">
            <div className="section-badge">FOR SELLERS</div>
            <h1 className="pricing-hero-title">
              Simple, Transparent <span className="section-title-highlight">Pricing</span>
            </h1>
            <p className="pricing-hero-subtitle">
              No commissions. No hidden fees. Just one flat monthly fee to reach
              50,000+ qualified SaaS buyers.
            </p>
            {/* Billing Toggle */}
            <div className="pricing-toggle-row">
              <span className={`pricing-toggle-label${billingCycle === "monthly" ? " pricing-toggle-label--active" : ""}`}>Monthly</span>
              <button
                id="pricing-billing-toggle"
                className="pricing-toggle-btn"
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                aria-label="Toggle billing cycle"
              >
                <span className={`pricing-toggle-thumb${billingCycle === "annual" ? " pricing-toggle-thumb--right" : ""}`} />
              </button>
              <span className={`pricing-toggle-label${billingCycle === "annual" ? " pricing-toggle-label--active" : ""}`}>
                Annual
                <span className="pricing-save-badge">Save 20%</span>
              </span>
            </div>
          </div>
        </div>
        <div className="pricing-hero-blob pricing-hero-blob--1" />
        <div className="pricing-hero-blob pricing-hero-blob--2" />
      </section>

      {/* Plans */}
      <section className="pricing-plans-section">
        <div className="container">
          <div className="pricing-plans-grid" onMouseLeave={() => setHoveredCard(null)}>
            {PLANS.map((plan) => {
              const isCardActive = activeCardId === plan.id;

              return (
                <div
                  key={plan.id}
                  id={plan.id}
                  className={`pricing-card${isCardActive ? " pricing-card--active" : ""}`}
                  onMouseEnter={() => setHoveredCard(plan.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onTouchStart={() => {
                    setHoveredCard(plan.id);
                    setSelectedPlan(plan.id);
                  }}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.badge && <div className="pricing-card-badge">{plan.badge}</div>}

                  <div className="pricing-card-header">
                    <h2 className="pricing-card-name">{plan.name}</h2>
                    <p className="pricing-card-tagline">{plan.tagline}</p>
                  </div>

                  <div className="pricing-card-price">
                    {plan.price === 0 ? (
                      <span className="pricing-price-amount">Free</span>
                    ) : (
                      <>
                        <span className="pricing-price-currency">$</span>
                        <span className="pricing-price-amount">{getPrice(plan.price)}</span>
                        <span className="pricing-price-period">/{plan.period}</span>
                      </>
                    )}
                    {billingCycle === "annual" && plan.price > 0 && (
                      <div className="pricing-annual-note">billed annually</div>
                    )}
                  </div>

                  <ul className="pricing-features-list">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="pricing-feature-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={isCardActive ? "var(--primary)" : "#10B981"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transition: "stroke 0.2s ease", flexShrink: 0, marginTop: "2px" }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    id={`${plan.id}-cta`}
                    className={`pricing-cta-btn${clickedPlan === plan.id ? " pricing-cta-btn--black" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleButtonClick(plan.id, plan.name);
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Enterprise Note */}
          <div className="pricing-enterprise-note">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
            <span>Need a custom enterprise plan for 10+ products or white-label options?{" "}
              <Link href="/contact" className="pricing-contact-link" id="pricing-enterprise-link">Talk to our team</Link>
            </span>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="pricing-comparison-section">
        <div className="container">
          <div className="section-badge">COMPARE PLANS</div>
          <h2 className="section-title" style={{ marginBottom: "2rem", textAlign: "center" }}>Full Feature Comparison</h2>
          <div className="pricing-table-wrapper">
            <table className="pricing-comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th className="pricing-table-featured">Growth</th>
                  <th>Scale</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Product listings", "1", "5", "Unlimited"],
                  ["Analytics dashboard", "Basic", "Advanced", "Full Suite + Export"],
                  ["Search placement", "Standard", "Priority", "Top Placement"],
                  ["Featured badge", "✗", "✓", "✓"],
                  ["Custom storefront page", "✗", "✗", "✓"],
                  ["API access", "✗", "✗", "✓"],
                  ["Account manager", "✗", "✗", "✓"],
                  ["Buyer profile views/mo", "500", "5,000", "Unlimited"],
                  ["Support", "Community", "< 24h", "< 4h SLA"],
                  ["Commission on sales", "0%", "0%", "0%"],
                ].map(([feature, starter, growth, scale], i) => (
                  <tr key={i}>
                    <td className="pricing-table-feature">{feature}</td>
                    <td>{starter}</td>
                    <td className="pricing-table-featured">{growth}</td>
                    <td>{scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="pricing-faq-section">
        <div className="container">
          <div className="pricing-faq-inner">
            <div className="section-badge">FAQ</div>
            <h2 className="section-title" style={{ marginBottom: "2rem", textAlign: "center" }}>Frequently Asked Questions</h2>
            <div className="pricing-faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} id={`faq-${i}`} className={`pricing-faq-item${openFaq === i ? " pricing-faq-item--open" : ""}`}>
                  <button
                    className="pricing-faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="pricing-faq-answer">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pricing-cta-banner">
        <div className="container">
          <div className="pricing-cta-inner">
            <div className="pricing-cta-text">
              <h2 className="pricing-cta-title">Ready to reach 50,000+ buyers?</h2>
              <p className="pricing-cta-sub">Start free and upgrade when you&apos;re ready. No credit card required.</p>
            </div>
            <div className="pricing-cta-actions">
              <button className="btn-primary" onClick={() => showToast("Starting free plan...")} id="pricing-start-free-btn">
                Start for Free
              </button>
              <Link href="/contact" className="btn-secondary" id="pricing-talk-sales-btn">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {toastMsg && (
        <div className="toast-notice" role="status">
          <span>⚡</span><span>{toastMsg}</span>
        </div>
      )}
    </PageLayout>
  );
}

