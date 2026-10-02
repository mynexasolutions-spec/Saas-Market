import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing for Sellers | SaaS Market",
  description:
    "Simple, transparent pricing for SaaS sellers. List your product and reach thousands of qualified buyers. Choose the plan that fits your business.",
  keywords: ["SaaS Seller Pricing", "List SaaS Product", "SaaS Marketplace Plans"],
};

export default function PricingPage() {
  return <PricingPageClient />;
}
