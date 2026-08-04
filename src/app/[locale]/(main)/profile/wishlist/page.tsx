"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import ItemCard from "@/components/marketplace/ItemCard";
import {
  toMarketplaceItem,
  type MarketplaceItem,
} from "@/app/[locale]/(main)/(buyer)/marketplace/data";
import { itemsApi } from "@/api/items-api";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import { useLocale } from "next-intl";
import { MdOutlineFavoriteBorder, MdArrowForward } from "react-icons/md";

export default function ProfileWishlistPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const locale = useLocale();
  const isAr = locale === "ar";

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setIsLoading(false);
      setItems([]);
      return;
    }

    let cancelled = false;

    async function fetchWishlist() {
      const token = getAuthToken();
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const apiItems = await itemsApi.getAll(token);
        if (!cancelled) {
          const favorited = apiItems
            .filter((item) => item.isFavorited)
            .map((item) => toMarketplaceItem(item, locale));
          setItems(favorited);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchWishlist();
    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, isAuthenticated, locale]);

  const handleFavoriteToggle = async (itemId: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await itemsApi.toggleFavorite(itemId, token);
      if (!res.isFavorited) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
      }
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to update favorite status.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">
          {isAr ? "المفضلة" : "Wishlist"}
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          {isAr ? "الموارد التي أضفتها إلى المفضلة" : "Resources you've saved for later."}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-xs font-medium text-neutral-500">
            {isAr ? "جاري تحميل العناصر المفضلة..." : "Loading wishlist items..."}
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 py-16 text-center">
          <MdOutlineFavoriteBorder className="text-5xl text-neutral-300" />
          <p className="text-base font-bold text-neutral-700">
            {isAr ? "لا توجد عناصر في المفضلة" : "No favorites yet"}
          </p>
          <p className="max-w-xs text-xs text-neutral-400">
            {isAr ? "احفظ العناصر من المتجر لتظهر هنا." : "Save items from the marketplace to view them here."}
          </p>
          <Link
            href="/marketplace"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-primary/90"
          >
            {isAr ? "تصفح المتجر" : "Browse Marketplace"}
            <MdArrowForward className={`text-sm ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} {...item} onFavoriteClick={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
