"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  onSearchFocus: () => void;
}

export default function Navbar({ onOpenAuth, onSearchFocus }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar" aria-label="Main Navigation">
          {/* Logo */}
          <Link href="/" className="brand-logo" id="nav-brand-logo">
            <span className="brand-icon">
              <Image src="/logo.png" alt="SaaS MRKT Logo" width={32} height={32} priority style={{ objectFit: "contain" }} />
            </span>
            <span>SaaS MRKT</span>
          </Link>

          {/* Nav Links */}
          <ul className="nav-links">
            <li>
              <Link href="/products" className="nav-link" id="nav-products">
                Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="nav-link" id="nav-categories">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/buyers" className="nav-link" id="nav-buyers">
                For Buyers
              </Link>
            </li>
            <li>
              <Link href="/sellers" className="nav-link" id="nav-sellers">
                For Sellers
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="nav-link" id="nav-pricing">
                Pricing
              </Link>
            </li>
            <li
              className="nav-link-dropdown"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <span className="nav-link" id="nav-resources" style={{ cursor: "pointer" }}>
                Resources
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
              {resourcesOpen && (
                <div className="dropdown-menu dropdown-menu-rich">
                  <Link href="/blog" className={`dropdown-item-rich${pathname === "/blog" ? " active-dropdown-item" : ""}`}>
                    <div className="dropdown-icon-box" style={{ background: "var(--primary-50)", color: "var(--primary)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <div className="dropdown-text-box">
                      <div className="dropdown-title">Blog &amp; Guides</div>
                      <div className="dropdown-desc">Read our latest articles</div>
                    </div>
                  </Link>
                  <Link href="/how-it-works" className={`dropdown-item-rich${pathname === "/how-it-works" ? " active-dropdown-item" : ""}`}>
                    <div className="dropdown-icon-box" style={{ background: "var(--blue-50)", color: "var(--blue-500)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                    </div>
                    <div className="dropdown-text-box">
                      <div className="dropdown-title">How It Works</div>
                      <div className="dropdown-desc">Learn the buying process</div>
                    </div>
                  </Link>
                  <Link href="/about" className={`dropdown-item-rich${pathname === "/about" ? " active-dropdown-item" : ""}`}>
                    <div className="dropdown-icon-box" style={{ background: "var(--green-50)", color: "var(--green-500)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="dropdown-text-box">
                      <div className="dropdown-title">About Us</div>
                      <div className="dropdown-desc">Our mission &amp; team</div>
                    </div>
                  </Link>
                  <Link href="/contact" className={`dropdown-item-rich${pathname === "/contact" ? " active-dropdown-item" : ""}`}>
                    <div className="dropdown-icon-box" style={{ background: "var(--amber-50)", color: "var(--amber-500)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="dropdown-text-box">
                      <div className="dropdown-title">Contact Us</div>
                      <div className="dropdown-desc">Get in touch with support</div>
                    </div>
                  </Link>
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
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Products</Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Categories</Link>
            <Link href="/buyers" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>For Buyers</Link>
            <Link href="/sellers" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>For Sellers</Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Pricing</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Blog</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>About Us</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--slate-800)', fontWeight: 600 }}>Contact</Link>
          </div>
        )}
      </div>
    </header>
  );
}




