"use client";

import React, { useEffect } from "react";

export interface AuthPopupData {
  isOpen: boolean;
  type: "login" | "signup" | "logout";
  title: string;
  subtitle: string;
  email?: string;
  name?: string;
}

interface AuthSuccessPopupProps {
  data: AuthPopupData | null;
  onClose: () => void;
}

export default function AuthSuccessPopup({ data, onClose }: AuthSuccessPopupProps) {
  useEffect(() => {
    if (!data?.isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [data?.isOpen, onClose]);

  if (!data || !data.isOpen) return null;

  const isLogout = data.type === "logout";

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "1rem",
        animation: "modalFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2.25rem 2rem 2rem",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.06)",
          position: "relative",
          animation: "modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup message"
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

        {/* Animated Badge Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: isLogout
              ? "linear-gradient(135deg, #64748B 0%, #475569 100%)"
              : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            boxShadow: isLogout
              ? "0 10px 25px rgba(100, 116, 139, 0.35)"
              : "0 12px 28px rgba(16, 185, 129, 0.4)",
          }}
        >
          {isLogout ? (
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          ) : (
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        {/* Status Pill */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              backgroundColor: isLogout ? "#F1F5F9" : "#ECFDF5",
              color: isLogout ? "#475569" : "#065F46",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: isLogout ? "#64748B" : "#10B981",
              }}
            />
            {isLogout
              ? "Signed Out"
              : data.type === "signup"
              ? "New Account Verified"
              : "Authentication Success"}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.65rem",
            fontWeight: 800,
            color: "#0F172A",
            margin: "0 0 0.5rem",
            letterSpacing: "-0.025em",
          }}
        >
          {data.title}
        </h2>

        {/* Subtitle / User details */}
        <p
          style={{
            fontSize: "0.95rem",
            color: "#475569",
            margin: "0 0 1.25rem",
            lineHeight: 1.5,
          }}
        >
          {data.subtitle}
        </p>

        {data.email && (
          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "0.75rem",
              padding: "0.65rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              color: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: "#64748B" }}>Signed in as:</span>
            <strong style={{ color: "#0F172A" }}>{data.email}</strong>
          </div>
        )}

        {/* Continue Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: isLogout
              ? "#0F172A"
              : "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.75rem",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            boxShadow: isLogout
              ? "0 4px 12px rgba(15, 23, 42, 0.25)"
              : "0 4px 14px rgba(79, 70, 229, 0.35)",
            transition: "all 0.15s ease",
          }}
        >
          {isLogout ? "Close" : "Awesome, Continue to Marketplace"}
        </button>
      </div>
    </div>
  );
}
