import React, { Suspense } from "react";
import { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare SaaS Tools Side-by-Side (2026) | SaaS MRKT",
  description:
    "Compare features, verified buyer reviews, pricing models, and technical specs between top SaaS products side-by-side to make the right software choice.",
  keywords: [
    "compare SaaS tools",
    "software comparison",
    "SaaS review matrix",
    "best business software 2026",
    "side by side tool comparison",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/compare",
  },
  openGraph: {
    title: "Compare SaaS Tools Side-by-Side (2026) | SaaS MRKT",
    description:
      "Compare features, verified buyer reviews, pricing models, and technical specs between top SaaS products.",
    url: "https://saasmrkt.com/compare",
    type: "website",
  },
};

export default function ComparePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SaaS Software Comparison Matrix",
    description: "Compare features, verified reviews, and pricing between leading SaaS products.",
    url: "https://saasmrkt.com/compare",
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
      <Suspense
        fallback={
          <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#64748B", fontSize: "1.1rem" }}>Loading comparison matrix...</p>
          </div>
        }
      >
        <CompareClient />
      </Suspense>
    </>
  );
}
