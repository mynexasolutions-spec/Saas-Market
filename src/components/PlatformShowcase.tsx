"use client";

import React from "react";
import Image from "next/image";

export default function PlatformShowcase() {
  return (
    <section className="platform-showcase-section" id="platform-showcase" aria-label="About Our Work Platform">
      {/* 3D Atmospheric Background */}
      <div className="platform-bg" aria-hidden="true">
        <svg
          className="platform-bg-waves"
          viewBox="0 0 1440 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="platWaveLeft" x1="0%" y1="0%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="45%" stopColor="#c4b5fd" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ede9fe" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="platWaveRight" x1="100%" y1="20%" x2="30%" y2="80%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-50 -20 C 120 40, 240 240, 160 480 C 100 660, -20 740, -50 820 L -100 820 L -100 -20 Z"
            fill="url(#platWaveLeft)"
          />
          <path
            d="M1490 60 C 1320 180, 1260 360, 1340 560 C 1410 720, 1470 780, 1500 840 L 1520 840 L 1520 60 Z"
            fill="url(#platWaveRight)"
          />
        </svg>

        {/* 3D Glossy Spheres */}
        <div className="platform-sphere platform-sphere-1" />
        <div className="platform-sphere platform-sphere-2" />

        {/* Ambient Blur Orbs */}
        <span className="platform-orb platform-orb-1" />
        <span className="platform-orb platform-orb-2" />
      </div>

      <div className="container platform-inner">
        <div className="platform-showcase-card">
          {/* Left Column: Visual with S-curve Wave Divider & Dot Grids */}
          <div className="platform-showcase-visual">
            <div className="platform-visual-dots platform-visual-dots-tl" aria-hidden="true" />
            <div className="platform-visual-dots platform-visual-dots-tr" aria-hidden="true" />

            <div className="platform-showcase-image-wrapper">
              <Image
                src="/images/laptop-handover.jpg"
                alt="Person handing over a laptop showing the SaaS MRKT dashboard to a client"
                width={1200}
                height={900}
                className="platform-showcase-image"
                priority={false}
              />
            </div>

            {/* S-curve wave divider transitioning into right content */}
            <svg
              className="platform-visual-wave"
              viewBox="0 0 120 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M32 0 C 88 180, -5 400, 78 580 C 112 670, 120 800, 120 800 L 120 0 Z"
                fill="#ddd6fe"
                fillOpacity="0.4"
              />
              <path
                d="M52 0 C 102 180, 12 400, 92 580 C 116 670, 120 800, 120 800 L 120 0 Z"
                fill="#ffffff"
              />
            </svg>
          </div>

          {/* Right Column: About Work Content */}
          <div className="platform-showcase-content">
            <div className="platform-content-dots" aria-hidden="true" />

            <div className="platform-work-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              ABOUT OUR WORK
            </div>

            <h2 className="platform-work-title">
              How We Work to Connect{" "}
              <span className="section-title-accent">Builders &amp; Buyers</span>
            </h2>

            <p className="platform-work-lead">
              We eliminate procurement hurdles and lengthy sales friction. Experience live product workflows, explore verified vendor environments, and transition smoothly into production.
            </p>

            <div className="platform-work-grid">
              <div className="platform-work-item">
                <div className="platform-work-icon-box platform-icon-sandboxes">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                </div>
                <div className="platform-work-text-group">
                  <h3 className="platform-work-heading">Test in Live Sandboxes</h3>
                  <p className="platform-work-desc">Interact with pre-configured demo workspaces before committing. No sales demos required.</p>
                </div>
              </div>

              <div className="platform-work-item">
                <div className="platform-work-icon-box platform-icon-handoff">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="platform-work-text-group">
                  <h3 className="platform-work-heading">Direct Developer Handoff</h3>
                  <p className="platform-work-desc">Direct line to product engineering teams for custom onboarding, API keys, and deployment support.</p>
                </div>
              </div>

              <div className="platform-work-item">
                <div className="platform-work-icon-box platform-icon-security">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="platform-work-text-group">
                  <h3 className="platform-work-heading">Verified Quality &amp; Security</h3>
                  <p className="platform-work-desc">Every tool is audited for uptime, security posture, and authentic buyer ratings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
