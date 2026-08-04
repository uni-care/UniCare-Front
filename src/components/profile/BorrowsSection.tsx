"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuthToken } from "@/hooks/useAuth";
import { borrowsApi } from "@/api/borrows-api";
import { transactionsApi } from "@/api/transactions-api";
import { chatApi } from "@/api/chat-api";
import { itemsApi } from "@/api/items-api";
import { LoanSortBy, LoanStatus } from "@/types/loans";
import type { BorrowItemResult } from "@/types/borrows";
import {
  MdChevronRight,
  MdRefresh,
  MdArrowBack,
  MdArrowForward,
  MdUnfoldMore,
  MdArrowDownward,
  MdArrowUpward,
  MdError
} from "react-icons/md";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import UnifiedItemCard from "@/components/common/UnifiedItemCard";

interface BorrowsSectionProps {
  userId: string;
  isActive: boolean;
}

export default function BorrowsSection({ userId, isActive }: BorrowsSectionProps) {
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";

  // Cache for item titles & images
  const [itemsCache, setItemsCache] = useState<Record<string, { title: string; image: string; ownerName?: string }>>({});

  // Borrows states
  const [borrows, setBorrows] = useState<BorrowItemResult[]>([]);
  const [isLoadingBorrows, setIsLoadingBorrows] = useState(false);
  const [borrowsError, setBorrowsError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<LoanSortBy>(LoanSortBy.LoanDate);
  const [sortDescending, setSortDescending] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Prefetch function for items
  const fetchItemDetails = async (itemIds: string[]) => {
    const missingIds = itemIds.filter((id) => id && typeof id === "string" && id.trim().length > 0 && !itemsCache[id]);
    if (missingIds.length === 0) return;

    try {
      const results = await Promise.allSettled(
        missingIds.map(async (id) => {
          const item = await itemsApi.getById(id);
          return { id, title: item.title, image: item.imageUrls?.[0] || "", ownerName: item.ownerName };
        })
      );

      const updates: Record<string, { title: string; image: string; ownerName?: string }> = {};
      for (const res of results) {
        if (res.status === "fulfilled" && res.value) {
          updates[res.value.id] = { title: res.value.title, image: res.value.image, ownerName: res.value.ownerName };
        }
      }

      setItemsCache((prev) => ({ ...prev, ...updates }));
    } catch (err) {
      console.error("Failed to prefetch item details:", err);
    }
  };

  // Start chat with owner
  const handleChatWithOwner = async (borrow: BorrowItemResult) => {
    const token = getAuthToken();
    if (!token || !userId) return;

    setIsStartingChat(borrow.transactionId);
    try {
      let ownerId = borrow.ownerId;
      let itemTitle = itemsCache[borrow.itemId]?.title || itemsCache[borrow.transactionId]?.title;

      if (!ownerId && borrow.itemId) {
        try {
          const item = await itemsApi.getById(borrow.itemId);
          if (item) {
            ownerId = item.ownerId;
            if (item.title) itemTitle = item.title;
          }
        } catch {
          // ignore
        }
      }

      if (!itemTitle) itemTitle = isAr ? "طلب مورد" : "Resource Item";

      if (!ownerId) {
        toast.error(isAr ? "تعذر تحديد المالك لبدء المحادثة" : "Unable to identify owner to start chat");
        return;
      }

      const chat = await chatApi.getOrCreateForTransaction({
        transactionId: borrow.transactionId,
        ownerId,
        requesterId: userId,
      });

      if (chat?.chatId) {
        router.push(`/chat?chatId=${chat.chatId}&itemTitle=${encodeURIComponent(itemTitle)}`);
      } else {
        toast.error(isAr ? "فشل فتح غرفة المحادثة" : "Failed to open chat room");
      }
    } catch (err: any) {
      console.error("Chat navigation error:", err);
      toast.error(isAr ? "حدث خطأ أثناء فتح المحادثة" : "Error opening chat");
    } finally {
      setIsStartingChat(null);
    }
  };

  // Fetch borrows when activeSection is 'borrows' or state changes
  useEffect(() => {
    if (!isActive) return;
    const token = getAuthToken();
    if (!token) return;

    let cancelled = false;

    async function fetchBorrows() {
      setIsLoadingBorrows(true);
      setBorrowsError(null);
      try {
        const params: any = {
          pageNumber,
          pageSize,
          sortBy,
          sortDescending,
        };
        if (statusFilter !== "ALL") {
          params.status = statusFilter;
        }

        const [res, activeTxsRes, allTxsRes] = await Promise.all([
          borrowsApi.getBorrows(params, token!).catch(() => null),
          transactionsApi.getActive(userId, token!).catch(() => []),
          transactionsApi.getAll(token!).catch(() => []),
        ]);

        if (!cancelled) {
          let mergedItems: BorrowItemResult[] = res?.success && res?.data ? [...res.data.items] : [];

          const activeList = Array.isArray(activeTxsRes) ? activeTxsRes : (activeTxsRes as any)?.items || [];
          const allList = Array.isArray(allTxsRes) ? allTxsRes : (allTxsRes as any)?.items || [];

          // Merge active and all user transactions where current user is requester (!tx.isOwner)
          const allUserTxs = [...activeList, ...allList];
          const requesterTxs = allUserTxs.filter((tx) => tx && !tx.isOwner);
          for (const tx of requesterTxs) {
            if (!mergedItems.some((b) => b.transactionId === tx.transactionId)) {
              mergedItems.push({
                transactionId: tx.transactionId,
                itemId: tx.itemId,
                ownerId: (tx as any).ownerId || "",
                ownerFullName: isAr ? "المالك" : "Item Owner",
                agreedPrice: tx.agreedPrice,
                borrowedAt: tx.createdAt || new Date().toISOString(),
                status: tx.status,
                statusLabel:
                  tx.status === LoanStatus.PendingApproval
                    ? isAr ? "قيد الانتظار" : "Pending Approval"
                    : tx.status === LoanStatus.AwaitingHandover
                    ? isAr ? "بانتظار التسليم" : "Awaiting Handover"
                    : tx.status === LoanStatus.Active
                    ? isAr ? "نشط" : "Active"
                    : isAr ? "قيد الانتظار" : "Pending Approval",
                isOverdue: false,
              });
            }
          }

          // Filter by statusFilter if not ALL
          if (statusFilter !== "ALL") {
            mergedItems = mergedItems.filter(
              (b) => Number(b.status) === Number(statusFilter)
            );
          }

          setTotalCount(mergedItems.length);
          setTotalPages(Math.ceil(mergedItems.length / pageSize) || 1);

          const paginatedItems = mergedItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
          setBorrows(paginatedItems);

          const itemIds = mergedItems.map((b) => b.itemId).filter((id) => typeof id === "string" && id.trim().length > 0);
          if (itemIds.length > 0) {
            fetchItemDetails(itemIds);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setBorrowsError(err.message || "Something went wrong while fetching borrow requests.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBorrows(false);
        }
      }
    }

    fetchBorrows();
    return () => {
      cancelled = true;
    };
  }, [isActive, pageNumber, pageSize, statusFilter, sortBy, sortDescending]);

  return (
    <div className={cn("flex flex-col gap-6", isAr ? "text-right" : "")}>
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">
          {isAr ? "طلباتي وإعاراتي المستلمة" : "My Borrows"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {isAr
            ? "متابعة الموارد والكتب والأدوات التي قمت بطلبها أو استعارتها من بقية الطلاب."
            : "Track resource items you requested or borrowed from other campus members."}
        </p>
      </div>

      {/* Filters & Sorting Bar */}
      <div className={cn("flex flex-col gap-4 border-b border-neutral-100 pb-5 md:flex-row md:items-center md:justify-between", isAr ? "md:flex-row-reverse" : "")}>
        {/* Status Filter pills */}
        <div className={cn("flex flex-wrap gap-2", isAr ? "flex-row-reverse" : "")}>
          {(
            [
              { label: isAr ? "الكل" : "All", value: "ALL" },
              { label: isAr ? "قيد الانتظار" : "Pending", value: LoanStatus.PendingApproval },
              { label: isAr ? "التسليم" : "Handover", value: LoanStatus.AwaitingHandover },
              { label: isAr ? "نشط" : "Active", value: LoanStatus.Active },
              { label: isAr ? "متأخر" : "Overdue", value: LoanStatus.Overdue },
              { label: isAr ? "تم الإرجاع" : "Returned", value: LoanStatus.Returned },
              { label: isAr ? "ملغى" : "Cancelled", value: LoanStatus.Cancelled },
            ] as const
          ).map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setStatusFilter(filter.value);
                setPageNumber(1);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === filter.value
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sorting dropdown & order toggle */}
        <div className={cn("flex items-center gap-3 self-end md:self-auto", isAr ? "flex-row-reverse" : "")}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen((prev) => !prev)}
              className={cn("flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 focus:border-primary focus:outline-none transition-all shadow-xs cursor-pointer", isAr ? "flex-row-reverse" : "")}
              aria-expanded={isSortDropdownOpen}
              aria-haspopup="true"
              aria-label="Sort options"
            >
              <span>
                {sortBy === LoanSortBy.LoanDate
                  ? isAr ? "تاريخ الطلب" : "Date Requested"
                  : sortBy === LoanSortBy.ReturnDueDate
                  ? isAr ? "تاريخ الإرجاع" : "Return Date"
                  : isAr ? "الحالة" : "Status"}
              </span>
              <MdUnfoldMore className="text-neutral-400 text-[16px]" />
            </button>

            {isSortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortDropdownOpen(false)}
                />
                <div className={cn("absolute mt-1.5 z-20 w-44 rounded-2xl border border-neutral-200/80 bg-white p-1.5 shadow-lg shadow-neutral-150/40 animate-in fade-in slide-in-from-top-2 duration-150", isAr ? "left-0 text-right" : "right-0")}>
                  <p className="px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">
                    {isAr ? "ترتيب حسب" : "Sort By"}
                  </p>
                  {(
                    [
                      { label: isAr ? "تاريخ الطلب" : "Date Requested", value: LoanSortBy.LoanDate },
                      { label: isAr ? "تاريخ الإرجاع" : "Return Date", value: LoanSortBy.ReturnDueDate },
                      { label: isAr ? "الحالة" : "Status", value: LoanSortBy.Status },
                    ] as const
                  ).map((option) => {
                    const isSelected = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setPageNumber(1);
                          setIsSortDropdownOpen(false);
                        }}
                        className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer", isAr ? "flex-row-reverse text-right" : "text-left", isSelected ? "bg-primary/10 text-primary" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800")}
                      >
                        {option.label}
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSortDescending((prev) => !prev)}
            title={sortDescending ? (isAr ? "تنازلي" : "Descending Order") : (isAr ? "تصاعدي" : "Ascending Order")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer text-neutral-600"
          >
            {sortDescending ? <MdArrowDownward className="text-[20px]" /> : <MdArrowUpward className="text-[20px]" />}
          </button>
        </div>
      </div>

      {/* Borrows Grid / List */}
      {isLoadingBorrows ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-neutral-500 font-medium text-sm">
            {isAr ? "جاري تحميل الطلبات..." : "Loading borrow requests..."}
          </p>
        </div>
      ) : borrowsError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MdError className="text-4xl text-rose-500 mb-2" />
          <p className="font-semibold text-neutral-800 text-sm">{borrowsError}</p>
          <button
            type="button"
            onClick={() => {
              setPageNumber(1);
              setBorrows([]);
              setBorrowsError(null);
            }}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <MdRefresh className="text-sm" /> {isAr ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      ) : borrows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 py-16 px-6 text-center">
          <Image
            src="/Logo.svg"
            alt="UniCare"
            width={64}
            height={40}
            className="h-12 w-auto mx-auto mb-3 opacity-40 grayscale object-contain"
          />
          <h3 className="font-bold text-neutral-800 text-lg">
            {isAr ? "لا توجد طلبات إعارة حالياً" : "No borrow requests found"}
          </h3>
          <p className="text-neutral-500 text-sm mt-1 max-w-sm mx-auto">
            {statusFilter === "ALL"
              ? isAr
                ? "لم تقم بطلب أي أداة أو كتاب حتى الآن. تصفح المتجر للبحث عن الموارد المتاحة!"
                : "You haven't requested or borrowed any items yet. Browse the marketplace to find resources!"
              : isAr
                ? "لا توجد طلبات تطابق حالة الفلتر المحددة."
                : "No borrow requests match the selected status filter."}
          </p>
          {statusFilter === "ALL" && (
            <Link
              href="/marketplace"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all"
            >
              {isAr ? "تصفح المتجر" : "Explore Marketplace"}
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {borrows.map((borrow) => {
            const itemDetail = itemsCache[borrow.itemId] || itemsCache[borrow.transactionId];
            const displayTitle = itemDetail?.title || (isAr ? "طلب مورد" : "Requested Resource");
            const rawOwnerName = itemDetail?.ownerName || (borrow.ownerFullName && borrow.ownerFullName !== "Item Owner" ? borrow.ownerFullName : (isAr ? "مالك المورد" : "Resource Owner"));
            const initials = rawOwnerName
              .split(" ")
              .map((n: string) => n[0])
              .filter(Boolean)
              .join("")
              .substring(0, 2)
              .toUpperCase() || "UC";

            let badgeClass = "bg-neutral-50 text-neutral-600 border-neutral-200";
            switch (borrow.status) {
              case LoanStatus.PendingApproval:
                badgeClass = "bg-amber-50 text-amber-700 border-amber-200/80";
                break;
              case LoanStatus.AwaitingHandover:
                badgeClass = "bg-blue-50 text-blue-700 border-blue-200/80";
                break;
              case LoanStatus.Active:
                badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
                break;
              case LoanStatus.Overdue:
                badgeClass = "bg-rose-50 text-rose-700 border-rose-200/80";
                break;
              case LoanStatus.Returned:
                badgeClass = "bg-neutral-50 text-neutral-500 border-neutral-200/80";
                break;
              case LoanStatus.Cancelled:
                badgeClass = "bg-slate-50 text-slate-500 border-slate-200/80";
                break;
            }

            return (
              <UnifiedItemCard
                key={borrow.transactionId}
                id={borrow.transactionId}
                title={displayTitle}
                image={itemDetail?.image}
                counterpartName={rawOwnerName}
                counterpartRole="owner"
                agreedPrice={borrow.agreedPrice}
                dateLabel={isAr ? "تاريخ الطلب" : "Requested"}
                dateValue={new Date(borrow.borrowedAt).toLocaleDateString()}
                dueDateLabel={borrow.returnDueDate ? (isAr ? "موعد الإرجاع" : "Due") : undefined}
                dueDateValue={borrow.returnDueDate ? new Date(borrow.returnDueDate).toLocaleDateString() : undefined}
                isOverdue={borrow.isOverdue}
                isAr={isAr}
                statusBadge={
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${badgeClass}`}>
                    {borrow.statusLabel}
                  </span>
                }
                onChatClick={() => handleChatWithOwner(borrow)}
                isChatLoading={isStartingChat === borrow.transactionId}
                actions={
                  (borrow.status === LoanStatus.PendingApproval ||
                    borrow.status === LoanStatus.AwaitingHandover ||
                    borrow.status === LoanStatus.Active ||
                    borrow.status === LoanStatus.Overdue) && (
                    <Link
                      href={`/transactions/${borrow.transactionId}/handover`}
                      className="flex items-center gap-1 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>{isAr ? "التسليم" : "Handover"}</span>
                      <MdChevronRight className={cn("text-[16px]", isAr ? "rotate-180" : "")} />
                    </Link>
                  )
                }
              />
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={cn("flex items-center justify-between border-t border-neutral-150 pt-5 mt-3", isAr ? "flex-row-reverse" : "")}>
              <span className="text-xs font-semibold text-neutral-500">
                {isAr
                  ? `صفحة ${pageNumber} من ${totalPages} (إجمالي ${totalCount} طلبات)`
                  : `Page ${pageNumber} of ${totalPages} (${totalCount} ${totalCount === 1 ? "request" : "requests"} total)`}
              </span>
              <div className={cn("flex gap-2", isAr ? "flex-row-reverse" : "")}>
                <button
                  type="button"
                  disabled={pageNumber === 1 || isLoadingBorrows}
                  onClick={() => setPageNumber((prev) => prev - 1)}
                  className={cn("flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer", isAr ? "flex-row-reverse" : "")}
                >
                  {isAr ? <MdArrowForward /> : <MdArrowBack />} {isAr ? "السابق" : "Prev"}
                </button>
                <button
                  type="button"
                  disabled={pageNumber === totalPages || isLoadingBorrows}
                  onClick={() => setPageNumber((prev) => prev + 1)}
                  className={cn("flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer", isAr ? "flex-row-reverse" : "")}
                >
                  {isAr ? "التالي" : "Next"} {isAr ? <MdArrowBack /> : <MdArrowForward />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
