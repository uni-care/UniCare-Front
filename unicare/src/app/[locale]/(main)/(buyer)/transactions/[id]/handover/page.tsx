"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import { transactionsApi } from "@/api/transactions-api";
import { TransactionType, type HandoverCode } from "@/types/transactions";
import HandoverCard from "@/components/transactions/HandoverCard";
import PinVerifyForm from "@/components/transactions/PinVerifyForm";

export default function HandoverPage() {
    const params = useParams();
    const router = useRouter();
    const transactionId = params.id as string;
    const { user } = useAuth();

    const [code, setCode] = useState<HandoverCode | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const fetchCode = useCallback(async () => {
        const token = getAuthToken();
        if (!token || !user?.id) return;

        try {
            // Generate code: current user generates, other party verifies
            const data = await transactionsApi.getCode(
                transactionId,
                user.id,     // generatedForUserId
                user.id,     // verifiedByUserId — backend decides who verifies
                token
            );
            setCode(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to load handover code.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, user?.id]);

    useEffect(() => {
        fetchCode();
    }, [fetchCode]);

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        await fetchCode();
        setIsRegenerating(false);
        toast.success("Code regenerated.");
    };

    const handleVerify = async (pin: string) => {
        const token = getAuthToken();
        if (!token || !user?.id) {
            toast.error("Please sign in.");
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
                toast.success(result.message || "Handover verified successfully!");
            } else {
                toast.error(result.message || "Verification failed.");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Verification failed.";
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
                    href="/transactions"
                    className="flex items-center gap-2 text-neutral-500 hover:text-primary font-medium transition-colors w-fit"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Transactions
                </Link>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900">
                        Handover {code?.type === TransactionType.Return ? "Safe Return" : "Verification"}
                    </h1>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-neutral-500 font-medium">Loading handover code...</p>
                    </div>
                ) : verified ? (
                    /* Success State */
                    <div className="flex flex-col items-center text-center gap-6 py-10">
                        <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center ring-4 ring-emerald-200">
                            <span className="material-symbols-outlined text-emerald-600 text-5xl">task_alt</span>
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900">Handover Complete!</h2>
                        <p className="text-neutral-500 max-w-sm">
                            The transaction has been verified successfully. Both parties have confirmed the handover.
                        </p>
                        <Link
                            href="/transactions"
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all cursor-pointer"
                        >
                            Back to Transactions
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                ) : code ? (
                    /* QR + PIN View */
                    <div className="flex flex-col gap-8">
                        <HandoverCard
                            code={code}
                            itemTitle="Resource Item"
                            otherPartyName="Other Party"
                            otherPartyInitials="OP"
                            isOwnerView={true}
                            onRegenerate={handleRegenerate}
                            isRegenerating={isRegenerating}
                        />

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-neutral-200" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Or Enter PIN</span>
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
                        <span className="material-symbols-outlined text-5xl text-neutral-300">error</span>
                        <p className="text-neutral-500 font-medium">Unable to load handover code.</p>
                        <button
                            onClick={fetchCode}
                            className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-xl">refresh</span>
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
