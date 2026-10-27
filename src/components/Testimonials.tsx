"use client";

import React from "react";
import Image from "next/image";

interface TestimonialItem {
  id: string;
  avatar: string;
  name: string;
  role: string;
  theme: "blue" | "purple" | "emerald";
  rating: string;
  quote: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "review-marcus",
    avatar: "/images/avatars/rohit.jpg",
    name: "Marcus Vance",
    role: "Co-Founder @ AlphaSaaS",
    theme: "blue",
    rating: "5.0",
    quote:
      "We acquired over 120 paid enterprise customers within our first month of listing. SaaS MRKT delivers genuine, high-intent software buyers.",
  },
  {
    id: "review-elena",
    avatar: "/images/avatars/fatima.jpg",
    name: "Elena Rostova",
    role: "Operations Lead @ SyncWave",
    theme: "purple",
    rating: "5.0",
    quote:
      "Hands down the best B2B software directory available. Customer reviews are verified, integration guides are clear, and support is prompt.",
  },
  {
    id: "review-michael",
    avatar: "/images/avatars/david.jpg",
    name: "Michael Hayes",
    role: "Tech Lead @ DataSphere",
    theme: "emerald",
    rating: "5.0",
    quote:
      "The seamless onboarding and direct integration benchmarks made choosing our cloud database tooling effortless and completely risk-free.",
  },
  {
    id: "review-ayesha",
    avatar: "/images/avatars/ayesha.jpg",
    name: "Ayesha Khan",
    role: "Product Manager @ ApexGrowth",
    theme: "blue",
    rating: "5.0",
    quote:
      "SaaS MRKT made it so easy to find the right tools for our team. The comparisons and verified reviews really helped us make the right decision.",
  },
  {
    id: "review-sarah",
    avatar: "/images/avatars/sarah.jpg",
    name: "Sarah Jenkins",
    role: "Head of Marketing @ MetricPulse",
    theme: "purple",
    rating: "5.0",
    quote:
      "Discovered two game-changing analytics tools on SaaS MRKT that cut our customer acquisition costs by 28%. The direct founder support is unmatched.",
  },
  {
    id: "review-alex",
    avatar: "/images/avatars/alex.jpg",
    name: "Alex Rivera",
    role: "Lead Architect @ StackGuard",
    theme: "emerald",
    rating: "5.0",
    quote:
      "Finding dev tools with transparent pricing and real sandbox demos was impossible before SaaS MRKT. It's now our team's default discovery hub.",
  },
];

export default function Testimonials() {
  // Duplicate list to achieve a seamless, continuous infinite marquee loop
  const marqueeCards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="testimonials-section" id="reviews">
      {/* Ambient background spark rays */}
      <div className="testimonials-bg-sparks" aria-hidden="true">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
          <line x1="20" y1="36" x2="10" y2="22" stroke="#6366F1" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="30" y1="34" x2="30" y2="14" stroke="#6366F1" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="40" y1="36" x2="50" y2="22" stroke="#6366F1" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </div>

      <div className="container">
        {/* Centered Header with Decorative Star Badge & Accent */}
        <div className="testimonials-header-center">
          <div className="section-badge testimonials-badge" id="testimonials-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2" />
            </svg>
            <span>CUSTOMER REVIEWS</span>
          </div>

          <h2 className="section-title testimonials-main-title">
            What Our{" "}
            <span className="testimonials-title-highlight">
              Users Say
              <svg className="testimonials-title-curve" viewBox="0 0 110 12" fill="none" aria-hidden="true">
                <path d="M4 9 C 35 2, 75 2, 106 9" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="section-subtitle">
            Trusted by thousands of buyers and sellers worldwide.
          </p>
        </div>

        {/* Auto-moving Infinite Carousel Row */}
        <div className="testimonials-carousel-viewport">
          <div className="testimonials-carousel-track">
            {marqueeCards.map((item, index) => {
              const themeClass = `testimonial-theme-${item.theme}`;
              const checkBgColor =
                item.theme === "blue"
                  ? "#2563EB"
                  : item.theme === "purple"
                  ? "#7C3AED"
                  : "#059669";

              return (
                <div 
                  key={`${item.id}-${index}`} 
                  className={`testimonial-card testimonial-carousel-card ${themeClass}`} 
                  id={`${item.id}-${index}`}
                >
                  {/* Decorative Big Quote Icon */}
                  <div className="testimonial-quote-icon" aria-hidden="true">
                    <svg width="32" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Header: User Avatar + Name with Verified Check + Role */}
                  <div className="testimonial-user-header">
                    <div className="user-avatar-wrapper">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="user-avatar-img"
                      />
                    </div>
                    <div className="user-details">
                      <div className="user-name-row">
                        <span className="user-name">{item.name}</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="testimonial-verified-badge" aria-label="Verified User">
                          <circle cx="12" cy="12" r="10" fill={checkBgColor} />
                          <polyline points="8 12 11 15 16 9" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="user-role">{item.role}</span>
                    </div>
                  </div>

                  {/* 5 Gold Stars & Numerical Score 5.0 */}
                  <div className="star-rating-row" aria-label="5 out of 5 stars">
                    <div className="star-rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="star-rating-score">{item.rating}</span>
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="testimonial-quote">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
