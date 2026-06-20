import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import ProgressStepper from "./ProgressStepper";
import type { StepProps } from "./types";
import { categoriesApi } from "@/api/categories-api";
import type { CategoryResponse } from "@/types/categories";
import { useLocale } from "next-intl";
import {
    MdOutlineLabel,
    MdOutlineCategory,
    MdExpandMore,
    MdOutlineEditNote,
    MdArrowForward,
    MdOutlineVerified,
    MdOutlinePhotoCamera,
    MdOutlineSecurity
} from "react-icons/md";

const getTipIcon = (iconName: string) => {
    switch (iconName) {
        case "verified":
            return <MdOutlineVerified className="text-lg" />;
        case "photo_camera":
            return <MdOutlinePhotoCamera className="text-lg" />;
        case "security":
            return <MdOutlineSecurity className="text-lg" />;
        default:
            return null;
    }
};

export default function StepDetails({ form, update, onNext }: StepProps) {
    const locale = useLocale();
    const isAr = locale === "ar";
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function fetchCategories() {
            try {
                const list = await categoriesApi.getAll();
                if (!cancelled) {
                    setCategories(list);
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        }
        fetchCategories();
        return () => { cancelled = true; };
    }, []);

    const TIPS = [
        { icon: "verified", title: isAr ? "كن دقيقاً" : "Be Accurate", desc: isAr ? "تأكد من إدخال نوع المورد وحالته بشكل صحيح." : "Ensure the model number and condition are correct." },
        { icon: "photo_camera", title: isAr ? "الصور في الخطوة التالية" : "Photos Next", desc: isAr ? "ستتمكن من رفع ما يصل إلى 5 صور في الخطوة التالية." : "You'll be able to upload up to 5 photos in the next step." },
        { icon: "security", title: isAr ? "مشاركة آمنة" : "Safe Sharing", desc: isAr ? "لن تظهر بيانات الاتصال الخاصة بك إلا بعد قبولك لطلب التبادل." : "Your contact info is only shared after you approve a request." },
    ];

    const getTranslatedCategoryName = (cat: CategoryResponse) => {
        if (!isAr) return cat.name;
        switch (cat.id) {
            case "22222222-2222-2222-2222-222222222222":
                return "الكتب الدراسية والمناهج";
            case "33333333-3333-3333-3333-333333333333":
                return "أدوات المختبرات والعلوم";
            case "44444444-4444-4444-4444-444444444444":
                return "أدوات الفنون والتصميم";
            case "55555555-5555-5555-5555-555555555555":
                return "أدوات الهندسة والتكنولوجيا";
            case "66666666-6666-6666-6666-666666666666":
                return "العلوم الطبية والصحية";
            case "77777777-7777-7777-7777-777777777777":
                return "الأجهزة الإلكترونية";
            case "88888888-8888-8888-8888-888888888888":
                return "الموسيقى والفنون الاستعراضية";
            case "99999999-9999-9999-9999-999999999999":
                return "الرياضة والأنشطة الترفيهية";
            case "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa":
                return "مستلزمات السكن والمعيشة";
            default:
                return cat.name;
        }
    };

    const selectedCategory = categories.find(c => c.id === form.discipline);
    const categorySelectorLabel = selectedCategory ? getTranslatedCategoryName(selectedCategory) : (isAr ? "اختر تصنيفاً" : "Select a discipline");

    return (
        <div className="bg-background-light min-h-screen pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col gap-8">
                <ProgressStepper 
                    currentStep={0} 
                    totalSteps={3} 
                    stepLabel={isAr ? "تفاصيل المورد" : "Resource Details"} 
                    nextLabel={isAr ? "رفع الصور" : "Upload Images"} 
                />

                {/* Header */}
                <div className={`px-2 ${isAr ? "text-right" : "text-left"}`}>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-3">
                        {isAr ? "شارك الموارد الخاصة بك" : "Share Your Resource"}
                    </h1>
                    <p className="text-neutral-500 text-lg max-w-2xl">
                        {isAr ? "ساعد زملائك من الطلاب من خلال مشاركة الكتب أو الأدوات أو المستلزمات الجامعية. التفاصيل الدقيقة تساعد الآخرين في العثور على ما يحتاجون إليه." : "Help your fellow students by sharing books, tools, or campus essentials. Precise details help others find what they need."}
                    </p>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    {/* Resource Name */}
                    <div className={`flex flex-col gap-2 ${isAr ? "text-right" : "text-left"}`}>
                        <label className="text-sm font-bold text-neutral-700" htmlFor="res-name">
                            {isAr ? "اسم المورد" : "Resource Name"}
                        </label>
                        <div className="relative group">
                            <MdOutlineLabel className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors text-[20px]`} />
                            <input
                                id="res-name"
                                className={`w-full h-14 ${isAr ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none`}
                                placeholder={isAr ? "مثال: كتاب التفاضل والتكامل" : "e.g., Calculus Textbook"}
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Discipline */}
                    <div className={`col-span-1 md:col-span-2 flex flex-col gap-2 ${isAr ? "text-right" : "text-left"}`}>
                        <label className="text-sm font-bold text-neutral-700">
                            {isAr ? "تصنيف المادة" : "Discipline Category"}
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowCategories(!showCategories)}
                                className={`w-full h-14 ${isAr ? "pr-12 pl-10 text-right flex-row-reverse" : "pl-12 pr-10 text-left"} rounded-lg border border-neutral-200 bg-white text-neutral-900 font-semibold focus:border-primary transition-all outline-none flex items-center justify-between cursor-pointer`}
                            >
                                <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                                    <MdOutlineCategory className="text-neutral-400 text-[20px]" />
                                    <span>{categorySelectorLabel}</span>
                                </div>
                                <MdExpandMore className="text-neutral-400 text-xl transition-transform duration-200" style={{ transform: showCategories ? "rotate(180deg)" : "rotate(0deg)" }} />
                            </button>
                        </div>

                        {showCategories && (
                            <div className={`mt-2 p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${isAr ? "flex-row-reverse" : ""}`}>
                                {categories.map((cat) => {
                                    const isSelected = form.discipline === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                update("discipline", cat.id);
                                                setShowCategories(false);
                                            }}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                                                isSelected
                                                    ? "bg-primary border-primary text-white shadow-sm"
                                                    : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
                                            }`}
                                        >
                                            {getTranslatedCategoryName(cat)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className={`col-span-1 md:col-span-2 flex flex-col gap-2 ${isAr ? "text-right" : "text-left"}`}>
                        <div className={`flex justify-between items-center ${isAr ? "flex-row-reverse" : ""}`}>
                            <label className="text-sm font-bold text-neutral-700" htmlFor="description">
                                {isAr ? "الوصف الفني" : "Artistic Description"}
                            </label>
                            <span className="text-xs text-neutral-400">
                                {isAr ? `${form.description.length}/300 حرف` : `${form.description.length}/300 characters`}
                            </span>
                        </div>
                        <div className="relative group">
                            <textarea
                                id="description"
                                className={`w-full p-4 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none leading-relaxed outline-none ${isAr ? "text-right pr-4 pl-12" : "text-left pl-4 pr-12"}`}
                                maxLength={300}
                                rows={4}
                                placeholder={isAr ? "صف حالة المورد أو أي تفاصيل مميزة عنه هنا..." : "Describe the condition, history, or unique quirks of this item..."}
                                value={form.description}
                                onChange={(e) => update("description", e.target.value)}
                            />
                            <MdOutlineEditNote className={`absolute bottom-4 ${isAr ? "left-4" : "right-4"} text-neutral-300 text-2xl pointer-events-none`} />
                        </div>
                        <p className="text-xs text-neutral-500">
                            {isAr ? "كن مبدعاً! الوصف الجيد للمورد يجعل التبادل أكثر متعة." : "Be creative! A good story makes sharing more fun."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className={`col-span-1 md:col-span-2 flex items-center justify-between pt-6 border-t border-neutral-100 mt-4 ${isAr ? "flex-row-reverse" : ""}`}>
                        <Link href="/marketplace" className="px-6 py-3 rounded-lg text-neutral-600 font-bold hover:bg-neutral-100 transition-colors">
                            {isAr ? "إلغاء" : "Cancel"}
                        </Link>
                        <button
                            onClick={onNext}
                            disabled={!form.name || !form.discipline}
                            className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
                        >
                            {isAr ? "متابعة" : "Continue"}
                            <MdArrowForward className={`text-sm ${isAr ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* Tips */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {TIPS.map((tip) => (
                        <div key={tip.title} className={`p-4 rounded-lg bg-primary/5 border border-primary/10 flex flex-col gap-2 ${isAr ? "text-right items-end" : "text-left items-start"}`}>
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1">
                                {getTipIcon(tip.icon)}
                            </div>
                            <h4 className="font-bold text-sm text-neutral-800">{tip.title}</h4>
                            <p className="text-xs text-neutral-600">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
