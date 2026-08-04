"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import {
  MdCreditCard,
  MdSell,
  MdStorefront,
  MdSettings,
  MdFavoriteBorder,
  MdReceiptLong,
  MdOutlineShoppingBag,
} from "react-icons/md";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isAr = locale === "ar";
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-neutral-100 px-4 pb-10 pt-28 md:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className={cn("flex items-center gap-3", isAr ? "flex-row-reverse" : "")}>
            <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-sm font-medium text-neutral-500">
              {isAr ? "جاري تحميل الملف الشخصي..." : "Loading profile workspace..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/profile/borrows", label: isAr ? "طلباتي" : "My Borrows", icon: MdCreditCard, matchPrefix: "/profile/borrows" },
    { href: "/profile/loans", label: isAr ? "إعاراتي" : "My Loans", icon: MdSell, matchPrefix: "/profile/loans" },
    { href: "/profile/my-items", label: isAr ? "مواردي" : "My Items", icon: MdStorefront, matchPrefix: "/profile/my-items" },
    { href: "/profile/wishlist", label: isAr ? "المفضلة" : "Wishlist", icon: MdFavoriteBorder, matchPrefix: "/profile/wishlist" },
    { href: "/profile/transactions", label: isAr ? "المعاملات" : "My Transactions", icon: MdReceiptLong, matchPrefix: "/profile/transactions" },
    { href: "/marketplace", label: isAr ? "المتجر" : "Marketplace", icon: MdOutlineShoppingBag, isExternal: true },
    { href: "/profile/settings", label: isAr ? "الإعدادات" : "Settings", icon: MdSettings, matchPrefix: "/profile/settings" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 px-4 pb-12 pt-28 md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        {/* Navigation Sidebar */}
        <aside className="sticky top-[80px] z-30 -mx-4 border-b border-neutral-200 bg-neutral-100/95 px-4 py-3 backdrop-blur-md lg:static lg:z-auto lg:mx-0 lg:h-fit lg:rounded-3xl lg:border lg:border-neutral-200 lg:bg-white lg:px-4 lg:py-4 lg:shadow-sm lg:top-28">
          <p className={cn("mb-4 hidden px-2 text-xs font-bold uppercase tracking-wider text-neutral-400 lg:block", isAr ? "text-right font-sans" : "")}>
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </p>
          <nav
            className="flex flex-row gap-2 overflow-x-auto pb-0.5 lg:flex-col lg:overflow-x-visible lg:space-y-1.5 lg:pb-0"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchPrefix
                ? pathname === item.matchPrefix || (pathname === "/profile" && item.matchPrefix === "/profile/borrows")
                : false;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all lg:w-full lg:px-3.5",
                    isAr ? "text-right text-[13px]" : "",
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/10 lg:bg-primary/10 lg:text-primary lg:shadow-none"
                      : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 lg:bg-transparent"
                  )}
                >
                  <Icon className="text-lg shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          {/* Header User Badge */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 md:text-3xl">
                {isAr ? "حسابي الشخصي" : "My Account"}
              </h1>
              <p className="text-xs font-medium text-neutral-500 mt-0.5">
                {isAr ? "إدارة طلباتك، إعاراتك، والمعاملات النشطة في المنصة" : "Manage your resource borrowings, listings, and active transactions"}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 shadow-xs">
              {user.profilePictureUrl ? (
                <Image
                  src={user.profilePictureUrl}
                  alt={user.fullName}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-xs font-bold text-neutral-800">{user.fullName}</p>
                <p className="text-[11px] text-neutral-500">{user.email ?? (isAr ? "بدون بريد" : "No email")}</p>
              </div>
            </div>
          </div>

          {/* Page Component */}
          {children}
        </div>
      </div>
    </div>
  );
}
