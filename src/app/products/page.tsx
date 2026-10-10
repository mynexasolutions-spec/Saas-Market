import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "B2B SaaS Marketplace Platform — Browse Verified Software | SaaS MRKT",
  description:
    "Explore the premier multi-vendor B2B SaaS marketplace platform. Discover, compare, and acquire verified marketplace for SaaS products across HR, CRM, developer tools, and fintech.",
  keywords: [
    "SaaS marketplace",
    "B2B SaaS marketplace",
    "SaaS marketplace platform",
    "marketplace for SaaS products",
    "multi vendor marketplace SaaS",
    "marketplace SaaS platform",
    "SaaS based marketplace",
    "SaaS enabled marketplace",
    "marketplace SaaS solution",
    "marketplace SaaS software",
    "AWS marketplace SaaS alternative",
    "Azure marketplace SaaS alternative",
    "GCP marketplace listing requirements for SaaS",
    "SaaS payment gateways alternatives",
    "SaaS vs marketplace",
  ],
  alternates: {
    canonical: "https://www.saasmrkt.com/products",
  },
  openGraph: {
    title: "B2B SaaS Marketplace Platform | SaaS MRKT",
    description:
      "Explore the premier multi-vendor B2B SaaS marketplace platform. Discover, compare, and acquire verified marketplace for SaaS products.",
    url: "https://www.saasmrkt.com/products",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
