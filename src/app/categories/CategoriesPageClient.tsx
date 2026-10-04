"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

interface Category {
  id: string;
  name: string;
  count: number;
  group: "ai" | "sales" | "dev" | "ops" | "collab";
  description: string;
  popular: string[];
  featured?: boolean;
  icon: React.ReactNode;
}

const CATEGORIES: Category[] = [
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    count: 245,
    group: "ai",
    featured: true,
    description: "Generative AI, LLMs, automated agents, and intelligent workflow assistants.",
    popular: ["OpenAI", "Anthropic", "Midjourney", "LangChain"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    )
  },
  {
    id: "crm",
    name: "CRM & Pipeline Management",
    count: 110,
    group: "sales",
    featured: true,
    description: "Lead management, sales pipeline tracking, and customer relationship systems.",
    popular: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  },
  {
    id: "dev-tools",
    name: "Developer Tools & APIs",
    count: 380,
    group: "dev",
    featured: true,
    description: "Code editors, CI/CD pipelines, API gateways, and testing frameworks.",
    popular: ["GitHub", "Postman", "Vercel", "Supabase"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  {
    id: "project-management",
    name: "Project Management",
    count: 165,
    group: "collab",
    description: "Agile boards, issue tracking, sprint planning, and roadmap management.",
    popular: ["Linear", "Jira", "Asana", "Monday.com"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    id: "marketing-automation",
    name: "Marketing Automation",
    count: 220,
    group: "sales",
    description: "Email campaigns, SEO tracking, omnichannel nurturing, and ad management.",
    popular: ["Klaviyo", "Mailchimp", "Semrush", "ActiveCampaign"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    )
  },
  {
    id: "hr-payroll",
    name: "HR, Payroll & Benefits",
    count: 135,
    group: "ops",
    description: "Employee onboarding, global payroll, compliance, and talent recruiting.",
    popular: ["Gusto", "Deel", "Rippling", "BambooHR"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    id: "security-compliance",
    name: "Security & Compliance",
    count: 85,
    group: "dev",
    description: "SOC-2 automation, cloud identity management, and vulnerability scanning.",
    popular: ["Vanta", "Drata", "1Password", "CrowdStrike"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )
  },
  {
    id: "finance-accounting",
    name: "Accounting & Finance",
    count: 105,
    group: "ops",
    description: "Automated billing, expense management, corporate cards, and tax filing.",
    popular: ["Stripe", "QuickBooks", "Brex", "Ramp"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    id: "customer-support",
    name: "Customer Support & Desk",
    count: 125,
    group: "collab",
    description: "Live chat widgets, omnichannel ticketing, and AI self-serve knowledge bases.",
    popular: ["Zendesk", "Intercom", "Front", "Help Scout"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    id: "design-ux",
    name: "Design & UX Tools",
    count: 95,
    group: "collab",
    description: "Vector UI design, interactive prototyping, and design system collaboration.",
    popular: ["Figma", "Framer", "Canva", "Sketch"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    )
  },
  {
    id: "analytics-bi",
    name: "Analytics & Business Intel",
    count: 145,
    group: "ai",
    description: "Product event tracking, executive dashboards, and customer journey analytics.",
    popular: ["Mixpanel", "PostHog", "Tableau", "Datadog"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    id: "cloud-devops",
    name: "Cloud & Infrastructure",
    count: 190,
    group: "dev",
    description: "Cloud hosting, container registries, monitoring, and serverless compute.",
    popular: ["AWS", "Cloudflare", "Docker", "Terraform"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    )
  },
];

const FILTER_GROUPS = [
  { id: "all", label: "All Categories" },
  { id: "ai", label: "AI & Analytics" },
  { id: "sales", label: "Sales & Marketing" },
  { id: "dev", label: "Engineering & Cloud" },
  { id: "ops", label: "Finance & HR" },
  { id: "collab", label: "Product & Collab" },
];

export default function CategoriesPageClient() {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      const matchesGroup = selectedGroup === "all" || cat.group === selectedGroup;
      const matchesSearch =
        searchQuery.trim() === "" ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.popular.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, searchQuery]);

  return (
    <PageLayout activeNav="categories">
      {/* Header */}
      <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem", marginTop: "3.5rem" }}>
        <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.75rem" }}>
          SOFTWARE DIRECTORY
        </div>
        <h1 className="section-title">
          Explore&nbsp;<span className="section-title-highlight">Categories</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: "750px", marginLeft: "auto", marginRight: "auto" }}>
          Find exactly what you need. Browse thousands of verified tools organized by department, technology stack, and business use case.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ maxWidth: "880px", margin: "0 auto 3.5rem" }}>
        <div style={{
          position: "relative",
          marginBottom: "1.5rem"
        }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--slate-400)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search categories (e.g. AI, CRM, Stripe, Linear, Security)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 1rem 1rem 3.25rem",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--slate-300)",
              fontSize: "1rem",
              outline: "none",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "1.25rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--slate-400)",
                fontSize: "1rem",
                fontWeight: 600
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Group Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {FILTER_GROUPS.map((grp) => {
            const isActive = selectedGroup === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                style={{
                  padding: "0.55rem 1.15rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  border: isActive ? "1px solid var(--primary)" : "1px solid var(--slate-200)",
                  background: isActive ? "var(--primary)" : "var(--white)",
                  color: isActive ? "var(--white)" : "var(--slate-700)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {grp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.15rem",
        marginBottom: "4.5rem"
      }}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "16px",
                  padding: "1.35rem 1.25rem 1.15rem",
                  border: "1px solid var(--slate-200)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
                  position: "relative"
                }}
                className="category-grid-card"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(94, 75, 238, 0.08)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {category.icon}
                  </div>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--slate-600)",
                    background: "var(--slate-100)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "var(--radius-full)"
                  }}>
                    {category.count} Products
                  </span>
                </div>

                <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.35rem" }}>
                  {category.name}
                </h3>
                <p style={{ color: "var(--slate-600)", fontSize: "0.825rem", lineHeight: "1.45", marginBottom: "0.85rem", flexGrow: 1 }}>
                  {category.description}
                </p>

                {/* Popular tools tags */}
                <div style={{ borderTop: "1px solid var(--slate-100)", paddingTop: "0.75rem", marginTop: "auto" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--slate-400)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Popular Tools:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {category.popular.map((tool) => (
                      <span
                        key={tool}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          color: "var(--slate-700)",
                          background: "var(--slate-50)",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "5px",
                          border: "1px solid var(--slate-200)"
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 1rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--slate-800)", marginBottom: "0.5rem" }}>
              No categories match your search
            </h3>
            <p style={{ color: "var(--slate-500)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Try searching for different keywords or clear the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGroup("all");
              }}
              className="btn btn-secondary"
              style={{ padding: "0.6rem 1.4rem" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Curated Stacks / Featured Collections */}
      <section style={{
        background: "var(--slate-50)",
        borderRadius: "24px",
        padding: "3.5rem 2.5rem",
        marginBottom: "5rem",
        border: "1px solid var(--slate-200)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="section-badge" style={{ display: "inline-block", marginBottom: "0.6rem" }}>
            CURATED STACKS
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "0.75rem" }}>
            Recommended Stacks for High-Growth Teams
          </h2>
          <p style={{ color: "var(--slate-600)", fontSize: "1rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            Handpicked tool combinations that work together seamlessly out of the box.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            {
              title: "Modern AI Startup Stack",
              desc: "Deploy intelligent user experiences with high-throughput inference, vector databases, and real-time observability.",
              tools: ["OpenAI", "Supabase", "Vercel", "LangChain"]
            },
            {
              title: "Product-Led Growth (PLG) Stack",
              desc: "Drive viral self-serve acquisition, track conversion funnels, and automate onboarding emails seamlessly.",
              tools: ["HubSpot", "Mixpanel", "PostHog", "Intercom"]
            },
            {
              title: "Enterprise Compliance & Ops Stack",
              desc: "Automate SOC-2 readiness, global payroll, identity management, and automated bookkeeping from day one.",
              tools: ["Vanta", "Deel", "Stripe", "1Password"]
            }
          ].map((stack, i) => (
            <div
              key={i}
              style={{
                background: "var(--white)",
                borderRadius: "16px",
                padding: "2rem",
                border: "1px solid var(--slate-200)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--slate-900)", marginBottom: "0.6rem" }}>
                {stack.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--slate-600)", lineHeight: "1.6", marginBottom: "1.25rem", flexGrow: 1 }}>
                {stack.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {stack.tools.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "rgba(94, 75, 238, 0.08)",
                      color: "var(--primary)",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px"
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category CTA Banner */}
      <section style={{
        background: "linear-gradient(135deg, var(--slate-900) 0%, #1e1b4b 100%)",
        borderRadius: "20px",
        padding: "2.75rem 2rem",
        textAlign: "center",
        color: "white",
        marginBottom: "4rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: "800", marginBottom: "0.85rem", color: "white" }}>
            Don&apos;t see your software category?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--slate-300)", lineHeight: "1.6", marginBottom: "1.75rem" }}>
            We continually expand our taxonomy to reflect the latest tools. Suggest a category or list your software on SaaS MRKT today.
          </p>
          <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sellers" className="btn btn-primary" style={{ padding: "0.7rem 1.6rem", fontSize: "0.925rem" }}>
              List Your Software
            </Link>
            <Link href="/contact" className="btn" style={{
              padding: "0.7rem 1.6rem",
              fontSize: "0.925rem",
              background: "rgba(255, 255, 255, 0.12)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "var(--radius-full)",
              fontWeight: 600
            }}>
              Suggest a Category
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
