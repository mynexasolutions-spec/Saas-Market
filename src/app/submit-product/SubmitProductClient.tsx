"use client";

import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { VendorSaaSListing } from "@/utils/vendorProducts";
import "@/app/buyers/buyers-page.css";
import "./submit-product.css";

interface FormState {
  name: string;
  category: string;
  tagline: string;
  website: string;
  description: string;
  brandColor: string;
  logo: string;
  image: string;
  pricingModel: string;
  price: string;
  period: string;
  targetAudience: string;
  features: string[];
  founderName: string;
  founderEmail: string;
  agreeEscrow: boolean;
}

type FieldName = keyof Omit<FormState, "features" | "agreeEscrow"> | "features" | "agreeEscrow";
type FormErrors = Partial<Record<FieldName | "storage", string>>;

const CATEGORIES = [
  "Project Management",
  "CRM & Sales",
  "HR & Payroll",
  "Accounting & Finance",
  "Marketing",
  "Customer Support",
  "Developer Tools",
  "Analytics & BI",
  "Security & Compliance",
];

const BRAND_COLORS = ["#4F46E5", "#2563EB", "#7C3AED", "#059669", "#D97706", "#DB2777", "#0F172A"];

const INITIAL_FORM: FormState = {
  name: "",
  category: "",
  tagline: "",
  website: "",
  description: "",
  brandColor: "#4F46E5",
  logo: "",
  image: "",
  pricingModel: "Subscription",
  price: "",
  period: "mo",
  targetAudience: "",
  features: ["", "", ""],
  founderName: "",
  founderEmail: "",
  agreeEscrow: false,
};

const STEPS = [
  { number: 1, label: "Product & Visuals" },
  { number: 2, label: "Offer & Pricing" },
  { number: 3, label: "Review & Submit" },
];

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getStepErrors(step: number, form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (step === 1) {
    if (!form.name.trim()) errors.name = "Enter the product name buyers will recognize.";
    if (!form.category) errors.category = "Choose the closest primary category.";
    if (form.tagline.trim().length < 12) errors.tagline = "Use at least 12 characters to explain the core value.";
    if (!isValidUrl(form.website.trim())) errors.website = "Enter a complete URL, including https://.";
    if (form.description.trim().length < 60) errors.description = "Add at least 60 characters so buyers understand the product.";
    if (!form.logo) errors.logo = "Upload a square product logo.";
    if (!form.image) errors.image = "Upload a clear product screenshot.";
  }
  if (step === 2) {
    if (!form.pricingModel) errors.pricingModel = "Select how customers pay.";
    if (form.pricingModel !== "Free" && (!(Number(form.price) > 0) || !Number.isFinite(Number(form.price)))) {
      errors.price = "Enter a starting price greater than zero.";
    }
    if (form.features.filter((feature) => feature.trim()).length < 3) {
      errors.features = "Add at least three specific benefits or capabilities.";
    }
  }
  if (step === 3) {
    if (!form.founderName.trim()) errors.founderName = "Enter the name of the listing contact.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.founderEmail.trim())) {
      errors.founderEmail = "Enter a valid work email address.";
    }
    if (!form.agreeEscrow) errors.agreeEscrow = "Confirm the listing terms before submitting.";
  }
  return errors;
}

function RequiredMark() {
  return <span className="submit-req" aria-hidden="true">*</span>;
}

export default function SubmitProductClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionId, setSubmissionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, storage: undefined }));
  };

  const focusFirstError = (nextErrors: FormErrors) => {
    const firstField = Object.keys(nextErrors)[0];
    window.setTimeout(() => {
      document.querySelector<HTMLElement>(`[data-field="${firstField}"]`)?.focus();
    }, 0);
  };

  const handleImage = (field: "logo" | "image", maxBytes: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const input = event.currentTarget;
    const supportedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (!supportedTypes.has(file.type)) {
      const nextErrors = { ...errors, [field]: "Choose a PNG, JPG, or WebP image." };
      setErrors(nextErrors);
      input.value = "";
      return;
    }
    if (file.size > maxBytes) {
      const label = maxBytes < 500_000 ? "400 KB" : "1.2 MB";
      setErrors((current) => ({ ...current, [field]: `Choose an image smaller than ${label}.` }));
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") {
        setErrors((current) => ({ ...current, [field]: "We could not read that image. Try another file." }));
        input.value = "";
        return;
      }
      setField(field, reader.result);
      input.value = "";
    });
    reader.addEventListener("error", () => {
      setErrors((current) => ({ ...current, [field]: "We could not read that image. Try another file." }));
      input.value = "";
    });
    reader.readAsDataURL(file);
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...form.features];
    features[index] = value;
    setField("features", features);
  };

  const submitListing = async () => {
    setIsSubmitting(true);
    const newId = `prod-${Math.floor(10000 + Math.random() * 90000)}`;
    const listing: VendorSaaSListing = {
      id: newId,
      name: form.name.trim(),
      category: form.category,
      tagline: form.tagline.trim(),
      price: form.pricingModel === "Free" ? 0 : Number(form.price),
      period: form.pricingModel === "One-time purchase" ? "once" : form.period,
      pricingModel: form.pricingModel,
      description: form.description.trim(),
      website: form.website.trim(),
      brandColor: form.brandColor,
      brandLetter: form.name.trim().slice(0, 2).toUpperCase() || "SM",
      logo: form.logo,
      image: form.image,
      targetAudience: form.targetAudience.trim(),
      features: form.features.map((feature) => feature.trim()).filter(Boolean),
      status: "Under Review",
      inquiriesCount: 0,
      viewsCount: 0,
      listedDate: "Just now",
      sellerName: form.founderName.trim(),
    };

    try {
      const response = await fetch("/api/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "listing", listing }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed.");
      setSubmissionId(newId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrors({ storage: error instanceof Error ? error.message : "Submission failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    const nextErrors = getStepErrors(currentStep, form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }
    if (currentStep < 3) {
      setCurrentStep((step) => step + 1);
      window.scrollTo({ top: 80, behavior: "smooth" });
      return;
    }
    submitListing();
  };

  const priceLabel =
    form.pricingModel === "Free"
      ? "Free"
      : form.price
      ? `$${form.price}${form.pricingModel === "Subscription" ? `/${form.period}` : " once"}`
      : "Price pending";

  if (submissionId) {
    return (
      <PageLayout activeNav="sellers" noContainer>
        <div className="submit-page-wrapper">
          <div className="submit-container">
            <section className="submit-success-card">
              <div className="submit-success-icon" aria-hidden="true">✓</div>
              <div className="submit-hero-pill">SUBMISSION RECEIVED</div>
              <h1 className="submit-success-title">{form.name} is now under review</h1>
              <p className="submit-success-desc">
                Our marketplace curation team will verify your product details and contact you at{" "}
                <strong>{form.founderEmail}</strong>, usually within 24–48 hours.
              </p>

              <div className="submit-tracking-box">
                <span className="submit-tracking-label">Tracking ID</span>
                <strong className="submit-tracking-code">{submissionId}</strong>
              </div>

              <div className="submit-next-steps-box">
                <strong>What happens next:</strong>
                <ol>
                  <li>We review your screenshots, domain ownership, and malware scans.</li>
                  <li>You connect bank or Stripe payouts only after listing approval.</li>
                  <li>Your approved software listing goes live to 85,000+ software buyers.</li>
                </ol>
              </div>

              <div className="submit-success-actions">
                <Link className="buyers-btn-primary" href="/vendor">
                  Open Vendor Dashboard
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link className="buyers-btn-secondary" href="/products">
                  Browse Marketplace
                </Link>
              </div>
            </section>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout activeNav="sellers" noContainer>
      <div className="submit-page-wrapper">
        <div className="submit-container">
          {/* 1. Breadcrumb: ⌂ Home › Submit & List Your SaaS */}
          <nav className="submit-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="submit-breadcrumb-sep">›</span>
            <span className="submit-breadcrumb-current">Submit &amp; List Your SaaS</span>
          </nav>

          {/* 2. Compact Hero Section */}
          <header className="submit-hero">
            <div className="submit-hero-pill">FOR SAAS FOUNDERS &amp; VENDORS</div>

            <h1 className="submit-hero-title">
              List Your SaaS with{" "}
              <span className="submit-title-gradient">Zero Risk</span>
            </h1>

            <p className="submit-hero-desc">
              Give buyers the essentials they need. You can connect payouts and add advanced details after approval.
            </p>

            {/* 3 Hero Trust Badges (Exact /buyers scale: 0.95rem num, 0.73rem label) */}
            {/* <div className="submit-hero-badges">
              <div className="submit-badge-item">
                <div className="submit-badge-icon icon-green">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="submit-badge-text">
                  <span className="submit-badge-num">0 Upfront</span>
                  <span className="submit-badge-label">Free To Submit &amp; List</span>
                </div>
              </div>

              <div className="submit-badge-item">
                <div className="submit-badge-icon icon-purple">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="submit-badge-text">
                  <span className="submit-badge-num">85,000+</span>
                  <span className="submit-badge-label">Active Verified Buyers</span>
                </div>
              </div>

              <div className="submit-badge-item">
                <div className="submit-badge-icon icon-blue">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="submit-badge-text">
                  <span className="submit-badge-num">100% Escrow</span>
                  <span className="submit-badge-label">Guaranteed Payouts</span>
                </div>
              </div>
            </div> */}

            {/* 3. Modern Compact Stepper */}
            <div className="submit-stepper" aria-label={`Step ${currentStep} of 3`}>
              {STEPS.map((step) => {
                const isCurrent = currentStep === step.number;
                const isComplete = currentStep > step.number;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => {
                      if (step.number < currentStep) {
                        setErrors({});
                        setCurrentStep(step.number);
                      }
                    }}
                    className={`submit-step-node ${isCurrent ? "is-current" : ""} ${isComplete ? "is-complete" : ""}`}
                  >
                    <span className="submit-step-circle">
                      {isComplete ? "✓" : step.number}
                    </span>
                    <span className="submit-step-label">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </header>

          {/* 4. Main 2-Column Grid (Form + Sticky Live Preview) */}
          <div className="submit-grid">
            <section className="submit-form-card" aria-labelledby="submit-form-title">
              <div className="submit-form-header">
                <span className="submit-form-eyebrow">Step {currentStep} of 3</span>
                <h2 id="submit-form-title" className="submit-form-title">
                  {currentStep === 1
                    ? "Product Essentials & Visuals"
                    : currentStep === 2
                    ? "Pricing & Key Value Props"
                    : "Founder Contact & Verification"}
                </h2>
                <p className="submit-form-desc">
                  {currentStep === 1
                    ? "Provide core product information and screenshots buyers see first."
                    : currentStep === 2
                    ? "Specify your pricing model and primary software capabilities."
                    : "Confirm listing details and contact preferences before submission."}
                </p>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="submit-error-banner" role="alert">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Please check the highlighted fields below.</span>
                </div>
              )}

              {/* STEP 1: Product Essentials */}
              {currentStep === 1 && (
                <div className="submit-fields-stack">
                  <div className="submit-fields-row">
                    <label className="submit-field">
                      <span className="submit-field-label">
                        <span>Product Name <RequiredMark /></span>
                      </span>
                      <input
                        data-field="name"
                        className={`submit-input ${errors.name ? "has-error" : ""}`}
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="e.g. TaskFlow Pro"
                      />
                      {errors.name && <small className="submit-error-text">{errors.name}</small>}
                    </label>

                    <label className="submit-field">
                      <span className="submit-field-label">
                        <span>Primary Category <RequiredMark /></span>
                      </span>
                      <select
                        data-field="category"
                        className={`submit-select ${errors.category ? "has-error" : ""}`}
                        value={form.category}
                        onChange={(e) => setField("category", e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((cat) => (
                          <option value={cat} key={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {errors.category && <small className="submit-error-text">{errors.category}</small>}
                    </label>
                  </div>

                  <label className="submit-field">
                    <span className="submit-field-label">
                      <span>One-Line Value Proposition <RequiredMark /></span>
                      <span className="submit-field-opt">{form.tagline.length}/100</span>
                    </span>
                    <input
                      data-field="tagline"
                      className={`submit-input ${errors.tagline ? "has-error" : ""}`}
                      maxLength={100}
                      value={form.tagline}
                      onChange={(e) => setField("tagline", e.target.value)}
                      placeholder="What outcome or superpower does your product deliver?"
                    />
                    <small className={errors.tagline ? "submit-error-text" : "submit-help-text"}>
                      {errors.tagline || "Min 12 characters · Focus on customer outcome."}
                    </small>
                  </label>

                  <label className="submit-field">
                    <span className="submit-field-label">
                      <span>Product Website URL <RequiredMark /></span>
                    </span>
                    <input
                      data-field="website"
                      type="url"
                      className={`submit-input ${errors.website ? "has-error" : ""}`}
                      value={form.website}
                      onChange={(e) => setField("website", e.target.value)}
                      placeholder="https://yourproduct.com"
                    />
                    {errors.website && <small className="submit-error-text">{errors.website}</small>}
                  </label>

                  <label className="submit-field">
                    <span className="submit-field-label">
                      <span>Product Overview &amp; Description <RequiredMark /></span>
                      <span className="submit-field-opt">{form.description.length}/600</span>
                    </span>
                    <textarea
                      data-field="description"
                      className={`submit-textarea ${errors.description ? "has-error" : ""}`}
                      maxLength={600}
                      rows={4}
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="Explain the problem solved, target team size, and key differentiators."
                    />
                    <small className={errors.description ? "submit-error-text" : "submit-help-text"}>
                      {errors.description || "Min 60 characters · Aim for 2–4 concise sentences."}
                    </small>
                  </label>

                  {/* Brand Color Swatches */}
                  <div className="submit-color-section">
                    <span className="submit-color-label">Brand Color Accent</span>
                    <div className="submit-swatches">
                      {BRAND_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Select color ${color}`}
                          className={`submit-swatch-btn ${form.brandColor === color ? "is-active" : ""}`}
                          onClick={() => setField("brandColor", color)}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Upload Grid */}
                  <div className="submit-upload-grid">
                    <label className={`submit-upload-box ${errors.logo ? "has-error" : ""}`}>
                      <input
                        data-field="logo"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImage("logo", 400_000)}
                        type="file"
                      />
                      <span className="submit-upload-title">Product Logo <RequiredMark /></span>
                      <span className="submit-upload-sub">Square · max 400 KB</span>
                      {form.logo ? (
                        <Image
                          alt="Uploaded product logo"
                          className="submit-logo-preview"
                          height={60}
                          src={form.logo}
                          unoptimized
                          width={60}
                        />
                      ) : (
                        <div className="submit-upload-icon">+</div>
                      )}
                      {errors.logo && <small className="submit-error-text">{errors.logo}</small>}
                    </label>

                    <label className={`submit-upload-box ${errors.image ? "has-error" : ""}`}>
                      <input
                        data-field="image"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImage("image", 1_200_000)}
                        type="file"
                      />
                      <span className="submit-upload-title">Product Screenshot <RequiredMark /></span>
                      <span className="submit-upload-sub">16:9 ratio · max 1.2 MB</span>
                      {form.image ? (
                        <>
                          <Image
                            alt="Uploaded screenshot"
                            className="submit-image-preview"
                            fill
                            sizes="(max-width: 800px) 100vw, 320px"
                            src={form.image}
                            unoptimized
                          />
                          <span className="submit-replace-pill">Replace Screenshot</span>
                        </>
                      ) : (
                        <div className="submit-upload-icon">+</div>
                      )}
                      {errors.image && <small className="submit-error-text">{errors.image}</small>}
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: Pricing and Key Benefits */}
              {currentStep === 2 && (
                <div className="submit-fields-stack">
                  <label className="submit-field">
                    <span className="submit-field-label">
                      <span>Pricing Model <RequiredMark /></span>
                    </span>
                    <select
                      data-field="pricingModel"
                      className={`submit-select ${errors.pricingModel ? "has-error" : ""}`}
                      value={form.pricingModel}
                      onChange={(e) => setField("pricingModel", e.target.value)}
                    >
                      <option value="Subscription">Subscription</option>
                      <option value="One-time purchase">One-time purchase</option>
                      <option value="Free">Free</option>
                    </select>
                    {errors.pricingModel && <small className="submit-error-text">{errors.pricingModel}</small>}
                  </label>

                  {form.pricingModel !== "Free" && (
                    <div className="submit-fields-row">
                      <label className="submit-field">
                        <span className="submit-field-label">
                          <span>Starting Price (USD) <RequiredMark /></span>
                        </span>
                        <input
                          data-field="price"
                          type="number"
                          min="1"
                          inputMode="decimal"
                          className={`submit-input ${errors.price ? "has-error" : ""}`}
                          value={form.price}
                          onChange={(e) => setField("price", e.target.value)}
                          placeholder="29"
                        />
                        {errors.price && <small className="submit-error-text">{errors.price}</small>}
                      </label>

                      {form.pricingModel === "Subscription" && (
                        <label className="submit-field">
                          <span className="submit-field-label">
                            <span>Billing Period <RequiredMark /></span>
                          </span>
                          <select
                            className="submit-select"
                            value={form.period}
                            onChange={(e) => setField("period", e.target.value)}
                          >
                            <option value="mo">Per month (/mo)</option>
                            <option value="yr">Per year (/yr)</option>
                          </select>
                        </label>
                      )}
                    </div>
                  )}

                  <label className="submit-field">
                    <span className="submit-field-label">
                      <span>Target Audience <span className="submit-field-opt">Optional</span></span>
                    </span>
                    <input
                      className="submit-input"
                      value={form.targetAudience}
                      onChange={(e) => setField("targetAudience", e.target.value)}
                      placeholder="e.g. B2B SaaS teams, Agencies, Freelancers"
                    />
                    <small className="submit-help-text">Who gets the most ROI from this tool?</small>
                  </label>

                  <div className="submit-features-section" data-field="features">
                    <div className="submit-features-head">
                      <span>Key Features &amp; Benefits <RequiredMark /></span>
                      <span className="submit-features-count">
                        {form.features.filter((f) => f.trim()).length}/5 Added
                      </span>
                    </div>

                    {form.features.map((feature, idx) => (
                      <div className="submit-feature-row" key={idx}>
                        <span className="submit-feature-check">✓</span>
                        <input
                          className="submit-input"
                          value={feature}
                          onChange={(e) => updateFeature(idx, e.target.value)}
                          placeholder={idx === 0 ? "e.g. Automated weekly sprint velocity reports" : `Feature #${idx + 1}`}
                        />
                        {form.features.length > 3 && (
                          <button
                            type="button"
                            className="submit-feature-del"
                            aria-label={`Remove benefit ${idx + 1}`}
                            onClick={() =>
                              setField(
                                "features",
                                form.features.filter((_, fIdx) => fIdx !== idx)
                              )
                            }
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    {form.features.length < 5 && (
                      <button
                        type="button"
                        className="submit-add-feature-btn"
                        onClick={() => setField("features", [...form.features, ""])}
                      >
                        + Add Another Benefit
                      </button>
                    )}
                    {errors.features && <small className="submit-error-text">{errors.features}</small>}
                  </div>
                </div>
              )}

              {/* STEP 3: Review and Contact Details */}
              {currentStep === 3 && (
                <div className="submit-fields-stack">
                  <div className="submit-review-card">
                    <div className="submit-review-item">
                      <span className="submit-review-label">Product</span>
                      <span className="submit-review-val">{form.name || "Untitled"}</span>
                      <span className="submit-review-sub">{form.category || "Uncategorized"}</span>
                    </div>
                    <div className="submit-review-item">
                      <span className="submit-review-label">Pricing</span>
                      <span className="submit-review-val">{priceLabel}</span>
                      <span className="submit-review-sub">{form.pricingModel}</span>
                    </div>
                    <button
                      type="button"
                      className="submit-review-edit"
                      onClick={() => setCurrentStep(1)}
                    >
                      Edit Info
                    </button>
                  </div>

                  <div className="submit-payout-note">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <div>
                      <strong>No payout setup required today.</strong> You only need to connect a payout account after your listing passes quality and security review.
                    </div>
                  </div>

                  <div className="submit-fields-row">
                    <label className="submit-field">
                      <span className="submit-field-label">
                        <span>Founder / Contact Name <RequiredMark /></span>
                      </span>
                      <input
                        data-field="founderName"
                        className={`submit-input ${errors.founderName ? "has-error" : ""}`}
                        value={form.founderName}
                        onChange={(e) => setField("founderName", e.target.value)}
                        placeholder="Alex Morgan"
                      />
                      {errors.founderName && <small className="submit-error-text">{errors.founderName}</small>}
                    </label>

                    <label className="submit-field">
                      <span className="submit-field-label">
                        <span>Work Email Address <RequiredMark /></span>
                      </span>
                      <input
                        data-field="founderEmail"
                        type="email"
                        className={`submit-input ${errors.founderEmail ? "has-error" : ""}`}
                        value={form.founderEmail}
                        onChange={(e) => setField("founderEmail", e.target.value)}
                        placeholder="alex@company.com"
                      />
                      {errors.founderEmail && <small className="submit-error-text">{errors.founderEmail}</small>}
                    </label>
                  </div>

                  <label className={`submit-consent-row ${errors.agreeEscrow ? "has-error" : ""}`}>
                    <input
                      type="checkbox"
                      checked={form.agreeEscrow}
                      onChange={(e) => setField("agreeEscrow", e.target.checked)}
                    />
                    <span>
                      I confirm that I own or hold valid commercial distribution rights for this software, and agree to the 30-day buyer escrow terms. <RequiredMark />
                    </span>
                  </label>
                  {errors.agreeEscrow && <small className="submit-error-text">{errors.agreeEscrow}</small>}

                  {errors.storage && <div className="submit-error-banner">{errors.storage}</div>}
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="submit-actions">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    className="buyers-btn-secondary"
                    onClick={() => {
                      setErrors({});
                      setCurrentStep((s) => s - 1);
                    }}
                  >
                    ← Previous Step
                  </button>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  className="buyers-btn-primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentStep === 3
                    ? "Submit Software Listing"
                    : "Save & Continue →"}
                </button>
              </div>
            </section>

            {/* 5. Sticky Live Marketplace Preview */}
            <aside className="submit-preview-col">
              <div className="submit-preview-top-bar">
                <span className="submit-live-dot" />
                Live Marketplace Preview
              </div>

              <article className="submit-preview-card">
                <div className="submit-preview-img-box">
                  {form.image ? (
                    <Image
                      alt="Product screenshot preview"
                      fill
                      sizes="(max-width: 900px) 100vw, 440px"
                      src={form.image}
                      unoptimized
                    />
                  ) : (
                    <div className="submit-preview-placeholder">
                      <span className="submit-preview-placeholder-icon">▣</span>
                      <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>Screenshot Preview</strong>
                      <small style={{ fontSize: "0.78rem" }}>Upload a 16:9 screenshot to bring your listing to life.</small>
                    </div>
                  )}
                </div>

                <div className="submit-preview-body">
                  <div className="submit-preview-header">
                    <div
                      className="submit-preview-logo-box"
                      style={{ backgroundColor: form.brandColor }}
                    >
                      {form.logo ? (
                        <Image alt="" fill src={form.logo} unoptimized />
                      ) : (
                        form.name.slice(0, 2).toUpperCase() || "SM"
                      )}
                    </div>

                    <div className="submit-preview-name-group">
                      <h3>{form.name || "Your Product Name"}</h3>
                      <span className="submit-preview-cat">{form.category || "Select a category"}</span>
                    </div>

                    <span className="submit-review-pill">Under Review</span>
                  </div>

                  <p className="submit-preview-tagline">
                    {form.tagline || "Your outcome-driven value proposition will appear here."}
                  </p>

                  <div className="submit-preview-features-list">
                    {form.features
                      .filter((f) => f.trim())
                      .slice(0, 3)
                      .map((feat, idx) => (
                        <span key={idx}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {feat}
                        </span>
                      ))}
                  </div>

                  <div className="submit-preview-footer">
                    <div className="submit-preview-footer-left">
                      <small>Starting At</small>
                      <strong>{priceLabel}</strong>
                    </div>
                    <span className="submit-preview-view-btn">View Product</span>
                  </div>
                </div>
              </article>

              <p className="submit-preview-tip">
                <strong style={{ color: "#334155" }}>Real-time simulator:</strong> This preview matches how verified buyers browse and compare your software on SaaS MRKT.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
