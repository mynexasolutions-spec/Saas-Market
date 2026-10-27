"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "./buyers-page.css";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS_COL1: FAQItem[] = [
  {
    id: "faq-1",
    question: "Is SaaS MRKT completely free for buyers?",
    answer:
      "Yes! SaaS MRKT is 100% free for software buyers, founders, IT administrators, and procurement teams. You can browse, compare, and claim vetted deals with zero hidden fees.",
  },
  {
    id: "faq-3",
    question: "How do you verify reviews on the platform?",
    answer:
      "All reviews go through a multi-point verification process including corporate email authentication, LinkedIn profile cross-referencing, and proof of active software usage.",
  },
  {
    id: "faq-5",
    question: "Do I need a credit card to start free trials?",
    answer:
      "Most software listings on SaaS MRKT offer instant sandbox access or 14-day free trials without requiring a credit card upfront.",
  },
];

const FAQS_COL2: FAQItem[] = [
  {
    id: "faq-2",
    question: "Can I request a custom enterprise quote?",
    answer:
      "Yes. For teams requiring 50+ seats, dedicated SLA guarantees, or custom billing structures, you can submit an enterprise inquiry directly through any vendor's profile page.",
  },
  {
    id: "faq-4",
    question: "How often is pricing information updated?",
    answer:
      "Pricing data and coupon codes are synced weekly with verified vendor feeds. Lifetime deals and limited-time promotions are updated daily by our curation team.",
  },
  {
    id: "faq-6",
    question: "Can I compare more than two tools?",
    answer:
      "Yes, our dedicated comparison matrix lets you evaluate side-by-side specs, feature breakdowns, and pricing across competing platforms in any category.",
  },
];

export default function BuyersClient() {
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    "faq-1": true,
    "faq-2": true,
  });

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <PageLayout activeNav="buyers" noContainer>
      <div className="buyers-page-wrapper">
        <div className="buyers-container">
          {/* 1. Breadcrumb: ⌂ Home › For Buyers */}
          <nav className="buyers-breadcrumb-row" aria-label="Breadcrumb">
            <Link href="/" className="buyers-breadcrumb-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="buyers-breadcrumb-sep">›</span>
            <span className="buyers-breadcrumb-current">For Buyers</span>
          </nav>

          {/* 2. Hero Section */}
          <section className="buyers-hero-section">
            {/* Left Content */}
            <div className="buyers-hero-left">
              <div className="buyers-hero-badge">FOR BUYERS</div>

              <h1 className="buyers-hero-title">
                Built for &nbsp;
                <span className="buyers-hero-title-gradient">Software Buyers </span>
              </h1>

              <p className="buyers-hero-desc">
                Find, compare, and buy the right software with confidence. We remove the guesswork with verified tools, unbiased reviews, and transparent pricing.
              </p>

              {/* Action Buttons */}
              <div className="buyers-hero-actions">
                <Link href="/products" className="buyers-btn-primary">
                  <span>Browse All Tools</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/categories" className="buyers-btn-secondary">
                  Explore Categories
                </Link>
              </div>

              {/* 3 Trust Badges */}
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
                    <span className="buyers-trust-num">2,000+</span>
                    <span className="buyers-trust-label">Verified Tools</span>
                  </div>
                </div>

                <div className="buyers-trust-badge">
                  <div className="buyers-trust-icon-box icon-blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="buyers-trust-text">
                    <span className="buyers-trust-num">50,000+</span>
                    <span className="buyers-trust-label">Active Buyers</span>
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
                    <span className="buyers-trust-num">100%</span>
                    <span className="buyers-trust-label">Unbiased Reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3D Visual Art Matching Reference */}
            <div className="buyers-hero-right" aria-hidden="true">
              <div className="buyers-3d-scene">
                {/* Background Ambient Glow */}
                <div className="buyers-ambient-glow" />

                {/* Floating Paper Airplane (Top Right) */}
                <div className="buyers-float-plane">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </div>

                {/* 3D Browser Window Mockup */}
                <div className="buyers-mockup-card">
                  {/* Browser Dots */}
                  <div className="buyers-mockup-head">
                    <span className="buyers-dot buyers-dot-red" />
                    <span className="buyers-dot buyers-dot-yellow" />
                    <span className="buyers-dot buyers-dot-green" />
                  </div>

                  {/* Search Bar */}
                  <div className="buyers-mockup-search">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Search software...</span>
                  </div>

                  {/* Product Rows */}
                  <div className="buyers-mockup-rows">
                    {/* Notion */}
                    <div className="buyers-mockup-item">
                      <div className="buyers-mockup-item-left">
                        <div className="buyers-mockup-icon" style={{ background: "#F1F5F9" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
                            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.144-.84c1.168-.093 1.354-.513.886-1.12L17.272 1.07C16.804.464 15.918.044 14.89.137L3.082 1.071c-1.073.093-1.447.606-1.073 1.12l2.45 2.017zm-1.073 3.64v14.19c0 .933.56 1.493 1.587 1.4l13.906-1.073c1.027-.093 1.307-.793 1.307-1.727V6.448c0-.933-.466-1.4-1.493-1.307L4.786 6.074c-1.026.094-1.4.654-1.4 1.774zm11.946 1.166l-5.6 7.69v-7.27H6.945v10.595h2.1l5.74-7.876v7.41h2.799V9.014h-2.257z"/>
                          </svg>
                        </div>
                        <span className="buyers-mockup-name">Notion</span>
                      </div>
                      <div className="buyers-mockup-score">
                        <span className="buyers-mockup-star">★</span>
                        <span>4.8</span>
                      </div>
                    </div>

                    {/* Slack */}
                    <div className="buyers-mockup-item">
                      <div className="buyers-mockup-item-left">
                        <div className="buyers-mockup-icon" style={{ background: "#F1F5F9" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24">
                            <path fill="#E01E5A" d="M6 14.5a2.5 2.5 0 1 0-2.5-2.5V14.5H6zm0 1.5H3.5A2.5 2.5 0 0 0 6 18.5a2.5 2.5 0 0 0 2.5-2.5V16H6z" />
                            <path fill="#36C5F0" d="M9.5 6a2.5 2.5 0 1 0 2.5-2.5H9.5V6zm-1.5 0V3.5A2.5 2.5 0 0 0 5.5 6a2.5 2.5 0 0 0 2.5 2.5H8V6z" />
                            <path fill="#2EB67D" d="M18 9.5a2.5 2.5 0 1 0 2.5 2.5V9.5H18zm0-1.5h2.5A2.5 2.5 0 0 0 18 5.5a2.5 2.5 0 0 0-2.5 2.5V8H18z" />
                            <path fill="#ECB22E" d="M14.5 18a2.5 2.5 0 1 0-2.5 2.5h2.5V18zm1.5 0v2.5a2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5H16v2.5z" />
                          </svg>
                        </div>
                        <span className="buyers-mockup-name">Slack</span>
                      </div>
                      <div className="buyers-mockup-score">
                        <span className="buyers-mockup-star">★</span>
                        <span>4.7</span>
                      </div>
                    </div>

                    {/* Figma */}
                    <div className="buyers-mockup-item">
                      <div className="buyers-mockup-item-left">
                        <div className="buyers-mockup-icon" style={{ background: "#F1F5F9" }}>
                          <svg width="14" height="14" viewBox="0 0 38 57" fill="none">
                            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                          </svg>
                        </div>
                        <span className="buyers-mockup-name">Figma</span>
                      </div>
                      <div className="buyers-mockup-score">
                        <span className="buyers-mockup-star">★</span>
                        <span>4.6</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Compare Pill (Top Right) */}
                <div className="buyers-float-compare">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <path d="M5 6l7-3 7 3" />
                    <path d="M4 10l3 5h-6l3-5z" />
                    <path d="M20 10l3 5h-6l3-5z" />
                  </svg>
                  <span>Compare</span>
                </div>

                {/* Floating Verified Pill (Bottom Right) */}
                <div className="buyers-float-verified">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Verified</span>
                </div>

                {/* Floating 3D Chart 1 (Left) */}
                <div className="buyers-float-chart-left">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>

                {/* Floating 3D Chart 2 (Right) */}
                <div className="buyers-float-chart-right">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="#3B82F6">
                    <rect x="3" y="14" width="4" height="7" rx="1.5" />
                    <rect x="10" y="8" width="4" height="13" rx="1.5" />
                    <rect x="17" y="3" width="4" height="18" rx="1.5" />
                  </svg>
                </div>

                {/* Floating Cursor Pointer */}
                <div className="buyers-float-cursor">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 3l15 9.5-6.5 1.5 4 7-2.5 1.5-4-7-4.5 4.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Section 2: "The Buyer Journey" */}
          <section className="buyers-journey-section">
            <div className="buyers-section-badge-wrapper">
              <span className="buyers-section-badge">THE BUYER JOURNEY</span>
            </div>
            <h2 className="buyers-section-title">How Buying on SaaS MRKT Works</h2>
            <p className="buyers-section-sub">
              From research to purchase, in three simple steps.
            </p>

            <div className="buyers-steps-row">
              {/* Step 1 */}
              <div className="buyers-step-card">
                <div className="buyers-step-head">
                  <div className="buyers-step-icon-box icon-search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <span className="buyers-step-num">01</span>
                </div>
                <h3 className="buyers-step-title">Search &amp; Filter Instantly</h3>
                <p className="buyers-step-desc">
                  Browse 2,000+ tools or filter by category, pricing, features, and team size.
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="buyers-step-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="buyers-step-card">
                <div className="buyers-step-head">
                  <div className="buyers-step-icon-box icon-compare">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <rect x="2" y="3" width="20" height="18" rx="2" />
                      <line x1="12" y1="3" x2="12" y2="21" />
                    </svg>
                  </div>
                  <span className="buyers-step-num">02</span>
                </div>
                <h3 className="buyers-step-title">Compare Side-by-Side</h3>
                <p className="buyers-step-desc">
                  Evaluate features, reviews, pricing, and specifications across top tools.
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="buyers-step-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="buyers-step-card">
                <div className="buyers-step-head">
                  <div className="buyers-step-icon-box icon-buy">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <span className="buyers-step-num">03</span>
                </div>
                <h3 className="buyers-step-title">Buy with Confidence</h3>
                <p className="buyers-step-desc">
                  Choose the right tool with verified reviews and transparent pricing.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Section 3: "Why Buyers Choose Us" */}
          <section className="buyers-features-box">
            <div className="buyers-section-badge-wrapper">
              <span className="buyers-section-badge">WHY BUYERS CHOOSE US</span>
            </div>
            <h2 className="buyers-section-title">
              Everything You Need to Make Smarter Software Decisions
            </h2>
            <p className="buyers-section-sub">
              Trusted by thousands of teams to find the best tools, faster.
            </p>

            <div className="buyers-features-grid">
              {/* Feature 1 */}
              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-shield">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Verified Reviews</h3>
                <p className="buyers-feature-desc">Real feedback from actual users.</p>
              </div>

              {/* Feature 2 */}
              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-tag">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Transparent Pricing</h3>
                <p className="buyers-feature-desc">No hidden fees or surprise costs.</p>
              </div>

              {/* Feature 3 */}
              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-link">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Direct Vendor Access</h3>
                <p className="buyers-feature-desc">Connect with vendors instantly.</p>
              </div>

              {/* Feature 4 */}
              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-star">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Curated Categories</h3>
                <p className="buyers-feature-desc">Handpicked tools for every business need.</p>
              </div>
            </div>
          </section>

          {/* 5. Section 4: "Buyer FAQs" */}
          <section className="buyers-faqs-section">
            <div className="buyers-section-badge-wrapper">
              <span className="buyers-section-badge">BUYER FAQS</span>
            </div>
            <h2 className="buyers-section-title">Frequently Asked Questions</h2>
            <p className="buyers-section-sub">
              Quick answers to common questions about finding and purchasing software.
            </p>

            <div className="buyers-faqs-grid">
              {/* Column 1 */}
              <div className="buyers-faqs-col">
                {FAQS_COL1.map((faq) => {
                  const isOpen = !!openFaqs[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`buyers-faq-item ${isOpen ? "open" : ""}`}
                      onClick={() => toggleFaq(faq.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleFaq(faq.id);
                        }
                      }}
                    >
                      <div className="buyers-faq-question">
                        <span>{faq.question}</span>
                        <svg
                          className="buyers-faq-chevron"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      {isOpen && (
                        <div className="buyers-faq-answer">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Column 2 */}
              <div className="buyers-faqs-col">
                {FAQS_COL2.map((faq) => {
                  const isOpen = !!openFaqs[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`buyers-faq-item ${isOpen ? "open" : ""}`}
                      onClick={() => toggleFaq(faq.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleFaq(faq.id);
                        }
                      }}
                    >
                      <div className="buyers-faq-question">
                        <span>{faq.question}</span>
                        <svg
                          className="buyers-faq-chevron"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      {isOpen && (
                        <div className="buyers-faq-answer">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 6. Section 5: Bottom CTA Banner (Dark Nebula Card) */}
          <section className="buyers-cta-banner">
            <div className="buyers-cta-content">
              {/* Left Column */}
              <div className="buyers-cta-left">
                <span className="buyers-cta-pill">READY TO FIND THE RIGHT SOFTWARE?</span>
                <h2 className="buyers-cta-title">
                  Join <span className="buyers-cta-title-highlight">50,000+</span> Teams Making <br />
                  Smarter Buying Decisions
                </h2>
                <p className="buyers-cta-desc">
                  Discover verified tools, compare features, and get the best deals — all in one place.
                </p>
                <div className="buyers-cta-buttons">
                  <Link href="/products" className="buyers-cta-btn-primary">
                    <span>Browse All Products</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link href="/categories" className="buyers-cta-btn-secondary">
                    Explore Categories
                  </Link>
                </div>
              </div>

              {/* Right Column: 3D Floating SaaS Tiles */}
              <div className="buyers-cta-right" aria-hidden="true">
                <div className="buyers-cta-tiles-container">
                  {/* Floating Best Deals Badge */}
                  <div className="buyers-cta-badge-deals">
                    <span>⭐</span>
                    <span>Best Deals</span>
                  </div>

                  {/* Notion Tile */}
                  <div className="buyers-cta-tile buyers-cta-tile-notion" title="Notion">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#000000">
                      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.144-.84c1.168-.093 1.354-.513.886-1.12L17.272 1.07C16.804.464 15.918.044 14.89.137L3.082 1.071c-1.073.093-1.447.606-1.073 1.12l2.45 2.017zm-1.073 3.64v14.19c0 .933.56 1.493 1.587 1.4l13.906-1.073c1.027-.093 1.307-.793 1.307-1.727V6.448c0-.933-.466-1.4-1.493-1.307L4.786 6.074c-1.026.094-1.4.654-1.4 1.774zm11.946 1.166l-5.6 7.69v-7.27H6.945v10.595h2.1l5.74-7.876v7.41h2.799V9.014h-2.257z"/>
                    </svg>
                  </div>

                  {/* Slack Tile */}
                  <div className="buyers-cta-tile buyers-cta-tile-slack" title="Slack">
                    <svg width="26" height="26" viewBox="0 0 24 24">
                      <path fill="#E01E5A" d="M6 14.5a2.5 2.5 0 1 0-2.5-2.5V14.5H6zm0 1.5H3.5A2.5 2.5 0 0 0 6 18.5a2.5 2.5 0 0 0 2.5-2.5V16H6z" />
                      <path fill="#36C5F0" d="M9.5 6a2.5 2.5 0 1 0 2.5-2.5H9.5V6zm-1.5 0V3.5A2.5 2.5 0 0 0 5.5 6a2.5 2.5 0 0 0 2.5 2.5H8V6z" />
                      <path fill="#2EB67D" d="M18 9.5a2.5 2.5 0 1 0 2.5 2.5V9.5H18zm0-1.5h2.5A2.5 2.5 0 0 0 18 5.5a2.5 2.5 0 0 0-2.5 2.5V8H18z" />
                      <path fill="#ECB22E" d="M14.5 18a2.5 2.5 0 1 0-2.5 2.5h2.5V18zm1.5 0v2.5a2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5H16v2.5z" />
                    </svg>
                  </div>

                  {/* Figma Tile */}
                  <div className="buyers-cta-tile buyers-cta-tile-figma" title="Figma">
                    <svg width="24" height="24" viewBox="0 0 38 57" fill="none">
                      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                    </svg>
                  </div>

                  {/* Floating Verified Tools Badge */}
                  <div className="buyers-cta-badge-verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span>Verified Tools</span>
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
