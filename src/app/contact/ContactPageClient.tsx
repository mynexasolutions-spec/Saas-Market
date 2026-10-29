"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "@/app/buyers/buyers-page.css";
import "./contact-page.css";

const CONTACT_REASONS = [
  "General Inquiry",
  "List My Software Product",
  "Enterprise Advisory & Multi-Seat",
  "Partnership Opportunity",
  "Press & Media",
  "Technical Support",
  "Billing & Escrow Question",
  "Report an Issue",
];

const OFFICES = [
  {
    city: "Bangalore",
    country: "India 🇮🇳",
    address: "91 MG Road, Prestige Towers, Suite 14\nBangalore, KA 560001",
    email: "hello@saasmrkt.com",
    phone: "+91 80 4123 5678",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  },
  {
    city: "San Francisco",
    country: "USA 🇺🇸",
    address: "220 Montgomery St, Suite 800\nSan Francisco, CA 94104",
    email: "us@saasmrkt.com",
    phone: "+1 415 800 9000",
    gradient: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
  },
];

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    reason: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <PageLayout activeNav="contact" noContainer>
      <div className="contact-page-wrapper">
        <div className="contact-container">
          {/* 1. Breadcrumbs: ⌂ Home › Contact Us */}
          <nav className="contact-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="contact-breadcrumb-sep">›</span>
            <span className="contact-breadcrumb-current">Contact Us</span>
          </nav>

          {/* 2. Compact Modern Hero Section */}
          <header className="contact-hero">
            <div className="contact-hero-pill">CONTACT &amp; CONCIERGE SUPPORT</div>

            <h1 className="contact-hero-title">
              Let&apos;s Start a{" "}
              <span className="contact-title-gradient">Conversation</span>
            </h1>

            <p className="contact-hero-desc">
              Whether you&apos;re a software buyer with procurement questions, an enterprise seeking volume licensing, or a vendor ready to list your software, our team is ready to assist.
            </p>

            {/* 3 Hero Trust Badges (Exact /buyers typography scale) */}
            <div className="contact-hero-badges">
              <div className="contact-badge-item">
                <div className="contact-badge-icon icon-green">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="contact-badge-text">
                  <span className="contact-badge-num">&lt; 24h</span>
                  <span className="contact-badge-label">Guaranteed Response SLA</span>
                </div>
              </div>

              <div className="contact-badge-item">
                <div className="contact-badge-icon icon-purple">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="contact-badge-text">
                  <span className="contact-badge-num">100% Free</span>
                  <span className="contact-badge-label">Buyer &amp; Advisory Help</span>
                </div>
              </div>

              <div className="contact-badge-item">
                <div className="contact-badge-icon icon-blue">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="contact-badge-text">
                  <span className="contact-badge-num">Dedicated</span>
                  <span className="contact-badge-label">Concierge &amp; Account Reps</span>
                </div>
              </div>
            </div>
          </header>

          {/* 3. Main 2-Column Grid (Form + Sidebar Information) */}
          <div className="contact-grid">
            {/* Contact Form Card */}
            <section className="contact-form-card">
              {submitted ? (
                <div className="contact-success-card" id="contact-success">
                  <div className="contact-success-icon" aria-hidden="true">✓</div>
                  <h2 className="contact-success-title">Message Sent Successfully!</h2>
                  <p className="contact-success-text">
                    Thank you for reaching out. Our concierge team has received your message and will get back to you within one business day at{" "}
                    <strong>{formData.email}</strong>.
                  </p>
                  <button
                    type="button"
                    className="buyers-btn-primary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", company: "", reason: "", message: "" });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-form">
                  <div className="contact-form-header">
                    <span className="contact-form-eyebrow">DIRECT INQUIRY</span>
                    <h2 className="contact-form-title">Send Us a Message</h2>
                    <p className="contact-form-desc">
                      Fill out the form below and an advisor from our team will respond within 1 business day.
                    </p>
                  </div>

                  <div className="contact-fields-stack">
                    <div className="contact-fields-row">
                      <label className="contact-field">
                        <span className="contact-field-label">
                          <span>Full Name <span className="contact-req">*</span></span>
                        </span>
                        <input
                          id="contact-name"
                          type="text"
                          className="contact-input"
                          placeholder="Alex Morgan"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </label>

                      <label className="contact-field">
                        <span className="contact-field-label">
                          <span>Work Email <span className="contact-req">*</span></span>
                        </span>
                        <input
                          id="contact-email"
                          type="email"
                          className="contact-input"
                          placeholder="alex@company.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="contact-fields-row">
                      <label className="contact-field">
                        <span className="contact-field-label">
                          <span>Company Name <span className="contact-field-opt">Optional</span></span>
                        </span>
                        <input
                          id="contact-company"
                          type="text"
                          className="contact-input"
                          placeholder="Acme Corp"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </label>

                      <label className="contact-field">
                        <span className="contact-field-label">
                          <span>Reason for Contact <span className="contact-req">*</span></span>
                        </span>
                        <select
                          id="contact-reason"
                          className="contact-select"
                          required
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        >
                          <option value="">Select a reason...</option>
                          {CONTACT_REASONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="contact-field">
                      <span className="contact-field-label">
                        <span>How Can We Help You? <span className="contact-req">*</span></span>
                      </span>
                      <textarea
                        id="contact-message"
                        className="contact-textarea"
                        placeholder="Tell us about your requirements, tool questions, or vendor goals..."
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </label>

                    <button
                      type="submit"
                      className="buyers-btn-primary contact-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="contact-spinner" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="contact-privacy-note">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      We respect your privacy. Your information is never sold or shared with third parties.
                    </p>
                  </div>
                </form>
              )}
            </section>

            {/* Sidebar Information */}
            <aside className="contact-sidebar">
              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-title">Fast Response Guaranteed</h3>
                  <p className="contact-info-text">
                    We reply within 1 business day. For immediate assistance with ongoing escrow orders, visit our support center.
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-title">Looking to List Your SaaS?</h3>
                  <p className="contact-info-text">
                    Reach over 85,000 verified software buyers with zero upfront listing fees and 100% escrow payouts.
                  </p>
                  <Link href="/submit-product" className="contact-info-link">
                    Start Vendor Application →
                  </Link>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-title">Press &amp; Media Inquiries</h3>
                  <p className="contact-info-text">
                    For interview requests, SaaS market quarterly data reports, and executive commentary:
                  </p>
                  <a href="mailto:press@saasmrkt.com" className="contact-info-link">
                    press@saasmrkt.com →
                  </a>
                </div>
              </div>

              {/* Social Channels Card */}
              <div className="contact-social-card">
                <span className="contact-social-label">Follow SaaS MRKT</span>
                <div className="contact-social-row">
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="contact-social-btn" aria-label="Twitter">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-social-btn" aria-label="LinkedIn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="contact-social-btn" aria-label="YouTube">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* 4. Global Offices Section (Frosted Lavender Box) */}
          <section className="contact-offices-box">
            <div className="contact-offices-head">
              <span className="contact-offices-badge">OUR LOCATIONS</span>
              <h2 className="contact-offices-title">Global Headquarters &amp; Regional Hubs</h2>
              <p className="contact-offices-sub">
                Connect with our local territory managers or schedule an in-person procurement consultation.
              </p>
            </div>

            <div className="contact-offices-grid">
              {OFFICES.map((office) => (
                <div key={office.city} className="contact-office-card">
                  <div className="contact-office-header" style={{ background: office.gradient }}>
                    <h3 className="contact-office-city">{office.city}</h3>
                    <span className="contact-office-country">{office.country}</span>
                  </div>
                  <div className="contact-office-body">
                    <div className="contact-office-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span style={{ whiteSpace: "pre-line" }}>{office.address}</span>
                    </div>

                    <div className="contact-office-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${office.email}`} className="contact-info-link">
                        {office.email}
                      </a>
                    </div>

                    <div className="contact-office-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{office.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
