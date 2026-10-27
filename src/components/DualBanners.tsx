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
            {/* Background 3D Wave Ribbons */}
            <div className="dual-card-bg dual-card-bg-buyer" aria-hidden="true">
              <svg viewBox="0 0 540 380" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="dual-bg-wave">
                <path d="M240 -20 C 330 70, 460 30, 560 130 L 560 -20 Z" fill="url(#buyerWaveTop)" opacity="0.85" />
                <path d="M200 400 C 310 270, 420 310, 560 210 L 560 400 Z" fill="url(#buyerWaveBottom)" opacity="0.65" />
                <defs>
                  <linearGradient id="buyerWaveTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="buyerWaveBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="dual-card-left">
              <div className="dual-card-badge dual-card-badge-buyer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>For Buyers</span>
              </div>

              <h2 className="dual-card-title">
                Find the Right SaaS<br className="dual-title-br" />Tools for{" "}
                <span className="dual-title-highlight-blue">Your Business</span>
              </h2>

              <p className="dual-card-desc">
                Explore, compare, and choose from a wide range of verified SaaS products to grow your business faster.
              </p>

              <ul className="dual-check-list">
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-buyer">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Wide range of verified products</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-buyer">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Detailed comparisons</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-buyer">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Trusted user reviews</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-buyer">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Secure and easy purchase process</span>
                </li>
              </ul>

              <button
                type="button"
                className="dual-btn dual-btn-buyer"
                onClick={onExploreProducts}
                id="btn-buyer-explore"
              >
                <span>Explore Products</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Right Side 3D SaaS Browser Graphic */}
            <div className="dual-card-graphic" aria-hidden="true">
              <svg width="250" height="230" viewBox="0 0 250 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="dual-graphic-svg">
                <defs>
                  <filter id="buyerDropShadow" x="-20%" y="-20%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0284C7" floodOpacity="0.14" />
                  </filter>
                  <filter id="buyerBadgeGlow" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0284C7" floodOpacity="0.18" />
                  </filter>
                </defs>

                {/* Curved dotted guide line */}
                <path
                  d="M 40 180 C 15 150, 15 100, 50 70 C 90 35, 170 30, 210 65"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.75"
                />

                {/* Main 3D SaaS Browser Window */}
                <g filter="url(#buyerDropShadow)" transform="rotate(-3 120 120)">
                  <rect x="25" y="30" width="160" height="150" rx="10" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
                  
                  {/* Top Bar with 3 traffic dots */}
                  <path d="M 25 38 C 25 33.6 28.6 30 33 30 L 177 30 C 181.4 30 185 33.6 185 38 L 185 45 L 25 45 Z" fill="#F0F9FF" />
                  <circle cx="35" cy="37.5" r="2.5" fill="#EF4444" />
                  <circle cx="43" cy="37.5" r="2.5" fill="#F59E0B" />
                  <circle cx="51" cy="37.5" r="2.5" fill="#10B981" />

                  {/* Search Input Bar Mockup */}
                  <rect x="35" y="52" width="140" height="22" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                  <text x="44" y="66" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">Search SaaS tools...</text>
                  <rect x="153" y="54" width="18" height="18" rx="3.5" fill="#2563EB" />
                  <circle cx="161" cy="62" r="3.2" stroke="#FFFFFF" strokeWidth="1.3" fill="none" />
                  <line x1="163.5" y1="64.5" x2="167" y2="68" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />

                  {/* 3 Category Tiles */}
                  {/* Tile 1: Cloud */}
                  <rect x="35" y="82" width="42" height="32" rx="5" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1" />
                  <path d="M 48 100 C 48 97, 51 95, 54 96 C 56 93, 62 93, 64 96 C 66 94, 70 96, 69 99 C 71 101, 70 104, 67 104 L 49 104 C 47 104, 47 101, 48 100 Z" fill="#2563EB" />

                  {/* Tile 2: Bar Chart */}
                  <rect x="84" y="82" width="42" height="32" rx="5" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1" />
                  <rect x="94" y="99" width="3" height="6" rx="1" fill="#38BDF8" />
                  <rect x="100" y="94" width="3" height="11" rx="1" fill="#0284C7" />
                  <rect x="106" y="90" width="3" height="15" rx="1" fill="#2563EB" />

                  {/* Tile 3: Shield */}
                  <rect x="133" y="82" width="42" height="32" rx="5" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                  <path d="M 154 90 L 160 92.5 V 98 C 160 102 154 105 154 105 C 154 105 148 102 148 98 V 92.5 L 154 90 Z" fill="#10B981" />
                  <polyline points="151.5 97.5 153.5 99.5 156.5 96" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Placeholder List Rows */}
                  <rect x="35" y="122" width="14" height="14" rx="3" fill="#F5D0FE" />
                  <rect x="54" y="124" width="60" height="4" rx="2" fill="#E2E8F0" />
                  <rect x="54" y="131" width="40" height="3.5" rx="1.7" fill="#F1F5F9" />

                  <rect x="35" y="142" width="14" height="14" rx="3" fill="#FED7AA" />
                  <rect x="54" y="144" width="70" height="4" rx="2" fill="#E2E8F0" />
                  <rect x="54" y="151" width="45" height="3.5" rx="1.7" fill="#F1F5F9" />
                </g>

                {/* Floating Badge 1 (Top Right): Upward Bar Chart & Sparks */}
                <g filter="url(#buyerBadgeGlow)">
                  <rect x="175" y="12" width="46" height="46" rx="9" fill="#FFFFFF" stroke="#E0F2FE" strokeWidth="1.5" />
                  {/* Upward Bars */}
                  <rect x="187" y="36" width="4" height="12" rx="1" fill="#7DD3FC" />
                  <rect x="195" y="29" width="4" height="19" rx="1" fill="#0284C7" />
                  <rect x="203" y="22" width="4" height="26" rx="1" fill="#2563EB" />
                  {/* Radiating Spark Rays */}
                  <line x1="183" y1="18" x2="180" y2="14" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                  <line x1="190" y1="12" x2="190" y2="7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                  <line x1="198" y1="14" x2="202" y2="10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Floating Badge 2 (Bottom Right): Avatar + 5 Stars Review Card */}
                <g filter="url(#buyerBadgeGlow)">
                  <rect x="135" y="158" width="85" height="42" rx="8" fill="#FFFFFF" stroke="#E0F2FE" strokeWidth="1.5" />
                  {/* Blue Avatar Circle */}
                  <circle cx="152" cy="179" r="9" fill="#2563EB" />
                  <circle cx="152" cy="176" r="3.2" fill="#FFFFFF" />
                  <path d="M 146 185 C 146 182 148.5 180.5 152 180.5 C 155.5 180.5 158 182 158 185 Z" fill="#FFFFFF" />
                  
                  {/* 5 Gold Stars */}
                  <g fill="#F59E0B">
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(38 32)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(50 32)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(62 32)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(74 32)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(86 32)" />
                  </g>
                  {/* Review placeholder lines */}
                  <rect x="168" y="185" width="42" height="3" rx="1.5" fill="#E2E8F0" />
                  <rect x="168" y="191" width="28" height="2.5" rx="1.2" fill="#F1F5F9" />
                </g>
              </svg>
            </div>
          </div>

          {/* Card 2: For Sellers */}
          <div className="dual-card dual-card-seller" id="for-sellers">
            {/* Background 3D Wave Ribbons */}
            <div className="dual-card-bg dual-card-bg-seller" aria-hidden="true">
              <div className="seller-dot-matrix" />
              <svg viewBox="0 0 540 380" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="dual-bg-wave">
                <path d="M240 -20 C 340 70, 460 30, 560 130 L 560 -20 Z" fill="url(#sellerWaveTop)" opacity="0.85" />
                <path d="M200 400 C 310 270, 420 310, 560 210 L 560 400 Z" fill="url(#sellerWaveBottom)" opacity="0.65" />
                <defs>
                  <linearGradient id="sellerWaveTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="sellerWaveBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="dual-card-left">
              <div className="dual-card-badge dual-card-badge-seller">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>For Sellers</span>
              </div>

              <h2 className="dual-card-title">
                List Your SaaS Product<br className="dual-title-br" />and Reach{" "}
                <span className="dual-title-highlight-purple">More Customers</span>
              </h2>

              <p className="dual-card-desc">
                Get your product in front of the right audience and grow your revenue on a trusted marketplace.
              </p>

              <ul className="dual-check-list">
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-seller">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Showcase your product</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-seller">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Reach targeted buyers</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-seller">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Manage leads and analytics</span>
                </li>
                <li className="dual-check-item">
                  <span className="check-icon-circle check-icon-circle-seller">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Grow your revenue</span>
                </li>
              </ul>

              <button
                type="button"
                className="dual-btn dual-btn-seller"
                onClick={onBecomeSeller}
                id="btn-become-seller"
              >
                <span>Become a Seller</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Right Side 3D Sellers Product Showcase Graphic */}
            <div className="dual-card-graphic" aria-hidden="true">
              <svg width="250" height="230" viewBox="0 0 250 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="dual-graphic-svg">
                <defs>
                  <filter id="sellerDropShadow" x="-20%" y="-20%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#7C3AED" floodOpacity="0.14" />
                  </filter>
                  <filter id="sellerBadgeGlow" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.18" />
                  </filter>
                  <linearGradient id="purpleCubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6D28D9" />
                  </linearGradient>
                </defs>

                {/* Curved dotted guide line */}
                <path
                  d="M 50 170 C 25 140, 20 90, 60 65 C 100 35, 175 35, 215 70"
                  stroke="#C4B5FD"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.75"
                />

                {/* Main 3D Product Listing Window */}
                <g filter="url(#sellerDropShadow)" transform="rotate(-3 120 120)">
                  <rect x="30" y="32" width="155" height="148" rx="10" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="1.5" />
                  
                  {/* Top Bar with 3 traffic dots */}
                  <path d="M 30 40 C 30 35.6 33.6 32 38 32 L 180 32 C 184.4 32 188 35.6 188 40 L 188 46 L 30 46 Z" fill="#FAF5FF" />
                  <circle cx="39" cy="39" r="2.3" fill="#C4B5FD" />
                  <circle cx="46" cy="39" r="2.3" fill="#C4B5FD" />
                  <circle cx="53" cy="39" r="2.3" fill="#C4B5FD" />

                  {/* 3D Cube Icon Squircle Badge inside card */}
                  <rect x="42" y="56" width="34" height="34" rx="8" fill="url(#purpleCubeGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 3D Cube lines */}
                  <path d="M 59 63 L 68 67 L 59 71 L 50 67 Z" fill="#FFFFFF" opacity="0.95" />
                  <path d="M 50 67 L 59 71 V 80 L 50 76 Z" fill="#DDD6FE" />
                  <path d="M 68 67 L 59 71 V 80 L 68 76 Z" fill="#EDE9FE" />

                  {/* Header Title Placeholder Lines */}
                  <rect x="84" y="60" width="80" height="5" rx="2.5" fill="#8B5CF6" opacity="0.8" />
                  <rect x="84" y="70" width="55" height="4" rx="2" fill="#E2E8F0" />

                  {/* 5 Gold Stars */}
                  <g fill="#F59E0B">
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(-48 -58)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(-36 -58)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(-24 -58)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(-12 -58)" />
                    <polygon points="168,172 169.5,175.5 173.5,175.8 170.5,178.5 171.5,182.5 168,180.5 164.5,182.5 165.5,178.5 162.5,175.8 166.5,175.5" transform="scale(0.8) translate(0 -58)" />
                  </g>

                  {/* Content Preview Horizontal Bars */}
                  <rect x="42" y="102" width="130" height="5" rx="2.5" fill="#E2E8F0" />
                  <rect x="42" y="113" width="115" height="5" rx="2.5" fill="#F1F5F9" />
                  <rect x="42" y="124" width="95" height="5" rx="2.5" fill="#F1F5F9" />
                  <rect x="42" y="135" width="120" height="5" rx="2.5" fill="#E2E8F0" />
                  <rect x="42" y="146" width="70" height="5" rx="2.5" fill="#F1F5F9" />
                </g>

                {/* Floating Badge 1 (Top Right): Upward Trend Graph with Arrow */}
                <g filter="url(#sellerBadgeGlow)">
                  <rect x="175" y="14" width="48" height="48" rx="9" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.5" />
                  {/* Rising Bars */}
                  <rect x="187" y="44" width="4" height="8" rx="1" fill="#DDD6FE" />
                  <rect x="194" y="38" width="4" height="14" rx="1" fill="#C4B5FD" />
                  <rect x="201" y="32" width="4" height="20" rx="1" fill="#A78BFA" />
                  <rect x="208" y="26" width="4" height="26" rx="1" fill="#8B5CF6" />
                  {/* Upward Trend Line with Arrow */}
                  <polyline points="186 38 193 33 200 27 209 19" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <polyline points="204 19 209 19 209 24" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>

                {/* Floating Badge 2 (Left): 2-Users Team Squircle */}
                <g filter="url(#sellerBadgeGlow)">
                  <rect x="16" y="98" width="36" height="36" rx="8" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.5" />
                  <svg x="23" y="105" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </g>

                {/* Floating Badge 3 (Bottom Left): Launching Rocket Squircle */}
                <g filter="url(#sellerBadgeGlow)">
                  <rect x="35" y="162" width="38" height="38" rx="8" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.5" />
                  <svg x="43" y="170" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                </g>

                {/* Floating Badge 4 (Bottom Right): Launching Rocket Squircle */}
                <g filter="url(#sellerBadgeGlow)">
                  <rect x="180" y="148" width="38" height="38" rx="8" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.5" />
                  <svg x="188" y="156" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
