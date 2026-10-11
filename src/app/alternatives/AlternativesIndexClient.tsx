"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { ALTERNATIVES_DATA } from "@/data/alternativesData";

export default function AlternativesIndexClient() {
  const [search, setSearch] = useState("");

  const toolsList = useMemo(() => {
    return Object.values(ALTERNATIVES_DATA).filter((tool) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.alternatives.some((a) => a.name.toLowerCase().includes(q))
      );
    });
  }, [search]);

  return (
    <PageLayout noContainer>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0F172A 100%)",
          color: "#ffffff",
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
            <span>🔍</span> SaaS Alternatives &amp; Competitor Directory
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
            Find Cheaper, Faster <span style={{ color: "#818CF8" }}>Software Alternatives</span>
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
            Stop overpaying on bloated legacy tools. Browse our curated directories to discover vetted, high-converting alternatives with transparent pricing.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search legacy software (e.g. Slack, Asana, HubSpot)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1.25rem",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                color: "#ffffff",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
        </div>
      </section>

      {/* Directory Cards Grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem",
          }}
        >
          {toolsList.map((tool) => (
            <div
              key={tool.slug}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                border: "1px solid var(--slate-200)",
                padding: "2rem",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                  {tool.category}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#EF4444", fontWeight: 700 }}>
                  Legacy: {tool.legacyPricing.split("–")[0]}
                </span>
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
                {tool.name} Alternatives
              </h2>

              <p style={{ color: "var(--slate-600)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "1.5rem", flexGrow: 1 }}>
                {tool.tagline}
              </p>

              {/* Vetted Matches Preview */}
              <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", border: "1px solid var(--slate-100)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-500)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Top Ranked Replacements ({tool.alternatives.length}):
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {tool.alternatives.map((alt) => (
                    <span
                      key={alt.name}
                      style={{
                        background: "#ffffff",
                        border: "1px solid var(--slate-200)",
                        borderRadius: "6px",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--slate-800)",
                      }}
                    >
                      ★ {alt.name}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/alternatives/${tool.slug}`}
                style={{
                  background: "var(--primary)",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                View {tool.name} Alternatives →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
