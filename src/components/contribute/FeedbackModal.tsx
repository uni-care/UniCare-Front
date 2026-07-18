"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MdClose, MdEmail } from "react-icons/md";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const locale = useLocale();
    const isAr = locale === "ar";
    const t = useTranslations("Contribute");

    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        const frame = requestAnimationFrame(() => {
            setIsVisible(true);
        });
        return () => cancelAnimationFrame(frame);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 220);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const subject = encodeURIComponent("UniCare User Feedback");
        const body = encodeURIComponent([
            `UniCare User Feedback & Suggestions`,
            `----------------------------------`,
            `Sender Name: ${name || "Anonymous Student"}`,
            `Sender Email: ${email || "Not provided"}`,
            ``,
            `Feedback:`,
            feedback,
        ].join("\n"));

        const mailtoUrl = `mailto:unicare36@gmail.com?subject=${subject}&body=${body}`;
        window.open(mailtoUrl, "_self");
        handleClose();
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-60 flex items-center justify-center bg-neutral-900/40 backdrop-blur-[3px] px-4 transition-opacity duration-200",
                isVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={handleClose}
        >
            <div
                className={cn(
                    "relative w-full max-w-lg rounded-3xl bg-[#f6fff8] border border-[#517565]/10 px-6 md:px-8 py-8 shadow-2xl transition-all duration-200 flex flex-col",
                    isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute cursor-pointer right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="Close feedback modal"
                >
                    <MdClose className="text-xl" />
                </button>

                {/* Animated Chat SVG Icon */}
                <div className="size-16 rounded-2xl bg-[#a4c3b2]/12 flex items-center justify-center text-[#517565] mb-5 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <style>{`
                            @keyframes chat-modal-bounce {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-4px); }
                            }
                            .bounce-chat-modal {
                                animation: chat-modal-bounce 3.5s ease-in-out infinite;
                            }
                        `}</style>
                        <rect x="25" y="25" width="50" height="35" rx="8" fill="rgba(81,117,101,0.05)" stroke="currentColor" strokeWidth="2.5" className="bounce-chat-modal" />
                        <path d="M35 60 L30 72 L45 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="bounce-chat-modal" />
                        <circle cx="42" cy="42" r="2.5" fill="currentColor" className="bounce-chat-modal" />
                        <circle cx="50" cy="42" r="2.5" fill="currentColor" className="bounce-chat-modal" />
                        <circle cx="58" cy="42" r="2.5" fill="currentColor" className="bounce-chat-modal" />
                    </svg>
                </div>

                <h3 className={cn("text-2xl font-extrabold text-neutral-900 tracking-tight text-center", isAr ? "font-amiri" : "")}>
                    {t("feedbackModalTitle")}
                </h3>
                <p className={cn("text-neutral-600 text-sm font-light leading-relaxed text-center mt-2.5 mb-6 px-2", isAr ? "text-right" : "text-center")}>
                    {t("feedbackModalDesc")}
                </p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="flex flex-col flex-1">
                            <span className="text-neutral-800 text-xs font-semibold pb-1.5 text-start">
                                {isAr ? "الاسم (اختياري)" : "Name (Optional)"}
                            </span>
                            <input
                                className="w-full rounded-xl border border-neutral-200 bg-white h-11 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all text-start"
                                type="text"
                                placeholder={isAr ? "مثال: أحمد" : "Jane Doe"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>

                        <label className="flex flex-col flex-1">
                            <span className="text-neutral-800 text-xs font-semibold pb-1.5 text-start">
                                {isAr ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
                            </span>
                            <input
                                className="w-full rounded-xl border border-neutral-200 bg-white h-11 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all text-start"
                                type="email"
                                placeholder="jane@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                    </div>

                    <label className="flex flex-col w-full">
                        <span className="text-neutral-800 text-xs font-semibold pb-1.5 text-start">
                            {t("feedbackFormLabel")}
                        </span>
                        <textarea
                            className="w-full rounded-xl border border-neutral-200 bg-white h-32 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all resize-none text-start"
                            placeholder={t("feedbackFormPlaceholder")}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#517565] hover:bg-[#517565]/90 text-white h-12 w-full text-sm font-bold shadow-lg shadow-[#517565]/10 transition-all active:scale-[0.98] mt-2 flex-row"
                    >
                        <MdEmail className="text-base" />
                        {t("feedbackFormSubmit")}
                    </button>
                </form>
            </div>
        </div>
    );
}
