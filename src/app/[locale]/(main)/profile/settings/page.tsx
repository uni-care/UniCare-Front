"use client";

import { useLocale } from "next-intl";

export default function ProfileSettingsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">
          {isAr ? "الإعدادات" : "Settings"}
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          {isAr ? "تفضيلات الحساب والإشعارات." : "Manage your account preferences and notification settings."}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-6 text-center text-xs text-neutral-500">
        {isAr
          ? "إعدادات الحساب الإضافية ستكون متاحة قريبًا."
          : "Additional profile and security settings are coming soon."}
      </div>
    </div>
  );
}
