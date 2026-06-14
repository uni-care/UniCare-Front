import { useState } from "react";
import Image from "next/image";

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
}: ItemCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isValidImage = typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/"));
    const isFree = price === 0 || price === "Free" || price === 0.01 || price === "0.01";
    const hasAvailableFrom = typeof availableFrom === "string" && availableFrom.trim().length > 0;
    const hasAvailableTo = typeof availableTo === "string" && availableTo.trim().length > 0;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "";
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "";
        }
    };

    return (
        <div className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100 flex flex-col h-full cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-neutral-50 mb-4 flex items-center justify-center border border-neutral-100">
                {isValidImage ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-neutral-400">
                        <span className="material-symbols-outlined text-4xl">image</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">No Image</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
                        <span className={`size-2 rounded-full ${status?.toLowerCase() === "available" || status?.toLowerCase() === "available now" ? "bg-primary" : "bg-amber-500"} animate-pulse`}></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">{status}</span>
                    </div>
                    {isRequested ? (
                        <div className="inline-flex self-start items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-amber-100 text-amber-700 border border-amber-300">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            REQUESTED
                        </div>
                    ) : null}
                </div>

                {/* Type Badge (Bottom Left) */}
                <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-md backdrop-blur-sm select-none ${
                    type === "LEND" ? "bg-primary text-white" : "bg-rose-500 text-white"
                }`}>
                    {type}
                </div>

                {/* Favorite Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteClick?.(id);
                    }}
                    className={`absolute top-3 right-3 size-10 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center transition-all shadow-sm cursor-pointer ${isFavorited ? "text-rose-500" : "text-neutral-500 hover:text-rose-500"
                        }`}
                >
                    <span
                        className={`material-symbols-outlined text-xl ${isFavorited ? "fill-1 text-rose-500" : ""}`}
                        style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
                    >
                        favorite
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className="grow flex flex-col">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-bold text-neutral-800 line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>
                <p className="text-xs font-semibold text-neutral-400 mb-3 uppercase tracking-wide">
                    {category}
                </p>

                {/* Expand / Collapse Details Button */}
                {(description || (type === "LEND" && (hasAvailableFrom || hasAvailableTo))) && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors mb-3 cursor-pointer outline-none select-none self-start"
                    >
                        <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                            expand_more
                        </span>
                        {isExpanded ? "Hide Details" : "Show Details"}
                    </button>
                )}

                {/* Collapsible Details (Dates & Description) */}
                {isExpanded && (
                    <div className="flex flex-col gap-2 mb-3 bg-neutral-50/80 p-3 rounded-xl border border-neutral-100/60 text-xs text-neutral-600 transition-all duration-200 w-full">
                        {type === "LEND" && (hasAvailableFrom || hasAvailableTo) && (
                            <div className="flex items-center gap-1.5 font-semibold text-[10px] tracking-wide text-neutral-500 uppercase">
                                <span className="material-symbols-outlined text-[15px] text-neutral-400 select-none">calendar_today</span>
                                <span>
                                    {hasAvailableFrom && hasAvailableTo ? (
                                        `${formatDate(availableFrom)} - ${formatDate(availableTo)}`
                                    ) : hasAvailableFrom ? (
                                        `From: ${formatDate(availableFrom)}`
                                    ) : (
                                        `Until: ${formatDate(availableTo)}`
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
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-50">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                            {user.initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-extrabold text-neutral-700 leading-none mb-0.5">{user.name}</span>
                            <span className="text-[9px] font-medium text-neutral-400">Posted {user.time}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-lg font-black ${isFree ? "text-primary italic" : "text-neutral-900"}`}>
                            {isFree ? "Free" : `${currency || "EGP"} ${price}`}
                        </span>
                    </div>
                </div>

                {/* Request Button */}
                <button
                    type="button"
                    disabled={isRequested}
                    onClick={() => onRequestClick?.(id)}
                    className={`mt-4 w-full flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-lg transition-all duration-200 ${isRequested
                        ? "bg-amber-100 text-amber-700 cursor-not-allowed"
                        : "bg-primary/10 hover:bg-primary text-primary hover:text-white cursor-pointer"
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">send</span>
                    {isRequested ? "Requested" : "Request Item"}
                </button>
            </div>
        </div>
    );
}
