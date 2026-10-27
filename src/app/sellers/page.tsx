import React from "react";
import { Metadata } from "next";
import SellersClient from "./SellersClient";

export const metadata: Metadata = {
  title: "Grow Your Software Business | SaaS MRKT",
  description:
    "List your software, reach 50,000+ active buyers, and grow revenue with zero hidden fees. Multi-vendor B2B SaaS marketplace platform with direct buyer access.",
  keywords: [
    "multi vendor marketplace SaaS",
    "SaaS marketplace platform",
    "marketplace for SaaS products",
    "B2B SaaS marketplace",
    "list SaaS product",
    "software founders marketplace",
    "grow software business",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/sellers",
  },
  openGraph: {
    title: "Grow Your Software Business | SaaS MRKT",
    description:
      "List your software, reach 50,000+ active buyers, and grow revenue with zero hidden fees. 0% listing commission and direct buyer access.",
    url: "https://saasmrkt.com/sellers",
    type: "website",
  },
};

export default function SellersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Grow Your Software Business",
    description:
      "List your software, reach 50,000+ active buyers, and grow revenue with zero hidden fees.",
    url: "https://saasmrkt.com/sellers",
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
      <SellersClient />
    </>
  );
}
