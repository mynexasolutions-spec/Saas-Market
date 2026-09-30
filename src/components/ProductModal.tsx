"use client";

import React from "react";
import Image from "next/image";
import { ProductItem } from "./FeaturedProducts";

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onSelectPlan: (product: ProductItem) => void;
}

export default function ProductModal({
  product,
  onClose,
  onSelectPlan,
}: ProductModalProps) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
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

        {/* Product Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: product.brandColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.3rem",
            }}
          >
            {product.brandLetter}
          </div>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)" }}>
              {product.name}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
              <span style={{ fontSize: "0.825rem", color: "var(--primary)", fontWeight: 600 }}>
                {product.category}
              </span>
              <span style={{ color: "var(--slate-300)" }}>•</span>
              <span style={{ fontSize: "0.825rem", color: "var(--slate-500)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span style={{ color: "#F59E0B" }}>★</span> {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Big Preview Frame */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "220px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid var(--slate-200)",
            marginBottom: "1.25rem",
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="500px"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Description */}
        <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          {product.description}
        </p>

        {/* Key Features */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--slate-900)", marginBottom: "0.6rem" }}>
            Included Features
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {product.features.map((feat, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--slate-600)" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--slate-200)",
          }}
        >
          <div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--slate-900)" }}>
              ${product.price}
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--slate-500)" }}>
                /{product.period}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600 }}>
              14-day free trial available
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onSelectPlan(product)}
            >
              Start Free Trial →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
