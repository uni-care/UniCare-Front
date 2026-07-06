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
                <nav className="hidden md:flex items-center gap-8">
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
                <div className="hidden md:flex items-center gap-4">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-neutral-600 border border-neutral-200 bg-white/70 hover:bg-neutral-100 transition-all cursor-pointer", isAr ? "text-[14px]" : "text-xs")}
                        title={isAr ? "Change to English" : "تغيير للغة العربية"}
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
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
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
                                    className={cn("flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-neutral-700 transition-colors hover:bg-primary/10", isAr ? "text-[16px] flex-row-reverse" : "text-sm")}
                                >
                                    <MdOutlinePerson className="text-[22px]" />
                                    {t("profile")}
                                </Link>

                                <div className="border-t border-neutral-100 my-1 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsActivityOpen((prev) => !prev)}
                                        className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold text-neutral-700 transition-colors hover:bg-primary/10 cursor-pointer", isAr ? "text-[16px] flex-row-reverse" : "text-sm")}
                                    >
                                        <span className={cn("flex items-center gap-2", isAr ? "flex-row-reverse" : "")}>
                                            <MdOutlineExplore className="text-[22px] text-neutral-500" />
                                            <span>{isAr ? "نشاطاتي" : "My Activity"}</span>
                                        </span>
                                        <MdExpandMore className={cn("text-[18px] text-neutral-400 transition-transform duration-200", isActivityOpen ? "rotate-180" : "")} />
                                    </button>

                                    {isActivityOpen && (
                                        <div className="mt-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <Link
                                                href="/profile?section=borrows"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] flex-row-reverse pr-4 pl-0" : "text-xs pl-8")}
                                            >
                                                <MdCreditCard className="text-[16px] text-neutral-400" />
                                                {t("myBorrows")}
                                            </Link>
                                            <Link
                                                href="/profile?section=loans"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] flex-row-reverse pr-4 pl-0" : "text-xs pl-8")}
                                            >
                                                <MdSell className="text-[16px] text-neutral-400" />
                                                {t("myLoans")}
                                            </Link>
                                            <Link
                                                href="/my-items"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] flex-row-reverse pr-4 pl-0" : "text-xs pl-8")}
                                            >
                                                <MdOutlineStorefront className="text-[16px] text-neutral-400" />
                                                {t("myItems")}
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] flex-row-reverse pr-4 pl-0" : "text-xs pl-8")}
                                            >
                                                <MdOutlineFavoriteBorder className="text-[16px] text-neutral-400" />
                                                {t("wishlist")}
                                            </Link>
                                            <Link
                                                href="/transactions"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900", isAr ? "text-[14px] flex-row-reverse pr-4 pl-0" : "text-xs pl-8")}
                                            >
                                                <MdOutlineReceiptLong className="text-[16px] text-neutral-400" />
                                                {t("transactions")}
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
                                    className={cn("flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50 border-t border-neutral-100 mt-1 pt-2", isAr ? "text-[16px] text-right flex-row-reverse" : "text-left text-sm")}
                                >
                                    <MdOutlineLogout className="text-[22px]" />
                                    {t("logout")}
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
                    className="md:hidden z-50 flex flex-col items-center justify-center gap-1 h-10 w-10 bg-primary/10 rounded-full cursor-pointer transition-colors hover:bg-primary/20"
                >
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>

                {/* Mobile Nav Dropdown */}
                <div
                    className={`absolute top-20 left-0 right-0 bg-background-light/95 backdrop-blur-xl border border-primary/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl md:hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                >
                    <nav className="flex flex-col gap-2">
                        {/* Mobile Language Switcher */}
                        <button
                            onClick={() => {
                                toggleLanguage();
                                setIsOpen(false);
                            }}
                            className={cn("flex items-center justify-between p-3 rounded-xl font-bold text-neutral-700 hover:bg-primary/5 cursor-pointer", isAr ? "text-[18px] flex-row-reverse" : "text-base")}
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
                            className={cn("group font-bold transition-colors flex items-center gap-3 p-3 rounded-xl", isAr ? "text-[18px] flex-row-reverse" : "text-base", isActive("/marketplace") ? "text-primary bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5")}
                        >
                            <MdOutlineStorefront className={cn("text-2xl transition-colors", isActive("/marketplace") ? "text-primary" : "text-primary/60 group-hover:text-primary")} />
                            {t("marketplace")}
                        </Link>
                        <Link
                            href="/contribute"
                            onClick={() => setIsOpen(false)}
                            className={cn("group font-bold transition-colors flex items-center gap-3 p-3 rounded-xl", isAr ? "text-[18px] flex-row-reverse" : "text-base", isActive("/contribute") ? "text-primary bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5")}
                        >
                            <MdOutlineEngineering className={cn("text-2xl transition-colors", isActive("/contribute") ? "text-primary" : "text-primary/60 group-hover:text-primary")} />
                            {t("contribute")}
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className={cn("group font-bold transition-colors flex items-center gap-3 p-3 rounded-xl", isAr ? "text-[18px] flex-row-reverse" : "text-base", isActive("/about") ? "text-primary bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5")}
                        >
                            <MdOutlineDiversity3 className={cn("text-2xl transition-colors", isActive("/about") ? "text-primary" : "text-primary/60 group-hover:text-primary")} />
                            {t("about")}
                        </Link>
                    </nav>

                    <div className="h-px w-full bg-primary/10"></div>

                    <div className="flex flex-col gap-3">
                        {isLoading ? null : isAuthenticated && user ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className={cn("flex items-center justify-between rounded-2xl border border-primary/20 bg-white/70 px-4 py-3", isAr ? "flex-row-reverse" : "")}
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
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                                            {userInitial}
                                        </span>
                                    )}
                                </Link>
                                {/* Collapsible Activity Section on Mobile */}
                                <div className="rounded-2xl border border-primary/20 bg-white/70 overflow-hidden transition-all">
                                    <button
                                        type="button"
                                        onClick={() => setIsMobileActivityOpen((prev) => !prev)}
                                        className={cn("flex w-full items-center justify-between px-4 py-3 font-bold text-neutral-700 cursor-pointer", isAr ? "text-[18px] flex-row-reverse" : "text-sm")}
                                    >
                                        <span className={cn("flex items-center gap-3", isAr ? "flex-row-reverse" : "")}>
                                            <MdOutlineExplore className="text-primary text-2xl" />
                                            <span>{isAr ? "نشاطاتي" : "My Activity"}</span>
                                        </span>
                                        <MdExpandMore className={cn("text-xl text-neutral-500 transition-transform duration-200", isMobileActivityOpen ? "rotate-180" : "")} />
                                    </button>

                                    {isMobileActivityOpen && (
                                        <div className="flex flex-col border-t border-primary/10 bg-white/40 p-2 gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <Link
                                                href="/profile?section=borrows"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] flex-row-reverse pr-6" : "text-xs pl-8")}
                                            >
                                                <MdCreditCard className="text-[18px] text-neutral-400" />
                                                {t("myBorrows")}
                                            </Link>
                                            <Link
                                                href="/profile?section=loans"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] flex-row-reverse pr-6" : "text-xs pl-8")}
                                            >
                                                <MdSell className="text-[18px] text-neutral-400" />
                                                {t("myLoans")}
                                            </Link>
                                            <Link
                                                href="/my-items"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] flex-row-reverse pr-6" : "text-xs pl-8")}
                                            >
                                                <MdOutlineStorefront className="text-[18px] text-neutral-400" />
                                                {t("myItems")}
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] flex-row-reverse pr-6" : "text-xs pl-8")}
                                            >
                                                <MdOutlineFavoriteBorder className="text-[18px] text-neutral-400" />
                                                {t("wishlist")}
                                            </Link>
                                            <Link
                                                href="/transactions"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsMobileActivityOpen(false);
                                                }}
                                                className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-neutral-600 hover:bg-primary/5 transition-colors", isAr ? "text-[16px] flex-row-reverse pr-6" : "text-xs pl-8")}
                                            >
                                                <MdOutlineReceiptLong className="text-[18px] text-neutral-400" />
                                                {t("transactions")}
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
                                    className={cn("flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 py-3 font-bold text-red-600 transition-colors hover:bg-red-100", isAr ? "text-[18px] flex-row-reverse" : "text-sm")}
                                >
                                    <MdOutlineLogout className="text-[22px]" />
                                    {t("logout")}
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
