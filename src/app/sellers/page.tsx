import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "For Sellers | SaaS MRKT",
  description: "Learn how to list, showcase, and grow your software business on SaaS MRKT.",
};

export default function SellersPage() {
  const steps = [
    {
      num: "01",
      title: "Create & Verify Your Profile",
      desc: "Claim your software listing, add interactive product tours, API docs, verified pricing tiers, and integration compatibility tags in minutes.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      )
    },
    {
      num: "02",
      title: "Reach Active B2B Decision-Makers",
      desc: "Our search algorithm matches your software with buyers actively filtering for your specific category, tech stack, and company size requirements.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      num: "03",
      title: "Capture Qualified Pipeline (0% Cut)",
      desc: "Receive high-intent demo requests and free trial signups routed directly into your CRM. You own the buyer relationship completely.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    }
  ];

  const benefits = [
    {
      title: "Direct CRM Integration",
      desc: "Connect HubSpot, Salesforce, or webhook pipelines to instantly route trial registrations and demo inquiries to your sales team.",
      badge: "Automation"
    },
    {
      title: "Verified Reviews Program",
      desc: "Build authentic credibility with verified buyer badges and automated testimonial collection from authenticated professionals.",
      badge: "Credibility"
    },
    {
      title: "Competitor Comparison Matrix",
      desc: "Position your software's unique strengths clearly on side-by-side comparison tables where buyers evaluate direct alternatives.",
      badge: "Visibility"
    },
  ];

  const faqs = [
    {
      q: "How long does it take to get my product listed?",
      a: "Most software submissions are reviewed, verified, and published live on the marketplace within 24 to 48 hours after submission."
    },
    {
      q: "Do you charge any commission on software sales?",
      a: "No. SaaS MRKT charges 0% commission on your sales. We only operate on transparent, flat subscription tiers so you keep 100% of your revenue."
    },
    {
      q: "Can I update my product details and pricing anytime?",
      a: "Yes! You have full access to your vendor dashboard to modify pricing plans, feature matrices, video demos, and case studies at any time."
    },
    {
      q: "How do buyers contact my sales team?",
      a: "Buyers can click through directly to your sign-up page or submit a demo request form that routes directly into your chosen CRM or email."
    }
  ];

  return (
    <PageLayout activeNav="sellers" noContainer>
      <div className="sellers-page-wrapper">
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem", marginTop: "1rem" }}>
            <h1 className="section-title">Grow your &nbsp;<span className="section-title-highlight">Software Business</span></h1>
            <p className="section-subtitle" style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
              Get your software in front of 50,000+ qualified buyers actively looking for solutions. No hidden fees, just growth.
            </p>
          </div>

          {/* Hero Overview */}
      <div className="overview-hero-grid sellers-hero-grid">
        <div className="overview-hero-content">
          <h2 className="overview-hero-title">
            Reach buyers when they have high intent
          </h2>
          <p className="overview-hero-desc">
            Buyers on SaaS MRKT aren&apos;t just browsing — they are actively comparing tools to solve a specific problem. By listing your product, you capture demand exactly when it matters.
          </p>
          <div className="overview-hero-actions">
            <Link href="/contact" className="btn btn-primary overview-action-btn">
              Get Started
            </Link>
            <Link href="/contact" className="btn btn-secondary overview-action-btn">
              Talk to Sales
            </Link>
          </div>
        </div>

        <div className="overview-hero-card overview-hero-card--dark">
          <div className="overview-hero-card-glow"></div>
          <span className="overview-card-badge">GROWTH NETWORK</span>
          <h2 className="overview-card-title">Why List with Us?</h2>
          <p className="overview-card-desc">
            We provide a level playing field for both established enterprises and rising startups.
          </p>
          <ul className="overview-card-list">
            {[
              "0% commission on your sales",
              "Verified buyer leads straight to your CRM",
              "Advanced analytics on profile views"
            ].map((item, i) => (
              <li key={i} className="overview-card-item">
                <span className="overview-check-icon">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* How It Works for Sellers */}
      <section style={{ marginBottom: "6rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.75rem" }}>SIMPLE 3-STEP PROCESS</div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "1rem" }}>
            How Selling on SaaS MRKT Works
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            From listing submission to closing your first enterprise contract in three streamlined steps.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {steps.map((step, idx) => (
            <div key={idx} className="seller-step-card" style={{
              borderRadius: "20px",
              padding: "2.5rem 2rem",
              position: "relative",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(94, 75, 238, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {step.icon}
                </div>
                <span style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--slate-300)" }}>{step.num}</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.75rem" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--slate-600)", lineHeight: "1.6" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Seller Advantages Grid */}
      <section className="seller-advantages-panel" style={{ marginBottom: "6rem", padding: "4rem 3rem", borderRadius: "28px" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.75rem" }}>BUILT FOR SCALE</div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "1rem" }}>
            Tools to Accelerate Your Customer Acquisition
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            Everything you need to turn casual visitors into loyal, paying subscribers.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
          {benefits.map((b, i) => (
            <div key={i} className="seller-advantage-card" style={{
              borderRadius: "18px",
              padding: "2rem",
            }}>
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
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.75rem" }}>
                {b.title}
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--slate-600)", lineHeight: "1.65", margin: 0 }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Seller FAQ Section */}
      <section style={{ marginBottom: "6rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.75rem" }}>QUESTIONS & ANSWERS</div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "1rem" }}>
            Frequently Asked Seller Questions
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            Clear answers to help you get the most out of your software storefront.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="seller-faq-card" style={{
              borderRadius: "16px",
              padding: "2rem",
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.75rem" }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--slate-600)", lineHeight: "1.6", margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{
        background: "linear-gradient(135deg, var(--slate-900) 0%, #1e1b4b 100%)",
        borderRadius: "20px",
        padding: "2.75rem 2rem",
        textAlign: "center",
        color: "white",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "620px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: "800", marginBottom: "0.85rem", color: "white" }}>
            Ready to reach 50,000+ software buyers?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--slate-300)", lineHeight: "1.6", marginBottom: "1.75rem" }}>
            List your SaaS tool in under 10 minutes. Get verified leads delivered straight to your inbox with zero commission.
          </p>
          <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary" style={{ padding: "0.7rem 1.6rem", fontSize: "0.925rem" }}>
              Get Listed Now
            </Link>
            <Link href="/contact" className="btn" style={{
              padding: "0.7rem 1.6rem",
              fontSize: "0.925rem",
              background: "rgba(255, 255, 255, 0.12)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "var(--radius-full)",
              fontWeight: 600
            }}>
              Speak with Our Team
            </Link>
          </div>
        </div>
      </section>
        </div>
      </div>
    </PageLayout>
  );
}
