"use client";

import React, { useState } from "react";

interface NavbarProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  onSearchFocus: () => void;
}

export default function Navbar({ onOpenAuth, onSearchFocus }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar" aria-label="Main Navigation">
          {/* Logo */}
          <a href="#" className="brand-logo" id="nav-brand-logo">
            <span className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#5E4BEE" />
                <path
                  d="M10 12C10 9.79086 11.7909 8 14 8H19C20.6569 8 22 9.34315 22 11C22 12.6569 20.6569 14 19 14H13C11.3431 14 10 15.3431 10 17C10 18.6569 11.3431 20 13 20H18C20.2091 20 22 21.7909 22 24"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>SaaS Market</span>
          </a>

          {/* Nav Links */}
          <ul className="nav-links">
            <li>
              <a href="#featured" className="nav-link" id="nav-products">
                Products
              </a>
            </li>
            <li>
              <a href="#categories" className="nav-link" id="nav-categories">
                Categories
              </a>
            </li>
            <li>
              <a href="#for-buyers" className="nav-link" id="nav-buyers">
                For Buyers
              </a>
            </li>
            <li>
              <a href="#for-sellers" className="nav-link" id="nav-sellers">
                For Sellers
              </a>
            </li>
            <li>
              <a href="#pricing" className="nav-link" id="nav-pricing">
                Pricing
              </a>
            </li>
            <li
              className="nav-link-dropdown"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <a href="#resources" className="nav-link" id="nav-resources">
                Resources
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </a>
              {resourcesOpen && (
                <div className="dropdown-menu">
                  <a href="#resources" className="dropdown-item">Blog & Guides</a>
                  <a href="#how-it-works" className="dropdown-item">How It Works</a>
                  <a href="#faq" className="dropdown-item">Knowledge Base</a>
                  <a href="#reviews" className="dropdown-item">Community Reviews</a>
                </div>
              )}
            </li>
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            <button
              className="search-trigger-btn"
              onClick={onSearchFocus}
              aria-label="Search SaaS tools"
              id="nav-search-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button
              className="login-link"
              onClick={() => onOpenAuth("login")}
              id="nav-login-btn"
            >
              Login
            </button>
            <button
              className="btn-primary"
              onClick={() => onOpenAuth("signup")}
              id="nav-get-started-btn"
            >
              Get Started
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            padding: '1.25rem 0',
            borderTop: '1px solid var(--slate-200)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <a href="#featured" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Products</a>
            <a href="#categories" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Categories</a>
            <a href="#for-buyers" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>For Buyers</a>
            <a href="#for-sellers" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>For Sellers</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Pricing</a>
            <a href="#resources" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Resources</a>
          </div>
        )}
      </div>
    </header>
  );
}
