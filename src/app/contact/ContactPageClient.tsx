"use client";

import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";

const CONTACT_REASONS = [
  "General Inquiry",
  "List My Product",
  "Partnership Opportunity",
  "Press & Media",
  "Technical Support",
  "Billing Question",
  "Report an Issue",
];

const OFFICES = [
  {
    city: "Bangalore",
    country: "India 🇮🇳",
    address: "91 MG Road, Prestige Towers, Suite 14\nBangalore, KA 560001",
    email: "hello@saasmarket.io",
    phone: "+91 80 4123 5678",
    gradient: "linear-gradient(135deg, #5E4BEE 0%, #8B5CF6 100%)",
  },
  {
    city: "San Francisco",
    country: "USA 🇺🇸",
    address: "220 Montgomery St, Suite 800\nSan Francisco, CA 94104",
    email: "us@saasmarket.io",
    phone: "+1 415 800 9000",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
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
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <PageLayout noContainer>
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <div className="section-badge">CONTACT US</div>
            <h1 className="contact-hero-title">
              Let&apos;s <span className="section-title-highlight">Start a Conversation</span>
            </h1>
            <p className="contact-hero-subtitle">
              Whether you&apos;re a buyer with questions or a seller ready to list your product,
              our team is here to help within one business day.
            </p>
          </div>
        </div>
        <div className="contact-hero-blob contact-hero-blob--1" />
        <div className="contact-hero-blob contact-hero-blob--2" />
      </section>

      {/* Main Content */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="contact-success-state" id="contact-success">
                  <div className="contact-success-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="contact-success-title">Message Sent!</h2>
                  <p className="contact-success-text">
                    Thanks for reaching out. Our team will get back to you within one business day at{" "}
                    <strong>{formData.email}</strong>.
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", company: "", reason: "", message: "" }); }}
                    id="contact-send-another-btn"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
                  <h2 className="contact-form-title">Send Us a Message</h2>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="contact-name" className="contact-label">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        className="contact-input"
                        placeholder="Jane Smith"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="contact-email" className="contact-label">Work Email *</label>
                      <input
                        id="contact-email"
                        type="email"
                        className="contact-input"
                        placeholder="jane@company.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="contact-company" className="contact-label">Company Name</label>
                      <input
                        id="contact-company"
                        type="text"
                        className="contact-input"
                        placeholder="Acme Inc."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="contact-reason" className="contact-label">Reason for Contact *</label>
                      <select
                        id="contact-reason"
                        className="contact-input contact-select"
                        required
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      >
                        <option value="">Select a reason...</option>
                        {CONTACT_REASONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-message" className="contact-label">Message *</label>
                    <textarea
                      id="contact-message"
                      className="contact-input contact-textarea"
                      placeholder="Tell us how we can help you..."
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary contact-submit-btn"
                    id="contact-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="contact-spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="contact-privacy-note">
                    We respect your privacy. Your data will never be shared with third parties.
                  </p>
                </form>
              )}
            </div>

            {/* Sidebar Info */}
            <aside className="contact-info-sidebar">
              {/* Response Time */}
              <div className="contact-info-card" id="contact-response-time">
                <div className="contact-info-icon" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-title">Fast Response</h3>
                  <p className="contact-info-text">We reply within 1 business day. For urgent matters, use the live chat in the bottom-right corner.</p>
                </div>
              </div>

              <div className="contact-info-card" id="contact-seller-path">
                <div className="contact-info-icon" style={{ background: "linear-gradient(135deg, #5E4BEE, #8B5CF6)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-title">Want to List Your Product?</h3>
                  <p className="contact-info-text">See our seller plans — start free and upgrade anytime. No commission on sales.</p>
                  <a href="/pricing" className="contact-info-link" id="contact-sidebar-pricing-link">View Seller Plans</a>
                </div>
              </div>

              <div className="contact-info-card" id="contact-press">
                <div className="contact-info-icon" style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-title">Press & Media</h3>
                  <p className="contact-info-text">For press inquiries, interview requests, and media kits, email us directly at:</p>
                  <a href="mailto:press@saasmarket.io" className="contact-info-link" id="contact-press-email">press@saasmarket.io</a>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-social-row">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="contact-social-btn" id="contact-twitter" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-social-btn" id="contact-linkedin" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="contact-social-btn" id="contact-youtube" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                </a>
              </div>
            </aside>
          </div>

          {/* Office Locations */}
          <div className="contact-offices">
            <h2 className="contact-offices-title">Our Offices</h2>
            <div className="contact-offices-grid">
              {OFFICES.map((office, i) => (
                <div key={i} className="contact-office-card" id={`office-${office.city.toLowerCase()}`}>
                  <div className="contact-office-header" style={{ background: office.gradient }}>
                    <div className="contact-office-city">{office.city}</div>
                    <div className="contact-office-country">{office.country}</div>
                  </div>
                  <div className="contact-office-body">
                    <div className="contact-office-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <div className="contact-office-address" style={{ whiteSpace: "pre-line", fontFamily: "inherit", color: "var(--slate-600)", lineHeight: 1.6 }}>
                        {office.address}
                      </div>
                    </div>
                    <div className="contact-office-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${office.email}`} className="contact-info-link">{office.email}</a>
                    </div>
                    <div className="contact-office-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{office.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
