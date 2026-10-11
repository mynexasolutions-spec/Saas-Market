import React from "react";
import { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "SaaS Spend & Waste Calculator (2026) | Free ROI Tool | SaaS MRKT",
  description:
    "Calculate how much your company is wasting on idle software seats, duplicate applications, and unmanaged auto-renewals with our free interactive SaaS calculator.",
  keywords: [
    "SaaS spend calculator",
    "software waste calculator",
    "SaaS ROI calculator",
    "software stack audit",
    "calculate software spend",
    "cut SaaS costs",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/tools/saas-spend-calculator",
  },
  openGraph: {
    title: "SaaS Spend & Waste Calculator (2026) | SaaS MRKT",
    description:
      "Calculate your team's software waste and discover potential savings in seconds.",
    url: "https://saasmrkt.com/tools/saas-spend-calculator",
    type: "website",
  },
};

export default function CalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SaaS Spend & Waste Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    description:
      "Interactive benchmark calculator to estimate wasted software spend, idle licenses, and recoverable annual budget.",
    url: "https://saasmrkt.com/tools/saas-spend-calculator",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
      <CalculatorClient />
    </>
  );
}
