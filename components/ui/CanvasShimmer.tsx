"use client";

import { Sparkles, Cpu, Layers, Zap } from "lucide-react";

interface CanvasShimmerProps {
  status: string;
}

export function CanvasShimmer({ status }: CanvasShimmerProps) {
  return (
    <div
      className="couture-bezel relative aspect-[3/4] w-full overflow-hidden shadow-2xl"
      role="status"
      aria-live="polite"
      aria-label={status}
    >
      <div className="relative h-full w-full rounded-[1.4rem] overflow-hidden bg-white/95 border border-stone-200 flex flex-col items-center justify-between p-8 text-center shadow-inner">
        {/* Background Radial Light */}
        <div className="pointer-events-none absolute inset-0 bg-mesh-radial opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-20" />

        {/* Top HUD Telemetry */}
        <div className="relative z-20 flex w-full items-center justify-between text-[10px] font-mono uppercase tracking-widest text-stone-600 border-b border-stone-200/80 pb-3">
          <span className="flex items-center gap-1.5 text-stone-900 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Neural Ingestion Active
          </span>
          <span className="text-stone-700 font-semibold">4K Tensor Matrix</span>
        </div>

        {/* Sweeping Laser Scan Line */}
        <div className="pointer-events-none absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-amber-500/15 to-transparent shadow-[0_0_30px_rgba(180,140,54,0.15)] animate-neural-sweep" />

        {/* Center Animated Hologram / Gyro Rings */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="relative flex h-24 w-24 items-center justify-center">
            {/* Outer pulsating ring */}
            <div className="absolute inset-0 rounded-full border border-stone-300 animate-ping opacity-30" />
            <div className="absolute inset-1 rounded-full border border-dashed border-amber-600/40 animate-spin" style={{ animationDuration: "8s" }} />
            <div className="absolute inset-3 rounded-full border border-stone-200" />
            
            {/* Center icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-amber-400 border border-stone-800 shadow-xl shadow-stone-900/15">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <p className="font-editorial text-2xl font-bold text-stone-900 tracking-tight">
              {status}
            </p>
            <p className="mt-2 text-xs font-mono text-stone-600 tracking-wider uppercase font-medium">
              Computing gravity drape • Specular lighting synthesis
            </p>
          </div>
        </div>

        {/* Bottom HUD Details */}
        <div className="relative z-20 flex w-full items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-widest text-stone-600 pt-3 border-t border-stone-200/80">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-stone-700" />
            Cluster Node: H100
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-stone-700" />
            Zero-Shot Topology
          </span>
        </div>
      </div>
    </div>
  );
}
