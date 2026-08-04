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
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  MdReceiptLong,
  MdArrowForward,
  MdSell,
  MdAssignmentReturn,
  MdChevronRight,
  MdChat,
} from "react-icons/md";

export default function ProfileTransactionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";

  const [transactions, setTransactions] = useState<ActiveTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsCache, setItemsCache] = useState<Record<string, string>>({});
  const [startingChatId, setStartingChatId] = useState<string | null>(null);

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

          // Fetch missing item titles asynchronously
          const missingItemIds = list
            .map((t) => t.itemId)
            .filter((id) => id && id.trim().length > 0);

          if (missingItemIds.length > 0) {
            Promise.allSettled(
              missingItemIds.map(async (id) => {
                const item = await itemsApi.getById(id);
                return { id, title: item.title };
              })
            ).then((results) => {
              const cache: Record<string, string> = {};
              results.forEach((res) => {
                if (res.status === "fulfilled" && res.value) {
                  cache[res.value.id] = res.value.title;
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
      let title = itemsCache[tx.itemId] || tx.itemTitle || getTypeLabel(tx.type);

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
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => {
            const displayTitle = itemsCache[tx.itemId] || tx.itemTitle || getTypeLabel(tx.type);
            const isChatLoading = startingChatId === tx.transactionId;

            return (
              <Link
                key={tx.transactionId}
                href={`/transactions/${tx.transactionId}/handover`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-xl text-primary shrink-0">
                    {tx.type === TransactionType.Return ? (
                      <MdAssignmentReturn />
                    ) : tx.type === TransactionType.Sale ? (
                      <MdSell />
                    ) : (
                      <Image src="/Logo.svg" alt="UniCare" width={24} height={16} className="h-5 w-auto object-contain" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900 transition-colors group-hover:text-primary">
                      {displayTitle}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {tx.isOwner ? (isAr ? "أنت المالك" : "You are the owner") : (isAr ? "أنت الطالب" : "You are the requester")} •{" "}
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                    {tx.agreedPrice > 0 && (
                      <span className="mt-0.5 text-xs font-bold text-primary">
                        {isAr ? `${tx.agreedPrice} جنيه` : `EGP ${tx.agreedPrice}`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleStartChat(e, tx)}
                    disabled={isChatLoading}
                    title={isAr ? "مراسلة" : "Open Chat"}
                    className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all hover:bg-primary/15 hover:text-primary active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isChatLoading ? (
                      <div className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    ) : (
                      <MdChat className="text-lg" />
                    )}
                  </button>
                  <TransactionStatusBadge status={tx.status} />
                  <MdChevronRight className={cn("text-lg text-neutral-400 transition-colors group-hover:text-primary", isAr ? "rotate-180" : "")} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
