import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "Browse SaaS Products",
  description:
    "Discover and compare hundreds of SaaS products across all categories. Find the perfect software for HR, CRM, marketing, finance, and more.",
  keywords: ["Browse SaaS", "SaaS Products", "Compare Software", "CRM Tools", "HR Software"],
  alternates: {
    canonical: "https://www.saasmrkt.com/products",
  },
  openGraph: {
    title: "Browse SaaS Products | SaaS Market",
    description:
      "Discover and compare hundreds of SaaS products across all categories.",
    url: "https://www.saasmrkt.com/products",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
