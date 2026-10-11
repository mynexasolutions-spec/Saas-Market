import React from "react";
import { Metadata } from "next";
import AlternativesIndexClient from "./AlternativesIndexClient";

export const metadata: Metadata = {
  title: "SaaS Alternatives Directory (2026) | Find Better & Cheaper Tools | SaaS MRKT",
  description:
    "Explore our complete directory of software alternatives. Compare modern, affordable replacements for Slack, Asana, HubSpot, Salesforce, QuickBooks, and Jira.",
  keywords: [
    "SaaS alternatives",
    "software alternatives",
    "Slack alternatives 2026",
    "Asana alternatives",
    "HubSpot alternatives",
    "Salesforce alternatives",
    "Jira alternatives",
  ],
  alternates: {
    canonical: "https://saasmrkt.com/alternatives",
  },
  openGraph: {
    title: "SaaS Alternatives Directory (2026) | SaaS MRKT",
    description: "Find affordable, modern software alternatives to overpriced legacy tools.",
    url: "https://saasmrkt.com/alternatives",
    type: "website",
  },
};

export default function AlternativesPage() {
  return <AlternativesIndexClient />;
}
