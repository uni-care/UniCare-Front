"use client";

import Image from "next/image";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { useTranslations } from "next-intl";

const footerLinks = [
  { key: "privacy", label: "Privacy" },
  { key: "terms", label: "Terms" },
  { key: "safety", label: "Safety" },
  { key: "impact", label: "Impact" },
];

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-auto border-t border-black/5 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex flex-1 items-center justify-start gap-0">
            <Image
              src="/Logo.svg"
              alt="UniCare logo"
              width={120}
              height={60}
              className="h-16 w-20 object-contain"
            />
            <p className="text-xl font-semibold leading-none text-[#131615]">
              UniCare
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 md:flex-none">
            {footerLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                className="text-sm text-black/70 transition-colors hover:text-black/90 cursor-pointer"
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <button
              type="button"
              aria-label="Twitter"
              className="  p-2 text-black/75 transition-colors hover:text-black cursor-pointer"
            >
              <FaTwitter size={19} />
            </button>
            <button
              type="button"
              aria-label="Instagram"
              className="  p-2 text-black/75 transition-colors hover:text-black cursor-pointer"
            >
              <FaInstagram size={19} />
            </button>
          </div>
        </div>

        <p className="text-center text-xs tracking-[0.22em] text-black/60">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
