import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Software Categories | SaaS MRKT",
  description: "Browse software categories to find the perfect SaaS product for your business needs.",
};

export default function CategoriesPage() {
  const categories = [
    { name: "HR & Payroll", count: 120, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "CRM", count: 85, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
    { name: "Project Management", count: 150, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> },
    { name: "Accounting Software", count: 95, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> },
    { name: "Marketing Automation", count: 210, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> },
    { name: "Developer Tools", count: 340, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> },
    { name: "Customer Support", count: 115, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
    { name: "Security & Compliance", count: 70, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
    { name: "Design & UX", count: 90, icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="5.5" r="2.5"></circle><circle cx="18.5" cy="10.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="5.5" cy="10.5" r="2.5"></circle><circle cx="10.5" cy="14.5" r="2.5"></circle></svg> },
  ];

  return (
    <PageLayout activeNav="categories">
      <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="section-title">Explore&nbsp;<span className="section-title-highlight">Categories</span></h1>
        <p className="section-subtitle">
          Find exactly what you need. Browse thousands of verified tools across every software category.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {categories.map((category) => (
          <Link href="/products" key={category.name} style={{ textDecoration: "none" }}>
            <div className="category-card-hover" style={{
              background: "var(--white)",
              borderRadius: "16px",
              padding: "2rem",
              border: "1px solid var(--slate-200)",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.02)",
              cursor: "pointer"
            }}>
              <div style={{ fontSize: "2.5rem" }}>{category.icon}</div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "0.25rem" }}>{category.name}</h3>
                <p style={{ color: "var(--slate-500)", fontSize: "0.95rem" }}>{category.count} Products</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}


