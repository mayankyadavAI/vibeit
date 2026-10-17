"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Layers } from "lucide-react";

interface LookbookItem {
  id: string;
  title: string;
  designer: string;
  category: string;
  portraitSrc: string;
  garmentSrc: string;
  resultSrc: string;
  details: string[];
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: "look-1",
    title: "Sculpted Silk Evening Ensemble",
    designer: "Maison Atelier Paris",
    category: "Haute Couture",
    portraitSrc: "/samples/portfolio/small_clothes_02_1a91c0fa5f.png",
    garmentSrc: "/samples/garment/small_clothes_reference_full_body_05_6364e97f94.png",
    resultSrc: "/sample_result.png",
    details: ["Liquid silk micro-drape", "Contour shadow matching", "Full-length geometry"],
  },
  {
    id: "look-2",
    title: "Tailored Noir Silhouette",
    designer: "Vanguard Studio Milan",
    category: "Prêt-à-Porter",
    portraitSrc: "/samples/portfolio/small_clothes_01_10be1e1a9b.png",
    garmentSrc: "/samples/garment/small_clothes_reference_full_body_06_ec697568e1.png",
    resultSrc: "/samples/portfolio/small_clothes_01_10be1e1a9b.png",
    details: ["Structured shoulder matrix", "Specular wool reflection", "Sub-second synthesis"],
  },
  {
    id: "look-3",
    title: "Avant-Garde Architectural Coat",
    designer: "Kura Studio Tokyo",
    category: "Editorial",
    portraitSrc: "/samples/portfolio/small_clothes_04_441e848298.png",
    garmentSrc: "/samples/garment/small_clothes_reference_full_body_09_e7651cae37.png",
    resultSrc: "/samples/portfolio/small_clothes_04_441e848298.png",
    details: ["Oversized drape physics", "Biometric lighting lock", "Master 4K pipeline"],
  },
];

export function RunwayShowcase() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", "Haute Couture", "Prêt-à-Porter", "Editorial"];

  const filtered =
    activeTab === "All"
      ? LOOKBOOK_ITEMS
      : LOOKBOOK_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="runway" className="scroll-mt-24 relative px-4 py-24 sm:px-8 border-t border-stone-200/80">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-stone-800" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-800 font-semibold">
                Curated Runway
              </span>
            </div>
            <h2 className="mt-5 font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-stone-950">
              The Digital
              <span className="block font-editorial italic text-stone-700">
                Lookbook Gallery.
              </span>
            </h2>
            <p className="mt-4 text-base text-stone-600 font-normal">
              Explore fittings synthesized entirely via vibeIt neural topology. Photoreal fabric physics meets editorial elegance.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === cat
                    ? "bg-stone-900 text-white font-semibold shadow-sm"
                    : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:text-stone-950"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="glass-card group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 shadow-sm hover:border-stone-400 hover:shadow-xl transition-all"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                <img
                  src={item.portraitSrc}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Garment inset overlay thumbnail */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white/95 p-1.5 pr-3 shadow-lg backdrop-blur-md">
                  <img
                    src={item.garmentSrc}
                    alt="Source Garment"
                    className="h-10 w-10 rounded-xl object-cover ring-1 ring-stone-200"
                  />
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500 font-semibold">Garment Source</p>
                    <p className="text-[11px] font-bold text-stone-900 truncate max-w-[120px]">{item.category}</p>
                  </div>
                </div>

                {/* Category Pill */}
                <div className="absolute top-4 right-4 z-20 rounded-full border border-stone-200 bg-white/95 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-stone-800 font-medium backdrop-blur-md shadow-sm">
                  {item.category}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold">
                    {item.designer}
                  </p>
                  <h3 className="mt-1 font-editorial text-2xl font-bold text-stone-900 group-hover:text-stone-950 transition-colors">
                    {item.title}
                  </h3>

                  <ul className="mt-4 flex flex-col gap-1.5">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-xs text-stone-600 font-normal">
                        <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100">
                  <Link
                    href="/studio"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-stone-50 py-3 text-xs font-semibold uppercase tracking-wider text-stone-800 transition-all duration-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-sm"
                  >
                    Open in Studio
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
