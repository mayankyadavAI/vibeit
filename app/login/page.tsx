"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { AppNav } from "@/components/layout/AppNav";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/studio");
  }, [loading, user, router]);

  return (
    <div className="min-h-screen bg-slate-950">
      <AppNav />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <AuthCard />
      </main>
    </div>
  );
}
