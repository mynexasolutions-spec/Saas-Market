"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { PublicRole } from "@/lib/auth-types";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "login" | "signup";
  onClose: () => void;
  onSuccess: (email: string) => void;
}

type AuthMethod = "password" | "otp";
type OtpStep = "send" | "verify";

export default function AuthModal({ isOpen, initialMode, onClose, onSuccess }: AuthModalProps) {
  const { login, signup, loginWithOtp, signupWithOtp, sendOtp, authDefaultRole } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<PublicRole>(authDefaultRole || "buyer");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("send");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [otp, setOtp] = useState<string[]>(() => Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const resetForm = useCallback(() => {
    setIsSubmitting(false);
    setFormError("");
    setNotice("");
    setPassword("");
    setShowPassword(false);
    setOtp(Array(6).fill(""));
    setOtpStep("send");
    setResendCountdown(0);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const frameId = window.requestAnimationFrame(() => {
      setMode(initialMode);
      setAuthMethod("password");
      resetForm();
      if (authDefaultRole) setSelectedRole(authDefaultRole);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isOpen, initialMode, authDefaultRole, resetForm]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => setResendCountdown((previous) => previous - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOtpInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    if (value && index < 5) {
      document.querySelector<HTMLInputElement>(`input[data-otp-index="${index + 1}"]`)?.focus();
    }
    if (nextOtp.every(Boolean)) window.setTimeout(() => void handleOtpSubmit(nextOtp.join("")), 100);
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      window.setTimeout(() => void handleOtpSubmit(pasted), 100);
    }
  };

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSendingOtp || !email.trim()) return;
    setIsSendingOtp(true);
    setFormError("");
    setNotice("");
    try {
      const result = await sendOtp(email.trim(), mode, selectedRole, mode === "signup" ? name.trim() : undefined);
      setOtpStep("verify");
      setNotice(result.message);
      setResendCountdown(90);
      window.setTimeout(() => document.querySelector<HTMLInputElement>('input[data-otp-index="0"]')?.focus(), 100);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to send code. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpSubmit = async (otpValue: string) => {
    if (isSubmitting || otpValue.length !== 6) return;
    setIsSubmitting(true);
    setFormError("");
    try {
      const result = mode === "signup"
        ? await signupWithOtp(email.trim(), otpValue, name.trim(), selectedRole)
        : await loginWithOtp(email.trim(), otpValue, selectedRole);
      if (result.user) {
        setOtp(Array(6).fill(""));
        onClose();
        onSuccess(result.user.email);
      } else {
        setNotice(result.message || "Verification successful.");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid code. Please try again.");
      setOtp(Array(6).fill(""));
      window.setTimeout(() => document.querySelector<HTMLInputElement>('input[data-otp-index="0"]')?.focus(), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isSendingOtp) return;
    setFormError("");
    setNotice("");
    try {
      const result = await sendOtp(email.trim(), mode, selectedRole, mode === "signup" ? name.trim() : undefined);
      setNotice(result.message);
      setResendCountdown(90);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to resend code. Please try again.");
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError("");
    setNotice("");
    try {
      const result = mode === "signup"
        ? await signup(email.trim(), password, name.trim(), selectedRole)
        : await login(email.trim(), password, selectedRole);
      if (result.user) {
        setPassword("");
        onClose();
        onSuccess(result.user.email);
      } else {
        setNotice(result.message || "Check your email to confirm your account.");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToSignup = () => {
    setMode("signup");
    resetForm();
  };

  const switchToLogin = () => {
    setMode("login");
    resetForm();
  };

  if (!isOpen) return null;

  const isSignup = mode === "signup";
  const accountLabel = selectedRole === "vendor" ? "Vendor" : "User";
  const submitLabel = isSignup ? `Create ${accountLabel} Account` : `Sign In as ${accountLabel}`;
  const submittingLabel = isSignup ? "Creating account..." : "Signing in...";
  const otpSubmittingLabel = isSignup ? "Creating account..." : "Verifying...";
  const subtitle = isSignup
    ? "Enter your details to create your account"
    : "Enter your credentials to access your account";

  const modePrompt = (
    <p className={styles.footerPrompt}>
      {isSignup ? "Already have an account? " : "New to SaaS MRKT? "}
      <button type="button" className={styles.textButton} onClick={isSignup ? switchToLogin : switchToSignup}>
        {isSignup ? "Sign in" : "Create an account"}
      </button>
    </p>
  );

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className={styles.card} data-role={selectedRole} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close authentication dialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <header className={styles.brandHeader}>
          <div className={styles.logoShell}>
            <Image className={styles.logo} src="/logo.png" alt="SaaS MRKT logo" width={43} height={43} priority />
          </div>
          <h2 className={styles.title} id="auth-modal-title">SaaS <span className={styles.titleAccent}>MRKT</span></h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        <section className={styles.section} aria-labelledby="account-role-label">
          <p className={styles.sectionLabel} id="account-role-label">Select Account Role</p>
          <div className={styles.segments}>
            <button type="button" className={`${styles.segmentButton} ${styles.roleButton} ${selectedRole === "buyer" ? styles.segmentButtonActive : ""}`} aria-pressed={selectedRole === "buyer"} onClick={() => { setSelectedRole("buyer"); resetForm(); }}>
              <span className={styles.segmentIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
              </span>
              <span className={styles.segmentCopy}><span className={styles.segmentTitle}>Buyer</span><span className={styles.segmentCaption}>Personal workspace</span></span>
            </button>
            <button type="button" className={`${styles.segmentButton} ${styles.roleButton} ${selectedRole === "vendor" ? styles.segmentButtonActive : ""}`} aria-pressed={selectedRole === "vendor"} onClick={() => { setSelectedRole("vendor"); resetForm(); }}>
              <span className={styles.segmentIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h2m2 0h2M9 14h2m2 0h2M10 21v-3h4v3" /></svg>
              </span>
              <span className={styles.segmentCopy}><span className={styles.segmentTitle}>Vendor</span><span className={styles.segmentCaption}>SaaS seller portal</span></span>
            </button>
          </div>
        </section>

        <div className={styles.roleNote}>
          <span className={styles.roleNoteIcon}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" /></svg>
          </span>
          <span>{selectedRole === "vendor" ? "Manage products, listings, orders, and seller activity." : "Access purchases, orders, and your buyer dashboard."}</span>
        </div>

        <section className={styles.section} aria-labelledby="sign-in-method-label">
          <p className={styles.sectionLabel} id="sign-in-method-label">Sign in with</p>
          <div className={styles.segments}>
            <button type="button" className={`${styles.segmentButton} ${styles.methodButton} ${authMethod === "password" ? styles.segmentButtonActive : ""}`} aria-pressed={authMethod === "password"} onClick={() => { setAuthMethod("password"); resetForm(); }}>
              <span className={styles.segmentIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
              </span>
              <span className={styles.segmentCopy}><span className={styles.segmentTitle}>Password</span></span>
            </button>
            <button type="button" className={`${styles.segmentButton} ${styles.methodButton} ${authMethod === "otp" ? styles.segmentButtonActive : ""}`} aria-pressed={authMethod === "otp"} onClick={() => { setAuthMethod("otp"); resetForm(); }}>
              <span className={styles.segmentIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
              </span>
              <span className={styles.segmentCopy}><span className={styles.segmentTitle}>Email OTP</span></span>
            </button>
          </div>
        </section>

        {formError && <p className={`${styles.message} ${styles.error}`} role="alert">{formError}</p>}
        {notice && <p className={`${styles.message} ${styles.notice}`} role="status">{notice}</p>}

        {authMethod === "password" && (
          <form className={styles.form} onSubmit={handlePasswordSubmit}>
            {isSignup && (
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>Full name or organization</span>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon} aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                  </span>
                  <input className={styles.field} type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" />
                </div>
              </label>
            )}
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>{selectedRole === "vendor" ? "Vendor email address" : "Work email address"}</span>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon} aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                </span>
                <input className={styles.field} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required />
              </div>
            </label>
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Password</span>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon} aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                </span>
                <input className={styles.field} type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} minLength={isSignup ? 8 : undefined} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? "At least 8 characters" : "Enter your password"} required style={{ paddingRight: "38px" }} />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </label>
            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? submittingLabel : submitLabel}
              {!isSubmitting && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>}
            </button>
            {modePrompt}
          </form>
        )}

        {authMethod === "otp" && otpStep === "send" && (
          <form className={styles.form} onSubmit={handleSendOtp}>
            {isSignup && (
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>Full name or organization</span>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon} aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                  </span>
                  <input className={styles.field} type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" />
                </div>
              </label>
            )}
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>{selectedRole === "vendor" ? "Vendor email address" : "Work email address"}</span>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon} aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                </span>
                <input className={styles.field} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required />
              </div>
            </label>
            <button type="submit" className={styles.primaryButton} disabled={isSendingOtp || !email.trim()}>
              {isSendingOtp ? "Sending secure code..." : `Send code to ${accountLabel.toLowerCase()} email`}
              {!isSendingOtp && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7Z" /></svg>}
            </button>
            <p className={styles.helperText}>We’ll email a 6-digit code that expires in 10 minutes.</p>
            {modePrompt}
          </form>
        )}

        {authMethod === "otp" && otpStep === "verify" && (
          <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void handleOtpSubmit(otp.join("")); }}>
            <p className={styles.otpIntro}>Enter the 6-digit code sent to<span className={styles.otpEmail}>{email}</span></p>
            <div className={styles.otpGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  className={styles.otpInput}
                  aria-label={`Verification code digit ${index + 1}`}
                  type="text"
                  maxLength={1}
                  value={otp[index] || ""}
                  onChange={(event) => handleOtpInputChange(event, index)}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !otp[index] && index > 0) {
                      document.querySelector<HTMLInputElement>(`input[data-otp-index="${index - 1}"]`)?.focus();
                    }
                  }}
                  onPaste={handleOtpPaste}
                  data-otp-index={index}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
              ))}
            </div>
            <button type="submit" className={styles.primaryButton} disabled={isSubmitting || otp.some((digit) => !digit)}>
              {isSubmitting ? otpSubmittingLabel : submitLabel}
              {!isSubmitting && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>}
            </button>
            <div className={styles.otpActions}>
              <button type="button" className={styles.textButton} onClick={handleResendOtp} disabled={resendCountdown > 0 || isSendingOtp}>
                {resendCountdown > 0 ? `Resend available in ${resendCountdown}s` : "Resend verification code"}
              </button>
              <button type="button" className={styles.textButton} onClick={() => { setOtpStep("send"); resetForm(); }}>Change email or sign-in method</button>
            </div>
            {modePrompt}
          </form>
        )}
      </div>
    </div>
  );
}
