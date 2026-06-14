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
  const isFree = price === 0 || price === "Free" || price === 0.01 || price === "0.01";
  const hasAvailableFrom = typeof availableFrom === "string" && availableFrom.trim().length > 0;
  const hasAvailableTo = typeof availableTo === "string" && availableTo.trim().length > 0;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 flex flex-col gap-5">
      {/* Category / Dept Hierarchy */}
      <div>
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 block">
          {department || "All Departments"} • {category}
        </span>
        <h1 className="text-3xl font-black text-neutral-900 leading-tight">
          {title}
        </h1>
      </div>

      {/* Exchange Price info */}
      <div className="flex justify-between items-center p-4 bg-neutral-50/80 border border-neutral-100/60 rounded-2xl">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Exchange Price</span>
        <span className={`text-2xl font-black ${isFree ? "text-primary italic" : "text-neutral-900"}`}>
          {isFree ? "Free" : `${currency || "EGP"} ${price}`}
        </span>
      </div>

      {/* Lending availability (LEND type) */}
      {type === "LEND" && (hasAvailableFrom || hasAvailableTo) && (
        <div className="flex flex-col gap-1.5 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            Lending Availability
          </div>
          <span className="text-sm font-semibold text-neutral-700">
            {hasAvailableFrom && hasAvailableTo ? (
              `Available from ${formatDate(availableFrom)} to ${formatDate(availableTo)}`
            ) : hasAvailableFrom ? (
              `Available from: ${formatDate(availableFrom)}`
            ) : (
              `Available until: ${formatDate(availableTo)}`
            )}
          </span>
        </div>
      )}

      {/* Description text */}
      <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100/60">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Description</span>
        <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
          {description || "No description provided."}
        </p>
      </div>
    </div>
  );
}
