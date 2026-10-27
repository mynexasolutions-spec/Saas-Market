"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import "./categories-page.css";

interface Category {
  id: string;
  name: string;
  count: number;
  description: string;
  popular: string[];
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const CATEGORIES_DATA: Category[] = [
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    count: 245,
    description: "Generative AI, LLMs, automated agents, and intelligent workflow assistants.",
    popular: ["OpenAI", "Anthropic", "Midjourney"],
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: "crm",
    name: "CRM & Pipeline Management",
    count: 110,
    description: "Lead management, sales pipeline tracking, and customer relationship systems.",
    popular: ["HubSpot", "Salesforce", "Pipedrive"],
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "dev-tools",
    name: "Developer Tools & APIs",
    count: 380,
    description: "Code editors, CI/CD pipelines, API gateways, and testing frameworks.",
    popular: ["GitHub", "Postman", "Vercel"],
    iconBg: "#F0F9FF",
    iconColor: "#0284C7",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "project-management",
    name: "Project Management",
    count: 165,
    description: "Agile boards, issue tracking, sprint planning, and roadmap management.",
    popular: ["Linear", "Jira", "Asana"],
    iconBg: "#EEF2FF",
    iconColor: "#4F46E5",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "marketing-automation",
    name: "Marketing Automation",
    count: 220,
    description: "Email campaigns, SEO tracking, omnichannel nurturing, and ad management.",
    popular: ["Klaviyo", "Mailchimp", "ActiveCampaign"],
    iconBg: "#FDF2F8",
    iconColor: "#DB2777",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    id: "hr-payroll",
    name: "HR, Payroll & Benefits",
    count: 135,
    description: "Employee onboarding, global payroll, compliance, and talent recruiting.",
    popular: ["Gusto", "Deel", "BambooHR"],
    iconBg: "#EEF2FF",
    iconColor: "#6366F1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "security-compliance",
    name: "Security & Compliance",
    count: 85,
    description: "SOC-2 automation, cloud identity management, and vulnerability scanning.",
    popular: ["Vanta", "1Password", "CrowdStrike"],
    iconBg: "#F0F9FF",
    iconColor: "#0284C7",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: "finance-accounting",
    name: "Accounting & Finance",
    count: 105,
    description: "Automated billing, expense management, corporate cards, and tax filing.",
    popular: ["Stripe", "QuickBooks", "Ramp"],
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "customer-support",
    name: "Customer Support & Desk",
    count: 125,
    description: "Live chat widgets, omnichannel ticketing, and AI self-serve knowledge bases.",
    popular: ["Zendesk", "Intercom", "Help Scout"],
    iconBg: "#EEF2FF",
    iconColor: "#4F46E5",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "design-ux",
    name: "Design & UX Tools",
    count: 95,
    description: "Vector UI design, interactive prototyping, and design system collaboration.",
    popular: ["Figma", "Framer", "Canva"],
    iconBg: "#FAF5FF",
    iconColor: "#9333EA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: "analytics-bi",
    name: "Analytics & Business Intel",
    count: 145,
    description: "Product event tracking, dashboards, and customer journey analytics.",
    popular: ["Mixpanel", "PostHog", "Tableau"],
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud & Infrastructure",
    count: 190,
    description: "Cloud hosting, container registries, monitoring, and serverless compute.",
    popular: ["AWS", "Cloudflare", "Docker"],
    iconBg: "#F0F9FF",
    iconColor: "#0284C7",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
];

const CURATED_STACKS = [
  {
    title: "Modern AI Startup Stack",
    desc: "Deploy intelligent user experiences with high-throughput inference, vector databases, and real-time observability.",
    tools: ["OpenAI", "Supabase", "Vercel", "LangChain"],
    iconClass: "stack-icon-dark-blue",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: "Product-Led Growth (PLG) Stack",
    desc: "Drive viral self-serve acquisition, track conversion funnels, and automate onboarding emails seamlessly.",
    tools: ["HubSpot", "Mixpanel", "PostHog", "Intercom"],
    iconClass: "stack-icon-dark-purple",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Enterprise Compliance & Ops Stack",
    desc: "Automate SOC-2 readiness, global payroll, identity management, and automated bookkeeping from day one.",
    tools: ["Vanta", "Deel", "Stripe", "1Password"],
    iconClass: "stack-icon-dark-teal",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

export default function CategoriesPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "products-desc" | "alpha">("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [suggestForm, setSuggestForm] = useState({
    name: "",
    desc: "",
    tools: "",
    email: "",
  });

  // Filter & Sort Logic
  const filteredAndSortedCategories = useMemo(() => {
    let result = CATEGORIES_DATA.filter((cat) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.popular.some((tool) => tool.toLowerCase().includes(q))
      );
    });

    if (sortBy === "products-desc") {
      result = [...result].sort((a, b) => b.count - a.count);
    } else if (sortBy === "alpha") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, sortBy]);

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestForm.name.trim()) {
      setSuggestionSubmitted(true);
      setTimeout(() => {
        setSuggestModalOpen(false);
        setSuggestionSubmitted(false);
        setSuggestForm({ name: "", desc: "", tools: "", email: "" });
      }, 2500);
    }
  };

  return (
    <PageLayout activeNav="categories" noContainer>
      <div className="categories-page-wrapper">
        <div className="categories-container">
          {/* 1. Top Navigation & Search Bar */}
          <div className="categories-top-bar">
            <nav className="categories-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="breadcrumb-home">
                Home
              </Link>
              <span className="breadcrumb-sep">&gt;</span>
              <span className="breadcrumb-current">Categories</span>
            </nav>

            <div className="categories-search-box">
              <svg
                className="categories-search-icon"
                width="16"
                height="16"
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
                type="text"
                className="categories-search-input"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search categories"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="categories-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 2. Hero Section: Left content + Right 3D Visual */}
          <section className="categories-hero-section">
            <div className="categories-hero-left">
              <h1 className="categories-hero-title">
                Explore SaaS <br />
                <span className="categories-hero-title-gradient">Categories</span>
              </h1>

              <p className="categories-hero-desc">
                Discover top SaaS tools across industry domains, from developer
                infrastructure to enterprise solutions.
              </p>

              {/* 3 Value Stats Badges */}
              <div className="categories-hero-stats-row">
                <div className="categories-stat-badge">
                  <div className="stat-icon-box stat-purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div className="stat-text-group">
                    <span className="stat-count-num">2,500+</span>
                    <span className="stat-count-label">SaaS Products</span>
                  </div>
                </div>

                <div className="categories-stat-badge">
                  <div className="stat-icon-box stat-blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="stat-text-group">
                    <span className="stat-count-num">50+</span>
                    <span className="stat-count-label">Categories</span>
                  </div>
                </div>

                <div className="categories-stat-badge">
                  <div className="stat-icon-box stat-emerald">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div className="stat-text-group">
                    <span className="stat-count-num">Verified</span>
                    <span className="stat-count-label">Tools &amp; Reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3D Floating Glassmorphic Composition */}
            <div className="categories-hero-right" aria-hidden="true">
              <div className="categories-3d-scene">
                <div className="categories-ambient-glow" />
                <div className="categories-orbital-ring" />
                <div className="categories-orbital-inner" />

                {/* Floating Spheres */}
                <div className="floating-sphere sphere-1" />
                <div className="floating-sphere sphere-2" />
                <div className="floating-sphere sphere-3" />

                {/* Tile 1: Top Center (Purple 4-Square Apps Grid) */}
                <div className="tile-3d tile-apps">
                  <div className="tile-apps-grid">
                    <div className="tile-app-box" />
                    <div className="tile-app-box" />
                    <div className="tile-app-box" />
                    <div className="tile-app-box" />
                  </div>
                </div>

                {/* Tile 2: Top Right (Blue Cloud) */}
                <div className="tile-3d tile-cloud">
                  <svg className="tile-cloud-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                  </svg>
                </div>

                {/* Tile 3: Bottom Left (Pink Bar Chart) */}
                <div className="tile-3d tile-chart">
                  <div className="tile-chart-bars">
                    <div className="chart-bar-1" />
                    <div className="chart-bar-2" />
                    <div className="chart-bar-3" />
                  </div>
                </div>

                {/* Tile 4: Bottom Center-Right (Blue Shield with Check) */}
                <div className="tile-3d tile-shield">
                  <div className="tile-shield-inner">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. "All Categories" Header & Sort Filter */}
          <div className="categories-section-header-bar">
            <div>
              <h2 className="categories-section-head-title">All Categories</h2>
              <p className="categories-section-head-sub">
                Browse tools by industry, use case, or business function.
              </p>
            </div>

            <div className="categories-sort-wrapper">
              <button
                type="button"
                className="categories-sort-btn"
                onClick={() => setSortOpen(!sortOpen)}
                aria-expanded={sortOpen}
                aria-haspopup="true"
              >
                <span>
                  {sortBy === "popular" && "Most Popular"}
                  {sortBy === "products-desc" && "Most Products"}
                  {sortBy === "alpha" && "Alphabetical (A-Z)"}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {sortOpen && (
                <div className="categories-sort-menu" role="menu">
                  <button
                    type="button"
                    className={`sort-menu-item ${sortBy === "popular" ? "active" : ""}`}
                    onClick={() => {
                      setSortBy("popular");
                      setSortOpen(false);
                    }}
                  >
                    Most Popular
                  </button>
                  <button
                    type="button"
                    className={`sort-menu-item ${sortBy === "products-desc" ? "active" : ""}`}
                    onClick={() => {
                      setSortBy("products-desc");
                      setSortOpen(false);
                    }}
                  >
                    Most Products
                  </button>
                  <button
                    type="button"
                    className={`sort-menu-item ${sortBy === "alpha" ? "active" : ""}`}
                    onClick={() => {
                      setSortBy("alpha");
                      setSortOpen(false);
                    }}
                  >
                    Alphabetical (A-Z)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. 12 Categories in 4-Column Grid */}
          <div className="categories-main-grid">
            {filteredAndSortedCategories.length > 0 ? (
              filteredAndSortedCategories.map((cat) => (
                <Link
                  href={`/categories/${cat.id}`}
                  key={cat.id}
                  className="category-card-link"
                >
                  <div className="category-pro-card">
                    {/* Top Row: Icon + Count */}
                    <div className="category-card-top-row">
                      <div
                        className="category-icon-box"
                        style={{ background: cat.iconBg, color: cat.iconColor }}
                      >
                        {cat.icon}
                      </div>
                      <span className="category-count-pill">
                        {cat.count} Products
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="category-title">{cat.name}</h3>
                    <p className="category-desc">{cat.description}</p>

                    {/* Popular Tools Row */}
                    <div className="category-popular-section">
                      <div className="category-popular-label">Popular Tools:</div>
                      <div className="category-popular-row">
                        <div className="category-tools-pills">
                          {cat.popular.map((tool) => (
                            <span
                              key={tool}
                              className="category-tool-tag"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                        <div className="category-arrow-btn" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="categories-empty-state">
                <div className="empty-state-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3 className="empty-state-title">
                  No categories found matching &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="empty-state-desc">
                  Try searching for different keywords like CRM, AI, or developer tools.
                </p>
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* 5. Curated Stacks Section */}
          <section className="curated-stacks-box">
            <div className="curated-stacks-header">
              <span className="curated-stacks-badge">CURATED STACKS</span>
              <h2 className="curated-stacks-title">
                Recommended Stacks for High-Growth Teams
              </h2>
              <p className="curated-stacks-desc">
                Handpicked tool combinations that work together seamlessly out of the box.
              </p>
            </div>

            <div className="curated-stacks-grid">
              {CURATED_STACKS.map((stack, idx) => (
                <div key={idx} className="curated-stack-card">
                  <div className={`curated-stack-icon-box ${stack.iconClass}`}>
                    {stack.icon}
                  </div>
                  <h3 className="curated-stack-name">{stack.title}</h3>
                  <p className="curated-stack-desc">{stack.desc}</p>

                  <div className="curated-stack-bottom-row">
                    <div className="curated-stack-pills">
                      {stack.tools.map((tool) => (
                        <span key={tool} className="curated-stack-pill">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <div className="curated-stack-arrow" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Suggest a New Category CTA Banner */}
          <section className="category-suggest-banner">
            <div className="suggest-banner-glow" aria-hidden="true" />
            <div className="suggest-banner-orbitals" aria-hidden="true" />

            <div className="suggest-banner-left">
              <span className="suggest-badge-tag">CAN&apos;T FIND A CATEGORY?</span>
              <h2 className="suggest-banner-title">
                Suggest a <span className="suggest-title-highlight">New Category</span>
              </h2>
              <p className="suggest-banner-desc">
                Help us grow our marketplace. Suggest a category and we&apos;ll review it.
              </p>
            </div>

            {/* Glowing 3D Lightbulb Tile */}
            <div className="suggest-banner-center-visual" aria-hidden="true">
              <div className="suggest-bulb-tile">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                </svg>
              </div>
            </div>

            <div className="suggest-banner-right">
              <button
                type="button"
                className="suggest-action-btn"
                onClick={() => setSuggestModalOpen(true)}
              >
                <span>Suggest a Category</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* 7. Suggest Category Modal */}
      {suggestModalOpen && (
        <div
          className="suggest-modal-overlay"
          onClick={() => setSuggestModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="suggest-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="suggest-modal-close"
              onClick={() => setSuggestModalOpen(false)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="suggest-modal-head">
              <h3 className="suggest-modal-title">Suggest a New Category</h3>
              <p className="suggest-modal-desc">
                Tell us which SaaS industry domain or software vertical you would like added to SaaS MRKT.
              </p>
            </div>

            {suggestionSubmitted ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#ECFDF5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem"
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: 750, color: "#0F172A", marginBottom: "0.5rem" }}>
                  Thank you for your suggestion!
                </h4>
                <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                  Our taxonomy team will review your suggested category and include it in the next directory update.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit}>
                <div className="suggest-form-group">
                  <label className="suggest-form-label" htmlFor="cat-name">
                    Category Name *
                  </label>
                  <input
                    id="cat-name"
                    type="text"
                    className="suggest-form-input"
                    placeholder="e.g. Video Editing & Screen Recording"
                    required
                    value={suggestForm.name}
                    onChange={(e) =>
                      setSuggestForm({ ...suggestForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="suggest-form-group">
                  <label className="suggest-form-label" htmlFor="cat-desc">
                    Brief Description *
                  </label>
                  <textarea
                    id="cat-desc"
                    className="suggest-form-textarea"
                    placeholder="What types of SaaS tools belong in this category?"
                    required
                    value={suggestForm.desc}
                    onChange={(e) =>
                      setSuggestForm({ ...suggestForm, desc: e.target.value })
                    }
                  />
                </div>

                <div className="suggest-form-group">
                  <label className="suggest-form-label" htmlFor="cat-tools">
                    Sample SaaS Tools (Optional)
                  </label>
                  <input
                    id="cat-tools"
                    type="text"
                    className="suggest-form-input"
                    placeholder="e.g. Loom, Descript, Camtasia"
                    value={suggestForm.tools}
                    onChange={(e) =>
                      setSuggestForm({ ...suggestForm, tools: e.target.value })
                    }
                  />
                </div>

                <div className="suggest-form-group">
                  <label className="suggest-form-label" htmlFor="cat-email">
                    Your Email (Optional, for updates)
                  </label>
                  <input
                    id="cat-email"
                    type="email"
                    className="suggest-form-input"
                    placeholder="you@company.com"
                    value={suggestForm.email}
                    onChange={(e) =>
                      setSuggestForm({ ...suggestForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="suggest-modal-actions">
                  <button
                    type="button"
                    className="suggest-btn-cancel"
                    onClick={() => setSuggestModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="suggest-btn-submit">
                    Submit Suggestion
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
