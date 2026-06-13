"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { INITIAL_FORM_DATA, type PostFormData } from "./post-resource/types";
import StepDetails from "./post-resource/StepDetails";
import StepMedia from "./post-resource/StepMedia";
import StepTerms from "./post-resource/StepTerms";
import StepSuccess from "./post-resource/StepSuccess";
import { itemsApi } from "@/api/items-api";
import { useAuth, getAuthToken } from "@/hooks/useAuth";

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

    const getCategoryNameById = (id: string): string => {
        switch (id) {
            case "22222222-2222-2222-2222-222222222222":
                return "Textbooks & Course Materials";
            case "33333333-3333-3333-3333-333333333333":
                return "Lab & Science Supplies";
            case "44444444-4444-4444-4444-444444444444":
                return "Art & Design Supplies";
            case "55555555-5555-5555-5555-555555555555":
                return "Engineering & Tech Tools";
            case "66666666-6666-6666-6666-666666666666":
                return "Medical & Health Sciences";
            case "77777777-7777-7777-7777-777777777777":
                return "Electronics & Devices";
            case "88888888-8888-8888-8888-888888888888":
                return "Music & Performing Arts";
            case "99999999-9999-9999-9999-999999999999":
                return "Sports & Recreation";
            case "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa":
                return "Dorm & Living Essentials";
            default:
                return "Other";
        }
    };

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
            const categoryId = form.discipline;
            const categoryName = getCategoryNameById(categoryId);

            // 1. Create the item (created as Draft by default in backend)
            const item = await itemsApi.create(
                {
                    title: form.name,
                    description: form.description,
                    price: form.exchangeType === "sell" ? parseFloat(form.price) || 1 : 0.01,
                    currency: "EGP",
                    categoryId,
                    location: categoryName,
                    imageUrls: [], // Images uploaded dynamically next
                    availableFrom: new Date().toISOString(),
                    availableTo: form.maxDuration
                        ? new Date(Date.now() + parseInt(form.maxDuration) * 86400000).toISOString()
                        : new Date(Date.now() + 30 * 86400000).toISOString(),
                },
                authToken
            );

            // 2. Upload images sequentially if files exist
            if (form.files && form.files.length > 0) {
                const toastId = toast.loading(`Uploading images (0/${form.files.length})...`);
                try {
                    for (let i = 0; i < form.files.length; i++) {
                        const file = form.files[i];
                        toast.loading(`Uploading images (${i + 1}/${form.files.length})...`, { id: toastId });
                        await itemsApi.uploadImage(item.id, file, authToken);
                    }
                    toast.success("Images uploaded successfully!", { id: toastId });
                } catch (uploadErr) {
                    toast.error("Image upload failed. Publishing resource without images.", { id: toastId });
                    // console.error("Image upload error, continuing creation:", uploadErr);
                }
            }

            // 3. Publish the item by changing status to Available
            await itemsApi.update(
                item.id,
                {
                    title: form.name,
                    description: form.description,
                    price: form.exchangeType === "sell" ? parseFloat(form.price) || 1 : 0.01,
                    currency: "EGP",
                    categoryId,
                    status: "Available",
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
