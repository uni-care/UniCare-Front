"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MdClose, MdFavorite, MdExpandMore } from "react-icons/md";
import { cn } from "@/lib/utils";

interface SponsorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
    const locale = useLocale();
    const isAr = locale === "ar";
    const t = useTranslations("Contribute");

    const [isVisible, setIsVisible] = useState(false);
    const [orgName, setOrgName] = useState("");
    const [sponsorType, setSponsorType] = useState("hosting");
    const [details, setDetails] = useState("");

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

        const typeLabels: Record<string, string> = {
            hosting: t("sponsorTypeHosting"),
            sponsor: t("sponsorTypeSponsor"),
            venture: t("sponsorTypeVenture"),
        };

        const subject = encodeURIComponent("UniCare Sponsorship & Venture Inquiry");
        const body = encodeURIComponent([
            `UniCare Infrastructure & Sponsorship Inquiry`,
            `-------------------------------------------`,
            `Organization/Sponsor: ${orgName || "Individual Partner"}`,
            `Contribution Type: ${typeLabels[sponsorType] || sponsorType}`,
            ``,
            `Proposal Details:`,
            details,
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
                    aria-label="Close sponsor modal"
                >
                    <MdClose className="text-xl" />
                </button>

                {/* Animated Orbit SVG Icon */}
                <div className="size-16 rounded-2xl bg-[#517565]/8 flex items-center justify-center text-[#517565] mb-5 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <style>{`
                            @keyframes orbit-modal-spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                            .orbit-modal-logo {
                                animation: orbit-modal-spin 10s linear infinite;
                                transform-origin: 50px 50px;
                            }
                        `}</style>
                        <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" className="orbit-modal-logo" />
                        <circle cx="50" cy="50" r="14" fill="rgba(81, 117, 101, 0.15)" stroke="currentColor" strokeWidth="2" />
                        <circle cx="50" cy="22" r="5" fill="currentColor" className="orbit-modal-logo" />
                    </svg>
                </div>

                <h3 className={cn("text-2xl font-extrabold text-neutral-900 tracking-tight text-center", isAr ? "font-amiri" : "")}>
                    {t("sponsorModalTitle")}
                </h3>
                <p className={cn("text-neutral-600 text-sm font-light leading-relaxed text-center mt-2.5 mb-6 px-2", isAr ? "text-right" : "text-center")}>
                    {t("sponsorModalDesc")}
                </p>

                <form className="flex flex-col gap-4.5" onSubmit={handleSubmit}>
                    <label className="flex flex-col w-full">
                        <span className="text-neutral-800 text-xs font-semibold pb-1.5 text-start">
                            {isAr ? "الجهة الراعية / الاسم" : "Organization / Name"}
                        </span>
                        <input
                            className="w-full rounded-xl border border-neutral-200 bg-white h-11 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all text-start"
                            type="text"
                            placeholder={isAr ? "مؤسسة، شركة، جامعة، أو بصفتك الشخصية" : "e.g. HostCompany, University Dean, or Self"}
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            required
                        />
                    </label>

                    <label className="flex flex-col w-full">
                        <span className="text-neutral-800 text-xs font-semibold pb-1.5 text-start">
                            {t("sponsorTypeLabel")}
                        </span>
                        <div className="relative">
                            <select
                                className="w-full rounded-xl border border-neutral-200 bg-white h-11 text-sm text-neutral-900 appearance-none cursor-pointer outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all ps-4 pe-10 text-start"
                                value={sponsorType}
                                onChange={(e) => setSponsorType(e.target.value)}
                            >
                                <option value="hosting">{t("sponsorTypeHosting")}</option>
                                <option value="sponsor">{t("sponsorTypeSponsor")}</option>
                                <option value="venture">{t("sponsorTypeVenture")}</option>
                            </select>
                            <div
                                className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 flex items-center end-4"
                            >
                                <MdExpandMore className="text-xl" />
                            </div>
                        </div>
                    </label>

                    <label className="flex flex-col w-full">
                        <span className="text-neutral-800 text-xs font-semibold pb-1.5 text-start">
                            {t("sponsorMessageLabel")}
                        </span>
                        <textarea
                            className="w-full rounded-xl border border-neutral-200 bg-white h-28 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all resize-none text-start"
                            placeholder={t("sponsorMessagePlaceholder")}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#517565] hover:bg-[#517565]/90 text-white h-12 w-full text-sm font-bold shadow-lg shadow-[#517565]/10 transition-all active:scale-[0.98] mt-1.5 flex-row"
                    >
                        <MdFavorite className="text-base text-red-400" />
                        {t("sponsorFormSubmit")}
                    </button>
                </form>
            </div>
        </div>
    );
}
