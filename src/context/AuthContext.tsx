"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import AuthSuccessPopup, { AuthPopupData } from "@/components/AuthSuccessPopup";

export interface User {
  name: string;
  email: string;
  initials: string;
  isSubscribed?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  signup: (email: string, name?: string) => void;
  logout: () => void;
  isAuthOpen: boolean;
  authMode: "login" | "signup";
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
  showPopupMessage: (title: string, subtitle: string, type?: "login" | "signup" | "logout") => void;
  isSubscribed: boolean;
  subscribe: (planName?: string) => void;
  unsubscribe: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authPopup, setAuthPopup] = useState<AuthPopupData | null>(null);
  const [popupToast, setPopupToast] = useState<string | null>(null);

  useEffect(() => {
    // When the user refreshes the website, erase all user & subscription test data
    try {
      localStorage.removeItem("saas_mrkt_user");
      localStorage.removeItem("saas_mrkt_subscribed");
      sessionStorage.removeItem("saas_mrkt_user");
      sessionStorage.removeItem("saas_mrkt_subscribed");
    } catch {
      // Ignore
    }
    setUser(null);
    setIsSubscribed(false);

    const handleClear = () => {
      try {
        localStorage.removeItem("saas_mrkt_user");
        localStorage.removeItem("saas_mrkt_subscribed");
      } catch {
        // Ignore
      }
    };

    window.addEventListener("beforeunload", handleClear);
    return () => {
      window.removeEventListener("beforeunload", handleClear);
    };
  }, []);

  useEffect(() => {
    if (!popupToast) return;
    const timer = setTimeout(() => {
      setPopupToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [popupToast]);

  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  const login = (email: string, name?: string) => {
    const computedName = name && name.trim() ? name.trim() : email.split("@")[0];
    const newUser: User = {
      name: computedName,
      email,
      initials: getInitials(computedName, email),
      isSubscribed: isSubscribed,
    };
    setUser(newUser);
    setIsAuthOpen(false);

    setAuthPopup({
      isOpen: true,
      type: "login",
      title: "Welcome Back! 👋",
      subtitle: `You are signed in as ${computedName}. Marketplace tools & features are ready.`,
      email,
      name: computedName,
    });

    setPopupToast(`Welcome! Logged in as ${email}`);
  };

  const signup = (email: string, name?: string) => {
    const computedName = name && name.trim() ? name.trim() : email.split("@")[0];
    const newUser: User = {
      name: computedName,
      email,
      initials: getInitials(computedName, email),
      isSubscribed: isSubscribed,
    };
    setUser(newUser);
    setIsAuthOpen(false);

    setAuthPopup({
      isOpen: true,
      type: "signup",
      title: "Account Created Successfully! 🎉",
      subtitle: `Welcome to SaaS MRKT, ${computedName}! Your free trial & benefits are active.`,
      email,
      name: computedName,
    });

    setPopupToast(`Account created! Welcome, ${computedName}`);
  };

  const logout = () => {
    setUser(null);

    setAuthPopup({
      isOpen: true,
      type: "logout",
      title: "Signed Out Successfully",
      subtitle: "You have been logged out of your SaaS MRKT account.",
    });

    setPopupToast("Signed out successfully.");
  };

  const subscribe = (planName: string = "Pro Growth") => {
    setIsSubscribed(true);
    if (user) {
      setUser({ ...user, isSubscribed: true });
    }

    setAuthPopup({
      isOpen: true,
      type: "signup",
      title: "Subscription Activated! 🚀",
      subtitle: `You are now subscribed to ${planName}. All verified metrics, financials, and locked content are now unlocked!`,
      email: user?.email || "alex@company.com",
      name: user?.name || "Subscriber",
    });

    setPopupToast(`⚡ Subscription Active! Full metrics unlocked.`);
  };

  const unsubscribe = () => {
    setIsSubscribed(false);
    if (user) {
      setUser({ ...user, isSubscribed: false });
    }
    setPopupToast("Subscription paused.");
  };

  const openAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  const showPopupMessage = (
    title: string,
    subtitle: string,
    type: "login" | "signup" | "logout" = "login"
  ) => {
    setAuthPopup({
      isOpen: true,
      type,
      title,
      subtitle,
      email: user?.email,
      name: user?.name,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthOpen,
        authMode,
        openAuth,
        closeAuth,
        showPopupMessage,
        isSubscribed,
        subscribe,
        unsubscribe,
      }}
    >
      {children}

      {/* Global Success Popup Message Modal */}
      <AuthSuccessPopup
        data={authPopup}
        onClose={() => setAuthPopup(null)}
      />

      {/* Global Floating Popup Toast Banner */}
      {popupToast && (
        <div className="toast-notice" role="status">
          <span>⚡</span>
          <span>{popupToast}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
