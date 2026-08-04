"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuthToken } from "@/hooks/useAuth";
import { loansApi } from "@/api/loans-api";
import { chatApi } from "@/api/chat-api";
import { itemsApi } from "@/api/items-api";
import { transactionsApi } from "@/api/transactions-api";
import { LoanSortBy, LoanStatus, type LoanItemResult } from "@/types/loans";
import {
  MdChat,
  MdChevronRight,
  MdOutlineCalendarMonth,
  MdPerson,
  MdRefresh,
  MdArrowBack,
  MdArrowForward,
  MdUnfoldMore,
  MdArrowDownward,
  MdArrowUpward,
  MdError,
  MdWarning,
  MdLoop,
  MdCheck,
  MdClose
} from "react-icons/md";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface LoansSectionProps {
  userId: string;
  isActive: boolean;
}

export default function LoansSection({ userId, isActive }: LoansSectionProps) {
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";

  // Cache for item titles & images
  const [itemsCache, setItemsCache] = useState<Record<string, { title: string; image: string }>>({});

  // Loans states
  const [loans, setLoans] = useState<LoanItemResult[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(false);
  const [loansError, setLoansError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<LoanSortBy>(LoanSortBy.LoanDate);
  const [sortDescending, setSortDescending] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isResponding, setIsResponding] = useState<string | null>(null);

  // Approve / Decline request handler
  const handleRespondToRequest = async (transactionId: string, isApproved: boolean) => {
    const token = getAuthToken();
    if (!token) return;

    setIsResponding(transactionId);
    try {
      await transactionsApi.respond(transactionId, isApproved, token);
      toast.success(isApproved ? "Request approved successfully!" : "Request declined.");

      // Refresh list
      setLoans((prev) =>
        prev.map((item) =>
          item.transactionId === transactionId
            ? {
                ...item,
                status: isApproved ? LoanStatus.AwaitingHandover : LoanStatus.Cancelled,
                statusLabel: isApproved ? "Awaiting Handover" : "Cancelled",
              }
            : item
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update request status.");
    } finally {
      setIsResponding(null);
    }
  };

  // Prefetch function for items
  const fetchItemDetails = async (itemIds: string[]) => {
    const missingIds = itemIds.filter((id) => !itemsCache[id]);
    if (missingIds.length === 0) return;

    try {
      const results = await Promise.allSettled(
        missingIds.map(async (id) => {
          const item = await itemsApi.getById(id);
          return { id, title: item.title, image: item.imageUrls[0] || "" };
        })
      );

      const updates: Record<string, { title: string; image: string }> = {};
      for (const res of results) {
        if (res.status === "fulfilled" && res.value) {
          updates[res.value.id] = { title: res.value.title, image: res.value.image };
        }
      }

      setItemsCache((prev) => ({ ...prev, ...updates }));
    } catch (err) {
      console.error("Failed to prefetch item details:", err);
    }
  };

  // Start chat with borrower
  const handleChatWithBorrower = async (loan: LoanItemResult) => {
    const token = getAuthToken();
    if (!token || !userId) return;

    setIsStartingChat(loan.transactionId);
    try {
      let borrowerId = loan.borrowerId;
      let itemTitle = itemsCache[loan.itemId]?.title || itemsCache[loan.transactionId]?.title;

      if (!borrowerId && loan.itemId) {
        try {
          const item = await itemsApi.getById(loan.itemId);
          if (item) {
            if (item.title) itemTitle = item.title;
          }
        } catch {
          // ignore
        }
      }

      if (!itemTitle) itemTitle = isAr ? "طلب إعارة" : "Loan Item";

      if (!borrowerId) {
        toast.error(isAr ? "تعذر تحديد المستعير لبدء المحادثة" : "Unable to identify borrower to start chat");
        return;
      }

      const chat = await chatApi.getOrCreateForTransaction({
        transactionId: loan.transactionId,
        ownerId: userId,
        requesterId: borrowerId,
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

  // Fetch loans when activeSection is 'loans' or state changes
  useEffect(() => {
    if (!isActive) return;
    const token = getAuthToken();
    if (!token) return;

    let cancelled = false;

    async function fetchLoans() {
      setIsLoadingLoans(true);
      setLoansError(null);
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
          loansApi.getLoans(params, token!).catch(() => null),
          transactionsApi.getActive(userId, token!).catch(() => []),
          transactionsApi.getAll(token!).catch(() => []),
        ]);

        if (!cancelled) {
          let mergedItems: LoanItemResult[] = res?.success && res?.data ? [...res.data.items] : [];

          const activeList = Array.isArray(activeTxsRes) ? activeTxsRes : (activeTxsRes as any)?.items || [];
          const allList = Array.isArray(allTxsRes) ? allTxsRes : (allTxsRes as any)?.items || [];

          // Merge active and all user transactions where current user is owner (tx.isOwner)
          const allUserTxs = [...activeList, ...allList];
          const ownerTxs = allUserTxs.filter((tx) => tx && tx.isOwner);
          for (const tx of ownerTxs) {
            if (!mergedItems.some((l) => l.transactionId === tx.transactionId)) {
              mergedItems.push({
                transactionId: tx.transactionId,
                itemId: tx.itemId,
                borrowerId: (tx as any).requesterId || "",
                borrowerFullName: isAr ? "المستعير" : "Borrower",
                agreedPrice: tx.agreedPrice,
                loanedAt: tx.createdAt || new Date().toISOString(),
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
              (l) => Number(l.status) === Number(statusFilter)
            );
          }

          setTotalCount(mergedItems.length);
          setTotalPages(Math.ceil(mergedItems.length / pageSize) || 1);

          const paginatedItems = mergedItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
          setLoans(paginatedItems);

          const itemIds = mergedItems.map((l) => l.itemId).filter((id) => typeof id === "string" && id.trim().length > 0);
          if (itemIds.length > 0) {
            fetchItemDetails(itemIds);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setLoansError(err.message || "Something went wrong while fetching loans.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingLoans(false);
        }
      }
    }

    fetchLoans();
    return () => {
      cancelled = true;
    };
  }, [isActive, pageNumber, pageSize, statusFilter, sortBy, sortDescending]);

  return (
    <div className={cn("flex flex-col gap-6", isAr ? "text-right" : "")}>
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">
          {isAr ? "إعاراتي ومواردي المعروضة" : "My Loans"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {isAr
            ? "إدارة ومتابعة أدواتك ومواردك المعروضة للإعارة أو البيع للطلاب الآخرين."
            : "Manage and track your listed items currently loaned to other students."}
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
          {/* Enhanced Custom Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen((prev) => !prev)}
              className={cn("flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 focus:border-primary focus:outline-none transition-all shadow-xs cursor-pointer", isAr ? "flex-row-reverse" : "")}
              aria-expanded={isSortDropdownOpen}
              aria-haspopup="true"
              aria-label="Sort loans options"
            >
              <span>
                {sortBy === LoanSortBy.LoanDate
                  ? isAr ? "تاريخ العرض" : "Date Shared"
                  : sortBy === LoanSortBy.ReturnDueDate
                  ? isAr ? "تاريخ الإرجاع" : "Return Date"
                  : isAr ? "الحالة" : "Status"}
              </span>
              <MdUnfoldMore className="text-neutral-400 text-[16px]" />
            </button>

            {isSortDropdownOpen && (
              <>
                {/* Backdrop to close dropdown on click outside */}
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
                      { label: isAr ? "تاريخ العرض" : "Date Shared", value: LoanSortBy.LoanDate },
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
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
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
            aria-label={sortDescending ? (isAr ? "تنازلي" : "Descending Order") : (isAr ? "تصاعدي" : "Ascending Order")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer text-neutral-600"
          >
            {sortDescending ? (
              <MdArrowDownward className="text-[20px]" />
            ) : (
              <MdArrowUpward className="text-[20px]" />
            )}
          </button>
        </div>
      </div>

      {/* Loans Grid / List */}
      {isLoadingLoans ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-neutral-500 font-medium text-sm">
            {isAr ? "جاري تحميل الإعارات..." : "Loading loans..."}
          </p>
        </div>
      ) : loansError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MdError className="text-4xl text-rose-500 mb-2" />
          <p className="font-semibold text-neutral-800 text-sm">{loansError}</p>
          <button
            type="button"
            onClick={() => {
              setPageNumber(1);
              setLoans([]);
              setLoansError(null);
            }}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <MdRefresh className="text-sm" /> {isAr ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      ) : loans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 py-16 px-6 text-center">
          <Image
            src="/Logo.svg"
            alt="UniCare"
            width={64}
            height={40}
            className="h-12 w-auto mx-auto mb-3 opacity-40 grayscale object-contain"
          />
          <h3 className="font-bold text-neutral-800 text-lg">
            {isAr ? "لا توجد إعارات حالياً" : "No loans found"}
          </h3>
          <p className="text-neutral-500 text-sm mt-1 max-w-sm mx-auto">
            {statusFilter === "ALL"
              ? isAr
                ? "لم تقم بإعارة أو عرض أي موارد حتى الآن. اضف كتابك أو أداتك في المتجر للبدء بالمشاركة!"
                : "You haven't listed or lent any resources yet. Post an item on the marketplace to start sharing!"
              : isAr
                ? "لا توجد إعارات تطابق حالة الفلتر المحددة."
                : "No loans match the selected status filter."}
          </p>
          {statusFilter === "ALL" && (
            <Link
              href="/post"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all"
            >
              {isAr ? "عرض أداة أو كتاب" : "Post a Resource"}
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {loans.map((loan) => {
            const itemDetail = itemsCache[loan.itemId];
            const initials = loan.borrowerFullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            // Determine status badge classes
            let badgeClass = "bg-neutral-50 text-neutral-600 border-neutral-200";
            switch (loan.status) {
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
              <div
                key={loan.transactionId}
                className={cn("group border border-neutral-200 bg-white rounded-3xl p-5 hover:shadow-md hover:border-primary/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5", isAr ? "sm:flex-row-reverse text-right" : "")}
              >
                {/* Left: Item image & title */}
                <div className={cn("flex items-center gap-4 min-w-0 flex-1", isAr ? "flex-row-reverse" : "")}>
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-150 flex items-center justify-center shrink-0">
                    {typeof itemDetail?.image === "string" && itemDetail.image.trim().length > 0 && (itemDetail.image.startsWith("http://") || itemDetail.image.startsWith("https://") || itemDetail.image.startsWith("/")) ? (
                      <Image src={itemDetail.image} alt={itemDetail.title} fill className="object-cover" />
                    ) : (
                      <Image src="/Logo.svg" alt="UniCare" width={32} height={20} className="h-6 w-auto object-contain opacity-50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-base font-bold text-neutral-900 group-hover:text-primary transition-colors">
                      {itemDetail?.title || (isAr ? "جاري تحميل اسم العنصر..." : "Loading item title...")}
                    </h4>
                    {/* Borrower avatar & name */}
                    <div className={cn("mt-1 flex items-center gap-2", isAr ? "flex-row-reverse" : "")}>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-[9px] font-black text-neutral-700">
                        {initials || <MdPerson />}
                      </span>
                      <span className="truncate text-xs font-semibold text-neutral-600">
                        {isAr ? `مُعار إلى: ${loan.borrowerFullName}` : `Lent to ${loan.borrowerFullName}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Pricing & Dates */}
                <div className={cn("flex flex-col gap-1 text-xs text-neutral-500 shrink-0", isAr ? "items-end text-right" : "")}>
                  {loan.agreedPrice > 0 && (
                    <span className="text-sm font-extrabold text-primary mb-0.5">
                      {isAr ? `${loan.agreedPrice} جنيه` : `EGP ${loan.agreedPrice}`}
                    </span>
                  )}
                  <div className={cn("flex items-center gap-1", isAr ? "flex-row-reverse" : "")}>
                    <MdOutlineCalendarMonth className="text-neutral-400 text-[14px]" />
                    <span>
                      {isAr ? `تاريخ العرض: ${new Date(loan.loanedAt).toLocaleDateString()}` : `Shared: ${new Date(loan.loanedAt).toLocaleDateString()}`}
                    </span>
                  </div>
                  {loan.returnDueDate ? (
                    <div className={cn(`flex items-center gap-1 font-medium ${loan.isOverdue ? "text-rose-600 font-bold" : ""}`, isAr ? "flex-row-reverse" : "")}>
                      {loan.isOverdue ? (
                        <MdWarning className="text-[14px] leading-none text-rose-500" />
                      ) : (
                        <MdLoop className="text-[14px] leading-none text-neutral-400" />
                      )}
                      <span>
                        {isAr ? `موعد الإرجاع: ${new Date(loan.returnDueDate).toLocaleDateString()}` : `Due: ${new Date(loan.returnDueDate).toLocaleDateString()}`}
                        {loan.isOverdue && (isAr ? " (متأخر)" : " (Overdue)")}
                      </span>
                    </div>
                  ) : (
                    <span>{isAr ? "بدون تاريخ إرجاع" : "No due date"}</span>
                  )}
                </div>

                {/* Right: Status pill and Action buttons */}
                <div className={cn("flex flex-row sm:flex-col items-center gap-3 shrink-0 justify-between sm:justify-start border-t border-neutral-100 sm:border-t-0 pt-3 sm:pt-0", isAr ? "sm:items-start" : "sm:items-end")}>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${badgeClass}`}>
                    {loan.statusLabel}
                  </span>
                  <div className="flex gap-2">
                    {/* Open Chat */}
                    <button
                      type="button"
                      onClick={() => handleChatWithBorrower(loan)}
                      disabled={isStartingChat === loan.transactionId}
                      title={isAr ? "محادثة المستعير" : "Chat with Borrower"}
                      aria-label={isAr ? "محادثة المستعير" : "Chat with Borrower"}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isStartingChat === loan.transactionId ? (
                        <div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <MdChat className="text-[18px]" />
                      )}
                    </button>

                    {/* Approve / Decline controls for Pending requests */}
                    {loan.status === LoanStatus.PendingApproval ? (
                      <div className={cn("flex items-center gap-1.5", isAr ? "flex-row-reverse" : "")}>
                        <button
                          type="button"
                          onClick={() => handleRespondToRequest(loan.transactionId, true)}
                          disabled={isResponding === loan.transactionId}
                          className="flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          <MdCheck className="text-sm" /> {isAr ? "موافقة" : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespondToRequest(loan.transactionId, false)}
                          disabled={isResponding === loan.transactionId}
                          className="flex items-center gap-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          <MdClose className="text-sm" /> {isAr ? "رفض" : "Decline"}
                        </button>
                      </div>
                    ) : (
                      /* Handover action if applicable */
                      (loan.status === LoanStatus.AwaitingHandover ||
                        loan.status === LoanStatus.Active ||
                        loan.status === LoanStatus.Overdue) && (
                        <Link
                          href={`/transactions/${loan.transactionId}/handover`}
                          className={cn("flex items-center gap-1 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer", isAr ? "flex-row-reverse" : "")}
                        >
                          <span>{isAr ? "إدارة التسليم" : "Manage"}</span>
                          <MdChevronRight className={cn("text-[16px]", isAr ? "rotate-180" : "")} />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={cn("flex items-center justify-between border-t border-neutral-150 pt-5 mt-3", isAr ? "flex-row-reverse" : "")}>
              <span className="text-xs font-semibold text-neutral-500">
                {isAr
                  ? `صفحة ${pageNumber} من ${totalPages} (إجمالي ${totalCount} إعارات)`
                  : `Page ${pageNumber} of ${totalPages} (${totalCount} ${totalCount === 1 ? "loan" : "loans"} total)`}
              </span>
              <div className={cn("flex gap-2", isAr ? "flex-row-reverse" : "")}>
                <button
                  type="button"
                  disabled={pageNumber === 1 || isLoadingLoans}
                  onClick={() => setPageNumber((prev) => prev - 1)}
                  className={cn("flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer", isAr ? "flex-row-reverse" : "")}
                >
                  {isAr ? <MdArrowForward /> : <MdArrowBack />} {isAr ? "السابق" : "Prev"}
                </button>
                <button
                  type="button"
                  disabled={pageNumber === totalPages || isLoadingLoans}
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
