import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 text-teal-400" aria-hidden="true" />
          <span className="font-semibold">vibeIt</span>
        </div>
        <p className="text-sm text-slate-400">AI virtual fittings with couture-grade precision.</p>
        <div className="flex gap-5 text-sm text-slate-400">
          <Link href="/login" className="hover:text-teal-300">
            Sign in
          </Link>
          <Link href="/studio" className="hover:text-teal-300">
            Studio
          </Link>
          <a href="/#pricing" className="hover:text-teal-300">
            Pricing
          </a>
        </div>
      </div>
    </footer>
  );
}
