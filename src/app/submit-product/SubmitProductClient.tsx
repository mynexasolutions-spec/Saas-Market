"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import PageLayout from "@/components/PageLayout";
import {
  VendorSaaSListing,
} from "@/utils/vendorProducts";

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

const BRAND_COLORS = ["#5E4BEE", "#2563EB", "#7C3AED", "#059669", "#D97706", "#DB2777", "#0F172A"];

const INITIAL_FORM: FormState = {
  name: "",
  category: "",
  tagline: "",
  website: "",
  description: "",
  brandColor: "#5E4BEE",
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
  { number: 1, label: "Product & visuals" },
  { number: 2, label: "Offer details" },
  { number: 3, label: "Review & submit" },
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
  return <span className="listing-required" aria-hidden="true">*</span>;
}

export default function SubmitProductClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionId, setSubmissionId] = useState<string>("");

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
      brandLetter: form.name.trim().slice(0, 2).toUpperCase(),
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
      const response = await fetch("/api/vendor", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"listing",listing})});
      const result = await response.json();
      if(!response.ok)throw new Error(result.error || "Submission failed.");
      setSubmissionId(newId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrors({ storage: error instanceof Error ? error.message : "Submission failed." });
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
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }
    submitListing();
  };

  const priceLabel = form.pricingModel === "Free"
    ? "Free"
    : form.price
      ? `$${form.price}${form.pricingModel === "Subscription" ? `/${form.period}` : " once"}`
      : "Price pending";

  if (submissionId) {
    return (
      <PageLayout activeNav="sellers" noContainer>
        <main className="listing-page listing-success-page">
          <section className="listing-success-card">
            <span className="listing-success-icon" aria-hidden="true">✓</span>
            <p className="listing-eyebrow">Submission received</p>
            <h1>{form.name} is now in review</h1>
            <p>Our marketplace team will verify the listing and contact you at <strong>{form.founderEmail}</strong>, usually within 24–48 hours.</p>
            <div className="listing-tracking"><span>Tracking ID</span><strong>{submissionId}</strong></div>
            <div className="listing-next-steps">
              <strong>What happens next</strong>
              <ol><li>We review your product details and visuals.</li><li>You connect payouts only after approval.</li><li>Your approved listing becomes visible to buyers.</li></ol>
            </div>
            <div className="listing-success-actions">
              <Link className="listing-primary-button" href="/vendor">Open vendor dashboard <span aria-hidden="true">→</span></Link>
              <Link className="listing-secondary-button" href="/products">Browse marketplace</Link>
            </div>
          </section>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout activeNav="sellers" noContainer>
      <main className="listing-page">
        <header className="listing-hero">
          <p className="listing-eyebrow">Vendor onboarding</p>
          <h1>List your SaaS with confidence</h1>
          <p>Give buyers the essentials they need. You can connect payouts and add advanced details after approval.</p>
          <div className="listing-stepper" aria-label={`Step ${currentStep} of 3`}>
            {STEPS.map((step) => (
              <div className={`listing-step ${currentStep === step.number ? "is-current" : ""} ${currentStep > step.number ? "is-complete" : ""}`} key={step.number}>
                <span>{currentStep > step.number ? "✓" : step.number}</span><small>{step.label}</small>
              </div>
            ))}
          </div>
        </header>

        <div className="listing-layout">
          <section className="listing-form-card" aria-labelledby="listing-form-title">
            <div className="listing-form-heading">
              <p>Step {currentStep} of 3</p>
              <h2 id="listing-form-title">{currentStep === 1 ? "Product essentials" : currentStep === 2 ? "Pricing and key benefits" : "Review and contact"}</h2>
              <span>{currentStep === 1 ? "Start with the information and visuals buyers see first." : currentStep === 2 ? "Keep the offer easy to scan and compare." : "Confirm who we should contact before sending your listing."}</span>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="listing-error-summary" role="alert"><strong>Check the highlighted fields.</strong><span>We saved everything else you entered.</span></div>
            )}

            {currentStep === 1 && (
              <div className="listing-fields">
                <div className="listing-field-row">
                  <label className="listing-field"><span>Product name <RequiredMark /></span><input data-field="name" aria-invalid={Boolean(errors.name)} value={form.name} onChange={(event) => setField("name", event.target.value)} placeholder="e.g. TaskFlow" />{errors.name && <small className="listing-field-error">{errors.name}</small>}</label>
                  <label className="listing-field"><span>Primary category <RequiredMark /></span><select data-field="category" aria-invalid={Boolean(errors.category)} value={form.category} onChange={(event) => setField("category", event.target.value)}><option value="">Select a category</option>{CATEGORIES.map((category) => <option value={category} key={category}>{category}</option>)}</select>{errors.category && <small className="listing-field-error">{errors.category}</small>}</label>
                </div>
                <label className="listing-field"><span>One-line value proposition <RequiredMark /></span><input data-field="tagline" aria-invalid={Boolean(errors.tagline)} maxLength={100} value={form.tagline} onChange={(event) => setField("tagline", event.target.value)} placeholder="What outcome does your product deliver?" /><small className={errors.tagline ? "listing-field-error" : "listing-field-help"}>{errors.tagline || `${form.tagline.length}/100 · Focus on the customer outcome.`}</small></label>
                <label className="listing-field"><span>Product website <RequiredMark /></span><input data-field="website" aria-invalid={Boolean(errors.website)} type="url" value={form.website} onChange={(event) => setField("website", event.target.value)} placeholder="https://yourproduct.com" />{errors.website && <small className="listing-field-error">{errors.website}</small>}</label>
                <label className="listing-field"><span>Product overview <RequiredMark /></span><textarea data-field="description" aria-invalid={Boolean(errors.description)} maxLength={600} rows={5} value={form.description} onChange={(event) => setField("description", event.target.value)} placeholder="Explain the problem, who the product helps, and what makes it different." /><small className={errors.description ? "listing-field-error" : "listing-field-help"}>{errors.description || `${form.description.length}/600 · Aim for 2–4 clear sentences.`}</small></label>
                <fieldset className="listing-color-field"><legend>Brand color</legend><div>{BRAND_COLORS.map((color) => <button aria-label={`Use ${color}`} aria-pressed={form.brandColor === color} className="listing-color-swatch" key={color} onClick={() => setField("brandColor", color)} style={{ backgroundColor: color }} type="button" />)}</div></fieldset>
                <div className="listing-upload-grid">
                  <label className={`listing-upload ${errors.logo ? "has-error" : ""}`}><input data-field="logo" accept="image/png,image/jpeg,image/webp" onChange={handleImage("logo", 400_000)} type="file" /><span className="listing-upload-title">Product logo <RequiredMark /></span><span>Square PNG, JPG or WebP · max 400 KB</span>{form.logo ? <Image alt="Uploaded product logo" className="listing-logo-preview" height={72} src={form.logo} unoptimized width={72} /> : <strong aria-hidden="true">+</strong>}{errors.logo && <small className="listing-field-error">{errors.logo}</small>}</label>
                  <label className={`listing-upload listing-screenshot-upload ${errors.image ? "has-error" : ""}`}><input data-field="image" accept="image/png,image/jpeg,image/webp" onChange={handleImage("image", 1_200_000)} type="file" /><span className="listing-upload-title">Product screenshot <RequiredMark /></span><span>16:10 works best · max 1.2 MB</span>{form.image ? <Image alt="Uploaded product screenshot" className="listing-image-preview" fill sizes="(max-width: 800px) 100vw, 320px" src={form.image} unoptimized /> : <strong aria-hidden="true">+</strong>}{errors.image && <small className="listing-field-error">{errors.image}</small>}</label>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="listing-fields">
                <label className="listing-field"><span>Pricing model <RequiredMark /></span><select data-field="pricingModel" aria-invalid={Boolean(errors.pricingModel)} value={form.pricingModel} onChange={(event) => setField("pricingModel", event.target.value)}><option>Subscription</option><option>One-time purchase</option><option>Free</option></select>{errors.pricingModel && <small className="listing-field-error">{errors.pricingModel}</small>}</label>
                {form.pricingModel !== "Free" && <div className="listing-field-row"><label className="listing-field"><span>Starting price (USD) <RequiredMark /></span><input data-field="price" aria-invalid={Boolean(errors.price)} min="1" inputMode="decimal" type="number" value={form.price} onChange={(event) => setField("price", event.target.value)} placeholder="29" />{errors.price && <small className="listing-field-error">{errors.price}</small>}</label>{form.pricingModel === "Subscription" && <label className="listing-field"><span>Billing period <RequiredMark /></span><select value={form.period} onChange={(event) => setField("period", event.target.value)}><option value="mo">Per month</option><option value="yr">Per year</option></select></label>}</div>}
                <label className="listing-field"><span>Best suited for <em>Optional</em></span><input value={form.targetAudience} onChange={(event) => setField("targetAudience", event.target.value)} placeholder="e.g. Product teams with 10–100 employees" /><small className="listing-field-help">One short audience description is enough.</small></label>
                <fieldset className="listing-feature-field" data-field="features" tabIndex={-1}><div className="listing-feature-heading"><legend>Top benefits <RequiredMark /></legend><span>{form.features.filter((feature) => feature.trim()).length}/5 added</span></div>{form.features.map((feature, index) => <div className="listing-feature-row" key={index}><span aria-hidden="true">✓</span><input aria-label={`Benefit ${index + 1}`} value={feature} onChange={(event) => updateFeature(index, event.target.value)} placeholder={index === 0 ? "e.g. Build reports in minutes, not hours" : `Benefit ${index + 1}`} />{form.features.length > 3 && <button aria-label={`Remove benefit ${index + 1}`} onClick={() => setField("features", form.features.filter((_, featureIndex) => featureIndex !== index))} type="button">×</button>}</div>)}{form.features.length < 5 && <button className="listing-add-feature" onClick={() => setField("features", [...form.features, ""])} type="button">+ Add another benefit</button>}{errors.features && <small className="listing-field-error">{errors.features}</small>}</fieldset>
              </div>
            )}

            {currentStep === 3 && (
              <div className="listing-fields">
                <div className="listing-review-panel"><div><span>Product</span><strong>{form.name}</strong><small>{form.category}</small></div><div><span>Offer</span><strong>{priceLabel}</strong><small>{form.pricingModel}</small></div><button onClick={() => setCurrentStep(1)} type="button">Edit product</button><button onClick={() => setCurrentStep(2)} type="button">Edit offer</button></div>
                <div className="listing-info-note"><strong>No payout details needed yet</strong><span>We only ask you to connect a payout account after the listing passes review.</span></div>
                <div className="listing-field-row"><label className="listing-field"><span>Contact name <RequiredMark /></span><input data-field="founderName" aria-invalid={Boolean(errors.founderName)} value={form.founderName} onChange={(event) => setField("founderName", event.target.value)} placeholder="Full name" />{errors.founderName && <small className="listing-field-error">{errors.founderName}</small>}</label><label className="listing-field"><span>Work email <RequiredMark /></span><input data-field="founderEmail" aria-invalid={Boolean(errors.founderEmail)} type="email" value={form.founderEmail} onChange={(event) => setField("founderEmail", event.target.value)} placeholder="you@company.com" />{errors.founderEmail && <small className="listing-field-error">{errors.founderEmail}</small>}</label></div>
                <label className={`listing-consent ${errors.agreeEscrow ? "has-error" : ""}`} data-field="agreeEscrow" tabIndex={-1}><input checked={form.agreeEscrow} onChange={(event) => setField("agreeEscrow", event.target.checked)} type="checkbox" /><span>I confirm this information is accurate and agree to the marketplace listing and 30-day escrow terms. <RequiredMark /></span>{errors.agreeEscrow && <small className="listing-field-error">{errors.agreeEscrow}</small>}</label>
                {errors.storage && <div className="listing-storage-error" role="alert">{errors.storage}</div>}
              </div>
            )}

            <div className="listing-form-actions">
              {currentStep > 1 ? <button className="listing-back-button" onClick={() => { setErrors({}); setCurrentStep((step) => step - 1); }} type="button">← Back</button> : <span />}
              <button className="listing-primary-button" onClick={handleNext} type="button">{currentStep === 3 ? "Submit for review" : "Save and continue"} <span aria-hidden="true">→</span></button>
            </div>
          </section>

          <aside className="listing-preview-column">
            <div className="listing-preview-label"><span /> Live marketplace preview</div>
            <article className="listing-preview-card">
              <div className="listing-preview-image">{form.image ? <Image alt="Product screenshot preview" fill sizes="(max-width: 900px) 100vw, 440px" src={form.image} unoptimized /> : <div><span aria-hidden="true">▧</span><strong>Your screenshot preview</strong><small>Upload an image to see your listing come to life.</small></div>}</div>
              <div className="listing-preview-body">
                <div className="listing-preview-title"><div className="listing-preview-logo" style={{ backgroundColor: form.brandColor }}>{form.logo ? <Image alt="" fill src={form.logo} unoptimized /> : (form.name.slice(0, 1) || "S")}</div><div><h3>{form.name || "Your product name"}</h3><span>{form.category || "Product category"}</span></div><em>Under review</em></div>
                <p>{form.tagline || "A clear, benefit-led tagline will appear here."}</p>
                <div className="listing-preview-features">{form.features.filter((feature) => feature.trim()).slice(0, 3).map((feature) => <span key={feature}>✓ {feature}</span>)}</div>
                <div className="listing-preview-offer"><div><small>Starting at</small><strong>{priceLabel}</strong></div><span>View product</span></div>
              </div>
            </article>
            <p className="listing-preview-tip"><strong>Preview updates as you type.</strong> Keep your headline concise and use a screenshot with readable interface details.</p>
          </aside>
        </div>
      </main>
    </PageLayout>
  );
}
