"use client";

import { useAuth } from "@/hooks/useAuth";
import LoansSection from "@/components/profile/LoansSection";

export default function LoansPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <LoansSection userId={user.id} isActive={true} />;
}
