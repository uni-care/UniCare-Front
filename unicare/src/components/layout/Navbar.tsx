"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading, user, signOut } = useAuth();

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
    const userInitial = user?.fullName?.trim().charAt(0).toUpperCase() ?? "U";

    return (
        <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
            <header className="glass-navbar flex items-center justify-between px-6 py-3 lg:px-8 mx-auto max-w-7xl rounded-full shadow-lg shadow-primary/5 border border-primary/10 relative">
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
                        className={`text-[13px] font-bold tracking-wide flex items-center gap-2 cursor-pointer transition-colors ${isActive("/marketplace") ? "text-primary" : "text-neutral-700 hover:text-primary"}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isActive("/marketplace") ? "text-primary" : "text-neutral-600"}`}>account_tree</span>
                        Marketplace
                    </Link>
                    <Link
                        href="/contribute"
                        className={`text-[13px] font-bold tracking-wide flex items-center gap-2 cursor-pointer transition-colors ${isActive("/contribute") ? "text-primary" : "text-neutral-700 hover:text-primary"}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isActive("/contribute") ? "text-primary" : "text-neutral-600"}`}>group</span>
                        Contribute
                    </Link>
                    <Link
                        href="/about"
                        className={`text-[13px] font-bold tracking-wide flex items-center gap-2 cursor-pointer transition-colors ${isActive("/about") ? "text-primary" : "text-neutral-700 hover:text-primary"}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isActive("/about") ? "text-primary" : "text-neutral-600"}`}>menu_book</span>
                        About
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoading ? null : isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                className="flex cursor-pointer items-center gap-3 rounded-full border border-primary/20 bg-white/70 px-3 py-1.5 transition-colors hover:bg-white"
                            >
                                <span className="text-sm font-bold text-neutral-700">{user.fullName}</span>
                                {user.profilePictureUrl ? (
                                    <Image
                                        src={user.profilePictureUrl}
                                        alt={`${user.fullName} profile`}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-full object-cover border border-primary/20"
                                    />
                                ) : (
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                                        {userInitial}
                                    </span>
                                )}
                                <span className={`material-symbols-outlined text-[18px] text-neutral-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}>
                                    expand_more
                                </span>
                            </button>

                            <div
                                className={`absolute right-0 top-14 w-48 rounded-2xl border border-primary/15 bg-white p-2 shadow-xl transition-all ${isUserMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                                    }`}
                            >
                                <Link
                                    href="/profile"
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-primary/10"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    Profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await signOut();
                                        setIsUserMenuOpen(false);
                                        router.push("/login");
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-6 py-2.5 rounded-full text-[13px] font-bold text-neutral-700 border border-primary/20 hover:bg-white/60 transition-all cursor-pointer"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="bg-primary text-white text-[13px] font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/60 hover:scale-105 transition-transform active:scale-95 cursor-pointer"
                            >
                                Join Ecosystem
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
                    className={`absolute top-20 left-0 right-0 bg-background-light/95 backdrop-blur-xl border border-primary/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl md:hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                        }`}
                >
                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/marketplace"
                            onClick={() => setIsOpen(false)}
                            className={`text-base font-bold transition-colors flex items-center gap-3 p-3 rounded-xl ${isActive("/marketplace") ? "text-primary bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5"}`}
                        >
                            <span className={`material-symbols-outlined text-xl ${isActive("/marketplace") ? "text-primary" : "text-primary/60"}`}>account_tree</span>
                            Marketplace
                        </Link>
                        <Link
                            href="/contribute"
                            onClick={() => setIsOpen(false)}
                            className={`text-base font-bold transition-colors flex items-center gap-3 p-3 rounded-xl ${isActive("/contribute") ? "text-primary bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5"}`}
                        >
                            <span className={`material-symbols-outlined text-xl ${isActive("/contribute") ? "text-primary" : "text-primary/60"}`}>group</span>
                            Contribute
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className={`text-base font-bold transition-colors flex items-center gap-3 p-3 rounded-xl ${isActive("/about") ? "text-primary bg-primary/10" : "text-neutral-700 hover:text-primary hover:bg-primary/5"}`}
                        >
                            <span className={`material-symbols-outlined text-xl ${isActive("/about") ? "text-primary" : "text-primary/60"}`}>menu_book</span>
                            About
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
                                    <span className="font-bold text-neutral-700">{user.fullName}</span>
                                    {user.profilePictureUrl ? (
                                        <Image
                                            src={user.profilePictureUrl}
                                            alt={`${user.fullName} profile`}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover border border-primary/20"
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                                            {userInitial}
                                        </span>
                                    )}
                                </Link>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await signOut();
                                        setIsOpen(false);
                                        router.push("/login");
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3.5 text-center rounded-full text-sm font-bold text-neutral-700 border border-primary/20 hover:bg-white/60 transition-all cursor-pointer"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center bg-primary text-white text-sm font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer"
                                >
                                    Join Ecosystem
                                </Link>
                            </>
                        )}
                    </div>
                </div>

            </header>
        </div>
    );
}
