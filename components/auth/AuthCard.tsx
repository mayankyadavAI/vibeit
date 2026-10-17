"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { insforge } from "@/utils/insforge";
import { useAuth } from "@/components/providers/AuthProvider";

type Mode = "signin" | "signup";

export function AuthCard() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const goToStudio = async () => {
    await refresh();
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
        if (data?.accessToken || data?.user) {
          await goToStudio();
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
        if (data?.accessToken) {
          await goToStudio();
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
        await goToStudio();
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Authentication failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-teal-500/5 sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400 text-slate-950">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-slate-400">vibeIt Atelier</p>
          <h1 className="text-xl font-semibold text-white">
            {needsVerification ? "Verify your email" : mode === "signin" ? "Welcome back" : "Create your studio"}
          </h1>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 rounded-full bg-slate-950 p-1 text-sm">
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
            className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
              mode === value ? "bg-teal-400 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            {value === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="text-sm text-slate-300">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition-all duration-300 focus:border-teal-400"
          />
        </label>
        {!needsVerification ? (
          <label className="text-sm text-slate-300">
            Password
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition-all duration-300 focus:border-teal-400"
            />
          </label>
        ) : (
          <label className="text-sm text-slate-300">
            Verification code
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              required
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 tracking-[0.4em] text-white outline-none transition-all duration-300 focus:border-teal-400"
            />
          </label>
        )}

        {notice ? <p className="rounded-xl bg-teal-400/10 px-3 py-2 text-sm text-teal-200">{notice}</p> : null}
        {error ? <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:bg-teal-300 disabled:opacity-70"
        >
          {submitting ? "Verifying..." : needsVerification ? "Confirm code" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
