"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MdClose, MdOutlineCalendarMonth, MdSend } from "react-icons/md";
import type { MarketplaceItem } from "@/app/(main)/(buyer)/marketplace/data";

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
    const isSuccess = await onSubmit({ duration, note });
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
        className={`relative w-full max-w-md rounded-3xl bg-[#f0f3f4] px-6 pb-6 pt-5 shadow-2xl transition-all duration-200 ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute cursor-pointer right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-600"
          aria-label="Close request modal"
        >
          <MdClose className="text-xl" />
        </button>

        <div className="mx-auto mb-4 h-14 w-14 overflow-hidden rounded-2xl border border-primary/10 bg-white p-1">
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
          </div>
        </div>

        <h3 className="text-center text-4xl font-black text-neutral-800">Request Item</h3>
        <p className="mb-6 mt-2 text-center text-sm font-semibold text-primary">{item.title}</p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-lg font-semibold text-neutral-700">Hey! How long do you need this for?</label>
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-3">
              <MdOutlineCalendarMonth className="text-base text-primary/70" />
              <input
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                placeholder="e.g., 2 days or 1 week"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-lg font-semibold text-neutral-700">Want to leave a note for the owner?</label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="h-28 w-full resize-none rounded-3xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
              placeholder="Hi! I'd love to borrow this for my capstone project. I can return it by Friday..."
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-5 flex cursor-pointer w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-lg font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send Request"}
          <MdSend className="text-base" />
        </button>

        <p className="mt-3 text-center text-xs text-neutral-500">
          By requesting, you agree to UniCare&apos;s{" "}
          <span className="underline decoration-neutral-400 underline-offset-2">Community Guidelines</span>.
        </p>
      </div>
    </div>
  );
}
