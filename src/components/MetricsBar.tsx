import React from "react";

const METRICS_DATA = [
  {
    id: "metric-products",
    value: "500+",
    label: "SaaS Products",
    bg: "#EFF6FF",
    color: "#3B82F6",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    id: "metric-customers",
    value: "25,000+",
    label: "Happy Customers",
    bg: "#F5F3FF",
    color: "#8B5CF6",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "metric-sellers",
    value: "300+",
    label: "SaaS Sellers",
    bg: "#EFF6FF",
    color: "#2563EB",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "metric-transactions",
    value: "$10M+",
    label: "Transactions",
    bg: "#F5F3FF",
    color: "#7C3AED",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
];

export default function MetricsBar() {
  return (
    <section className="metrics-section" id="metrics">
      <div className="container">
        <div className="metrics-strip">
          {METRICS_DATA.map((item) => (
            <div key={item.id} className="metric-item" id={item.id}>
              <div
                className="metric-icon-wrap"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <div className="metric-value">{item.value}</div>
                <div className="metric-label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
