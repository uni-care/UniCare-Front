"use client";

interface DetailSidebarProps {
  user: {
    name: string;
    initials: string;
    time: string;
  };
  isOwner: boolean;
  isRequested: boolean;
  itemType: "LEND" | "SALE";
  onRequestClick: () => void;
}

export default function DetailSidebar({
  user,
  isOwner,
  isRequested,
  itemType,
  onRequestClick,
}: DetailSidebarProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 flex flex-col gap-6">
      {/* Owner Info profile card */}
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary border border-primary/20 shadow-xs shrink-0 select-none">
          {user.initials}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Listed By</span>
          <span className="text-base font-extrabold text-neutral-800 leading-tight">{user.name}</span>
          <span className="text-[11px] font-medium text-neutral-400 mt-0.5">{user.time}</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100/60">
        {isOwner ? (
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100/80 text-center text-xs font-bold text-neutral-500 leading-normal">
            This is your listing. You can manage request details inside your dashboard.
          </div>
        ) : (
          <button
            type="button"
            disabled={isRequested}
            onClick={onRequestClick}
            className={`w-full flex items-center justify-center gap-2 font-bold text-base py-4 rounded-xl transition-all duration-200 shadow-md ${
              isRequested
                ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-none cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/95 shadow-primary/10 cursor-pointer"
            }`}
          >
            <span className="material-symbols-outlined text-lg">send</span>
            {isRequested
              ? "Requested Already"
              : itemType === "LEND"
              ? "Request to Borrow"
              : "Buy Item"}
          </button>
        )}
      </div>
    </div>
  );
}
