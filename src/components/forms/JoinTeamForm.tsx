"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MdExpandMore, MdOutlineLink } from "react-icons/md";

export default function JoinTeamForm() {
    const locale = useLocale();
    const isAr = locale === "ar";
    const t = useTranslations("Contribute");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        area: "",
        portfolio: "",
        reason: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        const subject = encodeURIComponent("New UniCare Contributor Application");
        const body = encodeURIComponent([
            `New UniCare Contributor Application`,
            `----------------------------------`,
            `Name: ${form.firstName} ${form.lastName}`,
            `Email: ${form.email}`,
            `Specialty: ${form.area || "Not specified"}`,
            `Portfolio/GitHub/CV URL: ${form.portfolio || "Not provided"}`,
            ``,
            `What they can offer:`,
            form.reason || "No reason provided.",
        ].join("\n"));

        const url = `mailto:unicare36@gmail.com?subject=${subject}&body=${body}`;
        window.open(url, "_self");
    };

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-2xl border border-[#517565]/10 shadow-[0_10px_30px_rgba(81,117,101,0.05)]">
            <h3 className={cn("text-xl font-bold text-neutral-900 mb-6", isAr ? "text-right" : "text-left")}>
                {t("buildFormTitle")}
            </h3>
            <p className={cn("text-neutral-500 text-sm mb-6 -mt-4", isAr ? "text-right" : "text-left")}>
                {t("buildFormDesc")}
            </p>
            <form
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="flex flex-col md:flex-row gap-5">
                    <label className="flex flex-col flex-1">
                        <span className={cn("text-neutral-800 text-sm font-semibold pb-1.5", isAr ? "text-right" : "text-left")}>
                            {t("formFirstName")}
                        </span>
                        <input
                            className={cn(
                                "w-full rounded-xl border border-neutral-200 bg-neutral-50/30 h-12 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all",
                                isAr ? "text-right" : "text-left"
                            )}
                            name="firstName"
                            placeholder={isAr ? "مثال: أحمد" : "Jane"}
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className={cn("text-neutral-800 text-sm font-semibold pb-1.5", isAr ? "text-right" : "text-left")}>
                            {t("formLastName")}
                        </span>
                        <input
                            className={cn(
                                "w-full rounded-xl border border-neutral-200 bg-neutral-50/30 h-12 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all",
                                isAr ? "text-right" : "text-left"
                            )}
                            name="lastName"
                            placeholder={isAr ? "مثال: علي" : "Doe"}
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <label className="flex flex-col flex-1">
                    <span className={cn("text-neutral-800 text-sm font-semibold pb-1.5", isAr ? "text-right" : "text-left")}>
                        {t("formEmail")}
                    </span>
                    <input
                        className={cn(
                            "w-full rounded-xl border border-neutral-200 bg-neutral-50/30 h-12 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all",
                            isAr ? "text-right" : "text-left"
                        )}
                        name="email"
                        placeholder="jane@example.com"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="flex flex-col flex-1">
                    <span className={cn("text-neutral-800 text-sm font-semibold pb-1.5", isAr ? "text-right" : "text-left")}>
                        {t("formRole")}
                    </span>
                    <div className="relative">
                        <select
                            className={cn(
                                "w-full rounded-xl border border-neutral-200 bg-neutral-50/30 h-12 text-base text-neutral-900 appearance-none cursor-pointer outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all",
                                isAr ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left"
                            )}
                            name="area"
                            value={form.area}
                            onChange={handleChange}
                            required
                        >
                            <option disabled value="">
                                {isAr ? "اختر تخصصك..." : "Select specialty..."}
                            </option>
                            <option value="Frontend Development">
                                {isAr ? "تطوير واجهات (Frontend)" : "Frontend Development"}
                            </option>
                            <option value="Backend Development">
                                {isAr ? "تطوير خلفية برمجية (.NET)" : "Backend Development (.NET)"}
                            </option>
                            <option value="UI/UX Design">
                                {isAr ? "تصميم واجهات تجربة المستخدم (UI/UX)" : "UI/UX Design"}
                            </option>
                            <option value="Content / Writing">
                                {isAr ? "كتابة محتوى وترجمة" : "Content & Copywriting"}
                            </option>
                            <option value="DevOps / Hosting">
                                {isAr ? "استضافة وسيرفرات وبنية تحتية" : "DevOps & Infrastructure"}
                            </option>
                            <option value="Other">
                                {isAr ? "تخصص آخر" : "Other Specialty"}
                            </option>
                        </select>
                        <div
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 flex items-center",
                                isAr ? "left-4" : "right-4"
                            )}
                        >
                            <MdExpandMore className="text-xl" />
                        </div>
                    </div>
                </label>

                <label className="flex flex-col flex-1">
                    <span className={cn("text-neutral-800 text-sm font-semibold pb-1.5", isAr ? "text-right" : "text-left")}>
                        {t("formPortfolio")}
                    </span>
                    <div className="relative">
                        <input
                            className={cn(
                                "w-full rounded-xl border border-neutral-200 bg-neutral-50/30 h-12 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all",
                                isAr ? "pr-4 pl-10 text-left" : "pl-10 pr-4 text-left"
                            )}
                            name="portfolio"
                            placeholder="https://..."
                            type="url"
                            value={form.portfolio}
                            onChange={handleChange}
                        />
                        <div
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 flex items-center",
                                isAr ? "left-3" : "left-3"
                            )}
                        >
                            <MdOutlineLink className="text-xl" />
                        </div>
                    </div>
                </label>

                <label className="flex flex-col flex-1">
                    <span className={cn("text-neutral-800 text-sm font-semibold pb-1.5", isAr ? "text-right" : "text-left")}>
                        {t("formOffer")}
                    </span>
                    <textarea
                        className={cn(
                            "w-full rounded-xl border border-neutral-200 bg-neutral-50/30 h-28 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#517565] focus:ring-2 focus:ring-[#517565]/20 transition-all resize-none",
                            isAr ? "text-right" : "text-left"
                        )}
                        name="reason"
                        placeholder={t("formOfferPlaceholder")}
                        value={form.reason}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className={cn("pt-2 flex", isAr ? "justify-end" : "justify-start")}>
                    <button
                        className="flex cursor-pointer items-center justify-center rounded-xl bg-[#517565] hover:bg-[#517565]/90 text-white h-12 w-full md:w-auto px-10 text-base font-bold shadow-lg shadow-[#517565]/20 transition-all active:scale-98"
                        type="submit"
                    >
                        {t("formSubmit")}
                    </button>
                </div>
            </form>
        </div>
    );
}
