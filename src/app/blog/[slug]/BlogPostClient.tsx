"use client";

import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

interface BlogPost {
  slug: string;
  tag: string;
  title: string;
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
            <Link href="/blog" className="post-breadcrumb">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Blog
            </Link>
            <span className="post-tag-pill">{post.tag}</span>
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
              <div className="prose">
                {renderMarkdown(post.content)}
              </div>

              {/* Tags / Share Row */}
              <div className="post-share-row">
                <span className="post-tag-pill post-tag-pill--dark">{post.tag}</span>
                <div className="post-share-btns">
                  <span className="post-share-label">Share:</span>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent("https://saasmarket.io/blog/" + post.slug)}`} target="_blank" rel="noreferrer" className="post-share-btn" id="post-share-twitter" aria-label="Share on Twitter">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent("https://saasmarket.io/blog/" + post.slug)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="post-share-btn" id="post-share-linkedin" aria-label="Share on LinkedIn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
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
