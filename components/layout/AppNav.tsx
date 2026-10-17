"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

const landingLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#steps", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
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
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400 text-slate-950">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          vibeIt
        </Link>

        <ul className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {isLanding
            ? landingLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-teal-300">
                    {link.label}
                  </a>
                </li>
              ))
            : (
              <>
                <li>
                  <Link href="/studio" className="transition-colors hover:text-teal-300">
                    Studio
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="transition-colors hover:text-teal-300">
                    Gallery
                  </Link>
                </li>
              </>
            )}
        </ul>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-slate-800" aria-hidden="true" />
          ) : user ? (
            <>
              <button
                type="button"
                onClick={() => void signOut()}
                className="hidden rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-teal-400 sm:inline-flex"
              >
                Sign out
              </button>
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-teal-300 hover:scale-[1.02]"
              >
                Open Studio
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-teal-300 hover:scale-[1.02]"
            >
              Get Started
            </button>
          )}
          <button
            type="button"
            className="rounded-lg border border-slate-700 p-2 text-slate-200 md:hidden"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-sm text-slate-300">
            {(isLanding ? landingLinks : [
              { href: "/studio", label: "Studio" },
              { href: "/history", label: "Gallery" },
            ]).map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="block py-1 hover:text-teal-300">
                  {link.label}
                </a>
              </li>
            ))}
            {user ? (
              <li>
                <button
                  type="button"
                  className="py-1 text-left text-slate-300 hover:text-teal-300"
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
