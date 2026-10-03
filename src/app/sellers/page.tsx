import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "For Sellers | SaaS MRKT",
  description: "Learn how to list, showcase, and grow your software business on SaaS MRKT.",
};

export default function SellersPage() {
  return (
    <PageLayout activeNav="sellers">
      <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="section-title">Grow your&nbsp;<span className="section-title-highlight">Software Business</span></h1>
        <p className="section-subtitle" style={{ maxWidth: "800px", margin: "0 auto" }}>
          Get your software in front of 50,000+ qualified buyers actively looking for solutions. No hidden fees, just growth.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", marginBottom: "6rem" }}>
        <div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1.5rem", color: "var(--slate-900)" }}>
            Reach buyers when they have high intent
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--slate-600)", lineHeight: "1.8", marginBottom: "2.5rem" }}>
            Buyers on SaaS MRKT aren't just browsing — they are actively comparing tools to solve a specific problem. By listing your product, you capture demand exactly when it matters.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/pricing" className="btn btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1.1rem" }}>
              View Seller Pricing
            </Link>
            <Link href="/contact" className="btn btn-secondary" style={{ padding: "0.85rem 2rem", fontSize: "1.1rem" }}>
              Talk to Sales
            </Link>
          </div>
        </div>

        <div style={{ background: "var(--slate-900)", padding: "4rem", borderRadius: "24px", position: "relative", color: "white" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--primary) 0%, transparent 100%)", opacity: 0.2, borderRadius: "24px" }}></div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "1.5rem", color: "white" }}>Why List with Us?</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--slate-300)", lineHeight: "1.8", marginBottom: "2rem" }}>
            We provide a level playing field for both established enterprises and rising startups.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              "0% commission on your sales", 
              "Verified buyer leads straight to your CRM", 
              "Advanced analytics on profile views"
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--slate-100)", fontWeight: "500" }}>
                <span style={{ color: "var(--primary-light)", fontSize: "1.25rem" }}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}


