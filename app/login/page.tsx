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
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 flex flex-col bg-mesh-radial">
      <AppNav />
      <main className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-8">
        <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-gradient-to-tr from-amber-200/20 via-stone-200/25 to-stone-100/20 blur-[120px]" />
        <div className="relative z-10 w-full flex justify-center">
          <AuthCard />
        </div>
      </main>
    </div>
  );
}
