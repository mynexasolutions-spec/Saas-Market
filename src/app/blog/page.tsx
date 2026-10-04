import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog & Resources | SaaS MRKT",
  description:
    "Stay ahead with expert guides, product comparisons, industry trends, and practical tips for SaaS buyers and sellers on SaaS MRKT.",
  keywords: ["SaaS Blog", "SaaS Guides", "Software Trends", "SaaS Tips", "Buyer Guides", "SaaS MRKT"],
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
