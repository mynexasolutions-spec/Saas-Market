import React from "react";
import { Metadata } from "next";
import DealsClient from "./DealsClient";

export const metadata: Metadata = {
  title: "Exclusive SaaS Deals & Lifetime Discounts (2026) | SaaS MRKT",
  description:
    "Save up to 70% on verified business software, lifetime passes (LTD), exclusive founder coupon codes, and startup credits. All purchases protected by 30-day escrow.",
  keywords: [
    "SaaS deals",
    "software discounts",
    "lifetime SaaS deals",
    "startup promo codes",
    "AppSumo alternatives",
    "cheap business software",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/deals",
  },
  openGraph: {
    title: "Exclusive SaaS Deals & Lifetime Discounts (2026) | SaaS MRKT",
    description:
      "Save up to 70% on verified business software, lifetime passes, and exclusive coupon codes.",
    url: "https://saasmrkt.com/deals",
    type: "website",
  },
};

export default function DealsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SaaS Deals & Lifetime Discounts",
    description: "Exclusive software discounts and promotional offers on verified SaaS tools.",
    url: "https://saasmrkt.com/deals",
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
      <DealsClient />
    </>
  );
}
