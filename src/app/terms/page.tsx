import React from "react";
import { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service & Escrow Policy | SaaS MRKT",
  description:
    "Review the terms, buyer licenses, seller obligations, and 30-day escrow satisfaction guarantees governing the SaaS MRKT marketplace.",
  alternates: {
    canonical: "https://saasmrkt.com/terms",
  },
};

export default function TermsPage() {
  return (
    <PageLayout noContainer>
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)",
          borderBottom: "1px solid var(--slate-200)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--primary)",
              letterSpacing: "0.05em",
            }}
          >
            Marketplace Rules &amp; Agreement
          </span>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "var(--slate-900)",
              margin: "0.5rem 0 1rem",
              letterSpacing: "-0.03em",
            }}
          >
            Terms of Service
          </h1>
          <p style={{ color: "var(--slate-600)", fontSize: "1rem" }}>
            Effective Date: <strong>October 11, 2026</strong> • Governs all buyers, sellers, and transactions on SaaS MRKT.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: "840px", margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ color: "var(--slate-700)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing, browsing, registering for an account, purchasing software, or listing a product on <strong>SaaS MRKT</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company, you represent that you possess the authority to bind such entity.
          </p>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            2. The SaaS MRKT Model &amp; Escrow Protection
          </h2>
          <p>
            SaaS MRKT functions as a trusted two-sided marketplace. To protect buyers from counterfeit software and to protect sellers from fraudulent chargebacks:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li>
              <strong>Escrow Hold:</strong> When a buyer completes checkout, payment funds are held securely in the SaaS MRKT escrow vault.
            </li>
            <li>
              <strong>Instant Digital Delivery:</strong> Sellers must provide valid license keys, deployment scripts, or administrative invitations immediately upon purchase confirmation.
            </li>
            <li>
              <strong>30-Day Buyer Guarantee:</strong> If the purchased software fails to operate as advertised, is defective, or is revoked within 30 days of purchase, the buyer is entitled to a 100% full escrow refund upon review.
            </li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            3. Seller Warranties &amp; Listing Standards
          </h2>
          <p>Sellers listing products on SaaS MRKT explicitly warrant that:</p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li>They own all intellectual property rights, source code, and commercial distribution rights for the listed software.</li>
            <li>The software contains zero backdoors, spyware, cryptocurrency miners, or malicious code.</li>
            <li>They will provide standard bug fixes and customer support according to the tier selected at checkout.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            4. Buyer Licenses &amp; Permitted Use
          </h2>
          <p>
            Upon successful transaction completion, buyers receive a non-exclusive, worldwide, transferable commercial license (or subscription access) corresponding to the plan purchased. Redistribution or public resale of license keys outside SaaS MRKT without explicit vendor consent is strictly prohibited.
          </p>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            5. Fees &amp; Marketplace Commission
          </h2>
          <p>
            SaaS MRKT does not charge buyers any processing fees. Sellers are charged a transparent marketplace commission (8%–15% depending on membership tier) deducted at the time escrow funds are cleared for withdrawal.
          </p>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            6. Dispute Resolution
          </h2>
          <p>
            In the event of an operational disagreement between a buyer and vendor, SaaS MRKT acts as an impartial escrow mediator. Both parties agree to submit logs and evidence through our <Link href="/contact" style={{ color: "var(--primary)", fontWeight: 600 }}>Dispute Resolution Center</Link> prior to initiating third-party financial chargebacks.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
