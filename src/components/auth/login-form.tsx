"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

import { authApi } from "@/api/auth-api";
import { AUTH_ME_QUERY_KEY, setAuthToken } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/types/auth-schemas";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export function LoginForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("Auth");
  const locale = useLocale();
  const isAr = locale === "ar";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      contactMethod: "email",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const contactMethod = useWatch({ control, name: "contactMethod" });

  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = async (values: LoginInput) => {
    try {
      const response = await authApi.login({
        email:
          values.contactMethod === "email" ? values.email : values.phoneNumber,
        password: values.password,
      });

      if (!response.data?.token) {
        throw new Error("Login succeeded but token is missing.");
      }

      setAuthToken(response.data.token);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });

      toast.success(locale === "ar" ? "تم تسجيل الدخول بنجاح." : "Logged in successfully.", {
        duration: 2000,
      });

      router.push(redirectTo);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : locale === "ar"
          ? "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
          : "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white/90 border border-[#517565]/10 p-8 md:p-10 shadow-xl shadow-primary/5 backdrop-blur-md">
      <div className="flex flex-col gap-2 mb-8 text-start">
        <h1 className="text-3xl font-black leading-tight text-neutral-900">
          {t("loginTitle")}
        </h1>
        <p className="text-sm text-neutral-500 font-normal leading-relaxed">
          {t("loginDesc")}
        </p>
      </div>

      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Toggle Contact Method Tab */}
        <div className="grid grid-cols-2 rounded-xl border border-[#517565]/10 bg-[#517565]/5 p-1">
          <button
            className={`rounded-lg py-2 text-sm font-semibold transition cursor-pointer ${
              contactMethod === "email"
                ? "bg-white text-[#517565] shadow-sm"
                : "text-neutral-600 hover:text-neutral-800"
            }`}
            type="button"
            onClick={() =>
              setValue("contactMethod", "email", { shouldValidate: true })
            }
          >
            {t("viaEmail")}
          </button>
          <button
            className={`rounded-lg py-2 text-sm font-semibold transition cursor-pointer ${
              contactMethod === "phone"
                ? "bg-white text-[#517565] shadow-sm"
                : "text-neutral-600 hover:text-neutral-800"
            }`}
            type="button"
            onClick={() =>
              setValue("contactMethod", "phone", { shouldValidate: true })
            }
          >
            {t("viaPhone")}
          </button>
        </div>

        {contactMethod === "email" ? (
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
        ) : (
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
        )}

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

        <div className="text-end">
          <Link
            className="text-sm font-semibold text-[#517565] hover:underline"
            href="/forgot-password"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <button
          className="w-full cursor-pointer rounded-xl bg-[#517565] hover:bg-[#517565]/90 text-white h-12 text-base font-bold shadow-lg shadow-[#517565]/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 mt-2"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? t("loginLoading") : t("loginCta")}
        </button>

        <p className="text-center text-sm text-neutral-500 font-normal">
          {t("dontHaveAccount")}{" "}
          <Link
            className="font-bold text-[#517565] hover:underline"
            href="/register"
          >
            {t("signUp")}
          </Link>
        </p>
      </form>
    </div>
  );
}
