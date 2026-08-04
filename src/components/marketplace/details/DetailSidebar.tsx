"use client";

import { MdSend } from "react-icons/md";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";

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
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  return (
    <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 flex flex-col gap-6 ${isAr ? "text-right" : "text-left"}`}>
      {/* Owner Info profile card */}
      <div className={`flex items-center gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary border border-primary/20 shadow-xs shrink-0 select-none">
          {user.initials}
        </div>
        <div className={`flex flex-col ${isAr ? "items-end" : "items-start"}`}>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
            {isAr ? "نُشر بواسطة" : "Listed By"}
          </span>
          <span className="text-base font-extrabold text-neutral-800 leading-tight">{user.name}</span>
          <span className="text-[11px] font-medium text-neutral-400 mt-0.5">{user.time}</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100/60">
        {isOwner ? (
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100/80 text-center text-xs font-bold text-neutral-500 leading-normal">
            {isAr ? "هذا المورد مضاف من قبلك. يمكنك إدارة تفاصيل الطلب من لوحة التحكم." : "This is your listing. You can manage request details inside your dashboard."}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (isRequested) {
                router.push("/profile/borrows");
              } else {
                onRequestClick();
              }
            }}
            className={`w-full flex items-center justify-center gap-2 font-bold text-base py-4 rounded-xl transition-all duration-200 shadow-md cursor-pointer ${
              isRequested
                ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                : "bg-primary text-white hover:bg-primary/95 shadow-primary/10"
            } ${isAr ? "flex-row-reverse" : ""}`}
          >
            <MdSend className="text-lg" />
            {isRequested
              ? (isAr ? "عرض طلباتك والمحادثة" : "View Requests & Chat")
              : itemType === "LEND"
              ? (isAr ? "طلب استعارة" : "Request to Borrow")
              : (isAr ? "شراء المورد" : "Buy Item")}
          </button>
        )}
      </div>
    </div>
  );
}
