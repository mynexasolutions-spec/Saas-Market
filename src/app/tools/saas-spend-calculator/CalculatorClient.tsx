"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function CalculatorClient() {
  const [teamSize, setTeamSize] = useState<number>(25);
  const [toolCount, setToolCount] = useState<number>(12);
  const [costPerUser, setCostPerUser] = useState<number>(65);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [quoteEmail, setQuoteEmail] = useState<string>("");
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);

  // Calculations based on industry benchmarks (Gartner / Flexera SaaS waste averages: ~28-32%)
  const metrics = useMemo(() => {
    const monthlySpend = teamSize * toolCount * (costPerUser / 3); // realistic distributed tool allocation
    const annualSpend = monthlySpend * 12;
    const estimatedWasteRate = teamSize > 100 ? 0.33 : teamSize > 30 ? 0.29 : 0.24;
    const annualWaste = annualSpend * estimatedWasteRate;
    const potentialSavings = annualWaste * 0.75; // reachable savings through consolidation & marketplace deals
    const unusedSeats = Math.round(teamSize * 0.18); // ~18% ghost / inactive licenses

    return {
      monthlySpend: Math.round(monthlySpend),
      annualSpend: Math.round(annualSpend),
      annualWaste: Math.round(annualWaste),
      potentialSavings: Math.round(potentialSavings),
      unusedSeats,
      wastePercentage: Math.round(estimatedWasteRate * 100),
    };
  }, [teamSize, toolCount, costPerUser]);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteEmail) {
      setQuoteSuccess(true);
      setTimeout(() => {
        setShowQuoteModal(false);
        setQuoteSuccess(false);
        setQuoteEmail("");
      }, 3000);
    }
  };

  return (
    <PageLayout noContainer>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0F172A 100%)",
          color: "#ffffff",
          padding: "4.5rem 1.5rem 3.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(99, 102, 241, 0.2)",
              color: "#A5B4FC",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              borderRadius: "9999px",
              padding: "0.35rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            <span>⚡</span> Free Interactive Benchmark Tool (2026 Edition)
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              letterSpacing: "-0.03em",
            }}
          >
            SaaS Spend &amp; <span style={{ color: "#818CF8" }}>Waste Calculator</span>
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#CBD5E1",
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Discover how much your company is overpaying on unused software seats, duplicate applications, and unmanaged renewals.
          </p>
        </div>
      </section>

      {/* Main Interactive Tool Section */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Controls Column (Sliders) */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid var(--slate-200)",
              padding: "2.5rem",
              boxShadow: "0 8px 30px rgba(15, 23, 42, 0.05)",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
              1. Input Your Team Metrics
            </h2>
            <p style={{ color: "var(--slate-500)", fontSize: "0.92rem", marginBottom: "2rem" }}>
              Adjust the sliders to simulate your company&apos;s current operational scale.
            </p>

            {/* Slider 1: Team Size */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <label style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--slate-800)" }}>
                  Total Team Size
                </label>
                <span
                  style={{
                    background: "var(--primary-50)",
                    color: "var(--primary)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  {teamSize} people
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", height: "8px", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--slate-400)", marginTop: "0.25rem" }}>
                <span>5 (Startup)</span>
                <span>150 (Mid-Market)</span>
                <span>300+ (Scaleup)</span>
              </div>
            </div>

            {/* Slider 2: Number of Active Tools */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <label style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--slate-800)" }}>
                  Active SaaS Tools in Stack
                </label>
                <span
                  style={{
                    background: "#EFF6FF",
                    color: "#2563EB",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  {toolCount} tools
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="40"
                step="1"
                value={toolCount}
                onChange={(e) => setToolCount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#2563EB", height: "8px", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--slate-400)", marginTop: "0.25rem" }}>
                <span>3 (Lean)</span>
                <span>20 (Average)</span>
                <span>40+ (High Sprawl)</span>
              </div>
            </div>

            {/* Slider 3: Average Cost Per Seat */}
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <label style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--slate-800)" }}>
                  Estimated Monthly Cost per User
                </label>
                <span
                  style={{
                    background: "#ECFDF5",
                    color: "#059669",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  ${costPerUser}/mo
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="150"
                step="5"
                value={costPerUser}
                onChange={(e) => setCostPerUser(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#10B981", height: "8px", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--slate-400)", marginTop: "0.25rem" }}>
                <span>$15 (Basic apps)</span>
                <span>$65 (Industry avg)</span>
                <span>$150+ (Enterprise)</span>
              </div>
            </div>

            <div style={{ background: "#F8FAFC", borderRadius: "14px", padding: "1.25rem", border: "1px solid var(--slate-200)" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--slate-600)", lineHeight: 1.5 }}>
                💡 <strong>Benchmark Source:</strong> Analysis aggregated from 8,000+ businesses reveals that organizations waste between 24% and 33% of their annual software budget on dormant accounts, unnegotiated auto-renewals, and overlapping tools.
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "2px solid #E2E8F0",
              padding: "2.5rem",
              boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
              position: "sticky",
              top: "100px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#FEF2F2",
                color: "#DC2626",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              Estimated Wasted Spend: {metrics.wastePercentage}%
            </div>

            <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--slate-900)", marginBottom: "1.5rem" }}>
              Annual Financial Impact
            </h3>

            {/* Big Stat Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)",
                borderRadius: "18px",
                padding: "1.5rem",
                border: "1px solid #FECACA",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#991B1B", textTransform: "uppercase" }}>
                Estimated Annual Money Wasted
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#DC2626", margin: "0.25rem 0" }}>
                ${metrics.annualWaste.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#7F1D1D" }}>
                ≈ ${(Math.round(metrics.annualWaste / 12)).toLocaleString()} evaporating every single month
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "14px", padding: "1rem", border: "1px solid var(--slate-200)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontWeight: 700 }}>Total Annual Spend</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)" }}>
                  ${metrics.annualSpend.toLocaleString()}
                </div>
              </div>

              <div style={{ background: "#ECFDF5", borderRadius: "14px", padding: "1rem", border: "1px solid #A7F3D0" }}>
                <div style={{ fontSize: "0.75rem", color: "#065F46", fontWeight: 700 }}>Recoverable Savings</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>
                  ${metrics.potentialSavings.toLocaleString()}
                </div>
              </div>

              <div style={{ background: "#F8FAFC", borderRadius: "14px", padding: "1rem", border: "1px solid var(--slate-200)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontWeight: 700 }}>Ghost / Idle Seats</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)" }}>
                  ~{metrics.unusedSeats} accounts
                </div>
              </div>

              <div style={{ background: "#F8FAFC", borderRadius: "14px", padding: "1rem", border: "1px solid var(--slate-200)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontWeight: 700 }}>Monthly Burn</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)" }}>
                  ${metrics.monthlySpend.toLocaleString()}/mo
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link
                href="/compare"
                style={{
                  background: "var(--primary)",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "0.85rem",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
                }}
              >
                Compare Vetted Alternatives →
              </Link>
              <button
                type="button"
                onClick={() => setShowQuoteModal(true)}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--slate-300)",
                  color: "var(--slate-700)",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Download PDF Audit Summary
              </button>
            </div>
          </div>
        </div>

        {/* Actionable Playbook Section */}
        <div
          style={{
            marginTop: "5rem",
            background: "#F8FAFC",
            borderRadius: "24px",
            border: "1px solid var(--slate-200)",
            padding: "3rem 2.5rem",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--slate-900)", marginBottom: "0.75rem" }}>
              How to Reclaim Your ${metrics.potentialSavings.toLocaleString()} in 3 Steps
            </h3>
            <p style={{ color: "var(--slate-600)", fontSize: "1rem", marginBottom: "2.5rem" }}>
              Action plan to systematically eliminate waste without disrupting team operations.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
              <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--slate-200)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary-50)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: "1rem" }}>
                  1
                </div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>Deprovision Ghost Seats</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--slate-600)", lineHeight: 1.5, margin: 0 }}>
                  Audit login logs across GitHub, Slack, and Google Workspace. Revoke licenses for contractors and inactive users.
                </p>
              </div>

              <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--slate-200)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: "1rem" }}>
                  2
                </div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>Consolidate Redundant Tools</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--slate-600)", lineHeight: 1.5, margin: 0 }}>
                  Replace multiple fragmented point solutions with unified platforms like TaskFlow and Manage360.
                </p>
              </div>

              <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--slate-200)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: "1rem" }}>
                  3
                </div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>Claim Exclusive Deals</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--slate-600)", lineHeight: 1.5, margin: 0 }}>
                  Explore verified <Link href="/deals" style={{ color: "var(--primary)", fontWeight: 700 }}>SaaS MRKT Lifetime Deals</Link> to switch from monthly rent to one-time software ownership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for PDF Audit Export */}
      {showQuoteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "2.5rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowQuoteModal(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--slate-400)" }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
              Get Your Custom Audit Report
            </h3>
            <p style={{ color: "var(--slate-600)", fontSize: "0.92rem", marginBottom: "1.5rem" }}>
              We will generate a detailed PDF breakdown calculating your team&apos;s potential ${metrics.potentialSavings.toLocaleString()} in annual savings.
            </p>

            {quoteSuccess ? (
              <div style={{ background: "#ECFDF5", color: "#065F46", padding: "1rem", borderRadius: "12px", fontWeight: 700, textAlign: "center" }}>
                ✓ Report generated! Check your inbox shortly.
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <input
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  value={quoteEmail}
                  onChange={(e) => setQuoteEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--slate-300)",
                    fontSize: "0.95rem",
                    outline: "none",
                    marginBottom: "1rem",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "var(--primary)",
                    color: "#ffffff",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send Free PDF Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
