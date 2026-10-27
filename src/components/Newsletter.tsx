"use client";

import React from "react";

interface NewsletterProps {
  onSubscribe?: (email: string) => void;
}

export default function Newsletter({ onSubscribe }: NewsletterProps) {
  return (
    <section className="newsletter-section" id="newsletter" aria-label="Platform Promise">
      <div className="container">
        <div className="newsletter-box">
          {/* Ambient luminous glow backgrounds */}
          <div className="newsletter-ambient-glow-left" aria-hidden="true" />
          <div className="newsletter-ambient-glow-center" aria-hidden="true" />
          <div className="newsletter-ambient-glow-purple" aria-hidden="true" />
          <div className="newsletter-ambient-glow-emerald" aria-hidden="true" />
          <div className="newsletter-ambient-glow-amber" aria-hidden="true" />
          <div className="newsletter-grid-dots" aria-hidden="true" />

          {/* LEFT COLUMN: Badge, Title, Subtitle, Stats */}
          <div className="newsletter-left">
            <div className="newsletter-badge">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="newsletter-badge-sparkle"
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              <span>PLATFORM PROMISE</span>
            </div>

            <h2 className="newsletter-title">
              Built for Modern<br className="newsletter-title-br" />{" "}
              Teams <span className="newsletter-title-gradient">Scaling Faster</span>
            </h2>

            <p className="newsletter-subtitle">
              Discover, compare, and deploy verified SaaS products with full transparency and zero hidden fees.
            </p>

            {/* Bottom 3 Stats Counters */}
            <div className="newsletter-stats-row">
              {/* Stat 1: 500+ Verified Products */}
              <div className="newsletter-stat-item">
                <div className="newsletter-stat-icon stat-icon-purple">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="newsletter-stat-text">
                  <span className="newsletter-stat-num">500+</span>
                  <span className="newsletter-stat-label">Verified Products</span>
                </div>
              </div>

              {/* Stat 2: 10K+ Active Buyers */}
              <div className="newsletter-stat-item">
                <div className="newsletter-stat-icon stat-icon-emerald">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="newsletter-stat-text">
                  <span className="newsletter-stat-num">10K+</span>
                  <span className="newsletter-stat-label">Active Buyers</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: 3D Visual - Dashboard Tablet, Pedestal & Glowing Shield */}
          <div className="newsletter-center-visual" aria-hidden="true">
            <svg
              className="newsletter-3d-svg"
              width="320"
              height="280"
              viewBox="0 0 320 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glowing neon filters */}
                <filter id="neonCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur1" />
                  <feGaussianBlur stdDeviation="12" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="greenBadgeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#10B981" floodOpacity="0.85" />
                </filter>

                <filter id="shield3dGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0284C7" floodOpacity="0.7" />
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38BDF8" floodOpacity="0.9" />
                </filter>

                {/* Pedestal Gradients */}
                <linearGradient id="pedestalSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#151D38" />
                  <stop offset="100%" stopColor="#090E1D" />
                </linearGradient>

                <linearGradient id="pedestalTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E294B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>

                {/* Tablet Gradients */}
                <linearGradient id="tabletBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#0B1329" stopOpacity="0.98" />
                </linearGradient>

                <linearGradient id="tabletBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.6" />
                </linearGradient>

                {/* Cloud Icon Gradient */}
                <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>

                {/* Chart Line Gradient */}
                <linearGradient id="chartLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="60%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>

                {/* 3D Shield Gradients */}
                <linearGradient id="shieldGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                  <stop offset="45%" stopColor="#2563EB" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="shieldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#67E8F9" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Concentric light orbital rings floating around the podium */}
              <ellipse
                cx="160"
                cy="216"
                rx="112"
                ry="27"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeOpacity="0.5"
                strokeDasharray="4 5"
              />
              <ellipse
                cx="160"
                cy="223"
                rx="136"
                ry="33"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="0.8"
                strokeOpacity="0.35"
              />

              {/* Pedestal Cylinder */}
              {/* Lower side extrusion */}
              <path
                d="M 64 212 C 64 238, 256 238, 256 212 L 256 234 C 256 260, 64 260, 64 234 Z"
                fill="url(#pedestalSideGrad)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              {/* Top ellipse surface with glowing cyan rim */}
              <ellipse
                cx="160"
                cy="212"
                rx="96"
                ry="25"
                fill="url(#pedestalTopGrad)"
                stroke="#38BDF8"
                strokeWidth="2.2"
                filter="url(#neonCyanGlow)"
              />
              {/* Inner glowing stage circle */}
              <ellipse
                cx="160"
                cy="212"
                rx="76"
                ry="19"
                fill="none"
                stroke="rgba(96,165,250,0.5)"
                strokeWidth="1.5"
              />

              {/* 3D Dashboard Tablet (Slightly angled/elevated) */}
              <rect
                x="82"
                y="62"
                width="156"
                height="116"
                rx="12"
                fill="url(#tabletBodyGrad)"
                stroke="url(#tabletBorderGrad)"
                strokeWidth="1.5"
              />

              {/* Tablet Top Window Bar */}
              <rect
                x="82"
                y="62"
                width="156"
                height="22"
                rx="12"
                fill="rgba(255,255,255,0.05)"
              />
              <circle cx="95" cy="73" r="2.5" fill="#EF4444" opacity="0.8" />
              <circle cx="103" cy="73" r="2.5" fill="#F59E0B" opacity="0.8" />
              <circle cx="111" cy="73" r="2.5" fill="#10B981" opacity="0.8" />

              {/* Inside Tablet: Cloud Graphic on Left */}
              <g transform="translate(95, 96)">
                <path
                  d="M19 16.5A5.5 5.5 0 0 0 16.5 6 7 7 0 0 0 4 10a5 5 0 0 0 1 10h14a4 4 0 0 0 0-8z"
                  fill="url(#cloudGrad)"
                  opacity="0.95"
                />
              </g>

              {/* Inside Tablet: Upward Chart Line & Points */}
              <path
                d="M 148 128 Q 166 122, 180 108 T 214 94"
                fill="none"
                stroke="url(#chartLineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="214" cy="94" r="3" fill="#38BDF8" filter="url(#neonCyanGlow)" />
              <circle cx="180" cy="108" r="2" fill="#60A5FA" />
              <circle cx="148" cy="128" r="2" fill="#818CF8" />

              {/* Inside Tablet: Rising Bar Chart Columns */}
              <rect x="150" y="132" width="6.5" height="18" rx="2" fill="#4F46E5" opacity="0.85" />
              <rect x="162" y="124" width="6.5" height="26" rx="2" fill="#6366F1" opacity="0.9" />
              <rect x="174" y="115" width="6.5" height="35" rx="2" fill="#818CF8" />
              <rect x="186" y="105" width="6.5" height="45" rx="2" fill="#38BDF8" />
              <rect x="198" y="112" width="6.5" height="38" rx="2" fill="#60A5FA" />

              {/* Floating Badge 1 (Top-Right): Glowing Green Circle with White Check */}
              <g transform="translate(232, 68)" filter="url(#greenBadgeGlow)">
                <circle cx="0" cy="0" r="14" fill="#10B981" />
                <polyline
                  points="-5 0 -1 4 6 -4"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Floating Badge 2 (Middle-Right): Frosted Glass Analytics Tile */}
              <g transform="translate(232, 108)">
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="36"
                  rx="9"
                  fill="rgba(24, 33, 56, 0.9)"
                  stroke="rgba(96, 165, 250, 0.5)"
                  strokeWidth="1.2"
                />
                <rect x="8" y="19" width="4.5" height="10" rx="1.5" fill="#38BDF8" />
                <rect x="16" y="13" width="4.5" height="16" rx="1.5" fill="#60A5FA" />
                <rect x="24" y="8" width="4.5" height="21" rx="1.5" fill="#818CF8" />
              </g>

              {/* Floating Badge 3 (Bottom-Left): Frosted Glass User Group Tile */}
              <g transform="translate(56, 142)">
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="36"
                  rx="9"
                  fill="rgba(24, 33, 56, 0.9)"
                  stroke="rgba(96, 165, 250, 0.5)"
                  strokeWidth="1.2"
                />
                <circle cx="18" cy="13" r="4.5" fill="#38BDF8" />
                <path
                  d="M 10 26 C 10 22, 14 20, 18 20 C 22 20, 26 22, 26 26 Z"
                  fill="#38BDF8"
                />
              </g>

              {/* FOREGROUND HERO: 3D Translucent Glass Shield with Neon Cyan Edge */}
              <g filter="url(#shield3dGlow)">
                {/* Shield Body */}
                <path
                  d="M 160 142 C 185 142, 198 153, 198 180 C 198 208, 172 228, 160 234 C 148 228, 122 208, 122 180 C 122 153, 135 142, 160 142 Z"
                  fill="url(#shieldGlassGrad)"
                  stroke="url(#shieldBorderGrad)"
                  strokeWidth="3.2"
                />

                {/* Inner Bevel Border */}
                <path
                  d="M 160 146 C 182 146, 193 156, 193 180 C 193 205, 170 223, 160 229 C 150 223, 127 205, 127 180 C 127 156, 138 146, 160 146 Z"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeWidth="1"
                />

                {/* Top-Left Specular Reflection Sheen */}
                <path
                  d="M 132 154 C 144 148, 158 148, 160 148 C 145 160, 136 178, 134 195 C 130 188, 128 178, 128 174 C 128 162, 130 156, 132 154 Z"
                  fill="rgba(255, 255, 255, 0.42)"
                />

                {/* Big Glowing Center Checkmark */}
                <polyline
                  points="146 186 156 195 174 174"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>

          {/* RIGHT COLUMN: 3 Frosted Glass Feature Cards Stack */}
          <div className="newsletter-right">
            <div className="newsletter-feature-cards">
              {/* Card 1: Verified Vendors & Security (Purple Glow) */}
              <div className="newsletter-feature-card feature-card-purple">
                <div className="newsletter-feature-icon-box icon-purple">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="newsletter-feature-content">
                  <h4 className="newsletter-feature-head">Verified Vendors &amp; Security</h4>
                  <p className="newsletter-feature-body">
                    Every product passes strict performance, SLA, and security checks before listing.
                  </p>
                </div>
              </div>

              {/* Card 2: Exclusive Direct Deals (Emerald Glow) */}
              <div className="newsletter-feature-card feature-card-emerald">
                <div className="newsletter-feature-icon-box icon-emerald">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" rx="1" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                </div>
                <div className="newsletter-feature-content">
                  <h4 className="newsletter-feature-head">Exclusive Direct Deals</h4>
                  <p className="newsletter-feature-body">
                    Access special founder discounts and flexible tier upgrades directly from creators.
                  </p>
                </div>
              </div>

              {/* Card 3: Zero Spam, Zero Lock-In (Amber Glow) */}
              <div className="newsletter-feature-card feature-card-amber">
                <div className="newsletter-feature-icon-box icon-amber">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="newsletter-feature-content">
                  <h4 className="newsletter-feature-head">Zero Spam, Zero Lock-In</h4>
                  <p className="newsletter-feature-body">
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
