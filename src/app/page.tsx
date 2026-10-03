"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MetricsBar from "@/components/MetricsBar";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import FeaturedProducts, { ProductItem } from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import DualBanners from "@/components/DualBanners";
import Testimonials from "@/components/Testimonials";
import BlogArticles from "@/components/BlogArticles";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const featuredElem = document.getElementById("featured");
    if (featuredElem) {
      featuredElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchFocus = () => {
    const inputElem = document.getElementById("hero-search-input");
    if (inputElem) {
      inputElem.scrollIntoView({ behavior: "smooth", block: "center" });
      inputElem.focus();
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    if (activeCategory === categoryName) {
      setActiveCategory("");
    } else {
      setActiveCategory(categoryName);
      const featuredElem = document.getElementById("featured");
      if (featuredElem) {
        featuredElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleOpenAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (email: string) => {
    showToast(`Welcome! Logged in as ${email}`);
  };

  const handleSubscribe = (email: string) => {
    showToast(`Subscribed! ${email} will receive weekly SaaS deals.`);
  };

  const handleExploreScroll = () => {
    const elem = document.getElementById("featured");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Navigation Header */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onSearchFocus={handleSearchFocus}
      />

      {/* Main Page Flow */}
      <main id="main-content">
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* 4 Stats Metrics Bar */}
        <MetricsBar />

        {/* Browse by Category (10 cards) */}
        <Categories
          onSelectCategory={handleCategorySelect}
          activeCategory={activeCategory}
        />

        {/* How SaaS MRKT Works (3 steps flow) */}
        <HowItWorks />

        {/* Featured Products (5 cards with screenshots) */}
        <FeaturedProducts
          onViewProduct={(product) => setSelectedProduct(product)}
          searchFilter={searchQuery}
          categoryFilter={activeCategory}
        />

        {/* Why Choose SaaS MRKT (Lavender box with 6 cards) */}
        <WhyChooseUs onExploreClick={handleExploreScroll} />

        {/* Dual Banners (For Buyers & For Sellers) */}
        <DualBanners
          onExploreProducts={handleExploreScroll}
          onBecomeSeller={() => handleOpenAuth("signup")}
        />

        {/* What Our Users Say (Testimonials) */}
        <Testimonials />

        {/* Latest Articles & Resources (Blog) */}
        <BlogArticles
          onArticleClick={(title) => showToast(`Opening article: "${title}"`)}
        />

        {/* Newsletter CTA */}
        <Newsletter onSubscribe={handleSubscribe} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectPlan={(prod) => {
          setSelectedProduct(null);
          showToast(`Started free trial for ${prod.name}! Check your inbox.`);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="toast-notice" role="status">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

