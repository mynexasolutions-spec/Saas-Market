import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing for Sellers | SaaS MRKT",
  description:
    "Simple, transparent pricing for SaaS sellers. List your product and reach thousands of qualified buyers. Choose the plan that fits your business.",
  keywords: ["SaaS Seller Pricing", "List SaaS Product", "SaaS MRKTplace Plans"],
  alternates: {
    canonical: "https://www.saasmrkt.com/pricing",
  },
  openGraph: {
    title: "Pricing for Sellers | SaaS MRKT",
    description:
      "Simple, transparent pricing for SaaS sellers. List your product and reach thousands of qualified buyers.",
    url: "https://www.saasmrkt.com/pricing",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
