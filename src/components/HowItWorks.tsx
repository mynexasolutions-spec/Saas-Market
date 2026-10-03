import React from "react";

const STEPS = [
  {
    step: "01",
    title: "Explore Products",
    desc: "Browse and compare SaaS tools across categories.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Review & Compare",
    desc: "Check features, pricing and user reviews.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Buy & Start Using",
    desc: "Purchase and get instant access to the product.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        {/* Header */}
        <div className="how-header">
          <div className="section-badge" id="how-it-works-badge">
            SIMPLE & EASY PROCESS
          </div>
          <h2 className="section-title">
            How <span className="section-title-highlight">SaaS MRKT</span> Works
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
                  <span className="step-badge-num">{s.step}</span>
                  <div className="step-icon-inner">{s.icon}</div>
                </div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>

              {/* Connecting Dotted Arrow between steps */}
              {index < STEPS.length - 1 && (
                <div className={`step-connector step-connector-${index + 1}`} aria-hidden="true">
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="6" x2="32" y2="6" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="3 3" />
                    <polyline points="28,2 34,6 28,10" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

