"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MdChat,
  MdOutlineCalendarMonth,
  MdPerson,
  MdWarning,
  MdLoop,
} from "react-icons/md";
import { cn } from "@/lib/utils";

export interface UnifiedItemCardProps {
  id: string;
  title: string;
  image?: string | null;
  counterpartName?: string | null;
  counterpartRole?: "owner" | "borrower" | "requester" | "user";
  agreedPrice?: number;
  dateLabel?: string;
  dateValue?: string;
  dueDateLabel?: string;
  dueDateValue?: string;
  isOverdue?: boolean;
  statusBadge: React.ReactNode;
  href?: string;
  onChatClick?: (e: React.MouseEvent) => void;
  isChatLoading?: boolean;
  actions?: React.ReactNode;
  isAr?: boolean;
}

export default function UnifiedItemCard({
  title,
  image,
  counterpartName,
  counterpartRole = "owner",
  agreedPrice = 0,
  dateLabel,
  dateValue,
  dueDateLabel,
  dueDateValue,
  isOverdue = false,
  statusBadge,
  href,
  onChatClick,
  isChatLoading = false,
  actions,
  isAr = false,
}: UnifiedItemCardProps) {
  const initials = counterpartName
    ? counterpartName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "UC";

  const renderRoleLabel = () => {
    if (!counterpartName) return null;
    switch (counterpartRole) {
      case "owner":
        return isAr ? `المالك: ${counterpartName}` : `Owner: ${counterpartName}`;
      case "borrower":
        return isAr ? `مُعار إلى: ${counterpartName}` : `Lent to: ${counterpartName}`;
      case "requester":
        return isAr ? `الطالب: ${counterpartName}` : `Requester: ${counterpartName}`;
      default:
        return counterpartName;
    }
  };

  const hasImage =
    typeof image === "string" &&
    image.trim().length > 0 &&
    (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/"));

  return (
    <div className="group border border-neutral-200 bg-white rounded-3xl p-5 hover:shadow-md hover:border-primary/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      {/* Item Image & Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-150 flex items-center justify-center shrink-0">
          {hasImage ? (
            <Image src={image!} alt={title} fill className="object-cover" />
          ) : (
            <Image
              src="/Logo.svg"
              alt="UniCare"
              width={32}
              height={20}
              className="h-6 w-auto object-contain opacity-50"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {href ? (
            <Link
              href={href}
              className="truncate text-base font-bold text-neutral-900 group-hover:text-primary transition-colors block"
            >
              {title}
            </Link>
          ) : (
            <h4 className="truncate text-base font-bold text-neutral-900 group-hover:text-primary transition-colors">
              {title}
            </h4>
          )}

          {/* User role & avatar */}
          {counterpartName && (
            <div className="mt-1 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-black text-primary shrink-0">
                {initials || <MdPerson />}
              </span>
              <span className="truncate text-xs font-semibold text-neutral-600">
                {renderRoleLabel()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Metadata */}
      <div className="flex flex-col gap-1 text-xs text-neutral-500 shrink-0">
        {agreedPrice > 0 && (
          <span className="text-sm font-extrabold text-primary mb-0.5">
            {isAr ? `${agreedPrice} جنيه` : `EGP ${agreedPrice}`}
          </span>
        )}
        {dateValue && (
          <div className="flex items-center gap-1">
            <MdOutlineCalendarMonth className="text-neutral-400 text-[14px]" />
            <span>
              {dateLabel ? `${dateLabel}: ` : ""}
              {dateValue}
            </span>
          </div>
        )}
        {dueDateValue && (
          <div
            className={cn(
              "flex items-center gap-1 font-medium",
              isOverdue ? "text-rose-600 font-bold" : ""
            )}
          >
            {isOverdue ? (
              <MdWarning className="text-[14px] leading-none text-rose-500" />
            ) : (
              <MdLoop className="text-[14px] leading-none text-neutral-400" />
            )}
            <span>
              {dueDateLabel ? `${dueDateLabel}: ` : ""}
              {dueDateValue}
              {isOverdue && (isAr ? " (متأخر)" : " (Overdue)")}
            </span>
          </div>
        )}
      </div>

      {/* Status Pill & Action Buttons */}
      <div className="flex flex-row sm:flex-col items-center gap-3 shrink-0 justify-between sm:justify-start border-t border-neutral-100 sm:border-t-0 pt-3 sm:pt-0">
        <div className="shrink-0">{statusBadge}</div>

        <div className="flex items-center gap-2">
          {onChatClick && (
            <button
              type="button"
              onClick={onChatClick}
              disabled={isChatLoading}
              title={isAr ? "محادثة" : "Chat"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isChatLoading ? (
                <div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              ) : (
                <MdChat className="text-[18px]" />
              )}
            </button>
          )}

          {actions}
        </div>
      </div>
    </div>
  );
}
