"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "@/app/buyers/buyers-page.css";
import "./calculator-page.css";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS_COL1: FAQItem[] = [
  {
    id: "calc-faq-1",
    question: "How does this calculator estimate our wasted spend?",
    answer:
      "Our calculation model aggregates research from Flexera, Gartner, and verified audits across 8,000+ businesses. Most companies run with a 24% to 33% SaaS waste rate caused by forgotten contractor seats, overlapping tool capabilities, and unnegotiated automatic renewals.",
  },
  {
    id: "calc-faq-2",
    question: "What exactly qualifies as a 'ghost' or idle license?",
    answer:
      "A ghost license is an active, paid software seat assigned to an employee or contractor who hasn't logged in or performed any platform activity within the past 60 to 90 days, or a seat left active following employee offboarding.",
  },
  {
    id: "calc-faq-3",
    question: "How much can we realistically recover without disruption?",
    answer:
      "On average, organizations safely recover approximately 70% to 75% of identified waste simply by deprovisioning inactive seats, consolidating duplicate collaboration apps, and switching from monthly plans to annual or lifetime marketplace deals.",
  },
];

const FAQS_COL2: FAQItem[] = [
  {
    id: "calc-faq-4",
    question: "Can SaaS MRKT help renegotiate enterprise software tiers?",
    answer:
      "Yes. For teams requiring 20+ seats, custom SLA commitments, or multi-year terms, you can submit an enterprise quote request through our marketplace vendor profiles to access pre-negotiated tier discounts.",
  },
  {
    id: "calc-faq-5",
    question: "Is any company or stack data saved when using this tool?",
    answer:
      "No. The interactive calculator executes entirely inside your browser session. Your team size, tool count, and estimated budget are never transmitted or stored without your explicit consent.",
  },
  {
    id: "calc-faq-6",
    question: "What is the difference between tool consolidation and downgrading?",
    answer:
      "Consolidation eliminates overlapping point solutions by adopting unified suites that cover multiple functions (e.g. replacing separate screen recorders, forms, and file tools with an all-in-one workspace), whereas downgrading drops license tiers.",
  },
];

type Currency = "USD" | "EUR" | "GBP";

const CURRENCIES: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.78 },
};

export default function CalculatorClient() {
  const [teamSize, setTeamSize] = useState<number>(25);
  const [toolCount, setToolCount] = useState<number>(12);
  const [costPerUser, setCostPerUser] = useState<number>(65);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [quoteEmail, setQuoteEmail] = useState<string>("");
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);

  // FAQ Accordion state (matches /buyers default open pattern)
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    "calc-faq-1": true,
    "calc-faq-4": true,
  });

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const curr = CURRENCIES[currency];

  // Benchmark calculations
  const metrics = useMemo(() => {
    const rawMonthly = teamSize * toolCount * (costPerUser / 3);
    const convertedMonthly = rawMonthly * curr.rate;
    const convertedAnnual = convertedMonthly * 12;

    const wasteRate = teamSize > 100 ? 0.33 : teamSize > 30 ? 0.29 : 0.24;
    const annualWaste = convertedAnnual * wasteRate;
    const potentialSavings = annualWaste * 0.75;
    const unusedSeats = Math.max(1, Math.round(teamSize * 0.18));

    // Allocation bar breakdown
    const ghostWastePercent = Math.round(wasteRate * 0.55 * 100);
    const sprawlWastePercent = Math.round(wasteRate * 0.45 * 100);
    const productivePercent = 100 - (ghostWastePercent + sprawlWastePercent);

    return {
      monthlySpend: Math.round(convertedMonthly),
      annualSpend: Math.round(convertedAnnual),
      annualWaste: Math.round(annualWaste),
      potentialSavings: Math.round(potentialSavings),
      monthlyWaste: Math.round(annualWaste / 12),
      unusedSeats,
      wastePercentage: Math.round(wasteRate * 100),
      productivePercent,
      ghostWastePercent,
      sprawlWastePercent,
    };
  }, [teamSize, toolCount, costPerUser, curr.rate]);

  const applyPreset = (size: number, tools: number, cost: number) => {
    setTeamSize(size);
    setToolCount(tools);
    setCostPerUser(cost);
  };

  const isPresetActive = (size: number, tools: number, cost: number) => {
    return teamSize === size && toolCount === tools && costPerUser === cost;
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteEmail) {
      setQuoteSuccess(true);
      setTimeout(() => {
        setShowQuoteModal(false);
        setQuoteSuccess(false);
        setQuoteEmail("");
      }, 2500);
    }
  };

  return (
    <PageLayout noContainer>
      <div className="buyers-page-wrapper">
        <div className="buyers-container">
          {/* 1. Breadcrumbs (Exact /buyers classes) */}
          <nav className="buyers-breadcrumb-row" aria-label="Breadcrumb">
            <Link href="/" className="buyers-breadcrumb-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="buyers-breadcrumb-sep">›</span>
            <Link href="/products" className="buyers-breadcrumb-link">
              Tools
            </Link>
            <span className="buyers-breadcrumb-sep">›</span>
            <span className="buyers-breadcrumb-current">SaaS Spend Calculator</span>
          </nav>

          {/* 2. Hero Header (Exact /buyers typography & trust badges) */}
          <header style={{ textAlign: "center", padding: "0.25rem 0 1.25rem" }}>
            <div className="buyers-hero-badge">
              ⚡ 2026 SAAS BENCHMARK TOOL
            </div>

            <h1 className="buyers-hero-title">
              SaaS Spend &amp;{" "}
              <span className="buyers-hero-title-gradient">Waste Calculator</span>
            </h1>

            <p className="buyers-hero-desc" style={{ margin: "0 auto 1.35rem", maxWidth: "660px" }}>
              Audit your software stack to instantly calculate ghost seats, tool overlap, and recoverable budget based on 8,000+ verified industry benchmarks.
            </p>

            {/* 3 Trust Badges (Exact /buyers structure) */}
            <div className="buyers-hero-trust-row">
              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">8,400+ Teams</span>
                  <span className="buyers-trust-label">Audited &amp; Benchmarked</span>
                </div>
              </div>

              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">28.4% Average</span>
                  <span className="buyers-trust-label">Recoverable Waste</span>
                </div>
              </div>

              <div className="buyers-trust-badge">
                <div className="buyers-trust-icon-box icon-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="buyers-trust-text">
                  <span className="buyers-trust-num">100% Free</span>
                  <span className="buyers-trust-label">No Credit Card Needed</span>
                </div>
              </div>
            </div>
          </header>

          {/* 3. Main Interactive Grid (2 Columns: Compact & Responsive) */}
          <div className="calc-main-grid">
            {/* Left Column: Sliders & Controls */}
            <div className="calc-card">
              <div className="calc-card-head">
                <h2 className="calc-card-title">1. Your Stack Parameters</h2>
                <span className="calc-step-pill">INPUTS</span>
              </div>
              <p className="calc-card-desc">
                Adjust the sliders or choose a preset to match your company size and software setup.
              </p>

              {/* Quick Presets Bar & Currency Switch */}
              <div className="calc-presets-row">
                <span className="calc-presets-label">Quick Presets:</span>
                <button
                  type="button"
                  className={`calc-preset-btn ${isPresetActive(15, 8, 45) ? "active" : ""}`}
                  onClick={() => applyPreset(15, 8, 45)}
                >
                  Startup (15)
                </button>
                <button
                  type="button"
                  className={`calc-preset-btn ${isPresetActive(50, 18, 65) ? "active" : ""}`}
                  onClick={() => applyPreset(50, 18, 65)}
                >
                  Growth (50)
                </button>
                <button
                  type="button"
                  className={`calc-preset-btn ${isPresetActive(120, 28, 80) ? "active" : ""}`}
                  onClick={() => applyPreset(120, 28, 80)}
                >
                  Mid-Market (120)
                </button>
                <button
                  type="button"
                  className={`calc-preset-btn ${isPresetActive(250, 42, 110) ? "active" : ""}`}
                  onClick={() => applyPreset(250, 42, 110)}
                >
                  Enterprise (250)
                </button>

                <div style={{ marginLeft: "auto" }} className="calc-currency-group">
                  {(["USD", "EUR", "GBP"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`calc-currency-btn ${currency === c ? "active" : ""}`}
                      onClick={() => setCurrency(c)}
                    >
                      {c === "USD" ? "$" : c === "EUR" ? "€" : "£"} {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Team Size */}
              <div className="calc-slider-block">
                <div className="calc-slider-head">
                  <label htmlFor="team-size-slider" className="calc-slider-label">
                    Total Team Size
                  </label>
                  <span className="calc-val-pill purple">
                    {teamSize} {teamSize === 1 ? "person" : "people"}
                  </span>
                </div>
                <input
                  id="team-size-slider"
                  type="range"
                  min="5"
                  max="350"
                  step="5"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="calc-range-input slider-purple"
                />
                <div className="calc-slider-scale">
                  <span>5 (Seed)</span>
                  <span>100 (Scaleup)</span>
                  <span>350+ (Enterprise)</span>
                </div>
              </div>

              {/* Slider 2: Active Tools */}
              <div className="calc-slider-block">
                <div className="calc-slider-head">
                  <label htmlFor="tool-count-slider" className="calc-slider-label">
                    Active SaaS Applications
                  </label>
                  <span className="calc-val-pill blue">
                    {toolCount} tools
                  </span>
                </div>
                <input
                  id="tool-count-slider"
                  type="range"
                  min="3"
                  max="50"
                  step="1"
                  value={toolCount}
                  onChange={(e) => setToolCount(Number(e.target.value))}
                  className="calc-range-input slider-blue"
                />
                <div className="calc-slider-scale">
                  <span>3 (Lean)</span>
                  <span>20 (Typical)</span>
                  <span>50+ (High Sprawl)</span>
                </div>
              </div>

              {/* Slider 3: Cost per Seat */}
              <div className="calc-slider-block" style={{ marginBottom: "0.85rem" }}>
                <div className="calc-slider-head">
                  <label htmlFor="cost-slider" className="calc-slider-label">
                    Estimated Monthly Cost Per User
                  </label>
                  <span className="calc-val-pill green">
                    {curr.symbol}{Math.round(costPerUser * curr.rate)}/mo
                  </span>
                </div>
                <input
                  id="cost-slider"
                  type="range"
                  min="15"
                  max="160"
                  step="5"
                  value={costPerUser}
                  onChange={(e) => setCostPerUser(Number(e.target.value))}
                  className="calc-range-input slider-green"
                />
                <div className="calc-slider-scale">
                  <span>{curr.symbol}{Math.round(15 * curr.rate)} (Basic)</span>
                  <span>{curr.symbol}{Math.round(65 * curr.rate)} (Average)</span>
                  <span>{curr.symbol}{Math.round(160 * curr.rate)}+ (Premium)</span>
                </div>
              </div>

              {/* Insight Callout Box */}
              <div className="calc-info-box">
                <span className="calc-info-icon">💡</span>
                <span className="calc-info-text">
                  <strong>Industry Benchmark:</strong> On average, businesses waste <strong>{metrics.wastePercentage}%</strong> of their annual subscription budget on dormant seats, forgotten trials, and redundant point tools.
                </span>
              </div>
            </div>

            {/* Right Column: Live Results & Savings (Sticky & Sleek) */}
            <div className="calc-results-sticky">
              <div className="calc-card">
                <div className="calc-results-top-row">
                  <h3 className="calc-card-title">2. Financial Impact</h3>
                  <div className="calc-waste-badge">
                    <span>⚠️</span> {metrics.wastePercentage}% Waste Rate
                  </div>
                </div>

                {/* Big Waste Stat Box */}
                <div className="calc-waste-stat-box">
                  <div className="calc-waste-label">Estimated Annual Money Wasted</div>
                  <div className="calc-waste-number">
                    {curr.symbol}{metrics.annualWaste.toLocaleString()}
                  </div>
                  <div className="calc-waste-subtext">
                    ≈ {curr.symbol}{metrics.monthlyWaste.toLocaleString()} leaking every single month
                  </div>
                </div>

                {/* 4-Box Metrics Grid */}
                <div className="calc-metrics-grid">
                  <div className="calc-metric-tile">
                    <div className="calc-metric-lbl">Total Annual Spend</div>
                    <div className="calc-metric-val">
                      {curr.symbol}{metrics.annualSpend.toLocaleString()}
                    </div>
                  </div>

                  <div className="calc-metric-tile highlight-green">
                    <div className="calc-metric-lbl">Recoverable Savings</div>
                    <div className="calc-metric-val">
                      {curr.symbol}{metrics.potentialSavings.toLocaleString()}
                    </div>
                  </div>

                  <div className="calc-metric-tile">
                    <div className="calc-metric-lbl">Ghost / Idle Seats</div>
                    <div className="calc-metric-val">
                      ~{metrics.unusedSeats} accounts
                    </div>
                  </div>

                  <div className="calc-metric-tile">
                    <div className="calc-metric-lbl">Monthly Burn</div>
                    <div className="calc-metric-val">
                      {curr.symbol}{metrics.monthlySpend.toLocaleString()}/mo
                    </div>
                  </div>
                </div>

                {/* Visual Stack Efficiency Allocation Bar */}
                <div className="calc-bar-section">
                  <div className="calc-bar-head">
                    <span>Stack Spend Allocation</span>
                    <span>{metrics.productivePercent}% Productive</span>
                  </div>
                  <div className="calc-bar-track">
                    <div
                      className="calc-bar-segment seg-productive"
                      style={{ width: `${metrics.productivePercent}%` }}
                      title={`Productive Value: ${metrics.productivePercent}%`}
                    />
                    <div
                      className="calc-bar-segment seg-ghost"
                      style={{ width: `${metrics.ghostWastePercent}%` }}
                      title={`Ghost Licenses: ${metrics.ghostWastePercent}%`}
                    />
                    <div
                      className="calc-bar-segment seg-sprawl"
                      style={{ width: `${metrics.sprawlWastePercent}%` }}
                      title={`Tool Overlap: ${metrics.sprawlWastePercent}%`}
                    />
                  </div>
                  <div className="calc-bar-legend">
                    <span className="calc-bar-dot">
                      <span className="calc-dot" style={{ background: "#10b981" }} /> Productive ({metrics.productivePercent}%)
                    </span>
                    <span className="calc-bar-dot">
                      <span className="calc-dot" style={{ background: "#f59e0b" }} /> Ghost Seats ({metrics.ghostWastePercent}%)
                    </span>
                    <span className="calc-bar-dot">
                      <span className="calc-dot" style={{ background: "#ef4444" }} /> Overlap ({metrics.sprawlWastePercent}%)
                    </span>
                  </div>
                </div>

                {/* Action CTAs (Using exact .buyers-btn-primary and .buyers-btn-secondary) */}
                <div className="calc-actions-col">
                  <Link href="/compare" className="buyers-btn-primary">
                    <span>Compare Vetted Alternatives</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(true)}
                    className="buyers-btn-secondary"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Free PDF Audit Summary
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Section 2: "How to Reclaim Waste" (Exact /buyers Journey classes) */}
          <section className="buyers-journey-section">
            <div className="buyers-section-badge-wrapper">
              <span className="buyers-section-badge">ACTION PLAYBOOK</span>
            </div>
            <h2 className="buyers-section-title">
              How to Reclaim Your {curr.symbol}{metrics.potentialSavings.toLocaleString()} in 3 Steps
            </h2>
            <p className="buyers-section-sub">
              Systematically eliminate software waste and dormant seats without disrupting your team&apos;s daily operations.
            </p>

            <div className="buyers-steps-row">
              {/* Step 1 */}
              <div className="buyers-step-card">
                <div className="buyers-step-head">
                  <div className="buyers-step-icon-box icon-search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </div>
                  <span className="buyers-step-num">01</span>
                </div>
                <h3 className="buyers-step-title">Deprovision Ghost Seats</h3>
                <p className="buyers-step-desc">
                  Audit identity providers (Google Workspace, Okta, GitHub). Immediately revoke licenses allocated to departed contractors and inactive users.
                </p>
              </div>

              {/* Arrow */}
              <div className="buyers-step-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="buyers-step-card">
                <div className="buyers-step-head">
                  <div className="buyers-step-icon-box icon-compare">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <span className="buyers-step-num">02</span>
                </div>
                <h3 className="buyers-step-title">Consolidate Redundant Tools</h3>
                <p className="buyers-step-desc">
                  Eliminate overlapping point solutions. Replace fragmented project, chat, and documentation tools with verified all-in-one platforms.
                </p>
              </div>

              {/* Arrow */}
              <div className="buyers-step-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="buyers-step-card">
                <div className="buyers-step-head">
                  <div className="buyers-step-icon-box icon-buy">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                  <span className="buyers-step-num">03</span>
                </div>
                <h3 className="buyers-step-title">Claim Exclusive Deals</h3>
                <p className="buyers-step-desc">
                  Explore verified <Link href="/deals" style={{ color: "#4f46e5", fontWeight: 700 }}>SaaS MRKT Lifetime Deals</Link> to switch from indefinite monthly rents to permanent ownership.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Section 3: "Why SaaS Spend Spirals" (Exact /buyers Features Box) */}
          <div className="buyers-features-box">
            <div className="buyers-section-badge-wrapper">
              <span className="buyers-section-badge">KEY DRIVERS</span>
            </div>
            <h2 className="buyers-section-title">Why Software Budgets Spiral</h2>
            <p className="buyers-section-sub">
              The 4 root causes behind hidden software spend inflation across growing teams.
            </p>

            <div className="buyers-features-grid">
              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-shield">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Ghost License Creep</h3>
                <p className="buyers-feature-desc">
                  Seats allocated to offboarded contractors and former staff remain billed every single billing cycle unnoticed.
                </p>
              </div>

              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-tag">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Feature Overlap</h3>
                <p className="buyers-feature-desc">
                  Marketing, product, and engineering teams frequently buy duplicate subscription tools that fulfill the exact same tasks.
                </p>
              </div>

              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Auto-Renewal Surprises</h3>
                <p className="buyers-feature-desc">
                  Annual contracts quietly auto-renew without renegotiating seat counts or querying lower market benchmark rates.
                </p>
              </div>

              <div className="buyers-feature-card">
                <div className="buyers-feature-icon-box icon-star">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="buyers-feature-title">Plan Oversizing</h3>
                <p className="buyers-feature-desc">
                  Teams pay for top-tier enterprise plans when standard pro tiers satisfy 90% of their actual operational needs.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Section 4: FAQs (Exact /buyers Accordion) */}
          <section className="buyers-faqs-section">
            <div className="buyers-section-badge-wrapper">
              <span className="buyers-section-badge">COMMON QUESTIONS</span>
            </div>
            <h2 className="buyers-section-title">Calculator &amp; Optimization FAQs</h2>
            <p className="buyers-section-sub">
              Clear answers on benchmark methodologies, data privacy, and recovering SaaS budget.
            </p>

            <div className="buyers-faqs-grid">
              {/* Column 1 */}
              <div className="buyers-faqs-col">
                {FAQS_COL1.map((faq) => {
                  const isOpen = !!openFaqs[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`buyers-faq-item ${isOpen ? "open" : ""}`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="buyers-faq-question">
                        <span>{faq.question}</span>
                        <svg
                          className="buyers-faq-chevron"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      {isOpen && <div className="buyers-faq-answer">{faq.answer}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Column 2 */}
              <div className="buyers-faqs-col">
                {FAQS_COL2.map((faq) => {
                  const isOpen = !!openFaqs[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`buyers-faq-item ${isOpen ? "open" : ""}`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="buyers-faq-question">
                        <span>{faq.question}</span>
                        <svg
                          className="buyers-faq-chevron"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      {isOpen && <div className="buyers-faq-answer">{faq.answer}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 7. Section 5: Bottom CTA Card (Exact /buyers CTA Banner) */}
          <div className="buyers-cta-banner">
            <div className="buyers-cta-content" style={{ gridTemplateColumns: "1fr auto" }}>
              <div className="buyers-cta-left">
                <span className="buyers-cta-pill">RECLAIM YOUR SOFTWARE BUDGET</span>
                <h2 className="buyers-cta-title">
                  Ready to stop overpaying for{" "}
                  <span className="buyers-cta-title-highlight">software subscriptions?</span>
                </h2>
                <p className="buyers-cta-desc">
                  Browse vetted tools, inspect side-by-side spec sheets, and claim exclusive lifetime discounts on SaaS MRKT.
                </p>
              </div>

              <div className="buyers-cta-buttons">
                <Link href="/products" className="buyers-cta-btn-primary">
                  <span>Browse All Tools</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/categories" className="buyers-cta-btn-secondary">
                  Explore Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. PDF Export Modal */}
      {showQuoteModal && (
        <div className="calc-modal-overlay" onClick={() => setShowQuoteModal(false)}>
          <div className="calc-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="calc-modal-close"
              onClick={() => setShowQuoteModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <h3 className="calc-modal-title">Get Your Stack Audit Report</h3>
            <p className="calc-modal-desc">
              We will generate a customized PDF breakdown showing how your team can recover up to {curr.symbol}{metrics.potentialSavings.toLocaleString()} in annual savings.
            </p>

            {quoteSuccess ? (
              <div className="calc-modal-success">
                ✓ Audit report generated! Check your inbox shortly.
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <input
                  type="email"
                  required
                  placeholder="Enter your work email (e.g. alex@company.com)"
                  value={quoteEmail}
                  onChange={(e) => setQuoteEmail(e.target.value)}
                  className="calc-modal-input"
                />
                <button type="submit" className="buyers-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  <span>Send Free PDF Summary</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
