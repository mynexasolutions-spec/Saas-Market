import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SaaS Market – our mission to connect buyers and sellers in the SaaS ecosystem, our story, our values, and the team behind the platform.",
  keywords: ["About SaaS Market", "SaaS Marketplace Team", "Our Mission"],
  alternates: {
    canonical: "https://www.saasmrkt.com/about",
  },
  openGraph: {
    title: "About Us | SaaS Market",
    description:
      "Learn about SaaS Market – our mission to connect buyers and sellers in the SaaS ecosystem.",
    url: "https://www.saasmrkt.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
