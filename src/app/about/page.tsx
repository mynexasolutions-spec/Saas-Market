import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | SaaS MRKT",
  description:
    "Learn about SaaS MRKT – our mission to connect buyers and sellers in the SaaS ecosystem, our story, our values, and the team behind the platform.",
  keywords: ["About SaaS MRKT", "SaaS Marketplace Team", "Our Mission"],
  alternates: {
    canonical: "https://www.saasmrkt.com/about",
  },
  openGraph: {
    title: "About Us | SaaS MRKT",
    description:
      "Learn about SaaS MRKT – our mission to connect buyers and sellers in the SaaS ecosystem.",
    url: "https://www.saasmrkt.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
