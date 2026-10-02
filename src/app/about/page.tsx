import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | SaaS Market",
  description:
    "Learn about SaaS Market – our mission to connect buyers and sellers in the SaaS ecosystem, our story, our values, and the team behind the platform.",
  keywords: ["About SaaS Market", "SaaS Marketplace Team", "Our Mission"],
};

export default function AboutPage() {
  return <AboutPageClient />;
}
