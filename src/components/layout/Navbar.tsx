"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import {
    MdOutlineStorefront,
    MdOutlineEngineering,
    MdOutlineDiversity3,
    MdExpandMore,
    MdOutlinePerson,
    MdOutlineReceiptLong,
    MdOutlineLogout,
    MdOutlineLanguage,
    MdCreditCard,
    MdSell,
    MdOutlineFavoriteBorder,
    MdOutlineExplore
} from "react-icons/md";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isMobileActivityOpen, setIsMobileActivityOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading, user, signOut } = useAuth();
    const t = useTranslations("Navbar");
    const locale = useLocale();
    const isAr = locale === "ar";

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
    const userInitial = user?.fullName?.trim().charAt(0).toUpperCase() ?? "U";

    const toggleLanguage = () => {
        const nextLocale = locale === "en" ? "ar" : "en";
        router.push(pathname, { locale: nextLocale });
    };

    return (
        <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
            <header className="glass-navbar flex items-center justify-between px-6 lg:px-8 mx-auto max-w-7xl rounded-full shadow-lg shadow-primary/5 border border-primary/10 relative">
                <Link href="/" className="flex items-center gap-2.5 group cursor-pointer z-50">
                    <Image
                        src="/Logo.svg"
                        alt="UniCare Logo"
                        width={120}
                        height={60}
                        className="h-16 w-auto"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link
                        href="/marketplace"
                        className={cn("group font-bold flex items-center gap-2 cursor-pointer transition-colors", isAr ? "text-[16px]" : "text-[13px] tracking-wide", isActive("/marketplace") ? "text-primary" : "text-neutral-700 hover:text-primary")}
                    >
                        <MdOutlineStorefront className={cn("text-[24px] transition-colors", isActive("/marketplace") ? "text-primary" : "text-neutral-600 group-hover:text-primary")} />
                        {t("marketplace")}
                    </Link>
                    <Link
                        href="/contribute"
                        className={cn("group font-bold flex items-center gap-2 cursor-pointer transition-colors", isAr ? "text-[16px]" : "text-[13px] tracking-wide", isActive("/contribute") ? "text-primary" : "text-neutral-700 hover:text-primary")}
                    >
                        <MdOutlineEngineering className={cn("text-[24px] transition-colors", isActive("/contribute") ? "text-primary" : "text-neutral-600 group-hover:text-primary")} />
                        {t("contribute")}
                    </Link>
                    <Link
                        href="/about"
                        className={cn("group font-bold flex items-center gap-2 cursor-pointer transition-colors", isAr ? "text-[16px]" : "text-[13px] tracking-wide", isActive("/about") ? "text-primary" : "text-neutral-700 hover:text-primary")}
                    >
                        <MdOutlineDiversity3 className={cn("text-[24px] transition-colors", isActive("/about") ? "text-primary" : "text-neutral-600 group-hover:text-primary")} />
                        {t("about")}
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-neutral-600 border border-neutral-200 bg-white/70 hover:bg-neutral-100 transition-all cursor-pointer", isAr ? "text-[14px]" : "text-xs")}
                        title={isAr ? "Change to English" : "تغيير للغة العربية"}
                        aria-label={isAr ? "Change language to English" : "تغيير اللغة إلى العربية"}
                    >
                        <MdOutlineLanguage className="text-[20px] text-neutral-500" />
                        {isAr ? "English" : "العربية"}
                    </button>

                    {isLoading ? null : isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                className="flex cursor-pointer items-center gap-3 rounded-full border border-primary/20 bg-white/70 px-3 py-1.5 transition-colors hover:bg-white"
                                aria-label="User account menu"
                                aria-haspopup="true"
                                aria-expanded={isUserMenuOpen}
                            >
                                <span className={cn("font-bold text-neutral-700", isAr ? "text-[16px]" : "text-sm")}>{user.fullName}</span>
                                {user.profilePictureUrl ? (
                                    <Image
                                        src={user.profilePictureUrl}
                                        alt={`${user.fullName} profile`}
                                        width={40}
                                        height={40}
                                        className="h-8 w-8 rounded-full object-cover border border-primary/20"
                                        priority
                                    />
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-[#345144]">
                                        {userInitial}
                                    </span>
                                )}
                                <MdExpandMore className={`text-[18px] text-neutral-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            <div
                                className={`absolute ${isAr ? "left-0" : "right-0"} top-14 w-56 rounded-2xl border border-primary/15 bg-white p-2 shadow-xl transition-all ${isUserMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}
                            >
                                <Link
                                    href="/profile"
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        setIsActivityOpen(false);
                                    }}
                                    className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-neutral-700 transition-colors hover:bg-primary/10", isAr ? "text-[16px] text-right" : "text-sm text-left")}
                                >
                                    <MdOutlinePerson className="text-[22px] shrink-0" />
                                    <span>{t("profile")}</span>
                                </Link>

                                <div className="border-t border-neutral-100 my-1 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsActivityOpen((prev) => !prev)}
                                        className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold text-neutral-700 transition-colors hover:bg-primary/10 cursor-pointer", isAr ? "text-[16px] text-right" : "text-sm text-left")}
                                        aria-expanded={isActivityOpen}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <MdOutlineExplore className="text-[22px] text-neutral-500 shrink-0" />
                                            <span>{isAr ? "نشاطاتي" : "My Activity"}</span>
                                        </span>
                                        <MdExpandMore className={cn("text-[18px] text-neutral-400 transition-transform duration-200 shrink-0", isActivityOpen ? "rotate-180" : "")} />
                                    </button>

                                    {isActivityOpen && (
                                        <div className="mt-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <Link
                                                href="/profile/borrows"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-lg py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] text-right pr-6 pl-2" : "text-xs text-left pl-6 pr-2")}
                                            >
                                                <MdCreditCard className="text-[16px] text-neutral-400 shrink-0" />
                                                <span>{t("myBorrows")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/loans"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-lg py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] text-right pr-6 pl-2" : "text-xs text-left pl-6 pr-2")}
                                            >
                                                <MdSell className="text-[16px] text-neutral-400 shrink-0" />
                                                <span>{t("myLoans")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/my-items"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-lg py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] text-right pr-6 pl-2" : "text-xs text-left pl-6 pr-2")}
                                            >
                                                <MdOutlineStorefront className="text-[16px] text-neutral-400 shrink-0" />
                                                <span>{t("myItems")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/wishlist"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-lg py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] text-right pr-6 pl-2" : "text-xs text-left pl-6 pr-2")}
                                            >
                                                <MdOutlineFavoriteBorder className="text-[16px] text-neutral-400 shrink-0" />
                                                <span>{t("wishlist")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/transactions"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-lg py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] text-right pr-6 pl-2" : "text-xs text-left pl-6 pr-2")}
                                            >
                                                <MdOutlineReceiptLong className="text-[16px] text-neutral-400 shrink-0" />
                                                <span>{t("transactions")}</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        await signOut();
                                        setIsUserMenuOpen(false);
                                        setIsActivityOpen(false);
                                        router.push("/login");
                                    }}
                                    className={cn("flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50 border-t border-neutral-100 mt-1 pt-2", isAr ? "text-[16px] text-right" : "text-left text-sm")}
                                >
                                    <MdOutlineLogout className="text-[22px] shrink-0" />
                                    <span>{t("logout")}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* <Link
                                href="/login"
                                className={cn("px-6 py-2.5 rounded-full font-bold text-neutral-700 border border-primary/20 hover:bg-white/60 transition-all cursor-pointer", isAr ? "text-[15px]" : "text-[13px]")}
                            >
                                {t("login")}
                            </Link> */}
                            <Link
                                href="/register"
                                className={cn("bg-primary text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/60 hover:scale-105 transition-transform active:scale-95 cursor-pointer", isAr ? "text-[15px]" : "text-[13px]")}
                            >
                                {t("join")}
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden z-50 flex flex-col items-center justify-center gap-1 h-10 w-10 bg-primary/10 rounded-full cursor-pointer transition-colors hover:bg-primary/20"
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                >
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>

                {/* Mobile Nav Dropdown */}
                <div
                    className={`absolute top-20 left-0 right-0 bg-background-light/95 backdrop-blur-xl border border-primary/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl lg:hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                >
                    <nav className="flex flex-col gap-2">
                        {/* Mobile Language Switcher */}
                        <button
                            onClick={() => {
                                toggleLanguage();
                                setIsOpen(false);
                            }}
                            className={cn("flex items-center justify-between p-3 rounded-xl font-bold text-neutral-700 hover:bg-primary/5 cursor-pointer", isAr ? "text-[18px] flex-row-reverse" : "text-base")}
                            aria-label={isAr ? "Change language to English" : "تغيير اللغة إلى العربية"}
                        >
                            <span className={cn("flex items-center gap-3", isAr ? "flex-row-reverse" : "")}>
                                <MdOutlineLanguage className="text-2xl text-primary" />
                                {isAr ? "English" : "العربية"}
                            </span>
                            <span className={cn("text-neutral-400 font-normal", isAr ? "text-[14px]" : "text-xs")}>
                                {isAr ? "تغيير للإنجليزية" : "تغيير للعربية"}
                            </span>
                        </button>

                        <Link
                            href="/marketplace"
                            onClick={() => setIsOpen(false)}
                            className={cn("group font-bold transition-colors flex items-center gap-3 p-3 rounded-xl", isAr ? "text-[18px] text-right" : "text-base text-left", isActive("/marketplace") ? "text-[#345144] bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5")}
                        >
                            <MdOutlineStorefront className={cn("text-2xl transition-colors shrink-0", isActive("/marketplace") ? "text-[#345144]" : "text-primary/60 group-hover:text-primary")} />
                            <span>{t("marketplace")}</span>
                        </Link>
                        <Link
                            href="/contribute"
                            onClick={() => setIsOpen(false)}
                            className={cn("group font-bold transition-colors flex items-center gap-3 p-3 rounded-xl", isAr ? "text-[18px] text-right" : "text-base text-left", isActive("/contribute") ? "text-[#345144] bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5")}
                        >
                            <MdOutlineEngineering className={cn("text-2xl transition-colors shrink-0", isActive("/contribute") ? "text-[#345144]" : "text-primary/60 group-hover:text-primary")} />
                            <span>{t("contribute")}</span>
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className={cn("group font-bold transition-colors flex items-center gap-3 p-3 rounded-xl", isAr ? "text-[18px] text-right" : "text-base text-left", isActive("/about") ? "text-[#345144] bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5")}
                        >
                            <MdOutlineDiversity3 className={cn("text-2xl transition-colors shrink-0", isActive("/about") ? "text-[#345144]" : "text-primary/60 group-hover:text-primary")} />
                            <span>{t("about")}</span>
                        </Link>
                    </nav>

                    <div className="h-px w-full bg-primary/10"></div>

                    <div className="flex flex-col gap-3">
                        {isLoading ? null : isAuthenticated && user ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between rounded-2xl border border-primary/20 bg-white/70 px-4 py-3"
                                >
                                    <span className={cn("font-bold text-neutral-700", isAr ? "text-[18px]" : "text-sm")}>{user.fullName}</span>
                                    {user.profilePictureUrl ? (
                                        <Image
                                            src={user.profilePictureUrl}
                                            alt={`${user.fullName} profile`}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover border border-primary/20"
                                            priority
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-[#345144]">
                                            {userInitial}
                                        </span>
                                    )}
                                </Link>
                                {/* Collapsible Activity Section on Mobile */}
                                <div className="rounded-2xl border border-primary/20 bg-white/70 overflow-hidden transition-all">
                                    <button
                                        type="button"
                                        onClick={() => setIsMobileActivityOpen((prev) => !prev)}
                                        className={cn("flex w-full items-center justify-between px-4 py-3 font-bold text-neutral-700 cursor-pointer", isAr ? "text-[18px] text-right" : "text-sm text-left")}
                                        aria-expanded={isMobileActivityOpen}
                                    >
                                        <span className="flex items-center gap-3">
                                            <MdOutlineExplore className="text-primary text-2xl shrink-0" />
                                            <span>{isAr ? "نشاطاتي" : "My Activity"}</span>
                                        </span>
                                        <MdExpandMore className={cn("text-xl text-neutral-500 transition-transform duration-200 shrink-0", isMobileActivityOpen ? "rotate-180" : "")} />
                                    </button>

                                    {isMobileActivityOpen && (
                                        <div className="flex flex-col border-t border-primary/10 bg-white/40 p-2 gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <Link
                                                href="/profile/borrows"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] text-right pr-6" : "text-xs text-left pl-6")}
                                            >
                                                <MdCreditCard className="text-[18px] text-neutral-400 shrink-0" />
                                                <span>{t("myBorrows")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/loans"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] text-right pr-6" : "text-xs text-left pl-6")}
                                            >
                                                <MdSell className="text-[18px] text-neutral-400 shrink-0" />
                                                <span>{t("myLoans")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/my-items"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] text-right pr-6" : "text-xs text-left pl-6")}
                                            >
                                                <MdOutlineStorefront className="text-[18px] text-neutral-400 shrink-0" />
                                                <span>{t("myItems")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/wishlist"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] text-right pr-6" : "text-xs text-left pl-6")}
                                            >
                                                <MdOutlineFavoriteBorder className="text-[18px] text-neutral-400 shrink-0" />
                                                <span>{t("wishlist")}</span>
                                            </Link>
                                            <Link
                                                href="/profile/transactions"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] text-right pr-6" : "text-xs text-left pl-6")}
                                            >
                                                <MdOutlineReceiptLong className="text-[18px] text-neutral-400 shrink-0" />
                                                <span>{t("transactions")}</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        await signOut();
                                        setIsOpen(false);
                                        setIsMobileActivityOpen(false);
                                        router.push("/login");
                                    }}
                                    className={cn("flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 py-3 font-bold text-red-600 transition-colors hover:bg-red-100", isAr ? "text-[18px] text-right" : "text-sm text-left")}
                                >
                                    <MdOutlineLogout className="text-[22px] shrink-0" />
                                    <span>{t("logout")}</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className={cn("w-full py-3.5 text-center rounded-full font-bold text-neutral-700 border border-primary/20 hover:bg-white/60 transition-all cursor-pointer", isAr ? "text-[17px]" : "text-sm")}
                                >
                                    {t("login")}
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className={cn("w-full text-center bg-primary text-white font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer", isAr ? "text-[17px]" : "text-sm")}
                                >
                                    {t("join")}
                                </Link>
                            </>
                        )}
                    </div>
                </div>

            </header>
        </div>
    );
}
