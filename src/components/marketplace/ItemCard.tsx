import { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
    MdOutlineImage,
    MdOutlineSchedule,
    MdFavorite,
    MdFavoriteBorder,
    MdExpandMore,
    MdOutlineCalendarToday,
    MdSend,
    MdMoreVert,
    MdEdit
} from "react-icons/md";

interface ItemCardProps {
    id: string;
    title: string;
    category: string;
    department: string;
    image: string;
    price: string | number;
    currency?: string;
    status: string;
    type: "LEND" | "SALE";
    isFavorited: boolean;
    user: {
        name: string;
        initials: string;
        time: string;
    };
    onRequestClick?: (itemId: string) => void;
    onFavoriteClick?: (itemId: string) => void;
    isRequested?: boolean;
    availableFrom?: string;
    availableTo?: string;
    description?: string;
    ownerId?: string;
}

export default function ItemCard({
    id,
    title,
    category,
    department,
    image,
    price,
    currency,
    status,
    type,
    isFavorited,
    user,
    onRequestClick,
    onFavoriteClick,
    isRequested = false,
    availableFrom,
    availableTo,
    description,
    ownerId,
}: ItemCardProps) {
    const router = useRouter();
    const locale = useLocale();
    const isAr = locale === "ar";
    const tCat = useTranslations("Categories");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user: currentUser } = useAuth();
    const isOwner = currentUser?.id === ownerId;
    const isValidImage = typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/"));
    const isFree = price === 0 || price === "Free" || price === 0.01 || price === "0.01";
    const hasAvailableFrom = typeof availableFrom === "string" && availableFrom.trim().length > 0;
    const hasAvailableTo = typeof availableTo === "string" && availableTo.trim().length > 0;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "";
            return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "";
        }
    };

    const displayStatus = () => {
        const lower = status?.toLowerCase();
        if (lower === "available") return isAr ? "متاح" : "Available";
        if (lower === "rented") return isAr ? "مستأجر" : "Rented";
        if (lower === "unavailable") return isAr ? "غير متاح" : "Unavailable";
        if (lower === "draft") return isAr ? "مسودة" : "Draft";
        return status;
    };

    return (
        <div
            onClick={() => router.push(`/marketplace/${id}`)}
            className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100 flex flex-col h-full cursor-pointer text-left"
        >
            {/* Image Container */}
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-neutral-50 mb-4 flex items-center justify-center border border-neutral-100">
                {isValidImage ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-neutral-400">
                        <MdOutlineImage className="text-4xl" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            {isAr ? "لا توجد صورة" : "No Image"}
                        </span>
                    </div>
                )}

                {/* Badges */}
                <div className={`absolute top-3 ${isAr ? "right-3" : "left-3"} flex flex-col gap-2`}>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
                        <span className={`size-2 rounded-full ${status?.toLowerCase() === "available" || status?.toLowerCase() === "available now" ? "bg-primary" : "bg-amber-500"} animate-pulse`}></span>
                        <span className={cn("font-bold text-neutral-700", isAr ? "text-[12px]" : "text-[10px] uppercase tracking-wider")}>{displayStatus()}</span>
                    </div>
                    {isRequested ? (
                        <div className={cn("inline-flex self-start items-center gap-1 px-3 py-1 rounded-full font-black bg-amber-100 text-amber-700 border border-amber-300", isAr ? "text-[12px]" : "text-[10px] tracking-widest")}>
                            <MdOutlineSchedule className="text-[12px]" />
                            {isAr ? "تم الطلب" : "REQUESTED"}
                        </div>
                    ) : null}
                </div>

                {/* Type Badge (Bottom Left / Right based on dir) */}
                <div className={cn(
                    "absolute bottom-3 px-3 py-1 rounded-full font-black shadow-md backdrop-blur-sm select-none",
                    isAr ? "right-3 text-[12px]" : "left-3 text-[10px] tracking-widest",
                    type === "LEND" ? "bg-primary text-white" : "bg-rose-500 text-white"
                )}>
                    {type === "LEND" ? (isAr ? "إعارة" : "LEND") : (isAr ? "بيع" : "SALE")}
                </div>

                {/* Favorite Button / Owner Actions Dropdown */}
                {isOwner ? (
                    <div className={`absolute top-3 ${isAr ? "left-3" : "right-3"}`}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDropdownOpen((prev) => !prev);
                            }}
                            className="size-10 rounded-full bg-white/85 backdrop-blur-md border border-white/45 flex items-center justify-center transition-all shadow-sm cursor-pointer text-neutral-600 hover:text-primary hover:bg-white active:scale-95 animate-in fade-in zoom-in-95 duration-200"
                            title={isAr ? "خيارات المورد" : "Item Options"}
                            aria-label={isAr ? "خيارات المورد" : "Item Options"}
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                        >
                            <MdMoreVert className="text-xl" />
                        </button>
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen(false);
                                    }}
                                />
                                <div className={`absolute ${isAr ? "left-0" : "right-0"} mt-2 z-50 w-32 rounded-2xl border border-neutral-100 bg-white/95 backdrop-blur-lg p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150`}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDropdownOpen(false);
                                            router.push(`/my-items/${id}/edit`);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                                    >
                                        <MdEdit className="text-sm shrink-0" />
                                        <span>{isAr ? "تعديل" : "Edit"}</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteClick?.(id);
                        }}
                        className={`absolute top-3 ${isAr ? "left-3" : "right-3"} size-10 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center transition-all shadow-sm cursor-pointer ${isFavorited ? "text-rose-500" : "text-neutral-500 hover:text-rose-500"
                            }`}
                        aria-label={isFavorited ? (isAr ? "إزالة من المفضلة" : "Remove from favorites") : (isAr ? "إضافة إلى المفضلة" : "Add to favorites")}
                    >
                        {isFavorited ? (
                            <MdFavorite className="text-xl text-rose-500" />
                        ) : (
                            <MdFavoriteBorder className="text-xl" />
                        )}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="grow flex flex-col">
                <div className="flex items-start justify-between mb-1">
                    <h3 className={`text-lg font-bold text-neutral-800 line-clamp-1 group-hover:text-primary transition-colors ${isAr ? "text-right" : "text-left"}`}>
                        {title}
                    </h3>
                </div>
                <p className={`text-xs font-semibold text-neutral-400 mb-3 uppercase tracking-wide ${isAr ? "text-right" : "text-left"}`}>
                    {tCat.has(category) ? tCat(category) : category}
                </p>

                {/* Expand / Collapse Details Button */}
                {(description || (type === "LEND" && (hasAvailableFrom || hasAvailableTo))) && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className={`flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-3 cursor-pointer outline-none select-none self-start ${isAr ? "flex-row-reverse" : ""}`}
                        aria-expanded={isExpanded}
                    >
                        <MdExpandMore className="text-[16px] transition-transform duration-200" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
                        {isExpanded ? (isAr ? "إخفاء التفاصيل" : "Hide Details") : (isAr ? "عرض التفاصيل" : "Show Details")}
                    </button>
                )}

                {/* Collapsible Details (Dates & Description) */}
                {isExpanded && (
                    <div className={`flex flex-col gap-2 mb-3 bg-neutral-50/80 p-3 rounded-xl border border-neutral-100/60 text-xs text-neutral-600 transition-all duration-200 w-full ${isAr ? "text-right" : "text-left"}`}>
                        {type === "LEND" && (hasAvailableFrom || hasAvailableTo) && (
                            <div className={cn("flex items-center gap-1.5 font-bold text-neutral-500", isAr ? "text-[12px] flex-row-reverse" : "text-[10px] uppercase tracking-wide")}>
                                <MdOutlineCalendarToday className="text-[15px] text-neutral-400 select-none" />
                                <span>
                                    {hasAvailableFrom && hasAvailableTo ? (
                                        `${formatDate(availableFrom)} - ${formatDate(availableTo)}`
                                    ) : hasAvailableFrom ? (
                                        isAr ? `من: ${formatDate(availableFrom)}` : `From: ${formatDate(availableFrom)}`
                                    ) : (
                                        isAr ? `إلى: ${formatDate(availableTo)}` : `Until: ${formatDate(availableTo)}`
                                    )}
                                </span>
                            </div>
                        )}
                        {description && (
                            <p className="text-[11px] leading-relaxed text-neutral-600 font-medium whitespace-pre-line">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {/* User & Price */}
                <div className={`mt-auto flex items-center justify-between pt-4 border-t border-neutral-50 ${isAr ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                        <div className={cn("size-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20", isAr ? "text-[12px]" : "text-[10px]")}>
                            {user.initials}
                        </div>
                        <div className={`flex flex-col ${isAr ? "items-end" : "items-start"}`}>
                            <span className={cn("font-extrabold text-neutral-700 leading-none mb-0.5", isAr ? "text-[12px]" : "text-[10px]")}>{user.name}</span>
                            <span className={cn("font-semibold text-neutral-400", isAr ? "text-[12px]" : "text-[10px]")}>
                                {isAr ? `نُشر ${user.time}` : `Posted ${user.time}`}
                            </span>
                        </div>
                    </div>
                    <div className={isAr ? "text-left" : "text-right"}>
                        <span className={`text-lg font-black ${isFree ? "text-primary italic" : "text-neutral-900"}`}>
                            {isFree ? (isAr ? "مجاني" : "Free") : `${currency || "EGP"} ${price}`}
                        </span>
                    </div>
                </div>

                {/* Request Button / Edit Button */}
                {isOwner ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/my-items/${id}/edit`);
                        }}
                        className={`mt-4 w-full flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-lg transition-all duration-200 bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-lg cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
                    >
                        <MdEdit className="text-lg" />
                        <span>{isAr ? "تعديل المورد" : "Edit Item"}</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={isRequested}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRequestClick?.(id);
                        }}
                        className={`mt-4 w-full flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-lg transition-all duration-200 ${isRequested
                            ? "bg-amber-100 text-amber-700 cursor-not-allowed"
                            : "bg-primary/10 hover:bg-primary text-primary hover:text-white cursor-pointer"
                            } ${isAr ? "flex-row-reverse" : ""}`}
                    >
                        <MdSend className="text-lg" />
                        {isRequested ? (isAr ? "تم الطلب" : "Requested") : (isAr ? "طلب الأدوات" : "Request Item")}
                    </button>
                )}
            </div>
        </div>
    );
}
