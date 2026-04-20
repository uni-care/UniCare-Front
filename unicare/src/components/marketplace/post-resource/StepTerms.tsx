import type { StepProps } from "./types";

interface StepTermsProps extends StepProps {
    isSubmitting?: boolean;
}

export default function StepTerms({ form, update, onNext, onBack, isSubmitting = false }: StepTermsProps) {
    return (
        <div className="bg-background-light min-h-screen pt-28 pb-20">
            <div className="max-w-[800px] mx-auto px-4 md:px-8 flex flex-col gap-8">
                {/* Stepper */}
                <div className="flex flex-col gap-3 pt-6">
                    <div className="flex gap-6 justify-between items-end">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900">Post a Resource</h1>
                        <p className="text-neutral-900 text-sm font-medium">Step 3 of 3</p>
                    </div>
                    <div className="rounded-full bg-neutral-200 h-2 w-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: "100%" }} />
                    </div>
                    <p className="text-primary text-sm font-medium">Final Details</p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">Terms of Exchange</h2>
                            <p className="text-neutral-500 text-base mt-1">Decide how you want to share your resource with the engineering community.</p>
                        </div>

                        {/* Lend / Sell Toggle */}
                        <div className="flex h-12 w-full max-w-sm items-center rounded-lg bg-neutral-100 p-1">
                            <button
                                onClick={() => update("exchangeType", "lend")}
                                className={`flex-1 h-full rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${form.exchangeType === "lend" ? "bg-white shadow-sm text-primary" : "text-neutral-500"}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">handshake</span>
                                Lend (Free)
                            </button>
                            <button
                                onClick={() => update("exchangeType", "sell")}
                                className={`flex-1 h-full rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${form.exchangeType === "sell" ? "bg-white shadow-sm text-primary" : "text-neutral-500"}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">attach_money</span>
                                Sell
                            </button>
                        </div>

                        {/* Dynamic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {form.exchangeType === "lend" ? (
                                <>
                                    <label className="flex flex-col gap-2">
                                        <p className="text-neutral-900 text-sm font-semibold">Max Duration (Days)</p>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-neutral-400 material-symbols-outlined text-[20px]">calendar_clock</span>
                                            <input
                                                className="w-full h-12 pl-11 pr-4 rounded-lg border border-neutral-200 bg-background-light text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="e.g., 7"
                                                type="number"
                                                value={form.maxDuration}
                                                onChange={(e) => update("maxDuration", e.target.value)}
                                            />
                                        </div>
                                        <span className="text-xs text-neutral-400">Standard loan period is 7-14 days.</span>
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <p className="text-neutral-900 text-sm font-semibold">Security Deposit ($)</p>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-neutral-400 material-symbols-outlined text-[20px]">verified_user</span>
                                            <input
                                                className="w-full h-12 pl-11 pr-4 rounded-lg border border-neutral-200 bg-background-light text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="e.g., 50.00"
                                                type="number"
                                                value={form.deposit}
                                                onChange={(e) => update("deposit", e.target.value)}
                                            />
                                        </div>
                                        <span className="text-xs text-neutral-400">Fully refundable upon safe return.</span>
                                    </label>
                                </>
                            ) : (
                                <label className="flex flex-col gap-2">
                                    <p className="text-neutral-900 text-sm font-semibold">Selling Price ($)</p>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-neutral-400 material-symbols-outlined text-[20px]">attach_money</span>
                                        <input
                                            className="w-full h-12 pl-11 pr-4 rounded-lg border border-neutral-200 bg-background-light text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="e.g., 120.00"
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => update("price", e.target.value)}
                                        />
                                    </div>
                                </label>
                            )}
                        </div>

                        {/* UniCare Promise */}
                        <div className="mt-4 p-5 rounded-2xl bg-primary/10 border border-primary/20 flex gap-4 items-start">
                            <input
                                type="checkbox"
                                id="promise"
                                checked={form.promise}
                                onChange={(e) => update("promise", e.target.checked)}
                                className="mt-1 h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                            />
                            <label htmlFor="promise" className="flex flex-col cursor-pointer">
                                <span className="text-neutral-900 font-bold text-base flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">diversity_3</span>
                                    The UniCare Promise
                                </span>
                                <p className="text-neutral-600 text-sm mt-1 leading-relaxed">
                                    I pledge to maintain the integrity of the UniCare community by providing accurate descriptions and treating all fellow engineers with respect and fairness.
                                </p>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-10 gap-4">
                        <button onClick={onBack} className="px-6 py-3 rounded-lg text-neutral-600 font-medium hover:bg-neutral-100 transition-colors cursor-pointer">
                            Back
                        </button>
                        <button
                            onClick={onNext}
                            disabled={!form.promise || isSubmitting}
                            className="md:w-48 bg-primary hover:bg-primary/90 text-white h-12 rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    Post Now
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-center gap-6 text-neutral-400 text-sm">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">help</span> Help Center</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">lock</span> Safe &amp; Secure</span>
                </div>
            </div>
        </div>
    );
}
