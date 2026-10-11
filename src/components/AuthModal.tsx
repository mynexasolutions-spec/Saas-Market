"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";

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
  const router = useRouter();
  const { login, signup, authDefaultRole } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(authDefaultRole || "buyer");
  const [email, setEmail] = useState("alex@company.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Alex Morgan");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default credentials whenever selected role changes
  useEffect(() => {
    if (selectedRole === "buyer") {
      setEmail("alex@company.com");
      setName("Alex Morgan");
    } else if (selectedRole === "vendor") {
      setEmail("vendor@saasmrkt.com");
      setName("David Miller");
    } else if (selectedRole === "admin") {
      setEmail("admin@saasmrkt.com");
      setName("Admin");
    }
  }, [selectedRole]);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setIsSubmitting(false);
      if (authDefaultRole) {
        setSelectedRole(authDefaultRole);
      }
    }
  }, [isOpen, initialMode, authDefaultRole]);

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

  const performAuth = (authEmail: string, authName: string, role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === "signup") {
        signup(authEmail, authName, role);
      } else {
        login(authEmail, authName, role);
      }
      setIsSubmitting(false);
      onClose();
      onSuccess(authEmail);

      // Route to the respective dashboard
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "vendor") {
        router.push("/vendor");
      } else {
        router.push("/profile");
      }
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmail = email.trim() || (selectedRole === "admin" ? "admin@saasmrkt.com" : selectedRole === "vendor" ? "vendor@saasmrkt.com" : "alex@company.com");
    const effectiveName = name.trim() || (selectedRole === "admin" ? "Sarah Connor" : selectedRole === "vendor" ? "David Miller" : "Alex Morgan");
    performAuth(effectiveEmail, effectiveName, selectedRole);
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
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
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
          maxWidth: "460px",
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
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
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
              marginBottom: "0.75rem",
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
              fontSize: "1.45rem",
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {mode === "login" ? "Sign In to SaaS MRKT" : "Create Account"}
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#64748B",
              marginTop: "0.3rem",
              marginBottom: 0,
            }}
          >
            Select your account type to access your dedicated portal
          </p>
        </div>

        {/* Distinct Role Selector Tabs */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.45rem" }}>
            Select Account Role:
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "6px",
              background: "#F1F5F9",
              padding: "4px",
              borderRadius: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedRole("buyer")}
              style={{
                padding: "0.5rem 0.25rem",
                borderRadius: "9px",
                fontSize: "0.785rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedRole === "buyer" ? "#FFFFFF" : "transparent",
                color: selectedRole === "buyer" ? "#4F46E5" : "#64748B",
                boxShadow: selectedRole === "buyer" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <span>👤 User</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 500 }}>Buyer Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("vendor")}
              style={{
                padding: "0.5rem 0.25rem",
                borderRadius: "9px",
                fontSize: "0.785rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedRole === "vendor" ? "#FFFFFF" : "transparent",
                color: selectedRole === "vendor" ? "#059669" : "#64748B",
                boxShadow: selectedRole === "vendor" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <span>🏢 Vendor</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 500 }}>SaaS Seller</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              style={{
                padding: "0.5rem 0.25rem",
                borderRadius: "9px",
                fontSize: "0.785rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedRole === "admin" ? "#FFFFFF" : "transparent",
                color: selectedRole === "admin" ? "#D97706" : "#64748B",
                boxShadow: selectedRole === "admin" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <span>🛡️ Admin</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 500 }}>Platform Ops</span>
            </button>
          </div>
        </div>

        {/* Role Description Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 0.85rem",
            backgroundColor: selectedRole === "admin" ? "#FFFBEB" : selectedRole === "vendor" ? "#ECFDF5" : "#EEF2FF",
            border: `1px solid ${selectedRole === "admin" ? "#FDE68A" : selectedRole === "vendor" ? "#A7F3D0" : "#C7D2FE"}`,
            borderRadius: "0.65rem",
            marginBottom: "1rem",
            fontSize: "0.8rem",
            color: selectedRole === "admin" ? "#92400E" : selectedRole === "vendor" ? "#065F46" : "#3730A3",
          }}
        >
          <span>⚡</span>
          <span>
            {selectedRole === "admin"
              ? "Administrator login (admin@saasmrkt.com). Accesses Admin Console."
              : selectedRole === "vendor"
              ? "Vendor login (vendor@saasmrkt.com). Accesses Vendor Hub & Listings."
              : "User login (alex@company.com). Accesses Buyer Profile & Licenses."}
          </span>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#F1F5F9",
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
              padding: "0.45rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
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
                Full Name / Organization
              </label>
              <input
                type="text"
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
              Email Address ({selectedRole === "admin" ? "Admin" : selectedRole === "vendor" ? "Vendor" : "Work"})
            </label>
            <input
              type="email"
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
              required
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
              required
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
              background:
                selectedRole === "admin"
                  ? "linear-gradient(135deg, #D97706 0%, #B45309 100%)"
                  : selectedRole === "vendor"
                  ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                  : "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: isSubmitting ? 0.8 : 1,
            }}
          >
            {isSubmitting ? (
              <span>Signing in...</span>
            ) : mode === "login" ? (
              `Sign In as ${selectedRole === "admin" ? "Admin" : selectedRole === "vendor" ? "Vendor" : "User"}`
            ) : (
              `Create ${selectedRole === "admin" ? "Admin" : selectedRole === "vendor" ? "Vendor" : "User"} Account`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
