"use client";

import Image from "next/image";
import { MdOutlineImage } from "react-icons/md";

interface DetailGalleryProps {
  title: string;
  imageUrls: string[];
  status: string;
  type: "LEND" | "SALE";
  activeImageIndex: number;
  onImageChange: (index: number) => void;
}

export default function DetailGallery({
  title,
  imageUrls,
  status,
  type,
  activeImageIndex,
  onImageChange,
}: DetailGalleryProps) {
  // Filter out empty or invalid URLs
  const validImages = imageUrls.filter(
    (url) => typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))
  );

  const hasImages = validImages.length > 0;
  const activeImage = hasImages ? validImages[activeImageIndex] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Viewport */}
      <div className="relative aspect-4/3 w-full bg-white rounded-3xl overflow-hidden border border-neutral-100/80 shadow-md">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400 bg-neutral-50/50">
            <MdOutlineImage className="text-5xl" />
            <span className="text-xs font-bold uppercase tracking-wider">No Image Available</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-white/40 shadow-xs text-[10px] font-bold uppercase tracking-wider text-neutral-700 select-none">
            <span className={`size-2 rounded-full ${status?.toLowerCase() === "available" ? "bg-primary" : "bg-amber-500"} animate-pulse`} />
            {status}
          </span>
          <span className={`self-start px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-xs select-none ${
            type === "LEND" ? "bg-primary text-white" : "bg-rose-500 text-white"
          }`}>
            {type}
          </span>
        </div>
      </div>

      {/* Thumbnails strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-neutral-200">
          {validImages.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onImageChange(idx)}
              className={`relative size-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 shrink-0 ${
                activeImageIndex === idx ? "border-primary scale-95 shadow-sm" : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <Image src={url} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
