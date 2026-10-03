import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog & Resources | SaaS MRKT",
  description:
    "Stay ahead with expert guides, product comparisons, industry trends, and practical tips for SaaS buyers and sellers on SaaS MRKT.",
  keywords: ["SaaS Blog", "SaaS Guides", "Software Trends", "SaaS Tips", "Buyer Guides"],
};

export default function BlogPage() {
  return <BlogPageClient />;
}

