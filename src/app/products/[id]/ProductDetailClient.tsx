"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ProductItem, getSimilarProducts } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { isWishlisted, toggleWishlist, WISHLIST_EVENT_NAME } from "@/utils/wishlist";
import { createContactInquiry, upsertVendorInquiry } from "@/utils/vendorInquiries";
import "./product-detail.css";

interface ProductDetailClientProps {
  product: ProductItem;
}

function subscribeToWishlist(onStoreChange: () => void): () => void {
  window.addEventListener(WISHLIST_EVENT_NAME, onStoreChange);
  return () => window.removeEventListener(WISHLIST_EVENT_NAME, onStoreChange);
}

export default function ProductDetailClient({ product: initialProduct }: ProductDetailClientProps) {
  const router = useRouter();
  const { user, openAuth } = useAuth();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [portalRoot] = useState<HTMLElement | null>(() => typeof document === "undefined" ? null : document.body);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const product = initialProduct;
  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const isSaved = useSyncExternalStore(subscribeToWishlist, () => isWishlisted(product.id), () => false);

  useEffect(() => {
    document.body.classList.add("product-detail-page-active");

    return () => {
      document.body.classList.remove("product-detail-page-active");
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [product.id]);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    setToastMsg(msg);

    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      openAuth("signup", "buyer");
      showToast("Please sign in or create an account to save tools to your Buyer Wishlist.");
      return;
    }
    const result = toggleWishlist(product.id);
    if (result.wishlisted) {
      showToast(`Saved "${product.name}" to your Buyer Wishlist!`);
    } else {
      showToast(`Removed "${product.name}" from your Wishlist.`);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactModalOpen(false);

    try {
      const existing = localStorage.getItem("saas_mrkt_applied_products");
      let list = existing ? JSON.parse(existing) : [];
      if (!Array.isArray(list)) list = [];

      const alreadyExists = list.some((item: { id: string; name: string }) => item.id === product.id || item.name === product.name);
      if (!alreadyExists) {
        list.unshift({
          id: `app-${Date.now()}`,
          name: product.name,
          category: product.category,
          price: product.price !== undefined ? `$${product.price} / mo` : "$99 / mo",
          rating: typeof product.rating === "number" ? product.rating : 4.8,
          desc: product.description || product.tagline || "",
          url: `/products/${product.id}`,
          iconBg: product.brandColor || "#4F46E5",
          iconLetter: product.brandLetter || product.name.slice(0, 2).toUpperCase(),
          applicationDate: "Just now",
          inquiryNote: contactForm.message || "Buyer contact application submitted",
          vendor: {
            name: product.sellerName ? `${product.sellerName} Org` : `${product.name} Technologies`,
            contactPerson: product.sellerName || "Lead Representative",
            email: "vendor@saas-mrkt.dev",
            phone: "+1 (415) 890-2341",
            whatsappNumber: "14158902341",
            approvalStatus: "pending",
            statusNote: "Application submitted. Awaiting vendor approval.",
          },
        });
        localStorage.setItem("saas_mrkt_applied_products", JSON.stringify(list));
      }
    } catch {
      // Ignore
    }

    try {
      upsertVendorInquiry(createContactInquiry(product, {
        buyerName: contactForm.name || user?.name || "",
        buyerEmail: contactForm.email || user?.email || "",
        message: contactForm.message,
      }));
    } catch {
      // Ignore
    }

    showToast(`Inquiry sent to ${product.sellerName || "the vendor"}! The seller can review it in their Vendor Portal, and you can track it in your profile.`);
    setContactForm({ name: "", email: "", message: "" });
  };

  const similarProducts = getSimilarProducts(product);

  // Fallback defaults for rich specs
  const listedDate = product.listedDate || "12 Sep 2024";
  const pricingModel = product.pricingModel || (product.price ? `$${product.price}/mo` : "Subscription");
  const targetAudience = product.targetAudience || "Small & Medium Businesses";
  const hqLocation = product.hqLocation || "United States";
  const sellerName = product.sellerName || "Alex Carter";
  const sellerInitials = product.sellerInitials || "AC";
  const sellerMemberSince = product.sellerMemberSince || "Member since Jan 2023";
  const sellerVerified = product.sellerVerified !== undefined ? product.sellerVerified : true;
  const aboutText =
    product.aboutText ||
    `${product.name} is an all-in-one platform designed to help modern growing teams streamline workflows, automate repetitive tasks, close deals, and deliver exceptional experiences — all in one connected workspace.`;

  const keyFeatures =
    product.keyFeaturesList && product.keyFeaturesList.length > 0
      ? product.keyFeaturesList
      : product.features.slice(0, 6).map((feature, index) => {
          const [title, ...details] = feature.split(":");
          const colors = ["#2563EB", "#7C3AED", "#059669", "#EA580C", "#DB2777", "#CA8A04"];
          const icons = ["users", "automation", "pipeline", "analytics", "mail", "support"];
          return {
            title: title.trim(),
            description: details.join(":").trim() || `Use ${title.trim().toLowerCase()} to keep your team's work clear and efficient.`,
            icon: icons[index % icons.length],
            iconBg: `${colors[index % colors.length]}14`,
            iconColor: colors[index % colors.length],
          };
        });

  const techStackList = product.techStack || ["Next.js", "React", "Node.js", "AWS"];

  // Helper icon renderer
  const renderFeatureIcon = (type: string, color: string) => {
    switch (type) {
      case "users":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "mail":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );
      case "pipeline":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        );
      case "automation":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="m4.93 4.93 2.83 2.83" />
            <path d="m16.24 16.24 2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
      case "analytics":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        );
      case "support":
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        );
    }
  };

  return (
    <PageLayout activeNav="products">
      <div className="product-detail-page-container">
        {/* Breadcrumb Navigation */}
        <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="crumb-link">
            Home
          </Link>
          <span className="crumb-separator">&gt;</span>
          <Link href="/products" className="crumb-link">
            Products
          </Link>
          <span className="crumb-separator">&gt;</span>
          <span className="crumb-current">{product.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="detail-hero-card detail-hero-card-premium">
          <div className="detail-hero-grid">
            {/* Left Column: Product Info */}
            <div className="detail-hero-left">
              <div className="detail-trust-badge"><span aria-hidden="true">✓</span> Verified marketplace listing</div>
              {/* Product Logo & Brand Group */}
              <div className="detail-brand-header">
                <div
                  className="detail-hero-logo"
                  style={{
                    background:
                      product.logo
                        ? "transparent"
                        : `linear-gradient(135deg, ${product.brandColor} 0%, #4338CA 100%)`,
                  }}
                >
                  {product.logo ? (
                    <Image
                      src={product.logo}
                      alt={`${product.name} logo`}
                      width={62}
                      height={62}
                      className="detail-logo-img"
                      unoptimized={product.logo.startsWith("data:")}
                    />
                  ) : (
                    <span className="detail-logo-fallback">{product.brandLetter}</span>
                  )}
                </div>
                <div className="detail-title-wrap">
                  <h1 className="detail-hero-title">{product.name}</h1>
                  <p className="detail-hero-tagline">
                    {product.tagline || product.description}
                  </p>
                </div>
              </div>

              {/* Basic Idea of the Project */}
              <p className="detail-hero-idea">{aboutText}</p>

              {/* Tags Row */}
              <div className="detail-tags-row">
                {(product.tags && product.tags.length > 0
                  ? product.tags
                  : [product.category, "SaaS", "Automation"]
                ).map((tag, idx) => (
                  <span key={idx} className="detail-tag-badge">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Seller Information Box */}
              <div className="detail-seller-box">
                <div className="detail-seller-avatar">{sellerInitials}</div>
                <div className="detail-seller-info">
                  <div className="detail-seller-name-row">
                    <span className="detail-seller-label">Listed by</span>
                    <strong className="detail-seller-name">{sellerName}</strong>
                    {sellerVerified && (
                      <span className="detail-verified-badge">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Verified Seller
                      </span>
                    )}
                  </div>
                  <span className="detail-seller-date">{sellerMemberSince}</span>
                </div>
              </div>

              {/* Product Price & Rating */}
              <div className="detail-hero-price-row">
                <span className="detail-price-kicker">Starting at</span>
                <span className="detail-hero-price-amount">
                  {product.price === 0 ? "Free" : `$${product.price !== undefined ? product.price : 29}`}
                </span>
                {product.price !== 0 && <span className="detail-price-period">/{product.period}</span>}
                <div className="detail-rating-row">
                  <span className="detail-stars">★★★★★</span>
                  <span className="detail-rating-score">
                    {typeof product.rating === "number" ? product.rating.toFixed(1) : product.rating}
                  </span>
                  <span className="detail-rating-count">
                    ({product.reviewCount >= 1000
                      ? `${(product.reviewCount / 1000).toFixed(1)}K`
                      : product.reviewCount}{" "}
                    reviews)
                  </span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="detail-actions-row">
                <Link href={`/products/${product.id}/buy`} className="detail-btn-primary">
                  Start with {product.name} <span aria-hidden="true">→</span>
                </Link>
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`detail-btn-wishlist ${isSaved ? "is-saved" : ""}`}
                  title={isSaved ? "Saved in your Buyer Wishlist" : "Save to Buyer Wishlist"}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={isSaved ? "#5E4BEE" : "none"}
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>{isSaved ? "Saved to Wishlist" : "Save"}</span>
                </button>

                <button
                  type="button"
                  className="detail-btn-secondary"
                  onClick={() => {
                    if (!user) {
                      openAuth("signup", "buyer");
                      showToast("Please sign up or log in as a buyer to contact the vendor.");
                      return;
                    }
                    setContactModalOpen(true);
                  }}
                >
                  Contact Seller
                </button>

                <Link
                  href={`/products/${product.id}/details`}
                  className="detail-btn-lock"
                  id="detail-see-more-btn"
                  style={{ textDecoration: "none" }}
                >
                  {!user ? (
                    <>
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
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>Unlock More Details 🔒</span>
                    </>
                  ) : (
                    <>
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
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span>See More Detail</span>
                    </>
                  )}
                </Link>
              </div>
              <div className="detail-purchase-note"><span aria-hidden="true">◈</span><span><strong>Marketplace buyer protection</strong> · Secure checkout and a 30-day escrow window.</span></div>
            </div>

            {/* Right Column: Product gallery */}
            <div className="detail-hero-right">
              <div className="detail-gallery">
                <button className="detail-gallery-main" type="button" onClick={() => setGalleryOpen(true)} aria-label={`Open ${product.name} image ${activeGalleryIndex + 1} of ${galleryImages.length}`}>
                  <Image
                    src={galleryImages[activeGalleryIndex]}
                    alt={`${product.name} product preview ${activeGalleryIndex + 1}`}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 56vw"
                    className="detail-preview-image"
                    unoptimized={galleryImages[activeGalleryIndex].startsWith("data:")}
                  />
                  <span className="detail-gallery-label">Product preview</span>
                  <span className="detail-gallery-count">{activeGalleryIndex + 1} / {galleryImages.length}</span>
                  <span className="detail-gallery-expand" aria-hidden="true">↗</span>
                </button>
                {galleryImages.length > 1 && (
                  <div className="detail-gallery-thumbs" aria-label="Product screenshots">
                    {galleryImages.map((image, index) => (
                      <button className={index === activeGalleryIndex ? "is-active" : ""} key={image} onClick={() => setActiveGalleryIndex(index)} type="button" aria-label={`Show screenshot ${index + 1}`}>
                        <Image src={image} alt="" fill sizes="100px" unoptimized={image.startsWith("data:")} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Ribbon (5 horizontal cards with SVG icons) */}
        <div className="detail-stats-ribbon">
          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="detail-stat-text">
              <span className="detail-stat-label">Listed on</span>
              <strong className="detail-stat-value">{listedDate}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div className="detail-stat-text">
              <span className="detail-stat-label">Pricing Model</span>
              <strong className="detail-stat-value">{pricingModel}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#D97706" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
            </div>
            <div className="detail-stat-text">
              <span className="detail-stat-label">Category</span>
              <strong className="detail-stat-value">{product.category}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#E11D48" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="detail-stat-text">
              <span className="detail-stat-label">Target Audience</span>
              <strong className="detail-stat-value">{targetAudience}</strong>
            </div>
          </div>

          <div className="detail-stat-card">
            <div className="detail-stat-icon-wrap" style={{ backgroundColor: "rgba(14, 165, 233, 0.1)", color: "#0284C7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="detail-stat-text">
              <span className="detail-stat-label">HQ Location</span>
              <strong className="detail-stat-value">{hqLocation}</strong>
            </div>
          </div>
        </div>

        {/* Section: Product Information */}
        <section className="detail-section" id="product-information">
          <div className="detail-section-header-left">
            <h2 className="detail-section-title">Product Information</h2>
            <p className="detail-section-subtitle">
              Key details about this SaaS product.
            </p>
          </div>

          <div className="detail-info-card">
            <div className="detail-info-grid">
              {/* Left Specs Column */}
              <div className="detail-info-col">
                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Pricing Model</span>
                    <strong className="detail-info-val">{pricingModel}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#D97706" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                      <path d="M7 7h.01" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Category</span>
                    <strong className="detail-info-val">{product.category}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Target Audience</span>
                    <strong className="detail-info-val">{targetAudience}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(100, 116, 139, 0.1)", color: "#475569" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Business Model</span>
                    <strong className="detail-info-val">SaaS</strong>
                  </div>
                </div>
              </div>

              {/* Right Specs Column */}
              <div className="detail-info-col">
                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Launch Date</span>
                    <strong className="detail-info-val">{product.launchDate || "2022"}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Annual Revenue</span>
                    <strong className="detail-info-val">$148,500 / yr</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#7C3AED" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                      <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
                      <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Team Size</span>
                    <strong className="detail-info-val">{product.teamSize || "5 - 10"}</strong>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <div className="detail-info-text">
                    <span className="detail-info-label">Tech Stack</span>
                    <div className="detail-tech-badges">
                      {techStackList.map((tech, idx) => (
                        <span key={idx} className="detail-tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Key Features */}
        <section className="detail-section">
          <div className="detail-section-header-center">
            <h2 className="detail-section-title">Key Features</h2>
            <p className="detail-section-subtitle">
              Powerful features to help you manage and grow your business.
            </p>
          </div>

          <div className="detail-features-grid">
            {keyFeatures.map((feat, idx) => (
              <div key={idx} className="detail-feature-card">
                <div
                  className="detail-feature-icon-box"
                  style={{ backgroundColor: feat.iconBg || "rgba(99, 102, 241, 0.12)" }}
                >
                  {renderFeatureIcon(feat.icon, feat.iconColor || "#6366F1")}
                </div>
                <h3 className="detail-feature-title">{feat.title}</h3>
                <p className="detail-feature-desc">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Similar SaaS Products */}
        <section className="detail-section">
          <div className="detail-section-header-center">
            <h2 className="detail-section-title">Similar SaaS Products</h2>
            <p className="detail-section-subtitle">
              Explore other popular tools you might be interested in.
            </p>
          </div>

          <div className="detail-similar-grid">
            {similarProducts.map((sim) => (
              <div
                key={sim.id}
                className="product-card saas-discovery-card"
                onClick={() => router.push(`/products/${sim.id}`)}
              >
                {/* Product Preview Image Banner */}
                <div className="discovery-card-image-wrap">
                  <Image
                    src={sim.image || "/images/taskflow.jpg"}
                    alt={`${sim.name} dashboard preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                    className="discovery-card-img"
                  />
                </div>

                {/* Card Body */}
                <div className="discovery-card-body">
                  {/* Header Row: Logo & Name on Left, Status Badge on Right */}
                  <div className="discovery-card-header-row">
                    <div className="discovery-card-brand-group">
                      {sim.logo ? (
                        <div className="discovery-card-logo-wrap">
                          <Image
                            src={sim.logo}
                            alt={`${sim.name} logo`}
                            width={30}
                            height={30}
                            className="discovery-card-logo-img"
                          />
                        </div>
                      ) : (
                        <div
                          className="discovery-card-logo"
                          style={{ backgroundColor: sim.brandColor || "#6366F1" }}
                        >
                          {sim.brandLetter || sim.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="discovery-card-title">{sim.name}</h3>
                    </div>

                    <span
                      className={`discovery-top-badge ${
                        sim.topBadge === "Trending"
                          ? "badge-trending"
                          : sim.topBadge === "Popular"
                          ? "badge-popular"
                          : sim.topBadge === "Verified"
                          ? "badge-verified"
                          : "badge-top-rated"
                      }`}
                    >
                      {sim.topBadge || "Top Rated"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="discovery-card-desc">{sim.description}</p>

                  {/* Dedicated Badges Row: Attractive pills */}
                  <div className="discovery-badges-row">
                    {(sim.tags && sim.tags.length > 0 ? sim.tags : [sim.category]).slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="discovery-tag-pill"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price & Rating Row */}
                  <div className="discovery-meta-row">
                    <div className="discovery-price-group">
                      <span className="discovery-price-amount">${sim.price}</span>
                    </div>

                    <div className="discovery-rating-inline">
                      <span className="discovery-stars">★</span>
                      <span className="discovery-rating-score">
                        {typeof sim.rating === "number" ? sim.rating.toFixed(1) : sim.rating}
                      </span>
                      <span className="discovery-rating-count">
                        ({sim.reviewCount >= 1000
                          ? `${(sim.reviewCount / 1000).toFixed(1)}K`
                          : sim.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="button"
                    className="discovery-btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${sim.id}`);
                    }}
                  >
                    View Basic Info
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cosmic CTA Banner */}
          <div className="detail-cosmic-cta">
            <div className="detail-cosmic-content">
              <h3 className="detail-cosmic-title">Ready to accelerate your workflow with {product.name}?</h3>
              <p className="detail-cosmic-desc">
                Join thousands of businesses scaling faster with verified software and 30-day buyer protection on SaaS MRKT.
              </p>
              <div className="detail-cosmic-actions">
                <Link href={`/products/${product.id}/buy`} className="detail-cosmic-btn-primary">
                  Get Started with {product.name} →
                </Link>
                <Link href="/products" className="detail-cosmic-btn-secondary">
                  Explore All 50+ Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {portalRoot && galleryOpen && createPortal(
        <div className="detail-lightbox" role="dialog" aria-modal="true" aria-label={`${product.name} product gallery`} onClick={() => setGalleryOpen(false)}>
          <button className="detail-lightbox-close" type="button" onClick={() => setGalleryOpen(false)} aria-label="Close gallery">×</button>
          <div className="detail-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <div className="detail-lightbox-image">
              <Image src={galleryImages[activeGalleryIndex]} alt={`${product.name} screenshot ${activeGalleryIndex + 1}`} fill sizes="95vw" unoptimized={galleryImages[activeGalleryIndex].startsWith("data:")} />
            </div>
            {galleryImages.length > 1 && <div className="detail-lightbox-controls"><button type="button" onClick={() => setActiveGalleryIndex((activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length)}>← Previous</button><span>{activeGalleryIndex + 1} of {galleryImages.length}</span><button type="button" onClick={() => setActiveGalleryIndex((activeGalleryIndex + 1) % galleryImages.length)}>Next →</button></div>}
          </div>
        </div>,
        portalRoot
      )}

      {/* Contact Seller Modal */}
      {contactModalOpen && (
        <div className="detail-modal-overlay" onClick={() => setContactModalOpen(false)}>
          <div
            className="detail-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-modal-header">
              <h3>Contact Seller ({sellerName})</h3>
              <button
                type="button"
                className="detail-modal-close"
                onClick={() => setContactModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className="detail-modal-desc">
              Have questions or want to purchase <strong>{product.name}</strong>? Chat with the verified seller on WhatsApp or send an inquiry.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <a
                href={`https://wa.me/14158902341?text=${encodeURIComponent(
                  `Hi ${sellerName}, I am interested in purchasing ${product.name} on SaaS MRKT and would like to connect on WhatsApp.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat with Seller on WhatsApp</span>
              </a>
              <div style={{ textAlign: "center", margin: "0.85rem 0", color: "#94A3B8", fontSize: "0.8rem" }}>
                <span>— or submit inquiry below —</span>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="detail-modal-form">
              <div className="detail-form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>

              <div className="detail-form-group">
                <label>Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>

              <div className="detail-form-group">
                <label>Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder={`Hi ${sellerName}, I am interested in ${product.name} and would like to learn more...`}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <div className="detail-modal-actions">
                <button
                  type="button"
                  className="detail-modal-btn-cancel"
                  onClick={() => setContactModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="detail-modal-btn-send">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Toast Notification Popup: Portaled to document.body for zero clipping */}
      {portalRoot &&
        toastMsg &&
        createPortal(
          <div
            className="toast-notice toast-notice--lock"
            role="status"
            aria-live="polite"
          >
            <span className="toast-notice-lock-badge">🔒</span>
            <span>{toastMsg}</span>
          </div>,
          portalRoot
        )}
    </PageLayout>
  );
}
