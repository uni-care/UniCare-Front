"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { itemsApi } from "@/api/items-api";
import { chatApi } from "@/api/chat-api";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import RequestItemModal from "@/components/marketplace/request-item-modal";
import { toMarketplaceItem, type MarketplaceItem } from "@/app/(main)/(buyer)/marketplace/data";

import DetailGallery from "./DetailGallery";
import DetailInfo from "./DetailInfo";
import DetailSidebar from "./DetailSidebar";
import {
  MdArrowBack,
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineErrorOutline
} from "react-icons/md";

const REQUESTED_ITEMS_STORAGE_KEY = "marketplace-requested-items";

interface RequestedItemRecord {
  transactionId: string;
  itemTitle: string;
  chatId: string;
  requestedAt: string;
}

interface ItemDetailClientProps {
  initialItem: MarketplaceItem | null;
  id: string;
}

export default function ItemDetailClient({ initialItem, id }: ItemDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [item, setItem] = useState<MarketplaceItem | null>(initialItem);
  const [isLoading, setIsLoading] = useState(!initialItem);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(initialItem ? initialItem.isFavorited : false);
  const [isRequested, setIsRequested] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Client-side fetch fallback if SSR was unauthenticated or failed
  useEffect(() => {
    async function fetchItemClient() {
      if (item) return;
      try {
        setIsLoading(true);
        const rawItem = await itemsApi.getById(id);
        const mappedItem = toMarketplaceItem(rawItem);
        setItem(mappedItem);
        setIsFavorited(mappedItem.isFavorited);
      } catch (err) {
        console.error("Client fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItemClient();
  }, [id, item]);

  // Sync client states on mount
  useEffect(() => {
    if (!item) return;
    // Check if item is already requested from localStorage
    const existingRaw = localStorage.getItem(REQUESTED_ITEMS_STORAGE_KEY);
    if (existingRaw) {
      const requestedItems: RequestedItemRecord[] = JSON.parse(existingRaw);
      const alreadyRequested = requestedItems.some(
        (entry) => entry.transactionId === item.transactionId
      );
      setIsRequested(alreadyRequested);
    }
  }, [item?.transactionId, item]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!item) return;
    const token = getAuthToken();
    if (!token) {
      toast.error("Please sign in to favorite this item.");
      router.push("/login");
      return;
    }

    try {
      const originalState = isFavorited;
      setIsFavorited(!originalState); // optimistic UI

      const res = await itemsApi.toggleFavorite(item.id, token);
      setIsFavorited(res.isFavorited);
      toast.success(res.isFavorited ? "Added to favorites!" : "Removed from favorites!");
    } catch (err) {
      setIsFavorited(isFavorited); // rollback
      toast.error("Failed to update favorite status.");
      console.error("Favorite toggle error:", err);
    }
  };

  // Handle request submission
  const handleRequestSubmit = async ({ duration, note }: { duration: string; note: string }) => {
    if (!item) return false;
    const token = getAuthToken();
    if (!token || !user?.id) {
      toast.error("Please sign in to send a request.");
      router.push("/login");
      return false;
    }

    if (!duration.trim()) {
      toast.error("Please enter how long you need this item.");
      return false;
    }

    if (item.ownerId === user.id) {
      toast.error("You cannot request your own item.");
      return false;
    }

    setIsSubmittingRequest(true);
    try {
      const chat = await chatApi.getOrCreateForTransaction({
        transactionId: item.transactionId,
        ownerId: item.ownerId,
        requesterId: user.id,
      });

      if (!chat.chatId) {
        throw new Error("Unable to start chat for this request.");
      }

      const firstMessage = note.trim()
        ? `Hi! I'd like to request "${item.title}" for ${duration.trim()}. ${note.trim()}`
        : `Hi! I'd like to request "${item.title}" for ${duration.trim()}.`;

      await chatApi.sendMessage(chat.chatId, {
        senderId: user.id,
        body: firstMessage,
      });

      // Update state & storage
      setIsRequested(true);

      const existingRaw = localStorage.getItem(REQUESTED_ITEMS_STORAGE_KEY);
      const existingItems: RequestedItemRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      const alreadySaved = existingItems.some((entry) => entry.transactionId === item.transactionId);

      if (!alreadySaved) {
        localStorage.setItem(
          REQUESTED_ITEMS_STORAGE_KEY,
          JSON.stringify([
            ...existingItems,
            {
              transactionId: item.transactionId,
              itemTitle: item.title,
              chatId: chat.chatId,
              requestedAt: new Date().toISOString(),
            },
          ])
        );
      }

      toast.success("Request sent. Opening chat...");
      router.push(`/chat?chatId=${chat.chatId}&itemTitle=${encodeURIComponent(item.title)}`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send request.";
      toast.error(message);
      return false;
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background-light min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-neutral-500 font-bold text-lg">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-background-light min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-6 text-center px-4">
        <MdOutlineErrorOutline className="text-6xl text-neutral-300" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Resource Not Found</h1>
          <p className="text-neutral-500 max-w-md font-medium">
            The resource you are looking for might have been archived, deleted, or you followed an invalid link.
          </p>
        </div>
        <Link
          href="/marketplace"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold shadow-md transition-all cursor-pointer text-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const imageUrls = item.images && item.images.length > 0 ? item.images : [];

  return (
    <div className="bg-background-light min-h-screen pt-28 pb-20 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-6">
        {/* Navigation & Favorite controls */}
        <div className="flex justify-between items-center">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold transition-colors cursor-pointer select-none text-sm"
          >
            <MdArrowBack className="text-lg" />
            Back to Marketplace
          </Link>

          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-2 h-10 px-4 rounded-full border bg-white shadow-xs hover:shadow-md transition-all cursor-pointer ${
              isFavorited ? "border-rose-200 text-rose-500 bg-rose-50/20" : "border-neutral-200 text-neutral-500"
            }`}
          >
            {isFavorited ? (
              <MdFavorite className="text-lg text-rose-500" />
            ) : (
              <MdFavoriteBorder className="text-lg" />
            )}
            <span className="text-xs font-bold">{isFavorited ? "Favorited" : "Favorite"}</span>
          </button>
        </div>

        {/* Dynamic Detail grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main image & thumbnails strip component */}
          <div className="lg:col-span-7">
            <DetailGallery
              title={item.title}
              imageUrls={imageUrls}
              status={item.status}
              type={item.type}
              activeImageIndex={activeImageIndex}
              onImageChange={setActiveImageIndex}
            />
          </div>

          {/* Details metadata & actions column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <DetailInfo
              title={item.title}
              category={item.category}
              department={item.department}
              price={item.price}
              currency={item.currency}
              type={item.type}
              availableFrom={item.availableFrom}
              availableTo={item.availableTo}
              description={item.description}
              formatDate={formatDate}
            />

            <DetailSidebar
              user={item.user}
              isOwner={user?.id === item.ownerId}
              isRequested={isRequested}
              itemType={item.type}
              onRequestClick={() => {
                const token = getAuthToken();
                if (!token) {
                  toast.error("Please sign in to request this item.");
                  router.push("/login");
                  return;
                }
                setShowRequestModal(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Request Modal sheet */}
      {showRequestModal && (
        <RequestItemModal
          isOpen={showRequestModal}
          item={item}
          onClose={() => setShowRequestModal(false)}
          isSubmitting={isSubmittingRequest}
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
}
