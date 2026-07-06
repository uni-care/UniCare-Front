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
  MdHandshake,
  MdWarning,
  MdLoop
} from "react-icons/md";

interface LoansSectionProps {
  userId: string;
  isActive: boolean;
}

export default function LoansSection({ userId, isActive }: LoansSectionProps) {
  const router = useRouter();

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
      const itemTitle = itemsCache[loan.itemId]?.title || "Resource Item";
      const chat = await chatApi.getOrCreateForTransaction({
        transactionId: loan.transactionId,
        ownerId: userId,
        requesterId: loan.borrowerId,
      });

      if (chat.chatId) {
        router.push(`/chat?chatId=${chat.chatId}&itemTitle=${encodeURIComponent(itemTitle)}`);
      } else {
        toast.error("Could not open chat room.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to start chat with the borrower.");
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

        const res = await loansApi.getLoans(params, token!);
        if (!cancelled) {
          if (res.success && res.data) {
            setLoans(res.data.items);
            setTotalCount(res.data.totalCount);
            setTotalPages(res.data.totalPages);

            const itemIds = res.data.items.map((loan) => loan.itemId);
            fetchItemDetails(itemIds);
          } else {
            setLoansError(res.message || "Failed to load loans.");
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
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">My Loans</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Manage and track your listed items currently loaned to other students.
        </p>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-col gap-4 border-b border-neutral-100 pb-5 md:flex-row md:items-center md:justify-between">
        {/* Status Filter pills */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { label: "All", value: "ALL" },
              { label: "Pending", value: LoanStatus.PendingApproval },
              { label: "Handover", value: LoanStatus.AwaitingHandover },
              { label: "Active", value: LoanStatus.Active },
              { label: "Overdue", value: LoanStatus.Overdue },
              { label: "Returned", value: LoanStatus.Returned },
              { label: "Cancelled", value: LoanStatus.Cancelled },
            ] as const
          ).map((filter) => (
            <button
              key={filter.label}
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
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Enhanced Custom Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 focus:border-primary focus:outline-none transition-all shadow-xs cursor-pointer"
              aria-expanded={isSortDropdownOpen}
              aria-haspopup="true"
              aria-label="Sort loans options"
            >
              <span>
                {sortBy === LoanSortBy.LoanDate
                  ? "Date Shared"
                  : sortBy === LoanSortBy.ReturnDueDate
                  ? "Return Date"
                  : "Status"}
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
                
                <div className="absolute right-0 mt-1.5 z-20 w-44 rounded-2xl border border-neutral-200/80 bg-white p-1.5 shadow-lg shadow-neutral-150/40 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">
                    Sort By
                  </p>
                  {(
                    [
                      { label: "Date Shared", value: LoanSortBy.LoanDate },
                      { label: "Return Date", value: LoanSortBy.ReturnDueDate },
                      { label: "Status", value: LoanSortBy.Status },
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
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                        }`}
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
            title={sortDescending ? "Descending Order" : "Ascending Order"}
            aria-label={sortDescending ? "Descending Order" : "Ascending Order"}
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
          <p className="text-neutral-500 font-medium text-sm">Loading loans...</p>
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
            <MdRefresh className="text-sm" /> Try Again
          </button>
        </div>
      ) : loans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 py-16 px-6 text-center">
          <MdHandshake className="text-5xl text-neutral-300 mb-3" />
          <h3 className="font-bold text-neutral-800 text-lg">No loans found</h3>
          <p className="text-neutral-500 text-sm mt-1 max-w-sm mx-auto">
            {statusFilter === "ALL"
              ? "You haven't listed or lent any resources yet. Post an item on the marketplace to start sharing!"
              : "No loans match the selected status filter."}
          </p>
          {statusFilter === "ALL" && (
            <Link
              href="/post"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all"
            >
              Post a Resource
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
                className="group border border-neutral-200 bg-white rounded-3xl p-5 hover:shadow-md hover:border-primary/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                {/* Left: Item image & title */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-150 flex items-center justify-center shrink-0">
                    {itemDetail?.image ? (
                      <Image src={itemDetail.image} alt={itemDetail.title} fill className="object-cover" />
                    ) : (
                      <MdHandshake className="text-neutral-400 text-xl" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-base font-bold text-neutral-900 group-hover:text-primary transition-colors">
                      {itemDetail?.title || "Loading item title..."}
                    </h4>
                    {/* Borrower avatar & name */}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-[9px] font-black text-neutral-700">
                        {initials || <MdPerson />}
                      </span>
                      <span className="truncate text-xs font-semibold text-neutral-600">
                        Lent to {loan.borrowerFullName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Pricing & Dates */}
                <div className="flex flex-col gap-1 text-xs text-neutral-500 shrink-0">
                  {loan.agreedPrice > 0 && <span className="text-sm font-extrabold text-primary mb-0.5">EGP {loan.agreedPrice}</span>}
                  <div className="flex items-center gap-1">
                    <MdOutlineCalendarMonth className="text-neutral-400 text-[14px]" />
                    <span>Shared: {new Date(loan.loanedAt).toLocaleDateString()}</span>
                  </div>
                  {loan.returnDueDate ? (
                    <div className={`flex items-center gap-1 font-medium ${loan.isOverdue ? "text-rose-600 font-bold" : ""}`}>
                      {loan.isOverdue ? (
                        <MdWarning className="text-[14px] leading-none text-rose-500" />
                      ) : (
                        <MdLoop className="text-[14px] leading-none text-neutral-400" />
                      )}
                      <span>
                        Due: {new Date(loan.returnDueDate).toLocaleDateString()}
                        {loan.isOverdue && " (Overdue)"}
                      </span>
                    </div>
                  ) : (
                    <span>No due date</span>
                  )}
                </div>

                {/* Right: Status pill and Action buttons */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0 justify-between sm:justify-start border-t border-neutral-100 sm:border-t-0 pt-3 sm:pt-0">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${badgeClass}`}>
                    {loan.statusLabel}
                  </span>
                  <div className="flex gap-2">
                    {/* Open Chat */}
                    <button
                      type="button"
                      onClick={() => handleChatWithBorrower(loan)}
                      disabled={isStartingChat === loan.transactionId}
                      title="Chat with Borrower"
                      aria-label="Chat with Borrower"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isStartingChat === loan.transactionId ? (
                        <div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <MdChat className="text-[18px]" />
                      )}
                    </button>

                    {/* Handover action if applicable */}
                    {(loan.status === LoanStatus.PendingApproval ||
                      loan.status === LoanStatus.AwaitingHandover ||
                      loan.status === LoanStatus.Active ||
                      loan.status === LoanStatus.Overdue) && (
                      <Link
                        href={`/transactions/${loan.transactionId}/handover`}
                        className="flex items-center gap-1 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                      >
                        Manage
                        <MdChevronRight className="text-[16px]" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-150 pt-5 mt-3">
              <span className="text-xs font-semibold text-neutral-500">
                Page {pageNumber} of {totalPages} ({totalCount} {totalCount === 1 ? "loan" : "loans"} total)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pageNumber === 1 || isLoadingLoans}
                  onClick={() => setPageNumber((prev) => prev - 1)}
                  className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MdArrowBack /> Prev
                </button>
                <button
                  type="button"
                  disabled={pageNumber === totalPages || isLoadingLoans}
                  onClick={() => setPageNumber((prev) => prev + 1)}
                  className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next <MdArrowForward />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
