"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";

export interface ComparableOption {
  id: string;
  name: string;
  sub: string;
  letter: string;
  color: string;
  category: string;
  isMarketplace: boolean;
  price: string;
  rating: number;
  reviews: string;
  ipTransfer: string;
  edgeLatency: string;
  sla: string;
  soc2: string;
  support: string;
  hosting: string;
  api: string;
}

interface ProductMoreDetailsClientProps {
  product: ProductItem;
  initialTab?: "overview" | "architecture" | "security" | "financials" | "reviews" | "compare";
}

export default function ProductMoreDetailsClient({ product, initialTab = "overview" }: ProductMoreDetailsClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "security" | "financials" | "reviews" | "compare">(initialTab);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["overview", "architecture", "security", "financials", "reviews", "compare"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const sellerName = product.sellerName || "Elena Rostova";
  const techStack = product.techStack || ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS"];

  // Marketplace comparable options from ALL_PRODUCTS
  const marketplaceOptions = React.useMemo<ComparableOption[]>(() => {
    return ALL_PRODUCTS.filter((p) => p.id !== product.id).map((p) => ({
      id: p.id,
      name: p.name,
      sub: `SaaS MRKT • ${p.category}`,
      letter: p.brandLetter || p.name.charAt(0),
      color: p.brandColor || "#4F46E5",
      category: p.category,
      isMarketplace: true,
      price: `$${p.price}/mo`,
      rating: p.rating || 4.8,
      reviews: (p.reviewCount || 1250).toLocaleString(),
      ipTransfer: "✓ 100% Full IP Transfer via Escrow",
      edgeLatency: "< 110ms Edge Routing",
      sla: "99.98% High-Availability",
      soc2: "Pre-audited SOC 2 & GDPR",
      support: "45-Day 1-on-1 Founder Transition",
      hosting: p.techStack && p.techStack.length > 0 ? p.techStack.slice(0, 3).join(", ") : "Next.js, Node, AWS",
      api: "OpenAPI 3.0 + Webhooks",
    }));
  }, [product.id]);

  // Industry alternatives pool
  const industryOptions = React.useMemo<ComparableOption[]>(() => [
    {
      id: "ext-bamboohr",
      name: "BambooHR",
      sub: "Legacy SMB HR Platform",
      letter: "B",
      color: "#16A34A",
      category: "HR & Payroll",
      isMarketplace: false,
      price: "$108/mo (min 20 seats)",
      rating: 4.5,
      reviews: "2,410",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "240ms P95",
      sla: "99.90% SLA",
      soc2: "Enterprise Add-on ($$$)",
      support: "Standard Ticket Queue",
      hosting: "Proprietary Cloud",
      api: "REST API (Rate limited)",
    },
    {
      id: "ext-rippling",
      name: "Rippling",
      sub: "All-in-one Workforce Cloud",
      letter: "R",
      color: "#E11D48",
      category: "HR & Payroll",
      isMarketplace: false,
      price: "$140/mo (Base + seat fees)",
      rating: 4.6,
      reviews: "1,980",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "210ms P95",
      sla: "99.90% SLA",
      soc2: "Annual Add-on Fee",
      support: "Chat / 48h SLA",
      hosting: "Proprietary Cloud",
      api: "REST API Only",
    },
    {
      id: "ext-gusto",
      name: "Gusto",
      sub: "Payroll & Benefits Cloud",
      letter: "G",
      color: "#F43F5E",
      category: "HR & Payroll",
      isMarketplace: false,
      price: "$80/mo + $6/user",
      rating: 4.5,
      reviews: "3,200",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "220ms P95",
      sla: "99.90% SLA",
      soc2: "Standard",
      support: "Email & Phone Support",
      hosting: "Ruby/Rails Cloud",
      api: "Partner API",
    },
    {
      id: "ext-monday",
      name: "Monday.com",
      sub: "Enterprise Work OS",
      letter: "M",
      color: "#F59E0B",
      category: "Project Management",
      isMarketplace: false,
      price: "$48/mo (min 3 seats)",
      rating: 4.6,
      reviews: "3,890",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "220ms P95",
      sla: "99.90% SLA",
      soc2: "Enterprise Plan Only",
      support: "Tiered Ticket Support",
      hosting: "Shared AWS Cloud",
      api: "GraphQL (Limited)",
    },
    {
      id: "ext-asana",
      name: "Asana",
      sub: "Team Task Management",
      letter: "A",
      color: "#E11D48",
      category: "Project Management",
      isMarketplace: false,
      price: "$32.99/user/mo",
      rating: 4.5,
      reviews: "4,120",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "190ms P95",
      sla: "99.90% SLA",
      soc2: "Enterprise Plan Only",
      support: "Forum & Ticket",
      hosting: "AWS Monolith",
      api: "REST API v1",
    },
    {
      id: "ext-linear",
      name: "Linear",
      sub: "High-Speed Issue Tracking",
      letter: "L",
      color: "#5E6AD2",
      category: "Project Management",
      isMarketplace: false,
      price: "$10/user/mo",
      rating: 4.8,
      reviews: "1,850",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "120ms P95",
      sla: "99.95% SLA",
      soc2: "Standard",
      support: "Slack & Email",
      hosting: "Modern Cloud",
      api: "GraphQL Realtime",
    },
    {
      id: "ext-hubspot",
      name: "HubSpot CRM",
      sub: "Inbound Marketing & CRM",
      letter: "H",
      color: "#F97316",
      category: "CRM & Sales",
      isMarketplace: false,
      price: "$50/mo (Starter Tier)",
      rating: 4.5,
      reviews: "4,500",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "250ms P95",
      sla: "99.90% SLA",
      soc2: "Enterprise Tier ($$$)",
      support: "Phone & Chat",
      hosting: "Proprietary Cloud",
      api: "REST API (Strict caps)",
    },
    {
      id: "ext-salesforce",
      name: "Salesforce Essentials",
      sub: "Small Business CRM",
      letter: "S",
      color: "#0284C7",
      category: "CRM & Sales",
      isMarketplace: false,
      price: "$30/user/mo",
      rating: 4.4,
      reviews: "3,200",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "280ms P95",
      sla: "99.85% SLA",
      soc2: "Requires Add-on",
      support: "Tiered Support",
      hosting: "Salesforce Cloud",
      api: "SOAP & REST API",
    },
    {
      id: "ext-quickbooks",
      name: "QuickBooks Online",
      sub: "Small Business Bookkeeping",
      letter: "Q",
      color: "#10B981",
      category: "Finance & Accounting",
      isMarketplace: false,
      price: "$38/mo (Simple Start)",
      rating: 4.4,
      reviews: "5,800",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "290ms P95",
      sla: "99.80% SLA",
      soc2: "Standard",
      support: "Chat Support",
      hosting: "Intuit Cloud",
      api: "Intuit Developer API",
    },
    {
      id: "ext-xero",
      name: "Xero",
      sub: "Cloud Accounting Platform",
      letter: "X",
      color: "#0EA5E9",
      category: "Finance & Accounting",
      isMarketplace: false,
      price: "$47/mo (Growing)",
      rating: 4.5,
      reviews: "3,100",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "260ms P95",
      sla: "99.85% SLA",
      soc2: "Standard",
      support: "Email Support",
      hosting: "AWS Cloud",
      api: "REST API v2",
    },
    {
      id: "ext-zendesk",
      name: "Zendesk",
      sub: "Enterprise Customer Helpdesk",
      letter: "Z",
      color: "#03363D",
      category: "Customer Support",
      isMarketplace: false,
      price: "$69/user/mo",
      rating: 4.4,
      reviews: "4,800",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "240ms P95",
      sla: "99.90% SLA",
      soc2: "Enterprise Tier",
      support: "Ticket Queue",
      hosting: "Zendesk Cloud",
      api: "REST API",
    },
    {
      id: "ext-intercom",
      name: "Intercom",
      sub: "AI Customer Communications",
      letter: "I",
      color: "#1F8CEB",
      category: "Customer Support",
      isMarketplace: false,
      price: "$74/mo + AI fees",
      rating: 4.5,
      reviews: "2,600",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "210ms P95",
      sla: "99.90% SLA",
      soc2: "Enterprise Tier",
      support: "Fin AI Bot First",
      hosting: "AWS Cloud",
      api: "REST & Webhooks",
    },
    {
      id: "ext-klaviyo",
      name: "Klaviyo",
      sub: "Lifecycle Marketing Automation",
      letter: "K",
      color: "#2563EB",
      category: "Marketing & Automation",
      isMarketplace: false,
      price: "$60/mo + list fees",
      rating: 4.6,
      reviews: "2,900",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "200ms P95",
      sla: "99.90% SLA",
      soc2: "Standard",
      support: "Email & Chat",
      hosting: "AWS Cloud",
      api: "REST API v3",
    },
    {
      id: "ext-mailchimp",
      name: "Mailchimp",
      sub: "Email & Campaign Marketing",
      letter: "M",
      color: "#CA8A04",
      category: "Marketing & Automation",
      isMarketplace: false,
      price: "$45/mo (Standard)",
      rating: 4.4,
      reviews: "6,200",
      ipTransfer: "No (Vendor Lock-in)",
      edgeLatency: "250ms P95",
      sla: "99.85% SLA",
      soc2: "Standard",
      support: "Ticket Support",
      hosting: "Intuit Cloud",
      api: "Marketing API v3",
    },
  ], []);

  // All combined options
  const allComparableOptions = React.useMemo<ComparableOption[]>(() => {
    return [...marketplaceOptions, ...industryOptions];
  }, [marketplaceOptions, industryOptions]);

  // Compute default initial choices based on product category
  const defaultChoices = React.useMemo(() => {
    const cat = (product.category || "").toLowerCase();
    if (cat.includes("hr") || cat.includes("payroll")) {
      return { comp1: "ext-bamboohr", comp2: "ext-rippling" };
    }
    if (cat.includes("project") || cat.includes("collab") || cat.includes("task")) {
      return { comp1: "ext-monday", comp2: "ext-asana" };
    }
    if (cat.includes("crm") || cat.includes("sales")) {
      return { comp1: "ext-hubspot", comp2: "ext-salesforce" };
    }
    if (cat.includes("finance") || cat.includes("accounting")) {
      return { comp1: "ext-quickbooks", comp2: "ext-xero" };
    }
    if (cat.includes("support") || cat.includes("customer")) {
      return { comp1: "ext-zendesk", comp2: "ext-intercom" };
    }
    if (cat.includes("marketing")) {
      return { comp1: "ext-klaviyo", comp2: "ext-mailchimp" };
    }
    const sameCatMkt = marketplaceOptions.filter((m) => m.category === product.category);
    if (sameCatMkt.length >= 2) {
      return { comp1: sameCatMkt[0].id, comp2: sameCatMkt[1].id };
    }
    return { comp1: marketplaceOptions[0]?.id || "ext-monday", comp2: "ext-bamboohr" };
  }, [product.category, marketplaceOptions]);

  // Selected competitor states
  const [comp1Id, setComp1Id] = useState<string>(defaultChoices.comp1);
  const [comp2Id, setComp2Id] = useState<string>(defaultChoices.comp2);

  // Resolved active competitors
  const comp1 = React.useMemo(() => {
    return allComparableOptions.find((c) => c.id === comp1Id) || allComparableOptions[0] || industryOptions[0];
  }, [allComparableOptions, comp1Id, industryOptions]);

  const comp2 = React.useMemo(() => {
    return allComparableOptions.find((c) => c.id === comp2Id) || allComparableOptions[1] || industryOptions[1];
  }, [allComparableOptions, comp2Id, industryOptions]);

  return (
    <PageLayout activeNav="products" noContainer>
      <div className="pdetails-page-wrapper">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="pdetails-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="pdetails-crumb-link">Home</Link>
            <span className="pdetails-crumb-sep">/</span>
            <Link href="/products" className="pdetails-crumb-link">Products</Link>
            <span className="pdetails-crumb-sep">/</span>
            <Link href={`/products/${product.id}`} className="pdetails-crumb-link">{product.name}</Link>
            <span className="pdetails-crumb-sep">/</span>
            <span className="pdetails-crumb-current">Full Specifications &amp; Deep Diligence</span>
          </nav>

          {/* Navigation Tabs */}
          <div className="pdetails-nav-tabs">
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "overview" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              About Project
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "architecture" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("architecture")}
            >
              Architecture &amp; Stack
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "security" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Security &amp; SLAs
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "financials" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("financials")}
            >
              Financial Diligence
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "reviews" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Customer Reviews
            </button>
            <button
              type="button"
              className={`pdetails-tab ${activeTab === "compare" ? "pdetails-tab--active" : ""}`}
              onClick={() => setActiveTab("compare")}
            >
              Compare
            </button>
          </div>

          {/* Tab Content */}
          <div className="pdetails-content-body">
            {activeTab === "overview" && (
              <div className="pdetails-tab-pane">
                {/* 2-Column Split: Left Image, Right About */}
                <div className="pdetails-overview-split">
                  {/* Left Column: Image */}
                  <div className="pdetails-split-image-col">
                    <div className="pdetails-media-block pdetails-split-media">
                      <div className="pdetails-media-wrapper">
                        <Image
                          src={product.image || "/images/taskflow-workspace-dashboard.jpg"}
                          alt={`${product.name} Production Workspace Interface`}
                          width={1280}
                          height={720}
                          className="pdetails-media-img"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: About */}
                  <div className="pdetails-split-about-col">
                    <div className="pdetails-about-card pdetails-split-about-card">
                      <span className="pdetails-about-badge">About Project</span>
                      <h2 className="pdetails-card-title">About {product.name}</h2>
                      <p className="pdetails-about-paragraph">
                        {product.name} is a comprehensive, production-grade {product.category?.toLowerCase() || "software"} platform engineered to streamline mission-critical operations for {product.targetAudience?.toLowerCase() || "modern software and engineering organizations"}. Built from the ground up to eliminate tool fragmentation and administrative friction, the platform unifies real-time collaborative documentation, agile sprint tracking, automated continuous delivery workflows, and cross-functional team coordination into a single cohesive interface.
                      </p>
                      <p className="pdetails-about-paragraph">
                        {product.aboutText ? `${product.aboutText} ` : ""}{product.tagline ? `${product.tagline}. ` : ""}With seamless integrations across developer ecosystems, automated webhook synchronization, and interactive telemetry analytics, teams can accelerate their product delivery cycles, reduce context switching, and maintain transparent audit trails across every milestone.
                      </p>
                      <p className="pdetails-about-paragraph">
                        At its core, the platform incorporates a modern microservices-driven architecture backed by distributed caching layers, low-latency database sharding, and real-time event streaming.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2-Column Split: Left Para, Right Image */}
                <div className="pdetails-overview-split pdetails-overview-split--reverse" style={{ marginTop: "2rem" }}>
                  {/* Left Column: Para */}
                  <div className="pdetails-split-about-col">
                    <div className="pdetails-about-card pdetails-split-about-card">
                      <span className="pdetails-about-badge" style={{ background: "#ECFDF5", color: "#059669" }}>Team Operations</span>
                      <h3 className="pdetails-card-title" style={{ fontSize: "1.35rem" }}>Cross-Functional Sprint Planning &amp; Agile Collaboration</h3>
                      <p className="pdetails-about-paragraph">
                        In active daily operations, {product.name} serves as the operational nerve center for cross-functional sprint planning sessions and collaborative backlog grooming. Whether teams gather in synchronous conference rooms or coordinate across global time zones, the platform&apos;s multi-display compatibility and live interactive boards facilitate high-engagement grooming rituals with zero latency.
                      </p>
                      <p className="pdetails-about-paragraph">
                        Furthermore, the system emphasizes frictionless onboarding and team ergonomics. Built-in permission matrices, granular role-based access controls (RBAC), and multi-tenant isolation patterns allow administrators to safely partition datasets across departments or external contractors.
                      </p>
                      <p className="pdetails-about-paragraph">
                        By replacing scattered spreadsheets and disconnected chat threads with structured, audit-ready development workflows, teams report significant reductions in planning overhead and an average 40% increase in sprint delivery velocity.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Image */}
                  <div className="pdetails-split-image-col">
                    <div className="pdetails-media-block pdetails-split-media">
                      <div className="pdetails-media-header">
                        <span className="pdetails-media-tag" style={{ background: "#ECFDF5", color: "#059669" }}>Team Operations</span>
                        <span className="pdetails-media-title">Sprint Planning &amp; Agile Rituals</span>
                      </div>
                      <div className="pdetails-media-wrapper">
                        <Image
                          src="/images/taskflow-team-work.jpg"
                          alt={`${product.name} Engineering and Product Team Sprint Planning`}
                          width={1280}
                          height={720}
                          className="pdetails-media-img"
                        />
                      </div>
                      <div className="pdetails-media-caption">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span>Active Team Work Session — Distributed squad sprint grooming</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pdetails-specs-grid">
                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Product Details</h2>
                    <div className="pdetails-spec-table">
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Listed Date</span>
                        <strong className="pdetails-row-val">{product.listedDate || "18 Jul 2024"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Target Audience</span>
                        <strong className="pdetails-row-val">{product.targetAudience || "Engineering & Cross-Functional Teams"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Headquarters</span>
                        <strong className="pdetails-row-val">{product.hqLocation || "San Francisco, CA"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Launch Year</span>
                        <strong className="pdetails-row-val">{product.launchDate || "2022"}</strong>
                      </div>
                      <div className="pdetails-spec-row">
                        <span className="pdetails-row-label">Core Team Size</span>
                        <strong className="pdetails-row-val">{product.teamSize || "5 - 10 Engineers"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Verified Seller Credentials</h2>
                    <div className="pdetails-seller-box">
                      <div className="pdetails-seller-avatar">
                        {product.sellerInitials || "ER"}
                      </div>
                      <div>
                        <h3 className="pdetails-seller-name">{sellerName}</h3>
                        <span className="pdetails-seller-sub">{product.sellerMemberSince || "Member since Feb 2023"}</span>
                        <span className="pdetails-seller-badge">✓ Identity &amp; Bank Verified</span>
                      </div>
                    </div>
                    <p className="pdetails-seller-desc">
                      Elena Rostova has verified ownership of the code repositories, Stripe billing accounts, and domain infrastructure. All transactions through SaaS MRKT are protected under full buyer escrow.
                    </p>
                    <div className="pdetails-trust-points">
                      <div className="pdetails-trust-point">✓ 100% On-time response rate</div>
                      <div className="pdetails-trust-point">✓ 14 Verified SaaS transfers completed</div>
                      <div className="pdetails-trust-point">✓ Escrow contract guaranteed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="pdetails-tab-pane">
                {/* Architecture & Engineering Overview */}
                <div className="pdetails-about-card">
                  <span className="pdetails-about-badge">System Architecture</span>
                  <h2 className="pdetails-card-title">{product.name} Technical Architecture &amp; Engineering Foundation</h2>
                  <p className="pdetails-about-paragraph">
                    {product.name} is architected using a decoupled, high-concurrency microservices design built on modern cloud primitives. The platform leverages a high-throughput edge routing layer to terminate SSL/TLS requests with sub-110ms global latency, dynamically routing stateful database transactions and read-heavy queries through geographically distributed read replicas and high-availability Redis cache clusters.
                  </p>
                  <p className="pdetails-about-paragraph">
                    The core application layer is designed for fault tolerance and zero-downtime rolling deployments. Real-time collaboration features are powered by persistent WebSocket connections backed by distributed pub/sub messaging channels, allowing thousands of simultaneous operations to resolve concurrently without lock contention or data degradation. Automated background job workers handle compute-intensive asynchronous tasks, such as metric rollups, third-party webhook dispatches, and scheduled report generations.
                  </p>
                  <p className="pdetails-about-paragraph">
                    Built with rigorous code hygiene, strict TypeScript typing across all endpoints, automated unit test suites, and Docker containerization, the architecture ensures clean separation of concerns and effortless maintenance for development teams and acquiring organizations alike.
                  </p>
                </div>

                <div className="pdetails-specs-grid">
                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Technology Stack</h2>
                    <p className="pdetails-card-desc">
                      Built using high-performance modern tooling with automated CI/CD and zero downtime rolling deployments.
                    </p>
                    <div className="pdetails-stack-pills">
                      {techStack.map((tech, i) => (
                        <div key={i} className="pdetails-stack-item">
                          <span className="pdetails-stack-dot" />
                          <span>{tech}</span>
                        </div>
                      ))}
                      <div className="pdetails-stack-item"><span className="pdetails-stack-dot" />TailwindCSS</div>
                      <div className="pdetails-stack-item"><span className="pdetails-stack-dot" />Redis Cache</div>
                      <div className="pdetails-stack-item"><span className="pdetails-stack-dot" />Docker</div>
                    </div>

                    <h3 className="pdetails-subhead">API &amp; Integration Capabilities</h3>
                    <ul className="pdetails-check-list">
                      <li>REST API v2 with comprehensive OpenAPI 3.0 documentation</li>
                      <li>Webhook subscription engine with automatic retries and HMAC signatures</li>
                      <li>GraphQL endpoint for granular reporting and data extraction</li>
                      <li>Pre-built integrations: Slack, Zapier, GitHub, Jira, and Linear</li>
                    </ul>
                  </div>

                  <div className="pdetails-spec-card">
                    <h2 className="pdetails-card-title">Infrastructure &amp; Hosting</h2>
                    <div className="pdetails-metric-cards">
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">99.98%</span>
                        <span className="pdetails-metric-desc">Uptime SLA (Historical 12 mo)</span>
                      </div>
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">&lt;110ms</span>
                        <span className="pdetails-metric-desc">Global Edge Latency (P95)</span>
                      </div>
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">10M+</span>
                        <span className="pdetails-metric-desc">Monthly API Requests Handled</span>
                      </div>
                      <div className="pdetails-metric-box">
                        <span className="pdetails-metric-number">Multi-Region</span>
                        <span className="pdetails-metric-desc">AWS US-East &amp; EU-Central Failover</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Architecture Deep Dive & Operational Workflows */}
                <div className="pdetails-about-card" style={{ marginTop: "2rem" }}>
                  <span className="pdetails-about-badge">Engineering Deep Dive</span>
                  <h2 className="pdetails-card-title">Database Design, CI/CD Pipeline &amp; Scalability Benchmarks</h2>
                  <p className="pdetails-about-paragraph">
                    The persistence tier of {product.name} is powered by a high-availability PostgreSQL cluster configured with multi-zone synchronous replication and point-in-time recovery (PITR). Complex relational entities—such as team workspaces, sprint histories, and granular audit logs—are structured with normalized schema designs, foreign key constraints, and targeted B-tree indexing. High-frequency unstructured records and dynamic custom metadata utilize optimized JSONB columns with GIN indexes, ensuring lightning-fast search retrieval without bloated query execution plans.
                  </p>
                  <p className="pdetails-about-paragraph">
                    To maintain extreme responsiveness under peak concurrent workloads, a distributed Redis caching layer implements an intelligent cache-aside architecture with deterministic TTL invalidation. Session state, workspace permission matrices, and real-time sprint counters are cached in-memory with sub-millisecond round-trip response times. Comprehensive connection pooling via PgBouncer prevents database resource exhaustion during unexpected traffic spikes, allowing thousands of simultaneous worker processes to coordinate efficiently.
                  </p>
                  <p className="pdetails-about-paragraph">
                    Every deployment is orchestrated through automated GitHub Actions CI/CD workflows executing continuous linting, strict TypeScript type checking, and automated unit and integration test suites. Dockerized container images are built and pushed to private registries with automated vulnerability scanning before undergoing zero-downtime rolling updates. Automated health check probes and blue/green rollout strategies ensure continuous service availability with instantaneous automated rollback capabilities in the event of an anomalous metric threshold.
                  </p>
                  <p className="pdetails-about-paragraph">
                    External API interactions are strictly governed by distributed token-bucket rate limiters and OAuth 2.0 / API key authentication middlewares. Comprehensive OpenAPI 3.0 specifications and interactive Swagger documentation provide developers with exact schema contracts, webhook verification guides, and sandbox endpoints, enabling rapid integrations and painless technical transfer during acquisitions.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="pdetails-tab-pane">
                {/* Security, Governance & SLAs Overview */}
                <div className="pdetails-about-card">
                  <span className="pdetails-about-badge">Security &amp; Governance</span>
                  <h2 className="pdetails-card-title">{product.name} Enterprise Security Architecture &amp; Governance</h2>
                  <p className="pdetails-about-paragraph">
                    {product.name} is engineered to meet the stringent security, governance, and operational standards expected by modern enterprise IT teams and diligence auditors. Security is integrated natively into every stage of the software development lifecycle, from automated dependency vulnerability scanning and container security audits to encrypted transit protocols and isolated multi-tenant data perimeters.
                  </p>
                  <p className="pdetails-about-paragraph">
                    All customer and organization data is encrypted at rest using industry-standard AES 256-bit encryption managed through AWS Key Management Service (KMS), alongside strict TLS 1.3 encryption across all network boundaries. Rigorous least-privilege access controls are enforced across internal development teams, with continuous audit logging, automated intrusion detection, and annual third-party penetration tests guaranteeing that buyer information and operational databases remain strictly safeguarded.
                  </p>
                  <p className="pdetails-about-paragraph">
                    The platform guarantees a contractual 99.98% uptime Service Level Agreement (SLA) backed by multi-region failover configurations and real-time health telemetry. In the event of primary zone degradation, automated DNS routing redirects traffic instantaneously to warm standby infrastructure, ensuring uninterrupted workflow execution without manual operational overhead.
                  </p>

                  {/* Side-by-Side Image and Paragraphs */}
                  <div className="pdetails-side-showcase">
                    <div className="pdetails-side-media">
                      <Image
                        src="/images/security-compliance-dashboard.jpg"
                        alt={`${product.name} Enterprise Security & Compliance Dashboard`}
                        width={960}
                        height={540}
                        className="pdetails-side-img"
                      />
                    </div>
                    <div className="pdetails-side-content">
                      <span className="pdetails-side-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Continuous Audit Telemetry
                      </span>
                      <h3 className="pdetails-side-title">Automated Telemetry &amp; Threat Defense</h3>
                      <p className="pdetails-about-paragraph">
                        The integrated security operations console provides continuous, real-time observability across all infrastructure tiers. Automated threat detection sensors monitor inbound API traffic and internal network routing 24/7, correlating behavioral signals to proactively neutralize abnormal access patterns, credential stuffing, and injection vectors before they affect production environments.
                      </p>
                      <p className="pdetails-about-paragraph">
                        In parallel, compliance telemetry automatically audits SOC2 Type II controls, cryptographic key rotation schedules, and immutable backup snapshot retention in real time. All operational access trails are cryptographically signed and stored in tamper-proof audit repositories, ensuring engineering teams and acquiring parties maintain access to verifiable compliance records whenever required.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pdetails-spec-card">
                  <h2 className="pdetails-card-title">Security &amp; Data Compliance</h2>
                  <p className="pdetails-card-desc">
                    Enterprise-grade governance protocols and encryption standards protect buyer databases and communications.
                  </p>

                  <div className="pdetails-security-grid">
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                      </div>
                      <h3>SOC2 Type II</h3>
                      <p>Annual third-party audit completed. Full compliance audit reports available upon request.</p>
                    </div>
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                          <path d="M2 12h20"/>
                        </svg>
                      </div>
                      <h3>GDPR &amp; CCPA</h3>
                      <p>Full data subject request handlers, cookie privacy compliance, and EU data isolation.</p>
                    </div>
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          <circle cx="12" cy="16" r="1"/>
                        </svg>
                      </div>
                      <h3>AES 256-Bit</h3>
                      <p>Data encrypted in transit via TLS 1.3 and at rest with AWS KMS managed encryption keys.</p>
                    </div>
                    <div className="pdetails-sec-box">
                      <div className="pdetails-sec-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/>
                          <path d="m21 2-9.6 9.6"/>
                          <circle cx="7.5" cy="15.5" r="5.5"/>
                        </svg>
                      </div>
                      <h3>SAML SSO &amp; 2FA</h3>
                      <p>Enterprise single sign-on support for Okta, Google Workspace, Azure AD, and mandatory 2FA.</p>
                    </div>
                  </div>
                </div>

                {/* Disaster Recovery, Business Continuity & Data Governance */}
                <div className="pdetails-about-card" style={{ marginTop: "2rem" }}>
                  <span className="pdetails-about-badge">Disaster Recovery &amp; Governance</span>
                  <h2 className="pdetails-card-title">Business Continuity, RPO/RTO Guarantees &amp; Penetration Testing</h2>
                  <p className="pdetails-about-paragraph">
                    To safeguard operations against critical infrastructure failures or regional cloud outages, {product.name} operates under a comprehensive Business Continuity and Disaster Recovery (BCDR) framework. Continuous Write-Ahead Log (WAL) streaming guarantees a Recovery Point Objective (RPO) of less than 5 minutes, while automated multi-region infrastructure orchestration delivers a Recovery Time Objective (RTO) of under 15 minutes. All production database snapshots are automatically replicated to air-gapped, immutable cloud storage with 90-day retention policies.
                  </p>
                  <p className="pdetails-about-paragraph">
                    Application security is rigorously validated through bi-annual third-party penetration testing executed by accredited CREST-certified cybersecurity auditors. Automated Static Application Security Testing (SAST) and Dynamic Application Security Testing (DAST) scanners run within every pull request pipeline, preventing vulnerabilities such as SQL injection, Cross-Site Scripting (XSS), or broken access controls from reaching production release branches.
                  </p>
                  <p className="pdetails-about-paragraph">
                    Compliance with international privacy mandates—including EU GDPR and California CCPA—is built into the platform&apos;s data layer. Automated workflows handle data subject access requests (DSAR) and cryptographic tenant deletion with verifiable audit certificates. Strict logical tenant separation prevents cross-tenant data leakage, providing enterprise buyers and diligence auditors with complete confidence in regulatory compliance and long-term asset integrity.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "financials" && (
              <div className="pdetails-tab-pane">
                {/* 2-Column Split: Left Image, Right Para */}
                <div className="pdetails-overview-split">
                  {/* Left Column: Image */}
                  <div className="pdetails-split-image-col">
                    <div className="pdetails-media-block pdetails-split-media">
                      <div className="pdetails-media-header">
                        <span className="pdetails-media-tag" style={{ background: "#ECFDF5", color: "#059669" }}>Financial Telemetry</span>
                        <span className="pdetails-media-title">Verified Revenue &amp; Growth Metrics</span>
                      </div>
                      <div className="pdetails-media-wrapper">
                        <Image
                          src="/images/finmate.jpg"
                          alt={`${product.name} Verified Financial Analytics & Revenue Telemetry`}
                          width={1280}
                          height={720}
                          className="pdetails-media-img"
                          priority
                        />
                      </div>
                      <div className="pdetails-media-caption">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                          <circle cx="9" cy="9" r="2"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                        <span>Stripe &amp; Banking Verified Diligence Data Telemetry</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Para */}
                  <div className="pdetails-split-about-col">
                    <div className="pdetails-about-card pdetails-split-about-card">
                      <span className="pdetails-about-badge">Financial Diligence</span>
                      <h2 className="pdetails-card-title">{product.name} Financial Performance, Unit Economics &amp; Growth Telemetry</h2>
                      <p className="pdetails-about-paragraph">
                        {product.name} operates on a capital-efficient software subscription model characterized by predictable monthly and annual recurring revenue streams. All operational revenue data, cohort churn metrics, and customer acquisition telemetry are verified directly through native Stripe billing integrations and audited accounting ledgers, providing acquiring parties and investors with institutional-grade diligence transparency.
                      </p>
                      <p className="pdetails-about-paragraph">
                        The platform exhibits strong cohort retention dynamics with a Net Retention Rate (NRR) of 108.5% and sustained gross margins exceeding 84%. Low customer acquisition costs (CAC) paired with automated self-serve expansion tiers ensure healthy lifetime value to customer acquisition cost (LTV:CAC) ratios across both mid-market and enterprise customer tiers.
                      </p>
                      <p className="pdetails-about-paragraph">
                        Subscription billing is managed via an automated multi-currency checkout engine with automated dunning workflows and merchant-of-record reconciliation. Over 70% of annualized contract value (ACV) is collected upfront through annual prepayments, generating positive working capital and mitigating monthly volatility with an involuntary churn recovery rate above 68%.
                      </p>
                      <p className="pdetails-about-paragraph">
                        Operating overhead remains exceptionally lean, with cloud infrastructure and database hosting expenses representing less than 4.8% of gross monthly recurring revenue (MRR). Vendor agreements, third-party software subscriptions, and developer tooling licenses are maintained under transferable commercial agreements to ensure friction-free ownership handoff.
                      </p>
                      <p className="pdetails-about-paragraph">
                        With zero long-term debt, audited profit-and-loss (P&amp;L) statements, and automated banking reconciliation feeds, the business maintains a transparent financial profile optimized for seamless escrow closing and risk-free post-acquisition handover.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="pdetails-tab-pane">
                <div className="pdetails-spec-card">
                  <h2 className="pdetails-card-title">Customer Feedback &amp; Ratings</h2>
                  <div className="pdetails-reviews-summary">
                    <div className="pdetails-rev-big">
                      <span className="pdetails-rev-score">4.9</span>
                      <span className="pdetails-stars">★★★★★</span>
                      <span className="pdetails-rev-total">5,120 verified reviews</span>
                    </div>
                    <div className="pdetails-rev-bars">
                      <div className="pdetails-bar-row">
                        <span>5 stars</span>
                        <div className="pdetails-bar-track"><div className="pdetails-bar-fill" style={{ width: "91%" }} /></div>
                        <span>91%</span>
                      </div>
                      <div className="pdetails-bar-row">
                        <span>4 stars</span>
                        <div className="pdetails-bar-track"><div className="pdetails-bar-fill" style={{ width: "7%" }} /></div>
                        <span>7%</span>
                      </div>
                      <div className="pdetails-bar-row">
                        <span>3 stars</span>
                        <div className="pdetails-bar-track"><div className="pdetails-bar-fill" style={{ width: "2%" }} /></div>
                        <span>2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pdetails-quotes-grid">
                    <div className="pdetails-quote-card">
                      <p>&ldquo;{product.name} drastically accelerated our team sprint cycle. The integration was seamless and support was lightning fast.&rdquo;</p>
                      <strong>— Marcus Vance, VP Engineering at CloudSync</strong>
                    </div>
                    <div className="pdetails-quote-card">
                      <p>&ldquo;Best investment we made this quarter. Everything worked out of the box with zero configuration headache.&rdquo;</p>
                      <strong>— Sarah Lin, Head of Product at Vertex Labs</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "compare" && (
              <div className="pdetails-tab-pane">
                <div className="pdetails-compare-wrap">
                  <div className="pdetails-compare-card">
                    <div className="pdetails-compare-header">
                      <span className="pdetails-compare-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        Competitive Benchmarks
                      </span>
                      <h2 className="pdetails-compare-title">Compare {product.name} With Market Alternatives</h2>
                      <p className="pdetails-compare-desc">
                        Direct side-by-side technical, financial, and architectural benchmark comparing {product.name} against leading alternatives in the {product.category || "SaaS"} market. Evaluate verified metrics, codebase asset transfer rights, latency SLAs, and operational overhead.
                      </p>
                    </div>

                    {/* Interactive Product Chooser Toolbar */}
                    <div className="pdetails-compare-toolbar">
                      <div className="pdetails-compare-toolbar-top">
                        <div className="pdetails-compare-toolbar-title">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                          </svg>
                          <span>Customize Comparison: Choose Which Products You Want to Compare</span>
                        </div>
                      </div>

                      <div className="pdetails-compare-pickers-grid">
                        <div className="pdetails-compare-picker-box">
                          <label className="pdetails-compare-picker-label" htmlFor="compare-slot-1">
                            <span>Slot 1: Choose Product</span>
                            <span style={{ color: comp1.isMarketplace ? "#059669" : "#4F46E5", fontSize: "0.75rem", textTransform: "none" }}>
                              {comp1.isMarketplace ? "✓ SaaS MRKT" : "External Alternative"}
                            </span>
                          </label>
                          <select
                            id="compare-slot-1"
                            className="pdetails-compare-picker-select"
                            value={comp1Id}
                            onChange={(e) => setComp1Id(e.target.value)}
                          >
                            <optgroup label="Popular Industry Alternatives">
                              {industryOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.name} ({opt.category})
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="SaaS MRKT Verified Listings">
                              {marketplaceOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.name} ({opt.category})
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        <div className="pdetails-compare-picker-box">
                          <label className="pdetails-compare-picker-label" htmlFor="compare-slot-2">
                            <span>Slot 2: Choose Product</span>
                            <span style={{ color: comp2.isMarketplace ? "#059669" : "#4F46E5", fontSize: "0.75rem", textTransform: "none" }}>
                              {comp2.isMarketplace ? "✓ SaaS MRKT" : "External Alternative"}
                            </span>
                          </label>
                          <select
                            id="compare-slot-2"
                            className="pdetails-compare-picker-select"
                            value={comp2Id}
                            onChange={(e) => setComp2Id(e.target.value)}
                          >
                            <optgroup label="Popular Industry Alternatives">
                              {industryOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.name} ({opt.category})
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="SaaS MRKT Verified Listings">
                              {marketplaceOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.name} ({opt.category})
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      </div>

                      <div className="pdetails-compare-pills-row">
                        <span className="pdetails-compare-pills-label">Quick presets:</span>
                        <button
                          type="button"
                          className="pdetails-compare-quick-btn"
                          onClick={() => {
                            setComp1Id(defaultChoices.comp1);
                            setComp2Id(defaultChoices.comp2);
                          }}
                        >
                          Category Peers ({product.category})
                        </button>
                        {marketplaceOptions.length >= 2 && (
                          <button
                            type="button"
                            className="pdetails-compare-quick-btn"
                            onClick={() => {
                              setComp1Id(marketplaceOptions[0].id);
                              setComp2Id(marketplaceOptions[1].id);
                            }}
                          >
                            Marketplace Listings
                          </button>
                        )}
                        <button
                          type="button"
                          className="pdetails-compare-quick-btn"
                          onClick={() => {
                            setComp1Id("ext-monday");
                            setComp2Id("ext-bamboohr");
                          }}
                        >
                          Industry Giants
                        </button>
                      </div>
                    </div>

                    {/* Comparison Matrix Table */}
                    <div className="pdetails-compare-table-container">
                      <table className="pdetails-compare-table">
                        <thead>
                          <tr>
                            <th style={{ width: "24%" }}>Feature / Dimension</th>
                            <th className="pdetails-compare-col-featured" style={{ width: "32%" }}>
                              <div className="pdetails-compare-product-cell">
                                <div
                                  className="pdetails-compare-avatar"
                                  style={{ backgroundColor: product.brandColor || "#4F46E5" }}
                                >
                                  {product.brandLetter || product.name.charAt(0)}
                                </div>
                                <div className="pdetails-compare-product-info">
                                  <span className="pdetails-compare-product-name">{product.name}</span>
                                  <span className="pdetails-compare-pill-verified">✓ This Product (Verified)</span>
                                </div>
                              </div>
                            </th>
                            <th style={{ width: "22%" }}>
                              <div className="pdetails-compare-product-cell">
                                <div
                                  className="pdetails-compare-avatar"
                                  style={{ backgroundColor: comp1.color }}
                                >
                                  {comp1.letter}
                                </div>
                                <div className="pdetails-compare-product-info">
                                  <span className="pdetails-compare-product-name">{comp1.name}</span>
                                  <span className={comp1.isMarketplace ? "pdetails-compare-pill-verified" : "pdetails-compare-pill-competitor"}>
                                    {comp1.sub}
                                  </span>
                                </div>
                              </div>
                              <select
                                className="pdetails-compare-col-header-select"
                                value={comp1Id}
                                onChange={(e) => setComp1Id(e.target.value)}
                                aria-label="Switch Slot 1 product"
                              >
                                <optgroup label="Industry Alternatives">
                                  {industryOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>Switch: {opt.name}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="SaaS MRKT Listings">
                                  {marketplaceOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>Switch: {opt.name}</option>
                                  ))}
                                </optgroup>
                              </select>
                            </th>
                            <th style={{ width: "22%" }}>
                              <div className="pdetails-compare-product-cell">
                                <div
                                  className="pdetails-compare-avatar"
                                  style={{ backgroundColor: comp2.color }}
                                >
                                  {comp2.letter}
                                </div>
                                <div className="pdetails-compare-product-info">
                                  <span className="pdetails-compare-product-name">{comp2.name}</span>
                                  <span className={comp2.isMarketplace ? "pdetails-compare-pill-verified" : "pdetails-compare-pill-competitor"}>
                                    {comp2.sub}
                                  </span>
                                </div>
                              </div>
                              <select
                                className="pdetails-compare-col-header-select"
                                value={comp2Id}
                                onChange={(e) => setComp2Id(e.target.value)}
                                aria-label="Switch Slot 2 product"
                              >
                                <optgroup label="Industry Alternatives">
                                  {industryOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>Switch: {opt.name}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="SaaS MRKT Listings">
                                  {marketplaceOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>Switch: {opt.name}</option>
                                  ))}
                                </optgroup>
                              </select>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="pdetails-compare-feature-label">Category</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">{product.category || "Enterprise SaaS"}</td>
                            <td>{comp1.category}</td>
                            <td>{comp2.category}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Customer Rating</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>{product.rating || 4.9} ★</strong> <span className="pdetails-compare-val-muted">({(product.reviewCount || 5120).toLocaleString()} reviews)</span>
                            </td>
                            <td>{comp1.rating} ★ <span className="pdetails-compare-val-muted">({comp1.reviews} reviews)</span></td>
                            <td>{comp2.rating} ★ <span className="pdetails-compare-val-muted">({comp2.reviews} reviews)</span></td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Asset &amp; IP Transfer</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <span style={{ color: "#059669", fontWeight: 700 }}>✓ 100% Full IP Transfer via Escrow</span>
                            </td>
                            <td className={comp1.isMarketplace ? "pdetails-compare-val-highlight" : "pdetails-compare-val-muted"}>{comp1.ipTransfer}</td>
                            <td className={comp2.isMarketplace ? "pdetails-compare-val-highlight" : "pdetails-compare-val-muted"}>{comp2.ipTransfer}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Starting Price</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>${product.price}/mo</strong> <span className="pdetails-compare-val-muted">or Full Asset Acquisition</span>
                            </td>
                            <td>{comp1.price}</td>
                            <td>{comp2.price}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Global Edge Latency (P95)</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>&lt; 110ms Edge Routing</strong>
                            </td>
                            <td>{comp1.edgeLatency}</td>
                            <td>{comp2.edgeLatency}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Contractual SLA</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>99.98% High-Availability</strong>
                            </td>
                            <td>{comp1.sla}</td>
                            <td>{comp2.sla}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Security &amp; Compliance</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>Pre-audited SOC 2 Type II &amp; GDPR</strong>
                            </td>
                            <td>{comp1.soc2}</td>
                            <td>{comp2.soc2}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Technology Foundation</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>{techStack.slice(0, 4).join(", ")}</strong>
                            </td>
                            <td>{comp1.hosting}</td>
                            <td>{comp2.hosting}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">Transition &amp; Handover</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>45-Day 1-on-1 Transition Support</strong>
                            </td>
                            <td className={comp1.isMarketplace ? "pdetails-compare-val-highlight" : "pdetails-compare-val-muted"}>{comp1.support}</td>
                            <td className={comp2.isMarketplace ? "pdetails-compare-val-highlight" : "pdetails-compare-val-muted"}>{comp2.support}</td>
                          </tr>

                          <tr>
                            <td className="pdetails-compare-feature-label">API &amp; Integration Engine</td>
                            <td className="pdetails-compare-col-featured pdetails-compare-val-highlight">
                              <strong>OpenAPI 3.0 + Webhook Subscriptions</strong>
                            </td>
                            <td>{comp1.api}</td>
                            <td>{comp2.api}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Differentiators Grid */}
                    <div className="pdetails-compare-cards-grid">
                      <div className="pdetails-compare-feature-box">
                        <div className="pdetails-compare-feature-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </div>
                        <h3 className="pdetails-compare-feature-title">Guaranteed Escrow Protection</h3>
                        <p className="pdetails-compare-feature-desc">
                          Transactions on SaaS MRKT are conducted under milestone escrow holding. Funds release only after complete technical audit, codebase transfer, and verified domain handover.
                        </p>
                      </div>

                      <div className="pdetails-compare-feature-box">
                        <div className="pdetails-compare-feature-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                          </svg>
                        </div>
                        <h3 className="pdetails-compare-feature-title">Clean Modern Codebase</h3>
                        <p className="pdetails-compare-feature-desc">
                          Unlike bloated legacy monoliths, {product.name} is engineered with strict TypeScript typing, Dockerized microservices, and continuous CI/CD pipelines ready for turnkey scaling.
                        </p>
                      </div>

                      <div className="pdetails-compare-feature-box">
                        <div className="pdetails-compare-feature-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </div>
                        <h3 className="pdetails-compare-feature-title">Audited Unit Economics</h3>
                        <p className="pdetails-compare-feature-desc">
                          Pre-verified Stripe revenue feeds, low server overhead (&lt;4.8% of MRR), and healthy NRR retention dynamics provide full fiscal visibility with zero hidden liabilities.
                        </p>
                      </div>
                    </div>

                    {/* CTA Box */}
                    <div className="pdetails-compare-cta">
                      <div>
                        <h3>Interested in evaluating or acquiring {product.name}?</h3>
                        <p>Speak directly with the verified seller or request access to the technical sandbox repository.</p>
                      </div>
                      <div className="pdetails-compare-cta-btns">
                        <Link href="/sellers" className="pdetails-compare-cta-btn-primary">
                          Contact Seller ({sellerName})
                        </Link>
                        <Link href="/products" className="pdetails-compare-cta-btn-secondary">
                          Explore More Listings
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
