"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Sparkles, X, Wand2, Compass } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

const landingLinks = [
  { href: "/#features", label: "Capabilities" },
  { href: "/#steps", label: "Atelier Protocol" },
  { href: "/#runway", label: "Lookbook" },
  { href: "/#pricing", label: "Maison Tiers" },
];

export function AppNav() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isLanding = pathname === "/";

  const onGetStarted = () => {
    if (loading) return;
    router.push(user ? "/studio" : "/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/85 backdrop-blur-2xl shadow-[0_4px_20px_-5px_rgba(15,23,42,0.03)] transition-all duration-300">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand Monogram & Title */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 border border-stone-800 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
              vibeIt
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-500 -mt-1 font-semibold">
              Atelier Paris
            </span>
          </div>
        </Link>

        {/* Center Links with High-End Editorial Spacing */}
        <ul className="hidden items-center gap-8 text-xs uppercase tracking-[0.18em] font-semibold text-stone-700 md:flex">
          {isLanding
            ? landingLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="relative py-1 text-stone-700 transition-colors hover:text-stone-950 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-stone-900 after:transition-all hover:after:w-full"
                  >
                    {link.label}
                  </a>
                </li>
              ))
            : (
                <>
                  <li>
                    <Link
                      href="/studio"
                      className={`relative py-1 transition-colors hover:text-stone-950 ${
                        pathname === "/studio" ? "text-stone-950 font-bold after:w-full" : "text-stone-600"
                      } after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-stone-900 after:transition-all hover:after:w-full`}
                    >
                      Studio Workspace
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/history"
                      className={`relative py-1 transition-colors hover:text-stone-950 ${
                        pathname === "/history" ? "text-stone-950 font-bold after:w-full" : "text-stone-600"
                      } after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-stone-900 after:transition-all hover:after:w-full`}
                    >
                      Gallery Archive
                    </Link>
                  </li>
                </>
              )}
        </ul>

        {/* Right Status Beacon & CTAs */}
        <div className="flex items-center gap-4">

          {loading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-stone-200" aria-hidden="true" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void signOut()}
                className="hidden rounded-full border border-stone-200 bg-white px-4 py-2 text-xs uppercase tracking-wider font-semibold text-stone-700 transition-all duration-300 hover:border-stone-400 hover:text-stone-950 sm:inline-flex cursor-pointer shadow-xs"
              >
                Sign out
              </button>
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-stone-800 transition-all duration-300 hover:scale-[1.02] border border-stone-800 cursor-pointer"
              >
                <Wand2 className="h-3.5 w-3.5 text-amber-400" />
                Enter Studio
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-full border border-stone-200 bg-white px-4 py-2 text-xs uppercase tracking-wider font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-950 sm:inline-flex shadow-xs"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-stone-800 transition-all duration-300 hover:scale-[1.02] border border-stone-800 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Experience Fitting
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white p-2 text-stone-700 transition-colors hover:border-stone-400 md:hidden cursor-pointer"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open ? (
        <div className="border-t border-stone-200 bg-white/98 px-6 py-6 shadow-xl backdrop-blur-2xl md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-semibold tracking-wider uppercase text-stone-700">
            {(isLanding
              ? landingLinks
              : [
                  { href: "/studio", label: "Studio Workspace" },
                  { href: "/history", label: "Lookbook Gallery" },
                ]
            ).map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-2 text-stone-800 hover:text-rose-600 transition-colors border-b border-stone-100"
                >
                  {link.label}
                  <Compass className="h-4 w-4 text-stone-500" />
                </a>
              </li>
            ))}
            {user ? (
              <li className="pt-2">
                <button
                  type="button"
                  className="w-full py-2.5 text-left text-sm font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                >
                  Sign out
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
