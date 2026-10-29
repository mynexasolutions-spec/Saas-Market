"use client";

import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "@/app/buyers/buyers-page.css";
import "./about-page.css";

const TEAM = [
  {
    name: "Aisha Raza",
    role: "CEO & Co-founder",
    bio: "Ex-Google Product Manager with 12 years in B2B SaaS. Passionate about democratizing software access.",
    initial: "A",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  },
  {
    name: "Marcus Chen",
    role: "CTO & Co-founder",
    bio: "Previously led engineering at Stripe and Twilio. Obsessed with building platforms that scale securely.",
    initial: "M",
    gradient: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
  },
  {
    name: "Priya Kapoor",
    role: "Head of Content",
    bio: "Former TechCrunch journalist. Brings deep SaaS market expertise to our editorial verification team.",
    initial: "P",
    gradient: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
  },
  {
    name: "Daniel Osei",
    role: "Head of Seller Success",
    bio: "Helped 200+ SaaS companies grow distribution through strategic marketplace positioning.",
    initial: "D",
    gradient: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
  },
  {
    name: "Zara Williams",
    role: "Head of Marketing",
    bio: "Growth expert who scaled two SaaS startups from 0 to $10M ARR. Data-driven and creative.",
    initial: "Z",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
  },
  {
    name: "Liam Park",
    role: "Lead Engineer",
    bio: "Full-stack wizard specializing in marketplace architecture and high-performance React web applications.",
    initial: "L",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
  },
];

const VALUES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Community First",
    desc: "Every marketplace decision centers on the needs of our buyer and seller communities. We exist to serve them.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Trust & Transparency",
    desc: "Authenticated reviews, verified sellers, and clear pricing. We never take hidden kickbacks or manipulate search rankings.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Speed of Innovation",
    desc: "We ship quickly, learn from customer usage patterns, and continually iterate to keep buying friction near zero.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Global Reach",
    desc: "Modern software is borderless. We connect software buyers and vendors across 80+ countries with seamless currency localization.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Data-Driven Merit",
    desc: "Every recommendation and badge is backed by real customer telemetry, verified reviews, and verifiable uptime data.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Customer Obsession",
    desc: "We measure our success strictly by our users' success — their saved hours, reduced software waste, and accelerated growth.",
  },
];

const MILESTONES = [
  { year: "2022", title: "Founded in Bangalore", desc: "Started from a small co-working space with a mission for a fair, escrow-backed software marketplace." },
  { year: "2023", title: "Seed Round & Launch", desc: "Raised $2.4M seed. Launched with 50 vetted products and reached 1,000 registered buyers in 90 days." },
  { year: "2024", title: "10,000 Buyers Milestone", desc: "Crossed 10,000 active buyers and introduced the review authentication system with seller escrow." },
  { year: "2025", title: "Series A & Global Expansion", desc: "Raised $12M Series A. Expanded to 80 countries and rolled out side-by-side comparison matrices." },
  { year: "2026", title: "50,000 Buyers & Growing", desc: "Serving 50,000+ active buyers, 500+ verified sellers, and over $8M in software transactions." },
];

export default function AboutPageClient() {
  return (
    <PageLayout activeNav="about" noContainer>
      <div className="about-page-wrapper">
        <div className="about-container">
          {/* 1. Breadcrumbs: ⌂ Home › About Us */}
          <nav className="about-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="about-breadcrumb-sep">›</span>
            <span className="about-breadcrumb-current">About Us</span>
          </nav>

          {/* 2. Compact Modern Hero Section */}
          <header className="about-hero">
            <div className="about-hero-pill">OUR STORY &amp; MISSION</div>

            <h1 className="about-hero-title">
              We&apos;re Building the World&apos;s Most{" "}
              <span className="about-title-gradient">Trusted SaaS Marketplace</span>
            </h1>

            <p className="about-hero-desc">
              SaaS MRKT was founded to fix a broken discovery process. Finding the right software shouldn&apos;t take weeks of opaque demos, confusing pricing tiers, and biased review sites.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="about-hero-actions">
              <Link href="/products" className="buyers-btn-primary">
                Browse Verified Products
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/contact" className="buyers-btn-secondary">
                Get in Touch
              </Link>
            </div>

            {/* 4 Trust Metrics Badges (Exact /buyers scale: 0.95rem num, 0.73rem label) */}
            <div className="about-hero-badges">
              <div className="about-badge-item">
                <div className="about-badge-icon icon-blue">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="about-badge-text">
                  <span className="about-badge-num">50,000+</span>
                  <span className="about-badge-label">Active Software Buyers</span>
                </div>
              </div>

              <div className="about-badge-item">
                <div className="about-badge-icon icon-purple">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="about-badge-text">
                  <span className="about-badge-num">500+</span>
                  <span className="about-badge-label">Verified SaaS Sellers</span>
                </div>
              </div>

              <div className="about-badge-item">
                <div className="about-badge-icon icon-green">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="about-badge-text">
                  <span className="about-badge-num">80+</span>
                  <span className="about-badge-label">Countries Represented</span>
                </div>
              </div>

              <div className="about-badge-item">
                <div className="about-badge-icon icon-amber">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="about-badge-text">
                  <span className="about-badge-num">$8M+</span>
                  <span className="about-badge-label">Software Subscriptions</span>
                </div>
              </div>
            </div>
          </header>

          {/* 3. Mission Section (Frosted Lavender Container) */}
          <section className="about-mission-box">
            <div className="about-section-head">
              <span className="about-section-badge">OUR MISSION</span>
              <h2 className="about-section-title">Making Software Discovery Honest, Fast, and Fair</h2>
              <p className="about-section-sub">
                Every business deserves access to verified software at transparent prices without being manipulated by sponsored placements.
              </p>
            </div>

            <div className="about-mission-grid">
              <div className="about-mission-card">
                <div className="about-mission-card-icon" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="about-mission-card-title">Verified Reviews Only</h3>
                <p className="about-mission-card-desc">
                  Every user review is tied to verified corporate domains and authentic product usage. Zero sponsored rankings or manufactured testimonials.
                </p>
              </div>

              <div className="about-mission-card">
                <div className="about-mission-card-icon" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3 className="about-mission-card-title">Zero Commission on Direct Deals</h3>
                <p className="about-mission-card-desc">
                  Sellers keep 100% of their direct software revenues. We charge a simple, flat listing fee so tools succeed strictly on user merit.
                </p>
              </div>

              <div className="about-mission-card">
                <div className="about-mission-card-icon" style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="about-mission-card-title">100% Escrow Protection</h3>
                <p className="about-mission-card-desc">
                  All marketplace purchases are held safely in escrow and only unlocked after license verification, backed by a 30-day money-back guarantee.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Core Values Grid */}
          <section className="about-values-section">
            <div className="about-section-head">
              <span className="about-section-badge">OUR VALUES</span>
              <h2 className="about-section-title">What Drives Us Every Single Day</h2>
              <p className="about-section-sub">
                Our culture and engineering architecture are guided by foundational principles of fairness, speed, and customer advocacy.
              </p>
            </div>

            <div className="about-values-grid">
              {VALUES.map((val, idx) => (
                <div key={idx} className="about-value-card">
                  <div className="about-value-icon-box">{val.icon}</div>
                  <h3 className="about-value-title">{val.title}</h3>
                  <p className="about-value-desc">{val.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Streamlined Milestones Grid ("Kam Space Me") */}
          <section className="about-milestones-section">
            <div className="about-section-head">
              <span className="about-section-badge">OUR JOURNEY</span>
              <h2 className="about-section-title">Building SaaS MRKT, Year by Year</h2>
              <p className="about-section-sub">
                From an ambitious Bangalore co-working concept to a global software marketplace serving 50,000+ teams.
              </p>
            </div>

            <div className="about-milestone-grid">
              {MILESTONES.map((ms) => (
                <div key={ms.year} className="about-milestone-card">
                  <span className="about-milestone-year-pill">{ms.year}</span>
                  <h3 className="about-milestone-title">{ms.title}</h3>
                  <p className="about-milestone-desc">{ms.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Leadership & Team Grid */}
          <section style={{ marginBottom: "2rem" }} className="the-team">
            <div className="about-section-head">
              <span className="about-section-badge">THE TEAM</span>
              <h2 className="about-section-title">The People Behind SaaS MRKT</h2>
              <p className="about-section-sub">
                A passionate distributed team of product builders, engineers, and writers on a mission to democratize software procurement.
              </p>
            </div>

            <div className="about-team-grid">
              {TEAM.map((member) => (
                <div key={member.name} className="about-team-card">
                  <div className="about-team-avatar" style={{ background: member.gradient }}>
                    {member.initial}
                  </div>
                  <h3 className="about-team-name">{member.name}</h3>
                  <div className="about-team-role">{member.role}</div>
                  <p className="about-team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Cosmic High-Conversion CTA Banner (Exact /buyers styling) */}
          <section className="buyers-cta-banner" style={{ margin: "1.5rem 0 0 0" }}>
            <div className="buyers-cta-content">
              {/* Left Column */}
              <div className="buyers-cta-left">
                <div className="buyers-cta-pill">JOIN OUR MISSION</div>
                <h2 className="buyers-cta-title">
                  Want to help shape the{" "}
                  <span className="buyers-cta-title-highlight">future of software discovery?</span>
                </h2>
                <p className="buyers-cta-desc">
                  We&apos;re a remote-first team looking for curious, driven builders. Explore verified software products or connect directly with our leadership team.
                </p>
                <div className="buyers-cta-buttons">
                  <Link href="/products" className="buyers-cta-btn-primary">
                    Browse All Products
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link href="/contact" className="buyers-cta-btn-secondary">
                    Get in Touch with Us
                  </Link>
                </div>
              </div>

              {/* Right Column: Floating Decorative Badges */}
              <div className="buyers-cta-right" aria-hidden="true">
                <div className="buyers-cta-tiles-container">
                  <div className="buyers-cta-badge-deals">
                    <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span> 50,000+ Active Buyers
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-notion"
                    title="Community First"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-slack"
                    title="Transparent Pricing"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>

                  <div
                    className="buyers-cta-tile buyers-cta-tile-figma"
                    title="Escrow Protected"
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
                    Verified Marketplace
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
