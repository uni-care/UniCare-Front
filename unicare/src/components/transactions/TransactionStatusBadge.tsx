import { TransactionStatus } from "@/features/transactions/types";

const STATUS_MAP: Record<number, { label: string; color: string }> = {
    [TransactionStatus.Pending]: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200" },
    [TransactionStatus.Active]: { label: "Active", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    [TransactionStatus.AwaitingReturn]: { label: "Awaiting Return", color: "bg-sky-100 text-sky-700 border-sky-200" },
    [TransactionStatus.Completed]: { label: "Completed", color: "bg-neutral-100 text-neutral-600 border-neutral-200" },
    [TransactionStatus.Cancelled]: { label: "Cancelled", color: "bg-red-100 text-red-600 border-red-200" },
};

interface Props {
    status: number;
}

export default function TransactionStatusBadge({ status }: Props) {
    const { label, color } = STATUS_MAP[status] ?? { label: "Unknown", color: "bg-neutral-100 text-neutral-500 border-neutral-200" };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${color}`}>
            <span className="size-1.5 rounded-full bg-current opacity-60" />
            {label}
        </span>
    );
}
