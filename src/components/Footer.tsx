"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3500);
    }
  };

  return (
    <footer className="footer-section" id="footer" aria-label="Site Footer">
      <div className="container footer-container">
        <div className="footer-box">
          {/* Subtle Decorative Pastel Ambient Corner Blobs Matching Design */}
          <div className="footer-bg-accents" aria-hidden="true">
            <span className="footer-blob-left" />
            <span className="footer-blob-right" />
            <span className="footer-blob-bottom" />
          </div>

          {/* Top 6-Column Grid */}
          <div className="footer-top-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-brand-col">
              <Link href="/" className="brand-logo" id="footer-brand-logo">
                <span className="brand-icon">
                  <Image
                    src="/logo.png"
                    alt="SaaS MRKT Logo"
                    width={36}
                    height={36}
                    style={{ objectFit: "contain" }}
                  />
                </span>
                <span className="brand-logo-text">
                  <span className="brand-text-dark">SaaS</span>{" "}
                  <span className="brand-text-primary">MRKT</span>
                </span>
              </Link>

              <p className="footer-desc">
                The leading B2B SaaS marketplace platform. Discover, compare, and acquire verified multi-vendor SaaS products with flexible payment gateway alternatives, and scale your software business with 0% listing commission.
              </p>

              {/* Social Icon Links */}
              <div className="footer-social-row">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  aria-label="X (formerly Twitter)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  aria-label="LinkedIn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  aria-label="YouTube"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  aria-label="Instagram"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Products */}
            <div className="footer-col">
              <div className="footer-col-header">
                <div className="footer-col-icon-box col-icon-purple">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <h4 className="footer-col-title">Products</h4>
              </div>
              <ul className="footer-links-list">
                <li><Link href="/products" className="footer-link-item">All Products</Link></li>
                <li><Link href="/categories" className="footer-link-item">Categories</Link></li>
                <li><Link href="/compare" className="footer-link-item">Compare Tools</Link></li>
                <li><Link href="/alternatives" className="footer-link-item">Software Alternatives</Link></li>
                <li><Link href="/deals" className="footer-link-item">Deals &amp; Offers</Link></li>
              </ul>
            </div>

            {/* Column 3: For Buyers */}
            <div className="footer-col">
              <div className="footer-col-header">
                <div className="footer-col-icon-box col-icon-blue">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4 className="footer-col-title">For Buyers</h4>
              </div>
              <ul className="footer-links-list">
                <li><Link href="/tools/saas-spend-calculator" className="footer-link-item">Spend Calculator</Link></li>
                <li><Link href="/how-it-works" className="footer-link-item">How it Works</Link></li>
                <li><Link href="/buyers" className="footer-link-item">Buyer Guide</Link></li>
                <li><Link href="/trust" className="footer-link-item">Trust &amp; Security</Link></li>
                <li><Link href="/contact" className="footer-link-item">Support &amp; FAQs</Link></li>
              </ul>
            </div>

            {/* Column 4: For Sellers */}
            <div className="footer-col">
              <div className="footer-col-header">
                <div className="footer-col-icon-box col-icon-emerald">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h4 className="footer-col-title">For Sellers</h4>
              </div>
              <ul className="footer-links-list">
                <li><Link href="/submit-product" className="footer-link-item">List Your Product</Link></li>
                <li><Link href="/badges" className="footer-link-item">Embeddable Badges</Link></li>
                <li><Link href="/sellers" className="footer-link-item">Seller Guide</Link></li>
                <li><Link href="/vendor" className="footer-link-item">Seller Resources</Link></li>
                <li><Link href="/contact" className="footer-link-item">Contact Sales</Link></li>
              </ul>
            </div>

            {/* Column 5: Company */}
            <div className="footer-col">
              <div className="footer-col-header">
                <div className="footer-col-icon-box col-icon-amber">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="8" y2="6.01" />
                    <line x1="12" y1="6" x2="12" y2="6.01" />
                    <line x1="16" y1="6" x2="16" y2="6.01" />
                    <line x1="8" y1="10" x2="8" y2="10.01" />
                    <line x1="12" y1="10" x2="12" y2="10.01" />
                    <line x1="16" y1="10" x2="16" y2="10.01" />
                    <line x1="8" y1="14" x2="8" y2="14.01" />
                    <line x1="12" y1="14" x2="12" y2="14.01" />
                    <line x1="16" y1="14" x2="16" y2="14.01" />
                  </svg>
                </div>
                <h4 className="footer-col-title">Company</h4>
              </div>
              <ul className="footer-links-list">
                <li><Link href="/about" className="footer-link-item">About Us</Link></li>
                <li><Link href="/blog" className="footer-link-item">Blog</Link></li>
                <li><Link href="/editorial-guidelines" className="footer-link-item">Editorial Guidelines</Link></li>
                <li><Link href="/trust" className="footer-link-item">Trust &amp; Escrow</Link></li>
                <li><Link href="/privacy" className="footer-link-item">Privacy Policy</Link></li>
                <li><Link href="/terms" className="footer-link-item">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* New Row: Modern Full-Width Newsletter */}
          <div className="footer-newsletter-row">
            <div className="footer-newsletter-col">
              <div className="footer-newsletter-card">
                <div className="footer-nl-inner">
                  {/* Left: Icon + Title & Desc */}
                  <div className="footer-nl-left">
                    <div className="footer-nl-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div className="footer-nl-text">
                      <h4 className="footer-nl-title">Stay Updated</h4>
                      <p className="footer-nl-desc">
                        Get the latest SaaS insights, deals and industry trends.
                      </p>
                    </div>
                  </div>

                  {/* Right: Form + Guarantee + Flying Paper Airplane */}
                  <div className="footer-nl-right">
                    {subscribed ? (
                      <div className="footer-nl-success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Thank you for subscribing!</span>
                      </div>
                    ) : (
                      <form className="footer-nl-form" onSubmit={handleSubscribe}>
                        <div className="footer-nl-input-group">
                          <svg className="footer-nl-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <input
                            type="email"
                            className="footer-nl-input"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Enter your email for SaaS updates"
                            style={{ outline: "none", boxShadow: "none" }}
                          />
                          <button type="submit" className="footer-nl-submit-btn" aria-label="Subscribe to newsletter">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="footer-nl-meta-row">
                      <div className="footer-nl-guarantee">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <polyline points="9 12 11 14 15 10" />
                        </svg>
                        <span>No spam. Unsubscribe anytime.</span>
                      </div>

                      <div className="footer-nl-plane-wrap" aria-hidden="true">
                        <svg className="footer-nl-plane-path" width="46" height="22" viewBox="0 0 46 22" fill="none">
                          <path d="M 4 18 Q 22 18, 35 5" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                        </svg>
                        <svg className="footer-nl-plane-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" fill="rgba(99, 102, 241, 0.18)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Trending Marketplace Searches */}
          <div className="footer-trending-row">
            <div className="footer-trending-badge-col">
              <div className="footer-trending-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div className="footer-trending-label-stack">
                <span className="footer-trending-head">Trending</span>
                <span className="footer-trending-sub">Marketplace Searches:</span>
              </div>
            </div>

            <div className="footer-trending-tags-flow">
              <Link href="/products?search=B2B+SaaS+Marketplace" className="footer-pill-tag">
                B2B SaaS Marketplace
              </Link>
              <Link href="/products?search=SaaS+Marketplace+Platform" className="footer-pill-tag">
                SaaS Marketplace Platform
              </Link>
              <Link href="/products?search=Marketplace+for+SaaS+Products" className="footer-pill-tag">
                Marketplace for SaaS Products
              </Link>
              <Link href="/products?search=Multi-Vendor+Marketplace+SaaS" className="footer-pill-tag">
                Multi-Vendor Marketplace SaaS
              </Link>
              <Link href="/products?search=AWS+Azure+SaaS+Alternatives" className="footer-pill-tag">
                AWS &amp; Azure SaaS Alternatives
              </Link>
              <Link href="/products?search=SaaS+Payment+Gateways+Alternatives" className="footer-pill-tag">
                SaaS Payment Gateways Alternatives
              </Link>
              <Link href="/blog" className="footer-pill-tag">
                SaaS vs Marketplace Multiples
              </Link>
              <Link href="/products?search=XBERT+Fintech+Marketplace" className="footer-pill-tag">
                XBERT Fintech Marketplace
              </Link>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright">
              © 2026 SaaS MRKT. All rights reserved.
            </div>

            <div className="footer-legal-links">
              <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
              <span className="footer-legal-sep" aria-hidden="true">|</span>
              <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
              <span className="footer-legal-sep" aria-hidden="true">|</span>
              <Link href="/sitemap.xml" className="footer-legal-link">Sitemap</Link>
            </div>

            <div className="footer-community-text">
              <span>Made with</span>
              <span className="footer-heart-badge">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="#EF4444"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="heart"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
              <span>for the SaaS community.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
