import type { Metadata } from "next";
import CategoriesPageClient from "./CategoriesPageClient";

export const metadata: Metadata = {
  title: "Software Categories | SaaS MRKT",
  description: "Browse software categories to find the perfect SaaS product for your business needs.",
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
