"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import PlatformShowcase from "@/components/PlatformShowcase";
import ClientRelationBanner from "@/components/ClientRelationBanner";
import FeaturedProducts, { ProductItem } from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import DualBanners from "@/components/DualBanners";
import Testimonials from "@/components/Testimonials";
import SplitFeatureShowcase from "@/components/SplitFeatureShowcase";
import BlogArticles from "@/components/BlogArticles";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthOpen, authMode, openAuth, closeAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  
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

  const handleSearchToggle = () => {
    setSearchOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setTimeout(() => {
          const heroElem = document.getElementById("hero");
          if (heroElem) {
            heroElem.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          const inputElem = document.getElementById("hero-search-input");
          if (inputElem) {
            inputElem.focus();
          }
        }, 120);
      }
      return nextState;
    });
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
      {/* Navigation Header with Inline Expanding Search */}
      <Navbar
        onOpenAuth={openAuth}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Page Flow */}
      <main id="main-content">
        {/* Hero Section (Contains Integrated Bottom Metrics Bar) */}
        <Hero onExploreScroll={handleExploreScroll} />

        {/* Browse by Category (10 cards) */}
        <Categories
          onSelectCategory={handleCategorySelect}
          activeCategory={activeCategory}
        />

        {/* Live Platform Handover Showcase Banner */}
        <PlatformShowcase />

        {/* How SaaS MRKT Works (3 steps flow) */}
        <HowItWorks />

        {/* SaaS & Client Relationship Partnership Showcase */}
        <ClientRelationBanner />

        {/* Featured Products (5 cards with screenshots) */}
        <FeaturedProducts
          onViewProduct={(product) => router.push(`/products/${product.id}`)}
          searchFilter={searchQuery}
          categoryFilter={activeCategory}
        />

        {/* Why Choose SaaS MRKT (Lavender box with 6 cards) */}
        <WhyChooseUs onExploreClick={handleExploreScroll} />

        {/* Dual Banners (For Buyers & For Sellers) */}
        <DualBanners
          onExploreProducts={handleExploreScroll}
          onBecomeSeller={() => openAuth("signup")}
        />

        {/* What Our Users Say (Testimonials) */}
        <Testimonials />

        {/* Enterprise Split Showcase (Image Left, Text Right) */}
        <SplitFeatureShowcase onExplore={handleExploreScroll} />

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
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={closeAuth}
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

