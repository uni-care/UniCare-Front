"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { INITIAL_FORM_DATA, type PostFormData } from "./post-resource/types";
import StepDetails from "./post-resource/StepDetails";
import StepMedia from "./post-resource/StepMedia";
import StepTerms from "./post-resource/StepTerms";
import StepSuccess from "./post-resource/StepSuccess";
import { itemsApi } from "@/features/items/api/items-api";
import { useAuth, getAuthToken } from "@/features/auth/hooks/useAuth";

export default function PostResourceWizard() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<PostFormData>(INITIAL_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const update = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const next = () => setStep((s) => s + 1);
    const back = () => setStep((s) => s - 1);

    /** Submit the item to the backend */
    const handleSubmit = async () => {
        const authToken = getAuthToken();
        if (!authToken) {
            toast.error("Please sign in to post a resource.");
            router.push("/login");
            return;
        }

        setIsSubmitting(true);
        try {
            await itemsApi.create(
                {
                    title: form.name,
                    description: form.description,
                    price: form.exchangeType === "sell" ? parseFloat(form.price) || 1 : 0.01,
                    currency: "EGP",
                    location: form.discipline,
                    imageUrls: form.previews.filter((p) => !p.startsWith("blob:")),
                    availableFrom: new Date().toISOString(),
                    availableTo: form.maxDuration
                        ? new Date(Date.now() + parseInt(form.maxDuration) * 86400000).toISOString()
                        : undefined,
                },
                authToken
            );

            toast.success("Resource posted successfully!");
            setStep(3);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to post resource.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepProps = { form, update, onNext: next, onBack: back };

    switch (step) {
        case 0:
            return <StepDetails {...stepProps} />;
        case 1:
            return <StepMedia {...stepProps} />;
        case 2:
            return (
                <StepTerms
                    {...stepProps}
                    onNext={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            );
        default:
            return <StepSuccess form={form} />;
    }
}
