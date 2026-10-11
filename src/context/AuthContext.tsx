"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthSuccessPopup, { AuthPopupData } from "@/components/AuthSuccessPopup";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";

export type UserRole = "buyer" | "vendor" | "admin";

export interface User {
  name: string;
  email: string;
  initials: string;
  role: UserRole;
  title?: string;
  company?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  login: (email: string, name?: string, role?: UserRole) => void;
  signup: (email: string, name?: string, role?: UserRole) => void;
  logout: () => void;
  requestLogout: () => void;
  cancelLogout: () => void;
  confirmLogout: () => void;
  isLogoutConfirmOpen: boolean;
  updateUser: (updated: Partial<User>) => void;
  loginAsRole: (role: UserRole) => void;
  isAuthOpen: boolean;
  authMode: "login" | "signup";
  authDefaultRole: UserRole;
  openAuth: (mode?: "login" | "signup", defaultRole?: UserRole) => void;
  closeAuth: () => void;
  showPopupMessage: (title: string, subtitle: string, type?: "login" | "signup" | "logout") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PRESETS: Record<UserRole, { name: string; email: string; title: string; company: string }> = {
  buyer: {
    name: "Alex Morgan",
    email: "alex@company.com",
    title: "Head of Product & Growth",
    company: "Acme Cloud Ventures",
  },
  vendor: {
    name: "David Miller",
    email: "vendor@saasmrkt.com",
    title: "Founder & Lead Architect",
    company: "SaaS MRKT",
  },
  admin: {
    name: "Admin",
    email: "admin@saasmrkt.com",
    title: "Platform Super Administrator",
    company: "SaaS MRKT Operations",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>("buyer");
  const [authPopup, setAuthPopup] = useState<AuthPopupData | null>(null);
  const [popupToast, setPopupToast] = useState<string | null>(null);

  // Logout Confirmation Modal state
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Restore user session from localStorage or set initial default demo buyer
  useEffect(() => {
    try {
      const isExplicitlyLoggedOut = localStorage.getItem("saas_mrkt_logged_out") === "true";
      if (isExplicitlyLoggedOut) {
        setUser(null);
        setIsInitialized(true);
        return;
      }

      const savedUserStr = localStorage.getItem("saas_mrkt_user_session");
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.email && parsed.role) {
          if (parsed.name) parsed.name = parsed.name.replace(/\s*\(NexaSaaS\)/gi, "").trim();
          if (parsed.email && parsed.email.includes("nexasaas.io")) parsed.email = parsed.email.replace("nexasaas.io", "saasmrkt.com");
          if (parsed.company && parsed.company.includes("NexaSaaS")) parsed.company = "SaaS MRKT";
          localStorage.setItem("saas_mrkt_user_session", JSON.stringify(parsed));
          setUser(parsed);
          setIsInitialized(true);
          return;
        }
      }
    } catch {
      // Ignore
    }

    // Default demo user on first visit if user has never explicitly logged out
    const defaultBuyer: User = {
      name: ROLE_PRESETS.buyer.name,
      email: ROLE_PRESETS.buyer.email,
      initials: "AM",
      role: "buyer",
      title: ROLE_PRESETS.buyer.title,
      company: ROLE_PRESETS.buyer.company,
      location: "San Francisco, CA",
      website: "https://acmecloud.io",
      bio: "SaaS software procurement lead evaluating cloud infrastructure and marketing tooling.",
      phone: "+1 (555) 234-8900",
    };
    setUser(defaultBuyer);
    setIsInitialized(true);
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

  const detectRoleFromEmail = (email: string, fallbackRole?: UserRole): UserRole => {
    if (fallbackRole) return fallbackRole;
    const lower = email.toLowerCase();
    if (lower.includes("admin")) return "admin";
    if (lower.includes("vendor") || lower.includes("seller")) return "vendor";
    return "buyer";
  };

  const login = (email: string, name?: string, role?: UserRole) => {
    const determinedRole = detectRoleFromEmail(email, role);
    const computedName =
      name && name.trim()
        ? name.trim()
        : ROLE_PRESETS[determinedRole]?.name || email.split("@")[0];

    const newUser: User = {
      name: computedName,
      email,
      initials: getInitials(computedName, email),
      role: determinedRole,
      title: ROLE_PRESETS[determinedRole]?.title,
      company: ROLE_PRESETS[determinedRole]?.company,
    };

    setUser(newUser);
    try {
      localStorage.removeItem("saas_mrkt_logged_out");
      localStorage.setItem("saas_mrkt_user_session", JSON.stringify(newUser));
    } catch {
      // Ignore
    }

    setIsAuthOpen(false);

    const roleLabel =
      determinedRole === "admin"
        ? "Platform Administrator"
        : determinedRole === "vendor"
        ? "SaaS Vendor"
        : "Software Buyer";

    setAuthPopup({
      isOpen: true,
      type: "login",
      title: "Welcome Back! 👋",
      subtitle: `Signed in as ${computedName} (${roleLabel}).`,
      email,
      name: computedName,
    });

    setPopupToast(`Logged in as ${email} [${roleLabel}]`);
  };

  const signup = (email: string, name?: string, role?: UserRole) => {
    const determinedRole = detectRoleFromEmail(email, role);
    const computedName =
      name && name.trim()
        ? name.trim()
        : ROLE_PRESETS[determinedRole]?.name || email.split("@")[0];

    const newUser: User = {
      name: computedName,
      email,
      initials: getInitials(computedName, email),
      role: determinedRole,
      title: ROLE_PRESETS[determinedRole]?.title,
      company: ROLE_PRESETS[determinedRole]?.company,
    };

    setUser(newUser);
    try {
      localStorage.removeItem("saas_mrkt_logged_out");
      localStorage.setItem("saas_mrkt_user_session", JSON.stringify(newUser));
    } catch {
      // Ignore
    }

    setIsAuthOpen(false);

    const roleLabel =
      determinedRole === "admin"
        ? "Platform Administrator"
        : determinedRole === "vendor"
        ? "SaaS Vendor"
        : "Software Buyer";

    setAuthPopup({
      isOpen: true,
      type: "signup",
      title: "Account Created Successfully! 🎉",
      subtitle: `Welcome to SaaS MRKT, ${computedName}! Registered as ${roleLabel}.`,
      email,
      name: computedName,
    });

    setPopupToast(`Account created! Logged in as ${roleLabel}`);
  };

  const loginAsRole = (role: UserRole) => {
    const preset = ROLE_PRESETS[role];
    login(preset.email, preset.name, role);
  };

  const executeLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("saas_mrkt_user_session");
      localStorage.setItem("saas_mrkt_logged_out", "true");
    } catch {
      // Ignore
    }

    setPopupToast("Signed out successfully.");

    // If currently on a protected page, navigate smoothly to home without page refresh
    if (
      pathname &&
      (pathname.startsWith("/vendor") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/admin"))
    ) {
      router.push("/");
    }
  };

  const logout = () => {
    executeLogout();
  };

  const requestLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const cancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      executeLogout();
      setIsLoggingOut(false);
      setIsLogoutConfirmOpen(false);
    }, 220);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const baseName = updated.name || prev.name;
      const baseEmail = updated.email || prev.email;
      const initials = getInitials(baseName, baseEmail);
      const updatedUser: User = {
        ...prev,
        ...updated,
        initials,
      };
      try {
        localStorage.setItem("saas_mrkt_user_session", JSON.stringify(updatedUser));
      } catch {
        // Ignore
      }
      return updatedUser;
    });
  };

  const openAuth = (mode: "login" | "signup" = "login", defaultRole: UserRole = "buyer") => {
    setAuthMode(mode);
    setAuthDefaultRole(defaultRole);
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
        isInitialized,
        login,
        signup,
        logout,
        requestLogout,
        cancelLogout,
        confirmLogout,
        isLogoutConfirmOpen,
        updateUser,
        loginAsRole,
        isAuthOpen,
        authMode,
        authDefaultRole,
        openAuth,
        closeAuth,
        showPopupMessage,
      }}
    >
      {children}

      {/* Global Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        user={user}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
        isLoggingOut={isLoggingOut}
      />

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
