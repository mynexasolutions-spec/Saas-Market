"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

interface PageLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
  noContainer?: boolean;
}

export default function PageLayout({ children, activeNav, noContainer }: PageLayoutProps) {
  const pathname = usePathname();
  const { user, logout, isAuthOpen, authMode, openAuth, closeAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const navLinks = [
    { href: "/products", label: "Products", id: "products" },
    { href: "/categories", label: "Categories", id: "categories" },
    { href: "/buyers", label: "For Buyers", id: "buyers" },
    { href: "/sellers", label: "For Sellers", id: "sellers" },
  ];

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container">
          <nav className="navbar" aria-label="Main Navigation">
            {/* Logo */}
            <Link href="/" className="brand-logo" id="nav-brand-logo">
              <span className="brand-icon">
                <Image src="/logo.png" alt="SaaS MRKT Logo" width={38} height={38} priority style={{ objectFit: "contain" }} />
              </span>
              <span>SaaS MRKT</span>
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
              {user ? (
                <div className="nav-user-logged-wrap">
                  <div className="nav-user-badge" title={user.email}>
                    <span className="nav-user-avatar" aria-hidden="true">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <span className="nav-user-name">{user.name}</span>
                    <span className="nav-user-indicator" title="Active"></span>
                  </div>
                  <button
                    type="button"
                    className="nav-logout-btn"
                    onClick={() => {
                      logout();
                      showToast("Signed out successfully.");
                    }}
                    title="Sign out of account"
                    id="page-layout-logout-btn"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <button className="login-link nav-desktop-auth" onClick={() => openAuth("login")} id="nav-login-btn">
                    Login
                  </button>
                  <button className="btn-primary nav-desktop-auth" onClick={() => openAuth("signup")} id="nav-get-started-btn">
                    Get Started
                  </button>
                </>
              )}
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="mobile-nav-drawer">
              <div className="mobile-nav-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={`mobile-nav-item${activeNav === link.id ? " active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/blog" className={`mobile-nav-item${pathname === "/blog" ? " active" : ""}`} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                <Link href="/how-it-works" className={`mobile-nav-item${pathname === "/how-it-works" ? " active" : ""}`} onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                <Link href="/about" className={`mobile-nav-item${pathname === "/about" ? " active" : ""}`} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                <Link href="/contact" className={`mobile-nav-item${pathname === "/contact" ? " active" : ""}`} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              </div>
              <div className="mobile-nav-auth-section">
                {user ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
                    <div className="nav-user-badge" style={{ width: "fit-content" }} title={user.email}>
                      <span className="nav-user-avatar" aria-hidden="true">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <span className="nav-user-name">{user.name}</span>
                      <span className="nav-user-indicator" title="Active"></span>
                    </div>
                    <button
                      type="button"
                      className="nav-logout-btn"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                        showToast("Signed out successfully.");
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="mobile-btn-login"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuth("login");
                      }}
                      id="mobile-nav-login-btn"
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className="btn-primary mobile-btn-signup"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuth("signup");
                      }}
                      id="mobile-nav-get-started-btn"
                    >
                      Get Started
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className={noContainer ? undefined : "container"} style={{ paddingBottom: noContainer ? 0 : '4rem', minHeight: 'calc(100vh - 400px)' }}>
        {children}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={closeAuth}
        onSuccess={(email) => {
          closeAuth();
          showToast(`Welcome! You are signed in as ${email}`);
        }}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-notice" role="status">
          <span>⚡</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}


