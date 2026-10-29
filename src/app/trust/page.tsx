import React from "react";
import { Metadata } from "next";
import TrustClient from "./TrustClient";

export const metadata: Metadata = {
  title: "Trust, Security & Buyer Protection | SaaS MRKT",
  description:
    "Explore how SaaS MRKT protects buyers with 100% escrow protection, verified vendor audits, malware scans, and a 30-day money-back satisfaction guarantee.",
  keywords: [
    "SaaS escrow protection",
    "software buyer security",
    "verified SaaS sellers",
    "SaaS money-back guarantee",
    "secure software marketplace",
    "SOC2 software marketplace",
    "PCI-DSS software checkout",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/trust",
  },
  openGraph: {
    title: "Trust, Security & Buyer Protection | SaaS MRKT",
    description:
      "Buy and sell SaaS with absolute confidence. 100% escrow protection, strict vendor audits, and a 30-day money-back satisfaction guarantee.",
    url: "https://saasmrkt.com/trust",
    type: "website",
  },
};

export default function TrustPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Trust, Security & Buyer Protection",
    description:
      "Institutional-grade SaaS protection architecture with 100% escrow protection, strict vendor vetting, malware auditing, and 30-day money-back guarantee.",
    url: "https://saasmrkt.com/trust",
    publisher: {
      "@type": "Organization",
      name: "SaaS MRKT",
      url: "https://saasmrkt.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrustClient />
    </>
  );
}
