"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { insforge } from "@/utils/insforge";
import { useAuth } from "@/components/providers/AuthProvider";

type Mode = "signin" | "signup";

export function AuthCard() {
  const router = useRouter();
  const { refresh, setUser } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      if (needsVerification) {
        const { data, error: verifyError } = await insforge.auth.verifyEmail({
          email,
          otp,
        });
        if (verifyError) throw verifyError;
        if (data?.user) {
          goToStudio(data.user);
        } else {
          await refresh();
          router.push("/studio");
        }
        return;
      }

      if (mode === "signup") {
        const { data, error: signUpError } = await insforge.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (data?.requireEmailVerification) {
          setNeedsVerification(true);
          setNotice("Enter the 6-digit code we sent to your inbox.");
          return;
        }

        let activeUser = data?.user;
        // Fallback to sign in if access token wasn't directly issued
        if (!data?.accessToken) {
          const { data: signInData, error: signInErr } = await insforge.auth.signInWithPassword({
            email,
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

      const { data, error: signInError } = await insforge.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        const statusCode = (signInError as { statusCode?: number }).statusCode;
        if (statusCode === 403) {
          setNeedsVerification(true);
          setNotice("Email not verified yet. Enter the 6-digit code from your inbox.");
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
      
      let friendlyMessage = rawMessage || "Authentication failed. Please check your credentials.";
      if (rawMessage.toLowerCase().includes("user already exists") || errObj?.error === "AUTH_EMAIL_EXISTS") {
        friendlyMessage = "An account with this email already exists. Please switch to Sign In.";
      } else if (rawMessage.toLowerCase().includes("invalid credentials")) {
        friendlyMessage = "Invalid email or password. Please verify your credentials.";
      }
      setError(friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-stone-200/80 bg-white/95 p-8 sm:p-10 shadow-2xl shadow-stone-900/10 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-amber-400 border border-stone-800 shadow-md">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-600 font-semibold">Maison Portal</p>
          <h1 className="font-editorial text-2xl font-bold text-stone-900">
            {needsVerification ? "Verify Email" : mode === "signin" ? "Atelier Sign In" : "Register Atelier"}
          </h1>
        </div>
      </div>

      {/* Segmented Toggle */}
      <div className="mb-6 grid grid-cols-2 rounded-2xl bg-stone-100 p-1.5 border border-stone-200 text-xs font-mono uppercase tracking-wider">
        {(["signin", "signup"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value);
              setNeedsVerification(false);
              setError(null);
              setNotice(null);
            }}
            className={`rounded-xl py-2.5 font-semibold transition-all duration-300 cursor-pointer ${
              mode === value
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {value === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>


      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
          Email Address
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            placeholder="curator@atelier.com"
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20"
          />
        </label>

        {!needsVerification ? (
          <label className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
            Password
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              placeholder="••••••••"
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20"
            />
          </label>
        ) : (
          <label className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
            Verification code
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              required
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/70 px-4 py-3 tracking-[0.4em] text-center text-lg text-stone-900 outline-none transition-all duration-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/20"
            />
          </label>
        )}

        {notice ? (
          <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800 font-medium">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-700 font-medium">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.01] shadow-xl shadow-stone-900/15 disabled:opacity-60 cursor-pointer"
        >
          {submitting
            ? "Authenticating..."
            : needsVerification
            ? "Confirm Code"
            : mode === "signin"
            ? "Enter Atelier Studio"
            : "Create Atelier Account"}
        </button>
      </form>
    </div>
  );
}
