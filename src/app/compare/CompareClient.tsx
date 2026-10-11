"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";

export default function CompareClient() {
  const searchParams = useSearchParams();

  // Initial tool picks from URL params or defaults
  const initialTool1 = searchParams.get("tool1") || "taskflow";
  const initialTool2 = searchParams.get("tool2") || "manage360";

  const [tool1Id, setTool1Id] = useState<string>(initialTool1);
  const [tool2Id, setTool2Id] = useState<string>(initialTool2);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const t1 = searchParams.get("tool1");
    const t2 = searchParams.get("tool2");
    if (t1) setTool1Id(t1);
    if (t2) setTool2Id(t2);
  }, [searchParams]);

  // Resolve products
  const product1: ProductItem = useMemo(() => {
    const found = ALL_PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === tool1Id.toLowerCase() ||
        (p.slug && p.slug.toLowerCase() === tool1Id.toLowerCase()) ||
        p.name.toLowerCase().replace(/[^a-z0-9]/g, "") === tool1Id.toLowerCase().replace(/[^a-z0-9]/g, "")
    );
    return found || ALL_PRODUCTS[2] || ALL_PRODUCTS[0]; // fallback to TaskFlow or first
  }, [tool1Id]);

  const product2: ProductItem = useMemo(() => {
    const found = ALL_PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === tool2Id.toLowerCase() ||
        (p.slug && p.slug.toLowerCase() === tool2Id.toLowerCase()) ||
        p.name.toLowerCase().replace(/[^a-z0-9]/g, "") === tool2Id.toLowerCase().replace(/[^a-z0-9]/g, "")
    );
    return found || ALL_PRODUCTS[1] || ALL_PRODUCTS[0]; // fallback to Manage360
  }, [tool2Id]);

  const handleCopyComparisonLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/compare?tool1=${product1.slug || product1.id}&tool2=${product2.slug || product2.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSwap = () => {
    setTool1Id(product2.slug || product2.id);
    setTool2Id(product1.slug || product1.id);
  };

  const comparisonPresets = [
    { name: "TaskFlow vs Manage360", t1: "taskflow", t2: "manage360", label: "Productivity vs HR Ops" },
    { name: "GrowthFlow vs FinMate", t1: "growthflow", t2: "finmate", label: "CRM vs Finance" },
    { name: "MailBoost vs Supportly", t1: "mailboost", t2: "supportly", label: "Marketing vs Support" },
    { name: "TaskFlow vs GrowthFlow", t1: "taskflow", t2: "growthflow", label: "Agile vs Sales CRM" },
  ];

  return (
    <PageLayout activeNav="products" noContainer>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)",
          borderBottom: "1px solid var(--slate-200)",
          padding: "4rem 1.5rem 3rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#ffffff",
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
              border: "1px solid var(--slate-200)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--primary)",
              marginBottom: "1.25rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 3h5v5" />
              <path d="M4 20L21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15l6 6" />
              <path d="M4 4l5 5" />
            </svg>
            SaaS MRKT Comparison Engine
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "var(--slate-900)",
              lineHeight: 1.2,
              marginBottom: "1rem",
              letterSpacing: "-0.03em",
            }}
          >
            Compare SaaS Software <span style={{ color: "var(--primary)" }}>Side-by-Side</span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--slate-600)",
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Evaluate features, verified buyer ratings, pricing models, and tech specifications to pick the exact tool your team needs.
          </p>

          {/* Interactive Tool Selector Bar */}
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "1.25rem",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              border: "1px solid var(--slate-200)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            {/* Tool 1 Select */}
            <div style={{ flex: "1 1 280px", textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--slate-500)",
                  marginBottom: "0.35rem",
                }}
              >
                First Software
              </label>
              <select
                value={product1.slug || product1.id}
                onChange={(e) => setTool1Id(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid var(--slate-200)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--slate-800)",
                  background: "#F8FAFC",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {ALL_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.slug || p.id}>
                    {p.name} ({p.category}) — ${p.price}/{p.period}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              title="Swap tools"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--primary-50)",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </button>

            {/* Tool 2 Select */}
            <div style={{ flex: "1 1 280px", textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--slate-500)",
                  marginBottom: "0.35rem",
                }}
              >
                Second Software
              </label>
              <select
                value={product2.slug || product2.id}
                onChange={(e) => setTool2Id(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid var(--slate-200)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--slate-800)",
                  background: "#F8FAFC",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {ALL_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.slug || p.id}>
                    {p.name} ({p.category}) — ${p.price}/{p.period}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1.5rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 600 }}>Popular Comparisons:</span>
            {comparisonPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setTool1Id(preset.t1);
                  setTool2Id(preset.t2);
                }}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--slate-200)",
                  borderRadius: "8px",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.82rem",
                  color: "var(--slate-700)",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.15s ease",
                }}
              >
                {preset.name}
              </button>
            ))}
            <button
              onClick={handleCopyComparisonLink}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "0.82rem",
                color: "var(--primary)",
                cursor: "pointer",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                marginLeft: "0.5rem",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copiedLink ? "Link Copied!" : "Share Comparison"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Comparison Section */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        {/* Side-by-side Top Header Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* Product 1 Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "2px solid #E2E8F0",
              padding: "2rem",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "var(--primary-50)",
                color: "var(--primary)",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              Option A
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: product1.brandColor || "#4F46E5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {product1.logo ? (
                  <Image src={product1.logo} alt={product1.name} width={60} height={60} style={{ objectFit: "cover" }} />
                ) : (
                  product1.brandLetter || product1.name.charAt(0)
                )}
              </div>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>
                  {product1.name}
                </h2>
                <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 500 }}>
                  {product1.category}
                </div>
              </div>
            </div>

            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: 1.5, minHeight: "44px", marginBottom: "1.5rem" }}>
              {product1.tagline || product1.description}
            </p>

            {/* Price & Rating */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "14px",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>
                  Starting Price
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--slate-900)" }}>
                  ${product1.price}
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--slate-500)" }}>/{product1.period}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "flex-end" }}>
                  <span style={{ color: "#F59E0B", fontWeight: 800, fontSize: "1.1rem" }}>★ {product1.rating}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                  {product1.reviewCount?.toLocaleString()} reviews
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link
                href={`/products/${product1.id}/buy`}
                style={{
                  flex: 1,
                  background: "var(--primary)",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Purchase {product1.name}
              </Link>
              <Link
                href={`/products/${product1.id}`}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid var(--slate-200)",
                  background: "#ffffff",
                  color: "var(--slate-700)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Specs
              </Link>
            </div>
          </div>

          {/* Product 2 Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "2px solid #E2E8F0",
              padding: "2rem",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "var(--blue-50)",
                color: "var(--blue-600)",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              Option B
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: product2.brandColor || "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {product2.logo ? (
                  <Image src={product2.logo} alt={product2.name} width={60} height={60} style={{ objectFit: "cover" }} />
                ) : (
                  product2.brandLetter || product2.name.charAt(0)
                )}
              </div>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>
                  {product2.name}
                </h2>
                <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 500 }}>
                  {product2.category}
                </div>
              </div>
            </div>

            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: 1.5, minHeight: "44px", marginBottom: "1.5rem" }}>
              {product2.tagline || product2.description}
            </p>

            {/* Price & Rating */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "14px",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>
                  Starting Price
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--slate-900)" }}>
                  ${product2.price}
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--slate-500)" }}>/{product2.period}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "flex-end" }}>
                  <span style={{ color: "#F59E0B", fontWeight: 800, fontSize: "1.1rem" }}>★ {product2.rating}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                  {product2.reviewCount?.toLocaleString()} reviews
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link
                href={`/products/${product2.id}/buy`}
                style={{
                  flex: 1,
                  background: "var(--primary)",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Purchase {product2.name}
              </Link>
              <Link
                href={`/products/${product2.id}`}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid var(--slate-200)",
                  background: "#ffffff",
                  color: "var(--slate-700)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Specs
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Comparison Table */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            border: "1px solid var(--slate-200)",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              padding: "1.5rem 2rem",
              background: "#F8FAFC",
              borderBottom: "1px solid var(--slate-200)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--slate-900)" }}>
              Detailed Specification Matrix
            </h3>
            <span style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 500 }}>
              Updated for 2026 SaaS benchmarks
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--slate-200)", background: "#ffffff" }}>
                  <th style={{ padding: "1.2rem 1.5rem", width: "26%", color: "var(--slate-500)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
                    Metric / Feature
                  </th>
                  <th style={{ padding: "1.2rem 1.5rem", width: "37%", color: "var(--slate-900)", fontWeight: 800, fontSize: "1rem" }}>
                    {product1.name}
                  </th>
                  <th style={{ padding: "1.2rem 1.5rem", width: "37%", color: "var(--slate-900)", fontWeight: 800, fontSize: "1rem" }}>
                    {product2.name}
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.95rem", color: "var(--slate-700)" }}>
                {/* Category */}
                <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 700, color: "var(--slate-900)" }}>Software Category</td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{ background: "var(--primary-50)", color: "var(--primary)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
                      {product1.category}
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{ background: "var(--blue-50)", color: "var(--blue-600)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
                      {product2.category}
                    </span>
                  </td>
                </tr>

                {/* Target Audience */}
                <tr style={{ borderBottom: "1px solid var(--slate-100)", background: "#FAFCFF" }}>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 700, color: "var(--slate-900)" }}>Best Suited For</td>
                  <td style={{ padding: "1.2rem 1.5rem", lineHeight: 1.5 }}>{product1.targetAudience || "Startups, fast teams and SMEs"}</td>
                  <td style={{ padding: "1.2rem 1.5rem", lineHeight: 1.5 }}>{product2.targetAudience || "Growing companies and cross-functional teams"}</td>
                </tr>

                {/* Pricing Structure */}
                <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 700, color: "var(--slate-900)" }}>Pricing Model</td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <strong>${product1.price}/{product1.period}</strong> ({product1.pricingModel || "Monthly Subscription"})
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <strong>${product2.price}/{product2.period}</strong> ({product2.pricingModel || "Monthly Subscription"})
                  </td>
                </tr>

                {/* Verified Seller */}
                <tr style={{ borderBottom: "1px solid var(--slate-100)", background: "#FAFCFF" }}>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 700, color: "var(--slate-900)" }}>Vendor Verification</td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#059669", fontWeight: 600 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Verified ({product1.sellerName || "Official Team"})
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#059669", fontWeight: 600 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Verified ({product2.sellerName || "Official Team"})
                    </span>
                  </td>
                </tr>

                {/* Core Features */}
                <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 700, color: "var(--slate-900)", verticalAlign: "top" }}>
                    Key Features
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", verticalAlign: "top" }}>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.7 }}>
                      {product1.features?.slice(0, 5).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", verticalAlign: "top" }}>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.7 }}>
                      {product2.features?.slice(0, 5).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </td>
                </tr>

                {/* Tech & Integrations */}
                <tr style={{ borderBottom: "1px solid var(--slate-100)", background: "#FAFCFF" }}>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 700, color: "var(--slate-900)" }}>Architecture & Stack</td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    {product1.techStack ? product1.techStack.join(", ") : "Cloud native, REST API, Webhooks"}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    {product2.techStack ? product2.techStack.join(", ") : "Cloud native, GraphQL, SSO"}
                  </td>
                </tr>

                {/* Escrow & Buyer Guarantee */}
                <tr>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 700, color: "var(--slate-900)" }}>Buyer Protection</td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 600 }}>30-Day Escrow Guarantee</span>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 600 }}>30-Day Escrow Guarantee</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verdict / Recommendation Callout */}
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            borderRadius: "20px",
            padding: "2.5rem",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.15)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#60A5FA",
                marginBottom: "0.5rem",
                letterSpacing: "0.05em",
              }}
            >
              The SaaS MRKT Verdict
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.75rem", color: "#ffffff" }}>
              Which tool should your team choose?
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.6, margin: 0, maxWidth: "800px" }}>
              If your priority is <strong>{product1.category}</strong> and you need an agile solution at ${product1.price}/{product1.period}, go with <strong>{product1.name}</strong>. On the other hand, if you require specialized capabilities in <strong>{product2.category}</strong> with rich workflow management, <strong>{product2.name}</strong> delivers superior value.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <Link
              href={`/products/${product1.id}/buy`}
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
              Get {product1.name} (${product1.price}/{product1.period})
            </Link>
            <Link
              href={`/products/${product2.id}/buy`}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              Get {product2.name} (${product2.price}/{product2.period})
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
