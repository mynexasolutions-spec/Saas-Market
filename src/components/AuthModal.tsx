"use client";

import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "login" | "signup";
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSuccess(email);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "var(--primary)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--slate-900)" }}>
            {mode === "login" ? "Welcome Back" : "Create SaaS Account"}
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--slate-500)", marginTop: "0.25rem" }}>
            {mode === "login"
              ? "Access your purchased products & saved tools"
              : "Discover and launch SaaS tools in minutes"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "var(--slate-100)",
            padding: "4px",
            borderRadius: "9999px",
            marginBottom: "1.25rem",
          }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              padding: "0.45rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              backgroundColor: mode === "login" ? "#fff" : "transparent",
              color: mode === "login" ? "var(--slate-900)" : "var(--slate-500)",
              boxShadow: mode === "login" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              padding: "0.45rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              backgroundColor: mode === "signup" ? "#fff" : "transparent",
              color: mode === "signup" ? "var(--slate-900)" : "var(--slate-500)",
              boxShadow: mode === "signup" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mode === "signup" && (
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--slate-700)", marginBottom: "0.35rem" }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  border: "1px solid var(--slate-200)",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--slate-700)", marginBottom: "0.35rem" }}>
              Work Email
            </label>
            <input
              type="email"
              required
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                border: "1px solid var(--slate-200)",
                borderRadius: "8px",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--slate-700)", marginBottom: "0.35rem" }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                border: "1px solid var(--slate-200)",
                borderRadius: "8px",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "0.5rem", padding: "0.75rem" }}
          >
            {mode === "login" ? "Sign In to SaaS Market" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
