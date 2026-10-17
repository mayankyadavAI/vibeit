import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    cadence: "to try the studio",
    featured: false,
    features: ["3 looks / month", "Upper-body fittings", "720p exports", "History for 7 days"],
  },
  {
    name: "Atelier",
    price: "$29",
    cadence: "per creator / month",
    featured: true,
    features: ["120 looks / month", "Full-body + zone control", "4K asset pipeline", "Private gallery ledger"],
  },
  {
    name: "Maison",
    price: "$99",
    cadence: "per studio / month",
    featured: false,
    features: ["Unlimited looks", "Team seats", "Brand garment libraries", "Priority generation"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-300">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A tier for every fitting room.</h2>
        </div>
        <div className="mt-10 overflow-x-auto">
          <div className="grid min-w-[720px] gap-4 md:min-w-0 md:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  tier.featured
                    ? "border-teal-400 bg-slate-900 shadow-lg shadow-teal-500/10"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <p className="mt-4 text-4xl font-semibold text-white">
                  {tier.price}
                  <span className="ml-2 text-sm font-normal text-slate-400">{tier.cadence}</span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-slate-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-teal-300" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-8 rounded-full px-4 py-2 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${
                    tier.featured
                      ? "bg-teal-400 text-slate-950 hover:bg-teal-300"
                      : "border border-slate-700 text-white hover:border-teal-400"
                  }`}
                >
                  Choose {tier.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
