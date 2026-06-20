"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { DUMMY_ITEMS } from "@/app/[locale]/(main)/(buyer)/marketplace/data";

const REQUESTED_ITEMS_STORAGE_KEY = "marketplace-requested-items";

interface RequestedItemRecord {
  transactionId: string;
  itemTitle: string;
  chatId: string;
  requestedAt: string;
}

type ProfileSection = "borrows" | "loans" | "settings";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ProfileSection>("borrows");
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
      <div className="min-h-screen bg-neutral-100 px-4 pb-10 pt-36 md:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-neutral-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 pb-12 pt-36 md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="mb-4 px-2 text-sm font-bold uppercase tracking-wide text-neutral-500">Dashboard</p>
          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveSection("borrows")}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold cursor-pointer ${activeSection === "borrows" ? "bg-primary/10 font-bold text-primary" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
              My Borrows
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("loans")}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold cursor-pointer ${activeSection === "loans" ? "bg-primary/10 font-bold text-primary" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              <span className="material-symbols-outlined text-[18px]">sell</span>
              My Loans
            </button>
            <Link href="/marketplace" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Marketplace
            </Link>
            <button
              type="button"
              onClick={() => setActiveSection("settings")}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold cursor-pointer ${activeSection === "settings" ? "bg-primary/10 font-bold text-primary" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Settings
            </button>
          </nav>
        </aside>

        <main className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
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
              <>
                <h2 className="text-xl font-bold text-neutral-900">Requested Products</h2>
                <p className="mt-1 text-sm text-neutral-500">Open chat directly with owners for your requests.</p>

                {requestedItemsWithImage.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
                    You haven&apos;t requested any products yet.
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {requestedItemsWithImage.map((item) => (
                      <div key={item.transactionId} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.itemTitle} fill className="object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-neutral-400 text-2xl">image</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-neutral-800">{item.itemTitle}</p>
                          <p className="text-xs text-neutral-500">
                            Requested {new Date(item.requestedAt).toLocaleDateString()}
                          </p>
                          <Link
                            href={`/chat?chatId=${item.chatId}&itemTitle=${encodeURIComponent(item.itemTitle)}`}
                            className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white"
                          >
                            Open Chat
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : activeSection === "loans" ? (
              <>
                <h2 className="text-xl font-bold text-neutral-900">My Loans</h2>
                <p className="mt-1 text-sm text-neutral-500">There are no items in your loans yet.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-neutral-900">Settings</h2>
                <p className="mt-1 text-sm text-neutral-500">Settings options are coming soon.</p>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
