"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/UserNavDropdown";
import SpotlightSearchModal from "@/components/SpotlightSearchModal";

interface NavbarProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  onSearchFocus?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export default function Navbar({
  onOpenAuth,
  onSearchFocus,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}: NavbarProps) {
  const pathname = usePathname();
  const { user, requestLogout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Close menus on route change
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMobileMenuOpen(false);
      setResourcesOpen(false);
      setMobileResourcesOpen(false);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar" aria-label="Main Navigation">
          {/* Subtle Decorative Pastel Corner Shapes Matching Reference Image */}
          <div className="navbar-bg-accents" aria-hidden="true">
            <span className="nav-accent-blob-left" />
            <span className="nav-accent-blob-right" />
          </div>

          {/* Left: Brand Logo */}
          <Link href="/" className="brand-logo" id="nav-brand-logo">
            <span className="brand-icon">
              <Image
                src="/logo.png"
                alt="SaaS MRKT Logo"
                width={36}
                height={36}
                priority
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="brand-logo-text">
              <span className="brand-text-dark">SaaS</span>{" "}
              <span className="brand-text-primary">MRKT</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <Link
                href="/products"
                className={`nav-link${pathname === "/products" ? " nav-link--active" : ""}`}
                id="nav-products"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className={`nav-link${pathname === "/categories" ? " nav-link--active" : ""}`}
                id="nav-categories"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/compare"
                className={`nav-link${pathname === "/compare" ? " nav-link--active" : ""}`}
                id="nav-compare"
              >
                Compare
              </Link>
            </li>
            <li>
              <Link
                href="/deals"
                className={`nav-link${pathname === "/deals" ? " nav-link--active" : ""}`}
                id="nav-deals"
              >
                Deals 🔥
              </Link>
            </li>
            <li>
              {user && user.role === "buyer" ? (
                <Link
                  href="/dashboard"
                  className={`nav-link${pathname === "/dashboard" ? " nav-link--active" : ""}`}
                  id="nav-dashboard"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/buyers"
                  className={`nav-link${pathname === "/buyers" ? " nav-link--active" : ""}`}
                  id="nav-buyers"
                >
                  For Buyers
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/sellers"
                className={`nav-link${pathname === "/sellers" ? " nav-link--active" : ""}`}
                id="nav-sellers"
              >
                For Sellers
              </Link>
            </li>

            {/* Mega Menu Dropdown for Resources */}
            <li
              className="nav-link-dropdown"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                className={`nav-link nav-link-has-chevron${resourcesOpen ? " nav-link--active" : ""}`}
                id="nav-resources"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
              >
                <span>Resources</span>
                <svg
                  className={`nav-chevron-icon${resourcesOpen ? " nav-chevron-rotated" : ""}`}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Modern Mega Menu Panel */}
              {resourcesOpen && (
                <div
                  className="modern-mega-menu"
                  role="region"
                  aria-label="Resources Mega Menu"
                >
                  <div className="mega-menu-grid">
                    {/* Column 1: Guides & Tools */}
                    <div className="mega-menu-col">
                      <div className="mega-menu-category-title">
                        <span>GUIDES &amp; TOOLS</span>
                      </div>

                      <div className="mega-menu-links-stack">
                        <Link
                          href="/blog"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">Blog &amp; Articles</span>
                            <span className="mega-item-desc">Latest SaaS trends &amp; playbooks</span>
                          </div>
                        </Link>

                        <Link
                          href="/tools/saas-spend-calculator"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-purple">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="4" y="2" width="16" height="20" rx="2" />
                              <line x1="8" y1="6" x2="16" y2="6" />
                              <line x1="16" y1="14" x2="16" y2="18" />
                              <path d="M16 10h.01" />
                              <path d="M12 10h.01" />
                              <path d="M8 10h.01" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">Spend Calculator</span>
                            <span className="mega-item-desc">Audit &amp; trim software waste</span>
                          </div>
                        </Link>

                        <Link
                          href="/alternatives"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-emerald">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="17 1 21 5 17 9" />
                              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                              <polyline points="7 23 3 19 7 15" />
                              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">Alternatives Directory</span>
                            <span className="mega-item-desc">Compare legacy replacements</span>
                          </div>
                        </Link>

                        <Link
                          href="/badges"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-amber">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="8" r="7" />
                              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">Vendor Badges</span>
                            <span className="mega-item-desc">Embed verified rating awards</span>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: Platform Trust & Operations */}
                    <div className="mega-menu-col">
                      <div className="mega-menu-category-title">
                        <span>MARKETPLACE TRUST</span>
                      </div>

                      <div className="mega-menu-links-stack">
                        <Link
                          href="/trust"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-emerald">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                              <polyline points="9 12 11 14 15 10" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">Trust &amp; Escrow</span>
                            <span className="mega-item-desc">100% buyer protection guarantee</span>
                          </div>
                        </Link>

                        <Link
                          href="/submit-product"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-purple">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="16" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">Submit a Product</span>
                            <span className="mega-item-desc">0% commission founder listing</span>
                          </div>
                        </Link>

                        <Link
                          href="/how-it-works"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">How It Works</span>
                            <span className="mega-item-desc">Simple 4-step discovery &amp; purchase</span>
                          </div>
                        </Link>

                        <Link
                          href="/about"
                          className="mega-menu-item"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <div className="mega-icon-box mega-icon-cyan">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </div>
                          <div className="mega-item-info">
                            <span className="mega-item-title">About SaaS MRKT</span>
                            <span className="mega-item-desc">Our mission, team &amp; standards</span>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Featured Spotlight Promo Card */}
                    <div className="mega-menu-featured-col">
                      <div className="mega-featured-card">
                        <div className="mega-featured-badge">
                          <span>FEATURED PLAYBOOK</span>
                        </div>
                        <h4 className="mega-featured-title">
                          2026 SaaS Buying Playbook
                        </h4>
                        <p className="mega-featured-desc">
                          Essential benchmarks for pricing tiers, enterprise SLAs, and contract negotiation.
                        </p>
                        <Link
                          href="/blog"
                          className="mega-featured-link"
                          onClick={() => setResourcesOpen(false)}
                        >
                          <span>Explore Free Guide</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          </ul>

          {/* Right: Actions Matching Reference Image Exactly */}
          <div className="nav-actions">
            {/* Circular Search Trigger Button */}
            <button
              type="button"
              className="nav-search-circle-btn"
              onClick={() => setIsSpotlightOpen(true)}
              aria-label="Search SaaS tools (Ctrl + K)"
              id="nav-search-btn"
              title="Search SaaS tools (Ctrl + K)"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Vertical Divider Line */}
            <div className="nav-vertical-divider nav-desktop-auth" aria-hidden="true" />

            {/* User Logged-in Dropdown OR Login + Get Started Buttons */}
            {user ? (
              <div className="nav-user-logged-wrap">
                <UserNavDropdown user={user} onLogout={requestLogout} />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="nav-login-btn nav-desktop-auth"
                  onClick={() => onOpenAuth("login")}
                  id="nav-login-btn"
                >
                  Login
                </button>
                <button
                  type="button"
                  className="nav-get-started-btn nav-desktop-auth"
                  onClick={() => onOpenAuth("signup")}
                  id="nav-get-started-btn"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer" id="mobile-navigation">
            {/* Quick Search inside Mobile Drawer */}
            <button
              type="button"
              className="mobile-drawer-search-bar"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSpotlightOpen(true);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search SaaS tools &amp; software...</span>
              <kbd className="mobile-kbd">⌘K</kbd>
            </button>

            <div className="mobile-nav-links">
              <Link
                href="/products"
                className={`mobile-nav-item${pathname === "/products" ? " active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className={`mobile-nav-item${pathname === "/categories" ? " active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/compare"
                className={`mobile-nav-item${pathname === "/compare" ? " active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Compare
              </Link>
              <Link
                href="/deals"
                className={`mobile-nav-item${pathname === "/deals" ? " active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals 🔥
              </Link>
              <Link
                href="/buyers"
                className={`mobile-nav-item${pathname === "/buyers" ? " active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                For Buyers
              </Link>
              <Link
                href="/sellers"
                className={`mobile-nav-item${pathname === "/sellers" ? " active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                For Sellers
              </Link>

              {/* Mobile Resources Accordion */}
              <div className="mobile-resources-accordion">
                <button
                  type="button"
                  className="mobile-nav-item mobile-resources-toggle"
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                >
                  <span>Resources</span>
                  <svg
                    className={`mobile-chevron${mobileResourcesOpen ? " rotated" : ""}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {mobileResourcesOpen && (
                  <div className="mobile-resources-sublinks">
                    <Link
                      href="/blog"
                      className="mobile-sublink-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-sublink-dot" />
                      <span>Blog &amp; Articles</span>
                    </Link>
                    <Link
                      href="/tools/saas-spend-calculator"
                      className="mobile-sublink-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-sublink-dot" />
                      <span>Spend Calculator</span>
                    </Link>
                    <Link
                      href="/alternatives"
                      className="mobile-sublink-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-sublink-dot" />
                      <span>Alternatives Directory</span>
                    </Link>
                    <Link
                      href="/trust"
                      className="mobile-sublink-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-sublink-dot" />
                      <span>Trust &amp; Escrow</span>
                    </Link>
                    <Link
                      href="/how-it-works"
                      className="mobile-sublink-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-sublink-dot" />
                      <span>How It Works</span>
                    </Link>
                    <Link
                      href="/submit-product"
                      className="mobile-sublink-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-sublink-dot" />
                      <span>Submit Product</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Portal links if user is signed in */}
              {user && (
                <>
                  <div className="mobile-divider" />
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="mobile-nav-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🛡️ Admin Console
                    </Link>
                  )}
                  {user.role === "vendor" && (
                    <Link
                      href="/vendor"
                      className="mobile-nav-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🏢 Vendor Portal
                    </Link>
                  )}
                  {user.role === "buyer" && (
                    <Link
                      href="/profile"
                      className="mobile-nav-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      👤 My Profile
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Mobile Auth Section */}
            <div className="mobile-nav-auth-section">
              {user ? (
                <div className="mobile-user-actions">
                  <div className="mobile-user-badge">
                    <span className="mobile-user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                    <span className="mobile-user-name">{user.name || user.email}</span>
                  </div>
                  <button
                    type="button"
                    className="mobile-logout-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      requestLogout();
                    }}
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-btn-row">
                  <button
                    type="button"
                    className="mobile-btn-login"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth("login");
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="mobile-btn-signup"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth("signup");
                    }}
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Spotlight Search Modal */}
      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />
    </header>
  );
}
