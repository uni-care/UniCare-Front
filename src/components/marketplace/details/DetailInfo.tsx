import { MdOutlineCalendarToday } from "react-icons/md";
import { useLocale } from "next-intl";

interface DetailInfoProps {
  title: string;
  category: string;
  department: string;
  price: string | number;
  currency?: string;
  type: "LEND" | "SALE";
  availableFrom?: string;
  availableTo?: string;
  description?: string;
  formatDate: (dateStr?: string) => string;
}

export default function DetailInfo({
  title,
  category,
  department,
  price,
  currency,
  type,
  availableFrom,
  availableTo,
  description,
  formatDate,
}: DetailInfoProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const isFree = price === 0 || price === "Free" || price === 0.01 || price === "0.01";
  const hasAvailableFrom = typeof availableFrom === "string" && availableFrom.trim().length > 0;
  const hasAvailableTo = typeof availableTo === "string" && availableTo.trim().length > 0;

  return (
    <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 flex flex-col gap-5 ${isAr ? "text-right" : "text-left"}`}>
      {/* Category / Dept Hierarchy */}
      <div>
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 block">
          {(department || (isAr ? "جميع الأقسام" : "All Departments"))} • {category}
        </span>
        <h1 className="text-3xl font-black text-neutral-900 leading-tight">
          {title}
        </h1>
      </div>

      {/* Exchange Price info */}
      <div className={`flex justify-between items-center p-4 bg-neutral-50/80 border border-neutral-100/60 rounded-2xl ${isAr ? "flex-row-reverse" : ""}`}>
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          {isAr ? "سعر التبادل" : "Exchange Price"}
        </span>
        <span className={`text-2xl font-black ${isFree ? "text-primary italic" : "text-neutral-900"}`}>
          {isFree ? (isAr ? "مجاني" : "Free") : `${currency || "EGP"} ${price}`}
        </span>
      </div>

      {/* Lending availability (LEND type) */}
      {type === "LEND" && (hasAvailableFrom || hasAvailableTo) && (
        <div className="flex flex-col gap-1.5 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
          <div className={`flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider ${isAr ? "flex-row-reverse" : ""}`}>
            <MdOutlineCalendarToday className="text-[16px]" />
            {isAr ? "فترة الإتاحة للإعارة" : "Lending Availability"}
          </div>
          <span className="text-sm font-semibold text-neutral-700">
            {hasAvailableFrom && hasAvailableTo ? (
              isAr ? `متاح من ${formatDate(availableFrom)} إلى ${formatDate(availableTo)}` : `Available from ${formatDate(availableFrom)} to ${formatDate(availableTo)}`
            ) : hasAvailableFrom ? (
              isAr ? `متاح من: ${formatDate(availableFrom)}` : `Available from: ${formatDate(availableFrom)}`
            ) : (
              isAr ? `متاح حتى: ${formatDate(availableTo)}` : `Available until: ${formatDate(availableTo)}`
            )}
          </span>
        </div>
      )}

      {/* Description text */}
      <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100/60">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          {isAr ? "الوصف" : "Description"}
        </span>
        <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
          {description || (isAr ? "لا يوجد وصف متوفر لهذا المورد." : "No description provided.")}
        </p>
      </div>
    </div>
  );
}
