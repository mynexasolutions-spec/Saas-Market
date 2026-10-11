import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "B2B SaaS Marketplace for Software Buyers | SaaS MRKT",
  description:
    "Discover how our multi-vendor B2B SaaS marketplace platform helps software buyers evaluate, compare, and acquire verified SaaS products with flexible payment gateways and zero lock-in.",
  keywords: [
    "B2B SaaS marketplace",
    "marketplace for SaaS products",
    "SaaS marketplace platform",
    "multi vendor marketplace SaaS",
    "SaaS payment gateways alternatives",
    "SaaS buyer guide",
  ],
};

export default function BuyersPage() {
  const steps = [
    {
      num: "01",
      title: "Search & Filter Instantly",
      desc: "Browse 2,000+ tools or filter by pricing model, tech stack compatibility, security compliance, and team size.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      num: "02",
      title: "Compare Side-by-Side",
      desc: "Evaluate in-depth feature matrices, real user feedback, hidden renewal fees, and API specs across top alternatives.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      )
    },
    {
      num: "03",
      title: "Trial & Deploy Confidently",
      desc: "Activate instant sandbox trials or unlock exclusive marketplace discounts with zero vendor pressure.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    }
  ];

  const benefits = [
    {
      title: "100% Verified User Reviews",
      desc: "Every review is authenticated through corporate domains and verified work credentials to ensure honest, unbiased ratings.",
      badge: "Authenticity"
    },
    {
      title: "Transparent Pricing Breakdown",
      desc: "No hidden setup fees or surprise renewal jumps. See exact tier pricing, user seats, and annual discounts upfront.",
      badge: "Transparency"
    },
    {
      title: "Direct Vendor Channels",
      desc: "Skip aggressive third-party brokers. Connect directly with product engineers and verified customer success managers.",
      badge: "Direct Access"
    },
  ];

  const faqs = [
    {
      q: "Is SaaS MRKT completely free for buyers?",
      a: "Yes! SaaS MRKT is 100% free for all software buyers, IT teams, and procurement managers. There are no fees or paywalls."
    },
    {
      q: "How do you verify reviews on the platform?",
      a: "Reviewers must authenticate through corporate email domains or verified LinkedIn accounts, and submit verified proof of active usage."
    },
    {
      q: "Can I request a custom enterprise quote?",
      a: "Yes. For teams with 50+ seats or complex compliance requirements, you can request custom vendor proposals directly from any product page."
    },
    {
      q: "Do I need a credit card to start free trials?",
      a: "Most software listings on SaaS MRKT offer instant sandbox access or 14-day free trials with no credit card required."
    }
  ];

  return (
    <PageLayout activeNav="buyers" noContainer>
      <div className="buyers-page-wrapper">
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "3.5rem", marginTop: "1rem" }}>
            <h1 className="section-title">Built for&nbsp;<span className="section-title-highlight">Software Buyers</span></h1>
            <p className="section-subtitle" style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
              We remove the guesswork from buying software. Discover verified tools, compare features side-by-side, and make confident decisions for your team.
            </p>
          </div>

          {/* Hero Overview */}
      <div className="overview-hero-grid buyers-hero-grid">
        <div className="overview-hero-card">
          <div className="overview-hero-card-glow"></div>
          <span className="overview-card-badge">VERIFIED &amp; UNBIASED</span>
          <h2 className="overview-card-title">Verified Reviews &amp; Data</h2>
          <p className="overview-card-desc">
            Stop relying on biased marketing pages. Our platform aggregates verified user reviews, real-world pricing data, and deep integration specs so you know exactly what you&apos;re buying.
          </p>
          <ul className="overview-card-list">
            {[
              "Unbiased user testimonials",
              "Transparent pricing history",
              "Deep technical specifications"
            ].map((item, i) => (
              <li key={i} className="overview-card-item">
                <span className="overview-check-icon">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overview-hero-content">
          <h2 className="overview-hero-title">
            Streamline your procurement process
          </h2>
          <p className="overview-hero-desc">
            Whether you are an enterprise IT manager or a startup founder, SaaS MRKT gives you the tools to evaluate software faster and negotiate better contracts.
          </p>
          <div className="overview-hero-actions">
            <Link href="/products" className="btn btn-primary overview-action-btn">
              Start Browsing
            </Link>
            <Link href="/categories" className="btn btn-secondary overview-action-btn">
              View Categories
            </Link>
          </div>

          <div className="overview-trust-row">
            <div className="overview-trust-item">
              <strong>2,000+</strong>
              <span>Verified Tools</span>
            </div>
            <div className="overview-trust-divider"></div>
            <div className="overview-trust-item">
              <strong>50,000+</strong>
              <span>Active Buyers</span>
            </div>
            <div className="overview-trust-divider"></div>
            <div className="overview-trust-item">
              <strong>100%</strong>
              <span>Free to Use</span>
            </div>
          </div>
        </div>
      </div>

      {/* How Buying Works */}
      <section style={{ marginBottom: "5.5rem" }}>
        <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.75rem" }}>THE BUYER JOURNEY</div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "1rem" }}>
            How Buying on SaaS MRKT Works
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1.05rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            From initial research to seamless team deployment in three simple steps.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {steps.map((step, idx) => (
            <div key={idx} className="buyer-step-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div className="buyer-step-icon-wrap">
                  {step.icon}
                </div>
                <span className="buyer-step-num">{step.num}</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.5rem" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.925rem", color: "var(--slate-600)", lineHeight: "1.6", margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Buyer Advantages Grid */}
      <section className="page-padded-section buyer-advantages-panel" style={{ marginBottom: "5.5rem", padding: "3.5rem 2.5rem", borderRadius: "24px" }}>
        <div className="section-header" style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.75rem" }}>UNBIASED &amp; TRANSPARENT</div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "1rem" }}>
            Why Modern Teams Trust SaaS MRKT
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1.05rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            Everything you need to make confident, data-backed software purchasing decisions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {benefits.map((b, i) => (
            <div key={i} className="buyer-advantage-card">
              <span style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--primary)",
                marginBottom: "0.75rem"
              }}>
                {b.badge}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.6rem" }}>
                {b.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--slate-600)", lineHeight: "1.6", margin: 0 }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Buyer FAQ Section */}
      <section style={{ marginBottom: "5.5rem" }}>
        <div className="section-header" style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.75rem" }}>BUYER FAQS</div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "1rem" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1.05rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            Common questions about finding, evaluating, and purchasing software on our platform.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="buyer-faq-card" style={{
              borderRadius: "16px",
              padding: "1.75rem",
            }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.6rem" }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--slate-600)", lineHeight: "1.6", margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Buyer CTA Banner */}
      <section className="page-padded-section" style={{
        background: "linear-gradient(135deg, var(--slate-900) 0%, #1e1b4b 100%)",
        borderRadius: "20px",
        padding: "2.75rem 2rem",
        textAlign: "center",
        color: "white",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: "800", marginBottom: "0.85rem", color: "white" }}>
            Ready to find the right software?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--slate-300)", lineHeight: "1.6", marginBottom: "1.75rem" }}>
            Join 50,000+ businesses discovering vetted software solutions with transparent pricing and verified reviews.
          </p>
          <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary" style={{ padding: "0.7rem 1.6rem", fontSize: "0.925rem" }}>
              Browse All Products
            </Link>
            <Link href="/categories" className="btn" style={{
              padding: "0.7rem 1.6rem",
              fontSize: "0.925rem",
              background: "rgba(255, 255, 255, 0.12)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "var(--radius-full)",
              fontWeight: 600
            }}>
              Explore Categories
            </Link>
          </div>
        </div>
      </section>
        </div>
      </div>
    </PageLayout>
  );
}
