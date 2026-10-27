"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "./sellers-page.css";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS_COL1: FAQItem[] = [
  {
    id: "faq-1",
    question: "How long does it take to get my product listed?",
    answer:
      "Most software submissions are reviewed, verified, and published live on SaaS MRKT within 24 to 48 hours after submission.",
  },
  {
    id: "faq-2",
    question: "Do you charge any commission on sales?",
    answer:
      "No! SaaS MRKT charges 0% commission on your software sales. We operate on transparent listing plans so you keep 100% of your customer revenue.",
  },
  {
    id: "faq-3",
    question: "Can I update my product details anytime?",
    answer:
      "Yes! You have full access to your vendor dashboard to update features, screenshots, pricing tiers, integrations, and documentation at any time.",
  },
];

const FAQS_COL2: FAQItem[] = [
  {
    id: "faq-4",
    question: "What kind of buyers will see my listing?",
    answer:
      "Your listing is exposed to 50,000+ active B2B decision-makers including founders, CTOs, IT managers, and procurement leads looking for vetted tools.",
  },
  {
    id: "faq-5",
    question: "How do buyers contact my sales team?",
    answer:
      "Buyers can click directly through to your website, sign up for your free trial, or submit direct demo requests that route straight to your sales inbox or CRM.",
  },
  {
    id: "faq-6",
    question: "Do you provide marketing support for new listings?",
    answer:
      "Yes! Newly verified products get featured on our category landing pages, in our weekly buyer newsletter, and in relevant side-by-side comparison tables.",
  },
];

export default function SellersClient() {
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    "faq-1": true,
    "faq-4": true,
  });

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <PageLayout activeNav="sellers" noContainer>
      <div className="sellers-page-wrapper">
        <div className="sellers-container">
          {/* 1. Breadcrumb: ⌂ Home › For Sellers */}
          <nav className="sellers-breadcrumb-row" aria-label="Breadcrumb">
            <Link href="/" className="sellers-breadcrumb-link">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="sellers-breadcrumb-sep">›</span>
            <span className="sellers-breadcrumb-current">For Sellers</span>
          </nav>

          {/* 2. Hero Section: Left Content + Right 3D Visual */}
          <section className="sellers-hero-section">
            {/* Left Content */}
            <div className="sellers-hero-left">
              <div className="sellers-hero-badge">FOR SELLERS</div>

              <h1 className="sellers-hero-title">
                Grow Your &nbsp;
                <span className="sellers-hero-title-gradient">
                  Software Business
                </span>
              </h1>

              <p className="sellers-hero-desc">
                List your software, reach 50,000+ active buyers, and grow
                revenue with zero hidden fees.
              </p>

              {/* Action Buttons */}
              <div className="sellers-hero-actions">
                <Link
                  href="/contact?intent=seller-listing"
                  className="sellers-btn-primary"
                >
                  <span>Get Listed Now</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  href="/contact?intent=talk-to-sales"
                  className="sellers-btn-secondary"
                >
                  Talk to Sales
                </Link>
              </div>

              {/* 4 Trust Badges in a Row */}
              <div className="sellers-hero-trust-row">
                {/* 1. 50,000+ Active Buyers */}
                <div className="sellers-trust-badge">
                  <div className="sellers-trust-icon-box icon-purple">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="sellers-trust-text">
                    <span className="sellers-trust-num">50,000+</span>
                    <span className="sellers-trust-label">Active Buyers</span>
                  </div>
                </div>

                {/* 2. $10M+ Sales Generated */}
                <div className="sellers-trust-badge">
                  <div className="sellers-trust-icon-box icon-blue">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.66l7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z" />
                    </svg>
                  </div>
                  <div className="sellers-trust-text">
                    <span className="sellers-trust-num">$10M+</span>
                    <span className="sellers-trust-label">Sales Generated</span>
                  </div>
                </div>

                {/* 3. 0% Hidden Fees */}
                <div className="sellers-trust-badge">
                  <div className="sellers-trust-icon-box icon-green">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div className="sellers-trust-text">
                    <span className="sellers-trust-num">0%</span>
                    <span className="sellers-trust-label">Hidden Fees</span>
                  </div>
                </div>

                {/* 4. 24–48h Listing Review */}
                <div className="sellers-trust-badge">
                  <div className="sellers-trust-icon-box icon-indigo">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div className="sellers-trust-text">
                    <span className="sellers-trust-num">24–48h</span>
                    <span className="sellers-trust-label">Listing Review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3D Visual Art Matching Reference Image */}
            <div className="sellers-hero-right" aria-hidden="true">
              <div className="sellers-3d-scene">
                {/* Background Ambient Glow */}
                <div className="sellers-ambient-glow" />

                {/* Floating Verified Listing Pill (Top Right) */}
                <div className="sellers-float-verified-top">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Verified Listing</span>
                </div>

                {/* 3D Listing Submission Window Mockup */}
                <div className="sellers-mockup-card">
                  {/* Window Head */}
                  <div className="sellers-mockup-head">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>List Your Software</span>
                  </div>

                  {/* Profile & Form Rows */}
                  <div className="sellers-mockup-avatar-row">
                    <div className="sellers-mockup-avatar">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="sellers-mockup-placeholder-lines">
                      <span className="sellers-mockup-line-1" />
                      <span className="sellers-mockup-line-2" />
                    </div>
                  </div>

                  {/* Pricing Input Pill */}
                  <div className="sellers-mockup-price-box">
                    <span className="sellers-mockup-price-num">$ 29</span>
                    <span className="sellers-mockup-price-period">/mo</span>
                  </div>

                  {/* Action Button */}
                  <button className="sellers-mockup-btn" type="button">
                    Publish
                  </button>
                </div>

                {/* Floating Card: 50K+ Active Buyers (Top Right) */}
                <div className="sellers-float-card-buyers">
                  <div className="sellers-float-buyers-top">
                    <div>
                      <div className="sellers-float-buyers-num">50K+</div>
                      <div className="sellers-float-buyers-label">
                        Active Buyers
                      </div>
                    </div>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="sellers-float-chart-bars">
                    <div className="sellers-bar" style={{ height: "14px" }} />
                    <div className="sellers-bar" style={{ height: "22px" }} />
                    <div className="sellers-bar" style={{ height: "16px" }} />
                    <div className="sellers-bar" style={{ height: "26px" }} />
                    <div className="sellers-bar" style={{ height: "20px" }} />
                  </div>
                </div>

                {/* Floating Card: +230% More Exposure (Bottom Right) */}
                <div className="sellers-float-card-exposure">
                  <div>
                    <div className="sellers-float-exposure-num">+230%</div>
                    <div className="sellers-float-exposure-label">
                      <span>More Exposure</span>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          display: "inline-block",
                          marginLeft: "3px",
                          verticalAlign: "middle",
                        }}
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  </div>
                  <div className="sellers-float-exposure-avatar">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>

                {/* Floating 3D Bubble Avatars */}
                <div className="sellers-bubble sellers-bubble-1">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="sellers-bubble sellers-bubble-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                

                {/* Floating Paper Airplane */}
                <div className="sellers-float-plane">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Section 2: "SIMPLE 3-STEP PROCESS" */}
          <section className="sellers-process-section">
            <div className="sellers-section-badge-wrapper">
              <span className="sellers-section-badge">
                SIMPLE 3-STEP PROCESS
              </span>
            </div>
            <h2 className="sellers-section-title">
              How Selling on SaaS MRKT Works
            </h2>
            <p className="sellers-section-sub">
              From listing submission to closing your first enterprise contract
              in three easy steps.
            </p>

            {/* 3 Step Cards Row */}
            <div className="sellers-steps-row">
              {/* Card 1 */}
              <div className="sellers-step-card">
                <div className="sellers-step-head">
                  <div className="sellers-step-icon-box icon-edit">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <span className="sellers-step-num">01</span>
                </div>
                <h3 className="sellers-step-title">
                  Create &amp; Verify Your Profile
                </h3>
                <p className="sellers-step-desc">
                  Claim your software listing, add product details, pricing,
                  images, and integration tags. Get verified in minutes.
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="sellers-step-arrow" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Card 2 */}
              <div className="sellers-step-card">
                <div className="sellers-step-head">
                  <div className="sellers-step-icon-box icon-search">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <span className="sellers-step-num">02</span>
                </div>
                <h3 className="sellers-step-title">
                  Reach Active B2B Decision-Makers
                </h3>
                <p className="sellers-step-desc">
                  Our intelligent search and category system connects you with
                  qualified buyers actively looking for solutions like yours.
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="sellers-step-arrow" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Card 3 */}
              <div className="sellers-step-card">
                <div className="sellers-step-head">
                  <div className="sellers-step-icon-box icon-rocket">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <span className="sellers-step-num">03</span>
                </div>
                <h3 className="sellers-step-title">
                  Close Deals with Confidence
                </h3>
                <p className="sellers-step-desc">
                  Receive demo requests, negotiate directly, and close deals with
                  secure payments and verified buyer insights.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Section 3: "WHY SELLERS CHOOSE SAAS MRKT" (Frosted Box with 3x2 Grid) */}
          <section className="sellers-features-box">
            <div className="sellers-section-badge-wrapper">
              <span className="sellers-section-badge">
                WHY SELLERS CHOOSE SAAS MRKT
              </span>
            </div>
            <h2 className="sellers-section-title">
              Everything You Need to Scale Your Software Business
            </h2>
            <p className="sellers-section-sub">
              Powerful tools and verified buyer demand to help you grow faster.
            </p>

            <div className="sellers-features-grid">
              {/* Feature 1 */}
              <div className="sellers-feature-card">
                <div className="sellers-feature-icon-box icon-purple">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="sellers-feature-content">
                  <h3 className="sellers-feature-title">
                    Active Buyer Network
                  </h3>
                  <p className="sellers-feature-desc">
                    Access 50,000+ validated buyers across startups, SMBs, and
                    enterprises.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="sellers-feature-card">
                <div className="sellers-feature-icon-box icon-green">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="sellers-feature-content">
                  <h3 className="sellers-feature-title">Verified &amp; Authentic</h3>
                  <p className="sellers-feature-desc">
                    Build trust with a verified seller badge and transparent
                    reviews.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="sellers-feature-card">
                <div className="sellers-feature-icon-box icon-orange">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div className="sellers-feature-content">
                  <h3 className="sellers-feature-title">Direct Lead Access</h3>
                  <p className="sellers-feature-desc">
                    Receive demo requests and inquiries directly—no middlemen.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="sellers-feature-card">
                <div className="sellers-feature-icon-box icon-amber">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <div className="sellers-feature-content">
                  <h3 className="sellers-feature-title">Zero Hidden Fees</h3>
                  <p className="sellers-feature-desc">
                    Keep 100% of your revenue with transparent pricing.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="sellers-feature-card">
                <div className="sellers-feature-icon-box icon-pink">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="sellers-feature-content">
                  <h3 className="sellers-feature-title">Advanced Insights</h3>
                  <p className="sellers-feature-desc">
                    Track profile views, buyer intent, and deal opportunities.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="sellers-feature-card">
                <div className="sellers-feature-icon-box icon-blue">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div className="sellers-feature-content">
                  <h3 className="sellers-feature-title">Marketing Support</h3>
                  <p className="sellers-feature-desc">
                    Get featured placements and exposure across our platform and
                    newsletter.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Section 4: "Seller FAQs" */}
          <section className="sellers-faqs-section">
            <div className="sellers-section-badge-wrapper">
              <span className="sellers-section-badge">SELLER FAQS</span>
            </div>
            <h2 className="sellers-section-title">
              Frequently Asked Seller Questions
            </h2>
            <p className="sellers-section-sub">
              Get clear answers to the most common questions about listing and
              selling on SaaS MRKT.
            </p>

            {/* 2-Column FAQs Grid */}
            <div className="sellers-faqs-grid">
              {/* Column 1 */}
              <div className="sellers-faqs-col">
                {FAQS_COL1.map((faq) => {
                  const isOpen = !!openFaqs[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`sellers-faq-item ${isOpen ? "open" : ""}`}
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
                      <div className="sellers-faq-question">
                        <span>{faq.question}</span>
                        <svg
                          className="sellers-faq-chevron"
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
                        <div className="sellers-faq-answer">{faq.answer}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Column 2 */}
              <div className="sellers-faqs-col">
                {FAQS_COL2.map((faq) => {
                  const isOpen = !!openFaqs[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`sellers-faq-item ${isOpen ? "open" : ""}`}
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
                      <div className="sellers-faq-question">
                        <span>{faq.question}</span>
                        <svg
                          className="sellers-faq-chevron"
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
                        <div className="sellers-faq-answer">{faq.answer}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 6. Section 5: Bottom CTA Banner (Dark Cosmic Nebula Card) */}
          <section className="sellers-cta-banner">
            <div className="sellers-cta-content">
              {/* Left Content */}
              <div className="sellers-cta-left">
                <span className="sellers-cta-pill">READY TO GROW?</span>
                <h2 className="sellers-cta-title">
                  List Your Software in Under 10 Minutes
                </h2>
                <p className="sellers-cta-desc">
                  Join 5,000+ verified sellers and reach 50,000+ active buyers.
                  No hidden fees, just growth.
                </p>
                <div className="sellers-cta-buttons">
                  <Link
                    href="/contact?intent=seller-listing"
                    className="sellers-cta-btn-primary"
                  >
                    <span>Get Listed Now</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact?intent=talk-to-sales"
                    className="sellers-cta-btn-secondary"
                  >
                    Speak with Our Team
                  </Link>
                </div>
              </div>

              {/* Right Side: 3D Visual Art Matching Reference */}
              <div className="sellers-cta-right" aria-hidden="true">
                <div className="sellers-cta-visual-container">
                  {/* Floating 3D Views Card */}
                  <div className="sellers-cta-chart-card">
                    <div className="sellers-cta-chart-head">
                      <span className="sellers-cta-chart-label">
                        Total Views
                      </span>
                    </div>
                    <div className="sellers-cta-chart-val-row">
                      <span className="sellers-cta-chart-val">12,450</span>
                      <span className="sellers-cta-chart-growth">
                        ↑ +230%
                      </span>
                    </div>
                    {/* Purple Line Wave */}
                    <div className="sellers-cta-chart-wave">
                      <svg viewBox="0 0 180 34" fill="none">
                        <path
                          d="M0 24C30 26 50 18 80 19C110 20 130 6 180 4"
                          stroke="#7c3aed"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M0 24C30 26 50 18 80 19C110 20 130 6 180 4V34H0V24Z"
                          fill="url(#purpleGrad)"
                          opacity="0.25"
                        />
                        <defs>
                          <linearGradient
                            id="purpleGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="34"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#7c3aed" />
                            <stop
                              offset="1"
                              stopColor="#7c3aed"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Floating Trophy Pill (Bottom Right) */}
                  <div className="sellers-cta-badge-trophy">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                    </svg>
                    <span>Become a Verified Seller</span>
                  </div>

                  {/* Floating Purple Paper Plane */}
                  <div className="sellers-cta-plane">
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
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
