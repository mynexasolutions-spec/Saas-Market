"use client";

import React from "react";

interface NewsletterProps {
  onSubscribe?: (email: string) => void;
}

export default function Newsletter({ onSubscribe }: NewsletterProps) {
  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-box">
          {/* Left Text */}
          <div className="newsletter-left">
            <span className="newsletter-badge">PLATFORM PROMISE</span>
            <h2 className="newsletter-title">
              Built for Modern Teams Scaling Faster
            </h2>
            <p className="newsletter-subtitle">
              Discover, compare, and deploy verified SaaS products with full transparency and zero hidden fees.
            </p>
          </div>

          {/* Right Text Features (replacing subscription form) */}
          <div className="newsletter-right">
            <div className="newsletter-text-features">
              <div className="newsletter-text-card">
                <div className="newsletter-text-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="newsletter-text-info">
                  <h4 className="newsletter-text-head">Verified Vendors &amp; Security</h4>
                  <p className="newsletter-text-body">
                    Every product passes strict performance, SLA, and security checks before listing.
                  </p>
                </div>
              </div>

              <div className="newsletter-text-card">
                <div className="newsletter-text-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="newsletter-text-info">
                  <h4 className="newsletter-text-head">Exclusive Direct Deals</h4>
                  <p className="newsletter-text-body">
                    Access special founder discounts and flexible tier upgrades directly from creators.
                  </p>
                </div>
              </div>

              <div className="newsletter-text-card">
                <div className="newsletter-text-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="newsletter-text-info">
                  <h4 className="newsletter-text-head">Zero Spam, Zero Lock-In</h4>
                  <p className="newsletter-text-body">
                    Evaluate tools transparently with real user reviews, verified ratings, and clean handoffs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
