"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "./blog-page.css";

interface BlogPost {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  featured?: boolean;
  accentColor?: string;
  gradient?: string;
}

const CATEGORIES = [
  "All",
  "Business Growth",
  "Guides",
  "Trends",
  "Productivity",
  "Reviews",
  "Case Studies",
];

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-agents-autonomous-saas-workflows-2026",
    tag: "Trends",
    title:
      "How Autonomous AI Agents Are Replacing Repetitive SaaS Workflows in 2026",
    excerpt:
      "From automated customer triage to real-time ledger closing, autonomous AI agents are turning static SaaS dashboards into proactive digital co-workers.",
    date: "Oct 10, 2026",
    readTime: "9 min read",
    author: "Elena Rostova",
    authorRole: "Head of AI Strategy",
    featured: true,
    accentColor: "#4F46E5",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  },
  {
    slug: "best-free-open-source-developer-tools-2026",
    tag: "Productivity",
    title:
      "Best Free & Open-Source Developer Tools Every Dev Should Know in 2026",
    excerpt:
      "Supercharge your engineering workflow without expensive licenses. Here are the top open-source tools for API testing, local Docker orchestration, and database inspection.",
    date: "Oct 11, 2026",
    readTime: "8 min read",
    author: "Kevin Oduya",
    authorRole: "Principal Architect",
    featured: false,
    accentColor: "#0284C7",
    gradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
  },
  {
    slug: "micro-saas-stack-bootstrapped-founders-2026",
    tag: "Guides",
    title:
      "The $100/Month Lean SaaS Stack: How Bootstrapped Founders Scale to $20K MRR",
    excerpt:
      "Stop burning cash on bloated enterprise software. Here is the exact, battle-tested minimal SaaS stack used by solo founders to scale profitably in 2026.",
    date: "Oct 8, 2026",
    readTime: "8 min read",
    author: "Zack Robinson",
    authorRole: "Micro-SaaS Founder",
    featured: false,
    accentColor: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
  {
    slug: "saas-security-zero-trust-vendor-compliance",
    tag: "Business Growth",
    title:
      "The 2026 SaaS Security Playbook: Zero-Trust, API Hardening & Vendor Risk",
    excerpt:
      "With third-party software supply chain breaches surging, engineering leads and CTOs need this zero-trust architecture to audit vendor tokens, webhooks, and SOC2 compliance.",
    date: "Oct 6, 2026",
    readTime: "10 min read",
    author: "David Sterling",
    authorRole: "CISO",
    featured: false,
    accentColor: "#0F172A",
    gradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
  },
  {
    slug: "death-of-per-seat-pricing-usage-based-saas",
    tag: "Trends",
    title:
      "Why Per-Seat Pricing Is Dying: The Rise of Outcome & Consumption-Based SaaS",
    excerpt:
      "AI automation means fewer human seats do vastly more work. Here is why the software industry is transitioning to consumption, credit, and outcome billing in 2026.",
    date: "Oct 4, 2026",
    readTime: "9 min read",
    author: "Marcus Vance",
    authorRole: "Pricing Strategist",
    featured: false,
    accentColor: "#EC4899",
    gradient: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
  },
  {
    slug: "best-project-management-tools-2026",
    tag: "Reviews",
    title: "Best Project Management Tools for Remote & Agile Teams in 2026",
    excerpt:
      "We tested 12 agile project management platforms across sprint tracking, Gantt automation, and team adoption. Here are the top 5 tools delivering peak delivery speed in 2026.",
    date: "Oct 5, 2026",
    readTime: "9 min read",
    author: "Arjun Mehta",
    authorRole: "Product Strategist",
    featured: false,
    accentColor: "#6366F1",
    gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  },
  {
    slug: "best-crm-software-startups-2026",
    tag: "Guides",
    title: "Top 7 B2B CRM Software for Fast-Growing Startups (Ranked by ROI)",
    excerpt:
      "Stop losing pipeline deals to messy spreadsheets. Discover the highest-converting B2B CRMs offering automated follow-ups, deal scoring, and startup-friendly pricing in 2026.",
    date: "Oct 2, 2026",
    readTime: "8 min read",
    author: "Sara Chen",
    authorRole: "Market Analyst",
    featured: false,
    accentColor: "#EF4444",
    gradient: "linear-gradient(135deg, #EF4444 0%, #F97316 100%)",
  },
  {
    slug: "best-accounting-software-small-business",
    tag: "Reviews",
    title:
      "Best Accounting & Invoicing Software for Small Businesses (2026 Review)",
    excerpt:
      "Tired of reconciling receipts and chasing overdue invoices? We reviewed the top cloud accounting platforms for SMBs, evaluating bank integrations and tax compliance.",
    date: "Sep 28, 2026",
    readTime: "7 min read",
    author: "Kevin Oduya",
    authorRole: "Financial Analyst",
    featured: false,
    accentColor: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
  },
  {
    slug: "saas-stack-audit-cut-wasted-spend",
    tag: "Business Growth",
    title: "How to Audit Your SaaS Stack & Cut 30% Wasted Spend in 2026",
    excerpt:
      "The average company wastes $3,400 per employee annually on redundant or unused software licenses. Follow this step-by-step audit playbook to reclaim your bottom line.",
    date: "Sep 25, 2026",
    readTime: "9 min read",
    author: "Elena Rossi",
    authorRole: "Procurement Specialist",
    featured: false,
    accentColor: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
  },
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
    featured: false,
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
    authorRole: "HR Tech Lead",
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
    authorRole: "Remote Advisor",
    featured: false,
    accentColor: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #5E4BEE 100%)",
  },
  {
    slug: "taskflow-case-study",
    tag: "Case Studies",
    title: "How DesignCo Scaled 3x with TaskFlow's Project Management Suite",
    excerpt:
      "A deep dive into how a 40-person design agency eliminated project chaos and boosted delivery speed by 60% using TaskFlow's Kanban and automation.",
    date: "Sep 5, 2026",
    readTime: "6 min read",
    author: "Meera Joshi",
    authorRole: "Content Lead",
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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: BLOG_POSTS.length };
    BLOG_POSTS.forEach((p) => {
      counts[p.tag] = (counts[p.tag] || 0) + 1;
    });
    return counts;
  }, []);

  // Spotlight Featured Posts (3 newest articles)
  const spotlightPosts = useMemo(() => {
    return [
      BLOG_POSTS[1], // best-free-open-source-developer-tools-2026 (Oct 11)
      BLOG_POSTS[0], // ai-agents-autonomous-saas-workflows-2026 (Oct 10)
      BLOG_POSTS[2], // micro-saas-stack-bootstrapped-founders-2026 (Oct 8)
    ];
  }, []);

  const spotlightSlugs = useMemo(
    () => new Set(spotlightPosts.map((p) => p.slug)),
    [spotlightPosts]
  );

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      // In "All" view with no search, don't repeat the 3 spotlight posts in the grid
      if (activeCategory === "All" && !searchQuery && spotlightSlugs.has(p.slug)) {
        return false;
      }
      const matchesCategory =
        activeCategory === "All" || p.tag === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, spotlightSlugs]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageLayout activeNav="resources" noContainer>
      <div className="blog-page-wrapper">
        <div className="blog-container">
          {/* 1. Breadcrumb: ⌂ Home › Blog & Resources */}
          <nav className="blog-breadcrumb-row" aria-label="Breadcrumb">
            <Link href="/" className="blog-breadcrumb-link">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span className="blog-breadcrumb-sep">›</span>
            <span className="blog-breadcrumb-current">Blog &amp; Resources</span>
          </nav>

          {/* 2. Compact Modern Hero Header */}
          <header className="blog-hero-section">
            <div className="blog-hero-badge">INSIGHTS &amp; GUIDES</div>
            <h1 className="blog-hero-title">
              Insights for the{" "}
              <span className="blog-hero-highlight">SaaS Era</span>
            </h1>
            <p className="blog-hero-desc">
              Practical playbooks, product comparisons, and growth benchmarks
              for modern software teams.
            </p>

            {/* Compact Search Box */}
            <div className="blog-search-box">
              <svg
                className="blog-search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="blog-search-input"
                type="text"
                placeholder="Search articles, guides, benchmarks..."
                className="blog-search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisiblePosts(6);
                }}
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="blog-search-clear"
                  aria-label="Clear search"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ) : (
                <span className="blog-search-kbd">⌘K</span>
              )}
            </div>

            {/* Horizontal Category Chips */}
            <div
              className="blog-categories-bar"
              role="tablist"
              aria-label="Blog categories"
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    id={`blog-filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
                    className={`blog-category-chip ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setVisiblePosts(6);
                    }}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <span>{cat}</span>
                    <span className="blog-category-count">({count})</span>
                  </button>
                );
              })}
            </div>
          </header>

          {/* 3. Featured Article Section (3 Newest Blogs in 1 Row with 3 Cols on Desktop) */}
          {activeCategory === "All" && !searchQuery && spotlightPosts.length > 0 && (
            <section
              className="blog-featured-section"
              aria-label="Spotlight Stories"
            >
              <div className="blog-section-header-compact">
                <span className="blog-section-tag">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Spotlight Stories (Latest)
                </span>
              </div>

              <div className="blog-spotlight-grid">
                {spotlightPosts.map((post, index) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.slug}
                    className="blog-spotlight-card"
                    id={`blog-spotlight-${post.slug}`}
                  >
                    {/* Media Thumbnail */}
                    <div className="blog-spotlight-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/blog/${post.slug}.jpg`}
                        alt={post.title}
                        className="blog-spotlight-img"
                        loading="lazy"
                      />
                      <div className="blog-spotlight-overlay" />
                      <span className="blog-spotlight-badge">
                        {index === 0 ? "🔥 Newest" : "Spotlight"}
                      </span>
                      <span className="blog-spotlight-tag">{post.tag}</span>
                    </div>

                    {/* Content */}
                    <div className="blog-spotlight-content">
                      <div className="blog-spotlight-meta">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="blog-spotlight-title">{post.title}</h3>
                      <p className="blog-spotlight-excerpt">{post.excerpt}</p>

                      <div className="blog-spotlight-footer">
                        <div className="blog-author-box">
                          <div className="blog-author-avatar">
                            {getAuthorInitials(post.author)}
                          </div>
                          <div className="blog-author-info">
                            <span className="blog-author-name">
                              {post.author}
                            </span>
                            <span className="blog-author-role">
                              {post.authorRole}
                            </span>
                          </div>
                        </div>

                        <span className="blog-spotlight-cta">
                          <span>Read</span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 4. Articles Grid */}
          <section className="blog-list-section" id="blog-articles-list">
            <div className="blog-grid-header">
              <h2 className="blog-grid-heading">
                <span>
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : activeCategory === "All"
                    ? "Latest Articles"
                    : `${activeCategory}`}
                </span>
                <span className="blog-grid-counter">
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "article" : "articles"}
                </span>
              </h2>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="blog-empty-state">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p>
                  No articles found matching &ldquo;
                  {searchQuery || activeCategory}&rdquo;
                </p>
                <button
                  type="button"
                  className="blog-empty-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                    setVisiblePosts(6);
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="blog-cards-grid">
                {filteredPosts.slice(0, visiblePosts).map((post) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.slug}
                    className="blog-compact-card"
                    id={`blog-card-${post.slug}`}
                  >
                    {/* Card Thumbnail */}
                    <div className="blog-card-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/blog/${post.slug}.jpg`}
                        alt={post.title}
                        className="blog-card-img"
                        loading="lazy"
                      />
                      <span className="blog-card-tag">{post.tag}</span>
                    </div>

                    {/* Card Body */}
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{post.date}</span>
                        <span className="blog-card-meta-dot">•</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-excerpt">{post.excerpt}</p>

                      <div className="blog-card-footer">
                        <div className="blog-card-author-mini">
                          <span className="blog-avatar-mini">
                            {getAuthorInitials(post.author)}
                          </span>
                          <span className="blog-card-author-name">
                            {post.author}
                          </span>
                        </div>

                        <span className="blog-card-link-arrow">
                          <span>Read</span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {(visiblePosts < filteredPosts.length || visiblePosts > 6) && (
              <div className="blog-pagination-row">
                <span className="blog-pagination-status">
                  Showing {Math.min(visiblePosts, filteredPosts.length)} of{" "}
                  {filteredPosts.length} articles
                </span>
                <div className="blog-pagination-buttons">
                  {visiblePosts < filteredPosts.length && (
                    <button
                      type="button"
                      className="blog-load-more-btn primary"
                      id="blog-load-more-btn"
                      onClick={() => setVisiblePosts((prev) => prev + 6)}
                    >
                      <span>Load More Articles</span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                  {visiblePosts > 6 && (
                    <button
                      type="button"
                      className="blog-load-more-btn"
                      id="blog-show-less-btn"
                      onClick={() => {
                        setVisiblePosts(6);
                        const listSection = document.querySelector(
                          ".blog-list-section"
                        );
                        if (listSection) {
                          listSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <span>Show Less</span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* 5. Compact Newsletter Bar (Minimal Vertical Space) */}
          <section className="blog-newsletter-banner" aria-label="Newsletter">
            <div className="blog-nl-layout">
              <div className="blog-nl-left">
                <div className="blog-nl-icon-box">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="blog-nl-text">
                  <h3>Get the Weekly SaaS Digest</h3>
                  <p>
                    Curated playbooks, benchmarks &amp; launch trends. Join
                    12,000+ founders and operators.
                  </p>
                </div>
              </div>

              {subscribed ? (
                <div className="blog-nl-success">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>You&apos;re subscribed! Welcome aboard.</span>
                </div>
              ) : (
                <form className="blog-nl-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    className="blog-nl-input"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    aria-label="Email for SaaS digest"
                  />
                  <button type="submit" className="blog-nl-btn">
                    Subscribe Free
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
