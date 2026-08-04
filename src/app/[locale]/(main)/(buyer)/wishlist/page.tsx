"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function WishlistRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile/wishlist");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 pt-28">
      <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
}
