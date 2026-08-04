"use client";

import { QRCodeSVG } from "qrcode.react";
import type { HandoverCode } from "@/types/transactions";
import { MdWarning, MdVerifiedUser, MdSchedule, MdAutorenew } from "react-icons/md";

interface Props {
    code: HandoverCode;
    itemTitle: string;
    otherPartyName: string;
    otherPartyInitials: string;
    isOwnerView: boolean;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
}

export default function HandoverCard({
    code,
    itemTitle,
    otherPartyName,
    otherPartyInitials,
    isOwnerView,
    onRegenerate,
    isRegenerating = false,
}: Props) {
    const roleLabel = isOwnerView ? "OWNER VERIFICATION" : "REQUESTER VERIFICATION";
    const isExpired = new Date(code.expiresAt) < new Date();

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Warning Notice */}
            <div className="w-full rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3 items-start">
                <MdWarning className="text-red-500 text-xl mt-0.5 shrink-0" />
                <div>
                    <p className="font-bold text-red-800 text-sm">Important Notice</p>
                    <p className="text-red-700 text-sm mt-0.5">
                        {isOwnerView
                            ? "Show this to the renter AFTER confirming the item is safe to close the rental."
                            : "Scan this code with the owner to confirm you have received the item."}
                    </p>
                </div>
            </div>

            {/* QR Card */}
            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 w-full max-w-sm flex flex-col items-center gap-6 border border-primary/10">
                {/* Label */}
                <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                    <MdVerifiedUser className="text-base" />
                    {roleLabel}
                </div>

                {/* QR Code */}
                <div className={`bg-white rounded-xl p-4 shadow-sm border border-neutral-100 ${isExpired ? "opacity-40 grayscale" : ""}`}>
                    <QRCodeSVG
                        value={code.qrPayload || code.pin}
                        size={192}
                        bgColor="#ffffff"
                        fgColor="#1a3a2a"
                        level="M"
                        marginSize={2}
                    />
                </div>

                {isExpired && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm font-medium">
                        <MdSchedule className="text-lg" />
                        Code expired — please regenerate
                    </div>
                )}

                {/* PIN Display */}
                {code.pin && !isExpired && (
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Pin Code</p>
                        <p className="text-3xl font-mono font-black tracking-[0.4em] text-neutral-900">{code.pin}</p>
                    </div>
                )}

                {/* Item & Party Info */}
                <div className="w-full pt-4 border-t border-primary/10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Item</span>
                        <span className="text-sm font-bold text-neutral-800">{itemTitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                            {isOwnerView ? "Renter" : "Owner"}
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                {otherPartyInitials}
                            </div>
                            <span className="text-sm font-medium text-neutral-700">{otherPartyName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Regenerate Button */}
            {onRegenerate && (
                <button
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-full px-8 py-3 font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                    {isRegenerating ? (
                        <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                        <MdAutorenew className="text-xl" />
                    )}
                    Regenerate Code
                </button>
            )}
        </div>
    );
}
