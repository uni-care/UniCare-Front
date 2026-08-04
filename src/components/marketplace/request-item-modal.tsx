"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MdClose, MdOutlineCalendarMonth, MdOutlineImage, MdSend } from "react-icons/md";
import type { MarketplaceItem } from "@/app/[locale]/(main)/(buyer)/marketplace/data";
import { useLocale } from "next-intl";

interface RequestItemModalProps {
  isOpen: boolean;
  item: MarketplaceItem | null;
  onClose: () => void;
  isSubmitting?: boolean;
  onSubmit: (input: { duration: string; note: string }) => Promise<boolean> | boolean;
}

export default function RequestItemModal({
  isOpen,
  item,
  onClose,
  onSubmit,
  isSubmitting = false,
}: RequestItemModalProps) {
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();
  const isAr = locale === "ar";

  const isSale = item?.type === "SALE" || item?.type?.toUpperCase() === "SALE";

  const isValidImage =
    typeof item?.image === "string" &&
    item.image.trim().length > 0 &&
    (item.image.startsWith("http://") ||
      item.image.startsWith("https://") ||
      item.image.startsWith("/"));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen || !item) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setIsVisible(false);

    window.setTimeout(() => {
      setDuration("");
      setNote("");
      onClose();
    }, 220);
  };

  const handleSubmit = async () => {
    const isSuccess = await onSubmit({ duration: isSale ? "Permanent (Sale)" : duration, note });
    if (!isSuccess) {
      return;
    }

    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 z-60 flex items-center justify-center bg-black/45 px-4 transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl bg-[#f0f3f4] px-6 pb-6 pt-5 shadow-2xl transition-all duration-200 ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"} ${isAr ? "text-right" : "text-left"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className={`absolute cursor-pointer ${isAr ? "left-4" : "right-4"} top-4 text-neutral-400 transition-colors hover:text-neutral-600`}
          aria-label="Close request modal"
        >
          <MdClose className="text-xl" />
        </button>

        <div className="mx-auto mb-4 h-14 w-14 overflow-hidden rounded-2xl border border-primary/10 bg-white p-1">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
            {isValidImage ? (
              <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
            ) : (
              <MdOutlineImage className="text-2xl text-neutral-400" />
            )}
          </div>
        </div>

        <h3 className="text-center text-4xl font-black text-neutral-800">
          {isSale
            ? isAr
              ? "شراء الأدوات"
              : "Buy Item"
            : isAr
            ? "طلب الأدوات"
            : "Request Item"}
        </h3>
        <p className="mb-6 mt-2 text-center text-sm font-semibold text-primary">{item.title}</p>

        {(() => {
          const durationSuggestion = isAr ? "يومين" : "2 days";
          const noteSuggestion = isSale
            ? isAr
              ? "مرحبًا! أود شراء هذا المورد. متى وأين يمكننا الالتقاء في الحرم الجامعي؟"
              : "Hi! I'd like to buy this item. When and where can we meet on campus?"
            : isAr
            ? "مرحبًا! أود استعارة هذا لمشروع التخرج الخاص بي. يمكنني إعادته قريبًا."
            : "Hi! I'd love to borrow this for my capstone project. I can return it soon.";

          return (
            <div className="space-y-4">
              {!isSale && (
                <div>
                  <div className={`mb-2 flex items-center justify-between gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                    <label htmlFor="duration" className="block text-base font-semibold text-neutral-700">
                      {isAr ? "مرحبًا! ما هي المدة التي تحتاج فيها هذا المورد؟" : "Hey! How long do you need this for?"}
                    </label>
                    {duration.trim() === "" && (
                      <button
                        type="button"
                        onClick={() => setDuration(durationSuggestion)}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary transition-all hover:bg-primary/20 cursor-pointer shrink-0"
                        title={isAr ? "انقر لتعبئة النص التلقائي" : "Click to auto-fill suggested duration"}
                      >
                        <span>✨ {isAr ? "تعبئة سريعة" : "Auto-fill"}</span>
                        <span className="hidden text-[10px] opacity-60 sm:inline">(Tab ↹)</span>
                      </button>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-3 ${isAr ? "flex-row-reverse" : ""}`}>
                    <MdOutlineCalendarMonth className="text-base text-primary/70 shrink-0" />
                    <input
                      id="duration"
                      value={duration}
                      onChange={(event) => setDuration(event.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Tab" && duration.trim() === "") {
                          e.preventDefault();
                          setDuration(durationSuggestion);
                        }
                      }}
                      className={`w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400 ${isAr ? "text-right" : "text-left"}`}
                      placeholder={isAr ? `مثال: ${durationSuggestion} (اضغط Tab للتعبئة)` : `e.g., ${durationSuggestion} (Press Tab to auto-fill)`}
                    />
                  </div>
                </div>
              )}

              <div>
                <div className={`mb-2 flex items-center justify-between gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                  <label htmlFor="note" className="block text-base font-semibold text-neutral-700">
                    {isSale
                      ? isAr
                        ? "هل تود ترك ملاحظة للبائع؟"
                        : "Want to leave a note for the seller?"
                      : isAr
                      ? "هل تود ترك رسالة لمالك المورد؟"
                      : "Want to leave a note for the owner?"}
                  </label>
                  {note.trim() === "" && (
                    <button
                      type="button"
                      onClick={() => setNote(noteSuggestion)}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary transition-all hover:bg-primary/20 cursor-pointer shrink-0"
                      title={isAr ? "انقر لتعبئة النص التلقائي" : "Click to auto-fill suggested note"}
                    >
                      <span>✨ {isAr ? "تعبئة سريعة" : "Auto-fill"}</span>
                      <span className="hidden text-[10px] opacity-60 sm:inline">(Tab ↹)</span>
                    </button>
                  )}
                </div>
                <textarea
                  id="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && note.trim() === "") {
                      e.preventDefault();
                      setNote(noteSuggestion);
                    }
                  }}
                  className={`h-28 w-full resize-none rounded-3xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 ${isAr ? "text-right" : "text-left"}`}
                  placeholder={`${noteSuggestion} ${isAr ? "(اضغط Tab للتعبئة)" : "(Press Tab to auto-fill)"}`}
                />
              </div>
            </div>
          );
        })()}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`mt-5 flex cursor-pointer w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-lg font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 ${isAr ? "flex-row-reverse" : ""}`}
        >
          {isSubmitting
            ? isAr
              ? "جاري الإرسال..."
              : "Sending..."
            : isSale
            ? isAr
              ? "إرسال طلب الشراء"
              : "Send Purchase Request"
            : isAr
            ? "إرسال الطلب"
            : "Send Request"}
          <MdSend className={`text-base ${isAr ? "rotate-180" : ""}`} />
        </button>

        <p className="mt-3 text-center text-xs text-neutral-500">
          {isAr ? (
            <>
              بإرسال الطلب، أنت توافق على{" "}
              <span className="underline decoration-neutral-400 underline-offset-2">إرشادات مجتمع يوني كير</span>.
            </>
          ) : (
            <>
              By requesting, you agree to UniCare&apos;s{" "}
              <span className="underline decoration-neutral-400 underline-offset-2">Community Guidelines</span>.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
