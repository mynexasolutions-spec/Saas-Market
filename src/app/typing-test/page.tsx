import React from "react";
import { Metadata } from "next";
import TypingTestClient from "./TypingTestClient";
import TypingSeoContent, { TYPING_FAQ } from "./TypingSeoContent";
import { BENCHMARK } from "@/lib/typing";

const SITE = "https://www.saasmrkt.com";
const PAGE_URL = `${SITE}/typing-test`;
const title = `Typing Speed Test: Can You Beat ${BENCHMARK.wpm} WPM?`;
const description = `Free 15, 30 or 60 second typing speed test. Check your WPM and accuracy, then climb the SaaS MRKT leaderboard. Can you beat our team's ${BENCHMARK.wpm} WPM?`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "typing speed test",
    "free typing test",
    "online typing test",
    "WPM test",
    "words per minute",
    "typing speed checker",
    "typing test leaderboard",
    "typing challenge",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: `${title} | SaaS MRKT`,
    description,
    url: PAGE_URL,
    siteName: "SaaS MRKT",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | SaaS MRKT`,
    description,
  },
};

export default function TypingTestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${PAGE_URL}#app`,
        name: "SaaS MRKT Typing Speed Test",
        applicationCategory: "GameApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        description,
        url: PAGE_URL,
        inLanguage: "en",
        isAccessibleForFree: true,
        featureList: [
          "15, 30 and 60 second tests",
          "Words and quote modes",
          "Punctuation and numbers options",
          "Live WPM and accuracy",
          "WPM over time chart",
          "Public leaderboard",
          "No account required",
        ],
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "SaaS MRKT", url: SITE },
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: TYPING_FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Typing Speed Test", item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <TypingTestClient>
        <TypingSeoContent />
      </TypingTestClient>
    </>
  );
}
