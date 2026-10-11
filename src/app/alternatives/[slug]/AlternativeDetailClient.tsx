"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { LegacyToolData } from "@/data/alternativesData";

interface AlternativeDetailClientProps {
  tool: LegacyToolData;
}

export default function AlternativeDetailClient({ tool }: AlternativeDetailClientProps) {
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
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#94A3B8", marginBottom: "1rem" }}>
            <Link href="/" style={{ color: "#CBD5E1", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/alternatives" style={{ color: "#CBD5E1", textDecoration: "none" }}>Alternatives</Link>
            <span>/</span>
            <span style={{ color: "#818CF8" }}>{tool.name} Alternatives</span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#FCA5A5",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "9999px",
              padding: "0.35rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            <span>🔄</span> Vetted Modern Replacements (2026 Edition)
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
            Best <span style={{ color: "#818CF8" }}>{tool.name} Alternatives</span> in 2026
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
            Looking to switch away from {tool.name}? Discover faster, more affordable, and modern alternatives offering higher ROI and zero bloat.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1.5rem",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              padding: "0.75rem 1.5rem",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "0.9rem",
            }}
          >
            <div>
              <span style={{ color: "#94A3B8" }}>Legacy Pricing: </span>
              <strong style={{ color: "#F87171" }}>{tool.legacyPricing}</strong>
            </div>
            <div>
              <span style={{ color: "#94A3B8" }}>Category: </span>
              <strong style={{ color: "#FFFFFF" }}>{tool.category}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Comparison Section */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        {/* Why Users Are Switching Box */}
        <div
          style={{
            background: "#FFF1F2",
            borderRadius: "20px",
            border: "1px solid #FECDD3",
            padding: "2rem",
            marginBottom: "3.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#9F1239", margin: 0 }}>
              Why Teams Are Leaving {tool.name} in 2026
            </h2>
          </div>
          <p style={{ color: "#881337", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            While {tool.name} remains widely known, software buyers report mounting frustration with legacy overhead:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {tool.commonComplaints.map((c, i) => (
              <div key={i} style={{ background: "#ffffff", padding: "1rem", borderRadius: "12px", border: "1px solid #FFE4E6", fontSize: "0.9rem", color: "#9F1239", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#E11D48", fontWeight: 800 }}>✕</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Alternatives Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
            Top Recommended Alternatives to {tool.name}
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1.05rem" }}>
            Ranked by customer satisfaction, feature velocity, and price-to-value ratio.
          </p>
        </div>

        {/* Alternatives Cards List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", marginBottom: "4rem" }}>
          {tool.alternatives.map((alt, idx) => (
            <div
              key={alt.name}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "2px solid #E2E8F0",
                padding: "2.5rem",
                boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)",
                position: "relative",
              }}
            >
              {/* Rank Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  background: idx === 0 ? "linear-gradient(135deg, #F59E0B, #D97706)" : "var(--primary-50)",
                  color: idx === 0 ? "#ffffff" : "var(--primary)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                }}
              >
                {idx === 0 ? "🏆 #1 Recommended" : `#${idx + 1} Alternative`}
              </div>

              {/* Header Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: alt.brandColor || "#4F46E5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {alt.logo ? (
                    <Image src={alt.logo} alt={alt.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    alt.name.charAt(0)
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--slate-900)", margin: 0 }}>
                    {alt.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 500 }}>{alt.category}</span>
                    <span style={{ color: "#F59E0B", fontWeight: 800, fontSize: "0.95rem" }}>★ {alt.rating}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--slate-400)" }}>({alt.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Key Advantage Pill */}
              <div
                style={{
                  display: "inline-block",
                  background: "#ECFDF5",
                  color: "#065F46",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginBottom: "1.25rem",
                }}
              >
                ✓ Key Advantage: {alt.keyAdvantage}
              </div>

              <p style={{ color: "var(--slate-600)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {alt.description}
              </p>

              {/* Feature Highlights Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
                {alt.features.map((feat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--slate-700)" }}>
                    <span style={{ color: "#10B981", fontWeight: 800 }}>✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Footer CTA & Pricing */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F8FAFC",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "16px",
                  border: "1px solid var(--slate-200)",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>
                    Pricing vs {tool.name}
                  </div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--slate-900)" }}>
                    {alt.priceText}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <Link
                    href={`/products/${alt.productId || "prod-taskflow"}/buy`}
                    style={{
                      background: "var(--primary)",
                      color: "#ffffff",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                    }}
                  >
                    Get {alt.name} Deal
                  </Link>
                  <Link
                    href={`/compare?tool1=${alt.name.toLowerCase()}&tool2=${tool.slug}`}
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--slate-200)",
                      color: "var(--slate-700)",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                    }}
                  >
                    Compare Side-by-Side
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Popular Software Alternatives Navigation */}
        <div style={{ background: "#F8FAFC", borderRadius: "20px", padding: "2.5rem", border: "1px solid var(--slate-200)", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "1rem" }}>
            Looking for other tool alternatives?
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {["Slack", "Asana", "HubSpot", "Salesforce", "QuickBooks", "Jira"].map((t) => (
              <Link
                key={t}
                href={`/alternatives/${t.toLowerCase()}`}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--slate-200)",
                  borderRadius: "10px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--slate-700)",
                  textDecoration: "none",
                }}
              >
                {t} Alternatives
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
