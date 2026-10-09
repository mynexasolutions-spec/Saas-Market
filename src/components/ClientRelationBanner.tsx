"use client";

import React from "react";
import Image from "next/image";

export default function ClientRelationBanner() {
  return (
    <section className="client-relation-section" id="partnership-showcase" aria-label="SaaS & Client Partnership">
      <div className="container">
        <div className="client-relation-card">
          {/* Left Column: About Work Paragraphs & Features */}
          <div className="client-relation-content">
            <div className="client-relation-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              COLLABORATIVE SUCCESS
            </div>

            <h2 className="client-relation-title">
              Built Together, Scaled for Growth
            </h2>

            <p className="client-relation-lead">
              Every software solution on SaaS MRKT brings direct collaboration between your team and verified builders to guarantee successful onboarding and lasting impact.
            </p>

            <div className="client-relation-work-grid">
              <div className="client-relation-work-item">
                <div className="client-relation-icon-box" style={{ background: "rgba(94, 75, 238, 0.1)", color: "var(--primary)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="client-relation-text-group">
                  <h3 className="client-relation-heading">Dedicated Builder Alignment</h3>
                  <p className="client-relation-desc">Work directly with founding engineers and core developers during onboarding to configure optimal architecture.</p>
                </div>
              </div>

              <div className="client-relation-work-item">
                <div className="client-relation-icon-box" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="client-relation-text-group">
                  <h3 className="client-relation-heading">Tailored Team Integrations</h3>
                  <p className="client-relation-desc">Get fast-track custom webhooks, SSO configurations, and API keys suited directly to your operational workflows.</p>
                </div>
              </div>

              <div className="client-relation-work-item">
                <div className="client-relation-icon-box" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div className="client-relation-text-group">
                  <h3 className="client-relation-heading">Measurable Ongoing Impact</h3>
                  <p className="client-relation-desc">Continuous feedback loops and transparent progress tracking keep your software ROI clear from day one.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="client-relation-visual">
            <div className="client-relation-image-wrapper">
              <Image
                src="/images/saas-client-work-session.jpg"
                alt="SaaS specialist and client actively collaborating in front of an ultrawide monitor analyzing cloud metrics and workflow dashboards"
                width={1200}
                height={900}
                className="client-relation-image"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
