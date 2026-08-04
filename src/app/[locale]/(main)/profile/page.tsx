"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function ProfileIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile/borrows");
  }, [router]);

  return (
    <div className="py-8 text-center text-sm text-neutral-500">
      Loading borrows...
    </div>
  );
}
