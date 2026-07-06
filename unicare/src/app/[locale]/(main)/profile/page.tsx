"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { DUMMY_ITEMS } from "@/app/[locale]/(main)/(buyer)/marketplace/data";
import BorrowsSection from "@/components/profile/BorrowsSection";
import LoansSection from "@/components/profile/LoansSection";
import { MdCreditCard, MdSell, MdStorefront, MdSettings } from "react-icons/md";

const REQUESTED_ITEMS_STORAGE_KEY = "marketplace-requested-items";

interface RequestedItemRecord {
  transactionId: string;
  itemTitle: string;
  chatId: string;
  requestedAt: string;
}

type ProfileSection = "borrows" | "loans" | "settings";

function ProfilePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ProfileSection>("borrows");

  const sectionParam = searchParams.get("section") as ProfileSection | null;

  useEffect(() => {
    if (sectionParam && (sectionParam === "borrows" || sectionParam === "loans" || sectionParam === "settings")) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);
  const [requestedItems] = useState<RequestedItemRecord[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = localStorage.getItem(REQUESTED_ITEMS_STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (entry): entry is RequestedItemRecord =>
          typeof entry === "object" &&
          entry !== null &&
          typeof (entry as RequestedItemRecord).transactionId === "string" &&
          typeof (entry as RequestedItemRecord).chatId === "string" &&
          typeof (entry as RequestedItemRecord).itemTitle === "string"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const requestedItemsWithImage = useMemo(() => {
    return requestedItems.map((entry) => {
      const related = DUMMY_ITEMS.find((item) => item.transactionId === entry.transactionId);
      return {
        ...entry,
        image: related?.image ?? "",
      };
    });
  }, [requestedItems]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-neutral-100 px-4 pb-10 pt-28 md:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-neutral-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 pb-12 pt-28 md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-[80px] lg:top-28 z-30 -mx-4 px-4 py-3 bg-neutral-100/95 backdrop-blur-md border-b border-neutral-200 lg:static lg:z-auto lg:mx-0 lg:px-4 lg:py-4 lg:bg-white lg:border lg:border-neutral-200 lg:rounded-3xl lg:shadow-sm lg:h-fit">
          <p className="hidden lg:block mb-4 px-2 text-sm font-bold uppercase tracking-wide text-neutral-500">Dashboard</p>
          <nav 
            className="flex flex-row overflow-x-auto gap-2 lg:flex-col lg:overflow-x-visible lg:space-y-2 pb-0.5 lg:pb-0"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            <button
              type="button"
              onClick={() => setActiveSection("borrows")}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 lg:w-full lg:px-3 text-left text-sm font-bold cursor-pointer transition-all ${
                activeSection === "borrows"
                  ? "bg-primary text-white shadow-md shadow-primary/10 lg:bg-primary/10 lg:text-primary lg:shadow-none"
                  : "text-neutral-600 hover:bg-neutral-150 bg-white lg:bg-transparent"
              }`}
            >
              <MdCreditCard className="text-[18px]" />
              My Borrows
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("loans")}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 lg:w-full lg:px-3 text-left text-sm font-bold cursor-pointer transition-all ${
                activeSection === "loans"
                  ? "bg-primary text-white shadow-md shadow-primary/10 lg:bg-primary/10 lg:text-primary lg:shadow-none"
                  : "text-neutral-600 hover:bg-neutral-150 bg-white lg:bg-transparent"
              }`}
            >
              <MdSell className="text-[18px]" />
              My Loans
            </button>
            <Link
              href="/marketplace"
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 lg:w-full lg:px-3 text-sm font-bold text-neutral-600 hover:bg-neutral-150 bg-white lg:bg-transparent transition-all"
            >
              <MdStorefront className="text-[18px]" />
              Marketplace
            </Link>
            <button
              type="button"
              onClick={() => setActiveSection("settings")}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 lg:w-full lg:px-3 text-left text-sm font-bold cursor-pointer transition-all ${
                activeSection === "settings"
                  ? "bg-primary text-white shadow-md shadow-primary/10 lg:bg-primary/10 lg:text-primary lg:shadow-none"
                  : "text-neutral-600 hover:bg-neutral-150 bg-white lg:bg-transparent"
              }`}
            >
              <MdSettings className="text-[18px]" />
              Settings
            </button>
          </nav>
        </aside>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-neutral-900">My Profile</h1>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-primary/15 bg-primary/5 px-4 py-2">
              {user.profilePictureUrl ? (
                <Image src={user.profilePictureUrl} alt={user.fullName} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-bold text-neutral-800">{user.fullName}</p>
                <p className="text-xs text-neutral-500">{user.email ?? "No email"}</p>
              </div>
            </div>
          </div>

          <section>
            {activeSection === "borrows" ? (
              <BorrowsSection items={requestedItemsWithImage} />
            ) : activeSection === "loans" ? (
              <LoansSection userId={user.id} isActive={activeSection === "loans"} />
            ) : (
              <>
                <h2 className="text-xl font-bold text-neutral-900">Settings</h2>
                <p className="mt-1 text-sm text-neutral-500">Settings options are coming soon.</p>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-100 px-4 pb-10 pt-28 md:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-neutral-500">Loading profile...</p>
          </div>
        </div>
      }
    >
      <ProfilePageClient />
    </Suspense>
  );
}
