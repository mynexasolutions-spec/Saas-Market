import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | SaaS Market",
  description:
    "Get in touch with the SaaS Market team. Whether you're a buyer with a question or a seller wanting to list your product, we're here to help.",
  keywords: ["Contact SaaS Market", "SaaS Support", "Get in Touch"],
};

export default function ContactPage() {
  return <ContactPageClient />;
}
