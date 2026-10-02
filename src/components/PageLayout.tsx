"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

interface PageLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
}

export default function PageLayout({ children, activeNav }: PageLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const handleOpenAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const navLinks = [
    { href: "/products", label: "Products", id: "products" },
    { href: "/#categories", label: "Categories", id: "categories" },
    { href: "/#for-buyers", label: "For Buyers", id: "buyers" },
    { href: "/#for-sellers", label: "For Sellers", id: "sellers" },
    { href: "/pricing", label: "Pricing", id: "pricing" },
  ];

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container">
          <nav className="navbar" aria-label="Main Navigation">
            {/* Logo */}
            <Link href="/" className="brand-logo" id="nav-brand-logo">
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
            </Link>

            {/* Nav Links */}
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`nav-link${activeNav === link.id ? " nav-link--active" : ""}`}
                    id={`nav-${link.id}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li
                className="nav-link-dropdown"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <span className={`nav-link${activeNav === "resources" ? " nav-link--active" : ""}`} id="nav-resources" style={{ cursor: "pointer" }}>
                  Resources
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
                {resourcesOpen && (
                  <div className="dropdown-menu">
                    <Link href="/blog" className="dropdown-item">Blog & Guides</Link>
                    <Link href="/#how-it-works" className="dropdown-item">How It Works</Link>
                    <Link href="/about" className="dropdown-item">About Us</Link>
                    <Link href="/contact" className="dropdown-item">Contact</Link>
                  </div>
                )}
              </li>
            </ul>

            {/* Right Actions */}
            <div className="nav-actions">
              <Link href="/blog" className="login-link" id="nav-blog-link">Blog</Link>
              <button className="login-link" onClick={() => handleOpenAuth("login")} id="nav-login-btn">
                Login
              </button>
              <button className="btn-primary" onClick={() => handleOpenAuth("signup")} id="nav-get-started-btn">
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

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div style={{ padding: "1.25rem 0", borderTop: "1px solid var(--slate-200)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {navLinks.map((link) => (
                <Link key={link.id} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--slate-800)", fontWeight: 600 }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--slate-800)", fontWeight: 600 }}>Blog</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--slate-800)", fontWeight: 600 }}>About</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--slate-800)", fontWeight: 600 }}>Contact</Link>
            </div>
          )}
        </div>
      </header>

      <main>{children}</main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
