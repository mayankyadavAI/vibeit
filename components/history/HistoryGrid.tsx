"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, LoaderCircle, AlertTriangle, Sparkles, Filter, Layers } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchUserHistory,
  deleteTryOnGeneration,
  clearAllUserHistory,
} from "@/app/actions/history";
import { downloadImageAsset } from "@/lib/download";
import type { TryOnGeneration } from "@/types/tryon";

export function HistoryGrid() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<TryOnGeneration[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;

    const userId = user.id;

    async function load() {
      setFetching(true);
      const result = await fetchUserHistory(userId);
      if (cancelled) return;
      if (!result.success) {
        setError(result.error ?? "Unable to load archive.");
        setItems([]);
      } else {
        setItems(result.history);
      }
      setFetching(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const handleDeleteItem = async (id: string) => {
    if (!user || deletingId) return;
    setDeletingId(id);
    setError(null);

    try {
      const res = await deleteTryOnGeneration(id, user.id);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete item.");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deletion failed.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!user || clearing) return;
    setClearing(true);
    setError(null);

    try {
      const res = await clearAllUserHistory(user.id);
      if (!res.success) {
        throw new Error(res.error || "Failed to clear history.");
      }
      setItems([]);
      setConfirmClear(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Clear history failed.";
      setError(message);
    } finally {
      setClearing(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 flex flex-col bg-mesh-radial">
      <AppNav />
      <main className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-8 flex-1">
        {/* Header Strip */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end border-b border-stone-200/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 backdrop-blur-md mb-3 shadow-xs">
              <Sparkles className="h-3 w-3 text-stone-800" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-800 font-semibold">
                Private Lookbook Vault
              </span>
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
              Archive & Atelier Ledger
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 font-normal">
              Every virtual fitting composed in the studio, preserved in uncompressed high-fidelity.
            </p>
          </div>

          {!fetching && items.length > 0 ? (
            <div className="flex items-center gap-3">
              {confirmClear ? (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-300 bg-rose-50 p-2.5 text-xs shadow-sm">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span className="text-rose-900 font-semibold">Purge all {items.length} looks?</span>
                  <button
                    type="button"
                    disabled={clearing}
                    onClick={() => void handleClearAll()}
                    className="inline-flex items-center gap-1 rounded-full bg-stone-900 px-3.5 py-1 font-semibold text-white transition-all hover:bg-stone-800 disabled:opacity-50 text-xs shadow-xs"
                  >
                    {clearing ? <LoaderCircle className="h-3 w-3 animate-spin" /> : null}
                    Confirm Purge
                  </button>
                  <button
                    type="button"
                    disabled={clearing}
                    onClick={() => setConfirmClear(false)}
                    className="rounded-full border border-stone-300 bg-white px-3 py-1 font-semibold text-stone-700 hover:bg-stone-50 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold transition-all duration-200 hover:border-stone-400 hover:text-stone-950 cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Purge Vault
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Filter Pills */}
        {!fetching && items.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Looks" },
              { id: "upper_body", label: "Upper Bodice" },
              { id: "lower_body", label: "Lower Silhouette" },
              { id: "full_body", label: "Full Ensemble" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-stone-900 text-white font-semibold shadow-sm"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900 shadow-xs"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-700 font-medium">
            {error}
          </div>
        ) : null}

        {fetching || loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-3xl bg-white border border-stone-200 shadow-sm" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 bg-white/80 px-6 py-24 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 mb-5 shadow-sm">
              <Layers className="h-7 w-7" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900">Your Atelier Vault is Pristine</h3>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-stone-500 font-normal">
              No virtual fittings archived yet. Launch the studio workspace to compose and drape your first garment.
            </p>
            <button
              type="button"
              onClick={() => router.push("/studio")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xl shadow-stone-900/15 transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Open Studio Workspace
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const isDeleting = deletingId === item.id;

              return (
                <article
                  key={item.id}
                  className={`glass-card group relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 transition-all duration-300 shadow-sm hover:border-stone-400 hover:shadow-xl ${
                    isDeleting ? "opacity-30" : ""
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.result_url}
                      alt="Generated try-on"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Zone Badge */}
                    <div className="absolute top-4 left-4 z-20 rounded-full border border-stone-200 bg-white/90 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-stone-800 font-semibold shadow-xs backdrop-blur-md">
                      {item.category?.replace("_", " ") || "Full Body"}
                    </div>

                    {/* Quick delete overlay button on top-right */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => void handleDeleteItem(item.id)}
                      title="Delete look"
                      className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-600 backdrop-blur-md border border-stone-200 shadow-xs transition-all duration-200 hover:bg-stone-900 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                      {isDeleting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-stone-600" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-5 border-t border-stone-200/80 bg-stone-50/80">
                    <div className="flex gap-2">
                      <img
                        src={item.original_person_url}
                        alt="Portrait input"
                        title="Portrait input"
                        className="h-11 w-11 rounded-xl object-cover ring-1 ring-stone-300 shadow-xs"
                      />
                      <img
                        src={item.garment_url}
                        alt="Garment input"
                        title="Garment input"
                        className="h-11 w-11 rounded-xl object-cover ring-1 ring-stone-300 shadow-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          void downloadImageAsset(item.result_url, `vibeIt-${item.id}.png`)
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
                      >
                        <Download className="h-3 w-3 text-amber-400" aria-hidden="true" />
                        4K Export
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
