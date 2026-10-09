"use client";

import React from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: "review-1",
    avatar: "/images/avatars/ayesha.jpg",
    name: "Ayesha Khan",
    role: "Product Manager @ ApexGrowth",
    quote:
      "SaaS MRKT made it so easy to find the right tools for our team. The comparisons and verified reviews really helped us make the right decision.",
  },
  {
    id: "review-2",
    avatar: "/images/avatars/rohit.jpg",
    name: "Rohit Sharma",
    role: "Startup Founder @ BuildFast",
    quote:
      "We listed our SaaS product on SaaS MRKT and got amazing visibility from day one. Highly recommended for any ambitious B2B SaaS founder.",
  },
  {
    id: "review-3",
    avatar: "/images/avatars/fatima.jpg",
    name: "Fatima Ali",
    role: "Business Owner @ CloudScale",
    quote:
      "A clean and trusted platform to discover SaaS products. The buying process was smooth, secure, and saved our team weeks of vendor vetting.",
  },
  {
    id: "review-4",
    avatar: "/images/avatars/david.jpg",
    name: "David Chen",
    role: "VP of Engineering @ NexaLogic",
    quote:
      "The architectural breakdown and SOC2 compliance badges give our enterprise security team the confidence to approve tools in hours instead of months.",
  },
  {
    id: "review-5",
    avatar: "/images/avatars/sarah.jpg",
    name: "Sarah Jenkins",
    role: "Head of Marketing @ MetricPulse",
    quote:
      "Discovered two game-changing analytics tools on SaaS MRKT that cut our customer acquisition costs by 28%. The direct founder support is unmatched.",
  },
  {
    id: "review-6",
    avatar: "/images/avatars/alex.jpg",
    name: "Alex Rivera",
    role: "Lead Architect @ StackGuard",
    quote:
      "Finding dev tools with transparent pricing and real sandbox demos was impossible before SaaS MRKT. It's now our team's default discovery hub.",
  },
  {
    id: "review-7",
    avatar: "/images/avatars/ayesha.jpg",
    name: "Priya Patel",
    role: "UX Design Director @ FlowCraft",
    quote:
      "The UI comparisons and verified buyer ratings helped us switch our design system pipeline seamlessly without costly downtime.",
  },
  {
    id: "review-8",
    avatar: "/images/avatars/rohit.jpg",
    name: "Marcus Vance",
    role: "Co-Founder @ AlphaSaaS",
    quote:
      "We acquired over 120 paid enterprise customers within our first month of listing. SaaS MRKT delivers genuine, high-intent software buyers.",
  },
  {
    id: "review-9",
    avatar: "/images/avatars/fatima.jpg",
    name: "Elena Rostova",
    role: "Operations Lead @ SyncWave",
    quote:
      "Hands down the best B2B software directory available. Customer reviews are verified, integration guides are clear, and support is prompt.",
  },
  {
    id: "review-10",
    avatar: "/images/avatars/david.jpg",
    name: "Michael Hayes",
    role: "Tech Lead @ DataSphere",
    quote:
      "The seamless onboarding and direct integration benchmarks made choosing our cloud database tooling effortless and completely risk-free.",
  },
];

export default function Testimonials() {
  // Duplicate list to achieve a seamless, continuous infinite marquee loop
  const marqueeCards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="testimonials-section" id="reviews">
      <div className="container">
        {/* Header */}
        <div className="section-badge" id="testimonials-badge">
          CUSTOMER REVIEWS
        </div>
        <div className="section-header-row">
          <div>
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Trusted by thousands of buyers and sellers worldwide.
            </p>
          </div>
          <a href="#reviews" className="view-all-link" id="view-all-reviews-link">
            <span>View All Reviews</span>
          </a>
        </div>
      </div>

      {/* Auto-moving Infinite Carousel Row */}
      <div className="testimonials-carousel-viewport">
        <div className="testimonials-carousel-track">
          {marqueeCards.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="testimonial-card testimonial-carousel-card" 
              id={`${item.id}-${index}`}
            >
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
                  <span className="user-name">{item.name}</span>
                  <span className="user-role">{item.role}</span>
                </div>
              </div>

              {/* 5 Gold Stars */}
              <div className="star-rating-row" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2" />
                  </svg>
                ))}
              </div>

              <blockquote className="testimonial-quote">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
