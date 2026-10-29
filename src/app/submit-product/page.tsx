import React from "react";
import { Metadata } from "next";
import SubmitProductClient from "./SubmitProductClient";

export const metadata: Metadata = {
  title: "List Your Software on SaaS MRKT | Vendor Application",
  description:
    "Submit your SaaS product to SaaS MRKT. Reach over 85,000 verified buyers, enjoy 0 upfront listing fees, and guaranteed 30-day escrow payouts.",
  keywords: [
    "submit SaaS",
    "list software",
    "SaaS vendor portal",
    "sell my software",
    "SaaS marketplace listing",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/submit-product",
  },
  openGraph: {
    title: "List Your Software on SaaS MRKT | Vendor Application",
    description: "Submit your SaaS product and start selling to thousands of verified buyers with 0 upfront fees.",
    url: "https://saasmrkt.com/submit-product",
    type: "website",
  },
};

export default function SubmitProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "List Your Software on SaaS MRKT",
    description:
      "Submit your SaaS product to reach over 85,000 verified buyers with 0 upfront listing fees and guaranteed escrow payouts.",
    url: "https://saasmrkt.com/submit-product",
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
      <SubmitProductClient />
    </>
  );
}
