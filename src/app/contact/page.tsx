import React from "react";
import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us & Concierge Support | SaaS MRKT",
  description:
    "Get in touch with the SaaS MRKT team. Guaranteed response within 1 business day for software buyers, enterprise procurement, and vendor listing inquiries.",
  keywords: [
    "Contact SaaS MRKT",
    "SaaS Support",
    "SaaS Concierge",
    "Get in Touch",
    "SaaS Vendor Inquiries",
  ],
  alternates: {
    canonical: "https://www.saasmrkt.com/contact",
  },
  openGraph: {
    title: "Contact Us & Concierge Support | SaaS MRKT",
    description:
      "Get in touch with the SaaS MRKT team. Guaranteed 1 business day response SLA for buyers and vendors.",
    url: "https://www.saasmrkt.com/contact",
    type: "website",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SaaS MRKT",
    description:
      "Get in touch with our software advisory and vendor listing team with a guaranteed response SLA within 1 business day.",
    url: "https://www.saasmrkt.com/contact",
    publisher: {
      "@type": "Organization",
      name: "SaaS MRKT",
      url: "https://saasmrkt.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPageClient />
    </>
  );
}
