"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import { transactionsApi } from "@/api/transactions-api";
import { TransactionType, type ActiveTransaction } from "@/types/transactions";
import TransactionStatusBadge from "@/components/transactions/TransactionStatusBadge";

export default function TransactionsPage() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<ActiveTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        const token = getAuthToken();
        if (!token) return;

        let cancelled = false;
        async function fetch() {
            try {
                const data = await transactionsApi.getActive(user!.id, token!);
                if (!cancelled) setTransactions(data);
            } catch {
                // silent fail
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        fetch();
        return () => { cancelled = true; };
    }, [user?.id]);

    const getTypeLabel = (type: number) => {
        switch (type) {
            case TransactionType.Lending: return "Lending";
            case TransactionType.Sale: return "Sale";
            case TransactionType.Return: return "Return";
            default: return "Transaction";
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-2">My Transactions</h1>
                    <p className="text-lg text-neutral-500">Track your active exchanges and manage handover verifications.</p>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-neutral-500 font-medium">Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <span className="material-symbols-outlined text-6xl text-neutral-300">receipt_long</span>
                        <p className="text-neutral-500 font-medium text-lg">No active transactions</p>
                        <p className="text-neutral-400 text-sm">When you request or lend an item, it will appear here.</p>
                        <Link
                            href="/marketplace"
                            className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all cursor-pointer"
                        >
                            Browse Marketplace
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {transactions.map((tx) => (
                            <Link
                                key={tx.transactionId}
                                href={`/transactions/${tx.transactionId}/handover`}
                                className="group bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md hover:border-primary/30 transition-all flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-xl">
                                            {tx.type === TransactionType.Return ? "assignment_return" : tx.type === TransactionType.Sale ? "sell" : "handshake"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-neutral-900 group-hover:text-primary transition-colors">
                                            {getTypeLabel(tx.type)}
                                        </span>
                                        <span className="text-xs text-neutral-400">
                                            {tx.isOwner ? "You are the owner" : "You are the requester"} • {new Date(tx.createdAt).toLocaleDateString()}
                                        </span>
                                        {tx.agreedPrice > 0 && (
                                            <span className="text-sm font-bold text-primary mt-1">EGP {tx.agreedPrice}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <TransactionStatusBadge status={tx.status} />
                                    <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">chevron_right</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
