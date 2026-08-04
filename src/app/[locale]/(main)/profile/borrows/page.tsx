"use client";

import { useAuth } from "@/hooks/useAuth";
import BorrowsSection from "@/components/profile/BorrowsSection";

export default function BorrowsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <BorrowsSection userId={user.id} isActive={true} />;
}
