"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { MdKey, MdVerified } from "react-icons/md";

interface Props {
    onVerify: (pin: string) => Promise<void>;
    isVerifying: boolean;
}

export default function PinVerifyForm({ onVerify, isVerifying }: Props) {
    const [pin, setPin] = useState("");
    const locale = useLocale();
    const isAr = locale === "ar";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.trim().length === 0) return;
        await onVerify(pin.trim());
    };

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${isAr ? "text-right" : ""}`}>
            <div>
                <label className="text-sm font-bold text-neutral-700 mb-2 block">
                    {isAr ? "أدخل رمز التحقق (PIN)" : "Enter Handover PIN"}
                </label>
                <div className="relative">
                    <MdKey className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 text-xl ${isAr ? "right-4" : "left-4"}`} />
                    <input
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/[^0-9a-zA-Z]/g, ""))}
                        placeholder={isAr ? "أدخل الرمز المعروض لدى الطرف الآخر" : "Enter the code shown by the other party"}
                        className={`w-full h-14 ${isAr ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-neutral-200 bg-white text-neutral-900 text-center text-xl font-mono tracking-[0.3em] placeholder:text-sm placeholder:tracking-normal placeholder:font-sans focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                        maxLength={8}
                        autoComplete="off"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isVerifying || pin.trim().length === 0}
                className="h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
                {isVerifying ? (
                    <>
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isAr ? "جاري التحقق..." : "Verifying..."}
                    </>
                ) : (
                    <>
                        <MdVerified className="text-xl" />
                        {isAr ? "تأكيد واستلام التسليم" : "Verify Handover"}
                    </>
                )}
            </button>
        </form>
    );
}
