import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "B2B SaaS Marketplace Insights & Industry Guides | SaaS MRKT Blog",
  description:
    "Expert guides, SaaS vs marketplace revenue multiples, cloud marketplace alternatives, and procurement playbooks on our multi-vendor B2B SaaS marketplace platform.",
  keywords: [
    "SaaS marketplace",
    "B2B SaaS marketplace",
    "SaaS vs marketplace",
    "SaaS vs marketplace revenue multiples",
    "AWS marketplace SaaS",
    "Azure marketplace SaaS",
    "GCP marketplace listing requirements for SaaS",
    "multi vendor marketplace SaaS",
    "marketplace for SaaS products",
    "SaaS payment gateways alternatives",
    "SaaS marketplace entry strategy",
  ],
  alternates: {
    canonical: "https://www.saasmrkt.com/blog",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.saasmrkt.com/blog",
    siteName: "SaaS MRKT",
    title: "SaaS MRKT Blog — Expert Insights, Comparisons & Playbooks",
    description:
      "Stay ahead with expert guides, product comparisons, industry trends, and practical tips for SaaS buyers and sellers on SaaS MRKT.",
    images: [
      {
        url: "https://www.saasmrkt.com/images/blog/og-blog-home.jpg",
        width: 1200,
        height: 630,
        alt: "SaaS MRKT Blog & Resources",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@saasmrkt",
    title: "SaaS MRKT Blog — Expert Insights, Comparisons & Playbooks",
    description:
      "Stay ahead with expert guides, product comparisons, industry trends, and practical tips for SaaS buyers and sellers on SaaS MRKT.",
    images: ["https://www.saasmrkt.com/images/blog/og-blog-home.jpg"],
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
