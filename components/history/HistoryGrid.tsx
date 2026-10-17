"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, LoaderCircle, AlertTriangle } from "lucide-react";
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
        setError(result.error ?? "Unable to load gallery.");
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

  return (
    <div className="min-h-screen bg-slate-950">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold text-white">Generation gallery</h1>
            <p className="mt-2 text-sm text-slate-400">
              Every look you have composed, ready to download or curate.
            </p>
          </div>

          {!fetching && items.length > 0 ? (
            <div className="flex items-center gap-2">
              {confirmClear ? (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span className="text-rose-200">Delete all {items.length} items?</span>
                  <button
                    type="button"
                    disabled={clearing}
                    onClick={() => void handleClearAll()}
                    className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 font-semibold text-white transition-all hover:bg-rose-600 disabled:opacity-50"
                  >
                    {clearing ? <LoaderCircle className="h-3 w-3 animate-spin" /> : null}
                    Yes, clear all
                  </button>
                  <button
                    type="button"
                    disabled={clearing}
                    onClick={() => setConfirmClear(false)}
                    className="rounded-full border border-slate-700 px-3 py-1 font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-300 transition-all duration-200 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear gallery
                </button>
              )}
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="mt-6 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        ) : null}

        {fetching || loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-slate-900" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center text-slate-400">
            No fittings yet. Generate a look in the studio to fill this ledger.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const isDeleting = deletingId === item.id;

              return (
                <article
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition-all duration-200 ${
                    isDeleting ? "opacity-40" : "hover:border-slate-700"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.result_url}
                      alt="Generated try-on"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />

                    {/* Quick delete overlay button on top-right */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => void handleDeleteItem(item.id)}
                      title="Delete look"
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-slate-300 backdrop-blur transition-all duration-200 hover:bg-rose-500 hover:text-white disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-rose-300" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="flex gap-2">
                      <img
                        src={item.original_person_url}
                        alt="Portrait input"
                        title="Portrait input"
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-800"
                      />
                      <img
                        src={item.garment_url}
                        alt="Garment input"
                        title="Garment input"
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => void handleDeleteItem(item.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-rose-400 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/10 disabled:opacity-50"
                        title="Delete record"
                      >
                        {isDeleting ? (
                          <LoaderCircle className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        Delete
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void downloadImageAsset(item.result_url, `vibelt-${item.id}.png`)
                        }
                        className="inline-flex items-center gap-1 rounded-full bg-teal-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:bg-teal-300"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        Download
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
