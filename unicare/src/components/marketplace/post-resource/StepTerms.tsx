import type { StepProps } from "./types";
import { useLocale } from "next-intl";
import {
    MdHandshake,
    MdAttachMoney,
    MdOutlineCalendarMonth,
    MdOutlineVerifiedUser,
    MdOutlinePeople,
    MdArrowForward,
    MdOutlineHelpOutline,
    MdOutlineLock
} from "react-icons/md";

interface StepTermsProps extends StepProps {
    isSubmitting?: boolean;
}

export default function StepTerms({ form, update, onNext, onBack, isSubmitting = false }: StepTermsProps) {
    const locale = useLocale();
    const isAr = locale === "ar";

    return (
        <div className="bg-background-light min-h-screen pt-28 pb-20">
            <div className="max-w-[800px] mx-auto px-4 md:px-8 flex flex-col gap-8">
                {/* Stepper */}
                <div className="flex flex-col gap-3 pt-6">
                    <div className={`flex gap-6 justify-between items-end ${isAr ? "flex-row-reverse" : ""}`}>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900">
                            {isAr ? "انشر المورد" : "Post a Resource"}
                        </h1>
                        <p className="text-neutral-900 text-sm font-medium">
                            {isAr ? "الخطوة ٣ من ٣" : "Step 3 of 3"}
                        </p>
                    </div>
                    <div className="rounded-full bg-neutral-200 h-2 w-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: "100%" }} />
                    </div>
                    <p className={`text-primary text-sm font-medium ${isAr ? "text-right" : "text-left"}`}>
                        {isAr ? "التفاصيل النهائية" : "Final Details"}
                    </p>
                </div>

                {/* Form Card */}
                <div className={`bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm ${isAr ? "text-right" : "text-left"}`}>
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">
                                {isAr ? "شروط التبادل" : "Terms of Exchange"}
                            </h2>
                            <p className="text-neutral-500 text-base mt-1">
                                {isAr ? "حدد الطريقة التي ترغب بها في مشاركة المورد مع مجتمع الطلاب." : "Decide how you want to share your resource with the student community."}
                            </p>
                        </div>

                        {/* Lend / Sell Toggle */}
                        <div className={`flex h-12 w-full max-w-sm items-center rounded-lg bg-neutral-100 p-1 ${isAr ? "flex-row-reverse" : ""}`}>
                            <button
                                onClick={() => update("exchangeType", "lend")}
                                className={`flex-1 h-full rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${form.exchangeType === "lend" ? "bg-white shadow-sm text-primary" : "text-neutral-500"}`}
                            >
                                <MdHandshake className="text-[18px]" />
                                {isAr ? "إعارة (مجاني)" : "Lend (Free)"}
                            </button>
                            <button
                                onClick={() => update("exchangeType", "sell")}
                                className={`flex-1 h-full rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${form.exchangeType === "sell" ? "bg-white shadow-sm text-primary" : "text-neutral-500"}`}
                            >
                                <MdAttachMoney className="text-[18px]" />
                                {isAr ? "بيع" : "Sell"}
                            </button>
                        </div>

                        {/* Dynamic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {form.exchangeType === "lend" ? (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="maxDuration" className="text-neutral-900 text-sm font-semibold">
                                            {isAr ? "المدة القصوى (بالأيام)" : "Max Duration (Days)"}
                                        </label>
                                        <div className="relative flex items-center">
                                            <MdOutlineCalendarMonth className={`absolute ${isAr ? "right-4" : "left-4"} text-neutral-400 text-[20px]`} />
                                            <input
                                                id="maxDuration"
                                                className={`w-full h-12 ${isAr ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"} rounded-lg border border-neutral-200 bg-background-light text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                                                placeholder={isAr ? "مثال: 7" : "e.g., 7"}
                                                type="number"
                                                value={form.maxDuration}
                                                onChange={(e) => update("maxDuration", e.target.value)}
                                            />
                                        </div>
                                        <span className="text-xs text-neutral-400">
                                            {isAr ? "فترة الإعارة القياسية هي 7-14 يومًا." : "Standard loan period is 7-14 days."}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="deposit" className="text-neutral-900 text-sm font-semibold">
                                            {isAr ? "مبلغ التأمين (ج.م)" : "Security Deposit (EGP)"}
                                        </label>
                                        <div className="relative flex items-center">
                                            <MdOutlineVerifiedUser className={`absolute ${isAr ? "right-4" : "left-4"} text-neutral-400 text-[20px]`} />
                                            <input
                                                id="deposit"
                                                className={`w-full h-12 ${isAr ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"} rounded-lg border border-neutral-200 bg-background-light text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                                                placeholder={isAr ? "مثال: 50.00" : "e.g., 50.00"}
                                                type="number"
                                                value={form.deposit}
                                                onChange={(e) => update("deposit", e.target.value)}
                                            />
                                        </div>
                                        <span className="text-xs text-neutral-400">
                                            {isAr ? "مسترد بالكامل عند إرجاع المورد سليمًا." : "Fully refundable upon safe return."}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="price" className="text-neutral-900 text-sm font-semibold">
                                        {isAr ? "سعر البيع (ج.م)" : "Selling Price (EGP)"}
                                    </label>
                                    <div className="relative flex items-center">
                                        <MdAttachMoney className={`absolute ${isAr ? "right-4" : "left-4"} text-neutral-400 text-[20px]`} />
                                        <input
                                            id="price"
                                            className={`w-full h-12 ${isAr ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"} rounded-lg border border-neutral-200 bg-background-light text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                                            placeholder={isAr ? "مثال: 120.00" : "e.g., 120.00"}
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => update("price", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* UniCare Promise */}
                        <div className={`mt-4 p-5 rounded-2xl bg-primary/10 border border-primary/20 flex gap-4 items-start ${isAr ? "flex-row-reverse text-right" : ""}`}>
                            <input
                                type="checkbox"
                                id="promise"
                                checked={form.promise}
                                onChange={(e) => update("promise", e.target.checked)}
                                className="mt-1 h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                            />
                            <label htmlFor="promise" className="flex flex-col cursor-pointer">
                                <span className={`text-neutral-900 font-bold text-base flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                                    <MdOutlinePeople className="text-primary text-[20px]" />
                                    {isAr ? "عهد يوني كير" : "The UniCare Promise"}
                                </span>
                                <p className="text-neutral-600 text-sm mt-1 leading-relaxed">
                                    {isAr ? "أتعهد بالحفاظ على نزاهة مجتمع يوني كير من خلال تقديم وصف دقيق ومعاملة زملائي من الطلاب باحترام وإنصاف." : "I pledge to maintain the integrity of the UniCare community by providing accurate descriptions and treating all fellow students with respect and fairness."}
                                </p>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center justify-between mt-10 gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
                        <button onClick={onBack} className="px-6 py-3 rounded-lg text-neutral-600 font-medium hover:bg-neutral-100 transition-colors cursor-pointer">
                            {isAr ? "رجوع" : "Back"}
                        </button>
                        <button
                            onClick={onNext}
                            disabled={!form.promise || isSubmitting}
                            className="md:w-48 bg-primary hover:bg-primary/90 text-white h-12 rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isAr ? "جاري النشر..." : "Posting..."}
                                </>
                            ) : (
                                <>
                                    {isAr ? "انشر الآن" : "Post Now"}
                                    <MdArrowForward className={`text-[20px] ${isAr ? "rotate-180" : ""}`} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className={`flex justify-center gap-6 text-neutral-400 text-sm ${isAr ? "flex-row-reverse" : ""}`}>
                    <span className={`flex items-center gap-1 ${isAr ? "flex-row-reverse" : ""}`}><MdOutlineHelpOutline className="text-[16px]" /> {isAr ? "مركز المساعدة" : "Help Center"}</span>
                    <span className={`flex items-center gap-1 ${isAr ? "flex-row-reverse" : ""}`}><MdOutlineLock className="text-[16px]" /> {isAr ? "آمن ومحمي" : "Safe & Secure"}</span>
                </div>
            </div>
        </div>
    );
}
