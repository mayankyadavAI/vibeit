interface CanvasShimmerProps {
  status: string;
}

export function CanvasShimmer({ status }: CanvasShimmerProps) {
  return (
    <div
      className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
      role="status"
      aria-live="polite"
      aria-label={status}
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
      <div className="absolute inset-x-8 top-10 h-24 animate-pulse rounded-2xl bg-slate-700/50" />
      <div className="absolute inset-x-16 top-40 h-40 animate-pulse rounded-full bg-slate-700/40" />
      <div className="absolute inset-x-10 bottom-16 h-48 animate-pulse rounded-3xl bg-teal-900/20" />
      <div className="relative z-10 mt-auto flex flex-col items-center gap-2 px-6 pb-10 text-center">
        <p className="text-sm font-medium text-teal-300">{status}</p>
        <p className="text-xs text-slate-400">Compiling a pixel-perfect fitting.</p>
      </div>
    </div>
  );
}
