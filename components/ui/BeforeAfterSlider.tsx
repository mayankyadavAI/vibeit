"use client";

import { useCallback, useId, useRef, useState, type PointerEvent } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Original portrait",
  afterAlt = "AI virtual try-on result",
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(52);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const sliderId = useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, next)));
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    updateFromClientX(event.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden rounded-2xl bg-slate-900 shadow-2xl shadow-teal-500/10 ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Underlying layer: After (new generated image, visible on the right) */}
      <img
        src={afterSrc}
        alt={afterAlt}
        className="block h-full w-full select-none object-cover"
        draggable={false}
      />
      {/* Top layer: Before (original portrait photo, clipped from the right to stay on the left) */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />
      <div
        className="absolute inset-y-0 z-10 w-px bg-white/90 shadow-[0_0_12px_rgba(45,212,191,0.8)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-slate-950/80 text-teal-300 shadow-lg backdrop-blur">
          <span className="sr-only">Drag comparison handle</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M8 8 4 12l4 4M16 8l4 4-4 4" />
          </svg>
        </div>
      </div>
      <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-200">
        Before
      </div>
      <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-teal-400/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-950">
        After
      </div>
      <label htmlFor={sliderId} className="sr-only">
        Comparison position
      </label>
      <input
        id={sliderId}
        type="range"
        min={4}
        max={96}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-x-0 bottom-3 z-20 mx-auto h-2 w-[70%] cursor-ew-resize appearance-none rounded-full bg-white/20 accent-teal-400"
      />
    </div>
  );
}
