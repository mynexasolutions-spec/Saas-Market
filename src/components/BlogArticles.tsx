"use client";

import React from "react";

const ARTICLES = [
  {
    id: "article-1",
    tag: "Business Growth",
    title: "Top 10 SaaS Tools for Growing Businesses in 2026",
    date: "Sep 20, 2026",
    readTime: "5 min read",
    bannerClass: "article-banner-1",
    waveSvg: (
      <svg className="article-wave-svg" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,80 C100,160 220,20 320,100 C370,140 400,90 400,90 L400,200 L0,200 Z" fill="rgba(139, 92, 246, 0.25)" />
        <path d="M0,120 C120,40 240,160 360,60 C380,45 400,70 400,70 L400,200 L0,200 Z" fill="rgba(168, 85, 247, 0.2)" />
        <circle cx="340" cy="50" r="45" fill="rgba(255, 255, 255, 0.4)" filter="blur(10px)" />
      </svg>
    ),
  },
  {
    id: "article-2",
    tag: "Guides",
    title: "How to Choose the Right SaaS Tool for Your Team",
    date: "Sep 18, 2026",
    readTime: "6 min read",
    bannerClass: "article-banner-2",
    waveSvg: (
      <svg className="article-wave-svg" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,60 C120,130 200,40 300,110 C350,140 400,80 400,80 L400,200 L0,200 Z" fill="rgba(59, 130, 246, 0.22)" />
        <path d="M0,110 C90,60 210,150 340,70 C370,55 400,85 400,85 L400,200 L0,200 Z" fill="rgba(99, 102, 241, 0.18)" />
        <circle cx="80" cy="60" r="50" fill="rgba(255, 255, 255, 0.45)" filter="blur(10px)" />
      </svg>
    ),
  },
  {
    id: "article-3",
    tag: "Trends",
    title: "SaaS Trends to Watch in 2026",
    date: "Sep 15, 2026",
    readTime: "4 min read",
    bannerClass: "article-banner-3",
    waveSvg: (
      <svg className="article-wave-svg" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,90 C140,40 220,140 330,60 C370,40 400,70 400,70 L400,200 L0,200 Z" fill="rgba(244, 63, 94, 0.18)" />
        <path d="M0,130 C110,90 230,170 350,80 C380,60 400,90 400,90 L400,200 L0,200 Z" fill="rgba(249, 115, 22, 0.16)" />
        <circle cx="280" cy="40" r="48" fill="rgba(255, 255, 255, 0.45)" filter="blur(10px)" />
      </svg>
    ),
  },
];

interface BlogArticlesProps {
  onArticleClick: (title: string) => void;
}

export default function BlogArticles({ onArticleClick }: BlogArticlesProps) {
  return (
    <section className="articles-section" id="resources">
      <div className="container">
        {/* Header */}
        <div className="section-badge" id="articles-badge">
          LATEST INSIGHTS
        </div>
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Latest Articles & Resources</h2>
            <p className="section-subtitle">
              Stay updated with the latest insights, tips and trends in the SaaS industry.
            </p>
          </div>
          <a href="#resources" className="view-all-link" id="view-all-articles-link">
            <span>View All Articles</span>
          </a>
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
              <div className={`article-banner ${art.bannerClass}`}>
                {art.waveSvg}
                <span className="article-tag-badge">{art.tag}</span>
              </div>
              <div className="article-body">
                <h3 className="article-title">{art.title}</h3>
                <div className="article-meta-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{art.date}</span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
