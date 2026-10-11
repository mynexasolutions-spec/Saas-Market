import React from "react";
import { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | SaaS MRKT",
  description:
    "Learn how SaaS MRKT collects, protects, and handles your personal data, payment info, and buyer security in compliance with GDPR and CCPA regulations.",
  alternates: {
    canonical: "https://saasmrkt.com/privacy",
  },
};

export default function PrivacyPage() {
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
            Legal &amp; Compliance
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
            Privacy Policy
          </h1>
          <p style={{ color: "var(--slate-600)", fontSize: "1rem" }}>
            Last revised: <strong>October 11, 2026</strong> • Effective for all SaaS MRKT buyers and sellers worldwide.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: "840px", margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ color: "var(--slate-700)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            1. Overview &amp; Commitment
          </h2>
          <p>
            Welcome to <strong>SaaS MRKT</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We operate a verified software marketplace connecting technology buyers with indie developers and enterprise SaaS providers. We are deeply committed to protecting your privacy and ensuring transparency in all personal data processing.
          </p>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            2. Information We Collect
          </h2>
          <p>
            When you browse, register, purchase software, or list products on SaaS MRKT, we collect the following types of information:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li>
              <strong>Account Information:</strong> Name, work email address, company profile, and encrypted authentication tokens.
            </li>
            <li>
              <strong>Transaction &amp; Escrow Data:</strong> Order IDs, billing addresses, purchased software licenses, and escrow milestone release statuses. Payment card numbers are processed directly via PCI-DSS compliant providers (e.g., Stripe) and never stored on our servers.
            </li>
            <li>
              <strong>Vendor Verification Data:</strong> Government ID, business incorporation certificates, and developer payout bank details.
            </li>
            <li>
              <strong>Technical Usage Data:</strong> IP address, device fingerprints, browser version, and aggregated usage metrics used for fraud prevention.
            </li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            3. How We Use Your Data
          </h2>
          <p>We process your personal data for the following lawful business purposes:</p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li>Facilitating secure escrow transactions between buyers and software creators.</li>
            <li>Issuing legitimate VAT and sales tax invoices and software licensing keys.</li>
            <li>Conducting automated safety screenings to protect buyers from unauthorized chargebacks and malicious vendors.</li>
            <li>Sending critical transactional updates, receipt confirmations, and security alerts.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            4. Your Rights under GDPR &amp; CCPA
          </h2>
          <p>
            Regardless of your geographic location, SaaS MRKT affords all users standard privacy protections:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li><strong>Right to Access:</strong> You may request an export of all personal data held about your account.</li>
            <li><strong>Right to Rectification:</strong> You may correct inaccurate or incomplete billing or account data.</li>
            <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You may request permanent account deletion, subject to statutory tax retention periods.</li>
            <li><strong>Right to Opt-Out:</strong> You may unsubscribe from marketing newsletters at any time with 1 click.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            5. Cookies &amp; Tracking
          </h2>
          <p>
            We use strictly necessary session cookies to maintain your shopping cart, authentication state, and comparison engine preferences. We do not sell your personal data to third-party data brokers.
          </p>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            6. Contact Our Data Protection Officer
          </h2>
          <p>
            If you have questions about this policy or wish to exercise your data subject rights, please reach out directly:
          </p>
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              border: "1px solid var(--slate-200)",
              marginTop: "1rem",
            }}
          >
            <div><strong>Email:</strong> privacy@saasmrkt.com</div>
            <div><strong>Support Desk:</strong> <Link href="/contact" style={{ color: "var(--primary)", fontWeight: 600 }}>Help &amp; Contact Center</Link></div>
            <div><strong>Response Time:</strong> Within 48 business hours.</div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
