import type { Metadata } from "next";
import CategoriesPageClient from "./CategoriesPageClient";

export const metadata: Metadata = {
  title: "B2B SaaS Marketplace Categories | SaaS MRKT",
  description:
    "Browse top software categories in our multi-vendor B2B SaaS marketplace platform. Discover, compare, and acquire verified marketplace for SaaS products across HR, CRM, developer tools, and fintech.",
  keywords: [
    "SaaS marketplace categories",
    "B2B SaaS marketplace",
    "SaaS marketplace platform",
    "marketplace for SaaS products",
    "multi vendor marketplace SaaS",
    "marketplace SaaS software",
  ],
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
