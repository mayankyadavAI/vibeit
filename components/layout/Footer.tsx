import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-100/60 text-stone-700">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-8">
          {/* Brand Philosophy */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-amber-400 border border-stone-800 shadow-md">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900">
                  vibeIt Atelier
                </span>
              </div>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-stone-600 font-normal">
                Bridging haute couture craftsmanship and generative vision models. Photoreal digital fabric simulation for next-generation fashion houses.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold">
              <span>PARIS</span>
              <span className="text-stone-300">•</span>
              <span>MILANO</span>
              <span className="text-stone-300">•</span>
              <span>TOKYO</span>
              <span className="text-stone-300">•</span>
              <span>NYC</span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-900 mb-4 font-bold">
                Atelier
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-stone-600">
                <li>
                  <Link href="/studio" className="hover:text-stone-950 transition-colors">
                    Studio Workspace
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="hover:text-stone-950 transition-colors">
                    Lookbook Ledger
                  </Link>
                </li>
                <li>
                  <a href="/#runway" className="hover:text-stone-950 transition-colors">
                    Curated Runway
                  </a>
                </li>
                <li>
                  <a href="/#pricing" className="hover:text-stone-950 transition-colors">
                    Maison Memberships
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-900 mb-4 font-bold">
                Technology
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-stone-600">
                <li>
                  <a href="/#features" className="hover:text-stone-950 transition-colors">
                    Neural Topology
                  </a>
                </li>
                <li>
                  <a href="/#features" className="hover:text-stone-950 transition-colors">
                    Fabric Physics
                  </a>
                </li>
                <li>
                  <a href="/#features" className="hover:text-stone-950 transition-colors">
                    Ray Matching
                  </a>
                </li>
                <li>
                  <a href="/#steps" className="hover:text-stone-950 transition-colors">
                    Pipeline Protocol
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-900 mb-4 font-bold">
                Client Service
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-stone-600">
                <li>
                  <Link href="/login" className="hover:text-stone-950 transition-colors">
                    Maison Portal
                  </Link>
                </li>
                <li>
                  <span className="text-stone-400 cursor-not-allowed">
                    Atelier Concierge
                  </span>
                </li>
                <li>
                  <span className="text-stone-400 cursor-not-allowed">
                    Privacy Charter
                  </span>
                </li>
                <li>
                  <span className="text-stone-400 cursor-not-allowed">
                    Neural Governance
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-stone-500 font-semibold">
          <p>© 2026 vibeIt Atelier Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Neural Engine v2.4 • Photoreal Drapery Certified
          </p>
        </div>
      </div>
    </footer>
  );
}
