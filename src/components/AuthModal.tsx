"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

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
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("alex@company.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Alex Morgan");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setIsSubmitting(false);
      // Ensure default values are populated if fields were cleared
      setEmail((prev) => prev || "alex@company.com");
      setName((prev) => prev || "Alex Morgan");
      setPassword((prev) => prev || "••••••••");
    }
  }, [isOpen, initialMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const performAuth = (authEmail: string, authName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === "signup") {
        signup(authEmail, authName);
      } else {
        login(authEmail, authName);
      }
      setIsSubmitting(false);
      onClose();
      onSuccess(authEmail);
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmail = email.trim() || "alex@company.com";
    const effectiveName = name.trim() || "Alex Morgan";
    performAuth(effectiveEmail, effectiveName);
  };

  const handleInstantDemoLogin = () => {
    performAuth("alex@company.com", "Alex Morgan");
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "440px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          animation: "modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#F1F5F9",
            color: "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.85rem",
              boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {mode === "login" ? "Welcome Back" : "Create SaaS Account"}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#64748B",
              marginTop: "0.35rem",
              marginBottom: 0,
            }}
          >
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
            background: "#F1F5F9",
            padding: "4px",
            borderRadius: "9999px",
            marginBottom: "1.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              padding: "0.5rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor: mode === "login" ? "#ffffff" : "transparent",
              color: mode === "login" ? "#0F172A" : "#64748B",
              boxShadow: mode === "login" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              padding: "0.5rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor: mode === "signup" ? "#ffffff" : "transparent",
              color: mode === "signup" ? "#0F172A" : "#64748B",
              boxShadow: mode === "signup" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Demo Mode Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.65rem 0.85rem",
            backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: "0.75rem",
            marginBottom: "1rem",
            fontSize: "0.825rem",
            color: "#3730A3",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span>⚡</span>
            <span>
              <strong>Demo mode:</strong> Alex Morgan credentials loaded
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setName("Alex Morgan");
              setEmail("alex@company.com");
              setPassword("••••••••");
            }}
            style={{
              background: "#4F46E5",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.4rem",
              padding: "0.25rem 0.6rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}
        >
          {mode === "signup" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "0.35rem",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.95rem",
                  border: "1px solid #CBD5E1",
                  borderRadius: "0.65rem",
                  fontSize: "0.925rem",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#F8FAFC",
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.825rem",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "0.35rem",
              }}
            >
              Work Email
            </label>
            <input
              type="text"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.95rem",
                border: "1px solid #CBD5E1",
                borderRadius: "0.65rem",
                fontSize: "0.925rem",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#F8FAFC",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.825rem",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "0.35rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.95rem",
                border: "1px solid #CBD5E1",
                borderRadius: "0.65rem",
                fontSize: "0.925rem",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#F8FAFC",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              padding: "0.85rem",
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: isSubmitting ? 0.8 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <svg
                  style={{ animation: "spin 1s linear infinite" }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="30 60"
                  />
                </svg>
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </>
            ) : mode === "login" ? (
              "Sign In to SaaS MRKT"
            ) : (
              "Create Account"
            )}
          </button>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.7rem",
              background: "#F8FAFC",
              color: "#475569",
              border: "1px dashed #CBD5E1",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.15s ease",
            }}
          >
            <span>⚡</span>
            <span>Instant Demo Sign In (1-Click)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
