import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | SaaS MRKT",
  description:
    "Get in touch with the SaaS MRKT team. Whether you're a buyer with a question or a seller wanting to list your product, we're here to help.",
  keywords: ["Contact SaaS MRKT", "SaaS Support", "Get in Touch"],
  alternates: {
    canonical: "https://www.saasmrkt.com/contact",
  },
  openGraph: {
    title: "Contact Us | SaaS MRKT",
    description:
      "Get in touch with the SaaS MRKT team. Whether you're a buyer with a question or a seller wanting to list your product, we're here to help.",
    url: "https://www.saasmrkt.com/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
