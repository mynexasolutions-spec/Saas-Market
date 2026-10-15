"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/UserNavDropdown";
import SpotlightSearchModal from "@/components/SpotlightSearchModal";

interface PageLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
  noContainer?: boolean;
}

export default function PageLayout({ children, activeNav, noContainer }: PageLayoutProps) {
  const pathname = usePathname();
  const { user, requestLogout, isAuthOpen, authMode, openAuth, closeAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut listener
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

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMobileMenuOpen(false);
      setResourcesOpen(false);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const navLinks = [
    { href: "/products", label: "Products", id: "products" },
    { href: "/categories", label: "Categories", id: "categories" },
    { href: "/compare", label: "Compare", id: "compare" },
    { href: "/deals", label: "Deals", id: "deals" },
    ...(user && user.role === "buyer"
      ? [{ href: "/dashboard", label: "Dashboard", id: "dashboard" }]
      : [{ href: "/buyers", label: "For Buyers", id: "buyers" }]),
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
                    <Link href="/trust" className={`dropdown-item-rich${pathname === "/trust" ? " active-dropdown-item" : ""}`}>
                      <div className="dropdown-icon-box" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                      </div>
                      <div className="dropdown-text-box">
                        <div className="dropdown-title">Trust &amp; Escrow</div>
                        <div className="dropdown-desc">100% buyer protection guarantee</div>
                      </div>
                    </Link>
                    <Link href="/tools/saas-spend-calculator" className={`dropdown-item-rich${pathname === "/tools/saas-spend-calculator" ? " active-dropdown-item" : ""}`}>
                      <div className="dropdown-icon-box" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#2563EB" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="2" width="16" height="20" rx="2" />
                          <line x1="8" y1="6" x2="16" y2="6" />
                          <line x1="16" y1="14" x2="16" y2="18" />
                          <path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" />
                          <path d="M12 14h.01" /><path d="M8 14h.01" />
                          <path d="M12 18h.01" /><path d="M8 18h.01" />
                        </svg>
                      </div>
                      <div className="dropdown-text-box">
                        <div className="dropdown-title">Spend Calculator</div>
                        <div className="dropdown-desc">Audit wasted software spend</div>
                      </div>
                    </Link>
                    <Link href="/alternatives" className={`dropdown-item-rich${pathname === "/alternatives" ? " active-dropdown-item" : ""}`}>
                      <div className="dropdown-icon-box" style={{ background: "rgba(239, 68, 68, 0.12)", color: "#DC2626" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                      </div>
                      <div className="dropdown-text-box">
                        <div className="dropdown-title">Alternatives Directory</div>
                        <div className="dropdown-desc">Compare legacy tool replacements</div>
                      </div>
                    </Link>
                    <Link href="/badges" className={`dropdown-item-rich${pathname === "/badges" ? " active-dropdown-item" : ""}`}>
                      <div className="dropdown-icon-box" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#D97706" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                      </div>
                      <div className="dropdown-text-box">
                        <div className="dropdown-title">Vendor Badges</div>
                        <div className="dropdown-desc">Embed verified rating awards</div>
                      </div>
                    </Link>
                    <Link href="/submit-product" className={`dropdown-item-rich${pathname === "/submit-product" ? " active-dropdown-item" : ""}`}>
                      <div className="dropdown-icon-box" style={{ background: "rgba(139, 92, 246, 0.12)", color: "#7C3AED" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </div>
                      <div className="dropdown-text-box">
                        <div className="dropdown-title">Submit Product</div>
                        <div className="dropdown-desc">List your SaaS on the marketplace</div>
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
              {/* Spotlight Search Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSpotlightOpen(true)}
                className="nav-spotlight-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  background: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "0.45rem 0.75rem",
                  color: "#64748B",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title="Search software tools (Ctrl + K)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="nav-spotlight-label" style={{ display: "inline-block" }}>Search</span>
                <kbd style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "4px", padding: "1px 5px", fontSize: "0.68rem", fontWeight: 700, color: "#475569" }}>
                  ⌘K
                </kbd>
              </button>

              {user ? (
                <div className="nav-user-logged-wrap">
                  <UserNavDropdown
                    user={user}
                    onLogout={requestLogout}
                  />
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
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
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
            <div className="mobile-nav-drawer" id="mobile-navigation">
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
                <div style={{ height: "1px", background: "var(--slate-200)", margin: "0.5rem 0" }} />
                {user?.role === "admin" && (
                  <Link href="/admin" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>🛡️ Admin Console</Link>
                )}
                {user?.role === "vendor" && (
                  <Link href="/vendor" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>🏢 Vendor Portal</Link>
                )}
                {user?.role === "buyer" && (
                  <Link href="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    👤 My Profile
                  </Link>
                )}
              </div>
              <div className="mobile-nav-auth-section">
                {user ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
                    <Link
                      href={user.role === "admin" ? "/admin" : user.role === "vendor" ? "/vendor" : "/profile"}
                      className="nav-user-badge"
                      style={{ width: "fit-content", textDecoration: "none" }}
                      title={user.email}
                      onClick={() => setMobileMenuOpen(false)}
                    >
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
                      <span className="nav-user-name">{user.role === "admin" ? "Admin" : user.name}</span>
                      <span className="nav-user-indicator" title="Active"></span>
                    </Link>
                    <button
                      type="button"
                      className="nav-logout-btn"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        requestLogout();
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

      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
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


