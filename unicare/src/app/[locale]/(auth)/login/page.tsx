"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/login-form";

function LoginContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  if (isLoading || user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background-light px-4 py-32">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-light px-4 py-32">
      <LoginForm redirectTo={redirectTo} />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background-light px-4 py-32">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
