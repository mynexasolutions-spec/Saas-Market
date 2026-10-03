import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "How It Works | SaaS MRKT",
  description: "Learn how the buying process works on SaaS MRKT. From discovery to deployment.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Discover & Compare",
      desc: "Use our advanced filters to find the exact software category you need. Compare features, pricing, and integrations side-by-side without creating an account.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    },
    {
      number: "02",
      title: "Read Verified Reviews",
      desc: "We only allow reviews from verified users. See what real customers think about the product's onboarding, support, and ROI before making a decision.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    },
    {
      number: "03",
      title: "Purchase or Trial",
      desc: "Connect directly with the software vendor. SaaS MRKT enables you to start free trials instantly or negotiate enterprise contracts securely.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
    }
  ];

  return (
    <PageLayout activeNav="resources">
      <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="section-title">How &nbsp;<span className="section-title-highlight">SaaS MRKT</span>&nbsp; Works</h1>
        <p className="section-subtitle" style={{ maxWidth: "800px", margin: "0 auto" }}>
          We've built a seamless experience that takes you from problem to solution<br /> in minutes, not months.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto 6rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1.75rem",
            background: "var(--white)",
            padding: "2rem",
            borderRadius: "20px",
            border: "1px solid var(--slate-200)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.02)"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              background: "var(--primary-50)",
              borderRadius: "50%",
              color: "var(--primary)",
              fontSize: "1.5rem",
              flexShrink: 0,
              position: "relative"
            }}>
              <span style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "0.8rem", background: "var(--primary)", color: "white", padding: "4px 8px", borderRadius: "12px", fontWeight: "bold" }}>
                {step.number}
              </span>
              {step.icon}
            </div>

            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "0.5rem" }}>{step.title}</h2>
              <p style={{ fontSize: "1.05rem", color: "var(--slate-600)", lineHeight: "1.6" }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", background: "var(--slate-50)", padding: "4rem 2rem", borderRadius: "24px", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "1.5rem" }}>Ready to find your next software?</h2>
        <Link href="/products" className="btn btn-primary" style={{ padding: "0.85rem 2.5rem", fontSize: "1.1rem" }}>
          Start Browsing Products
        </Link>
      </div>
    </PageLayout>
  );
}

