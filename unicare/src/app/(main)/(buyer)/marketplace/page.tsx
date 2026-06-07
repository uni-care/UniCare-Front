"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import ItemCard from "@/components/marketplace/ItemCard";
import RequestItemModal from "@/components/marketplace/request-item-modal";
import { CATEGORIES, DUMMY_ITEMS, toMarketplaceItem, type MarketplaceItem } from "./data";
import { chatApi } from "@/features/chat/api/chat-api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { itemsApi } from "@/features/items/api/items-api";

const REQUESTED_TRANSACTIONS_STORAGE_KEY = "marketplace-requested-transactions";
const REQUESTED_ITEMS_STORAGE_KEY = "marketplace-requested-items";

interface RequestedItemRecord {
  transactionId: string;
  itemTitle: string;
  chatId: string;
  requestedAt: string;
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState(CATEGORIES[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeType, setActiveType] = useState<"All" | "LEND" | "SALE">("All");
  const [activeStatus, setActiveStatus] = useState<"All" | "Available Now" | "Low Stock">("All");
  const [activePrice, setActivePrice] = useState<"All" | "Free" | "Paid">("All");
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [requestedTransactionIds, setRequestedTransactionIds] = useState<string[]>([]);
  const [isRequestedStateHydrated, setIsRequestedStateHydrated] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  /* ─── Fetch items from API ─── */
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        const apiItems = await itemsApi.getAll();
        if (!cancelled) {
          setItems(apiItems.map(toMarketplaceItem));
        }
      } catch (error) {
        console.error("Failed to fetch marketplace items:", error);
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchItems();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REQUESTED_TRANSACTIONS_STORAGE_KEY);
      if (!raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRequestedTransactionIds([]);
        setIsRequestedStateHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        setRequestedTransactionIds([]);
        setIsRequestedStateHydrated(true);
        return;
      }

      const values = parsed.filter((value): value is string => typeof value === "string" && value.length > 0);
      setRequestedTransactionIds(values);
    } catch {
      setRequestedTransactionIds([]);
    } finally {
      setIsRequestedStateHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isRequestedStateHydrated) {
      return;
    }

    localStorage.setItem(REQUESTED_TRANSACTIONS_STORAGE_KEY, JSON.stringify(requestedTransactionIds));
  }, [isRequestedStateHydrated, requestedTransactionIds]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesDepartment =
        activeDepartment === "All Departments" || item.department === activeDepartment;

      const matchesQuery = query.length === 0
        ? true
        : [item.title, item.category, item.department].some((field) =>
          field.toLowerCase().includes(query)
        );

      const matchesType = activeType === "All" || item.type === activeType;

      const matchesStatus =
        activeStatus === "All" || item.status === activeStatus;

      const isFree = item.price === "Free" || item.price === 0;
      const matchesPrice =
        activePrice === "All"
          ? true
          : activePrice === "Free"
            ? isFree
            : !isFree;

      return (
        matchesDepartment &&
        matchesQuery &&
        matchesType &&
        matchesStatus &&
        matchesPrice
      );
    });
  }, [activeDepartment, activePrice, activeStatus, activeType, searchQuery, items]);

  return (
    <div className="bg-neutral-50 min-h-screen pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 mb-2">Marketplace</h1>
          <p className="text-lg text-neutral-500 max-w-2xl italic">
            Discover, share, and trade engineering resources with your trusted community.
          </p>
        </div>

        {/* Search & Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">search</span>
            <input
              type="text"
              placeholder="Search resources, textbooks, tools..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center justify-center gap-2 bg-white border border-neutral-200 rounded-2xl px-8 py-4 font-bold text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
            Filters
          </button>
        </div>

        {/* Post Resource CTA */}
        <Link
          href="/post"
          className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-2xl py-4 px-6 font-bold transition-all mb-8 cursor-pointer group"
        >
          <span className="material-symbols-outlined text-xl">upload_file</span>
          Post a Resource
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>

        {showFilters && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-600">
                Listing Type
                <select
                  value={activeType}
                  onChange={(event) => setActiveType(event.target.value as typeof activeType)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700"
                >
                  <option value="All">All</option>
                  <option value="LEND">Lend</option>
                  <option value="SALE">Sale</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-600">
                Availability
                <select
                  value={activeStatus}
                  onChange={(event) => setActiveStatus(event.target.value as typeof activeStatus)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700"
                >
                  <option value="All">All</option>
                  <option value="Available Now">Available Now</option>
                  <option value="Low Stock">Low Stock</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-600">
                Price
                <select
                  value={activePrice}
                  onChange={(event) => setActivePrice(event.target.value as typeof activePrice)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700"
                >
                  <option value="All">All</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveDepartment(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${activeDepartment === cat
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary/40"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-neutral-500 font-medium">Loading resources...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-6xl text-neutral-300">inventory_2</span>
            <p className="text-neutral-500 font-medium text-lg">No resources found</p>
            <p className="text-neutral-400 text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                {...item}
                isRequested={requestedTransactionIds.includes(item.transactionId)}
                onRequestClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}

        {/* Pagination/Load More */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="flex justify-center">
            <button className="group flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-10 py-4 font-bold text-neutral-800 hover:border-primary/60 transition-all shadow-sm cursor-pointer">
              View More Resources
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      <RequestItemModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSubmitting={isSubmittingRequest}
        onSubmit={async ({ duration, note }) => {
          if (!selectedItem) {
            return false;
          }

          if (!user?.id) {
            toast.error("Please sign in to send a request.");
            router.push("/login");
            return false;
          }

          if (!duration.trim()) {
            toast.error("Please enter how long you need this item.");
            return false;
          }

          if (selectedItem.ownerId === user.id) {
            toast.error("You cannot request your own item.");
            return false;
          }

          if (requestedTransactionIds.includes(selectedItem.transactionId)) {
            toast.error("This item is already requested.");
            return false;
          }

          setIsSubmittingRequest(true);
          try {
            const chat = await chatApi.getOrCreateForTransaction({
              transactionId: selectedItem.transactionId,
              ownerId: selectedItem.ownerId,
              requesterId: user.id,
            });

            if (!chat.chatId) {
              throw new Error("Unable to start chat for this request.");
            }

            const firstMessage = note.trim()
              ? `Hi! I'd like to request "${selectedItem.title}" for ${duration.trim()}. ${note.trim()}`
              : `Hi! I'd like to request "${selectedItem.title}" for ${duration.trim()}.`;

            await chatApi.sendMessage(chat.chatId, {
              senderId: user.id,
              body: firstMessage,
            });

            setRequestedTransactionIds((prev) =>
              prev.includes(selectedItem.transactionId) ? prev : [...prev, selectedItem.transactionId]
            );

            const existingRaw = localStorage.getItem(REQUESTED_ITEMS_STORAGE_KEY);
            const existingItems: RequestedItemRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
            const alreadySaved = existingItems.some((entry) => entry.transactionId === selectedItem.transactionId);

            if (!alreadySaved) {
              localStorage.setItem(
                REQUESTED_ITEMS_STORAGE_KEY,
                JSON.stringify([
                  ...existingItems,
                  {
                    transactionId: selectedItem.transactionId,
                    itemTitle: selectedItem.title,
                    chatId: chat.chatId,
                    requestedAt: new Date().toISOString(),
                  },
                ])
              );
            }

            toast.success("Request sent. Opening chat...");
            router.push(`/chat?chatId=${chat.chatId}&itemTitle=${encodeURIComponent(selectedItem.title)}`);
            return true;
          } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to send request.";
            toast.error(message);
            return false;
          } finally {
            setIsSubmittingRequest(false);
          }
        }}
      />
    </div>
  );
}
