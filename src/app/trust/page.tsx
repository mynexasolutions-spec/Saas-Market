import React from "react";
import { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trust, Security & Buyer Protection | SaaS MRKT",
  description:
    "Explore how SaaS MRKT protects buyers with 100% escrow protection, verified vendor audits, malware scans, and a 30-day money-back satisfaction guarantee.",
  keywords: [
    "SaaS escrow protection",
    "software buyer security",
    "verified SaaS sellers",
    "SaaS money-back guarantee",
    "secure software marketplace",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/trust",
  },
};

export default function TrustPage() {
  const securityPillars = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: "100% Escrow Protection",
      description:
        "When you purchase any tool on SaaS MRKT, your payment is stored safely in escrow. Sellers are only paid after you receive your license and verify product functionality.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
      ),
      title: "Strict Vendor Verification",
      description:
        "Every vendor passes our ID and domain verification screening. We verify corporate registration, developer track records, and valid commercial rights.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: "Malware & Security Auditing",
      description:
        "Downloadable software, source code, and API endpoints are screened for backdoors, unauthorized telemetry, and known CVE vulnerabilities before listing approval.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
      ),
      title: "30-Day Money-Back Guarantee",
      description:
        "If a tool fails to work as advertised or the seller fails to deliver active license keys within 30 days, our dispute team initiates a full 100% escrow refund.",
    },
  ];

  return (
    <PageLayout noContainer>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
          color: "#ffffff",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#34D399",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "9999px",
              padding: "0.35rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            ✓ Institutional-Grade Security
          </div>

          <h1
            style={{
              fontSize: "clamp(2.3rem, 5vw, 3.4rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              letterSpacing: "-0.03em",
            }}
          >
            Buy &amp; Sell SaaS with <span style={{ color: "#34D399" }}>Absolute Confidence</span>
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
            We eliminate the risks of buying independent software online. Our four-layer security architecture safeguards your capital, your codebase, and your data.
          </p>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          {securityPillars.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                border: "1px solid var(--slate-200)",
                padding: "2rem",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "var(--primary-50)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                {p.icon}
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
                {p.title}
              </h3>
              <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Compliance Checklist Callout */}
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: "24px",
            border: "1px solid var(--slate-200)",
            padding: "3rem 2.5rem",
            marginBottom: "4rem",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--slate-900)", textAlign: "center", marginBottom: "0.75rem" }}>
              Our Security Standards
            </h2>
            <p style={{ color: "var(--slate-600)", textAlign: "center", marginBottom: "2.5rem", fontSize: "1rem" }}>
              We adhere to the highest international security protocols to protect your payment credentials and organizational assets.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
              <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--slate-200)", textAlign: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--primary)", marginBottom: "0.25rem" }}>PCI-DSS Level 1</div>
                <div style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>Top tier payment processing</div>
              </div>
              <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--slate-200)", textAlign: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#10B981", marginBottom: "0.25rem" }}>256-Bit SSL/TLS</div>
                <div style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>End-to-end encrypted traffic</div>
              </div>
              <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--slate-200)", textAlign: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#6366F1", marginBottom: "0.25rem" }}>SOC2 Ready</div>
                <div style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>Strict data access isolation</div>
              </div>
              <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--slate-200)", textAlign: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#F59E0B", marginBottom: "0.25rem" }}>GDPR &amp; CCPA</div>
                <div style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>Complete user data sovereignty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.75rem" }}>
            Ready to explore verified tools?
          </h3>
          <p style={{ color: "var(--slate-600)", marginBottom: "1.5rem" }}>
            Browse over 50+ curated products or test our side-by-side comparison engine.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link
              href="/products"
              style={{
                background: "var(--primary)",
                color: "#ffffff",
                padding: "0.8rem 1.75rem",
                borderRadius: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Explore Products
            </Link>
            <Link
              href="/compare"
              style={{
                background: "#ffffff",
                border: "1px solid var(--slate-200)",
                color: "var(--slate-700)",
                padding: "0.8rem 1.75rem",
                borderRadius: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Compare Software
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
