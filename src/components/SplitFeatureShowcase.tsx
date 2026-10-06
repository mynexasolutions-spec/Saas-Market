"use client";

import React from "react";
import Image from "next/image";

interface SplitFeatureShowcaseProps {
  onExplore?: () => void;
}

export default function SplitFeatureShowcase({ onExplore }: SplitFeatureShowcaseProps) {
  return (
    <section className="split-showcase-section" id="enterprise-showcase" aria-label="Enterprise SaaS Feature">
      <div className="container">
        <div className="split-showcase-card">
          {/* Left Column: Image with floating badge */}
          <div className="split-showcase-visual">
            <div className="split-image-frame">
              <Image
                src="/images/enterprise-growth-feature.jpg"
                alt="Tech professional monitoring enterprise SaaS dashboard with growth analytics on tablet and workstation"
                width={800}
                height={600}
                className="split-showcase-img"
                priority={false}
              />
              <div className="split-floating-pill">
                <span className="pill-dot"></span>
                <span className="pill-text">Live Enterprise Intelligence • 99.98% Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="split-showcase-content">
            <div className="split-showcase-badge">ENTERPRISE SOLUTIONS</div>
            
            <h2 className="split-showcase-title">
              Transform Your Workflow with Verified SaaS Ecosystems
            </h2>
            
            <p className="split-showcase-desc">
              Scale your business with vetted, high-performing software built for speed, ironclad data security, and seamless team adoption. Gain real-time visibility into your critical operations with software you can rely on.
            </p>

            <div className="split-features-list">
              <div className="split-feature-item">
                <div className="split-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div>
                  <h4 className="split-feature-heading">Verified Security & SOC-2 Compliance</h4>
                  <p className="split-feature-sub">Every platform listed is benchmarked for data protection, encryption, and reliability.</p>
                </div>
              </div>

              <div className="split-feature-item">
                <div className="split-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="split-feature-heading">Seamless Multi-App Integrations</h4>
                  <p className="split-feature-sub">Plug directly into your existing CRM, financial systems, and communication stacks in minutes.</p>
                </div>
              </div>

              <div className="split-feature-item">
                <div className="split-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h4 className="split-feature-heading">Direct Builder Access & 24/7 SLA</h4>
                  <p className="split-feature-sub">Get direct access to engineering teams and priority onboarding for worry-free growth.</p>
                </div>
              </div>
            </div>

            <div className="split-action-row">
              <button 
                type="button" 
                className="btn-primary split-cta-btn"
                onClick={onExplore}
                id="btn-split-explore"
              >
                <span>Explore Enterprise Catalog</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <div className="split-stat-capsule">
                <span className="capsule-num">1,400+</span>
                <span className="capsule-label">Teams Scaled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
