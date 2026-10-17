"use server";

import { insforge } from "@/utils/insforge";
import type { TryOnGeneration } from "@/types/tryon";

interface TryOnLogPayload {
  userId: string;
  category: string;
  originalPersonUrl: string;
  garmentUrl: string;
  resultUrl: string;
}

export async function logTryOnGeneration(payload: TryOnLogPayload) {
  try {
    const { data, error } = await insforge.database.from("tryon_generations").insert([
      {
        user_id: payload.userId,
        category: payload.category,
        original_person_url: payload.originalPersonUrl,
        garment_url: payload.garmentUrl,
        result_url: payload.resultUrl,
      },
    ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Ledger write failed.";
    console.error("InsForge Ledger Write Failure:", message);
    return { success: false, error: message };
  }
}

export async function fetchUserHistory(userId: string) {
  try {
    const { data, error } = await insforge.database
      .from("tryon_generations")
      .select("id, user_id, category, original_person_url, garment_url, result_url, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(48);

    if (error) throw error;
    return { success: true as const, history: (data ?? []) as TryOnGeneration[] };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "History fetch failed.";
    return { success: false as const, error: message, history: [] as TryOnGeneration[] };
  }
}

export async function deleteTryOnGeneration(id: string, userId: string) {
  try {
    const { data, error } = await insforge.database
      .from("tryon_generations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true as const, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete record.";
    console.error("InsForge Delete Error:", message);
    return { success: false as const, error: message };
  }
}

export async function clearAllUserHistory(userId: string) {
  try {
    const { data, error } = await insforge.database
      .from("tryon_generations")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true as const, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to clear history.";
    console.error("InsForge Clear All Error:", message);
    return { success: false as const, error: message };
  }
}
