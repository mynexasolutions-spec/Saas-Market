import React from "react";

const STEPS = [
  {
    step: "01",
    title: "Explore Products",
    desc: "Browse and compare SaaS tools across categories.",
    arcColor: "#8b5cf6",
    icon: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7.5" />
        <line x1="21" y1="21" x2="16.5" y2="16.5" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Review & Compare",
    desc: "Check features, pricing and user reviews.",
    arcColor: "#0ea5e9", // Sky-blue / cyan orbital arc
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Buy & Start Using",
    desc: "Purchase and get instant access to the product.",
    arcColor: "#a855f7", // Magenta / violet orbital arc
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1.5" fill="#7c3aed" />
        <circle cx="20" cy="21" r="1.5" fill="#7c3aed" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works-section" id="how-it-works">
      {/* Atmospheric Background with Fluid Waves & Dot Grids matching reference */}
      <div className="how-bg" aria-hidden="true">
        <svg
          className="how-bg-waves"
          viewBox="0 0 1440 760"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="howWaveLeft1" x1="0%" y1="0%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="howWaveLeft2" x1="0%" y1="20%" x2="70%" y2="70%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="howWaveRight1" x1="100%" y1="100%" x2="20%" y2="20%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="howWaveRight2" x1="100%" y1="80%" x2="30%" y2="30%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-50 -40 C 140 40, 240 220, 180 440 C 120 620, -10 740, -50 820 L -90 820 L -90 -40 Z"
            fill="url(#howWaveLeft1)"
          />
          <path
            d="M-50 60 C 90 140, 160 280, 120 460 C 80 600, -10 680, -50 780 L -70 780 L -70 60 Z"
            fill="url(#howWaveLeft2)"
          />
          <path
            d="M1490 820 C 1300 740, 1200 540, 1260 320 C 1320 140, 1420 40, 1490 -40 L 1530 -40 L 1530 820 Z"
            fill="url(#howWaveRight1)"
          />
          <path
            d="M1490 720 C 1340 620, 1260 460, 1310 280 C 1350 140, 1430 60, 1490 0 L 1510 0 L 1510 720 Z"
            fill="url(#howWaveRight2)"
          />
        </svg>

        {/* Dot matrix grids matching the reference image */}
        <div className="how-dots how-dots-tl" />
        <div className="how-dots how-dots-bl" />
        <div className="how-dots how-dots-tr" />
        <div className="how-dots how-dots-br" />

        {/* Ambient background glow */}
        <div className="how-glow how-glow-left" />
        <div className="how-glow how-glow-right" />
      </div>

      <div className="container how-inner">
        {/* Header */}
        <div className="how-header">
          <div className="section-badge how-badge" id="how-it-works-badge">
            <span className="how-badge-dot" />
            SIMPLE &amp; EASY PROCESS
            <span className="how-badge-dot" />
          </div>
          <h2 className="section-title">
            How <span className="section-title-highlight section-title-accent">SaaS MRKT</span> Works
          </h2>
          <p className="section-subtitle">
            A simple way to discover, compare and buy the right SaaS products.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="how-steps-flow">
          {STEPS.map((s, index) => (
            <React.Fragment key={s.step}>
              <div className="how-step-card" id={`how-step-${s.step}`}>
                <div className="step-icon-container">
                  {/* Right-side accent orbital arc */}
                  <svg className="step-orbit-arc" viewBox="0 0 160 160" aria-hidden="true">
                    <path
                      d="M 144 40 A 75 75 0 0 1 126 138"
                      fill="none"
                      stroke={s.arcColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Top-left step number badge */}
                  <span className="step-badge-num">{s.step}</span>

                  {/* Centered Step Icon */}
                  <div className="step-icon-inner">{s.icon}</div>
                </div>

                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>

              {/* Connecting Dashed Arrow with Chevron Disc between steps */}
              {index < STEPS.length - 1 && (
                <>
                  <div className={`step-connector-desktop how-connector-desktop step-connector-${index + 1}`} aria-hidden="true">
                    <svg width="116" height="36" viewBox="0 0 116 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="2" y1="18" x2="42" y2="18" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="58" cy="18" r="14" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.5" />
                      <polyline points="56 14 60 18 56 22" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="74" y1="18" x2="108" y2="18" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="3 3" />
                      <polyline points="104 14 110 18 104 22" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="step-connector-mobile how-connector-mobile" aria-hidden="true">
                    <svg width="36" height="68" viewBox="0 0 36 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="2" x2="18" y2="18" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="18" cy="34" r="14" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.5" />
                      <polyline points="14 32 18 36 22 32" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="18" y1="50" x2="18" y2="62" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="3 3" />
                      <polyline points="14 58 18 64 22 58" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
