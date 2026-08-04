"use client";

import { useLocale } from "next-intl";
import { TransactionStatus } from "@/types/transactions";

interface Props {
    status: number;
}

export default function TransactionStatusBadge({ status }: Props) {
    const locale = useLocale();
    const isAr = locale === "ar";

    const STATUS_MAP: Record<number, { labelEn: string; labelAr: string; color: string }> = {
        [TransactionStatus.Pending]: {
            labelEn: "Pending",
            labelAr: "قيد الانتظار",
            color: "bg-amber-100 text-amber-700 border-amber-200",
        },
        [TransactionStatus.Active]: {
            labelEn: "Approved",
            labelAr: "مقبول",
            color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        [TransactionStatus.AwaitingReturn]: {
            labelEn: "Awaiting Return",
            labelAr: "بانتظار الإرجاع",
            color: "bg-sky-100 text-sky-700 border-sky-200",
        },
        [TransactionStatus.Completed]: {
            labelEn: "Completed",
            labelAr: "مكتمل",
            color: "bg-neutral-100 text-neutral-600 border-neutral-200",
        },
        [TransactionStatus.Cancelled]: {
            labelEn: "Cancelled",
            labelAr: "ملغى",
            color: "bg-red-100 text-red-600 border-red-200",
        },
    };

    const item = STATUS_MAP[status] ?? {
        labelEn: "Approved",
        labelAr: "مقبول",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${item.color}`}>
            <span className="size-1.5 rounded-full bg-current opacity-60" />
            {isAr ? item.labelAr : item.labelEn}
        </span>
    );
}
