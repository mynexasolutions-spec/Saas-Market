import React from "react";
import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us - Our Mission, Team & Story | SaaS MRKT",
  description:
    "Learn about SaaS MRKT – our mission to democratize software procurement with 100% escrow protection, verified vendor audits, and zero hidden fees.",
  keywords: [
    "About SaaS MRKT",
    "SaaS Marketplace Team",
    "SaaS mission",
    "verified software platform",
    "transparent software marketplace",
  ],
  alternates: {
    canonical: "https://www.saasmrkt.com/about",
  },
  openGraph: {
    title: "About Us - Our Mission, Team & Story | SaaS MRKT",
    description:
      "Building the world's most trusted software marketplace with verified reviews and escrow buyer protection.",
    url: "https://www.saasmrkt.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About SaaS MRKT",
    description:
      "SaaS MRKT is a transparent software marketplace connecting over 50,000 active buyers with vetted software products backed by 100% escrow protection.",
    url: "https://www.saasmrkt.com/about",
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
      <AboutPageClient />
    </>
  );
}
