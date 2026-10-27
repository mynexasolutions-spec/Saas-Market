import React from "react";
import { Metadata } from "next";
import BuyersClient from "./BuyersClient";

export const metadata: Metadata = {
  title: "Built for Software Buyers | SaaS MRKT",
  description:
    "Find, compare, and buy verified software with confidence. 2,000+ tools, 50,000+ active buyers, 100% unbiased reviews, and transparent pricing on SaaS MRKT.",
  keywords: [
    "software buyers",
    "buy SaaS software",
    "compare SaaS tools",
    "verified software reviews",
    "transparent SaaS pricing",
    "SaaS marketplace",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/buyers",
  },
  openGraph: {
    title: "Built for Software Buyers | SaaS MRKT",
    description:
      "Find, compare, and buy verified software with confidence. We remove the guesswork with verified tools, unbiased reviews, and transparent pricing.",
    url: "https://saasmrkt.com/buyers",
    type: "website",
  },
};

export default function BuyersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Built for Software Buyers",
    description:
      "Find, compare, and buy verified software with confidence. 2,000+ tools, 50,000+ active buyers, and 100% unbiased reviews.",
    url: "https://saasmrkt.com/buyers",
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
      <BuyersClient />
    </>
  );
}
