import { Link } from "@/i18n/routing";
import type { PostFormData } from "./types";
import { useLocale } from "next-intl";
import {
    MdOutlineSchool,
    MdOutlineDesignServices,
    MdOutlineAutoAwesome,
    MdOutlineSpeed,
    MdOutlineStar,
    MdCheckCircle,
    MdOutlineVisibility,
    MdArrowForward,
    MdArrowBack
} from "react-icons/md";

interface StepSuccessProps {
    form: PostFormData;
    categoryName: string;
    itemId: string | null;
}

export default function StepSuccess({ form, categoryName, itemId }: StepSuccessProps) {
    const locale = useLocale();
    const isAr = locale === "ar";

    return (
        <div className="bg-background-light min-h-screen pt-36 pb-20 relative overflow-hidden">
            {/* Decorative Background — hidden on small screens */}
            <div className="hidden md:block absolute top-32 left-[5%] lg:left-[10%] text-primary/10 select-none pointer-events-none">
                <MdOutlineSchool className="text-[100px] lg:text-[120px]" />
            </div>
            <div className="hidden md:block absolute bottom-24 right-[5%] lg:right-[10%] text-primary/10 select-none pointer-events-none">
                <MdOutlineDesignServices className="text-[120px] lg:text-[150px]" />
            </div>

            <div className="relative max-w-[800px] mx-auto px-4 md:px-8 flex flex-col items-center">
                {/* Success Header */}
                <div className="flex flex-col items-center text-center mb-10 relative">
                    <MdOutlineAutoAwesome className="absolute -top-4 left-0 md:-left-8 text-primary/60 text-3xl animate-pulse" />
                    <MdOutlineSpeed className="absolute top-10 right-0 md:-right-12 text-amber-500/80 text-4xl animate-pulse" style={{ animationDelay: "0.5s" }} />
                    <MdOutlineStar className="absolute -bottom-2 left-2 md:-left-16 text-amber-500/60 text-2xl animate-pulse" style={{ animationDelay: "0.3s" }} />

                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/20">
                        <MdCheckCircle className="text-primary text-5xl" />
                    </div>
                    <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-neutral-900 mb-3">
                        {isAr ? "تم نشر المورد بنجاح!" : "Resource Posted Successfully!"}
                    </h1>
                    <p className="text-neutral-500 text-lg max-w-[500px] leading-relaxed">
                        {isAr ? "أصبح المورد الخاص بك معروضًا الآن في المتجر الجامعي. يمكن للطلاب الآخرين الآن العثور عليه، أو طلبه، أو شراؤه منك مباشرة!" : "Your resource is now live on the campus marketplace. Other students can now find, request, or buy it directly from you!"}
                    </p>
                </div>

                {/* Preview Card */}
                <div className={`w-full bg-white rounded-2xl p-6 shadow-md border border-neutral-100 ${isAr ? "text-right" : "text-left"}`}>
                    <div className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400 ${isAr ? "flex-row-reverse" : ""}`}>
                        <MdOutlineVisibility className="text-[16px]" />
                        {isAr ? "معاينة حية" : "Live Preview"}
                    </div>
                    <div className={`flex flex-col md:flex-row gap-5 bg-neutral-50 rounded-lg p-4 border border-neutral-100 ${isAr ? "md:flex-row-reverse" : ""}`}>
                        {/* Image */}
                        <div
                            className="w-full md:w-[240px] shrink-0 h-48 md:h-auto rounded-lg bg-neutral-200 bg-cover bg-center relative overflow-hidden"
                            style={{
                                backgroundImage: form.previews[0]
                                    ? `url("${form.previews[0]}")`
                                    : `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUbjbuMP8FBRzbQdTZ6X8OIfo2MkjBK2Z0VGplK-kEAoKtuzqGv2AXtA-no8f33zxcZLMOgRTc4GUvfoizUCn5oWzAvcQTuHsZ6nstII3LUe90otasx0TgtHspgv_qxtVjL7k3XG_Xutb7sQ07tlBTe2yURBSGrKoluQ7h0Oma496Z06xjrelfo7UisV0IlCFcgPYZJMXhxfXTMEEiV-pxfBdjxZFrh8GBBIYri-47vGMdNMmKBpLzfIYkOph3vM21Zoi15UObyLXt")`,
                            }}
                        />
                        {/* Content */}
                        <div className="flex flex-col justify-between grow py-1">
                            <div>
                                <div className={`flex justify-between items-start mb-2 ${isAr ? "flex-row-reverse" : ""}`}>
                                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 leading-tight font-amiri">
                                        {form.name || (isAr ? "المورد الخاص بك" : "Your Resource")}
                                    </h3>
                                    <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                                        {isAr ? "جديد" : "New"}
                                    </div>
                                </div>
                                <p className="text-neutral-500 text-sm mb-3 font-medium">
                                    {categoryName} • {form.exchangeType === "lend" ? (isAr ? "إعارة" : "Lend") : (isAr ? "بيع" : "Sale")}
                                </p>
                                <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2 mb-4">
                                    {form.description || (isAr ? "لا يوجد وصف متوفر." : "No description provided.")}
                                </p>
                            </div>
                            <div className={`flex items-center justify-between pt-4 border-t border-neutral-100/60 ${isAr ? "flex-row-reverse" : ""}`}>
                                <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">U</div>
                                    <span className="text-xs font-medium text-neutral-500">
                                        {isAr ? "بواسطتك" : "By You"}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-primary">
                                    {form.exchangeType === "lend" ? (isAr ? "مجاني" : "Free") : form.price ? `${form.price} ${isAr ? "ج.م" : "EGP"}` : (isAr ? "مجاني" : "Free")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={`flex flex-col sm:flex-row items-center gap-4 mt-10 w-full max-w-lg ${isAr ? "sm:flex-row-reverse" : ""}`}>
                    <Link
                        href={itemId ? `/marketplace/${itemId}` : "/marketplace"}
                        className={`w-full sm:flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm sm:text-base whitespace-nowrap transition-all shadow-md hover:shadow-lg cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
                    >
                        {isAr ? "عرض المنشور الحي" : "View Live Post"}
                        <MdArrowForward className={`text-[20px] ${isAr ? "rotate-180" : ""}`} />
                    </Link>
                    <Link
                        href="/marketplace"
                        className={`w-full sm:flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-colors cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
                    >
                        <MdArrowBack className={`text-[20px] text-neutral-400 ${isAr ? "rotate-180" : ""}`} />
                        {isAr ? "العودة إلى المتجر" : "Back to Marketplace"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
