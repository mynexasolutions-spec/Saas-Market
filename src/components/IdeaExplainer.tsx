"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FEATURED_PRODUCTS_LIST } from "@/data/products";



const TOUR = [
  {
    title: "Discover & compare",
    desc: "Browse verified SaaS listings and compare revenue, asking price and reviews side by side.",
  },
  {
    title: "Verify & test",
    desc: "Check audited metrics and ownership, and try the product in a live sandbox before you commit.",
  },
  {
    title: "Buy & take ownership",
    desc: "Pay through escrow and get the code, domain and accounts transferred to you.",
  },
];

const AUDIENCES = [
  {
    id: "buyers",
    tag: "FOR BUYERS",
    title: "Find the right SaaS to buy",
    points: [
      "Browse verified listings and compare real metrics",
      "Test products in a live sandbox before paying",
      "Pay safely through escrow and get ownership transferred",
    ],
    href: "/buyers",
    cta: "How buying works",
  },
  {
    id: "sellers",
    tag: "FOR SELLERS",
    title: "Sell your SaaS to serious buyers",
    points: [
      "List your software and reach active buyers",
      "Receive qualified offers and demo requests",
      "Keep 100% of your revenue with 0% commission",
    ],
    href: "/sellers",
    cta: "Start selling",
  },
];

// Illustrative listing numbers for the mock screens (matched by position to FEATURED_PRODUCTS_LIST)
const DEALS = [
  { mrr: "$4.2k", ask: "$48,000" },
  { mrr: "$6.8k", ask: "$79,000" },
  { mrr: "$3.1k", ask: "$34,500" },
];

const BARS = [38, 56, 44, 70, 52, 84, 66];
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const FILTERS = ["All", "CRM", "HR", "Projects", "Finance"];

const CursorIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 3l14 7-6 2-2 6z" fill="#0F172A" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="21" r="1.5" />
    <circle cx="19" cy="21" r="1.5" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const StoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l1-5h16l1 5" />
    <path d="M2 9h20v2a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-2-2V9z" />
    <path d="M4 14v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    <path d="M9 22v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5" />
  </svg>
);


const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// Delay helper: feeds the CSS `--d` custom property used by the reveal transitions
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// Interactive product tour: three steps, each with its own mock screen.
// Nothing starts until the tour scrolls into view (`started`), and autoplay pauses while it is
// off-screen or hovered. The active tab's progress bar drives autoplay (its animation end advances
// the tour), so reduced-motion users (no animation) simply get manual tabs.
function ProductTour() {
  const tourRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const paused = hovered || !inView;
  const [first, second, third] = FEATURED_PRODUCTS_LIST;
  const results = [first, second, third];

  useEffect(() => {
    const el = tourRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => {
        setInView(true);
        setStarted(true);
      });
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={tourRef}
      className={`idea-tour${started ? " is-in" : ""}${paused ? " is-paused" : ""}`}
      data-reveal
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {/* Steps */}
      <div className="idea-tour-steps" role="group" aria-label="How SaaS MRKT works">
        {TOUR.map((t, i) => (
          <button
            key={t.title}
            type="button"
            aria-pressed={active === i}
            className={`idea-tab${started && active === i ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="idea-tab-num">{i + 1}</span>
            <span className="idea-tab-text">
              <strong className="idea-tab-title">{t.title}</strong>
              <span className="idea-tab-desc">{t.desc}</span>
            </span>
            {started && active === i && (
              <span className="idea-tab-track" aria-hidden="true">
                <span
                  key={active}
                  className="idea-tab-progress"
                  onAnimationEnd={() => setActive((a) => (a + 1) % TOUR.length)}
                />
              </span>
            )}
          </button>
        ))}
        <Link href="/products" className="btn-primary idea-tour-cta">
          Browse SaaS listings
        </Link>
      </div>

      {/* Mock browser */}
      <div className="idea-mock-wrap">
        <div className="idea-mock" aria-hidden="true">
          <div className="idea-mock-bar">
            <i /><i /><i />
            <span className="idea-mock-url">saasmrkt.com/products</span>
          </div>

          <div className="idea-mock-body">
            {/* Screen 1: discover & compare listings */}
            <div className={`idea-screen${started && active === 0 ? " is-active" : ""}`}>
              <div className="idea-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="idea-search-text">Profitable SaaS to buy</span>
                <span className="idea-caret" />
              </div>
              <div className="idea-filters">
                {FILTERS.map((f, i) => (
                  <span key={f} className={`idea-filter${i === 0 ? " is-on" : ""}`}>{f}</span>
                ))}
              </div>
              <div className="idea-results">
                {results.map((p, i) => (
                  <div key={p.id} className={`idea-result${i === 0 ? " is-top" : ""}`}>
                    <span className="idea-result-logo" style={{ background: p.brandColor }}>{p.brandLetter}</span>
                    <span className="idea-result-info">
                      <strong>
                        {p.name}
                        <span className="idea-verified"><CheckIcon /></span>
                      </strong>
                      <span>{p.category}</span>
                    </span>
                    <span className="idea-result-metric">
                      <em>MRR</em>
                      <strong>{DEALS[i].mrr}</strong>
                    </span>
                    <span className="idea-result-price">
                      <em>Asking</em>
                      <strong>{DEALS[i].ask}</strong>
                    </span>
                    {i === 0 && <span className="idea-best">Best match</span>}
                  </div>
                ))}
              </div>
              <span className="idea-cursor idea-cursor-search"><CursorIcon /></span>
            </div>

            {/* Screen 2: verify & test */}
            <div className={`idea-screen${started && active === 1 ? " is-active" : ""}`}>
              <div className="idea-sb-head">
                <span className="idea-result-logo" style={{ background: first.brandColor }}>{first.brandLetter}</span>
                <strong>{first.name} · Sandbox</strong>
                <span className="idea-live"><i />Live</span>
              </div>
              <div className="idea-kpis">
                <div><span>MRR</span><strong>{DEALS[0].mrr}</strong></div>
                <div><span>Customers</span><strong>312</strong></div>
                <div><span>Churn</span><strong>2.1%</strong></div>
              </div>
              <div className="idea-bars">
                {BARS.map((h, i) => (
                  <span key={i} style={{ "--h": `${h}%`, "--i": i } as React.CSSProperties} />
                ))}
              </div>
              <div className="idea-days">
                {MONTHS.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <div className="idea-checks">
                <span className="idea-check"><CheckIcon />Ownership verified</span>
                <span className="idea-check"><CheckIcon />Revenue audited</span>
              </div>
            </div>

            {/* Screen 3: buy through escrow, take ownership */}
            <div className={`idea-screen${started && active === 2 ? " is-active" : ""}`}>
              <div className="idea-sb-head">
                <span className="idea-result-logo" style={{ background: first.brandColor }}>{first.brandLetter}</span>
                <span className="idea-co-title">
                  <strong>{first.name}</strong>
                  <span>Full ownership transfer</span>
                </span>
              </div>
              <div className="idea-co-rows">
                <div><span>Purchase price</span><span>{DEALS[0].ask}</span></div>
                <div><span>Escrow protection</span><span className="idea-co-free">Included</span></div>
                <div className="idea-co-total"><span>Held in escrow</span><span>{DEALS[0].ask}</span></div>
              </div>
              <div className="idea-pay-btn">
                <LockIcon />
                Pay into escrow
              </div>
              <div className="idea-success">
                <span className="idea-success-icon"><CheckIcon /></span>
                <span>
                  <strong>Ownership transferred</strong>
                  <span>Code, domain and accounts are yours</span>
                </span>
              </div>
              <span className="idea-cursor idea-cursor-pay"><CursorIcon /></span>
            </div>
          </div>
        </div>

        {/* Floating trust chips */}
        <span className="idea-chip-float idea-chip-1" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          Verified seller
        </span>
        <span className="idea-chip-float idea-chip-2" aria-hidden="true">
          <span className="idea-chip-star">★</span> 4.9 · Real reviews
        </span>
        <span className="idea-chip-float idea-chip-3" aria-hidden="true">
          <LockIcon />
          Escrow protected
        </span>
      </div>
    </div>
  );
}

export default function IdeaExplainer() {
  const rootRef = useRef<HTMLElement>(null);

  // Reveal-on-scroll: elements marked [data-reveal] get `is-in` once visible.
  // The hidden initial state (`idea-ready`) is only applied on the client, so SSR content is never hidden without JS.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    root.classList.add("idea-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove("idea-ready");
    };
  }, []);

  // Spotlight: cards marked .idea-spot get a soft glow that follows the cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".idea-spot");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={rootRef}
      className="idea-section"
      id="the-idea"
      aria-labelledby="idea-heading"
      onMouseMove={handleMouseMove}
    >
      <div className="idea-bg" aria-hidden="true">
        {/* Layered fluid 3D wave ribbons */}
        <svg
          className="idea-bg-waves"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ideaWaveLeft1" x1="0%" y1="0%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
              <stop offset="45%" stopColor="#c4b5fd" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ede9fe" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ideaWaveLeft2" x1="0%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ideaWaveRight" x1="100%" y1="20%" x2="30%" y2="80%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ideaWaveCurve" x1="0%" y1="100%" x2="100%" y2="40%">
              <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Left sweeping fluid waves */}
          <path
            d="M-50 -20 C 120 40, 240 240, 160 480 C 100 660, -20 740, -50 820 L -100 820 L -100 -20 Z"
            fill="url(#ideaWaveLeft1)"
          />
          <path
            d="M-50 40 C 180 120, 320 280, 240 560 C 180 720, 40 820, -50 880 L -100 880 L -100 40 Z"
            fill="url(#ideaWaveLeft2)"
          />
          {/* Bottom center wave flow */}
          <path
            d="M0 720 C 280 620, 580 680, 940 580 C 1180 510, 1360 560, 1500 500 L 1500 900 L 0 900 Z"
            fill="url(#ideaWaveCurve)"
          />
          {/* Right edge flowing wave */}
          <path
            d="M1490 60 C 1320 180, 1260 360, 1340 560 C 1410 720, 1470 780, 1500 840 L 1520 840 L 1520 60 Z"
            fill="url(#ideaWaveRight)"
          />
        </svg>

        {/* Dot matrix grids matching the reference image */}
        <div className="idea-dots idea-dots-tl" />
        <div className="idea-dots idea-dots-tr" />
        <div className="idea-dots idea-dots-bl" />

        {/* 3D Glossy floating purple spheres */}
        <div className="idea-sphere idea-sphere-1" />
        <div className="idea-sphere-wrap idea-sphere-wrap-2">
          <span className="idea-sphere-string" />
          <div className="idea-sphere idea-sphere-2" />
        </div>
        <div className="idea-sphere idea-sphere-3" />

        {/* Atmospheric ambient glow orbs */}
        <span className="idea-orb idea-orb-1" />
        <span className="idea-orb idea-orb-2" />
        <span className="idea-orb idea-orb-3" />
      </div>

      <div className="container idea-inner">
        {/* Header */}
        <div className="idea-header">
          <div className="section-badge idea-badge" data-reveal style={delay(0)}>
            <span className="idea-badge-dot" />
            TWO WAYS TO TRANSACT
          </div>
          <h2 className="section-title idea-title" id="idea-heading" data-reveal style={delay(80)}>
            Built for Buyers <span className="idea-title-accent">&amp; Sellers</span>
          </h2>
          <p className="section-subtitle idea-subtitle" data-reveal style={delay(160)}>
            Whether you&apos;re acquiring profitable software or exiting your startup, we provide escrow protection, verified metrics, and smooth handover.
          </p>
        </div>

        {/* Two sides of the marketplace (For Buyers & For Sellers) */}
        <div className="idea-audiences">
          {AUDIENCES.map((a, idx) => (
            <div
              key={a.id}
              className={`idea-audience-card idea-spot idea-audience-${a.id}`}
              data-reveal
              style={delay(idx * 120)}
            >
              <div className="idea-card-header">
                <div className={`idea-card-icon idea-card-icon-${a.id}`} aria-hidden="true">
                  {a.id === "buyers" ? <CartIcon /> : <StoreIcon />}
                </div>
                <div className="idea-card-header-info">
                  <span className="idea-audience-tag">{a.tag}</span>
                  <h3 className="idea-audience-title">{a.title}</h3>
                </div>
              </div>
              <ul className="idea-list">
                {a.points.map((p) => (
                  <li key={p}>
                    <span className="idea-list-icon idea-icon-good">
                      <CheckIcon />
                    </span>
                    <span className="idea-list-text">{p}</span>
                  </li>
                ))}
              </ul>
              <Link href={a.href} className="idea-audience-link">
                {a.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Interactive product tour */}
        <div className="idea-tour-head" data-reveal>
          <span className="idea-tour-kicker">See it in action</span>
          <h3 className="idea-tour-title">From search to ownership in three steps</h3>
        </div>
        <ProductTour />
      </div>
    </section>
  );
}
