import React from "react";
import { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial & Review Methodology | How We Score Software | SaaS MRKT",
  description:
    "Learn about SaaS MRKT's rigorous 5-dimension software scoring rubric, independent testing methodology, anti-bias policy, and fact-checking standards.",
  keywords: [
    "SaaS MRKT editorial guidelines",
    "software review methodology",
    "how we score software",
    "independent SaaS testing",
    "E-E-A-T review standards",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/editorial-guidelines",
  },
};

export default function EditorialGuidelinesPage() {
  const scoringDimensions = [
    {
      weight: "25%",
      title: "1. Core Feature Completeness & Velocity",
      description:
        "We test whether the tool delivers on its primary marketing claims without requiring complex workarounds. We examine API reliability, export formats, third-party integrations, and release cadence.",
    },
    {
      weight: "25%",
      title: "2. Value for Money & Pricing Transparency",
      description:
        "We calculate total cost of ownership including hidden onboarding fees, per-seat penalties, and add-on costs. High scores are awarded to platforms offering transparent self-serve pricing and generous free tiers.",
    },
    {
      weight: "20%",
      title: "3. User Experience & Time-to-Value",
      description:
        "We measure how quickly an average non-technical employee can onboard, configure their workspace, and complete core workflows without requiring certified external consultants.",
    },
    {
      weight: "15%",
      title: "4. Security, Compliance & Data Sovereignty",
      description:
        "Every reviewed platform is evaluated against our cybersecurity framework: SOC2 Type II status, GDPR and CCPA adherence, multi-factor authentication (MFA) enforcement, and data export portability.",
    },
    {
      weight: "15%",
      title: "5. Customer Support & SLA Reliability",
      description:
        "We conduct mystery-shopper support tests across email, chat, and documentation to benchmark median first-response times and technical resolution accuracy.",
    },
  ];

  return (
    <PageLayout noContainer>
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)",
          borderBottom: "1px solid var(--slate-200)",
          padding: "4.5rem 1.5rem 3.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#ffffff",
              padding: "0.35rem 1rem",
              borderRadius: "9999px",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
              border: "1px solid var(--slate-200)",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--primary)",
              marginBottom: "1.25rem",
            }}
          >
            Google E-E-A-T Quality &amp; Trust Standards
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              fontWeight: 900,
              color: "var(--slate-900)",
              marginBottom: "1rem",
              letterSpacing: "-0.03em",
            }}
          >
            Editorial &amp; Review <span style={{ color: "var(--primary)" }}>Methodology</span>
          </h1>

          <p style={{ color: "var(--slate-600)", fontSize: "1.1rem", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto" }}>
            Transparency is the foundation of SaaS MRKT. Here is an exact breakdown of how our research analysts, security engineers, and software editors test and rate every application in our directory.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
        {/* Core Principles */}
        <div style={{ marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "1rem" }}>
            Our Editorial Independence Pledge
          </h2>
          <p style={{ color: "var(--slate-700)", lineHeight: 1.8, fontSize: "1.05rem" }}>
            At <strong>SaaS MRKT</strong>, our primary loyalty is to software buyers. We operate under strict editorial separation guidelines:
          </p>
          <ul style={{ paddingLeft: "1.5rem", color: "var(--slate-700)", lineHeight: 1.8, fontSize: "1.05rem" }}>
            <li><strong>Zero Paid Rating Inflation:</strong> Software vendors cannot pay to increase their numerical star rating or remove negative customer reviews.</li>
            <li><strong>Clear Commercial Disclosures:</strong> If an article features a partner promotional deal, it is explicitly flagged with clear badges (e.g. &ldquo;Featured Partner&rdquo;).</li>
            <li><strong>Real Hands-On Testing:</strong> Our editorial reviews are authored by experienced practitioners who actively trial the software with real datasets.</li>
          </ul>
        </div>

        {/* 5-Dimension Scoring Rubric */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
            The 5-Dimension Software Scoring Rubric
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1rem", marginBottom: "2rem" }}>
            Every product review and category recommendation is calculated using our weighted 100-point rubric:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {scoringDimensions.map((dim, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1px solid var(--slate-200)",
                  padding: "1.75rem",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>
                    {dim.title}
                  </h3>
                  <span
                    style={{
                      background: "var(--primary-50)",
                      color: "var(--primary)",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                    }}
                  >
                    Weight: {dim.weight}
                  </span>
                </div>
                <p style={{ color: "var(--slate-600)", lineHeight: 1.6, fontSize: "0.95rem", margin: 0 }}>
                  {dim.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Cadence & Fact-Checking */}
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: "20px",
            border: "1px solid var(--slate-200)",
            padding: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.75rem" }}>
            Pricing Verification &amp; Quarterly Audit Cadence
          </h2>
          <p style={{ color: "var(--slate-700)", lineHeight: 1.7, fontSize: "1rem", margin: 0 }}>
            Because software pricing and features evolve rapidly, our research team audits every listed software catalog entry, comparison page, and buyer guide on a strict <strong>90-day recurring cadence</strong>. When vendors alter pricing structures or deprecate legacy tiers, our specification matrices are updated within 48 business hours.
          </p>
        </div>

        {/* Contact & Corrections */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
            Submit an Editorial Correction or Feedback
          </h3>
          <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Notice an outdated pricing tier or feature change? Our editors welcome community feedback.
          </p>
          <Link
            href="/contact"
            style={{
              background: "var(--primary)",
              color: "#ffffff",
              padding: "0.75rem 1.75rem",
              borderRadius: "12px",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Contact the Editorial Desk →
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
