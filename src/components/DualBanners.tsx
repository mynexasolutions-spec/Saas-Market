"use client";

import React from "react";

interface DualBannersProps {
  onExploreProducts: () => void;
  onBecomeSeller: () => void;
}

export default function DualBanners({
  onExploreProducts,
  onBecomeSeller,
}: DualBannersProps) {
  return (
    <section className="dual-banners-section" id="for-buyers">
      <div className="container">
        <div className="dual-banners-grid">
          {/* Card 1: For Buyers */}
          <div className="dual-card dual-card-buyer" id="banner-buyers">
            <div className="dual-card-left">
              <span className="dual-card-tag">For Buyers</span>
              <h2 className="dual-card-title">
                Find the Right SaaS Tools for Your Business
              </h2>

              <ul className="dual-check-list">
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Wide range of verified products</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Detailed comparisons</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Trusted user reviews</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Secure and easy purchase process</span>
                </li>
              </ul>

              <button
                type="button"
                className="btn-primary"
                onClick={onExploreProducts}
                id="btn-buyer-explore"
              >
                <span>Explore Products</span>
              </button>
            </div>

            {/* Right Graphic: Glass Card & Orb */}
            <div className="dual-card-graphic" aria-hidden="true">
              <div className="graphic-orb graphic-orb-buyer" />
              <div className="graphic-badge-box buyer-box">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16" y2="16" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: For Sellers */}
          <div className="dual-card dual-card-seller" id="for-sellers">
            <div className="dual-card-left">
              <span className="dual-card-tag">For Sellers</span>
              <h2 className="dual-card-title">
                List Your SaaS Product and Reach More Customers
              </h2>

              <ul className="dual-check-list">
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Showcase your product</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Reach targeted buyers</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Manage leads and analytics</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Grow your revenue</span>
                </li>
              </ul>

              <button
                type="button"
                className="btn-primary"
                onClick={onBecomeSeller}
                id="btn-become-seller"
              >
                <span>Become a Seller</span>
              </button>
            </div>

            {/* Right Graphic: Glass Card & Orb */}
            <div className="dual-card-graphic" aria-hidden="true">
              <div className="graphic-orb graphic-orb-seller" />
              <div className="graphic-badge-box seller-box">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5E4BEE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" strokeWidth="3" strokeLinecap="round" />
                  <line x1="12" y1="20" x2="12" y2="4" strokeWidth="3" strokeLinecap="round" />
                  <line x1="6" y1="20" x2="6" y2="14" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
