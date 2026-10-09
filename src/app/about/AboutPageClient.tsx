"use client";

import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const TEAM = [
  {
    name: "Aisha Raza",
    role: "CEO & Co-founder",
    bio: "Ex-Google Product Manager with 12 years in B2B SaaS. Passionate about democratizing software access.",
    initial: "A",
    gradient: "linear-gradient(135deg, #5E4BEE 0%, #8B5CF6 100%)",
  },
  {
    name: "Marcus Chen",
    role: "CTO & Co-founder",
    bio: "Previously led engineering at Stripe and Twilio. Obsessed with building platforms that scale.",
    initial: "M",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
  },
  {
    name: "Priya Kapoor",
    role: "Head of Content",
    bio: "Former TechCrunch journalist. Brings deep SaaS MRKT expertise to our editorial team.",
    initial: "P",
    gradient: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
  },
  {
    name: "Daniel Osei",
    role: "Head of Seller Success",
    bio: "Helped 200+ SaaS companies grow their distribution through strategic marketplace positioning.",
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
    bio: "Full-stack wizard specializing in marketplace architecture and high-performance React applications.",
    initial: "L",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #5E4BEE 100%)",
  },
];

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Community First",
    desc: "Every decision we make centers on the needs of our buyer and seller communities. We exist to serve them.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Trust & Transparency",
    desc: "Honest reviews, verified sellers, and clear pricing. We never take hidden commissions or manipulate rankings.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Speed of Innovation",
    desc: "We ship fast, learn from our community, and constantly improve. The SaaS world moves fast — so do we.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Global Reach",
    desc: "SaaS is borderless. We connect buyers and sellers across 80+ countries with localized discovery.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Data-Driven",
    desc: "Every feature, ranking, and recommendation is backed by real usage data and community feedback.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Customer Obsession",
    desc: "We measure success by our users' success. Their growth, saved time, and ROI is our north star.",
  },
];

const MILESTONES = [
  { year: "2022", title: "Founded in Bangalore", desc: "Aisha and Marcus started SaaS MRKT from a co-working space with the vision of a fair, transparent SaaS MRKTplace." },
  { year: "2023", title: "Seed Round & Launch", desc: "Raised $2.4M in seed funding. Launched with 50 SaaS products and hit 1,000 registered buyers in the first 90 days." },
  { year: "2024", title: "10,000 Buyers Milestone", desc: "Crossed 10,000 active buyers and 200 seller listings. Launched our review verification system and seller analytics dashboard." },
  { year: "2025", title: "Series A & Global Expansion", desc: "Raised $12M Series A. Expanded to 80 countries, launched in 6 languages, and introduced the SaaS MRKT API for enterprise buyers." },
  { year: "2026", title: "50,000 Buyers & Growing", desc: "Today SaaS MRKT serves 50,000+ buyers, 500+ sellers, and has facilitated over $8M in software subscriptions." },
];

export default function AboutPageClient() {
  return (
    <PageLayout noContainer>
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <div className="section-badge">OUR STORY</div>
            <h1 className="about-hero-title">
              We&apos;re Building the World&apos;s Most <span className="section-title-highlight">Trusted SaaS MRKTplace</span>
            </h1>
            <p className="about-hero-subtitle">
              SaaS MRKT was founded to fix a broken discovery process. Finding the right software
              shouldn&apos;t take weeks of demos, confusing pricing pages, and biased review sites.
              We&apos;re building something better.
            </p>
            <div className="about-hero-actions">
              <Link href="/products" className="btn-primary" id="about-browse-btn">Browse Products</Link>
              <Link href="/contact" className="btn-secondary" id="about-contact-btn">Get in Touch</Link>
            </div>
          </div>
        </div>
        <div className="about-hero-blob about-hero-blob--1" />
        <div className="about-hero-blob about-hero-blob--2" />
      </section>

      {/* Stats Bar */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {[
              { 
                num: "50K+", 
                label: "Active Buyers", 
                color: "var(--blue-500)",
                bg: "var(--blue-50)",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )
              },
              { 
                num: "500+", 
                label: "Seller Listings", 
                color: "var(--orange-500)",
                bg: "var(--orange-50)",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                )
              },
              { 
                num: "80+", 
                label: "Countries", 
                color: "var(--emerald-500)",
                bg: "var(--green-50)",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                )
              },
              { 
                num: "$8M+", 
                label: "Software Sold", 
                color: "var(--primary)",
                bg: "var(--primary-50)",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                )
              },
            ].map((stat, i) => (
              <div key={i} className="about-stat-card" id={`about-stat-${i}`}>
                <div 
                  className="about-stat-icon-wrap"
                  style={{
                    backgroundColor: stat.bg,
                    color: stat.color,
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  {stat.icon}
                </div>
                <div className="about-stat-num">{stat.num}</div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission-section">
        <div className="container">
          <div className="about-mission-inner">
            <div className="about-mission-text">
              <div className="section-badge">OUR MISSION</div>
              <h2 className="section-title">Making Software Discovery Honest, Fast, and Fair</h2>
              <p className="section-subtitle">
                We believe every business — from a solo founder to a Fortune 500 team — deserves access to
                the right software at a fair price, without being manipulated by opaque ranking algorithms
                or sponsored placements.
              </p>
              <p className="section-subtitle" style={{ marginTop: "1rem" }}>
                SaaS MRKT uses verified reviews, usage data, and transparent ranking signals to surface
                the best tools for every buyer&apos;s needs. Sellers succeed on merit, not marketing spend.
              </p>
              <Link href="/products" className="btn-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }} id="about-mission-browse-btn">
                See How It Works
              </Link>
            </div>
            <div className="about-mission-visual">
              <div className="about-mission-card">
                <div className="about-mission-card-icon" style={{ background: "linear-gradient(135deg, #5E4BEE, #8B5CF6)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Verified Reviews Only</h3>
                <p>Every review is tied to a verified purchase. No fake testimonials, no paid reviews.</p>
              </div>
              <div className="about-mission-card" style={{ marginTop: "1.25rem" }}>
                <div className="about-mission-card-icon" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3>Zero Commission Model</h3>
                <p>Sellers keep 100% of their revenue. We charge only a flat listing fee — nothing more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values-section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-badge">OUR VALUES</div>
            <h2 className="section-title">What Drives Us Every Day</h2>
          </div>
          <div className="about-values-grid">
            {VALUES.map((v, i) => (
              <div key={i} className="about-value-card" id={`value-${i}`}>
                <div className="about-value-icon">{v.icon}</div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-timeline-section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-badge">OUR JOURNEY</div>
            <h2 className="section-title">Building SaaS MRKT, Year by Year</h2>
          </div>
          <div className="about-timeline">
            {MILESTONES.map((ms, i) => (
              <div key={i} className={`about-timeline-item${i % 2 === 0 ? "" : " about-timeline-item--right"}`} id={`timeline-${ms.year}`}>
                <div className="about-timeline-dot" />
                <div className="about-timeline-card">
                  <span className="about-timeline-year">{ms.year}</span>
                  <h3 className="about-timeline-title">{ms.title}</h3>
                  <p className="about-timeline-desc">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team-section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-badge">THE TEAM</div>
            <h2 className="section-title">The People Behind SaaS MRKT</h2>
            <p className="section-subtitle" style={{ margin: "0.5rem auto 0", maxWidth: "560px" }}>
              A small, passionate team of product builders, writers, and engineers on a mission to fix software discovery.
            </p>
          </div>
          <div className="about-team-grid">
            {TEAM.map((member, i) => (
              <div key={i} className="about-team-card" id={`team-${member.name.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="about-team-avatar" style={{ background: member.gradient }}>
                  {member.initial}
                </div>
                <h3 className="about-team-name">{member.name}</h3>
                <div className="about-team-role">{member.role}</div>
                <p className="about-team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="about-join-section">
        <div className="container">
          <div className="about-join-card">
            <h2 className="about-join-title">We&apos;re Hiring!</h2>
            <p className="about-join-sub">
              We&apos;re a remote-first team looking for curious, driven people who want to shape the future of software discovery.
            </p>
            <div className="about-join-actions">
              <Link href="/contact" className="btn-primary" id="about-join-careers-btn">View Open Roles</Link>
              <Link href="/contact" className="btn-secondary" id="about-join-contact-btn">Say Hello</Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

