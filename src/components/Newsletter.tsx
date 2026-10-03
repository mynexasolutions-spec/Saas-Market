"use client";

import React, { useState } from "react";

interface NewsletterProps {
  onSubscribe: (email: string) => void;
}

export default function Newsletter({ onSubscribe }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    onSubscribe(email);
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-box">
          {/* Left Text */}
          <div className="newsletter-left">
            <span className="newsletter-badge">STAY UPDATED</span>
            <h2 className="newsletter-title">
              Get the Latest SaaS Deals &amp; Insights
            </h2>
            <p className="newsletter-subtitle">
              Join thousands of businesses and discover the best SaaS tools today.
            </p>
          </div>

          {/* Right Form */}
          <div className="newsletter-right">
            {isSubscribed ? (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  color: "#34D399",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "var(--radius-full)",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                ✓ Thanks for subscribing! You are on the VIP list.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="newsletter-form">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    className="newsletter-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="newsletter-email-input"
                    aria-label="Email for SaaS newsletter"
                  />
                  <button
                    type="submit"
                    className="newsletter-btn"
                    id="newsletter-submit-btn"
                  >
                    <span>Subscribe</span>
                    
                  </button>
                </div>
                <div className="newsletter-disclaimer">
                  No spam. Unsubscribe anytime.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
