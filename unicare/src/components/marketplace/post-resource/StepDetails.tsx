import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressStepper from "./ProgressStepper";
import type { StepProps } from "./types";
import { categoriesApi } from "@/api/categories-api";
import type { CategoryResponse } from "@/types/categories";

const TIPS = [
    { icon: "verified", title: "Be Accurate", desc: "Ensure the model number and condition are correct." },
    { icon: "photo_camera", title: "Photos Next", desc: "You'll be able to upload up to 5 photos in the next step." },
    { icon: "security", title: "Safe Sharing", desc: "Your contact info is only shared after you approve a request." },
];

export default function StepDetails({ form, update, onNext }: StepProps) {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

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

    return (
        <div className="bg-background-light min-h-screen pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col gap-8">
                <ProgressStepper currentStep={0} totalSteps={3} stepLabel="Resource Details" nextLabel="Upload Images" />

                {/* Header */}
                <div className="px-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-3">Share Your Resource</h1>
                    <p className="text-neutral-500 text-lg max-w-2xl">
                        Help your fellow engineers by sharing tools, books, or equipment. Precise details help others find what they need.
                    </p>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    {/* Resource Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-700" htmlFor="res-name">Resource Name</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">label</span>
                            <input
                                id="res-name"
                                className="w-full h-14 pl-12 pr-4 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                placeholder="e.g., Fluke Multimeter 87V"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Discipline */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-700" htmlFor="discipline">Discipline Category</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">category</span>
                            <select
                                id="discipline"
                                className="w-full h-14 pl-12 pr-10 rounded-lg border border-neutral-200 bg-white text-neutral-900 focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all cursor-pointer outline-none"
                                value={form.discipline}
                                onChange={(e) => update("discipline", e.target.value)}
                            >
                                <option disabled value="">Select a discipline</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-neutral-700" htmlFor="description">Artistic Description</label>
                            <span className="text-xs text-neutral-400">{form.description.length}/300 characters</span>
                        </div>
                        <div className="relative group">
                            <textarea
                                id="description"
                                className="w-full p-4 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none leading-relaxed outline-none"
                                maxLength={300}
                                rows={4}
                                placeholder="Describe the condition, history, or unique quirks of this item..."
                                value={form.description}
                                onChange={(e) => update("description", e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute bottom-4 right-4 text-neutral-300 text-xl pointer-events-none">edit_note</span>
                        </div>
                        <p className="text-xs text-neutral-500">Be creative! A good story makes sharing more fun.</p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between pt-6 border-t border-neutral-100 mt-4">
                        <Link href="/marketplace" className="px-6 py-3 rounded-lg text-neutral-600 font-bold hover:bg-neutral-100 transition-colors">
                            Cancel
                        </Link>
                        <button
                            onClick={onNext}
                            disabled={!form.name || !form.discipline}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Continue
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Tips */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {TIPS.map((tip) => (
                        <div key={tip.title} className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex flex-col gap-2">
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1">
                                <span className="material-symbols-outlined text-lg">{tip.icon}</span>
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
