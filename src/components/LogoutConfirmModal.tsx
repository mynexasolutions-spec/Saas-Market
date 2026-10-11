"use client";

import React, { useEffect } from "react";
import { User } from "@/context/AuthContext";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  user: User | null;
  onCancel: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  user,
  onCancel,
  onConfirm,
  isLoggingOut = false,
}: LogoutConfirmModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoggingOut) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, isLoggingOut]);

  if (!isOpen) return null;

  const role = user?.role || "buyer";
  const roleLabel =
    role === "admin"
      ? "Platform Administrator"
      : role === "vendor"
      ? "SaaS Vendor"
      : "Software Buyer";

  const initials =
    user?.initials ||
    (user?.name ? user.name.slice(0, 2).toUpperCase() : "US");

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-desc"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.68)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "1.25rem",
        animation: "modalFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={() => {
        if (!isLoggingOut) onCancel();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2.25rem 2rem 2rem",
          textAlign: "center",
          boxShadow:
            "0 25px 50px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          position: "relative",
          animation: "modalFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoggingOut}
          aria-label="Cancel logout"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#F1F5F9",
            color: "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isLoggingOut ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <svg
            width="17"
            height="17"
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

        {/* Top Logout Badge Icon */}
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FEE2E2 0%, #FECDD3 100%)",
            color: "#E11D48",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            boxShadow: "0 10px 25px rgba(225, 29, 72, 0.18)",
            border: "1px solid #FDA4AF",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        {/* Modal Title */}
        <h3
          id="logout-modal-title"
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Log Out of SaaS MRKT?
        </h3>

        {/* Modal Subtitle */}
        <p
          id="logout-modal-desc"
          style={{
            fontSize: "0.92rem",
            color: "#64748B",
            lineHeight: 1.55,
            marginBottom: "1.25rem",
          }}
        >
          Are you sure you want to end your current session? You can sign back in anytime to continue browsing and managing tools.
        </p>

        {/* Current User Card */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "14px",
              padding: "0.85rem 1rem",
              marginBottom: "1.5rem",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background:
                  role === "admin"
                    ? "linear-gradient(135deg, #D97706 0%, #B45309 100%)"
                    : role === "vendor"
                    ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                    : "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.15rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {role === "admin" ? "Admin" : user.name}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "6px",
                    background:
                      role === "admin"
                        ? "#FEF3C7"
                        : role === "vendor"
                        ? "#D1FAE5"
                        : "#EEF2FF",
                    color:
                      role === "admin"
                        ? "#92400E"
                        : role === "vendor"
                        ? "#065F46"
                        : "#4338CA",
                  }}
                >
                  {roleLabel}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#64748B",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            style={{
              padding: "0.85rem 1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              color: "#334155",
              fontSize: "0.92rem",
              fontWeight: 600,
              cursor: isLoggingOut ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Stay Signed In
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            id="confirm-logout-btn"
            style={{
              padding: "0.85rem 1.25rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              color: "#ffffff",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: isLoggingOut ? "wait" : "pointer",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.15s ease",
              opacity: isLoggingOut ? 0.8 : 1,
            }}
          >
            {isLoggingOut ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
                <span>Signing Out...</span>
              </>
            ) : (
              <>
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Yes, Log Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
