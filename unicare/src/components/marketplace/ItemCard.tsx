import Image from "next/image";

interface ItemCardProps {
    title: string;
    category: string;
    department: string;
    image: string;
    price: string | number;
    status: "Available Now" | "Low Stock";
    type: "LEND" | "SALE";
    rating: number;
    user: {
        name: string;
        initials: string;
        time: string;
    };
}

export default function ItemCard({
    title,
    category,
    department,
    image,
    price,
    status,
    type,
    rating,
    user,
}: ItemCardProps) {
    const isFree = price === 0 || price === "Free";

    return (
        <div className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100 flex flex-col h-full cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-neutral-50 mb-4">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-white/40">
                        <span className={`size-2 rounded-full ${status === "Available Now" ? "bg-primary" : "bg-amber-500"} animate-pulse`}></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">{status}</span>
                    </div>
                    <div className={`inline-flex self-start px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${type === "LEND" ? "bg-primary text-white" : "bg-rose-500 text-white"
                        }`}>
                        {type}
                    </div>
                </div>

                {/* Favorite Button */}
                <button className="absolute top-3 right-3 size-10 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center text-neutral-500 hover:text-rose-500 hover:bg-white transition-all shadow-sm">
                    <span className="material-symbols-outlined text-xl">favorite</span>
                </button>
            </div>

            {/* Content */}
            <div className="grow flex flex-col">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-bold text-neutral-800 line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 shrink-0">
                        <span className="material-symbols-outlined text-base fill-1">star</span>
                        <span className="text-sm font-bold">{rating.toFixed(1)}</span>
                    </div>
                </div>
                <p className="text-xs font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
                    {department} • {category}
                </p>

                {/* User & Price */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-50">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                            {user.initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-600">Posted {user.time}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-lg font-black ${isFree ? "text-primary italic" : "text-neutral-900"}`}>
                            {isFree ? "Free" : `$${price}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
