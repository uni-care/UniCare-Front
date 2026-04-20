import Link from "next/link";
import type { PostFormData } from "./types";

interface StepSuccessProps {
    form: PostFormData;
}

export default function StepSuccess({ form }: StepSuccessProps) {
    return (
        <div className="bg-background-light min-h-screen pt-36 pb-20 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-20 left-[10%] text-primary/10 select-none pointer-events-none">
                <span className="material-symbols-outlined text-[120px]">school</span>
            </div>
            <div className="absolute bottom-20 right-[10%] text-primary/10 select-none pointer-events-none">
                <span className="material-symbols-outlined text-[150px]">design_services</span>
            </div>

            <div className="relative max-w-[800px] mx-auto px-4 md:px-8 flex flex-col items-center">
                {/* Success Header */}
                <div className="flex flex-col items-center text-center mb-10 relative">
                    <span className="material-symbols-outlined absolute -top-4 -left-8 text-primary/60 text-3xl animate-pulse">auto_awesome</span>
                    <span className="material-symbols-outlined absolute top-10 -right-12 text-amber-500/80 text-4xl animate-pulse" style={{ animationDelay: "0.5s" }}>shutter_speed</span>
                    <span className="material-symbols-outlined absolute -bottom-2 -left-16 text-amber-500/60 text-2xl animate-pulse" style={{ animationDelay: "0.3s" }}>star</span>

                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/20">
                        <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
                    </div>
                    <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-neutral-900 mb-3">
                        Resource Posted Successfully!
                    </h1>
                    <p className="text-neutral-500 text-lg max-w-[500px] leading-relaxed">
                        Your contribution is now live on the marketplace. Engineers around the world can now learn from your work!
                    </p>
                </div>

                {/* Preview Card */}
                <div className="w-full bg-white rounded-2xl p-6 shadow-md border border-neutral-100">
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Live Preview
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 bg-neutral-50 rounded-lg p-4 border border-neutral-100">
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
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 leading-tight">
                                        {form.name || "Your Resource"}
                                    </h3>
                                    <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">New</div>
                                </div>
                                <p className="text-neutral-500 text-sm mb-3 font-medium">
                                    {form.discipline || "Engineering"} • {form.exchangeType === "lend" ? "Lend" : "Sale"}
                                </p>
                                <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2 mb-4">
                                    {form.description || "No description provided."}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">U</div>
                                    <span className="text-xs font-medium text-neutral-500">By You</span>
                                </div>
                                <span className="text-xs font-bold text-primary">
                                    {form.exchangeType === "lend" ? "Free" : form.price ? `$${form.price}` : "Free"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full max-w-md">
                    <Link
                        href="/marketplace"
                        className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                        View Live Post
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                    <Link
                        href="/marketplace"
                        className="w-full flex items-center justify-center h-12 px-6 bg-transparent hover:bg-neutral-100 text-neutral-600 rounded-lg font-medium text-base transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px] mr-2 text-neutral-400">arrow_back</span>
                        Back to Marketplace
                    </Link>
                </div>
            </div>
        </div>
    );
}
