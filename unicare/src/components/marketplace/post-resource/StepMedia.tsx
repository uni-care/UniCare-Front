import { useRef } from "react";
import Image from "next/image";
import type { StepProps } from "./types";

export default function StepMedia({ form, update, onNext, onBack }: StepProps) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        const newPreviews = selected.map((f) => URL.createObjectURL(f));
        update("files", [...form.files, ...selected]);
        update("previews", [...form.previews, ...newPreviews]);
    };

    const removeFile = (i: number) => {
        URL.revokeObjectURL(form.previews[i]);
        update("files", form.files.filter((_, idx) => idx !== i));
        update("previews", form.previews.filter((_, idx) => idx !== i));
    };

    const progress = (2 / 3) * 100;

    return (
        <div className="bg-background-light min-h-screen pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col gap-8">
                {/* Stepper */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-primary uppercase tracking-wider">Step 2 of 3</span>
                        <span className="text-sm text-neutral-500">Media</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Upload Area */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Add photos or video</h1>
                            <p className="text-neutral-500 text-lg mt-2">
                                Showcase your resource with clear, high-quality images to help others understand what you&apos;re sharing.
                            </p>
                        </div>

                        {/* Upload Zone */}
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="group relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-neutral-300 bg-white hover:border-primary/50 hover:bg-neutral-50 transition-all duration-200 py-16 px-6 cursor-pointer"
                        >
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                            </div>
                            <p className="text-lg font-bold text-neutral-900">Tap to upload</p>
                            <p className="text-sm text-neutral-500">Support JPG, PNG, MP4 up to 50MB</p>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                                className="mt-4 px-6 py-2.5 rounded-lg bg-white border border-neutral-200 text-sm font-bold shadow-sm hover:shadow hover:border-primary/30 transition-all cursor-pointer"
                            >
                                Select Files
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                className="hidden"
                                onChange={handleFiles}
                            />
                        </div>

                        {/* Previews */}
                        {form.previews.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {form.previews.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group">
                                        <Image src={src} alt={`Upload ${i + 1}`} fill className="object-cover" />
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1 right-1 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4">
                            <button onClick={onBack} className="text-neutral-500 font-bold hover:text-neutral-900 transition-colors flex items-center gap-2 cursor-pointer">
                                <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                            </button>
                            <button
                                onClick={onNext}
                                className="px-8 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Tips */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="rounded-lg overflow-hidden shadow-sm bg-white border border-neutral-100">
                            <div
                                className="h-48 bg-neutral-200 w-full relative overflow-hidden"
                                style={{
                                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBONFRteCRq_y_xe13JI0Ixh41C9BLGaG9F3GFQeulqIl7u5_z0cqrZXj8Vpz4_J-lF0Pt-2etCNt3Sak1zoezUwajMOchx8sPiwSSjfuZNxS9EzJMn0RTmL2Ev8n2vN7Xmflwg0U28FTaxbw1FUIcH25yCMqd8bk5iMKYHoiaYrdVeRROHFvhQCsuCrcd9UuO6Sh-YnIO3T9WoREAJIUAmlTDV09GWWcNv6j7Q56OkLjuoUQqwW7AWKrxV_u6DMHiPiaFala3ixbaV")`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-lg">light_mode</span>
                                        <span className="text-xs font-bold uppercase tracking-wider opacity-90">Pro Tip</span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight">Lighting Matters</h3>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    Use natural lighting whenever possible. Place your item near a window to show true colors and avoid harsh shadows.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg p-5 bg-primary/10 border border-primary/20 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-primary">
                                <span className="material-symbols-outlined">visibility</span>
                                <h3 className="font-bold">Be Transparent</h3>
                            </div>
                            <p className="text-sm text-neutral-600 leading-relaxed">
                                If your resource has wear or defects, take a close-up photo. Honesty builds trust in our community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
