"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { itemsApi } from "@/api/items-api";
import { useAuth } from "@/hooks/useAuth";
import ItemCard from "@/components/marketplace/ItemCard";
import { toMarketplaceItem, type MarketplaceItem } from "../marketplace/data";
import { categoriesApi } from "@/api/categories-api";
import type { CategoryResponse } from "@/types/categories";
import { cn } from "@/lib/utils";
import {
    MdOutlineSearch,
    MdOutlineInbox,
    MdOutlineFileUpload
} from "react-icons/md";

export default function MyItemsPage() {
    const locale = useLocale();
    const isAr = locale === "ar";
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const tCat = useTranslations("Categories");

    // Items and categories states
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search and filters
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategoryId, setActiveCategoryId] = useState("All");
    const [activeStatus, setActiveStatus] = useState<"All" | "Available" | "Rented" | "Draft" | "Archived">("All");

    useEffect(() => {
        let cancelled = false;
        async function fetchCategories() {
            try {
                const list = await categoriesApi.getAll();
                if (!cancelled) {
                    setCategories(list);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        }
        fetchCategories();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!isAuthenticated) {
            return;
        }

        let cancelled = false;
        async function fetchMyItems() {
            try {
                const apiItems = await itemsApi.getAll();
                if (!cancelled) {
                    // Filter for items belonging to the current user
                    const myApiItems = apiItems.filter(item => item.ownerId === user?.id);
                    const mapped = myApiItems.map(item => toMarketplaceItem(item, locale));
                    setItems(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch my items:", error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchMyItems();
        return () => { cancelled = true; };
    }, [isAuthenticated, isAuthLoading, user, locale]);

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return items.filter((item) => {
            const matchesCategory =
                activeCategoryId === "All" || item.categoryId === activeCategoryId;

            const matchesQuery = query.length === 0
                ? true
                : [item.title, item.category].some((field) =>
                    field.toLowerCase().includes(query)
                );

            const matchesStatus =
                activeStatus === "All" || item.status === activeStatus;

            return matchesCategory && matchesQuery && matchesStatus;
        });
    }, [activeCategoryId, activeStatus, searchQuery, items]);

    if (isAuthLoading || isLoading) {
        return (
            <div className="bg-neutral-50 min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-neutral-500 font-medium">
                    {isAr ? "جاري تحميل مواردك الخاصة..." : "Loading your resources..."}
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-neutral-50 min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4 text-center">
                <MdOutlineInbox className="text-6xl text-neutral-300" />
                <h1 className="text-xl font-bold text-neutral-800">
                    {isAr ? "يرجى تسجيل الدخول لعرض مواردك" : "Please sign in to view your items"}
                </h1>
                <Link
                    href="/login"
                    className="mt-2 bg-primary text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    {isAr ? "تسجيل الدخول" : "Sign In"}
                </Link>
            </div>
        );
    }

    return (
        <div className={cn("bg-neutral-50 min-h-screen pt-28 pb-20 px-4 md:px-8", isAr ? "text-right" : "text-left")}>
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tight text-neutral-900 mb-2">
                            {isAr ? "مواردي الخاصة" : "My Items"}
                        </h1>
                        <p className="text-lg text-neutral-500 max-w-2xl italic">
                            {isAr 
                                ? "إدارة وتتبع الكتب والأدوات والأجهزة المعروضة الخاصة بك في الجامعة." 
                                : "Manage and track the academic resources, textbooks, and tools you have shared with the campus community."
                            }
                        </p>
                    </div>
                    <Link
                        href="/post"
                        className={cn(
                            "flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer shrink-0 self-start md:self-auto",
                            isAr ? "flex-row-reverse" : ""
                        )}
                    >
                        <MdOutlineFileUpload className="text-xl" />
                        <span>{isAr ? "عرض كتاب أو أداة" : "Post a Resource"}</span>
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm mb-8">
                    <div className={cn("flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center", isAr ? "lg:flex-row-reverse" : "")}>
                        
                        {/* Search Input */}
                        <div className="relative grow max-w-md">
                            <MdOutlineSearch className={cn("absolute top-1/2 -translate-y-1/2 text-neutral-400 text-xl", isAr ? "right-4" : "left-4")} />
                            <input
                                type="text"
                                placeholder={isAr ? "البحث في مواردي..." : "Search my resources..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm",
                                    isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                )}
                            />
                        </div>

                        {/* Filters Row */}
                        <div className={cn("flex flex-wrap gap-3 items-center", isAr ? "flex-row-reverse" : "")}>
                            {/* Status filter dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                    {isAr ? "الحالة:" : "Status:"}
                                </span>
                                <select
                                    value={activeStatus}
                                    onChange={(e: any) => setActiveStatus(e.target.value)}
                                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 outline-none cursor-pointer"
                                >
                                    <option value="All">{isAr ? "الكل" : "All"}</option>
                                    <option value="Available">{isAr ? "متاح" : "Available"}</option>
                                    <option value="Rented">{isAr ? "مستأجر / معار" : "Rented"}</option>
                                    <option value="Unavailable">{isAr ? "غير متاح" : "Unavailable"}</option>
                                    <option value="Draft">{isAr ? "مسودة" : "Draft"}</option>
                                    <option value="Archived">{isAr ? "أرشيف" : "Archived"}</option>
                                </select>
                            </div>

                            {/* Category filter dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                    {isAr ? "التصنيف:" : "Category:"}
                                </span>
                                <select
                                    value={activeCategoryId}
                                    onChange={(e) => setActiveCategoryId(e.target.value)}
                                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 outline-none cursor-pointer max-w-xs"
                                >
                                    <option value="All">{isAr ? "الكل" : "All"}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {tCat.has(cat.name) ? tCat(cat.name) : cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Items Grid */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white border border-neutral-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                        <MdOutlineInbox className="text-6xl text-neutral-300 animate-bounce" />
                        <h3 className="text-xl font-bold text-neutral-800">
                            {isAr ? "لم يتم العثور على موارد" : "No resources found"}
                        </h3>
                        <p className="text-neutral-500 text-sm max-w-sm">
                            {isAr 
                                ? "لم تقم بإضافة موارد تطابق خيارات التصفية الحالية، أو لم تعرض أي موارد حتى الآن." 
                                : "You haven't listed any items matching your filters, or you haven't listed any resources yet."
                            }
                        </p>
                        {items.length === 0 && (
                            <Link
                                href="/post"
                                className="mt-2 bg-primary text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                {isAr ? "عرض أول كتاب أو أداة" : "Post Your First Resource"}
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item) => (
                            <ItemCard
                                key={item.id}
                                {...item}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
