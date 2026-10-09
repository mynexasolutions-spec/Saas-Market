"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { ProductItem } from "@/data/products";

interface ProductMoreDetailsClientProps {
  product: ProductItem;
}

export default function ProductMoreDetailsClient({ product }: ProductMoreDetailsClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "security" | "financials" | "reviews">("overview");

  const sellerName = product.sellerName || "Elena Rostova";
  const techStack = product.techStack || ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS"];

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
                      <div className="pdetails-media-header">
                        <span className="pdetails-media-tag">Workspace UI</span>
                        <span className="pdetails-media-title">Interactive Sprint Dashboard</span>
                      </div>
                      <div className="pdetails-media-wrapper">
                        <Image
                          src="/images/taskflow-dashboard-preview.jpg"
                          alt={`${product.name} Interactive Dashboard Interface`}
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
                        <span>{product.name} Production Workspace Interface</span>
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

                <div className="pdetails-about-card" style={{ marginTop: "2rem" }}>
                  <h3 className="pdetails-card-title" style={{ fontSize: "1.3rem" }}>Enterprise Architecture &amp; Team Ergonomics</h3>
                  <p className="pdetails-about-paragraph">
                    Furthermore, the system emphasizes frictionless onboarding and team ergonomics. Built-in permission matrices, granular role-based access controls (RBAC), and multi-tenant isolation patterns allow administrators to safely partition datasets across departments or external contractors. Detailed audit logging, automated weekly digest summaries, and customizable Kanban or sprint perspectives ensure both technical leads and executive stakeholders maintain comprehensive visibility over development throughput and product milestones.
                  </p>
                  <p className="pdetails-about-paragraph">
                    Engineered with long-term maintainability in mind, the codebase adheres to strict automated testing standards, comprehensive OpenAPI specifications, and containerized Docker CI/CD pipelines. This rigorous engineering foundation makes {product.name} an exceptionally stable asset for teams seeking immediate operational efficiency and an attractive proposition for buyers demanding transparent technical diligence and zero tech-debt overhead.
                  </p>
                </div>

                  {/* Team Work Session & Operational Collaboration */}
                  <div className="pdetails-media-block">
                    <div className="pdetails-media-header">
                      <span className="pdetails-media-tag">Team Operations</span>
                      <span className="pdetails-media-title">Cross-Functional Sprint Planning &amp; Agile Rituals</span>
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
                      <span>Figure 2: Active Team Work Session — Distributed squad leads conducting synchronized sprint 08 grooming and backlog capacity planning.</span>
                    </div>
                  </div>

                  <p className="pdetails-about-paragraph">
                    In active daily operations, {product.name} serves as the operational nerve center for cross-functional sprint planning sessions and collaborative backlog grooming. Whether teams gather in synchronous conference rooms or coordinate across global time zones, the platform&apos;s multi-display compatibility and live interactive boards facilitate high-engagement grooming rituals with zero latency.
                  </p>
                  <p className="pdetails-about-paragraph">
                    By replacing scattered spreadsheets and disconnected chat threads with structured, audit-ready development workflows, teams report significant reductions in planning overhead and an average 40% increase in sprint delivery velocity. With integrated retrospective tools and historical burn-down telemetry, engineering organizations continuously iterate on delivery quality while maintaining sustainable velocity across every development cycle.
                  </p>

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
                {/* Financial Diligence & Revenue Overview */}
                <div className="pdetails-about-card">
                  <span className="pdetails-about-badge">Financial Diligence</span>
                  <h2 className="pdetails-card-title">{product.name} Financial Performance, Unit Economics &amp; Growth Telemetry</h2>
                  <p className="pdetails-about-paragraph">
                    {product.name} operates on a capital-efficient software subscription model characterized by predictable monthly and annual recurring revenue streams. All operational revenue data, cohort churn metrics, and customer acquisition telemetry are verified directly through native Stripe billing integrations and audited accounting ledgers, providing acquiring parties and investors with institutional-grade diligence transparency.
                  </p>
                  <p className="pdetails-about-paragraph">
                    The platform exhibits strong cohort retention dynamics with a Net Retention Rate (NRR) of 108.5% and sustained gross margins exceeding 84%. Low customer acquisition costs (CAC) paired with automated self-serve expansion tiers ensure healthy lifetime value to customer acquisition cost (LTV:CAC) ratios across both mid-market and enterprise customer tiers.
                  </p>
                  <p className="pdetails-about-paragraph">
                    With zero long-term debt, audited profit-and-loss (P&amp;L) statements, and automated banking reconciliation feeds, the business maintains a transparent financial profile optimized for seamless escrow closing and risk-free post-acquisition handover.
                  </p>
                </div>

                <div className="pdetails-unlocked-banner">
                  <div className="pdetails-banner-top">
                    <span className="pdetails-banner-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      VERIFIED FINANCIAL METRICS
                    </span>
                    <h2>Verified Diligence Financial Data</h2>
                    <p>All metrics below have been audited and verified through Stripe and bank integration.</p>
                  </div>

                  <div className="pdetails-fin-cards">
                    <div className="pdetails-fin-card">
                      <span className="pdetails-fin-label">Annual Recurring Revenue</span>
                      <strong className="pdetails-fin-num">$148,500 / yr</strong>
                      <span className="pdetails-fin-badge">Stripe Verified</span>
                    </div>
                    <div className="pdetails-fin-card">
                      <span className="pdetails-fin-label">Monthly Growth Rate</span>
                      <strong className="pdetails-fin-num">+12.4% MoM</strong>
                      <span className="pdetails-fin-badge">TTM Verified</span>
                    </div>
                    <div className="pdetails-fin-card">
                      <span className="pdetails-fin-label">Gross Margin</span>
                      <strong className="pdetails-fin-num">84.2%</strong>
                      <span className="pdetails-fin-badge">Audited P&amp;L</span>
                    </div>
                    <div className="pdetails-fin-card">
                      <span className="pdetails-fin-label">Net Retention Rate</span>
                      <strong className="pdetails-fin-num">108.5%</strong>
                      <span className="pdetails-fin-badge">Cohort Analysis</span>
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
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
