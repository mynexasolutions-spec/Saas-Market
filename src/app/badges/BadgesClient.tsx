"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS } from "@/data/products";

export default function BadgesClient() {
  const [selectedProductId, setSelectedProductId] = useState<string>("prod-taskflow");
  const [selectedBadge, setSelectedBadge] = useState<string>("top-rated");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [previewDark, setPreviewDark] = useState<boolean>(false);

  const selectedProduct = ALL_PRODUCTS.find((p) => p.id === selectedProductId) || ALL_PRODUCTS[0];

  const badges = [
    {
      id: "top-rated",
      name: "Top Rated 2026",
      file: "/badges/top-rated-2026.svg",
      description: "For tools maintaining 4.7+ stars across 1,000+ verified customer reviews.",
      color: "#CA8A04",
    },
    {
      id: "featured",
      name: "Featured on SaaS MRKT",
      file: "/badges/featured-on-saasmrkt.svg",
      description: "Official verification badge showcasing active catalog listing and editorial review.",
      color: "#4F46E5",
    },
    {
      id: "verified-vendor",
      name: "Verified Vendor (Escrow Safe)",
      file: "/badges/verified-vendor-2026.svg",
      description: "Validates verified business registration and 30-day buyer escrow coverage.",
      color: "#059669",
    },
  ];

  const currentBadgeObj = badges.find((b) => b.id === selectedBadge) || badges[0];

  const embedHtml = `<a href="https://saasmrkt.com/products/${selectedProduct.slug || selectedProduct.id}" target="_blank" rel="noopener noreferrer">
  <img src="https://saasmrkt.com${currentBadgeObj.file}" alt="${currentBadgeObj.name} on SaaS MRKT" width="220" height="60" style="border-radius: 12px; display: inline-block;" />
</a>`;

  const embedMarkdown = `[![${currentBadgeObj.name} on SaaS MRKT](https://saasmrkt.com${currentBadgeObj.file})](https://saasmrkt.com/products/${selectedProduct.slug || selectedProduct.id})`;

  const handleCopy = (text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
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
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(245, 158, 11, 0.15)",
              color: "#FCD34D",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "9999px",
              padding: "0.35rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            <span>🏆</span> Official SaaS MRKT Recognition Badges
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
            Showcase Your <span style={{ color: "#FBBF24" }}>Verified Excellence</span>
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
            Boost landing page conversions by up to 26%. Embed your verified SaaS MRKT trust badge on your website, pricing page, or footer.
          </p>
        </div>
      </section>

      {/* Main Generator Tool */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Controls */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid var(--slate-200)",
              padding: "2.5rem",
              boxShadow: "0 8px 30px rgba(15, 23, 42, 0.05)",
            }}
          >
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
              1. Select Your Listed Software
            </h2>
            <p style={{ color: "var(--slate-500)", fontSize: "0.92rem", marginBottom: "1.5rem" }}>
              Your badge will link directly to your verified product listing and customer review score.
            </p>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.5rem" }}>
                Select Tool from Catalog
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid var(--slate-300)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--slate-800)",
                  background: "#F8FAFC",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {ALL_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category}) — ★ {p.rating}
                  </option>
                ))}
              </select>
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
              2. Choose Badge Style
            </h2>
            <p style={{ color: "var(--slate-500)", fontSize: "0.92rem", marginBottom: "1.5rem" }}>
              Pick the award design that best fits your landing page branding.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {badges.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBadge(b.id)}
                  style={{
                    padding: "1.25rem",
                    borderRadius: "16px",
                    border: selectedBadge === b.id ? `2px solid ${b.color}` : "1px solid var(--slate-200)",
                    background: selectedBadge === b.id ? "#FAFCFF" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <Image src={b.file} alt={b.name} width={130} height={36} style={{ objectFit: "contain" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--slate-900)", marginBottom: "0.2rem" }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--slate-500)", lineHeight: 1.4 }}>
                      {b.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview & Code Export */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--slate-900)", margin: 0 }}>
                Live Badge Preview
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setPreviewDark(false)}
                  style={{
                    padding: "0.3rem 0.65rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    border: "1px solid var(--slate-200)",
                    background: !previewDark ? "var(--slate-900)" : "#ffffff",
                    color: !previewDark ? "#ffffff" : "var(--slate-700)",
                    cursor: "pointer",
                  }}
                >
                  Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDark(true)}
                  style={{
                    padding: "0.3rem 0.65rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    border: "1px solid var(--slate-200)",
                    background: previewDark ? "var(--slate-900)" : "#ffffff",
                    color: previewDark ? "#ffffff" : "var(--slate-700)",
                    cursor: "pointer",
                  }}
                >
                  Dark Mode
                </button>
              </div>
            </div>

            {/* Display Simulator */}
            <div
              style={{
                background: previewDark ? "#0F172A" : "#F8FAFC",
                border: previewDark ? "1px solid #1E293B" : "1px solid var(--slate-200)",
                borderRadius: "18px",
                padding: "3rem 1.5rem",
                textAlign: "center",
                marginBottom: "2rem",
                transition: "background 0.2s ease",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <a href={`/products/${selectedProduct.slug || selectedProduct.id}`} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={currentBadgeObj.file}
                    alt={currentBadgeObj.name}
                    width={220}
                    height={60}
                    style={{ borderRadius: "14px", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
                  />
                </a>
              </div>
              <div style={{ fontSize: "0.8rem", color: previewDark ? "#94A3B8" : "var(--slate-500)" }}>
                Clicking links to: <code>saasmrkt.com/products/{selectedProduct.slug || selectedProduct.id}</code>
              </div>
            </div>

            {/* Embed Code Tabs */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", textTransform: "uppercase" }}>
                  HTML Embed Code
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(embedHtml)}
                  style={{
                    background: "var(--primary)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copiedCode ? "Copied! ✓" : "Copy HTML"}
                </button>
              </div>

              <textarea
                readOnly
                value={embedHtml}
                rows={4}
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "1px solid var(--slate-300)",
                  background: "#F8FAFC",
                  color: "var(--slate-800)",
                  resize: "none",
                  outline: "none",
                }}
              />
            </div>

            {/* Markdown option */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EFF6FF", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #BFDBFE" }}>
              <span style={{ fontSize: "0.82rem", color: "#1E40AF", fontWeight: 600 }}>Need GitHub / README markdown?</span>
              <button
                type="button"
                onClick={() => handleCopy(embedMarkdown)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #93C5FD",
                  color: "#1D4ED8",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Copy Markdown
              </button>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
            Where should you place your badge?
          </h3>
          <p style={{ color: "var(--slate-600)", marginBottom: "2rem" }}>
            Recommended placements for maximum conversion uplift and customer confidence:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
            <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--slate-200)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)", marginBottom: "0.35rem" }}>
                1. Hero Social Proof
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--slate-600)", lineHeight: 1.5, margin: 0 }}>
                Directly underneath your main call-to-action button alongside customer review ratings.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--slate-200)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#10B981", marginBottom: "0.35rem" }}>
                2. Pricing Table
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--slate-600)", lineHeight: 1.5, margin: 0 }}>
                Adjacent to plan tiers to alleviate purchase anxiety and confirm verified escrow protection.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--slate-200)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#6366F1", marginBottom: "0.35rem" }}>
                3. Global Website Footer
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--slate-600)", lineHeight: 1.5, margin: 0 }}>
                Next to your security and compliance certifications (SOC2, GDPR, ISO 27001).
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
