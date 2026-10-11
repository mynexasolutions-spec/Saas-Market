import React from "react";
import { Metadata } from "next";
import BadgesClient from "./BadgesClient";

export const metadata: Metadata = {
  title: "SaaS MRKT Vendor Badges & Awards (2026) | Embed Trust Badges",
  description:
    "Showcase your verified customer rating and award status with official SaaS MRKT embeddable badges. Boost landing page conversion rates and build buyer trust.",
  keywords: [
    "SaaS MRKT badges",
    "vendor trust badge",
    "embed software awards",
    "top rated badge",
    "SaaS backlink badges",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/badges",
  },
  openGraph: {
    title: "SaaS MRKT Vendor Badges & Awards (2026)",
    description: "Embed your official SaaS MRKT verified badge on your website and pricing pages.",
    url: "https://saasmrkt.com/badges",
    type: "website",
  },
};

export default function BadgesPage() {
  return <BadgesClient />;
}
