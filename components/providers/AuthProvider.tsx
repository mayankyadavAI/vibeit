"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { insforge } from "@/utils/insforge";
import type { AuthUser } from "@/types/tryon";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  refresh: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const CACHE_KEY = "vibeit_auth_user";

function getCachedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function setCachedUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(getCachedUser);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((nextUser: AuthUser | null) => {
    setUserState(nextUser);
    setCachedUser(nextUser);
  }, []);

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data?.user) {
        setUser(null);
        return null;
      }
      const current = data.user as AuthUser & { name?: string | null };
      const resolvedUser: AuthUser = {
        id: current.id,
        email: current.email,
        name: current.name ?? current.email,
      };
      setUser(resolvedUser);
      return resolvedUser;
    } catch (e) {
      console.warn("Failed to refresh current user:", e);
      return null;
    }
  }, [setUser]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      await refresh();
      if (!cancelled) setLoading(false);
    }

    void hydrate();

    // Listen to session changes from the InsForge SDK
    let unsubscribe: (() => void) | undefined;
    try {
      if (typeof insforge.auth.onAuthStateChange === "function") {
        unsubscribe = insforge.auth.onAuthStateChange((event) => {
          if (cancelled) return;
          if (event === "signedOut") {
            setUser(null);
          } else if (event === "signedIn" || event === "tokenRefreshed") {
            void refresh();
          }
        });
      }
    } catch (e) {
      console.warn("Could not register onAuthStateChange:", e);
    }

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [refresh, setUser]);

  const signOut = useCallback(async () => {
    try {
      await insforge.auth.signOut();
    } catch (e) {
      console.warn("Sign out error:", e);
    }
    setUser(null);
  }, [setUser]);

  const value = useMemo(
    () => ({ user, loading, setUser, refresh, signOut }),
    [user, loading, setUser, refresh, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

