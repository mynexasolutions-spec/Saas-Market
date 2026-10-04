"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

interface BlogPost {
  slug: string;
  tag: string;
  title: string;
  excerpt?: string;
  image?: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  gradient: string;
  content: string;
}

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

// Minimal markdown-to-JSX renderer for h2/h3/blockquote/table/p
function renderMarkdown(md: string) {
  const lines = md.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="prose-h2">{line.replace(/^## /, "")}</h2>);
      i++;
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="prose-h3">{line.replace(/^### /, "")}</h3>);
      i++;
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="prose-blockquote">
          {line.replace(/^> /, "").replace(/\*([^*]+)\*/g, "$1")}
        </blockquote>
      );
      i++;
    } else if (line.startsWith("|")) {
      // Table
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !l.match(/^\|[-| ]+\|$/))
        .map((l) => l.split("|").filter((_, idx) => idx > 0 && idx < l.split("|").length - 1).map((c) => c.trim()));
      elements.push(
        <div key={`table-${i}`} className="prose-table-wrapper">
          <table className="prose-table">
            <thead>
              <tr>{rows[0].map((cell, ci) => <th key={ci}>{cell}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell.replace(/[✅❌]/g, (m) => m)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (line.startsWith("- ")) {
      // List block
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="prose-ul">
          {listItems.map((item, li) => <li key={li}>{item.replace(/\*\*([^*]+)\*\*/g, "$1")}</li>)}
        </ul>
      );
    } else if (/^\d+\. /.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="prose-ol">
          {listItems.map((item, li) => <li key={li}>{item.replace(/\*\*([^*]+)\*\*/g, "$1")}</li>)}
        </ol>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="prose-hr" />);
      i++;
    } else if (line.trim() === "") {
      i++;
    } else {
      // Paragraph — handle **bold** and *italic*
      const html = line
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
      elements.push(
        <p key={i} className="prose-p" dangerouslySetInnerHTML={{ __html: html }} />
      );
      i++;
    }
  }
  return elements;
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://www.saasmrkt.com/blog/${post.slug}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageLayout activeNav="resources">
      {/* Hero Banner */}
      <div className="post-hero" style={{ background: post.gradient }}>
        <div className="post-hero-decor">
          <svg viewBox="0 0 1200 280" fill="none" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <path d="M0,100 C200,200 400,30 600,120 C800,210 1000,60 1200,130 L1200,280 L0,280 Z" fill="rgba(255,255,255,0.06)" />
            <path d="M0,160 C300,80 600,200 900,90 C1050,55 1150,100 1200,120 L1200,280 L0,280 Z" fill="rgba(255,255,255,0.04)" />
            <circle cx="1050" cy="60" r="100" fill="rgba(255,255,255,0.05)" />
            <circle cx="100" cy="40" r="60" fill="rgba(255,255,255,0.04)" />
          </svg>
        </div>
        <div className="container">
          <div className="post-hero-content">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <Link href="/blog" className="post-breadcrumb" style={{ marginBottom: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Blog
              </Link>
              <span className="post-tag-pill" style={{ marginBottom: 0 }}>{post.tag}</span>
            </div>
            <h1 className="post-hero-title">{post.title}</h1>
            <div className="post-hero-meta">
              <div className="blog-author">
                <div className="blog-author-avatar" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="blog-author-name" style={{ color: "rgba(255,255,255,0.95)" }}>{post.author}</div>
                  <div className="blog-author-role" style={{ color: "rgba(255,255,255,0.7)" }}>{post.authorRole}</div>
                </div>
              </div>
              <div className="post-hero-stats">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {post.date}
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <section className="post-body-section">
        <div className="container">
          <div className="post-layout">
            {/* Article Content */}
            <article className="post-content" id="post-article">
              {post.image && (
                <div
                  className="post-cover-image-container"
                  style={{
                    marginBottom: "2.25rem",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.07)",
                    backgroundColor: "#0F172A",
                  }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      aspectRatio: "1200 / 630",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <div className="prose">
                {renderMarkdown(post.content)}
              </div>

              {/* Tags / Share Row */}
              <div className="post-share-row">
                <span className="post-tag-pill post-tag-pill--dark">{post.tag}</span>
                <div className="post-share-btns">
                  <span className="post-share-label">Share article:</span>
                  {/* WhatsApp Share Button */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${post.title}\n\nhttps://www.saasmrkt.com/blog/${post.slug}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="post-share-btn post-share-btn--whatsapp"
                    id="post-share-whatsapp"
                    aria-label="Share on WhatsApp"
                    title="Share on WhatsApp"
                    style={{
                      backgroundColor: "#25D366",
                      color: "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      transition: "transform 0.2s, opacity 0.2s",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.saasmrkt.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="post-share-btn"
                    id="post-share-twitter"
                    aria-label="Share on Twitter"
                    title="Share on X"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.saasmrkt.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="post-share-btn"
                    id="post-share-linkedin"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  {/* Copy Link Button */}
                  <button
                    onClick={handleCopy}
                    className="post-share-btn"
                    id="post-share-copylink"
                    aria-label="Copy link"
                    title="Copy link"
                    style={{
                      background: copied ? "var(--accent-color, #5E4BEE)" : "transparent",
                      color: copied ? "#FFFFFF" : "inherit",
                      border: "1px solid var(--border-color)",
                      cursor: "pointer",
                      padding: "0 10px",
                      width: "auto",
                      gap: "5px",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="post-sidebar">
              <div className="post-sidebar-card">
                <h3 className="post-sidebar-title">About the Author</h3>
                <div className="post-sidebar-author">
                  <div className="blog-author-avatar blog-author-avatar--lg" style={{ background: post.gradient }}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="blog-author-name">{post.author}</div>
                    <div className="blog-author-role">{post.authorRole}</div>
                  </div>
                </div>
              </div>

              <div className="post-sidebar-card">
                <h3 className="post-sidebar-title">Try a SaaS Tool</h3>
                <p className="post-sidebar-text">Discover the tools mentioned in this article on SaaS MRKT. Compare features and start free trials.</p>
                <Link href="/products" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} id="post-sidebar-browse-btn">
                  Browse Products
                </Link>
              </div>

              <div className="post-sidebar-card post-sidebar-newsletter">
                <h3 className="post-sidebar-title">Get Weekly Insights</h3>
                <p className="post-sidebar-text">Join 12,000+ readers getting curated SaaS guides every Tuesday.</p>
                <form onSubmit={(e) => e.preventDefault()} className="post-sidebar-form" id="post-sidebar-newsletter">
                  <input type="email" placeholder="your@email.com" className="post-sidebar-input" id="post-sidebar-email" required />
                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} id="post-sidebar-subscribe-btn">
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="post-related-section">
          <div className="container">
            <div className="section-badge">KEEP READING</div>
            <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>Related Articles</h2>
            <div className="blog-grid blog-grid--3">
              {relatedPosts.map((rp) => (
                <Link href={`/blog/${rp.slug}`} key={rp.slug} className="blog-card" id={`related-${rp.slug}`}>
                  <div className="blog-card-banner" style={{ background: rp.gradient }}>
                    <svg viewBox="0 0 400 160" fill="none" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                      <path d="M0,60 C100,120 220,20 320,80 C370,110 400,70 400,70 L400,160 L0,160 Z" fill="rgba(255,255,255,0.08)" />
                    </svg>
                    <span className="blog-tag-badge">{rp.tag}</span>
                  </div>
                  <div className="blog-card-body">
                    <h3 className="blog-card-title">{rp.title}</h3>
                    <div className="blog-card-footer">
                      <div className="blog-author-mini">
                        <div className="blog-author-avatar blog-author-avatar--sm" style={{ background: rp.gradient }}>
                          {rp.author.charAt(0)}
                        </div>
                        <span>{rp.author}</span>
                      </div>
                      <span className="blog-read-time">{rp.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
