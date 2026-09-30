"use client";

import React from "react";

interface CategoriesProps {
  onSelectCategory: (catName: string) => void;
  activeCategory: string;
}

export const CATEGORIES_DATA = [
  {
    id: "cat-hr",
    name: "HR & Payroll",
    count: "120+ Products",
    bg: "#EFF6FF",
    color: "#3B82F6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "cat-pm",
    name: "Project Management",
    count: "95+ Products",
    bg: "#F5F3FF",
    color: "#8B5CF6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
        <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
        <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: "cat-crm",
    name: "CRM",
    count: "80+ Products",
    bg: "#ECFDF5",
    color: "#10B981",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    id: "cat-accounting",
    name: "Accounting & Finance",
    count: "70+ Products",
    bg: "#FFFBEB",
    color: "#F59E0B",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <line x1="6" y1="12" x2="6" y2="12.01" strokeWidth="3" />
        <line x1="10" y1="10" x2="10" y2="12" />
        <line x1="14" y1="7" x2="14" y2="12" />
        <line x1="18" y1="9" x2="18" y2="12" />
      </svg>
    ),
  },
  {
    id: "cat-marketing",
    name: "Marketing",
    count: "80+ Products",
    bg: "#FDF2F8",
    color: "#EC4899",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
  },
  {
    id: "cat-productivity",
    name: "Productivity",
    count: "110+ Products",
    bg: "#FFF7ED",
    color: "#F97316",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "cat-dev",
    name: "Developer Tools",
    count: "85+ Products",
    bg: "#ECFEFF",
    color: "#06B6D4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "cat-ecommerce",
    name: "E-commerce",
    count: "75+ Products",
    bg: "#FEF2F2",
    color: "#EF4444",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    id: "cat-support",
    name: "Customer Support",
    count: "65+ Products",
    bg: "#EEF2FF",
    color: "#4F46E5",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
      </svg>
    ),
  },
  {
    id: "cat-design",
    name: "Design & Creative",
    count: "50+ Products",
    bg: "#F0FDF4",
    color: "#16A34A",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function Categories({ onSelectCategory, activeCategory }: CategoriesProps) {
  return (
    <section className="categories-section" id="categories">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <div className="section-badge" id="categories-badge">
              EXPLORE
            </div>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">
              Explore SaaS products across different categories and find the perfect tools for your business.
            </p>
          </div>
          <a href="#featured" className="view-all-link" id="view-all-categories-link">
            <span>View All Categories</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* 10-Item Grid (2 rows x 5 columns) */}
        <div className="categories-grid">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <div
                key={cat.id}
                id={cat.id}
                className="category-card"
                onClick={() => onSelectCategory(cat.name)}
                style={isSelected ? { borderColor: "var(--primary)", backgroundColor: "var(--primary-light)" } : {}}
              >
                <div className="category-card-left">
                  <div
                    className="category-icon-box"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div className="category-info">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-count">{cat.count}</span>
                  </div>
                </div>
                <span className="category-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
