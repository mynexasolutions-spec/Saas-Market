"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ALL_PRODUCTS, ProductItem } from "@/data/products";
import {
  getAllMarketplaceProducts,
  VENDOR_PRODUCTS_EVENT_KEY,
  VENDOR_PRODUCTS_STORAGE_KEY,
} from "@/utils/vendorProducts";

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory =
  | "all"
  | "products"
  | "categories"
  | "alternatives"
  | "articles";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "product" | "category" | "alternative" | "article";
  badge: string;
  url: string;
  iconBg?: string;
  iconLetter?: string;
  price?: string;
}

const STATIC_CATEGORIES = [
  { name: "Project Management", slug: "project-management", count: "18 Tools" },
  { name: "CRM & Sales", slug: "crm", count: "24 Tools" },
  { name: "HR & Payroll", slug: "hr-payroll", count: "12 Tools" },
  {
    name: "Marketing & Automation",
    slug: "marketing-automation",
    count: "30 Tools",
  },
  { name: "DevOps & Cloud", slug: "devops-cloud", count: "15 Tools" },
  { name: "Data & BI", slug: "data-bi", count: "14 Tools" },
  {
    name: "Cybersecurity & Identity",
    slug: "cybersecurity-identity",
    count: "11 Tools",
  },
  {
    name: "Finance & Accounting",
    slug: "finance-accounting",
    count: "16 Tools",
  },
];

const STATIC_ALTERNATIVES = [
  {
    name: "Slack Alternatives",
    slug: "slack",
    desc: "Top team chat & asynchronous messaging platforms",
  },
  {
    name: "Asana Alternatives",
    slug: "asana",
    desc: "Modern collaborative agile task planners",
  },
  {
    name: "HubSpot Alternatives",
    slug: "hubspot",
    desc: "Cost-effective inbound CRM & email automation suites",
  },
  {
    name: "Jira Alternatives",
    slug: "jira",
    desc: "Fast velocity sprint tracking for modern engineering teams",
  },
  {
    name: "Salesforce Alternatives",
    slug: "salesforce",
    desc: "Mid-market revenue intelligence and deal pipelines",
  },
];

const STATIC_ARTICLES = [
  {
    title: "Top 10 SaaS Tools Driving Enterprise Velocity in 2026",
    slug: "top-10-saas-tools-2026",
    category: "Market Trends",
  },
  {
    title: "How to Choose the Right SaaS Tool: A 5-Step Evaluation Framework",
    slug: "how-to-choose-right-saas-tool",
    category: "Buyer Guide",
  },
  {
    title: "SaaS Trends 2026: Autonomous AI Agents & Consumption Pricing",
    slug: "saas-trends-2026",
    category: "Industry Insights",
  },
  {
    title: "SaaS Spend Audit: Eliminating Shadow IT and Seat Bloat",
    slug: "saas-spend-audit-guide",
    category: "Procurement",
  },
];

export default function SpotlightSearchModal({
  isOpen,
  onClose,
}: SpotlightSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [marketplaceProducts, setMarketplaceProducts] =
    useState<ProductItem[]>(ALL_PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number | null = null;
    const refreshProducts = () => {
      frameId = window.requestAnimationFrame(() =>
        setMarketplaceProducts(getAllMarketplaceProducts()),
      );
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === VENDOR_PRODUCTS_STORAGE_KEY) refreshProducts();
    };

    refreshProducts();
    window.addEventListener(VENDOR_PRODUCTS_EVENT_KEY, refreshProducts);
    window.addEventListener("storage", handleStorage);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener(VENDOR_PRODUCTS_EVENT_KEY, refreshProducts);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timeoutId = window.setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelectedIndex(0);
      }, 50);
      return () => window.clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Compute Search Results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Products
    if (activeFilter === "all" || activeFilter === "products") {
      const matchedProducts = marketplaceProducts
        .filter((prod) => {
          if (!q) return true;
          return (
            prod.name.toLowerCase().includes(q) ||
            prod.category.toLowerCase().includes(q) ||
            (prod.tagline && prod.tagline.toLowerCase().includes(q)) ||
            prod.description.toLowerCase().includes(q) ||
            (prod.tags && prod.tags.some((t) => t.toLowerCase().includes(q)))
          );
        })
        .slice(0, q ? 10 : 5);

      matchedProducts.forEach((prod) => {
        results.push({
          id: prod.id,
          title: prod.name,
          subtitle: prod.tagline || prod.description,
          category: "product",
          badge: prod.category,
          url: `/products/${prod.id}`,
          iconBg: prod.brandColor || "#5E4BEE",
          iconLetter: prod.brandLetter || prod.name.slice(0, 2).toUpperCase(),
          price: prod.price === 0 ? "Free" : `$${prod.price}/${prod.period}`,
        });
      });
    }

    // 2. Categories
    if (activeFilter === "all" || activeFilter === "categories") {
      const matchedCategories = STATIC_CATEGORIES.filter((cat) => {
        if (!q) return true;
        return cat.name.toLowerCase().includes(q);
      }).slice(0, q ? 5 : 4);

      matchedCategories.forEach((cat) => {
        results.push({
          id: `cat-${cat.slug}`,
          title: cat.name,
          subtitle: `Explore verified software in ${cat.name}`,
          category: "category",
          badge: cat.count,
          url: `/categories/${cat.slug}`,
        });
      });
    }

    // 3. Alternatives
    if (activeFilter === "all" || activeFilter === "alternatives") {
      const matchedAlts = STATIC_ALTERNATIVES.filter((alt) => {
        if (!q) return true;
        return (
          alt.name.toLowerCase().includes(q) ||
          alt.desc.toLowerCase().includes(q)
        );
      }).slice(0, q ? 5 : 3);

      matchedAlts.forEach((alt) => {
        results.push({
          id: `alt-${alt.slug}`,
          title: alt.name,
          subtitle: alt.desc,
          category: "alternative",
          badge: "Alternatives",
          url: `/alternatives/${alt.slug}`,
        });
      });
    }

    // 4. Articles
    if (activeFilter === "all" || activeFilter === "articles") {
      const matchedArticles = STATIC_ARTICLES.filter((art) => {
        if (!q) return true;
        return (
          art.title.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q)
        );
      }).slice(0, q ? 4 : 3);

      matchedArticles.forEach((art) => {
        results.push({
          id: `art-${art.slug}`,
          title: art.title,
          subtitle: "Procurement and architectural research report",
          category: "article",
          badge: art.category,
          url: `/blog/${art.slug}`,
        });
      });
    }

    return results;
  }, [query, activeFilter, marketplaceProducts]);

  // Keyboard navigation through list (ArrowUp, ArrowDown, Enter)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredResults.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredResults[selectedIndex];
      if (current) {
        router.push(current.url);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="spotlight-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        animation: "spotlightFadeIn 0.15s ease-out",
      }}
    >
      <div
        className="spotlight-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#FFFFFF",
          borderRadius: "18px",
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 25px 60px -15px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "75vh",
        }}
      >
        {/* Search Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #E2E8F0",
            gap: "0.85rem",
            background: "#FAFAFD",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5E4BEE"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search software tools, categories, alternatives, articles..."
            className="search-he"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: "1.05rem",
              fontWeight: 500,
              color: "#0F172A",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              style={{
                background: "#E2E8F0",
                border: "none",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 700,
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#64748B",
              background: "#E2E8F0",
              padding: "0.2rem 0.5rem",
              borderRadius: "6px",
              letterSpacing: "0.03em",
            }}
          >
            ESC
          </span>
        </div>

        {/* Filter Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.6rem 1.25rem",
            borderBottom: "1px solid #F1F5F9",
            background: "#FFFFFF",
            overflowX: "auto",
          }}
        >
          {(
            [
              { key: "all", label: "All Results" },
              { key: "products", label: "Software Tools" },
              { key: "categories", label: "Categories" },
              { key: "alternatives", label: "Alternatives" },
              { key: "articles", label: "Guides & Blog" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveFilter(tab.key);
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              style={{
                border: "none",
                background: activeFilter === tab.key ? "#5E4BEE" : "#F1F5F9",
                color: activeFilter === tab.key ? "#FFFFFF" : "#475569",
                fontSize: "0.8rem",
                fontWeight: 600,
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={resultsContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.5rem",
            maxHeight: "420px",
          }}
        >
          {filteredResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#F1F5F9",
                  color: "#94A3B8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.85rem",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p
                style={{
                  fontWeight: 600,
                  color: "#1E293B",
                  fontSize: "0.95rem",
                  marginBottom: "0.25rem",
                }}
              >
                No matches found for &ldquo;{query}&rdquo;
              </p>
              <p style={{ fontSize: "0.82rem", color: "#64748B" }}>
                Try searching for &quot;CRM&quot;, &quot;GrowthFlow&quot;,
                &quot;Slack&quot;, or &quot;Project Management&quot;.
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "12px",
                    textDecoration: "none",
                    background: isSelected ? "#F4F3FF" : "transparent",
                    border: isSelected
                      ? "1px solid #DDD6FE"
                      : "1px solid transparent",
                    transition: "all 0.1s ease",
                    marginBottom: "3px",
                  }}
                >
                  {/* Icon */}
                  {item.category === "product" ? (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: item.iconBg || "#5E4BEE",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.iconLetter || "S"}
                    </div>
                  ) : item.category === "category" ? (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#EEF2FF",
                        color: "#4F46E5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                    </div>
                  ) : item.category === "alternative" ? (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#FEF2F2",
                        color: "#DC2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <polyline points="17 1 21 5 17 9" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <polyline points="7 23 3 19 7 15" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#F0FDF4",
                        color: "#16A34A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                  )}

                  {/* Text content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          color: isSelected ? "#4338CA" : "#0F172A",
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: isSelected ? "#6366F1" : "#64748B",
                          backgroundColor: isSelected ? "#EEF2FF" : "#F1F5F9",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#64748B",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginTop: "2px",
                      }}
                    >
                      {item.subtitle}
                    </div>
                  </div>

                  {/* Price if product */}
                  {item.price && (
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#059669",
                        flexShrink: 0,
                        backgroundColor: "#ECFDF5",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "6px",
                      }}
                    >
                      {item.price}
                    </span>
                  )}

                  {/* Chevron */}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isSelected ? "#4F46E5" : "#94A3B8"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.65rem 1.25rem",
            borderTop: "1px solid #E2E8F0",
            backgroundColor: "#F8FAFC",
            fontSize: "0.74rem",
            color: "#64748B",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>
              <kbd
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "4px",
                  padding: "1px 4px",
                  fontWeight: 700,
                }}
              >
                ↑
              </kbd>{" "}
              <kbd
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "4px",
                  padding: "1px 4px",
                  fontWeight: 700,
                }}
              >
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "4px",
                  padding: "1px 4px",
                  fontWeight: 700,
                }}
              >
                Enter
              </kbd>{" "}
              Select
            </span>
            <span>
              <kbd
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "4px",
                  padding: "1px 4px",
                  fontWeight: 700,
                }}
              >
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>
          <span style={{ fontWeight: 600, color: "#5E4BEE" }}>
            SaaS MRKT Search
          </span>
        </div>
      </div>
    </div>
  );
}
