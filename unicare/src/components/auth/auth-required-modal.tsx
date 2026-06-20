"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { MdClose, MdWavingHand } from "react-icons/md";
import { useTranslations } from "next-intl";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectTo?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title = "Let's Sign You In!",
  description = "Please sign in to your student account to request items, share resources, and connect with peers.",
  redirectTo = "/",
}: AuthRequiredModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("AuthRequired");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    window.setTimeout(() => {
      onClose();
    }, 220);
  };

  const handleLoginRedirect = () => {
    setIsVisible(false);
    window.setTimeout(() => {
      router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }, 220);
  };

  return (
    <div
      className={`fixed inset-0 z-60 flex items-center justify-center bg-black/45 backdrop-blur-[2px] px-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl bg-[#f0f3f4] px-6 pb-6 pt-8 shadow-2xl transition-all duration-200 ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute cursor-pointer right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-600"
          aria-label="Close authentication modal"
        >
          <MdClose className="text-xl" />
        </button>

        {/* Friendly Hand Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-white text-primary shadow-sm">
          <MdWavingHand className="text-3xl text-primary animate-bounce-slow" style={{ animationDuration: '3s' }} />
        </div>

        <h3 className="text-center text-3xl font-black text-neutral-800 tracking-tight">
          {title}
        </h3>
        
        <p className="mb-6 mt-3 text-center text-sm font-medium text-neutral-600 px-2 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-bold text-white transition-all hover:bg-primary/90 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            {t("signIn")}
          </button>
          
          <button
            type="button"
            onClick={handleClose}
            className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white py-3 text-sm font-semibold text-neutral-600 transition-all hover:bg-neutral-50"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
