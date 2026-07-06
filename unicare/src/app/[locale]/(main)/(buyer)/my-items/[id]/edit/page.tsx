"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { itemsApi } from "@/api/items-api";
import { categoriesApi } from "@/api/categories-api";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import type { CategoryResponse } from "@/types/categories";
import Image from "next/image";
import {
    MdOutlineLabel,
    MdOutlineCategory,
    MdExpandMore,
    MdOutlineEditNote,
    MdArrowBack,
    MdSave,
    MdOutlineAttachMoney,
    MdOutlineLocationOn,
    MdCloudUpload,
    MdDelete,
    MdOutlineDateRange,
    MdInfo
} from "react-icons/md";

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditItemPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const locale = useLocale();
    const isAr = locale === "ar";
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    
    // Page state
    const [isFetchingItem, setIsFetchingItem] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [showCategories, setShowCategories] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [itemType, setItemType] = useState<number>(2); // Default to ForRent (Lend)
    const [price, setPrice] = useState<string>("0.01");
    const [currency, setCurrency] = useState("EGP");
    const [status, setStatus] = useState("Available");
    const [location, setLocation] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableTo, setAvailableTo] = useState("");

    // Load categories
    useEffect(() => {
        let cancelled = false;
        async function fetchCategories() {
            try {
                const list = await categoriesApi.getAll();
                if (!cancelled) {
                    setCategories(list);
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        }
        fetchCategories();
        return () => { cancelled = true; };
    }, []);

    // Load item details
    useEffect(() => {
        if (isAuthLoading) return;
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        let cancelled = false;
        async function fetchItem() {
            try {
                const item = await itemsApi.getById(id);
                if (!cancelled) {
                    if (item.ownerId !== user?.id) {
                        toast.error(isAr ? "ليس لديك صلاحية لتعديل هذا المورد." : "You do not have permission to edit this item.");
                        router.push("/marketplace");
                        return;
                    }
                    setTitle(item.title);
                    setDescription(item.description || "");
                    setCategoryId(item.categoryId);
                    setItemType(item.itemType || (item.availableFrom || item.availableTo ? 2 : 1));
                    setPrice(item.price <= 0.01 ? "0.01" : String(item.price));
                    setCurrency(item.currency || "EGP");
                    setStatus(item.status || "Available");
                    setLocation(item.location || "");
                    setImageUrls(item.imageUrls || []);
                    
                    if (item.availableFrom) {
                        setAvailableFrom(new Date(item.availableFrom).toISOString().slice(0, 16));
                    }
                    if (item.availableTo) {
                        setAvailableTo(new Date(item.availableTo).toISOString().slice(0, 16));
                    }
                    setIsFetchingItem(false);
                }
            } catch (err: any) {
                console.error("Failed to fetch item:", err);
                toast.error(isAr ? "فشل تحميل تفاصيل المورد." : "Failed to load resource details.");
                router.push("/marketplace");
            }
        }
        fetchItem();
        return () => { cancelled = true; };
    }, [id, isAuthenticated, isAuthLoading, user, router, isAr]);

    const getTranslatedCategoryName = (cat: CategoryResponse) => {
        if (!isAr) return cat.name;
        switch (cat.id) {
            case "22222222-2222-2222-2222-222222222222":
                return "الكتب الدراسية والمناهج";
            case "33333333-3333-3333-3333-333333333333":
                return "أدوات المختبرات والعلوم";
            case "44444444-4444-4444-4444-444444444444":
                return "أدوات الفنون والتصميم";
            case "55555555-5555-5555-5555-555555555555":
                return "أدوات الهندسة والتكنولوجيا";
            case "66666666-6666-6666-6666-666666666666":
                return "العلوم الطبية والصحية";
            case "77777777-7777-7777-7777-777777777777":
                return "الأجهزة الإلكترونية";
            case "88888888-8888-8888-8888-888888888888":
                return "الموسيقى والفنون الاستعراضية";
            case "99999999-9999-9999-9999-999999999999":
                return "الرياضة والأنشطة الترفيهية";
            case "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa":
                return "مستلزمات السكن والمعيشة";
            default:
                return cat.name;
        }
    };

    const selectedCategory = categories.find(c => c.id === categoryId);
    const categorySelectorLabel = selectedCategory ? getTranslatedCategoryName(selectedCategory) : (isAr ? "اختر تصنيفًا" : "Select a category");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const authToken = getAuthToken();
        if (!authToken) {
            toast.error(isAr ? "يرجى تسجيل الدخول أولاً." : "Please sign in first.");
            return;
        }

        const file = files[0];
        const toastId = toast.loading(isAr ? "جاري رفع الصورة..." : "Uploading image...");
        try {
            const uploadRes = await itemsApi.uploadImage(id, file, authToken);
            setImageUrls(prev => [...prev, uploadRes.url]);
            toast.success(isAr ? "تم رفع الصورة بنجاح!" : "Image uploaded successfully!", { id: toastId });
        } catch (uploadErr: any) {
            toast.error(uploadErr.message || (isAr ? "فشل رفع الصورة." : "Image upload failed."), { id: toastId });
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImageUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error(isAr ? "اسم المورد مطلوب." : "Resource Name is required.");
            return;
        }
        if (!categoryId) {
            toast.error(isAr ? "يرجى اختيار تصنيف." : "Please select a category.");
            return;
        }

        const numericPrice = itemType === 1 ? parseFloat(price) : 0.01;
        if (itemType === 1 && (isNaN(numericPrice) || numericPrice <= 0)) {
            toast.error(isAr ? "يجب أن يكون السعر أكبر من 0." : "Price must be greater than 0.");
            return;
        }
        if (itemType === 1 && numericPrice > 1000000) {
            toast.error(isAr ? "يجب ألا يتجاوز السعر 1,000,000 جنيه." : "Price must not exceed 1,000,000 EGP.");
            return;
        }

        const formattedFrom = itemType === 2 && availableFrom ? new Date(availableFrom).toISOString() : undefined;
        const formattedTo = itemType === 2 && availableTo ? new Date(availableTo).toISOString() : undefined;

        if (formattedFrom && formattedTo && new Date(formattedTo) <= new Date(formattedFrom)) {
            toast.error(isAr ? "تاريخ النهاية يجب أن يكون بعد تاريخ البداية." : "Available To date must be after Available From date.");
            return;
        }

        const authToken = getAuthToken();
        if (!authToken) {
            toast.error(isAr ? "جلسة منتهية. يرجى تسجيل الدخول." : "Session expired. Please sign in.");
            router.push("/login");
            return;
        }

        setIsSaving(true);
        try {
            await itemsApi.patch(
                id,
                {
                    title,
                    description,
                    price: numericPrice,
                    currency,
                    categoryId,
                    itemType,
                    status,
                    location: location.trim() || undefined,
                    imageUrls,
                    availableFrom: formattedFrom,
                    availableTo: formattedTo
                },
                authToken
            );

            toast.success(isAr ? "تم حفظ التعديلات بنجاح!" : "Resource updated successfully!");
            router.push("/my-items");
        } catch (err: any) {
            console.error("Failed to update item:", err);
            toast.error(err.message || (isAr ? "فشل حفظ التعديلات." : "Failed to save changes."));
        } finally {
            setIsSaving(false);
        }
    };

    if (isAuthLoading || isFetchingItem) {
        return (
            <div className="bg-neutral-50 min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-neutral-500 font-bold text-lg">
                    {isAr ? "جاري تحميل تفاصيل المورد..." : "Loading resource details..."}
                </p>
            </div>
        );
    }

    return (
        <div className={`bg-neutral-50 min-h-screen pt-28 pb-20 ${isAr ? "text-right" : "text-left"}`}>
            <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col gap-6">
                
                {/* Back Link */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-primary transition-colors cursor-pointer self-start ${isAr ? "flex-row-reverse" : ""}`}
                >
                    <MdArrowBack className={`text-lg ${isAr ? "rotate-180" : ""}`} />
                    <span>{isAr ? "الرجوع" : "Back"}</span>
                </button>

                {/* Header */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h1 className="text-3xl font-black text-neutral-900 mb-2">
                        {isAr ? "تعديل المورد" : "Edit Resource"}
                    </h1>
                    <p className="text-neutral-500 text-sm">
                        {isAr 
                            ? "قم بتحديث معلومات الكتب أو الأدوات المعروضة الخاصة بك." 
                            : "Update the information of your listed books, tools, or campus essentials."
                        }
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm">
                        
                        {/* Title */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="title">
                                {isAr ? "اسم المورد" : "Resource Name"}
                            </label>
                            <div className="relative group">
                                <MdOutlineLabel className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors text-[20px]`} />
                                <input
                                    id="title"
                                    type="text"
                                    required
                                    className={`w-full h-12 ${isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm`}
                                    placeholder={isAr ? "مثال: كتاب التفاضل والتكامل" : "e.g., Calculus Textbook"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="status">
                                {isAr ? "الحالة" : "Status"}
                            </label>
                            <div className="relative group">
                                <select
                                    id="status"
                                    className={`w-full h-12 ${isAr ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left"} rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm appearance-none font-semibold cursor-pointer`}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Available">{isAr ? "متاح" : "Available"}</option>
                                    <option value="Rented">{isAr ? "مستأجر / معار" : "Rented"}</option>
                                    <option value="Unavailable">{isAr ? "غير متاح مؤقتاً" : "Unavailable"}</option>
                                    <option value="Draft">{isAr ? "مسودة" : "Draft"}</option>
                                    <option value="Archived">{isAr ? "أرشيف" : "Archived"}</option>
                                </select>
                                <MdExpandMore className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-xl`} />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                {isAr ? "التصنيف" : "Category"}
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCategories(!showCategories)}
                                    className={`w-full h-12 ${isAr ? "pr-12 pl-10 text-right flex-row-reverse" : "pl-12 pr-10 text-left"} rounded-xl border border-neutral-200 bg-white text-neutral-900 font-semibold focus:border-primary transition-all outline-none flex items-center justify-between cursor-pointer text-sm`}
                                >
                                    <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                                        <MdOutlineCategory className="text-neutral-400 text-[20px]" />
                                        <span>{categorySelectorLabel}</span>
                                    </div>
                                    <MdExpandMore className="text-neutral-400 text-xl transition-transform duration-200" style={{ transform: showCategories ? "rotate(180deg)" : "rotate(0deg)" }} />
                                </button>
                            </div>

                            {showCategories && (
                                <div className={`mt-2 p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${isAr ? "flex-row-reverse" : ""}`}>
                                    {categories.map((cat) => {
                                        const isSelected = categoryId === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    setCategoryId(cat.id);
                                                    setShowCategories(false);
                                                }}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                                                    isSelected
                                                        ? "bg-primary border-primary text-white shadow-sm"
                                                        : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
                                                }`}
                                            >
                                                {getTranslatedCategoryName(cat)}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Exchange Type */}
                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                {isAr ? "نوع المشاركة" : "Listing Type"}
                            </label>
                            <div className="flex h-12 p-1 bg-neutral-100/80 rounded-xl border border-neutral-200/50 w-full md:w-80">
                                <button
                                    type="button"
                                    onClick={() => setItemType(2)} // 2 = ForRent / Lend
                                    className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                                        itemType === 2
                                            ? "bg-white text-primary shadow-xs"
                                            : "text-neutral-500 hover:text-neutral-800"
                                    }`}
                                >
                                    {isAr ? "إعارة" : "Lend"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setItemType(1)} // 1 = ForSale / Sale
                                    className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                                        itemType === 1
                                            ? "bg-white text-primary shadow-xs"
                                            : "text-neutral-500 hover:text-neutral-800"
                                    }`}
                                >
                                    {isAr ? "بيع" : "Sale"}
                                </button>
                            </div>
                        </div>

                        {/* Price (Visible only for Sale) */}
                        {itemType === 1 && (
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="price">
                                    {isAr ? "السعر (جنيه مصري)" : "Price (EGP)"}
                                </label>
                                <div className="relative group max-w-xs">
                                    <MdOutlineAttachMoney className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors text-[20px]`} />
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        min="0.01"
                                        max="1000000"
                                        className={`w-full h-12 ${isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm font-semibold`}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Dates (Visible only for Lend) */}
                        {itemType === 2 && (
                            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="availableFrom">
                                        {isAr ? "متاح من تاريخ" : "Available From"}
                                    </label>
                                    <div className="relative group">
                                        <MdOutlineDateRange className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors text-[20px]`} />
                                        <input
                                            id="availableFrom"
                                            type="datetime-local"
                                            className={`w-full h-12 ${isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-xs font-semibold`}
                                            value={availableFrom}
                                            onChange={(e) => setAvailableFrom(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="availableTo">
                                        {isAr ? "متاح إلى تاريخ" : "Available To"}
                                    </label>
                                    <div className="relative group">
                                        <MdOutlineDateRange className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors text-[20px]`} />
                                        <input
                                            id="availableTo"
                                            type="datetime-local"
                                            className={`w-full h-12 ${isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-xs font-semibold`}
                                            value={availableTo}
                                            onChange={(e) => setAvailableTo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="location">
                                {isAr ? "الموقع / الكلية" : "Location / Faculty"}
                            </label>
                            <div className="relative group">
                                <MdOutlineLocationOn className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors text-[20px]`} />
                                <input
                                    id="location"
                                    type="text"
                                    className={`w-full h-12 ${isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm`}
                                    placeholder={isAr ? "مثال: كلية الهندسة - مبنى أ" : "e.g., Faculty of Engineering, Building A"}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <div className={`flex justify-between items-center ${isAr ? "flex-row-reverse" : ""}`}>
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="description">
                                    {isAr ? "الوصف" : "Description"}
                                </label>
                                <span className="text-[10px] text-neutral-400 font-bold">
                                    {isAr ? `${description.length}/1000 حرف` : `${description.length}/1000 characters`}
                                </span>
                            </div>
                            <div className="relative group">
                                <textarea
                                    id="description"
                                    className={`w-full p-4 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none leading-relaxed outline-none text-sm ${isAr ? "text-right pr-4 pl-12" : "text-left pl-4 pr-12"}`}
                                    maxLength={1000}
                                    rows={4}
                                    placeholder={isAr ? "صف حالة المورد أو أي تفاصيل مميزة عنه هنا..." : "Describe the condition, history, or unique details of this item..."}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <MdOutlineEditNote className={`absolute bottom-4 ${isAr ? "left-4" : "right-4"} text-neutral-300 text-2xl pointer-events-none`} />
                            </div>
                        </div>

                    </div>

                    {/* Images Gallery */}
                    <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900">{isAr ? "صور المورد" : "Resource Images"}</h3>
                            <p className="text-neutral-500 text-xs mt-1">
                                {isAr ? "قم برفع صور واضحة تساعد الطلاب على معرفة حالة المورد." : "Upload clear photos to show students the actual condition of your item."}
                            </p>
                        </div>

                        {/* Current Images */}
                        <div className={`flex flex-wrap gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
                            {imageUrls.map((url, index) => (
                                <div key={url} className="relative size-28 rounded-2xl overflow-hidden border border-neutral-200 group">
                                    <Image src={url} alt={`Item ${index + 1}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                                        title={isAr ? "حذف الصورة" : "Delete Image"}
                                    >
                                        <MdDelete className="text-2xl" />
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {imageUrls.length < 5 && (
                                <label className="size-28 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-neutral-400 hover:text-primary">
                                    <MdCloudUpload className="text-3xl" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{isAr ? "رفع صورة" : "Upload"}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className={`flex items-center justify-between bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm ${isAr ? "flex-row-reverse" : ""}`}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 rounded-xl text-neutral-600 font-bold hover:bg-neutral-100 transition-colors cursor-pointer text-sm"
                        >
                            {isAr ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm ${isAr ? "flex-row-reverse" : ""}`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>{isAr ? "جاري الحفظ..." : "Saving..."}</span>
                                </>
                            ) : (
                                <>
                                    <MdSave className="text-lg" />
                                    <span>{isAr ? "حفظ التعديلات" : "Save Changes"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
