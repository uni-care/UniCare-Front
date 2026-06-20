"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { MdExpandMore, MdOutlineLink } from "react-icons/md";

export default function JoinTeamForm() {
    const locale = useLocale();
    const isAr = locale === "ar";

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
            `Area of Contribution: ${form.area || "Not specified"}`,
            `Portfolio/GitHub URL: ${form.portfolio || "Not provided"}`,
            ``,
            `Why they want to join:`,
            form.reason || "No reason provided.",
        ].join("\n"));

        const url = `mailto:almonther.art@gmail.com?subject=${subject}&body=${body}`;
        window.open(url, "_self");
    };

    return (
        <div className="lg:w-2/3 w-full bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <form
                className="flex flex-col gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="flex flex-col md:flex-row gap-6">
                    <label className="flex flex-col flex-1">
                        <span className={cn("text-neutral-900 text-base font-medium leading-normal pb-2", isAr ? "text-right" : "text-left")}>{isAr ? "الاسم الأول" : "First Name"}</span>
                        <input
                            className={cn("w-full rounded-xl border border-neutral-200 bg-white h-14 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all", isAr ? "text-right" : "text-left")}
                            name="firstName"
                            placeholder={isAr ? "مثال: أحمد" : "Jane"}
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className={cn("text-neutral-900 text-base font-medium leading-normal pb-2", isAr ? "text-right" : "text-left")}>{isAr ? "اسم العائلة" : "Last Name"}</span>
                        <input
                            className={cn("w-full rounded-xl border border-neutral-200 bg-white h-14 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all", isAr ? "text-right" : "text-left")}
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
                    <span className={cn("text-neutral-900 text-base font-medium leading-normal pb-2", isAr ? "text-right" : "text-left")}>{isAr ? "البريد الإلكتروني" : "Email Address"}</span>
                    <input
                        className={cn("w-full rounded-xl border border-neutral-200 bg-white h-14 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all", isAr ? "text-right" : "text-left")}
                        name="email"
                        placeholder="jane@example.com"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="flex flex-col flex-1">
                    <span className={cn("text-neutral-900 text-base font-medium leading-normal pb-2", isAr ? "text-right" : "text-left")}>{isAr ? "مجال المساهمة" : "Area of Contribution"}</span>
                    <div className="relative">
                        <select
                            className={cn("w-full rounded-xl border border-neutral-200 bg-white h-14 text-base text-neutral-900 appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 transition-all", isAr ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left")}
                            name="area"
                            value={form.area}
                            onChange={handleChange}
                            required
                        >
                            <option disabled value="">{isAr ? "اختر مجالاً..." : "Select an area..."}</option>
                            <option value="Feature Development">{isAr ? "تطوير الميزات" : "Feature Development"}</option>
                            <option value="Server Hosting">{isAr ? "استضافة الخوادم" : "Server Hosting"}</option>
                            <option value="Core Engineering">{isAr ? "الهندسة الأساسية" : "Core Engineering"}</option>
                            <option value="UI/UX Design">{isAr ? "تصميم واجهة المستخدم" : "UI/UX Design"}</option>
                        </select>
                        <div className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 flex items-center", isAr ? "left-4" : "right-4")}>
                            <MdExpandMore className="text-xl" />
                        </div>
                    </div>
                </label>

                <label className="flex flex-col flex-1">
                    <span className={cn("text-neutral-900 text-base font-medium leading-normal pb-2", isAr ? "text-right" : "text-left")}>{isAr ? "رابط أعمالك أو حساب GitHub" : "Portfolio or GitHub URL"}</span>
                    <div className="relative">
                        <input
                            className={cn("w-full rounded-xl border border-neutral-200 bg-white h-14 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all", isAr ? "pr-4 pl-12 text-left" : "pl-12 pr-4 text-left")}
                            name="portfolio"
                            placeholder="https://github.com/janedoe"
                            type="url"
                            value={form.portfolio}
                            onChange={handleChange}
                        />
                        <div className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 flex items-center", isAr ? "left-4" : "left-4")}>
                            <MdOutlineLink className="text-xl" />
                        </div>
                    </div>
                </label>

                <label className="flex flex-col flex-1">
                    <span className={cn("text-neutral-900 text-base font-medium leading-normal pb-2", isAr ? "text-right" : "text-left")}>
                        {isAr ? "لماذا تريد الانضمام؟" : "Why do you want to join?"}
                    </span>
                    <textarea
                        className={cn("w-full rounded-lg border border-neutral-200 bg-white h-32 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none", isAr ? "text-right" : "text-left")}
                        name="reason"
                        placeholder={isAr ? "أخبرنا عن خبرتك وما تود العمل عليه..." : "Tell us about your experience and what you'd like to work on..."}
                        value={form.reason}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className={cn("pt-2 flex", isAr ? "justify-end" : "justify-start")}>
                    <button
                        className="flex cursor-pointer items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white h-14 w-full md:w-auto px-10 text-base font-bold shadow-lg shadow-primary/20 transition-colors"
                        type="submit"
                    >
                        {isAr ? "إرسال الطلب" : "Submit Application"}
                    </button>
                </div>
            </form>
        </div>
    );
}
