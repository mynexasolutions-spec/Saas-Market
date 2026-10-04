"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const CATEGORIES = [
  "All",
  "Business Growth",
  "Guides",
  "Trends",
  "Productivity",
  "Reviews",
  "Case Studies",
  "News",
];

const BLOG_POSTS = [
  {
    slug: "top-10-saas-tools-2026",
    tag: "Business Growth",
    title: "Top 10 SaaS Tools for Growing Businesses in 2026",
    excerpt:
      "Whether you're scaling a startup or optimizing a mid-sized company, these SaaS platforms deliver maximum ROI. We've done the deep research so you don't have to.",
    date: "Sep 20, 2026",
    readTime: "5 min read",
    author: "Priya Kapoor",
    authorRole: "Senior Editor",
    featured: true,
    accentColor: "#5E4BEE",
    gradient: "linear-gradient(135deg, #5E4BEE 0%, #8B5CF6 100%)",
  },
  {
    slug: "how-to-choose-right-saas-tool",
    tag: "Guides",
    title: "How to Choose the Right SaaS Tool for Your Team",
    excerpt:
      "A practical framework to evaluate SaaS tools by considering total cost, integration depth, scalability, and support quality before committing.",
    date: "Sep 18, 2026",
    readTime: "6 min read",
    author: "Arjun Mehta",
    authorRole: "Product Strategist",
    featured: false,
    accentColor: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
  },
  {
    slug: "saas-trends-2026",
    tag: "Trends",
    title: "SaaS Trends to Watch in 2026",
    excerpt:
      "From AI-native products to usage-based pricing models, the SaaS landscape is shifting. Here's what every buyer and seller needs to know.",
    date: "Sep 15, 2026",
    readTime: "4 min read",
    author: "Sara Chen",
    authorRole: "Market Analyst",
    featured: false,
    accentColor: "#EC4899",
    gradient: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
  },
  {
    slug: "hr-saas-comparison-2026",
    tag: "Reviews",
    title: "The Ultimate HR SaaS Comparison: Manage360 vs BambooHR vs Rippling",
    excerpt:
      "We put three leading HR platforms head-to-head across onboarding, payroll, compliance, and user experience to find the ultimate winner.",
    date: "Sep 12, 2026",
    readTime: "8 min read",
    author: "Daniel Osei",
    authorRole: "HR Tech Expert",
    featured: false,
    accentColor: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
  },
  {
    slug: "email-marketing-automation-guide",
    tag: "Guides",
    title: "Email Marketing Automation: The Complete 2026 Guide",
    excerpt:
      "Step-by-step automation flows for welcome sequences, re-engagement campaigns, and post-purchase journeys that convert at industry-leading rates.",
    date: "Sep 10, 2026",
    readTime: "10 min read",
    author: "Zara Williams",
    authorRole: "Growth Marketer",
    featured: false,
    accentColor: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
  },
  {
    slug: "saas-for-remote-teams",
    tag: "Productivity",
    title: "Best SaaS Stacks for Remote Teams in 2026",
    excerpt:
      "Working across time zones doesn't have to mean lost productivity. These async-first SaaS tools are transforming how distributed teams collaborate.",
    date: "Sep 8, 2026",
    readTime: "7 min read",
    author: "Liam Park",
    authorRole: "Remote Work Advisor",
    featured: false,
    accentColor: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #5E4BEE 100%)",
  },
  {
    slug: "taskflow-case-study",
    tag: "Case Studies",
    title: "How DesignCo Scaled 3x with TaskFlow's Project Management Suite",
    excerpt:
      "A deep dive into how a 40-person design agency eliminated project chaos and boosted delivery speed by 60% using TaskFlow's Kanban and automation features.",
    date: "Sep 5, 2026",
    readTime: "6 min read",
    author: "Meera Joshi",
    authorRole: "Content Writer",
    featured: false,
    accentColor: "#6366F1",
    gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  },
  {
    slug: "saas-pricing-models-explained",
    tag: "Business Growth",
    title: "SaaS Pricing Models Explained: Which One Fits Your Business?",
    excerpt:
      "Flat-rate, per-seat, usage-based, or freemium — each pricing model has hidden trade-offs. This guide helps you pick the strategy that maximizes growth.",
    date: "Sep 2, 2026",
    readTime: "5 min read",
    author: "Kevin Oduya",
    authorRole: "Business Analyst",
    featured: false,
    accentColor: "#F97316",
    gradient: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
  },
  {
    slug: "securing-cloud-infrastructure",
    tag: "Guides",
    title: "Best Practices for Securing Your Cloud Infrastructure",
    excerpt:
      "Data breaches are costly. Learn how top-tier SaaS companies use Zero Trust architecture and encryption to protect their most valuable assets.",
    date: "Aug 28, 2026",
    readTime: "7 min read",
    author: "Elena Rossi",
    authorRole: "Security Engineer",
    featured: false,
    accentColor: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
  },
  {
    slug: "future-of-ai-customer-support",
    tag: "Trends",
    title: "The Future of AI in Customer Support Workflows",
    excerpt:
      "Chatbots are just the beginning. Discover how predictive AI is anticipating customer needs and resolving tickets before they're even filed.",
    date: "Aug 22, 2026",
    readTime: "4 min read",
    author: "Marcus Chen",
    authorRole: "AI Researcher",
    featured: false,
    accentColor: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #F43F5E 100%)",
  },
];

export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(6);

  const featuredPost = BLOG_POSTS.find((p) => p.featured)!;

  const filteredPosts = BLOG_POSTS.filter((p) => {
    if (p.featured) return false;
    const matchesCategory = activeCategory === "All" || p.tag === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout activeNav="resources">
      {/* Hero / Page Header */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-hero-content">
            <div className="section-badge">BLOG & RESOURCES</div>
            <h1 className="blog-hero-title">
              Insights for the <span className="section-title-highlight">SaaS Era</span>
            </h1>
            <p className="blog-hero-subtitle">
              Expert guides, product comparisons, industry trends, and practical tips
              to help you discover, buy, and grow with SaaS.
            </p>
            {/* Search Bar */}
            <div className="blog-search-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="blog-search-icon">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="blog-search-input"
                type="text"
                placeholder="Search articles, guides, trends..."
                className="blog-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="blog-search-clear" aria-label="Clear search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="blog-hero-blob blog-hero-blob--1" />
        <div className="blog-hero-blob blog-hero-blob--2" />
      </section>

      {/* Featured Article */}
      <section className="blog-featured-section">
        <div className="container">
          <div className="section-badge">FEATURED</div>
          <Link href={`/blog/${featuredPost.slug}`} className="blog-featured-card" id={`blog-featured-${featuredPost.slug}`}>
            <div className="blog-featured-banner" style={{ background: featuredPost.gradient }}>
              <div className="blog-featured-banner-decor">
                <svg viewBox="0 0 600 220" fill="none" preserveAspectRatio="none">
                  <path d="M0,80 C150,160 320,20 480,100 C550,140 600,90 600,90 L600,220 L0,220 Z" fill="rgba(255,255,255,0.1)" />
                  <path d="M0,120 C180,40 360,160 540,60 C570,45 600,70 600,70 L600,220 L0,220 Z" fill="rgba(255,255,255,0.06)" />
                  <circle cx="510" cy="50" r="70" fill="rgba(255,255,255,0.08)" />
                  <circle cx="80" cy="30" r="40" fill="rgba(255,255,255,0.06)" />
                </svg>
              </div>
              <span className="blog-featured-tag-badge">{featuredPost.tag}</span>
              <div className="blog-featured-banner-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>
            <div className="blog-featured-body">
              <div className="blog-featured-meta">
                <span className="blog-tag blog-tag--featured">{featuredPost.tag}</span>
                <span className="blog-meta-sep">•</span>
                <span className="blog-date">{featuredPost.date}</span>
                <span className="blog-meta-sep">•</span>
                <span className="blog-read-time">{featuredPost.readTime}</span>
              </div>
              <h2 className="blog-featured-title">{featuredPost.title}</h2>
              <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
              <div className="blog-featured-footer">
                <div className="blog-author">
                  <div className="blog-author-avatar" style={{ background: featuredPost.gradient }}>
                    {featuredPost.author.charAt(0)}
                  </div>
                  <div>
                    <div className="blog-author-name">{featuredPost.author}</div>
                    <div className="blog-author-role">{featuredPost.authorRole}</div>
                  </div>
                </div>
                <span className="blog-read-more-btn">
                  Read Article
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* All Articles */}
      <section className="blog-list-section">
        <div className="container">
          {/* Category Filters */}
          <div className="blog-filter-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`blog-filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
                className={`blog-filter-btn${activeCategory === cat ? " blog-filter-btn--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="blog-empty-state">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p>No articles found for &ldquo;{searchQuery || activeCategory}&rdquo;</p>
              <button className="btn-primary" onClick={() => { setSearchQuery(""); setActiveCategory("All"); setVisiblePosts(6); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="blog-grid">
              {filteredPosts.slice(0, visiblePosts).map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="blog-card"
                  id={`blog-card-${post.slug}`}
                >
                  <div className="blog-card-banner" style={{ background: post.gradient }}>
                    <svg viewBox="0 0 400 160" fill="none" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                      <path d="M0,60 C100,120 220,20 320,80 C370,110 400,70 400,70 L400,160 L0,160 Z" fill="rgba(255,255,255,0.08)" />
                      <circle cx="340" cy="30" r="40" fill="rgba(255,255,255,0.06)" />
                    </svg>
                    <span className="blog-tag-badge">{post.tag}</span>
                  </div>
                  <div className="blog-card-body">
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <span className="blog-read-more-btn" style={{ fontSize: '0.78rem' }}>
                        Read Now
                      </span>
                      <div className="blog-card-meta">
                        <span>{post.date}</span>
                        <span className="blog-meta-sep">·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Actions */}
          {(visiblePosts < filteredPosts.length || visiblePosts > 6) && (
            <div className="blog-load-more" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {visiblePosts < filteredPosts.length && (
                <button 
                  className="btn-secondary blog-load-more-btn" 
                  id="blog-load-more-btn"
                  onClick={() => setVisiblePosts(prev => prev + 6)}
                >
                  Load More Articles
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}
              {visiblePosts > 6 && (
                <button 
                  className="btn-secondary blog-load-more-btn" 
                  id="blog-show-less-btn"
                  onClick={() => {
                    setVisiblePosts(6);
                    const listSection = document.querySelector('.blog-list-section');
                    if (listSection) {
                      listSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Show Less Articles
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="blog-newsletter">
        <div className="container">
          <div className="blog-newsletter-card">
            <div className="blog-newsletter-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 className="blog-newsletter-title">Get the Weekly SaaS Digest</h2>
            <p className="blog-newsletter-sub">
              Curated articles, product launches, and trends delivered every Tuesday.
              Join 12,000+ SaaS enthusiasts.
            </p>
            <form
              className="blog-newsletter-form"
              onSubmit={(e) => e.preventDefault()}
              id="blog-newsletter-form"
            >
              <input
                id="blog-newsletter-email"
                type="email"
                placeholder="Enter your email address"
                className="blog-newsletter-input"
                required
              />
              <button type="submit" className="btn-primary" id="blog-newsletter-submit">
                Subscribe Free
              </button>
            </form>
            <p className="blog-newsletter-note">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

