"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { ProductItem } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

interface BuyProductClientProps {
  product: ProductItem;
}

export default function BuyProductClient({ product }: BuyProductClientProps) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "applepay">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "Alex Morgan",
    email: user?.email || "alex.morgan@company.com",
    company: "Acme Software Inc.",
    cardNumber: "4242 •••• •••• 4242",
    expiry: "12/28",
    cvc: "888",
    country: "United States",
    agreeTerms: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const priceVal = product.price || 19;
  const sellerName = product.sellerName || "Elena Rostova";
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const licenseKey = `SMRKT-${product.name.toUpperCase().slice(0, 4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <PageLayout activeNav="products" noContainer>
      <div className="checkout-page-wrapper">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="checkout-crumb-link">Home</Link>
            <span className="checkout-crumb-sep">/</span>
            <Link href="/products" className="checkout-crumb-link">Products</Link>
            <span className="checkout-crumb-sep">/</span>
            <Link href={`/products/${product.id}`} className="checkout-crumb-link">{product.name}</Link>
            <span className="checkout-crumb-sep">/</span>
            <span className="checkout-crumb-current">Checkout &amp; Purchase</span>
          </nav>

          {isSuccess ? (
            /* Purchase Success State */
            <div className="checkout-success-card">
              <div className="checkout-success-icon-wrap">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <span className="checkout-success-pill">ORDER CONFIRMED</span>
              <h1 className="checkout-success-title">Thank You For Your Purchase!</h1>
              <p className="checkout-success-desc">
                Your subscription to <strong>{product.name}</strong> is now active. Your software credentials, license key, and seller contact details have been sent to <strong>{formData.email}</strong>.
              </p>

              <div className="checkout-order-info-box">
                <div className="checkout-order-info-row">
                  <span className="checkout-info-label">Order Number</span>
                  <strong className="checkout-info-value">{orderNumber}</strong>
                </div>
                <div className="checkout-order-info-row">
                  <span className="checkout-info-label">Product</span>
                  <strong className="checkout-info-value">{product.name} ({product.category})</strong>
                </div>
                <div className="checkout-order-info-row">
                  <span className="checkout-info-label">Total Paid</span>
                  <strong className="checkout-info-value">${priceVal}.00 / {product.period || "mo"}</strong>
                </div>
                <div className="checkout-order-info-row">
                  <span className="checkout-info-label">Generated License Key</span>
                  <code className="checkout-license-code">{licenseKey}</code>
                </div>
              </div>

              <div className="checkout-success-actions">
                <Link href={`/products/${product.id}`} className="checkout-btn-back">
                  Back to {product.name}
                </Link>
                <Link href="/products" className="checkout-btn-explore">
                  Explore More SaaS
                </Link>
              </div>
            </div>
          ) : (
            /* Checkout Form & Order Summary */
            <div className="checkout-grid">
              {/* Left Column: Checkout Details */}
              <div className="checkout-form-column">
                <div className="checkout-card">
                  <h1 className="checkout-section-title">Complete Your Purchase</h1>
                  <p className="checkout-section-subtitle">
                    Enter your details to initiate your software subscription with verified escrow protection.
                  </p>

                  <form onSubmit={handleCheckout} className="checkout-form">
                    {/* Buyer Information */}
                    <div className="checkout-fieldset">
                      <h2 className="checkout-fieldset-title">
                        <span className="checkout-step-number">1</span>
                        Buyer Information
                      </h2>
                      <div className="checkout-fields-row">
                        <div className="checkout-field">
                          <label className="checkout-label" htmlFor="fullName">Full Name</label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="checkout-input"
                            required
                          />
                        </div>
                        <div className="checkout-field">
                          <label className="checkout-label" htmlFor="email">Work Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="checkout-input"
                            required
                          />
                        </div>
                      </div>
                      <div className="checkout-field">
                        <label className="checkout-label" htmlFor="company">Company / Organization</label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="checkout-input"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="checkout-fieldset">
                      <h2 className="checkout-fieldset-title">
                        <span className="checkout-step-number">2</span>
                        Payment Method
                      </h2>

                      <div className="checkout-payment-tabs">
                        <button
                          type="button"
                          className={`checkout-tab ${paymentMethod === "card" ? "checkout-tab--active" : ""}`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                          Credit / Debit Card
                        </button>
                        <button
                          type="button"
                          className={`checkout-tab ${paymentMethod === "paypal" ? "checkout-tab--active" : ""}`}
                          onClick={() => setPaymentMethod("paypal")}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13l2-10h6a4 4 0 0 1 0 8h-4l-1 5" />
                            <path d="M6 21l2-10h6a4 4 0 0 1 0 8h-4l-1 5" />
                          </svg>
                          PayPal
                        </button>
                        <button
                          type="button"
                          className={`checkout-tab ${paymentMethod === "applepay" ? "checkout-tab--active" : ""}`}
                          onClick={() => setPaymentMethod("applepay")}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2v-2h2zm0-4h-2V7h2z" />
                          </svg>
                          Digital Wallet
                        </button>
                      </div>

                      {paymentMethod === "card" && (
                        <div className="checkout-card-form">
                          <div className="checkout-field">
                            <label className="checkout-label" htmlFor="cardNumber">Card Number</label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              className="checkout-input"
                              placeholder="4242 •••• •••• 4242"
                              required
                            />
                          </div>

                          <div className="checkout-fields-row">
                            <div className="checkout-field">
                              <label className="checkout-label" htmlFor="expiry">Expiration Date</label>
                              <input
                                type="text"
                                id="expiry"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleInputChange}
                                className="checkout-input"
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            <div className="checkout-field">
                              <label className="checkout-label" htmlFor="cvc">Security Code (CVC)</label>
                              <input
                                type="text"
                                id="cvc"
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleInputChange}
                                className="checkout-input"
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "paypal" && (
                        <div className="checkout-alt-payment-note">
                          <p>You will be securely redirected to PayPal to complete your purchase after clicking place order.</p>
                        </div>
                      )}

                      {paymentMethod === "applepay" && (
                        <div className="checkout-alt-payment-note">
                          <p>Apple Pay / Google Pay authentication prompt will launch immediately upon submission.</p>
                        </div>
                      )}
                    </div>

                    {/* Guarantee & Terms */}
                    <div className="checkout-guarantee-box">
                      <div className="checkout-guarantee-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <strong>30-Day Money Back Guarantee</strong>
                        <p>If {product.name} does not meet your expectations, request a full refund within 30 days with no questions asked.</p>
                      </div>
                    </div>

                    <div className="checkout-terms-row">
                      <label className="checkout-checkbox-label">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          required
                        />
                        <span>I accept the SaaS MRKT Buyer Terms of Service and Escrow Purchase Agreement.</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="checkout-submit-btn"
                      id="checkout-confirm-btn"
                    >
                      {isProcessing ? (
                        <span className="checkout-spinner-label">Processing Secure Payment...</span>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Complete Secure Purchase • ${priceVal}.00
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="checkout-summary-column">
                <div className="checkout-summary-card">
                  <h2 className="checkout-summary-title">Order Summary</h2>

                  <div className="checkout-product-preview">
                    <div
                      className="checkout-product-logo"
                      style={{ backgroundColor: product.brandColor || "#6366F1" }}
                    >
                      {product.brandLetter || product.name.charAt(0)}
                    </div>
                    <div className="checkout-product-info">
                      <h3 className="checkout-product-name">{product.name}</h3>
                      <span className="checkout-product-category">{product.category}</span>
                      <div className="checkout-product-seller">
                        Listed by <strong>{sellerName}</strong>
                        {product.sellerVerified && <span className="checkout-verified-badge">✓ Verified</span>}
                      </div>
                    </div>
                  </div>

                  <div className="checkout-line-items">
                    <div className="checkout-line-item">
                      <span>{product.name} ({product.pricingModel || "Subscription"})</span>
                      <strong>${priceVal}.00</strong>
                    </div>
                    <div className="checkout-line-item">
                      <span>Marketplace Buyer Protection</span>
                      <span className="checkout-badge-free">FREE</span>
                    </div>
                    <div className="checkout-line-item">
                      <span>Instant License Delivery</span>
                      <span className="checkout-badge-included">Included</span>
                    </div>
                    <div className="checkout-divider" />
                    <div className="checkout-total-row">
                      <span className="checkout-total-label">Total Due Today</span>
                      <strong className="checkout-total-amount">${priceVal}.00</strong>
                    </div>
                    <span className="checkout-billed-note">Billed monthly. Cancel anytime in one click.</span>
                  </div>

                  <div className="checkout-perks-list">
                    <h4 className="checkout-perks-title">What&apos;s Included:</h4>
                    <div className="checkout-perk-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Instant production API keys &amp; license credentials</span>
                    </div>
                    <div className="checkout-perk-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Direct private messaging channel with {sellerName}</span>
                    </div>
                    <div className="checkout-perk-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>30-Day Escrow Money-Back Guarantee</span>
                    </div>
                    <div className="checkout-perk-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Commercial software usage license</span>
                    </div>
                  </div>

                  <div className="checkout-security-footer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>256-bit Bank-Level Encryption. Safe &amp; Verified.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
