import { useRef } from "react";
import ProgressStepper from "./ProgressStepper";
import type { StepProps } from "./types";
import { useLocale } from "next-intl";
import {
    MdOutlineCloudUpload,
    MdClose,
    MdArrowForward,
    MdLightbulbOutline
} from "react-icons/md";

export default function StepMedia({ form, update, onNext, onBack }: StepProps) {
    const locale = useLocale();
    const isAr = locale === "ar";
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);

        // Limit to max 5 files
        const updatedFiles = [...form.files, ...newFiles].slice(0, 5);
        update("files", updatedFiles);

        // Generate previews
        const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
        update("previews", newPreviews);
    };

    const removeFile = (index: number) => {
        const updatedFiles = form.files.filter((_, i) => i !== index);
        const updatedPreviews = form.previews.filter((_, i) => i !== index);
        update("files", updatedFiles);
        update("previews", updatedPreviews);
    };

    return (
        <div className="bg-background-light min-h-screen pt-28 pb-20">
            <div className="max-w-[800px] mx-auto px-4 md:px-8 flex flex-col gap-8">
                {/* Stepper */}
                <ProgressStepper
                    currentStep={1}
                    totalSteps={3}
                    stepLabel={isAr ? "صور المورد" : "Resource Media"}
                    nextLabel={isAr ? "شروط التبادل" : "Exchange Terms"}
                />

                {/* Upload Card */}
                <div className={`bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm ${isAr ? "text-right" : "text-left"}`}>
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">
                                {isAr ? "ارفع صور المورد" : "Upload Photos"}
                            </h2>
                            <p className="text-neutral-500 text-base mt-1">
                                {isAr ? "الصور الواضحة تساعد في إظهار حالة ونوع المورد بشكل أفضل للطلاب." : "Clear photos help other students verify the item's condition."}
                            </p>
                        </div>

                        {/* Dropzone Area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-neutral-300 hover:border-primary rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-neutral-50 hover:bg-primary/5 transition-all cursor-pointer group"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                                className="hidden"
                                aria-label={isAr ? "رفع صور المورد" : "Upload resource photos"}
                            />
                            <div className="size-14 rounded-full bg-white shadow-xs border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-primary group-hover:scale-110 transition-all">
                                <MdOutlineCloudUpload className="text-2xl" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-neutral-800">
                                    {isAr ? "اضغط لرفع الصور" : "Click to upload"}
                                </p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    {isAr ? "ملفات JPG، PNG تصل إلى 5 صور" : "Supports JPG, PNG up to 5 photos"}
                                </p>
                            </div>
                        </div>

                        {/* Previews Strip */}
                        {form.previews.length > 0 && (
                            <div className={`flex flex-wrap gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
                                {form.previews.map((preview, index) => (
                                    <div
                                        key={preview}
                                        className="relative size-24 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-100 animate-in fade-in zoom-in-95 duration-200"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            className="absolute top-1 right-1 size-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors"
                                            aria-label={isAr ? `إزالة الصورة رقم ${index + 1}` : `Remove image ${index + 1}`}
                                        >
                                            <MdClose className="text-[12px]" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pro Tip */}
                        <div className={`p-4 rounded-xl bg-amber-50 border border-amber-200/50 flex gap-3 items-start ${isAr ? "flex-row-reverse text-right" : ""}`}>
                            <MdLightbulbOutline className="text-amber-600 text-lg mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-bold text-xs text-amber-900">
                                    {isAr ? "نصيحة للمحترفين" : "Pro Tip"}
                                </h4>
                                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                                    {isAr ? "التقط صورًا في إضاءة جيدة واعرض أي خدوش أو علامات استخدام بوضوح لبناء الثقة مع زملائك." : "Take pictures in natural light and show any signs of wear to build trust with potential requestors."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center justify-between mt-10 gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
                        <button onClick={onBack} className="px-6 py-3 rounded-lg text-neutral-600 font-bold hover:bg-neutral-100 transition-colors cursor-pointer">
                            {isAr ? "رجوع" : "Back"}
                        </button>
                        <button
                            onClick={onNext}
                            className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer ${isAr ? "flex-row-reverse" : ""}`}
                        >
                            {isAr ? "متابعة" : "Continue"}
                            <MdArrowForward className={`text-sm ${isAr ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
