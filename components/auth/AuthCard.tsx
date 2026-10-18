"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Mail, Check, ArrowLeft, RefreshCw, ShieldCheck, Lock, User } from "lucide-react";
import { insforge } from "@/utils/insforge";
import { useAuth } from "@/components/providers/AuthProvider";

type Mode = "signin" | "signup" | "forgot";

export function AuthCard() {
  const router = useRouter();
  const { refresh, setUser } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  
  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Verification & Recovery State
  const [otp, setOtp] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Form status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [resendCooldown]);

  const goToStudio = (userData?: { id: string; email: string; name?: string | null }) => {
    if (userData) {
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name ?? userData.email,
      });
    }
    router.push("/studio");
  };

  const handleResendOtp = async () => {
    if (!email || resendCooldown > 0) return;
    setError(null);
    setNotice(null);
    try {
      const { data, error: resendErr } = await insforge.auth.resendVerificationEmail({ email });
      if (resendErr) throw resendErr;
      setNotice("A fresh 6-digit verification code has been dispatched.");
      setResendCooldown(45);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not resend verification code.";
      setError(msg);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    // Client-side industry-standard password confirmation check
    if (mode === "signup" && !needsVerification) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please re-enter.");
        return;
      }
    }

    setSubmitting(true);

    try {
      // 1. Verification Flow (OTP confirmation)
      if (needsVerification) {
        const cleanOtp = otp.trim().replace(/\D/g, "");
        if (cleanOtp.length !== 6) {
          setError("Please enter the complete 6-digit code.");
          setSubmitting(false);
          return;
        }

        const { data, error: verifyError } = await insforge.auth.verifyEmail({
          email,
          otp: cleanOtp,
        });
        if (verifyError) throw verifyError;

        // Session hydration
        await refresh();
        if (data?.user) {
          goToStudio(data.user);
        } else {
          router.push("/studio");
        }
        return;
      }

      // 2. Sign-Up Flow
      if (mode === "signup") {
        const { data, error: signUpError } = await insforge.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || undefined,
        });
        if (signUpError) throw signUpError;

        if (data?.requireEmailVerification) {
          setNeedsVerification(true);
          setResendCooldown(45);
          setNotice(`Verification code sent to ${email}. Please check your inbox.`);
          return;
        }

        // Direct session hydration if verification is disabled
        let activeUser = data?.user;
        if (!data?.accessToken) {
          const { data: signInData, error: signInErr } = await insforge.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });
          if (!signInErr && signInData?.user) {
            activeUser = signInData.user;
          }
        }

        await refresh();
        if (activeUser) {
          goToStudio(activeUser);
        } else {
          router.push("/studio");
        }
        return;
      }

      // 3. Password Reset Request Flow
      if (mode === "forgot") {
        const { error: resetErr } = await insforge.auth.sendResetPasswordEmail({
          email: email.trim().toLowerCase(),
        });
        if (resetErr) throw resetErr;
        setNotice(`Password reset instructions sent to ${email} if registered.`);
        return;
      }

      // 4. Sign-In Flow
      const { data, error: signInError } = await insforge.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        const statusCode = (signInError as { statusCode?: number }).statusCode;
        if (statusCode === 403) {
          setNeedsVerification(true);
          setResendCooldown(45);
          setNotice("Email verification required. Enter the 6-digit code sent to your inbox.");
          return;
        }
        throw signInError;
      }

      if (data?.user) {
        goToStudio(data.user);
      } else {
        await refresh();
        router.push("/studio");
      }
    } catch (caught: unknown) {
      console.error("Auth submit error:", caught);
      const errObj = caught as { message?: string; error_description?: string; error?: string };
      const rawMessage =
        caught instanceof Error
          ? caught.message
          : errObj?.message || errObj?.error_description || "";
      
      let friendlyMessage = rawMessage || "Authentication failed. Please verify your credentials.";
      if (rawMessage.toLowerCase().includes("user already exists") || errObj?.error === "AUTH_EMAIL_EXISTS") {
        friendlyMessage = "An account with this email already exists. Please switch to Sign In.";
      } else if (rawMessage.toLowerCase().includes("invalid credentials")) {
        friendlyMessage = "Invalid email or password. Please verify your credentials.";
      } else if (rawMessage.toLowerCase().includes("invalid otp") || rawMessage.toLowerCase().includes("code")) {
        friendlyMessage = "The verification code is incorrect or expired. Please check and try again.";
      }
      setError(friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-stone-200/90 bg-white/95 p-7 sm:p-10 shadow-2xl shadow-stone-900/10 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-amber-400 border border-stone-800 shadow-md">
            {needsVerification ? (
              <Mail className="h-5 w-5 text-amber-400" />
            ) : mode === "forgot" ? (
              <Lock className="h-5 w-5 text-amber-400" />
            ) : (
              <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Maison Atelier Portal
            </p>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              {needsVerification
                ? "Verify Atelier Email"
                : mode === "signin"
                ? "Atelier Sign In"
                : mode === "signup"
                ? "Create Atelier Account"
                : "Reset Password"}
            </h1>
          </div>
        </div>

        {needsVerification || mode === "forgot" ? (
          <button
            type="button"
            onClick={() => {
              setNeedsVerification(false);
              setMode("signin");
              setError(null);
              setNotice(null);
            }}
            className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-mono text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            title="Back to Sign In"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>
        ) : null}
      </div>

      {/* Segmented Sign In / Sign Up Toggle (Hidden in Verification & Forgot modes) */}
      {!needsVerification && mode !== "forgot" ? (
        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-stone-100 p-1.5 border border-stone-200/90 text-xs font-mono uppercase tracking-wider">
          {(["signin", "signup"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setError(null);
                setNotice(null);
              }}
              className={`rounded-xl py-2.5 font-semibold transition-all duration-300 cursor-pointer ${
                mode === value
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {value === "signin" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Verification View */}
        {needsVerification ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 text-center">
              <p className="text-xs text-stone-600 font-normal">
                We dispatched a 6-digit confirmation code to:
              </p>
              <p className="mt-1 font-mono text-xs font-bold text-stone-900 break-all">
                {email}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNeedsVerification(false);
                  setMode("signup");
                }}
                className="mt-2 text-[11px] font-mono uppercase tracking-wider text-amber-700 hover:text-amber-900 font-semibold underline underline-offset-2 cursor-pointer"
              >
                Wrong email? Edit address
              </button>
            </div>

            <div>
              <label htmlFor="auth-otp-input" className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
                6-Digit Security Code
              </label>
              <input
                id="auth-otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={otp}
                placeholder="123456"
                onChange={(event) => setOtp(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] text-stone-900 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-50 font-mono text-[11px] uppercase tracking-wider cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${resendCooldown > 0 ? "animate-spin" : ""}`} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
              <span className="text-[10px] font-mono text-stone-400">Expires in 15 min</span>
            </div>
          </div>
        ) : (
          /* Standard Auth Fields */
          <>
            {/* Full / Atelier Name (Sign Up only) */}
            {mode === "signup" ? (
              <div>
                <label htmlFor="auth-name-input" className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
                  Full Name / Atelier Brand
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    placeholder="Maison Atelier"
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20 pr-10"
                  />
                  <User className="absolute right-3.5 top-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                </div>
              </div>
            ) : null}

            {/* Email Address */}
            <div>
              <label htmlFor="auth-email-input" className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  placeholder="curator@atelier.com"
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20 pr-10"
                />
                <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            {mode !== "forgot" ? (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password-input" className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
                    {mode === "signup" ? "Create Password" : "Password"}
                  </label>
                  {mode === "signin" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError(null);
                        setNotice(null);
                      }}
                      className="text-[11px] font-mono text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      Forgot?
                    </button>
                  ) : null}
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="auth-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    placeholder="••••••••"
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "signup" ? (
                  <p className="mt-1 text-[10px] font-mono text-stone-400">
                    Security minimum: 6 characters
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Confirm Password (Sign Up only) */}
            {mode === "signup" ? (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-confirm-password-input" className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
                    Confirm Password
                  </label>
                  {confirmPassword.length > 0 ? (
                    <span className={`text-[10px] font-mono ${password === confirmPassword ? "text-emerald-700 font-semibold" : "text-rose-600 font-semibold"}`}>
                      {password === confirmPassword ? "✓ Match" : "✕ Mismatch"}
                    </span>
                  ) : null}
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="auth-confirm-password-input"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={confirmPassword}
                    placeholder="••••••••"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* Informational Alerts */}
        {notice ? (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800 font-medium">
            {notice}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-700 font-medium">
            {error}
          </div>
        ) : null}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.01] shadow-xl shadow-stone-900/15 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting ? (
            <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-amber-400" />
          )}
          {submitting
            ? "Processing Request..."
            : needsVerification
            ? "Verify & Enter Atelier"
            : mode === "signin"
            ? "Enter Atelier Studio"
            : mode === "signup"
            ? "Create Atelier Account"
            : "Send Reset Link"}
        </button>

        {/* Industry Trust Footnote */}
        {mode === "signup" && !needsVerification ? (
          <p className="mt-2 text-center text-[10px] text-stone-400 leading-relaxed">
            By creating an account, you agree to the vibeIt Maison Governance & Privacy Charter.
          </p>
        ) : null}
      </form>
    </div>
  );
}

