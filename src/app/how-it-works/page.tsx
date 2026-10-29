import React from "react";
import { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How It Works - From Discovery to Deployment | SaaS MRKT",
  description:
    "Learn how the SaaS buying process works on SaaS MRKT. Discover 2,000+ verified tools, compare side-by-side matrices, read authenticated reviews, and buy with 100% escrow protection.",
  keywords: [
    "how SaaS MRKT works",
    "buy SaaS software",
    "software procurement process",
    "SaaS escrow guarantee",
    "compare SaaS tools",
    "verified software reviews",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/how-it-works",
  },
  openGraph: {
    title: "How It Works - From Discovery to Deployment | SaaS MRKT",
    description:
      "A seamless buying experience that takes you from problem to verified software solution in minutes, not months.",
    url: "https://saasmrkt.com/how-it-works",
    type: "website",
  },
};

export default function HowItWorksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How SaaS MRKT Works",
    description:
      "A streamlined 3-step procurement process taking buyers from software discovery to verified deployment with 100% escrow protection.",
    url: "https://saasmrkt.com/how-it-works",
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
      <HowItWorksClient />
    </>
  );
}
