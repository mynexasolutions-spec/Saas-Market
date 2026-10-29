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
import "./spotlight-modal.css";

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

const SAAS_CATEGORIES = [
  { id: "all", name: "All Categories", short: "All", slug: "", icon: "🌐", count: "73+ Tools" },
  { id: "crm", name: "CRM & Sales", short: "CRM", slug: "crm", icon: "🤝", count: "24 Tools" },
  {
    id: "project-management",
    name: "Project Management",
    short: "Projects",
    slug: "project-management",
    icon: "⚡",
    count: "18 Tools",
  },
  { id: "hr-payroll", name: "HR & Payroll", short: "HR", slug: "hr-payroll", icon: "👥", count: "12 Tools" },
  {
    id: "marketing-automation",
    name: "Marketing & Automation",
    short: "Marketing",
    slug: "marketing-automation",
    icon: "📣",
    count: "30 Tools",
  },
  {
    id: "finance-accounting",
    name: "Finance & Accounting",
    short: "Finance",
    slug: "finance-accounting",
    icon: "💳",
    count: "16 Tools",
  },
  {
    id: "devops-cloud",
    name: "DevOps & Cloud",
    short: "DevOps",
    slug: "devops-cloud",
    icon: "☁️",
    count: "15 Tools",
  },
  { id: "data-bi", name: "Data & BI", short: "Data", slug: "data-bi", icon: "📊", count: "14 Tools" },
  {
    id: "cybersecurity-identity",
    name: "Cybersecurity & Identity",
    short: "Security",
    slug: "cybersecurity-identity",
    icon: "🛡️",
    count: "11 Tools",
  },
];

const POPULAR_SEARCH_ITEMS = [
  { term: "GrowthFlow", label: "GrowthFlow", badge: "CRM", desc: "All-in-one CRM for high-velocity teams", icon: "🚀" },
  { term: "TaskFlow", label: "TaskFlow", badge: "Projects", desc: "Collaborative agile sprint & Kanban board", icon: "⚡" },
  { term: "Manage360", label: "Manage360", badge: "HR", desc: "Automated human resources & payroll", icon: "💼" },
  { term: "FinMate", label: "FinMate", badge: "Finance", desc: "Automated bookkeeping & billing reconciliation", icon: "💰" },
  { term: "MailBoost", label: "MailBoost", badge: "Marketing", desc: "Behavioral lifecycle marketing & email drip", icon: "✉️" },
  { term: "Slack Alternatives", label: "Slack Alternatives", badge: "Alternatives", desc: "Modern team chat & async communication", icon: "💬" },
  { term: "CRM & Sales", label: "CRM & Sales", badge: "Category", desc: "24 verified sales pipelines & contact tools", icon: "🤝" },
  { term: "Project Management", label: "Project Management", badge: "Category", desc: "18 verified task & roadmap suites", icon: "📋" },
  { term: "Buyer Guide", label: "Buyer Guide", badge: "Guide", desc: "5-step evaluation framework for SaaS buyers", icon: "📖" },
];

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

const QUICK_SUGGESTIONS = [
  "GrowthFlow",
  "CRM & Sales",
  "Slack Alternatives",
  "FinMate",
  "Project Management",
  "Marketing",
  "Buyer Guide",
];

function matchesSaaSCategory(
  prodCategory: string,
  selectedCatId: string,
): boolean {
  if (selectedCatId === "all") return true;
  const target = SAAS_CATEGORIES.find((c) => c.id === selectedCatId);
  if (!target) return true;
  const p = (prodCategory || "").toLowerCase();
  const t = target.name.toLowerCase();
  if (p === t) return true;
  if (selectedCatId === "crm" && (p.includes("crm") || p.includes("sales")))
    return true;
  if (
    selectedCatId === "project-management" &&
    (p.includes("project") || p.includes("task"))
  )
    return true;
  if (
    selectedCatId === "hr-payroll" &&
    (p.includes("hr") || p.includes("payroll") || p.includes("people"))
  )
    return true;
  if (
    selectedCatId === "finance-accounting" &&
    (p.includes("finance") ||
      p.includes("accounting") ||
      p.includes("bookkeeping"))
  )
    return true;
  if (
    selectedCatId === "marketing-automation" &&
    (p.includes("marketing") ||
      p.includes("automation") ||
      p.includes("email"))
  )
    return true;
  if (
    selectedCatId === "devops-cloud" &&
    (p.includes("devops") || p.includes("cloud") || p.includes("developer"))
  )
    return true;
  if (
    selectedCatId === "data-bi" &&
    (p.includes("data") || p.includes("bi") || p.includes("analytics"))
  )
    return true;
  if (
    selectedCatId === "cybersecurity-identity" &&
    (p.includes("security") ||
      p.includes("cyber") ||
      p.includes("identity") ||
      p.includes("compliance"))
  )
    return true;
  return p.includes(t) || t.includes(p);
}

const getCategoryHeading = (cat: string, selectedCatId: string) => {
  if (cat === "product") {
    if (selectedCatId !== "all") {
      const activeCat = SAAS_CATEGORIES.find((c) => c.id === selectedCatId);
      return `${activeCat?.name || "Software"} Tools`;
    }
    return "Software Tools";
  }
  switch (cat) {
    case "category":
      return "Categories & Verticals";
    case "alternative":
      return "Software Alternatives";
    case "article":
      return "Guides & Blog";
    default:
      return "Results";
  }
};

export default function SpotlightSearchModal({
  isOpen,
  onClose,
}: SpotlightSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchCategory>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPopularDropdownOpen, setIsPopularDropdownOpen] = useState(false);
  const [marketplaceProducts, setMarketplaceProducts] =
    useState<ProductItem[]>(ALL_PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const popularDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        popularDropdownRef.current &&
        !popularDropdownRef.current.contains(e.target as Node)
      ) {
        setIsPopularDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setIsCategoryDropdownOpen(false);
      setIsPopularDropdownOpen(false);
      const timeoutId = window.setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelectedCategory("all");
        setActiveFilter("all");
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
        if (isCategoryDropdownOpen || isPopularDropdownOpen) {
          setIsCategoryDropdownOpen(false);
          setIsPopularDropdownOpen(false);
          return;
        }
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isCategoryDropdownOpen, isPopularDropdownOpen]);

  // Compute category counts
  const filterCounts = useMemo(() => {
    const q = query.trim().toLowerCase();

    const productCount = marketplaceProducts.filter((prod) => {
      if (!matchesSaaSCategory(prod.category, selectedCategory)) return false;
      if (!q) return true;
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        (prod.tagline && prod.tagline.toLowerCase().includes(q)) ||
        prod.description.toLowerCase().includes(q) ||
        (prod.tags && prod.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }).length;

    const categoryCount = STATIC_CATEGORIES.filter((cat) => {
      if (selectedCategory !== "all") {
        const catObj = SAAS_CATEGORIES.find((c) => c.id === selectedCategory);
        if (catObj && catObj.slug && cat.slug !== catObj.slug) return false;
      }
      if (!q) return true;
      return cat.name.toLowerCase().includes(q);
    }).length;

    const altCount =
      selectedCategory === "all"
        ? STATIC_ALTERNATIVES.filter((alt) => {
            if (!q) return true;
            return (
              alt.name.toLowerCase().includes(q) ||
              alt.desc.toLowerCase().includes(q)
            );
          }).length
        : 0;

    const articleCount =
      selectedCategory === "all"
        ? STATIC_ARTICLES.filter((art) => {
            if (!q) return true;
            return (
              art.title.toLowerCase().includes(q) ||
              art.category.toLowerCase().includes(q)
            );
          }).length
        : 0;

    return {
      all: productCount + categoryCount + altCount + articleCount,
      products: productCount,
      categories: categoryCount,
      alternatives: altCount,
      articles: articleCount,
    };
  }, [query, marketplaceProducts, selectedCategory]);

  // Compute Search Results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Products
    if (activeFilter === "all" || activeFilter === "products") {
      const matchedProducts = marketplaceProducts
        .filter((prod) => {
          if (!matchesSaaSCategory(prod.category, selectedCategory))
            return false;
          if (!q) return true;
          return (
            prod.name.toLowerCase().includes(q) ||
            prod.category.toLowerCase().includes(q) ||
            (prod.tagline && prod.tagline.toLowerCase().includes(q)) ||
            prod.description.toLowerCase().includes(q) ||
            (prod.tags && prod.tags.some((t) => t.toLowerCase().includes(q)))
          );
        })
        .slice(0, q || selectedCategory !== "all" ? 14 : 6);

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
        if (selectedCategory !== "all") {
          const catObj = SAAS_CATEGORIES.find((c) => c.id === selectedCategory);
          if (catObj && catObj.slug && cat.slug !== catObj.slug) return false;
        }
        if (!q) return true;
        return cat.name.toLowerCase().includes(q);
      }).slice(0, q ? 6 : 4);

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
    if (
      (activeFilter === "all" && selectedCategory === "all") ||
      activeFilter === "alternatives"
    ) {
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
    if (
      (activeFilter === "all" && selectedCategory === "all") ||
      activeFilter === "articles"
    ) {
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
  }, [query, activeFilter, selectedCategory, marketplaceProducts]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeFilter, selectedCategory, query]);

  // Smooth scroll selected item into view during keyboard navigation
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector<HTMLElement>(
        `[data-index="${selectedIndex}"]`,
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

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

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setActiveFilter("all");
    setSelectedCategory("all");
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      className="spotlight-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Search"
    >
      <div className="spotlight-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Search Header Bar (Sleek & Compact) */}
        <div className="spotlight-header">
          <div className="spotlight-search-icon-box">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search software tools, categories, alternatives, articles..."
            className="spotlight-input"
            autoComplete="off"
            spellCheck="false"
            style={{ outline: "none", border: "none", boxShadow: "none" }}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="spotlight-clear-btn"
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

          {/* Desktop ESC hint */}
          <span className="spotlight-esc-badge">ESC</span>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="spotlight-mobile-close-btn"
            title="Close modal"
            aria-label="Close modal"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Primary Filter Tabs Bar (Compact Raycast Pills) */}
        <div className="spotlight-tabs-bar">
          {(
            [
              { key: "all", label: "All Results", count: filterCounts.all },
              {
                key: "products",
                label: "Software Tools",
                count: filterCounts.products,
              },
              {
                key: "categories",
                label: "Categories",
                count: filterCounts.categories,
              },
              {
                key: "alternatives",
                label: "Alternatives",
                count: filterCounts.alternatives,
              },
              {
                key: "articles",
                label: "Guides & Blog",
                count: filterCounts.articles,
              },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.key);
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
                className={`spotlight-tab-btn ${isActive ? "is-active" : ""}`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="spotlight-tab-count">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modern Filter Controls Bar with Category & Popular Dropdowns */}
        {(() => {
          const currentSelectedCat =
            SAAS_CATEGORIES.find((c) => c.id === selectedCategory) ||
            SAAS_CATEGORIES[0];
          return (
            <div className="spotlight-controls-bar">
              {/* 1. Category Dropdown */}
              <div
                className="spotlight-dropdown-wrapper"
                ref={categoryDropdownRef}
              >
                <button
                  type="button"
                  className={`spotlight-dropdown-trigger ${
                    selectedCategory !== "all" ? "has-selection" : ""
                  } ${isCategoryDropdownOpen ? "is-open" : ""}`}
                  onClick={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    setIsPopularDropdownOpen(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryDropdownOpen}
                  title="Filter by SaaS Category"
                >
                  <span className="spotlight-dropdown-icon">
                    {currentSelectedCat?.icon || "📂"}
                  </span>
                  <span className="spotlight-dropdown-text">
                    <span className="spotlight-dropdown-prefix">Category:</span>{" "}
                    <span className="spotlight-dropdown-val">
                      {currentSelectedCat?.name || "All Categories"}
                    </span>
                  </span>
                  {selectedCategory !== "all" && (
                    <span
                      className="spotlight-dropdown-clear-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory("all");
                        setSelectedIndex(0);
                      }}
                      title="Clear Category Filter"
                    >
                      ✕
                    </span>
                  )}
                  <svg
                    className={`spotlight-dropdown-chevron ${
                      isCategoryDropdownOpen ? "rotated" : ""
                    }`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isCategoryDropdownOpen && (
                  <div className="spotlight-dropdown-menu" role="listbox">
                    <div className="spotlight-dropdown-menu-header">
                      <span>SELECT SAAS CATEGORY</span>
                      {selectedCategory !== "all" && (
                        <button
                          type="button"
                          className="spotlight-dropdown-reset-link"
                          onClick={() => {
                            setSelectedCategory("all");
                            setIsCategoryDropdownOpen(false);
                            setSelectedIndex(0);
                          }}
                        >
                          Reset All
                        </button>
                      )}
                    </div>

                    <div className="spotlight-dropdown-menu-list">
                      {SAAS_CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <div
                            key={cat.id}
                            className={`spotlight-dropdown-item ${
                              isSelected ? "is-active" : ""
                            }`}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setIsCategoryDropdownOpen(false);
                              setSelectedIndex(0);
                              inputRef.current?.focus();
                            }}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <span className="spotlight-item-emoji">
                              {cat.icon}
                            </span>
                            <div className="spotlight-item-info-col">
                              <span className="spotlight-item-label">
                                {cat.name}
                              </span>
                            </div>
                            <span className="spotlight-item-count-badge">
                              {cat.count}
                            </span>
                            {isSelected && (
                              <svg
                                className="spotlight-item-check"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Popular Searches Dropdown */}
              <div
                className="spotlight-dropdown-wrapper"
                ref={popularDropdownRef}
              >
                <button
                  type="button"
                  className={`spotlight-dropdown-trigger ${
                    isPopularDropdownOpen ? "is-open" : ""
                  }`}
                  onClick={() => {
                    setIsPopularDropdownOpen(!isPopularDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isPopularDropdownOpen}
                  title="Browse Popular SaaS Searches"
                >
                  <span className="spotlight-dropdown-icon">⚡</span>
                  <span className="spotlight-dropdown-text">
                    <span className="spotlight-dropdown-prefix">Popular:</span>{" "}
                    <span className="spotlight-dropdown-val">
                      Trending Searches
                    </span>
                  </span>
                  <svg
                    className={`spotlight-dropdown-chevron ${
                      isPopularDropdownOpen ? "rotated" : ""
                    }`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isPopularDropdownOpen && (
                  <div className="spotlight-dropdown-menu" role="listbox">
                    <div className="spotlight-dropdown-menu-header">
                      <span> TRENDING & POPULAR QUERIES</span>
                    </div>

                    <div className="spotlight-dropdown-menu-list">
                      {POPULAR_SEARCH_ITEMS.map((item) => (
                        <div
                          key={item.term}
                          className="spotlight-dropdown-item spotlight-popular-item"
                          onClick={() => {
                            handleSuggestionClick(item.term);
                            setIsPopularDropdownOpen(false);
                          }}
                          role="option"
                        >
                          <span className="spotlight-item-emoji">
                            {item.icon}
                          </span>
                          <div className="spotlight-item-info-col">
                            <div className="spotlight-popular-title-row">
                              <span className="spotlight-item-label">
                                {item.label}
                              </span>
                              <span className="spotlight-popular-badge">
                                {item.badge}
                              </span>
                            </div>
                            <span className="spotlight-popular-desc">
                              {item.desc}
                            </span>
                          </div>
                          <svg
                            className="spotlight-popular-arrow"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Results List (Compact & Fast Scanning) */}
        <div ref={resultsContainerRef} className="spotlight-results">
          {filteredResults.length === 0 ? (
            <div className="spotlight-empty">
              <div className="spotlight-empty-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h4 className="spotlight-empty-title">
                No tools found
                {query ? ` for "${query}"` : ""}
                {selectedCategory !== "all"
                  ? ` in ${
                      SAAS_CATEGORIES.find((c) => c.id === selectedCategory)
                        ?.name
                    }`
                  : ""}
              </h4>
              <p className="spotlight-empty-desc">
                Try searching for another tool, or reset the category filter to
                browse all verified software.
              </p>
              <div className="spotlight-empty-actions">
                {selectedCategory !== "all" && (
                  <button
                    type="button"
                    className="spotlight-quick-chip spotlight-reset-chip"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedIndex(0);
                    }}
                  >
                    View All Categories
                  </button>
                )}
                {QUICK_SUGGESTIONS.slice(0, 3).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    className="spotlight-quick-chip"
                    onClick={() => handleSuggestionClick(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isFirstOfCategory =
                activeFilter === "all" &&
                (idx === 0 ||
                  filteredResults[idx - 1].category !== item.category);

              return (
                <React.Fragment key={item.id}>
                  {isFirstOfCategory && (
                    <div className="spotlight-section-heading">
                      <span>
                        {getCategoryHeading(item.category, selectedCategory)}
                      </span>
                      <span className="spotlight-section-heading-line" />
                    </div>
                  )}

                  <Link
                    href={item.url}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    data-index={idx}
                    className={`spotlight-item ${
                      isSelected ? "is-selected" : ""
                    }`}
                  >
                    {/* Category / Brand Icon */}
                    {item.category === "product" ? (
                      <div
                        className="spotlight-item-icon"
                        style={{
                          backgroundColor: item.iconBg || "#5E4BEE",
                          color: "#FFFFFF",
                        }}
                      >
                        {item.iconLetter || "S"}
                      </div>
                    ) : item.category === "category" ? (
                      <div
                        className="spotlight-item-icon spotlight-icon-category"
                      >
                        <svg
                          width="16"
                          height="16"
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
                        className="spotlight-item-icon spotlight-icon-alternative"
                      >
                        <svg
                          width="16"
                          height="16"
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
                        className="spotlight-item-icon spotlight-icon-article"
                      >
                        <svg
                          width="16"
                          height="16"
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
                    <div className="spotlight-item-info">
                      <div className="spotlight-item-head">
                        <span className="spotlight-item-title">{item.title}</span>
                        <span
                          className="spotlight-item-badge"
                          title={`Filter by ${item.badge}`}
                          onClick={(e) => {
                            if (item.category === "product") {
                              e.preventDefault();
                              e.stopPropagation();
                              const match = SAAS_CATEGORIES.find(
                                (c) =>
                                  c.name.toLowerCase() ===
                                    item.badge.toLowerCase() ||
                                  item.badge
                                    .toLowerCase()
                                    .includes(c.short.toLowerCase()),
                              );
                              if (match) {
                                setSelectedCategory(match.id);
                              } else {
                                setQuery(item.badge);
                              }
                              setSelectedIndex(0);
                            }
                          }}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <div className="spotlight-item-desc">{item.subtitle}</div>
                    </div>

                    {/* Price if product */}
                    {item.price && (
                      <span className="spotlight-item-price">{item.price}</span>
                    )}

                    {/* Chevron Right */}
                    <svg
                      className="spotlight-item-arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Footer shortcuts & mobile meta */}
        <div className="spotlight-footer">
          {/* Desktop Keyboard Shortcuts */}
          <div className="spotlight-shortcuts-list">
            <span className="spotlight-shortcut-item">
              <kbd className="spotlight-kbd">↑</kbd>
              <kbd className="spotlight-kbd">↓</kbd>
              Navigate
            </span>
            <span className="spotlight-shortcut-item">
              <kbd className="spotlight-kbd">↵ Enter</kbd>
              Select
            </span>
            <span className="spotlight-shortcut-item">
              <kbd className="spotlight-kbd">ESC</kbd>
              Close
            </span>
          </div>

          {/* Results Summary */}
          <div className="spotlight-results-count">
            {filteredResults.length}{" "}
            {filteredResults.length === 1 ? "result" : "results"}
            {selectedCategory !== "all" && (
              <span className="spotlight-filter-pill-tag">
                in{" "}
                {
                  SAAS_CATEGORIES.find((c) => c.id === selectedCategory)
                    ?.short
                }
              </span>
            )}
          </div>

          <span className="spotlight-brand-tag">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            SaaS MRKT Search
          </span>
        </div>
      </div>
    </div>
  );
}
