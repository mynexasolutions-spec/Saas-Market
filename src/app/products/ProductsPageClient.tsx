"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { FEATURED_PRODUCTS_LIST, ProductItem } from "@/components/FeaturedProducts";
import ProductModal from "@/components/ProductModal";

const CATEGORIES = [
  { label: "All Products", value: "" },
  { label: "HR & Payroll", value: "HR & Payroll" },
  { label: "Project Management", value: "Project Management" },
  { label: "Accounting & Finance", value: "Accounting & Finance" },
  { label: "Marketing", value: "Marketing" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Developer Tools", value: "Developer Tools" },
  { label: "CRM & Sales", value: "CRM & Sales" },
];

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

// Extend the product list with extra placeholder products for the page
const EXTENDED_PRODUCTS: ProductItem[] = [
  ...FEATURED_PRODUCTS_LIST,
  {
    id: "prod-crmpro",
    name: "CRM Pro",
    category: "CRM & Sales",
    rating: 4.7,
    reviewCount: 243,
    description: "Intelligent CRM to close deals faster with AI-powered follow-ups.",
    image: "/images/dealflow.jpg",
    logo: "/images/logos/dealflow.jpg",
    price: 39,
    period: "month",
    brandColor: "#EF4444",
    brandLetter: "C",
    topBadge: "Verified",
    tags: ["CRM & Sales", "Pipelines"],
    features: [
      "Visual sales pipeline with drag-drop stages",
      "AI-powered email follow-up suggestions",
      "Deal probability scoring",
      "Revenue forecasting dashboards",
    ],
  },
  {
    id: "prod-devhub",
    name: "DevHub",
    category: "Developer Tools",
    rating: 4.9,
    reviewCount: 631,
    description: "The all-in-one dev platform: CI/CD, monitoring, and code review.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 49,
    period: "month",
    brandColor: "#1E293B",
    brandLetter: "D",
    topBadge: "Top Rated",
    tags: ["DevOps", "CI/CD"],
    features: [
      "One-click CI/CD pipeline builder",
      "Real-time performance monitoring",
      "Automated code review bots",
      "Multi-cloud deployment support",
    ],
  },
  {
    id: "prod-analytica",
    name: "Analytica",
    category: "Marketing",
    rating: 4.6,
    reviewCount: 187,
    description: "Marketing analytics and attribution platform for data-driven teams.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 45,
    period: "month",
    brandColor: "#0891B2",
    brandLetter: "A",
    topBadge: "Trending",
    tags: ["Analytics", "Marketing"],
    features: [
      "Multi-touch attribution modeling",
      "Cross-channel campaign analytics",
      "Predictive audience segmentation",
      "Custom KPI dashboard builder",
    ],
  },
  {
    id: "prod-cloudpulse",
    name: "CloudPulse",
    category: "Developer Tools",
    rating: 4.8,
    reviewCount: 1420,
    description: "Real-time cloud infrastructure monitoring, APM, and instant incident alerts.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 39,
    period: "month",
    brandColor: "#0284C7",
    brandLetter: "C",
    topBadge: "Top Rated",
    tags: ["DevOps", "Monitoring"],
    features: [
      "Multi-cloud latency metrics",
      "Automated anomaly alerts",
      "Distributed tracing",
      "Slack & PagerDuty sync",
    ],
  },
  {
    id: "prod-payflow",
    name: "PayFlow",
    category: "Accounting & Finance",
    rating: 4.9,
    reviewCount: 2850,
    description: "Automated recurring billing, invoicing, and global payment compliance.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 49,
    period: "month",
    brandColor: "#10B981",
    brandLetter: "P",
    topBadge: "Trending",
    tags: ["Billing", "Payments"],
    features: [
      "Global tax & VAT handling",
      "Dunning & churn prevention",
      "135+ currencies supported",
      "Stripe & PayPal connector",
    ],
  },
  {
    id: "prod-teamsync",
    name: "TeamSync",
    category: "Project Management",
    rating: 4.7,
    reviewCount: 3100,
    description: "Asynchronous team check-ins, sprint planning, and goal tracking in one hub.",
    image: "/images/manage360.jpg",
    logo: "/images/logos/manage360.jpg",
    price: 15,
    period: "month",
    brandColor: "#8B5CF6",
    brandLetter: "T",
    topBadge: "Popular",
    tags: ["Agile", "Remote Work"],
    features: [
      "Daily automated standups",
      "OKR & KPI alignment trees",
      "Sprint retrospectives",
      "Calendar & Zoom integration",
    ],
  },
  {
    id: "prod-leadgenius",
    name: "LeadGenius",
    category: "CRM & Sales",
    rating: 4.8,
    reviewCount: 1950,
    description: "AI prospecting and verified B2B lead generation with automated outreach.",
    image: "/images/dealflow.jpg",
    logo: "/images/logos/dealflow.jpg",
    price: 59,
    period: "month",
    brandColor: "#EA580C",
    brandLetter: "L",
    topBadge: "Verified",
    tags: ["B2B Leads", "Cold Email"],
    features: [
      "250M+ verified contact database",
      "AI personalized email writer",
      "Real-time buyer intent signals",
      "Native CRM auto-sync",
    ],
  },
  {
    id: "prod-deskhero",
    name: "DeskHero",
    category: "Customer Support",
    rating: 4.9,
    reviewCount: 2200,
    description: "Modern shared inbox and knowledge base software for customer delight.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 29,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "D",
    topBadge: "Top Rated",
    tags: ["Helpdesk", "Ticketing"],
    features: [
      "Unified shared email & chat inbox",
      "Self-service knowledge base builder",
      "Automated macro responses",
      "Customer CSAT surveys",
    ],
  },
  {
    id: "prod-contentwave",
    name: "ContentWave",
    category: "Marketing",
    rating: 4.7,
    reviewCount: 1680,
    description: "AI-assisted social media scheduling, content calendar, and analytics.",
    image: "/images/mailboost.jpg",
    logo: "/images/logos/mailboost.jpg",
    price: 22,
    period: "month",
    brandColor: "#EC4899",
    brandLetter: "C",
    topBadge: "Trending",
    tags: ["Social Media", "Content"],
    features: [
      "Multi-platform scheduling",
      "AI caption & hashtag generator",
      "Audience engagement tracker",
      "Visual feed planner",
    ],
  },
  {
    id: "prod-talenthub",
    name: "TalentHub",
    category: "HR & Payroll",
    rating: 4.8,
    reviewCount: 1750,
    description: "Applicant tracking system and seamless employee onboarding platform.",
    image: "/images/manage360.jpg",
    logo: "/images/logos/manage360.jpg",
    price: 34,
    period: "month",
    brandColor: "#2563EB",
    brandLetter: "T",
    topBadge: "Top Rated",
    tags: ["Hiring", "Recruiting"],
    features: [
      "Custom career portal builder",
      "One-click job board syndication",
      "Automated resume parsing",
      "Background check integration",
    ],
  },
  {
    id: "prod-securestack",
    name: "SecureStack",
    category: "Developer Tools",
    rating: 4.9,
    reviewCount: 920,
    description: "Automated vulnerability scanner and secret detection for GitHub & GitLab.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 49,
    period: "month",
    brandColor: "#10B981",
    brandLetter: "S",
    topBadge: "Verified",
    tags: ["Security", "DevSecOps"],
    features: [
      "Zero-false-positive SAST scans",
      "Real-time leaked API key alerts",
      "Dependency CVE compliance",
      "CI/CD pull-request blocking",
    ],
  },
  {
    id: "prod-growthmetrics",
    name: "GrowthMetrics",
    category: "Marketing",
    rating: 4.7,
    reviewCount: 1350,
    description: "Product analytics and user funnel optimization for SaaS founders.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 39,
    period: "month",
    brandColor: "#059669",
    brandLetter: "G",
    topBadge: "Popular",
    tags: ["Funnel Analytics", "Conversion"],
    features: [
      "User session drop-off funnels",
      "Feature adoption heatmaps",
      "Retention cohort analysis",
      "No-code event tagger",
    ],
  },
  {
    id: "prod-sprintboard",
    name: "SprintBoard",
    category: "Project Management",
    rating: 4.8,
    reviewCount: 2340,
    description: "Visual Agile sprint tracker with velocity charts and story point estimation.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 18,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "S",
    topBadge: "Top Rated",
    tags: ["Agile", "Scrum"],
    features: ["Burndown charts", "Sprint retrospectives", "Backlog refinement", "Jira import"],
  },
  {
    id: "prod-taxpilot",
    name: "TaxPilot",
    category: "Accounting & Finance",
    rating: 4.9,
    reviewCount: 3120,
    description: "Automated sales tax and VAT compliance filing across 50 US states & EU.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 35,
    period: "month",
    brandColor: "#10B981",
    brandLetter: "T",
    topBadge: "Verified",
    tags: ["Taxes", "Compliance"],
    features: ["Auto-filing support", "Real-time rate lookups", "Nexus threshold tracking", "Audit protection"],
  },
  {
    id: "prod-omnichat",
    name: "OmniChat",
    category: "Customer Support",
    rating: 4.7,
    reviewCount: 1840,
    description: "Universal customer messaging across WhatsApp, Email, Instagram and Live Chat.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 24,
    period: "month",
    brandColor: "#8B5CF6",
    brandLetter: "O",
    topBadge: "Trending",
    tags: ["Live Chat", "Omnichannel"],
    features: ["Unified live inbox", "Automated chatbots", "Conversation routing", "Mobile agent apps"],
  },
  {
    id: "prod-codeforge",
    name: "CodeForge",
    category: "Developer Tools",
    rating: 4.8,
    reviewCount: 2150,
    description: "Cloud developer environments with pre-configured dev stacks and instant launch.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 20,
    period: "month",
    brandColor: "#0284C7",
    brandLetter: "C",
    topBadge: "Top Rated",
    tags: ["Cloud IDE", "DevEnv"],
    features: ["One-click workspace boot", "Docker containerization", "Git auto-sync", "Zero-config debugging"],
  },
  {
    id: "prod-hirezen",
    name: "HireZen",
    category: "HR & Payroll",
    rating: 4.7,
    reviewCount: 1650,
    description: "Video interviewing and candidate screening platform for fast-growing companies.",
    image: "/images/manage360.jpg",
    logo: "/images/logos/manage360.jpg",
    price: 39,
    period: "month",
    brandColor: "#2563EB",
    brandLetter: "H",
    topBadge: "Popular",
    tags: ["Hiring", "Interviews"],
    features: ["Automated interview booking", "AI candidate transcripts", "Scorecard evaluations", "ATS integrations"],
  },
  {
    id: "prod-advance",
    name: "AdVance",
    category: "Marketing",
    rating: 4.6,
    reviewCount: 1420,
    description: "Multi-channel PPC ad tracking and cross-platform budget optimization.",
    image: "/images/mailboost.jpg",
    logo: "/images/logos/mailboost.jpg",
    price: 49,
    period: "month",
    brandColor: "#F97316",
    brandLetter: "A",
    topBadge: "Trending",
    tags: ["PPC Ads", "Optimization"],
    features: ["Google & Meta ad sync", "Automated bid rules", "ROAS heatmaps", "Creative fatigue detection"],
  },
  {
    id: "prod-pipelinehq",
    name: "PipelineHQ",
    category: "CRM & Sales",
    rating: 4.9,
    reviewCount: 3800,
    description: "Collaborative deal pipelines with automated contract generation and e-signatures.",
    image: "/images/dealflow.jpg",
    logo: "/images/logos/dealflow.jpg",
    price: 45,
    period: "month",
    brandColor: "#EF4444",
    brandLetter: "P",
    topBadge: "Top Rated",
    tags: ["Sales", "Contracts"],
    features: ["One-click contract generation", "Legally binding e-signatures", "Stage-based deal tracking", "Revenue forecasts"],
  },
  {
    id: "prod-metricpro",
    name: "MetricPro",
    category: "Marketing",
    rating: 4.7,
    reviewCount: 1980,
    description: "Real-time web analytics and privacy-first visitor session replays.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 19,
    period: "month",
    brandColor: "#059669",
    brandLetter: "M",
    topBadge: "Verified",
    tags: ["Web Analytics", "Privacy"],
    features: ["Cookieless tracking", "Session replay recordings", "Goal funnel mapping", "Instant pageview heatmaps"],
  },
  {
    id: "prod-serverwatch",
    name: "ServerWatch",
    category: "Developer Tools",
    rating: 4.8,
    reviewCount: 2750,
    description: "Uptime monitoring, public status pages, and instant SMS downtime alerts.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 15,
    period: "month",
    brandColor: "#1E293B",
    brandLetter: "S",
    topBadge: "Top Rated",
    tags: ["Uptime", "Monitoring"],
    features: ["30-second ping intervals", "Custom branded status pages", "SSL certificate expiration alerts", "Global probe locations"],
  },
  {
    id: "prod-invoicebee",
    name: "InvoiceBee",
    category: "Accounting & Finance",
    rating: 4.8,
    reviewCount: 2240,
    description: "Effortless freelance invoicing, expense categorizing, and receipt scanning.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 12,
    period: "month",
    brandColor: "#F59E0B",
    brandLetter: "I",
    topBadge: "Popular",
    tags: ["Invoicing", "Freelance"],
    features: ["OCR receipt scanning", "Automated payment reminders", "Direct credit card checkout", "Quarterly tax estimates"],
  },
  {
    id: "prod-helpdesk360",
    name: "HelpDesk360",
    category: "Customer Support",
    rating: 4.7,
    reviewCount: 1890,
    description: "Enterprise IT service desk with ITIL incident management and asset logs.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 32,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "H",
    topBadge: "Verified",
    tags: ["IT Service", "Ticketing"],
    features: ["ITIL change management", "Hardware asset tracking", "Automated SLA escalations", "Active Directory SSO"],
  },
  {
    id: "prod-staffsync",
    name: "StaffSync",
    category: "HR & Payroll",
    rating: 4.9,
    reviewCount: 2600,
    description: "Employee shift scheduling, PTO requests, and overtime compliance software.",
    image: "/images/manage360.jpg",
    logo: "/images/logos/manage360.jpg",
    price: 28,
    period: "month",
    brandColor: "#2563EB",
    brandLetter: "S",
    topBadge: "Top Rated",
    tags: ["Scheduling", "PTO"],
    features: ["Drag-and-drop shift planner", "Mobile employee swap requests", "Overtime prevention alerts", "Payroll timecard export"],
  },
  {
    id: "prod-goaltree",
    name: "GoalTree",
    category: "Project Management",
    rating: 4.7,
    reviewCount: 1520,
    description: "Strategic OKR tracking and company alignment software for executives.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 25,
    period: "month",
    brandColor: "#8B5CF6",
    brandLetter: "G",
    topBadge: "Trending",
    tags: ["OKRs", "Strategy"],
    features: ["Company-wide goal cascade", "Weekly check-in reminders", "Confidence score metrics", "Executive summaries"],
  },
  {
    id: "prod-salesrocket",
    name: "SalesRocket",
    category: "CRM & Sales",
    rating: 4.8,
    reviewCount: 2100,
    description: "Automated cold email outreach sequences with mailbox warm-up.",
    image: "/images/dealflow.jpg",
    logo: "/images/logos/dealflow.jpg",
    price: 49,
    period: "month",
    brandColor: "#EA580C",
    brandLetter: "S",
    topBadge: "Top Rated",
    tags: ["Sales Outreach", "Email"],
    features: ["Automated email warm-up", "A/B subject testing", "Spam word detector", "Unlimited connected inboxes"],
  },
  {
    id: "prod-brandpulse",
    name: "BrandPulse",
    category: "Marketing",
    rating: 4.6,
    reviewCount: 1350,
    description: "Social listening and brand sentiment tracking across Reddit, Twitter & News.",
    image: "/images/mailboost.jpg",
    logo: "/images/logos/mailboost.jpg",
    price: 39,
    period: "month",
    brandColor: "#EC4899",
    brandLetter: "B",
    topBadge: "Popular",
    tags: ["Social Listening", "Brand"],
    features: ["AI sentiment classification", "Real-time keyword alerts", "Competitor mention audits", "Influencer discovery"],
  },
  {
    id: "prod-apigateway",
    name: "ApiGateway",
    category: "Developer Tools",
    rating: 4.9,
    reviewCount: 3400,
    description: "High-throughput API rate limiting, caching, and developer token portal.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 55,
    period: "month",
    brandColor: "#0284C7",
    brandLetter: "A",
    topBadge: "Verified",
    tags: ["APIs", "Backend"],
    features: ["Microsecond edge caching", "Custom API key quotas", "GraphQL schema governance", "Automatic Swagger docs"],
  },
  {
    id: "prod-ledgerbox",
    name: "LedgerBox",
    category: "Accounting & Finance",
    rating: 4.8,
    reviewCount: 2470,
    description: "Multi-entity accounting consolidation and consolidated balance sheet reports.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 65,
    period: "month",
    brandColor: "#10B981",
    brandLetter: "L",
    topBadge: "Top Rated",
    tags: ["Enterprise Finance", "Auditing"],
    features: ["Inter-company eliminations", "GAAP & IFRS compliance", "Automated ledger sync", "Custom chart of accounts"],
  },
  {
    id: "prod-chatnest",
    name: "ChatNest",
    category: "Customer Support",
    rating: 4.7,
    reviewCount: 1620,
    description: "Self-hosted AI support bot trained on your product documentation.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 29,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "C",
    topBadge: "Trending",
    tags: ["AI Chat", "Knowledge Base"],
    features: ["One-click website crawler", "Vector embeddings search", "Human handoff triggers", "Custom bot persona"],
  },
  {
    id: "prod-swiftscrum",
    name: "SwiftScrum",
    category: "Project Management",
    rating: 4.8,
    reviewCount: 2900,
    description: "Ultra-fast keyboard-first issue tracker designed for high-velocity software teams.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 16,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "S",
    topBadge: "Top Rated",
    tags: ["Agile", "Fast Issues"],
    features: ["Sub-50ms command menu", "Bidirectional GitHub sync", "Custom workflow states", "Offline mode sync"],
  },
  {
    id: "prod-booksflow",
    name: "BooksFlow",
    category: "Accounting & Finance",
    rating: 4.9,
    reviewCount: 3100,
    description: "Cloud bookkeeping with automated bank feeds and smart invoice matching.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 29,
    period: "month",
    brandColor: "#059669",
    brandLetter: "B",
    topBadge: "Verified",
    tags: ["Bookkeeping", "Bank Feeds"],
    features: ["Real-time transaction categorization", "Cash burn forecasting", "1-click accountant access", "CSV export & audit"],
  },
  {
    id: "prod-tickethive",
    name: "TicketHive",
    category: "Customer Support",
    rating: 4.7,
    reviewCount: 1780,
    description: "Fast customer ticketing with collision detection and canned response shortcuts.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 19,
    period: "month",
    brandColor: "#8B5CF6",
    brandLetter: "T",
    topBadge: "Popular",
    tags: ["Support", "Tickets"],
    features: ["Real-time collision detection", "Custom ticket views", "Bulk action triggers", "Zapier & Webhook support"],
  },
  {
    id: "prod-bugtracker",
    name: "BugTracker",
    category: "Developer Tools",
    rating: 4.8,
    reviewCount: 2200,
    description: "Full-stack error tracking, crash reports, and stack trace breadcrumbs.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 29,
    period: "month",
    brandColor: "#EF4444",
    brandLetter: "B",
    topBadge: "Top Rated",
    tags: ["Error Tracking", "APM"],
    features: ["Source map deobfuscation", "Session replay on crash", "Git commit blame integration", "Slack alert webhooks"],
  },
  {
    id: "prod-peoplefirst",
    name: "PeopleFirst",
    category: "HR & Payroll",
    rating: 4.9,
    reviewCount: 3400,
    description: "Employee engagement surveys, 360 performance reviews, and 1-on-1 agendas.",
    image: "/images/manage360.jpg",
    logo: "/images/logos/manage360.jpg",
    price: 24,
    period: "month",
    brandColor: "#2563EB",
    brandLetter: "P",
    topBadge: "Verified",
    tags: ["Engagement", "Reviews"],
    features: ["Anonymous pulse surveys", "Automated 360 review cycles", "Shared 1-on-1 meeting notes", "Company culture analytics"],
  },
  {
    id: "prod-socialsphere",
    name: "SocialSphere",
    category: "Marketing",
    rating: 4.6,
    reviewCount: 1540,
    description: "Unified social media publishing and inbox management for marketing teams.",
    image: "/images/mailboost.jpg",
    logo: "/images/logos/mailboost.jpg",
    price: 28,
    period: "month",
    brandColor: "#F97316",
    brandLetter: "S",
    topBadge: "Trending",
    tags: ["Publishing", "Social Media"],
    features: ["Bulk media uploader", "Approval workflow hierarchy", "Engagement benchmark stats", "Hashtag group presets"],
  },
  {
    id: "prod-dealcloser",
    name: "DealCloser",
    category: "CRM & Sales",
    rating: 4.8,
    reviewCount: 2650,
    description: "Automated sales proposals, quote calculators, and interactive pricing tables.",
    image: "/images/dealflow.jpg",
    logo: "/images/logos/dealflow.jpg",
    price: 42,
    period: "month",
    brandColor: "#DC2626",
    brandLetter: "D",
    topBadge: "Top Rated",
    tags: ["Proposals", "Quotes"],
    features: ["Interactive pricing sliders", "Client proposal viewed alerts", "Stripe payment inside quote", "CRM auto-update"],
  },
  {
    id: "prod-pulseanalytics",
    name: "PulseAnalytics",
    category: "Marketing",
    rating: 4.7,
    reviewCount: 1910,
    description: "Customer journey mapping and multi-channel attribution analytics.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 39,
    period: "month",
    brandColor: "#0891B2",
    brandLetter: "P",
    topBadge: "Popular",
    tags: ["Attribution", "Analytics"],
    features: ["Touchpoint timeline maps", "First/last/linear attribution", "CAC and LTV calculations", "Ad spend ROI tracking"],
  },
  {
    id: "prod-dockerpilot",
    name: "DockerPilot",
    category: "Developer Tools",
    rating: 4.9,
    reviewCount: 3800,
    description: "Simplified container orchestration and automated deployment pipelines.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 35,
    period: "month",
    brandColor: "#0284C7",
    brandLetter: "D",
    topBadge: "Verified",
    tags: ["Containers", "DevOps"],
    features: ["Zero-downtime rolling deploys", "Automated SSL certificates", "Resource utilization gauges", "Git push deploy hooks"],
  },
  {
    id: "prod-expensepro",
    name: "ExpensePro",
    category: "Accounting & Finance",
    rating: 4.8,
    reviewCount: 2450,
    description: "Corporate virtual cards, spending limits, and automated receipt matching.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 45,
    period: "month",
    brandColor: "#10B981",
    brandLetter: "E",
    topBadge: "Top Rated",
    tags: ["Expenses", "Corporate Cards"],
    features: ["Instant virtual cards", "Per-employee spend limits", "SMS receipt matching", "Accounting ERP export"],
  },
  {
    id: "prod-agentdesk",
    name: "AgentDesk",
    category: "Customer Support",
    rating: 4.7,
    reviewCount: 1820,
    description: "AI copilot for support agents with instant auto-drafted responses.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 25,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "A",
    topBadge: "Trending",
    tags: ["AI Copilot", "Support"],
    features: ["Context-aware response drafts", "Tone & grammar rewriting", "Article suggestion widget", "Multilingual translation"],
  },
  {
    id: "prod-workforcex",
    name: "WorkForceX",
    category: "HR & Payroll",
    rating: 4.9,
    reviewCount: 3150,
    description: "Global payroll and contractor payment platform across 150+ countries.",
    image: "/images/manage360.jpg",
    logo: "/images/logos/manage360.jpg",
    price: 49,
    period: "month",
    brandColor: "#2563EB",
    brandLetter: "W",
    topBadge: "Top Rated",
    tags: ["Global Payroll", "Contractors"],
    features: ["Localized employment contracts", "Multi-currency bank payouts", "Tax form W-8/W-9 collection", "IP protection compliance"],
  },
  {
    id: "prod-plancraft",
    name: "PlanCraft",
    category: "Project Management",
    rating: 4.8,
    reviewCount: 2120,
    description: "Interactive Gantt charts, dependency tracking, and resource workload planner.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 22,
    period: "month",
    brandColor: "#8B5CF6",
    brandLetter: "P",
    topBadge: "Popular",
    tags: ["Gantt", "Resource Planning"],
    features: ["Critical path calculation", "Team workload balancing", "Milestone progress sharing", "PDF & Excel export"],
  },
  {
    id: "prod-outreachmax",
    name: "OutReachMax",
    category: "CRM & Sales",
    rating: 4.8,
    reviewCount: 2540,
    description: "LinkedIn & Email multichannel prospecting sequences with automated follow-ups.",
    image: "/images/dealflow.jpg",
    logo: "/images/logos/dealflow.jpg",
    price: 69,
    period: "month",
    brandColor: "#EF4444",
    brandLetter: "O",
    topBadge: "Verified",
    tags: ["Multichannel", "Sales"],
    features: ["LinkedIn auto-connect", "Voice note sequence triggers", "Unified inbox for replies", "CRM contact enrichment"],
  },
  {
    id: "prod-clickfunnelai",
    name: "ClickFunnel AI",
    category: "Marketing",
    rating: 4.7,
    reviewCount: 1950,
    description: "High-converting landing page builder with built-in AI copywriting & A/B testing.",
    image: "/images/mailboost.jpg",
    logo: "/images/logos/mailboost.jpg",
    price: 34,
    period: "month",
    brandColor: "#EC4899",
    brandLetter: "C",
    topBadge: "Trending",
    tags: ["Landing Pages", "A/B Testing"],
    features: ["Drag-and-drop page editor", "AI headline optimization", "Automated split traffic test", "Custom domain SSL"],
  },
  {
    id: "prod-cloudbackup",
    name: "CloudBackup",
    category: "Developer Tools",
    rating: 4.9,
    reviewCount: 2890,
    description: "Automated snapshot backups for PostgreSQL, MySQL, and cloud disks.",
    image: "/images/taskflow.jpg",
    logo: "/images/logos/taskflow.jpg",
    price: 19,
    period: "month",
    brandColor: "#0284C7",
    brandLetter: "C",
    topBadge: "Top Rated",
    tags: ["Database", "Backups"],
    features: ["Point-in-time recovery", "AES-256 encrypted storage", "Discord & Slack alerts", "One-click test restores"],
  },
  {
    id: "prod-cashflowiq",
    name: "CashFlow IQ",
    category: "Accounting & Finance",
    rating: 4.8,
    reviewCount: 2310,
    description: "AI-driven 12-month rolling cash flow forecast and runway scenario planner.",
    image: "/images/finmate.jpg",
    logo: "/images/logos/finmate.jpg",
    price: 49,
    period: "month",
    brandColor: "#10B981",
    brandLetter: "C",
    topBadge: "Verified",
    tags: ["Forecasting", "Cashflow"],
    features: ["Real-time bank sync", "Hiring scenario modeling", "Runway countdown alert", "Investor update generator"],
  },
  {
    id: "prod-carelive",
    name: "CareLive",
    category: "Customer Support",
    rating: 4.7,
    reviewCount: 1690,
    description: "Customer co-browsing and interactive screen sharing without downloads.",
    image: "/images/supportly.jpg",
    logo: "/images/logos/supportly.jpg",
    price: 39,
    period: "month",
    brandColor: "#6366F1",
    brandLetter: "C",
    topBadge: "Popular",
    tags: ["Co-Browsing", "Remote Support"],
    features: ["Zero-install co-browsing", "Mask sensitive input fields", "Live cursor highlighting", "Session audit logs"],
  },
];

const ITEMS_PER_PAGE = 18;

export default function ProductsPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = EXTENDED_PRODUCTS.filter((p) => {
    const matchesCat = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return b.reviewCount - a.reviewCount;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
    const anchor = document.getElementById("products-content-top");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const handleCategorySelect = (catValue: string) => {
    setSelectedCategory(catValue);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    setCurrentPage(1);
  };

  return (
    <PageLayout activeNav="products" noContainer>
      <div className="products-animated-page-wrapper">
        {/* Dynamic Animated Colorful Ambient Background Canvas */}
        <div className="products-bg-mesh" aria-hidden="true">
          <div className="products-mesh-orb orb-purple" />
          <div className="products-mesh-orb orb-cyan" />
          <div className="products-mesh-orb orb-pink" />
          <div className="products-mesh-orb orb-amber" />
          <div className="products-mesh-orb orb-emerald" />
          <div className="products-mesh-grid-pattern" />
          <div className="products-floating-particles">
            <span className="particle p1" />
            <span className="particle p2" />
            <span className="particle p3" />
            <span className="particle p4" />
            <span className="particle p5" />
          </div>
        </div>

        {/* Main Content */}
        <section className="products-main">
          <div className="container">
            <div className="products-layout">
              {/* Sidebar Filters */}
              <aside className="products-sidebar">
                <div className="products-filter-card">
                  <h3 className="products-filter-title">Categories</h3>
                  <ul className="products-filter-list">
                    {CATEGORIES.map((cat) => (
                      <li key={cat.value}>
                        <button
                          id={`cat-filter-${cat.value.toLowerCase().replace(/[^a-z]/g, "-") || "all"}`}
                          className={`products-filter-item${selectedCategory === cat.value ? " products-filter-item--active" : ""}`}
                          onClick={() => handleCategorySelect(cat.value)}
                        >
                          <span>{cat.label}</span>
                          <span className="products-filter-count">
                            {EXTENDED_PRODUCTS.filter((p) => !cat.value || p.category === cat.value).length}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="products-filter-card">
                  <h3 className="products-filter-title">Price Range</h3>
                  <div className="products-price-range">
                    <div className="products-price-row">
                      <input type="number" placeholder="Min $" className="products-price-input" id="price-min" defaultValue={0} min={0} />
                      <span>–</span>
                      <input type="number" placeholder="Max $" className="products-price-input" id="price-max" defaultValue={200} min={0} />
                    </div>
                  </div>
                </div>

                <div className="products-filter-card">
                  <h3 className="products-filter-title">Rating</h3>
                  {[4.5, 4, 3.5].map((r) => (
                    <label key={r} className="products-rating-label">
                      <input type="radio" name="rating-filter" id={`rating-filter-${r}`} />
                      <span style={{ color: "#F59E0B" }}>{"★".repeat(Math.floor(r))}</span>
                      <span> {r}+ stars</span>
                    </label>
                  ))}
                </div>
              </aside>

              {/* Product Grid */}
              <div className="products-content">
                {/* Top Bar with Integrated Search & Sort */}
                <div className="products-topbar" id="products-content-top">
                  <p className="products-result-count">
                    <span className="result-count-indicator" />
                    Showing&nbsp;<strong>{filtered.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}</strong>&nbsp;of&nbsp;<strong>{filtered.length}</strong>&nbsp;products
                  </p>

                  <div className="products-topbar-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="topbar-search-icon">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      id="products-search-input"
                      type="text"
                      placeholder="Search tools by name, features..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="products-topbar-search-input"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="topbar-search-clear"
                        onClick={() => handleSearchChange("")}
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="products-sort-row">
                    <label htmlFor="products-sort" className="products-sort-label">Sort by:</label>
                    <select
                      id="products-sort"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="products-sort-select"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

              {filtered.length === 0 ? (
                <div className="blog-empty-state">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p>No products found matching &ldquo;{searchQuery}&rdquo;</p>
                  <button className="btn-primary" onClick={() => { setSearchQuery(""); setSelectedCategory(""); setCurrentPage(1); }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {paginatedProducts.map((product) => {
                    return (
                      <div
                        key={product.id}
                        id={product.id}
                        className="product-card saas-discovery-card"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {/* Product Preview Image Banner */}
                        <div className="discovery-card-image-wrap">
                          <Image
                            src={product.image}
                            alt={`${product.name} dashboard preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                            className="discovery-card-img"
                          />
                        </div>

                        {/* Card Body */}
                        <div className="discovery-card-body">
                          {/* Header Row: Logo & Name on Left, Status Badge on Right */}
                          <div className="discovery-card-header-row">
                            <div className="discovery-card-brand-group">
                              {product.logo ? (
                                <div className="discovery-card-logo-wrap">
                                  <Image
                                    src={product.logo}
                                    alt={`${product.name} logo`}
                                    width={30}
                                    height={30}
                                    className="discovery-card-logo-img"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="discovery-card-logo"
                                  style={{ backgroundColor: product.brandColor }}
                                >
                                  {product.brandLetter}
                                </div>
                              )}
                              <h3 className="discovery-card-title">{product.name}</h3>
                            </div>

                            <span
                              className={`discovery-top-badge ${
                                product.topBadge === "Trending"
                                  ? "badge-trending"
                                  : product.topBadge === "Popular"
                                  ? "badge-popular"
                                  : product.topBadge === "Verified"
                                  ? "badge-verified"
                                  : "badge-top-rated"
                              }`}
                            >
                              {product.topBadge || "Top Rated"}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="discovery-card-desc">{product.description}</p>

                          {/* Dedicated Badges Row: Attractive pills in single row */}
                          <div className="discovery-badges-row">
                            {(product.tags || [product.category]).slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="discovery-tag-pill"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Price & Rating Row */}
                          <div className="discovery-meta-row">
                            <div className="discovery-price-group">
                              <span className="discovery-price-amount">${product.price}</span>
                            </div>

                            <div className="discovery-rating-inline">
                              <span className="discovery-stars">★</span>
                              <span className="discovery-rating-score">
                                {typeof product.rating === "number"
                                  ? product.rating.toFixed(1)
                                  : product.rating}
                              </span>
                              <span className="discovery-rating-count">
                                ({product.reviewCount >= 1000
                                  ? `${(product.reviewCount / 1000).toFixed(1)}K`
                                  : product.reviewCount})
                              </span>
                            </div>
                          </div>

                          {/* Primary CTA Button */}
                          <button
                            type="button"
                            className="discovery-btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                          >
                            View Basic Info
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Interactive Pagination */}
              {totalPages > 1 && (
                <div className="products-pagination" role="navigation" aria-label="Products pagination">
                  {validPage > 1 && (
                    <button
                      type="button"
                      className="products-page-btn"
                      id="page-prev"
                      onClick={() => handlePageChange(validPage - 1)}
                      aria-label="Previous page"
                    >
                      Prev
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`products-page-btn${validPage === pageNum ? " products-page-btn--active" : ""}`}
                      id={`page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      aria-label={`Page ${pageNum}`}
                      aria-current={validPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="products-page-btn"
                    id="page-next"
                    disabled={validPage === totalPages}
                    onClick={() => handlePageChange(validPage + 1)}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Overview Editorial Paragraphs */}
      <section className="products-directory-info-section">
        <div className="container">
          <div className="products-directory-info-card">
            <h2 className="products-directory-info-title">
              About Our Verified SaaS Marketplace Directory
            </h2>
            <div className="products-directory-info-content">
              <p>
                SaaS MRKT is built to simplify how modern teams discover, evaluate, and acquire top-tier business software. 
                Instead of navigating fragmented pricing tiers and biased sponsor listings, our directory curates high-impact SaaS tools 
                across core operational departments including HR &amp; Payroll, CRM &amp; Sales, Project Management, Developer Tools, 
                and Finance.
              </p>
              <p>
                Each software application featured on our platform includes real-time user ratings, transparent pricing details, 
                and verified user feedback. Whether you are an early-stage startup looking for your first productivity stack or an enterprise 
                streamlining software expenditures, SaaS MRKT empowers your team to make confident, data-backed software choices with speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectPlan={(prod) => {
          setSelectedProduct(null);
          showToast(`Started free trial for ${prod.name}! Check your inbox.`);
        }}
      />

      {toastMsg && (
        <div className="toast-notice" role="status">
          <span>⚡</span>
          <span>{toastMsg}</span>
        </div>
      )}
      </div>
    </PageLayout>
  );
}

