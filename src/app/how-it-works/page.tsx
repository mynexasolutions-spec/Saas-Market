import React from "react";
import PageLayout from "@/components/PageLayout";
import HowItWorksClient from "./HowItWorksClient";

export const metadata = {
  title: "How It Works | SaaS MRKT",
  description: "Learn how the buying process works on SaaS MRKT. From discovery to deployment.",
};

export default function HowItWorksPage() {
  return (
    <PageLayout activeNav="resources">
      <HowItWorksClient />
    </PageLayout>
  );
}
