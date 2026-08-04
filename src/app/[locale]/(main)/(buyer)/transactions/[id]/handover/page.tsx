"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import { useLocale } from "next-intl";
import { transactionsApi } from "@/api/transactions-api";
import { itemsApi } from "@/api/items-api";
import { loansApi } from "@/api/loans-api";
import { TransactionType, type HandoverCode, type ActiveTransaction } from "@/types/transactions";
import HandoverCard from "@/components/transactions/HandoverCard";
import PinVerifyForm from "@/components/transactions/PinVerifyForm";
import {
    MdArrowBack,
    MdArrowForward,
    MdHourglassTop,
    MdRefresh,
    MdTaskAlt,
    MdErrorOutline,
} from "react-icons/md";

export default function HandoverPage() {
    const params = useParams();
    const router = useRouter();
    const locale = useLocale();
    const isAr = locale === "ar";
    const transactionId = params.id as string;
    const { user } = useAuth();

    const [code, setCode] = useState<HandoverCode | null>(null);
    const [transaction, setTransaction] = useState<ActiveTransaction | null>(null);
    const [isPendingApproval, setIsPendingApproval] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const fetchCode = useCallback(async () => {
        const token = getAuthToken();
        if (!token || !user?.id) return;

        setIsLoading(true);
        try {
            // Pre-fetch active transaction details
            let matchedTx: ActiveTransaction | null = null;
            try {
                const allTxs = await transactionsApi.getAll(token);
                if (Array.isArray(allTxs)) {
                    matchedTx = allTxs.find((t) => t.transactionId === transactionId) || null;
                    if (matchedTx) {
                        setTransaction(matchedTx);
                    }
                }
            } catch (err) {
                console.warn("Could not pre-fetch transaction status:", err);
            }

            const txStatus = matchedTx?.status;

            // Check if transaction is pending approval (Status 1 = Pending)
            if (txStatus === 1 || String(txStatus).toLowerCase().includes("pending")) {
                setIsPendingApproval(true);
                setIsLoading(false);
                return;
            }

            // Determine counterpart ID (must be different from logged-in user.id)
            let counterpartId: string | undefined = matchedTx?.isOwner
                ? matchedTx.requesterId
                : matchedTx?.ownerId;

            // Deep resolution if counterpartId is missing or identical to user.id
            if (!counterpartId || counterpartId === user.id) {
                if (matchedTx?.itemId) {
                    try {
                        const item = await itemsApi.getById(matchedTx.itemId);
                        if (item?.ownerId && item.ownerId !== user.id) {
                            counterpartId = item.ownerId;
                        }
                    } catch {
                        // ignore
                    }
                }

                if (!counterpartId || counterpartId === user.id) {
                    try {
                        const loansRes = await loansApi.getLoans({}, token);
                        const items = loansRes?.data?.items;
                        if (Array.isArray(items)) {
                            const loanMatch = items.find((l: any) => l.transactionId === transactionId);
                            if (loanMatch?.borrowerId && loanMatch.borrowerId !== user.id) {
                                counterpartId = loanMatch.borrowerId;
                            }
                        }
                    } catch {
                        // ignore
                    }
                }
            }

            // Fallback to non-matching GUID if counterpart cannot be resolved yet, preventing same-ID 400 error
            const verifiedByUserId = counterpartId && counterpartId !== user.id
                ? counterpartId
                : "00000000-0000-0000-0000-000000000000";

            // Attempt to generate handover code with distinct IDs
            const data = await transactionsApi.getCode(
                transactionId,
                user.id,
                verifiedByUserId,
                token
            );
            setCode(data);
            setIsPendingApproval(false);
        } catch (error: any) {
            const errMsg = error?.response?.data?.error || error?.message || "";
            if (errMsg.toLowerCase().includes("pending") || errMsg.toLowerCase().includes("approve")) {
                setIsPendingApproval(true);
            } else {
                toast.error(errMsg || (isAr ? "فشل تحميل رمز التسليم." : "Failed to load handover code."));
            }
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, user, isAr]);

    useEffect(() => {
        fetchCode();
    }, [fetchCode]);

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        await fetchCode();
        setIsRegenerating(false);
        toast.success(isAr ? "تم إعادة إنشاء الرمز." : "Code regenerated.");
    };

    const handleVerify = async (pin: string) => {
        const token = getAuthToken();
        if (!token || !user?.id) {
            toast.error(isAr ? "يرجى تسجيل الدخول." : "Please sign in.");
            router.push("/login");
            return;
        }

        setIsVerifying(true);
        try {
            const result = await transactionsApi.verifyCode(
                transactionId,
                { verifyingUserId: user.id, pin },
                token
            );

            if (result.success) {
                setVerified(true);
                toast.success(result.message || (isAr ? "تم التحقق بنجاح!" : "Handover verified successfully!"));
            } else {
                toast.error(result.message || (isAr ? "فشل التحقق." : "Verification failed."));
            }
        } catch (error: any) {
            const message = error?.response?.data?.error || error?.message || (isAr ? "فشل التحقق." : "Verification failed.");
            toast.error(message);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-lg mx-auto flex flex-col gap-8">
                {/* Back Link */}
                <Link
                    href="/profile/transactions"
                    className="flex items-center gap-2 text-neutral-500 hover:text-primary font-medium transition-colors w-fit"
                >
                    {isAr ? <MdArrowForward className="text-lg" /> : <MdArrowBack className="text-lg" />}
                    {isAr ? "العودة إلى المعاملات" : "Back to Transactions"}
                </Link>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900">
                        {isPendingApproval
                            ? (isAr ? "طلبك قيد الانتظار" : "Approval Pending")
                            : `Handover ${code?.type === TransactionType.Return ? "Safe Return" : "Verification"}`}
                    </h1>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-neutral-500 font-medium">{isAr ? "جاري تحميل تفاصيل التسليم..." : "Loading handover code..."}</p>
                    </div>
                ) : isPendingApproval ? (
                    /* Pending Approval State */
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-8 shadow-sm flex flex-col items-center text-center gap-6">
                        <div className="size-20 bg-amber-50 rounded-full flex items-center justify-center ring-8 ring-amber-100/50">
                            <MdHourglassTop className="text-amber-600 text-4xl animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-neutral-900">
                                {isAr ? "بانتظار موافقة المالك" : "Waiting for Owner Approval"}
                            </h2>
                            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                                {isAr
                                    ? "تم إرسال طلبك بنجاح. سيصبح رمز التسليم ورمز QR متاحين فور قبول مالك العنصر للطلب."
                                    : "Your request has been submitted. The handover QR code and PIN will become available as soon as the owner approves your request."}
                            </p>
                        </div>
                        {transaction?.itemTitle && (
                            <div className="w-full bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-start">
                                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{isAr ? "العنصر المطلوب" : "Requested Item"}</p>
                                <p className="font-bold text-neutral-800 text-sm mt-0.5">{transaction.itemTitle}</p>
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                            <button
                                onClick={fetchCode}
                                className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
                            >
                                <MdRefresh className="text-lg" />
                                {isAr ? "تحديث الحالة" : "Refresh Status"}
                            </button>
                            <Link
                                href="/profile/transactions"
                                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
                            >
                                {isAr ? "متابعة الطلبات" : "View My Requests"}
                            </Link>
                        </div>
                    </div>
                ) : verified ? (
                    /* Success State */
                    <div className="flex flex-col items-center text-center gap-6 py-10">
                        <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center ring-4 ring-emerald-200">
                            <MdTaskAlt className="text-emerald-600 text-5xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900">{isAr ? "تم اكتمال التسليم!" : "Handover Complete!"}</h2>
                        <p className="text-neutral-500 max-w-sm">
                            {isAr ? "تم التحقق من المعاملة بنجاح وتأكيد التسليم بين الطرفين." : "The transaction has been verified successfully. Both parties have confirmed the handover."}
                        </p>
                        <Link
                            href="/profile/transactions"
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all cursor-pointer"
                        >
                            {isAr ? "العودة إلى المعاملات" : "Back to Transactions"}
                            {isAr ? <MdArrowBack className="text-sm" /> : <MdArrowForward className="text-sm" />}
                        </Link>
                    </div>
                ) : code ? (
                    /* QR + PIN View */
                    <div className="flex flex-col gap-8">
                        {(() => {
                            const isOwner = transaction?.isOwner ?? true;
                            const partyName = isOwner
                                ? (transaction?.requesterFullName || (isAr ? "المستعير" : "Borrower"))
                                : (transaction?.ownerFullName || (isAr ? "المالك" : "Owner"));
                            const partyInitials = partyName ? partyName.charAt(0).toUpperCase() : "U";

                            return (
                                <HandoverCard
                                    code={code}
                                    itemTitle={transaction?.itemTitle || (isAr ? "المورد المطلوب" : "Resource Item")}
                                    otherPartyName={partyName}
                                    otherPartyInitials={partyInitials}
                                    isOwnerView={isOwner}
                                    onRegenerate={handleRegenerate}
                                    isRegenerating={isRegenerating}
                                />
                            );
                        })()}

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-neutral-200" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{isAr ? "أو أدخل الرمز" : "Or Enter PIN"}</span>
                            <div className="flex-1 h-px bg-neutral-200" />
                        </div>

                        {/* PIN Verify Form */}
                        <div className="bg-white rounded-xl border border-neutral-200 p-6">
                            <PinVerifyForm onVerify={handleVerify} isVerifying={isVerifying} />
                        </div>
                    </div>
                ) : (
                    /* Error State */
                    <div className="flex flex-col items-center text-center gap-4 py-10">
                        <MdErrorOutline className="text-5xl text-neutral-300" />
                        <p className="text-neutral-500 font-medium">{isAr ? "عذراً، تعذر تحميل رمز التسليم." : "Unable to load handover code."}</p>
                        <button
                            onClick={fetchCode}
                            className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all cursor-pointer"
                        >
                            <MdRefresh className="text-xl" />
                            {isAr ? "إعادة المحاولة" : "Try Again"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
