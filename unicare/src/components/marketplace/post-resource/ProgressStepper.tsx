interface ProgressStepperProps {
    currentStep: number;
    totalSteps: number;
    stepLabel: string;
    nextLabel?: string;
}

export default function ProgressStepper({ currentStep, totalSteps, stepLabel, nextLabel }: ProgressStepperProps) {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-end justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-neutral-900">{stepLabel}</h3>
                    <p className="text-sm text-primary font-medium mt-1">Step {currentStep + 1} of {totalSteps}</p>
                </div>
                {nextLabel && (
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Next Step</p>
                        <p className="text-sm font-medium text-neutral-700">{nextLabel}</p>
                    </div>
                )}
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}
