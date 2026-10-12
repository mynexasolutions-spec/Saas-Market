"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "@/context/AuthContext";

interface UserNavDropdownProps {
  user: User;
  onLogout: () => void;
}

export default function UserNavDropdown({ user, onLogout }: UserNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const initials = user.initials || (user.name ? user.name.slice(0, 2).toUpperCase() : "AM");
  const role = user.role || "buyer";

  const roleLabel =
    role === "admin" ? "Admin" : role === "vendor" ? "Vendor" : "User";

  const roleTagClass =
    role === "admin"
      ? "dropdown-item-pill admin"
      : role === "vendor"
      ? "dropdown-item-pill"
      : "dropdown-item-pill user";

  return (
    <div className="nav-user-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className={`nav-user-badge${isOpen ? " active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account options"
        id="nav-user-badge-btn"
        title={`${user.name} (${user.email}) - ${roleLabel}`}
      >
        <span
          className="nav-user-avatar"
          style={{
            background:
              role === "admin"
                ? "linear-gradient(135deg, #D97706 0%, #B45309 100%)"
                : role === "vendor"
                ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                : "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            overflow: "hidden",
            padding: 0,
          }}
          aria-hidden="true"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : role === "admin" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          ) : role === "vendor" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </span>
        <span className="nav-user-name">{role === "admin" ? "Admin" : user.name}</span>
        <span className="nav-user-indicator" title="Active"></span>
        <svg
          className={`nav-user-chevron${isOpen ? " open" : ""}`}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="nav-profile-dropdown" role="menu" aria-label="Account Menu">
          {/* User Header */}
          <div className="dropdown-user-header">
            <div
              className="dropdown-user-avatar"
              style={{
                background:
                  role === "admin"
                    ? "linear-gradient(135deg, #D97706 0%, #B45309 100%)"
                    : role === "vendor"
                    ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                    : "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                overflow: "hidden",
                padding: 0,
              }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
            </div>
            <div className="dropdown-user-meta">
              <div className="dropdown-user-name-row">
                <span className="dropdown-user-name">{role === "admin" ? "Admin" : user.name}</span>
                <span className={roleTagClass}>{roleLabel}</span>
              </div>
              <span className="dropdown-user-email">{user.email}</span>
            </div>
          </div>

          <div className="dropdown-divider" />

          {/* Role-Specific Navigation Items */}
          <div className="dropdown-items-group">
            {/* If Admin */}
            {role === "admin" && (
              <Link
                href="/admin"
                className="dropdown-menu-item"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <div className="dropdown-item-icon admin-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="dropdown-item-content">
                  <div className="dropdown-item-title">Admin Console</div>
                  <div className="dropdown-item-desc">Platform governance &amp; moderation</div>
                </div>
              </Link>
            )}

            {/* If Vendor */}
            {role === "vendor" && (
              <Link
                href="/vendor"
                className="dropdown-menu-item"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <div className="dropdown-item-icon vendor-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div className="dropdown-item-content">
                  <div className="dropdown-item-title">Vendor Portal</div>
                  <div className="dropdown-item-desc">Manage SaaS listings, leads &amp; MRR</div>
                </div>
              </Link>
            )}

            {/* If Regular Buyer / User */}
            {role === "buyer" && (
              <>
                <Link
                  href="/dashboard"
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  <div className="dropdown-item-icon profile-icon" style={{ background: "rgba(94, 75, 238, 0.1)", color: "#5E4BEE" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  </div>
                  <div className="dropdown-item-content">
                    <div className="dropdown-item-title">Buyer Dashboard</div>
                    <div className="dropdown-item-desc">Saved wishlist, vendor quotes &amp; spend</div>
                  </div>
                </Link>

                <Link
                  href="/profile"
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  <div className="dropdown-item-icon profile-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="dropdown-item-content">
                    <div className="dropdown-item-title">Profile Settings</div>
                    <div className="dropdown-item-desc">Account credentials &amp; contact info</div>
                  </div>
                </Link>
              </>
            )}
          </div>

          <div className="dropdown-divider" />

          {/* Sign Out CTA */}
          <button
            type="button"
            className="dropdown-logout-action"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            role="menuitem"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
