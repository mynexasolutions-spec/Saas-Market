"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

interface FormState {
  name: string;
  category: string;
  tagline: string;
  website: string;
  description: string;
  brandColor: string;
  pricingModel: string;
  price: string;
  period: string;
  targetAudience: string;
  features: string[];
  founderName: string;
  founderEmail: string;
  payoutMethod: string;
  agreeEscrow: boolean;
}

export default function SubmitProductClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>("");

  const [form, setForm] = useState<FormState>({
    name: "DocuSprint AI",
    category: "Project Management",
    tagline: "AI-assisted sprint documentation and automated pull request release notes",
    website: "https://docusprint.io",
    description: "DocuSprint turns complex Jira tickets and GitHub PRs into customer-ready changelogs and internal wikis in seconds.",
    brandColor: "#6366F1",
    pricingModel: "Subscription",
    price: "29",
    period: "mo",
    targetAudience: "Engineering teams, Product Managers & Tech Startups",
    features: [
      "Automated GitHub & GitLab integration",
      "AI changelog generation for customers",
      "Two-way Jira & Linear synchronization",
    ],
    founderName: "Zack Robinson",
    founderEmail: "zack@docusprint.io",
    payoutMethod: "stripe",
    agreeEscrow: true,
  });

  const categories = [
    "Project Management",
    "CRM & Sales",
    "HR & Payroll",
    "Finance & Accounting",
    "Marketing & Email",
    "Customer Support",
    "Cloud & DevOps",
    "Analytics & BI",
    "Security & Compliance",
  ];

  const brandColors = [
    "#6366F1",
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EC4899",
    "#0F172A",
  ];

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...form.features];
    updated[index] = val;
    setForm({ ...form, features: updated });
  };

  const addFeature = () => {
    if (form.features.length < 5) {
      setForm({ ...form, features: [...form.features, ""] });
    }
  };

  const removeFeature = (index: number) => {
    if (form.features.length > 1) {
      const updated = form.features.filter((_, i) => i !== index);
      setForm({ ...form, features: updated });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submit
      const newId = `prod-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmissionId(newId);
      setIsSubmitted(true);

      try {
        const cleanFeatures = form.features.filter(Boolean);
        const newProduct = {
          id: newId,
          name: form.name.trim(),
          category: form.category,
          tagline: form.tagline.trim() || `${form.name} for modern high-velocity teams`,
          price: parseFloat(form.price) || 29,
          period: form.period || "mo",
          pricingModel: form.pricingModel || "Subscription",
          description: form.description.trim(),
          website: form.website.trim() || "https://saasmrkt.com",
          brandColor: form.brandColor || "#6366F1",
          brandLetter: form.name.trim().slice(0, 2).toUpperCase(),
          features: cleanFeatures.length > 0 ? cleanFeatures : ["Cloud API Integrations", "Two-Way Synchronization", "Enterprise Support"],
          status: "Live & Active",
          inquiriesCount: 0,
          viewsCount: 1,
          listedDate: "Just now",
        };

        const existingRaw = localStorage.getItem("saas_mrkt_vendor_products");
        let list = existingRaw ? JSON.parse(existingRaw) : [];
        if (!Array.isArray(list)) list = [];
        list.unshift(newProduct);
        localStorage.setItem("saas_mrkt_vendor_products", JSON.stringify(list));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  return (
    <PageLayout activeNav="sellers" noContainer>
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)",
          borderBottom: "1px solid var(--slate-200)",
          padding: "3.5rem 1.5rem 2.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
              fontWeight: 600,
              color: "var(--primary)",
              marginBottom: "1rem",
            }}
          >
            Vendor Onboarding Portal
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 900,
              color: "var(--slate-900)",
              marginBottom: "0.75rem",
              letterSpacing: "-0.03em",
            }}
          >
            List Your SaaS on <span style={{ color: "var(--primary)" }}>SaaS MRKT</span>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--slate-600)", lineHeight: 1.6 }}>
            Reach 85,000+ monthly verified software buyers. Zero upfront listing fees, guaranteed escrow payouts, and instant distribution.
          </p>

          {/* Stepper indicator */}
          {!isSubmitted && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.5rem",
                marginTop: "2.5rem",
              }}
            >
              {[
                { num: 1, title: "Product Basics" },
                { num: 2, title: "Pricing & Features" },
                { num: 3, title: "Payout & Agreement" },
              ].map((step) => (
                <div key={step.num} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      background: currentStep >= step.num ? "var(--primary)" : "#E2E8F0",
                      color: currentStep >= step.num ? "#ffffff" : "var(--slate-500)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {step.num}
                  </div>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: currentStep === step.num ? 700 : 500,
                      color: currentStep >= step.num ? "var(--slate-900)" : "var(--slate-400)",
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Form + Live Preview Body */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        {isSubmitted ? (
          /* Success Screen */
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid var(--slate-200)",
              padding: "3.5rem 2.5rem",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "#ECFDF5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--slate-900)", marginBottom: "0.5rem" }}>
              Application Received!
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Thank you for listing <strong>{form.name}</strong> on SaaS MRKT. Our software curation team has queued your listing for manual quality and code safety verification.
            </p>

            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "14px",
                padding: "1.25rem",
                display: "inline-block",
                border: "1px solid var(--slate-200)",
                marginBottom: "2rem",
              }}
            >
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)", fontWeight: 700 }}>
                Submission Tracking ID
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)", fontFamily: "monospace" }}>
                {submissionId}
              </div>
            </div>

            <div style={{ textAlign: "left", background: "#EFF6FF", borderRadius: "14px", padding: "1.25rem", marginBottom: "2.5rem", border: "1px solid #BFDBFE" }}>
              <div style={{ fontWeight: 700, color: "#1E40AF", fontSize: "0.95rem", marginBottom: "0.4rem" }}>
                What happens next?
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "#1E3A8A", lineHeight: 1.6 }}>
                <li>Our team verifies SSL security, refund terms, and API stability (average 24–48 hours).</li>
                <li>You will receive an activation email at <strong>{form.founderEmail}</strong> to link your payout portal.</li>
                <li>Your product goes live across the catalog and dynamic category pages!</li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/vendor"
                style={{
                  background: "var(--primary)",
                  color: "#ffffff",
                  padding: "0.8rem 1.75rem",
                  borderRadius: "12px",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>Manage in Vendor Dashboard</span>
                <span>→</span>
              </Link>
              <Link
                href="/products"
                style={{
                  background: "#F1F5F9",
                  color: "#334155",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Browse Marketplace
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                }}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--slate-200)",
                  color: "var(--slate-700)",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Submit Another Tool
              </button>
            </div>
          </div>
        ) : (
          /* Form & Live Preview Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Left Column: Form Wizard */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                border: "1px solid var(--slate-200)",
                padding: "2.25rem",
                boxShadow: "0 6px 24px rgba(15, 23, 42, 0.04)",
              }}
            >
              {currentStep === 1 && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.35rem" }}>
                    1. Product Essentials
                  </h3>
                  <p style={{ color: "var(--slate-500)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Provide basic identifiers and positioning for your software.
                  </p>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. DocuSprint AI"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Primary Software Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                        background: "#ffffff",
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Catchy One-Line Tagline *
                    </label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                      placeholder="e.g. AI-assisted sprint documentation"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Official Website or App URL *
                    </label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://yourdomain.com"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Brand Theme Color
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {brandColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setForm({ ...form, brandColor: color })}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: color,
                            border: form.brandColor === color ? "3px solid #0F172A" : "1px solid transparent",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.35rem" }}>
                    2. Pricing &amp; Features
                  </h3>
                  <p style={{ color: "var(--slate-500)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Configure what buyers pay and highlight your top capabilities.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                        Starting Price ($) *
                      </label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="29"
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "10px",
                          border: "1px solid var(--slate-200)",
                          fontSize: "0.95rem",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                        Billing Period *
                      </label>
                      <select
                        value={form.period}
                        onChange={(e) => setForm({ ...form, period: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "10px",
                          border: "1px solid var(--slate-200)",
                          fontSize: "0.95rem",
                          outline: "none",
                          background: "#ffffff",
                        }}
                      >
                        <option value="mo">Per Month (mo)</option>
                        <option value="yr">Per Year (yr)</option>
                        <option value="lifetime">Lifetime Deal</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Target Customer Segment
                    </label>
                    <input
                      type="text"
                      value={form.targetAudience}
                      onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                      placeholder="e.g. Engineering squads, Solo developers"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)" }}>
                        Key Features / Specs ({form.features.length}/5)
                      </label>
                      {form.features.length < 5 && (
                        <button
                          type="button"
                          onClick={addFeature}
                          style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
                        >
                          + Add Feature
                        </button>
                      )}
                    </div>
                    {form.features.map((feat, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          placeholder={`Feature ${idx + 1}`}
                          style={{
                            flex: 1,
                            padding: "0.65rem 0.9rem",
                            borderRadius: "8px",
                            border: "1px solid var(--slate-200)",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                        />
                        {form.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            style={{ background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: "8px", padding: "0 0.75rem", cursor: "pointer" }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", marginBottom: "0.35rem" }}>
                    3. Founder Payout &amp; Terms
                  </h3>
                  <p style={{ color: "var(--slate-500)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Tell us where to send your software transaction payouts.
                  </p>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Founder / Rep Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.founderName}
                      onChange={(e) => setForm({ ...form, founderName: e.target.value })}
                      placeholder="e.g. Zack Robinson"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Work Email for Verification *
                    </label>
                    <input
                      type="email"
                      value={form.founderEmail}
                      onChange={(e) => setForm({ ...form, founderEmail: e.target.value })}
                      placeholder="zack@docusprint.io"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-700)", marginBottom: "0.4rem" }}>
                      Preferred Payout Rail
                    </label>
                    <select
                      value={form.payoutMethod}
                      onChange={(e) => setForm({ ...form, payoutMethod: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--slate-200)",
                        fontSize: "0.95rem",
                        outline: "none",
                        background: "#ffffff",
                      }}
                    >
                      <option value="stripe">Stripe Connect Direct Deposit</option>
                      <option value="wire">International Bank Wire (SWIFT)</option>
                      <option value="paypal">PayPal Business</option>
                    </select>
                  </div>

                  <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "1rem", border: "1px solid var(--slate-200)", marginBottom: "1.5rem" }}>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", fontSize: "0.88rem", color: "var(--slate-700)", lineHeight: 1.5 }}>
                      <input
                        type="checkbox"
                        checked={form.agreeEscrow}
                        onChange={(e) => setForm({ ...form, agreeEscrow: e.target.checked })}
                        style={{ marginTop: "0.2rem", accentColor: "var(--primary)" }}
                      />
                      <span>
                        I agree to the SaaS MRKT <strong>30-Day Escrow Policy</strong> and confirm that my software is free from malware and operates as advertised.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    style={{
                      background: "#F1F5F9",
                      color: "var(--slate-700)",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === 3 && !form.agreeEscrow}
                  style={{
                    background: "var(--primary)",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.75rem 2rem",
                    borderRadius: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                    opacity: currentStep === 3 && !form.agreeEscrow ? 0.6 : 1,
                  }}
                >
                  {currentStep === 3 ? "Submit Product Application ✓" : "Continue →"}
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Card Preview */}
            <div style={{ position: "sticky", top: "100px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.05em" }}>
                  Live Marketplace Preview
                </span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} />
              </div>

              {/* Simulated Marketplace Product Card */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  border: "1px solid var(--slate-200)",
                  padding: "1.75rem",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.25rem",
                    background: "#ECFDF5",
                    color: "#059669",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                  }}
                >
                  New Submission
                </div>

                {/* Logo & Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: form.brandColor,
                      color: "#ffffff",
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {form.name ? form.name.charAt(0) : "S"}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>
                      {form.name || "Software Name"}
                    </h4>
                    <span style={{ fontSize: "0.82rem", color: "var(--slate-500)", fontWeight: 500 }}>
                      {form.category}
                    </span>
                  </div>
                </div>

                <p style={{ color: "var(--slate-600)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                  {form.tagline || "Your product tagline will appear here."}
                </p>

                {/* Features List */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-500)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    Features
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.88rem", color: "var(--slate-700)", lineHeight: 1.6 }}>
                    {form.features.filter(Boolean).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & CTA Preview */}
                <div
                  style={{
                    background: "#F8FAFC",
                    borderRadius: "14px",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>
                      Pricing
                    </div>
                    <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--slate-900)" }}>
                      ${form.price || "0"}
                      <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--slate-500)" }}>/{form.period}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      background: "var(--primary)",
                      color: "#ffffff",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "10px",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                    }}
                  >
                    Buy Tool
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
