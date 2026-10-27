"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

interface PageLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
  noContainer?: boolean;
  headerClassName?: string;
}

export default function PageLayout({
  children,
  noContainer,
}: PageLayoutProps) {
  const { isAuthOpen, authMode, openAuth, closeAuth } = useAuth();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <>
      {/* Modern Shared Floating Navbar with Mega Menu */}
      <Navbar onOpenAuth={openAuth} />

      <main
        className={noContainer ? undefined : "container"}
        style={{
          paddingBottom: noContainer ? 0 : "1rem",
          minHeight: "calc(100vh - 400px)",
        }}
      >
        {children}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={closeAuth}
        onSuccess={(email) => {
          closeAuth();
          showToast(`Welcome! You are signed in as ${email}`);
        }}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-notice" role="status">
          <span>⚡</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}
