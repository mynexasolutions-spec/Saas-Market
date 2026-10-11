import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALTERNATIVES_DATA } from "@/data/alternativesData";
import AlternativeDetailClient from "./AlternativeDetailClient";

interface AlternativePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(ALTERNATIVES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: AlternativePageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = ALTERNATIVES_DATA[slug.toLowerCase()];

  if (!tool) {
    return {
      title: "Software Alternatives Directory | SaaS MRKT",
    };
  }

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: {
      canonical: `https://saasmrkt.com/alternatives/${tool.slug}`,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `https://saasmrkt.com/alternatives/${tool.slug}`,
      type: "article",
    },
  };
}

export default async function AlternativePage({ params }: AlternativePageProps) {
  const { slug } = await params;
  const tool = ALTERNATIVES_DATA[slug.toLowerCase()];

  if (!tool) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${tool.name} Alternatives in 2026`,
    description: tool.metaDescription,
    numberOfItems: tool.alternatives.length,
    itemListElement: tool.alternatives.map((alt, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: alt.name,
      description: alt.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlternativeDetailClient tool={tool} />
    </>
  );
}
