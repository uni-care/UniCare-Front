"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MdClose, MdContentCopy, MdDone } from "react-icons/md";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
    const locale = useLocale();
    const isAr = locale === "ar";
    const t = useTranslations("Contribute");

    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const [noticeMessage, setNoticeMessage] = useState("");
    const [canShareNatively, setCanShareNatively] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const frame = requestAnimationFrame(() => {
            setIsVisible(true);
        });
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (typeof navigator !== "undefined" && !!navigator.share && isMobile) {
            setCanShareNatively(true);
        }
        return () => cancelAnimationFrame(frame);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 220);
    };

    const getShareContent = () => {
        const shareUrl = "https://uni-care-front.vercel.app";
        return {
            url: shareUrl,
            text: t("shareMessage") + shareUrl,
        };
    };

    const handleCopy = () => {
        const { text } = getShareContent();
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setNoticeMessage(t("shareSuccess"));
            setTimeout(() => setCopied(false), 3000);
        });
    };

    const fallbackCopyAndRedirect = (platform: string, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            if (platform === "instagram") {
                setNoticeMessage(isAr ? "تم نسخ نص المشاركة! جاري توجيهك إلى رسائل إنستغرام لتبدأ مشاركته..." : "Invite copied! Redirecting to Instagram Direct Messages...");
                setTimeout(() => {
                    window.open("https://instagram.com/direct/inbox/", "_blank");
                    setNoticeMessage("");
                }, 1500);
            } else {
                setNoticeMessage(isAr ? "تم نسخ نص المشاركة! جاري توجيهك إلى رسائل تيك توك لتبدأ مشاركته..." : "Invite copied! Redirecting to TikTok messages...");
                setTimeout(() => {
                    window.open("https://www.tiktok.com/messages", "_blank");
                    setNoticeMessage("");
                }, 1500);
            }
        });
    };

    const handleSystemShare = () => {
        const { text } = getShareContent();
        if (navigator.share) {
            navigator.share({
                title: "UniCare",
                text: text,
            }).catch(() => {});
        }
    };

    const handleSocialShare = (platform: string) => {
        const { text, url } = getShareContent();
        let shareUrl = "";

        switch (platform) {
            case "whatsapp":
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                window.open(shareUrl, "_blank");
                break;
            case "x":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                window.open(shareUrl, "_blank");
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                window.open(shareUrl, "_blank");
                break;
            case "instagram":
                if (canShareNatively && navigator.share) {
                    navigator.share({
                        title: "UniCare",
                        text: text,
                    }).catch(() => {
                        fallbackCopyAndRedirect("instagram", text);
                    });
                } else {
                    fallbackCopyAndRedirect("instagram", text);
                }
                break;
            case "tiktok":
                if (canShareNatively && navigator.share) {
                    navigator.share({
                        title: "UniCare",
                        text: text,
                    }).catch(() => {
                        fallbackCopyAndRedirect("tiktok", text);
                    });
                } else {
                    fallbackCopyAndRedirect("tiktok", text);
                }
                break;
            default:
                break;
        }
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
                    "relative w-full max-w-md rounded-3xl bg-[#f6fff8] border border-[#517565]/10 px-6 py-8 shadow-2xl transition-all duration-200 flex flex-col items-center",
                    isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute cursor-pointer right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="Close share modal"
                >
                    <MdClose className="text-xl" />
                </button>

                {/* Animated Heart Icon */}
                <div className="size-16 rounded-2xl bg-[#517565]/8 flex items-center justify-center text-[#517565] mb-5">
                    <svg viewBox="0 0 100 100" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <style>{`
                            @keyframes heart-modal-pulse {
                                0%, 100% { transform: scale(1); }
                                50% { transform: scale(1.1); }
                            }
                            .pulse-heart-modal {
                                animation: heart-modal-pulse 2s ease-in-out infinite;
                                transform-origin: 50px 50px;
                            }
                        `}</style>
                        <path d="M50 35 C42 24, 27 28, 50 66 C73 28, 58 24, 50 35 Z" fill="currentColor" className="pulse-heart-modal" />
                        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
                    </svg>
                </div>

                <h3 className={cn("text-2xl font-extrabold text-neutral-900 tracking-tight text-center", isAr ? "font-amiri" : "")}>
                    {t("shareModalTitle")}
                </h3>
                <p className={cn("text-neutral-600 text-sm font-light leading-relaxed text-center mt-2.5 mb-6 px-2", isAr ? "text-right" : "text-center")}>
                    {t("shareModalDesc")}
                </p>

                {/* Sharing Grid */}
                <div className="grid grid-cols-5 gap-3.5 w-full mb-6">
                    <button
                        onClick={() => handleSocialShare("whatsapp")}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Share on WhatsApp"
                    >
                        <div className="size-12 rounded-xl bg-white border border-[#517565]/10 flex items-center justify-center text-[#25D366] shadow-[0_4px_12px_rgba(37,211,102,0.08)] group-hover:scale-105 active:scale-95 transition-all duration-200">
                            <FaWhatsapp className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500">WhatsApp</span>
                    </button>

                    <button
                        onClick={() => handleSocialShare("x")}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Share on X"
                    >
                        <div className="size-12 rounded-xl bg-white border border-[#517565]/10 flex items-center justify-center text-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:scale-105 active:scale-95 transition-all duration-200">
                            <FaXTwitter className="text-xl" />
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500">X</span>
                    </button>

                    <button
                        onClick={() => handleSocialShare("facebook")}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Share on Facebook"
                    >
                        <div className="size-12 rounded-xl bg-white border border-[#517565]/10 flex items-center justify-center text-[#1877F2] shadow-[0_4px_12px_rgba(24,119,242,0.08)] group-hover:scale-105 active:scale-95 transition-all duration-200">
                            <FaFacebookF className="text-xl" />
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500">Facebook</span>
                    </button>

                    <button
                        onClick={() => handleSocialShare("instagram")}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Share on Instagram"
                    >
                        <div className="size-12 rounded-xl bg-white border border-[#517565]/10 flex items-center justify-center text-[#E4405F] shadow-[0_4px_12px_rgba(228,64,95,0.08)] group-hover:scale-105 active:scale-95 transition-all duration-200">
                            <FaInstagram className="text-xl" />
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500">Instagram</span>
                    </button>

                    <button
                        onClick={() => handleSocialShare("tiktok")}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Share on TikTok"
                    >
                        <div className="size-12 rounded-xl bg-white border border-[#517565]/10 flex items-center justify-center text-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:scale-105 active:scale-95 transition-all duration-200">
                            <FaTiktok className="text-lg" />
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500">TikTok</span>
                    </button>
                </div>

                {/* System share button if supported */}
                {canShareNatively && (
                    <button
                        onClick={handleSystemShare}
                        className="w-full mb-5 flex items-center justify-center gap-2 rounded-xl bg-[#517565]/10 hover:bg-[#517565]/15 text-[#517565] h-11 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <span>{isAr ? "خيارات المشاركة الإضافية للهاتف" : "Share via Device System Sheet"}</span>
                    </button>
                )}

                {/* Quick Copy Link Row */}
                <div className={cn("w-full bg-white border border-[#517565]/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_15px_rgba(81,117,101,0.02)]", isAr ? "flex-row-reverse" : "flex-row")}>
                    <div className="truncate text-xs font-light text-neutral-500 select-all max-w-[240px]">
                        {getShareContent().text.substring(0, 50)}...
                    </div>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex cursor-pointer items-center justify-center gap-1.5 rounded-xl text-white size-9 text-sm font-bold shadow-md transition-all active:scale-95 shrink-0",
                            copied ? "bg-[#517565] shadow-[#517565]/20" : "bg-[#517565] hover:bg-[#517565]/90 shadow-[#517565]/10"
                        )}
                        title="Copy text to clipboard"
                    >
                        {copied ? <MdDone className="text-lg" /> : <MdContentCopy className="text-base" />}
                    </button>
                </div>

                {/* Status Notice Indicator */}
                {noticeMessage && (
                    <div className="mt-4 text-xs font-semibold text-[#517565] animate-pulse text-center bg-[#517565]/5 border border-[#517565]/10 px-4 py-2 rounded-xl w-full">
                        {noticeMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
