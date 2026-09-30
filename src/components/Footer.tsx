import React from "react";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <a href="#" className="brand-logo" id="footer-brand-logo">
              <span className="brand-icon">
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#5E4BEE" />
                  <path
                    d="M10 12C10 9.79086 11.7909 8 14 8H19C20.6569 8 22 9.34315 22 11C22 12.6569 20.6569 14 19 14H13C11.3431 14 10 15.3431 10 17C10 18.6569 11.3431 20 13 20H18C20.2091 20 22 21.7909 22 24"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>SaaS Market</span>
            </a>
            <p className="footer-desc">
              A modern marketplace for SaaS products. Where buyers can discover, compare and purchase, and sellers can grow their business.
            </p>
            <div className="footer-social-row">
              {/* Twitter / X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="footer-col-title">Products</h4>
            <ul className="footer-links-list">
              <li><a href="#featured" className="footer-link-item">All Products</a></li>
              <li><a href="#categories" className="footer-link-item">Categories</a></li>
              <li><a href="#featured" className="footer-link-item">New Arrivals</a></li>
              <li><a href="#featured" className="footer-link-item">Popular Products</a></li>
              <li><a href="#featured" className="footer-link-item">Deals &amp; Offers</a></li>
            </ul>
          </div>

          {/* For Buyers Column */}
          <div>
            <h4 className="footer-col-title">For Buyers</h4>
            <ul className="footer-links-list">
              <li><a href="#how-it-works" className="footer-link-item">How it Works</a></li>
              <li><a href="#for-buyers" className="footer-link-item">Buyer Guide</a></li>
              <li><a href="#faq" className="footer-link-item">FAQs</a></li>
              <li><a href="#reviews" className="footer-link-item">Reviews</a></li>
              <li><a href="#support" className="footer-link-item">Support</a></li>
            </ul>
          </div>

          {/* For Sellers Column */}
          <div>
            <h4 className="footer-col-title">For Sellers</h4>
            <ul className="footer-links-list">
              <li><a href="#for-sellers" className="footer-link-item">List Your Product</a></li>
              <li><a href="#for-sellers" className="footer-link-item">Seller Guide</a></li>
              <li><a href="#pricing" className="footer-link-item">Pricing</a></li>
              <li><a href="#resources" className="footer-link-item">Seller Resources</a></li>
              <li><a href="#contact" className="footer-link-item">Contact Sales</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links-list">
              <li><a href="#about" className="footer-link-item">About Us</a></li>
              <li><a href="#resources" className="footer-link-item">Blog</a></li>
              <li><a href="#careers" className="footer-link-item">Careers</a></li>
              <li><a href="#privacy" className="footer-link-item">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link-item">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>© 2026 SaaS Market. All rights reserved.</div>
          <div className="footer-community-text">
            <span>Made with</span>
            <span style={{ color: "#EF4444" }}>❤️</span>
            <span>for the SaaS community.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
