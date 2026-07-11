"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { INITIAL_FORM_DATA, type PostFormData } from "./post-resource/types";
import StepDetails from "./post-resource/StepDetails";
import StepMedia from "./post-resource/StepMedia";
import StepTerms from "./post-resource/StepTerms";
import StepSuccess from "./post-resource/StepSuccess";
import { itemsApi } from "@/api/items-api";
import { useAuth, getAuthToken } from "@/hooks/useAuth";
import AuthRequiredModal from "@/components/auth/auth-required-modal";
import { useTranslations, useLocale } from "next-intl";

export default function PostResourceWizard() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<PostFormData>(INITIAL_FORM_DATA);
    const [createdItemId, setCreatedItemId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const t = useTranslations("AuthRequired");
    const locale = useLocale();
    const isAr = locale === "ar";

    if (isLoading) {
        return (
            <div className="bg-background-light min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-neutral-500 font-bold text-lg">
                    {isAr ? "جاري التحقق من الجلسة..." : "Verifying session..."}
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-background-light min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4 text-center">
                <AuthRequiredModal
                    isOpen={true}
                    onClose={() => router.push("/marketplace")}
                    title={t("postTitle")}
                    description={t("postDesc")}
                    redirectTo="/post"
                />
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-neutral-500 font-medium">
                    {isAr ? "يرجى تسجيل الدخول للمتابعة..." : "Please sign in to continue..."}
                </p>
            </div>
        );
    }

    const update = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const next = () => setStep((s) => s + 1);
    const back = () => setStep((s) => s - 1);

    const getCategoryNameById = (id: string): string => {
        switch (id) {
            case "22222222-2222-2222-2222-222222222222":
                return isAr ? "الكتب الدراسية والمناهج" : "Textbooks & Course Materials";
            case "33333333-3333-3333-3333-333333333333":
                return isAr ? "أدوات المختبرات والعلوم" : "Lab & Science Supplies";
            case "44444444-4444-4444-4444-444444444444":
                return isAr ? "أدوات الفنون والتصميم" : "Art & Design Supplies";
            case "55555555-5555-5555-5555-555555555555":
                return isAr ? "أدوات الهندسة والتكنولوجيا" : "Engineering & Tech Tools";
            case "66666666-6666-6666-6666-666666666666":
                return isAr ? "العلوم الطبية والصحية" : "Medical & Health Sciences";
            case "77777777-7777-7777-7777-777777777777":
                return isAr ? "الأجهزة الإلكترونية" : "Electronics & Devices";
            case "88888888-8888-8888-8888-888888888888":
                return isAr ? "الموسيقى والفنون الاستعراضية" : "Music & Performing Arts";
            case "99999999-9999-9999-9999-999999999999":
                return isAr ? "الرياضة والأنشطة الترفيهية" : "Sports & Recreation";
            case "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa":
                return isAr ? "مستلزمات السكن والمعيشة" : "Dorm & Living Essentials";
            default:
                return isAr ? "أخرى" : "Other";
        }
    };

    /** Submit the item to the backend */
    const handleSubmit = async () => {
        const authToken = getAuthToken();
        if (!authToken) {
            toast.error(isAr ? "يرجى تسجيل الدخول لنشر مورد." : "Please sign in to post a resource.");
            router.push("/login");
            return;
        }

        setIsSubmitting(true);
        try {
            const categoryId = form.discipline;
            const categoryName = getCategoryNameById(categoryId);
            const isLend = form.exchangeType === "lend";

            const availableFrom = isLend ? new Date().toISOString() : undefined;
            const availableTo = isLend
                ? (form.maxDuration
                    ? new Date(Date.now() + parseInt(form.maxDuration) * 86400000).toISOString()
                    : new Date(Date.now() + 30 * 86400000).toISOString())
                : undefined;

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
                    availableFrom,
                    availableTo,
                },
                authToken
            );
            setCreatedItemId(item.id);

            // 2. Upload images sequentially if files exist
            const uploadedImageUrls: string[] = [];
            if (form.files && form.files.length > 0) {
                const toastId = toast.loading(isAr ? `جاري رفع الصور (0/${form.files.length})...` : `Uploading images (0/${form.files.length})...`);
                try {
                    for (let i = 0; i < form.files.length; i++) {
                        const file = form.files[i];
                        toast.loading(isAr ? `جاري رفع الصور (${i + 1}/${form.files.length})...` : `Uploading images (${i + 1}/${form.files.length})...`, { id: toastId });
                        const uploadRes = await itemsApi.uploadImage(item.id, file, authToken);
                        uploadedImageUrls.push(uploadRes.url);
                    }
                    toast.success(isAr ? "تم رفع الصور بنجاح!" : "Images uploaded successfully!", { id: toastId });
                } catch (uploadErr) {
                    toast.error(isAr ? "فشل رفع الصور. يتم النشر بدون صور." : "Image upload failed. Publishing resource without images.", { id: toastId });
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
                    location: categoryName,
                    imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
                    availableFrom,
                    availableTo,
                },
                authToken
            );

            toast.success(isAr ? "تم نشر المورد بنجاح!" : "Resource posted successfully!");
            setStep(3);
        } catch (error) {
            const message = error instanceof Error ? error.message : (isAr ? "فشل نشر المورد." : "Failed to post resource.");
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
            return <StepSuccess form={form} categoryName={getCategoryNameById(form.discipline)} itemId={createdItemId} />;
    }
}
