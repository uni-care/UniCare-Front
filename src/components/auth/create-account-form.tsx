"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { authApi } from "@/api/auth-api";
import { registerSchema, type RegisterInput } from "@/types/auth-schemas";
import { RegistrationMethod } from "@/types/auth";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export function CreateAccountForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("Auth");
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      contactMethod: "phone",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      acceptedPolicy: false,
    },
  });
  const role = useWatch({ control, name: "role" });
  const contactMethod = useWatch({ control, name: "contactMethod" });

  const onSubmit = async (values: RegisterInput) => {
    try {
      await authApi.register({
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        password: values.password,
        registrationMethod:
          values.contactMethod === "email"
            ? RegistrationMethod.Email
            : RegistrationMethod.Phone,
        email: values.contactMethod === "email" ? values.email : undefined,
        phoneNumber:
          values.contactMethod === "phone" ? values.phoneNumber : undefined,
      });
      toast.success(locale === "ar" ? "تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول." : "Account created successfully. You can now sign in.", {
        duration: 2000,
      });
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : locale === "ar"
          ? "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى."
          : "Failed to create account. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white/90 border border-[#517565]/10 p-8 md:p-10 shadow-xl shadow-primary/5 backdrop-blur-md">
      <div className="flex flex-col gap-2 mb-6 text-start">
        <h1 className="text-3xl font-black leading-tight text-neutral-900">
          {t("registerTitle")}
        </h1>
        <p className="text-sm text-neutral-500 font-normal leading-relaxed">
          {t("registerDesc")}
        </p>
      </div>

      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 rounded-xl border border-[#517565]/10 bg-[#517565]/5 p-1">
          <button
            className={`rounded-lg py-2 text-sm font-semibold transition cursor-pointer ${role === "student" ? "bg-white text-[#517565] shadow-sm" : "text-neutral-600 hover:text-neutral-800"}`}
            type="button"
            onClick={() =>
              setValue("role", "student", { shouldValidate: true })
            }
          >
            {t("student")}
          </button>
          <button
            className={`rounded-lg py-2 text-sm font-semibold transition cursor-pointer ${role === "alumni" ? "bg-white text-[#517565] shadow-sm" : "text-neutral-600 hover:text-neutral-800"}`}
            type="button"
            onClick={() => setValue("role", "alumni", { shouldValidate: true })}
          >
            {t("alumni")}
          </button>
        </div>

        {/* Contact Method Tabs */}
        <div className="grid grid-cols-2 border-b border-[#517565]/10 pb-1">
          <button
            className={`pb-2 text-sm cursor-pointer font-bold transition ${contactMethod === "email" ? "border-b-2 border-[#517565] text-[#517565]" : "text-neutral-500 hover:text-neutral-700"}`}
            type="button"
            onClick={() =>
              setValue("contactMethod", "email", { shouldValidate: true })
            }
          >
            {t("viaEmail")}
          </button>
          <button
            className={`pb-2 text-sm cursor-pointer font-bold transition ${contactMethod === "phone" ? "border-b-2 border-[#517565] text-[#517565]" : "text-neutral-500 hover:text-neutral-700"}`}
            type="button"
            onClick={() =>
              setValue("contactMethod", "phone", { shouldValidate: true })
            }
          >
            {t("viaPhone")}
          </button>
        </div>

        {/* Contact Input */}
        {contactMethod === "phone" ? (
          <div className="flex flex-col gap-1.5 text-start">
            <label
              className="text-xs font-bold uppercase tracking-wider text-neutral-600"
              htmlFor="phoneNumber"
            >
              {t("phoneLabel")}
            </label>
            <div className="flex rounded-xl border border-neutral-200 focus-within:border-[#517565] focus-within:ring-2 focus-within:ring-[#517565]/15 bg-white transition-all overflow-hidden">
              <div className="flex items-center gap-1.5 border-e border-neutral-200 px-4 text-sm text-neutral-600 bg-neutral-50/50 select-none">
                <span>🇪🇬</span>
                <span dir="ltr">+20</span>
              </div>
              <input
                className="w-full px-4 h-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none text-start"
                id="phoneNumber"
                inputMode="numeric"
                maxLength={10}
                placeholder={t("phonePlaceholder")}
                type="tel"
                {...register("phoneNumber", {
                  setValueAs: (value: string) =>
                    value.replace(/\D/g, "").slice(0, 10),
                })}
              />
            </div>
            {errors.phoneNumber ? (
              <p className="text-xs text-red-600 font-medium">
                {errors.phoneNumber.message}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 text-start">
            <label
              className="text-xs font-bold uppercase tracking-wider text-neutral-600"
              htmlFor="email"
            >
              {t("emailLabel")}
            </label>
            <div className="flex items-center rounded-xl border border-neutral-200 focus-within:border-[#517565] focus-within:ring-2 focus-within:ring-[#517565]/15 bg-white transition-all">
              <input
                className="w-full px-4 h-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none rounded-xl text-start"
                id="email"
                placeholder={t("emailPlaceholder")}
                type="email"
                {...register("email")}
              />
            </div>
            {errors.email ? (
              <p className="text-xs text-red-600 font-medium">
                {errors.email.message}
              </p>
            ) : null}
          </div>
        )}

        {/* First & Last Name fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 text-start">
            <label
              className="text-xs font-bold uppercase tracking-wider text-neutral-600"
              htmlFor="firstName"
            >
              {t("firstNameLabel")}
            </label>
            <div className="flex items-center rounded-xl border border-neutral-200 focus-within:border-[#517565] focus-within:ring-2 focus-within:ring-[#517565]/15 bg-white transition-all">
              <input
                className="w-full px-4 h-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none rounded-xl text-start"
                id="firstName"
                placeholder={t("firstNamePlaceholder")}
                type="text"
                {...register("firstName")}
              />
            </div>
            {errors.firstName ? (
              <p className="text-xs text-red-600 font-medium">
                {errors.firstName.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5 text-start">
            <label
              className="text-xs font-bold uppercase tracking-wider text-neutral-600"
              htmlFor="lastName"
            >
              {t("lastNameLabel")}
            </label>
            <div className="flex items-center rounded-xl border border-neutral-200 focus-within:border-[#517565] focus-within:ring-2 focus-within:ring-[#517565]/15 bg-white transition-all">
              <input
                className="w-full px-4 h-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none rounded-xl text-start"
                id="lastName"
                placeholder={t("lastNamePlaceholder")}
                type="text"
                {...register("lastName")}
              />
            </div>
            {errors.lastName ? (
              <p className="text-xs text-red-600 font-medium">
                {errors.lastName.message}
              </p>
            ) : null}
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 text-start">
          <label
            className="text-xs font-bold uppercase tracking-wider text-neutral-600"
            htmlFor="password"
          >
            {t("passwordLabel")}
          </label>
          <div className="flex items-center rounded-xl border border-neutral-200 focus-within:border-[#517565] focus-within:ring-2 focus-within:ring-[#517565]/15 bg-white transition-all pe-4">
            <input
              className="w-full px-4 h-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none rounded-xl text-start"
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="cursor-pointer text-neutral-500 hover:text-neutral-700 transition-colors flex items-center"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <IoEyeOutline className="text-lg" /> : <IoEyeOffOutline className="text-lg" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-red-600 font-medium">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5 text-start">
          <label
            className="text-xs font-bold uppercase tracking-wider text-neutral-600"
            htmlFor="confirmPassword"
          >
            {t("confirmPasswordLabel")}
          </label>
          <div className="flex items-center rounded-xl border border-neutral-200 focus-within:border-[#517565] focus-within:ring-2 focus-within:ring-[#517565]/15 bg-white transition-all">
            <input
              className="w-full px-4 h-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none rounded-xl text-start"
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword ? (
            <p className="text-xs text-red-600 font-medium">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        {/* Policy Checkbox */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-2.5 text-sm text-neutral-600 cursor-pointer select-none text-start">
            <input
              className="mt-1 rounded border-neutral-300 text-[#517565] focus:ring-[#517565] cursor-pointer"
              type="checkbox"
              {...register("acceptedPolicy")}
            />
            <span>
              {locale === "ar" ? (
                <>
                  أوافق على{" "}
                  <Link className="font-bold text-[#517565] hover:underline" href="/terms">الشروط والأحكام</Link>{" "}
                  و{" "}
                  <Link className="font-bold text-[#517565] hover:underline" href="/privacy">سياسة الخصوصية</Link>
                </>
              ) : (
                <>
                  I agree to the{" "}
                  <Link className="font-bold text-[#517565] hover:underline" href="/terms">Terms & Conditions</Link>{" "}
                  and{" "}
                  <Link className="font-bold text-[#517565] hover:underline" href="/privacy">Privacy Policy</Link>
                </>
              )}
            </span>
          </label>
          {errors.acceptedPolicy ? (
            <p className="text-xs text-red-600 font-medium text-start">
              {errors.acceptedPolicy.message}
            </p>
          ) : null}
        </div>

        {/* Submit */}
        <button
          className="w-full cursor-pointer rounded-xl bg-[#517565] hover:bg-[#517565]/90 text-white h-12 text-base font-bold shadow-lg shadow-[#517565]/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 mt-4"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? t("registerLoading") : t("registerCta")}
        </button>

        {/* Log In Link */}
        <p className="text-center text-sm text-neutral-500 font-normal mt-4">
          {t("alreadyHaveAccount")}{" "}
          <Link
            className="font-bold text-[#517565] hover:underline"
            href="/login"
          >
            {t("loginCta")}
          </Link>
        </p>
      </form>
    </div>
  );
}
