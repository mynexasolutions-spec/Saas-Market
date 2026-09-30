"use client";

import React, { useRef } from "react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const POPULAR_TAGS = [
  "HR & Payroll",
  "CRM",
  "Project Management",
  "Accounting",
  "Marketing",
  "Developer Tools",
];

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  onSearchSubmit,
}: HeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag("");
      setSearchQuery("");
    } else {
      setSelectedTag(tag);
      setSearchQuery(tag);
    }
  };

  return (
    <section className="hero-section" id="hero">
      {/* Background Decorative Gradients & Grid Dots */}
      <div className="hero-glow-bg" aria-hidden="true">
        <div className="hero-orb-left" />
        <div className="hero-orb-right" />
        
        {/* Left Dotted Grid */}
        <svg
          className="hero-dots-left"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dot-pattern-left" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2" fill="#5E4BEE" fillOpacity="0.25" />
            </pattern>
          </defs>
          <rect width="120" height="120" fill="url(#dot-pattern-left)" />
        </svg>

        {/* Right Dotted Grid */}
        <svg
          className="hero-dots-right"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dot-pattern-right" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2" fill="#5E4BEE" fillOpacity="0.25" />
            </pattern>
          </defs>
          <rect width="120" height="120" fill="url(#dot-pattern-right)" />
        </svg>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Top Pill Badge */}
          <div className="section-badge" id="hero-badge">
            The SaaS Marketplace
          </div>

          {/* Main Title */}
          <h1 className="hero-heading">
            Discover. Compare. Buy.<br />
            Powerful <span className="hero-heading-gradient">SaaS Products.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            SaaS Market is a dedicated platform where buyers can discover, compare and purchase SaaS products, and sellers can list, showcase and grow their SaaS business.
          </p>

          {/* Search Form */}
          <form className="hero-search-container" onSubmit={onSearchSubmit}>
            <div className="hero-search-box">
              <input
                ref={inputRef}
                type="text"
                id="hero-search-input"
                className="hero-search-input"
                placeholder="Search SaaS products, tools or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search SaaS products"
              />
              <button type="submit" className="hero-search-btn" id="hero-search-btn">
                Search
              </button>
            </div>
          </form>

          {/* Popular Tag Filters */}
          <div className="popular-tags-row">
            <span className="popular-label">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`popular-tag-chip ${selectedTag === tag ? "active" : ""}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
