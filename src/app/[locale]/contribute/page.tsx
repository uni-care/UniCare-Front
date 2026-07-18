"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import JoinTeamForm from "@/components/forms/JoinTeamForm";
import HeroIllustration from "@/components/contribute/HeroIllustration";
import ShareModal from "@/components/contribute/ShareModal";
import FeedbackModal from "@/components/contribute/FeedbackModal";
import SponsorModal from "@/components/contribute/SponsorModal";
import { cn } from "@/lib/utils";
import {
    MdFavorite,
    MdEmail,
    MdHelpOutline,
    MdContentCopy
} from "react-icons/md";

export default function ContributePage() {
    const t = useTranslations("Contribute");
    const locale = useLocale();
    const isAr = locale === "ar";

    // Modal state controllers
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isSponsorOpen, setIsSponsorOpen] = useState(false);

    return (
        <div className="bg-[#f6fff8] min-h-screen pt-28 pb-20 overflow-hidden relative">
            {/* Background Organic Blurs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
                <div className="absolute top-[-5%] right-[-10%] w-120 h-120 rounded-full bg-[#517565]/10 organic-glow"></div>
                <div className="absolute bottom-[5%] left-[-15%] w-130 h-130 rounded-full bg-[#a4c3b2]/15 organic-glow"></div>
            </div>

            <div className="max-w-6xl mx-auto px-5 md:px-8 w-full relative z-10 flex flex-col gap-14">
                
                {/* Hero Section */}
                <section className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-14 py-6">
                    <div className="flex flex-col gap-6 lg:w-1/2 w-full text-start items-start">
                        <div className="flex flex-col gap-3.5 w-full items-start">
                            <span className="text-[#517565] font-bold tracking-widest uppercase text-xs px-3 py-1 rounded-full bg-[#517565]/10 w-fit">
                                {t("heroLabel")}
                            </span>
                            <h1 className={cn(
                                "text-neutral-900 text-4xl font-extrabold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl",
                                isAr ? "font-amiri" : ""
                            )}>
                                {t("heroTitle")}
                            </h1>
                            <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-xl">
                                {t("heroDesc")}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-1 flex-row">
                            <a 
                                href="#build-form-section" 
                                className="flex cursor-pointer items-center justify-center rounded-xl bg-[#517565] hover:bg-[#517565]/90 text-white h-12 px-7 text-base font-bold shadow-lg shadow-[#517565]/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isAr ? "ساهم برمجياً" : "Build the App"}
                            </a>
                            <button 
                                onClick={() => setIsShareOpen(true)} 
                                className="flex h-12 px-7 items-center justify-center rounded-xl border border-[#517565]/30 hover:bg-[#517565]/5 text-neutral-800 text-base font-semibold transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isAr ? "شارك المنصة" : "Share UniCare"}
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 flex items-center justify-center">
                        <HeroIllustration />
                    </div>
                </section>

                {/* 3 Contribution Paths Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Path 1: Spread the Word */}
                    <div className="group bg-white p-7 rounded-2xl border border-[#517565]/10 shadow-[0_4px_20px_rgba(81,117,101,0.03)] flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(81,117,101,0.08)] hover:border-[#517565]/20 transition-all duration-300">
                        <div className="flex flex-col gap-4 text-start items-start">
                            <div className="size-14 rounded-2xl bg-[#517565]/8 flex items-center justify-center text-[#517565]">
                                <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <style>{`
                                        @keyframes heart-pulse {
                                            0%, 100% { transform: scale(1); opacity: 0.8; }
                                            50% { transform: scale(1.1); opacity: 1; }
                                        }
                                        .pulse-logo {
                                            animation: heart-pulse 2s ease-in-out infinite;
                                            transform-origin: 50px 50px;
                                        }
                                    `}</style>
                                    <path d="M50 35 C42 24, 27 28, 50 66 C73 28, 58 24, 50 35 Z" fill="currentColor" className="pulse-logo" />
                                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#517565] transition-colors">
                                    {t("sharePathTitle")}
                                </h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    {t("sharePathDesc")}
                                </p>
                            </div>
                            <div className="w-full bg-[#f6fff8] p-3 rounded-xl border border-neutral-100/80 text-xs text-neutral-600 font-light italic leading-normal text-start">
                                &quot;{t("shareMessage")}&quot;...
                            </div>
                        </div>
                        <div className="pt-6">
                            <button
                                onClick={() => setIsShareOpen(true)}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl text-white min-h-[2.75rem] py-2.5 px-4 w-full text-sm font-bold shadow-md transition-all active:scale-[0.98] bg-[#517565] hover:bg-[#517565]/90 shadow-[#517565]/10"
                            >
                                <MdContentCopy className="text-base shrink-0" />
                                <span className="text-center">{t("shareCta")}</span>
                            </button>
                        </div>
                    </div>

                    {/* Path 2: Share Feedback */}
                    <div className="group bg-white p-7 rounded-2xl border border-[#517565]/10 shadow-[0_4px_20px_rgba(81,117,101,0.03)] flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(81,117,101,0.08)] hover:border-[#517565]/20 transition-all duration-300">
                        <div className="flex flex-col gap-4 text-start items-start">
                            <div className="size-14 rounded-2xl bg-[#a4c3b2]/12 flex items-center justify-center text-[#517565]">
                                <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <style>{`
                                        @keyframes talk-bounce {
                                            0%, 100% { transform: translateY(0); }
                                            50% { transform: translateY(-3px); }
                                        }
                                        .bounce-logo {
                                            animation: talk-bounce 3s ease-in-out infinite;
                                        }
                                    `}</style>
                                    <rect x="25" y="25" width="50" height="35" rx="8" fill="rgba(81,117,101,0.05)" stroke="currentColor" strokeWidth="2.5" className="bounce-logo" />
                                    <path d="M35 60 L30 72 L45 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="bounce-logo" />
                                    <circle cx="42" cy="42" r="2.5" fill="currentColor" className="bounce-logo" />
                                    <circle cx="50" cy="42" r="2.5" fill="currentColor" className="bounce-logo" />
                                    <circle cx="58" cy="42" r="2.5" fill="currentColor" className="bounce-logo" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#517565] transition-colors">
                                    {t("feedbackPathTitle")}
                                </h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    {t("feedbackPathDesc")}
                                </p>
                            </div>
                        </div>
                        <div className="pt-6">
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 min-h-[2.75rem] py-2.5 px-4 w-full text-sm font-bold transition-all"
                            >
                                <MdEmail className="text-base text-neutral-600 shrink-0" />
                                <span className="text-center">{t("feedbackCta")}</span>
                            </button>
                        </div>
                    </div>

                    {/* Path 3: Sponsor & Venture */}
                    <div className="group bg-white p-7 rounded-2xl border border-[#517565]/10 shadow-[0_4px_20px_rgba(81,117,101,0.03)] flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(81,117,101,0.08)] hover:border-[#517565]/20 transition-all duration-300">
                        <div className="flex flex-col gap-4 text-start items-start">
                            <div className="size-14 rounded-2xl bg-[#517565]/8 flex items-center justify-center text-[#517565]">
                                <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <style>{`
                                        @keyframes orbit-spin {
                                            0% { transform: rotate(0deg); }
                                            100% { transform: rotate(360deg); }
                                        }
                                        .orbit-logo {
                                            animation: orbit-spin 10s linear infinite;
                                            transform-origin: 50px 50px;
                                        }
                                    `}</style>
                                    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" className="orbit-logo" />
                                    <circle cx="50" cy="50" r="14" fill="rgba(81, 117, 101, 0.15)" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="50" cy="22" r="5" fill="currentColor" className="orbit-logo" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#517565] transition-colors">
                                    {t("sponsorPathTitle")}
                                </h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    {t("sponsorPathDesc")}
                                </p>
                            </div>
                        </div>
                        <div className="pt-6">
                            <button
                                onClick={() => setIsSponsorOpen(true)}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 min-h-[2.75rem] py-2.5 px-4 w-full text-sm font-bold transition-all"
                            >
                                <MdFavorite className="text-base text-red-500 shrink-0" />
                                <span className="text-center">{t("sponsorCta")}</span>
                            </button>
                        </div>
                    </div>

                </section>

                {/* Form & Apply Builder Section */}
                <section id="build-form-section" className="flex flex-col lg:flex-row gap-10 lg:gap-14 py-8 items-start">
                    <div className="lg:w-5/12 flex flex-col gap-6 lg:sticky lg:top-28 w-full text-start items-start">
                        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#a4c3b2]/20 text-[#517565] text-xs font-bold w-fit">
                            <MdHelpOutline className="text-base" />
                            <span>{isAr ? "مفتوح للتعاون" : "Open Collaboration"}</span>
                        </div>
                        <h2 className={cn(
                            "text-neutral-900 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl",
                            isAr ? "font-amiri" : ""
                        )}>
                            {t("buildPathTitle")}
                        </h2>
                        <p className="text-neutral-600 text-base font-light leading-relaxed">
                            {t("buildPathDesc")}
                        </p>
                        
                        {/* Bullet indicators explaining specialty paths */}
                        <div className="flex flex-col gap-3.5 w-full mt-2">
                            <div className="flex gap-3 items-start flex-row">
                                <div className="size-6 rounded-full bg-[#517565]/10 text-[#517565] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                                <p className="text-neutral-500 text-sm leading-normal">
                                    {isAr ? "تطوير الواجهات الأمامية (Next.js, TypeScript, Tailwind) والخلفية (.NET)" : "Frontend (Next.js, TypeScript, Tailwind) & Backend (.NET) Development"}
                                </p>
                            </div>
                            <div className="flex gap-3 items-start flex-row">
                                <div className="size-6 rounded-full bg-[#517565]/10 text-[#517565] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                                <p className="text-neutral-500 text-sm leading-normal">
                                    {isAr ? "التصميم الإبداعي وواجهات المستخدم ورسم الأشكال التجريدية" : "UI/UX Design & Creative Art/Asset Illustration"}
                                </p>
                            </div>
                            <div className="flex gap-3 items-start flex-row">
                                <div className="size-6 rounded-full bg-[#517565]/10 text-[#517565] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                                <p className="text-neutral-500 text-sm leading-normal">
                                    {isAr ? "الكتابة والترجمة وبناء ثقافة البناء المشترك" : "Content writing, translation, & community culture building"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-7/12 w-full">
                        <JoinTeamForm />
                    </div>
                </section>
            </div>

            {/* Modal Components */}
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
            <SponsorModal isOpen={isSponsorOpen} onClose={() => setIsSponsorOpen(false)} />
        </div>
    );
}
