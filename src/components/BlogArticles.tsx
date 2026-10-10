"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const ARTICLES = [
  {
    id: "article-1",
    tag: "Business Growth",
    tagDotColor: "#8B5CF6",
    title: "Top 10 SaaS Tools for Growing Businesses in 2026",
    date: "Sep 20, 2026",
    readTime: "5 min read",
    image: "/images/blog/top-10-saas-tools-2026.jpg",
    bottomBadge: {
      text: "Featured",
      type: "featured",
    },
  },
  {
    id: "article-2",
    tag: "Guides",
    tagDotColor: "#3B82F6",
    title: "How to Choose the Right SaaS Tool for Your Team",
    date: "Sep 18, 2026",
    readTime: "6 min read",
    image: "/images/blog/how-to-choose-right-saas-tool.jpg",
    bottomBadge: {
      text: "Must Read",
      type: "must-read",
    },
  },
  {
    id: "article-3",
    tag: "Trends",
    tagDotColor: "#F59E0B",
    title: "SaaS Trends to Watch in 2026",
    date: "Sep 15, 2026",
    readTime: "4 min read",
    image: "/images/blog/saas-trends-2026.jpg",
    bottomBadge: {
      text: "Trending",
      type: "trending",
    },
  },
];

interface BlogArticlesProps {
  onArticleClick: (title: string) => void;
}

export default function BlogArticles({ onArticleClick }: BlogArticlesProps) {
  return (
    <section className="articles-section" id="resources">
      <div className="container">
        {/* Centered Section Header */}
        <div className="articles-header-center">
          <div className="section-badge" id="articles-badge">
            LATEST INSIGHTS
          </div>
          <h2 className="section-title">Latest Articles &amp; Resources</h2>
          <p className="section-subtitle">
            Stay updated with the latest insights, tips and trends in the SaaS industry.
          </p>
        </div>

        {/* Top Action Bar */}
        <div className="articles-top-action-bar">
          <Link href="/blog" className="view-all-link" id="view-all-articles-link">
            <span>View All Articles</span>
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="articles-grid">
          {ARTICLES.map((art) => (
            <article
              key={art.id}
              className="article-card"
              id={art.id}
              onClick={() => onArticleClick(art.title)}
            >
              <div className="article-banner">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="article-banner-image"
                />
                <div className="article-banner-overlay" />
                <span className="article-tag-badge">
                  <span className="article-tag-dot" style={{ backgroundColor: art.tagDotColor }} />
                  {art.tag}
                </span>
              </div>
              <div className="article-body">
                <h3 className="article-title">{art.title}</h3>
                <div className="article-body-footer">
                  <div className="article-meta-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <span className={`article-bottom-badge badge-${art.bottomBadge.type}`}>
                    {art.bottomBadge.text}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
