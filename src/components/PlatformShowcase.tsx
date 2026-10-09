"use client";

import React from "react";
import Image from "next/image";

export default function PlatformShowcase() {
  return (
    <section className="platform-showcase-section" id="platform-showcase" aria-label="About Our Work Platform">
      <div className="container">
        <div className="platform-showcase-card">
          {/* Left Column: Image */}
          <div className="platform-showcase-visual">
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
          </div>

          {/* Right Column: About Work */}
          <div className="platform-showcase-content">
            <div className="platform-work-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              ABOUT OUR WORK
            </div>

            <h2 className="platform-work-title">
              How We Work to Connect Builders &amp; Buyers
            </h2>

            <p className="platform-work-lead">
              We eliminate procurement hurdles and lengthy sales friction. Experience live product workflows, explore verified vendor environments, and transition smoothly into production.
            </p>

            <div className="platform-work-grid">
              <div className="platform-work-item">
                <div className="platform-work-icon-box" style={{ background: "rgba(94, 75, 238, 0.1)", color: "var(--primary)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="platform-work-text-group">
                  <h3 className="platform-work-heading">Test in Live Sandboxes</h3>
                  <p className="platform-work-desc">Interact with pre-configured demo workspaces before committing. No sales demos required.</p>
                </div>
              </div>

              <div className="platform-work-item">
                <div className="platform-work-icon-box" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                </div>
                <div className="platform-work-text-group">
                  <h3 className="platform-work-heading">Direct Developer Handoff</h3>
                  <p className="platform-work-desc">Direct line to product engineering teams for custom onboarding, API keys, and deployment support.</p>
                </div>
              </div>

              <div className="platform-work-item">
                <div className="platform-work-icon-box" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
