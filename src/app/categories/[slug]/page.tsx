import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { BLOG_POSTS } from "@/app/blog/[slug]/page";
import CategoryDetailClient from "./CategoryDetailClient";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES_DATA[slug];

  if (!category) {
    return {
      title: "Category Not Found | SaaS MRKT",
      description: "The requested software category could not be found on SaaS MRKT.",
    };
  }

  const pageUrl = `https://www.saasmrkt.com/categories/${slug}`;

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    keywords: [
      category.name,
      `Best ${category.name} 2026`,
      `Top ${category.name} tools`,
      `${category.name} software reviews`,
      "SaaS MRKT",
      ...category.popularBrands,
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      siteName: "SaaS MRKT",
      title: category.metaTitle,
      description: category.metaDescription,
      images: [
        {
          url: "https://www.saasmrkt.com/og-image.png",
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@saasmrkt",
      title: category.metaTitle,
      description: category.metaDescription,
      images: ["https://www.saasmrkt.com/og-image.png"],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES_DATA[slug];

  if (!category) notFound();

  const pageUrl = `https://www.saasmrkt.com/categories/${slug}`;

  // Structured Data (JSON-LD) for CollectionPage, ItemList, Breadcrumbs, and FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: category.headline,
        description: category.metaDescription,
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://www.saasmrkt.com/#website",
          name: "SaaS MRKT",
          url: "https://www.saasmrkt.com",
        },
        mainEntity: {
          "@type": "ItemList",
          name: `Top Rated ${category.name} Software`,
          itemListElement: category.products.map((prod, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SoftwareApplication",
              name: prod.name,
              applicationCategory: category.name,
              operatingSystem: "Cloud, Web, SaaS",
              description: prod.description,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: prod.rating,
                reviewCount: prod.reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
              offers: {
                "@type": "Offer",
                price: prod.price,
                priceCurrency: "USD",
                priceValidUntil: "2026-12-31",
              },
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.saasmrkt.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Categories",
            item: "https://www.saasmrkt.com/categories",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: category.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  // Pass all categories as lightweight summary list for sibling category navigation
  const allCategorySummaries = Object.values(CATEGORIES_DATA).map((c) => ({
    id: c.id,
    name: c.name,
    count: c.count,
    group: c.group,
  }));

  const relatedBlogs = (category.relatedBlogSlugs || [])
    .map((s) => BLOG_POSTS[s])
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryDetailClient
        category={category}
        allCategories={allCategorySummaries}
        relatedBlogs={relatedBlogs}
      />
    </>
  );
}
