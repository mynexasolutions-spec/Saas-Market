import React from "react";

const TESTIMONIALS = [
  {
    id: "review-1",
    letter: "A",
    avatarBg: "#2563EB",
    name: "Ayesha Khan",
    role: "Product Manager",
    quote:
      "SaaS Market made it so easy to find the right tools for our team. The comparisons and reviews really helped us make the right decision.",
  },
  {
    id: "review-2",
    letter: "R",
    avatarBg: "#8B5CF6",
    name: "Rohit Sharma",
    role: "Startup Founder",
    quote:
      "We listed our SaaS product on SaaS Market and got amazing visibility. Highly recommended for SaaS founders.",
  },
  {
    id: "review-3",
    letter: "F",
    avatarBg: "#4F46E5",
    name: "Fatima Ali",
    role: "Business Owner",
    quote:
      "A clean and trusted platform to discover SaaS products. The buying process was smooth and secure.",
  },
];

export default function Testimonials() {
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* 3 Review Cards */}
        <div className="testimonials-grid">
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className="testimonial-card" id={item.id}>
              <div className="testimonial-user-header">
                <div
                  className="user-avatar-circle"
                  style={{ backgroundColor: item.avatarBg }}
                >
                  {item.letter}
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
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
