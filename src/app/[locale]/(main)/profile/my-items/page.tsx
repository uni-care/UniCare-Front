"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { itemsApi } from "@/api/items-api";
import { useAuth } from "@/hooks/useAuth";
import ItemCard from "@/components/marketplace/ItemCard";
import { toMarketplaceItem, type MarketplaceItem } from "../../(buyer)/marketplace/data";
import { categoriesApi } from "@/api/categories-api";
import type { CategoryResponse } from "@/types/categories";
import { cn } from "@/lib/utils";
import {
  MdOutlineSearch,
  MdOutlineInbox,
  MdOutlineFileUpload,
} from "react-icons/md";

export default function ProfileMyItemsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const tCat = useTranslations("Categories");

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) return;

    let cancelled = false;
    async function fetchMyItems() {
      try {
        const apiItems = await itemsApi.getAll();
        if (!cancelled) {
          const myApiItems = apiItems.filter((item) => item.ownerId === user?.id);
          const mapped = myApiItems.map((item) => toMarketplaceItem(item, locale));
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
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading, user, locale]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        activeCategoryId === "All" || item.categoryId === activeCategoryId;

      const matchesQuery =
        query.length === 0
          ? true
          : [item.title, item.category].some((field) =>
              field.toLowerCase().includes(query)
            );

      const matchesStatus =
        activeStatus === "All" || item.status === activeStatus;

      return matchesCategory && matchesQuery && matchesStatus;
    });
  }, [activeCategoryId, activeStatus, searchQuery, items]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            {isAr ? "مواردي الخاصة" : "My Items"}
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            {isAr
              ? "إدارة وتتبع الكتب والأدوات والأجهزة المعروضة الخاصة بك."
              : "Manage and track the resources and textbooks you shared."}
          </p>
        </div>
        <Link
          href="/post"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-primary/90"
        >
          <MdOutlineFileUpload className="text-lg" />
          <span>{isAr ? "عرض كتاب أو أداة" : "Post a Resource"}</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative grow max-w-md">
            <MdOutlineSearch
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-neutral-400 text-lg",
                isAr ? "right-3" : "left-3"
              )}
            />
            <input
              type="text"
              placeholder={isAr ? "البحث في مواردي..." : "Search my resources..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full rounded-xl border border-neutral-200 bg-white py-2 text-xs outline-none transition-all focus:border-primary",
                isAr ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"
              )}
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                {isAr ? "الحالة:" : "Status:"}
              </span>
              <select
                value={activeStatus}
                onChange={(e: any) => setActiveStatus(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-bold text-neutral-700 outline-none cursor-pointer"
              >
                <option value="All">{isAr ? "الكل" : "All"}</option>
                <option value="Available">{isAr ? "متاح" : "Available"}</option>
                <option value="Rented">{isAr ? "مستأجر / معار" : "Rented"}</option>
                <option value="Unavailable">{isAr ? "غير متاح" : "Unavailable"}</option>
                <option value="Draft">{isAr ? "مسودة" : "Draft"}</option>
                <option value="Archived">{isAr ? "أرشيف" : "Archived"}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                {isAr ? "التصنيف:" : "Category:"}
              </span>
              <select
                value={activeCategoryId}
                onChange={(e) => setActiveCategoryId(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-bold text-neutral-700 outline-none cursor-pointer max-w-xs"
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

      {/* Items List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-xs font-medium text-neutral-500">
            {isAr ? "جاري تحميل الموارد..." : "Loading resources..."}
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 py-16 text-center">
          <MdOutlineInbox className="text-5xl text-neutral-300" />
          <h3 className="text-base font-bold text-neutral-800">
            {isAr ? "لم يتم العثور على موارد" : "No resources found"}
          </h3>
          <p className="max-w-xs text-xs text-neutral-400">
            {isAr
              ? "لم تقم بإضافة موارد تطابق التصفية."
              : "No resources found matching your current filters."}
          </p>
          {items.length === 0 && (
            <Link
              href="/post"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-primary/90"
            >
              {isAr ? "عرض أول كتاب أو أداة" : "Post Your First Resource"}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
