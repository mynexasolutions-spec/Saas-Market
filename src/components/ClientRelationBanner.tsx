"use client";

import React from "react";
import Image from "next/image";

export default function ClientRelationBanner() {
  return (
    <section className="client-relation-section" id="partnership-showcase" aria-label="SaaS & Client Partnership">
      {/* 3D Atmospheric Background */}
      <div className="client-relation-bg" aria-hidden="true">
        <svg
          className="client-relation-bg-waves"
          viewBox="0 0 1440 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="crWaveLeft" x1="0%" y1="0%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ede9fe" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="crWaveRight" x1="100%" y1="20%" x2="30%" y2="80%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-50 -20 C 120 40, 240 240, 160 480 C 100 660, -20 740, -50 820 L -100 820 L -100 -20 Z"
            fill="url(#crWaveLeft)"
          />
          <path
            d="M1490 60 C 1320 180, 1260 360, 1340 560 C 1410 720, 1470 780, 1500 840 L 1520 840 L 1520 60 Z"
            fill="url(#crWaveRight)"
          />
        </svg>

        {/* Ambient background blur orbs */}
        <span className="client-relation-orb client-relation-orb-1" />
        <span className="client-relation-orb client-relation-orb-2" />
      </div>

      <div className="container client-relation-inner">
        <div className="client-relation-card">
          {/* Left Column: Content */}
          <div className="client-relation-content">
            <div className="client-relation-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              COLLABORATIVE SUCCESS
            </div>

            <h2 className="client-relation-title">
              Built Together, <span className="client-relation-title-highlight">Scaled for Growth</span>
            </h2>

            <p className="client-relation-lead">
              Every software solution on SaaS MRKT brings direct collaboration between your team and verified builders to guarantee successful onboarding and lasting impact.
            </p>

            <div className="client-relation-work-grid">
              <div className="client-relation-work-item">
                <div className="client-relation-icon-box cr-icon-purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="client-relation-icon-box cr-icon-green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="client-relation-icon-box cr-icon-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Dot matrix grid in bottom right of left side */}
            <div className="client-relation-dots" aria-hidden="true" />
          </div>

          {/* Right Column: Visual with S-curve Wave Divider & Floating Badges */}
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

            {/* S-curve wave divider transitioning from left into photo */}
            <svg
              className="client-relation-divider-wave"
              viewBox="0 0 100 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Soft purple accent wave ribbon */}
              <path
                d="M 0 0 C 50 40, 95 160, 40 320 C -15 480, 60 660, 25 800 L 0 800 Z"
                fill="#DDD6FE"
                fillOpacity="0.45"
              />
              {/* Main solid white wave dividing content from photo */}
              <path
                d="M 0 0 C 35 30, 75 140, 25 300 C -25 460, 45 640, 12 800 L 0 800 Z"
                fill="#FFFFFF"
              />
            </svg>

            {/* Top-right subtle wave accent on photo */}
            <svg
              className="client-relation-top-wave"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M 200 0 C 130 0, 70 50, 40 160 C 120 120, 170 80, 200 0 Z"
                fill="url(#crTopWaveGrad)"
                opacity="0.35"
              />
              <defs>
                <linearGradient id="crTopWaveGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C4B5FD" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating 3D Squircle Badge with Bar Chart + Trend Icon */}
            <div className="client-relation-floating-chart-badge" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="20" x2="6" y2="15" />
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="6" />
                <polyline points="4 12 10 7 15 11 20 5" />
                <polyline points="16 5 20 5 20 9" />
              </svg>
            </div>

            {/* Floating Team Collaboration Card */}
            <div className="client-relation-collab-card">
              <span className="collab-card-title">Team Collaboration</span>
              <div className="collab-card-content">
                <div className="collab-avatars">
                  <Image src="/images/avatars/alex.jpg" alt="Alex" width={30} height={30} className="collab-avatar" />
                  <Image src="/images/avatars/david.jpg" alt="David" width={30} height={30} className="collab-avatar" />
                  <Image src="/images/avatars/sarah.jpg" alt="Sarah" width={30} height={30} className="collab-avatar" />
                </div>
                <div className="collab-live-badge">
                  <span className="collab-live-dot" />
                  Live
                </div>
              </div>
            </div>

            {/* Bottom-right corner wave accent */}
            <div className="client-relation-corner-wave" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
