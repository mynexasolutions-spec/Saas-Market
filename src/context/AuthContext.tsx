"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthSuccessPopup, { AuthPopupData } from "@/components/AuthSuccessPopup";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import {
  dashboardFor,
  type User,
  type UserRole,
  type PublicRole,
} from "@/lib/auth-types";
import {
  VENDOR_PRODUCTS_STORAGE_KEY,
  VENDOR_PRODUCTS_EVENT_KEY,
} from "@/utils/vendorProducts";
export type { User, UserRole } from "@/lib/auth-types";

interface AuthResult {
  user: User | null;
  message?: string;
}
interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  login: (
    email: string,
    password: string,
    role: PublicRole,
  ) => Promise<AuthResult>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: PublicRole,
  ) => Promise<AuthResult>;
  loginWithOtp: (
    email: string,
    otp: string,
    role: PublicRole,
  ) => Promise<AuthResult>;
  signupWithOtp: (
    email: string,
    otp: string,
    name: string,
    role: PublicRole,
  ) => Promise<AuthResult>;
  sendOtp: (
    email: string,
    purpose: "login" | "signup",
    role: PublicRole,
    name?: string,
  ) => Promise<{ success: boolean; message: string; expiresInMinutes: number }>;
  logout: () => void;
  requestLogout: () => void;
  cancelLogout: () => void;
  confirmLogout: () => void;
  isLogoutConfirmOpen: boolean;
  updateUser: (updated: Partial<User>) => Promise<void>;
  loginAsRole: (role: UserRole) => void;
  isAuthOpen: boolean;
  authMode: "login" | "signup";
  authDefaultRole: PublicRole;
  openAuth: (mode?: "login" | "signup", defaultRole?: UserRole) => void;
  closeAuth: () => void;
  showPopupMessage: (
    title: string,
    subtitle: string,
    type?: "login" | "signup" | "logout",
  ) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
async function authRequest(path: string, body: unknown): Promise<AuthResult> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Authentication failed.");
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authDefaultRole, setAuthDefaultRole] = useState<PublicRole>("buyer");
  const [authPopup, setAuthPopup] = useState<AuthPopupData | null>(null);
  const [popupToast, setPopupToast] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let disposed = false;
    let pending = false;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!disposed) {
          setUser(response.ok ? data.user : null);
          if (!response.ok && response.status !== 401)
            setPopupToast(data.error || "Session verification failed.");
        }
      } catch {
        if (!disposed) {
          setUser(null);
          setPopupToast("Could not verify your session. Please try again.");
        }
      } finally {
        pending = false;
        if (!disposed) setIsInitialized(true);
      }
    };
    // Legacy localStorage data is never used as authentication.
    try {
      localStorage.removeItem("saas_mrkt_user_session");
    } catch {
      /* Storage may be disabled. */
    }
    const frame = requestAnimationFrame(() => {
      if (new URLSearchParams(window.location.search).has("signin"))
        setIsAuthOpen(true);
      void refresh();
    });
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  useEffect(() => {
    const syncCatalog = async () => {
      try {
        const response = await fetch("/api/catalog", { cache: "no-store" });
        if (!response.ok) return;
        const catalog = await response.json();
        localStorage.setItem(
          VENDOR_PRODUCTS_STORAGE_KEY,
          JSON.stringify(catalog.listings),
        );
        window.dispatchEvent(new Event(VENDOR_PRODUCTS_EVENT_KEY));
      } catch {
        /* A catalog failure must not change authentication state. */
      }
    };
    void syncCatalog();
    window.addEventListener("focus", syncCatalog);
    return () => window.removeEventListener("focus", syncCatalog);
  }, []);
  useEffect(() => {
    if (!popupToast) return;
    const timer = setTimeout(() => setPopupToast(null), 5000);
    return () => clearTimeout(timer);
  }, [popupToast]);

  const acceptAuth = (result: AuthResult): AuthResult => {
    if (result.user) {
      setUser(result.user);
      setIsAuthOpen(false);
      router.push(dashboardFor(result.user.role));
      router.refresh();
    }
    return result;
  };
  const login = async (email: string, password: string, role: PublicRole) =>
    acceptAuth(await authRequest("/api/auth/login", { email, password, role }));
  const signup = async (
    email: string,
    password: string,
    name: string,
    role: PublicRole,
  ) =>
    acceptAuth(
      await authRequest("/api/auth/signup", { email, password, name, role }),
    );
  const sendOtp = async (
    email: string,
    purpose: "login" | "signup",
    role: PublicRole,
    name?: string,
  ) => {
    const response = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose, role, name }),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Failed to send verification code.");
    return data;
  };
  const loginWithOtp = async (email: string, otp: string, role: PublicRole) =>
    acceptAuth(
      await authRequest("/api/auth/otp/verify", {
        email,
        otp,
        purpose: "login",
        role,
      }),
    );
  const signupWithOtp = async (
    email: string,
    otp: string,
    name: string,
    role: PublicRole,
  ) =>
    acceptAuth(
      await authRequest("/api/auth/otp/verify", {
        email,
        otp,
        purpose: "signup",
        role,
        name,
      }),
    );

  const openAuth = (
    mode: "login" | "signup" = "login",
    role: UserRole = "buyer",
  ) => {
    setAuthMode(mode);
    setAuthDefaultRole(role === "vendor" ? "vendor" : "buyer");
    setIsAuthOpen(true);
  };
  const executeLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authRequest("/api/auth/logout", {});
      setUser(null);
      setIsLogoutConfirmOpen(false);
      router.push("/");
      router.refresh();
      setPopupToast("Signed out successfully.");
    } catch (error) {
      setPopupToast(
        error instanceof Error ? error.message : "Sign out failed.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };
  const updateUser = async (updated: Partial<User>) => {
    const result = await authRequest("/api/profile", updated);
    setUser(result.user);
    if (result.message) setPopupToast(result.message);
  };
  const showPopupMessage = (
    title: string,
    subtitle: string,
    type: "login" | "signup" | "logout" = "login",
  ) =>
    setAuthPopup({
      isOpen: true,
      title,
      subtitle,
      type,
      email: user?.email,
      name: user?.name,
    });
  return (
    <AuthContext.Provider
      value={{
        user,
        isInitialized,
        login,
        signup,
        loginWithOtp,
        signupWithOtp,
        sendOtp,
        logout: () => {
          void executeLogout();
        },
        requestLogout: () => setIsLogoutConfirmOpen(true),
        cancelLogout: () => setIsLogoutConfirmOpen(false),
        confirmLogout: () => {
          void executeLogout();
        },
        isLogoutConfirmOpen,
        updateUser,
        loginAsRole: (role) => openAuth("login", role),
        isAuthOpen,
        authMode,
        authDefaultRole,
        openAuth,
        closeAuth: () => setIsAuthOpen(false),
        showPopupMessage,
      }}
    >
      {children}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        user={user}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          void executeLogout();
        }}
        isLoggingOut={isLoggingOut}
      />
      <AuthSuccessPopup data={authPopup} onClose={() => setAuthPopup(null)} />
      {popupToast && (
        <div className="toast-notice" role="status">
          {popupToast}
        </div>
      )}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
