"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                        className="text-[13px] font-bold text-neutral-700 hover:text-primary transition-colors tracking-wide flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px] text-neutral-600">account_tree</span>
                        Marketplace
                    </Link>
                    <Link
                        href="/contribute"
                        className="text-[13px] font-bold text-neutral-700 hover:text-primary transition-colors tracking-wide flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px] text-neutral-600">group</span>
                        Contribute
                    </Link>
                    <Link
                        href="/about"
                        className="text-[13px] font-bold text-neutral-700 hover:text-primary transition-colors tracking-wide flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px] text-neutral-600">menu_book</span>
                        About
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="px-6 py-2.5 rounded-full text-[13px] font-bold text-neutral-700 border border-primary/20 hover:bg-white/60 transition-all cursor-pointer">
                        Sign In
                    </button>
                    <button className="bg-primary text-white text-[13px] font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/60 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                        Join Ecosystem
                    </button>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden z-50 flex flex-col items-center justify-center gap-[4px] h-10 w-10 bg-primary/10 rounded-full cursor-pointer transition-colors hover:bg-primary/20"
                >
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></span>
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-0.5 w-4 bg-neutral-700 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></span>
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
                            className="text-base font-bold text-neutral-700 hover:text-primary transition-colors flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5"
                        >
                            <span className="material-symbols-outlined text-xl text-primary/60">account_tree</span>
                            Marketplace
                        </Link>
                        <Link
                            href="/contribute"
                            onClick={() => setIsOpen(false)}
                            className="text-base font-bold text-neutral-700 hover:text-primary transition-colors flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5"
                        >
                            <span className="material-symbols-outlined text-xl text-primary/60">group</span>
                            Contribute
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="text-base font-bold text-neutral-700 hover:text-primary transition-colors flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5"
                        >
                            <span className="material-symbols-outlined text-xl text-primary/60">menu_book</span>
                            About
                        </Link>
                    </nav>

                    <div className="h-[1px] w-full bg-primary/10"></div>

                    <div className="flex flex-col gap-3">
                        <button className="w-full py-3.5 rounded-full text-sm font-bold text-neutral-700 border border-primary/20 hover:bg-white/60 transition-all cursor-pointer">
                            Sign In
                        </button>
                        <button className="w-full bg-primary text-white text-sm font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer">
                            Join Ecosystem
                        </button>
                    </div>
                </div>

            </header>
        </div>
    );
}
