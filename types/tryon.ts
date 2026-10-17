export type ApparelCategory = "upper_body" | "lower_body" | "full_body";

export interface TryOnGeneration {
  id: string;
  user_id: string;
  category: string;
  original_person_url: string;
  garment_url: string;
  result_url: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
}

export interface UploadedAsset {
  file: File;
  previewUrl: string;
  storageUrl: string | null;
  storageKey: string | null;
}
