import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "./blog/[slug]/page";
import { CATEGORIES_DATA } from "@/data/categoriesData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.saasmrkt.com";
  const currentDate = new Date();

  // Core public static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/buyers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sellers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic category landing pages
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORIES_DATA).map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic blog articles
  const blogRoutes: MetadataRoute.Sitemap = Object.keys(BLOG_POSTS).map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes];
}
