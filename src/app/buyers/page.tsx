import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "For Buyers | SaaS MRKT",
  description: "Discover how SaaS MRKT helps buyers find, compare, and purchase the best software.",
};

export default function BuyersPage() {
  return (
    <PageLayout activeNav="buyers">
      <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="section-title">Built for&nbsp;<span className="section-title-highlight">Software Buyers</span></h1>
        <p className="section-subtitle" style={{ maxWidth: "800px", margin: "0 auto" }}>
          We remove the guesswork from buying software. Discover verified tools, compare features side-by-side, and make confident decisions for your team.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", marginBottom: "6rem" }}>
        <div style={{ background: "var(--slate-50)", padding: "4rem", borderRadius: "24px", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--primary-light) 0%, transparent 100%)", opacity: 0.1, borderRadius: "24px" }}></div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "1.5rem", color: "var(--slate-900)" }}>Verified Reviews & Data</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--slate-600)", lineHeight: "1.8", marginBottom: "2rem" }}>
            Stop relying on biased marketing pages. Our platform aggregates verified user reviews, real-world pricing data, and deep integration specs so you know exactly what you're buying.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {["Unbiased user testimonials", "Transparent pricing history", "Deep technical specifications"].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--slate-700)", fontWeight: "500" }}>
                <span style={{ color: "var(--primary)", fontSize: "1.25rem" }}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1.5rem", color: "var(--slate-900)" }}>
            Streamline your procurement process
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--slate-600)", lineHeight: "1.8", marginBottom: "2.5rem" }}>
            Whether you are an enterprise IT manager or a startup founder, SaaS MRKT gives you the tools to evaluate software faster and negotiate better contracts.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/products" className="btn btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1.1rem" }}>
              Start Browsing
            </Link>
            <Link href="/categories" className="btn btn-secondary" style={{ padding: "0.85rem 2rem", fontSize: "1.1rem" }}>
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}


