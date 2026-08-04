"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import { useLocale } from "next-intl";
import { transactionsApi } from "@/api/transactions-api";
import { chatApi } from "@/api/chat-api";
import { itemsApi } from "@/api/items-api";
import { TransactionType, type ActiveTransaction } from "@/types/transactions";
import TransactionStatusBadge from "@/components/transactions/TransactionStatusBadge";
import UnifiedItemCard from "@/components/common/UnifiedItemCard";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  MdReceiptLong,
  MdArrowForward,
  MdSell,
  MdAssignmentReturn,
  MdChevronRight,
  MdChat,
  MdCheck,
  MdClose,
} from "react-icons/md";

export default function ProfileTransactionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";

  const [transactions, setTransactions] = useState<ActiveTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsCache, setItemsCache] = useState<Record<string, { title: string; image: string }>>({});
  const [startingChatId, setStartingChatId] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const token = getAuthToken();
    if (!token) return;

    let cancelled = false;
    async function fetch() {
      try {
        const [activeData, allData] = await Promise.all([
          transactionsApi.getActive(user!.id, token!).catch(() => []),
          transactionsApi.getAll(token!).catch(() => []),
        ]);

        const activeList = Array.isArray(activeData) ? activeData : (activeData as any)?.items || [];
        const allList = Array.isArray(allData) ? allData : (allData as any)?.items || [];

        if (!cancelled) {
          // Merge and deduplicate transactions
          const map = new Map<string, ActiveTransaction>();
          [...allList, ...activeList].forEach((tx) => {
            if (tx && tx.transactionId) map.set(tx.transactionId, tx);
          });
          const list = Array.from(map.values());
          setTransactions(list);

          // Fetch missing item details asynchronously
          const missingItemIds = list
            .map((t) => t.itemId)
            .filter((id) => id && id.trim().length > 0);

          if (missingItemIds.length > 0) {
            Promise.allSettled(
              missingItemIds.map(async (id) => {
                const item = await itemsApi.getById(id);
                return { id, title: item.title, image: item.imageUrls?.[0] || "" };
              })
            ).then((results) => {
              const cache: Record<string, { title: string; image: string }> = {};
              results.forEach((res) => {
                if (res.status === "fulfilled" && res.value) {
                  cache[res.value.id] = { title: res.value.title, image: res.value.image };
                }
              });
              if (!cancelled) setItemsCache((prev) => ({ ...prev, ...cache }));
            });
          }
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetch();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const getTypeLabel = (type: number) => {
    switch (type) {
      case TransactionType.Lending:
        return isAr ? "إعارة" : "Lending";
      case TransactionType.Sale:
        return isAr ? "بيع" : "Sale";
      case TransactionType.Return:
        return isAr ? "إرجاع" : "Return";
      default:
        return isAr ? "معاملة" : "Transaction";
    }
  };

  const handleStartChat = async (e: React.MouseEvent, tx: ActiveTransaction) => {
    e.preventDefault();
    e.stopPropagation();
    const token = getAuthToken();
    if (!token || !user?.id) {
      router.push("/chat");
      return;
    }

    setStartingChatId(tx.transactionId);

    try {
      let ownerId = tx.ownerId || "";
      let requesterId = tx.requesterId || "";
      let title = itemsCache[tx.itemId]?.title || tx.itemTitle || getTypeLabel(tx.type);

      if ((!ownerId || !requesterId) && tx.itemId) {
        try {
          const item = await itemsApi.getById(tx.itemId);
          if (item) {
            if (!title) title = item.title;
            if (tx.isOwner) {
              ownerId = user.id;
            } else {
              ownerId = item.ownerId;
              requesterId = user.id;
            }
          }
        } catch {
          // ignore
        }
      }

      // 1. Try to find an existing chat thread for this transaction first
      try {
        const existingChats = await chatApi.getUserChats();
        const match = existingChats.find((c) => c.transactionId === tx.transactionId);
        if (match?.chatId) {
          router.push(`/chat?chatId=${match.chatId}&itemTitle=${encodeURIComponent(title)}`);
          return;
        }
      } catch {
        // ignore and fallback to create
      }

      if (!tx.isOwner && !requesterId) requesterId = user.id;
      if (tx.isOwner && !ownerId) ownerId = user.id;

      const res = await chatApi.getOrCreateForTransaction({
        transactionId: tx.transactionId,
        ownerId,
        requesterId,
      });

      if (res?.chatId) {
        router.push(`/chat?chatId=${res.chatId}&itemTitle=${encodeURIComponent(title)}`);
      } else {
        toast.error(isAr ? "فشل فتح غرفة المحادثة" : "Failed to open chat room");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      toast.error(isAr ? "حدث خطأ أثناء فتح المحادثة" : "Error opening chat");
    } finally {
      setStartingChatId(null);
    }
  };

  const handleRespondToRequest = async (e: React.MouseEvent, transactionId: string, isApproved: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    const token = getAuthToken();
    if (!token) return;

    setRespondingId(transactionId);
    try {
      await transactionsApi.respond(transactionId, isApproved, token);
      toast.success(
        isApproved
          ? isAr ? "تم قبول الطلب بنجاح!" : "Request approved successfully!"
          : isAr ? "تم رفض الطلب." : "Request declined."
      );
      setTransactions((prev) =>
        prev.map((t) =>
          t.transactionId === transactionId
            ? {
              ...t,
              status: isApproved ? 2 : 5, // 2 = AwaitingHandover, 5 = Cancelled
            }
            : t
        )
      );
    } catch (err: any) {
      toast.error(err?.message || (isAr ? "فشل تحديث حالة الطلب." : "Failed to update request status."));
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", isAr ? "text-right" : "")}>
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">
          {isAr ? "سجل المعاملات النشطة" : "My Transactions"}
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          {isAr ? "متابعة عمليات التبادل والتسليم والاستلام النشطة." : "Track your active exchanges and manage handover verifications."}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-xs font-medium text-neutral-500">
            {isAr ? "جاري تحميل المعاملات..." : "Loading transactions..."}
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 py-16 text-center">
          <MdReceiptLong className="text-5xl text-neutral-300 mx-auto" />
          <p className="text-base font-bold text-neutral-700">
            {isAr ? "لا توجد معاملات نشطة" : "No active transactions"}
          </p>
          <p className="max-w-xs text-xs text-neutral-400">
            {isAr ? "عندما تقوم بطلب أداة أو إعارة كتاب ستظهر معاملتك هنا." : "When you request or lend an item, it will appear here."}
          </p>
          <Link
            href="/marketplace"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-primary/90"
          >
            {isAr ? "تصفح المتجر" : "Browse Marketplace"}
            <MdArrowForward className={cn("text-sm", isAr ? "rotate-180" : "")} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {transactions.map((tx) => {
            const itemCache = itemsCache[tx.itemId];
            const displayTitle = itemCache?.title || tx.itemTitle || getTypeLabel(tx.type);
            const isChatLoading = startingChatId === tx.transactionId;
            const isPending = tx.status === 1 || String(tx.status).toLowerCase().includes("pending");

            return (
              <UnifiedItemCard
                key={tx.transactionId}
                id={tx.transactionId}
                title={displayTitle}
                image={itemCache?.image}
                counterpartName={tx.isOwner ? (isAr ? "أنت المالك" : "Owner") : (isAr ? "أنت الطالب" : "Requester")}
                counterpartRole={tx.isOwner ? "owner" : "requester"}
                agreedPrice={tx.agreedPrice}
                dateLabel={isAr ? "تاريخ المعاملة" : "Date"}
                dateValue={new Date(tx.createdAt).toLocaleDateString()}
                statusBadge={<TransactionStatusBadge status={tx.status} />}
                href={`/transactions/${tx.transactionId}/handover`}
                onChatClick={(e) => handleStartChat(e, tx)}
                isChatLoading={isChatLoading}
                isAr={isAr}
                actions={
                  <div className="flex items-center gap-2">
                    {/* Approve / Decline Controls for Item Owner */}
                    {tx.isOwner && isPending && (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleRespondToRequest(e, tx.transactionId, true)}
                          disabled={respondingId === tx.transactionId}
                          className="flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          {respondingId === tx.transactionId ? (
                            <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <MdCheck className="text-sm" />
                          )}
                          {isAr ? "موافقة" : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleRespondToRequest(e, tx.transactionId, false)}
                          disabled={respondingId === tx.transactionId}
                          className="flex items-center gap-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          <MdClose className="text-sm" /> {isAr ? "رفض" : "Decline"}
                        </button>
                      </div>
                    )}
                    <Link
                      href={`/transactions/${tx.transactionId}/handover`}
                      className="flex items-center gap-1 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>{isAr ? "التسليم" : "Handover"}</span>
                      <MdChevronRight className={cn("text-[16px]", isAr ? "rotate-180" : "")} />
                    </Link>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
