"use client";

import React, { useState, useEffect, useMemo } from "react";
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

// Converts cell text with emojis and markdown bold into React elements with SVG icons
function renderFormattedCell(raw: string): React.ReactNode {
  let text = raw.trim();

  // If cell is completely wrapped in **bold**
  const isAllBold = text.startsWith("**") && text.endsWith("**") && text.length > 4;
  if (isAllBold) {
    text = text.slice(2, -2).trim();
  }

  // Tokenize text to replace emojis (✅, ❌, ⚠️, ⭐) with SVG icons
  const tokens = text.split(/([✅❌⚠️⭐])/g);

  const content = tokens.map((token, idx) => {
    if (token === "✅") {
      return (
        <span key={idx} className="table-status-icon table-status-icon--check" aria-label="Yes / Included">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      );
    }
    if (token === "❌") {
      return (
        <span key={idx} className="table-status-icon table-status-icon--cross" aria-label="No / Not included">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      );
    }
    if (token === "⚠️") {
      return (
        <span key={idx} className="table-status-icon table-status-icon--warning" aria-label="Notice / Partial">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
      );
    }
    if (token === "⭐") {
      return (
        <span key={idx} className="table-status-icon table-status-icon--star" aria-label="Rating">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      );
    }

    if (!token) return null;

    // Check for inline **bold**
    if (token.includes("**")) {
      const bParts = token.split(/\*\*([^*]+)\*\*/g);
      return bParts.map((bText, bIdx) =>
        bIdx % 2 === 1 ? <strong key={`${idx}-${bIdx}`}>{bText}</strong> : bText
      );
    }

    return token;
  });

  return isAllBold ? <strong>{content}</strong> : <>{content}</>;
}

// Enhanced markdown-to-JSX renderer with connected timeline markers
function renderMarkdown(md: string) {
  const lines = md.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let sectionIndex = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      sectionIndex++;
      const title = line.replace(/^## /, "").trim();
      const sectionId = `section-${sectionIndex}`;
      elements.push(
        <div key={`h2-block-${i}`} className="prose-section-header" id={sectionId}>
          <div className="prose-timeline-marker" aria-hidden="true">
            <span className="prose-timeline-badge">{String(sectionIndex).padStart(2, "0")}</span>
          </div>
          <h2 className="prose-h2">{title}</h2>
        </div>
      );
      i++;
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="prose-h3">{line.replace(/^### /, "")}</h3>);
      i++;
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="prose-blockquote">
          <div className="prose-quote-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <p>{line.replace(/^> /, "").replace(/\*([^*]+)\*/g, "$1")}</p>
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
              <tr>{rows[0].map((cell, ci) => <th key={ci}>{renderFormattedCell(cell)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{renderFormattedCell(cell)}</td>)}</tr>
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
          {listItems.map((item, li) => (
            <li key={li}>
              <span className="prose-bullet-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>{renderFormattedCell(item)}</span>
            </li>
          ))}
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
          {listItems.map((item, li) => <li key={li}>{renderFormattedCell(item)}</li>)}
        </ol>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="prose-hr" />);
      i++;
    } else if (line.startsWith("![")) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const alt = match[1];
        const src = match[2];
        elements.push(
          <figure key={`figure-${i}`} className="prose-figure">
            <div className="prose-figure-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="prose-figure-img"
              />
            </div>
            {alt && (
              <figcaption className="prose-figure-caption">
                {alt}
              </figcaption>
            )}
          </figure>
        );
        i++;
      } else {
        i++;
      }
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
  const [tocOpen, setTocOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Extract H2 headings for Table of Contents
  const headings = useMemo(() => {
    return post.content
      .split("\n")
      .filter((line) => line.startsWith("## "))
      .map((line, idx) => ({
        id: `section-${idx + 1}`,
        title: line.replace(/^## /, "").trim(),
      }));
  }, [post.content]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://www.saasmrkt.com/blog/${post.slug}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageLayout activeNav="resources" noContainer>
      {/* Scroll Reading Progress Bar */}
      <div
        className="post-reading-progress"
        style={{ width: `${readingProgress}%` }}
        aria-hidden="true"
      />

      {/* Modern Compact Hero Banner */}
      <div
        className="post-hero"
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.90) 0%, rgba(15, 23, 42, 0.74) 50%, rgba(15, 23, 42, 0.93) 100%), ${post.gradient}`,
        }}
      >
        <div className="post-hero-decor" aria-hidden="true">
          <div className="post-hero-grid-pattern" />
          <div className="post-hero-glow-orb" />
        </div>

        <div className="container">
          <div className="post-hero-content">
            {/* Top Navigation Row: Back Link + Breadcrumb Slash + Category Badge + Verified Pill */}
            <div className="post-hero-top-row">
              <div className="post-hero-breadcrumbs">
                <Link href="/blog" className="post-hero-back-link" id="post-back-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span>Blog</span>
                </Link>
                <span className="post-hero-crumb-slash">/</span>
                <span className="post-hero-tag-pill">
                  <span className="post-hero-tag-dot" />
                  {post.tag}
                </span>
              </div>

              <div className="post-hero-verified-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Verified SaaS Guide</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="post-hero-title">{post.title}</h1>

            {/* Compact Glass Meta Bar */}
            <div className="post-hero-meta">
              <div className="post-hero-author">
                <div className="post-hero-author-avatar">
                  {post.author.charAt(0)}
                </div>
                <div className="post-hero-author-info">
                  <span className="post-hero-author-name">{post.author}</span>
                  <span className="post-hero-author-role">{post.authorRole}</span>
                </div>
              </div>

              <div className="post-hero-meta-right">
                <div className="post-hero-stat-pill">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{post.date}</span>
                </div>
                <span className="post-hero-stat-divider">&bull;</span>
                <div className="post-hero-stat-pill">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="post-hero-share-btn"
                  title="Copy link to article"
                  id="post-hero-share-btn"
                  aria-label="Share article"
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span>Share</span>
                    </>
                  )}
                </button>
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
              {/* Featured Cover Image */}
              {post.image && (
                <div
                  className="post-cover-image-container"
                  style={{
                    marginBottom: "1.25rem",
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: "1px solid var(--slate-200)",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                    backgroundColor: "#0F172A",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="post-cover-img"
                  />
                </div>
              )}

              {/* Executive Summary / Key Takeaways Box */}
              <div className="post-takeaways-card">
                <div className="post-takeaways-header">
                  <div className="post-takeaways-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <h3 className="post-takeaways-title">Executive Summary &amp; Key Highlights</h3>
                </div>
                {post.excerpt && <p className="post-takeaways-excerpt">{post.excerpt}</p>}
                <div className="post-takeaways-chips">
                  <span className="post-takeaway-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Verified SaaS Analysis
                  </span>
                  <span className="post-takeaway-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    2026 Procurement Guide
                  </span>
                  <span className="post-takeaway-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    </svg>
                    Actionable Buyer Takeaways
                  </span>
                </div>
              </div>

              {/* Mobile Table of Contents Accordion */}
              {headings.length > 0 && (
                <div className="post-mobile-toc">
                  <button
                    type="button"
                    className="post-mobile-toc-btn"
                    onClick={() => setTocOpen(!tocOpen)}
                    id="post-toc-toggle-btn"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      <span>Jump to Section ({headings.length})</span>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: tocOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {tocOpen && (
                    <div className="post-mobile-toc-list">
                      {headings.map((h, i) => (
                        <a key={h.id} href={`#${h.id}`} className="post-mobile-toc-link" onClick={() => setTocOpen(false)}>
                          <span className="post-mobile-toc-num">{String(i + 1).padStart(2, "0")}</span>
                          <span>{h.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Main Article Prose with Timeline Track */}
              <div className="prose prose-timeline-track">
                {renderMarkdown(post.content)}
              </div>

              {/* Tags / Share Row */}
              <div className="post-share-row">
                <div className="post-share-tag-col">
                  <span className="post-tag-pill post-tag-pill--dark">{post.tag}</span>
                </div>
                <div className="post-share-btns">
                  <span className="post-share-label">Share:</span>
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
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.saasmrkt.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="post-share-btn post-share-btn--twitter"
                    id="post-share-twitter"
                    aria-label="Share on Twitter"
                    title="Share on X"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.saasmrkt.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="post-share-btn post-share-btn--linkedin"
                    id="post-share-linkedin"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`post-share-btn post-share-copylink-btn ${copied ? "copied" : ""}`}
                    id="post-share-copylink"
                    aria-label="Copy link"
                    title="Copy link"
                  >
                    {copied ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <section className="post-related-section" aria-label="Related Articles">
          <div className="container">
            <div className="related-header-compact">
              <span className="related-section-badge">KEEP READING</span>
              <h2 className="related-section-title">
                Related <span className="related-title-highlight">Articles &amp; Guides</span>
              </h2>
              <p className="related-section-sub">
                Explore more curated playbooks, benchmarks, and software insights.
              </p>
            </div>

            <div className="related-cards-grid">
              {relatedPosts.slice(0, 3).map((rp) => (
                <Link
                  href={`/blog/${rp.slug}`}
                  key={rp.slug}
                  className="related-article-card"
                  id={`related-${rp.slug}`}
                >
                  <div className="related-card-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rp.image || `/images/blog/${rp.slug}.jpg`}
                      alt={rp.title}
                      className="related-card-img"
                      loading="lazy"
                    />
                    <div className="related-card-overlay" />
                    <span className="related-card-tag">{rp.tag}</span>
                  </div>

                  <div className="related-card-body">
                    <div className="related-card-meta">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{rp.date}</span>
                      <span className="related-meta-dot">•</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{rp.readTime}</span>
                    </div>

                    <h3 className="related-card-title">{rp.title}</h3>
                    {rp.excerpt && (
                      <p className="related-card-excerpt">{rp.excerpt}</p>
                    )}

                    <div className="related-card-footer">
                      <div className="related-author-mini">
                        <span className="related-author-avatar">
                          {rp.author
                            ? rp.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                            : "AU"}
                        </span>
                        <span className="related-author-name">{rp.author}</span>
                      </div>

                      <span className="related-card-cta">
                        <span>Read</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
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
