"use client";

import { Check, Sparkles, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Atelier Discovery",
    price: "$0",
    cadence: "complimentary exploration",
    description: "Experience the neural drape engine with essential fitting credits.",
    featured: false,
    badge: "Free Access",
    features: [
      "3 Photoreal fittings / month",
      "Upper-body silhouette mapping",
      "Standard studio resolution (720p)",
      "7-day lookbook ledger retention",
      "Access to trial model presets",
    ],
  },
  {
    name: "Maison Signature",
    price: "$29",
    cadence: "per creator / month",
    description: "The premier tier for independent fashion designers, stylists, and digital creators.",
    featured: true,
    badge: "Most Coveted",
    features: [
      "120 Photoreal fittings / month",
      "Full-body, upper & lower zone precision",
      "4K Ultra-HDR master asset pipeline",
      "Permanent private gallery archive",
      "Priority GPU neural tensor allocation",
      "Skin-true ray alignment calibration",
    ],
  },
  {
    name: "Haute Couture",
    price: "$99",
    cadence: "per brand / month",
    description: "Designed for commercial fashion houses, agency teams, and enterprise lookbooks.",
    featured: false,
    badge: "Maison Enterprise",
    features: [
      "Unlimited photoreal fittings",
      "Custom brand garment library integration",
      "Multi-seat collaborative workspace",
      "Instant batch lookbook processing",
      "Dedicated neural cluster & SLA",
      "Direct API integration access",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 relative px-4 py-24 sm:px-8 border-t border-stone-200/80 bg-mesh-radial">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 shadow-sm">
            <Crown className="h-3.5 w-3.5 text-stone-800" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-800 font-semibold">
              Maison Memberships
            </span>
          </div>
          <h2 className="mt-5 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950">
            Curated Access for
            <span className="block font-editorial italic text-stone-700">
              Every Fashion Horizon.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-stone-600 max-w-2xl font-normal">
            Transparent pricing with zero hidden fees. Scale your digital fashion pipeline without physical photoshoot budgets.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 transition-all duration-300 ${
                tier.featured
                  ? "bg-white border-2 border-stone-900 shadow-xl scale-100 md:-translate-y-3 z-10"
                  : "glass-card border border-stone-200/80 shadow-sm"
              }`}
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-stone-900">{tier.name}</h3>
                    <p className="mt-1 text-xs text-stone-500 font-normal">{tier.description}</p>
                  </div>
                  {tier.featured ? (
                    <span className="rounded-full bg-stone-900 px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest font-semibold text-amber-400 border border-stone-800 shadow-sm">
                      {tier.badge}
                    </span>
                  ) : (
                    <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-stone-600 font-semibold">
                      {tier.badge}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-editorial text-5xl font-bold text-stone-950 tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">
                    {tier.cadence}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="mt-8 flex flex-col gap-3.5 text-xs sm:text-sm text-stone-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 font-normal">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-800 ring-1 ring-stone-200 mt-0.5">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-10 pt-6 border-t border-stone-200/80">
                  <Link
                    href="/login"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                      tier.featured
                        ? "bg-stone-900 text-white hover:bg-stone-800 border border-stone-800 shadow-lg shadow-stone-900/10"
                        : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-sm"
                    }`}
                  >
                    Select {tier.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Confidence Assurance Strip */}
        <div className="mt-16 text-center text-xs font-mono text-stone-500 font-semibold flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          <span>🔒 ENCRYPTED ASSET STORAGE</span>
          <span>⚡ INSTANT ACTIVATION</span>
          <span>💎 NO COMMITMENT • CANCEL ANYTIME</span>
        </div>
      </div>
    </section>
  );
}
