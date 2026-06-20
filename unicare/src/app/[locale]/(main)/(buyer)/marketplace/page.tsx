"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import ItemCard from "@/components/marketplace/ItemCard";
import RequestItemModal from "@/components/marketplace/request-item-modal";
import { DUMMY_ITEMS, toMarketplaceItem, type MarketplaceItem } from "./data";
import { categoriesApi } from "@/api/categories-api";
import type { CategoryResponse } from "@/types/categories";
import { chatApi } from "@/api/chat-api";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import { itemsApi } from "@/api/items-api";
import AuthRequiredModal from "@/components/auth/auth-required-modal";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import {
  MdOutlineSearch,
  MdOutlineTune,
  MdOutlineFileUpload,
  MdArrowForward,
  MdOutlineInbox
} from "react-icons/md";

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
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [activeType, setActiveType] = useState<"All" | "LEND" | "SALE">("All");
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [activePrice, setActivePrice] = useState<"All" | "Free" | "Paid">("All");
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [requestedTransactionIds, setRequestedTransactionIds] = useState<string[]>([]);
  const [isRequestedStateHydrated, setIsRequestedStateHydrated] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const tAuth = useTranslations("AuthRequired");
  const t = useTranslations("Marketplace");
  const tCat = useTranslations("Categories");
  const locale = useLocale();
  const isAr = locale === "ar";

  const handleFavoriteToggle = async (itemId: string) => {
    const token = getAuthToken();
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await itemsApi.toggleFavorite(itemId, token);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? { ...item, isFavorited: res.isFavorited }
            : item
        )
      );
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to update favorite status.");
    }
  };

  /* ─── Fetch items from API ─── */
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, activeCategoryId, activeType, activeStatus, activePrice]);

  useEffect(() => {
    let cancelled = false;
    async function fetchCategories() {
      try {
        const list = await categoriesApi.getAll();
        if (!cancelled) {
          // console.log("Marketplace - Fetched categories:", list.map(x => ({ id: x.id, name: x.name })));
          setCategories(list);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        const apiItems = await itemsApi.getAll();
        if (!cancelled) {
          const mapped = apiItems.map(item => toMarketplaceItem(item, locale));
          // console.log("Marketplace - Fetched and mapped items:", mapped.map(x => ({ title: x.title, categoryId: x.categoryId, category: x.category })));
          setItems(mapped);
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
    // console.log("Marketplace - Filtering items with activeCategoryId:", activeCategoryId);

    return items.filter((item) => {
      const matchesCategory =
        activeCategoryId === "All" || item.categoryId === activeCategoryId;

      const matchesQuery = query.length === 0
        ? true
        : [item.title, item.category].some((field) =>
          field.toLowerCase().includes(query)
        );

      const matchesType = activeType === "All" || item.type === activeType;

      const matchesStatus =
        activeStatus === "All" || item.status?.toLowerCase() === activeStatus.toLowerCase();

      const isFree = item.price === "Free" || item.price === 0 || item.price === 0.01;
      const matchesPrice =
        activePrice === "All"
          ? true
          : activePrice === "Free"
            ? isFree
            : !isFree;

      return (
        matchesCategory &&
        matchesQuery &&
        matchesType &&
        matchesStatus &&
        matchesPrice
      );
    });
  }, [activeCategoryId, activePrice, activeStatus, activeType, searchQuery, items]);

  const slicedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  return (
    <div className={cn("bg-neutral-50 min-h-screen pt-36 pb-20 px-4 md:px-8", isAr ? "text-right" : "text-left")}>
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 mb-2">{t("title")}</h1>
          <p className="text-lg text-neutral-500 max-w-2xl italic">
            {t("subtitle")}
          </p>
        </div>

        {/* Search & Filters Row */}
        <div className={cn("flex flex-col md:flex-row gap-4 mb-8", isAr ? "md:flex-row-reverse" : "")}>
          <div className="relative grow">
            <MdOutlineSearch className={cn("absolute top-1/2 -translate-y-1/2 text-neutral-400 text-xl", isAr ? "right-4" : "left-4")} />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={cn(
                "w-full bg-white border border-neutral-200 rounded-2xl py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm",
                isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
              )}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={cn(
              "flex items-center justify-center gap-2 bg-white border border-neutral-200 rounded-2xl px-8 py-4 font-bold text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm cursor-pointer",
              isAr ? "flex-row-reverse" : ""
            )}
          >
            <MdOutlineTune className="text-xl" />
            {t("filters")}
          </button>
        </div>

        {/* Post Resource CTA */}
        <Link
          href="/post"
          className={cn(
            "flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-2xl py-4 px-6 font-bold transition-all mb-8 cursor-pointer group",
            isAr ? "flex-row-reverse" : ""
          )}
        >
          <MdOutlineFileUpload className="text-xl" />
          {t("postResourceCta")}
        </Link>

        {showFilters && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 items-start", isAr ? "text-right" : "text-left")}>
              {/* Listing Type Filter */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t("listingType")}</span>
                <div className="flex h-11 p-1 bg-neutral-100/80 rounded-xl border border-neutral-200/50">
                  {(["All", "LEND", "SALE"] as const).map((typeOption) => (
                    <button
                      key={typeOption}
                      type="button"
                      onClick={() => setActiveType(typeOption)}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${activeType === typeOption
                        ? "bg-white text-primary shadow-xs"
                        : "text-neutral-500 hover:text-neutral-800"
                        }`}
                    >
                      {typeOption === "All" ? t("all") : typeOption === "LEND" ? t("lend") : t("sale")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t("price")}</span>
                <div className="flex h-11 p-1 bg-neutral-100/80 rounded-xl border border-neutral-200/50">
                  {(["All", "Free", "Paid"] as const).map((priceOption) => (
                    <button
                      key={priceOption}
                      type="button"
                      onClick={() => setActivePrice(priceOption)}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${activePrice === priceOption
                        ? "bg-white text-primary shadow-xs"
                        : "text-neutral-500 hover:text-neutral-800"
                        }`}
                    >
                      {priceOption === "All" ? t("all") : priceOption === "Free" ? t("free") : t("paid")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t("availability")}</span>
                <div className="flex flex-wrap gap-1.5 min-h-11 items-center">
                  {["All", "Available", "Draft", "Rented", "Unavailable"].map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setActiveStatus(statusOption)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${activeStatus === statusOption
                        ? "bg-primary border-primary text-white shadow-xs"
                        : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
                        }`}
                    >
                      {statusOption === "All" ? t("all") : statusOption === "Available" ? t("available") : statusOption === "Draft" ? t("draft") : statusOption === "Rented" ? t("rented") : t("unavailable")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className={cn("flex items-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar", isAr ? "flex-row-reverse" : "")}>
          <button
            type="button"
            onClick={() => setActiveCategoryId("All")}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${activeCategoryId === "All"
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary/40"
              }`}
          >
            {t("allCategories")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryId(cat.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${activeCategoryId === cat.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary/40"
                }`}
            >
              {tCat.has(cat.name) ? tCat(cat.name) : cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-neutral-500 font-medium">{t("loading")}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <MdOutlineInbox className="text-6xl text-neutral-300" />
            <p className="text-neutral-500 font-medium text-lg">{t("noResources")}</p>
            <p className="text-neutral-400 text-sm">{t("noResourcesSub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {slicedItems.map((item) => (
              <ItemCard
                key={item.id}
                {...item}
                isRequested={requestedTransactionIds.includes(item.transactionId)}
                onRequestClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true);
                  } else {
                    setSelectedItem(item);
                  }
                }}
                onFavoriteClick={handleFavoriteToggle}
              />
            ))}
          </div>
        )}

        {/* Pagination/Load More */}
        {!isLoading && filteredItems.length > visibleCount && (
          <div className="flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className={cn(
                "group flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-10 py-4 font-bold text-neutral-800 hover:border-primary/60 transition-all shadow-sm cursor-pointer",
              )}
            >
              {t("viewMore")}
              <MdArrowForward className={cn("transition-transform inline-block", isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
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

      {showAuthModal && (
        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title={tAuth("marketplaceTitle")}
          description={tAuth("marketplaceDesc")}
          redirectTo="/marketplace"
        />
      )}
    </div>
  );
}
